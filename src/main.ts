import { Controller, GProgressBar, GTree, GTreeNode } from "fairygui-phaser";
import { GTextInput, UBBParser, Handler, GRoot, UIPackage, Window, GButton, GComponent, GList, GObject, InteractiveEvent, GRichTextField } from "fairygui-phaser";
import "phaser3";
import { Events } from "phaser3";
class Message {
    public sender: string;
    public senderIcon: string;
    public msg: string;
    public fromMe: boolean;
}
export default class EmojiParser extends UBBParser {
    private static TAGS: Array<string> = ["88", "am", "bs", "bz", "ch", "cool", "dhq", "dn", "fd", "gz", "han", "hx", "hxiao", "hxiu"];

    public constructor() {
        super();

        EmojiParser.TAGS.forEach(element => {
            this._handlers[":" + element] = this.onTag_Emoji;
        });
    }

    private onTag_Emoji(tagName: string, end: boolean, attr: string): string {
        return "<img src='" + UIPackage.getItemURL("Chat", tagName.substring(1).toLowerCase()) + "'/>";
    }
}
class MyScene extends Phaser.Scene {
    private _view: GComponent;
    private _bagWindow: BagWindow;
    private _list: GList;
    private _btn0;
    private _btn1;
    private _input: GTextInput;
    private _emojiSelectUI: GComponent;
    private _emojiParser: EmojiParser;
    private _messages: Array<Message>;
    private _tree1: GTree;
    private _tree2: GTree;
    private _fileURL: string;

    private _backBtn: GObject;
    private _demoContainer: GComponent;
    private _cc: Controller;

    private _timeDelta: number = 5;
    private _progressTimeEvent: any;
    private _progressTime: Phaser.Time.TimerEvent;

    private _demoObjects: any;
    constructor(config) {
        super(config);
    }

    preload() {
        // this.load.binary("Chat", "assets/Chat.fui");
        // this.load.binary("TreeView", "assets/TreeView.fui");
        // this.load.binary("scrollPane", "assets/ScrollPane.fui");
        // this.load.binary("Package1", "assets/Package1.fui");
        //this.load.binary("Bag", "assets/Bag.fui");
        this.load.binary("Basics", "assets/Basics.fui");
        // this.load.binary("Chat", "assets/Chat.fui");
        // this.load.binary("MainMenu", "assets/MainMenu.fui");
        // const resList = [
        //     "https://osd-alpha.tooqing.com/a0826f9a84f54006aeb6ab08d92fcb63.png",
        //     "https://osd-alpha.tooqing.com/309a26191b3d5ebd46dca66b7bb31147.png",
        //     "https://osd-alpha.tooqing.com/1a9611fbaf28aa61c3b3cdf74ddd67df.png",
        //     "https://osd-alpha.tooqing.com/ace85415422359631c305ac1309214ca.png",
        //     "https://osd-alpha.tooqing.com/a0826f9a84f54006aeb6ab08d92fcb63.png",
        //     "https://osd-alpha.tooqing.com/309a26191b3d5ebd46dca66b7bb31147.png",
        //     "https://osd-alpha.tooqing.com/pixelpai/ElementNode/5f61f045b50d314618a21a4d/3/5f61f045b50d314618a21a4d.png",
        //     "https://osd-alpha.tooqing.com/pixelpai/ElementNode/5f61f045b50d314618a21a4d/3/5f61f045b50d314618a21a4d.json",
        //     "https://osd-alpha.tooqing.com/pixelpai/ElementNode/5fdc6dae78badd6eeba72e25/2/5fdc6dae78badd6eeba72e25.png"];
        // const now = new Date().getTime();
        // console.log("load-time", now);
        // for (let i = 0; i < resList.length; i++) {
        //     // const str = "star" + i + ".jpg";
        //     this.load.image('test' + i, resList[i]);
        // }
        this.load.image('star', 'assets/star0.jpg');
        this.load.on('filecomplete-image-star', this.addImage, this);
        // console.log("finish-time", new Date().getTime() - now);
    }

    addImage(key, file) {
        // this.add.image(400, 300, key);
    }

