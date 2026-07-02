// Objet central des traductions / Central translation object
export const TRANSLATIONS = {
  // Textes français / French texts
  fr: {
    documentTitle: 'Synth Run',
    description:
      'Synth Run est un jeu de course synthwave local avec obstacles et contrôles clavier.',
    canvasLabel: 'Zone de jeu Synth Run',
    preferencesLabel: 'Préférences',
    languageLabel: 'Choix de la langue',
    themeToDark: 'Basculer vers le thème sombre',
    themeToLight: 'Basculer vers le thème clair',
    menuIntro:
      'Évitez les obstacles et gardez la route le plus longtemps possible.',
    controlsHint: 'Contrôles : flèches directionnelles ou ZQSD.',
    highScore: 'Record',
    score: 'Score',
    carsItem: 'Voitures : collision',
    oilItem: "Flaques d'huile : glissade",
    conesItem: 'Cônes : collision',
    start: 'Commencer',
    gameOver: 'Game Over',
    replay: 'Rejouer',
    menu: 'Menu',
  },
  // Textes anglais / English texts
  en: {
    documentTitle: 'Synth Run',
    description:
      'Synth Run is a local synthwave racing game with obstacles and keyboard controls.',
    canvasLabel: 'Synth Run game area',
    preferencesLabel: 'Preferences',
    languageLabel: 'Language selection',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    menuIntro: 'Avoid obstacles and stay on the road as long as possible.',
    controlsHint: 'Controls: arrow keys or WASD/ZQSD layout.',
    highScore: 'High score',
    score: 'Score',
    carsItem: 'Cars: collision',
    oilItem: 'Oil slicks: sliding',
    conesItem: 'Cones: collision',
    start: 'Start',
    gameOver: 'Game Over',
    replay: 'Play again',
    menu: 'Menu',
  },
}

// Choisit la langue au lancement / Choose language at startup
export function getInitialLanguage() {
  // On relit la préférence sauvegardée si elle existe / Reuse saved preference if it exists
  const savedLanguage = localStorage.getItem('synth-run-language')
  // Si la langue sauvegardée est supportée, on l'utilise / If the saved language is supported, use it
  if (TRANSLATIONS[savedLanguage]) return savedLanguage

  // Sinon, on utilise la langue du navigateur / Otherwise, use the browser language
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}
