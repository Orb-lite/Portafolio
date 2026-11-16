import * as THREE from 'three';
import { TileColor, SpecialTileType } from './types';
import { TrackPath } from './trackPath';
import { getNumberTexture, createConveyorTexture } from './proceduralTextures';

export function getFofPearlMaterial(color: TileColor): THREE.MeshPhysicalMaterial {
  const fishColors = getFofFishColors(color);

  return new THREE.MeshPhysicalMaterial({
    color: fishColors.body,
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    sheen: 0.8,
    sheenColor: new THREE.Color(fishColors.accent),
  });
}

export function getFofFishColors(color: TileColor | string): { body: number; accent: number; badgeBg: string; text: string } {
  const normalized = (color || 'blue').toLowerCase().trim();

  switch (normalized) {
    case 'rainbow':
    case 'multicolor':
    case 'prismatic':
      return { body: 0xff007f, accent: 0x00ffff, badgeBg: '#d946ef', text: '#ffffff' };

    case 'bomb':
    case 'explosive':
      return { body: 0xff4500, accent: 0xffd700, badgeBg: '#ef4444', text: '#ffffff' };

    case 'pink':
    case 'magenta':
    case 'axolotl':
      return { body: 0xec4899, accent: 0xfbcfe8, badgeBg: '#ec4899', text: '#ffffff' };

    case 'yellow':
    case 'clown':
      return { body: 0xeab308, accent: 0xfef08a, badgeBg: '#eab308', text: '#0f172a' };

    case 'blue':
    case 'tang':
      return { body: 0x2563eb, accent: 0x93c5fd, badgeBg: '#1d4ed8', text: '#ffffff' };

    case 'cyan':
    case 'tang jr':
    case 'tang_jr':
      return { body: 0x0891b2, accent: 0xa5f3fc, badgeBg: '#0891b2', text: '#ffffff' };

    case 'purple':
    case 'angler':
      return { body: 0x8b5cf6, accent: 0xddd6fe, badgeBg: '#8b5cf6', text: '#ffffff' };

    case 'black':
    case 'obsidian':
    case 'dark':
      return { body: 0x1e293b, accent: 0x38bdf8, badgeBg: '#0f172a', text: '#38bdf8' };

    case 'green':
    case 'turtle':
      return { body: 0x22c55e, accent: 0xbbf7d0, badgeBg: '#22c55e', text: '#ffffff' };

    case 'red':
      return { body: 0xef4444, accent: 0xfca5a5, badgeBg: '#ef4444', text: '#ffffff' };

    case 'orange':
      return { body: 0xf97316, accent: 0xffedd5, badgeBg: '#f97316', text: '#ffffff' };

    case 'white':
      return { body: 0xf8fafc, accent: 0xf97316, badgeBg: '#f97316', text: '#ffffff' };

    default: {
      const threeColor = new THREE.Color();
      try {
        threeColor.set(normalized);
      } catch {
        threeColor.setHex(0x3b82f6);
      }

      const bodyHex = threeColor.getHex();
      const accentColor = threeColor.clone().offsetHSL(0, -0.2, 0.25);
      const hexStr = `#${threeColor.getHexString()}`;
      const luminance = 0.2126 * threeColor.r + 0.7152 * threeColor.g + 0.0722 * threeColor.b;
      const textColor = luminance > 0.5 ? '#0f172a' : '#ffffff';

      return {
        body: bodyHex,
        accent: accentColor.getHex(),
        badgeBg: hexStr,
        text: textColor,
      };
    }
  }
}

export class FofMeshFactory {
  private pearlGeo: THREE.SphereGeometry;
  private trayGeo: THREE.CylinderGeometry;
  private trayMat: THREE.MeshStandardMaterial;
  private bubbleGeo: THREE.SphereGeometry;
  private bubbleMat: THREE.MeshPhysicalMaterial;

