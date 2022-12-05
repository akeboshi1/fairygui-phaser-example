import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Phaser3D from "../loader/phaser3D"


export class Test3DScene1 extends Phaser.Scene {
    preload() {
       this.load.binary("man","assets/glb/Boy.glb");
    }

    create() {
        this.skyboxName = "Library"
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

        this.phaser3d.addGLTFModel("man", 'assets/glb/Boy.glb', (robot) => {
            const scale = 30;
            robot.scene.children[0].scale.set(scale, scale, scale);
            robot.scene.children[0].position.setY(0);

            // this.robot.traverse(child => {
            //     if (child.isMesh) {
            //         child.castShadow = child.receiveShadow = true;
            //     }
            // });

            // // animations
            // this.third.animationMixers.add(this.robot.animation.mixer);
            // gltf.animations.forEach(animation => {
            //     this.robot.anims.add(animation.name, animation);
            // })
            // this.robot.anims.play('Idle');
        });

        this.controls = new OrbitControls(this.phaser3d.camera, this.scale.parent);
        // this.controls.enableZoom = false
        // this.controls.enablePan = false

    }
}