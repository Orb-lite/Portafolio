import React from 'react';
import { GameVersion } from '../../game/types';
import { getThemeName } from '../../game/experience';
import { Volume2, VolumeX, RotateCcw, BookOpen, Sparkles, Heart, Map, Trophy, Database, User, Gamepad2, Fish, Crown, Box } from 'lucide-react';
import { ComodinesHUD } from './ComodinesHUD';

interface HeaderBarProps {
  version: GameVersion;
  lives: number;
  maxLives: number;
  soundEnabled: boolean;
  speed: number;
  level: number;
  frontierLevel?: number;
  experience: number;
  tilesAbsorbed: number;
  totalTiles: number;
  gamertag?: string;
  isSupabaseOnline?: boolean;
  onToggleSound: () => void;
  onSpeedChange: (s: number) => void;
  onReset: () => void;
  onOpenDocs: () => void;
  onOpenMap: () => void;
  onOpenLeaderboard?: () => void;
  onOpenGamertag?: () => void;
  onOpenSupabaseConfig?: () => void;
  selectedComodin?: import('../../game/comodines').ComodinDefinition | null;
  hasUsedComodin?: boolean;
  onOpenComodines?: () => void;
  onActivateComodin?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  version,
  lives,
  maxLives,
  soundEnabled,
  speed,
  level,
  frontierLevel,
  experience,
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
  const isFoF = version === 'fof';
  const isChess = version === 'chess';
  const progressPct = Math.min(100, Math.round((tilesAbsorbed / Math.max(1, totalTiles)) * 100));

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
            Conveyor Realms
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isFoF
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              {isFoF ? 'Fish of Fortune' : getThemeName(version)}
            </span>
          </h1>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-amber-400 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-amber-400 inline" />
              By Dimpz Games
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Technical Artist</span>
          </div>
        </div>
      </div>

      {/* Center: Current board level and lifetime XP HUD */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-700/70 shadow-2xl">
        <div className={`w-7 h-7 rounded-xl ${frontierLevel && level < frontierLevel ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400' : 'bg-gradient-to-tr from-amber-500 to-yellow-300'} text-slate-950 font-black text-xs flex items-center justify-center shadow-md`}>
          {level}
        </div>
        <div className="flex flex-col min-w-[110px] sm:min-w-[140px]">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <div className="flex items-center gap-1">
              <span className="text-amber-400 tracking-wide">LEVEL {level}</span>
              {frontierLevel && level < frontierLevel && (
                <span className="text-[8px] font-black text-emerald-300 bg-emerald-500/20 px-1 py-0.2 rounded border border-emerald-400/40 uppercase">
                  Replay
                </span>
              )}
            </div>
            <span className="text-slate-300 font-mono text-[9px]">{experience.toLocaleString()} TOTAL XP</span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400 mt-1">
            <span>BOARD</span>
            <span>{tilesAbsorbed} / {totalTiles} TILES</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 mt-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2 py-1 text-xs font-bold" title="Lives">
          <Heart className={`h-3.5 w-3.5 ${lives > 0 ? 'fill-rose-500 text-rose-400' : 'text-slate-500'}`} />
          <span className={lives > 0 ? 'text-rose-200' : 'text-slate-400'}>{lives}/{maxLives}</span>
        </div>
      </div>

      {/* Center-Right: Level-based world theme & Comodines HUD */}
      <div className="pointer-events-auto flex items-center gap-2">
        {onOpenComodines && onActivateComodin && (
          <ComodinesHUD
            selectedComodin={selectedComodin}
            hasUsedComodin={hasUsedComodin}
            onOpenModal={onOpenComodines}
            onActivate={onActivateComodin}
            level={level}
          />
        )}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/70 shadow-2xl">
          <div className={`px-3 py-1 rounded-xl text-xs font-bold ${isFoF ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'}`}>
            {getThemeName(version)}
          </div>
        </div>
      </div>

      {/* Right: Actions, Leaderboard, Supabase, Audio, Docs */}
      <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-slate-700/60 shadow-xl">
        {/* Gamertag Profile Chip */}
        {gamertag && onOpenGamertag && (
          <button
            onClick={onOpenGamertag}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-black text-cyan-300 transition cursor-pointer"
            title="Editar Gamertag"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[70px] sm:max-w-[105px] truncate">{gamertag}</span>
          </button>
        )}

        {/* Leaderboard High Scores */}
        {onOpenLeaderboard && (
          <button
            onClick={onOpenLeaderboard}
            className="p-1.5 rounded-xl text-amber-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Salón de la Fama / Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
          </button>
        )}

        {/* Speed toggle */}
        <button
          onClick={() => onSpeedChange(speed === 1.0 ? 1.5 : speed === 1.5 ? 2.0 : 1.0)}
          className="px-2 py-1 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          title="Toggle Game Speed"
        >
          {speed}x
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Reset Level"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button onClick={onOpenMap} className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/20 transition" title="Back to level path">
          <Map className="w-4 h-4 text-emerald-300" />
          <span>Path</span>
        </button>

        {/* Documentation / Changelog */}
        <button
          onClick={onOpenDocs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          title="Open Game Guide"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Game Info</span>
        </button>
      </div>
    </header>
  );
};
