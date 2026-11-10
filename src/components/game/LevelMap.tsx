import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Cloud,
  Crown,
  Fish,
  Flame,
  LockKeyhole,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Trees,
  Trophy,
  X,
  Zap,
  ArrowDown,
  ArrowUp,
  Compass,
} from 'lucide-react';
import { getThemeForLevel } from '../../game/experience';
import { GameVersion } from '../../game/types';
import {
  getStoredUser,
  getLocalHighscores,
  fetchLeaderboard,
  UserProfile,
} from '../../services/supabaseGame';

const STEP = 150; // Distance between levels in pixels
const OVERLAP = 180; // Overlap buffer between world regions for seamless dissolution
const FISH_PATH_PALETTE = [
  { base: '#7c3aed', fill: '#ec4899', edge: '#fef08a', light: '#fbcfe8', deep: '#be185d' },
  { base: '#075985', fill: '#22d3ee', edge: '#f0fdfa', light: '#a5f3fc', deep: '#0e7490' },
  { base: '#854d0e', fill: '#facc15', edge: '#fff7ed', light: '#fef08a', deep: '#ca8a04' },
  { base: '#6b21a8', fill: '#a78bfa', edge: '#f5f3ff', light: '#ddd6fe', deep: '#6d28d9' },
  { base: '#065f46', fill: '#34d399', edge: '#ecfdf5', light: '#a7f3d0', deep: '#047857' },
];

interface WorldDefinition {
  theme: GameVersion;
  title: string;
  subtitle: string;
  badgeIcon: React.ComponentType<{ className?: string }>;
  texture: string;
  themeColor: string;
  pathBase: string;
  pathFill: string;
  pathTrim: string;
  pathDash: string;
  blendColor: string;
  nodeBg: string;
  activeRing: string;
}

const WORLD_DEFS: Record<GameVersion, WorldDefinition> = {
  chess: {
    theme: 'chess',
    title: 'Chess Kingdom',
    subtitle: 'Classic Marble Citadel',
    badgeIcon: Crown,
    texture: '/assets/worlds/chess_kingdom.jpg',
    themeColor: '#f59e0b',
    pathBase: '#450a0a',
    pathFill: '#7f1d1d',
    pathTrim: '#fbbf24',
    pathDash: '4 8',
    blendColor: '#1e1b4b',
    nodeBg: 'from-amber-400 via-rose-500 to-amber-600',
    activeRing: 'ring-amber-300',
  },
  fof: {
    theme: 'fof',
    title: 'Coral Cove',
    subtitle: 'Sunlit Underwater Realm',
    badgeIcon: Fish,
    texture: '/assets/worlds/coral_cove.jpg',
    themeColor: '#22d3ee',
    pathBase: '#083344',
    pathFill: '#0e7490',
    pathTrim: '#67e8f9',
    pathDash: '5 7',
    blendColor: '#082f49',
    nodeBg: 'from-cyan-400 via-teal-500 to-blue-600',
    activeRing: 'ring-cyan-300',
  },
  land: {
    theme: 'land',
    title: 'Banana Wildlands',
    subtitle: 'Tropical Banana Paradise',
    badgeIcon: Trees,
    texture: '/assets/worlds/banana_paradise.jpg',
    themeColor: '#facc15',
    pathBase: '#1c1917',
    pathFill: '#27272a',
    pathTrim: '#facc15',
    pathDash: '4 8',
    blendColor: '#14532d',
    nodeBg: 'from-amber-400 via-emerald-500 to-green-700',
    activeRing: 'ring-yellow-300',
  },
  birds: {
    theme: 'birds',
    title: 'Sky Isles',
    subtitle: 'Celestial Cloud Sanctuary',
    badgeIcon: Sparkles,
    texture: '/assets/worlds/sky_isles.jpg',
    themeColor: '#bae6fd',
    pathBase: '#075985',
    pathFill: '#0284c7',
    pathTrim: '#ffffff',
    pathDash: '6 6',
    blendColor: '#0c4a6e',
    nodeBg: 'from-sky-300 via-blue-500 to-indigo-600',
    activeRing: 'ring-sky-300',
  },
  humans: {
    theme: 'humans',
    title: 'Neon Metropolis',
    subtitle: 'Synthwave Cyber Grid',
    badgeIcon: Zap,
    texture: '/assets/worlds/cyber_grid.jpg',
    themeColor: '#f472b6',
    pathBase: '#09090b',
    pathFill: '#701a75',
    pathTrim: '#06b6d4',
    pathDash: '2 6',
    blendColor: '#312e81',
    nodeBg: 'from-pink-500 via-fuchsia-600 to-purple-800',
    activeRing: 'ring-pink-400',
  },
  cars: {
    theme: 'cars',
    title: 'Turbo Circuit',
    subtitle: 'Asphalt Neon Speedway',
    badgeIcon: Flame,
    texture: '/assets/worlds/turbo_circuit.jpg',
    themeColor: '#fbbf24',
    pathBase: '#18181b',
    pathFill: '#27272a',
    pathTrim: '#ef4444',
    pathDash: '6 6',
    blendColor: '#7c2d12',
    nodeBg: 'from-amber-400 via-orange-500 to-red-600',
    activeRing: 'ring-amber-400',
  },
  aircraft: {
    theme: 'aircraft',
    title: 'Golden Vault',
    subtitle: 'Imperial Emerald Frontier',
    badgeIcon: Trophy,
    texture: '/assets/worlds/golden_vault.jpg',
    themeColor: '#fde047',
    pathBase: '#022c22',
    pathFill: '#065f46',
    pathTrim: '#facc15',
    pathDash: '4 8',
    blendColor: '#064e3b',
    nodeBg: 'from-yellow-300 via-amber-500 to-emerald-700',
    activeRing: 'ring-yellow-300',
  },
  primitive: {
    theme: 'primitive',
    title: 'Origins',
    subtitle: 'Classic Realm',
    badgeIcon: Crown,
    texture: '/assets/worlds/chess_kingdom.jpg',
    themeColor: '#cbd5e1',
    pathBase: '#1e293b',
    pathFill: '#334155',
    pathTrim: '#94a3b8',
    pathDash: '4 8',
    blendColor: '#0f172a',
    nodeBg: 'from-slate-300 to-slate-600',
    activeRing: 'ring-slate-300',
  },
};

