import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class MovieClipScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
    }

    addImage(key, file) {
        // this.add.image(400, 300, key);
    }

    create(data) {
        const width = 800;
        const height = 600;
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: Math.round(window.devicePixelRatio)
            , width, height, desginWidth: 800, desginHeight: 600
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ Bag
            UIPackage.createObject("Basics", "Demo_MovieClip").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);
                // this._view.getChild("bagBtn");
                // this._bagWindow = new BagWindow();
                // this._view.getChild("bagBtn").onClick(() => {
                //     this._bagWindow.show()
                // }, this);
            });
        });

    }
}