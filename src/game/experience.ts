/**
 * Board-based difficulty progression.
 * A board clear advances exactly one level; XP is tracked separately as score.
 */
export interface LevelConfig {
  level: number;
  rows: number;
  cols: number;
  colorsCount: number;
  hasEncapsulations: boolean;
  encapsulationChance: number; // 0 to 1
  runnerCapacity: number;
}

export function getLevelConfig(level: number, fishOfFortuneMode = false): LevelConfig {
  const currentLevel = Math.max(1, Math.floor(level));
  const colorsCount = fishOfFortuneMode
    ? Math.min(12, 3 + Math.floor((currentLevel - 1) / 2))
    : Math.min(12, 2 + Math.floor((currentLevel - 1) / 5));

  // Match the reference's dense square board, then grow it slowly between worlds.
  const boardSize = Math.min(64, 15 + Math.floor((currentLevel - 1) / 3));
  const hasEncapsulations = currentLevel >= 3;

  return {
    level: currentLevel,
    rows: boardSize,
    cols: boardSize,
    colorsCount,
    hasEncapsulations,
    encapsulationChance: hasEncapsulations
      ? Math.min(0.7, 0.08 + (currentLevel - 3) * 0.01)
      : 0,
    runnerCapacity: 20,
  };
}

export function getThemeForLevel(level: number): import('./types').GameVersion {
  if (level >= 60) return 'aircraft';
  if (level >= 50) return 'cars';
  if (level >= 40) return 'humans';
  if (level >= 30) return 'birds';
  if (level >= 20) return 'land';
  if (level >= 10) return 'fof';
  return 'chess';
}

/** Keep the game in the Fish Feeder art style while level themes drive music. */
export function getVisualThemeForLevel(level: number, fishOfFortuneOnly = false): import('./types').GameVersion {
  return fishOfFortuneOnly ? 'fof' : getThemeForLevel(level);
}

export function getThemeName(theme: import('./types').GameVersion, language: 'en' | 'es' = 'en'): string {
  if (language === 'es') {
    switch (theme) {
      case 'chess': return 'Reino de Ajedrez';
      case 'fof': return 'Fish Feeder';
      case 'land': return 'Animales Terrestres';
      case 'birds': return 'Aves';
      case 'humans': return 'Humanos';
      case 'cars': return 'Automóviles';
      case 'aircraft': return 'Aeronaves';
      default: return 'Orígenes';
    }
  }
  switch (theme) {
    case 'chess': return 'Chess Kingdom';
    case 'fof': return 'Fish Feeder';
    case 'land': return 'Land Animals';
    case 'birds': return 'Birds';
    case 'humans': return 'Humans';
    case 'cars': return 'Cars';
    case 'aircraft': return 'Aircraft';
    default: return 'Origins';
  }
}
