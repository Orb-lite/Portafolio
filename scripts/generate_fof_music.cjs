// High-fidelity Subaquatic Synthwave Music Synthesizer for Fish of Fortune 3D
// Generates a studio-grade 124 BPM electronic music track in the style of "SIXTY FRAMES"
const fs = require('fs');
const { spawnSync } = require('child_process');

const SAMPLE_RATE = 44100;
const BPM = 124;
const BEAT_SEC = 60 / BPM; // ~0.48387 s
const BAR_SEC = BEAT_SEC * 4; // ~1.93548 s
const TOTAL_BARS = 64;
const TOTAL_DURATION = BAR_SEC * TOTAL_BARS; // ~123.87 s
const TOTAL_SAMPLES = Math.floor(TOTAL_DURATION * SAMPLE_RATE);

console.log(`Generating Fish of Fortune Theme: ${TOTAL_BARS} bars, ${TOTAL_DURATION.toFixed(2)}s at ${BPM} BPM...`);

// Stereo buffers
const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

// Note frequencies (Hz) in F minor
const notes = {
  F1: 43.65, G1: 49.00, Ab1: 51.91, Bb1: 58.27, C2: 65.41, Db2: 69.30, Eb2: 77.78,
  F2: 87.31, G2: 98.00, Ab2: 103.83, Bb2: 116.54, C3: 130.81, Db3: 138.59, Eb3: 155.56,
  F3: 174.61, G3: 196.00, Ab3: 207.65, Bb3: 233.08, C4: 261.63, Db4: 277.18, Eb4: 311.13,
  F4: 349.23, G4: 392.00, Ab4: 415.30, Bb4: 466.16, C5: 523.25, Db5: 554.37, Eb5: 622.25,
  F5: 698.46, G5: 783.99, Ab5: 830.61, Bb5: 932.33, C6: 1046.50
};

// Chord progressions (4-bar loops)
// Chord A: Fm9 -> Dbmaj7 -> Bbm9 -> C7alt
const chords = [
  // Fm9: F3, Ab3, C4, Eb4, G4
  [notes.F3, notes.Ab3, notes.C4, notes.Eb4, notes.G4],
  // Dbmaj7: Db3, F3, Ab3, C4, F4
  [notes.Db3, notes.F3, notes.Ab3, notes.C4, notes.F4],
  // Bbm9: Bb2, Db3, F3, Ab3, C4
  [notes.Bb2, notes.Db3, notes.F3, notes.Ab3, notes.C4],
  // C7alt: C3, E3, G3, Bb3, Db4
  [notes.C3, 164.81, notes.G3, notes.Bb3, notes.Db4]
];

// Drum: Electronic 909-style sub kick
function addKick(time, gain = 1.0) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const duration = 0.38;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Pitch drops from 180Hz down to 42Hz exponentially
    const pitch = 42 + 138 * Math.exp(-t * 26);
    const phase = 2 * Math.PI * (42 * t + (138 / 26) * (1 - Math.exp(-t * 26)));
    // Amplitude envelope
    const env = Math.exp(-t * 9.5);
    // Click transient
    const click = t < 0.006 ? Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 400) * 0.45 : 0;
    const sample = (Math.sin(phase) + click) * env * gain * 0.78;
    left[startSample + i] += sample;
    right[startSample + i] += sample;
  }
}

// Drum: Crisp ocean clap / snare
function addSnare(time, gain = 0.8) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const duration = 0.28;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Tone body
    const body = Math.sin(2 * Math.PI * (190 * Math.exp(-t * 22)) * t) * Math.exp(-t * 18) * 0.4;
    // Noise snap with bandpass feel
    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 14) * 0.55;
    // Splash decay
    const splash = (Math.random() * 2 - 1) * Math.exp(-t * 7) * 0.15;
    const sample = (body + noise + splash) * gain * 0.65;
    left[startSample + i] += sample * 0.95;
    right[startSample + i] += sample * 1.05;
  }
}

// Drum: Crisp hi-hat
function addHiHat(time, open = false, gain = 0.5) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const duration = open ? 0.22 : 0.055;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const decay = open ? 12 : 55;
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // High frequency metallic noise
    const n1 = Math.random() * 2 - 1;
    const n2 = Math.sin(2 * Math.PI * 8200 * t) * 0.3;
    const sample = (n1 * 0.7 + n2 * 0.3) * Math.exp(-t * decay) * gain * 0.4;
    left[startSample + i] += sample * 0.85;
    right[startSample + i] += sample * 1.15;
  }
}

