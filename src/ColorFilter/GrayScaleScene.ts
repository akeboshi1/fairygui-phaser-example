import { GComponent, GRoot, UIPackage } from "fairygui-phaser";

export class GrayScaleScene extends Phaser.Scene {
    private _view: GComponent;
    constructor(config) {
        super(config);
    }

    preload() {
        // this.load.script("Gray", "../assets/GrayScale.js");
        this.load.binary("Basics", "assets/Basics.fui");
        this.load.image("star", "assets/star0.jpg");
    }

    create(data) {
        const grayscalePipeline = (<Phaser.Renderer.WebGL.WebGLRenderer>this.renderer).pipelines.get("Gray");
        const width = 2000;
        const height = 2000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);

        const star = this.add.sprite(400, 300, 'star').setPipeline(grayscalePipeline);
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
            UIPackage.createObject("Basics", "Demo_Image").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);
                const obj1 = <Phaser.GameObjects.Container>this._view.getChild("n7").displayObject;
                obj1.setPipeline(grayscalePipeline);


                this.tweens.add({
                    targets: grayscalePipeline,
                    delay: 2000,
                    repeatDelay: 2000,
                    gray: 0,
                    yoyo: true,
                    repeat: -1
                });
            });
        });

    }
}