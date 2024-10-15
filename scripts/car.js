export class Car {
  constructor(x, y, width, height, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }

  // Draw the car on the canvas
  // Dessiner la voiture sur le canvas
  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = '#000000'
    ctx.fillRect(
      this.x,
      this.y + this.height * 0.2,
      this.width,
      this.height * 0.6
    )
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(
      this.x + this.width * 0.1,
      this.y + this.height * 0.3,
      this.width * 0.3,
      this.height * 0.3
    )
    ctx.fillRect(
      this.x + this.width * 0.6,
      this.y + this.height * 0.3,
      this.width * 0.3,
      this.height * 0.3
    )
  }
}
