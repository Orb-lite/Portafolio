import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GameVersion, PolishLevel, TileColor, TrackSide, FlyingTile, GridTile } from './types';
import { TrackPath } from './trackPath';
import { GridManager } from './gridLogic';
import { PrimitiveMeshFactory } from './primitiveMeshes';
import { FofMeshFactory } from './fofMeshes';
import { soundManager } from './sound';
import { createWaterCausticsTexture } from './proceduralTextures';
import { getLevelConfig } from './experience';
import { WorldMeshFactory } from './worldMeshes';

// Pre-allocated math objects to eliminate GC pauses in render loop
const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();

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

  // Screen shake & Camera
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

    // Expone la instancia en window para pruebas en vivo desde la consola F12
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
    console.log(`🎥 Posición actual -> Elevación Y: ${y}, Alejamiento Z: ${z}`);
  }

  public setTimeOfDay(mode: 'day' | 'night') {
    this.timeOfDay = mode;
    this.applyAtmosphere();
  }

  public applyAtmosphere() {
    if (this.isFishMode) {
      if (this.timeOfDay === 'day') {
        const bgColor = new THREE.Color(0x0284c7); // Tropical bright cyan sea
        this.scene.background = bgColor;
        this.scene.fog = new THREE.FogExp2(0x0284c7, 0.007);
        if (this.dirLight) {
          this.dirLight.color.setHex(0xfffbeb); // Warm sunlight
          this.dirLight.intensity = 1.85;
          this.dirLight.position.set(4, 14, 6);
        }
        if (this.hemiLight) {
          this.hemiLight.color.setHex(0x7dd3fc); // Sky cyan
          this.hemiLight.groundColor.setHex(0x0369a1); // Deep lagoon ground
          this.hemiLight.intensity = 0.85;
        }
        if (this.groundMesh?.material instanceof THREE.MeshStandardMaterial) {
          this.groundMesh.material.color.setHex(0xffffff);
        }
      } else {
        const bgColor = new THREE.Color(0x021727); // Deep nocturnal bioluminescent sea
        this.scene.background = bgColor;
        this.scene.fog = new THREE.FogExp2(0x021727, 0.009);
        if (this.dirLight) {
          this.dirLight.color.setHex(0xdbeafe); // Silvery moonlight
          this.dirLight.intensity = 1.35;
          this.dirLight.position.set(-4, 13, 5);
        }
        if (this.hemiLight) {
          this.hemiLight.color.setHex(0x38bdf8); // Bioluminescent glow
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

      if (this.version === 'chess' || this.version === 'primitive') {
        const ringGeo = new THREE.RingGeometry(trackExtent + 0.15, trackExtent + 0.38, 64);
        const goldRingMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          metalness: 0.9,
          roughness: 0.2,
          emissive: 0xb45309,
          emissiveIntensity: 0.15,
        });
        const ringMesh = new THREE.Mesh(ringGeo, goldRingMat);
        ringMesh.rotation.x = -Math.PI / 2;
        ringMesh.position.y = -0.015;
        ringMesh.receiveShadow = true;
        this.trackGroup.add(ringMesh);
      }

      const { group, beltMaterial } = this.primitiveFactory.createConveyorTrack(this.trackPath);
      this.trackGroup.add(group);
      this.conveyorBeltMaterial = beltMaterial;
    }

    this.gridManager.initGrid(this.currentLevel, this.isFishMode);
    const tileSize = this.gridManager.tileSize;
    for (const tile of this.gridManager.tiles) {
      let mesh: THREE.Object3D;
      if (this.isFishMode) {
        mesh = this.fofFactory.createPearlTile(tile.color, tile.encapsulated, tileSize);
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
        : this.version === 'chess'
          ? { far: 0x3e3548, near: 0x76604f, accent: 0xe7d4ad, glow: 0xd5a84f }
          : this.version === 'land'
        ? { far: 0x173f32, near: 0x2d6a4f, accent: 0x74a84a, glow: 0xfbbf24 }
        : this.version === 'birds'
          ? { far: 0x3b82b9, near: 0x86c5df, accent: 0xe0f2fe, glow: 0xffd166 }
          : this.version === 'humans'
            ? { far: 0x252d4a, near: 0x475569, accent: 0x38bdf8, glow: 0xf97316 }
            : this.version === 'cars'
              ? { far: 0x252d39, near: 0x475569, accent: 0xfacc15, glow: 0xf43f5e }
              : this.version === 'aircraft'
                ? { far: 0x102f5a, near: 0x2563a6, accent: 0x93c5fd, glow: 0xfde68a }
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
    const backZ = -extent - 0.75 * unit;
    const sideX = extent + 0.95 * unit;

    for (let i = -4; i <= 4; i++) {
      const x = i * extent * 0.31;
      const hill = add(new THREE.SphereGeometry(1, 10, 7), i % 2 ? nearMat : farMat,
        x, -0.18 * unit, backZ - Math.abs(i % 3) * 0.28 * unit,
        (0.78 + (Math.abs(i) % 3) * 0.16) * unit, (0.78 + ((level + i + 10) % 4) * 0.09) * unit, 0.32 * unit);
      hill.rotation.y = i * 0.12;
    }

    const orb = add(new THREE.SphereGeometry(1, 20, 14), glowMat,
      extent * 0.68, (4.4 + (level % 5) * 0.28) * unit, backZ - 0.35 * unit,
      0.76 * unit, 0.76 * unit, 0.18 * unit);
    orb.name = 'level-sky-orb';

    if (this.version === 'land' || this.version === 'birds') {
      for (let i = -3; i <= 3; i++) {
        const x = i * extent * 0.34;
        if (this.version === 'land') {
          add(new THREE.CylinderGeometry(0.08 * unit, 0.13 * unit, 0.45 * unit, 6), farMat, x, 0.22 * unit, backZ + 0.2 * unit);
          add(new THREE.ConeGeometry((0.38 + (i & 1) * 0.08) * unit, (1.05 + ((level + i + 10) % 3) * 0.12) * unit, 7), i % 2 ? nearMat : accentMat, x, 0.88 * unit, backZ + 0.2 * unit);
          add(new THREE.ConeGeometry(0.27 * unit, 0.78 * unit, 7), farMat, x, 1.42 * unit, backZ + 0.2 * unit);
        } else {
          for (let puff = -1; puff <= 1; puff++) {
            add(new THREE.SphereGeometry(0.48 * unit, 10, 7), accentMat,
              x + puff * 0.42 * unit, (2.5 + Math.abs(puff) * 0.12) * unit, backZ + 0.15 * unit,
              1.12, 0.68, 0.8);
          }
        }
      }
    } else if (this.version === 'chess' || this.version === 'primitive') {
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.88,
        roughness: 0.22,
        emissive: 0xb45309,
        emissiveIntensity: 0.2,
      });
      const marbleWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.28,
        metalness: 0.12,
      });
      const marbleDarkMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        roughness: 0.32,
        metalness: 0.18,
      });
      const rubyMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.7,
        roughness: 0.1,
        metalness: 0.6,
      });

      const cornerOffsets = [
        { x: -(extent + 0.55), z: -(extent + 0.55) },
        { x: (extent + 0.55), z: -(extent + 0.55) },
        { x: -(extent + 0.55), z: (extent + 0.55) },
        { x: (extent + 0.55), z: (extent + 0.55) },
      ];

      for (const { x: cx, z: cz } of cornerOffsets) {
        add(new THREE.BoxGeometry(0.72 * unit, 0.18 * unit, 0.72 * unit), marbleDarkMat, cx, 0.09 * unit, cz);
        add(new THREE.CylinderGeometry(0.38 * unit, 0.44 * unit, 0.18 * unit, 16), goldMat, cx, 0.25 * unit, cz);
        add(new THREE.CylinderGeometry(0.32 * unit, 0.38 * unit, 1.45 * unit, 16), marbleWhiteMat, cx, 1.05 * unit, cz);
        add(new THREE.TorusGeometry(0.34 * unit, 0.045 * unit, 8, 20), goldMat, cx, 1.05 * unit, cz);
        add(new THREE.CylinderGeometry(0.44 * unit, 0.32 * unit, 0.26 * unit, 16), marbleDarkMat, cx, 1.88 * unit, cz);

        for (let c = 0; c < 4; c++) {
          const ca = c * Math.PI / 2 + Math.PI / 4;
          add(new THREE.BoxGeometry(0.14 * unit, 0.18 * unit, 0.14 * unit), marbleDarkMat,
            cx + Math.cos(ca) * 0.32 * unit, 2.05 * unit, cz + Math.sin(ca) * 0.32 * unit);
        }

        add(new THREE.CylinderGeometry(0.28 * unit, 0.28 * unit, 0.12 * unit, 16), goldMat, cx, 2.15 * unit, cz);
        for (let s = 0; s < 4; s++) {
          const sa = s * Math.PI / 2;
          add(new THREE.ConeGeometry(0.05 * unit, 0.22 * unit, 5), goldMat,
            cx + Math.cos(sa) * 0.22 * unit, 2.3 * unit, cz + Math.sin(sa) * 0.22 * unit);
        }
        add(new THREE.SphereGeometry(0.09 * unit, 12, 10), rubyMat, cx, 2.36 * unit, cz);
      }

      for (let i = -3; i <= 3; i++) {
        const x = i * extent * 0.34;
        const towerMat = i % 2 ? nearMat : farMat;
        add(new THREE.CylinderGeometry(0.42 * unit, 0.5 * unit, 1.35 * unit, 10), towerMat,
          x, 0.66 * unit, backZ + 0.12 * unit);
        add(new THREE.CylinderGeometry(0.47 * unit, 0.47 * unit, 0.12 * unit, 10), accentMat,
          x, 1.39 * unit, backZ + 0.12 * unit);
        for (let crenel = 0; crenel < 4; crenel++) {
          const angle = crenel * Math.PI / 2 + i * 0.1;
          add(new THREE.BoxGeometry(0.2 * unit, 0.25 * unit, 0.2 * unit), towerMat,
            x + Math.cos(angle) * 0.34 * unit, 1.56 * unit, backZ + 0.12 * unit + Math.sin(angle) * 0.34 * unit);
        }
      }
      for (const side of [-1, 1]) {
        const standard = add(new THREE.CylinderGeometry(0.035 * unit, 0.055 * unit, 1.7 * unit, 6), accentMat,
          side * sideX, 0.82 * unit, -extent * 0.62);
        standard.rotation.z = side * -0.07;
        add(new THREE.BoxGeometry(0.48 * unit, 0.29 * unit, 0.05 * unit), glowMat,
          side * (sideX - 0.18 * unit), 1.43 * unit, -extent * 0.62);
      }
    } else if (this.version === 'humans' || this.version === 'cars') {
      for (let i = -4; i <= 4; i++) {
        const x = i * extent * 0.27;
        const h = (1.05 + ((level * 7 + i * 11 + 60) % 7) * 0.22) * unit;
        add(new THREE.BoxGeometry((0.54 + (i % 2) * 0.08) * unit, h, 0.62 * unit), i % 2 ? farMat : nearMat, x, h / 2 - 0.04 * unit, backZ);
        for (let w = 0; w < 2; w++) {
          add(new THREE.BoxGeometry(0.07 * unit, 0.11 * unit, 0.025 * unit), glowMat,
            x + (w ? 0.13 : -0.13) * unit, h * (0.34 + (w * 0.28)), backZ + 0.32 * unit);
        }
      }
      if (this.version === 'cars') {
        for (const side of [-1, 1]) {
          const x = side * sideX;
          add(new THREE.CylinderGeometry(0.035 * unit, 0.055 * unit, 1.55 * unit, 6), farMat, x, 0.76 * unit, -extent * 0.36);
          add(new THREE.BoxGeometry(0.32 * unit, 0.14 * unit, 0.18 * unit), glowMat, x, 1.52 * unit, -extent * 0.36);
        }
      }
    } else if (this.version === 'aircraft') {
      for (let i = -3; i <= 3; i++) {
        const x = i * extent * 0.36;
        add(new THREE.CylinderGeometry(0.04 * unit, 0.06 * unit, 0.65 * unit, 7), farMat, x, 0.32 * unit, backZ + 0.12 * unit);
        add(new THREE.SphereGeometry(0.13 * unit, 8, 6), i % 2 ? accentMat : glowMat, x, 0.7 * unit, backZ + 0.12 * unit);
      }
      for (let i = 0; i < 4; i++) {
        const cloudZ = backZ - (0.5 + i * 0.45) * unit;
        const x = (i - 1.5) * extent * 0.45;
        add(new THREE.SphereGeometry(0.46 * unit, 9, 6), accentMat, x, (3.0 + (i % 2) * 0.45) * unit, cloudZ, 1.55, 0.48, 0.8);
      }
    } else {
      for (let i = -3; i <= 3; i++) {
        const x = i * extent * 0.34;
        if (this.isFishMode) {
          for (let branch = -1; branch <= 1; branch++) {
            add(new THREE.CylinderGeometry(0.07 * unit, 0.12 * unit, (0.9 + (branch === 0 ? 0.45 : 0)) * unit, 6), i % 2 ? glowMat : accentMat,
              x + branch * 0.22 * unit, 0.48 * unit, backZ + 0.12 * unit, 1, 1, 1);
          }
          add(new THREE.SphereGeometry(0.23 * unit, 8, 6), i % 2 ? accentMat : glowMat, x, 1.1 * unit, backZ + 0.12 * unit);
        } else {
          const shard = add(new THREE.OctahedronGeometry((0.32 + (i & 1) * 0.13) * unit, 0), i % 2 ? accentMat : glowMat,
            x, (0.9 + ((level + i + 10) % 4) * 0.16) * unit, backZ + 0.12 * unit,
            0.7, 1.4, 0.7);
          shard.rotation.z = i * 0.22;
        }
      }
    }

    for (const side of [-1, 1]) {
      const pillar = add(new THREE.CylinderGeometry(0.12 * unit, 0.17 * unit, (0.55 + (level % 4) * 0.08) * unit, 8),
        side < 0 ? accentMat : glowMat, side * sideX, 0.26 * unit, -extent * 0.66);
      pillar.rotation.z = side * -0.08;
    }
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

  public launchRunner(
    color: TileColor,
    capacity: number,
    colIndex: number = 0
  ): boolean {
    if (this.activeRunners.length >= 5) {
      soundManager.playBlocked();
      return false;
    }

    const matchingOnBoard = this.gridManager.getRemainingCount(color);
    const actualCapacity = matchingOnBoard > 0 ? Math.min(capacity, matchingOnBoard) : capacity;

    const runnerId = `runner_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    let runnerMeshGroup: THREE.Group;
    let tailMesh: THREE.Mesh | undefined;
    let badgeMat: THREE.MeshStandardMaterial;
    let updateNumber: (n: number) => void;

    if (this.isFishMode) {
      const fishObj = this.fofFactory.createFishRunner(color, actualCapacity);
      runnerMeshGroup = fishObj.group;
      tailMesh = fishObj.tailMesh;
      badgeMat = fishObj.badgeMat;
      updateNumber = fishObj.updateNumber;
    } else if (this.version === 'primitive') {
      const primObj = this.primitiveFactory.createRunner(color, actualCapacity);
      runnerMeshGroup = primObj.group;
      badgeMat = primObj.badgeMat;
      updateNumber = primObj.updateNumber;
    } else {
      const themedObj = this.worldMeshFactory.createRunner(this.version as Exclude<GameVersion, 'primitive' | 'fof'>, color, actualCapacity);
      runnerMeshGroup = themedObj.group;
      tailMesh = themedObj.tailMesh;
      badgeMat = themedObj.badgeMat;
      updateNumber = themedObj.updateNumber;
    }

    const counterCanvas = document.createElement('canvas');
    counterCanvas.width = 256;
    counterCanvas.height = 80;
    const counterContext = counterCanvas.getContext('2d');
    const counterTexture = new THREE.CanvasTexture(counterCanvas);
    counterTexture.colorSpace = THREE.SRGBColorSpace;
    const counterMaterial = new THREE.SpriteMaterial({
      map: counterTexture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const counterSprite = new THREE.Sprite(counterMaterial);
    counterSprite.position.set(0, 1.05, 0);
    counterSprite.scale.set(0.9, 0.28, 1);
    runnerMeshGroup.add(counterSprite);
    const updateRemainingCounter = (remaining: number) => {
      if (!counterContext) return;
      counterContext.clearRect(0, 0, counterCanvas.width, counterCanvas.height);
      counterContext.fillStyle = 'rgba(15, 23, 42, 0.92)';
      counterContext.beginPath();
      counterContext.roundRect(8, 8, 240, 64, 28);
      counterContext.fill();
      counterContext.strokeStyle = this.isFishMode ? '#38bdf8' : '#a5b4fc';
      counterContext.lineWidth = 5;
      counterContext.stroke();
      counterContext.fillStyle = '#ffffff';
      counterContext.font = '900 38px Arial, sans-serif';
      counterContext.textAlign = 'center';
      counterContext.textBaseline = 'middle';
      counterContext.fillText(`${remaining} LEFT`, 128, 41);
      counterTexture.needsUpdate = true;
    };
    const updateBadgeNumber = updateNumber;
    updateNumber = (remaining: number) => {
      updateBadgeNumber(remaining);
      updateRemainingCounter(remaining);
    };
    updateNumber(actualCapacity);

    const colSpacing = 0.9;
    const colOffset = (colIndex - 1.5) * colSpacing;
    const spawnPos = new THREE.Vector3(colOffset, -0.9, this.trackPath.zMax + 1.0);

    const targetX = Math.max(
      this.trackPath.xMin + this.trackPath.radius,
      Math.min(this.trackPath.xMax - this.trackPath.radius, colOffset)
    );
    const targetPos = new THREE.Vector3(targetX, 0.1, this.trackPath.zMax);

    const x0 = this.trackPath.xMin + this.trackPath.radius;
    const initialDist = Math.max(0, targetX - x0);
    const initialProgress = initialDist / this.trackPath.totalLength;

    runnerMeshGroup.position.copy(spawnPos);
    runnerMeshGroup.rotation.y = 0;
    this.runnersGroup.add(runnerMeshGroup);

    soundManager.playLaunch(this.isFishMode);

    this.activeRunners.push({
      id: runnerId,
      color,
      meshGroup: runnerMeshGroup,
      tailMesh,
      badgeMat,
      updateNumber,
      progress: initialProgress,
      speed: 0.16 * this.speedMultiplier,
      remaining: actualCapacity,
      allocatedRemaining: actualCapacity,
      squish: 0,
      state: 'spawning',
      initialProgress,
      spawnTimer: 0,
      spawnStartPos: spawnPos,
      spawnTargetPos: targetPos,
      clearingTimer: 0,
      idleTimer: 0,
      absorbedCount: 0,
    });

    this.callbacks.onSlotCountChange?.(this.activeRunners.length);
    return true;
  }

  public addRunner(color: TileColor, capacity: number, colIndex: number = 0): boolean {
    return this.launchRunner(color, capacity, colIndex);
  }

  public spawnRunner(color: TileColor, capacity: number, colIndex: number = 0): boolean {
    return this.launchRunner(color, capacity, colIndex);
  }

  public getActiveRunnerCount(): number {
    return this.activeRunners.length;
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

  public rebuildGridTilesMaterials() {
    const tileSize = this.gridManager.tileSize;
    for (const tile of this.gridManager.tiles) {
      if (tile.collected) continue;
      const oldMesh = this.tileMeshMap.get(tile.id);
      if (oldMesh) {
        this.gridGroup.remove(oldMesh);
      }
      let newMesh: THREE.Object3D;
      if (this.isFishMode) {
        newMesh = this.fofFactory.createPearlTile(tile.color, tile.encapsulated, tileSize);
      } else {
        newMesh = this.primitiveFactory.createTile(tile.color, tile.encapsulated, tileSize);
      }
      if (tile.worldPos) {
        newMesh.position.set(tile.worldPos[0], tile.worldPos[1], tile.worldPos[2]);
      }
      this.gridGroup.add(newMesh);
      this.tileMeshMap.set(tile.id, newMesh);
    }
  }

  public popRandomEncapsulations(count: number = 4): number {
    const trapped = this.gridManager.tiles.filter((t) => !t.collected && t.encapsulated);
    if (trapped.length === 0) return 0;
    const toPop = trapped.slice(0, count);
    toPop.forEach((tile) => {
      this.popEncapsulation(tile);
      if (tile.worldPos) {
        this.spawnCelebrationBurst(new THREE.Vector3(...tile.worldPos), tile.color);
      }
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
      this.spawnCelebrationBurst(target.meshGroup.position, target.color);
      soundManager.playCharacterCleared(this.isFishMode);
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
      if (tile.worldPos) {
        this.spawnCelebrationBurst(new THREE.Vector3(...tile.worldPos), targetColor);
      }
    });
    this.rebuildGridTilesMaterials();
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
        this.spawnCelebrationBurst(last.meshGroup.position, 'magenta');
      }
      soundManager.playComodinActivate();
    }
    return ok;
  }

  public invertBoardTiles(count: number = 5): number {
    const uncollected = this.gridManager.tiles.filter((t) => !t.collected);
    if (uncollected.length <= 4) return 0;
    const counts = new Map<TileColor, number>();
    uncollected.forEach((t) => counts.set(t.color, (counts.get(t.color) || 0) + 1));
    let bestColor: TileColor = 'blue';
    let maxCount = 0;
    counts.forEach((c, col) => {
      if (c > maxCount) {
        maxCount = c;
        bestColor = col;
      }
    });
    const interior = uncollected.filter(
      (t) => t.color === bestColor && t.row > 0 && t.row < this.gridManager.rows - 1 && t.col > 0 && t.col < this.gridManager.cols - 1
    );
    const border = uncollected.filter(
      (t) => t.color !== bestColor && (t.row === 0 || t.row === this.gridManager.rows - 1 || t.col === 0 || t.col === this.gridManager.cols - 1)
    );
    const swapCount = Math.min(count, interior.length, border.length);
    for (let i = 0; i < swapCount; i++) {
      const tempColor = interior[i].color;
      interior[i].color = border[i].color;
      border[i].color = tempColor;
      if (border[i].worldPos) {
        this.spawnAbsorbParticles(new THREE.Vector3(...border[i].worldPos!), bestColor);
      }
    }
    if (swapCount > 0) {
      this.rebuildGridTilesMaterials();
      soundManager.playComodinActivate();
    }
    return swapCount;
  }

  private update(delta: number) {
    if (this.paused) return;
    const dt = Math.min(delta, 0.1);
    const time = this.clock.getElapsedTime();

    if (this.conveyorBeltMaterial && this.conveyorBeltMaterial.map) {
      const runnerBaseSpeed = 0.16;
      const conveyorSpeed = 14 * runnerBaseSpeed * this.speedMultiplier;
      this.conveyorBeltMaterial.map.offset.x -= dt * conveyorSpeed;
    }

    if (this.magnetTimer > 0) {
      this.magnetTimer = Math.max(0, this.magnetTimer - dt);
      if (this.magnetTimer === 0) this.magnetMultiplier = 1.0;
    }
    if (this.conveyorSurgeTimer > 0) {
      this.conveyorSurgeTimer = Math.max(0, this.conveyorSurgeTimer - dt);
      if (this.conveyorSurgeTimer === 0) this.conveyorSurgeMultiplier = 1.0;
    }
    if (this.chronoStasisTimer > 0) {
      this.chronoStasisTimer = Math.max(0, this.chronoStasisTimer - dt);
    }

    for (let i = this.activeRunners.length - 1; i >= 0; i--) {
      const runner = this.activeRunners[i];

      if (runner.state === 'spawning') {
        runner.spawnTimer += dt * 2.8;
        const t = Math.min(1.0, runner.spawnTimer);
        const jumpY = Math.sin(t * Math.PI) * 1.6;
        runner.meshGroup.position.lerpVectors(runner.spawnStartPos, runner.spawnTargetPos, t);
        runner.meshGroup.position.y += jumpY;
        runner.meshGroup.rotation.y = THREE.MathUtils.lerp(0.2, 0, t);

        if (t >= 1.0) {
          runner.state = 'running';
          runner.progress = runner.initialProgress;
          runner.squish = 0.8;
        }
        continue;
      }

      if (runner.state === 'clearing') {
        runner.clearingTimer += dt * 6.0;
        const scale = Math.max(0, 1.0 - runner.clearingTimer);
        runner.meshGroup.scale.set(scale, scale, scale);

        if (runner.clearingTimer >= 1.0) {
          this.runnersGroup.remove(runner.meshGroup);
          this.activeRunners.splice(i, 1);
          this.callbacks.onSlotCountChange?.(this.activeRunners.length);
          continue;
        }
        continue;
      }

      const inFlight = this.flyingTiles.filter((f) => f.targetRunnerId === runner.id).length;
      const matchingLeft = runner.isPrismatic
        ? this.gridManager.tiles.filter((t) => !t.collected).length
        : this.gridManager.getRemainingCount(runner.color);
      const isExposed = runner.isPrismatic
        ? this.gridManager.getExposedColors().length > 0
        : this.gridManager.getExposedColors().includes(runner.color);

      if (inFlight === 0) {
        runner.idleTimer = (runner.idleTimer || 0) + dt;
      } else {
        runner.idleTimer = 0;
      }

      // 🔄 LÓGICA DE LOOP CONTINUO:
      // El pez SOLO se elimina si agotó toda su capacidad reservada Y de tablero (remaining <= 0)
      const quotaReached = runner.remaining <= 0 && runner.allocatedRemaining <= 0 && inFlight === 0;
      const allMatchingCleared = matchingLeft === 0 && inFlight === 0 && runner.remaining <= 0;

      if (
        runner.state === 'running' &&
        (quotaReached || allMatchingCleared)
      ) {
        runner.state = 'clearing';
        soundManager.playCharacterCleared(this.isFishMode);
        this.spawnCelebrationBurst(runner.meshGroup.position, runner.color);
        this.callbacks.onRunnerCleared?.(runner.id, runner.color);
        this.callbacks.onSlotCountChange?.(Math.max(0, this.activeRunners.length - 1));
        continue;
      }

      const surgeMultiplier = this.conveyorSurgeTimer > 0 ? this.conveyorSurgeMultiplier : 1.0;
      // Loop infinito alrededor del riel mientras le quede capacidad por absorber (runner.remaining > 0)
      runner.progress = (runner.progress + dt * runner.speed * surgeMultiplier) % 1.0;
      const point = this.trackPath.getPointAt(runner.progress);

      runner.meshGroup.position.x = point.x;
      runner.meshGroup.position.z = point.z;
      runner.meshGroup.rotation.y = point.angle;

      if (runner.tailMesh) {
        runner.tailMesh.rotation.y = Math.sin(time * (this.isFishMode ? 16 : 9)) * (this.isFishMode ? 0.45 : 0.25);
        if (this.isFishMode) runner.meshGroup.rotation.z = Math.sin(time * 8) * 0.08;
      }

      if (runner.squish > 0) {
        runner.squish = Math.max(0, runner.squish - dt * 6);
        const squishFactor = Math.sin(runner.squish * Math.PI) * 0.35;
        runner.meshGroup.scale.set(1 + squishFactor, 1 - squishFactor, 1 + squishFactor);
      } else {
        runner.meshGroup.scale.set(1, 1, 1);
      }

      if (runner.state === 'running' && runner.allocatedRemaining > 0) {
        const distThreshold = Math.max(0.48, this.gridManager.tileSize * 1.15) * this.magnetMultiplier;
        const exposedTile = this.gridManager.findExposedTile(
          point.side,
          point.x,
          point.z,
          runner.color,
          distThreshold,
          runner.isPrismatic
        );

        if (exposedTile && !exposedTile.collected) {
          if (exposedTile.encapsulated) {
            this.popEncapsulation(exposedTile);
            runner.squish = 0.6;
          } else if (exposedTile.unlockAt !== undefined && time < exposedTile.unlockAt) {
          } else {
            exposedTile.unlockAt = undefined;
            runner.allocatedRemaining--;
            runner.absorbedCount = (runner.absorbedCount || 0) + 1;
            runner.idleTimer = 0;
            this.absorbTile(exposedTile, runner);
          }
        }
      }
    }

    for (let i = this.flyingTiles.length - 1; i >= 0; i--) {
      const flight = this.flyingTiles[i];
      const flightSpeed = (this.polish === 'v1' ? 4.0 : 6.0) * this.speedMultiplier;
      flight.progress += dt * flightSpeed;

      const targetRunner = this.activeRunners.find((r) => r.id === flight.targetRunnerId);
      const targetPos = targetRunner
        ? targetRunner.meshGroup.position
        : flight.startPos;

      const t = Math.min(1.0, flight.progress);
      _vecA.lerpVectors(flight.startPos, targetPos, t);
      const arc = Math.sin(t * Math.PI) * flight.arcHeight;
      flight.mesh.position.set(_vecA.x, _vecA.y + arc, _vecA.z);

      flight.mesh.rotation.x += flight.rotAxis.x * dt * 8;
      flight.mesh.rotation.y += flight.rotAxis.y * dt * 8;
      flight.mesh.rotation.z += flight.rotAxis.z * dt * 8;

      const s = Math.max(0.1, 1.0 - t * 0.8);
      flight.mesh.scale.set(s, s, s);

      if (t >= 1.0) {
        this.gridGroup.remove(flight.mesh);
        this.flyingTiles.splice(i, 1);

        if (targetRunner) {
          targetRunner.remaining = Math.max(0, targetRunner.remaining - 1);
          targetRunner.updateNumber(targetRunner.remaining);
          targetRunner.squish = 1.0;

          soundManager.playAbsorb(20 - targetRunner.remaining, this.isFishMode);

          if (this.polish === 'v3') {
            this.shakeIntensity = Math.min(0.25, this.shakeIntensity + 0.08);
          }

          this.spawnAbsorbParticles(targetRunner.meshGroup.position, flight.color);

          const remainingBoardCount = this.gridManager.tiles.filter((t) => !t.collected).length;
          this.callbacks.onTileAbsorbed?.(flight.startPos.x.toString(), flight.color, targetRunner.remaining);
          this.callbacks.onTileCollected?.(flight.startPos.x.toString(), flight.color, remainingBoardCount);

          const inFlightLeft = this.flyingTiles.filter((f) => f.targetRunnerId === targetRunner.id).length;
          if (targetRunner.remaining <= 0 && targetRunner.allocatedRemaining <= 0 && inFlightLeft === 0) {
            if (targetRunner.state === 'running') {
              targetRunner.state = 'clearing';
              soundManager.playCharacterCleared(this.isFishMode);
              this.spawnCelebrationBurst(targetRunner.meshGroup.position, targetRunner.color);
              this.callbacks.onRunnerCleared?.(targetRunner.id, targetRunner.color);
              this.callbacks.onSlotCountChange?.(Math.max(0, this.activeRunners.length - 1));
            }
          }

          if (this.gridManager.isCleared() && !this.hasTriggeredWin) {
            this.hasTriggeredWin = true;
            soundManager.playWin();
            this.triggerWinExplosion();
            this.callbacks.onWinState?.(this.currentLevel);
            this.callbacks.onLevelComplete?.();
          }
        }
      }
    }

    this.updateObstacleTimers(time);
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life += dt;
      p.mesh.position.addScaledVector(p.vel, dt);

      const grav = p.gravity !== undefined ? p.gravity : 3.5;
      const drag = p.drag !== undefined ? Math.pow(p.drag, dt * 60) : 1.0;
      p.vel.x *= drag;
      p.vel.z *= drag;
      p.vel.y -= dt * grav;

      if (p.flutter) {
        p.mesh.position.x += Math.sin(time * p.flutter.freq + p.flutter.offset) * p.flutter.amp * dt;
        p.mesh.position.z += Math.cos(time * p.flutter.freq + p.flutter.offset) * p.flutter.amp * dt;
      }

      p.mesh.rotation.x += p.rotSpeed.x * dt;
      p.mesh.rotation.y += p.rotSpeed.y * dt;
      p.mesh.rotation.z += (p.rotSpeed.z || 0) * dt;

      const normLife = Math.min(1.0, p.life / p.maxLife);
      const baseScale = p.initialScale ?? 1.0;
      let scale = baseScale;
      if (normLife < 0.15) {
        scale = baseScale * (normLife / 0.15);
      } else {
        const remain = (1.0 - normLife) / 0.85;
        scale = baseScale * remain;
      }
      p.mesh.scale.set(scale, scale, scale);

      if (p.mesh.material) {
        const mat = p.mesh.material as THREE.Material & { opacity?: number; transparent?: boolean };
        if (mat.transparent && mat.opacity !== undefined) {
          mat.opacity = Math.max(0, 1.0 - normLife);
        }
      }

      if (p.life >= p.maxLife) {
        this.vfxGroup.remove(p.mesh);
        p.mesh.geometry?.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach((m) => m.dispose());
        } else if (p.mesh.material) {
          p.mesh.material.dispose();
        }
        this.activeParticles.splice(i, 1);
      }
    }

    for (let i = this.activeShockwaves.length - 1; i >= 0; i--) {
      const sw = this.activeShockwaves[i];
      sw.life += dt;
      const progress = Math.min(1.0, sw.life / sw.maxLife);
      const ease = 1 - Math.pow(1 - progress, 3);
      const scale = 1 + ease * (sw.maxRadius - 1);
      sw.mesh.scale.set(scale, scale, 1);

      const mat = sw.mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, sw.initialOpacity * (1.0 - ease));
      }

      if (sw.life >= sw.maxLife) {
        this.vfxGroup.remove(sw.mesh);
        sw.mesh.geometry?.dispose();
        mat?.dispose();
        this.activeShockwaves.splice(i, 1);
      }
    }

    if (this.shakeIntensity > 0) {
      this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 3.0);
      const rx = (Math.random() - 0.5) * this.shakeIntensity * 0.15;
      const ry = (Math.random() - 0.5) * this.shakeIntensity * 0.15;
      const rz = (Math.random() - 0.5) * this.shakeIntensity * 0.15;
      this.camera.position.set(
        this.baseCameraPos.x + rx,
        this.baseCameraPos.y + ry,
        this.baseCameraPos.z + rz
      );
    } else {
      const zoomBlend = 1 - Math.exp(-dt * 3.5);
      this.camera.position.lerp(this.baseCameraPos, zoomBlend);
    }
    this.camera.lookAt(this.cameraTarget);
  }

  private popEncapsulation(tile: GridTile) {
    tile.encapsulated = false;
    tile.unlockAt = this.clock.getElapsedTime() + 3;
    soundManager.playBubblePop();
    const mesh = this.tileMeshMap.get(tile.id);
    if (mesh) {
      const bubble = mesh.getObjectByName('encapsulation');
      if (bubble) {
        mesh.remove(bubble);
        if (bubble instanceof THREE.Mesh) {
          bubble.geometry?.dispose();
        }
      }
    }
    if (tile.worldPos) {
      const position = new THREE.Vector3(tile.worldPos[0], tile.worldPos[1] + 0.15, tile.worldPos[2]);
      this.spawnBubbleBurstParticles(position, this.isFishMode);
      if (mesh) this.addObstacleTimer(tile, mesh, tile.unlockAt);
    }
    this.callbacks.onEncapsulationPopped?.(tile.id);
  }

  private addObstacleTimer(tile: GridTile, parent: THREE.Object3D, unlockAt: number) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 112;
    const context = canvas.getContext('2d');
    if (!context) return;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(0, this.isFishMode ? 1.08 : 0.86, 0);
    sprite.scale.set(0.78, 0.34, 1);
    parent.add(sprite);
    this.obstacleTimers.set(tile.id, { tile, sprite, texture, context, unlockAt, lastLabel: '' });
    this.drawObstacleTimer(this.obstacleTimers.get(tile.id)!, '3.0s');
  }

  private drawObstacleTimer(timer: { context: CanvasRenderingContext2D; texture: THREE.CanvasTexture; lastLabel: string }, label: string) {
    timer.lastLabel = label;
    const { context, texture } = timer;
    context.clearRect(0, 0, 256, 112);
    context.fillStyle = 'rgba(15, 23, 42, 0.94)';
    context.beginPath();
    context.roundRect(10, 8, 236, 96, 30);
    context.fill();
    context.strokeStyle = label === 'READY!' ? '#4ade80' : '#fbbf24';
    context.lineWidth = 6;
    context.stroke();
    context.fillStyle = '#f8fafc';
    context.font = '900 52px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, 128, 57);
    texture.needsUpdate = true;
  }

  private updateObstacleTimers(time: number) {
    for (const [id, timer] of this.obstacleTimers) {
      const secondsLeft = timer.unlockAt - time;
      if (secondsLeft <= 0) {
        timer.tile.unlockAt = undefined;
        if (timer.lastLabel !== 'READY!') this.drawObstacleTimer(timer, 'READY!');
        if (time >= timer.unlockAt + 0.45) this.removeObstacleTimer(id, timer);
        continue;
      }
      const label = `${secondsLeft.toFixed(1)}s`;
      if (label !== timer.lastLabel) this.drawObstacleTimer(timer, label);
    }
  }

  private removeObstacleTimer(id: string, timer: { sprite: THREE.Sprite; texture: THREE.CanvasTexture }) {
    timer.sprite.parent?.remove(timer.sprite);
    timer.sprite.material.dispose();
    timer.texture.dispose();
    this.obstacleTimers.delete(id);
  }

  private clearObstacleTimers() {
    for (const [id, timer] of this.obstacleTimers) this.removeObstacleTimer(id, timer);
  }

  private spawnBubbleBurstParticles(pos: THREE.Vector3, isFish: boolean) {
    const count = this.polish === 'v1' ? 4 : 10;
    for (let i = 0; i < count; i++) {
      const pGeo = new THREE.TetrahedronGeometry(isFish ? 0.075 : 0.09, 0);
      const pMat = new THREE.MeshBasicMaterial({
        color: isFish ? 0x7dd3fc : this.version === 'chess' ? 0xfde68a : 0x93c5fd,
        transparent: true,
        opacity: 0.92,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.24, (Math.random() - 0.5) * 0.16, (Math.random() - 0.5) * 0.24));
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.vfxGroup.add(pMesh);

      const angle = Math.random() * Math.PI * 2;
      const spd = 1.0 + Math.random() * 1.5;
      const vel = new THREE.Vector3(
        Math.cos(angle) * spd,
        1.0 + Math.random() * 1.2,
        Math.sin(angle) * spd
      );

      this.activeParticles.push({
        mesh: pMesh,
        vel,
        life: 0,
        maxLife: 0.55 + Math.random() * 0.25,
        rotSpeed: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      });
    }
  }

  private absorbTile(tile: { id: string; collected: boolean; color: TileColor; worldPos?: [number, number, number] }, runner: { id: string }) {
    tile.collected = true;
    const mesh = this.tileMeshMap.get(tile.id);
    if (!mesh || !tile.worldPos) return;

    this.flyingTiles.push({
      mesh,
      color: tile.color,
      startPos: new THREE.Vector3(tile.worldPos[0], tile.worldPos[1], tile.worldPos[2]),
      targetRunnerId: runner.id,
      progress: 0,
      arcHeight: 0.65,
      rotAxis: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize(),
    });
  }

  private spawnAbsorbParticles(pos: THREE.Vector3, color: TileColor) {
    if (this.polish === 'v1') return;

    const count = this.polish === 'v3' ? 8 : 4;
    const isFish = this.isFishMode;

    for (let i = 0; i < count; i++) {
      let pGeo: THREE.BufferGeometry;
      let pMat: THREE.Material;

      if (isFish) {
        pGeo = new THREE.SphereGeometry(0.045, 8, 8);
        pMat = new THREE.MeshBasicMaterial({
          color: color === 'white' ? 0x7dd3fc : color === 'black' ? 0x38bdf8 : 0x0284c7,
          transparent: true,
          opacity: 0.8,
        });
      } else {
        pGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
        pMat = new THREE.MeshBasicMaterial({
          color: color === 'white' ? 0xffffff : color === 'black' ? 0x0f172a : 0x1e293b,
        });
      }

      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(
        pos.x + (Math.random() - 0.5) * 0.2,
        pos.y + 0.3 + (Math.random() - 0.5) * 0.2,
        pos.z + (Math.random() - 0.5) * 0.2
      );
      this.vfxGroup.add(pMesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.5;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        1.2 + Math.random() * 1.8,
        Math.sin(angle) * speed
      );

      this.activeParticles.push({
        mesh: pMesh,
        vel,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.25,
        rotSpeed: new THREE.Vector3(Math.random() * 5, Math.random() * 5, Math.random() * 5),
      });
    }
  }

  private spawnCelebrationBurst(pos: THREE.Vector3, color: TileColor) {
    const count = this.polish === 'v3' ? 24 : 12;
    for (let i = 0; i < count; i++) {
      const pGeo = this.isFishMode
        ? new THREE.SphereGeometry(0.07, 10, 10)
        : new THREE.BoxGeometry(0.08, 0.08, 0.08);

      const colors = this.isFishMode
        ? [0xf59e0b, 0x38bdf8, 0xf43f5e, 0x10b981]
        : [0xffffff, 0x94a3b8, 0x38bdf8, 0xfacc15];

      const pMat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
      });

      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(pos);
      pMesh.position.y += 0.4;
      this.vfxGroup.add(pMesh);

      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const spd = 2.0 + Math.random() * 3.0;

      const vel = new THREE.Vector3(
        Math.cos(theta) * Math.cos(phi) * spd,
        Math.sin(phi) * spd + 2.5,
        Math.sin(theta) * Math.cos(phi) * spd
      );

      this.activeParticles.push({
        mesh: pMesh,
        vel,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        rotSpeed: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8),
      });
    }
  }

  private startLoop() {
    let afterDrawTimeout = 0;

    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          afterDrawTimeout = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          afterDrawTimeout = window.setTimeout(cb, 80);
        }
      };
      afterDrawTimeout = window.setTimeout(poll, 5);
    };

    const tick = () => {
      const delta = this.clock.getDelta();
      this.update(delta);
      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      afterDraw(tick);
    } else {
      this.frameId = requestAnimationFrame(tick);
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

  private clearWinExplosions() {
    this.winExplosionTimeouts.forEach((id) => window.clearTimeout(id));
    this.winExplosionTimeouts = [];
    for (const sw of this.activeShockwaves) {
      this.vfxGroup.remove(sw.mesh);
      sw.mesh.geometry?.dispose();
      if (Array.isArray(sw.mesh.material)) {
        sw.mesh.material.forEach((m) => m.dispose());
      } else if (sw.mesh.material) {
        sw.mesh.material.dispose();
      }
    }
    this.activeShockwaves = [];
  }

  private spawnGroundShockwave(
    position: THREE.Vector3,
    maxRadius: number,
    colorHex: number,
    duration: number = 0.9
  ) {
    const ringGeo = new THREE.RingGeometry(0.18, 0.55, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(ringGeo, ringMat);
    mesh.position.set(position.x, 0.05, position.z);
    mesh.rotation.x = -Math.PI / 2;
    this.vfxGroup.add(mesh);

    this.activeShockwaves.push({
      mesh,
      currentRadius: 0.55,
      maxRadius,
      life: 0,
      maxLife: duration,
      initialOpacity: 0.95,
    });
  }

  private spawnExplosionBurst(
    center: THREE.Vector3,
    count: number,
    spreadSpeed: number,
    upwardBias: number,
    options?: {
      palette?: number[];
      shape?: 'mix' | 'crystal' | 'confetti' | 'stars';
      maxLife?: number;
      gravity?: number;
      drag?: number;
    }
  ) {
    const palette = options?.palette || (this.isFishMode
      ? [0x06b6d4, 0xf43f5e, 0x10b981, 0xf59e0b, 0xffffff, 0x38bdf8]
      : [0xffd700, 0x8b5cf6, 0xf43f5e, 0x06b6d4, 0xf59e0b, 0xffffff, 0xfacc15]);

    const shape = options?.shape || 'mix';
    const baseLife = options?.maxLife || 1.8;
    const gravity = options?.gravity !== undefined ? options.gravity : 3.8;
    const drag = options?.drag !== undefined ? options.drag : 0.96;

    for (let i = 0; i < count; i++) {
      let pGeo: THREE.BufferGeometry;
      let pMat: THREE.Material;
      const col = palette[Math.floor(Math.random() * palette.length)];

      let particleType = shape;
      if (particleType === 'mix') {
        const r = Math.random();
        if (r < 0.35) particleType = 'crystal';
        else if (r < 0.70) particleType = 'confetti';
        else particleType = 'stars';
      }

      let isRibbon = false;
      const initialScale = 0.8 + Math.random() * 0.4;

      if (particleType === 'crystal') {
        const size = 0.09 + Math.random() * 0.07;
        pGeo = new THREE.OctahedronGeometry(size);
        pMat = new THREE.MeshStandardMaterial({
          color: col,
          roughness: 0.15,
          metalness: 0.85,
          emissive: col,
          emissiveIntensity: 0.4,
        });
      } else if (particleType === 'confetti') {
        isRibbon = true;
        const w = 0.14 + Math.random() * 0.08;
        const h = 0.07 + Math.random() * 0.04;
        pGeo = new THREE.PlaneGeometry(w, h);
        pMat = new THREE.MeshBasicMaterial({
          color: col,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
        });
      } else {
        const rad = 0.06 + Math.random() * 0.06;
        pGeo = new THREE.SphereGeometry(rad, 8, 8);
        pMat = new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 1.0,
        });
      }

      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(center);
      pMesh.position.x += (Math.random() - 0.5) * 0.4;
      pMesh.position.y += (Math.random() - 0.5) * 0.2;
      pMesh.position.z += (Math.random() - 0.5) * 0.4;
      pMesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      this.vfxGroup.add(pMesh);

      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const spd = spreadSpeed * (0.6 + Math.random() * 0.8);

      const vel = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * spd,
        Math.cos(phi) * spd + upwardBias * (0.8 + Math.random() * 0.5),
        Math.sin(theta) * Math.sin(phi) * spd
      );

      const pLife = baseLife * (0.7 + Math.random() * 0.6);
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

      this.activeParticles.push({
        mesh: pMesh,
        vel,
        life: 0,
        maxLife: pLife,
        rotSpeed,
        gravity: isRibbon ? 1.8 : gravity,
        drag: isRibbon ? 0.92 : drag,
        initialScale,
        flutter: isRibbon
          ? {
              freq: 8 + Math.random() * 6,
              amp: 0.4 + Math.random() * 0.4,
              offset: Math.random() * Math.PI * 2,
            }
          : undefined,
      });
    }
  }

  public triggerWinExplosion() {
    this.clearWinExplosions();

    const gold = 0xffd700;
    const royalPurple = 0x8b5cf6;
    const cyan = 0x06b6d4;
    const emerald = 0x10b981;
    const rose = 0xf43f5e;
    const amber = 0xf59e0b;
    const white = 0xffffff;
    const royalGold = 0xfacc15;
    const coral = 0xfb7185;

    const mainPalette = this.isFishMode
      ? [cyan, rose, emerald, amber, white, 0x38bdf8]
      : [gold, royalPurple, rose, cyan, royalGold, white, emerald];

    const centerPos = new THREE.Vector3(0, 0.4, 0);

    this.shakeIntensity = 0.55;
    this.spawnGroundShockwave(new THREE.Vector3(0, 0, 0), 12, gold, 1.4);
    this.spawnGroundShockwave(new THREE.Vector3(0, 0, 0), 7, white, 0.7);
    this.spawnExplosionBurst(centerPos, 120, 5.8, 4.5, {
      palette: mainPalette,
      shape: 'mix',
      maxLife: 2.2,
      gravity: 3.2,
      drag: 0.96,
    });

    const t1 = window.setTimeout(() => {
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.35);
      const leftPos = new THREE.Vector3(-2.8, 0.3, -1.8);
      const rightPos = new THREE.Vector3(2.8, 0.3, -1.8);

      this.spawnGroundShockwave(leftPos, 4.5, cyan, 0.85);
      this.spawnGroundShockwave(rightPos, 4.5, rose, 0.85);

      this.spawnExplosionBurst(leftPos, 50, 4.8, 5.5, {
        palette: [cyan, white, emerald, gold],
        shape: 'crystal',
        maxLife: 2.1,
        gravity: 3.4,
      });

      this.spawnExplosionBurst(rightPos, 50, 4.8, 5.5, {
        palette: [rose, royalPurple, white, gold],
        shape: 'crystal',
        maxLife: 2.1,
        gravity: 3.4,
      });
    }, 280);
    this.winExplosionTimeouts.push(t1);

    const t2 = window.setTimeout(() => {
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.28);
      const airPos1 = new THREE.Vector3(-1.4, 3.0, 0.4);
      const airPos2 = new THREE.Vector3(1.4, 3.4, -0.4);

      this.spawnExplosionBurst(airPos1, 55, 3.8, 2.2, {
        palette: [gold, royalGold, amber, white],
        shape: 'confetti',
        maxLife: 2.5,
        gravity: 1.6,
        drag: 0.93,
      });

      this.spawnExplosionBurst(airPos2, 55, 3.8, 2.2, {
        palette: [cyan, royalPurple, rose, white],
        shape: 'confetti',
        maxLife: 2.5,
        gravity: 1.6,
        drag: 0.93,
      });
    }, 600);
    this.winExplosionTimeouts.push(t2);

    const t3 = window.setTimeout(() => {
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.45);
      this.spawnGroundShockwave(new THREE.Vector3(0, 0, 0), 16, royalPurple, 1.6);
      this.spawnGroundShockwave(new THREE.Vector3(0, 0, 0), 10, gold, 1.1);

      this.spawnExplosionBurst(new THREE.Vector3(0, 0.3, 0), 140, 4.4, 7.8, {
        palette: [gold, royalGold, white, amber, cyan, coral],
        shape: 'mix',
        maxLife: 2.8,
        gravity: 3.0,
        drag: 0.96,
      });
    }, 950);
    this.winExplosionTimeouts.push(t3);
  }

  public dispose() {
    this.clearWinExplosions();
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}