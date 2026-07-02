// Classe de base pour dessiner une voiture / Base class used to draw a car
export class Car {
  // Le constructeur stocke la position, la taille et la couleur / The constructor stores position, size, and color
  constructor(x, y, width, height, color) {
    // Position horizontale sur le canvas / Horizontal position on the canvas
    this.x = x
    // Position verticale sur le canvas / Vertical position on the canvas
    this.y = y
    // Largeur de la voiture / Car width
    this.width = width
    // Hauteur de la voiture / Car height
    this.height = height
    // Couleur principale de la carrosserie / Main body color
    this.color = color
  }

  // Dessine la voiture avec des rectangles simples / Draws the car using simple rectangles
  draw(ctx, palette = {}) {
    // Sauvegarde l'état du canvas avant nos styles / Save the canvas state before our styles
    ctx.save()

    // Ajoute une lueur néon autour du véhicule / Add a neon glow around the vehicle
    ctx.shadowColor = palette.accent || this.color
    ctx.shadowBlur = 8

    // Dessine la carrosserie / Draw the car body
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // Retire la lueur pour les détails intérieurs / Remove glow for inner details
    ctx.shadowBlur = 0

    // Dessine le pare-brise sombre / Draw the dark windshield area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
    ctx.fillRect(
      this.x + this.width * 0.08,
      this.y + this.height * 0.22,
      this.width * 0.84,
      this.height * 0.56,
    )

    // Dessine deux vitres claires / Draw two light windows
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(
      this.x + this.width * 0.14,
      this.y + this.height * 0.32,
      this.width * 0.26,
      this.height * 0.22,
    )
    ctx.fillRect(
      this.x + this.width * 0.6,
      this.y + this.height * 0.32,
      this.width * 0.26,
      this.height * 0.22,
    )

    // Restaure l'état précédent du canvas / Restore the previous canvas state
    ctx.restore()
  }
}
