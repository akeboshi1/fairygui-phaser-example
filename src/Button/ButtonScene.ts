import { GComponent, GRoot, UIConfig, UIPackage } from "fairygui-phaser";
import { DPR } from "../main";

export class ButtonScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        UIConfig.verticalScrollBar = "ui://Basics/ScrollBar_VT";
        UIConfig.horizontalScrollBar = "ui://Basics/ScrollBar_HZ";
        UIConfig.popupMenu = "ui://Basics/PopupMenu";
        UIConfig.buttonSound = "ui://Basics/sound";
        this.load.image("Basics_atlas0.png", "assets/Basics_atlas0.png");
        this.load.binary("Basics", "assets/Basics.fui");
        this.load.script("webfont", "assets/webfont/webfont.js");
    }

    create(data) {
        const dpr = DPR;
        const width = window.screen.width;
        const height = window.screen.height;


        const camera = this.cameras.main;
        // const dpr = this.render.devicePixelRatio;
        const zoom = 1 / dpr;
        // camera.setZoom(zoom);
        // const width = camera.width;
        // const height = camera.height;
        //this.game.scale.zoom = zoom;
        // this.game.scale.resize(camera.width, camera.height);
        // this.cameras.main.setZoom(1 / dpr);
        // this.cameras.main.setScroll(width * 1 / dpr, height * 1 / dpr);
        // const con = this.add.container(0, 0);
        // con.setSize(width, height);
        // con.setInteractive();
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr:1, width, height, designWidth: 360, desginHeight: 640
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);
            // ============ MainMenu
            UIPackage.createObject("Basics", "CommonBackground").then((obj) => {
                this._view = obj.asCom;
                this._view.setSize(width, height);
                this._view.setScale(dpr,dpr);
                // this._view.x = 100;
                // this._view.y = 100;
                GRoot.inst.addChild(this._view);

                // this._view.getChild("n1").onClick(function () {
                //     console.log("n1===>");
                // }, this);
                // this._view.getChild("n2").onClick(function () {
                //     console.log("n2===>");
                // }, this);
                // this._view.getChild("n4").onClick(function () {
                //     console.log("n4===>");
                // }, this);
                // this._view.getChild("n5").onClick(function () {
                //     console.log("n5===>");
                // }, this);
                // this._view.getChild("n6").onClick(function () {
                //     console.log("n6===>");
                // }, this);
                // this._view.getChild("n7").onClick(function () {
                //     console.log("n7===>");
                // }, this);
                // this._view.getChild("n8").onClick(function () {
                //     console.log("n8===>");
                // }, this);
                // this._view.getChild("n9").onClick(function () {
                //     console.log("n9===>");
                // }, this);
                // this._view.getChild("n10").onClick(function () {
                //     console.log("n10===>");
                // }, this);
                // this._view.getChild("n11").onClick(function () {
                //     console.log("n11===>");
                // }, this);
                // this._view.getChild("n12").onClick(function () {
                //     console.log("n12===>");
                // }, this);
                // this._view.getChild("n13").onClick(function () {
                //     console.log("n13===>");
                // }, this);
                // this._view.getChild("n14").onClick(function () {
                //     console.log("n14===>");
                // }, this);
                // this._view.getChild("n15").onClick(function () {
                //     console.log("n15===>");
                // }, this);
                // this._view.getChild("n16").onClick(function () {
                //     console.log("n16===>");
                // }, this);
            });
        });

    }
}
