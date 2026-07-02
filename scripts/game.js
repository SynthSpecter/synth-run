// Le joueur est la voiture contrôlée au clavier / The player is the keyboard-controlled car
import { Player } from './player.js'
// Les obstacles descendent sur la route / Obstacles move down the road
import { Obstacle } from './obstacle.js'
// Les textes traduits et le choix initial de langue / Translated texts and initial language choice
import { TRANSLATIONS, getInitialLanguage } from './translations.js'

// Clés utilisées dans localStorage / Keys used in localStorage
const STORAGE_KEYS = {
  // Sauvegarde du meilleur score / Saved high score
  highScore: 'synth-run-high-score',
  // Sauvegarde du thème choisi / Saved selected theme
  theme: 'synth-run-theme',
  // Sauvegarde de la langue choisie / Saved selected language
  language: 'synth-run-language',
}

// Cartographie clavier FR/EN / FR/EN keyboard mapping
const CONTROL_KEYS = {
  // Flèche gauche / Left arrow
  ArrowLeft: 'left',
  // Touche Q pour clavier AZERTY / Q key for AZERTY keyboard
  q: 'left',
  Q: 'left',
  // Flèche droite / Right arrow
  ArrowRight: 'right',
  // Touche D commune AZERTY/QWERTY / D key shared by AZERTY/QWERTY
  d: 'right',
  D: 'right',
  // Flèche haut / Up arrow
  ArrowUp: 'up',
  // Touche Z pour clavier AZERTY / Z key for AZERTY keyboard
  z: 'up',
  Z: 'up',
  // Flèche bas / Down arrow
  ArrowDown: 'down',
  // Touche S commune AZERTY/QWERTY / S key shared by AZERTY/QWERTY
  s: 'down',
  S: 'down',
}

// Classe principale qui orchestre le jeu / Main class that orchestrates the game
export class Game {
  // Le constructeur prépare toutes les données nécessaires / The constructor prepares every needed value
  constructor(canvas) {
    // Élément canvas reçu depuis index.html / Canvas element received from index.html
    this.canvas = canvas
    // Contexte 2D : outil de dessin du canvas / 2D context: canvas drawing tool
    this.ctx = canvas.getContext('2d')
    // Largeur logique du jeu / Logical game width
    this.canvas.width = 400
    // Hauteur logique du jeu / Logical game height
    this.canvas.height = 600
    // Création du joueur / Create the player
    this.player = new Player(this.canvas.width, this.canvas.height)
    // Liste des obstacles actuellement à l'écran / List of obstacles currently on screen
    this.obstacles = []
    // Score de la partie en cours / Current run score
    this.score = 0
    // Meilleur score relu depuis le navigateur / High score read from browser storage
    this.highScore = Number(localStorage.getItem(STORAGE_KEYS.highScore)) || 0
    // Vitesse globale du jeu / Global game speed
    this.gameSpeed = 1
    // Décalage de la grille pour créer le mouvement / Grid offset used to create movement
    this.gridOffset = 0
    // Indique si la partie est terminée / Tells whether the run is over
    this.gameOver = false
    // Indique si le menu principal est affiché / Tells whether the main menu is shown
    this.isInMainMenu = true
    // Ensemble des directions actuellement pressées / Set of directions currently pressed
    this.activeDirections = new Set()
    // Référence vers la modale active / Reference to the active modal
    this.modal = null
    // Identifiant de requestAnimationFrame pour pouvoir annuler la boucle / requestAnimationFrame id used to cancel the loop
    this.animationFrameId = null
    // Bouton de thème récupéré dans le HTML / Theme button read from HTML
    this.themeToggle = document.getElementById('themeToggle')
    // Boutons de langue récupérés dans le HTML / Language buttons read from HTML
    this.languageButtons = {
      fr: document.getElementById('frButton'),
      en: document.getElementById('enButton'),
    }
    // Langue initiale : préférence sauvegardée ou navigateur / Initial language: saved preference or browser
    this.language = getInitialLanguage()
  }

