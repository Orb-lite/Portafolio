import React from 'react';
import {
  Zap,
  Sparkles,
  CheckCircle2,
  Magnet,
  Shuffle,
  ShieldAlert,
  RefreshCw,
  Layers,
  Clock,
  Flame,
  Compass,
} from 'lucide-react';
import { ComodinDefinition } from '../../game/comodines';
import { GameLanguage, GAME_TEXT, localizeComodin } from '../../game/localization';

interface ComodinesHUDProps {
  selectedComodin: ComodinDefinition | null;
  hasUsedComodin: boolean;
  onOpenModal: () => void;
  onActivate: () => void;
  level: number;
  language?: GameLanguage;
}

export const ComodinesHUD: React.FC<ComodinesHUDProps> = ({
  selectedComodin,
  hasUsedComodin,
  onOpenModal,
  onActivate,
  level,
  language = 'es',
}) => {
  const t = GAME_TEXT[language];
  const localized = selectedComodin ? localizeComodin(selectedComodin, language) : null;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'magnet':
        return <Magnet className="w-4 h-4 text-cyan-300" />;
      case 'shuffle':
        return <Shuffle className="w-4 h-4 text-amber-300" />;
      case 'shield-alert':
        return <ShieldAlert className="w-4 h-4 text-emerald-300" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-pink-300" />;
      case 'refresh-cw':
        return <RefreshCw className="w-4 h-4 text-teal-300" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-blue-300" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-yellow-300" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-orange-300" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-purple-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-300" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {hasUsedComodin ? (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 text-xs font-semibold backdrop-blur-md shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.used}</span>
        </div>
      ) : localized ? (
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-amber-400/40 backdrop-blur-md shadow-lg shadow-amber-500/10">
          <button
            type="button"
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 transition cursor-pointer"
            title={t.change}
          >
            {renderIcon(localized.iconName)}
            <span className="max-w-[110px] sm:max-w-[140px] truncate">{localized.name}</span>
            <span className="text-[10px] font-black text-amber-400 bg-amber-400/20 px-1.5 py-0.2 rounded-md">
              T{localized.tier}
            </span>
          </button>

          <button
            type="button"
            onClick={onActivate}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition active:scale-95 cursor-pointer animate-pulse"
            title={t.activate}
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>{t.activateNow}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 text-amber-300 hover:text-amber-200 border border-amber-400/40 font-black text-xs shadow-lg backdrop-blur-md transition active:scale-95 cursor-pointer"
          title={`${t.choosePower} (${t.level} ${level})`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.powerTitle} ({t.options})</span>
        </button>
      )}
    </div>
  );
};
