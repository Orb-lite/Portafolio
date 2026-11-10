class SoundManager {
  private static readonly MUSIC_GAIN = 0.28;
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicTimer: number | null = null;
  private musicTheme: import('./types').GameVersion = 'chess';
  private musicLevel = 1;
  private musicStep = 0;
  private musicGain: GainNode | null = null;
  private musicFilterNode: BiquadFilterNode | null = null;
  private musicDriveNode: WaveShaperNode | null = null;

  // Real audio elements for Sixty Frames (Tile Absorber) and Aquatic Pulse (Fish of Fortune)
  private fofAudio: HTMLAudioElement | null = null;
  private cyberAudio: HTMLAudioElement | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private currentTrackType: 'fof' | 'cyber' | null = null;
  private mediaSources = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();
  private interactionListenerAdded = false;

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

    if (typeof window !== 'undefined' && !this.interactionListenerAdded) {
      this.interactionListenerAdded = true;
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        if (this.enabled && this.currentAudio && this.currentAudio.paused) {
          this.currentAudio.play().catch(() => {});
        }
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  private setupAudioNodes() {
    if (!this.ctx) return;
    if (!this.musicGain) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.enabled ? SoundManager.MUSIC_GAIN : 0, this.ctx.currentTime);
      this.musicGain.connect(this.ctx.destination);
    }
    if (!this.musicFilterNode) {
      this.musicFilterNode = this.ctx.createBiquadFilter();
      this.musicFilterNode.type = 'lowpass';
      this.musicFilterNode.frequency.setValueAtTime(4500, this.ctx.currentTime);
      this.musicFilterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);
    }
    if (!this.musicDriveNode) {
      this.musicDriveNode = this.ctx.createWaveShaper();
      this.musicDriveNode.curve = this.makeDistortionCurve(0);
      this.musicDriveNode.oversample = '2x';
      this.musicFilterNode.connect(this.musicDriveNode);
      this.musicDriveNode.connect(this.musicGain);
    }
  }

  private makeDistortionCurve(amount: number = 0): Float32Array<ArrayBuffer> {
    const k = amount * 40;
    const n = 4096;
    const buffer = new ArrayBuffer(n * 4);
    const curve = new Float32Array(buffer);
    if (amount <= 0.01) {
      for (let i = 0; i < n; ++i) {
        curve[i] = (i * 2) / n - 1;
      }
      return curve;
    }
    const deg = Math.PI / 180;
    for (let i = 0; i < n; ++i) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private connectAudioElement(audio: HTMLAudioElement) {
    if (!this.ctx || !this.musicFilterNode) return;
    if (this.mediaSources.has(audio)) return;
    try {
      const sourceNode = this.ctx.createMediaElementSource(audio);
      sourceNode.connect(this.musicFilterNode);
      this.mediaSources.set(audio, sourceNode);
    } catch {
      // Audio element plays through default output if MediaElementAudioSource already connected or unsupported
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.initCtx();
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(enabled ? SoundManager.MUSIC_GAIN : 0, this.ctx.currentTime, 0.12);
    }
    if (this.currentAudio) {
      if (enabled) {
        this.currentAudio.play().catch(() => {});
      } else {
        this.currentAudio.pause();
      }
    }
  }

  /**
   * Start level-adaptive soundtrack for either Fish of Fortune or Tile Absorber.
   * Modulates playback speed, filter resonance, exciter saturation, and procedural accompaniment
   * based on the player's current level tier.
   */
  public setLevelMusic(theme: import('./types').GameVersion, level: number, isFishMode?: boolean) {
    const isFish = isFishMode !== undefined ? isFishMode : (theme === 'fof');
    const targetTrackType: 'fof' | 'cyber' = isFish ? 'fof' : 'cyber';
    this.musicTheme = theme;
    this.musicLevel = Math.max(1, level);
    this.initCtx();
    this.setupAudioNodes();

    // Level-adaptive DSP parameters:
    // Level 1: 3800Hz warm introductory low-pass, clean drive, 1.00x (~124 BPM)
    // Level 2: 6200Hz clarity opening, 1.02x (~126.5 BPM)
    // Level 3: 10500Hz electro brightness, 1.04x (~129 BPM) + procedural synchronized arpeggios
    // Level 4: 15000Hz wide presence, 1.06x (~131.5 BPM)
    // Level 5+: 20000Hz (full spectrum unleashed), resonant Q, 1.08x - 1.15x, harmonic saturation
    const lpfCutoff = this.musicLevel === 1 ? 3800
      : this.musicLevel === 2 ? 6200
      : this.musicLevel === 3 ? 10500
      : this.musicLevel === 4 ? 15000
      : 20000;
    const resonanceQ = Math.min(3.5, 1.0 + (this.musicLevel - 1) * 0.45);
    const speedRate = Math.min(1.15, 1.0 + (this.musicLevel - 1) * 0.02);
    const driveAmount = Math.max(0, Math.min(0.24, (this.musicLevel - 3) * 0.05));

    if (this.ctx && this.musicFilterNode) {
      this.musicFilterNode.frequency.setTargetAtTime(lpfCutoff, this.ctx.currentTime, 0.4);
      this.musicFilterNode.Q.setTargetAtTime(resonanceQ, this.ctx.currentTime, 0.4);
    }
    if (this.musicDriveNode) {
      this.musicDriveNode.curve = this.makeDistortionCurve(driveAmount);
    }

    if (typeof window !== 'undefined') {
      if (!this.fofAudio) {
        this.fofAudio = new Audio('/audio/fish_of_fortune_theme.mp3');
        this.fofAudio.loop = true;
        this.fofAudio.preload = 'auto';
      }
      if (!this.cyberAudio) {
        this.cyberAudio = new Audio('/audio/tile_absorber_sixty_frames.mp3');
        this.cyberAudio.loop = true;
        this.cyberAudio.preload = 'auto';
      }

      const activeAudio = targetTrackType === 'fof' ? this.fofAudio : this.cyberAudio;
      const inactiveAudio = targetTrackType === 'fof' ? this.cyberAudio : this.fofAudio;

      this.connectAudioElement(activeAudio);
      activeAudio.playbackRate = speedRate;

      const prevTrackType = this.currentTrackType;
      this.currentTrackType = targetTrackType;
      this.currentAudio = activeAudio;

      if (prevTrackType !== targetTrackType) {
        inactiveAudio.pause();
        inactiveAudio.currentTime = 0;
        if (this.enabled) {
          activeAudio.play().catch(() => {});
        }
      } else {
        if (this.enabled && activeAudio.paused) {
          activeAudio.play().catch(() => {});
        }
      }
    }

    // Procedural accompaniment layers for Level 3+
    if (this.musicTimer !== null) window.clearInterval(this.musicTimer);
    this.musicStep = 0;
    const currentBpm = 124 * speedRate;
    this.musicTimer = window.setInterval(() => this.playMusicStep(isFish, speedRate), (60_000 / currentBpm) * 0.5);
  }

  public stopLevelMusic() {
    if (this.musicTimer !== null && typeof window !== 'undefined') window.clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (this.fofAudio) this.fofAudio.pause();
    if (this.cyberAudio) this.cyberAudio.pause();
    if (this.musicGain && this.ctx) this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
  }

  private playMusicStep(isFish: boolean, speedRate: number) {
    if (!this.ctx || !this.musicGain || this.ctx.state !== 'running' || !this.enabled) return;
    // Only layer procedural accompaniment from Level 3 onwards
    if (this.musicLevel < 3) return;

    const step = this.musicStep++;
    const now = this.ctx.currentTime;
    const root = 130.81; // C3 in F minor / Ab major

    const playTone = (freq: number, duration: number, volume: number, type: OscillatorType, pan: number = 0.5) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * SoundManager.MUSIC_GAIN * 0.6, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      if (panner) {
        panner.pan.setValueAtTime(pan * 2 - 1, now);
        gain.connect(panner);
        panner.connect(this.musicGain);
      } else {
        gain.connect(this.musicGain);
      }

      osc.start(now);
      osc.stop(now + duration + 0.02);
    };

    if (isFish) {
      // Fish of Fortune: Crystalline pearl plucks in F minor pentatonic (F4, Ab4, Bb4, C5, Eb5, F5)
      const pearlFrequencies = [349.23, 415.30, 466.16, 523.25, 622.25, 698.46, 830.61];
      if (step % 2 === 1) {
        const noteIdx = (step * 3 + Math.floor(step / 4)) % pearlFrequencies.length;
        const pan = 0.2 + 0.6 * ((step % 8) / 8);
        playTone(pearlFrequencies[noteIdx], 0.28, 0.35, 'triangle', pan);
      }
      // Subaquatic sonar ping accent every 8 steps on Level 5+
      if (this.musicLevel >= 5 && step % 16 === 0) {
        playTone(1760, 0.45, 0.25, 'sine', 0.7);
      }
    } else {
      // Tile Absorber 3D: Cyber sawtooth / square arpeggiator accompanying "SIXTY FRAMES"
      const cyberFrequencies = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25];
      if (step % 2 === 1) {
        const noteIdx = (step * 2) % cyberFrequencies.length;
        const pan = 0.5 + 0.4 * Math.sin(step);
        playTone(cyberFrequencies[noteIdx], 0.18, 0.28, 'sawtooth', pan);
      }
      // Overdrive laser pulse accent on Level 5+
      if (this.musicLevel >= 5 && step % 16 === 12) {
        playTone(880, 0.12, 0.3, 'square', 0.3);
      }
    }
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

  // Bubble pop / encapsulation crack sound (heavier and deeper for layers 2 and 3)
  public playBubblePop(layer = 1) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (layer >= 3) {
      // Heavy armored crack sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    } else if (layer === 2) {
      // Resonant crystal / shell crack
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    } else {
      // Standard glassy bubble pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
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

  // Cross Beam (X-Y Axis Slice) Explosion Sound
  public playCrossBeamExplosion(isFish: boolean) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (isFish) {
      // Whistling oceanic high-speed water surge
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.28);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    } else {
      // Sharp cyber laser beam blast
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Wrapped Candy ("Envolved Candy" exploding to Y and X axes + 3x3 double thump)
  public playWrappedExplosion(isFish: boolean) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Pulse 1: Deep impact
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = isFish ? 'triangle' : 'square';
    osc1.frequency.setValueAtTime(isFish ? 160 : 190, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.18);
    gain1.gain.setValueAtTime(0.42, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Pulse 2: Resonating second thump (signature Candy Crush wrapped candy double-pop)
    const t2 = now + 0.12;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(isFish ? 380 : 440, t2);
    osc2.frequency.exponentialRampToValueAtTime(90, t2 + 0.22);
    gain2.gain.setValueAtTime(0.38, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.25);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.26);
  }

  // The Exploding Pearl / Color Bomb (Rainbow cascade detonating matching color)
  public playColorBombExplosion(isFish: boolean) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Rapid ascending magical sparkle arpeggio
    const freqs = isFish
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]
      : [440, 554.37, 659.25, 880, 1108.73, 1318.51];

    let t = this.ctx.currentTime;
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === freqs.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(idx === freqs.length - 1 ? 0.35 : 0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
      t += 0.04;
    });
  }

  // Radial 3x3 Burst
  public playBurstExplosion(isFish: boolean) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isFish ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Cascading Combo Fanfare (elevates with combo streak x2, x3, x4...)
  public playComboSting(combo: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const basePitch = Math.min(880, 440 * Math.pow(1.15, Math.min(6, combo - 1)));
    const now = this.ctx.currentTime;
    const notes = [basePitch, basePitch * 1.25, basePitch * 1.5];

    let t = now;
    notes.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
      t += 0.055;
    });
  }
}

export const soundManager = new SoundManager();
