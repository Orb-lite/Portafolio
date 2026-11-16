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
  version?: import('../../game/types').GameVersion;
}

export const ComodinesHUD: React.FC<ComodinesHUDProps> = ({
  selectedComodin,
  hasUsedComodin,
  onOpenModal,
  onActivate,
  level,
  language = 'es',
  version = 'fof',
}) => {
  const isFoF = version === 'fof';
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
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
            isFoF
              ? 'bg-white/20 border border-white/50 text-white/70'
              : 'bg-slate-900/80 border border-slate-700/60 text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>{t.used}</span>
        </div>
      ) : localized ? (
        <div
          className={`flex items-center gap-1.5 p-1 rounded-full backdrop-blur-md shadow-lg ${
            isFoF
              ? 'bg-white/25 border-2 border-white/70 shadow-orange-500/20'
              : 'bg-slate-900/90 border border-amber-400/40 shadow-amber-500/10'
          }`}
        >
          <button
            type="button"
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
            title={t.change}
          >
            {renderIcon(localized.iconName)}
            <span className="max-w-[110px] sm:max-w-[140px] truncate">{localized.name}</span>
            <span className="text-[10px] font-black text-amber-300 bg-black/30 px-1.5 py-0.5 rounded-full">
              T{localized.tier}
            </span>
          </button>

          <button
            type="button"
            onClick={onActivate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#ffbe3b] via-[#ff8d00] to-[#e65c00] border-2 border-white/80 text-white font-black text-xs shadow-md shadow-orange-500/40 hover:brightness-110 active:scale-95 transition cursor-pointer animate-pulse"
            title={t.activate}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{t.activateNow}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className={`group relative flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-xs uppercase tracking-wide transition-all active:scale-95 cursor-pointer ${
            isFoF
              ? 'bg-gradient-to-b from-[#ffbe3b] via-[#ff8d00] to-[#e65c00] border-2 border-white/90 text-white shadow-[0_4px_14px_rgba(255,140,0,0.45),0_-1px_3px_rgba(255,255,255,0.4)_inset] hover:brightness-110'
              : 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 text-amber-300 hover:text-amber-200 border border-amber-400/40 shadow-lg backdrop-blur-md'
          }`}
          title={`${t.choosePower} (${t.level} ${level})`}
        >
          {isFoF && (
            <div className="absolute top-1 left-3 right-3 h-1 rounded-full bg-white/40 blur-[0.3px] pointer-events-none" />
          )}
          <Sparkles className="w-3.5 h-3.5 text-white filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">POWER-UPS</span>
        </button>
      )}
    </div>
  );
};
