const fs = require('fs');
const { spawnSync } = require('child_process');

const SAMPLE_RATE = 44100;

function createWavHeader(numSamples) {
  const pcmBuffer = Buffer.alloc(44 + numSamples * 4);
  pcmBuffer.write('RIFF', 0);
  pcmBuffer.writeUInt32LE(36 + numSamples * 4, 4);
  pcmBuffer.write('WAVE', 8);
  pcmBuffer.write('fmt ', 12);
  pcmBuffer.writeUInt32LE(16, 16);
  pcmBuffer.writeUInt16LE(1, 20);  // PCM
  pcmBuffer.writeUInt16LE(2, 22);  // Stereo
  pcmBuffer.writeUInt32LE(SAMPLE_RATE, 24);
  pcmBuffer.writeUInt32LE(SAMPLE_RATE * 4, 28);
  pcmBuffer.writeUInt16LE(4, 32);
  pcmBuffer.writeUInt16LE(16, 34);
  pcmBuffer.write('data', 36);
  pcmBuffer.writeUInt32LE(numSamples * 4, 40);
  return pcmBuffer;
}

// 1. Generate Chess Kingdom Theme: Stately 118 BPM Baroque Synthwave in D Minor
function generateChessKingdom() {
  const BPM = 118;
  const BEAT = 60 / BPM;
  const BAR = BEAT * 4;
  const BARS = 32;
  const DURATION = BAR * BARS;
  const SAMPLES = Math.floor(DURATION * SAMPLE_RATE);
  const left = new Float32Array(SAMPLES);
  const right = new Float32Array(SAMPLES);

  const D2 = 73.42, F2 = 87.31, G2 = 98.00, A2 = 110.00, Bb2 = 116.54, C3 = 130.81, D3 = 146.83, E3 = 164.81;
  const F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23;

  for (let bar = 0; bar < BARS; bar++) {
    const t0 = bar * BAR;
    const chordIdx = bar % 4; // Dm -> Bb -> Gm -> A7
    const root = chordIdx === 0 ? D2 : chordIdx === 1 ? Bb2 : chordIdx === 2 ? G2 : A2;

    // Baroque Harpsichord / Pluck Arpeggio
    const arpNotes = chordIdx === 0
      ? [D3, F3, A3, D4, F4, D4, A3, F3, D3, F3, A3, D4, E4, D4, A3, F3]
      : chordIdx === 1
      ? [Bb2, D3, F3, Bb3, D4, Bb3, F3, D3, Bb2, D3, F3, Bb3, C4, Bb3, F3, D3]
      : chordIdx === 2
      ? [G2, Bb2, D3, G3, Bb3, G3, D3, Bb2, G2, Bb2, D3, G3, A3, G3, D3, Bb2]
      : [A2, 138.59, E3, A3, 277.18, A3, E3, 138.59, A2, 138.59, E3, A3, Bb3, A3, E3, 138.59];

    for (let step = 0; step < 16; step++) {
      const stepT = t0 + step * (BEAT / 4);
      const sIdx = Math.floor(stepT * SAMPLE_RATE);
      const freq = arpNotes[step];

      // Pluck synthesis
      for (let i = 0; i < 4000 && sIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 14);
        const wave = (Math.sin(2 * Math.PI * freq * t) * 0.7 + Math.sin(2 * Math.PI * (freq * 2) * t) * 0.3);
        const pan = (step % 2 === 0) ? 0.35 : 0.65;
        left[sIdx + i] += wave * env * 0.22 * (1 - pan);
        right[sIdx + i] += wave * env * 0.22 * pan;
      }
    }

    // Royal Sub-Bass
    for (let b = 0; b < 4; b++) {
      const beatT = t0 + b * BEAT;
      const bIdx = Math.floor(beatT * SAMPLE_RATE);
      for (let i = 0; i < 14000 && bIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 4);
        const sub = Math.sin(2 * Math.PI * root * t) * 0.6 + Math.sin(2 * Math.PI * (root * 2) * t) * 0.2;
        left[bIdx + i] += sub * env * 0.45;
        right[bIdx + i] += sub * env * 0.45;
      }
    }

    // Stately Kick & Snare
    for (let b = 0; b < 4; b++) {
      const kIdx = Math.floor((t0 + b * BEAT) * SAMPLE_RATE);
      for (let i = 0; i < 8000 && kIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const pitch = 45 + 110 * Math.exp(-t * 30);
        const kick = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 12);
        left[kIdx + i] += kick * 0.55;
        right[kIdx + i] += kick * 0.55;
      }
    }

    // Crisp Snare on beats 1 and 3
    [1, 3].forEach(b => {
      const snIdx = Math.floor((t0 + b * BEAT) * SAMPLE_RATE);
      for (let i = 0; i < 7000 && snIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 20) * 0.45;
        left[snIdx + i] += noise;
        right[snIdx + i] += noise;
      }
    });
  }

  // Normalize
  const buf = createWavHeader(SAMPLES);
  let max = 0;
  for (let i = 0; i < SAMPLES; i++) {
    if (Math.abs(left[i]) > max) max = Math.abs(left[i]);
    if (Math.abs(right[i]) > max) max = Math.abs(right[i]);
  }
  const gain = max > 0 ? 0.92 / max : 1;
  for (let i = 0; i < SAMPLES; i++) {
    const l = Math.floor(Math.max(-1, Math.min(1, left[i] * gain)) * 32767);
    const r = Math.floor(Math.max(-1, Math.min(1, right[i] * gain)) * 32767);
    buf.writeInt16LE(l, 44 + i * 4);
    buf.writeInt16LE(r, 44 + i * 4 + 2);
  }
  fs.writeFileSync('/tmp/chess_kingdom.wav', buf);
  spawnSync('ffmpeg', ['-y', '-i', '/tmp/chess_kingdom.wav', '-c:a', 'libmp3lame', '-q:a', '2', 'public/audio/chess_kingdom_theme.mp3']);
  console.log('Generated chess_kingdom_theme.mp3');
}

