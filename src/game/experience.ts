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

export function getLevelConfig(level: number): LevelConfig {
  const currentLevel = Math.max(1, Math.floor(level));
  const boardSize = Math.min(64, 7 + currentLevel); // 8x8 at level 1, then +1 per level until 64x64
  const hasEncapsulations = currentLevel >= 2;

  return {
    level: currentLevel,
    rows: boardSize,
    cols: boardSize,
    colorsCount: Math.min(12, currentLevel + 1), // Add one color per level, up to all twelve colors
    hasEncapsulations,
    encapsulationChance: hasEncapsulations
      ? Math.min(0.7, 0.08 + (currentLevel - 2) * 0.01)
      : 0,
    runnerCapacity: currentLevel <= 5 ? 4 : (currentLevel <= 20 ? 5 : 6),
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

export function getThemeName(theme: import('./types').GameVersion): string {
  switch (theme) {
    case 'chess': return 'Chess Kingdom';
    case 'fof': return 'Fish of Fortune';
    case 'land': return 'Land Animals';
    case 'birds': return 'Birds';
    case 'humans': return 'Humans';
    case 'cars': return 'Cars';
    case 'aircraft': return 'Aircraft';
    default: return 'Origins';
  }
}
