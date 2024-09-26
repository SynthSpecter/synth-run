const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

canvas.width = 400
canvas.height = 600

class Car {
  constructor(x, y, width, height, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
    // Ajout de détails pour ressembler à une voiture
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

class Player extends Car {
  constructor() {
    super(canvas.width / 2 - 20, canvas.height - 100, 40, 80, '#00ffff')
  }

  move(dx) {
    this.x = Math.max(50, Math.min(canvas.width - 50 - this.width, this.x + dx))
  }
}

class Obstacle extends Car {
  constructor() {
    super(50 + Math.random() * (canvas.width - 140), -80, 40, 80, '#ff0000')
    this.speed = 1 + Math.random()
  }

  update() {
    this.y += this.speed
  }
}

let player = new Player()
let obstacles = []
let score = 0
let gameSpeed = 1

function drawRoad() {
  ctx.fillStyle = '#333333'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(50, 0, 5, canvas.height)
  ctx.fillRect(canvas.width - 55, 0, 5, canvas.height)
}

function spawnObstacle() {
  if (Math.random() < 0.01 * gameSpeed) {
    obstacles.push(new Obstacle())
  }
}

function checkCollisions() {
  obstacles.forEach((obstacle, index) => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      // Collision détectée, fin du jeu
      alert('Game Over! Score: ' + score)
      obstacles = []
      score = 0
      gameSpeed = 1
    }
  })
}

function drawScore() {
  ctx.fillStyle = '#ffffff'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}`, 10, 30)
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawRoad()
  player.draw()

  obstacles.forEach((obstacle, index) => {
    obstacle.update()
    obstacle.draw()
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1)
      score += 10
      gameSpeed += 0.05 // Réduit l'augmentation de la vitesse
    }
  })

  spawnObstacle()
  checkCollisions()
  drawScore()

  requestAnimationFrame(gameLoop)
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      player.move(-10)
      break
    case 'ArrowRight':
      player.move(10)
      break
  }
})

gameLoop()
