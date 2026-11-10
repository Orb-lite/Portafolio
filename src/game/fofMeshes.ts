import * as THREE from 'three';
import { TileColor } from './types';
import { TrackPath } from './trackPath';
import { getNumberTexture, createConveyorTexture } from './proceduralTextures';

export function getFofPearlMaterial(color: TileColor): THREE.MeshPhysicalMaterial {
  const fishColors = getFofFishColors(color);
  return new THREE.MeshPhysicalMaterial({
    color: fishColors.body,
    roughness: 0.28,
    metalness: color === 'black' ? 0.16 : 0.08,
    clearcoat: 0.48,
    sheen: 0.28,
    sheenColor: new THREE.Color(fishColors.accent),
    emissive: fishColors.body,
    emissiveIntensity: color === 'white' ? 0.035 : 0.28,
  });
}

export function getFofFishColors(color: TileColor): { body: number; accent: number; badgeBg: string; text: string } {
  switch (color) {
    case 'white': return { body: 0xfff7ed, accent: 0xf97316, badgeBg: '#f97316', text: '#ffffff' };
    case 'black': return { body: 0x0f172a, accent: 0x38bdf8, badgeBg: '#1e293b', text: '#38bdf8' };
    case 'blue': return { body: 0x0284c7, accent: 0x7dd3fc, badgeBg: '#0284c7', text: '#ffffff' };
    case 'yellow': return { body: 0xeab308, accent: 0xfef08a, badgeBg: '#eab308', text: '#0f172a' };
    case 'pink': return { body: 0xf43f5e, accent: 0xfda4af, badgeBg: '#f43f5e', text: '#ffffff' };
    case 'green': return { body: 0x059669, accent: 0x6ee7b7, badgeBg: '#059669', text: '#ffffff' };
    case 'purple': return { body: 0x7c3aed, accent: 0xc4b5fd, badgeBg: '#6d28d9', text: '#ffffff' };
    case 'red': return { body: 0xdc2626, accent: 0xfca5a5, badgeBg: '#b91c1c', text: '#ffffff' };
    case 'cyan': return { body: 0x0891b2, accent: 0xa5f3fc, badgeBg: '#0e7490', text: '#ffffff' };
    case 'orange': return { body: 0xea580c, accent: 0xfdba74, badgeBg: '#c2410c', text: '#ffffff' };
    case 'magenta': return { body: 0xc026d3, accent: 0xf0abfc, badgeBg: '#a21caf', text: '#ffffff' };
    case 'lime': return { body: 0x65a30d, accent: 0xd9f99d, badgeBg: '#4d7c0f', text: '#ffffff' };
    default: return { body: 0xfff7ed, accent: 0xf97316, badgeBg: '#f97316', text: '#ffffff' };
  }
}

export class FofMeshFactory {
  private pearlGeo: THREE.SphereGeometry;
  private trayGeo: THREE.CylinderGeometry;
  private trayMaterials = new Map<TileColor, THREE.MeshStandardMaterial>();
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