    create(data) {
        // this.input.on("pointerdown", () => {
        //     const ns: any = require("./test");
        //     new ns["Test"]();
        // }, this);
        // setInterval(() => {
        //     const ns: any = require("./test");
        //     console.log("require ts")
        //     //new ns["Test"]();

        // }, 50);
        // return;
        const now = new Date().getTime();
        console.log("init-time", now);
        // this.add.image(0, 0, 'test1');
        // this.add.image(1, 1, 'test0');
        // this.add.image(2, 2, 'test2');
        // this.add.image(3, 3, 'test3');
        for (let i = 0; i < 30000; i++) {
            // this.add.image(i, i, 'test' + 1);
        }
        // for (let i = 0; i < 30; i++) {
        //     this.add.image(i, i, `test${i}`);
        // }
        console.log("finish-time", new Date().getTime() - now);

        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 2000, designHeight: 2000
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ image
            // UIPackage.createObject("Package1", "Main").then((obj) => {
            //     const view = obj.asCom;
            //     GRoot.inst.addChild(view);
            // });
            // ============ MainMenu
            // UIPackage.createObject("MainMenu", "Main").then((obj) => {
            //     this._view = obj.asCom;
            //     GRoot.inst.addChild(this._view);
            // });
            // ============ scroll
            // UIPackage.createObject("ScrollPane", "Main").then((obj) => {
            //     this._view = obj.asCom;
            //     GRoot.inst.addChild(this._view);

            //     this._list = this._view.getChild("list").asList;
            //     this._list.itemRenderer = Handler.create(this, this.renderListItem, null, false);
            //     this._list.setVirtual();
            //     this._list.numItems = 10;
            //     this._list.on("pointerdown", this.onClickList, this);
            // });

            // ============ TreeNode
            // UIPackage.createObject("TreeView", "Main").then((obj) => {
            //     this._view = obj.asCom;
            //     GRoot.inst.addChild(this._view);

            //     this._fileURL = "ui://TreeView/file";

            //     this._tree1 = this._view.getChild("tree").asTree;
            //     this._tree1.on("pointerdown", this.__clickNode, this);
            //     this._tree2 = this._view.getChild("tree2").asTree;
            //     this._tree2.on("pointerdown", this.__clickNode, this);
            //     this._tree2.treeNodeRender = Handler.create(this, this.renderTreeNode, null, false);

            //     var topNode: GTreeNode = new GTreeNode(true);
            //     topNode.data = "I'm a top node";
            //     this._tree2.rootNode.addChild(topNode);
            //     for (var i: number = 0; i < 5; i++) {
            //         var node: GTreeNode = new GTreeNode(false);
            //         node.data = "Hello " + i;
            //         topNode.addChild(node);
            //     }

            //     var aFolderNode: GTreeNode = new GTreeNode(true);
            //     aFolderNode.data = "A folder node";
            //     topNode.addChild(aFolderNode);
            //     for (var i: number = 0; i < 5; i++) {
            //         var node: GTreeNode = new GTreeNode(false);
            //         node.data = "Good " + i;
            //         aFolderNode.addChild(node);
            //     }

            //     for (var i: number = 0; i < 3; i++) {
            //         var node: GTreeNode = new GTreeNode(false);
            //         node.data = "World " + i;
            //         topNode.addChild(node);
            //     }

            //     var anotherTopNode: GTreeNode = new GTreeNode(false);
            //     anotherTopNode.data = ["I'm a top node too", "ui://TreeView/heart"];
            //     this._tree2.rootNode.addChild(anotherTopNode);
            // });

            // ============ Bag
            // UIPackage.createObject("Bag", "Main").then((obj) => {
            //     this._view = obj.asCom;
            //     GRoot.inst.addChild(this._view);
            //     this._view.getChild("bagBtn");
            //     this._bagWindow = new BagWindow();
            //     this._view.getChild("bagBtn").onClick(() => {
            //         this._bagWindow.show()
            //     }, this);
            // });

            // ============= Basic
            UIPackage.createObject("Basics", "Demo_ProgressBar").then((obj) => {

                if (!this._progressTimeEvent) this._progressTimeEvent = { delay: this._timeDelta, callback: this.__playProgress, callbackScope: this, loop: true };
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);

                this.playProgressBar();
            });

            // ============= chat
            // UIPackage.createObject("Chat", "Main").then((obj) => {
            //     this._view = obj.asCom;
            //     GRoot.inst.addChild(this._view);
            //     this._messages = new Array<Message>();
            //     this._emojiParser = new EmojiParser();

            //     this._list = this._view.getChild("list").asList;
            //     this._list.setVirtual();
            //     this._list.itemProvider = Handler.create(this, this.getListItemResource, null, false);
            //     this._list.itemRenderer = Handler.create(this, this.renderListItem, null, false);

            //     this._input = this._view.getChild("input1").asTextInput;
            //     this._input.nativeInput.on("enter", this.onSubmit, this);

            //     this._view.getChild("btnSend1").onClick(this.onClickSendBtn, this);
            //     this._view.getChild("btnEmoji1").onClick(this.onClickEmojiBtn, this);

