// On importe la classe principale du jeu / Import the main game class
import { Game } from './game.js'

// On attend que le HTML soit prêt avant de chercher le canvas / Wait for HTML to be ready before reading the canvas
window.addEventListener('DOMContentLoaded', () => {
  // Le canvas est l'élément où toute la scène du jeu sera dessinée / The canvas is where the whole game scene is drawn
  const canvas = document.getElementById('gameCanvas')

  // On crée une instance du jeu avec ce canvas / Create one game instance using this canvas
  const game = new Game(canvas)

  // On démarre l'initialisation du jeu / Start the game initialization
  game.start()
})
