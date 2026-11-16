import React, { useEffect, useRef, useState, useCallback } from "react";
import { ALL_COLORS, GameVersion, TileColor } from "../../game/types";
import { getLevelConfig, getThemeForLevel, getVisualThemeForLevel, getColorsForLevel } from "../../game/experience";
import { GameSceneManager } from "../../game/threeScene";
import { HeaderBar } from "./HeaderBar";
import { QueueRunner, BottomQueue } from "./BottomQueue";
import { WinModal } from "./WinModal";
import { DocModal } from "./DocModal";
import { LifeModal } from "./LifeModal";
import { LevelMap } from "./LevelMap";
import { ExitLevelModal } from "./ExitLevelModal";
import { soundManager, getMusicTrackForLevel } from "../../game/sound";
import {
  getInitialLifeState,
  getSavedProgress,
  grantAdLife,
  LIFE_STORAGE_KEY,
  LifeState,
  loseLife,
  MAX_LIVES,
  PROGRESS_STORAGE_KEY,
  reconcileLifeState,
} from "../../game/lives";
import { hasNativeRewardedAds, initializeRewardedAds, showRewardedLifeAd } from "../../game/rewardAds";
import {
  getStoredUser,
  submitGameScore,
  getSupabaseConfig,
} from "../../services/supabaseGame";
import { LeaderboardModal } from "./LeaderboardModal";
import { GamertagModal } from "./GamertagModal";
import { SupabaseConfigModal } from "./SupabaseConfigModal";
import { WebAdViewerModal } from "./WebAdViewerModal";
import { ComodinesModal } from "./ComodinesModal";
import { GameMenuModal } from "./GameMenuModal";
import { generateComodinesForLevel, ComodinDefinition } from "../../game/comodines";
import { saveComodinSessionToCache, getComodinSessionFromCache } from "../../services/sessionCache";
import { ArrowLeft, Gamepad2, Zap, Fish, Menu, Music, Volume2, VolumeX, Gem, Coins, Download, Maximize2, Minimize2 } from "lucide-react";
import { GameLanguage, GAME_TEXT, getLocalizedColorName } from "../../game/localization";

interface TileAbsorberGameProps {
  language?: GameLanguage;
  mode?: "pathway" | "fish_of_fortune";
  isStandalone?: boolean;
  onLanguageChange?: (lang: GameLanguage) => void;
  onSwitchMode?: () => void;
  onBackToPortfolio?: () => void;
}

const savedProgress = getSavedProgress();
const MAX_ACTIVE_RUNNERS = 5;

const getTileColorBg = (color: string) => {
  switch (color?.toLowerCase()) {
    case 'blue': return 'bg-blue-600 border-blue-400 text-white';
    case 'yellow': return 'bg-amber-400 border-amber-200 text-slate-950';
    case 'pink':
    case 'magenta':
      return 'bg-pink-500 border-pink-300 text-white';
    case 'cyan': return 'bg-cyan-400 border-cyan-200 text-slate-950';
    case 'green': return 'bg-emerald-500 border-emerald-300 text-slate-950';
    case 'orange': return 'bg-orange-500 border-orange-300 text-slate-950';
    case 'purple': return 'bg-purple-600 border-purple-300 text-white';
    case 'red': return 'bg-rose-500 border-rose-300 text-white';
    case 'white': return 'bg-slate-100 border-slate-300 text-slate-950';
    case 'lime': return 'bg-lime-400 border-lime-200 text-slate-950';
    case 'black': return 'bg-slate-900 border-slate-600 text-white';
    case 'rainbow': return 'bg-gradient-to-tr from-pink-500 via-amber-300 to-cyan-400 border-white text-white shadow-cyan-500/50';
    case 'bomb': return 'bg-gradient-to-tr from-rose-600 to-amber-500 border-amber-300 text-white shadow-rose-500/50';
    default: return 'bg-sky-500 border-sky-300 text-white';
  }
};

