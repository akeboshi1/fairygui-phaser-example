
/* globals __DEV__ */

// Import the entire 'phaser' namespace
import PathObject from '../sprites/PathObject'

class PanoSprite extends Phaser.GameObjects.Sprite {
  constructor ({ scene, angX, angY, textureKey, perspectiveStrength, canScale }) {
    // Initialize object basics
    super(scene, 0, 0, textureKey)

    // Save the longitude and latitude position
    this.angX = angX || 0
    this.angY = angY || 0

    this.canScale = canScale

    this.storedTime = 0

    // Set strength of perspective effect
    this.perspectiveStrength = perspectiveStrength || 1.0

    // Save base scale (defaults to 1.0)
    this.baseScaleX = 1.0
    this.baseScaleY = 1.0

    this.key = textureKey

    this.viewDifference = 0.0

    this.paths = []

    this.pathLoops = false

    this.requirement = undefined

    this.angleSet = false
  }

  setScale (xVal, yVal) {
    xVal = xVal || 1.0
    yVal = yVal || xVal

    this.baseScaleX = xVal
    this.baseScaleY = yVal
    super.setScale(xVal, yVal)
  }

  updatePanoPosition (orbit, hFOV, vFOV, widthPixels, heightPixels) {
    // Updates sprite's position based on applied paths
    this.updatePaths()
    // Grab angular values from orbit controls
    // - Returned in radians so convert to degrees
    // - Invert them so motion matches inside of spherical map
    // - Offset polar angle by 90 so equator is at 0
    const viewX = -orbit.getAzimuthalAngle() * 180 / Math.PI
    const viewY = -(orbit.getPolarAngle() * 180 / Math.PI - 90)

    // Wrap the x value to the correct range
    let xWrap = this.angX
    if (xWrap > 180) {
      xWrap -= 360
    }
    if (xWrap < -180) {
      xWrap += 360
    }

    // Compute normalized world position
    let xnValue = (xWrap - viewX)
    if (xnValue < -180) {
      xnValue += 360
    }
    if (xnValue > 180) {
      xnValue -= 360
    }
    const xn = xnValue / hFOV
    // Sets the view difference for 3D audio usage
    this.viewDifference = xnValue
    // Make the vertical FOV negative to counteract shader weirdness
    const yn = (this.angY - viewY) / -vFOV

    // Change units to pixels to set world coorinates
    // - We offset by 0.5 to center on screen
    this.setPosition((xn + 0.5) * widthPixels, (yn + 0.5) * heightPixels)

    // Add scaling when near edges of view to simulate perspective
    const scaler = Math.sqrt(xn * xn + yn * yn) * this.perspectiveStrength
    if (this.canScale) {
      super.setScale(
        this.baseScaleX + scaler * this.baseScaleX,
        this.baseScaleY + scaler * this.baseScaleY
      )
    }
    // Updates the 3D audio
    this.update3dAudio()
    this.angleSet = true
  }

  // Adds a path for the sprite to follow
  addPath (newAngX, newAngY, newScale, speed, trigger) {
    const pathObject = new PathObject()
    if (typeof trigger === 'number') { // If the trigger is a timer
      pathObject.triggerEvent = 'number'
      pathObject.timerNumber = trigger
      if (__DEV__) console.log(trigger)
    } else if (typeof trigger === 'string') { // If the trigger is a item
      pathObject.neededItem = trigger
    } else { // No trigger defined
      pathObject.isReady = true
    }

    // Sets the initial position of path (current pos if first path, previous paths end otherwise)
    if (this.paths.length === 0) {
      pathObject.initialPosX = this.angX
      pathObject.initialPosY = this.angY
      pathObject.initialScale = this.baseScaleX
    } else {
      pathObject.initialPosX = this.paths[this.paths.length - 1].targetPosX
      pathObject.initialPosY = this.paths[this.paths.length - 1].targetPosY
      pathObject.initialScale = this.paths[this.paths.length - 1].targetScale
    }
    pathObject.targetPosX = newAngX
    pathObject.targetPosY = newAngY
    pathObject.targetScale = newScale
    pathObject.speed = speed

    this.paths.push(pathObject)
  }

