import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class ComBoBoxScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
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
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);
            // ============= Basic
            // combobox
            UIPackage.createObject("Basics", "Demo_ComboBox").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);
            });
        });

    }
}