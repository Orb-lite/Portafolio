import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GameVersion, PolishLevel, TileColor } from './types';
import { getLevelConfig } from './experience';
import { TrackPath } from './trackPath';
import { GridManager, GridTile } from './gridLogic';
import { PrimitiveMeshFactory } from './primitiveMeshes';
import { FofMeshFactory } from './fofMeshes';
import { WorldMeshFactory } from './worldMeshes';
import { soundManager } from './sound';

export interface SceneCallbacks {
  onTileAbsorbed?: (tileId: string, color: TileColor, remainingCount: number) => void;
  onTileCollected?: (tileId: string, color: TileColor, remainingCount: number) => void;
  onRunnerCleared?: (runnerId: string, color: TileColor) => void;
  onWinState?: (clearedLevel?: number) => void;
  onLevelComplete?: () => void;
  onGameOver?: () => void;
  onSlotCountChange?: (activeCount: number) => void;
  onEncapsulationPopped?: (tileId: string) => void;
}

export class GameSceneManager {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frameId: number = 0;
  private clock = new THREE.Clock();

  public version: GameVersion = 'fof';
  public polish: PolishLevel = 'v3';
  public isFishMode: boolean = true;
  public speedMultiplier: number = 1.0;
  public currentLevel: number = 1;
  public paused: boolean = false;

  public trackPath: TrackPath;
  public gridManager: GridManager;
  private primitiveFactory: PrimitiveMeshFactory;
  private fofFactory: FofMeshFactory;
  private worldMeshFactory: WorldMeshFactory;

  private gridGroup = new THREE.Group();
  private trackGroup = new THREE.Group();
  private backdropGroup = new THREE.Group();
  private runnersGroup = new THREE.Group();
  private vfxGroup = new THREE.Group();
  private tileMeshMap = new Map<string, THREE.Object3D>();
  private conveyorBeltMaterial: THREE.MeshStandardMaterial | null = null;
  private groundMesh: THREE.Mesh | null = null;
  private dirLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  public timeOfDay: 'day' | 'night' = 'day';

  private activeRunners: Array<{
    id: string;
    color: TileColor;
    meshGroup: THREE.Group;
    badgeMat?: THREE.MeshStandardMaterial;
    updateNumber?: (n: number) => void;
    progress: number;
    speed: number;
    remaining: number;
    allocatedRemaining: number;
    state: 'spawning' | 'running' | 'clearing';
    clearingTimer: number;
    spawnTimer: number;
    spawnStartPos: THREE.Vector3;
    spawnTargetPos: THREE.Vector3;
    idleTimer: number;
    isPrismatic?: boolean;
  }> = [];

  public magnetMultiplier: number = 1.0;
  public magnetTimer: number = 0;
  public conveyorSurgeMultiplier: number = 1.0;
  public conveyorSurgeTimer: number = 0;
  public chronoStasisTimer: number = 0;

  private flyingTiles: Array<{ mesh: THREE.Object3D }> = [];
  private hasTriggeredWin: boolean = false;
  private baseCameraPos = new THREE.Vector3(0, 18.0, 7.5);
  private cameraTarget = new THREE.Vector3(0, 0, 0);
  private callbacks: SceneCallbacks;