  // Updates the sprite position based on paths
  updatePaths () {
    if (this.paths.length > 0) {
      if (this.paths[0].isReady) { // Check if the condition is met to let the sprite move
        let pathDone = false
        this.paths[0].progress += 0.005 * this.paths[0].speed
        if (this.paths[0].progress >= 1.0) {
          this.paths[0].progress = 1.0
          pathDone = true
        }
        this.triggerString = ''
        if (this.paths[0].triggerEvent === 'number') {
          this.triggerString = this.paths[0].timerNumber
        } else {
          this.triggerString = this.paths[0].neededItem
        }
        // Calculates the new movement position and scale, and updates the sprites to match
        const currentPosX = Phaser.Math.Linear(this.paths[0].initialPosX, this.paths[0].targetPosX, this.paths[0].progress)
        const currentPosY = Phaser.Math.Linear(this.paths[0].initialPosY, this.paths[0].targetPosY, this.paths[0].progress)
        const currentScale = Phaser.Math.Linear(this.paths[0].initialScale, this.paths[0].targetScale, this.paths[0].progress)
        this.angX = currentPosX
        this.angY = currentPosY
        this.setScale(currentScale)
        // Removes the path if completed
        if (pathDone) {
          if (this.pathLoops) {
            if (this.triggerString !== '') {
              this.addPath(this.paths[0].targetPosX, this.paths[0].targetPosY, this.paths[0].targetScale, this.paths[0].speed, this.triggerString)
            } else {
              this.addPath(this.paths[0].targetPosX, this.paths[0].targetPosY, this.paths[0].targetScale, this.paths[0].speed)
            }
          }
          this.paths.shift()
        }
      } else {
        if (this.paths[0].triggerEvent === 'number') {
          this.updateTimer(this.paths[0])
        }
      }
    }
  }

  updateTimer (pathObject) {
    if (pathObject.timerNumber > this.storedTime) {
      this.storedTime = pathObject.timerNumber
    }
    pathObject.timerNumber -= 0.012
    if (pathObject.timerNumber <= 0) {
      pathObject.isReady = true
      pathObject.timerNumber = this.storedTime
      this.storedTime = 0
      if (__DEV__) console.log('Monster path timer has expired')
    }
  }

  updatePathItems (collectedList) {
    for (let p = 0; p < this.paths.length; p++) {
      if (typeof this.paths[p].neededItem !== 'undefined' && !this.paths[p].isReady) {
        let haveRequirement = false
        for (let i = 0; i < collectedList.length; i++) {
          if (collectedList[i] === this.paths[p].neededItem) {
            haveRequirement = true
          }
        }
        if (haveRequirement) {
          if (__DEV__) console.log('Monster has item to allow path')
        }
        this.paths[p].isReady = haveRequirement
      }
    }
  }

  // Converts the angle facing to 3d volume strengths for left and right ear
  update3dAudio () {
    let angleToMonster = this.viewDifference
    // Correctes the weird offset we get from pano angle
    if (angleToMonster > 180) {
      angleToMonster = -180 + (angleToMonster - 180)
    }
    let leftEarVolume = 0.5
    let rightEarVolume = 0.5
    if (angleToMonster <= 0) {
      leftEarVolume = (Math.cos(angleToMonster / 180 * Math.PI) + 1.0) / 4.0 + 0.5
      if (angleToMonster < -90) {
        rightEarVolume = 0.5 - (1 + Math.cos(angleToMonster / 180 * Math.PI)) * 0.25
      } else {
        rightEarVolume = 0.25 + Math.cos(angleToMonster / 180 * Math.PI) * 0.75
      }
    } else {
      rightEarVolume = (Math.cos(angleToMonster / 180 * Math.PI) + 1.0) / 4.0 + 0.5
      if (angleToMonster > 90) {
        leftEarVolume = 0.5 - (1 + Math.cos(angleToMonster / 180 * Math.PI)) * 0.25
      } else {
        leftEarVolume = 0.25 + Math.cos(angleToMonster / 180 * Math.PI) * 0.75
      }
    }
    if (typeof this.leftSound !== 'undefined') {
      this.leftSound.setVolume(leftEarVolume)
      this.rightSound.setVolume(rightEarVolume)
    }
  }

  // Plays the sound added to the monster using 3D audio
  playSound () {
    while (!this.angleSet) {}
    if (__DEV__) console.log(this.viewDifference)
    this.leftSound.play()
    this.rightSound.play()
  }

  // Adds a sound to the monster based on name of the file
  addSound (scene, soundName, speedRate = 1) {
    this.leftSound = scene.sound.add(soundName.concat('Left'), { rate: speedRate })
    this.rightSound = scene.sound.add(soundName.concat('Right'), { rate: speedRate })
  }
}

// Expose the MainPlayer class to other files
export default PanoSprite