            //     UIPackage.createObject("Chat", "EmojiSelectUI").then((obj)=>{
            //         this._emojiSelectUI = obj.asCom;
            //         this._emojiSelectUI.getChild("list").on("pointerup", this.onClickEmoji, this);
            //     });

            // });
        });

    }

    // =============================== progressBar

    private playProgressBar(): void {
        // var obj: GComponent = this._demoObjects["ProgressBar"];
        if (!this._progressTime) this._progressTime = this.time.addEvent(this._progressTimeEvent);
        // Laya.timer.frameLoop(2, this, this.__playProgress);
        // obj.on(Laya.Event.UNDISPLAY, this.__removeTimer, this);
    }

    private __removeTimer(): void {
        // Laya.timer.clear(this, this.__playProgress);
        if (this._progressTime) {
            this._progressTime.remove(false);
            this._progressTime = null;
            //console.log("remove tweenupdate");
        }
    }

    private __playProgress(): void {
        var obj: GComponent = this._view;
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



    // ===============================

    private onClickBack(evt: Event): void {
        this._cc.selectedIndex = 0;
        this._backBtn.visible = false;
    }

    private renderTreeNode(node: GTreeNode, obj: GComponent) {
        if (node.isFolder) {
            obj.text = node.data;
        }
        else if (node.data instanceof Array) {
            obj.icon = (<any>node.data)[1];
            obj.text = (<any>node.data)[0];
        }
        else {
            obj.icon = this._fileURL;
            obj.text = node.data;
        }
    }

    private __clickNode(pointer: Phaser.Input.Pointer, itemObject: GObject) {
        if (!itemObject) return;
        var node: GTreeNode = itemObject["$owner"].treeNode;
        console.log(node.text);
    }

    private addMsg(sender: string, senderIcon: string, msg: string, fromMe: boolean) {
        let isScrollBottom: boolean = this._list.scrollPane.isBottomMost;

        let newMessage = new Message();
        newMessage.sender = sender;
        newMessage.senderIcon = senderIcon;
        newMessage.msg = msg;
        newMessage.fromMe = fromMe;
        this._messages.push(newMessage);

        if (newMessage.fromMe) {
            if (this._messages.length == 1 || Math.random() < 0.5) {
                let replyMessage = new Message();
                replyMessage.sender = "FairyGUI";
                replyMessage.senderIcon = "r1";
                replyMessage.msg = "Today is a good day. ";
                replyMessage.fromMe = false;
                this._messages.push(replyMessage);
            }
        }

        if (this._messages.length > 100)
            this._messages.splice(0, this._messages.length - 100);

        this._list.numItems = this._messages.length;

        if (isScrollBottom)
            this._list.scrollPane.scrollBottom();
    }

    private getListItemResource(index: number): string {
        let msg = this._messages[index];
        if (msg.fromMe)
            return "ui://Chat/chatRight";
        else
            return "ui://Chat/chatLeft";
    }

    // private renderListItem(index: number, item: GButton): void {
    //     let msg = this._messages[index];
    //     if (!msg.fromMe)
    //         item.getChild("name").text = msg.sender;
    //     item.icon = UIPackage.getItemURL("Chat", msg.senderIcon);

    //     var txtObj: GRichTextField = item.getChild("msg").asRichTextField;
    //     txtObj.width = txtObj.initWidth;
    //     txtObj.text = this._emojiParser.parse(msg.msg);
    //     if (txtObj.textWidth < txtObj.width)
    //         txtObj.width = txtObj.textWidth;
    // }

    private onClickSendBtn() {
        let msg = this._input.text;
        if (!msg)
            return;

        this.addMsg("Creator", "r0", msg, true);
        this._input.text = "";
    }

    private onClickEmojiBtn() {
        const btn = this._view.getChild("btnEmoji1");
        GRoot.inst.showPopup(this._emojiSelectUI, GObject.cast(btn.displayObject), false);
    }

    private onClickEmoji(item: GObject) {
        this._input.text += "[:" + item.text + "]";
    }

    private onSubmit() {
        this.onClickSendBtn();
    }

    private renderListItem(index: number, item: GButton) {
        item.title = "Item " + index;
        // item.scrollPane.posX = 0; //reset scroll pos

        this._btn0 = item.getChild("b0");
        this._btn1 = item.getChild("b1");
        this._btn0.onClick(this.onClickStick, this);
        this._btn1.onClick(this.onClickDelete, this);
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

    private onClickStick(evt: InteractiveEvent) {
        this._view.getChild("txt").text = "Stick "; //+ GObject.cast(this._btn0).parent.text;
    }

    private onClickDelete(evt: InteractiveEvent) {
        this._view.getChild("txt").text = "Delete "; //+ GObject.cast(this._btn1).parent.text;
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 2000,
    height: 2000,
    scale: {
        mode: Phaser.Scale.NONE,
        // zoom: 1 / 10,
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
};


class BagWindow extends Window {
    public constructor() {
        super();
    }

    protected onInit(): void {
        UIPackage.createObject("Bag", "Main").then((obj) => {
            this.contentPane = obj.asCom;
            this.center();
        });
    }

    protected onShown(): void {
        var list: GList = this.contentPane.getChild("list").asList;
        list.on("pointerdown", this.onClickItem, this);
        list.itemRenderer = Handler.create(this, this.renderListItem, null, false);
        list.setVirtual();
        list.numItems = 45;
    }

    private renderListItem(index: number, obj: GObject): void {
        obj.icon = "res/icons/i" + Math.floor(Math.random() * 10) + ".png";
        obj.text = "" + Math.floor(Math.random() * 100);
    }

    private onClickItem(item: GObject): void {
        this.contentPane.getChild("n11").asLoader.url = item.icon;
        this.contentPane.getChild("n13").text = item.icon;
    }
}

var game = new Phaser.Game(config);

game.scene.add('myScene', MyScene, true, { x: 0, y: 0 });

// var config = {
//     type: Phaser.WEBGL,
//     width: 800,
//     height: 600,
//     backgroundColor: '#000000',
//     parent: 'phaser-example',
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };

// var gui = null;
// var emitter = null;
// var move = false;
// var countText = null;
// var angleConfig = {
//     min: 0, max: 360
// };
// var speedConfig = {
//     min: 0, max: 200
// };
// var scaleConfig = {
//     start: 1, end: 0, ease: 'Linear'
// };
// var alphaConfig = {
//     start: 1, end: 0, ease: 'Linear'
// };
// var eases = [
//     'Linear',
//     'Quad.easeIn',
//     'Cubic.easeIn',
//     'Quart.easeIn',
//     'Quint.easeIn',
//     'Sine.easeIn',
//     'Expo.easeIn',
//     'Circ.easeIn',
//     'Back.easeIn',
//     'Bounce.easeIn',
//     'Quad.easeOut',
//     'Cubic.easeOut',
//     'Quart.easeOut',
//     'Quint.easeOut',
//     'Sine.easeOut',
//     'Expo.easeOut',
//     'Circ.easeOut',
//     'Back.easeOut',
//     'Bounce.easeOut',
//     'Quad.easeInOut',
//     'Cubic.easeInOut',
//     'Quart.easeInOut',
//     'Quint.easeInOut',
//     'Sine.easeInOut',
//     'Expo.easeInOut',
//     'Circ.easeInOut',
//     'Back.easeInOut',
//     'Bounce.easeInOut'
// ].sort();
// var blendModes = {
//     NORMAL: Phaser.BlendModes.NORMAL,
//     ADD: Phaser.BlendModes.ADD,
//     MULTIPLY: Phaser.BlendModes.MULTIPLY,
//     SCREEN: Phaser.BlendModes.SCREEN
// };
// var game = new Phaser.Game(config);

// function preload() {
//     this.load.image('spark0', 'assets/particles/blue.png');
//     this.load.image('spark1', 'assets/particles/red.png');
// }

// function create() {
//     const cols = 5;
//     const rows = 5;
//     const tmpIndex = [0, 3, 10, 13];
//     let len = tmpIndex.length;
//     const blockIndex = [];
//     const tmpList = [];
//     for (let i = 0; i < len; i++) {
//         const a = tmpIndex[i];
//         for (let j = len - 1; j >= i; j--) {
//             const b = tmpIndex[j];
//             if (a === b) continue;
//             const tmp = (b - a);
//             // console.log("first", a, b, tmp);
//             // 如果取余能取0/或者两点之间的差小于排数，则表示两点相邻，反之则表示对角
//             if (tmp % rows === 0 || tmp < rows) {
//                 // console.log("second", a, b, tmp);
//                 // 如果两点除以rows整数相同，则表示在同一行，反之则表示在不同行，需要做列数计算
//                 if (Math.floor(a / rows) === Math.floor(b / rows)) {
//                     // console.log("third", tmp, b);
//                     for (let k = 0; k <= tmp; k++) {
//                         // 同一行则直接加索引即可
//                         blockIndex.push(a + k);
//                     }
//                 }
//                 else {
//                     const count = tmp / rows;
//                     for (let k = 1; k < count; k++) {
//                         tmpList.push(a + rows * k);
//                     }
//                     console.log("forth", tmpList);
//                 }
//             }
//         }
//     }
//     len = tmpList.length;
//     for (let l = 0; l < len; l++) {
//         const tmpA = tmpList[l];
//         for (let j = len - 1; j >= l; j--) {
//             const tmpB = tmpList[j];
//             if (tmpA === tmpB) continue;
//             const tmp = tmpB - tmpA;
//             if (Math.floor(tmpA / rows) === Math.floor(tmpB / rows)) {
//                 for (let k = 0; k <= tmp; k++) {
//                     // 同一行则直接加索引即可
//                     blockIndex.push(tmpA + k);
//                 }
//             }
//         }
//     }
//     blockIndex.sort();
//     console.log(blockIndex);
//     // if (typeof dat === 'undefined') {
//     //     this.add.text(16, 16, 'Please [Launch] this example.');
//     //     return;
//     // }

//     // gui = new dat.GUI();
//     // emitter = this.add.particles('spark1').createEmitter({
//     //     name: 'sparks',
//     //     x: 400,
//     //     y: 300,
//     //     gravityY: 300,
//     //     speed: speedConfig,
//     //     angle: angleConfig,
//     //     scale: scaleConfig,
//     //     alpha: alphaConfig,
//     //     blendMode: 'SCREEN'
//     // });

//     // gui.add(emitter, 'name');
//     // gui.add(emitter, 'on');
//     // gui.add(emitter, 'blendMode', blendModes).name('blend mode').onChange(function (val) { emitter.setBlendMode(Number(val)); });
//     // gui.add(angleConfig, 'min', 0, 360, 5).name('angle min').onChange(function () { emitter.setAngle(angleConfig); });
//     // gui.add(angleConfig, 'max', 0, 360, 5).name('angle max').onChange(function () { emitter.setAngle(angleConfig); });
//     // gui.add({ life: 1000 }, 'life', 100, 5000, 100).onChange(function (value) { emitter.setLifespan(value); });
//     // gui.add({ gravityX: 0 }, 'gravityX', -300, 300, 10).onChange(function (value) { emitter.setGravityX(value); });
//     // gui.add({ gravityY: 300 }, 'gravityY', -300, 300, 10).onChange(function (value) { emitter.setGravityY(value); });
//     // gui.add(speedConfig, 'min', 0, 600, 10).name('speed min').onChange(function () { emitter.setSpeed(speedConfig); });
//     // gui.add(speedConfig, 'max', 0, 600, 10).name('speed max').onChange(function () { emitter.setSpeed(speedConfig); });
//     // gui.add(scaleConfig, 'start', 0, 1, 0.1).name('scale start').onChange(function () { emitter.setScale(scaleConfig); });
//     // gui.add(scaleConfig, 'end', 0, 1, 0.1).name('scale end').onChange(function () { emitter.setScale(scaleConfig); });
//     // gui.add(scaleConfig, 'ease', eases).name('scale ease').onChange(function () { emitter.setScale(scaleConfig); });
//     // gui.add(alphaConfig, 'start', 0, 1, 0.1).name('alpha start').onChange(function () { emitter.setAlpha(alphaConfig); });
//     // gui.add(alphaConfig, 'end', 0, 1, 0.1).name('alpha end').onChange(function () { emitter.setAlpha(alphaConfig); });
//     // gui.add(alphaConfig, 'ease', eases).name('alpha ease').onChange(function () { emitter.setAlpha(alphaConfig); });
//     // gui.add(emitter, 'killAll');
//     // gui.add(emitter, 'pause');
//     // gui.add(emitter, 'resume');
//     // gui.add({ save: saveEmitter.bind(this) }, 'save').name('save JSON');

//     // this.input.on('pointermove', function (pointer) {
//     //     if (move) {
//     //         emitter.setPosition(pointer.x, pointer.y);
//     //     }
//     // });

//     // this.input.on('pointerdown', function (pointer) {
//     //     emitter.setPosition(pointer.x, pointer.y);
//     //     move = true;
//     // });
//     // this.input.on('pointerup', function (pointer) {
//     //     move = false;
//     // });

//     // countText = this.add.text(0, 0, 'Alive Particles');
// }

// function update() {
//     if (!countText) { return; }

//     countText.setText('Alive Particles: ' + emitter.getAliveParticleCount());
// }

// function saveEmitter() {
//     this.load.saveJSON(emitter.toJSON(), emitter.name + '.json');
// }