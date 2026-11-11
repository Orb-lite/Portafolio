import React, { useEffect, useRef, useState, useCallback } from "react";
import { ALL_COLORS, GameVersion, TileColor } from "../../game/types";
import { getLevelConfig, getVisualThemeForLevel, getColorsForLevel } from "../../game/experience";
import { GameSceneManager } from "../../game/threeScene";
import { HeaderBar } from "./HeaderBar";
import { QueueRunner } from "./BottomQueue";
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
import { WebAdViewerModal } from "./WebAdViewerModal";
import { ComodinesModal } from "./ComodinesModal";
import { GameMenuModal } from "./GameMenuModal";
import { generateComodinesForLevel, ComodinDefinition } from "../../game/comodines";
import { saveComodinSessionToCache, getComodinSessionFromCache } from "../../services/sessionCache";
import { ArrowLeft, Gamepad2, Zap, Fish, Menu, Music } from "lucide-react";
import { GameLanguage } from "../../game/localization";

interface TileAbsorberGameProps {
  language?: GameLanguage;
  mode?: "pathway" | "fish_of_fortune";
  onSwitchMode?: () => void;
  onBackToPortfolio?: () => void;
}

const savedProgress = getSavedProgress();
const MAX_ACTIVE_RUNNERS = 5;

// Mapeador universal de colores para sincronizar la UI lateral con las perlas y peces del mapa 3D
const getTileColorBg = (color: string) => {
  switch (color?.toLowerCase()) {
    case 'blue': return 'bg-blue-600 border-2 border-blue-300 text-white font-black';
    case 'yellow': return 'bg-yellow-400 border-2 border-yellow-100 text-slate-950 font-black';
    case 'pink': return 'bg-pink-500 border-2 border-pink-200 text-white font-black';
    case 'magenta': return 'bg-fuchsia-600 border-2 border-fuchsia-300 text-white font-black';
    case 'cyan': return 'bg-cyan-400 border-2 border-cyan-100 text-slate-950 font-black';
    case 'green': return 'bg-emerald-600 border-2 border-emerald-300 text-white font-black';
    case 'orange': return 'bg-orange-500 border-2 border-orange-200 text-white font-black';
    case 'purple': return 'bg-purple-600 border-2 border-purple-300 text-white font-black';
    case 'red': return 'bg-rose-600 border-2 border-rose-300 text-white font-black';
    case 'white': return 'bg-slate-100 border-2 border-white text-slate-950 font-black';
    case 'lime': return 'bg-lime-400 border-2 border-lime-100 text-slate-950 font-black';
    case 'black': return 'bg-slate-950 border-2 border-slate-600 text-white font-black';
    case 'rainbow': return 'bg-gradient-to-tr from-pink-500 via-amber-300 to-cyan-400 border-2 border-white text-white shadow-cyan-500/50 font-black';
    case 'bomb': return 'bg-gradient-to-tr from-rose-600 to-amber-500 border-2 border-amber-300 text-white animate-pulse shadow-rose-500/50 font-black';
    default: return 'bg-sky-500 border-2 border-sky-300 text-white font-black';
  }
};