  constructor() {
    this.pearlGeo = new THREE.SphereGeometry(0.18, 20, 20);
    this.bubbleGeo = new THREE.SphereGeometry(0.24, 18, 18);
    this.bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      transmission: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    this.trayGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.06, 16);
    this.trayMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.25,
      metalness: 0.25,
    });
  }

  public createPearlTile(
    color: TileColor,
    encapsulated = false,
    size = 0.44,
    shieldLayers = 0,
    specialType?: SpecialTileType
  ): THREE.Group {
    const group = new THREE.Group();
    const s = size / 0.44;

    const tray = new THREE.Mesh(this.trayGeo, this.trayMat);
    tray.position.y = 0.03 * s;
    tray.scale.set(s, s, s);
    tray.receiveShadow = true;
    group.add(tray);

    // 1. Modelado según Mecánica Especial
    if (specialType === 'coral_bomb' || specialType === 'bomb') {
      const bombGroup = new THREE.Group();
      bombGroup.name = 'bomb_unit';

      const coralGeo = new THREE.DodecahedronGeometry(0.19 * s);
      const coralMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.25,
        metalness: 0.2,
        emissive: 0xdc2626,
        emissiveIntensity: 0.85,
      });
      const coralMesh = new THREE.Mesh(coralGeo, coralMat);
      coralMesh.position.y = 0.2 * s;
      coralMesh.castShadow = true;
      bombGroup.add(coralMesh);

      // Spikes / fuse on bomb pearl
      for (let sp = 0; sp < 4; sp++) {
        const ang = (sp * Math.PI) / 2;
        const spikeGeo = new THREE.ConeGeometry(0.045 * s, 0.12 * s, 5);
        const spikeMat = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.7,
        });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(Math.cos(ang) * 0.17 * s, 0.2 * s, Math.sin(ang) * 0.17 * s);
        spike.rotation.z = -Math.cos(ang) * 0.7;
        spike.rotation.x = Math.sin(ang) * 0.7;
        bombGroup.add(spike);
      }

      // Spark on top
      const sparkGeo = new THREE.OctahedronGeometry(0.05 * s);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      spark.position.set(0, 0.36 * s, 0);
      spark.name = 'spark';
      bombGroup.add(spark);

      group.add(bombGroup);
    } else if (specialType === 'rainbow') {
      const rainbowGroup = new THREE.Group();
      rainbowGroup.name = 'rainbow_unit';

      const rainbowMat = new THREE.MeshPhysicalMaterial({
        color: 0xff00aa,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0xaa00ff,
        emissiveIntensity: 0.5,
        clearcoat: 1.0,
      });
      const pearl = new THREE.Mesh(this.pearlGeo, rainbowMat);
      pearl.position.y = 0.2 * s;
      pearl.scale.set(s * 1.08, s * 1.08, s * 1.08);
      pearl.castShadow = true;
      rainbowGroup.add(pearl);

      // Orbiting rainbow halo ring
      const ringGeo = new THREE.TorusGeometry(0.24 * s, 0.02 * s, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.22 * s;
      ring.rotation.x = Math.PI / 3;
      rainbowGroup.add(ring);

      group.add(rainbowGroup);
    } else if (specialType === 'clam_trap') {
      const clamGeo = new THREE.ConeGeometry(0.22 * s, 0.22 * s, 5);
      const clamMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
      const clamMesh = new THREE.Mesh(clamGeo, clamMat);
      clamMesh.position.y = 0.2 * s;
      group.add(clamMesh);
    } else {
      const mat = getFofPearlMaterial(color);
      const pearl = new THREE.Mesh(this.pearlGeo, mat);
      pearl.position.y = 0.2 * s;
      pearl.scale.set(s, s, s);
      pearl.castShadow = true;
      group.add(pearl);
    }

    // 2. Perla Congelada (Capa Externa de Hielo)
    if (specialType === 'frozen_pearl') {
      const iceGeo = new THREE.BoxGeometry(0.38 * s, 0.38 * s, 0.38 * s);
      const iceMat = new THREE.MeshPhysicalMaterial({
        color: 0xa5f3fc,
        transmission: 0.85,
        roughness: 0.1,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });
      const iceMesh = new THREE.Mesh(iceGeo, iceMat);
      iceMesh.position.y = 0.2 * s;
      iceMesh.name = 'ice_block';
      group.add(iceMesh);
    }

    // 🛡️ 3. SISTEMA DE 3 CAPAS DE ESCUDO
    if (shieldLayers > 0) {
      const shieldColors = [0x38bdf8, 0x8b5cf6, 0xef4444]; // Capa 1: Azul, Capa 2: Púrpura, Capa 3: Rojo Neón
      for (let layer = 0; layer < shieldLayers; layer++) {
        const shieldRadius = (0.22 + layer * 0.04) * s;
        const shieldGeo = new THREE.SphereGeometry(shieldRadius, 14, 14);
        const shieldMat = new THREE.MeshPhysicalMaterial({
          color: shieldColors[layer % shieldColors.length],
          transparent: true,
          opacity: 0.45,
          roughness: 0.1,
          transmission: 0.6,
          depthWrite: false,
        });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        shieldMesh.position.y = 0.2 * s;
        shieldMesh.name = `shield_layer_${layer + 1}`;
        group.add(shieldMesh);
      }
    }

    if (encapsulated) {
      const bubble = new THREE.Mesh(this.bubbleGeo, this.bubbleMat);
      bubble.position.y = 0.2 * s;
      bubble.scale.set(s, s, s);
      bubble.name = 'encapsulation';
      group.add(bubble);
    }

    return group;
  }

  public createCoralTrack(trackPath: TrackPath): {
    group: THREE.Group;
    beltMaterial: THREE.MeshStandardMaterial;
  } {
    const group = new THREE.Group();

    const beltTex = createConveyorTexture(true);
    const beltMaterial = new THREE.MeshStandardMaterial({
      map: beltTex,
      roughness: 0.28,
      metalness: 0.06,
      emissive: new THREE.Color(0xe0f2fe),
      emissiveIntensity: 0.08,
    });

    const samples = Math.max(140, Math.ceil(trackPath.totalLength * 4));
    const pathPoints = trackPath.generateTrackPolygonPoints(samples);
    const trackWidth = 0.82;
    const halfW = trackWidth / 2;

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= samples; i++) {
      const p = pathPoints[i % samples];
      const nx = -p.tangentZ;
      const nz = p.tangentX;

      const xInner = p.x - nx * halfW;
      const zInner = p.z - nz * halfW;
      const xOuter = p.x + nx * halfW;
      const zOuter = p.z + nz * halfW;

      const y = 0.08;

      vertices.push(xInner, y, zInner);
      vertices.push(xOuter, y, zOuter);

      const u = (i / samples) * 14;
      uvs.push(u, 0);
      uvs.push(u, 1);

      if (i < samples) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const beltGeo = new THREE.BufferGeometry();
    beltGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    beltGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    beltGeo.setIndex(indices);
    beltGeo.computeVertexNormals();

    const beltMesh = new THREE.Mesh(beltGeo, beltMaterial);
    beltMesh.receiveShadow = true;
    group.add(beltMesh);

    // Glossy coral-red border curbs matching Fish of Fortune reference video
    const coralMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.28,
      metalness: 0.12,
      emissive: 0x9f1239,
      emissiveIntensity: 0.12,
    });

    const curbHeight = 0.16;
    const curbThick = 0.09;

    const buildCoralCurb = (offset: number) => {
      const curbVerts: number[] = [];
      const curbIndices: number[] = [];

      for (let i = 0; i <= samples; i++) {
        const p = pathPoints[i % samples];
        const nx = -p.tangentZ;
        const nz = p.tangentX;

        const cx = p.x + nx * offset;
        const cz = p.z + nz * offset;

        curbVerts.push(cx - nx * curbThick, 0.08, cz - nz * curbThick);
        curbVerts.push(cx + nx * curbThick, 0.08 + curbHeight, cz + nz * curbThick);

        if (i < samples) {
          const base = i * 2;
          curbIndices.push(base, base + 1, base + 2);
          curbIndices.push(base + 1, base + 3, base + 2);
        }
      }

      const curbGeo = new THREE.BufferGeometry();
      curbGeo.setAttribute('position', new THREE.Float32BufferAttribute(curbVerts, 3));
      curbGeo.setIndex(curbIndices);
      curbGeo.computeVertexNormals();
      return new THREE.Mesh(curbGeo, coralMat);
    };

    group.add(buildCoralCurb(-halfW));
    group.add(buildCoralCurb(halfW));

    const dispenser = this.createDispenser();
    dispenser.position.set(trackPath.xMin + 0.1, 0.08, trackPath.zMax);
    group.add(dispenser);

    this.addOceanDecorations(group, trackPath);

    return { group, beltMaterial };
  }

  /**
   * Pink/coral-striped feeder hopper at the bottom-left conveyor entry matching the reference video.
   */
  public createDispenser(): THREE.Group {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.25,
      metalness: 0.15,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.22,
      metalness: 0.55,
    });
    const darkHoleMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });

    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.95, 24), bodyMat);
    tube.rotation.z = Math.PI / 2;
    tube.position.set(-0.35, 0.22, 0);
    tube.castShadow = true;
    group.add(tube);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.065, 12, 24), trimMat);
    rim.rotation.y = Math.PI / 2;
    rim.position.set(0.12, 0.22, 0);
    group.add(rim);

    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.04, 10, 24), trimMat);
    stripe.rotation.y = Math.PI / 2;
    stripe.position.set(-0.35, 0.22, 0);
    group.add(stripe);

    const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.36, 20), darkHoleMat);
    mouth.rotation.y = Math.PI / 2;
    mouth.position.set(0.14, 0.22, 0);
    group.add(mouth);

    return group;
  }

  /**
   * Multi-part procedural reef creature (dolphin/shark or sea turtle) swimming beneath the board.
   */
  public createUnderwaterCreature(kind: 'dolphin' | 'turtle' | 'reefFish', tintHex: number): {
    group: THREE.Group;
    tail: THREE.Object3D;
  } {
    const group = new THREE.Group();
    const mainMat = new THREE.MeshStandardMaterial({
      color: tintHex,
      roughness: 0.35,
      metalness: 0.05,
    });
    const bellyMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.45,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: kind === 'turtle' ? 0x15803d : 0x0284c7,
      roughness: 0.3,
    });

    const tailPivot = new THREE.Group();

    if (kind === 'turtle') {
      const shell = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), mainMat);
      shell.scale.set(1.25, 0.48, 1.0);
      group.add(shell);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), accentMat);
      head.position.set(0.54, 0.04, 0);
      group.add(head);

      const flipperGeo = new THREE.SphereGeometry(0.18, 10, 8);
      flipperGeo.scale(1.6, 0.22, 0.65);
      const fl1 = new THREE.Mesh(flipperGeo, accentMat);
      fl1.position.set(0.22, -0.04, 0.44);
      fl1.rotation.y = 0.55;
      group.add(fl1);

      const fl2 = new THREE.Mesh(flipperGeo, accentMat);
      fl2.position.set(0.22, -0.04, -0.44);
      fl2.rotation.y = -0.55;
      group.add(fl2);

      const backFl = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.24, 6), accentMat);
      backFl.rotation.z = Math.PI / 2;
      backFl.position.set(-0.14, 0, 0);
      tailPivot.position.set(-0.46, 0, 0);
      tailPivot.add(backFl);
      group.add(tailPivot);
    } else if (kind === 'dolphin') {
      const torso = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 14), mainMat);
      torso.scale.set(2.3, 0.78, 0.72);
      group.add(torso);

      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), bellyMat);
      belly.scale.set(1.9, 0.42, 0.55);
      belly.position.set(0.05, -0.1, 0);
      group.add(belly);

      const snout = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.36, 12), mainMat);
      snout.rotation.z = -Math.PI / 2;
      snout.position.set(0.76, -0.03, 0);
      group.add(snout);

      const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.34, 8), mainMat);
      dorsal.position.set(-0.04, 0.28, 0);
      dorsal.rotation.z = 0.38;
      group.add(dorsal);

      const fluke = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.36, 4), accentMat);
      fluke.scale.set(0.35, 1.0, 1.35);
      fluke.rotation.z = Math.PI / 2;
      fluke.position.set(-0.16, 0, 0);
      tailPivot.position.set(-0.68, 0, 0);
      tailPivot.add(fluke);
      group.add(tailPivot);
    } else {
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), mainMat);
      body.scale.set(1.45, 0.85, 0.62);
      group.add(body);

      const fin = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 4), accentMat);
      fin.scale.set(0.35, 1, 0.9);
      fin.rotation.z = Math.PI / 2;
      fin.position.set(-0.1, 0, 0);
      tailPivot.position.set(-0.2, 0, 0);
      tailPivot.add(fin);
      group.add(tailPivot);
    }

    return { group, tail: tailPivot };
  }

  private addOceanDecorations(parent: THREE.Group, trackPath: TrackPath) {
    // Rich multi-part tropical coral clusters & starfish surrounding the lagoon
    const coralPalette = [0xf43f5e, 0xfb923c, 0xa855f7, 0x2dd4bf, 0xfacc15];
    const placements = [
      { x: trackPath.xMax + 1.35, z: trackPath.zMin - 0.8 },
      { x: trackPath.xMin - 1.45, z: trackPath.zMin - 0.7 },
      { x: trackPath.xMax + 1.45, z: trackPath.zMax + 0.55 },
      { x: trackPath.xMin - 1.55, z: trackPath.zMax + 0.95 },
      { x: trackPath.xMax + 1.8, z: 0.2 },
      { x: trackPath.xMin - 1.8, z: -0.4 },
    ];

    placements.forEach((p, idx) => {
      const cluster = new THREE.Group();
      const baseColor = coralPalette[idx % coralPalette.length];
      const coralMat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.45 });
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.75 });

      const baseRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32), rockMat);
      baseRock.scale.set(1.2, 0.55, 1.1);
      baseRock.position.y = -0.25;
      cluster.add(baseRock);

      for (let b = -1; b <= 1; b++) {
        const branch = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.085, 0.34 + (b === 0 ? 0.16 : 0), 6, 10),
          coralMat
        );
        branch.position.set(b * 0.18, 0.02, (b % 2) * 0.12);
        branch.rotation.z = b * -0.28;
        cluster.add(branch);
      }

      const star = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.19, 0.05, 5),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 })
      );
      star.position.set(0.38, -0.35, 0.3);
      star.rotation.y = idx * 0.7;
      cluster.add(star);

      cluster.position.set(p.x, -0.22, p.z);
      parent.add(cluster);
    });
  }

  public createFishRunner(
    color: TileColor,
    initialCount: number
  ): {
    group: THREE.Group;
    tailMesh: THREE.Mesh;
    badgeMesh: THREE.Mesh;
    badgeMat: THREE.MeshStandardMaterial;
    updateNumber: (num: number) => void;
  } {
    const group = new THREE.Group();
    const isWhite = String(color).toLowerCase() === 'white';
    const isBlack = String(color).toLowerCase() === 'black';
    const fishTheme = getFofFishColors(color);

    const fishMat = new THREE.MeshStandardMaterial({
      color: fishTheme.body,
      roughness: 0.25,
      metalness: 0.1,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: fishTheme.accent,
      roughness: 0.28,
      metalness: 0.08,
    });

    const bodyGeo = new THREE.SphereGeometry(0.26, 18, 18);
    bodyGeo.scale(1.25, 0.95, 0.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, fishMat);
    bodyMesh.position.y = 0.32;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const mouthGeo = new THREE.TorusGeometry(0.065, 0.025, 8, 16);
    const mouthMat = new THREE.MeshStandardMaterial({
      color: fishTheme.accent,
      roughness: 0.35,
    });
    const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.rotation.y = Math.PI / 2;
    mouthMesh.position.set(0.32, 0.30, 0);
    group.add(mouthMesh);

    if (isWhite) {
      const stripeGeo = new THREE.TorusGeometry(0.24, 0.035, 8, 20);
      const stripe = new THREE.Mesh(stripeGeo, accentMat);
      stripe.rotation.y = Math.PI / 2;
      stripe.position.set(0.02, 0.32, 0);
      group.add(stripe);
    } else if (isBlack) {
      const stalkGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
      const stalk = new THREE.Mesh(stalkGeo, accentMat);
      stalk.position.set(0.18, 0.54, 0);
      stalk.rotation.z = -0.4;
      group.add(stalk);

      const lureGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const lureMat = new THREE.MeshStandardMaterial({ 
        color: 0x38bdf8, 
        emissive: 0x38bdf8, 
        emissiveIntensity: 0.9 
      });
      const lure = new THREE.Mesh(lureGeo, lureMat);
      lure.position.set(0.26, 0.65, 0);
      group.add(lure);
    } else {
      const stalkGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
      const stalk = new THREE.Mesh(stalkGeo, accentMat);
      stalk.position.set(0.18, 0.54, 0);
      stalk.rotation.z = -0.4;
      group.add(stalk);

      const lureGeo = new THREE.SphereGeometry(0.05, 12, 12);
      const lureMat = new THREE.MeshBasicMaterial({ color: fishTheme.accent });
      const lure = new THREE.Mesh(lureGeo, lureMat);
      lure.position.set(0.26, 0.65, 0);
      group.add(lure);
    }

    const eyeWhiteGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyePupilGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.2, 0.36, 0.16);
    const rWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    const rPupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    rPupil.position.set(0.03, 0, 0.02);
    rightEyeGroup.add(rWhite, rPupil);
    group.add(rightEyeGroup);

    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(0.2, 0.36, -0.16);
    const lWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    const lPupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    lPupil.position.set(0.03, 0, -0.02);
    leftEyeGroup.add(lWhite, lPupil);
    group.add(leftEyeGroup);

    const tailPivot = new THREE.Group();
    tailPivot.position.set(-0.3, 0.32, 0);

    const tailGeo = new THREE.ConeGeometry(0.18, 0.32, 4);
    tailGeo.scale(0.3, 1.2, 1.0);
    const tailMesh = new THREE.Mesh(tailGeo, accentMat);
    tailMesh.position.set(-0.14, 0, 0);
    tailMesh.rotation.z = Math.PI / 2;
    tailPivot.add(tailMesh);
    group.add(tailPivot);

    const finGeo = new THREE.SphereGeometry(0.1, 8, 8);
    finGeo.scale(1.2, 0.2, 0.6);
    const finR = new THREE.Mesh(finGeo, accentMat);
    finR.position.set(0.05, 0.25, 0.22);
    finR.rotation.y = 0.3;
    group.add(finR);

    const finL = new THREE.Mesh(finGeo, accentMat);
    finL.position.set(0.05, 0.25, -0.22);
    finL.rotation.y = -0.3;
    group.add(finL);

    const badgeTexture = getNumberTexture(
      initialCount,
      fishTheme.badgeBg,
      fishTheme.text,
      true
    );

    const badgeMat = new THREE.MeshStandardMaterial({
      map: badgeTexture,
      transparent: true,
      roughness: 0.2,
      metalness: 0.6,
    });

    const badgeGeo = new THREE.PlaneGeometry(0.42, 0.42);
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.6, 0);
    badgeMesh.rotation.x = -Math.PI / 2.5;
    group.add(badgeMesh);

    const updateNumber = (num: number) => {
      const newTex = getNumberTexture(
        num,
        fishTheme.badgeBg,
        fishTheme.text,
        true
      );
      badgeMat.map = newTex;
      badgeMat.needsUpdate = true;
    };

    return { group, tailMesh: tailPivot as unknown as THREE.Mesh, badgeMesh, badgeMat, updateNumber };
  }
}