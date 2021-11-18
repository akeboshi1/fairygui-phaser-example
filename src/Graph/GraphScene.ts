import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class GraphScene extends Phaser.Scene {
    private _view: GComponent;

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
        this.load.image("start", "assets/star0.jpg");
    }

    create(data) {

        const img = this.add.image(400, 100, 'start');
        img.setScale(.2, .2);
        // img.skewX = (30 * Math.PI) / 180;
        // this.tweens.add({
        //     targets: img,
        //     skewX: Math.PI / 2,
        //     duration: 1000,
        //     yoyo: true,
        //     repeat: -1
        // });
        const width = 1000;
        const height = 1000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);
        con.skewX = (30 * Math.PI) / 180;
        con.setInteractive();
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============= Basics
            // progressBar
            UIPackage.createObject("Basics", "Demo_Graph").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);
                con.add(img);
            });
        });

    }
}