// Water bubble sound
function addBubble(time, freq = 650, gain = 0.4) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const duration = 0.16;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Water drop pitch sweeps up
    const f = freq * (1 + 1.2 * (1 - Math.exp(-t * 30)));
    const env = Math.sin((t / duration) * Math.PI) * Math.exp(-t * 12);
    const sample = Math.sin(2 * Math.PI * f * t) * env * gain * 0.45;
    const pan = 0.5 + 0.4 * Math.sin(time * 3);
    left[startSample + i] += sample * (1 - pan);
    right[startSample + i] += sample * pan;
  }
}

// Sonar ping with stereo echo
function addSonarPing(time, freq = 1760, gain = 0.35) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const duration = 0.6;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 5.5);
    const sample = Math.sin(2 * Math.PI * freq * t) * env * gain * 0.4;
    left[startSample + i] += sample * 0.3;
    right[startSample + i] += sample * 0.7;
    // Echo 1
    const echo1 = Math.floor(0.24 * SAMPLE_RATE);
    if (i >= echo1) {
      left[startSample + i] += sample * 0.45;
    }
    // Echo 2
    const echo2 = Math.floor(0.48 * SAMPLE_RATE);
    if (i >= echo2) {
      right[startSample + i] += sample * 0.25;
    }
  }
}

// Subaquatic rolling bass note (sine + filtered saw)
function addBassNote(time, freq, duration, gain = 0.65) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, t * 120) * Math.exp(-t * 3.8);
    // Sub sine
    const sub = Math.sin(2 * Math.PI * freq * t);
    // Second harmonic with slight saturation
    const harm2 = Math.sin(2 * Math.PI * (freq * 2) * t) * 0.35;
    // Warm saw wave filtered
    let saw = 0;
    for (let h = 1; h <= 4; h++) {
      saw += (Math.sin(2 * Math.PI * freq * h * t) / (h * 1.6));
    }
    const sample = (sub * 0.65 + harm2 * 0.2 + saw * 0.15) * env * gain * 0.8;
    left[startSample + i] += sample;
    right[startSample + i] += sample;
  }
}

// Crystalline Pearl Pluck (FM Bell)
function addPearlPluck(time, freq, duration, gain = 0.35, pan = 0.5) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 7.5);
    // FM synthesis: carrier=freq, modulator=freq*2.5
    const mod = Math.sin(2 * Math.PI * (freq * 2.5) * t) * Math.exp(-t * 12) * 1.8;
    const carrier = Math.sin(2 * Math.PI * freq * t + mod);
    // Glass shimmer
    const shimmer = Math.sin(2 * Math.PI * (freq * 4.01) * t) * Math.exp(-t * 18) * 0.25;
    const sample = (carrier + shimmer) * env * gain * 0.45;
    left[startSample + i] += sample * (1 - pan);
    right[startSample + i] += sample * pan;
  }
}

// Shimmer Pad Chord
function addPadChord(time, chordNotes, duration, gain = 0.25) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < numSamples && startSample + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Attack-Decay envelope
    const attack = Math.min(1, t / 0.8);
    const release = Math.min(1, (duration - t) / 0.8);
    const env = attack * release;
    let chordL = 0;
    let chordR = 0;
    for (let c = 0; c < chordNotes.length; c++) {
      const f = chordNotes[c];
      // Detuned chorus
      const s1 = Math.sin(2 * Math.PI * (f * 0.998) * t);
      const s2 = Math.sin(2 * Math.PI * (f * 1.002) * t);
      const s3 = Math.sin(2 * Math.PI * f * t);
      chordL += (s1 * 0.6 + s3 * 0.4);
      chordR += (s2 * 0.6 + s3 * 0.4);
    }
    const sampleL = (chordL / chordNotes.length) * env * gain * 0.3;
    const sampleR = (chordR / chordNotes.length) * env * gain * 0.3;
    left[startSample + i] += sampleL;
    right[startSample + i] += sampleR;
  }
}

// Build the 64-bar arrangement!
console.log('Composing arrangement...');

// Bassline pattern notes for each bar (in 16th notes)
const bassF = [notes.F1, notes.F1, 0, notes.F1, notes.Ab1, 0, notes.F1, 0, notes.Bb1, 0, notes.F1, notes.F1, notes.Eb1, 0, notes.G1, 0];
const bassDb = [notes.Db2, notes.Db2, 0, notes.Db2, notes.F1, 0, notes.Db2, 0, notes.Ab1, 0, notes.Db2, notes.Db2, notes.C2, 0, notes.Eb1, 0];
const bassBb = [notes.Bb1, notes.Bb1, 0, notes.Bb1, notes.Db2, 0, notes.Bb1, 0, notes.F1, 0, notes.Bb1, notes.Bb1, notes.Ab1, 0, notes.C2, 0];
const bassC = [notes.C2, notes.C2, 0, notes.C2, notes.E1, 0, notes.C2, 0, notes.G1, 0, notes.C2, notes.C2, notes.Bb1, 0, notes.Db2, 0];

