import { PopupMenu, GGraph, GButton, ObjectType, DragDropManager, GProgressBar, GList, Utils, Window, GComponent, GRoot, UIPackage, GObject, Controller } from "fairygui-phaser";
import { WindowA, WindowB } from "./TestWin";

export class BasicsScene extends Phaser.Scene {
    /**
     * demo主场景
     */
    private _view: GComponent;
    /**
     * 选中的当前场景
     */
    private _curView: GComponent;
    private _backBtn: GObject;
    private _demoContainer: GComponent;
    private _cc: Controller;
    private _demoObjects: any;

    private _timeDelta: number = 5;
    private _progressTimeEvent: any;
    private _progressTime: Phaser.Time.TimerEvent;

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
    }

    create(data) {
        const width = 1000;
        const height = 1000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);
        // con.skewX = (30 * Math.PI) / 180;
        con.setInteractive();
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============= Basics
            UIPackage.createObject("Basics", "Main").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);

                this._backBtn = this._view.getChild("btn_Back");
                this._backBtn.visible = false;
                this._backBtn.onClick(this.onClickBack, this);

                this._demoContainer = this._view.getChild("container").asCom;
                this._cc = this._view.getController("c1");

                var cnt: number = this._view.numChildren;
                for (var i: number = 0; i < cnt; i++) {
                    var obj: GObject = this._view.getChildAt(i);
                    if (obj.group != null && obj.group.name == "btns")
                        obj.onClick(this.runDemo, this);
                }

                this._demoObjects = {};
            });
        });
    }

    private onClickBack(evt: Event): void {
        this._cc.selectedIndex = 0;
        this._backBtn.visible = false;
    }

    private runDemo(pointer: Phaser.Input.Pointer, gameObject: any): void {
        const owner = gameObject["$owner"];
        var type: string = owner.name.substr(4);
        var obj: GComponent = this._demoObjects[type];
        // if (obj == null) {
        UIPackage.createObject("Basics", "Demo_" + type).then((obj) => {
            this._curView = obj.asCom;
            this._demoObjects[type] = this._curView;
            this._demoContainer.removeChildren();
            this._demoContainer.addChild(this._curView);
            this._cc.selectedIndex = 1;
            this._backBtn.visible = true;

            switch (type) {
                case "Button":
                    this.playButton();
                    break;

                case "Text":
                    this.playText();
                    break;

                case "Window":
                    this.playWindow();
                    break;

                case "Popup":
                    this.playPopup();
                    break;

                case "Drag&Drop":
                    this.playDragDrop();
                    break;

                case "Depth":
                    this.playDepth();
                    break;

                case "Grid":
                    this.playGrid();
                    break;

                case "ProgressBar":
                    if (!this._progressTimeEvent) this._progressTimeEvent = { delay: this._timeDelta, callback: this.__playProgress, callbackScope: this, loop: true };
                    this.playProgressBar();
                    break;
                case "Panel":
                    this._curView.setXY(100, 100);
                    break;
            }
        });
        // }
    }

    //------------------------------
    private playButton(): void {
        var obj: GComponent = this._demoObjects["Button"];
        obj.getChild("n13").onClick(this.__clickButton, this);
    }

    private __clickButton(): void {
        console.log("click button");
    }

    //------------------------------
    private playText(): void {
        var obj: GComponent = this._demoObjects["Text"];
        // obj.getChild("n12").on(Laya.Event.LINK, this, this.__clickLink);

        obj.getChild("n25").onClick(this.__clickGetInput, this);
    }

    private __clickLink(link: string): void {
        var obj: GComponent = this._demoObjects["Text"];
        obj.getChild("n12").text = "[img]ui://9leh0eyft9fj5f[/img][color=#FF0000]你点击了链接[/color]：" + link;
    }

    private __clickGetInput(): void {
        var obj: GComponent = this._demoObjects["Text"];
        obj.getChild("n24").text = obj.getChild("n22").text;
    }

    //------------------------------
    private _winA: Window;
    private _winB: Window;
    private playWindow(): void {
        var obj: GComponent = this._demoObjects["Window"];
        obj.getChild("n0").onClick(this.__clickWindowA, this);
        obj.getChild("n1").onClick(this.__clickWindowB, this);
    }

    private __clickWindowA(): void {
        if (this._winA == null)
            this._winA = new WindowA();
        this._winA.show();
    }

    private __clickWindowB(): void {
        if (this._winB == null)
            this._winB = new WindowB();
        this._winB.show();
    }

    //------------------------------
    private _pm: PopupMenu;
    private _popupCom: GComponent;
    private playPopup(): void {
        const fun = () => {
            var obj: GComponent = this._demoObjects["Popup"];
            var btn: GObject = obj.getChild("n0");
            btn.onClick(this.__clickPopup1, this);

            var btn2: GObject = obj.getChild("n1");
            btn2.onClick(this.__clickPopup2, this);
        }
        if (this._pm == null) {
            this._pm = new PopupMenu();
            this._pm.addItem("Item 1");
            this._pm.addItem("Item 2");
            this._pm.addItem("Item 3");
            this._pm.addItem("Item 4");

            if (this._popupCom == null) {
                UIPackage.createObject("Basics", "Component12").then((obj) => {
                    this._popupCom = obj.asCom;
                    this._popupCom.center();
                    fun();
                });
            } else {
                fun();
            }
        } else {
            fun();
        }

    }

    private __clickPopup1(pointer: Phaser.Input.Pointer, gameObject: any): void {
        const obj = gameObject["$owner"];
        var btn: GObject = obj;
        this._pm.show(btn, true);
    }

    private __clickPopup2(): void {
        GRoot.inst.showPopup(this._popupCom);
    }

    //------------------------------
    private playDragDrop(): void {
        var obj: GComponent = this._demoObjects["Drag&Drop"];
        var btnA: GObject = obj.getChild("a");
        btnA.draggable = true;

        var btnB: GButton = obj.getChild("b").asButton;
        btnB.draggable = true;
        btnB.on(Phaser.Input.Events.DRAG_START, this.__onDragStart, this);

        var btnC: GButton = obj.getChild("c").asButton;
        btnC.icon = null;
        btnC.on(Phaser.Input.Events.DROP, this.__onDrop, this);

        var btnD: GObject = obj.getChild("d");
        btnD.draggable = true;
        var bounds: GObject = obj.getChild("bounds");
        var rect: Phaser.Geom.Rectangle = bounds.localToGlobalRect(0, 0, bounds.width, bounds.height);
        rect = GRoot.inst.globalToLocalRect(rect.x, rect.y, rect.width, rect.height, rect);

        //因为这时候面板还在从右往左动，所以rect不准确，需要用相对位置算出最终停下来的范围
        rect.x -= obj.parent.x;

        btnD.dragBounds = rect;
    }

    private __onDragStart(pointer: Phaser.Input.Pointer, gameObject: any): void {
        const obj = gameObject["$owner"];
        var btn: GButton = obj;
        btn.stopDrag();//取消对原目标的拖动，换成一个替代品
        DragDropManager.inst.startDrag(btn, btn.icon, btn.icon);
    }

    private __onDrop(pointer: Phaser.Input.Pointer, gameObject: any): void {
        const obj = gameObject["$owner"];
        var btn: GButton = obj;
        // btn.icon = data;
    }

    //------------------------------
    private startPos: Phaser.Geom.Point = new Phaser.Geom.Point();
    private playDepth(): void {
        var obj: GComponent = this._demoObjects["Depth"];
        var testContainer: GComponent = obj.getChild("n22").asCom;
        var fixedObj: GObject = testContainer.getChild("n0");
        fixedObj.sortingOrder = 100;
        fixedObj.draggable = true;

        var numChildren: number = testContainer.numChildren;
        var i: number = 0;
        while (i < numChildren) {
            var child: GObject = testContainer.getChildAt(i);
            if (child != fixedObj) {
                testContainer.removeChildAt(i);
                numChildren--;
            }
            else
                i++;
        }
        this.startPos.x = fixedObj.x;
        this.startPos.y = fixedObj.y;

        obj.getChild("btn0").onClick(this.__click1, this);
        obj.getChild("btn1").onClick(this.__click2, this);
    }

    private __click1() {
        var graph: GGraph = new GGraph(this, ObjectType.Graph);
        this.startPos.x += 10;
        this.startPos.y += 10;
        graph.setXY(this.startPos.x, this.startPos.y);
        graph.setSize(150, 150);
        graph.drawRect(1, "#000000", "#FF0000");

        var obj: GComponent = this._demoObjects["Depth"];
        obj.getChild("n22").asCom.addChild(graph);
    }

    private __click2() {
        var graph: GGraph = new GGraph(this, ObjectType.Graph);
        this.startPos.x += 10;
        this.startPos.y += 10;
        graph.setXY(this.startPos.x, this.startPos.y);
        graph.setSize(150, 150);
        graph.drawRect(1, "#000000", "#00FF00");
        graph.sortingOrder = 200;

        var obj: GComponent = this._demoObjects["Depth"];
        obj.getChild("n22").asCom.addChild(graph);
    }

    //------------------------------
    private playGrid(): void {
        var obj: GComponent = this._demoObjects["Grid"];
        var list1: GList = obj.getChild("list1").asList;
        list1.removeChildrenToPool();
        var testNames: Array<string> = ["苹果手机操作系统", "安卓手机操作系统", "微软手机操作系统", "微软桌面操作系统", "苹果桌面操作系统", "未知操作系统"];
        var testColors: Array<number> = [0xFFFF00, 0xFF0000, 0xFFFFFF, 0x0000FF];
        var cnt: number = testNames.length;

        const fun = (i: number) => {
            if (i >= cnt) return;
            list1.addItemFromPool().then((obj) => {
                var item: GButton = obj.asButton;
                item.getChild("t0").text = "" + (i + 1);
                item.getChild("t1").text = testNames[i];
                item.getChild("t2").asTextField.color = Utils.toHexColor(testColors[Math.floor(Math.random() * 4)]);
                item.getChild("star").asProgress.value = (Math.floor(Math.random() * 3) + 1) / 3 * 100;
                fun(++i);
            });
        }
        fun(0);


        // for (var i: number = 0; i < cnt; i++) {
        //     var item: GButton = list1.addItemFromPool().asButton;
        //     item.getChild("t0").text = "" + (i + 1);
        //     item.getChild("t1").text = testNames[i];
        //     item.getChild("t2").asTextField.color = Utils.toHexColor(testColors[Math.floor(Math.random() * 4)]);
        //     item.getChild("star").asProgress.value = (Math.floor(Math.random() * 3) + 1) / 3 * 100;
        // }

        var list2: GList = obj.getChild("list2").asList;
        list2.removeChildrenToPool();
        const fun1 = (i: number) => {
            if (i >= cnt) return;
            list2.addItemFromPool().then((obj) => {
                var item: GButton = obj.asButton;
                item.getChild("cb").asButton.selected = false;
                item.getChild("t1").text = testNames[i];
                item.getChild("mc").asMovieClip.playing = i % 2 == 0;
                item.getChild("t3").text = "" + Math.floor(Math.random() * 10000)
            });
            fun1(++i);
        }
        fun1(0);
        // for (var i: number = 0; i < cnt; i++) {
        //     var item: GButton = list2.addItemFromPool().asButton;
        //     item.getChild("cb").asButton.selected = false;
        //     item.getChild("t1").text = testNames[i];
        //     item.getChild("mc").asMovieClip.playing = i % 2 == 0;
        //     item.getChild("t3").text = "" + Math.floor(Math.random() * 10000)
        // }
    }

    //---------------------------------------------
    private playProgressBar(): void {
        this.__removeTimer();
        if (!this._progressTime) this._progressTime = this.time.addEvent(this._progressTimeEvent);
        // obj.on(Event.UNDISPLAY, this.__removeTimer, this);
    }

    private __removeTimer(): void {
        // timer.clear(this, this.__playProgress);
        if (this._progressTime) {
            this._progressTime.remove(false);
            this._progressTime = null;
            //console.log("remove tweenupdate");
        }
    }

    private __playProgress(): void {
        if (!this._curView) return;
        var obj: GComponent = this._curView;
        var cnt: number = obj.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            // if (i != 3 && i != 0) continue;
            var child: GProgressBar = obj.getChildAt(i) as GProgressBar;
            if (child != null) {
                child.value += 1;
                if (child.value > child.max)
                    child.value = 0;
            }
        }
    }
}