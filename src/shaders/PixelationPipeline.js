/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the GLSL fragment shader (make sure webpack is setup to use raw-loader)
import fragString from './PixelationPipeline.frag'

/**
 * A custom shader pipeline that pixelized the image
 */
class PixelationPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  constructor (game) {
    // Pass parameters to the parent class
    super({
      game: game,
      renderer: game.renderer,
      fragShader: fragString
    })

    // Default values for members
    this._res = { width: game.config.width, height: game.config.height }
    this.setFloat1('pixelDensity', 120.0)
  }

  /**
   * Set the resolution parameter
   * @param {Object} newRes Resolution of the buffer with a width and height parameter
   */
  set res (newRes) {
    this._res.width = newRes.width
    this._res.height = newRes.height
    this.setFloat2('aspectRatioMultiplier',
      this._res.width / this._res.height, 1)
    if (__DEV__) console.log('set resolution')
  }
}

export default PixelationPipeline
