
import * as THREE from "../three.min";
import "./OrbitControls.js";
import {Phaser3D} from './Phaser3D.js';
export class LoaderScene extends Phaser.Scene {
    private phaser3d: Phaser3D;
    private redThreeBall;
    private blueThreeBall;
    private redBall;
    private blueBall;
    private gameOptions = {
        gameScale: 0.1,
        ballRadius: 25
    }
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.image("redball", "assets/redball.png");
        this.load.image("blueball", "assets/blueball.png");
    }

    create() {

        this.phaser3d = new Phaser3D(this, {
            fov: 45,
            near: 1,
            far: 1000,
            x: 0,
            y: 95,
            z: 0
        });

        this.phaser3d.camera.lookAt(0, 10, 20);

        this.phaser3d.enableShadows();
        this.phaser3d.enableGamma();

        this.phaser3d.add.ambientLight({
            color: 0xffffff,
            intensity: 0.1
        });

        new THREE.OrbitControls(this.phaser3d.camera, this.scale.parent);

        let spotlight = this.phaser3d.add.spotLight({
            intensity: 0.5,
            angle: 0.4,
            decay: 0.1,
            distance: 250,
            x: 0,
            y: 220,
            z: 0
        });

        this.addThreeBound(10, Number(this.game.config.height) + 20, Number(this.game.config.width) / 2 + 5, 0);
        this.addThreeBound(10, Number(this.game.config.height) + 20, - this.game.config.width / 2 - 5, 0);
        this.addThreeBound(this.game.config.width, 10, 0, Number(this.game.config.height) / 2 + 5);
        this.addThreeBound(this.game.config.width, 10, 0, - Number(this.game.config.height) / 2 - 5);

        let ground = this.phaser3d.add.box({
            width: (Number(this.game.config.width) + 20) * this.gameOptions.gameScale,
            height: 10 * this.gameOptions.gameScale,
            depth: (Number(this.game.config.height) + 20) * this.gameOptions.gameScale,
            color: 0xffff00,
            x: 0,
            y: -5 * this.gameOptions.gameScale,
            z: 0,
            material: {
                dithering: true,
                phong: true
            }
        });

        this.redThreeBall = this.addThreeBall(0xff0000);
        this.blueThreeBall = this.addThreeBall(0x0000ff);

        this.phaser3d.castShadow(this.redThreeBall, this.blueThreeBall);
        this.phaser3d.receiveShadow(ground);

        this.phaser3d.setShadow(spotlight, 512, 512);

        this.redBall = this.addArcadeBall("redball");
        this.blueBall = this.addArcadeBall("blueball");
        //@ts-ignore
        this.physics.add.collider(this.redBall, this.blueBall);
    }

    addThreeBound(width, depth, posX, posZ) {
        this.phaser3d.add.box({
            width: width * this.gameOptions.gameScale,
            height: this.gameOptions.ballRadius * this.gameOptions.gameScale,
            depth: depth * this.gameOptions.gameScale,
            color: 0x00ff00,
            x: posX * this.gameOptions.gameScale,
            y: this.gameOptions.ballRadius / 2 * this.gameOptions.gameScale,
            z: posZ * this.gameOptions.gameScale,
            material: {
                dithering: true,
                phong: true
            }
        });
    }

    addThreeBall(color) {
        return this.phaser3d.add.sphere({
            radius: this.gameOptions.ballRadius * this.gameOptions.gameScale,
            widthSegments: 32,
            heightSegments: 32,
            color: color,
            x: 0,
            y: 25 * this.gameOptions.gameScale,
            z: 0,
            material: {
                dithering: true,
                phong: true
            }
        });
    }

    addArcadeBall(key) {
        let posX = Phaser.Math.Between(this.gameOptions.ballRadius, Number(this.game.config.width) - this.gameOptions.ballRadius);
        let posY = Phaser.Math.Between(this.gameOptions.ballRadius, Number(this.game.config.height) - this.gameOptions.ballRadius);
        //@ts-ignore
        let ball = this.physics.add.sprite(posX, posY, key);
        ball.setCircle(this.gameOptions.ballRadius);
        ball.setCollideWorldBounds(true);
        ball.setBounce(1);
        let angle = Phaser.Math.RND.rotation();
        ball.setVelocity(400 * Math.cos(angle), 400 * Math.sin(angle));
        return ball
    }

    update() {
        this.redThreeBall.position.x = (this.redBall.x - Number(this.game.config.width) / 2) * this.gameOptions.gameScale;
        this.redThreeBall.position.z = (this.redBall.y - Number(this.game.config.height) / 2) * this.gameOptions.gameScale;
        this.blueThreeBall.position.x = (this.blueBall.x - Number(this.game.config.width) / 2) * this.gameOptions.gameScale;
        this.blueThreeBall.position.z = (this.blueBall.y - Number(this.game.config.height) / 2) * this.gameOptions.gameScale;
    }
}
