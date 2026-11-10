import { GameVersion } from './types';

export interface MusicTrackInfo {
  path: string;
  title: string;
  artist: string;
  bpm: number;
}

export function getMusicTrackForLevel(level: number, version: GameVersion): MusicTrackInfo {
  if (version === 'fof') {
    if (level >= 10) {
      return {
        path: '/audio/golden_vault_theme.mp3',
        title: 'Golden Sunken Vault',
        artist: 'Isaac Gómez · Sunken Sanctuary',
        bpm: 126,
      };
    }
    if (level >= 7) {
      return {
        path: '/audio/sixty_frames_conveyor.mp3',
        title: 'Sixty Frames (Bioluminescent Abyss)',
        artist: 'Tile Absorber 3D Official Track',
        bpm: 128,
      };
    }
    return {
      path: '/audio/fish_of_fortune_theme.mp3',
      title: 'Fish of Fortune (Coral Reef 124 BPM)',
      artist: 'Isaac Gómez · Subaquatic Synth',
      bpm: 124,
    };
  }

  // Conveyor Realms worlds by block level:
  if (level <= 3) {
    return {
      path: '/audio/chess_kingdom_theme.mp3',
      title: 'Chess Kingdom (Baroque Synthwave)',
      artist: 'Isaac Gómez · Royal Parquet',
      bpm: 118,
    };
  }
  if (level <= 6) {
    return {
      path: '/audio/fish_of_fortune_theme.mp3',
      title: 'Coral Cove (Aquatic Synthwave)',
      artist: 'Isaac Gómez · Subaquatic Synth',
      bpm: 124,
    };
  }
  if (level <= 9) {
    return {
      path: '/audio/sixty_frames_conveyor.mp3',
      title: 'Sixty Frames (Zero Latency Synthwave)',
      artist: 'Tile Absorber 3D Official Track',
      bpm: 128,
    };
  }
  return {
    path: '/audio/golden_vault_theme.mp3',
    title: 'Golden Vault (Emperor Anthem)',
    artist: 'Isaac Gómez · Imperial Synth',
    bpm: 126,
  };
}

// Procedural Web Audio API sound generator + HTML5 Background Music Manager
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicAudio: HTMLAudioElement | null = null;
  private currentTrackPath: string | null = null;
  private currentTrackInfo: MusicTrackInfo | null = null;
  private musicVolume: number = 0.35;
  private hasUserInteracted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.hasUserInteracted = true;
        this.initCtx();
        if (this.musicAudio && this.enabled && this.musicAudio.paused) {
          this.musicAudio.play().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }
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
    if (!enabled) {
      if (this.musicAudio) {
        this.musicAudio.pause();
      }
    } else {
      if (this.musicAudio && this.currentTrackPath) {
        this.musicAudio.play().catch(() => {});
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getCurrentTrack(): MusicTrackInfo | null {
    return this.currentTrackInfo;
  }

  // Dynamic Background Music depending on block levels
  public playMusicForLevel(level: number, version: GameVersion) {
    if (typeof window === 'undefined') return;

    const track = getMusicTrackForLevel(level, version);
    this.currentTrackInfo = track;

    if (this.currentTrackPath === track.path && this.musicAudio) {
      if (this.enabled && this.musicAudio.paused && this.hasUserInteracted) {
        this.musicAudio.play().catch(() => {});
      }
      return;
    }

    // Stop current track
    if (this.musicAudio) {
      try {
        this.musicAudio.pause();
        this.musicAudio.src = '';
      } catch {
        // ignore
      }
    }

    try {
      this.musicAudio = new Audio(track.path);
      this.musicAudio.loop = true;
      this.musicAudio.volume = this.musicVolume;
      this.musicAudio.preload = 'auto';
      this.currentTrackPath = track.path;

      if (this.enabled) {
        const playPromise = this.musicAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Browser autoplay restrictions require user interaction first
            console.log('[SoundManager] Autoplay waiting for interaction:', err?.message || 'blocked');
          });
        }
      }
    } catch (err) {
      console.warn('[SoundManager] Could not start music:', err);
    }
  }

  public stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else {
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(targetFreq * 0.8, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.5, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.1, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    } else {
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
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.35 },
      { f: 880.0, d: 0.15 },
      { f: 1046.5, d: 0.5 },
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
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.5, d: 0.35 },
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
