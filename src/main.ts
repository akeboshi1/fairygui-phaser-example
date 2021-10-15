import { GRoot, UIPackage, Handler, GButton, GComponent, GList, GObject, InteractiveEvent } from "fairygui-phaser";
import "phaser3";
// import dat from "./dat.gui";
class MyScene extends Phaser.Scene {
    private _view: GComponent;
    private _list: GList;
    private _btn0;
    private _btn1;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("scrollPane", "assets/ScrollPane.fui");
        // this.load.binary("Package1", "assets/Package1.fui");
        // this.load.binary("Bag", "assets/Bag.fui");
        // this.load.binary("Chat", "assets/Chat.fui");
        this.load.binary("MainMenu", "assets/MainMenu.fui");
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
        UIPackage.loadPackage("scrollPane").then((pkg) => {
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
            UIPackage.createObject("ScrollPane", "Main").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);

                this._list = this._view.getChild("list").asList;
                this._list.itemRenderer = Handler.create(this, this.renderListItem, null, false);
                this._list.setVirtual();
                this._list.numItems = 20;
                this._list.on("pointerdown", this.onClickList, this);
            });
        });

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