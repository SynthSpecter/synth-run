import { Player } from './player.js'
import { Obstacle } from './obstacle.js'

export class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.canvas.width = 400
    this.canvas.height = 600
    this.player = new Player(this.canvas.width, this.canvas.height)
    this.obstacles = []
    this.score = 0
    this.gameSpeed = 1
    this.gridOffset = 0
    this.gameOver = false
    this.isInMainMenu = true
  }

  // Start the game
  // Démarrer le jeu
  start() {
    this.showMainMenu()
    this.addEventListeners()
    this.gameLoop()
  }

  showMainMenu() {
    const menu = document.createElement('div')
    menu.className = 'synthwave-modal'
    menu.style.position = 'absolute'
    menu.style.top = '50%'
    menu.style.left = '50%'
    menu.style.transform = 'translate(-50%, -50%)'
    menu.style.background = 'rgba(0, 0, 0, 0.8)'
    menu.style.padding = '20px'
    menu.style.borderRadius = '10px'
    menu.style.color = '#fff'
    menu.style.textAlign = 'center'

    menu.innerHTML = `
            <h1 class="synthwave-title">Synth Run</h1>
            <p class="synthwave-text">Bienvenue !</p>
            <h2 class="synthwave-text">But du jeu</h2>
            <p class="synthwave-text">Évitez les obstacles et parcourez la plus grande distance possible.</p>
            <h2 class="synthwave-text">Items</h2>
            <ul class="synthwave-list">
                <li>🚗 Voitures : À éviter</li>
                <li>🛢️ Flaques d'huile : Vous font glisser</li>
                <li>🚧 Cônes : À éviter</li>
            </ul>
            <button id="startButton" class="synthwave-button">Commencer le jeu</button>
        `

    document.body.appendChild(menu)

    document.getElementById('startButton').addEventListener('click', () => {
      document.body.removeChild(menu)
      this.isInMainMenu = false
      this.gameLoop()
    })
  }

  // Main game loop
  // Boucle principale du jeu
  gameLoop() {
    if (this.isInMainMenu) return
    if (this.gameOver) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawRoad()
    this.player.update()
    this.player.draw(this.ctx)

    this.updateObstacles()
    this.spawnObstacle()
    this.checkCollisions()
    this.drawScore()

    requestAnimationFrame(() => this.gameLoop())
  }

  // Draw the synthwave grid
  // Dessiner la grille synthwave
  drawSynthwaveGrid() {
    this.ctx.strokeStyle = '#ff00ff'
    this.ctx.lineWidth = 1

    // Lignes horizontales
    for (let y = this.gridOffset % 40; y < this.canvas.height; y += 40) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.canvas.width, y)
      this.ctx.stroke()
    }

    // Lignes verticales en perspective
    for (let x = 0; x <= this.canvas.width; x += 40) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, this.canvas.height)
      this.ctx.lineTo(this.canvas.width / 2, 0)
      this.ctx.stroke()
    }

    this.gridOffset += this.gameSpeed
  }

  // Draw the road
  // Dessiner la route
  drawRoad() {
    this.ctx.fillStyle = '#333333'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawSynthwaveGrid()
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(50, 0, 5, this.canvas.height)
    this.ctx.fillRect(this.canvas.width - 55, 0, 5, this.canvas.height)
  }

  // Spawn new obstacles
  // Faire apparaître de nouveaux obstacles
  spawnObstacle() {
    if (Math.random() < 0.01 * this.gameSpeed) {
      this.obstacles.push(new Obstacle(this.canvas.width))
    }
  }

  // Check for collisions
  // Vérifier les collisions
  checkCollisions() {
    if (this.gameOver) return

    this.obstacles.forEach((obstacle, index) => {
      if (
        this.player.x < obstacle.x + obstacle.width &&
        this.player.x + this.player.width > obstacle.x &&
        this.player.y < obstacle.y + obstacle.height &&
        this.player.y + this.player.height > obstacle.y
      ) {
        if (obstacle.type === 'oil') {
          // Effet de glissade pour les flaques d'huile
          this.player.isSliding = true
          this.player.slideDirection = Math.random() < 0.5 ? -1 : 1
          this.obstacles.splice(index, 1)
        } else {
          // Collision animation
          this.ctx.fillStyle = '#ffffff'
          this.ctx.beginPath()
          this.ctx.arc(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            50,
            0,
            2 * Math.PI
          )
          this.ctx.fill()

          this.gameOver = true
          this.showGameOverModal()
        }
      }
    })
  }

  // Show game over modal
  // Afficher la fenêtre modale de fin de jeu
  showGameOverModal() {
    const modal = document.createElement('div')
    modal.className = 'synthwave-modal'
    modal.style.position = 'absolute'
    modal.style.top = '50%'
    modal.style.left = '50%'
    modal.style.transform = 'translate(-50%, -50%)'
    modal.style.background = 'rgba(0, 0, 0, 0.8)'
    modal.style.padding = '20px'
    modal.style.borderRadius = '10px'
    modal.style.color = '#fff'
    modal.style.textAlign = 'center'

    modal.innerHTML = `
            <h2 class="synthwave-title">Game Over</h2>
            <p class="synthwave-text">Votre score : ${this.score}</p>
            <button id="restartButton" class="synthwave-button">Rejouer</button>
            <button id="menuButton" class="synthwave-button">Retour au menu</button>
        `

    document.body.appendChild(modal)

    document.getElementById('restartButton').addEventListener('click', () => {
      document.body.removeChild(modal)
      this.resetGame()
      this.gameLoop()
    })

    document.getElementById('menuButton').addEventListener('click', () => {
      document.body.removeChild(modal)
      this.resetGame()
      this.showMainMenu()
    })
  }

  // Reset the game
  // Réinitialiser le jeu
  resetGame() {
    this.obstacles = []
    this.score = 0
    this.gameSpeed = 1
    this.player.x = this.canvas.width / 2 - 20
    this.player.y = this.canvas.height - 100
    this.player.isSliding = false
    this.player.slideDirection = 0
    this.gameOver = false
  }

  // Draw the score
  // Afficher le score
  drawScore() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '20px Arial'
    this.ctx.fillText(`Score: ${this.score}`, 10, 30)
  }

  // Update and draw obstacles
  // Mettre à jour et dessiner les obstacles
  updateObstacles() {
    this.obstacles.forEach((obstacle, index) => {
      obstacle.update()
      obstacle.draw(this.ctx)
      if (obstacle.y > this.canvas.height) {
        this.obstacles.splice(index, 1)
        this.score += 10
        this.gameSpeed += 0.05
      }
    })
  }

  // Add event listeners
  // Ajouter des écouteurs d'événements
  addEventListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.player.move(-10)
          break
        case 'ArrowRight':
          this.player.move(10)
          break
      }
    })
  }
}
