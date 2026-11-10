import React from 'react';
import {
  X,
  Sparkles,
  Zap,
  Magnet,
  Shuffle,
  ShieldAlert,
  RefreshCw,
  Layers,
  Clock,
  Flame,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Check,
  Lock,
} from 'lucide-react';
import { ComodinDefinition, ComodinTier } from '../../game/comodines';
import { GameLanguage, GAME_TEXT, localizeComodin } from '../../game/localization';

interface ComodinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ComodinDefinition[];
  selectedComodin: ComodinDefinition | null;
  hasUsedComodin: boolean;
  level: number;
  language?: GameLanguage;
  onSelectAndActivate: (comodin: ComodinDefinition, activateImmediately: boolean) => void;
}

export const ComodinesModal: React.FC<ComodinesModalProps> = ({
  isOpen,
  onClose,
  options,
  selectedComodin,
  hasUsedComodin,
  level,
  language = 'es',
  onSelectAndActivate,
}) => {
  if (!isOpen) return null;

  const t = GAME_TEXT[language];
  const isEn = language === 'en';
  const currentTier: ComodinTier = level >= 10 ? 3 : level >= 5 ? 2 : 1;

  const renderIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'magnet':
        return <Magnet className={className} />;
      case 'shuffle':
        return <Shuffle className={className} />;
      case 'shield-alert':
        return <ShieldAlert className={className} />;
      case 'zap':
        return <Zap className={className} />;
      case 'refresh-cw':
        return <RefreshCw className={className} />;
      case 'layers':
        return <Layers className={className} />;
      case 'clock':
        return <Clock className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'compass':
        return <Compass className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const getTierLabel = (tier: ComodinTier) => {
    if (isEn) {
      switch (tier) {
        case 1:
          return { label: 'Tier 1 · Starter', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
        case 2:
          return { label: 'Tier 2 · Advanced', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
        case 3:
          return { label: 'Tier 3 · Master', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      }
    }
    switch (tier) {
      case 1:
        return { label: 'Tier 1 · Básico', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 2:
        return { label: 'Tier 2 · Avanzado', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
      case 3:
        return { label: 'Tier 3 · Maestro', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="relative z-20 px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg font-black text-sm">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {t.powerTitle} · {t.level} {level}
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
                  {isEn ? '1 per Level' : 'Solo 1 por Nivel'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${getTierLabel(currentTier).badge}`}>
                  {getTierLabel(currentTier).label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.chooseHint}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert if Comodín Already Used */}
        {hasUsedComodin && (
          <div className="bg-amber-950/60 border-b border-amber-500/30 px-5 py-2.5 flex items-center gap-2.5 text-xs text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{t.alreadyUsed}:</strong> {isEn ? 'You can pick a new power-up on the next level or upon restart.' : 'Podrás elegir un nuevo comodín al avanzar al siguiente nivel o al reiniciar este nivel.'}
            </span>
          </div>
        )}

        {/* 3 Options Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((comodin, idx) => {
              const loc = localizeComodin(comodin, language);
              const isSelected = selectedComodin?.id === comodin.id;
              const tierInfo = getTierLabel(comodin.tier);

              return (
                <div
                  key={comodin.id}
                  className={`relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-b from-slate-900 to-amber-950/40 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/40'
                      : comodin.borderClass + ' bg-gradient-to-b ' + comodin.bgGradient
                  } ${hasUsedComodin && !isSelected ? 'opacity-60' : ''}`}
                >
                  {/* Top card info */}
                  <div>
                    {/* Tier badge & number */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${tierInfo.badge}`}>
                        {isEn ? `Option ${idx + 1}` : `Opción ${idx + 1}`} · Tier {comodin.tier}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                          <Check className="w-3 h-3 text-amber-400" />
                          {t.equipped}
                        </span>
                      )}
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'bg-slate-800/80 text-white border-slate-700/80'
                        }`}
                      >
                        {renderIcon(comodin.iconName)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white leading-tight">{loc.name}</h3>
                        <p className="text-[11px] font-bold text-amber-300 mt-0.5">{loc.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{loc.description}</p>

                    {/* Tactical Pros & Cons */}
                    <div className="space-y-2 mb-4">
                      {/* Pro Advice */}
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-[11px] leading-snug">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-emerald-300 font-bold mb-0.5">{t.tacticalAdviceLabel}:</strong>
                          {loc.tacticalAdvice}
                        </div>
                      </div>

                      {/* Tradeoff Alert */}
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-[11px] leading-snug">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-rose-300 font-bold mb-0.5">{t.tradeoffLabel}:</strong>
                          {loc.tradeoff}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                    {hasUsedComodin ? (
                      <div className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{t.used}</span>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAndActivate(comodin, false);
                            onClose();
                          }}
                          className={`w-full py-2.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>{isSelected ? t.equipped : t.equip}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectAndActivate(comodin, true);
                            onClose();
                          }}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Zap className="w-3 h-3 fill-slate-950" />
                          <span>{t.activateNow}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Power-ups change every level with random tactical rolls.' : 'Los comodines se renuevan en cada nivel con tiradas tácticas aleatorias.'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer text-xs"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
