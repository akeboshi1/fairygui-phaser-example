import { GRoot, UIPackage } from "fairygui-phaser";

export class ImageScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Package1", "assets/Package1.fui");
    }

    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 2000, designHeight: 2000
        });
        UIPackage.loadPackage("Package1").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ image
            UIPackage.createObject("Package1", "Main").then((obj) => {
                const view = obj.asCom;
                GRoot.inst.addChild(view);
            });
        });

    }
}