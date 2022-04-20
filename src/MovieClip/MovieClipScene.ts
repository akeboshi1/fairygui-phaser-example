import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class MovieClipScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        // this.load.binary("Basics", "assets/Basics.fui");
        // this.load.image("Package1_atlas0.png", "assets/Package1_atlas0.png");
        this.load.binary("Package1", "assets/Package1.fui");
    }

    addImage(key, file) {
        // this.add.image(400, 300, key);
    }

    create(data) {
        const width = 800;
        const height = 600;
        const con = this.add.container(0, 0);
        this.sys.displayList.add(con);
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: Math.round(window.devicePixelRatio)
            , width, height, desginWidth: 800, desginHeight: 600
        });
        UIPackage.loadPackage("Package1").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ Bag
            UIPackage.createObject("Package1", "Component1").then((obj) => {
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