interface LevelMapProps {
  language?: 'en' | 'es';
  fishOfFortuneMode?: boolean;
  frontierLevel?: number;
  currentLevel?: number;
  selectedLevel?: number;
  experience?: number;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
  onOpenLeaderboard?: () => void;
  onOpenGamertag?: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  language = 'en',
  fishOfFortuneMode = false,
  frontierLevel,
  currentLevel,
  selectedLevel,
  experience,
  onSelectLevel,
  onClose,
  onOpenLeaderboard,
  onOpenGamertag,
}) => {
  const isEn = language === 'en';
  const worldName = (theme: GameVersion) => {
    const names: Record<GameVersion, [string, string]> = {
      chess: ['Chess Kingdom', 'Reino de Ajedrez'], primitive: ['Origins', 'Orígenes'], fof: ['Coral Cove', 'Ensenada Coral'],
      land: ['Land Animals', 'Animales terrestres'], birds: ['Birds', 'Aves'], humans: ['Humans', 'Humanos'],
      cars: ['Cars', 'Automóviles'], aircraft: ['Aircraft', 'Aeronaves'],
    };
    return names[theme][isEn ? 0 : 1];
  };
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPastLevelsDrawer, setShowPastLevelsDrawer] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getStoredUser());
  const [topScore, setTopScore] = useState<number>(0);
  const [isWidgetCollapsed, setIsWidgetCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const profile = getStoredUser();
    setUserProfile(profile);
    const localScores = getLocalHighscores();
    const highest = localScores.length > 0 ? Math.max(...localScores.map((s) => s.score)) : profile.best_score || 0;
    setTopScore(Math.max(highest, profile.best_score || 0, experience || 0));

    void fetchLeaderboard().then((res) => {
      if (res.scores && res.scores.length > 0) {
        const globalMax = Math.max(...res.scores.map((s) => s.score));
        setTopScore((prev) => Math.max(prev, globalMax));
      }
    });
  }, [experience]);

  // The player's highest unlocked frontier level (never lowered by replaying)
  const activeFrontier = frontierLevel ?? currentLevel ?? 1;
  const activeSelected = selectedLevel ?? activeFrontier;

  const mapLevelCount = Math.max(80, activeFrontier + 16);
  const mapHeight = mapLevelCount * STEP + 380;

  // Sinuous winding path down the central spine
  const points = useMemo(() => Array.from({ length: mapLevelCount }, (_, i) => {
    const level = i + 1;
    // Organic S-curve swinging smoothly between 26% and 74%
    const x = 50 + Math.sin(i * 0.85) * 24;
    const y = mapHeight - 160 - i * STEP;
    return { level, x, y };
  }), [mapLevelCount, mapHeight]);

  // Height where the locked fog boundary begins
  const frontierY = mapHeight - 160 - (activeFrontier - 1) * STEP;

  // World regions spanning full width with seamless overlapping buffers
  const worldRegions = useMemo(() => {
    const regions = [];
    for (let startLevel = 1; startLevel <= mapLevelCount;) {
      const endLevel = Math.min(mapLevelCount, startLevel === 1 ? 9 : startLevel + 9);
      const start = Math.min(startLevel, mapLevelCount);
      const end = Math.min(endLevel, mapLevelCount);
      const startY = mapHeight - 160 - (start - 1) * STEP;
      const endY = mapHeight - 160 - (end - 1) * STEP;
      const theme = fishOfFortuneMode ? 'fof' : getThemeForLevel(start);
      const def = WORLD_DEFS[theme] || WORLD_DEFS.chess;

      const sliceStart = Math.max(0, start - 2);
      const sliceEnd = Math.min(points.length, end + 1);
      const regionPoints = points.slice(sliceStart, sliceEnd);
      const segmentPath = regionPoints.map(p => `${p.x},${p.y}`).join(' ');
      const segmentCurve = regionPoints.length > 1
        ? regionPoints.slice(0, -1).reduce((path, point, idx) => {
            const next = regionPoints[idx + 1];
            const prev = regionPoints[Math.max(0, idx - 1)];
            const after = regionPoints[Math.min(regionPoints.length - 1, idx + 2)];
            const c1x = point.x + (next.x - prev.x) / 6;
            const c1y = point.y + (next.y - prev.y) / 6;
            const c2x = next.x - (after.x - point.x) / 6;
            const c2y = next.y - (after.y - point.y) / 6;
            return `${path} C ${c1x},${c1y} ${c2x},${c2y} ${next.x},${next.y}`;
          }, `M ${regionPoints[0].x},${regionPoints[0].y}`)
        : '';

      regions.push({
        start,
        end,
        top: endY - STEP / 2 - OVERLAP / 2,
        height: (startY - endY + STEP) + OVERLAP,
        def,
        segmentPath,
        segmentCurve,
      });
      startLevel = endLevel + 1;
    }
    return regions;
  }, [fishOfFortuneMode, mapHeight, mapLevelCount, points]);

  // Smooth scroller helper
  const scrollToLevel = (lvl: number, behavior: ScrollBehavior = 'smooth') => {
    const element = scrollRef.current;
    if (!element) return;
    const targetY = mapHeight - 160 - (lvl - 1) * STEP;
    const viewportHalf = element.clientHeight / 2 || 300;
    const desiredTop = Math.max(0, targetY - viewportHalf);
    element.scrollTo({ top: desiredTop, behavior });
  };

  // Auto-scroll to center on the active frontier or selected level initially
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const targetLevel = activeSelected > 0 ? activeSelected : activeFrontier;
    const targetY = mapHeight - 160 - (targetLevel - 1) * STEP;
    const scrollNow = () => {
      const viewportHalf = element.clientHeight / 2 || 300;
      const desiredTop = Math.max(0, targetY - viewportHalf);
      element.scrollTop = desiredTop;
    };
    scrollNow();
    const timeout = setTimeout(scrollNow, 70);
    return () => clearTimeout(timeout);
  }, [activeFrontier, activeSelected, mapHeight]);

  const pastLevels = useMemo(() => {
    const list: number[] = [];
    for (let l = 1; l < activeFrontier; l++) {
      list.push(l);
    }
    return list;
  }, [activeFrontier]);

  return (
    <section className="absolute inset-0 z-40 overflow-hidden bg-slate-950 text-white select-none">
      {/* 1. Primary Header Bar */}
      <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {fishOfFortuneMode
                ? (isEn ? 'Fish Feeder • Level Pathway' : 'Fish Feeder • Camino de niveles')
                : (isEn ? 'Conveyor Realms • Adventure Pathway' : 'Conveyor Realms • Camino de aventura')}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white">
                {fishOfFortuneMode ? (isEn ? 'Fish Journey' : 'Viaje de los peces') : (isEn ? 'World Frontier' : 'Frontera de mundos')}
              </h1>
              <span className="rounded-full bg-amber-400/20 border border-amber-300/40 px-2 py-0.5 text-[10px] font-black text-amber-300">
                {isEn ? 'Up next: Level' : 'Por superar: nivel'} {activeFrontier}
              </span>
              {activeSelected < activeFrontier && (
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                  {isEn ? 'Replaying: Level' : 'Repitiendo: nivel'} {activeSelected}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-white shadow-lg backdrop-blur hover:bg-white/20 active:scale-95 cursor-pointer transition"
            aria-label={isEn ? 'Resume Game' : 'Reanudar juego'}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">{isEn ? 'Close Map' : 'Cerrar mapa'}</span>
          </button>
        </div>

        {/* 2. Quick Action Toolbar: Regresar al 1 & Nivel Por Hacer */}
        <div className="hidden flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2 bg-slate-900/80 border-t border-white/5 text-xs">
          {/* Quick Return to Level 1 Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectLevel(1)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-bold transition cursor-pointer active:scale-95 shadow-sm"
              title={isEn ? 'Play Level 1 now without losing your progress' : 'Jugar el nivel 1 ahora sin perder tu progreso'}
            >
              <RotateCcw className="h-3.5 w-3.5 text-emerald-300" />
              <span>{isEn ? '⏪ Return to Level 1' : '⏪ Volver al nivel 1'}</span>
            </button>
            <button
              onClick={() => scrollToLevel(1)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition cursor-pointer"
              title={isEn ? 'Scroll to the start of the path (Level 1)' : 'Ir al inicio del camino (nivel 1)'}
            >
              <ArrowDown className="h-3 w-3 inline mr-0.5" />
              {isEn ? 'View on map' : 'Ver en el mapa'}
            </button>
          </div>

          {/* Quick Jump to Frontier (Por Hacer) Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectLevel(activeFrontier)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black transition cursor-pointer active:scale-95 shadow-md shadow-amber-500/20"
              title={isEn ? `Play the next level (${activeFrontier})` : `Jugar el siguiente nivel (${activeFrontier})`}
            >
              <Zap className="h-3.5 w-3.5 fill-slate-950" />
              <span>{isEn ? `⚡ Play Level ${activeFrontier} (Next)` : `⚡ Jugar nivel ${activeFrontier} (siguiente)`}</span>
            </button>
            <button
              onClick={() => scrollToLevel(activeFrontier)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition cursor-pointer"
              title={isEn ? `Scroll to the next level (${activeFrontier})` : `Ir al siguiente nivel (${activeFrontier})`}
            >
              <ArrowUp className="h-3 w-3 inline mr-0.5" />
              {isEn ? 'View current' : 'Ver actual'}
            </button>
          </div>

          {/* Past Levels Selector Toggle */}
          {pastLevels.length > 0 && (
            <button
              onClick={() => setShowPastLevelsDrawer(!showPastLevelsDrawer)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition cursor-pointer ml-auto sm:ml-0"
            >
              <Compass className="h-3.5 w-3.5 text-cyan-300" />
              <span>{isEn ? `Past Levels (${pastLevels.length})` : `Niveles anteriores (${pastLevels.length})`}</span>
            </button>
          )}
        </div>

        {/* 3. Horizontal Past Levels Carousel / Pills Bar */}
        {pastLevels.length > 0 && showPastLevelsDrawer && (
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 sm:px-6 py-2 bg-slate-950/95 border-t border-cyan-500/20 scrollbar-none animate-in slide-in-from-top-2 duration-200">
            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap mr-1">
              {isEn ? 'Replay level:' : 'Repetir nivel:'}
            </span>
            {pastLevels.map((lvl) => {
              const isSel = lvl === activeSelected;
              return (
                <button
                  key={`quick-past-${lvl}`}
                  onClick={() => onSelectLevel(lvl)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap active:scale-95 ${
                    isSel
                      ? 'bg-cyan-500 text-slate-950 shadow-md ring-2 ring-cyan-300'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200'
                  }`}
                  title={isEn ? `Replay Level ${lvl} (your progress at Level ${activeFrontier} will be kept)` : `Repetir el nivel ${lvl} (se conservará tu progreso en el nivel ${activeFrontier})`}
                >
                  <span>{isEn ? 'Level' : 'Nivel'} {lvl}</span>
                  <div className="flex text-amber-400">
                    <Star className="h-2.5 w-2.5 fill-amber-400" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* 4. Side Widget: Highscore & Highest Level Reached (A un costado del pathway) */}
      <aside className={`hidden absolute z-30 transition-all duration-300 pointer-events-auto ${
        isWidgetCollapsed
          ? 'left-3 sm:left-6 top-28 sm:top-28'
          : 'left-3 sm:left-6 top-28 sm:top-28 w-60 sm:w-72 max-w-[calc(100vw-1.5rem)]'
      }`}>
        {isWidgetCollapsed ? (
          <button
            onClick={() => setIsWidgetCollapsed(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/95 hover:bg-slate-800 border border-amber-400/40 text-amber-300 shadow-2xl backdrop-blur-md cursor-pointer transition active:scale-95 text-xs font-black"
            title={isEn ? 'Expand high score and highest level panel' : 'Expandir el panel de récord y nivel más alto'}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-wider">{isEn ? 'High Score' : 'Récord'}</span>
              <span className="text-xs font-black text-white">{Math.max(userProfile.best_score || 0, topScore).toLocaleString()}</span>
            </div>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded text-[10px] font-bold">
              Nv.{activeFrontier}
            </span>
          </button>
        ) : (
          <div className="rounded-2xl border border-white/15 bg-slate-950/92 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl text-slate-100 flex flex-col gap-2.5 animate-in fade-in slide-in-from-left-2 duration-200">
            {/* Top row with Title and collapse button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-md font-black text-xs">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    {isEn ? 'Pathway Stats' : 'Estadísticas del camino'}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white leading-tight">
                    {isEn ? 'High Score & Frontier' : 'Récord y frontera'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsWidgetCollapsed(true)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer text-xs font-bold"
                title={isEn ? 'Minimize panel' : 'Minimizar panel'}
                aria-label={isEn ? 'Minimize panel' : 'Minimizar panel'}
              >
                ✕
              </button>
            </div>

            {/* Highscore / Récord Box */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  {isEn ? 'Best Score' : 'Récord máximo'}
                </span>
                {onOpenLeaderboard && (
                  <button
                    onClick={onOpenLeaderboard}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 underline font-semibold cursor-pointer"
                  >
                    {isEn ? 'View Top' : 'Ver mejores'}
                  </button>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400">
                  {Math.max(userProfile.best_score || 0, topScore).toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-400/80 font-bold">XP</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 pt-1 border-t border-white/5">
                <span>{isEn ? 'Player:' : 'Jugador:'}</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white tracking-wide">{userProfile.gamertag}</span>
                  {onOpenGamertag && (
                    <button
                      onClick={onOpenGamertag}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 cursor-pointer ml-1"
                      title={isEn ? 'Edit Gamertag' : 'Editar Gamertag'}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Highest Level Reached / Nivel Más Alto Alcanzado Box */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-xl p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                {isEn ? 'Highest Level Reached' : 'Nivel más alto alcanzado'}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {isEn ? 'Level' : 'Nivel'} {activeFrontier}
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  {isEn ? 'Frontier Peak' : 'Frontera actual'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px] text-slate-300">
                <div className="bg-slate-900/70 p-1.5 rounded-lg border border-white/5 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  <span>{(activeFrontier - 1) * 3} {isEn ? 'Stars' : 'Estrellas'}</span>
                </div>
                <div className="bg-slate-900/70 p-1.5 rounded-lg border border-white/5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{userProfile.total_tiles || (activeFrontier * 24)} {isEn ? 'Tiles' : 'Fichas'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-1.5 pt-1">
              <button
                onClick={() => onSelectLevel(activeFrontier)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isEn ? `Play Level ${activeFrontier} (Highest)` : `Jugar nivel ${activeFrontier} (más alto)`}</span>
              </button>

              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
                >
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>{isEn ? 'Global Leaderboard' : 'Clasificación global'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main Full-Width Scrollable World Viewport */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto overscroll-contain pt-16 sm:pt-16 pb-3"
        style={{ scrollbarColor: '#38bdf8 rgba(15,23,42,0.6)' }}
      >
        <div className="relative w-full overflow-hidden" style={{ height: mapHeight }}>
          {/* Full-Width Seamless World Bands - Wide Panoramic Landscapes (NO Repeating Tile Squares) */}
          {worldRegions.map(({ start, end, top, height, def }, idx) => {
            const nextDef = worldRegions[idx + 1]?.def || def;
            const prevDef = worldRegions[idx - 1]?.def || def;
            const BadgeIcon = def.badgeIcon;

            return (
              <div
                key={`${start}-${end}`}
                className="pointer-events-none absolute inset-x-0 w-full overflow-hidden"
                style={{
                  top,
                  height,
                }}
              >
                {/* Grand Panoramic Scenic Backdrop */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: fishOfFortuneMode
                      ? `linear-gradient(180deg, ${FISH_PATH_PALETTE[Math.floor(start / 10) % FISH_PATH_PALETTE.length].fill}66, ${FISH_PATH_PALETTE[Math.floor(start / 10) % FISH_PATH_PALETTE.length].light}22 42%, ${FISH_PATH_PALETTE[Math.floor(start / 10) % FISH_PATH_PALETTE.length].base}44), url(${def.texture})`
                      : `url(${def.texture})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    maskImage: 'linear-gradient(180deg, transparent 0px, black 160px, black calc(100% - 160px), transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(180deg, transparent 0px, black 160px, black calc(100% - 160px), transparent 100%)',
                  }}
                />

                {/* Lateral Edge Vignettes */}
                <div className={`absolute inset-0 ${fishOfFortuneMode
                  ? 'bg-gradient-to-r from-cyan-950/10 via-transparent to-violet-950/10'
                  : 'bg-gradient-to-r from-slate-950/85 via-transparent to-slate-950/85'}`} />

                {fishOfFortuneMode && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[{ left: '12%', top: '24%', size: 30 }, { left: '83%', top: '18%', size: 20 }, { left: '76%', top: '66%', size: 38 }, { left: '18%', top: '78%', size: 16 }].map((bubble, bubbleIdx) => (
                      <span
                        key={`bubble-${start}-${bubbleIdx}`}
                        className="absolute rounded-full border border-white/35 bg-gradient-to-br from-white/65 via-cyan-200/25 to-sky-500/20 shadow-[inset_-4px_-5px_10px_rgba(14,116,144,.2),0_3px_12px_rgba(34,211,238,.2)]"
                        style={{ left: bubble.left, top: bubble.top, width: bubble.size, height: bubble.size }}
                      />
                    ))}
                  </div>
                )}

                {/* Seamless Dissolve between Worlds */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, ${prevDef.blendColor}b3 0%, transparent 22%, transparent 78%, ${nextDef.blendColor}b3 100%)`,
                  }}
                />

                {/* World Title Marker */}
                <div
                  className="absolute left-4 sm:left-12 flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/70 p-3 sm:p-4 backdrop-blur-md shadow-2xl z-10"
                  style={{ top: 80 }}
                >
                  <div
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl shadow-inner"
                    style={{ backgroundColor: `${def.themeColor}33`, color: def.themeColor }}
                  >
                    <BadgeIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {isEn ? 'Levels' : 'Niveles'} {start} – {end}
                    </span>
                    <h2 className="text-sm sm:text-lg font-black tracking-tight text-white drop-shadow">
                      {fishOfFortuneMode
                        ? (isEn
                          ? ['Reef Fish', 'Longnose Fish', 'Pufferfish', 'Lionfish', 'Butterflyfish'][Math.floor(start / 10) % 5]
                          : ['Peces de arrecife', 'Peces hocicudos', 'Pez globo', 'Pez león', 'Pez mariposa'][Math.floor(start / 10) % 5])
                        : worldName(def.theme)}
                    </h2>
                    <p className="text-[11px] text-slate-300">{fishOfFortuneMode
                      ? (isEn ? 'New fish species unlocked every 10 levels' : 'Nueva especie de pez cada 10 niveles')
                      : (isEn ? def.subtitle : ['Ciudadela clásica de mármol', 'Reino de los orígenes', 'Reino submarino iluminado por el sol', 'Hábitats de fauna terrestre', 'Cielos de aves migratorias', 'Reino de la humanidad', 'Autopistas de alta velocidad', 'Frontera de aviación'][['chess','primitive','fof','land','birds','humans','cars','aircraft'].indexOf(def.theme)])}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* SVG Roads Styled per World Block */}
          <div className="pointer-events-none absolute inset-0 w-full overflow-visible">
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 100 ${mapHeight}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter id="roadShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
                </filter>
              </defs>

              {/* Base universal shadow groove under all paths */}
              {!fishOfFortuneMode && worldRegions.map(({ start, end, segmentPath }) => (
                <polyline
                  key={`shadow-${start}-${end}`}
                  points={segmentPath}
                  fill="none"
                  stroke="rgba(0,0,0,0.75)"
                  strokeWidth="28"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#roadShadow)"
                />
              ))}

              {/* Fish route uses a bright candy-like dotted trail; the other mode keeps its road. */}
              {worldRegions.map(({ start, end, def, segmentPath, segmentCurve }) => (
                <g key={`road-${start}-${end}`}>
                  {fishOfFortuneMode ? (
                    <>
                      <path d={segmentCurve} fill="none" stroke="rgba(15,23,42,.35)" strokeWidth="10" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={segmentCurve} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="6" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d={segmentCurve}
                        fill="none"
                        stroke={FISH_PATH_PALETTE[Math.floor(start / 10) % FISH_PATH_PALETTE.length].fill}
                        strokeWidth="4"
                        strokeDasharray="1 13"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ) : (
                    <>
                      <polyline points={segmentPath} fill="none" stroke={def.pathBase} strokeWidth="22" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points={segmentPath} fill="none" stroke={def.pathFill} strokeWidth="15" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points={segmentPath} fill="none" stroke={def.pathTrim} strokeWidth="3.5" strokeDasharray={def.pathDash} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points={segmentPath} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="2 12" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                    </>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Fish route keeps future numbered nodes visible; standard pathway retains fog. */}
          {!fishOfFortuneMode && <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 overflow-hidden"
            style={{ height: Math.max(0, frontierY - 45) }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/98 via-slate-950/90 to-transparent backdrop-blur-[3px]" />

            <div className="absolute inset-0 overflow-hidden opacity-85">
              <Cloud className="absolute left-[6%] bottom-10 h-32 w-32 fill-slate-800/70 text-slate-700/50 drop-shadow-2xl animate-pulse" />
              <Cloud className="absolute right-[8%] bottom-32 h-44 w-44 fill-slate-800/75 text-slate-700/50 drop-shadow-2xl" />
              <Cloud className="absolute left-[38%] bottom-64 h-36 w-36 fill-slate-800/65 text-slate-700/40 drop-shadow-2xl" />
              <Cloud className="absolute left-[12%] bottom-96 h-40 w-40 fill-slate-800/70 text-slate-700/50 drop-shadow-2xl" />
            </div>

            <div className="absolute inset-x-0 bottom-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-cyan-300 shadow-xl backdrop-blur-md">
                {isEn ? '☁️ Unexplored Fog • Complete the next level to reveal the path' : '☁️ Niebla inexplorada • Completa el siguiente nivel para revelar el camino'}
              </span>
            </div>
          </div>}

          {/* Level Nodes */}
          <div className="relative mx-auto w-full max-w-2xl h-full">
            {points.map(({ level, x, y }) => {
              const conquered = level < activeFrontier;
              const isFrontier = level === activeFrontier;
              const locked = level > activeFrontier;
              const isSelected = level === activeSelected;
              const theme = getThemeForLevel(level);
              const def = WORLD_DEFS[theme] || WORLD_DEFS.chess;
              const fishNode = FISH_PATH_PALETTE[Math.floor(level / 10) % FISH_PATH_PALETTE.length];

              return (
                <div
                  key={level}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: y }}
                >
                  {/* Active Beacon Wave Ping for Frontier Level */}
                  {isFrontier && (
                    <div className="absolute -inset-3 -z-10 animate-ping rounded-full bg-amber-400/40 opacity-75" />
                  )}

                  {/* Active "POR HACER • ACTUAL" Callout */}
                  {isFrontier && (
                    <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
                      <span className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-lg animate-bounce">
                        <Zap className="h-3 w-3 fill-slate-950" />
                        {isEn ? 'Next • Current Level' : 'Siguiente • Nivel actual'}
                      </span>
                    </div>
                  )}

                  {/* Selected / Replaying Callout for Past Levels */}
                  {conquered && isSelected && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
                      <span className="flex items-center gap-1 rounded-full border border-cyan-300 bg-cyan-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                        <RotateCcw className="h-2.5 w-2.5" />
                        {isEn ? 'Selected Level' : 'Nivel seleccionado'}
                      </span>
                    </div>
                  )}

                  {/* The Level Node Button */}
                  <button
                    disabled={locked}
                    onClick={() => onSelectLevel(level)}
                    className={fishOfFortuneMode
                      ? `group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-[3px] font-black text-white transition-transform active:scale-90 cursor-pointer before:absolute before:inset-x-2 before:top-1 before:h-2 before:rounded-full before:bg-white/60 before:blur-[1px] ${
                          isFrontier
                            ? 'z-30 scale-110 ring-4 ring-white/80 ring-offset-4 ring-offset-slate-950/40 shadow-2xl animate-pulse'
                            : conquered
                            ? isSelected
                              ? 'z-25 scale-105 ring-4 ring-white/70 shadow-xl'
                              : 'z-20 shadow-xl hover:scale-110'
                            : 'z-10 opacity-85 grayscale-[0.35] shadow-md'
                        }`
                      : `group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-4 font-black shadow-2xl transition-transform active:scale-90 cursor-pointer ${
                          isFrontier
                            ? `scale-115 border-amber-200 bg-gradient-to-br ${def.nodeBg} text-white ring-8 ${def.activeRing}/30 z-30`
                            : conquered
                            ? isSelected
                              ? 'border-cyan-300 bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 text-white ring-4 ring-cyan-400/50 scale-105 z-25'
                              : 'border-amber-300/80 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 text-white hover:scale-110 z-20 shadow-emerald-900/60'
                            : 'border-slate-500/50 bg-slate-800/80 text-slate-400 opacity-60 z-10 backdrop-blur-sm'
                        }`}
                    style={fishOfFortuneMode ? {
                      backgroundImage: locked
                        ? `linear-gradient(145deg, ${fishNode.light}cc, ${fishNode.fill}bb 52%, ${fishNode.deep})`
                        : `linear-gradient(145deg, ${fishNode.light}, ${fishNode.fill} 52%, ${fishNode.deep})`,
                      borderColor: isFrontier ? '#fff7ad' : conquered ? '#ffffff' : fishNode.light,
                      boxShadow: isFrontier
                        ? `0 0 0 3px ${fishNode.fill}80, 0 7px 0 ${fishNode.deep}, 0 12px 24px rgba(15,23,42,.55)`
                        : conquered
                        ? `0 4px 0 ${fishNode.deep}, 0 8px 16px rgba(15,23,42,.45)`
                        : `0 4px 0 ${fishNode.deep}, 0 7px 12px rgba(15,23,42,.4)`,
                    } : undefined}
                    title={
                      isFrontier
                        ? (isEn ? `Play Level ${level} (next)` : `Jugar nivel ${level} (siguiente)`)
                        : conquered
                        ? (isEn ? `Replay Past Level ${level} (your current level ${activeFrontier} is kept)` : `Repetir el nivel anterior ${level} (se conserva tu nivel actual ${activeFrontier})`)
                        : (isEn ? `Level ${level} Locked` : `Nivel ${level} bloqueado`)
                    }
                    aria-label={`${isEn ? 'Level' : 'Nivel'} ${level}`}
                  >
                    {/* Inner Icon */}
                    {fishOfFortuneMode ? (
                      <>
                        <span className="relative z-10 text-lg sm:text-xl font-black drop-shadow-[0_2px_2px_rgba(15,23,42,.55)]">{level}</span>
                        {isFrontier && <Play className="absolute -right-1 -top-1 z-20 h-5 w-5 rounded-full border-2 border-white bg-amber-400 p-0.5 fill-white text-white shadow-lg" />}
                        {locked && <LockKeyhole className="absolute -bottom-1 -right-1 z-20 h-4 w-4 rounded-full border border-white/80 bg-slate-700 p-0.5 text-white shadow" />}
                      </>
                    ) : isFrontier ? (
                      <Play className="ml-0.5 h-6 w-6 sm:h-7 sm:w-7 fill-white drop-shadow-md" />
                    ) : conquered ? (
                      <Check className="h-6 w-6 sm:h-7 sm:w-7 stroke-[3.5] text-white drop-shadow-md" />
                    ) : (
                      <LockKeyhole className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                    )}

                    {/* Level Number Ribbon */}
                    {!fishOfFortuneMode && <span
                      className={`absolute -bottom-2.5 rounded-full px-2 py-0.2 text-[10px] sm:text-[11px] font-black tracking-tight shadow-md border ${
                        isFrontier
                          ? 'border-amber-200 bg-amber-400 text-slate-950'
                          : conquered
                          ? isSelected
                            ? 'border-cyan-200 bg-cyan-400 text-slate-950'
                            : 'border-emerald-300/60 bg-emerald-900/90 text-emerald-200'
                          : 'border-white/10 bg-slate-900/90 text-slate-400'
                      }`}
                    >
                      {level}
                    </span>}
                  </button>

                  {/* 3-Star Badge for Conquered Levels */}
                  {conquered && (
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-300 drop-shadow" />
                      <Star className="h-3.5 w-3.5 fill-amber-300 text-yellow-200 drop-shadow -translate-y-0.5" />
                      <Star className="h-3 w-3 fill-amber-400 text-amber-300 drop-shadow" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick-Action Dock */}
      <div className="hidden absolute inset-x-0 bottom-12 z-30 pointer-events-none flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/15 bg-slate-950/85 p-1.5 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => onSelectLevel(1)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-3 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isEn ? '⏪ Go to Level 1' : '⏪ Ir al nivel 1'}</span>
          </button>

          <span className="h-4 w-px bg-white/10" />

          <button
            onClick={() => onSelectLevel(activeFrontier)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 px-3.5 py-1.5 text-xs font-black shadow-md transition active:scale-95 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-slate-950" />
            <span>{isEn ? `⚡ Level ${activeFrontier} (Next)` : `⚡ Nivel ${activeFrontier} (siguiente)`}</span>
          </button>
        </div>
      </div>

      {/* Footer Instructions Bar */}
      <footer className="hidden absolute inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-white/10 bg-slate-950/90 px-4 py-2 backdrop-blur-md text-[11px] text-slate-300">
        <span className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-300 inline" />
          <span>{isEn ? 'Select any past level to replay it, or choose the next level to keep progressing!' : '¡Elige un nivel anterior para repetirlo o selecciona el siguiente para avanzar!'}</span>
        </span>
        <button
          onClick={onClose}
          className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-black text-slate-950 shadow hover:bg-amber-300 cursor-pointer transition active:scale-95"
        >
          {isEn ? 'Back to Game' : 'Volver al juego'}
        </button>
      </footer>
    </section>
  );
};