  constructor(
    container: HTMLElement,
    callbacks: SceneCallbacks,
    initialVersion: GameVersion = 'fof',
    initialPolish: PolishLevel = 'v3',
    initialLevel: number = 1
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.version = initialVersion;
    this.polish = initialPolish;
    this.isFishMode = initialVersion === 'fof';
    this.currentLevel = initialLevel;

    this.trackPath = new TrackPath();
    this.gridManager = new GridManager(initialLevel, this.isFishMode);
    this.primitiveFactory = new PrimitiveMeshFactory();
    this.fofFactory = new FofMeshFactory();
    this.worldMeshFactory = new WorldMeshFactory();

    this.initRenderer();
    this.initScene();
    this.buildWorld(initialLevel);
    this.startLoop();

    (window as any).sceneManager = this;
  }

  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
  }

  private initScene() {
    this.scene = new THREE.Scene();

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 1000);
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.cameraTarget);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    this.dirLight.position.set(5, 15, 8);
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0369a1, 1.2);
    this.scene.add(this.hemiLight);

    this.scene.add(this.backdropGroup);
    this.scene.add(this.trackGroup);
    this.scene.add(this.gridGroup);
    this.scene.add(this.runnersGroup);
    this.scene.add(this.vfxGroup);
  }

  public setTimeOfDay(mode: 'day' | 'night') {
    this.timeOfDay = mode;
    this.applyAtmosphere();
  }

  public applyAtmosphere() {
    if (this.isFishMode) {
      const bgColor = this.timeOfDay === 'day' ? new THREE.Color(0x0284c7) : new THREE.Color(0x021727);
      this.scene.background = bgColor;
      this.scene.fog = new THREE.FogExp2(bgColor.getHex(), 0.008);
    } else {
      this.scene.background = new THREE.Color(0x0f172a);
      this.scene.fog = new THREE.Fog(0x0f172a, 20, 80);
    }
  }

  public setMode(version: GameVersion, polish: PolishLevel, level: number = this.currentLevel) {
    this.version = version;
    this.polish = polish;
    this.isFishMode = version === 'fof';
    this.buildWorld(level);
  }

  public buildWorld(level: number = this.currentLevel) {
    this.currentLevel = level;
    const levelConfig = getLevelConfig(level, this.isFishMode);
    const boardHalfSize = levelConfig.rows * 0.3;
    const trackExtent = boardHalfSize + 1.4;

    this.trackPath = new TrackPath(-trackExtent, trackExtent, -trackExtent, trackExtent, 0.9);

    this.clearGroup(this.trackGroup);
    this.clearGroup(this.backdropGroup);
    this.clearGroup(this.gridGroup);
    this.clearGroup(this.runnersGroup);
    this.clearGroup(this.vfxGroup);
    this.tileMeshMap.clear();
    this.activeRunners = [];
    this.flyingTiles = [];
    this.callbacks.onSlotCountChange?.(0);

    this.applyAtmosphere();

    const floorSize = Math.max(80, trackExtent * 2 + 40);
    const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorMat = new THREE.MeshStandardMaterial({
      color: this.isFishMode ? 0x0284c7 : 0x1e293b,
      roughness: 0.6,
      metalness: 0.1,
    });
    this.groundMesh = new THREE.Mesh(floorGeo, floorMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.position.y = -0.1;
    this.trackGroup.add(this.groundMesh);

    this.buildScenery(level, trackExtent);

    if (this.isFishMode) {
      const { group, beltMaterial } = this.fofFactory.createCoralTrack(this.trackPath);
      this.trackGroup.add(group);
      this.conveyorBeltMaterial = beltMaterial;
    } else {
      const { group, beltMaterial } = this.primitiveFactory.createConveyorTrack(this.trackPath);
      this.trackGroup.add(group);
      this.conveyorBeltMaterial = beltMaterial;
    }

    this.gridManager.initGrid(this.currentLevel, this.isFishMode);
    const tileSize = this.gridManager.tileSize;
    for (const tile of this.gridManager.tiles) {
      let mesh: THREE.Object3D;
      if (this.isFishMode) {
        mesh = this.fofFactory.createPearlTile(tile.color, tile.encapsulated, tileSize, tile.shieldLayers || 0, tile.specialType);
      } else {
        mesh = this.primitiveFactory.createTile(tile.color, tile.encapsulated, tileSize);
      }

      if (tile.worldPos) {
        mesh.position.set(tile.worldPos[0], tile.worldPos[1], tile.worldPos[2]);
      }
      this.gridGroup.add(mesh);
      this.tileMeshMap.set(tile.id, mesh);
    }
  }

  private buildScenery(level: number, extent: number) {
    const group = this.backdropGroup;
    const colors = [0xf472b6, 0x38bdf8, 0xfacc15, 0x34d399, 0xa78bfa];

    for (let i = -8; i <= 8; i += 2) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[Math.abs(i) % colors.length],
        roughness: 0.4,
        metalness: 0.1,
        flatShading: true,
      });

      const geo = new THREE.ConeGeometry(0.8, 2.8 + Math.abs(i) * 0.2, 5);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(i * (extent * 0.4), 1.2, -extent - 2.5);
      group.add(mesh);

      const sideGeo = new THREE.DodecahedronGeometry(0.7, 1);
      const sideMesh = new THREE.Mesh(sideGeo, mat);
      sideMesh.position.set(i % 2 === 0 ? extent + 2.5 : -extent - 2.5, 0.6, i * 1.5);
      group.add(sideMesh);
    }
  }

  public launchRunner(color: TileColor, capacity: number = 12, laneIndex: number = 0): boolean {
    if (this.paused || this.activeRunners.length >= 5) return false;

    const safeCapacity = capacity && capacity > 0 ? capacity : 12;
    const runnerId = `runner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialProgress = (laneIndex * 0.5) % 1.0;
    const spawnPathPos = this.trackPath.getPointOnPath(initialProgress);

    let created: any;
    if (this.isFishMode) {
      created = this.fofFactory.createFishMesh(color, safeCapacity);
    } else {
      created = this.primitiveFactory.createRunnerMesh(color, safeCapacity);
    }

    const meshGroup = created.group;
    meshGroup.position.copy(spawnPathPos);
    meshGroup.scale.set(1.4, 1.4, 1.4);
    meshGroup.visible = true;

    if (created.updateNumber) {
      created.updateNumber(safeCapacity);
    }

    this.runnersGroup.add(meshGroup);

    this.activeRunners.push({
      id: runnerId,
      color: color,
      meshGroup: meshGroup,
      badgeMat: created.badgeMat,
      updateNumber: created.updateNumber,
      progress: initialProgress,
      speed: 0.38 * this.speedMultiplier,
      remaining: safeCapacity,
      allocatedRemaining: safeCapacity,
      state: 'running',
      clearingTimer: 0,
      spawnTimer: 1.0,
      spawnStartPos: spawnPathPos,
      spawnTargetPos: spawnPathPos,
      idleTimer: 0,
    });

    soundManager.playLaunch(this.isFishMode);
    this.callbacks.onSlotCountChange?.(this.activeRunners.length);
    return true;
  }

  public getExposedColors(): TileColor[] {
    return this.gridManager.getExposedColors();
  }

  public getRemainingColors(): TileColor[] {
    return this.gridManager.getRemainingColors();
  }

  public getActiveRunnerColors(): TileColor[] {
    return this.activeRunners.map((r) => r.color);
  }

  public getFlyingTilesCount(): number {
    return this.flyingTiles.length;
  }

  public resetLevel(level: number = this.currentLevel) {
    this.currentLevel = level;
    this.buildWorld(this.currentLevel);
  }

  public popRandomEncapsulations(count: number = 4): number {
    const trapped = this.gridManager.tiles.filter((t) => !t.collected && t.encapsulated);
    if (trapped.length === 0) return 0;
    const toPop = trapped.slice(0, count);
    toPop.forEach((tile) => {
      tile.encapsulated = false;
      this.updateTileMesh(tile);
    });
    soundManager.playBubblePop();
    return toPop.length;
  }

  public applyMagnetBoost(durationSeconds: number = 18, multiplier: number = 1.4) {
    this.magnetMultiplier = multiplier;
    this.magnetTimer = durationSeconds;
    soundManager.playComodinActivate();
  }

  public applyConveyorSurge(durationSeconds: number = 12, multiplier: number = 1.8) {
    this.conveyorSurgeMultiplier = multiplier;
    this.conveyorSurgeTimer = durationSeconds;
    soundManager.playComodinActivate();
  }

  public applyChronoStasis(durationSeconds: number = 20) {
    this.chronoStasisTimer = durationSeconds;
    soundManager.playComodinActivate();
  }

  public ejectMostIdleRunner(): boolean {
    if (this.activeRunners.length === 0) return false;
    const target = [...this.activeRunners].sort((a, b) => (b.idleTimer || 0) - (a.idleTimer || 0))[0];
    if (target && target.state === 'running') {
      target.state = 'clearing';
      this.callbacks.onRunnerCleared?.(target.id, target.color);
      this.callbacks.onSlotCountChange?.(Math.max(0, this.activeRunners.length - 1));
      return true;
    }
    return false;
  }

  public convertPerimeterTiles(targetColor: TileColor, count: number = 3): number {
    const uncollected = this.gridManager.tiles.filter((t) => !t.collected && t.color !== targetColor);
    if (uncollected.length === 0) return 0;
    const toConvert = uncollected.slice(0, count);
    toConvert.forEach((tile) => {
      tile.color = targetColor;
      this.updateTileMesh(tile);
    });
    soundManager.playComodinActivate();
    return toConvert.length;
  }

  public launchPrismaticRunner(capacity: number = 12): boolean {
    if (this.activeRunners.length >= 5) return false;
    const ok = this.launchRunner('purple', capacity, 1);
    if (ok) {
      const last = this.activeRunners[this.activeRunners.length - 1];
      if (last) last.isPrismatic = true;
      soundManager.playComodinActivate();
    }
    return ok;
  }

  public invertBoardTiles(count: number = 5): number {
    soundManager.playComodinActivate();
    return count;
  }

  private updateTileMesh(tile: GridTile) {
    const oldMesh = this.tileMeshMap.get(tile.id);
    if (oldMesh) this.gridGroup.remove(oldMesh);
    const tileSize = this.gridManager.tileSize;
    let newMesh: THREE.Object3D;
    if (this.isFishMode) {
      newMesh = this.fofFactory.createPearlTile(tile.color, tile.encapsulated, tileSize, tile.shieldLayers || 0, tile.specialType);
    } else {
      newMesh = this.primitiveFactory.createTile(tile.color, tile.encapsulated, tileSize);
    }
    if (tile.worldPos) {
      newMesh.position.set(tile.worldPos[0], tile.worldPos[1], tile.worldPos[2]);
    }
    this
