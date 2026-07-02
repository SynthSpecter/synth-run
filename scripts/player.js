// On réutilise la forme de voiture commune / Reuse the shared car shape
import { Car } from './car.js'

// Voiture contrôlée par le joueur / Player-controlled car
export class Player extends Car {
  // Le joueur connaît la taille du canvas pour rester dans la zone jouable / The player knows canvas size to stay inside the playable area
  constructor(canvasWidth, canvasHeight) {
    // Place le joueur au centre bas de la route / Place the player near the bottom center of the road
    super(canvasWidth / 2 - 20, canvasHeight - 100, 40, 80, '#00f5ff')

    // Indique si la voiture glisse sur une flaque d'huile / Tells whether the car is sliding on oil
    this.isSliding = false
    // Direction temporaire de la glissade : gauche ou droite / Temporary slide direction: left or right
    this.slideDirection = 0
    // Largeur du canvas utilisée pour limiter le joueur / Canvas width used to clamp the player
    this.canvasWidth = canvasWidth
    // Hauteur du canvas utilisée pour limiter le joueur / Canvas height used to clamp the player
    this.canvasHeight = canvasHeight
  }

  // Déplace le joueur avec une vitesse horizontale et verticale / Move the player using horizontal and vertical speed
  move(dx, dy = 0) {
    // La glissade ajoute un décalage automatique / Sliding adds an automatic offset
    const slideOffset = this.isSliding ? this.slideDirection * 3.2 : 0

    // Applique le mouvement horizontal et la glissade / Apply horizontal movement and slide
    this.x += dx + slideOffset
    // Applique le mouvement vertical / Apply vertical movement
    this.y += dy

    // Empêche la voiture de sortir de la route à gauche ou à droite / Keep the car inside the road horizontally
    this.x = Math.max(50, Math.min(this.canvasWidth - 50 - this.width, this.x))
    // Empêche la voiture de sortir du canvas en haut ou en bas / Keep the car inside the canvas vertically
    this.y = Math.max(18, Math.min(this.canvasHeight - this.height - 18, this.y))
  }

  // Active la glissade après une collision avec l'huile / Start sliding after touching oil
  startSlide() {
    // Le joueur entre en état de glissade / The player enters sliding state
    this.isSliding = true
    // La glissade part aléatoirement à gauche ou à droite / The slide randomly goes left or right
    this.slideDirection = Math.random() < 0.5 ? -1 : 1
  }

  // Met à jour l'état du joueur à chaque image / Update player state every frame
  update() {
    // S'il ne glisse pas, il n'y a rien à recalculer / If not sliding, there is nothing to update
    if (!this.isSliding) return

    // Réduit progressivement la force de glissade / Gradually reduce slide strength
    this.slideDirection *= 0.94

    // Quand la glissade devient faible, on l'arrête / Stop sliding when it becomes weak
    if (Math.abs(this.slideDirection) < 0.12) {
      this.isSliding = false
      this.slideDirection = 0
    }
  }
}
