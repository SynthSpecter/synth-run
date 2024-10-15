import { Car } from './car.js'

export class Player extends Car {
  constructor(canvasWidth, canvasHeight) {
    super(canvasWidth / 2 - 20, canvasHeight - 100, 40, 80, '#00ffff')
    this.isSliding = false
    this.slideDirection = 0
    this.canvasWidth = canvasWidth
  }

  // Move the player horizontally
  // Déplacer le joueur horizontalement
  move(dx) {
    if (this.isSliding) {
      this.x += this.slideDirection * 3
    } else {
      this.x += dx
    }
    this.x = Math.max(50, Math.min(this.canvasWidth - 50 - this.width, this.x))
  }

  // Update player state
  // Mettre à jour l'état du joueur
  update() {
    if (this.isSliding) {
      this.slideDirection *= 0.95
      if (Math.abs(this.slideDirection) < 0.1) {
        this.isSliding = false
        this.slideDirection = 0
      }
    }
  }
}