export function TileAbsorberGame({
  language = "es",
  mode = "pathway",
  onSwitchMode,
  onBackToPortfolio,
}: TileAbsorberGameProps) {
  const isEn = language === "en";
  const isFishOfFortune = mode === "fish_of_fortune";
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<GameSceneManager | null>(null);
  const stuckHandledRef = useRef(false);

  // Versión Día / Noche
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>(() => {
    return (localStorage.getItem('fish_feeder_time_of_day') as 'day' | 'night') || 'day';
  });

  const handleToggleTimeOfDay = useCallback(() => {
    setTimeOfDay((prev) => {
      const next = prev === 'day' ? 'night' : 'day';
      localStorage.setItem('fish_feeder_time_of_day', next);
      sceneManagerRef.current?.setTimeOfDay(next);
      return next;
    });
  }, []);

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

  const [exposedColors, setExposedColors] = useState<TileColor[]>([]);

  const [userProfile, setUserProfile] = useState(() => getStoredUser());
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isGamertagModalOpen, setIsGamertagModalOpen] = useState(false);
  const [isWebAdViewerOpen, setIsWebAdViewerOpen] = useState(false);

  const [comodinesOptions, setComodinesOptions] = useState<ComodinDefinition[]>(() =>
    generateComodinesForLevel(savedProgress.level, getLevelConfig(savedProgress.level).hasEncapsulations)
  );
  const [selectedComodin, setSelectedComodin] = useState<ComodinDefinition | null>(null);
  const [hasUsedComodin, setHasUsedComodin] = useState<boolean>(false);
  const [isComodinesModalOpen, setIsComodinesModalOpen] = useState<boolean>(false);
  const [comodinNotification, setComodinNotification] = useState<{ text: string; subtext: string } | null>(null);
  const titanRunnerBoostRef = useRef<boolean>(false);
  const safetyNetArmedRef = useRef<boolean>(false);

  const refreshExposedColors = useCallback(() => {
    if (sceneManagerRef.current) {
      const activeColors = sceneManagerRef.current.getExposedColors();
      setExposedColors(activeColors);
    }
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
        triggerComodinNotification('¡IMÁN PERIMETRAL ACTIVADO!', 'Rango de absorción aumentado un +40% durante 18 segundos.');
        break;
      case 'rotacion_tactica': {
        const exposed = sceneManagerRef.current.getExposedColors();
        const levelColors = getColorsForLevel(playingLevel, isFishOfFortune);
        const colors = exposed.length > 0 ? exposed : levelColors;
        setQueueColumns((prev) =>
          prev.map((col, cIdx) => {
            if (!col.length) return col;
            const newBottomColor = colors[cIdx % colors.length];
            const updated = [...col];
            updated[updated.length - 1] = { ...updated[updated.length - 1], color: newBottomColor };
            return updated;
          })
        );
        soundManager.playComodinActivate();
        triggerComodinNotification('¡ROTACIÓN TÁCTICA!', 'Lanzadores reconfigurados con colores expuestos en el arrecife.');
        break;
      }
      case 'corredor_titan':
        titanRunnerBoostRef.current = true;
        soundManager.playComodinActivate();
        triggerComodinNotification('¡CORREDOR TITÁN PREPARADO!', 'El siguiente corredor lanzado tendrá +8 de capacidad.');
        break;
      case 'amortiguador_emergencia':
        safetyNetArmedRef.current = true;
        soundManager.playComodinActivate();
        triggerComodinNotification('¡RED DE SALVAMENTO ARMADA!', 'Expulsará al corredor más ocioso si la cinta llega a 5/5.');
        break;
      case 'pulso_anticapsula': {
        const popped = sceneManagerRef.current.popRandomEncapsulations(4);
        triggerComodinNotification(
          '¡PULSO ROMPE-BURBUJAS!',
          popped > 0 ? `¡${popped} cápsulas estallaron liberando sus fichas!` : 'No había cápsulas selladas en este nivel.'
        );
        break;
      }
      case 'impulso_conveyor':
        sceneManagerRef.current.applyConveyorSurge(12, 1.8);
        triggerComodinNotification('¡SOBRECARGA DE CINTA!', 'Velocidad de cinta +80% durante 12 segundos.');
        break;
      case 'transmutacion_borde': {
        const activeCols = sceneManagerRef.current.getActiveRunnerColors();
        const fallbackCol = queueColumns.find((c) => c[0])?.[0]?.color || 'blue';
        const targetColor = activeCols.length > 0 ? activeCols[0] : fallbackCol;
        const converted = sceneManagerRef.current.convertPerimeterTiles(targetColor, 3);
        triggerComodinNotification(
          '¡TRANSMUTACIÓN CROMÁTICA!',
          converted > 0 ? `${converted} fichas del borde convertidas a color ${targetColor}.` : 'No se encontraron fichas para convertir.'
        );
        break;
      }
      case 'despeje_estrategico': {
        const ejected = sceneManagerRef.current.ejectMostIdleRunner();
        triggerComodinNotification(
          '¡PURGA TÁCTICA!',
          ejected ? 'Corredor ocioso retirado de la cinta sin coste de vida.' : 'No había corredores en la cinta para retirar.'
        );
        break;
      }
      case 'corredor_prismatico': {
        const launched = sceneManagerRef.current.launchPrismaticRunner(12);
        triggerComodinNotification(
          '¡CORREDOR PRISMA DESPLEGADO!',
          launched ? 'Devorará hasta 12 fichas de cualquier color en el borde.' : 'Cinta llena a 5/5. Libera un slot primero.'
        );
        break;
      }
      case 'colapso_gravitacional': {
        const inverted = sceneManagerRef.current.invertBoardTiles(5);
        triggerComodinNotification(
          '¡COLAPSO GRAVITACIONAL!',
          inverted > 0 ? `${inverted} fichas del núcleo empujadas a los bordes exteriores.` : 'Tablero ya despejado.'
        );
        break;
      }
      case 'paradoja_temporal':
        sceneManagerRef.current.applyChronoStasis(20);
        triggerComodinNotification('¡ESTASIS TEMPORAL!', 'Tiempo de atasco congelado por 20s y magnetismo potenciado.');
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
    const remaining = sceneManagerRef.current?.getRemainingColors() || [];

    const validColors = exposed.length > 0
      ? exposed
      : (remaining.length > 0 ? remaining : levelColors);

    return [0, 1].map((colIdx) => {
      const bottomColor = validColors[colIdx % validColors.length];

      const colItems: QueueRunner[] = [];
      for (let r = 0; r < 5; r++) {
        const poolColor = validColors[(colIdx * 2 + r) % validColors.length];
        colItems.push({
          id: `queue_${lvl}_${colIdx}_${r}_${Date.now()}_${Math.random()}`,
          color: poolColor,
          capacity: config.runnerCapacity,
        });
      }
      colItems.push({
        id: `queue_${lvl}_${colIdx}_active_${Date.now()}_${Math.random()}`,
        color: bottomColor,
        capacity: config.runnerCapacity,
      });

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
    localStorage.setItem(LIFE_STORAGE_KEY, JSON.stringify(lifeState));
  }, [lifeState]);
  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ level, experience }));
  }, [level, experience]);
  useEffect(() => {
    void initializeRewardedAds().then(setAdsReady);
  }, []);

  useEffect(() => {
    if (sceneManagerRef.current) sceneManagerRef.current.paused = showMap || isStuck;
  }, [showMap, isStuck]);

  useEffect(() => {
    if (!mountRef.current) return;
    const manager = new GameSceneManager(
      mountRef.current,
      {
        onTileAbsorbed: () => {
          setTilesAbsorbedCount((prev) => prev + 1);
          addExperience(15);
          refreshExposedColors();
        },
        onEncapsulationPopped: () => addExperience(15),
        onRunnerCleared: () => {
          refreshExposedColors();
        },
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
    manager.setTimeOfDay(timeOfDay);
    setQueueColumns(createQueueForLevel(playingLevel, manager.getExposedColors()));
    refreshExposedColors();

    const handleResize = () => manager.handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, [refreshExposedColors, startTime, experience, playingLevel, userProfile.gamertag, tilesAbsorbedCount, version]);

  useEffect(() => {
    if (!sceneManagerRef.current || isStuck || hasWon || showMap) return;
    const exposed = sceneManagerRef.current.getExposedColors();
    const remaining = sceneManagerRef.current.getRemainingColors();
    const validColors = exposed.length > 0 ? exposed : remaining;
    if (validColors.length === 0) return;

    setQueueColumns((prev) => {
      let needsUpdate = false;
      const nextCols = prev.map((col, idx) => {
        if (!col.length) return col;
        const active = col[col.length - 1];
        if (!validColors.includes(active.color)) {
          needsUpdate = true;
          const updated = [...col];
          updated[updated.length - 1] = {
            ...active,
            color: validColors[idx % validColors.length],
          };
          return updated;
        }
        return col;
      });
      return needsUpdate ? nextCols : prev;
    });
  }, [tilesAbsorbedCount, isStuck, hasWon, showMap]);

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
    
    const activeRunner = col[col.length - 1];
    const capacityBoost = titanRunnerBoostRef.current ? 8 : 0;
    if (titanRunnerBoostRef.current) {
      titanRunnerBoostRef.current = false;
    }
    const finalCapacity = activeRunner.capacity + capacityBoost;

    if (sceneManagerRef.current.launchRunner(activeRunner.color, finalCapacity, colIdx)) {
      refreshExposedColors();

      setQueueColumns((prev) =>
        prev.map((items, i) => {
          if (i !== colIdx) return items;
          const updated = [...items];
          updated.pop();

          const exposedColors = sceneManagerRef.current?.getExposedColors() || [];
          const remainingColors = sceneManagerRef.current?.getRemainingColors() || [];
          const levelColors = getColorsForLevel(playingLevel, isFishOfFortune);

          const validPool = exposedColors.length > 0
            ? exposedColors
            : (remainingColors.length > 0 ? remainingColors : levelColors);

          if (updated.length > 0) {
            const nextActiveIdx = updated.length - 1;
            if (!validPool.includes(updated[nextActiveIdx].color)) {
              updated[nextActiveIdx] = {
                ...updated[nextActiveIdx],
                color: validPool[i % validPool.length],
              };
            }
          }

          const remainingOnBoard = sceneManagerRef.current?.gridManager.getRemainingColors() || [];
          const currentExposed = sceneManagerRef.current?.getExposedColors() || [];
          const colorPool = remainingOnBoard.length > 0 ? remainingOnBoard : currentExposed;

          const chosenColor = colorPool.length > 0
            ? colorPool[Math.floor(Math.random() * colorPool.length)]
            : activeRunner.color;

          updated.unshift({
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
      refreshExposedColors();
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
      refreshExposedColors();
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
    setHasWon(false);
    setShowMap(false);
    stuckHandledRef.current = false;
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setMode(nextTheme, "v3", nextPlayableLevel);
      sceneManagerRef.current.paused = false;
      setQueueColumns(createQueueForLevel(nextPlayableLevel, sceneManagerRef.current.getExposedColors()));
    } else {
      setQueueColumns(createQueueForLevel(nextPlayableLevel));
      refreshExposedColors();
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
          triggerComodinNotification("¡RED DE SALVAMENTO ACTIVADA!", "Corredor retirado automáticamente de la cinta.");
          return;
        }
        const timeout = window.setTimeout(handleStuck, 4500);
        return () => window.clearTimeout(timeout);
      }
    }

    if (exposed.length > 0) {
      const canLaunchValidRunner = queueColumns.some((col) => {
        const bottomCard = col[col.length - 1];
        return bottomCard && exposed.includes(bottomCard.color);
      });
      if (!canLaunchValidRunner) {
        setQueueColumns((prev) =>
          prev.map((col, idx) => {
            if (!col.length) return col;
            const updated = [...col];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              color: exposed[idx % exposed.length],
            };
            return updated;
          })
        );
      }
    }

    return undefined;
  }, [activeSlotCount, tilesAbsorbedCount, queueColumns, hasWon, isStuck, showMap, handleStuck]);

  const adsPerLife = playingLevel <= 30 ? 1 : 2;
  const handleWatchAd = async () => {
    if (adBusy || lifeState.lives >= MAX_LIVES) return;
    if (hasNativeRewardedAds() && adsReady) {
      setAdBusy(true);
      setAdMessage("");
      try {
        const earned = await showRewardedLifeAd();
        if (!earned) {
          setAdMessage("El anuncio no se completó, por lo que no se otorgó la vida.");
          return;
        }
        setLifeState((prev) => grantAdLife(prev, Date.now(), adsPerLife).state);
        setAdMessage("¡Vida desbloqueada con éxito!");
      } catch {
        setAdMessage("No se pudo cargar el anuncio. Intenta de nuevo más tarde.");
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {onBackToPortfolio && (
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? "Back to Portfolio" : "Regresar al Portafolio"}</span>
            </button>
          )}

          {onSwitchMode && (
            <button
              type="button"
              onClick={onSwitchMode}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105 border ${
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
            <button
              type="button"
              onClick={() => setIsGameMenuOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/30 font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{isEn ? "Fish Menu" : "Menú Pez"}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 ml-auto flex-wrap">
          <div
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-cyan-300 text-[11px]"
            title={getMusicTrackForLevel(playingLevel, version).artist}
          >
            <Music className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold">{getMusicTrackForLevel(playingLevel, version).title}</span>
            <span className="text-[10px] text-slate-400">({getMusicTrackForLevel(playingLevel, version).bpm} BPM)</span>
          </div>

          {isFishOfFortune ? (
            <div className="flex items-center gap-1.5">
              <Fish className="w-4 h-4 text-teal-400 animate-pulse" />
              <span className="text-teal-300 font-bold">Fish Feeder · Aquatic 3D Edition</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Conveyor Realms 3D · Three.js Edition</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full h-[78vh] min-h-[600px] max-h-[880px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 select-none">
        <HeaderBar
          version={version}
          language={language}
          lives={lifeState.lives}
          maxLives={MAX_LIVES}
          soundEnabled={soundEnabled}
          speed={speed}
          timeOfDay={timeOfDay}
          onToggleTimeOfDay={handleToggleTimeOfDay}
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

        {comodinNotification && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-white tracking-wide">{comodinNotification.text}</span>
              <span className="text-[11px] text-amber-300 font-medium">{comodinNotification.subtext}</span>
            </div>
          </div>
        )}

        <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full cursor-grab active:cursor-grabbing" />

        {/* CONTROLES LATERALES ÚNICOS (2 columnas) */}
        {!showMap && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none">
            <div className="flex flex-col items-center mb-2">
              <span className="text-[11px] font-black text-white drop-shadow-md tracking-wider mb-1">
                {activeSlotCount}/5
              </span>
              <div className="flex flex-col gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-9 h-6 rounded-lg transition-all border ${
                      i < activeSlotCount
                        ? 'bg-cyan-400 border-cyan-200 shadow-sm shadow-cyan-400/50'
                        : 'bg-slate-900/80 border-slate-700/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-2.5 rounded-2xl border-2 border-white/40 shadow-2xl flex gap-2.5">
              {queueColumns.slice(0, 2).map((col, colIdx) => {
                const activeCard = col[col.length - 1];

                return (
                  <div key={colIdx} className="flex flex-col gap-1.5 items-center">
                    {col.slice(0, col.length - 1).map((item, idx) => {
                      const colorClasses = getTileColorBg(item.color);
                      
                      return (
                        <div
                          key={item.id || idx}
                          className={`w-10 h-10 rounded-xl ${colorClasses} opacity-85 flex flex-col items-center justify-center shadow-md pointer-events-none transition-all`}
                        >
                          <span className="text-[11px] font-black leading-none drop-shadow-xs">
                            {item.capacity}
                          </span>
                        </div>
                      );
                    })}

                    {activeCard && (
                      <button
                        type="button"
                        onClick={() => handleLaunchRunner(colIdx)}
                        className={`w-12 h-13 rounded-xl ${getTileColorBg(activeCard.color)} flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-all transform hover:scale-105 ring-3 ring-white cursor-pointer mt-1`}
                        title={`Lanzar corredor ${activeCard.color}`}
                      >
                        <span className="text-xs font-black leading-none drop-shadow-xs">
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
