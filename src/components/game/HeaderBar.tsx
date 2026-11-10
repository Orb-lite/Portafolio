import React from 'react';
import { GameVersion } from '../../game/types';
import { getThemeName } from '../../game/experience';
import { Volume2, VolumeX, RotateCcw, BookOpen, Sparkles, Heart, Map, Trophy, Database, User, Gamepad2, Fish, Crown, Box, Zap } from 'lucide-react';
import { ComodinesHUD } from './ComodinesHUD';
import { localizeComodin } from '../../game/localization';

interface HeaderBarProps {
  language?: 'en' | 'es';
  version: GameVersion;
  lives: number;
  maxLives: number;
  soundEnabled: boolean;
  speed: number;
  level: number;
  frontierLevel?: number;
  showLevelPathInfo?: boolean;
  simpleAdMode?: boolean;
  tilesAbsorbed: number;
  totalTiles: number;
  gamertag?: string;
  isSupabaseOnline?: boolean;
  onToggleSound: () => void;
  onSpeedChange: (s: number) => void;
  onReset: () => void;
  onOpenDocs: () => void;
  onOpenMap?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenGamertag?: () => void;
  onOpenSupabaseConfig?: () => void;
  selectedComodin?: import('../../game/comodines').ComodinDefinition | null;
  hasUsedComodin?: boolean;
  onOpenComodines?: () => void;
  onActivateComodin?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  language = 'en',
  version,
  lives,
  maxLives,
  soundEnabled,
  speed,
  level,
  frontierLevel,
  showLevelPathInfo = true,
  simpleAdMode = false,
  tilesAbsorbed,
  totalTiles,
  gamertag,
  isSupabaseOnline,
  onToggleSound,
  onSpeedChange,
  onReset,
  onOpenDocs,
  onOpenMap,
  onOpenLeaderboard,
  onOpenGamertag,
  onOpenSupabaseConfig,
  selectedComodin = null,
  hasUsedComodin = false,
  onOpenComodines,
  onActivateComodin,
}) => {
  const isEn = language === 'en';
  const isFoF = version === 'fof';
  const isChess = version === 'chess';
  const progressPct = Math.min(100, Math.round((tilesAbsorbed / Math.max(1, totalTiles)) * 100));

  if (simpleAdMode) {
    return (
      <header className="absolute left-2 right-2 top-2 z-30 flex items-start justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto w-[min(250px,calc(100%-112px))] rounded-xl border border-white/15 bg-slate-950/65 px-2.5 py-2 text-white shadow-lg backdrop-blur-sm sm:w-[280px] sm:px-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-500/25 text-cyan-200">
              <Fish className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-black tracking-wide">Fish Feeder</span>
                <span className="shrink-0 rounded-md bg-cyan-400/15 px-1.5 py-0.5 text-[9px] font-black text-cyan-100">
                  {isEn ? 'LEVEL' : 'NIVEL'} {level}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[9px] font-semibold text-slate-300">
                <span className="truncate">{getThemeName(version, language)}</span>
                <span className="shrink-0">{tilesAbsorbed}/{totalTiles} {isEn ? 'pearls' : 'perlas'}</span>
              </div>
            </div>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-rose-100">
            <Heart className={`h-3 w-3 ${lives > 0 ? 'fill-rose-400 text-rose-300' : 'text-slate-400'}`} />
            <span>{isEn ? 'LIVES' : 'VIDAS'} {lives}/{maxLives}</span>
            {selectedComodin && <span className="ml-auto max-w-[115px] truncate text-amber-200">✦ {localizeComodin(selectedComodin, language)?.name}</span>}
            {hasUsedComodin && <span className="ml-auto text-slate-300">✓ {isEn ? 'Used' : 'Usado'}</span>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 pointer-events-none">
        {onOpenComodines && (
          <button
            type="button"
            onClick={onOpenComodines}
            aria-label={isEn ? 'Open power-ups' : 'Abrir comodines'}
            title={isEn ? 'Power-ups' : 'Comodines'}
          className="pointer-events-auto relative inline-flex h-9 items-center gap-1.5 rounded-xl border border-amber-200/55 bg-gradient-to-r from-amber-500/95 to-orange-500/95 px-2.5 text-slate-950 shadow-md shadow-amber-950/30 transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black">{hasUsedComodin ? (isEn ? 'USED' : 'USADO') : (isEn ? 'POWER-UPS' : 'COMODINES')}</span>
            {selectedComodin && !hasUsedComodin && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-slate-900 bg-emerald-300" />}
          </button>
        )}
        {selectedComodin && !hasUsedComodin && onActivateComodin && (
          <button
            type="button"
            onClick={onActivateComodin}
            aria-label={isEn ? 'Activate power-up' : 'Activar comodín'}
            title={isEn ? 'Activate power-up' : 'Activar comodín'}
            className="pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-xl border-2 border-white/70 bg-emerald-400 px-2.5 text-slate-950 shadow-lg shadow-emerald-950/40 transition hover:scale-105 hover:bg-emerald-300"
          >
            <Zap className="h-4 w-4 fill-current" />
            <span className="text-[10px] font-black">{isEn ? 'USE' : 'USAR'}</span>
          </button>
        )}
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? (isEn ? 'Mute sound' : 'Silenciar sonido') : (isEn ? 'Enable sound' : 'Activar sonido')}
          title={soundEnabled ? (isEn ? 'Mute sound' : 'Silenciar sonido') : (isEn ? 'Enable sound' : 'Activar sonido')}
          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-slate-950/45 text-white/80 backdrop-blur-sm transition hover:bg-slate-950/70"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label={isEn ? 'Restart level' : 'Reiniciar nivel'}
          title={isEn ? 'Restart level' : 'Reiniciar nivel'}
          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-slate-950/45 text-white/80 backdrop-blur-sm transition hover:bg-slate-950/70"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        </div>
      </header>
    );
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-2 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      {/* Left: App Title & Creator Credit */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-xl">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-md transition-all ${
            isFoF
              ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
              : 'bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950'
          }`}
        >
          {isFoF ? <Fish className="w-4 h-4" /> : isChess ? <Crown className="w-4 h-4" /> : <Box className="w-4 h-4" />}
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            {isFoF ? 'Fish Feeder' : 'Conveyor Realms'}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isFoF
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              {isFoF ? (isEn ? 'Fish Feeder' : 'Fish Feeder') : getThemeName(version, language)}
            </span>
          </h1>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-amber-400 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-amber-400 inline" />
              {isEn ? 'By Dimpz Games' : 'Creado por Dimpz Games'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">{isEn ? 'Technical Artist' : 'Artista Técnico'}</span>
          </div>
        </div>
      </div>

      {/* Center: Current board level and lifetime XP HUD */}
      <div className={`pointer-events-auto flex items-center gap-2 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border shadow-2xl ${isFoF ? 'bg-[#06364b]/90 border-cyan-300/40' : 'bg-slate-900/90 border-slate-700/70'}`}>
        {showLevelPathInfo && (
          <div className={`w-7 h-7 rounded-xl ${frontierLevel && level < frontierLevel ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400' : 'bg-gradient-to-tr from-amber-500 to-yellow-300'} text-slate-950 font-black text-xs flex items-center justify-center shadow-md`}>
            {level}
          </div>
        )}
        <div className="flex flex-col min-w-[110px] sm:min-w-[140px]">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <div className="flex items-center gap-1">
              {showLevelPathInfo && <span className="text-amber-400 tracking-wide">{isEn ? 'LEVEL' : 'NIVEL'} {level}</span>}
              {showLevelPathInfo && frontierLevel && level < frontierLevel && (
                <span className="text-[8px] font-black text-emerald-300 bg-emerald-500/20 px-1 py-0.2 rounded border border-emerald-400/40 uppercase">
                  {isEn ? 'Replay' : 'Repetición'}
                </span>
              )}
            </div>
            <span className="text-cyan-100/75 font-black text-[9px] tracking-wider">{isEn ? 'CLEAR THE BOARD' : 'LIMPIA EL TABLERO'}</span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400 mt-1">
            <span>{isFoF ? (isEn ? 'PEARLS' : 'PERLAS') : (isEn ? 'BOARD' : 'TABLERO')}</span>
            <span>{tilesAbsorbed} / {totalTiles} {isEn ? 'TILES' : 'FICHAS'}</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 mt-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2 py-1 text-xs font-bold" title={isEn ? 'Lives' : 'Vidas'}>
          <Heart className={`h-3.5 w-3.5 ${lives > 0 ? 'fill-rose-500 text-rose-400' : 'text-slate-500'}`} />
          <span className={lives > 0 ? 'text-rose-200' : 'text-slate-400'}>{lives}/{maxLives}</span>
        </div>
      </div>

      {/* Center-Right: Level-based world theme & Comodines HUD */}
      <div className="pointer-events-auto flex items-center gap-2">
        {!simpleAdMode && onOpenComodines && onActivateComodin && (
          <ComodinesHUD
            language={language}
            selectedComodin={selectedComodin}
            hasUsedComodin={hasUsedComodin}
            onOpenModal={onOpenComodines}
            onActivate={onActivateComodin}
            level={level}
          />
        )}
        {!simpleAdMode && <div className="hidden md:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/70 shadow-2xl">
          <div className={`px-3 py-1 rounded-xl text-xs font-bold ${isFoF ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'}`}>
            {getThemeName(version, language)}
          </div>
        </div>}
      </div>

      {/* Right: Actions, Leaderboard, Supabase, Audio, Docs */}
      <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-slate-700/60 shadow-xl">
        {/* Gamertag Profile Chip */}
        {!simpleAdMode && gamertag && onOpenGamertag && (
          <button
            onClick={onOpenGamertag}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-black text-cyan-300 transition cursor-pointer"
            title={isEn ? 'Edit Gamertag' : 'Editar Gamertag'}
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[70px] sm:max-w-[105px] truncate">{gamertag}</span>
          </button>
        )}

        {/* Leaderboard High Scores */}
        {!simpleAdMode && onOpenLeaderboard && (
          <button
            onClick={onOpenLeaderboard}
            className="p-1.5 rounded-xl text-amber-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isEn ? 'Hall of Fame / Leaderboard' : 'Salón de la Fama / Clasificación'}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
          </button>
        )}

        {/* Speed toggle */}
        {!simpleAdMode && <button
          onClick={() => onSpeedChange(speed === 1.0 ? 1.5 : speed === 1.5 ? 2.0 : 1.0)}
          className="px-2 py-1 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          title={isEn ? 'Toggle Game Speed' : 'Cambiar velocidad del juego'}
        >
          {speed}x
        </button>}

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title={soundEnabled ? (isEn ? 'Mute Sound' : 'Silenciar') : (isEn ? 'Unmute Sound' : 'Activar sonido')}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title={isEn ? 'Reset Level' : 'Reiniciar nivel'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {!simpleAdMode && onOpenMap && (
          <button onClick={onOpenMap} className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/20 transition" title={isEn ? 'Back to level path' : 'Volver al camino de niveles'}>
            <Map className="w-4 h-4 text-emerald-300" />
            <span>{isEn ? 'Path' : 'Camino'}</span>
          </button>
        )}

        {/* Documentation / Changelog */}
        {!simpleAdMode && <button
          onClick={onOpenDocs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          title={isEn ? 'Open Game Guide' : 'Abrir guía del juego'}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isEn ? 'Game Info' : 'Información'}</span>
        </button>}
      </div>
    </header>
  );
};
