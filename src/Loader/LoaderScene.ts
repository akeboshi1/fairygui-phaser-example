
import { GLoader, GRoot, UIPackage, GObject, GComponent, GList, GProgressBar, GButton } from "fairygui-phaser";

export class LoaderScene extends Phaser.Scene {
    private _loader: GLoader;
    private _list: GList;
    private _drawCalls: number = 0;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Loader", "assets/Loader.fui");
        this.load.image("star", "assets/star0.jpg");
        this.load.image("snow", "assets/snow_(10).png");
        this.load.binary("7login", "assets/7login.fui");
        this.load.image("Basics_atlas0.png", "assets/Basics_atlas0.png");
        this.load.binary("Basics", "assets/Basics.fui");
        this.load.image("001", "assets/001.jpg");
        this.load.image("毛峰", "assets/毛峰.jpg");
        this.load.image("毛峰1", "assets/毛峰1.jpg");
        this.load.image("毛峰2", "assets/毛峰2.jpg");
        this.load.image("code", "assets/code.jpeg");
        this.load.image("space", "assets/space.jpeg");
        this.load.image("space1", "assets/space1.jpg");
        this.load.image("space2", "assets/space2.jpeg");
        this.load.image("wow", "assets/wow.jpg");
        this.load.image("yld", "assets/yld.png");
    }

    init() {
        let renderer = this.sys.renderer
        if (renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
            this.game.events.on(Phaser.Core.Events.POST_STEP, this.resetDrawCalls, this)
            let gl = WebGLRenderingContext.prototype;
            //@ts-ignore
            gl.updateDrawCallsNum = this.incrementDrawCalls.bind(this);
            //@ts-ignore
            gl.realDrawArrays = WebGLRenderingContext.prototype.drawArrays;
            gl.drawArrays = function (mode: GLenum, first: GLint, count: GLsizei) {
                this.updateDrawCallsNum()
                this.realDrawArrays(mode, first, count)
            }
        }
    }

    private resetDrawCalls() {
        console.log(this._drawCalls);
        this._drawCalls = 0;

    }

    private incrementDrawCalls() {
        this._drawCalls++;
    }

    create() {

        //for (let i = 0; i < 100; i++) {
        const img = this.add.image(500, 100, "star");
        const img1 = this.add.image(500, 100, "snow");
        const img2 = this.add.image(500, 100, "Basics_atlas0.png");
        const img3 = this.add.image(500, 100, "001");
        const img4 = this.add.image(500, 100, "wow");
        const img5 = this.add.image(500, 100, "yld");
        const img6 = this.add.image(500, 100, "毛峰");
        const img7 = this.add.image(500, 100, "毛峰1");
        const img8 = this.add.image(500, 100, "毛峰2");
        const img9 = this.add.image(500, 100, "space");
        const img10 = this.add.image(500, 100, "space1");
        const img11 = this.add.image(500, 100, "space2");
        //}

        return;
        const width = Number(this.game.config.width);
        const height = Number(this.game.config.height);
        const dpr = window.devicePixelRatio;
        const pixelWid = width / dpr;
        const pixelHei = height / dpr;
        const designWidth = 360;
        const designHeight = 640;
        // const img = this.add.image(0,0,"star");
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr, width, height, designWidth, designHeight
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            console.log(pkg);
            UIPackage.createObject("Basics", "Panel").then((obj) => {
                const main = obj.asCom;
                main.makeFullScreen();

                GRoot.inst.addChild(main);

                // const bar:GProgressBar = (<GComponent>main.getChild("n8")).asProgress;
                // bar.tweenValue(100, 2);
                // this._list = (<GComponent>main.getChild("n35")).asList;

                // // glist的渲染方法
                // this._list.itemRenderer = Handler.create(this, this.renderListPanelItem, null, false);

                // const clsBtn: GObject = main.getChild("n36") as GObject;
                // clsBtn.onClick(this.closeEventHandler, this);
            });
        });
    }

    // update(time: number, delta: number): void {
    //     console.log(this._drawCalls);
    //     this._drawCalls = 0;
    // }

    private renderListPanelItem(index: number, item: GButton) {
        item.title = "Item" + index;
        item.onClick(this.onClickListPanel, this);
    }
    private onClickListPanel(pointer: Phaser.Input.Pointer, item: Phaser.GameObjects.Container) {
        console.log("__click");
    }



    private closeEventHandler() {
        this._list.setVirtual().then(() => {
            this._list.numItems = 12;
        });
        console.log("click close");
    }
}
