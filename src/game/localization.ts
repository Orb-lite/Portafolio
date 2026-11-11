import { ComodinDefinition } from './comodines';
import { GameVersion, TileColor } from './types';

export type GameLanguage = 'en' | 'es';

export interface LocalizedComodin extends Pick<ComodinDefinition, 'name' | 'subtitle' | 'description' | 'tacticalAdvice' | 'tradeoff'> {}

const COMODIN_EN: Record<string, LocalizedComodin> = {
  iman_perimetro: {
    name: 'Perimeter Magnet',
    subtitle: 'Absorption range +40%',
    description: 'Increases runner suction range by 40% for 18 seconds so they can absorb slightly misaligned perimeter tiles.',
    tacticalAdvice: 'Use it when matching tiles in corners or along the edge keep escaping by a tiny margin.',
    tradeoff: 'It is useless if the conveyor has no runner matching a color visible on the edge.',
  },
  rotacion_tactica: {
    name: 'Tactical Shuffle',
    subtitle: 'Rearrange front queue',
    description: 'Immediately replaces the front row of the lower queue with runners matching colors exposed on the board.',
    tacticalAdvice: 'Use it when none of the four front options match the edge and you are close to getting stuck.',
    tradeoff: 'It spends your level power-up only to rearrange the queue; it does not absorb tiles directly.',
  },
  corredor_titan: {
    name: 'Titan Runner',
    subtitle: 'Capacity +8 / speed −20%',
    description: 'The next runner gains 8 extra absorption capacity, but moves 20% slower because of its added mass.',
    tacticalAdvice: 'Choose it when one color dominates an entire side and can be cleared in one pass.',
    tradeoff: 'It occupies a conveyor lane longer. Avoid launching it when three or four runners are already on the belt.',
  },
  amortiguador_emergencia: {
    name: 'Safety Net',
    subtitle: 'Prevents one fatal jam',
    description: 'If the conveyor reaches 5/5 runners with no active matches, it automatically removes the least active runner and returns its tiles to reserve.',
    tacticalAdvice: 'A strong safety net when you take risks by filling the conveyor with aggressive combinations.',
    tradeoff: 'It is passive protection. Precise play that never fills all five slots gets no offensive advantage from it.',
  },
  pulso_anticapsula: {
    name: 'Bubble-Breaker Pulse',
    subtitle: 'Breaks 4 shielded tiles',
    description: 'Sends a sonic wave that instantly bursts up to four protective capsules or crystals, freeing their tiles.',
    tacticalAdvice: 'Crucial in levels where shielded tiles are blocking progress.',
    tradeoff: 'Useless when the current level has no shielded tiles. Check the board before choosing it.',
  },
  impulso_conveyor: {
    name: 'Conveyor Surge',
    subtitle: 'Speed +80% for 12s',
    description: 'Increases the whole conveyor speed by 80% for 12 seconds, rapidly accelerating runner sweeps.',
    tacticalAdvice: 'Activate it when three or four runners on the belt have matching colors and are ready to sweep in a chain.',
    tradeoff: 'The faster pace demands quick decisions. Runners without tiles to absorb may circle pointlessly.',
  },
  transmutacion_borde: {
    name: 'Chromatic Transmutation',
    subtitle: 'Converts 3 edge tiles',
    description: 'Changes three blocking outer-edge tiles to match the color of the runner leading your conveyor, opening an immediate path.',
    tacticalAdvice: 'Use it to break through a wall of an awkward color that blocks access to a large inner group.',
    tradeoff: 'You must launch a runner of the desired color first so it can collect the converted tiles.',
  },
  despeje_estrategico: {
    name: 'Tactical Purge',
    subtitle: 'Removes 1 idle runner',
    description: 'Immediately removes the runner with the fewest absorptions or the longest idle time, freeing its conveyor slot without losing a life.',
    tacticalAdvice: 'Ideal for correcting a rushed launch that left a runner blocking the belt with no tiles to collect.',
    tradeoff: 'It only fixes a mistake; it does not directly speed up the board or earn points.',
  },
  corredor_prismatico: {
    name: 'Prismatic Runner',
    subtitle: 'Absorbs any color (cap. 12)',
    description: 'Launches a legendary iridescent runner that devours up to 12 exposed perimeter tiles of any color.',
    tacticalAdvice: 'Use it when the outer edge is crowded with a chaotic mosaic of isolated colors.',
    tradeoff: 'It absorbs only 12 tiles, then blocks its conveyor slot for a four-second cooldown.',
  },
  colapso_gravitacional: {
    name: 'Gravitational Collapse',
    subtitle: 'Pulls inner tiles to edge',
    description: 'Reverses the board polarity and pushes five tiles of the most common color from inner rows to accessible outer edges.',
    tacticalAdvice: 'Uncovers large color groups trapped in the center of a 10×10 or 12×12 board.',
    tradeoff: 'It rearranges the edge. If your queue has no matching runner, you may be temporarily stuck.',
  },
  paradoja_temporal: {
    name: 'Temporal Stasis',
    subtitle: 'Freezes jam timer 20s + 1.5× magnet',
    description: 'Slows jam detection for 20 seconds and gives all active runners a 1.5× magnetic field.',
    tacticalAdvice: 'The ultimate survival power-up for unsticking large boards in the most demanding levels.',
    tradeoff: 'It does not absorb tiles for you; it gives you time to think and execute your strategy.',
  },
};

