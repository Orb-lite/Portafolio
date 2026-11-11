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

const _vecA = new THREE.Vector3();

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
  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private clock = new THREE.Clock();

  // Settings
  public version: GameVersion = 'fof';
  public polish: PolishLevel = 'v3';
  public isFishMode: boolean = false;
  public speedMultiplier: number = 1.0;
  public currentLevel: number = 1;
  public paused: boolean = false;

  // Domain Managers
  public trackPath: TrackPath;
  public gridManager: GridManager;
  private primitiveFactory: PrimitiveMeshFactory;
  private fofFactory: FofMeshFactory;
  private worldMeshFactory: WorldMeshFactory;

  // Scene Objects
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

  // Active Game State
  private activeRunners: Array<{
    id: string;
    color: TileColor;
    meshGroup: THREE.Group;
    tailMesh?: THREE.Mesh;
    badgeMat?: THREE.MeshStandardMaterial;
    updateNumber?: (n: number) => void;
    progress: number;
    speed: number;
    remaining: number;
    allocatedRemaining: number;
    squish: number;
    state: 'spawning' | 'running' | 'clearing';
    clearingTimer: number;
    initialProgress: number;
    spawnTimer: number;
    spawnStartPos: THREE.Vector3;
    spawnTargetPos: THREE.Vector3;
    idleTimer: number;
    absorbedCount: number;
    isPrismatic?: boolean;
    spawnFrameProtection?: number;
  }> = [];

  // Comodines Active Tactical States
  public magnetMultiplier: number = 1.0;
  public magnetTimer: number = 0;
  public conveyorSurgeMultiplier: number = 1.0;
  public conveyorSurgeTimer: number = 0;
  public chronoStasisTimer: number = 0;

  private flyingTiles: Array<{
    mesh: THREE.Object3D;
    color: TileColor;
    startPos: THREE.Vector3;
    targetRunnerId: string;
    progress: number;
    arcHeight: number;
    rotAxis: THREE.Vector3;
  }> = [];

  private winExplosionTimeouts: number[] = [];
  private hasTriggeredWin: boolean = false;
  private obstacleTimers = new Map<string, {
    tile: GridTile;
    sprite: THREE.Sprite;
    texture: THREE.CanvasTexture;
    context: CanvasRenderingContext2D;
    unlockAt: number;
    lastLabel: string;
  }>();

  private shakeIntensity: number = 0;
  private baseCameraPos = new THREE.Vector3(0, 19.0, 7.0);
  private cameraTarget = new THREE.Vector3(0, 0.8, 0.35);
  private callbacks: SceneCallbacks;

  constructor(
    container: HTMLElement,
    callbacks: SceneCallbacks,
    initialVersion: GameVersion = 'primitive',
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
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
  }

  private initScene() {
    this.scene = new THREE.Scene();

    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // fallback
    }

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 1000);
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.cameraTarget);

    this.dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    this.dirLight.position.set(4, 12, 6);
    this.dirLight.castShadow = !this.isSoftwareGl;
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.8);
    this.scene.add(this.hemiLight);

    this.scene.add(this.trackGroup);
    this.scene.add(this.backdropGroup);
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
      this.scene.fog = new THREE.FogExp2(bgColor.getHex(), 0.007);
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

    const style = { background: 0x15121e, ground: 0x1e1927, roughness: 0.18, metalness: 0.4 };
    this.scene.background = new THREE.Color(style.background);

    const floorSize = Math.max(60, trackExtent * 2 + 30);
    const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorMat = new THREE.MeshStandardMaterial({
      color: style.ground,
      roughness: style.roughness,
      metalness: style.metalness,
    });
    this.groundMesh = new THREE.Mesh(floorGeo, floorMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.position.y = -0.02;
    this.trackGroup.add(this.groundMesh);

    const { group, beltMaterial } = this.primitiveFactory.createConveyorTrack(this.trackPath);
    this.trackGroup.add(group);
    this.conveyorBeltMaterial = beltMaterial;

    this.gridManager.initGrid(this.currentLevel, this.isFishMode);
    const tileSize = this.gridManager.tileSize;
    for (const tile of this.gridManager.tiles) {
      const mesh = this.primitiveFactory.createTile(tile.color, tile.encapsulated, tileSize);
      if (tile.worldPos) {
        mesh.position.set(tile.worldPos[0], tile.worldPos[1], tile.worldPos[2]);
      }
      this.gridGroup.add(mesh);
      this.tileMeshMap.set(tile.id, mesh);
    }
  }

  public launchRunner(color: TileColor, capacity: number = 12, laneIndex: number = 0): boolean {
    if (this.paused || this.activeRunners.length >= 5) {
      return false;
    }

    const safeCapacity = capacity && capacity > 0 ? capacity : 12;
    const safeLane = Math.abs(Math.floor(laneIndex)) % 4;

    const runnerId = `runner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const spawnPathPos = this.trackPath.getLanePoint(0.0, safeLane);

    let created;
    if (this.isFishMode) {
      created = this.fofFactory.createFishMesh(color, safeCapacity);
    } else {
      created = this.primitiveFactory.createRunnerMesh(color, safeCapacity);
    }

    const meshGroup = created.group;
    meshGroup.position.copy(spawnPathPos);
    meshGroup.scale.set(1, 1, 1);
    meshGroup.visible = true;
    this.runnersGroup.add(meshGroup);

    this.activeRunners.push({
      id: runnerId,
      color: color,
      meshGroup: meshGroup,
      badgeMat: created.badgeMat,
      updateNumber: created.updateNumber,
      progress: 0.0,
      speed: 0.28 * this.speedMultiplier,
      remaining: safeCapacity,
      allocatedRemaining: safeCapacity,
      squish: 0,
      state: 'spawning',
      clearingTimer: 0,
      initialProgress: 0.0,
      spawnTimer: 0,
      spawnStartPos: spawnPathPos.clone().add(new THREE.Vector3(0, 0.4, 0)),
      spawnTargetPos: spawnPathPos.clone(),
      idleTimer: 0,
      absorbedCount: 0,
      spawnFrameProtection: 2,
    });

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
    });
    soundManager.playComodinActivate();
    return toConvert.length;
  }

  public launchPrismaticRunner(capacity: number = 12): boolean {
    if (this.activeRunners.length >= 5) {
      soundManager.playBlocked();
      return false;
    }
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

  private clearGroup(group: THREE.Group) {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
      }
    }
  }

  private clearObstacleTimers() {
    this.obstacleTimers.forEach((item) => {
      this.gridGroup.remove(item.sprite);
      item.texture.dispose();
    });
    this.obstacleTimers.clear();
  }

  private clearWinExplosions() {
    this.winExplosionTimeouts.forEach((t) => clearTimeout(t));
    this.winExplosionTimeouts = [];
  }

  private startLoop() {
    const loop = () => {
      this.frameId = requestAnimationFrame(loop);
      const delta = this.clock.getDelta();
      this.update(delta);
      this.render();
    };
    loop();
  }

  private render() {
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  private update(delta: number) {
    if (this.paused) return;
    const dt = Math.min(delta, 0.1);

    for (let i = this.activeRunners.length - 1; i >= 0; i--) {
      const runner = this.activeRunners[i];

      if (runner.spawnFrameProtection && runner.spawnFrameProtection > 0) {
        runner.spawnFrameProtection--;
        continue;
      }

      if (runner.state === 'spawning') {
        runner.spawnTimer += dt * 3.5;
        if (runner.spawnTimer >= 1.0) {
          runner.state = 'running';
          runner.meshGroup.position.copy(runner.spawnTargetPos);
        } else {
          runner.meshGroup.position.lerpVectors(
            runner.spawnStartPos,
            runner.spawnTargetPos,
            runner.spawnTimer
          );
        }
        continue;
      }

      if (runner.state === 'running') {
        runner.progress = (runner.progress + runner.speed * dt * this.speedMultiplier) % 1.0;
        const currentPos = this.trackPath.getPointOnPath(runner.progress);
        const nextPos = this.trackPath.getPointOnPath((runner.progress + 0.01) % 1.0);

        runner.meshGroup.position.copy(currentPos);
        runner.meshGroup.lookAt(nextPos);

        if (runner.remaining <= 0) {
          runner.state = 'clearing';
          runner.clearingTimer = 0;
        }
      }

      if (runner.state === 'clearing') {
        runner.clearingTimer += dt * 2.5;
        const scaleProgress = Math.max(0, 1 - runner.clearingTimer);
        runner.meshGroup.scale.setScalar(scaleProgress);

        if (runner.clearingTimer >= 1.0) {
          this.runnersGroup.remove(runner.meshGroup);
          this.activeRunners.splice(i, 1);
          this.callbacks.onRunnerCleared?.(runner.id, runner.color);
          this.callbacks.onSlotCountChange?.(this.activeRunners.length);
        }
      }
    }
  }

  public handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    cancelAnimationFrame(this.frameId);
    this.clearObstacleTimers();
    this.clearWinExplosions();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
