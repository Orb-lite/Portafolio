import { GridTile, TileColor, TrackSide } from './types';
import { getLevelConfig, getColorsForLevel } from './experience';

export class GridManager {
  public rows: number;
  public cols: number;
  public tileSize: number;
  public tileSpacing: number;
  public level: number = 1;
  public isFishMode: boolean = false;
  public tiles: GridTile[] = [];

  // 2D lookup [row][col] -> GridTile
  public grid: (GridTile | null)[][] = [];

  constructor(level = 1, isFishMode = false) {
    this.level = level;
    this.isFishMode = isFishMode;
    const config = getLevelConfig(level, isFishMode);
    this.rows = config.rows;
    this.cols = config.cols;
    this.tileSize = 0.44;
    this.tileSpacing = 0.05;
    this.initGrid(level, isFishMode);
  }

  public initGrid(level = this.level, isFishMode = this.isFishMode) {
    this.level = level;
    this.isFishMode = isFishMode;
    const config = getLevelConfig(level, isFishMode);
    this.rows = config.rows;
    this.cols = config.cols;
    this.tiles = [];
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null)
    );

    // Keep a consistent world-space tile size; the grid expands outward on later levels.
    // Keep tiles readable as the camera pulls back for larger boards.
    const pitch = 0.6;
    this.tileSize = pitch * 0.88;
    this.tileSpacing = pitch * 0.12;

    // Constrain grid tiles strictly to the level's designated playable colors
    const availableColors: TileColor[] = getColorsForLevel(level, isFishMode);

    const totalWidth = this.cols * (this.tileSize + this.tileSpacing) - this.tileSpacing;
    const totalDepth = this.rows * (this.tileSize + this.tileSpacing) - this.tileSpacing;
    const startX = -totalWidth / 2 + this.tileSize / 2;
    const startZ = -totalDepth / 2 + this.tileSize / 2;

    // Clustered color assignment:
    // When there are many colors (6 to 12 colors), single-tile alternating assignment isolates every tile,
    // causing runners to absorb only 1 tile before being blocked by a different color behind it.
    // By grouping tiles into 2x2 or 2x3 clusters, runners absorb continuous chains of matching tiles,
    // clearing whole sections and cleanly opening the board for other available colors!
    const clusterBlockSize = this.rows >= 12 ? 3 : 2;
    const clusterRows = Math.ceil(this.rows / clusterBlockSize);
    const clusterCols = Math.ceil(this.cols / clusterBlockSize);
    const clusterMap: number[][] = Array.from({ length: clusterRows }, () =>
      Array.from({ length: clusterCols }, () => 0)
    );

  for (let cr = 0; cr < clusterRows; cr++) {
  for (let cc = 0; cc < clusterCols; cc++) {
    let nextColorIdx = Math.floor(Math.random() * availableColors.length);
    
    // Evita repetir el mismo color que el bloque de la izquierda o arriba
    const leftColor = cc > 0 ? clusterMap[cr][cc - 1] : -1;
    const topColor = cr > 0 ? clusterMap[cr - 1][cc] : -1;
    
    if (availableColors.length > 1) {
      while (nextColorIdx === leftColor || nextColorIdx === topColor) {
        nextColorIdx = Math.floor(Math.random() * availableColors.length);
      }
    }
    
    clusterMap[cr][cc] = nextColorIdx;
  }
}

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cr = Math.min(clusterRows - 1, Math.floor(r / clusterBlockSize));
        const cc = Math.min(clusterCols - 1, Math.floor(c / clusterBlockSize));
        const color = availableColors[clusterMap[cr][cc]];

        // Encapsulation chance for inner tiles
        const isBorder = r === 0 || r === this.rows - 1 || c === 0 || c === this.cols - 1;
        const shouldEncapsulate =
          config.hasEncapsulations &&
          !isBorder &&
          Math.random() < config.encapsulationChance;

        const posX = startX + c * (this.tileSize + this.tileSpacing);
        const posZ = startZ + r * (this.tileSize + this.tileSpacing);

        const tile: GridTile = {
          id: `tile_${r}_${c}`,
          row: r,
          col: c,
          color,
          collected: false,
          encapsulated: shouldEncapsulate,
          absorbedProgress: 0,
          worldPos: [posX, 0.2, posZ],
        };

        this.tiles.push(tile);
        this.grid[r][c] = tile;
      }
    }
  }

  /**
   * Find exposed perimeter tile facing a specific track side that matches a position and color.
   */
  public findExposedTile(
    side: TrackSide,
    runnerX: number,
    runnerZ: number,
    color: TileColor,
    distanceThreshold = Math.max(0.48, this.tileSize * 1.15),
    isPrismatic: boolean = false
  ): GridTile | null {
    if (side === 'bottom') {
      // Facing bottom track: scan from bottom row upwards for each col
      let closestTile: GridTile | null = null;
      let minDiff = Infinity;

      for (let c = 0; c < this.cols; c++) {
        for (let r = this.rows - 1; r >= 0; r--) {
          const tile = this.grid[r][c];
          if (tile && !tile.collected) {
            // First uncollected tile in column c from the bottom
            if ((isPrismatic || tile.color === color) && tile.worldPos) {
              const diffX = Math.abs(tile.worldPos[0] - runnerX);
              if (diffX < distanceThreshold && diffX < minDiff) {
                minDiff = diffX;
                closestTile = tile;
              }
            }
            break; // only the outermost tile in this column is exposed to the bottom track
          }
        }
      }
      return closestTile;
    } else if (side === 'right') {
      // Facing right track: scan from rightmost col leftwards for each row
      let closestTile: GridTile | null = null;
      let minDiff = Infinity;

      for (let r = 0; r < this.rows; r++) {
        for (let c = this.cols - 1; c >= 0; c--) {
          const tile = this.grid[r][c];
          if (tile && !tile.collected) {
            if ((isPrismatic || tile.color === color) && tile.worldPos) {
              const diffZ = Math.abs(tile.worldPos[2] - runnerZ);
              if (diffZ < distanceThreshold && diffZ < minDiff) {
                minDiff = diffZ;
                closestTile = tile;
              }
            }
            break;
          }
        }
      }
      return closestTile;
    } else if (side === 'top') {
      // Facing top track: scan from top row downwards for each col
      let closestTile: GridTile | null = null;
      let minDiff = Infinity;

      for (let c = 0; c < this.cols; c++) {
        for (let r = 0; r < this.rows; r++) {
          const tile = this.grid[r][c];
          if (tile && !tile.collected) {
            if ((isPrismatic || tile.color === color) && tile.worldPos) {
              const diffX = Math.abs(tile.worldPos[0] - runnerX);
              if (diffX < distanceThreshold && diffX < minDiff) {
                minDiff = diffX;
                closestTile = tile;
              }
            }
            break;
          }
        }
      }
      return closestTile;
    } else if (side === 'left') {
      // Facing left track: scan from leftmost col rightwards for each row
      let closestTile: GridTile | null = null;
      let minDiff = Infinity;

      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const tile = this.grid[r][c];
          if (tile && !tile.collected) {
            if ((isPrismatic || tile.color === color) && tile.worldPos) {
              const diffZ = Math.abs(tile.worldPos[2] - runnerZ);
              if (diffZ < distanceThreshold && diffZ < minDiff) {
                minDiff = diffZ;
                closestTile = tile;
              }
            }
            break;
          }
        }
      }
      return closestTile;
    }

    return null;
  }

  public getRemainingCount(color?: TileColor): number {
    return this.tiles.filter((t) => !t.collected && (!color || t.color === color)).length;
  }

  /** Colors of the first uncleared tiles visible from any side of the board. */
  public getExposedColors(): TileColor[] {
    const colors = new Set<TileColor>();
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const tile = this.grid[r][c];
        if (tile && !tile.collected) { colors.add(tile.color); break; }
      }
      for (let r = this.rows - 1; r >= 0; r--) {
        const tile = this.grid[r][c];
        if (tile && !tile.collected) { colors.add(tile.color); break; }
      }
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = this.grid[r][c];
        if (tile && !tile.collected) { colors.add(tile.color); break; }
      }
      for (let c = this.cols - 1; c >= 0; c--) {
        const tile = this.grid[r][c];
        if (tile && !tile.collected) { colors.add(tile.color); break; }
      }
    }
    return [...colors];
  }

  public getRemainingColors(): TileColor[] {
    const colors = new Set<TileColor>();
    for (const tile of this.tiles) {
      if (!tile.collected) colors.add(tile.color);
    }
    return [...colors];
  }

  public getTotalTiles(): number {
    return this.tiles.length;
  }

  public isCleared(): boolean {
    return this.tiles.every((t) => t.collected);
  }
}