export function localizeComodin(comodin: ComodinDefinition, language: GameLanguage): ComodinDefinition {
  if (language === 'en' && COMODIN_EN[comodin.id]) {
    return { ...comodin, ...COMODIN_EN[comodin.id] };
  }
  return comodin;
}

export const GAME_TEXT = {
  en: {
    // Navigation & Top bar
    backToPortfolio: 'Back to Portfolio',
    gameEdition: 'Conveyor Realms 3D · Three.js Edition',
    fofEdition: 'Fish Feeder · Ocean 3D Edition',
    switchToFof: 'Switch to Fish Feeder',
    switchToConveyor: 'Switch to Conveyor Realms',
    gameMenu: 'Game Menu',
    modeLabel: 'Mode',
    fishFeederMode: 'Fish Feeder',
    arcadeConveyorMode: 'Arcade 3D',

    // Header HUD
    level: 'LEVEL',
    replay: 'Replay',
    board: 'BOARD',
    tiles: 'TILES',
    pearls: 'PEARLS',
    totalXp: 'TOTAL XP',
    lives: 'Lives',
    speed: 'Speed',
    mute: 'Mute Audio',
    unmute: 'Play Audio',
    reset: 'Reset Level',
    pathway: 'Pathway',
    gameInfo: 'Game Info',
    hallOfFame: 'Hall of Fame',
    editGamertag: 'Edit Gamertag',
    databaseConfig: 'Database Config',
    musicNowPlaying: 'Music Track',
    dayMode: 'Day Mode',
    nightMode: 'Night Mode',
    toggleDayNight: 'Toggle Day/Night Mode',

    // Bottom Queue
    availableSlots: 'Slots Available',
    launchHint: 'Tap any runner to launch into the track',
    dragHint: 'Swipe to rotate camera angle',

    // Comodines
    used: 'Power-up used (1/1)',
    change: 'Change level power-up',
    activate: 'Activate power-up',
    activateNow: 'Activate now!',
    choosePower: 'Choose 1 of 3 level power-ups',
    options: '3 options',
    powerTitle: 'Level Power-up',
    alreadyUsed: 'You already used a power-up this level',
    equip: 'Equip this power-up',
    equipped: 'Power-up equipped',
    chooseHint: 'Choose one power-up for this level. Activate it now or save it for the right moment.',
    tacticalAdviceLabel: 'Tactical Advice',
    tradeoffLabel: 'Tradeoff',
    close: 'Close',

    // Level Map / Pathway
    levelPathway: 'Level Pathway Map',
    currentFrontier: 'Current Frontier',
    completed: 'Completed',
    replayLevel: 'Replay Level',
    playLevel: 'Play Level',
    locked: 'Locked',
    totalAbsorbed: 'Total Absorbed',
    highScore: 'Best Score',
    viewWorld: 'World Block',

    // Popups: Win / Level Complete
    winTitleConveyor: 'LEVEL COMPLETE!',
    winTitleFof: 'LEVEL COMPLETE!',
    winSubtextConveyor: 'Loved it? Take the game with you.',
    winSubtextFof: 'Loved it? Take Fish Feeder with you.',
    downloadFree: 'DOWNLOAD FREE',
    continueLevel: 'Continue to Level',
    replayPastCleared: 'Past Level Cleared',
    replayProgressSafe: 'Your main frontier progress is safe at Level',
    absorbedCount: 'Absorbed',
    timeElapsed: 'Time',
    xpEarned: 'XP Earned',
    autoSavedNotice: 'Progress automatically saved in persistent cache and cloud',
    jumpToFrontier: 'Go to Level (To Do)',
    replayThisLevel: 'Replay This Level',
    returnToPathway: 'Return to Pathway',

    // Popups: Die / Lost / Stuck
    loseTitleConveyor: 'YOU LOST!',
    loseTitleFof: 'YOU LOST!',
    loseSubtextConveyor: 'Try again on your phone.',
    loseSubtextFof: 'Try again. Play Fish Feeder anywhere.',
    outOfLives: 'Out of lives',
    youGotStuck: 'Conveyor track is full!',
    stuckExplanation: 'No valid tile matches were found for current runners.',
    nextLifeIn: 'Next life in',
    rewardedVideo: 'Rewarded video',
    adsPerLife: 'ads per life',
    watchAd: 'Watch Rewarded Ad',
    adsAvailableMobile: 'Rewarded ads available on mobile app',
    retryLevel: 'Retry Level',
    progressSafeAtLevel: 'Your progress stays on Level until cleared.',

    // Mobile Download Invite Modal
    mobileTitle: 'Play Conveyor Realms on Smartphone',
    mobileTitleFof: 'Play Fish Feeder on Smartphone',
    mobileBadge: 'Android / iOS PWA & APK',
    mobileDesc: 'Zero browser lag, tactile 60 FPS haptics, and instant resume.',
    scanQr: 'Scan Mobile QR',
    installSteps: 'Installation Steps:',
    step1: '1. Open link on Chrome or Safari on your phone.',
    step2: '2. Tap menu / share button.',
    step3: '3. Select "Add to Home Screen" to install free.',
    gotIt: 'Got it',

    // Exit confirm
    exitTitle: 'Leave current level?',
    exitDesc: 'Your board state will be reset, but your level progress is saved.',
    stayInLevel: 'Stay & Play',
    exitToMap: 'Exit to Map',

    // Color names
    colors: {
      white: 'WHITE',
      black: 'BLACK',
      blue: 'BLUE',
      yellow: 'YELLOW',
      pink: 'PINK',
      green: 'GREEN',
      purple: 'PURPLE',
      red: 'RED',
      cyan: 'CYAN',
      orange: 'ORANGE',
      magenta: 'MAGENTA',
      lime: 'LIME',
      clown: 'CLOWN',
      angler: 'ANGLER',
      tang: 'TANG',
      tangJr: 'TANG JR',
      axolotl: 'AXOLOTL',
      turtle: 'TURTLE',
      puffer: 'PUFFER',
      lionfish: 'LIONFISH',
      betta: 'BETTA',
    },
  },
  es: {
    // Navigation & Top bar
    backToPortfolio: 'Regresar al Portafolio',
    gameEdition: 'Conveyor Realms 3D · Edición Three.js',
    fofEdition: 'Fish Feeder · Edición Océano 3D',
    switchToFof: 'Cambiar a Fish Feeder',
    switchToConveyor: 'Cambiar a Conveyor Realms',
    gameMenu: 'Menú de Juego',
    modeLabel: 'Modo',
    fishFeederMode: 'Fish Feeder',
    arcadeConveyorMode: 'Arcade 3D',

    // Header HUD
    level: 'NIVEL',
    replay: 'Rejugado',
    board: 'TABLERO',
    tiles: 'FICHAS',
    pearls: 'PERLAS',
    totalXp: 'XP TOTAL',
    lives: 'Vidas',
    speed: 'Velocidad',
    mute: 'Silenciar audio',
    unmute: 'Activar audio',
    reset: 'Reiniciar nivel',
    pathway: 'Camino',
    gameInfo: 'Info del Juego',
    hallOfFame: 'Salón de la Fama',
    editGamertag: 'Editar Gamertag',
    databaseConfig: 'Configurar Base de Datos',
    musicNowPlaying: 'Música de Fondo',
    dayMode: 'Modo Día',
    nightMode: 'Modo Noche',
    toggleDayNight: 'Alternar Modo Día/Noche',

    // Bottom Queue
    availableSlots: 'Espacios Disponibles',
    launchHint: 'Toca un corredor para lanzarlo a la pista',
    dragHint: 'Arrastra para rotar el ángulo de la cámara',

    // Comodines
    used: 'Comodín usado (1/1)',
    change: 'Cambiar comodín de este nivel',
    activate: 'Activar comodín',
    activateNow: '¡Activar ahora!',
    choosePower: 'Elige 1 de 3 comodines para este nivel',
    options: '3 opciones',
    powerTitle: 'Comodín del nivel',
    alreadyUsed: 'Ya usaste 1 comodín este nivel',
    equip: 'Equipar este comodín',
    equipped: 'Comodín equipado',
    chooseHint: 'Elige 1 comodín para este nivel. Actívalo ahora o guárdalo para el momento adecuado.',
    tacticalAdviceLabel: 'Consejo Táctico',
    tradeoffLabel: 'Desventaja',
    close: 'Cerrar',

    // Level Map / Pathway
    levelPathway: 'Camino de Niveles',
    currentFrontier: 'Frontera Actual',
    completed: 'Completado',
    replayLevel: 'Rejugar Nivel',
    playLevel: 'Jugar Nivel',
    locked: 'Bloqueado',
    totalAbsorbed: 'Total Absorbido',
    highScore: 'Mejor Puntuación',
    viewWorld: 'Bloque de Mundo',

    // Popups: Win / Level Complete
    winTitleConveyor: '¡NIVEL COMPLETADO!',
    winTitleFof: '¡NIVEL COMPLETADO!',
    winSubtextConveyor: '¿Te gustó? Llévate el juego contigo.',
    winSubtextFof: '¿Te gustó? Llévate Fish Feeder contigo.',
    downloadFree: 'DESCARGAR GRATIS',
    continueLevel: 'Continuar al Nivel',
    replayPastCleared: 'Nivel Pasado Superado',
    replayProgressSafe: 'Tu progreso principal está a salvo en el Nivel',
    absorbedCount: 'Absorbidas',
    timeElapsed: 'Tiempo',
    xpEarned: 'XP Ganada',
    autoSavedNotice: 'Progreso guardado automáticamente en caché y nube',
    jumpToFrontier: 'Ir a Nivel (Por Hacer)',
    replayThisLevel: 'Rejugar este Nivel',
    returnToPathway: 'Volver al Camino (Pathway)',

    // Popups: Die / Lost / Stuck
    loseTitleConveyor: '¡PERDISTE!',
    loseTitleFof: '¡PERDISTE!',
    loseSubtextConveyor: 'Inténtalo de nuevo desde tu móvil.',
    loseSubtextFof: 'Inténtalo de nuevo. Juega Fish Feeder donde quieras.',
    outOfLives: 'Sin vidas',
    youGotStuck: '¡La pista se llenó!',
    stuckExplanation: 'No hay coincidencias válidas de color con el borde.',
    nextLifeIn: 'Siguiente vida en',
    rewardedVideo: 'Video recompensado',
    adsPerLife: 'anuncios por vida',
    watchAd: 'Ver Anuncio Recompensado',
    adsAvailableMobile: 'Anuncios recompensados disponibles en móvil',
    retryLevel: 'Reintentar Nivel',
    progressSafeAtLevel: 'Tu progreso se mantiene en el Nivel hasta completarlo.',

    // Mobile Download Invite Modal
    mobileTitle: 'Juega Conveyor Realms en tu Smartphone',
    mobileTitleFof: 'Juega Fish Feeder en tu Smartphone',
    mobileBadge: 'Android / iOS PWA y APK',
    mobileDesc: 'Sin lag de navegador, respuesta táctil a 60 FPS y guardado instantáneo.',
    scanQr: 'Escanear QR Móvil',
    installSteps: 'Pasos de instalación:',
    step1: '1. Abre este enlace en Chrome o Safari desde tu móvil.',
    step2: '2. Pulsa en el menú o botón Compartir.',
    step3: '3. Selecciona "Añadir a pantalla de inicio" para instalar gratis.',
    gotIt: 'Entendido',

    // Exit confirm
    exitTitle: '¿Abandonar nivel actual?',
    exitDesc: 'Tu progreso de tablero se reiniciará, pero tu nivel queda guardado.',
    stayInLevel: 'Quedarme a jugar',
    exitToMap: 'Salir al Camino',

    // Color names
    colors: {
      white: 'BLANCO',
      black: 'NEGRO',
      blue: 'AZUL',
      yellow: 'AMARILLO',
      pink: 'ROSA',
      green: 'VERDE',
      purple: 'MORADO',
      red: 'ROJO',
      cyan: 'CIAN',
      orange: 'NARANJA',
      magenta: 'MAGENTA',
      lime: 'LIMA',
      clown: 'PAYASO',
      angler: 'RAPE',
      tang: 'CIRUJANO',
      tangJr: 'CIRUJANO JR',
      axolotl: 'AJOLOTE',
      turtle: 'TORTUGA',
      puffer: 'PEZ GLOBO',
      lionfish: 'PEZ LEÓN',
      betta: 'PEZ BETTA',
    },
  },
} as const;

export function getLocalizedColorName(color: TileColor, isFoF: boolean, language: GameLanguage): string {
  const dict = GAME_TEXT[language].colors;
  if (isFoF) {
    switch (color) {
      case 'white': return dict.clown;
      case 'black': return dict.angler;
      case 'blue': return dict.tang;
      case 'yellow': return dict.tangJr;
      case 'pink': return dict.axolotl;
      case 'green': return dict.turtle;
      case 'purple': return dict.puffer;
      case 'red': return dict.lionfish;
      case 'cyan': return dict.betta;
      case 'orange': return dict.clown;
      case 'magenta': return dict.magenta;
      case 'lime': return dict.lime;
      default: return isFoF ? 'FISH' : 'RUNNER';
    }
  }
  if (color === 'bomb') return isFoF ? (language === 'es' ? 'PERLA BOMBA' : 'BOMB PEARL') : (language === 'es' ? 'FICHA BOMBA' : 'BOMB TILE');
  if (color === 'rainbow') return isFoF ? (language === 'es' ? 'PERLA ARCOÍRIS' : 'RAINBOW PEARL') : (language === 'es' ? 'FICHA ARCOÍRIS' : 'RAINBOW TILE');
  return (dict as Record<string, string>)[color] || color.toUpperCase();
}
