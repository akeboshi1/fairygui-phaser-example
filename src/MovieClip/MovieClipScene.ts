import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class MovieClipScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Bag", "assets/Bag.fui");
    }

    addImage(key, file) {
        // this.add.image(400, 300, key);
    }

    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 2000, designHeight: 2000
        });
        UIPackage.loadPackage("Bag").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ Bag
            UIPackage.createObject("Bag", "Main").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);
                this._view.getChild("bagBtn");
                // this._bagWindow = new BagWindow();
                // this._view.getChild("bagBtn").onClick(() => {
                //     this._bagWindow.show()
                // }, this);
            });
        });

    }
}