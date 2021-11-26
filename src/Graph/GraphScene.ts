import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class GraphScene extends Phaser.Scene {
    private _view: GComponent;

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Graph", "assets/Graph.fui");
    }

    create(data) {
        const width = 1000;
        const height = 1000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);
        // con.skewX = (30 * Math.PI) / 180;
        con.setInteractive();
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
        });
        UIPackage.loadPackage("Graph").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============= Basics
            // progressBar
            UIPackage.createObject("Graph", "Main").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);
                // con.add(img);
            });
        });

    }
}