export function TileAbsorberGame({
  language = "es",
  mode = "pathway",
  isStandalone = false,
  onLanguageChange,
  onSwitchMode,
  onBackToPortfolio,
}: TileAbsorberGameProps) {
  const isEn = language === "en";
  const isFishOfFortune = mode === "fish_of_fortune";
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipDownloadError, setZipDownloadError] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const gameViewportRef = useRef<HTMLDivElement>(null);
  const pointerHandRef = useRef<HTMLDivElement>(null);
  const [isPointerTracking, setIsPointerTracking] = useState(false);
  const [isPointerPressed, setIsPointerPressed] = useState(false);
  const sceneManagerRef = useRef<GameSceneManager | null>(null);
  const stuckHandledRef = useRef(false);

  const [level, setLevel] = useState<number>(savedProgress.level);
  const [playingLevel, setPlayingLevel] = useState<number>(savedProgress.level);
  const [experience, setExperience] = useState<number>(savedProgress.experience);
  const [experienceAtLevelStart, setExperienceAtLevelStart] = useState<number>(savedProgress.experience);
  const currentLevelConfig = getLevelConfig(playingLevel, isFishOfFortune);
  const totalTilesInLevel = currentLevelConfig.rows * currentLevelConfig.cols;
  const [version, setVersion] = useState<GameVersion>(() =>
    getVisualThemeForLevel(savedProgress.level, isFishOfFortune)
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activeSlotCount, setActiveSlotCount] = useState(0);
  const [showTutorialHand, setShowTutorialHand] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [tilesAbsorbedCount, setTilesAbsorbedCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [lifeState, setLifeState] = useState<LifeState>(() => getInitialLifeState());
  const [now, setNow] = useState(Date.now());
  const [isStuck, setIsStuck] = useState(false);
  const [adsReady, setAdsReady] = useState(false);
  const [adBusy, setAdBusy] = useState(false);
  const [adMessage, setAdMessage] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  const [userProfile, setUserProfile] = useState(() => getStoredUser());
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isGamertagModalOpen, setIsGamertagModalOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isWebAdViewerOpen, setIsWebAdViewerOpen] = useState(false);

  const [comodinesOptions, setComodinesOptions] = useState<ComodinDefinition[]>(() =>
    generateComodinesForLevel(savedProgress.level, getLevelConfig(savedProgress.level).hasEncapsulations)
  );
  const [selectedComodin, setSelectedComodin] = useState<ComodinDefinition | null>(null);
  const [hasUsedComodin, setHasUsedComodin] = useState<boolean>(false);
  const [isComodinesModalOpen, setIsComodinesModalOpen] = useState<boolean>(false);
  const [comodinNotification, setComodinNotification] = useState<{ text: string; subtext: string } | null>(null);
  const [calloutText, setCalloutText] = useState<string | null>(null);
  const lastMilestoneRef = useRef<number>(0);
  const calloutTimerRef = useRef<number | null>(null);
  const titanRunnerBoostRef = useRef<boolean>(false);
  const safetyNetArmedRef = useRef<boolean>(false);

  const triggerCallout = useCallback((text: string) => {
    setCalloutText(text);
    if (calloutTimerRef.current) window.clearTimeout(calloutTimerRef.current);
    calloutTimerRef.current = window.setTimeout(() => {
      setCalloutText(null);
    }, 1150);
  }, []);

  const triggerComodinNotification = (text: string, subtext: string) => {
    setComodinNotification({ text, subtext });
    setTimeout(() => {
      setComodinNotification((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  };

  useEffect(() => {
    const cached = getComodinSessionFromCache(playingLevel);
    if (cached) {
      setHasUsedComodin(cached.hasUsedComodin);
      if (cached.selectedComodinId) {
        const found = comodinesOptions.find((c) => c.id === cached.selectedComodinId);
        if (found) setSelectedComodin(found);
      }
    }
  }, [playingLevel, comodinesOptions]);

  useEffect(() => {
    saveComodinSessionToCache(playingLevel, selectedComodin?.id || null, hasUsedComodin);
  }, [playingLevel, selectedComodin, hasUsedComodin]);

  useEffect(() => {
    soundManager.playMusicForLevel(playingLevel, version);
    return () => {
      soundManager.stopMusic();
    };
  }, [playingLevel, version]);

  const handleActivateComodin = (comodinToUse?: ComodinDefinition) => {
    const comodin = comodinToUse || selectedComodin;
    if (!comodin || hasUsedComodin || !sceneManagerRef.current) return;

    switch (comodin.id) {
      case 'iman_perimetro':
        sceneManagerRef.current.applyMagnetBoost(18, 1.4);
        triggerComodinNotification(
          isEn ? 'PERIMETER MAGNET ACTIVATED!' : '¡IMÁN PERIMETRAL ACTIVADO!',
          isEn ? 'Absorption range increased by +40% for 18 seconds.' : 'Rango de absorción aumentado un +40% durante 18 segundos.'
        );
        break;
      case 'rotacion_tactica': {
        const exposed = sceneManagerRef.current.getExposedColors();
        const levelColors = getColorsForLevel(playingLevel, isFishOfFortune);
        const colors = exposed.length > 0 ? exposed : levelColors;
        setQueueColumns((prev) =>
          prev.map((col, cIdx) => {
            if (!col.length) return col;
            const newFrontColor = colors[cIdx % colors.length];
            const updated = [...col];
            updated[0] = { ...updated[0], color: newFrontColor };
            return updated;
          })
        );
        soundManager.playComodinActivate();
        triggerComodinNotification(
          isEn ? 'TACTICAL ROTATION!' : '¡ROTACIÓN TÁCTICA!',
          isEn
            ? isFishOfFortune
              ? 'Feeders reconfigured with exposed reef colors.'
              : 'Launchers reconfigured with exposed board colors.'
            : isFishOfFortune
            ? 'Lanzadores reconfigurados con colores expuestos en el arrecife.'
            : 'Lanzadores reconfigurados con colores expuestos en el tablero.'
        );
        break;
      }
      case 'corredor_titan':
        titanRunnerBoostRef.current = true;
        soundManager.playComodinActivate();
        triggerComodinNotification(
          isEn
            ? isFishOfFortune ? 'TITAN FISH READY!' : 'TITAN RUNNER READY!'
            : isFishOfFortune ? '¡PEZ TITÁN PREPARADO!' : '¡CORREDOR TITÁN PREPARADO!',
          isEn
            ? isFishOfFortune ? 'The next fish launched will carry +8 capacity.' : 'The next runner launched will carry +8 capacity.'
            : isFishOfFortune ? 'El siguiente pez lanzado tendrá +8 de capacidad.' : 'El siguiente corredor lanzado tendrá +8 de capacidad.'
        );
        break;
      case 'amortiguador_emergencia':
        safetyNetArmedRef.current = true;
        soundManager.playComodinActivate();
        triggerComodinNotification(
          isEn ? 'SAFETY NET ARMED!' : '¡RED DE SALVAMENTO ARMADA!',
          isEn
            ? 'Will auto-eject the idlest runner if the track hits 5/5.'
            : 'Expulsará al corredor más ocioso si la cinta llega a 5/5.'
        );
        break;
      case 'pulso_anticapsula': {
        const popped = sceneManagerRef.current.popRandomEncapsulations(4);
        triggerComodinNotification(
          isEn ? 'SHIELD BURST PULSE!' : '¡PULSO ROMPE-BURBUJAS!',
          popped > 0
            ? isEn
              ? `${popped} shields burst open releasing their tiles!`
              : `¡${popped} cápsulas estallaron liberando sus fichas!`
            : isEn
            ? 'No sealed shields found on this level.'
            : 'No había cápsulas selladas en este nivel.'
        );
        break;
      }
      case 'impulso_conveyor':
        sceneManagerRef.current.applyConveyorSurge(12, 1.8);
        triggerComodinNotification(
          isEn ? 'CONVEYOR OVERDRIVE!' : '¡SOBRECARGA DE CINTA!',
          isEn ? 'Track speed boosted +80% for 12 seconds.' : 'Velocidad de cinta +80% durante 12 segundos.'
        );
        break;
      case 'transmutacion_borde': {
        const activeCols = sceneManagerRef.current.getActiveRunnerColors();
        const fallbackCol = queueColumns.find((c) => c[0])?.[0]?.color || 'blue';
        const targetColor = activeCols.length > 0 ? activeCols[0] : fallbackCol;
        const localizedColor = getLocalizedColorName(targetColor, isFishOfFortune, language);
        const converted = sceneManagerRef.current.convertPerimeterTiles(targetColor, 3);
        triggerComodinNotification(
          isEn ? 'COLOR TRANSMUTATION!' : '¡TRANSMUTACIÓN CROMÁTICA!',
          converted > 0
            ? isEn
              ? `${converted} edge ${isFishOfFortune ? 'pearls' : 'tiles'} converted to ${localizedColor}.`
              : `${converted} ${isFishOfFortune ? 'perlas' : 'fichas'} del borde convertidas a color ${localizedColor}.`
            : isEn
            ? `No ${isFishOfFortune ? 'pearls' : 'tiles'} found to convert.`
            : `No se encontraron ${isFishOfFortune ? 'perlas' : 'fichas'} para convertir.`
        );
        break;
      }
      case 'despeje_estrategico': {
        const ejected = sceneManagerRef.current.ejectMostIdleRunner();
        triggerComodinNotification(
          isEn ? 'TACTICAL PURGE!' : '¡PURGA TÁCTICA!',
          ejected
            ? isEn
              ? 'Idle runner cleared from track with zero life penalty.'
              : 'Corredor ocioso retirado de la cinta sin coste de vida.'
            : isEn
            ? 'No active runners on the track to remove.'
            : 'No había corredores en la cinta para retirar.'
        );
        break;
      }
      case 'corredor_prismatico': {
        const launched = sceneManagerRef.current.launchPrismaticRunner(12);
        triggerComodinNotification(
          isEn
            ? isFishOfFortune ? 'PRISM FISH DEPLOYED!' : 'PRISM RUNNER DEPLOYED!'
            : isFishOfFortune ? '¡PEZ PRISMA DESPLEGADO!' : '¡CORREDOR PRISMA DESPLEGADO!',
          launched
            ? isEn
              ? `Will absorb up to 12 ${isFishOfFortune ? 'pearls' : 'tiles'} of any color on the edge.`
              : `Devorará hasta 12 ${isFishOfFortune ? 'perlas' : 'fichas'} de cualquier color en el borde.`
            : isEn
            ? 'Track is full (5/5). Free a slot first.'
            : 'Cinta llena a 5/5. Libera un slot primero.'
        );
        break;
      }
      case 'colapso_gravitacional': {
        const inverted = sceneManagerRef.current.invertBoardTiles(5);
        triggerComodinNotification(
          isEn ? 'GRAVITY COLLAPSE!' : '¡COLAPSO GRAVITACIONAL!',
          inverted > 0
            ? isEn
              ? `${inverted} core ${isFishOfFortune ? 'pearls' : 'tiles'} pushed to the outer perimeter.`
              : `${inverted} ${isFishOfFortune ? 'perlas' : 'fichas'} del núcleo empujadas a los bordes exteriores.`
            : isEn
            ? 'Board is already clear.'
            : 'Tablero ya despejado.'
        );
        break;
      }
      case 'paradoja_temporal':
        sceneManagerRef.current.applyChronoStasis(20);
        triggerComodinNotification(
          isEn ? 'CHRONO STASIS!' : '¡ESTASIS TEMPORAL!',
          isEn
            ? 'Jam timer frozen for 20s and magnet range boosted.'
            : 'Tiempo de atasco congelado por 20s y magnetismo potenciado.'
        );
        break;
    }

    setHasUsedComodin(true);
  };

  const addExperience = useCallback((amount: number) => setExperience((prev) => prev + amount), []);

  const createQueueForLevel = useCallback((lvl: number, exposedHint?: TileColor[]): QueueRunner[][] => {
    const config = getLevelConfig(lvl, isFishOfFortune);
    const levelColors = getColorsForLevel(lvl, isFishOfFortune);
    const exposed = (exposedHint && exposedHint.length > 0)
      ? exposedHint
      : (sceneManagerRef.current?.getExposedColors() || []);

    const validExposed = exposed.filter((c) => levelColors.includes(c));
    const activePool = validExposed.length > 0 ? validExposed : levelColors;

    return [0, 1, 2, 3].map((colIdx) => {
      const frontColor = activePool[colIdx % activePool.length];
      const colItems: QueueRunner[] = [
        {
          id: `queue_${lvl}_${colIdx}_active_${Date.now()}_${Math.random()}`,
          color: frontColor,
          capacity: config.runnerCapacity,
        },
      ];

      for (let r = 0; r < 5; r++) {
        const poolColor = levelColors[(colIdx + r + 1) % levelColors.length];
        colItems.push({
          id: `queue_${lvl}_${colIdx}_${r}_${Date.now()}_${Math.random()}`,
          color: poolColor,
          capacity: config.runnerCapacity,
        });
      }

      return colItems;
    });
  }, [isFishOfFortune]);

  const [queueColumns, setQueueColumns] = useState<QueueRunner[][]>(() => createQueueForLevel(savedProgress.level));

  useEffect(() => {
    const interval = window.setInterval(() => {
      const timestamp = Date.now();
      setNow(timestamp);
      setLifeState((prev) => reconcileLifeState(prev, timestamp));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LIFE_STORAGE_KEY, JSON.stringify(lifeState));
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [lifeState]);
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ level, experience }));
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [level, experience]);
  useEffect(() => {
    void initializeRewardedAds().then(setAdsReady);
  }, []);

  useEffect(() => {
    if (sceneManagerRef.current) sceneManagerRef.current.paused = showMap || isStuck;
  }, [showMap, isStuck]);

  useEffect(() => {
    const nextTheme = getVisualThemeForLevel(playingLevel, isFishOfFortune);
    setVersion(nextTheme);
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setMode(nextTheme, "v3", playingLevel);
      setQueueColumns(createQueueForLevel(playingLevel, sceneManagerRef.current.getExposedColors()));
    }
  }, [mode, isFishOfFortune]);

  useEffect(() => {
    if (!mountRef.current) return;
    const manager = new GameSceneManager(
      mountRef.current,
      {
        onTileAbsorbed: () => {
          setTilesAbsorbedCount((prev) => prev + 1);
          addExperience(15);
        },
        onEncapsulationPopped: () => addExperience(15),
        onRunnerCleared: () => {},
        onWinState: (_clearedLevel?: number) => {
          setTimeout(() => {
            setHasWon(true);
            setElapsedTime(Math.round((Date.now() - startTime) / 1000));
            addExperience(100);

            const nextFrontier = playingLevel + 1;
            setLevel((curr) => {
              const updated = Math.max(curr, nextFrontier);
              try {
                localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
                  level: updated,
                  experience: experience + 100,
                }));
              } catch (err) {
                console.warn('Auto-save progress failed:', err);
              }
              return updated;
            });

            void submitGameScore({
              gamertag: userProfile.gamertag,
              score: experience + 100,
              wave: playingLevel,
              tilesAbsorbed: tilesAbsorbedCount,
            });
          }, 650);
        },
        onSlotCountChange: setActiveSlotCount,
      },
      version,
      "v3",
      playingLevel
    );
    sceneManagerRef.current = manager;
    // Sincroniza inmediatamente las tarjetas del selector con las perlas expuestas en el mapa 3D
    setQueueColumns(createQueueForLevel(playingLevel, manager.getExposedColors()));
    const handleResize = () => manager.handleResize();
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      window.setTimeout(() => manager.handleResize(), 60);
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      const target = gameViewportRef.current || document.documentElement;
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const handleDownloadFullscreenZip = useCallback(async () => {
    if (isDownloadingZip) return;
    setIsDownloadingZip(true);
    setZipDownloadError(null);
    try {
      const response = await fetch("./downloads/Fish_Feeder_Fullscreen.zip", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      const header = new Uint8Array(buffer.slice(0, 4));
      if (header[0] !== 0x50 || header[1] !== 0x4b) {
        throw new Error("Invalid ZIP signature");
      }
      const blob = new Blob([buffer], { type: "application/zip" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Fish_Feeder_Fullscreen.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      setZipDownloadError(
        isEn
          ? "Could not download the ZIP from this preview frame."
          : "No se pudo descargar el ZIP desde este marco de vista previa."
      );
    } finally {
      setIsDownloadingZip(false);
    }
  }, [isDownloadingZip, isEn]);

  useEffect(() => {
    if (!isFishOfFortune || hasWon || totalTilesInLevel <= 0) return;
    const pct = Math.round((tilesAbsorbedCount / totalTilesInLevel) * 100);
    const list = GAME_TEXT[language].callouts;
    if (pct >= 90 && lastMilestoneRef.current < 90) {
      lastMilestoneRef.current = 90;
      triggerCallout(list[4]);
    } else if (pct >= 72 && lastMilestoneRef.current < 72) {
      lastMilestoneRef.current = 72;
      triggerCallout(list[3]);
    } else if (pct >= 50 && lastMilestoneRef.current < 50) {
      lastMilestoneRef.current = 50;
      triggerCallout(list[2]);
    } else if (pct >= 28 && lastMilestoneRef.current < 28) {
      lastMilestoneRef.current = 28;
      triggerCallout(list[1]);
    } else if (tilesAbsorbedCount >= 6 && lastMilestoneRef.current < 10) {
      lastMilestoneRef.current = 10;
      triggerCallout(list[0]);
    }
  }, [tilesAbsorbedCount, totalTilesInLevel, isFishOfFortune, hasWon, language, triggerCallout]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (sceneManagerRef.current) sceneManagerRef.current.speedMultiplier = newSpeed;
  };
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
  };

  const handleLaunchRunner = (colIdx: number) => {
    const col = queueColumns[colIdx];
    if (!col?.length || !sceneManagerRef.current || isStuck || showMap) return;

    const activeRunner = col[0];
    const capacityBoost = titanRunnerBoostRef.current ? 8 : 0;
    if (titanRunnerBoostRef.current) {
      titanRunnerBoostRef.current = false;
    }
    const finalCapacity = activeRunner.capacity + capacityBoost;

    if (sceneManagerRef.current.launchRunner(activeRunner.color, finalCapacity, colIdx)) {
      setShowTutorialHand(false);
      setQueueColumns((prev) =>
        prev.map((items, i) => {
          if (i !== colIdx) return items;
          const updated = [...items];
          updated.shift();

          const exposedColors = sceneManagerRef.current?.getExposedColors() || [];
          const remainingColors = sceneManagerRef.current?.getRemainingColors() || [];
          const levelColors = getColorsForLevel(playingLevel, isFishOfFortune);

          let pool = exposedColors.length > 0 ? exposedColors : remainingColors;
          if (!pool || pool.length === 0) {
            pool = levelColors;
          }

          const chosenColor = pool[Math.floor(Math.random() * pool.length)];

          updated.push({
            id: `queue_replenish_${Date.now()}_${Math.random()}`,
            color: chosenColor,
            capacity: getLevelConfig(playingLevel, isFishOfFortune).runnerCapacity,
          });
          return updated;
        })
      );
    }
  };

  const restartCurrentLevel = () => {
    stuckHandledRef.current = false;
    lastMilestoneRef.current = 0;
    setCalloutText(null);
    setIsStuck(false);
    setHasWon(false);
    setHasUsedComodin(false);
    titanRunnerBoostRef.current = false;
    safetyNetArmedRef.current = false;
    setExperience(experienceAtLevelStart);
    setTilesAbsorbedCount(0);
    setStartTime(Date.now());
    if (sceneManagerRef.current) {
      sceneManagerRef.current.paused = false;
      sceneManagerRef.current.resetLevel(playingLevel);
      setQueueColumns(createQueueForLevel(playingLevel, sceneManagerRef.current.getExposedColors()));
    } else {
      setQueueColumns(createQueueForLevel(playingLevel));
    }
  };
  const handleReset = () => {
    if (lifeState.lives < 1) return;
    restartCurrentLevel();
  };

  const startLevel = (selected: number) => {
    if (selected > level || selected < 1 || lifeState.lives < 1) return;
    const theme = getVisualThemeForLevel(selected, isFishOfFortune);
    stuckHandledRef.current = false;
    setPlayingLevel(selected);
    setVersion(theme);
    setHasWon(false);
    setIsStuck(false);
    setShowMap(false);
    setHasUsedComodin(false);
    setSelectedComodin(null);
    titanRunnerBoostRef.current = false;
    safetyNetArmedRef.current = false;
    setComodinesOptions(generateComodinesForLevel(selected, getLevelConfig(selected, isFishOfFortune).hasEncapsulations));
    setTilesAbsorbedCount(0);
    setStartTime(Date.now());
    setExperienceAtLevelStart(experience);
    if (sceneManagerRef.current) {
      sceneManagerRef.current.paused = false;
      sceneManagerRef.current.setMode(theme, "v3", selected);
      setQueueColumns(createQueueForLevel(selected, sceneManagerRef.current.getExposedColors()));
    } else {
      setQueueColumns(createQueueForLevel(selected));
    }
  };

  const handleBackToPath = () => {
    if (playingLevel >= level) {
      const nextFrontier = playingLevel + 1;
      setLevel(nextFrontier);
      setPlayingLevel(nextFrontier);
      const nextTheme = getVisualThemeForLevel(nextFrontier, isFishOfFortune);
      setVersion(nextTheme);
      setComodinesOptions(generateComodinesForLevel(nextFrontier, getLevelConfig(nextFrontier, isFishOfFortune).hasEncapsulations));
      setSelectedComodin(null);
      setHasUsedComodin(false);
      titanRunnerBoostRef.current = false;
      safetyNetArmedRef.current = false;
      if (sceneManagerRef.current) {
        sceneManagerRef.current.setMode(nextTheme, "v3", nextFrontier);
        setQueueColumns(createQueueForLevel(nextFrontier, sceneManagerRef.current.getExposedColors()));
      } else {
        setQueueColumns(createQueueForLevel(nextFrontier));
      }
    }
    setExperienceAtLevelStart(experience);
    setHasWon(false);
    setShowMap(true);
  };

  const requestPathExit = () => {
    if (!showMap && !hasWon && !isStuck) setIsExitConfirmOpen(true);
    else setShowMap(true);
  };

  const abandonRunForPath = () => {
    setExperience(experienceAtLevelStart);
    setTilesAbsorbedCount(0);
    setStartTime(Date.now());
    setShowTutorialHand(true);
    setHasWon(false);
    setIsStuck(false);
    setHasUsedComodin(false);
    titanRunnerBoostRef.current = false;
    safetyNetArmedRef.current = false;
    setIsExitConfirmOpen(false);
    setShowMap(true);
    stuckHandledRef.current = false;
  };

  const handleNextLevel = () => {
    const nextPlayableLevel = playingLevel + 1;
    const nextFrontier = playingLevel >= level ? playingLevel + 1 : level;
    const nextTheme = getVisualThemeForLevel(nextPlayableLevel, isFishOfFortune);
    setLevel(nextFrontier);
    setPlayingLevel(nextPlayableLevel);
    setVersion(nextTheme);
    setHasUsedComodin(false);
    setSelectedComodin(null);
    titanRunnerBoostRef.current = false;
    safetyNetArmedRef.current = false;
    setComodinesOptions(generateComodinesForLevel(nextPlayableLevel, getLevelConfig(nextPlayableLevel, isFishOfFortune).hasEncapsulations));
    setExperienceAtLevelStart(experience);
    setTilesAbsorbedCount(0);
    setStartTime(Date.now());
    setShowTutorialHand(true);
    setHasWon(false);
    setShowMap(false);
    stuckHandledRef.current = false;
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setMode(nextTheme, "v3", nextPlayableLevel);
      sceneManagerRef.current.paused = false;
      setQueueColumns(createQueueForLevel(nextPlayableLevel, sceneManagerRef.current.getExposedColors()));
    } else {
      setQueueColumns(createQueueForLevel(nextPlayableLevel));
    }
  };

  const handleJumpToFrontier = () => {
    startLevel(level);
  };

  const handleStuck = useCallback(() => {
    if (stuckHandledRef.current || hasWon || showMap) return;
    stuckHandledRef.current = true;
    setLifeState((prev) => loseLife(prev, Date.now()));
    setIsStuck(true);
    setAdMessage("");
    if (sceneManagerRef.current) sceneManagerRef.current.paused = true;
  }, [hasWon, showMap]);

  useEffect(() => {
    if (hasWon || isStuck || showMap || !sceneManagerRef.current) return;
    if (sceneManagerRef.current.chronoStasisTimer > 0) return;

    const exposed = sceneManagerRef.current.getExposedColors();
    const inFlight = sceneManagerRef.current.getFlyingTilesCount();
    if (inFlight > 0) return;

    if (activeSlotCount >= MAX_ACTIVE_RUNNERS) {
      const activeColors = sceneManagerRef.current.getActiveRunnerColors();
      const hasMatchingRunner = activeColors.some((color) => exposed.includes(color));
      if (!hasMatchingRunner && exposed.length > 0) {
        if (safetyNetArmedRef.current) {
          safetyNetArmedRef.current = false;
          sceneManagerRef.current.ejectMostIdleRunner();
          triggerComodinNotification(
            isEn ? "SAFETY NET TRIGGERED!" : "¡RED DE SALVAMENTO ACTIVADA!",
            isEn ? "Runner automatically cleared from track." : "Corredor retirado automáticamente de la cinta."
          );
          return;
        }
        const timeout = window.setTimeout(handleStuck, 1500);
        return () => window.clearTimeout(timeout);
      }
    }

    if (activeSlotCount === 0 && exposed.length > 0) {
      const canLaunchValidRunner = queueColumns.some((col) => {
        const frontCard = col[0];
        return frontCard && exposed.includes(frontCard.color);
      });
      if (!canLaunchValidRunner) {
        const timeout = window.setTimeout(handleStuck, 1200);
        return () => window.clearTimeout(timeout);
      }
    }

    return undefined;
  }, [activeSlotCount, tilesAbsorbedCount, queueColumns, hasWon, isStuck, showMap, handleStuck]);

  useEffect(() => {
    if (activeSlotCount < MAX_ACTIVE_RUNNERS || hasWon || isStuck || showMap || !sceneManagerRef.current) return;
    if (sceneManagerRef.current.chronoStasisTimer > 0) return;
    const timeout = window.setTimeout(handleStuck, 8000);
    return () => window.clearTimeout(timeout);
  }, [tilesAbsorbedCount, activeSlotCount, hasWon, isStuck, showMap, handleStuck]);

  const adsPerLife = playingLevel <= 30 ? 1 : 2;
  const handleWatchAd = async () => {
    if (adBusy || lifeState.lives >= MAX_LIVES) return;
    if (hasNativeRewardedAds() && adsReady) {
      setAdBusy(true);
      setAdMessage("");
      try {
        const earned = await showRewardedLifeAd();
        if (!earned) {
          setAdMessage(isEn ? "The ad was not completed, so no life was granted." : "El anuncio no se completó, por lo que no se otorgó la vida.");
          return;
        }
        setLifeState((prev) => grantAdLife(prev, Date.now(), adsPerLife).state);
        setAdMessage(isEn ? "Life unlocked successfully!" : "¡Vida desbloqueada con éxito!");
      } catch {
        setAdMessage(isEn ? "Could not load the ad. Please try again later." : "No se pudo cargar el anuncio. Intenta de nuevo más tarde.");
      } finally {
        setAdBusy(false);
      }
    } else {
      setIsWebAdViewerOpen(true);
    }
  };

  const handleWebAdRewardEarned = () => {
    setLifeState((prev) => grantAdLife(prev, Date.now(), 1).state);
    setAdMessage(isEn ? "Life unlocked successfully!" : "¡Vida otorgada exitosamente!");
    setIsStuck(false);
    if (sceneManagerRef.current) sceneManagerRef.current.paused = false;
  };

  const retryAfterLife = () => {
    if (lifeState.lives > 0) restartCurrentLevel();
  };

  const handleStuckBackToPath = () => {
    setIsStuck(false);
    stuckHandledRef.current = false;
    setHasWon(false);
    if (sceneManagerRef.current) sceneManagerRef.current.paused = true;
    setShowMap(true);
  };

  return (
    <div className={isStandalone ? "fixed inset-0 w-screen h-dvh overflow-hidden bg-[#119ad6]" : "flex flex-col gap-3"}>
      {!isStandalone && (
        <div className="flex items-center justify-between px-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onBackToPortfolio && (
              <button
                type="button"
                onClick={onBackToPortfolio}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? "Back to Portfolio" : "Regresar al Portafolio"}</span>
              </button>
            )}

            {onSwitchMode && (
              <button
                type="button"
                onClick={onSwitchMode}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105 border cursor-pointer ${
                  isFishOfFortune
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40"
                    : "bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-cyan-500/30"
                }`}
              >
                {isFishOfFortune ? (
                  <>
                    <Gamepad2 className="w-3.5 h-3.5 text-cyan-200" />
                    <span>{isEn ? "Switch to Conveyor Realms" : "Cambiar a Conveyor Realms"}</span>
                  </>
                ) : (
                  <>
                    <Fish className="w-3.5 h-3.5 text-teal-300" />
                    <span>{isEn ? "Switch to 🐟 Fish Feeder" : "Cambiar a 🐟 Fish Feeder"}</span>
                  </>
                )}
              </button>
            )}

            {isFishOfFortune && (
              <>
                <button
                  type="button"
                  onClick={() => setIsGameMenuOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/30 font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>{isEn ? "Fish Menu" : "Menú Pez"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadFullscreenZip}
                  disabled={isDownloadingZip}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 border border-amber-300 font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isDownloadingZip
                      ? isEn ? "Preparing .zip..." : "Preparando .zip..."
                      : isEn ? "Download Fullscreen .zip" : "Descargar Fullscreen .zip"}
                  </span>
                </button>
                {zipDownloadError && (
                  <span className="text-[11px] font-semibold text-rose-400">{zipDownloadError}</span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 ml-auto flex-wrap">
            <div
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-cyan-300 text-[11px]"
              title={getMusicTrackForLevel(playingLevel, version).artist}
            >
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">{getMusicTrackForLevel(playingLevel, version).title}</span>
              <span className="text-[10px] text-slate-400">({getMusicTrackForLevel(playingLevel, version).bpm} BPM)</span>
              <span className="text-[10px] text-amber-300/90 font-semibold">· Audio: +1 (809) 716-1036 Rafael E. Espada</span>
            </div>

            {isFishOfFortune ? (
              <div className="flex items-center gap-1.5">
                <Fish className="w-4 h-4 text-teal-400" />
                <span className="text-teal-300 font-bold">
                  {isEn ? "Fish Feeder · Playable Ad" : "Fish Feeder · Anuncio Jugable"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>{isEn ? "Conveyor Realms 3D · Three.js Edition" : "Conveyor Realms 3D · Edición Three.js"}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        ref={gameViewportRef}
        onPointerMove={(e) => {
          if (!isFishOfFortune || e.pointerType === 'touch') return;
          const rect = gameViewportRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if (pointerHandRef.current) {
            pointerHandRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          }
          if (!isPointerTracking) setIsPointerTracking(true);
        }}
        onPointerLeave={() => {
          setIsPointerTracking(false);
          setIsPointerPressed(false);
        }}
        onPointerDown={(e) => {
          if (isFishOfFortune && e.pointerType !== 'touch') {
            setIsPointerPressed(true);
          }
        }}
        onPointerUp={() => setIsPointerPressed(false)}
        className={`relative w-full overflow-hidden select-none ${
          isStandalone
            ? "h-full rounded-none border-0 bg-[#119ad6]"
            : "h-[78vh] min-h-[600px] max-h-[880px] rounded-2xl shadow-2xl border border-slate-800 bg-slate-950"
        } ${
          isFishOfFortune && isPointerTracking && !hasWon && !isStuck && !showMap && !isGameMenuOpen && !isComodinesModalOpen && !isExitConfirmOpen
            ? 'cursor-none [&_*]:cursor-none'
            : ''
        }`}
      >
        {isFishOfFortune ? (
          /* Playable-Ad Minimalist Top HUD (Audio/Menu left + Coins/Gems right) */
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={handleToggleSound}
                aria-label={soundEnabled ? GAME_TEXT[language].mute : GAME_TEXT[language].unmute}
                className="w-10 h-10 rounded-full bg-white text-sky-700 border-2 border-sky-200 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </button>
              <button
                type="button"
                onClick={() => setIsGameMenuOpen(true)}
                aria-label={GAME_TEXT[language].gameMenu}
                className="w-10 h-10 rounded-full bg-white text-sky-700 border-2 border-sky-200 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              {isStandalone && (
                <>
                  <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    aria-label={isFullscreen ? (isEn ? "Exit fullscreen" : "Salir de pantalla completa") : (isEn ? "Fullscreen" : "Pantalla completa")}
                    className="w-10 h-10 rounded-full bg-white text-sky-700 border-2 border-sky-200 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  {onLanguageChange && (
                    <button
                      type="button"
                      onClick={() => onLanguageChange(isEn ? 'es' : 'en')}
                      aria-label={isEn ? "Cambiar a español" : "Switch to English"}
                      className="h-10 px-3 rounded-full bg-white text-sky-800 border-2 border-sky-200 shadow-lg text-xs font-black tracking-wide hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    >
                      {isEn ? 'ES' : 'EN'}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border-2 border-amber-300 shadow-lg">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-black text-amber-200 tabular-nums">
                  {Math.min(1000000, Math.round((tilesAbsorbedCount / Math.max(1, totalTilesInLevel)) * 1000000)).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border-2 border-cyan-300 shadow-lg">
                <Gem className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs sm:text-sm font-black text-cyan-100 tabular-nums">
                  {(tilesAbsorbedCount * 5).toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <HeaderBar
            version={version}
            language={language}
            lives={lifeState.lives}
            maxLives={MAX_LIVES}
            soundEnabled={soundEnabled}
            speed={speed}
            level={playingLevel}
            frontierLevel={level}
            experience={experience}
            tilesAbsorbed={tilesAbsorbedCount}
            totalTiles={totalTilesInLevel}
            gamertag={userProfile.gamertag}
            isSupabaseOnline={getSupabaseConfig().isConfigured}
            onToggleSound={handleToggleSound}
            onSpeedChange={handleSpeedChange}
            onReset={handleReset}
            onOpenDocs={() => setIsDocsOpen(true)}
            onOpenMap={requestPathExit}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenGamertag={() => setIsGamertagModalOpen(true)}
            selectedComodin={selectedComodin}
            hasUsedComodin={hasUsedComodin}
            onOpenComodines={() => setIsComodinesModalOpen(true)}
            onActivateComodin={() => handleActivateComodin()}
          />
        )}

        {comodinNotification && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-amber-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-white tracking-wide">{comodinNotification.text}</span>
              <span className="text-[11px] text-amber-300 font-medium">{comodinNotification.subtext}</span>
            </div>
          </div>
        )}

        {/* Fish Feeder Captain Pirate Onboarding Card */}
        {isFishOfFortune && showTutorialHand && !hasWon && !isStuck && !showMap && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md pointer-events-none animate-in fade-in duration-300">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border-3 border-amber-400 shadow-[0_12px_28px_rgba(8,145,178,0.4)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-200 to-amber-500 border-2 border-amber-700 flex items-center justify-center shrink-0 shadow-inner">
                <svg viewBox="0 0 64 64" className="w-10 h-10" aria-hidden="true">
                  <path d="M12 24 C16 10 48 10 52 24 Z" fill="#1e293b" />
                  <path d="M8 24 L56 24 L50 28 L14 28 Z" fill="#f59e0b" />
                  <circle cx="32" cy="18" r="3.5" fill="#ffffff" />
                  <circle cx="32" cy="36" r="12" fill="#fed7aa" />
                  <path d="M22 40 C26 52 38 52 42 40 Z" fill="#9a3412" />
                  <circle cx="28" cy="34" r="2.2" fill="#0f172a" />
                  <rect x="34" y="31.5" width="6" height="5" rx="2" fill="#0f172a" />
                  <line x1="25" y1="32" x2="42" y2="33" stroke="#0f172a" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                  {GAME_TEXT[language].captainSpeaker}
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                  {GAME_TEXT[language].captainPrompt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Centered Playable-Ad Praise Callout ("Nice!", "Great!", "Awesome!", etc.) */}
        {isFishOfFortune && calloutText && !hasWon && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-in zoom-in-75 fade-in duration-200">
            <div className="px-6 py-2 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 border-3 border-white shadow-[0_10px_28px_rgba(245,158,11,0.55)]">
              <span className="text-xl sm:text-3xl font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] uppercase">
                {calloutText}
              </span>
            </div>
          </div>
        )}

        <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full cursor-grab active:cursor-grabbing" />

        {!showMap && isFishOfFortune && (
          <BottomQueue
            version={version}
            activeRunnersCount={activeSlotCount}
            maxCapacity={MAX_ACTIVE_RUNNERS}
            queueColumns={queueColumns}
            onLaunch={handleLaunchRunner}
            showTutorialHand={showTutorialHand && !isPointerTracking}
            exposedColors={sceneManagerRef.current?.getExposedColors()}
            language={language}
          />
        )}

        {/* Mouse-following Playable-Ad Hand Cursor */}
        {isFishOfFortune && (
          <div
            ref={pointerHandRef}
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 z-50 will-change-transform transition-opacity duration-100 ${
              isPointerTracking && !hasWon && !isStuck && !showMap && !isGameMenuOpen && !isComodinesModalOpen && !isExitConfirmOpen
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            <div
              className={`relative -translate-x-[28%] -translate-y-[8%] transition-transform duration-100 ease-out ${
                isPointerPressed ? 'scale-90 -rotate-12' : 'scale-100 rotate-0'
              }`}
            >
              {isPointerPressed && (
                <span className="absolute top-0 left-2 w-7 h-7 rounded-full border-2 border-amber-300 bg-amber-200/35 animate-ping pointer-events-none" />
              )}
              <svg
                viewBox="0 0 64 64"
                className="w-11 h-11 drop-shadow-[0_6px_10px_rgba(15,23,42,0.45)]"
              >
                <path
                  d="M24 7 C27.5 7 30 9.8 30 13.5 L30 25 C31.5 23.5 34.5 23.2 36.8 24.8 C38.5 23.5 41.5 23.6 43.8 25.4 C46.2 24.6 49.5 26 50.2 29.5 L51 37 C51.5 46.5 44.5 55 34.5 55 L29 55 C22 55 16.5 50 14 43 L9.5 33.5 C8 30.2 9.5 26.8 12.6 25.8 C15 25 17.5 26.2 18.8 28.6 L19 13.5 C19 9.8 20.8 7 24 7 Z"
                  fill="#ffffff"
                  stroke="#0f172a"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <path d="M24 12 L24 27" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M36 28 L36 37" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M43 29 L43 38" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        )}

        {/* Conveyor Realms Right-Side Matrix (preserved for Conveyor Realms mode) */}
        {!showMap && !isFishOfFortune && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none">
            <div className="flex flex-col items-center mb-2">
              <span className="text-[11px] font-black text-white drop-shadow-md tracking-wider mb-1 tabular-nums">
                {activeSlotCount}/5
              </span>
              <div className="flex flex-col gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-9 h-6 rounded-lg transition-all border ${
                      i < activeSlotCount
                        ? 'bg-cyan-500 border-cyan-300 shadow-sm shadow-cyan-500/50'
                        : 'bg-slate-900/60 border-slate-700/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 p-2 rounded-2xl border border-white/30 shadow-2xl flex gap-2">
              {queueColumns.slice(0, 2).map((col, colIdx) => {
                const activeCard = col[0];

                return (
                  <div key={colIdx} className="flex flex-col gap-1.5 items-center">
                    {col.slice(1, 5).reverse().map((item, idx) => {
                      const colorClasses = getTileColorBg(item.color);

                      return (
                        <div
                          key={item.id || idx}
                          className={`w-10 h-10 rounded-xl ${colorClasses} border opacity-80 flex flex-col items-center justify-center shadow-inner pointer-events-none transition-all`}
                        >
                          <span className="text-[11px] font-black leading-none tabular-nums">
                            {item.capacity}
                          </span>
                        </div>
                      );
                    })}

                    {activeCard && (
                      <button
                        type="button"
                        onClick={() => handleLaunchRunner(colIdx)}
                        className={`w-11 h-12 rounded-xl ${getTileColorBg(activeCard.color)} border-2 border-slate-950 flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all transform hover:scale-105 ring-2 ring-white/90 cursor-pointer mt-1`}
                      >
                        <span className="text-xs font-black leading-none tabular-nums">
                          {activeCard.capacity}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasWon && (
          <WinModal
            version={version}
            language={language}
            level={playingLevel}
            frontierLevel={level}
            timeElapsed={elapsedTime}
            totalTiles={tilesAbsorbedCount}
            xpEarned={experience - experienceAtLevelStart}
            onBackToPath={handleBackToPath}
            onNextLevel={handleNextLevel}
            onJumpToFrontier={playingLevel < level ? handleJumpToFrontier : undefined}
            onRestart={handleReset}
          />
        )}

        {isStuck && (
          <LifeModal
            version={version}
            language={language}
            level={playingLevel}
            lives={lifeState.lives}
            maxLives={MAX_LIVES}
            nextLifeAt={lifeState.nextLifeAt}
            adProgress={lifeState.adProgress}
            adsPerLife={adsPerLife}
            adsReady={adsReady && !adBusy}
            now={now}
            adMessage={adMessage}
            onRetry={retryAfterLife}
            onWatchAd={handleWatchAd}
            onBackToPath={handleStuckBackToPath}
          />
        )}

        {isExitConfirmOpen && (
          <ExitLevelModal
            language={language}
            level={playingLevel}
            onStay={() => setIsExitConfirmOpen(false)}
            onExit={abandonRunForPath}
          />
        )}

        {showMap && (
          <LevelMap
            language={language}
            mode={mode}
            frontierLevel={level}
            selectedLevel={playingLevel}
            experience={experience}
            onSelectLevel={startLevel}
            onClose={() => setShowMap(false)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenGamertag={() => setIsGamertagModalOpen(true)}
          />
        )}

        <ComodinesModal
          language={language}
          isOpen={isComodinesModalOpen}
          onClose={() => setIsComodinesModalOpen(false)}
          options={comodinesOptions}
          selectedComodin={selectedComodin}
          hasUsedComodin={hasUsedComodin}
          level={playingLevel}
          onSelectAndActivate={(comodin, activateImmediately) => {
            setSelectedComodin(comodin);
            soundManager.playComodinSelect();
            if (activateImmediately) {
              handleActivateComodin(comodin);
            }
          }}
        />

        <DocModal language={language} isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

        {isLeaderboardOpen && (
          <LeaderboardModal
            language={language}
            onClose={() => setIsLeaderboardOpen(false)}
            onOpenGamertag={() => {
              setIsLeaderboardOpen(false);
              setIsGamertagModalOpen(true);
            }}
          />
        )}

        {isGamertagModalOpen && (
          <GamertagModal
            language={language}
            onClose={() => setIsGamertagModalOpen(false)}
            onSave={(tag) => setUserProfile((prev) => ({ ...prev, gamertag: tag }))}
          />
        )}

        {isWebAdViewerOpen && (
          <WebAdViewerModal
            version={isFishOfFortune ? 'fof' : 'chess'}
            language={language}
            onRewardEarned={handleWebAdRewardEarned}
            onClose={() => setIsWebAdViewerOpen(false)}
          />
        )}

        {isFishOfFortune && isGameMenuOpen && (
          <GameMenuModal
            language={language}
            level={playingLevel}
            frontierLevel={level}
            onResume={() => setIsGameMenuOpen(false)}
            onOpenPathway={() => {
              setIsGameMenuOpen(false);
              requestPathExit();
            }}
            onOpenPowerUps={() => {
              setIsGameMenuOpen(false);
              setIsComodinesModalOpen(true);
            }}
            onRestart={() => {
              setIsGameMenuOpen(false);
              handleReset();
            }}
            onBackToPortfolio={onBackToPortfolio}
          />
        )}
      </div>
    </div>
  );
}

export default TileAbsorberGame;