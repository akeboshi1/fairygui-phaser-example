
import { GLoader, GRoot, UIPackage, GObject, GComponent } from "fairygui-phaser";

export class LoaderScene extends Phaser.Scene {
    private _loader: GLoader;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Loader", "assets/Loader.fui");
        this.load.image("star", "assets/star0.jpg");
        this.load.binary("7login", "assets/7login.fui");
    }

    create() {
        const width = Number(this.game.config.width);
        const height = Number(this.game.config.height);
        const dpr = window.devicePixelRatio;
        const pixelWid = width / dpr;
        const pixelHei = height / dpr;
        const designWidth = 360;
        const designHeight = 640;
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr, width, height, designWidth, designHeight
        });
        UIPackage.loadPackage("7login").then((pkg) => {
            console.log(pkg);
            UIPackage.createObject("7login", "test").then((obj) => {
                const main = obj.asCom;


                // main.externalSetScale(GRoot.dpr, GRoot.dpr, 0, true);
                main.makeFullScreen();
                // // const view = main.getChild("view") as GComponent;
                // this._loader = main.getChild("loader") as GLoader;
                // const txt = main.getChild("text") as GRichTextField;
                // // txt.setScale(dpr, dpr);
                // txt.text = "中文 测试";
                // this._loader.url = "assets/star0.jpg";//"ui://ec9yscuhthi7j";//"assets/star0.jpg";
                // main.setXY(100,100);
                GRoot.inst.addChild(main);
                // const clsBtn: GObject = main.getChild("n32") as GObject;
                // clsBtn.onClick(this.closeEventHandler, this);
            });
        });
    }

    private closeEventHandler() {
        console.log("click close");
    }
}
