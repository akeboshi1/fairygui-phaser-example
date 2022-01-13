import { Image } from 'fairygui-phaser';
import { GRoot, UIPackage } from 'fairygui-phaser';
export class TextScene extends Phaser.Scene {
    private context;
    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
        this.load.image("start", "assets/star0.jpg");
        this.load.image("webp", "assets/gif-0.webp");
    }

    create(data) {
        this.add.image(100, 100, "webp");
        return;
        const width = 1000;
        const height = 1000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);

        // con.skewX = (30 * Math.PI) / 180;
        con.setInteractive();
        // const canvas = document.createElement('canvas');
        // this.context = canvas.getContext('2d');
        // this.context.beginPath();
        // this.context.arc(100, 75, 50, 0, 2 * Math.PI);
        // this.context.stroke();

        // const start = this.scene.systems.textures.get("start");
        // const frame = start.get("__BASE");
        // this.context.drawImage(frame.source.image,0,0,frame.cutWidth,frame.cutHeight);
        // const t = this.textures.addCanvas('circle', canvas);
        // const circleImage = this.add.image(150, 200, 'circle');
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ tooqing ui test
            UIPackage.createObject("Basics", "Demo_TextDemo").then((obj) => {
                const _view = obj.asCom;
                //_view.setXY(200, 640 - _view.height >> 1);
                GRoot.inst.addChild(_view);
                const img = _view.getChild("n26");
                const start = this.scene.systems.textures.get("start");
                const frame = start.get("__BASE");
                const canvas = document.createElement('canvas');
                this.context = canvas.getContext('2d');
                this.context.beginPath();
                this.context.arc(100, 75, 50, 0, 2 * Math.PI);
                this.context.stroke();
                //if(this.context)this.context.drawImage(frame.source.image, 0, 0, frame.cutWidth, frame.cutHeight);
            });
        });
    }

    update(time: number, delta: number): void {
        this.cameras.main.setBackgroundColor('#000000')
    }
}