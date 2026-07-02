// Les obstacles de type voiture utilisent le dessin de Car / Car obstacles reuse the Car drawing
import { Car } from './car.js'

// Obstacles de route / Road obstacles
export class Obstacle {
  // Un obstacle est créé au-dessus de l'écran puis descend / An obstacle starts above the screen and moves down
  constructor(canvasWidth) {
    // Choisit le type d'obstacle : voiture, huile ou cône / Choose obstacle type: car, oil, or cone
    this.type = this.pickType()
    // Place l'obstacle au hasard dans la largeur de la route / Place the obstacle randomly within the road width
    this.x = 58 + Math.random() * (canvasWidth - 156)
    // Commence hors écran pour entrer naturellement / Start off-screen for a natural entrance
    this.y = -80
    // Chaque obstacle a une vitesse légèrement différente / Each obstacle has a slightly different speed
    this.speed = 1.1 + Math.random() * 1.2

    // Les voitures sont hautes et étroites / Cars are tall and narrow
    if (this.type === 'car') {
      this.width = 40
      this.height = 80
    // Les flaques sont plus larges que hautes / Oil slicks are wider than tall
    } else if (this.type === 'oil') {
      this.width = 58
      this.height = 42
    // Les cônes sont petits / Cones are small
    } else {
      this.width = 34
      this.height = 34
    }
  }

  // Détermine la rareté de chaque obstacle / Decide how often each obstacle appears
  pickType() {
    // Nombre aléatoire entre 0 et 1 / Random number between 0 and 1
    const roll = Math.random()
    // 64 % de chances d'avoir une voiture / 64% chance to get a car
    if (roll < 0.64) return 'car'
    // 20 % de chances d'avoir de l'huile / 20% chance to get oil
    if (roll < 0.84) return 'oil'
    // Le reste donne un cône / The remaining chance gives a cone
    return 'cone'
  }

  // Redirige vers la bonne méthode de dessin selon le type / Route drawing to the right method for the type
  draw(ctx, palette) {
    // Une voiture obstacle se dessine comme une voiture normale / A car obstacle is drawn like a regular car
    if (this.type === 'car') {
      new Car(this.x, this.y, this.width, this.height, palette.car).draw(ctx, palette)
      return
    }

    // Une flaque d'huile est dessinée en ellipse / An oil slick is drawn as an ellipse
    if (this.type === 'oil') {
      this.drawOil(ctx, palette)
      return
    }

    // Sinon, l'obstacle est un cône triangulaire / Otherwise, the obstacle is a triangular cone
    this.drawCone(ctx, palette)
  }

  // Dessine une flaque d'huile / Draw an oil slick
  drawOil(ctx, palette) {
    // Sauvegarde les styles actuels du canvas / Save current canvas styles
    ctx.save()
    // Couleur de remplissage de l'huile / Oil fill color
    ctx.fillStyle = palette.oil
    // Contour néon pour rester lisible / Neon outline to stay readable
    ctx.strokeStyle = palette.accent
    // Épaisseur du contour / Outline thickness
    ctx.lineWidth = 2
    // Commence une nouvelle forme / Start a new shape
    ctx.beginPath()
    // Dessine une ellipse centrée sur l'obstacle / Draw an ellipse centered on the obstacle
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      this.height / 2,
      0,
      0,
      2 * Math.PI,
    )
    // Remplit la flaque / Fill the slick
    ctx.fill()
    // Dessine son contour / Draw its outline
    ctx.stroke()
    // Restaure les styles précédents / Restore previous styles
    ctx.restore()
  }

  // Dessine un cône / Draw a cone
  drawCone(ctx, palette) {
    // Sauvegarde l'état du canvas / Save canvas state
    ctx.save()
    // Couleur intérieure du cône / Cone fill color
    ctx.fillStyle = palette.cone
    // Contour du cône / Cone outline
    ctx.strokeStyle = palette.accent
    // Épaisseur du contour / Outline thickness
    ctx.lineWidth = 2
    // Commence le triangle / Start the triangle
    ctx.beginPath()
    // Pointe haute du triangle / Top point of the triangle
    ctx.moveTo(this.x + this.width / 2, this.y)
    // Coin bas droit / Bottom-right corner
    ctx.lineTo(this.x + this.width, this.y + this.height)
    // Coin bas gauche / Bottom-left corner
    ctx.lineTo(this.x, this.y + this.height)
    // Ferme la forme / Close the shape
    ctx.closePath()
    // Remplit le cône / Fill the cone
    ctx.fill()
    // Dessine le contour / Draw the outline
    ctx.stroke()
    // Restaure l'état précédent / Restore previous state
    ctx.restore()
  }

  // Fait descendre l'obstacle / Move the obstacle downward
  update(gameSpeed) {
    // La vitesse du jeu multiplie la vitesse propre de l'obstacle / Game speed multiplies this obstacle's own speed
    this.y += this.speed * gameSpeed
  }
}
