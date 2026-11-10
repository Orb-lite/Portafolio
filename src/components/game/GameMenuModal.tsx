import React from 'react';
import { ArrowLeft, Fish, Map, Play, RotateCcw, Sparkles, X } from 'lucide-react';

interface GameMenuModalProps {
  language: 'en' | 'es';
  level: number;
  frontierLevel: number;
  onResume: () => void;
  onOpenPathway: () => void;
  onOpenPowerUps: () => void;
  onRestart: () => void;
  onBackToPortfolio?: () => void;
}

export const GameMenuModal: React.FC<GameMenuModalProps> = ({
  language,
  level,
  frontierLevel,
  onResume,
  onOpenPathway,
  onOpenPowerUps,
  onRestart,
  onBackToPortfolio,
}) => {
  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="fish-game-menu-title">
      <section className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border-2 border-white/70 backdrop-blur-2xl bg-white/20 text-white shadow-[0_20px_50px_rgba(8,145,178,0.35)] p-5">
        {/* Top highlight specular curved reflection arc */}
        <div className="absolute top-1 left-8 right-8 h-2 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

        <header className="flex items-center gap-3 border-b border-white/25 pb-3.5 mb-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/30 border border-white/80">
            <Fish className="h-6 w-6 fill-white text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="fish-game-menu-title" className="text-xl font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{isEn ? 'Game Menu' : 'Menú del juego'}</h2>
            <p className="text-xs font-bold text-white/80">{isEn ? `Level ${level} · Pathway record ${frontierLevel}` : `Nivel ${level} · Récord del camino ${frontierLevel}`}</p>
          </div>
          <button type="button" onClick={onResume} aria-label={isEn ? 'Close menu' : 'Cerrar menú'} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 border border-white/50 cursor-pointer transition">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onResume}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-white/80 bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-700 px-5 py-3 text-white font-black shadow-lg shadow-emerald-500/35 hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Play className="h-5 w-5 fill-white text-white" />
            <span>{isEn ? 'Continue playing' : 'Seguir jugando'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPathway}
            className="flex w-full items-center gap-3 rounded-full border border-white/60 bg-white/20 hover:bg-white/30 px-5 py-3 text-left font-bold text-white backdrop-blur-md transition active:scale-95 cursor-pointer shadow-sm"
          >
            <Map className="h-5 w-5 text-emerald-200" />
            <span className="flex-1">{isEn ? 'Level pathway' : 'Camino de niveles'}</span>
            <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-black text-white border border-white/40">{isEn ? `UP TO ${frontierLevel}` : `HASTA ${frontierLevel}`}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPowerUps}
            className="flex w-full items-center gap-3 rounded-full border-2 border-white/80 bg-gradient-to-b from-[#ffbe3b] via-[#ff8d00] to-[#e65c00] px-5 py-3 text-left font-black text-white shadow-md shadow-orange-500/35 hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Sparkles className="h-5 w-5 text-white" />
            <span className="flex-1">{isEn ? 'Power-ups' : 'Comodines'}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex w-full items-center gap-3 rounded-full border border-white/50 bg-white/15 hover:bg-white/25 px-5 py-2.5 text-left text-white/90 font-semibold backdrop-blur-md transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-amber-200" />
            <span>{isEn ? 'Restart level' : 'Reiniciar nivel'}</span>
          </button>

          {onBackToPortfolio && (
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-center text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{isEn ? 'Back to portfolio' : 'Volver al portafolio'}</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
