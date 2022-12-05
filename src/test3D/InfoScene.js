class InfoScene extends Phaser.Scene {
  init (data) {
    // Data must be passed in when strting the scene
    if (data) {
      this.healthAmount = data.health || 100
      this.showTrace = data.showTrace || false
      this.skyboxName = data.skyboxName || ''
      this.initialText = data.initialText || false
      this.presentation = data.presentation || false
    } else {
      this.healthAmount = 100
      this.showTrace = false
      this.skyboxName = ''
      this.initialText = false
      this.presentation = false
    }

  }

  preload () {}

  create () {
    // Animation for portal
    var frames = this.anims.generateFrameNumbers('portal').slice(0, 18)
    var portalImage = {
      key: 'portalOpen',
      frames: frames,
      frameRate: 10,
      yoyo: false,
      repeat: 0
    }
    this.anims.create(portalImage)

    // Local variables for accessing width and height
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    this.portalBackground = this.add.image(this.width / 2.0, this.height / 2.0, 'portalBackground').setOrigin(0.5).setScale(10).setDepth(99)
    this.portalBackground.alpha = 0
    this.portalScreen = this.add.sprite(this.width / 2.0, this.height / 2.0, 'background').setOrigin(0.5).setScale(6).setDepth(100)
    this.portalScreen.alpha = 0

    this.textTimer = 0
    if (this.initialText) {
      this.textScroll = this.add.image(this.width / 2, this.height * 0.8, 'scroll').setScale(2)
      this.textImage = this.add.image(this.width / 2, this.height * 0.8, 'text0')
      this.textTimer = 3
    }

    // Variables for checking trace
    this.prevHue = 0
    this.hueChecking = false

    this.healthBalls = []
    this.healthBalls.push(this.add.image(this.width / 18 + 160, this.height / 21, 'healthOrb'))
    this.healthBalls.push(this.add.image(this.width / 18 + 120, this.height / 21, 'healthOrb'))
    this.healthBalls.push(this.add.image(this.width / 18 + 80, this.height / 21, 'healthOrb'))
    this.healthBalls.push(this.add.image(this.width / 18 + 40, this.height / 21, 'healthOrb'))
    this.healthBalls.push(this.add.image(this.width / 18, this.height / 21, 'healthOrb'))
    this.healthBarBackground = this.add.image(this.width / 10, this.height / 15.5, 'healthBorder')

    this.healthBarBackground.scaleX = 1
    this.healthBarBackground.scaleY = 1

    this.miniMapName = 'minimap' + this.skyboxName
    if (this.miniMapName.indexOf('/') >= 0) {
      this.miniMapName = this.miniMapName.slice(0, this.miniMapName.indexOf('/'))
    }
    let arrowHoriPos = 0
    let arrowVertPos = 0
    // Sets offsets for the player pointer
    if (this.miniMapName === 'minimapConservatory') {
      arrowHoriPos = this.width * 0.933
      arrowVertPos = this.height / 5.9
    } else if (this.miniMapName === 'minimapReceptionHall') {
      arrowHoriPos = this.width * 0.933
      arrowVertPos = this.height / 8.8
    } else if (this.miniMapName === 'minimapDiningRoom') {
      arrowHoriPos = this.width * 0.9668
      arrowVertPos = this.height / 6.9
    } else if (this.miniMapName === 'minimapLibrary') {
      arrowHoriPos = this.width * 0.936
      arrowVertPos = this.height / 22
    } else if (this.miniMapName === 'minimapCave') {
      arrowHoriPos = this.width * 0.965
      arrowVertPos = this.height / 20
    } else {
      arrowHoriPos = this.width * 1.1
      arrowVertPos = -20
    }

    this.arrow = this.add.image(arrowHoriPos, arrowVertPos, 'arrow')
    this.arrow.setScale(0.8)
    if (__DEV__) console.log(this.miniMapName)
    this.minimap = this.add.image(this.width * 0.95, this.height / 9, 'globalMinimap')

    this.updateHealth(this.healthAmount)

    if (this.showTrace) {
      this.addTraceImage()
    }
  }

  update () {
    if (this.textTimer > 0) {
      this.textTimer -= 0.01
      if (this.textTimer <= 0) {
        this.textImage.destroy()
        this.textScroll.destroy()
      }
    }

  }

  updateHealth (amount) {
    if (typeof this.healthBalls !== 'undefined') {
      for (let i = 0; i < this.healthBalls.length; i++) {
        if (amount - 20 * (4 - i) < 20) {
          this.healthBalls[i].alpha = (amount - 20 * (4 - i)) / 20
        } else {
          this.healthBalls[i].alpha = 1
        }
      }
    }
  }

  setTextImage (itemName) {
    if (itemName === 'book') {
      if (!this.presentation) {
        this.textScroll = this.add.image(this.width / 2, this.height * 0.8, 'scroll').setScale(2)
        this.textImage = this.add.image(this.width / 2, this.height * 0.8, 'text2')
      } else {
        this.textScroll = this.add.image(this.width / 2, this.height * 0.8, 'scroll').setScale(2)
        this.textImage = this.add.image(this.width / 2, this.height * 0.8, 'text3')
      }
      this.textTimer = 3
    } else if (itemName === 'bookKnife') {
      this.textScroll = this.add.image(this.width / 2, this.height * 0.8, 'scroll').setScale(2)
      this.textImage = this.add.image(this.width / 2, this.height * 0.8, 'text3')
      this.textTimer = 3
    } else if (itemName === 'bookCandle') {
      this.textScroll = this.add.image(this.width / 2, this.height * 0.8, 'scroll').setScale(2)
      this.textImage = this.add.image(this.width / 2, this.height * 0.8, 'text4')
      this.textTimer = 3
    } else if (itemName === 'gameWon') {
      this.textScroll = this.add.image(this.width / 2, this.height * 0.8, 'scroll').setScale(2)
      this.textImage = this.add.image(this.width / 2, this.height * 0.8, 'text5')
      this.textTimer = 3
    }
  }

  activatePortal () {
    this.portalBackground.alpha = 1
    this.portalScreen.alpha = 1
    this.portalScreen.play('portalOpen')
    this.portalScreen.on('animationcomplete', this.animComplete, this)
    this.textTimer = 6
  }

  animComplete (animation, frame) {
    this.tweens.add({
      targets: this.portalBackground,
      duration: 300,
      alpha: 0
    })
    this.tweens.add({
      targets: this.portalScreen,
      duration: 300,
      alpha: 0
    })
  }

  // addTraceImage () {
  //   console.log('Trace image added')
  //   if (this.trace) {
  //     this.trace.destroy()
  //   }

  //   this.trace = this.add.image(this.width / 2, this.height / 2, 'trace')
  //   this.trace.setInteractive()
  //   this.trace.scale = 2

  //   // Checks the hue of the image to check if the image is being traced
  //   this.trace.on('pointermove', (pointer) => {
  //     let texLocX = this.trace.x - this.trace.width - pointer.x
  //     texLocX = -texLocX / this.trace.scale
  //     let texLocY = this.trace.y - this.trace.height - pointer.y
  //     texLocY = -texLocY / this.trace.scale
  //     const colorGotten = this.game.textures.getPixel(texLocX, texLocY, 'trace')
  //     if (this.hueChecking) {
  //       const hueDifference = Math.abs(this.prevHue - colorGotten.h)
  //       if (colorGotten.h < 0.12 && colorGotten.h !== 0) {
  //         this.hueChecking = false
  //         console.log('Trace finished!')
  //       }
  //       if (hueDifference > 0.1 || colorGotten.h === 0) {
  //         this.hueChecking = false
  //         console.log('Trace lost')
  //       }
  //     } else {
  //       if (colorGotten.h > 0.97) {
  //         this.hueChecking = true
  //         console.log('Starting Trace')
  //       }
  //     }
  //     this.prevHue = colorGotten.h
  //   }, this)
  // }

  setMapRotation (angle) {
    if (typeof this.arrow !== 'undefined') {
      let bonusAngle = 0
      if (this.miniMapName === 'minimapDiningRoom') {
        bonusAngle = 90
      } else if (this.miniMapName === 'minimapReceptionHall') {
        bonusAngle = 90
      } else if (this.miniMapName === 'minimapLibrary') {
        bonusAngle = 180
      } else if (this.miniMapName === 'minimapCave') {
        bonusAngle = 90
      }
      this.arrow.angle = angle + bonusAngle
    }
  }
}

// Expose the class TestLevel to other files
export default InfoScene
