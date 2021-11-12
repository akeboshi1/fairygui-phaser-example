import { GButton, GComponent, GList, GObject, GRoot, Handler, UIPackage } from "fairygui-phaser";

export class ScrollScene extends Phaser.Scene {
    private _view: GComponent;
    // private _bagWindow: BagWindow;
    private _list: GList;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("scrollPane", "assets/ScrollPane.fui");
    }

    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 2000, designHeight: 2000
        });
        UIPackage.loadPackage("scrollPane").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ scroll
            UIPackage.createObject("ScrollPane", "Main").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);

                this._list = this._view.getChild("list").asList;
                this._list.itemRenderer = Handler.create(this, this.renderListItem, null, false);
                this._list.setVirtual();
                this._list.numItems = 10;
                this._list.on("pointerdown", this.onClickList, this);
            });
        });

    }

    private renderListItem(index: number, item: GButton) {
        item.title = "Item " + index;
        item.scrollPane.posX = 0; //reset scroll pos

        item.getChild("b0").onClick(this.onClickStick, this);
        item.getChild("b1").onClick(this.onClickDelete, this);
    }

    private onClickList(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) {
        //点击列表时，查找是否有项目处于编辑状态， 如果有就归位
        let touchTarget = <GObject>gameObject["$owner"];//GObject.cast(evt.target);
        let cnt = this._list.numChildren;
        for (let i: number = 0; i < cnt; i++) {
            let item: GButton = this._list.getChildAt(i).asButton;
            if (item.scrollPane.posX != 0) {
                //Check if clicked on the button
                if (item.getChild("b0").asButton.isAncestorOf(touchTarget)
                    || item.getChild("b1").asButton.isAncestorOf(touchTarget)) {
                    return;
                }
                item.scrollPane.setPosX(0, true);

                //取消滚动面板可能发生的拉动。
                item.scrollPane.cancelDragging();
                this._list.scrollPane.cancelDragging();
                break;
            }
        }
    }

    private onClickStick() {
        this._view.getChild("txt").text = "Stick "; // + fgui.GObject.cast(evt.currentTarget).parent.text;
    }

    private onClickDelete() {
        this._view.getChild("txt").text = "Delete "; // + fgui.GObject.cast(evt.currentTarget).parent.text;
    }

}