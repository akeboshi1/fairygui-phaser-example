import { GLoader, GRoot, UIPackage } from "fairygui-phaser";

export class LoaderScene extends Phaser.Scene {
    private _loader: GLoader;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Loader", "assets/Loader.fui");
        this.load.image("star","assets/star0.jpg");
    }

    create() {
        const width = this.game.config.width;
        const height = this.game.config.height;
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height, designWidth: 800, designHeight: 640
        });
        UIPackage.loadPackage("Loader").then((pkg) => {
            console.log(pkg);
            UIPackage.createObject("Loader", "loaderView").then((obj) => {
                const main = obj.asCom;
                this._loader = main.getChild("loader") as GLoader;
                this._loader.url = "ui://ec9yscuhthi7j";//"assets/star0.jpg";
                GRoot.inst.addChild(main);
            });
        });
    }
}
