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
    this.isSliding = false
    this.slideDirection = 0
  }

  move(dx) {
    if (this.isSliding) {
      this.x += this.slideDirection * 3
    } else {
      this.x += dx
    }
    this.x = Math.max(50, Math.min(canvas.width - 50 - this.width, this.x))
  }

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

class Obstacle {
  constructor() {
    this.type =
      Math.random() < 0.7 ? 'car' : Math.random() < 0.5 ? 'oil' : 'cone'
    this.x = 50 + Math.random() * (canvas.width - 140)
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

  draw() {
    if (this.type === 'car') {
      new Car(this.x, this.y, this.width, this.height, this.color).draw()
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

  update() {
    this.y += this.speed
  }
}

let player = new Player()
let obstacles = []
let score = 0
let gameSpeed = 1
let gridOffset = 0

function drawSynthwaveGrid() {
  ctx.strokeStyle = '#ff00ff'
  ctx.lineWidth = 1

  // Lignes horizontales
  for (let y = gridOffset % 40; y < canvas.height; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  // Lignes verticales en perspective
  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, canvas.height)
    ctx.lineTo(canvas.width / 2, 0)
    ctx.stroke()
  }

  gridOffset += gameSpeed
}

function drawRoad() {
  ctx.fillStyle = '#333333'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawSynthwaveGrid()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(50, 0, 5, canvas.height)
  ctx.fillRect(canvas.width - 55, 0, 5, canvas.height)
}

function spawnObstacle() {
  if (Math.random() < 0.01 * gameSpeed) {
    obstacles.push(new Obstacle())
  }
}

let gameOver = false

function checkCollisions() {
  if (gameOver) return

  obstacles.forEach((obstacle, index) => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      if (obstacle.type === 'oil') {
        // Effet de glissade pour les flaques d'huile
        player.isSliding = true
        player.slideDirection = Math.random() < 0.5 ? -1 : 1
        obstacles.splice(index, 1)
      } else {
        // Collision animation
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(
          player.x + player.width / 2,
          player.y + player.height / 2,
          50,
          0,
          2 * Math.PI
        )
        ctx.fill()

        gameOver = true
        showGameOverModal()
      }
    }
  })
}

function showGameOverModal() {
  const modal = document.createElement('div')
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
        <h2>Game Over</h2>
        <p>Votre score : ${score}</p>
        <button id="restartButton">Rejouer</button>
    `

  document.body.appendChild(modal)

  document.getElementById('restartButton').addEventListener('click', () => {
    document.body.removeChild(modal)
    resetGame()
    gameLoop()
  })
}

function resetGame() {
  obstacles = []
  score = 0
  gameSpeed = 1
  player.x = canvas.width / 2 - 20
  player.y = canvas.height - 100
  player.isSliding = false
  player.slideDirection = 0
  gameOver = false
}

function drawScore() {
  ctx.fillStyle = '#ffffff'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}`, 10, 30)
}

function gameLoop() {
  if (gameOver) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawRoad()
  player.update()
  player.draw()

  obstacles.forEach((obstacle, index) => {
    obstacle.update()
    obstacle.draw()
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1)
      score += 10
      gameSpeed += 0.05
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
