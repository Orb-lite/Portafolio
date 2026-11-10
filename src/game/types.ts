export type GameVersion = 'chess' | 'primitive' | 'fof' | 'land' | 'birds' | 'humans' | 'cars' | 'aircraft';
export type PolishLevel = 'v1' | 'v2' | 'v3';

export type TileColor = 'white' | 'black' | 'blue' | 'yellow' | 'pink' | 'green' | 'purple' | 'red' | 'cyan' | 'orange' | 'magenta' | 'lime';

export const ALL_COLORS: TileColor[] = ['white', 'black', 'blue', 'yellow', 'pink', 'green', 'purple', 'red', 'cyan', 'orange', 'magenta', 'lime'];

export interface GridTile {
  id: string;
  row: number;
  col: number;
  color: TileColor;
  collected: boolean;
  encapsulated?: boolean; // Trapped in an outer crystal bubble / cage
  encapsulationLayers?: number; // Fish capsules need repeated hits before breaking
  special?: 'cross' | 'burst' | 'color'; // Progressive Fish of Fortune explosive pearls
  unlockAt?: number; // Game-clock timestamp when a shattered shield's tile becomes absorbable
  absorbedProgress: number; // 0 to 1 for flight animation
  absorberId?: string;
  worldPos?: [number, number, number];
}

export interface RunnerQueueItem {
  id: string;
  color: TileColor;
  capacity: number; // e.g. 20
  remaining: number;
  colIndex: number;
  rowIndex: number; // 0 = front row (selectable)
}

export type TrackSide = 'bottom' | 'right' | 'top' | 'left';

export interface ActiveRunner {
  id: string;
  color: TileColor;
  maxCapacity: number;
  remaining: number;
  progress: number; // 0.0 to 1.0 along the continuous loop
  speed: number;
  slotIndex: number;
  squishTime: number; // time accumulator for bounce
  scaleY: number;
  scaleXZ: number;
  state: 'spawning' | 'running' | 'clearing';
  clearingProgress: number;
}

export interface FlyingTile {
  id: string;
  tileId: string;
  color: TileColor;
  startPos: [number, number, number];
  targetRunnerId: string;
  progress: number; // 0 to 1
  arcHeight: number;
  rotationSpeed: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
  shape: 'cube' | 'bubble' | 'sparkle';
}

export interface GameSettings {
  version: GameVersion;
  polish: PolishLevel;
  gridRows: number;
  gridCols: number;
  maxTrackRunners: number;
  soundEnabled: boolean;
  screenShake: boolean;
  showTutorialHand: boolean;
  speedMultiplier: number;
}
