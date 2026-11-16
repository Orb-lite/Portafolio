import * as THREE from 'three';

// Cache of number textures for instant performance and crisp text
const numberTextureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates or retrieves a crisp 2D canvas texture with a centered number.
 */
export function getNumberTexture(
  number: number,
  bgColor: string = '#ffffff',
  textColor: string = '#111827',
  isFish: boolean = false
): THREE.CanvasTexture {
  const key = `${number}_${bgColor}_${textColor}_${isFish}`;
  if (numberTextureCache.has(key)) {
    return numberTextureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);

    if (isFish) {
      // Lustrous circular shell / pearl coin badge
      const grad = ctx.createRadialGradient(50, 45, 10, 64, 64, 58);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, bgColor);
      grad.addColorStop(1, '#0e2b44');

      ctx.beginPath();
      ctx.arc(64, 64, 54, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.lineWidth = 6;
      ctx.strokeStyle = '#f59e0b'; // Gold border
      ctx.stroke();
    } else {
      // Rounded pill / capsule badge matching reference video
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(10, 10, 108, 108, 28);
      ctx.fill();

      ctx.lineWidth = 6;
      ctx.strokeStyle = textColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';
      ctx.stroke();
    }

    // Number text
    ctx.fillStyle = textColor;
    ctx.font = '900 60px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${number}`, 64, 66);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  numberTextureCache.set(key, texture);
  return texture;
}

/**
 * Creates conveyor belt texture with repeating directional chevron arrows.
 */
export function createConveyorTexture(isFish: boolean = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 256, 64);

    if (isFish) {
      // Crisp bright-white conveyor belt matching the Fish of Fortune playable-ad reference
      const grad = ctx.createLinearGradient(0, 0, 0, 64);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#f1f5f9');
      grad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 64);

      // Subtle aqua inner guide tracks
      ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
      ctx.fillRect(0, 2, 256, 4);
      ctx.fillRect(0, 58, 256, 4);

      // Clean aqua-blue directional chevrons pointing forward (+u)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
      for (let x = 0; x < 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x + 20, 16);
        ctx.lineTo(x + 30, 22);
        ctx.lineTo(x + 46, 32);
        ctx.lineTo(x + 30, 42);
        ctx.lineTo(x + 20, 48);
        ctx.lineTo(x + 28, 32);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Industrial conveyor track with metallic grey / purple tint and chevrons
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, 256, 64);

      // Border guidelines
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 256, 6);
      ctx.fillRect(0, 58, 256, 6);

      // Chevrons pointing forward (+u) in direction of travel
      ctx.fillStyle = '#cbd5e1';
      for (let x = 0; x < 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x + 20, 16);
        ctx.lineTo(x + 30, 22);
        ctx.lineTo(x + 48, 32); // Forward pointing tip
        ctx.lineTo(x + 30, 42);
        ctx.lineTo(x + 20, 48);
        ctx.lineTo(x + 28, 32);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

let cachedWaterCausticsTexture: THREE.CanvasTexture | null = null;

/**
 * Generates a 100% seamless toroidal Voronoi underwater caustics texture
 * with zero tile seams or square artifacts for Fish Feeder mode.
 */
export function createWaterCausticsTexture(): THREE.CanvasTexture {
  if (cachedWaterCausticsTexture) {
    return cachedWaterCausticsTexture;
  }

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    // Deterministic seamless Voronoi feature points (primary & secondary wave layers)
    const countA = 18;
    const ptsA: Array<[number, number]> = [];
    for (let i = 0; i < countA; i++) {
      const fx = ((Math.sin(i * 12.9898 + 4.1414) * 43758.5453) % 1 + 1) % 1;
      const fy = ((Math.sin(i * 78.233 + 1.732) * 28411.1923) % 1 + 1) % 1;
      ptsA.push([fx * size, fy * size]);
    }

    const countB = 14;
    const ptsB: Array<[number, number]> = [];
    for (let i = 0; i < countB; i++) {
      const fx = ((Math.sin(i * 45.164 + 9.21) * 19384.712) % 1 + 1) % 1;
      const fy = ((Math.sin(i * 93.719 + 3.45) * 31942.581) % 1 + 1) % 1;
      ptsB.push([fx * size, fy * size]);
    }

    const halfSize = size * 0.5;
    const invNorm = 1 / (size / Math.sqrt(countA));

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Primary Voronoi F1 & F2 with exact toroidal wrapping
        let d1A = 1e9;
        let d2A = 1e9;
        for (let i = 0; i < countA; i++) {
          let dx = Math.abs(x - ptsA[i][0]);
          if (dx > halfSize) dx = size - dx;
          let dy = Math.abs(y - ptsA[i][1]);
          if (dy > halfSize) dy = size - dy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < d1A) {
            d2A = d1A;
            d1A = dist;
          } else if (dist < d2A) {
            d2A = dist;
          }
        }

        // Secondary Voronoi layer for natural overlapping sunlight ripples
        let d1B = 1e9;
        let d2B = 1e9;
        for (let i = 0; i < countB; i++) {
          let dx = Math.abs(x - ptsB[i][0]);
          if (dx > halfSize) dx = size - dx;
          let dy = Math.abs(y - ptsB[i][1]);
          if (dy > halfSize) dy = size - dy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < d1B) {
            d2B = d1B;
            d1B = dist;
          } else if (dist < d2B) {
            d2B = dist;
          }
        }

        // Ridge sharpness around cell boundaries (d2 - d1 near 0 -> bright caustic line)
        const edgeA = Math.max(0, 1 - (d2A - d1A) * invNorm * 2.3);
        const edgeB = Math.max(0, 1 - (d2B - d1B) * invNorm * 2.0);
        const caustic = Math.min(1, Math.pow(edgeA, 2.4) * 0.8 + Math.pow(edgeB, 2.7) * 0.5);

        // Cohesive sunlit Caribbean azure-blue base (B > G > R, zero muddy teal or hard seams)
        const u = (x / size) * Math.PI * 2;
        const v = (y / size) * Math.PI * 2;
        const swell = 0.5 + 0.5 * Math.sin(u + Math.cos(v)) * Math.cos(v - Math.sin(u));

        const baseR = 14 + swell * 12;
        const baseG = 146 + swell * 24;
        const baseB = 212 + swell * 20;

        const r = Math.min(255, Math.round(baseR + caustic * 135));
        const g = Math.min(255, Math.round(baseG + caustic * 78));
        const b = Math.min(255, Math.round(baseB + caustic * 42));

        const idx = (y * size + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4.5, 4.5);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  cachedWaterCausticsTexture = texture;
  return texture;
}
