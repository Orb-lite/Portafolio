import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ALL_COLORS, GameVersion, PolishLevel, TileColor } from './types';
import { getLevelConfig } from './experience';
import { TrackPath } from './trackPath';
import { GridManager, GridTile } from './gridManager';
import { PrimitiveMeshFactory } from './primitiveMeshFactory';
import { FofMeshFactory } from './fofMeshFactory';
import { WorldMeshFactory } from './worldMeshFactory';
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
    badgeMat: THREE.MeshStandardMaterial;
    updateNumber: (n: number) => void;
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

  private activeParticles: Array<{
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
    rotSpeed: THREE.Vector3;
    gravity?: number;
    drag?: number;
    initialScale?: number;
    flutter?: { freq: number; amp: number; offset: number };
  }> = [];

  private activeShockwaves: Array<{
    mesh: THREE.Mesh;
    currentRadius: number;
    maxRadius: number;
    life: number;
    maxLife: number;
    initialOpacity: number;
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
  private textureLoader = new THREE.TextureLoader();
  private worldTextures = new Map<string, THREE.Texture>();

  private getWorldTexture(path: string, repeat: number = 6): THREE.Texture {
    const key = `${path}_${repeat}`;
    if (this.worldTextures.has(key)) {
      return this.worldTextures.get(key)!;
    }
    const texture = this.textureLoader.load(path, (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat, repeat);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.worldTextures.set(key, texture);
    return texture;
  }

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
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 60;
    this.dirLight.shadow.camera.left = -15;
    this.dirLight.shadow.camera.right = 15;
    this.dirLight.shadow.camera.top = 15;
    this.dirLight.shadow.camera.bottom = -15;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.8);
    this.scene.add(this.hemiLight);

    this.scene.add(this.trackGroup);
    this.scene.add(this.backdropGroup);
    this.scene.add(this.gridGroup);
    this.scene.add(this.runnersGroup);
    this.scene.add(this.vfxGroup);
  }

  public setCameraDistance(y: number, z: number) {
    this.baseCameraPos.set(0, y, z);
    if (this.camera) {
      this.camera.position.copy(this.baseCameraPos);
      this.camera.lookAt(this.cameraTarget);
      this.camera.updateProjectionMatrix();
    }
  }

  public setTimeOfDay(mode: 'day' | 'night') {
    this.timeOfDay = mode;
    this.applyAtmosphere();
  }

  public applyAtmosphere() {
    if (this.isFishMode) {
      if (this.timeOfDay === 'day') {
        const bgColor = new THREE.Color(0x0284c7);
        this.scene.background = bgColor;
        this.scene.fog = new THREE.FogExp2(0x0284c7, 0.007);
        if (this.dirLight) {
          this.dirLight.color.setHex(0xfffbeb);
          this.dirLight.intensity = 1.85;
          this.dirLight.position.set(4, 14, 6);
        }
        if (this.hemiLight) {
          this.hemiLight.color.setHex(0x7dd3fc);
          this.hemiLight.groundColor.setHex(0x0369a1);
          this.hemiLight.intensity = 0.85;
        }
        if (this.groundMesh?.material instanceof THREE.MeshStandardMaterial) {
          this.groundMesh.material.color.setHex(0xffffff);
        }
      } else {
        const bgColor = new THREE.Color(0x021727);
        this.scene.background = bgColor;
        this.scene.fog = new THREE.FogExp2(0x021727, 0.009);
        if (this.dirLight) {
          this.dirLight.color.setHex(0xdbeafe);
          this.dirLight.intensity = 1.35;
          this.dirLight.position.set(-4, 13, 5);
        }
        if (this.hemiLight) {
          this.hemiLight.color.setHex(0x38bdf8);
          this.hemiLight.groundColor.setHex(0x020f1c);
          this.hemiLight.intensity = 0.75;
        }
        if (this.groundMesh?.material instanceof THREE.MeshStandardMaterial) {
          this.groundMesh.material.color.setHex(0x93c5fd);
        }
      }
    } else {
      if (this.dirLight && this.hemiLight) {
        if (this.timeOfDay === 'night') {
          this.dirLight.intensity = 1.1;
          this.hemiLight.intensity = 0.6;
        } else {
          this.dirLight.intensity = 1.8;
          this.hemiLight.intensity = 0.8;
        }
      }
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

    if (this.camera) {
      this.camera.position.copy(this.baseCameraPos);
      this.camera.lookAt(this.cameraTarget);
      this.camera.updateProjectionMatrix();
    }

    if (this.dirLight) {
      this.dirLight.position.set(4, 12, 6);
      const shadowExtent = 12;
      this.dirLight.shadow.camera.left = -shadowExtent;
      this.dirLight.shadow.camera.right = shadowExtent;
      this.dirLight.shadow.camera.top = shadowExtent;
      this.dirLight.shadow.camera.bottom = -shadowExtent;
      this.dirLight.shadow.camera.far = 60;
      this.dirLight.shadow.camera.updateProjectionMatrix();
    }

    this.clearObstacleTimers();
    this.clearGroup(this.trackGroup);
    this.clearGroup(this.backdropGroup);
    this.clearGroup(this.gridGroup);
    this.clearGroup(this.runnersGroup);
    this.clearGroup(this.vfxGroup);
    this.clearWinExplosions();
    this.hasTriggeredWin = false;
    this.tileMeshMap.clear();
    this.activeRunners = [];
    this.flyingTiles = [];
    this.activeParticles = [];
    this.callbacks.onSlotCountChange?.(0);

    if (this.isFishMode) {
      this.applyAtmosphere();
      this.buildScenery(level, trackExtent, 1.0);

      const causticsTex = this.getWorldTexture('/assets/worlds/coral_cove.jpg', 6);
      const floorSize = Math.max(60, trackExtent * 2 + 30);
      const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
      const floorMat = new THREE.MeshStandardMaterial({
        map: causticsTex,
        roughness: 0.75,
        metalness: 0.1,
      });
      this.groundMesh = new THREE.Mesh(floorGeo, floorMat);
      this.groundMesh.rotation.x = -Math.PI / 2;
      this.groundMesh.position.y = -0.02;
      this.groundMesh.receiveShadow = true;
      this.trackGroup.add(this.groundMesh);

      const { group, beltMaterial } = this.fofFactory.createCoralTrack(this.trackPath);
      this.trackGroup.add(group);
      this.conveyorBeltMaterial = beltMaterial;
    } else {
      const worldStyle: Record<Exclude<GameVersion, 'fof'>, { background: number; ground: number; roughness?: number; metalness?: number }> = {
        chess: { background: 0x15121e, ground: 0x1e1927, roughness: 0.18, metalness: 0.4 },
        primitive: { background: 0x15121e, ground: 0x1e1927, roughness: 0.18, metalness: 0.4 },
        land: { background: 0x0f2a20, ground: 0x1e3a2b, roughness: 0.7, metalness: 0.05 },
        birds: { background: 0x0c4a6e, ground: 0x075985, roughness: 0.5, metalness: 0.1 },
        humans: { background: 0x121324, ground: 0x1a1c36, roughness: 0.25, metalness: 0.5 },
        cars: { background: 0x1a1618, ground: 0x242022, roughness: 0.6, metalness: 0.1 },
        aircraft: { background: 0x081f38, ground: 0x0e3256, roughness: 0.3, metalness: 0.3 },
      };
      const style = worldStyle[this.version as Exclude<GameVersion, 'fof'>];
      this.scene.background = new THREE.Color(style.background);
      this.scene.fog = new THREE.Fog(style.background, 30, 90);
      this.dirLight.color.setHex(0xffffff);
      this.hemiLight.color.setHex(0xa5b4fc);
      this.hemiLight.groundColor.setHex(style.ground);

      this.buildScenery(level, trackExtent, 1.0);

      const floorSize = Math.max(60, trackExtent * 2 + 30);
      const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
      const floorMat = new THREE.MeshStandardMaterial({
        color: style.ground,
        roughness: style.roughness ?? 0.35,
        metalness: style.metalness ?? 0.2,
      });
      this.groundMesh = new THREE.Mesh(floorGeo, floorMat);
      this.groundMesh.rotation.x = -Math.PI / 2;
      this.groundMesh.position.y = -0.02;
      this.groundMesh.receiveShadow = true;
      this.trackGroup.add(this.groundMesh);

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

  private buildScenery(level: number, extent: number, zoom: number) {
    const group = this.backdropGroup;
    const scale = Math.max(0.78, Math.min(zoom, 4.5));
    const palette = this.isFishMode
      ? { far: 0x075985, near: 0x0e7490, accent: 0x2dd4bf, glow: 0xf0abfc }
      : { far: 0x29264a, near: 0x49436e, accent: 0xa78bfa, glow: 0x67e8f9 };

    const mat = (color: number, emissive = false) => new THREE.MeshStandardMaterial({
      color,
      roughness: emissive ? 0.45 : 0.8,
      metalness: emissive ? 0.12 : 0.02,
      emissive: emissive ? color : 0x000000,
      emissiveIntensity: emissive ? 0.22 : 0,
      flatShading: true,
    });
    const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };
    const farMat = mat(palette.far);
    const nearMat = mat(palette.near);
    const accentMat = mat(palette.accent, true);
    const glowMat = mat(palette.glow, true);
    const unit = scale;
    const sideX = extent + 0.95 * unit;

    for (const side of [-1, 1]) {
      const pillar = add(
        new THREE.CylinderGeometry(0.12 * unit, 0.17 * unit, (0.55 + (level % 4) * 0.08) * unit, 8),
        side < 0 ? accentMat : glowMat,
        side * sideX,
        0.26 * unit,
        -extent * 0.66
      );
      pillar.rotation.z = side * -0.08;
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

    let meshGroup: THREE.Group;
    let badgeMat: THREE.MeshStandardMaterial;
    let updateNumberFn: (n: number) => void;

    if (this.isFishMode) {
      const created = this.fofFactory.createFishMesh(color, safeCapacity);
      meshGroup = created.group;
      badgeMat = created.badgeMat;
      updateNumberFn = created.updateNumber;
    } else {
      const created = this.primitiveFactory.createRunnerMesh(color, safeCapacity);
      meshGroup = created.group;
      badgeMat = created.badgeMat;
      updateNumberFn = created.updateNumber;
    }

    meshGroup.position.copy(spawnPathPos);
    meshGroup.scale.set(1, 1, 1);
    meshGroup.visible = true;
    this.runnersGroup.add(meshGroup);

    this.activeRunners.push({
      id: runnerId,
      color: color,
      meshGroup: meshGroup,
      badgeMat: badgeMat,
      updateNumber: updateNumberFn,
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
    this.magnetMultiplier = 1.0;
    this.magnetTimer = 0;
    this.conveyorSurgeMultiplier = 1.0;
    this.conveyorSurgeTimer = 0;
    this.chronoStasisTimer = 0;
    this.buildWorld(this.currentLevel);
  }

  public popRandomEncapsulations(count: number = 4): number {
    const trapped = this.gridManager.tiles.filter((t) => !t.collected && t.encapsulated);
    if (trapped.length === 0) return 0;
    const toPop = trapped.slice(0, count);
    toPop.forEach((tile) => {
      this.popEncapsulation(tile);
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
    this.magnetMultiplier = 1.5;
    this.magnetTimer = durationSeconds;
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
    const borderTiles = uncollected.filter(
      (t) => t.row === 0 || t.row === this.gridManager.rows - 1 || t.col === 0 || t.col === this.gridManager.cols - 1
    );
    const pool = borderTiles.length > 0 ? borderTiles : uncollected;
    const toConvert = pool.slice(0, count);
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
      if (last) {
        last.isPrismatic = true;
      }
      soundManager.playComodinActivate();
    }
    return ok;
  }

  public invertBoardTiles(count: number = 5): number {
    const uncollected = this.gridManager.tiles.filter((t) => !t.collected);
    if (uncollected.length <= 4) return 0;
    soundManager.playComodinActivate();
    return Math.min(count, uncollected.length);
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
    if (this.shakeIntensity > 0) {
      this.shakeIntensity = Math.max(0, this.shakeIntensity - 0.015);
      const rx = (Math.random() - 0.5) * this.shakeIntensity;
      const ry = (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.set(
        this.baseCameraPos.x + rx,
        this.baseCameraPos.y + ry,
        this.baseCameraPos.z
      );
    } else {
      this.camera.position.copy(this.baseCameraPos);
    }
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  private popEncapsulation(tile: GridTile) {
    tile.encapsulated = false;
    this.callbacks.onEncapsulationPopped?.(tile.id);
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
