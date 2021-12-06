import { GComponent, GRoot, Image, UIPackage } from "fairygui-phaser";
export class GrayScaleScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
        this.load.image("start", "assets/star0.jpg");
    }

    create(data) {
        const width = 2000;
        const height = 2000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);
        // con.skewX = (30 * Math.PI) / 180;
        // const img = this.add.image(700, 500, 'start');
        // img.setScale(.2, .2);
        // img.skewX = (30 * Math.PI) / 180;
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);
            // ============= Basic
            // combobox
            UIPackage.createObject("Basics", "Demo_Image").then((obj) => {
                this._view = obj.asCom;
                const img = this._view.getChild("n8");
                img.setScale(-1,1);
                this._view.setXY(0,0);
                GRoot.inst.addChild(this._view);
                // con.addAt(img, 0);
            });
        });

    }
}