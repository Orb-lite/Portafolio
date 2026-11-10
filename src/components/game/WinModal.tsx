import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameVersion } from '../../game/types';
import { Trophy, Star, RotateCcw, Sparkles, Map, Zap, CheckCircle2 } from 'lucide-react';

interface WinModalProps {
  language?: 'en' | 'es';
  version: GameVersion;
  level: number;
  frontierLevel?: number;
  timeElapsed: number;
  totalTiles: number;
  xpEarned: number;
  onBackToPath?: () => void;
  onNextLevel: () => void;
  onJumpToFrontier?: () => void;
  onRestart: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  language = 'en',
  version,
  level,
  frontierLevel,
  timeElapsed,
  totalTiles,
  xpEarned,
  onBackToPath,
  onNextLevel,
  onJumpToFrontier,
  onRestart,
}) => {
  const isEn = language === 'en';
  useEffect(() => {
    // Joyful celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: version === 'fof' ? ['#38bdf8', '#f59e0b', '#06b6d4', '#f43f5e'] : ['#f8fafc', '#94a3b8', '#6366f1', '#e2e8f0'],
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
      return () => clearTimeout(timeout);
    } catch {
      // fallback
    }
  }, [version]);

  const isFoF = version === 'fof';
  const isReplay = typeof frontierLevel === 'number' && level < frontierLevel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[2px] sm:backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden">
        {/* Quick Pathway Button */}
        {onBackToPath && (
          <button
            type="button"
            onClick={onBackToPath}
            aria-label={isEn ? 'Back to Path' : 'Volver al camino'}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-md"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'Pathway' : 'Camino'}</span>
          </button>
        )}

        {/* Glow ambient background */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full filter blur-3xl opacity-30 ${
            isFoF ? 'bg-cyan-500' : 'bg-indigo-500'
          }`}
        />

        {/* Trophy icon */}
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl mb-4">
          <Trophy className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1.5 mb-2 text-amber-400">
          <Star className="w-6 h-6 fill-amber-400" />
          <Star className="w-7 h-7 fill-amber-400 -translate-y-1" />
          <Star className="w-6 h-6 fill-amber-400" />
        </div>

        {isReplay && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-black text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            {isEn ? 'Past Level Cleared' : 'Nivel anterior superado'}
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isReplay ? (isEn ? `Level ${level} replayed!` : `¡Nivel ${level} repetido!`) : (isEn ? `Level ${level} complete!` : `¡Nivel ${level} completado!`)}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {isReplay
            ? (isEn ? `Your main progress is safe at Level ${frontierLevel} (frontier).` : `Tu progreso principal está a salvo en el nivel ${frontierLevel} (por superar).`)
            : isFoF
            ? (isEn ? 'All pearls and bubbles have been absorbed!' : '¡Se absorbieron todas las perlas y burbujas!')
            : (isEn ? 'All pieces and shields have been cleared!' : '¡Se despejaron todas las piezas y escudos!')}
        </p>

        {/* Stats card */}
        <div className="grid grid-cols-3 gap-2 my-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 text-left">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Absorbed' : 'Absorbidas'}</p>
            <p className="text-base sm:text-lg font-black text-white">{totalTiles}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Time' : 'Tiempo'}</p>
            <p className="text-base sm:text-lg font-black text-emerald-400">{timeElapsed}s</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'XP Earned' : 'XP obtenidos'}</p>
            <p className="text-base sm:text-lg font-black text-amber-400">+{xpEarned}</p>
          </div>
        </div>

        {/* Auto-save confirmation pill */}
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 mb-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{isEn ? 'Progress saved automatically to cache and cloud' : 'Progreso guardado automáticamente en caché y nube'}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> {isEn ? `Continue to Level ${level + 1}` : `Continuar al nivel ${level + 1}`}
          </button>

          {isReplay && onJumpToFrontier && frontierLevel && (
            <button
              onClick={onJumpToFrontier}
              className="w-full py-3 rounded-xl font-bold text-sm bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/50 flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400" /> {isEn ? `Go to Level ${frontierLevel} (frontier)` : `Ir al nivel ${frontierLevel} (por superar)`}
            </button>
          )}

          {onBackToPath && (
            <button
              onClick={onBackToPath}
              className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Map className="w-4 h-4 text-emerald-300" /> {isEn ? 'Back to Pathway' : 'Volver al camino'}
            </button>
          )}

          <button
            onClick={onRestart}
            className="py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {isEn ? 'Replay this Level' : 'Repetir este nivel'}
          </button>
        </div>

        {/* Isaac Gómez credit */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-1 text-[11px] text-amber-400/90 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          {isEn ? 'By Dimpz Games' : 'Creado por Dimpz Games'}
        </div>
      </div>
    </div>
  );
};
