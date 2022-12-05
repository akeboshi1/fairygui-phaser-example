
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
// Import the Phaser3d plugin
import Phaser3D from "../loader/phaser3D"

// Import custom sprite class to make normal phaser sprites rotate in our 3D view
import PanoSprite from '../sprites/PanoSprite'

// Import the special pixelization filter
import BlurPipeline from '../shaders/BlurPipeline'

class PanoScene extends Phaser.Scene {
  init (data) {
    // FOR DEBUGGING //
    this.debug = false
    // FOR PRESENTATION //
    this.presentation = true
    // Presentation feature where light starts on and flashlight starts off
    this.lightStartOn = false
    this.flashlightStartOff = false
    // Starting values
    this.startAngle = 0
    if (typeof data.startAngle !== 'undefined') {
      this.startAngle = data.startAngle
    }
    // List of collected items
    this.collectedObjects = []
    if (this.presentation) { // Adds the knife to the inventory to begin for the presentation
      this.collectedObjects = ['knife']
    }
    if (Array.isArray(data.collectedObjects)) {
      this.collectedObjects = data.collectedObjects
    }

    // Ensure good default values are set for all properties
    this.skyboxName = this.skyboxName || ''
    this.vertFOV = this.vertFOV || 70
    this.panoSprites = []
    this.overSprite = null

    // Eased turning
    this.rotSpeed = 0.05
    this.rotAlpha = 0.0
    this.rotLerpDelta = 0.02

    // Variables for health management
    if (typeof data.healthAmount !== 'undefined') {
      this.healthAmount = data.healthAmount
    } else {
      this.healthAmount = 100
    }

    this.mouseCheckRadius = 240
    this.withinRadius = false
    this.radiusStrength = 0.0

    this.setInfoBool = true

    // Pre-bind the update method for orbit controls
    this.updateSpritePositions = this.updateSpritePositions.bind(this)

    this.events.on('shutdown', this.shutdown, this)

    if (typeof data.initialText === 'undefined') {
      data.initialText = true
      //if (__DEV__) console.log('set initial true')
    }

    if (typeof data.collectedItem !== 'undefined') {
      this.setInfoItem = data.collectedItem
    }
   // if (__DEV__) console.log(data.collectedItem)

    this.infoSceneData = {
      healthAmount: 100,
      showTrace: false,
      initialText: data.initialText
    }
  }

  preload () {
    this.load.image("bigmouth", "assets/images/BigMouth_FrontView.png")
    this.load.audio('thunder', 'assets/audio/noises/thunder.mp3')
    this.load.audio('rainLoop', 'assets/audio/noises/rainLoop.mp3')
    this.load.audio('whisperLoop', 'assets/audio/noises/whisperLoop.mp3')
    this.load.audio('whisperLR', 'assets/audio/noises/whisperLeftToRight.mp3')
    this.load.audio('doorway', 'assets/audio/noises/stepDoorway.mp3')
    this.load.audio('doorLocked', 'assets/audio/noises/doorLocked.mp3')
    if (!this.game.renderer.pipelines.pipelines.get('BlurFilter')) {
      this.blurPipeline = this.game.renderer.pipelines.pipelines.set('BlurFilter', new BlurPipeline(this.game))
    } else {
      this.blurPipeline = this.game.renderer.pipelines.pipelines.get('BlurFilter')
    }
    this.downOnDoor = null
    this.monsterList = []
    this.traceNumber = 0
    this.input.on('pointerup', (pointer) => { this.downOnDoor = null }, this)

    // List of collectable objects
    this.collectableList = []
  }

  shutdown () {
    if (this.controls) {
      this.controls.removeEventListener('change', this.updateSpritePositions)
      this.controls = null
    }
  }

