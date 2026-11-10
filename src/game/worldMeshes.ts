import * as THREE from 'three';
import { GameVersion, TileColor } from './types';
import { getNumberTexture } from './proceduralTextures';
import { getPrimitiveCssColor, getPrimitiveHexColor } from './primitiveMeshes';

export type NonAquaticWorld = Exclude<GameVersion, 'primitive' | 'fof'>;

const ACCENTS: Record<TileColor, number> = {
  white: 0xf97316, black: 0x38bdf8, blue: 0x7dd3fc, yellow: 0xfef08a,
  pink: 0xfda4af, green: 0x6ee7b7, purple: 0xc4b5fd, red: 0xfca5a5,
  cyan: 0xa5f3fc, orange: 0xfdba74, magenta: 0xf0abfc, lime: 0xd9f99d,
  bomb: 0xef4444, rainbow: 0xec4899,
};

export class WorldMeshFactory {
  public createRunner(theme: NonAquaticWorld, color: TileColor, initialCount: number) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: getPrimitiveHexColor(color), roughness: 0.3, metalness: 0.08 });
    const accentMat = new THREE.MeshStandardMaterial({ color: ACCENTS[color], roughness: 0.3, metalness: 0.06 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x172033, roughness: 0.55 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    let tailMesh: THREE.Mesh | undefined;
    const sphere = (geometry: THREE.SphereGeometry, material: THREE.Material, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      group.add(mesh);
      return mesh;
    };
    const box = (geometry: THREE.BoxGeometry, material: THREE.Material, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      group.add(mesh);
      return mesh;
    };

    if (theme === 'chess') {
      // A readable low-poly chess pawn with a contrasting team-colored plinth.
      const porcelain = new THREE.MeshStandardMaterial({
        color: color === 'white' ? 0xf3e8d0 : color === 'black' ? 0x252331 : getPrimitiveHexColor(color),
        roughness: 0.24,
        metalness: 0.16,
      });
      const gold = new THREE.MeshStandardMaterial({ color: 0xd6ad62, metalness: 0.58, roughness: 0.28 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.29, 0.1, 14), gold);
      base.position.y = 0.08; base.castShadow = true; group.add(base);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 0.18, 12), porcelain);
      foot.position.y = 0.2; foot.castShadow = true; group.add(foot);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.14, 0.28, 12), porcelain);
      stem.position.y = 0.42; stem.castShadow = true; group.add(stem);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.035, 6, 12), gold);
      collar.rotation.x = Math.PI / 2; collar.position.y = 0.55; group.add(collar);
      sphere(new THREE.SphereGeometry(0.13, 14, 10), porcelain, 0, 0.69, 0);
    } else if (theme === 'land') {
      const body = sphere(new THREE.SphereGeometry(0.23, 16, 12), bodyMat, 0, 0.34, 0);
      body.scale.set(1.4, 0.9, 0.85);
      const head = sphere(new THREE.SphereGeometry(0.15, 14, 12), bodyMat, 0.29, 0.43, 0);
      const earGeo = new THREE.SphereGeometry(0.075, 10, 8);
      sphere(earGeo, accentMat, 0.31, 0.59, 0.1).scale.set(0.5, 1.6, 0.5);
      sphere(earGeo, accentMat, 0.31, 0.59, -0.1).scale.set(0.5, 1.6, 0.5);
      const legGeo = new THREE.CapsuleGeometry(0.045, 0.13, 4, 7);
      for (const x of [-0.18, 0.18]) for (const z of [-0.13, 0.13]) {
        const leg = new THREE.Mesh(legGeo, bodyMat);
        leg.position.set(x, 0.13, z); leg.castShadow = true; group.add(leg);
      }
      tailMesh = sphere(new THREE.SphereGeometry(0.07, 8, 8), accentMat, -0.33, 0.4, 0);
      tailMesh.scale.set(1.5, 0.55, 0.55);
      for (const z of [-0.115, 0.115]) {
        sphere(new THREE.SphereGeometry(0.04, 8, 8), eyeMat, 0.38, 0.48, z);
        sphere(new THREE.SphereGeometry(0.02, 8, 8), pupilMat, 0.405, 0.48, z * 1.2);
      }
    } else if (theme === 'birds') {
      const body = sphere(new THREE.SphereGeometry(0.22, 16, 12), bodyMat, 0, 0.35, 0);
      body.scale.set(1.15, 0.9, 0.8);
      sphere(new THREE.SphereGeometry(0.13, 12, 10), bodyMat, 0.23, 0.47, 0);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 8), accentMat);
      beak.rotation.z = -Math.PI / 2; beak.position.set(0.4, 0.45, 0); group.add(beak);
      const wingGeo = new THREE.SphereGeometry(0.13, 10, 8);
      const wing = sphere(wingGeo, accentMat, -0.02, 0.38, 0.17);
      wing.scale.set(1.2, 0.25, 0.75);
      const otherWing = sphere(wingGeo, accentMat, -0.02, 0.38, -0.17);
      otherWing.scale.copy(wing.scale);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 5), accentMat);
      tail.rotation.z = Math.PI / 2; tail.position.set(-0.28, 0.38, 0); group.add(tail);
      for (const z of [-0.09, 0.09]) {
        sphere(new THREE.SphereGeometry(0.035, 8, 8), eyeMat, 0.27, 0.51, z);
        sphere(new THREE.SphereGeometry(0.018, 8, 8), pupilMat, 0.29, 0.51, z * 1.2);
      }
    } else if (theme === 'humans') {
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.23, 5, 10), bodyMat);
      torso.position.set(0, 0.38, 0); torso.castShadow = true; group.add(torso);
      sphere(new THREE.SphereGeometry(0.13, 12, 10), new THREE.MeshStandardMaterial({ color: 0xf1c7a5, roughness: 0.55 }), 0.02, 0.7, 0);
      const limbGeo = new THREE.CapsuleGeometry(0.045, 0.22, 4, 7);
      for (const z of [-0.2, 0.2]) {
        const arm = new THREE.Mesh(limbGeo, accentMat); arm.position.set(0, 0.39, z); arm.rotation.x = z; group.add(arm);
        const leg = new THREE.Mesh(limbGeo, darkMat); leg.position.set(-0.04, 0.12, z * 0.55); group.add(leg);
      }
      for (const z of [-0.07, 0.07]) {
        sphere(new THREE.SphereGeometry(0.028, 8, 8), eyeMat, 0.12, 0.72, z);
        sphere(new THREE.SphereGeometry(0.014, 8, 8), pupilMat, 0.14, 0.72, z * 1.2);
      }
    } else if (theme === 'cars') {
      box(new THREE.BoxGeometry(0.78, 0.22, 0.4), bodyMat, 0, 0.28, 0);
      const cabin = box(new THREE.BoxGeometry(0.39, 0.2, 0.32), accentMat, -0.03, 0.48, 0);
      cabin.material = new THREE.MeshStandardMaterial({ color: 0xb9e6f5, roughness: 0.2, metalness: 0.1 });
      const wheelGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.07, 12);
      for (const x of [-0.24, 0.24]) for (const z of [-0.22, 0.22]) {
        const wheel = new THREE.Mesh(wheelGeo, darkMat);
        wheel.rotation.x = Math.PI / 2; wheel.position.set(x, 0.15, z); group.add(wheel);
      }
      for (const z of [-0.13, 0.13]) {
        sphere(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfff7cc }), 0.4, 0.3, z);
        sphere(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf87171 }), -0.4, 0.3, z);
      }
    } else {
      // Aircraft theme: compact stylized jet with fuselage, swept wings and tailplane.
      const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.92, 14), bodyMat);
      fuselage.rotation.z = Math.PI / 2; fuselage.position.y = 0.34; fuselage.castShadow = true; group.add(fuselage);
      box(new THREE.BoxGeometry(0.34, 0.055, 0.95), accentMat, -0.05, 0.33, 0);
      box(new THREE.BoxGeometry(0.24, 0.045, 0.42), bodyMat, -0.32, 0.34, 0);
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), new THREE.MeshStandardMaterial({ color: 0xa5f3fc, roughness: 0.18, metalness: 0.15 }));
      canopy.scale.set(0.7, 0.45, 0.7); canopy.position.set(0.05, 0.45, 0); group.add(canopy);
    }

    const css = getPrimitiveCssColor(color);
    const textColor = ['white', 'yellow', 'lime'].includes(color) ? '#111827' : '#ffffff';
    const badgeMat = new THREE.MeshStandardMaterial({
      map: getNumberTexture(initialCount, css, textColor, false), transparent: true, roughness: 0.3,
    });
    const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), badgeMat);
    badge.position.set(0, 0.82, 0); badge.rotation.x = -Math.PI / 2; group.add(badge);
    const updateNumber = (num: number) => {
      badgeMat.map = getNumberTexture(num, css, textColor, false);
      badgeMat.needsUpdate = true;
    };
    return { group, tailMesh, badgeMat, updateNumber };
  }
}
