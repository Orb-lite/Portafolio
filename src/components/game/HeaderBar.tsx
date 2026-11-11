import React from 'react';
import { GameVersion } from '../../game/types';
import { getThemeName } from '../../game/experience';
import { GameLanguage, GAME_TEXT } from '../../game/localization';
import { Volume2, VolumeX, RotateCcw, BookOpen, Sparkles, Heart, Map, Trophy, User, Fish, Crown, Box, Zap } from 'lucide-react';
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
  language?: GameLanguage;
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
  language = 'es',
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
  const t = GAME_TEXT[language];
  const progressPct = Math.min(100, Math.round((tilesAbsorbed / Math.max(1, totalTiles)) * 100));

  // Estilo base idéntico a las tarjetas laterales (oscuridad traslúcida + blur + borde suave)
  const cardStyle = "bg-slate-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-2 sm:p-2.5 shadow-2xl transition-all";

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2 select-none">
      
      {/* 1. Izquierda: Título del Juego y Créditos */}
      <div className={`${cardStyle} flex items-center gap-2.5 px-3.5`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-500 flex items-center justify-center font-black text-slate-950 shadow-md shrink-0">
          {isFoF ? <Fish className="w-4 h-4 fill-slate-950 text-slate-950" /> : isChess ? <Crown className="w-4 h-4" /> : <Box className="w-4 h-4" />}
        </div>
        <div className="flex flex-col">
          <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-none">
            {isFoF ? 'Fish Feeder' : 'Conveyor Realms'}
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-cyan-300 border border-white/20">
              {isFoF ? t.fishFeederMode : getThemeName(version, language)}
            </span>
          </h1>
          <div className="flex items-center gap-1.5 text-[10px] mt-1">
            <span className="text-amber-400 font-bold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 inline" />
              By Dimpz Games
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/80 font-medium hidden sm:inline">Technical Artist</span>
          </div>
        </div>
      </div>

      {/* 2. Centro: Nivel, XP acumulada, Pearls y Vidas */}
      <div className={`${cardStyle} flex items-center gap-3 px-3.5`}>
        <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md shrink-0 border border-slate-950">
          {level}
        </div>
        <div className="flex flex-col min-w-[110px] sm:min-w-[140px]">
          <div className="flex justify-between items-center text-[10px] font-extrabold">
            <span className="text-amber-400 tracking-wide uppercase">
              {t.level} {level}
            </span>
            <span className="text-slate-200 font-mono text-[9px]">
              {experience.toLocaleString()} {t.totalXp}
            </span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold text-slate-300 mt-0.5">
            <span>{t.board}</span>
            <span>{tilesAbsorbed} / {totalTiles} {isFoF ? t.pearls : t.tiles}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/20 mt-1">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        
        {/* Contador de Vidas */}
        <div className="flex items-center gap-1 bg-slate-950/30 border border-white/20 rounded-xl px-2.5 py-1 text-xs font-black text-white">
          <Heart className={`h-3.5 w-3.5 ${lives > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
          <span>{lives}/{maxLives}</span>
        </div>
      </div>

      {/* 3. Botón Destacado Power-Ups */}
      <button
        type="button"
        onClick={selectedComodin && !hasUsedComodin ? onActivateComodin : onOpenComodines}
        className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-200/90 uppercase tracking-wider flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Zap className="w-4 h-4 fill-slate-950 text-slate-950 animate-pulse" />
        <span>{selectedComodin ? selectedComodin.name : 'POWER-UPS'}</span>
      </button>

      {/* 4. Derecha: Gamertag, Audio, Velocidad y Botones de Menú */}
      <div className={`${cardStyle} flex items-center gap-1.5`}>
        {gamertag && onOpenGamertag && (
          <button
            type="button"
            onClick={onOpenGamertag}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/30 hover:bg-slate-950/50 border border-white/20 text-xs font-black text-cyan-300 transition cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[70px] sm:max-w-[100px] truncate">{gamertag}</span>
          </button>
        )}

        {onOpenLeaderboard && (
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="p-1.5 rounded-xl text-amber-400 hover:bg-white/10 transition cursor-pointer"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onSpeedChange(speed === 1.0 ? 1.5 : speed === 1.5 ? 2.0 : 1.0)}
          className="px-2 py-1 rounded-xl text-xs font-black text-white bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 transition"
        >
          {speed}x
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          className="p-1.5 rounded-xl text-white hover:bg-white/10 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-xl text-white hover:bg-white/10 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenMap}
          className="flex items-center gap-1 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 px-2.5 py-1 text-xs font-bold text-white transition cursor-pointer"
        >
          <span className="hidden sm:inline">{t.pathway}</span>
        </button>

        <button
          type="button"
          onClick={onOpenDocs}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-white bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 transition cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">{t.gameInfo}</span>
        </button>
      </div>

    </header>
  );
};