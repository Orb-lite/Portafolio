import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  Gamepad2,
  Sparkles,
  Shield,
  Zap,
  RotateCcw,
  Volume2,
  VolumeX,
  Database,
  User,
  Settings,
  ChevronRight,
  Flame,
  Award,
  Copy,
  Check,
  ExternalLink,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Github,
} from 'lucide-react';
import {
  HighscoreEntry,
  UserProfile,
  fetchLeaderboard,
  submitGameScore,
  getStoredUser,
  saveStoredUser,
  getSupabaseConfig,
  saveSupabaseConfig,
  SUPABASE_SETUP_SQL,
} from '../../services/supabaseGame';

// Audio Synthesizer using Web Audio API
class ArcadeAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playAbsorb(frequency = 440, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext policy
    }
  }

  playHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // noop
    }
  }

  playMegaBlast() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {
      // noop
    }
  }

  playGameOver() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [220, 196, 174, 130].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.15, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + (idx + 1) * 0.12);
      });
    } catch {
      // noop
    }
  }
}

const audio = new ArcadeAudio();

interface Tile {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  type: 'energy' | 'flux' | 'core' | 'prism' | 'hazard';
  rotation: number;
  rotationSpeed: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface TileAbsorberGameProps {
  language?: 'es' | 'en';
  onBackToPortfolio?: () => void;
}

export function TileAbsorberGame({ language = 'es', onBackToPortfolio }: TileAbsorberGameProps) {
  const isEn = language === 'en';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Core States
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [wave, setWave] = useState<number>(1);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [tilesAbsorbed, setTilesAbsorbed] = useState<number>(0);
  const [megaEnergy, setMegaEnergy] = useState<number>(0); // 0 to 100%
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // STRICT USER CONSTRAINT: NO LIFE REGENERATION. Shields start at 3 and once lost, stay lost.
  const [shields, setShields] = useState<number>(3);

  // User & Highscores
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getStoredUser());
  const [gamertagInput, setGamertagInput] = useState<string>(() => getStoredUser().gamertag);
  const [isEditingGamertag, setIsEditingGamertag] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<HighscoreEntry[]>([]);
  const [isOnlineSupabase, setIsOnlineSupabase] = useState<boolean>(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);

