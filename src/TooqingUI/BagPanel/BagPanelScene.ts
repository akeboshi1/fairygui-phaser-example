import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class BagPanelScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basic", "assets/Basic.fui");
    }

    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 800, designHeight: 640
        });
        UIPackage.loadPackage("Basic").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ tooqing ui test
            UIPackage.createObject("Basic", "Bag").then((obj) => {
                this._view = obj.asCom;
                this._view.setXY(200, 640 - this._view.height >> 1);
                GRoot.inst.addChild(this._view);
            });
        });

    }
}