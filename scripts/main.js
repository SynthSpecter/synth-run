// Import necessary classes and functions
// Importer les classes et fonctions nécessaires
import { Car } from './car.js'
import { Player } from './player.js'
import { Obstacle } from './obstacle.js'
import { Game } from './game.js'

// Initialize the game when the window loads
// Initialiser le jeu lorsque la fenêtre est chargée
window.onload = () => {
  const canvas = document.getElementById('gameCanvas')
  const game = new Game(canvas)
  game.start()
}
