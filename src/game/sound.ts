// Procedural Web Audio API sound generator (Zero external dependencies)
class SoundManager {
  private static readonly MUSIC_GAIN = 0.22;
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicTimer: number | null = null;
  private musicTheme: import('./types').GameVersion = 'chess';
  private musicLevel = 1;
  private musicStep = 0;
  private musicGain: GainNode | null = null;

  constructor() {
    // Lazily initialize audio context on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.initCtx();
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(enabled ? SoundManager.MUSIC_GAIN : 0, this.ctx.currentTime, 0.12);
    }
  }

  /** Start an original procedural score that changes with the current level world. */
  public setLevelMusic(theme: import('./types').GameVersion, level: number) {
    this.musicTheme = theme;
    this.musicLevel = Math.max(1, level);
    this.initCtx();
    if (!this.ctx) return;
    if (!this.musicGain) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.ctx.destination);
    }
    this.musicGain.gain.setTargetAtTime(this.enabled ? SoundManager.MUSIC_GAIN : 0, this.ctx.currentTime, 0.15);
    if (this.musicTimer !== null) window.clearInterval(this.musicTimer);
    this.musicStep = 0;
    this.playMusicStep();
    // Music moves from an ambient pulse in early levels to a quicker arcade beat later on.
    const bpm = Math.min(132, 78 + (this.musicLevel % 10) * 3);
    this.musicTimer = window.setInterval(() => this.playMusicStep(), (60_000 / bpm) * 0.5);
  }

  public stopLevelMusic() {
    if (this.musicTimer !== null && typeof window !== 'undefined') window.clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (this.musicGain && this.ctx) this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
  }

  private playMusicStep() {
    if (!this.ctx || !this.musicGain || this.ctx.state !== 'running') return;
    const scales: Record<import('./types').GameVersion, number[]> = {
      chess: [0, 3, 5, 7, 10], primitive: [0, 3, 5, 7, 10], fof: [0, 2, 4, 7, 9], land: [0, 2, 5, 7, 9],
      birds: [0, 4, 7, 9, 11], humans: [0, 2, 4, 7, 9], cars: [0, 3, 5, 8, 10], aircraft: [0, 2, 5, 7, 11],
    };
    const scale = scales[this.musicTheme];
    const step = this.musicStep++;
    const root = this.musicTheme === 'chess' || this.musicTheme === 'cars' ? 110 : 130.81;
    const fof = this.musicTheme === 'fof';
    // A buoyant, tropical arpeggio for the Fish of Fortune world; all notes
    // are newly generated and deliberately avoid copying the game's recording.
    const fofPattern = [0, 2, 4, 2, 1, 3, 4, 3, 0, 2, 4, 1, 3, 2, 1, 4];
    const degree = fof
      ? scale[fofPattern[step % fofPattern.length]]
      : scale[(step * 3 + Math.floor(step / 4)) % scale.length];
    const octave = fof ? (step % 8 === 6 || step % 8 === 7 ? 2 : 1) : (step % 8 === 7 ? 2 : 1);
    const now = this.ctx.currentTime;
    const playNote = (frequency: number, duration: number, volume: number, type: OscillatorType) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    };
    const timbre: OscillatorType = this.musicTheme === 'cars' ? 'sawtooth' : this.musicTheme === 'birds' || fof ? 'triangle' : 'sine';
    const beatMs = 60_000 / Math.min(132, 78 + (this.musicLevel % 10) * 3);
    if (fof) {
      // Marimba-like pluck, rounded bass pulse, and a soft upper sparkle.
      playNote(root * Math.pow(2, degree / 12) * octave, 0.34, step % 4 === 0 ? 0.34 : 0.26, 'triangle');
      if (step % 4 === 0) playNote(root / 2, beatMs / 1000 * 1.65, 0.24, 'sine');
      if (step % 4 === 2) playNote(root * Math.pow(2, scale[(fofPattern[(step + 2) % fofPattern.length] + 2) % scale.length] / 12) * 2, 0.2, 0.11, 'sine');
      return;
    }
    playNote(root * Math.pow(2, degree / 12) * octave, 0.24, step % 4 === 0 ? 0.28 : 0.2, timbre);
    if (step % 4 === 0) playNote(root / 2, 0.42, 0.18, 'triangle');
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // Tap / Launch whoosh
  public playLaunch(isFish: boolean = false) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (isFish) {
      // Water splash / bubble swoosh
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else {
      // Mechanical slide / hop
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.09);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Tile absorbed pop / suction
  public playAbsorb(combo: number = 1, isFish: boolean = false) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = isFish ? 520 : 440;
    const pitchMultiplier = Math.min(2.0, 1 + (combo % 12) * 0.05);
    const targetFreq = baseFreq * pitchMultiplier;

    if (isFish) {
      // Bubbly pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(targetFreq * 0.8, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.5, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.1, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    } else {
      // Crisp arcade blip / click
      osc.type = 'square';
      osc.frequency.setValueAtTime(targetFreq, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.8, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Character cleared (reached 0)
  public playCharacterCleared(isFish: boolean = false) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = isFish ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25, 880];

    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isFish ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.12, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.28);
    });
  }

  // Win fanfare
  public playWin() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
      { f: 880.0, d: 0.15 },  // A5
      { f: 1046.5, d: 0.5 },  // C6
    ];

    let t = this.ctx.currentTime;
    notes.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d * 0.9;
    });
  }

  // Bubble pop / encapsulation crack sound
  public playBubblePop() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Triumphant Level Up fanfare
  public playLevelUp() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
    ];

    let t = this.ctx.currentTime;
    chords.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d * 0.85;
    });
  }

  // Blocked / invalid action
  public playBlocked() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Comodin Equipped / Selected
  public playComodinSelect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Comodin Tactical Activation Powerup
  public playComodinActivate() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      { f: 440, d: 0.08 },
      { f: 554.37, d: 0.08 },
      { f: 659.25, d: 0.08 },
      { f: 880, d: 0.18 },
      { f: 1108.73, d: 0.28 },
    ];

    let t = this.ctx.currentTime;
    chords.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, t);
      osc.frequency.exponentialRampToValueAtTime(note.f * 1.05, t + note.d);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + note.d + 0.03);

      t += note.d * 0.75;
    });
  }
}

export const soundManager = new SoundManager();