  // Supabase Configuration Dialog
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Game Loop References
  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'paused' | 'gameover',
    player: {
      x: 350,
      y: 250,
      targetX: 350,
      targetY: 250,
      radius: 18,
      absorbRadius: 42,
      shieldInvulnTimer: 0,
    },
    tiles: [] as Tile[],
    particles: [] as Particle[],
    score: 0,
    wave: 1,
    multiplier: 1,
    multiplierTimer: 0,
    tilesAbsorbed: 0,
    shields: 3,
    megaEnergy: 0,
    nextTileId: 1,
    lastSpawnTime: 0,
    waveStartTime: 0,
    screenShake: 0,
  });

  // Sync audio toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio.enabled = next;
  };

  // Load Leaderboard
  const refreshLeaderboard = useCallback(async () => {
    setIsLoadingLeaderboard(true);
    try {
      const res = await fetchLeaderboard();
      setLeaderboard(res.scores);
      setIsOnlineSupabase(res.isOnline);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  useEffect(() => {
    refreshLeaderboard();
    const cfg = getSupabaseConfig();
    setSupabaseUrlInput(cfg.url);
    setSupabaseKeyInput(cfg.key);
  }, [refreshLeaderboard]);

  // Handle Gamertag Update
  const handleSaveGamertag = () => {
    const clean = gamertagInput.toUpperCase().trim() || 'PLAYER_ONE';
    const updated: UserProfile = {
      ...userProfile,
      gamertag: clean,
    };
    setUserProfile(updated);
    saveStoredUser(updated);
    setIsEditingGamertag(false);
  };

  // Handle Supabase Config Save
  const handleSaveSupabaseConfig = async () => {
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setSaveSuccessMsg(isEn ? 'Configuration saved! Checking connection...' : '¡Configuración guardada! Verificando conexión...');
    await refreshLeaderboard();
    setTimeout(() => {
      setSaveSuccessMsg(null);
      setIsSupabaseModalOpen(false);
    }, 1200);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Trigger Mega Blast
  const triggerMegaBlast = useCallback(() => {
    const s = stateRef.current;
    if (s.megaEnergy < 100 || s.gameState !== 'playing') return;

    audio.playMegaBlast();
    s.megaEnergy = 0;
    setMegaEnergy(0);
    s.screenShake = 16;

    // Vaporize hazards and absorb all energy tiles
    let addedScore = 0;
    let addedTiles = 0;

    s.tiles = s.tiles.filter((tile) => {
      // Spawn explosion particles
      for (let i = 0; i < 6; i++) {
        s.particles.push({
          x: tile.x,
          y: tile.y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          color: tile.type === 'hazard' ? '#ef4444' : '#38bdf8',
          size: Math.random() * 4 + 2,
          alpha: 1,
          life: 25,
        });
      }

      if (tile.type !== 'hazard') {
        addedScore += 300 * s.multiplier;
        addedTiles += 1;
        return false;
      }
      return false; // all hazards destroyed
    });

    s.score += addedScore;
    s.tilesAbsorbed += addedTiles;
    setScore(s.score);
    setTilesAbsorbed(s.tilesAbsorbed);
  }, []);

  // Keyboard and Interaction Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        triggerMegaBlast();
      }
      if (e.code === 'KeyP') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerMegaBlast]);

  // Start / Restart Game
  const startGame = () => {
    const s = stateRef.current;
    s.gameState = 'playing';
    s.score = 0;
    s.wave = 1;
    s.multiplier = 1;
    s.multiplierTimer = 0;
    s.tilesAbsorbed = 0;
    s.shields = 3; // Strict 3 lives, NO life regenerator
    s.megaEnergy = 0;
    s.tiles = [];
    s.particles = [];
    s.lastSpawnTime = performance.now();
    s.waveStartTime = performance.now();
    s.screenShake = 0;
    s.player.x = 400;
    s.player.y = 300;
    s.player.targetX = 400;
    s.player.targetY = 300;
    s.player.shieldInvulnTimer = 0;

    setScore(0);
    setWave(1);
    setMultiplier(1);
    setTilesAbsorbed(0);
    setShields(3);
    setMegaEnergy(0);
    setGameState('playing');
  };

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Track mouse & touch
    const updateTargetPosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      stateRef.current.player.targetX = Math.max(20, Math.min(canvas.width - 20, (clientX - rect.left) * scaleX));
      stateRef.current.player.targetY = Math.max(20, Math.min(canvas.height - 20, (clientY - rect.top) * scaleY));
    };

    const onMouseMove = (e: MouseEvent) => {
      if (stateRef.current.gameState === 'playing') {
        updateTargetPosition(e.clientX, e.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (stateRef.current.gameState === 'playing' && e.touches.length > 0) {
        updateTargetPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    // Loop
    const loop = (time: number) => {
      const s = stateRef.current;
      s.gameState = gameState;

      const w = canvas.width;
      const h = canvas.height;

      // Update Screen Shake
      ctx.save();
      if (s.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.screenShake;
        const shakeY = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(shakeX, shakeY);
        s.screenShake *= 0.88;
        if (s.screenShake < 0.2) s.screenShake = 0;
      }

      // Clear with dark cyber grid background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Draw subtle neon grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // If Playing: Update Logic
      if (s.gameState === 'playing') {
        // Smooth player interpolation towards target
        const dx = s.player.targetX - s.player.x;
        const dy = s.player.targetY - s.player.y;
        s.player.x += dx * 0.18;
        s.player.y += dy * 0.18;

        if (s.player.shieldInvulnTimer > 0) {
          s.player.shieldInvulnTimer -= 1;
        }

        // Multiplier Timer decay
        if (s.multiplierTimer > 0) {
          s.multiplierTimer -= 1;
          if (s.multiplierTimer <= 0) {
            s.multiplier = 1;
            setMultiplier(1);
          }
        }

        // Wave Progression
        if (s.tilesAbsorbed >= s.wave * 20) {
          s.wave += 1;
          setWave(s.wave);
          s.screenShake = 8;
          audio.playMegaBlast();
        }

        // Spawn New Tiles
        const spawnInterval = Math.max(260, 750 - s.wave * 45);
        if (time - s.lastSpawnTime > spawnInterval && s.tiles.length < 32 + s.wave * 4) {
          s.lastSpawnTime = time;

          // Decide tile type. STRICT: NO LIFE REGENERATOR ("nomas quita lo de el recuperador de vidas")
          const rand = Math.random();
          let type: Tile['type'] = 'energy';
          if (rand < 0.45) {
            type = 'energy'; // Green Matrix (+100)
          } else if (rand < 0.65) {
            type = 'flux'; // Cyan Flux (+250)
          } else if (rand < 0.75) {
            type = 'core'; // Gold Core (+500)
          } else if (rand < 0.82) {
            type = 'prism'; // Prism Multiplier (+1000 & 2x)
          } else {
            type = 'hazard'; // Red Spiked Hazard
          }

          // Spawn from screen edges towards center
          const edge = Math.floor(Math.random() * 4);
          let spawnX = 0;
          let spawnY = 0;
          if (edge === 0) {
            spawnX = Math.random() * w;
            spawnY = -20;
          } else if (edge === 1) {
            spawnX = w + 20;
            spawnY = Math.random() * h;
          } else if (edge === 2) {
            spawnX = Math.random() * w;
            spawnY = h + 20;
          } else {
            spawnX = -20;
            spawnY = Math.random() * h;
          }

          const angleToCenter = Math.atan2(h / 2 - spawnY, w / 2 - spawnX) + (Math.random() - 0.5) * 0.8;
          const baseSpeed = (1.5 + Math.random() * 1.8) * (1 + s.wave * 0.08);

          s.tiles.push({
            id: s.nextTileId++,
            x: spawnX,
            y: spawnY,
            size: type === 'hazard' ? 24 : type === 'prism' ? 20 : 16,
            vx: Math.cos(angleToCenter) * baseSpeed,
            vy: Math.sin(angleToCenter) * baseSpeed,
            type,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.06,
            alpha: 1,
          });
        }

        // Update Tiles & Check Absorption Collisions
        s.tiles = s.tiles.filter((tile) => {
          tile.x += tile.vx;
          tile.y += tile.vy;
          tile.rotation += tile.rotationSpeed;

          // Distance to Player
          const dist = Math.hypot(tile.x - s.player.x, tile.y - s.player.y);

          // Gravitational pull when inside absorption field
          if (dist < s.player.absorbRadius + 30 && tile.type !== 'hazard') {
            const pullAngle = Math.atan2(s.player.y - tile.y, s.player.x - tile.x);
            tile.vx += Math.cos(pullAngle) * 0.6;
            tile.vy += Math.sin(pullAngle) * 0.6;
          }

          // Check Collision with Absorber
          if (dist < s.player.absorbRadius) {
            if (tile.type === 'hazard') {
              // Collision with Red Hazard Spike Tile
              if (s.player.shieldInvulnTimer <= 0) {
                s.shields -= 1;
                s.player.shieldInvulnTimer = 60; // 1s invulnerability flash
                s.screenShake = 14;
                audio.playHit();
                setShields(s.shields);

                // Particles for shield breach
                for (let p = 0; p < 16; p++) {
                  s.particles.push({
                    x: s.player.x,
                    y: s.player.y,
                    vx: (Math.random() - 0.5) * 9,
                    vy: (Math.random() - 0.5) * 9,
                    color: '#ef4444',
                    size: Math.random() * 5 + 2,
                    alpha: 1,
                    life: 30,
                  });
                }

                // Check Game Over
                if (s.shields <= 0) {
                  s.gameState = 'gameover';
                  setGameState('gameover');
                  audio.playGameOver();

                  // Save Score
                  submitGameScore({
                    gamertag: userProfile.gamertag,
                    score: s.score,
                    wave: s.wave,
                    tilesAbsorbed: s.tilesAbsorbed,
                  }).then(() => refreshLeaderboard());
                }
              }
              return false; // remove hazard
            } else {
              // Absorbed an Energy Tile!
              let points = 100;
              let energyGain = 4;
              let particleColor = '#22c55e';
              let soundFreq = 440;

              if (tile.type === 'flux') {
                points = 250;
                energyGain = 8;
                particleColor = '#06b6d4';
                soundFreq = 580;
              } else if (tile.type === 'core') {
                points = 500;
                energyGain = 12;
                particleColor = '#eab308';
                soundFreq = 720;
              } else if (tile.type === 'prism') {
                points = 1000;
                energyGain = 20;
                particleColor = '#a855f7';
                soundFreq = 880;
                s.multiplier = Math.min(8, s.multiplier * 2);
                s.multiplierTimer = 240; // 4 seconds of double points
                setMultiplier(s.multiplier);
              }

              audio.playAbsorb(soundFreq);
              s.score += points * s.multiplier;
              s.tilesAbsorbed += 1;
              s.megaEnergy = Math.min(100, s.megaEnergy + energyGain);

              setScore(s.score);
              setTilesAbsorbed(s.tilesAbsorbed);
              setMegaEnergy(s.megaEnergy);

              // Spawn Absorption Sparkles
              for (let p = 0; p < 8; p++) {
                s.particles.push({
                  x: tile.x,
                  y: tile.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: particleColor,
                  size: Math.random() * 3 + 1.5,
                  alpha: 1,
                  life: 20,
                });
              }

              return false; // remove tile from arena
            }
          }

          // Keep in arena or wrap bounds
          return tile.x > -60 && tile.x < w + 60 && tile.y > -60 && tile.y < h + 60;
        });

        // Update Particles
        s.particles = s.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 1 / p.life;
          return p.alpha > 0;
        });
      }

      // Draw Particles
      s.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Arena Tiles
      s.tiles.forEach((tile) => {
        ctx.save();
        ctx.translate(tile.x, tile.y);
        ctx.rotate(tile.rotation);

        if (tile.type === 'hazard') {
          // Red Spiked Hazard Box
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#dc2626';
          ctx.shadowBlur = 10;
          ctx.fillRect(-tile.size / 2, -tile.size / 2, tile.size, tile.size);

          // Draw Spikes
          ctx.fillStyle = '#f87171';
          ctx.beginPath();
          ctx.moveTo(0, -tile.size * 0.9);
          ctx.lineTo(-tile.size * 0.35, -tile.size * 0.4);
          ctx.lineTo(tile.size * 0.35, -tile.size * 0.4);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, tile.size * 0.9);
          ctx.lineTo(-tile.size * 0.35, tile.size * 0.4);
          ctx.lineTo(tile.size * 0.35, tile.size * 0.4);
          ctx.closePath();
          ctx.fill();
        } else {
          // Energy Tiles
          let color = '#22c55e';
          let glow = '#16a34a';

          if (tile.type === 'flux') {
            color = '#06b6d4';
            glow = '#0891b2';
          } else if (tile.type === 'core') {
            color = '#eab308';
            glow = '#ca8a04';
          } else if (tile.type === 'prism') {
            color = '#c084fc';
            glow = '#9333ea';
          }

          ctx.shadowColor = glow;
          ctx.shadowBlur = 12;
          ctx.fillStyle = color;
          ctx.fillRect(-tile.size / 2, -tile.size / 2, tile.size, tile.size);

          // Inner core highlight
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-tile.size / 4, -tile.size / 4, tile.size / 2, tile.size / 2);
        }

        ctx.restore();
      });

      // Draw Player Vessel & Absorption Field
      if (s.gameState === 'playing' || s.gameState === 'paused') {
        const isInvuln = s.player.shieldInvulnTimer > 0;
        const flash = isInvuln && Math.floor(time / 80) % 2 === 0;

        if (!flash) {
          ctx.save();
          // Absorption Magnetic Halo
          ctx.beginPath();
          ctx.arc(s.player.x, s.player.y, s.player.absorbRadius, 0, Math.PI * 2);
          ctx.strokeStyle = s.multiplier > 1 ? '#c084fc' : '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();

          // Absorption Pulsing Glow
          const pulse = (Math.sin(time / 180) + 1) * 0.5;
          ctx.fillStyle = s.multiplier > 1 ? 'rgba(192, 132, 252, 0.12)' : 'rgba(56, 189, 248, 0.1)';
          ctx.beginPath();
          ctx.arc(s.player.x, s.player.y, s.player.absorbRadius + pulse * 6, 0, Math.PI * 2);
          ctx.fill();

          // Ship Body (Triangular Absorber Vessel)
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 16;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(s.player.x, s.player.y, s.player.radius, 0, Math.PI * 2);
          ctx.fill();

          // Inner Energy Core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.player.x, s.player.y, s.player.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      ctx.restore(); // Restore after screen shake

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [gameState, userProfile.gamertag, refreshLeaderboard]);

  return (
    <div className="w-full flex flex-col space-y-6 animate-fade-in pb-16">
      {/* Game Header Bar */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {onBackToPortfolio && (
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
              title={isEn ? 'Return to Portfolio' : 'Volver al Portafolio'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Gamepad2 className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>TILE ABSORBER</span>
                <span className="text-xs bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono px-2 py-0.5 rounded-full">
                  v1.2 PRO
                </span>
              </h2>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                  isOnlineSupabase
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>
                  {isOnlineSupabase
                    ? isEn
                      ? 'Supabase Live Sync'
                      : 'Supabase en Vivo'
                    : isEn
                    ? 'Local Storage (Supabase Ready)'
                    : 'Modo Local (Listo para Supabase)'}
                </span>
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {isEn ? (
                <>
                  Absorb energy tiles to trigger score multiplier streaks! Avoid red spiked hazard tiles.{' '}
                  <strong className="text-amber-400">Survival Rule:</strong> No life recovery items — survive with your
                  starting 3 shields!
                </>
              ) : (
                <>
                  ¡Absorbe fichas de energía para crear rachas de multiplicador! Evita las fichas rojas con picos.{' '}
                  <strong className="text-amber-400">Regla de supervivencia:</strong> Sin regenerador de vidas — ¡sobrevive
                  con tus 3 escudos iniciales!
                </>
              )}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* GamerTag Editor */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">{isEn ? 'Gamertag:' : 'Jugador:'}</span>
            {isEditingGamertag ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  maxLength={14}
                  value={gamertagInput}
                  onChange={(e) => setGamertagInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveGamertag()}
                  className="w-28 px-1.5 py-0.5 bg-slate-900 border border-cyan-400 rounded text-cyan-300 font-mono font-bold text-xs outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveGamertag}
                  className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold text-[11px]"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingGamertag(true)}
                className="font-mono font-bold text-cyan-300 hover:underline"
                title={isEn ? 'Click to change Gamertag' : 'Clic para editar Gamertag'}
              >
                {userProfile.gamertag}
              </button>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-slate-800 text-cyan-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Supabase Config Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:scale-105"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'Supabase Settings' : 'Conectar Supabase'}</span>
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/Orb-lite/Tile-absorber"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:scale-105"
            title="GitHub: Orb-lite/Tile-absorber"
          >
            <Github className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Repo Git</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </section>

      {/* Main Game Interface: Canvas + Sidebar Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Canvas Arena */}
        <div className="lg:col-span-3 flex flex-col space-y-3">
          {/* HUD Status Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-white text-xs font-mono">
            {/* Shields (Strict: No life regenerator) */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-sans font-bold">{isEn ? 'SHIELDS:' : 'ESCUDOS:'}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((sIndex) => (
                  <Shield
                    key={sIndex}
                    className={`w-4 h-4 transition-all ${
                      sIndex <= shields
                        ? 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Score & Multiplier */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 font-sans font-bold">{isEn ? 'SCORE: ' : 'PUNTOS: '}</span>
                <span className="text-amber-400 font-bold text-sm sm:text-base">{score.toLocaleString()}</span>
              </div>

              {multiplier > 1 && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold animate-pulse">
                  {multiplier}X MULTIPLIER
                </span>
              )}
            </div>

            {/* Wave & Mega Blast Charge */}
            <div className="flex items-center gap-3">
              <div>
                <span className="text-slate-400 font-sans font-bold">{isEn ? 'WAVE: ' : 'RONDA: '}</span>
                <span className="text-emerald-400 font-bold text-sm">{wave}</span>
              </div>

              {/* Mega Pulse Button */}
              <button
                type="button"
                onClick={triggerMegaBlast}
                disabled={megaEnergy < 100 || gameState !== 'playing'}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  megaEnergy >= 100
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/40 animate-bounce'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 opacity-60'
                }`}
                title={isEn ? 'Press Spacebar to activate Mega Absorption Pulse' : 'Presiona Barra Espaciadora para activar Pulso Mega'}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isEn ? 'BLAST' : 'PULSO'} ({Math.floor(megaEnergy)}%)</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-full object-contain cursor-crosshair select-none"
            />

            {/* Overlays for Idle / Game Over */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-xl">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    TILE ABSORBER
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                    {isEn
                      ? 'Steer your absorber orb to collect matrix tiles and rack up multipliers. Watch out for red spikes!'
                      : 'Guía tu orbe absorbedor para capturar fichas de matriz y sumar multiplicadores. ¡Cuidado con las púas rojas!'}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl max-w-sm text-xs text-slate-400 text-left space-y-1">
                  <p className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'Survival Mode:' : 'Regla Estricta:'}</span>
                    <span className="text-slate-300">
                      {isEn ? 'No life recovery items. Survive with 3 shields.' : 'Sin recuperador de vidas. Tienes 3 escudos fijos.'}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isEn ? 'Controls: Mouse / Touch / WASD to move. Space for Pulse.' : 'Controles: Mouse / Táctil / WASD para mover. Espacio para Pulso.'}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/30 transition-all hover:scale-105"
                >
                  {isEn ? 'START RUN' : 'COMENZAR PARTIDA'}
                </button>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-xl">
                  <Flame className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
                    {isEn ? 'SHIELDS EXHAUSTED' : 'ESCUDOS AGOTADOS'}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    GAME OVER
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEn ? 'Saved to highscore leaderboard under:' : 'Puntuación registrada a nombre de:'}{' '}
                    <strong className="text-cyan-300 font-mono">{userProfile.gamertag}</strong>
                  </p>
                </div>

                {/* Score Summary Box */}
                <div className="grid grid-cols-3 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-sm w-full text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">{isEn ? 'FINAL SCORE' : 'PUNTOS'}</span>
                    <span className="text-lg font-black text-amber-400 font-mono">{score.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">{isEn ? 'WAVE' : 'RONDA'}</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{wave}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">{isEn ? 'TILES' : 'FICHAS'}</span>
                    <span className="text-lg font-black text-cyan-400 font-mono">{tilesAbsorbed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase shadow-xl transition-all hover:scale-105"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'PLAY AGAIN' : 'VOLVER A JUGAR'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Controls Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>{isEn ? 'Move with Mouse or Touch Screen · [SPACE] for Mega Pulse' : 'Mueve con Mouse o Pantalla Táctil · [ESPACIO] Pulso Mega'}</span>
            <span className="text-amber-500/90 font-medium">
              {isEn ? 'Hardcore: 3 Shields, Zero Recovery' : 'Modo Hardcore: 3 Escudos, Sin Recuperador de Vidas'}
            </span>
          </div>
        </div>

        {/* Right 1 col: Live Leaderboard & User Profile */}
        <div className="flex flex-col space-y-4">
          {/* User Profile Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isEn ? 'ACTIVE GAMERTAG' : 'GAMERTAG ACTIVO'}
                  </span>
                  <span className="text-sm font-black text-slate-900 font-mono">{userProfile.gamertag}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingGamertag(true)}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold underline"
              >
                {isEn ? 'Change' : 'Cambiar'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="text-[10px] text-slate-500 font-medium block">{isEn ? 'Best' : 'Récord'}</span>
                <span className="text-xs font-black text-amber-600 font-mono">
                  {userProfile.best_score.toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="text-[10px] text-slate-500 font-medium block">{isEn ? 'Games' : 'Partidas'}</span>
                <span className="text-xs font-black text-slate-700 font-mono">{userProfile.games_played}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="text-[10px] text-slate-500 font-medium block">{isEn ? 'Tiles' : 'Fichas'}</span>
                <span className="text-xs font-black text-cyan-600 font-mono">{userProfile.total_tiles}</span>
              </div>
            </div>
          </div>

          {/* High Score Leaderboard Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {isEn ? 'HIGHSCORE LEADERBOARD' : 'TABLA DE CLASIFICACIÓN'}
                </h4>
              </div>
              <button
                type="button"
                onClick={refreshLeaderboard}
                disabled={isLoadingLeaderboard}
                className="text-[11px] text-sky-600 hover:text-sky-700 font-medium disabled:opacity-50"
              >
                {isLoadingLeaderboard ? (isEn ? 'Updating...' : 'Cargando...') : isEn ? 'Refresh' : 'Actualizar'}
              </button>
            </div>

            {/* Scores Table */}
            <div className="flex-1 overflow-y-auto max-h-[360px] divide-y divide-slate-100 text-xs">
              {leaderboard.map((entry, index) => {
                const isTop3 = index < 3;
                const isMe = entry.gamertag.toUpperCase() === userProfile.gamertag.toUpperCase();

                return (
                  <div
                    key={entry.id || `${entry.gamertag}-${index}`}
                    className={`py-2 px-2 flex items-center justify-between rounded-lg transition-colors ${
                      isMe ? 'bg-sky-50/80 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 text-center font-mono font-bold text-xs ${
                          index === 0
                            ? 'text-amber-500'
                            : index === 1
                            ? 'text-slate-400'
                            : index === 2
                            ? 'text-amber-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>

                      <div>
                        <span className="font-mono text-slate-900 block truncate max-w-[110px]">
                          {entry.gamertag}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isEn ? 'Wave' : 'Ronda'} {entry.wave} · {entry.tiles_absorbed} {isEn ? 'tiles' : 'fichas'}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono font-black text-slate-900 text-right">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                );
              })}

              {leaderboard.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  {isEn ? 'No highscores recorded yet. Be the first!' : 'Aún no hay puntuaciones registradas. ¡Sé el primero!'}
                </div>
              )}
            </div>

            {/* Supabase Status Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${isOnlineSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}
                />
                <span>{isOnlineSupabase ? 'Supabase Sync Active' : 'Almacenamiento Local'}</span>
              </span>

              <button
                type="button"
                onClick={() => setIsSupabaseModalOpen(true)}
                className="text-sky-600 hover:text-sky-700 font-semibold underline"
              >
                {isEn ? 'Config' : 'Ajustes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Setup Modal */}
      {isSupabaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {isEn ? 'Supabase Database Connection' : 'Conexión a Base de Datos Supabase'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isEn
                      ? 'Connect your Supabase project to sync highscores and players in real time'
                      : 'Conecta tu proyecto de Supabase para sincronizar puntuaciones y gamertags'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSupabaseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* URL & Anon Key Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isEn ? 'Supabase Project URL' : 'URL del Proyecto Supabase'}
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isEn ? 'Supabase Anon Public Key' : 'Anon Public Key de Supabase'}
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {isEn
                      ? 'Available under Project Settings → API in your Supabase dashboard.'
                      : 'La encuentras en Ajustes del Proyecto → API en tu panel de Supabase.'}
                  </span>
                </div>
              </div>

              {/* SQL Setup Helper */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEn ? 'SQL Table Setup Schema' : 'Script SQL de Tablas'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? (isEn ? 'Copied!' : '¡Copiado!') : isEn ? 'Copy SQL' : 'Copiar SQL'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isEn
                    ? 'Execute this SQL script once in your Supabase SQL Editor to generate the tables tile_absorber_scores and tile_absorber_users.'
                    : 'Pega este código en el SQL Editor de Supabase para crear las tablas tile_absorber_scores y tile_absorber_users.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSupabaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  {isEn ? 'Close' : 'Cerrar'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveSupabaseConfig}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md transition-all hover:scale-105"
                >
                  {isEn ? 'Save & Connect' : 'Guardar y Conectar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