// 2. Generate Golden Vault Theme: Majestic 126 BPM Emperor Synth in E Minor
function generateGoldenVault() {
  const BPM = 126;
  const BEAT = 60 / BPM;
  const BAR = BEAT * 4;
  const BARS = 32;
  const DURATION = BAR * BARS;
  const SAMPLES = Math.floor(DURATION * SAMPLE_RATE);
  const left = new Float32Array(SAMPLES);
  const right = new Float32Array(SAMPLES);

  const E2 = 82.41, G2 = 98.00, A2 = 110.00, B2 = 123.47, C3 = 130.81, D3 = 146.83, E3 = 164.81;
  const G3 = 196.00, A3 = 220.00, B3 = 246.94, C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.00;

  for (let bar = 0; bar < BARS; bar++) {
    const t0 = bar * BAR;
    const chordIdx = bar % 4; // Em -> C -> G -> D
    const root = chordIdx === 0 ? E2 : chordIdx === 1 ? C3 : chordIdx === 2 ? G2 : D3;

    // Golden Shimmer Bell Arp
    const arpNotes = chordIdx === 0
      ? [E3, G3, B3, E4, G4, E4, B3, G3, E3, G3, B3, E4, D4, B3, G3, E3]
      : chordIdx === 1
      ? [C3, E3, G3, C4, E4, C4, G3, E3, C3, E3, G3, C4, D4, C4, G3, E3]
      : chordIdx === 2
      ? [G2, B2, D3, G3, B3, G3, D3, B2, G2, B2, D3, G3, A3, G3, D3, B2]
      : [D3, 185.00, A3, D4, 369.99, D4, A3, 185.00, D3, 185.00, A3, D4, C4, A3, 185.00, D3];

    for (let step = 0; step < 16; step++) {
      const stepT = t0 + step * (BEAT / 4);
      const sIdx = Math.floor(stepT * SAMPLE_RATE);
      const freq = arpNotes[step];

      for (let i = 0; i < 5000 && sIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 9);
        const bell = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * freq * 3.01 * t);
        const pan = (step % 4) / 4;
        left[sIdx + i] += bell * env * 0.2 * (1 - pan);
        right[sIdx + i] += bell * env * 0.2 * pan;
      }
    }

    // Emperor Bass Drive
    for (let s = 0; s < 8; s++) {
      const bT = t0 + s * (BEAT / 2);
      const bIdx = Math.floor(bT * SAMPLE_RATE);
      for (let i = 0; i < 11000 && bIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 5.5);
        const saw = (Math.sin(2 * Math.PI * root * t) * 0.5 + Math.sin(2 * Math.PI * (root * 2) * t) * 0.3);
        left[bIdx + i] += saw * env * 0.5;
        right[bIdx + i] += saw * env * 0.5;
      }
    }

    // Heavy Kick
    for (let b = 0; b < 4; b++) {
      const kIdx = Math.floor((t0 + b * BEAT) * SAMPLE_RATE);
      for (let i = 0; i < 9000 && kIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const pitch = 50 + 130 * Math.exp(-t * 28);
        const kick = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 10);
        left[kIdx + i] += kick * 0.6;
        right[kIdx + i] += kick * 0.6;
      }
    }

    // Snare & Claps
    [1, 3].forEach(b => {
      const snIdx = Math.floor((t0 + b * BEAT) * SAMPLE_RATE);
      for (let i = 0; i < 8000 && snIdx + i < SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 18) * 0.48;
        left[snIdx + i] += noise;
        right[snIdx + i] += noise;
      }
    });
  }

  // Normalize
  const buf = createWavHeader(SAMPLES);
  let max = 0;
  for (let i = 0; i < SAMPLES; i++) {
    if (Math.abs(left[i]) > max) max = Math.abs(left[i]);
    if (Math.abs(right[i]) > max) max = Math.abs(right[i]);
  }
  const gain = max > 0 ? 0.92 / max : 1;
  for (let i = 0; i < SAMPLES; i++) {
    const l = Math.floor(Math.max(-1, Math.min(1, left[i] * gain)) * 32767);
    const r = Math.floor(Math.max(-1, Math.min(1, right[i] * gain)) * 32767);
    buf.writeInt16LE(l, 44 + i * 4);
    buf.writeInt16LE(r, 44 + i * 4 + 2);
  }
  fs.writeFileSync('/tmp/golden_vault.wav', buf);
  spawnSync('ffmpeg', ['-y', '-i', '/tmp/golden_vault.wav', '-c:a', 'libmp3lame', '-q:a', '2', 'public/audio/golden_vault_theme.mp3']);
  console.log('Generated golden_vault_theme.mp3');
}

generateChessKingdom();
generateGoldenVault();