  // Démarre l'application du jeu / Start the game application
  start() {
    // Applique les textes dans la bonne langue / Apply texts in the right language
    this.applyLanguage()
    // Applique le thème sauvegardé / Apply saved theme
    this.applySavedTheme()
    // Branche les événements clavier et boutons / Bind keyboard and button events
    this.addEventListeners()
    // Affiche le menu principal / Show the main menu
    this.showMainMenu()
    // Dessine une scène fixe derrière le menu / Draw a static scene behind the menu
    this.drawIdleScene()
  }

  // Gestion du thème / Theme management
  applySavedTheme() {
    // Relit le thème sauvegardé ou utilise le sombre / Read saved theme or use dark
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'dark'
    // Applique ce thème au document / Apply this theme to the document
    this.setTheme(savedTheme)
  }

  // Inverse le thème courant / Toggle the current theme
  toggleTheme() {
    // Lit le thème actuellement posé sur <html> / Read current theme on <html>
    const currentTheme = document.documentElement.dataset.theme || 'dark'
    // Choisit l'autre thème / Choose the other theme
    this.setTheme(currentTheme === 'dark' ? 'light' : 'dark')
    // Redessine la scène si le jeu n'est pas en train de tourner / Redraw the scene if the game is not running
    this.drawIdleScene()
  }

