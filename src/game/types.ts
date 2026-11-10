export type GameVersion = 'chess' | 'primitive' | 'fof' | 'land' | 'birds' | 'humans' | 'cars' | 'aircraft';
export type PolishLevel = 'v1' | 'v2' | 'v3';

export type SpecialTileType = 
  | 'coral_bomb'      // 🪸 Coral Explosivo (desencadena explosiones secundarias)
  | 'clam_trap'       // 🦪 Almeja Trampa (protege la perla hasta recibir un primer impacto)
  | 'current_stream'  // 🌊 Corriente Marina (transfiere el daño a la hilera)
  | 'frozen_pearl'    // 🧊 Perla Congelada (se descongela con explosiones o impactos cercanos)
  | 'rainbow'         // 🌈 Perla Arcoíris / Candy Crush Color Bomb (Clear total del tablero)
  | 'bomb';           // 💣 Perla Bomba (explota radio X/Y de 1 a 3 hileras)

export type TileColor = 
  | 'white' | 'black' | 'blue' | 'yellow' | 'pink' | 'green' | 'purple' 
  | 'red' | 'cyan' | 'orange' | 'magenta' | 'lime' | 'rainbow' | 'bomb';

export const ALL_COLORS: TileColor[] = [
  'white', 'black', 'blue', 'yellow', 'pink', 'green', 'purple', 
  'red', 'cyan', 'orange', 'magenta', 'lime', 'rainbow', 'bomb'
];

export interface GridTile {
  id: string;
  row: number;
  col: number;
  color: TileColor;
  collected: boolean;
  encapsulated?: boolean; // Encapsulada en una burbuja de cristal
  specialType?: SpecialTileType; // Mecánicas especiales de mapa / perla
  shieldLayers?: number; // 🛡️ Sistema de 3 Capas de Escudo (0 a 3)
  unlockAt?: number; // Game-clock timestamp
  absorbedProgress: number; // 0 a 1 para animación de vuelo
  absorberId?: string;
  worldPos?: [number, number, number];
}

export type RunnerQueueItem = {
  id: string;
  color: TileColor;
  count: number;
};

export type TrackSide = 'bottom' | 'right' | 'top' | 'left';

export interface ActiveRunner {
  id: string;
  color: TileColor;
  maxCapacity: number;
  remaining: number;
  progress: number;
  speed: number;
  slotIndex: number;
  squishTime: number;
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
  progress: number;
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