import { GLoader, GRoot, UIPackage, GRichTextField, GComponent } from "fairygui-phaser";

export class LoaderScene extends Phaser.Scene {
    private _loader: GLoader;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Loader", "assets/Loader.fui");
        this.load.image("star", "assets/star0.jpg");
    }

    create() {
        const width = Number(this.game.config.width);
        const height = Number(this.game.config.height);
        const dpr = window.devicePixelRatio;
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr, width, height, designWidth: 802, designHeight: 500
        });
        UIPackage.loadPackage("Loader").then((pkg) => {
            console.log(pkg);
            UIPackage.createObject("Loader", "loadView").then((obj) => {
                const main = obj.asCom;
                main.externalSetSize(width, height);
                main.externalSetScale(dpr, dpr, 0);
                const view = main.getChild("view") as GComponent;
                this._loader = view.getChild("loader") as GLoader;
                const txt = view.getChild("text") as GRichTextField;
                txt.setScale(dpr, dpr);
                txt.text = "中文 测试";
                // this._loader.url = "assets/star0.jpg";//"ui://ec9yscuhthi7j";//"assets/star0.jpg";
                GRoot.inst.addChild(main);
            });
        });
    }
}
