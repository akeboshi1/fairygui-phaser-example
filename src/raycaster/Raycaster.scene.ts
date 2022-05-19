import { PhaserRaycaster } from 'phaser-raycaster';
export class RaycasterScene extends Phaser.Scene {
    private ray;
    private raycaster: PhaserRaycaster;
    private graphics: Phaser.GameObjects.Graphics;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.scenePlugin(
            'PhaserRaycaster',
            "../../assets/phaser-raycaster.js",
            'raycasterPlugin'
        );
        this.load.image("snow", "assets/snow_(1).png");
    }

    create() {
        //create raycaster
        // @ts-ignore
        this.raycaster = this.PhaserRaycaster.createRaycaster(
            {
                debug: {
                    enabled: false, //enable debug mode
                    maps: true, //enable maps debug
                    rays: true, //enable rays debug
                    graphics: {
                        ray: 0x00ff00, //debug ray color; set false to disable
                        rayPoint: 0xff00ff, //debug ray point color; set false to disable
                        mapPoint: 0x00ffff, //debug map point color; set false to disable
                        mapSegment: 0x0000ff, //debug map segment color; set false to disable
                        mapBoundingBox: 0xff0000 //debug map bounding box color; set false to disable
                    }
                }
            }
        );

        //create ray
        this.ray = this.raycaster.createRay({
            origin: {
                x: 400,
                y: 300
            },
            ignoreNotIntersectedRays:false
        });

        const img = this.add.image(500, 100, "snow");
        // img.setScale(0.3,0.3);

        // const rectangle = this.add.rectangle(200, 100, 200, 100)
        // .setStrokeStyle(1, 0xff0000);

        //map rectangle
        this.raycaster.mapGameObjects(img);

        //cast ray
        let intersection = this.ray.cast();

        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
        let line = new Phaser.Geom.Line(this.ray.origin.x, this.ray.origin.y, intersection.x, intersection.y);
        this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3)
        this.graphics.strokeLineShape(line);
    }

    update() {
        //rotate ray
        this.ray.setAngle(this.ray.angle + 0.01);
        
        //cast ray
        let intersection = this.ray.cast();
        if(!intersection)return;
        console.log(intersection.x,intersection.y);
        //draw ray
        this.graphics.clear();
        let line = new Phaser.Geom.Line(this.ray.origin.x, this.ray.origin.y, intersection.x, intersection.y);
        this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3)
        this.graphics.strokeLineShape(line);
    }
}