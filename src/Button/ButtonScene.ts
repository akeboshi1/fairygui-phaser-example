import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class ButtonScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("MainMenu", "assets/MainMenu.fui");
    }

    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 2000, designHeight: 2000
        });
        UIPackage.loadPackage("MainMenu").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);
            // ============ MainMenu
            UIPackage.createObject("MainMenu", "Main").then((obj) => {
                this._view = obj.asCom;
                this._view.x = 100;
                this._view.y = 100;
                GRoot.inst.addChild(this._view);

                this._view.getChild("n1").onClick(function () {
                    console.log("n1===>");
                }, this);
                this._view.getChild("n2").onClick(function () {
                    console.log("n2===>");
                }, this);
                this._view.getChild("n4").onClick(function () {
                    console.log("n4===>");
                }, this);
                this._view.getChild("n5").onClick(function () {
                    console.log("n5===>");
                }, this);
                this._view.getChild("n6").onClick(function () {
                    console.log("n6===>");
                }, this);
                this._view.getChild("n7").onClick(function () {
                    console.log("n7===>");
                }, this);
                this._view.getChild("n8").onClick(function () {
                    console.log("n8===>");
                }, this);
                this._view.getChild("n9").onClick(function () {
                    console.log("n9===>");
                }, this);
                this._view.getChild("n10").onClick(function () {
                    console.log("n10===>");
                }, this);
                this._view.getChild("n11").onClick(function () {
                    console.log("n11===>");
                }, this);
                this._view.getChild("n12").onClick(function () {
                    console.log("n12===>");
                }, this);
                this._view.getChild("n13").onClick(function () {
                    console.log("n13===>");
                }, this);
                this._view.getChild("n14").onClick(function () {
                    console.log("n14===>");
                }, this);
                this._view.getChild("n15").onClick(function () {
                    console.log("n15===>");
                }, this);
                this._view.getChild("n16").onClick(function () {
                    console.log("n16===>");
                }, this);
            });
        });

    }
}