    // Tiny shell pedestal underneath pearl
    this.trayGeo = new THREE.CylinderGeometry(0.225, 0.245, 0.06, 16);
  }

  public createPearlTile(color: TileColor, encapsulated = false, size = 0.44, encapsulationLayers = encapsulated ? 1 : 0): THREE.Group {
    const group = new THREE.Group();
    const s = size / 0.44;

    let trayMat = this.trayMaterials.get(color);
    if (!trayMat) {
      const accent = getFofFishColors(color).accent;
      trayMat = new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.45,
        roughness: 0.28,
        metalness: 0.08,
      });
      this.trayMaterials.set(color, trayMat);
    }
    const tray = new THREE.Mesh(this.trayGeo, trayMat);
    tray.position.y = 0.03 * s;
    tray.scale.set(s, s, s);
    tray.receiveShadow = true;
    group.add(tray);

    const mat = getFofPearlMaterial(color);
    const pearl = new THREE.Mesh(this.pearlGeo, mat);
    pearl.position.y = 0.2 * s;
    pearl.scale.set(s, s, s);
    pearl.castShadow = true;
    group.add(pearl);

    if (encapsulated) {
      // Concentric sea-glass shells make late-game capsules visibly layered.
      for (let layer = 1; layer <= Math.max(1, encapsulationLayers); layer++) {
        const bubbleMaterial = this.bubbleMat.clone();
        bubbleMaterial.color.setHex(layer === 1 ? 0x7dd3fc : layer === 2 ? 0xc4b5fd : 0xfcd34d);
        bubbleMaterial.opacity = Math.max(0.34, 0.72 - (layer - 1) * 0.12);
        const bubble = new THREE.Mesh(this.bubbleGeo, bubbleMaterial);
        bubble.position.y = 0.2 * s;
        const shellScale = s * (1 + (layer - 1) * 0.1);
        bubble.scale.set(shellScale, shellScale, shellScale);
        bubble.name = `encapsulation-layer-${layer}`;
        group.add(bubble);
      }
    }

    return group;
  }

  /**
   * Creates the glowing ocean current track with coral reef borders and sunken treasure chest.
   */
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

    // Coral Reef Border Curbs (Pearlescent seafoam turquoise & coral pink)
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

    // Decorative underwater starfish & coral sponges around outer perimeter
    this.addOceanDecorations(group, trackPath);

    return { group, beltMaterial };
  }

  private createTreasureDispenser(): THREE.Group {
    const group = new THREE.Group();

    // Golden Clam / Treasure Chest
    const chestBaseGeo = new THREE.BoxGeometry(0.65, 0.35, 0.55);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Rich Gold
      metalness: 0.8,
      roughness: 0.25,
    });
    const chest = new THREE.Mesh(chestBaseGeo, goldMat);
    chest.position.set(-0.2, 0.18, 0);
    chest.castShadow = true;
    group.add(chest);

    // Glowing pearl inside dispenser
    const pearlGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pearlMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
    });
    const pearl = new THREE.Mesh(pearlGeo, pearlMat);
    pearl.position.set(0.1, 0.22, 0);
    group.add(pearl);

    return group;
  }

  private addOceanDecorations(parent: THREE.Group, trackPath: TrackPath) {
    // Starfish
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

    // Coral Sponges / Rock Clusters
    const rockGeo = new THREE.DodecahedronGeometry(0.25);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.7 });

    const rock1 = new THREE.Mesh(rockGeo, rockMat);
    rock1.position.set(trackPath.xMax + 0.7, 0.15, trackPath.zMax + 0.3);
    parent.add(rock1);

    const rock2 = new THREE.Mesh(rockGeo, rockMat);
    rock2.position.set(trackPath.xMin - 0.7, 0.18, trackPath.zMin + 0.8);
    parent.add(rock2);
  }

  /**
   * Creates a stylized Fish runner with wagging tail, fins, expressive eyes and golden coin badge.
   */
  public createFishRunner(
    color: TileColor,
    initialCount: number,
    level: number = 1
  ): {
    group: THREE.Group;
    tailMesh: THREE.Mesh;
    badgeMesh: THREE.Mesh;
    badgeMat: THREE.MeshStandardMaterial;
    updateNumber: (num: number) => void;
  } {
    const group = new THREE.Group();
    const isWhite = color === 'white';
    const fishTheme = getFofFishColors(color);
    // Each ten-level world introduces a new fish silhouette; later worlds cycle
    // through the set while keeping the runner's selected color intact.
    const species = Math.floor(Math.max(1, level) / 10) % 5;

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

    // Main fish body: streamlined ellipsoid / stretched sphere
    const bodyGeo = new THREE.SphereGeometry(0.26, 18, 18);
    const bodyShapes = [
      [1.25, 0.95, 0.8], // round reef fish
      [1.55, 0.76, 0.7], // longnose fish
      [1.05, 1.18, 0.98], // puffer fish
      [1.3, 0.86, 0.8], // lionfish
      [1.22, 0.72, 1.12], // wide tropical fish
    ];
    const bodyShape = bodyShapes[species];
    bodyGeo.scale(bodyShape[0], bodyShape[1], bodyShape[2]);
    const bodyMesh = new THREE.Mesh(bodyGeo, fishMat);
    bodyMesh.position.y = 0.32;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    if (species === 1) {
      const snout = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 10), accentMat);
      snout.rotation.z = -Math.PI / 2;
      snout.position.set(0.43, 0.31, 0);
      group.add(snout);
    } else if (species === 2) {
      // Short, rounded spikes make the level 21+ puffer silhouette unmistakable.
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.13, 6), accentMat);
        spike.position.set(Math.cos(angle) * 0.24, 0.32 + Math.sin(angle) * 0.2, 0);
        spike.rotation.z = -angle;
        group.add(spike);
      }
    } else if (species === 3) {
      const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 5), accentMat);
      dorsal.position.set(-0.02, 0.59, 0);
      dorsal.rotation.z = Math.PI;
      group.add(dorsal);
      for (const side of [-1, 1]) {
        const ray = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.32, 5), accentMat);
        ray.position.set(-0.18, 0.31, side * 0.25);
        ray.rotation.z = -0.5;
        group.add(ray);
      }
    } else if (species === 4) {
      const dorsal = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), accentMat);
      dorsal.scale.set(0.8, 0.18, 1.8);
      dorsal.position.set(-0.05, 0.53, 0);
      group.add(dorsal);
    }

    // Cute 3D Fish Mouth at the front (+X) so the mouth always points in swimming direction
    const mouthGeo = new THREE.TorusGeometry(0.065, 0.025, 8, 16);
    const mouthMat = new THREE.MeshStandardMaterial({
      color: fishTheme.accent,
      roughness: 0.35,
    });
    const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.rotation.y = Math.PI / 2;
    mouthMesh.position.set(0.32, 0.30, 0);
    group.add(mouthMesh);

    // Decorative Clownfish white stripe (if white runner) or glowing bioluminescent crest (if black runner)
    if (isWhite) {
      const stripeGeo = new THREE.TorusGeometry(0.24, 0.035, 8, 20);
      const stripeMat = accentMat;
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.y = Math.PI / 2;
      stripe.position.set(0.02, 0.32, 0);
      group.add(stripe);
    } else {
      // Anglerfish glowing lure / antenna
      const stalkGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
      const stalkMat = accentMat;
      const stalk = new THREE.Mesh(stalkGeo, stalkMat);
      stalk.position.set(0.18, 0.54, 0);
      stalk.rotation.z = -0.4;
      group.add(stalk);

      const lureGeo = new THREE.SphereGeometry(0.05, 12, 12);
      const lureMat = new THREE.MeshBasicMaterial({ color: fishTheme.accent });
      const lure = new THREE.Mesh(lureGeo, lureMat);
      lure.position.set(0.26, 0.65, 0);
      group.add(lure);
    }

    // Expressive cartoon eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyePupilGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

    // Right Eye
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.2, 0.36, 0.16);
    const rWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    const rPupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    rPupil.position.set(0.03, 0, 0.02);
    rightEyeGroup.add(rWhite, rPupil);
    group.add(rightEyeGroup);

    // Left Eye
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(0.2, 0.36, -0.16);
    const lWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    const lPupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    lPupil.position.set(0.03, 0, -0.02);
    leftEyeGroup.add(lWhite, lPupil);
    group.add(leftEyeGroup);

    // Wagging Caudal Tail Fin (hinged at back)
    const tailPivot = new THREE.Group();
    tailPivot.position.set(-0.3, 0.32, 0);

    const tailGeo = species === 3
      ? new THREE.ConeGeometry(0.24, 0.42, 5)
      : new THREE.ConeGeometry(species === 2 ? 0.22 : 0.18, species === 4 ? 0.42 : 0.32, species === 1 ? 3 : 4);
    tailGeo.scale(0.3, 1.2, species === 4 ? 1.5 : 1.0); // flat fin
    const tailMesh = new THREE.Mesh(tailGeo, accentMat);
    tailMesh.position.set(-0.14, 0, 0);
    tailMesh.rotation.z = Math.PI / 2;
    tailPivot.add(tailMesh);
    group.add(tailPivot);

    // Pectoral Fins
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

    // Golden Sea Coin / Pearl Badge on fish back
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
