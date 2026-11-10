import * as THREE from 'three';
import { TileColor } from './types';
import { TrackPath } from './trackPath';
import { getNumberTexture, createConveyorTexture } from './proceduralTextures';

export function getPrimitiveHexColor(color: TileColor): number {
  switch (color) {
    case 'white': return 0xf8fafc;
    case 'black': return 0x1e293b;
    case 'blue': return 0x2563eb;
    case 'yellow': return 0xfacc15;
    case 'pink': return 0xf43f5e;
    case 'green': return 0x10b981;
    case 'purple': return 0x7c3aed;
    case 'red': return 0xdc2626;
    case 'cyan': return 0x0891b2;
    case 'orange': return 0xea580c;
    case 'magenta': return 0xc026d3;
    case 'lime': return 0x65a30d;
    default: return 0xf8fafc;
  }
}

export function getPrimitiveCssColor(color: TileColor): string {
  switch (color) {
    case 'white': return '#ffffff';
    case 'black': return '#1e293b';
    case 'blue': return '#2563eb';
    case 'yellow': return '#facc15';
    case 'pink': return '#f43f5e';
    case 'green': return '#10b981';
    case 'purple': return '#7c3aed';
    case 'red': return '#dc2626';
    case 'cyan': return '#0891b2';
    case 'orange': return '#ea580c';
    case 'magenta': return '#c026d3';
    case 'lime': return '#65a30d';
    default: return '#ffffff';
  }
}

export class PrimitiveMeshFactory {
  // Shared geometries and materials for optimal performance
  private tileGeo: THREE.BoxGeometry;
  private bubbleGeo: THREE.BoxGeometry;
  private bubbleMat: THREE.MeshPhysicalMaterial;

  constructor() {
    this.tileGeo = new THREE.BoxGeometry(0.42, 0.22, 0.42);
    this.bubbleGeo = new THREE.BoxGeometry(0.48, 0.28, 0.48);
    this.bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });
  }

  public createTile(color: TileColor, encapsulated = false, size = 0.44): THREE.Group {
    const group = new THREE.Group();
    const hex = getPrimitiveHexColor(color);
    const mat = new THREE.MeshStandardMaterial({
      color: hex,
      roughness: color === 'white' ? 0.2 : 0.35,
      metalness: 0.15,
    });
    const s = size / 0.42;
    const tile = new THREE.Mesh(this.tileGeo, mat);
    tile.scale.set(s, s, s);
    tile.castShadow = true;
    tile.receiveShadow = true;
    group.add(tile);

    if (encapsulated) {
      // Ice/crystal cage encapsulation
      const bubble = new THREE.Mesh(this.bubbleGeo, this.bubbleMat);
      bubble.scale.set(s, s, s);
      bubble.name = 'encapsulation';
      group.add(bubble);
    }
    return group;
  }

  /**
   * Creates the conveyor track ribbon with side rails and animated chevron texture.
   */
  public createConveyorTrack(trackPath: TrackPath): {
    group: THREE.Group;
    beltMaterial: THREE.MeshStandardMaterial;
  } {
    const group = new THREE.Group();

    const beltTex = createConveyorTexture(false);
    const beltMaterial = new THREE.MeshStandardMaterial({
      map: beltTex,
      roughness: 0.4,
      metalness: 0.2,
    });

    const samples = Math.max(140, Math.ceil(trackPath.totalLength * 4));
    const pathPoints = trackPath.generateTrackPolygonPoints(samples);

    // Build ribbon geometry along track path (width = 0.72)
    const trackWidth = 0.75;
    const halfW = trackWidth / 2;

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= samples; i++) {
      const p = pathPoints[i % samples];
      // Normal perpendicular to tangent on XZ plane
      const nx = -p.tangentZ;
      const nz = p.tangentX;

      // Inner and outer points
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

    // Outer & inner side curbs / guide rails
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Slate blue/grey curb
      roughness: 0.5,
      metalness: 0.2,
    });

    // Build curb ribbons slightly elevated
    const curbHeight = 0.14;
    const curbThick = 0.08;

    const buildCurb = (offset: number) => {
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
      return new THREE.Mesh(curbGeo, railMat);
    };

    const innerCurb = buildCurb(-halfW);
    const outerCurb = buildCurb(halfW);
    group.add(innerCurb);
    group.add(outerCurb);

    return { group, beltMaterial };
  }

  /**
   * Creates the bottom-left entry dispenser hopper from the reference video.
   */
  public createDispenser(): THREE.Group {
    const group = new THREE.Group();

    // Metallic tube cylinder
    const tubeGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.8, 24);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.7,
      roughness: 0.25,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.z = Math.PI / 2;
    tube.position.set(-0.25, 0.15, 0);
    tube.castShadow = true;
    group.add(tube);

    // Decorative ring collar
    const collarGeo = new THREE.TorusGeometry(0.42, 0.06, 12, 24);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.rotation.y = Math.PI / 2;
    collar.position.set(0.12, 0.15, 0);
    group.add(collar);

    return group;
  }

  /**
   * Creates a primitive runner character matching the video reference:
   * Rounded capsule body with cute bunny/bear ears and number badge.
   */
  public createRunner(
    color: TileColor,
    initialCount: number
  ): {
    group: THREE.Group;
    badgeMesh: THREE.Mesh;
    badgeMat: THREE.MeshStandardMaterial;
    updateNumber: (num: number) => void;
  } {
    const group = new THREE.Group();

    const isWhite = color === 'white';
    const isLight = color === 'white' || color === 'yellow';
    const bodyColor = getPrimitiveHexColor(color);
    const cssBg = getPrimitiveCssColor(color);
    const textColor = isLight ? '#0f172a' : '#ffffff';

    // Body material (glossy toon-like plastic)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.25,
      metalness: 0.05,
    });

    // Main rounded body capsule
    const bodyGeo = new THREE.CapsuleGeometry(0.24, 0.34, 16, 24);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.34;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Ears / top bumps
    const earGeo = new THREE.CapsuleGeometry(0.065, 0.16, 12, 16);
    const leftEar = new THREE.Mesh(earGeo, bodyMat);
    leftEar.position.set(-0.12, 0.58, 0);
    leftEar.rotation.z = 0.15;
    group.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, bodyMat);
    rightEar.position.set(0.12, 0.58, 0);
    rightEar.rotation.z = -0.15;
    group.add(rightEar);

    // Cute eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: isWhite ? 0x0f172a : 0xffffff });
    const eyeGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.15, 0.38, 0.14);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 0.38, -0.14);
    group.add(rightEye);

    // Number Badge (facing upward / angled on back)
    const badgeTexture = getNumberTexture(
      initialCount,
      cssBg,
      textColor,
      false
    );

    const badgeMat = new THREE.MeshStandardMaterial({
      map: badgeTexture,
      transparent: true,
      roughness: 0.3,
      metalness: 0.1,
    });

    const badgeGeo = new THREE.PlaneGeometry(0.36, 0.36);
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.54, 0);
    badgeMesh.rotation.x = -Math.PI / 2; // Lie flat on top for top-down visibility
    group.add(badgeMesh);

    // Number updater function
    const updateNumber = (num: number) => {
      const newTex = getNumberTexture(
        num,
        cssBg,
        textColor,
        false
      );
      badgeMat.map = newTex;
      badgeMat.needsUpdate = true;
    };

    return { group, badgeMesh, badgeMat, updateNumber };
  }
}
