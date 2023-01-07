import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Phaser3D from "../loader/phaser3D"


export class Test3DScene1 extends Phaser.Scene {
    preload() {
        this.load.binary("man", "assets/glb/Boy.glb");
    }

    create() {
        const self = this;
        this.skyboxName = "Library";
        this.phaser3d = new Phaser3D(this, {
            fov: 70,
            near: 2,
            far: 100000,
            z: 1000
        });
        this.phaser3d.setCubeBackground(
            "assets/images/skybox/" + this.skyboxName + "/",
            "px.jpg", "nx.jpg",
            "py.jpg", "ny.jpg",
            "pz.jpg", "nz.jpg"
        );
        //this.phaser3d.enableFogExp2(0xffcc00, 0.002);
        // const sphere = new THREE.SphereGeometry(0.5, 16, 16);
        // const pointLight = this.phaser3d.addPointLight({ mesh: new THREE.Mesh(sphere), color: 0x404040, intensity: 200, x: 10, y: 200, z: 70 });

        const pointLight = this.phaser3d.addSpotLight({ color: 0x404040, intensity: 100, x: 40, y: 350, z: 80, castShadow: true });
        this.phaser3d.addGLTFModel("man", 'assets/glb/Boy.glb', (robot) => {
            const scale = 200;
            robot.setScale(scale);
            // const object3D = robot.scene.children[0];
            // const mesh = robot.scene.children[1];
            // object3D.scale.set(scale, scale, scale);
            // object3D.position.setY(0);

            // self.robot.traverse(child => {
            //     if (child.isMesh) {
            //         child.castShadow = child.receiveShadow = true;
            //     }
            // });

            // // animations
            // self.third.animationMixers.add(self.robot.animation.mixer);
            self.robot = robot;
            self.animationPlay();
        });


        // const geometry = new THREE.PlaneGeometry( 100, 100 );
        // 			const planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffb851 } );
        // const ground = new THREE.Mesh( geometry, planeMaterial );

        // ground.position.set( 0, FLOOR, 0 );
        // ground.rotation.x = - Math.PI / 2;
        // ground.scale.set( 100, 100, 100 );

        // ground.castShadow = false;
        // ground.receiveShadow = true;

        // scene.add( ground );
        this.phaser3d.enableShadows();
        this.phaser3d.addGround({ width: 1000, height: 1000, castShadow: false, receiveShadow: true, color: 0xffcc00, material: { side: THREE.DoubleSide } });
        // //lights

        // light1 = new THREE.PointLight( 0xff0040, 2, 50 );
        // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        // scene.add( light1 );

        // pointLight.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x404040 })));

        // this.phaser3d.addAnglyphEffect();
        this.controls = new OrbitControls(this.phaser3d.camera, this.scale.parent);

        this.input.keyboard.on("keydown", this.keyDownHandler, this);
        // this.controls.enableZoom = false
        // this.controls.enablePan = false

    }

    keyDownHandler(event) {
        console.log(event);
        const key = event.key;
        if (!this.robot) return;
        switch (key) {
            case "a":
                this.animationPlay(1);
                this.state = 1;
                break;
            case "d":
                this.animationPlay(2);
                this.state = 2;
                break;
            case "w":
                this.animationPlay(3);
                this.state = 3;
                break;
            case "s":
                this.animationPlay(4);
                this.state = 4;
                break;
        }
    }

    animationPlay(action = 3) {
        this.robot.animate(action);
    }

    update() {
        if (this.robot) {
            this.robot.mixer.update(0.01);
            if (this.state === 2) {
                this.robot.display.position.z += 1;
            }
        }
    }
}