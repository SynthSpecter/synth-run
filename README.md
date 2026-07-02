# Synth Run

## Français

Synth Run est un petit jeu de course synthwave en JavaScript vanilla. Le joueur évite voitures, cônes et flaques d'huile pour tenir le plus longtemps possible.

### Fonctionnalités

- Jeu local sans dépendance externe.
- Interface français/anglais avec préférence locale.
- Contrôles clavier avec flèches directionnelles et ZQSD.
- Thème sombre synthwave et thème clair.
- Score et record local.
- Obstacles variés : voitures, cônes, huile.
- Code commenté en français/anglais pour faciliter la lecture.

### Lancer le jeu

Ouvre `index.html` directement dans un navigateur, ou lance le serveur local :

```bash
npm run dev
```

Puis ouvre `http://localhost:4174`.

### Vérifier le code

```bash
npm run check
```

## English

Synth Run is a small vanilla JavaScript synthwave racing game. The player avoids cars, cones, and oil slicks to survive as long as possible.

### Features

- Local game with no external dependency.
- French/English interface with a saved local preference.
- Keyboard controls with arrow keys and ZQSD/WASD-style movement.
- Dark synthwave theme and light theme.
- Local score and high score.
- Varied obstacles: cars, cones, oil.
- French/English comments to make the code easier to read.

### Run The Game

Open `index.html` directly in a browser, or start the local server:

```bash
npm run dev
```

Then open `http://localhost:4174`.

### Check The Code

```bash
npm run check
```

## Structure

```text
synth-run/
├── index.html
├── package.json
├── styles.css
├── Audiowide-Regular.ttf
└── scripts/
    ├── car.js
    ├── game.js
    ├── i18n.js
    ├── main.js
    ├── obstacle.js
    ├── player.js
    └── server.cjs
```

## Pistes D'amélioration / Improvement Ideas

- Ajouter des effets sonores locaux. / Add local sound effects.
- Ajouter plusieurs voitures ou skins. / Add multiple cars or skins.
- Ajouter un système de niveaux ou de missions. / Add levels or missions.
- Ajouter un mode pause. / Add a pause mode.
- Ajouter une page GitHub Pages. / Add a GitHub Pages deployment.