const bassBars = [bassF, bassDb, bassBb, bassC];

// Arpeggio scales (16th notes per bar)
const arp1 = [notes.F4, notes.Ab4, notes.C5, notes.Eb5, notes.G5, notes.Eb5, notes.C5, notes.Ab4, notes.F4, notes.Ab4, notes.C5, notes.F5, notes.Eb5, notes.C5, notes.Ab4, notes.G4];
const arp2 = [notes.Db4, notes.F4, notes.Ab4, notes.C5, notes.F5, notes.C5, notes.Ab4, notes.F4, notes.Db4, notes.F4, notes.Ab4, notes.Db5, notes.C5, notes.Ab4, notes.F4, notes.Eb4];
const arp3 = [notes.Bb3, notes.Db4, notes.F4, notes.Ab4, notes.C5, notes.Ab4, notes.F4, notes.Db4, notes.Bb3, notes.Db4, notes.F4, notes.Bb4, notes.Ab4, notes.F4, notes.Db4, notes.C4];
const arp4 = [notes.C4, notes.E4, notes.G4, notes.Bb4, notes.Db5, notes.Bb4, notes.G4, notes.E4, notes.C4, notes.E4, notes.G4, notes.C5, notes.Bb4, notes.G4, notes.E4, notes.Db4];
const arpBars = [arp1, arp2, arp3, arp4];

for (let bar = 0; bar < TOTAL_BARS; bar++) {
  const barTime = bar * BAR_SEC;
  const chordIdx = bar % 4;
  const chordNotes = chords[chordIdx];
  const bassPattern = bassBars[chordIdx];
  const arpPattern = arpBars[chordIdx];

  // Section types:
  // 0-7: Intro (Atmospheric ocean swell + plucks + bubbles)
  // 8-23: Main Groove A (Full kick, bass, hats, pearl plucks)
  // 24-31: Coral Trench Breakdown (Kick out, pads, sonar, riser)
  // 32-47: High Energy Climax (Full beat, intense bass, fast arp, claps)
  // 48-59: Groove B (Varied syncopation)
  // 60-63: Outro / seamless loop turnaround

  const isIntro = bar < 8;
  const isBreakdown = bar >= 24 && bar < 32;
  const isClimax = bar >= 32 && bar < 48;
  const isGroove = (bar >= 8 && bar < 24) || (bar >= 48 && bar < 60);
  const isOutro = bar >= 60;

  // Pads (almost everywhere except breakdown climax tension)
  if (!isBreakdown || bar < 28) {
    const padGain = isIntro ? 0.35 : (isClimax ? 0.22 : 0.28);
    addPadChord(barTime, chordNotes, BAR_SEC * 1.05, padGain);
  }

  // Kick: On beats 0, 1, 2, 3 during grooves & climax
  if (isGroove || isClimax || (isIntro && bar >= 4) || (isOutro && bar < 62)) {
    for (let beat = 0; beat < 4; beat++) {
      const kickTime = barTime + beat * BEAT_SEC;
      const kickGain = isClimax ? 1.05 : 0.95;
      addKick(kickTime, kickGain);
    }
  }

  // Snare / Coral Clap: On beats 1 and 3 (2nd and 4th beat of bar)
  if ((isGroove && bar >= 10) || isClimax || (isBreakdown && bar >= 30)) {
    addSnare(barTime + 1 * BEAT_SEC, isClimax ? 0.9 : 0.75);
    addSnare(barTime + 3 * BEAT_SEC, isClimax ? 0.9 : 0.75);
  }

  // Breakdown build-up snare roll in bars 30-31
  if (bar === 30 || bar === 31) {
    const stepCount = bar === 31 ? 16 : 8;
    for (let s = 0; s < stepCount; s++) {
      const t = barTime + (s / stepCount) * BAR_SEC;
      addSnare(t, 0.4 + 0.5 * (s / stepCount));
    }
  }

  // Hi-Hats: 16th notes with open hat on upbeats
  if (isGroove || isClimax) {
    for (let sixteenth = 0; sixteenth < 16; sixteenth++) {
      const hTime = barTime + sixteenth * (BEAT_SEC / 4);
      const isOpen = sixteenth % 4 === 2; // upbeat
      addHiHat(hTime, isOpen, isOpen ? 0.65 : 0.35);
    }
  }

  // Bassline: 16th-note rolling groove
  if (isGroove || isClimax || (isIntro && bar >= 4) || (isOutro && bar < 62)) {
    for (let sixteenth = 0; sixteenth < 16; sixteenth++) {
      const noteFreq = bassPattern[sixteenth];
      if (noteFreq > 0) {
        const bTime = barTime + sixteenth * (BEAT_SEC / 4);
        const bDuration = (BEAT_SEC / 4) * 0.9;
        const bGain = isClimax ? 0.78 : 0.65;
        addBassNote(bTime, noteFreq, bDuration, bGain);
      }
    }
  }

  // Pearl Arpeggio Plucks
  if (isIntro || isClimax || (isGroove && bar % 2 === 1) || (isBreakdown && bar >= 26)) {
    for (let sixteenth = 0; sixteenth < 16; sixteenth++) {
      const pFreq = arpPattern[sixteenth];
      if (pFreq > 0) {
        const pTime = barTime + sixteenth * (BEAT_SEC / 4);
        const pan = 0.2 + 0.6 * ((sixteenth % 8) / 8);
        const pGain = isClimax ? 0.42 : 0.32;
        addPearlPluck(pTime, pFreq, 0.25, pGain, pan);
      }
    }
  }

  // Bubbles on syncopated steps
  if (bar % 2 === 0) {
    addBubble(barTime + 0.5 * BEAT_SEC, 520, 0.45);
    addBubble(barTime + 2.75 * BEAT_SEC, 740, 0.4);
  }

  // Sonar pings every 4 bars
  if (bar % 4 === 0) {
    addSonarPing(barTime + 0.25 * BEAT_SEC, 1760, 0.4);
  }
}