  // Pose un thème précis / Set one exact theme
  setTheme(theme) {
    // Sécurise la valeur : seulement light ou dark / Sanitize value: only light or dark
    const nextTheme = theme === 'light' ? 'light' : 'dark'

    // data-theme permet au CSS de changer les couleurs / data-theme lets CSS switch colors
    document.documentElement.dataset.theme = nextTheme
    // Sauvegarde le choix dans le navigateur / Save the choice in the browser
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme)
    // Met à jour le label accessible du bouton / Update the accessible button label
    this.themeToggle.setAttribute(
      'aria-label',
      nextTheme === 'light' ? this.t('themeToDark') : this.t('themeToLight'),
    )
  }

  // Gestion de la langue / Language management
  setLanguage(language) {
    // Utilise la langue demandée si elle existe, sinon français / Use requested language if available, otherwise French
    this.language = TRANSLATIONS[language] ? language : 'fr'
    // Sauvegarde la langue pour les prochaines visites / Save language for next visits
    localStorage.setItem(STORAGE_KEYS.language, this.language)
    // Applique les textes statiques / Apply static texts
    this.applyLanguage()
    // Reconstruit le menu ou la modale si besoin / Rebuild menu or modal if needed
    this.refreshLocalizedState()
  }

  // Applique la langue aux éléments déjà présents dans le HTML / Apply language to existing HTML elements
  applyLanguage() {
    // Change l'attribut lang pour l'accessibilité / Update lang attribute for accessibility
    document.documentElement.lang = this.language
    // Change le titre de l'onglet / Update browser tab title
    document.title = this.t('documentTitle')
    // Change la meta description / Update meta description
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', this.t('description'))
    // Change le label accessible du canvas / Update accessible canvas label
    this.canvas.setAttribute('aria-label', this.t('canvasLabel'))
    // Change le label du groupe de préférences / Update preferences group label
    document
      .querySelector('.toolbar-controls')
      ?.setAttribute('aria-label', this.t('preferencesLabel'))
    // Change le label du sélecteur de langue / Update language selector label
    document
      .querySelector('.language-toggle')
      ?.setAttribute('aria-label', this.t('languageLabel'))

    // Met à jour l'état visuel et ARIA des boutons FR/EN / Update visual and ARIA state of FR/EN buttons
    Object.entries(this.languageButtons).forEach(([language, button]) => {
      button.classList.toggle('active', language === this.language)
      button.setAttribute('aria-pressed', String(language === this.language))
    })

    // Relit le thème courant pour choisir le bon label / Read current theme to choose the right label
    const theme = document.documentElement.dataset.theme || 'dark'
    // Met à jour le label du bouton de thème / Update theme button label
    this.themeToggle.setAttribute(
      'aria-label',
      theme === 'light' ? this.t('themeToDark') : this.t('themeToLight'),
    )
  }

  // Rafraîchit les textes dynamiques selon l'état du jeu / Refresh dynamic texts according to game state
  refreshLocalizedState() {
    // Si le menu est visible, on le reconstruit dans la nouvelle langue / If menu is visible, rebuild it in the new language
    if (this.isInMainMenu) {
      this.showMainMenu()
      this.drawIdleScene()
      return
    }

    // Si la partie est finie, on reconstruit la modale de fin / If run is over, rebuild the game-over modal
    if (this.gameOver) this.showGameOverModal()
  }

  // Affiche le menu principal / Show the main menu
  showMainMenu() {
    // Le jeu passe en état menu / Game enters menu state
    this.isInMainMenu = true
    // On s'assure que l'état game over est désactivé / Ensure game-over state is disabled
    this.gameOver = false
    // On vide les touches actives pour éviter un mouvement fantôme / Clear active keys to avoid ghost movement
    this.activeDirections.clear()
    // Crée une modale avec textes traduits / Create a modal with translated texts
    this.openModal({
      title: 'Synth Run',
      lines: [
        this.t('menuIntro'),
        this.t('controlsHint'),
        `${this.t('highScore')} : ${this.highScore}`,
      ],
      items: [this.t('carsItem'), this.t('oilItem'), this.t('conesItem')],
      actions: [
        {
          label: this.t('start'),
          onClick: () => this.startRun(),
        },
      ],
    })
  }

  // Lance une nouvelle partie / Start a new run
  startRun() {
    // Ferme le menu / Close the menu
    this.closeModal()
    // Réinitialise les données de partie / Reset run data
    this.resetGame()
    // Le menu n'est plus actif / Menu is no longer active
    this.isInMainMenu = false
    // Démarre la boucle d'animation / Start animation loop
    this.gameLoop()
  }

  // Boucle principale appelée à chaque image / Main loop called every frame
  gameLoop() {
    // Ne dessine pas si le menu ou la fin de partie bloque le jeu / Do not draw if menu or game-over blocks the game
    if (this.isInMainMenu || this.gameOver) return

    // Efface l'image précédente / Clear previous frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // Dessine la route et la grille / Draw road and grid
    this.drawRoad()
    // Traduit les touches pressées en mouvement / Convert pressed keys into movement
    this.updatePlayerFromInput()
    // Met à jour l'état du joueur / Update player state
    this.player.update()
    // Dessine le joueur / Draw the player
    this.player.draw(this.ctx, this.getPalette())
    // Met à jour et dessine les obstacles / Update and draw obstacles
    this.updateObstacles()
    // Crée parfois un nouvel obstacle / Sometimes spawn a new obstacle
    this.spawnObstacle()
    // Vérifie les collisions / Check collisions
    this.checkCollisions()
    // Dessine le score / Draw score
    this.drawScore()

    // Demande au navigateur la prochaine image / Ask browser for the next frame
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop())
  }

  // Dessine une scène fixe quand on est au menu ou en pause de boucle / Draw a still scene while menu is visible or loop is stopped
  drawIdleScene() {
    // Si le jeu tourne vraiment, cette méthode ne doit rien faire / If the game is actually running, this method should do nothing
    if (!this.isInMainMenu && !this.gameOver) return

    // Efface le canvas / Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // Dessine la route / Draw road
    this.drawRoad()
    // Dessine le joueur immobile / Draw idle player
    this.player.draw(this.ctx, this.getPalette())
    // Dessine le score actuel / Draw current score
    this.drawScore()
  }

  // Convertit l'état des touches en mouvement du joueur / Convert active keys into player movement
  updatePlayerFromInput() {
    // Mouvement horizontal brut / Raw horizontal movement
    let dx = 0
    // Mouvement vertical brut / Raw vertical movement
    let dy = 0
    // Vitesse de déplacement du joueur / Player movement speed
    const movementSpeed = 5.4

    // Gauche / Left
    if (this.activeDirections.has('left')) dx -= 1
    // Droite / Right
    if (this.activeDirections.has('right')) dx += 1
    // Haut / Up
    if (this.activeDirections.has('up')) dy -= 1
    // Bas / Down
    if (this.activeDirections.has('down')) dy += 1

    // Réduit la vitesse diagonale pour éviter d'aller plus vite en diagonale / Reduce diagonal speed to avoid moving faster diagonally
    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2
      dy *= Math.SQRT1_2
    }

    // Envoie le mouvement final au joueur / Send final movement to the player
    this.player.move(dx * movementSpeed, dy * movementSpeed)
  }

  // Dessine la grille synthwave en perspective / Draw the synthwave perspective grid
  drawSynthwaveGrid() {
    // Récupère les couleurs du thème courant / Get colors from current theme
    const palette = this.getPalette()

    // Couleur des lignes de grille / Grid line color
    this.ctx.strokeStyle = palette.grid
    // Épaisseur des lignes / Line thickness
    this.ctx.lineWidth = 1

    // Lignes horizontales qui descendent avec gridOffset / Horizontal lines moving down with gridOffset
    for (let y = this.gridOffset % 40; y < this.canvas.height; y += 40) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.canvas.width, y)
      this.ctx.stroke()
    }

    // Lignes verticales en perspective vers le centre haut / Perspective vertical lines toward the top center
    for (let x = 0; x <= this.canvas.width; x += 40) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, this.canvas.height)
      this.ctx.lineTo(this.canvas.width / 2, 0)
      this.ctx.stroke()
    }

    // Décale la grille pour simuler l'avancée / Move grid to simulate forward motion
    this.gridOffset += this.gameSpeed
  }

  // Dessine la route complète / Draw the full road
  drawRoad() {
    // Récupère les couleurs du thème / Get theme colors
    const palette = this.getPalette()

    // Fond général du canvas / General canvas background
    this.ctx.fillStyle = palette.canvas
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    // Rectangle central de route / Central road rectangle
    this.ctx.fillStyle = palette.road
    this.ctx.fillRect(42, 0, this.canvas.width - 84, this.canvas.height)
    // Grille synthwave par-dessus / Synthwave grid on top
    this.drawSynthwaveGrid()
    // Lignes blanches/couleur de bord de route / Road side lines
    this.ctx.fillStyle = palette.lane
    this.ctx.fillRect(50, 0, 5, this.canvas.height)
    this.ctx.fillRect(this.canvas.width - 55, 0, 5, this.canvas.height)
  }

  // Ajoute parfois un obstacle / Sometimes add an obstacle
  spawnObstacle() {
    // Plus le jeu va vite, plus les obstacles apparaissent souvent / The faster the game, the more often obstacles appear
    if (Math.random() < 0.011 * this.gameSpeed) {
      this.obstacles.push(new Obstacle(this.canvas.width))
    }
  }

  // Vérifie si le joueur touche un obstacle / Check whether player touches an obstacle
  checkCollisions() {
    // Parcourt chaque obstacle / Loop through every obstacle
    for (const obstacle of this.obstacles) {
      // Ignore l'obstacle s'il ne touche pas le joueur / Ignore obstacle if it does not touch the player
      if (!this.isColliding(this.player, obstacle)) continue

      // L'huile ne termine pas la partie : elle fait glisser / Oil does not end the run: it makes the player slide
      if (obstacle.type === 'oil') {
        this.player.startSlide()
        this.obstacles = this.obstacles.filter((item) => item !== obstacle)
        return
      }

      // Les autres obstacles déclenchent une animation de collision / Other obstacles trigger a collision flash
      this.drawCollisionFlash()
      // La partie est terminée / The run is over
      this.gameOver = true
      // Met à jour le record si nécessaire / Update high score if needed
      this.updateHighScore()
      // Affiche la modale de fin / Show game-over modal
      this.showGameOverModal()
      return
    }
  }

  // Test simple de collision entre deux rectangles / Simple rectangle collision test
  isColliding(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }

  // Dessine un flash blanc lors d'un crash / Draw a white flash on crash
  drawCollisionFlash() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
    this.ctx.beginPath()
    this.ctx.arc(
      this.player.x + this.player.width / 2,
      this.player.y + this.player.height / 2,
      52,
      0,
      2 * Math.PI,
    )
    this.ctx.fill()
  }

  // Affiche l'écran de fin de partie / Show game-over screen
  showGameOverModal() {
    this.openModal({
      title: this.t('gameOver'),
      lines: [
        `${this.t('score')} : ${this.score}`,
        `${this.t('highScore')} : ${this.highScore}`,
      ],
      actions: [
        {
          label: this.t('replay'),
          onClick: () => this.startRun(),
        },
        {
          label: this.t('menu'),
          onClick: () => {
            this.resetGame()
            this.showMainMenu()
            this.drawIdleScene()
          },
        },
      ],
    })
  }

  // Réinitialise une partie / Reset one run
  resetGame() {
    // Annule l'ancienne boucle si elle existe / Cancel previous loop if it exists
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    // Recrée le joueur à sa position de départ / Recreate player at start position
    this.player = new Player(this.canvas.width, this.canvas.height)
    // Vide les obstacles / Clear obstacles
    this.obstacles = []
    // Remet le score à zéro / Reset score
    this.score = 0
    // Remet la vitesse au départ / Reset speed
    this.gameSpeed = 1
    // Remet la grille au départ / Reset grid offset
    this.gridOffset = 0
    // Retire l'état de fin / Remove game-over state
    this.gameOver = false
    // Vide les directions actives / Clear active directions
    this.activeDirections.clear()
  }

  // Dessine les textes de score dans le canvas / Draw score texts inside canvas
  drawScore() {
    // Récupère les couleurs du thème / Get theme colors
    const palette = this.getPalette()

    // Couleur du texte / Text color
    this.ctx.fillStyle = palette.score
    // Police utilisée dans le canvas / Font used inside canvas
    this.ctx.font = '18px Audiowide, Arial, sans-serif'
    // Score de la partie / Current score
    this.ctx.fillText(`${this.t('score')} ${this.score}`, 14, 30)
    // Meilleur score / High score
    this.ctx.fillText(`${this.t('highScore')} ${this.highScore}`, 14, 56)
  }

  // Met à jour les obstacles / Update obstacles
  updateObstacles() {
    // Nouvelle liste qui gardera seulement les obstacles visibles / New list that keeps only visible obstacles
    const nextObstacles = []

    // Parcourt les obstacles actuels / Loop through current obstacles
    this.obstacles.forEach((obstacle) => {
      // Fait descendre l'obstacle / Move obstacle down
      obstacle.update(this.gameSpeed)
      // Dessine l'obstacle / Draw obstacle
      obstacle.draw(this.ctx, this.getPalette())

      // Si l'obstacle sort de l'écran, il rapporte des points / If obstacle leaves screen, it gives points
      if (obstacle.y > this.canvas.height) {
        this.score += 10
        this.gameSpeed = Math.min(this.gameSpeed + 0.04, 3.6)
      } else {
        // Sinon on le conserve pour la prochaine image / Otherwise keep it for next frame
        nextObstacles.push(obstacle)
      }
    })

    // Remplace l'ancienne liste par la liste nettoyée / Replace old list with cleaned list
    this.obstacles = nextObstacles
  }

  // Met à jour le record / Update high score
  updateHighScore() {
    // Si le score actuel ne bat pas le record, on ne fait rien / If current score does not beat high score, do nothing
    if (this.score <= this.highScore) return

    // Nouveau record en mémoire / New high score in memory
    this.highScore = this.score
    // Nouveau record sauvegardé dans le navigateur / New high score saved in browser
    localStorage.setItem(STORAGE_KEYS.highScore, String(this.highScore))
  }

  // Branche tous les événements utilisateur / Bind all user events
  addEventListeners() {
    // Clic sur le bouton de thème / Theme button click
    this.themeToggle.addEventListener('click', () => this.toggleTheme())
    // Clic sur le bouton français / French button click
    this.languageButtons.fr.addEventListener('click', () =>
      this.setLanguage('fr'),
    )
    // Clic sur le bouton anglais / English button click
    this.languageButtons.en.addEventListener('click', () =>
      this.setLanguage('en'),
    )

    // Entrées continues / Continuous inputs
    document.addEventListener('keydown', (event) => {
      // Convertit la touche en direction si elle est connue / Convert key into direction if known
      const direction = CONTROL_KEYS[event.key]
      // Ignore les autres touches / Ignore other keys
      if (!direction) return

      // Empêche le navigateur de scroller avec les flèches / Prevent browser scrolling with arrow keys
      event.preventDefault()
      // Ajoute la direction dans l'ensemble actif / Add direction to active set
      this.activeDirections.add(direction)
    })

    // Quand une touche est relâchée / When a key is released
    document.addEventListener('keyup', (event) => {
      // Retrouve la direction liée à cette touche / Find direction linked to this key
      const direction = CONTROL_KEYS[event.key]
      // Ignore les touches non gérées / Ignore unmanaged keys
      if (!direction) return

      // Empêche un comportement navigateur inutile / Prevent unwanted browser behavior
      event.preventDefault()
      // Retire la direction de l'ensemble actif / Remove direction from active set
      this.activeDirections.delete(direction)
    })
  }

  // Crée une modale générique / Create a generic modal
  openModal({ title, lines = [], items = [], actions = [] }) {
    // Ferme d'abord une ancienne modale / Close previous modal first
    this.closeModal()

    // Calque plein écran / Full-screen overlay
    const modal = document.createElement('div')
    // Carte au centre / Center panel
    const panel = document.createElement('section')
    // Titre de la modale / Modal heading
    const heading = document.createElement('h2')
    // Conteneur des boutons / Buttons container
    const actionsWrapper = document.createElement('div')

    // Classe CSS du calque / CSS class for overlay
    modal.className = 'synthwave-modal'
    // Classe CSS de la carte / CSS class for panel
    panel.className = 'synthwave-modal-panel'
    // Classe CSS du titre / CSS class for heading
    heading.className = 'synthwave-title'
    // Texte du titre / Heading text
    heading.textContent = title
    // Classe CSS de la zone de boutons / CSS class for actions area
    actionsWrapper.className = 'synthwave-actions'

    // Ajoute le titre dans la carte / Add heading to panel
    panel.appendChild(heading)

    // Ajoute chaque paragraphe demandé / Add each requested paragraph
    lines.forEach((line) => {
      const paragraph = document.createElement('p')
      paragraph.className = 'synthwave-text'
      paragraph.textContent = line
      panel.appendChild(paragraph)
    })

    // Ajoute une liste si des éléments sont fournis / Add a list if items are provided
    if (items.length > 0) {
      const list = document.createElement('ul')
      list.className = 'synthwave-list'

      items.forEach((item) => {
        const listItem = document.createElement('li')
        listItem.textContent = item
        list.appendChild(listItem)
      })

      panel.appendChild(list)
    }

    // Crée chaque bouton d'action / Create each action button
    actions.forEach((action) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'synthwave-button'
      button.textContent = action.label
      button.addEventListener('click', action.onClick)
      actionsWrapper.appendChild(button)
    })

    // Ajoute les boutons dans la carte / Add buttons to panel
    panel.appendChild(actionsWrapper)
    // Ajoute la carte dans le calque / Add panel to overlay
    modal.appendChild(panel)
    // Ajoute la modale à la page / Add modal to page
    document.body.appendChild(modal)

    // Garde la référence pour pouvoir la fermer / Keep reference so it can be closed
    this.modal = modal
  }

  // Ferme la modale active / Close active modal
  closeModal() {
    // Supprime la modale si elle existe / Remove modal if it exists
    this.modal?.remove()
    // Nettoie la référence / Clear reference
    this.modal = null
  }

  // Lit les couleurs CSS pour les utiliser dans le canvas / Read CSS colors for canvas drawing
  getPalette() {
    // Récupère les styles calculés de <html> / Get computed styles from <html>
    const styles = getComputedStyle(document.documentElement)

    // Retourne un objet simple avec les couleurs utiles / Return a simple object with useful colors
    return {
      canvas: styles.getPropertyValue('--canvas-bg').trim(),
      road: styles.getPropertyValue('--road-color').trim(),
      grid: styles.getPropertyValue('--grid-color').trim(),
      lane: styles.getPropertyValue('--lane-color').trim(),
      score: styles.getPropertyValue('--score-color').trim(),
      player: styles.getPropertyValue('--player-color').trim(),
      car: styles.getPropertyValue('--car-color').trim(),
      oil: styles.getPropertyValue('--oil-color').trim(),
      cone: styles.getPropertyValue('--cone-color').trim(),
      accent: styles.getPropertyValue('--accent-color').trim(),
    }
  }

  // Raccourci pour obtenir un texte traduit / Shortcut to get translated text
  t(key) {
    // Renvoie le texte de la langue courante ou la clé si absent / Return current language text or key if missing
    return TRANSLATIONS[this.language][key] || key
  }
}
