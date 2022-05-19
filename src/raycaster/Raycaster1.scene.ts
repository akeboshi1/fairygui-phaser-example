import { PhaserRaycaster } from 'phaser-raycaster';
export class Raycaster1Scene extends Phaser.Scene {
    private ray;
    private raycaster: PhaserRaycaster;
    private graphics: Phaser.GameObjects.Graphics;
    private container: Phaser.GameObjects.Container;
    private intersections;
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
            ignoreNotIntersectedRays: false
        });

        //create obstacles and add them to container
        this.container = this.add.container(400, 300);
        this.createObstacles(this);

        //map container
        this.raycaster.mapGameObjects(this.container, true);

        //cast ray in all directions
        this.intersections = this.ray.castCircle();
        //draw rays
        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        this.draw();

        //set ray position on mouse move
        this.input.on('pointermove', function (pointer) {
            //set ray position
            this.ray.setOrigin(pointer.x, pointer.y);
        },this);
    }

    update() {
        //rotate container
        this.container.rotation += 0.01
        //cast ray in all directions
        this.intersections = this.ray.castCircle();
        //redraw
        this.draw();
    }

    //create obstacles and add them to container
    createObstacles(scene) {
        let obstacle = scene.add.rectangle(-100, -100, 50, 50)
            .setStrokeStyle(1, 0xff0000);
        this.container.add(obstacle);

        obstacle = scene.add.rectangle(100, -100, 50, 50)
            .setStrokeStyle(1, 0xff0000);
        this.container.add(obstacle);

        obstacle = scene.add.rectangle(100, 100, 50, 50)
            .setStrokeStyle(1, 0xff0000);
        this.container.add(obstacle);

        obstacle = scene.add.rectangle(-100, 100, 50, 50)
            .setStrokeStyle(1, 0xff0000);
        this.container.add(obstacle);

        obstacle = scene.add.rectangle(0, 0, 50, 50)
            .setStrokeStyle(1, 0xff0000);
        this.container.add(obstacle);
    }

    //draw rays intersections
    draw() {
        this.graphics.clear();
        this.graphics.fillStyle(0xffffff, 0.3);
        this.graphics.fillPoints(this.intersections);
        for (let intersection of this.intersections) {
            // @ts-ignore
            this.graphics.strokeLineShape({
                x1: this.ray.origin.x,
                y1: this.ray.origin.y,
                x2: intersection.x,
                y2: intersection.y
            });
        }
        this.graphics.fillStyle(0xff00ff);
        this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3);
    }
}