// Master Limiter / Soft-Clipping Normalizer
console.log('Mastering and normalizing stereo bus...');
let maxPeak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  if (Math.abs(left[i]) > maxPeak) maxPeak = Math.abs(left[i]);
  if (Math.abs(right[i]) > maxPeak) maxPeak = Math.abs(right[i]);
}

const targetPeak = 0.94;
const scale = maxPeak > 0 ? targetPeak / maxPeak : 1;
console.log(`Peak before norm: ${maxPeak.toFixed(3)}, scale: ${scale.toFixed(3)}`);

// Convert to 16-bit PCM WAV
const pcmBuffer = Buffer.alloc(44 + TOTAL_SAMPLES * 4);
// RIFF header
pcmBuffer.write('RIFF', 0);
pcmBuffer.writeUInt32LE(36 + TOTAL_SAMPLES * 4, 4);
pcmBuffer.write('WAVE', 8);
pcmBuffer.write('fmt ', 12);
pcmBuffer.writeUInt32LE(16, 16); // subchunk1 size
pcmBuffer.writeUInt16LE(1, 20);  // PCM format
pcmBuffer.writeUInt16LE(2, 22);  // 2 channels (stereo)
pcmBuffer.writeUInt32LE(SAMPLE_RATE, 24);
pcmBuffer.writeUInt32LE(SAMPLE_RATE * 4, 28); // byte rate
pcmBuffer.writeUInt16LE(4, 32);  // block align
pcmBuffer.writeUInt16LE(16, 34); // bits per sample
pcmBuffer.write('data', 36);
pcmBuffer.writeUInt32LE(TOTAL_SAMPLES * 4, 40);

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  // Soft saturation tanh-like curve
  let l = left[i] * scale;
  let r = right[i] * scale;
  l = Math.max(-0.999, Math.min(0.999, Math.tanh(l)));
  r = Math.max(-0.999, Math.min(0.999, Math.tanh(r)));

  const valL = Math.floor(l * 32767);
  const valR = Math.floor(r * 32767);
  pcmBuffer.writeInt16LE(valL, 44 + i * 4);
  pcmBuffer.writeInt16LE(valR, 44 + i * 4 + 2);
}

const wavPath = '/tmp/fish_of_fortune_theme.wav';
const mp3Path = 'public/audio/fish_of_fortune_theme.mp3';
fs.writeFileSync(wavPath, pcmBuffer);
console.log(`WAV written to ${wavPath} (${(pcmBuffer.length / 1024 / 1024).toFixed(2)} MB). Encoding to MP3...`);

const ffmpeg = spawnSync('ffmpeg', ['-y', '-i', wavPath, '-c:a', 'libmp3lame', '-q:a', '2', mp3Path], { stdio: 'inherit' });
if (ffmpeg.status === 0) {
  console.log(`Successfully generated ${mp3Path}!`);
} else {
  console.error('Failed to encode MP3 with ffmpeg');
  process.exit(1);
}
