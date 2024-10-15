import { Car } from './car.js'

export class Obstacle {
  constructor(canvasWidth) {
    this.type =
      Math.random() < 0.7 ? 'car' : Math.random() < 0.5 ? 'oil' : 'cone'
    this.x = 50 + Math.random() * (canvasWidth - 140)
    this.y = -80
    this.speed = 1 + Math.random()

    if (this.type === 'car') {
      this.width = 40
      this.height = 80
      this.color = '#ff0000'
    } else if (this.type === 'oil') {
      this.width = 60
      this.height = 60
      this.color = '#333333'
    } else {
      this.width = 30
      this.height = 30
      this.color = '#ff8800'
    }
  }

  // Draw the obstacle on the canvas
  // Dessiner l'obstacle sur le canvas
  draw(ctx) {
    if (this.type === 'car') {
      new Car(this.x, this.y, this.width, this.height, this.color).draw(ctx)
    } else if (this.type === 'oil') {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        0,
        2 * Math.PI
      )
      ctx.fill()
    } else {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.moveTo(this.x + this.width / 2, this.y)
      ctx.lineTo(this.x + this.width, this.y + this.height)
      ctx.lineTo(this.x, this.y + this.height)
      ctx.closePath()
      ctx.fill()
    }
  }

  // Update obstacle position
  // Mettre à jour la position de l'obstacle
  update() {
    this.y += this.speed
  }
}