  create () {
    // Remove cursor
    this.input.setDefaultCursor('null')
    //this.input.setDefaultCursor('url(assets/images/lightglare.png), pointer') //yellow circle
    //this.input.setDefaultCursor('url(assets/images/sunray25px.png), pointer') //transparent circle
    // Initialize a Phaser3D rendering system
    this.phaser3d = new Phaser3D(this, {
      fov: this.vertFOV,
      near: 0.1,
      far: 1000,
      z: 1000
    })
    this.horiFOV = this.vertFOV * this.phaser3d.camera.aspect

    this.fadeOutTime = 300

    // Runs the info scene to display on top of the screen
    this.infoSceneData.healthAmount = this.healthAmount
    this.infoSceneData.skyboxName = this.skyboxName
    this.infoSceneData.presentation = this.presentation
    this.scene.run('Info', this.infoSceneData)
    this.infoScene = this.scene.get('Info')

    // Time variables
    this.t = 0
    this.tIncrement = 0.005

    // Game over variables
    this.gameover = false
    this.gameoverHandled = false

    // Graphics for drawing the flashlight and monster collision
    this.graphics = this.add.graphics()

    this.keys = this.input.keyboard.addKeys('Q,LEFT,RIGHT,A,D,P')

    // Toggles off the "light on" and then the "flashlight start off" variables
    this.keys.P.on('down', function (event) {
      //) console.log(this.lightStartOn)
      if (this.lightStartOn) {
        this.lightStartOn = false
        //if (__DEV__) console.log('Pressed P for light')
      } else if (this.flashlightStartOff) {
        this.flashlightStartOff = false
        //if (__DEV__) console.log('Pressed P for flashlight')
      }
    }, this)

    // Setup background skybox
    // Note: These assets are loaded direclty by three.js and are not in the preload() above.
    this.phaser3d.setCubeBackground(
      'assets/images/skybox/' + this.skyboxName + '/',
      'px.jpg', 'nx.jpg',
      'py.jpg', 'ny.jpg',
      'pz.jpg', 'nz.jpg'
    )

    // Setup standard orbit controls
    this.controls = new OrbitControls(this.phaser3d.camera, this.scale.parent)
    this.controls.enableZoom = false
    this.controls.enablePan = false
    // this.controls.initialRotate(this.startAngle)
    this.controls.rotateSpeed = 0.1
    this.controls.keyPanSpeed = 0.1

    // Limits vertical height the player can rotate to
    this.controls.minPolarAngle = Math.PI / 2.4
    this.controls.maxPolarAngle = Math.PI / 1.6

    // Update sprite positions when orbit controls move
    this.controls.addEventListener('change', this.updateSpritePositions)
    this.updateSpritePositions() // Call once to initialize sprite positions

    this.cameras.main.fadeIn(this.fadeoutTime) // Camera fade-in for start of game

    // this.cameras.main.setRenderToTexture('PixelFilter')
    this.cameras.main.setPostPipeline('BlurFilter')

    // Lightning variables
    this.lightning = this.add.image(500, 280, 'light').setScale(1.2).setDepth(400)
    this.lightning.alpha = 0.0
    this.lightningAudio = this.sound.add('thunder', { loop: false })
    if (this.lightStartOn) {
      this.lightningTimer = 0.01
    } else {
      this.lightningTimer = Phaser.Math.Between(15, 30)
    }
    this.flashedOnce = false
    this.brightnessPeak = false
    this.flashSpeed = 0
    // spotlight-----------------------------------------------
    var pic = this.add.image(500, 280, 'room').setScale(1.2)
    pic.setDepth(300)
    var spotlight = this.make.sprite({
      x: 400,
      y: 400,
      key: 'mask',
      add: false
    }).setScale(3)

    var pointerSprite = this.make.sprite({
      x: 320,
      y: 320,
      key: 'pointerCircle'
    }).setDepth(350)
    pointerSprite.alpha = 0.4

    this.spotlight = spotlight
    this.pointerImage = pointerSprite

    pic.mask = new Phaser.Display.Masks.BitmapMask(this, spotlight)
    pic.mask.invertAlpha = true
    // Make sure spotlight starts at the mouse
    const ourPointer = this.game.input.activePointer
    spotlight.x = ourPointer.x
    spotlight.y = ourPointer.y
    pointerSprite.x = ourPointer.x
    pointerSprite.y = ourPointer.y
    this.input.on('pointermove', function (pointer) {
      spotlight.x = pointer.x
      spotlight.y = pointer.y
      pointerSprite.x = pointer.x
      pointerSprite.y = pointer.y
    })
    this.flashlightTimer = 0
    this.timeFlashlight = false
    this.whispering = this.sound.add('whisperLoop', { loop: true})
    this.whispering.play()

    this.face = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'face').setDepth(399)
    this.face.scale = 2
    //this.face.alpha = 0
    // --------------------------------------------------------

