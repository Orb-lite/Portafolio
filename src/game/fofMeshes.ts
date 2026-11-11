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
      return { body: 0x3b82f6, accent: 0x93c5fd, badgeBg: '#3b82f6', text: '#ffffff' };

    case 'cyan':
    case 'tang jr':
    case 'tang_jr':
      return { body: 0x06b6d4, accent: 0xa5f3fc, badgeBg: '#06b6d4', text: '#ffffff' };

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
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.4,
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
      roughness: 0.25,
      metalness: 0.1,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.2,
    });

    const samples = Math.max(140, Math.ceil(trackPath.totalLength * 4));
    const pathPoints = trackPath.generateTrackPolygonPoints(samples);
    const trackWidth = 0.78;
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

    const coralMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
      metalness: 0.2,
    });

    const curbHeight = 0.15;
    const curbThick = 0.08;

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

    this.addOceanDecorations(group, trackPath);

    return { group, beltMaterial };
  }

  private addOceanDecorations(parent: THREE.Group, trackPath: TrackPath) {
    const starGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.04, 5);
    const starMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });

    const star1 = new THREE.Mesh(starGeo, starMat);
    star1.position.set(trackPath.xMax + 0.6, 0.05, trackPath.zMin - 0.4);
    star1.rotation.y = 0.4;
    parent.add(star1);

    const star2 = new THREE.Mesh(starGeo, starMat);
    star2.position.set(trackPath.xMin - 0.5, 0.05, trackPath.zMin - 0.5);
    star2.rotation.y = 1.2;
    parent.add(star2);

    const rockGeo = new THREE.DodecahedronGeometry(0.25);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.7 });

    const rock1 = new THREE.Mesh(rockGeo, rockMat);
    rock1.position.set(trackPath.xMax + 0.7, 0.15, trackPath.zMax + 0.3);
    parent.add(rock1);

    const rock2 = new THREE.Mesh(rockGeo, rockMat);
    rock2.position.set(trackPath.xMin - 0.7, 0.18, trackPath.zMin + 0.8);
    parent.add(rock2);
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

    const badgeGeo = new THREE.PlaneGeometry(0.38, 0.38);
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.58, 0);
    badgeMesh.rotation.x = -Math.PI / 2;
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