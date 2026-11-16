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
      // Bioluminescent ocean current / water stream with glowing waves
      const grad = ctx.createLinearGradient(0, 0, 0, 64);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.5, '#0369a1');
      grad.addColorStop(1, '#075985');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 64);

      // Water ripples pointing forward (+u)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      for (let x = 0; x < 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x + 20, 16);
        ctx.lineTo(x + 30, 22);
        ctx.lineTo(x + 46, 32); // Forward pointing tip
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

/**
 * Generates an underwater water-caustics texture for Fish of Fortune mode.
 */
export function createWaterCausticsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep sea sand base
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#0f3b57');
    grad.addColorStop(1, '#0a2538');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Caustic light webs
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.25)';
    ctx.lineWidth = 3;
    ctx.filter = 'blur(3px)';

    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const sx = (i * 37) % 256;
      const sy = (i * 59) % 256;
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(
        (sx + 80) % 256,
        (sy + 40) % 256,
        (sx + 30) % 256,
        (sy + 120) % 256,
        (sx + 100) % 256,
        (sy + 90) % 256
      );
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