    // Audio related stuff
    this.model = this.sys.game.globals.model
    if (this.model.musicName !== 'rainLoop') {
      this.model.bgMusicPlaying = false
      this.sys.game.globals.bgMusic.stop()
    }
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.ambience = this.sound.add('rainLoop', { loop: true })
      this.ambience.play()
      this.model.bgMusicPlaying = true
      this.sys.game.globals.bgMusic = this.ambience
      this.model.musicName = 'rainLoop'
    }
    // Sound for when Monsters are near
    this.closeAudio = this.sound.add('ambienceBitcrush', { loop: true })
    this.closeAudio.play()
    // Sound for when light is off and monsters are near
    this.heartbeatAudio = this.sound.add('heartbeat', { loop: true })
    this.heartbeatAudio.play()

    this.pickupSound = this.sound.add('pickup')

    // Particle effect to use for traces
    this.traceParticles = this.add.particles('traceParticle').createEmitter({
      x: -200,
      y: -200,
      speed: 10,
      lifespan: 1000,
      alpha: 0.5,
      scale: { start: 0.2, end: 0, ease: 'Expo.easeIn' },
      blendMode: 'ADD'
    })

    // Animations for sprites
    var tf = {
      key: 'front',
      frames: this.anims.generateFrameNumbers('tomF'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(tf)

    var tw = {
      key: 'walk',
      frames: this.anims.generateFrameNumbers('tomW'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(tw)

    var lf = {
      key: 'front2',
      frames: this.anims.generateFrameNumbers('longarmsF'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(lf)

    var lw = {
      key: 'walk2',
      frames: this.anims.generateFrameNumbers('longarmsW'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(lw)

    var bf = {
      key: 'front3',
      frames: this.anims.generateFrameNumbers('bigmouthF'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(bf)

    var bw = {
      key: 'walk3',
      frames: this.anims.generateFrameNumbers('bigmouthW'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(bw)

    var bossf = {
      key: 'front4',
      frames: this.anims.generateFrameNumbers('bossF'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(bossf)

    var bossw = {
      key: 'walk4',
      frames: this.anims.generateFrameNumbers('bossW'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(bossw)
    // Creates music
    this.cave = this.sound.add('cave', { loop: true })
    this.cave.play()
    this.caveWater = this.sound.add('caveWater', { loop: true })
    this.caveWater.play()
    this.caveMouse = this.sound.add('caveMouse', { loop: true })
    this.caveMouse.play()
    // Sets music for cave
    // if (this.skyboxName !== 'Cave') {
    //   this.cave.volume = 0
    //   this.caveWater.volume = 0
    //   this.caveMouse.volume = 0
    // }
  }

  // Adds a sprite that is orientated in the 3D world
  addPanoSprite (textureKey, angX, angY, baseScale, canScale) {
    // Make sure texture key was provided
    if (!textureKey) {
      console.warn('Error: PanoScene.addPanoSprite called without textureKey')
      return
    }

    // Set default values if undefined
    angX = angX || 0
    angY = angY || 0
    baseScale = baseScale || 1.0
    const zoomStrength = 1.0
    if (canScale !== false) {
      canScale = true
    }

    // Create PanoSprite with parameters
    const newSprite = new PanoSprite({
      scene: this,
      angX: angX,
      angY: angY,
      textureKey: textureKey,
      perspectiveStrength: zoomStrength,
      canScale: canScale
    })
    newSprite.setScale(baseScale)
    newSprite.setDepth(this.panoSprites.length + 1)

    // Add to scene and panosprite list
    this.add.existing(newSprite)
    this.panoSprites.push(newSprite)

    // Return the newly created sprite
    return newSprite
  }

  // Updates the positions for the panosprites
  updateSpritePositions () {
    this.panoSprites.forEach((pSprite) => {
      pSprite.updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
        this.game.config.width, this.game.config.height)
    })
  }

  // Used to fade between the current scene and a new scene
  transitionTo (sceneName, collectedObjects, startAngle, collectedItem) {
    this.cameras.main.fadeOut(this.fadeoutTime)
    this.time.delayedCall(this.fadeoutTime, this.startScene, [sceneName, collectedObjects, startAngle, collectedItem], this)
  }

  // Starts the new scene, called by transitionTo()
  startScene (sceneName, collectedObjects, startAngle, collectedItem) {
    this.closeAudio.stop()
    this.heartbeatAudio.stop()
    this.cave.stop()
    this.caveWater.stop()
    this.caveMouse.stop()
    this.whispering.stop()
    if (this.gameover) {
      this.healthAmount = 100
    }
    this.scene.start(sceneName, { collectedObjects: collectedObjects, startAngle: startAngle, healthAmount: this.healthAmount, initialText: false, collectedItem: collectedItem })
  }

  update () {
    // Updates the info text sprite
    if (typeof this.setInfoItem !== 'undefined') {
      this.infoScene.setTextImage(this.setInfoItem)
      this.setInfoItem = null
    }
    if (this.setInfoBool) {
      this.setInfoBool = false
      // Plays the portal animation if bookCandle collected and not triggered before
      if (this.checkRequirement('bookCandle') && !this.checkRequirement('portalPlayed') && this.skyboxName === 'Cave') {
        this.infoScene.activatePortal()
        this.addCollectedObject('portalPlayed')
      }
    }
    // Updates every monster position so they can travel on paths
    for (let i = 0; i < this.monsterList.length; i++) {
      this.monsterList[i].updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
        this.game.config.width, this.game.config.height)
    }
    // this.input.mouse.requestPointerLock()

    // Adds the time variable to the blur shader
    this.t += this.tIncrement
    this.blurPipeline.setFloat1('time', this.t)

    // Updates the heartbeat audio strength based on closeness to monster
    if (this.withinRadius) {
      //this.heartbeatAudio.volume = this.radiusStrength * 0.5 + 0.5
      this.heartbeatAudio.rate = this.radiusStrength * 0.5 + 0.5
    } else {
      //this.heartbeatAudio.volume = 0.0
    }
    // Updates health bar and shader strength
    if (this.withinRadius && !this.keys.Q.isDown) {
      //this.closeAudio.volume = this.radiusStrength * 0.7
      this.blurPipeline.setFloat1('magnitudeAmount', this.radiusStrength)
      this.healthAmount -= 0.3 * Math.abs(this.radiusStrength)
    } else { // Turns the blue effect off if not near a monster
      this.blurPipeline.setFloat1('magnitudeAmount', 0.0)
      //this.closeAudio.volume = 0.0
      this.healthAmount += 0.03
      if (this.healthAmount > 100) {
        this.healthAmount = 100
      }
    }

    // Decrease health if in boss room
    if (this.skyboxName === 'BossRoom') {
      this.healthAmount -= 0.06
    }

    if (this.healthAmount < 0) {
      this.healthAmount = 0
      this.gameover = true
    }

    // Game over case
    if (this.gameover && !this.gameoverHandled) {
      //if (__DEV__) console.log('Game over')
      this.transitionTo('Conservatory', [], 0.0)
      this.gameoverHandled = true
    }

    // Turns off the flashlight if Q is held down and controls the whisper audio
    if (this.keys.Q.isDown) {
      this.spotlight.scale = 0.0
      if (!this.timeFlashlight) {
        this.timeFlashlight = true
      }
    } else {
      this.timeFlashlight = false
      this.flashlightTimer = 0
      this.spotlight.scale = 4.0
    }
    if (this.timeFlashlight) {
      this.flashlightTimer += 0.01
      if (this.flashlightTimer > 6) {
        this.flashlightTimer = 6
        //if (__DEV__) console.log('Whispering at full audio')
        this.gameover = true
      }
      this.blurPipeline.setFloat1('magnitudeAmount', this.flashlightTimer / 6)
      if (this.flashlightTimer >= 4.5) {
       // this.closeAudio.volume = (this.flashlightTimer - 4.5) * 0.7
      }
    }
   // this.whispering.volume = this.flashlightTimer / 6
    this.face.alpha = this.flashlightTimer / 100
    // Changes spotlight if lights start on or if the flashlight starts off
    if (this.lightStartOn) {
      this.spotlight.scale = 30.0
    } else if (this.flashlightStartOff) {
      this.spotlight.scale = 0.0
    }

    // Rotates the camera using the left button
    if (this.keys.LEFT.isDown || this.keys.A.isDown) {
      const newRot = Phaser.Math.Interpolation.Linear([0, -this.rotSpeed], this.rotAlpha)
      this.controls.setRotation(newRot)
      this.rotAlpha = Math.min(this.rotAlpha + this.rotLerpDelta, 1.0)
    } else if (this.keys.RIGHT.isDown || this.keys.D.isDown) {
      // Rotates the camera using the right button
      const newRot = Phaser.Math.Interpolation.Linear([0, this.rotSpeed], this.rotAlpha)
      this.controls.setRotation(newRot)
      this.rotAlpha = Math.min(this.rotAlpha + this.rotLerpDelta, 1.0)
    } else {
      this.rotAlpha = 0.0
    }

    // Updates the lightning flash
    this.updateLightning()

    // Updates if the  monster and flashlight are overlapping
    this.updateOverlap()

    // TODO: Increase health if it hasn't decreased for a while

    // Updates the visual portion of the health bar
    this.infoScene.updateHealth(this.healthAmount)
    // Gets rotation of camera and sends it to the minimap in Info Scene
    this.infoScene.setMapRotation(-this.controls.getAzimuthalAngle() / Math.PI * 180)
  }

  updateLightning () {
    if (this.skyboxName !== 'BossRoom' && this.skyboxName !== 'Cave' && !this.lightStartOn) {
      var timerTriggered = false
      if (this.lightningTimer <= 0.0) {
        timerTriggered = true
        if (this.flashedOnce) {
          this.flashSpeed = 10
        } else {
          this.flashSpeed = 8
        }
        // Controls the flashing of the lightning
        if (!this.brightnessPeak) {
          this.lightning.alpha = this.lightning.alpha - 0.01 * this.flashSpeed
          if (this.lightning.alpha <= 0.0) {
            this.brightnessPeak = true
            this.lightning.alpha = 0.0
          }
        } else {
          this.lightning.alpha = this.lightning.alpha + 0.01 * this.flashSpeed
          if (this.lightning.alpha >= 1.0) {
            this.brightnessPeak = false
            this.lightning.alpha = 0.0
            // Check if to flash again or restart the timer
            if (!this.flashedOnce) {
              this.flashedOnce = true
            } else {
              this.lightningTimer = Phaser.Math.Between(15, 30)
              this.flashedOnce = false
            }
          }
        }
      }
      this.lightningTimer -= 0.01
      // Triggers the lightning audio if flashing is about to begin
      if (!timerTriggered & this.lightningTimer <= 0.0) {
        //if (__DEV__) console.log('Audio set to play')
        this.lightningAudio.play()
      }
    }
  }

  // Creates a door sprite that navigates you to a different room when clicked
  createDoor (posX, posY, scaleX, scaleY, sceneToLoad, startAngle, unlockItem = '') {
    const doorSprite = this.addPanoSprite(null, posX, posY, 5.0)
    doorSprite.baseScaleX *= scaleX
    doorSprite.baseScaleY *= scaleY
    doorSprite.alpha = 0.001

    // Makes doors slightly visible for debugging
    if (this.debug === true) {
      doorSprite.alpha = 0.1
    }

    doorSprite.setInteractive(new Phaser.Geom.Rectangle(0, 0, doorSprite.width, doorSprite.height), Phaser.Geom.Rectangle.Contains)

    // Checks if the pointer was pressed and released on the same door
    doorSprite.on('pointerdown', (pointer) => { this.downOnDoor = doorSprite })
    doorSprite.on('pointerup', (pointer) => {
      // Controls if the door is unlocked or not
      const canOpen = this.checkRequirement(unlockItem)

      if (this.downOnDoor === doorSprite && canOpen) {
        this.transitionTo(sceneToLoad, this.collectedObjects, startAngle)
      }
      this.downOnDoor = null
    }, this)
  }

  // Collectable creation function used by rooms, spawns if not already in your list
  // *Remember objects are part of the skybox*
  createCollectable (posX, posY, scaleX, scaleY, spriteName, requirementObject = '') {
    let haveObject = false
    for (let i = 0; i < this.collectedObjects.length; i++) {
      if (this.collectedObjects[i] === spriteName) {
        haveObject = true
      }
    }
    if (!haveObject) { // Spawns the object if not already in inventory
      const collectable = this.addPanoSprite(spriteName, posX, posY, 5.0)
      collectable.baseScaleX *= scaleX
      collectable.baseScaleY *= scaleY
      collectable.depth = collectable.depth + 10
      collectable.alpha = 0.001

      // Makes collectable boundraies slightly visible for debugging
      if (this.debug === true) {
        collectable.alpha = 0.1
      }

      collectable.setInteractive(new Phaser.Geom.Rectangle(0, 0, collectable.width, collectable.height), Phaser.Geom.Rectangle.Contains)
      collectable.requirement = requirementObject
      collectable.input.enabled = this.checkRequirement(requirementObject)
      this.collectableList.push(collectable)
      collectable.on('pointerdown', (pointer) => {
        this.addCollectedObject(spriteName)
        //if (__DEV__) console.log(this.collectedObjects)
        collectable.destroy()
        this.pickupSound.play()
        this.transitionTo(this.masterSkybox, this.collectedObjects, -this.controls.getAzimuthalAngle(), spriteName)
      }, this)
      return collectable
    }
  }

  // Checks if object can be interacted with based off of items in the players inventory
  checkRequirement (requirementName) {
    let haveRequirement = false
    for (let i = 0; i < this.collectedObjects.length; i++) {
      if (this.collectedObjects[i] === requirementName) {
        haveRequirement = true
      }
    }
    if (requirementName === '') {
      haveRequirement = true
      //if (__DEV__) console.log('No requirement for collectable')
    }
    return haveRequirement
  }

  // Adds collected objects to a list of collected objects and updates the requirements for other objects
  addCollectedObject (spriteName) {
    this.collectedObjects.push(spriteName)
    for (let i = 0; i < this.collectableList.length; i++) {
      if (this.collectableList[i].requirement === spriteName) {
        this.collectableList[i].input.enabled = true
      }
    }
  }

  // Creates a monster sprite that drains sanity
  createMonster (posX, posY, scale, spriteName) {
    const monster = this.addPanoSprite(spriteName, posX, posY, scale)
    this.monsterList.push(monster)
    return monster
  }

  // Updates the flashlight and checks if colliding with a monster
  updateOverlap () {
    const pointer = this.game.input.activePointer
    let isWithin = false
    this.graphics.clear()
    for (let i = 0; i < this.monsterList.length; i++) {
      var rectA = this.monsterList[i].getBounds() // TODO: Modify monster bounds to fit the sprite
      var rectB = new Phaser.Geom.Rectangle(pointer.x - this.mouseCheckRadius / 2, pointer.y - this.mouseCheckRadius / 2, this.mouseCheckRadius, this.mouseCheckRadius)

      // Makes boundraies slightly visible for debugging
      if (this.debug === true) {
        this.graphics.lineStyle(1, 0xff0000)
        this.graphics.strokeRectShape(rectB)
        this.graphics.strokeRectShape(rectA)
      }

      var rectC = new Phaser.Geom.Rectangle()
      Phaser.Geom.Rectangle.Intersection(rectA, rectB, rectC)
      if (!rectC.isEmpty()) {
        isWithin = true
        // Does not factor in size of creature yet
        this.radiusStrength = (1.0 - Math.sqrt(Math.pow(pointer.x - this.monsterList[i].x, 2) + Math.pow(pointer.y - this.monsterList[i].y, 2)) / 340.0) * 2.0
        if (this.radiusStrength > 1.5) {
          this.radiusStrength = 1.5
        }
      }
    }
    this.withinRadius = isWithin
  }

  startBossFight () {
    const traceOne = ['traceOne', [0.95, 0.63, 0.54, 0.63, 0.85, 0.63, 0.54, 0.63, 0.76, 0.65]]
    const traceTwo = ['traceTwo', [0.97, 0.2]]
    const traceThree = ['traceThree', [0.97, 0.2]]
    const traceFour = ['traceFour', [0.97, 0.17]]
    const traceFive = ['traceFive', [0.97, 0.17]]
    this.traceList = [traceOne, traceTwo, traceThree, traceFour, traceFive]
    this.sendTrace()
  }

  sendTrace () {
    // Ends the game if all the traces in the list are completed
    if (this.traceNumber >= this.traceList.length) {
      this.fadeoutTime = 2000
      this.healthAmount = 100
      this.transitionTo('TitleScene', [], 0.0)
      this.infoScene.setTextImage('gameWon')
      //if (__DEV__) console.log('Boss beat')
    } else { // No clue what this is for
      this.addTraceImage(this.traceList[this.traceNumber][0], this.traceList[this.traceNumber][1], true)
    }
  }

  addTraceImage (traceImage, traceWaypoints, partOfBoss, objectToAdd) {
    //if (__DEV__) console.log('Trace image added')
    let xAngle = 5
    if (traceImage === 'traceSix') {
      xAngle = -105
    }
    this.trace = this.addPanoSprite(traceImage.concat('Pattern'), xAngle, 0, 2, false)
    this.traceMaster = this.addPanoSprite(traceImage, xAngle, 0, 2, false)
    this.trace.setInteractive()
    this.trace.alpha = 0.01
    this.traceMaster.alpha = 0.5
    this.traceMaster.depth = this.traceMaster.depth + 15
    let waypointNum = 0
    this.traceMaster.setTint(0x0d7442)

    // Initilaizes the sprite position
    this.trace.updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
      this.game.config.width, this.game.config.height)
    this.traceMaster.updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
      this.game.config.width, this.game.config.height)

    // Checks the hue of the image to check if the image is being traced
    this.trace.on('pointermove', (pointer) => {
      // Gets the color of the pixel color based off pointer position
      let texLocX = this.trace.x - this.trace.width - pointer.x
      texLocX = -texLocX / this.trace.scale
      let texLocY = this.trace.y - this.trace.height - pointer.y
      texLocY = -texLocY / this.trace.scale
      const colorGotten = this.game.textures.getPixel(texLocX, texLocY, traceImage.concat('Pattern'))
      if (this.hueChecking) {
        // Sets the trace particle to follow the mouse
        this.traceParticles.setPosition(pointer.x, pointer.y)
        // Controls wether the trace is finished or broken
        const hueDifference = Math.abs(this.prevHue - colorGotten.h) // Gets the color difference between previous and current
        if (Math.abs(traceWaypoints[waypointNum] - colorGotten.h) <= 0.04) { // Waypoint matched case
          waypointNum++
          //if (__DEV__) console.log('Waypoint Reached')
          if (waypointNum >= traceWaypoints.length) { // Finish trace case
            // Sets the trace particle offscreen
            this.traceParticles.setPosition(-200, -200)
            // Stops the trace and updates the trace completed count
            this.hueChecking = false
            this.trace.destroy()
            this.traceMaster.destroy()
            // Progesses the boss fight if the trace is part of it
            if (partOfBoss) {
              this.traceNumber++
              this.sendTrace()
            } else {
              this.addCollectedObject(objectToAdd)
            }
            // Play sound
            //if (__DEV__) console.log('Trace finished!')
          }
        }
        if (hueDifference > 0.1 || colorGotten.h === 0) { // Fail trace case
          // Sets the trace particle offscreen
          this.traceParticles.setPosition(-200, -200)
          // Restarts the trace tracking
          this.hueChecking = false
          waypointNum = 0
          this.traceMaster.setTint(0x0d7442)
          //if (__DEV__) console.log('Trace lost')
        }
      } else {
        if (colorGotten.h > traceWaypoints[0]) { // Start trace case
          waypointNum++
          this.hueChecking = true
          this.traceMaster.setTint(0xffffff)
          //if (__DEV__) console.log('Starting Trace')
        }
      }
      this.prevHue = colorGotten.h
    }, this)
  }

  presentationLighting () {
    this.flashlightStartOff = true
    this.lightStartOn = true
  }
}

export default PanoScene
