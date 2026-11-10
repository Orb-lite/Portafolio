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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="fish-game-menu-title">
      <section className="w-full max-w-sm overflow-hidden rounded-3xl border border-cyan-300/25 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl">
        <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-200"><Fish className="h-6 w-6" /></div>
          <div className="min-w-0 flex-1">
            <h2 id="fish-game-menu-title" className="text-lg font-black">{isEn ? 'Game Menu' : 'Menú del juego'}</h2>
            <p className="text-xs font-semibold text-slate-400">{isEn ? `Level ${level} · Pathway record ${frontierLevel}` : `Nivel ${level} · Récord del camino ${frontierLevel}`}</p>
          </div>
          <button type="button" onClick={onResume} aria-label={isEn ? 'Close menu' : 'Cerrar menú'} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"><X className="h-4 w-4" /></button>
        </header>

        <div className="space-y-2 p-4">
          <button type="button" onClick={onResume} className="flex w-full items-center gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-4 py-3 text-left hover:bg-emerald-400/25">
            <Play className="h-5 w-5 fill-emerald-200 text-emerald-200" />
            <span className="font-black">{isEn ? 'Continue playing' : 'Seguir jugando'}</span>
          </button>
          <button type="button" onClick={onOpenPathway} className="flex w-full items-center gap-3 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-left hover:bg-cyan-400/20">
            <Map className="h-5 w-5 text-cyan-200" />
            <span className="flex-1 font-black">{isEn ? 'Level pathway' : 'Camino de niveles'}</span>
            <span className="rounded-full bg-cyan-200/10 px-2 py-1 text-[10px] font-black text-cyan-100">{isEn ? `UP TO ${frontierLevel}` : `HASTA ${frontierLevel}`}</span>
          </button>
          <button type="button" onClick={onOpenPowerUps} className="flex w-full items-center gap-3 rounded-2xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-left hover:bg-amber-400/20">
            <Sparkles className="h-5 w-5 text-amber-200" />
            <span className="font-black">{isEn ? 'Power-ups' : 'Comodines'}</span>
          </button>
          <button type="button" onClick={onRestart} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-slate-200 hover:bg-white/10">
            <RotateCcw className="h-5 w-5" />
            <span className="font-bold">{isEn ? 'Restart level' : 'Reiniciar nivel'}</span>
          </button>
          {onBackToPortfolio && (
            <button type="button" onClick={onBackToPortfolio} className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>{isEn ? 'Back to portfolio' : 'Volver al portafolio'}</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
