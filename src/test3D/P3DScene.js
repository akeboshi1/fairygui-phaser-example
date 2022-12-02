/* global __DEV__ */
// Import the entire "phaser" namespace

// Get the important pieces from three.js
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
// Import the Phaser3d plugin
import Phaser3D from "../loader/phaser3D"

// import "../phaser3D/OrbitControls";
// import "three/examples/js/controls/OrbitControls"
var healthBar
var healthAmount = 100

export class P3dScene extends Phaser.Scene {
  // private skyboxName: string;
  // private defaultFOV: number;
  // private fadeoutTime: number;
  // private phaser3d: Phaser3D;
  // private plane;
  // private controls;
  // private collectedObjects: any[];
  // private scene1Key;
  // private scene2Key;
  // private scene3Key;
  init(initData) {
    // Receive the name of the skybox that should be loaded
    if (initData) {
      this.skyboxName = initData.skyboxName || ""
      this.defaultFOV = initData.defaultFOV || 70
    }
  }

  preload() {
    // Disc sprite used to render cloud of points
    this.load.image("bigmouth", "assets/images/BigMouth_FrontView.png")
    this.load.image("tom", "assets/images/TiredTom_FrontView.png")
    this.load.image("longarms", "assets/images/LongArmsBoi_FrontView.png")
    this.load.image("bar", "assets/images/bar.png")
  }

  create() {
    this.fadeoutTime = 500
    healthBar = this.add.image(0, 0, "bar")
    // Initialize a Phaser3D rendering system
    this.phaser3d = new Phaser3D(this, {
      fov: this.defaultFOV,
      near: 2,
      far: 100000,
      z: 1000
    })

    // Setup background skybox
    // Note: These assets are loaded direclty by three.js and are not in the preload() above.
    // This can result in a flash of an untextured background as they load.  You may want to
    // Hide this by having fade-in and fade-out transitions for these scenes.
    this.phaser3d.setCubeBackground(
      "assets/images/skybox/" + this.skyboxName + "/",
      "px.jpg", "nx.jpg",
      "py.jpg", "ny.jpg",
      "pz.jpg", "nz.jpg"
    )

    // Enable fog (causes dots in the distance to be darker)
    this.phaser3d.enableFogExp2(0x000000, 0.001)

    // Build list of random points
    const vertices = []
    for (let i = 0; i < 1; i++) {
      const x = 0
      const y = 0
      const z = 100

      vertices.push(x, y, z)
    }

    // Build geometry to hold the position of all the dots
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

    // Create material from disc sprite
    // Note: while this sprite is rendered by three.js it is a Phaser image asset and WAS
    // loaded in preload() above.  This is in contrast to the skybox.
    this.material = this.phaser3d.createMaterial("bigmouth", null, {
      size: 500,
      sizeAttenuation: false,
      alphaTest: 0.5,
      transparent: true,
      points: true
    })

    this.plane = this.phaser3d.addPlane({
      width: 500,
      height: 500,
      Z: 10,
      texture: "bigmouth",
      material: {
        size: 500,
        sizeAttenuation: true
      }
    })
    // this.plane.setInteractive()
    // this.plane.on("pointerdown", function () {
    //   print("Plane Clicked")
    // })
    this.plane.rotateX(-90)

    // Set default color
    // this.material.color.setHSL(1.0, 0.3, 0.7)

    // Add the points with the previously created geometry and material
    this.phaser3d.addPoints({
      geometry: geometry,
      material: this.material
    })

    // Setup standard orbit controls
    this.controls = new OrbitControls(this.phaser3d.camera, this.scale.parent)
    this.controls.enableZoom = false
    this.controls.enablePan = false

    this.setupSceneChangeKeys()

    // Stored list of inventory items
    // this.collectedObjects = []
    // const self = this;
    // // // Collectable objects class
    // var CollectableObject = new Phaser.Class({

    //   Extends: Phaser3D.plane,

    //   initialize:

     
    //   function CollectableObject (theWidth, theHeight, matSize, imgName) {
    //     this.plane = self.phaser3d.addPlane({
    //       width: theWidth,
    //       height: theHeight,
    //       Z: 10,
    //       texture: imgName,
    //       material: {
    //         size: matSize,
    //         sizeAttenuation: true
    //       }
    //     })
    //     this.name = imgName
    //   },

    //   clicked: function () {
    //     self.collectedObjects.push(this.name)
    //     // Delete the object?
    //     self.name = ""
    //   }

    // })

    // Interactable objects class (Like doors)
    // var InteractableObject = new Phaser.Class({

    //   Extends: Phaser3D.plane,

    //   initialize:

    //   function CollectableObject (theWidth, theHeight, matSize, imgName, unlockImgName) {
    //     this.plane = self.phaser3d.addPlane({
    //       width: theWidth,
    //       height: theHeight,
    //       Z: 10,
    //       texture: imgName,
    //       material: {
    //         size: matSize,
    //         sizeAttenuation: true
    //       }
    //     })
    //     this.name = imgName
    //     this.unlockName = unlockImgName
    //     this.unlocked = false
    //   },

    //   clicked: function () {
    //     for (let i = 0; i < this.collectedObjects.length; i++) {
    //       if (this.collectedObjects[i] === this.unlockName) {
    //         this.unlocked = true
    //         // Remove object from inventory?
    //       }
    //     }
    //   }

    // })

    // this.collectableOne = new CollectableObject(500, 500, 500, "tom");

    // this.input.on("gameobjectdown",function () {
    //   self.collectableOne.clicked()
    // });
    // this.collectableOne.setInteractive()
    // this.collectableOne.on("pointerdown", function () {
    //   this.collectableOne.clicked()
    // })

    // this.doorOne = new InteractableObject(500, 500, 500, "door", "keyOne")
    // this.doorOne.setInteractive()
    // this.doorOne.on("pointerdown", function () {
    //   this.doorOne.clicked()
    // }) 

    this.cameras.main.fadeIn(this.fadeoutTime)
  }

  startScene(skyboxName) {
    this.scene.start("Test3D", { skyboxName: skyboxName, defaultFOV: 90 })
    console.log("Starting Scene")
  }

  setupSceneChangeKeys() {
    this.scene1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
    this.scene2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
    this.scene3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)

    this.scene1Key.on("up", (e) => {
      this.cameras.main.fadeOut(this.fadeoutTime)
      this.time.delayedCall(this.fadeoutTime, this.startScene, ["Conservatory"], this)
    }, this)

    this.scene2Key.on("up", (e) => {
      this.cameras.main.fadeOut(this.fadeoutTime)
      this.time.delayedCall(this.fadeoutTime, this.startScene, ["NewReceptionHall"], this)
    }, this)

    this.scene3Key.on("up", (e) => {
      this.cameras.main.fadeOut(this.fadeoutTime)
      this.time.delayedCall(this.fadeoutTime, this.startScene, ["Test"], this)
    }, this)
  }

  update(time) {
    // Slowly change color of the points over time
    // const h = (360 * (1.0 + (time * 0.00005)) % 360) / 360
    // this.material.color.setHSL(h, 0.5, 0.5)
    healthBar.setCrop(0, 0, healthBar.width * healthAmount / 100, healthBar.height)
  }
}

