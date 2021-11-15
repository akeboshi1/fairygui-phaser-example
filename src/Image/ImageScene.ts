import { GRoot, UIPackage } from "fairygui-phaser";

export class ImageScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Package1", "assets/Package1.fui");
    }

    create(data) {
        const width = 2000;
        const height = 2000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);
        con.setInteractive();
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
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