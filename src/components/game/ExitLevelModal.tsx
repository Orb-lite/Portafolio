import React from 'react';
import { AlertTriangle, ArrowLeft, Play } from 'lucide-react';
import { GameLanguage, GAME_TEXT } from '../../game/localization';

interface ExitLevelModalProps {
  level: number;
  language?: GameLanguage;
  onStay: () => void;
  onExit: () => void;
}

export const ExitLevelModal: React.FC<ExitLevelModalProps> = ({
  level,
  language = 'es',
  onStay,
  onExit,
}) => {
  const t = GAME_TEXT[language];
  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="exit-level-title">
      <section className="w-full max-w-sm rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center text-slate-200 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 id="exit-level-title" className="text-xl font-black text-white">
          {isEn ? `Leave Level ${level}?` : `¿Abandonar Nivel ${level}?`}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {t.exitDesc}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button onClick={onStay} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-300 cursor-pointer">
            <Play className="h-4 w-4 fill-current" />
            <span>{t.stayInLevel}</span>
          </button>
          <button onClick={onExit} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            <span>{t.exitToMap}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
