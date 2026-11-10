import * as THREE from 'three';
import { TileColor } from './types';
import { TrackPath } from './trackPath';
import { getNumberTexture, createConveyorTexture } from './proceduralTextures';

export function getFofPearlMaterial(color: TileColor): THREE.MeshPhysicalMaterial {
  switch (color) {
    case 'white':
      return new THREE.MeshPhysicalMaterial({
        color: 0xfdf2f8,
        roughness: 0.1,
        metalness: 0.15,
        clearcoat: 1.0,
        sheen: 1.0,
        sheenColor: new THREE.Color(0xfbcfe8),
      });
    case 'black':
      return new THREE.MeshPhysicalMaterial({
        color: 0x18181b,
        roughness: 0.15,
        metalness: 0.3,
        clearcoat: 1.0,
        sheen: 0.8,
        sheenColor: new THREE.Color(0x818cf8),
      });
    case 'blue':
      return new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.25,
        clearcoat: 1.0,
        sheen: 1.0,
        sheenColor: new THREE.Color(0x38bdf8),
      });
    case 'yellow':
      return new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        roughness: 0.1,
        metalness: 0.3,
        clearcoat: 1.0,
        sheen: 1.0,
        sheenColor: new THREE.Color(0xfef08a),
      });
    case 'pink':
      return new THREE.MeshPhysicalMaterial({
        color: 0xf43f5e,
        roughness: 0.1,
        metalness: 0.2,
        clearcoat: 1.0,
        sheen: 1.0,
        sheenColor: new THREE.Color(0xfecdd3),
      });
    case 'green':
      return new THREE.MeshPhysicalMaterial({
        color: 0x059669,
        roughness: 0.12,
        metalness: 0.2,
        clearcoat: 1.0,
        sheen: 1.0,
        sheenColor: new THREE.Color(0xa7f3d0),
      });
    case 'purple':
      return new THREE.MeshPhysicalMaterial({ color: 0x7c3aed, roughness: 0.1, metalness: 0.2, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xc4b5fd) });
    case 'red':
      return new THREE.MeshPhysicalMaterial({ color: 0xdc2626, roughness: 0.1, metalness: 0.2, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xfca5a5) });
    case 'cyan':
      return new THREE.MeshPhysicalMaterial({ color: 0x0891b2, roughness: 0.1, metalness: 0.2, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xa5f3fc) });
    case 'orange':
      return new THREE.MeshPhysicalMaterial({ color: 0xea580c, roughness: 0.1, metalness: 0.2, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xfdba74) });
    case 'magenta':
      return new THREE.MeshPhysicalMaterial({ color: 0xc026d3, roughness: 0.1, metalness: 0.2, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xf0abfc) });
    case 'lime':
      return new THREE.MeshPhysicalMaterial({ color: 0x65a30d, roughness: 0.1, metalness: 0.2, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xd9f99d) });
    default:
      return new THREE.MeshPhysicalMaterial({ color: 0xffffff });
  }
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

    // Tiny shell pedestal underneath pearl
    this.trayGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.06, 16);
    this.trayMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.4,
    });
  }

  public createPearlTile(color: TileColor, encapsulated = false, size = 0.44): THREE.Group {
    const group = new THREE.Group();
    const s = size / 0.44;

    const tray = new THREE.Mesh(this.trayGeo, this.trayMat);
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
      // Sea bubble encapsulation
      const bubble = new THREE.Mesh(this.bubbleGeo, this.bubbleMat);
      bubble.position.y = 0.2 * s;
      bubble.scale.set(s, s, s);
      bubble.name = 'encapsulation';
      group.add(bubble);
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
    initialCount: number
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
    bodyGeo.scale(1.25, 0.95, 0.8); // length, height, width
    const bodyMesh = new THREE.Mesh(bodyGeo, fishMat);
    bodyMesh.position.y = 0.32;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

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

    const tailGeo = new THREE.ConeGeometry(0.18, 0.32, 4);
    tailGeo.scale(0.3, 1.2, 1.0); // flat fin
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
