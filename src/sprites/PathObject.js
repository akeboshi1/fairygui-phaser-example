export default class PathObject {
  constructor () {
    this.initialPosX = 0.0
    this.initialPosY = 0.0
    this.initialScale = 0.0

    this.targetPosX = 0.0
    this.targetPosY = 0.0
    this.targetScale = 0.0

    this.progress = 0.0
    this.speed = 0.0
    this.isReady = false
  }
}
