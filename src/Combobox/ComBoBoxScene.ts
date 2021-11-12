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
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 2000, designHeight: 2000
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