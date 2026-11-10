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
import { GAME_TEXT, localizeComodin, GameLanguage } from '../../game/localization';

interface ComodinesModalProps {
  language?: GameLanguage;
  isOpen: boolean;
  onClose: () => void;
  options: ComodinDefinition[];
  selectedComodin: ComodinDefinition | null;
  hasUsedComodin: boolean;
  level: number;
  onSelectAndActivate: (comodin: ComodinDefinition, activateImmediately: boolean) => void;
}

export const ComodinesModal: React.FC<ComodinesModalProps> = ({
  language = 'en',
  isOpen,
  onClose,
  options,
  selectedComodin,
  hasUsedComodin,
  level,
  onSelectAndActivate,
}) => {
  if (!isOpen) return null;
  const text = GAME_TEXT[language];

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
    switch (tier) {
      case 1:
        return { label: language === 'en' ? 'TIER I · BASIC TACTICIAN' : 'NIVEL I · TÁCTICA BÁSICA', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' };
      case 2:
        return { label: language === 'en' ? 'TIER II · ADVANCED STRATEGIST' : 'NIVEL II · ESTRATEGA AVANZADO', badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40' };
      case 3:
        return { label: language === 'en' ? 'TIER III · CONVEYOR MASTER' : 'NIVEL III · MAESTRO DE CINTA', badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
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
                  {language === 'en' ? 'Tactical Power-ups' : 'Comodines tácticos'} · {language === 'en' ? 'Level' : 'Nivel'} {level}
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
                  {language === 'en' ? 'Only 1 per Level' : 'Solo 1 por nivel'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${getTierLabel(currentTier).badge}`}>
                  {getTierLabel(currentTier).label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'en' ? 'Power-ups evolve with each level, but each has tactical trade-offs. Study the board and choose wisely!' : 'Los comodines mejoran con cada nivel, pero tienen riesgos tácticos. ¡Analiza el tablero y elige el adecuado!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label={language === 'en' ? 'Close' : 'Cerrar'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert if Comodín Already Used */}
        {hasUsedComodin && (
          <div className="bg-amber-950/60 border-b border-amber-500/30 px-5 py-2.5 flex items-center gap-2.5 text-xs text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{language === 'en' ? 'Power-up already used this level:' : 'Comodín ya utilizado en este nivel:'}</strong> {language === 'en' ? 'You can choose a new power-up when you advance or restart this level.' : 'Podrás elegir uno nuevo al avanzar o reiniciar este nivel.'}
            </span>
          </div>
        )}

        {/* 3 Options Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((comodin, idx) => {
              const localized = localizeComodin(comodin, language);
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
                        {language === 'en' ? 'Option' : 'Opción'} {idx + 1} · {language === 'en' ? 'Tier' : 'Nivel'} {comodin.tier}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                          <Check className="w-3 h-3 text-amber-400" />
                          {language === 'en' ? 'Equipped' : 'Equipado'}
                        </span>
                      )}
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                        style={{ backgroundColor: `${comodin.color}25`, color: comodin.color }}
                      >
                        {renderIcon(comodin.iconName, 'w-6 h-6')}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white leading-snug">
                          {localized.name}
                        </h3>
                        <p className="text-xs font-semibold text-cyan-300">
                          {localized.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 mb-3.5 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                      {localized.description}
                    </p>

                    {/* Tactical Advice box */}
                    <div className="mb-2.5 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-cyan-300 font-bold">{language === 'en' ? 'When to use: ' : 'Cuándo conviene: '}</strong>
                        <span>{localized.tacticalAdvice}</span>
                      </div>
                    </div>

                    {/* Trade-off / Risk warning box */}
                    <div className="mb-4 p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300 font-bold">{language === 'en' ? 'Trade-off / Risk: ' : 'Riesgo / desafío: '}</strong>
                        <span>{localized.tradeoff}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2">
                    {hasUsedComodin ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{text.alreadyUsed}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAndActivate(comodin, false);
                            onClose();
                          }}
                          className={`w-full py-2 px-3 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/15'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isSelected ? text.equipped : text.equip}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectAndActivate(comodin, true);
                            onClose();
                          }}
                          className="w-full py-1.5 px-3 rounded-xl font-bold text-[11px] bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <Zap className="w-3 h-3 fill-white" />
                          <span>{language === 'en' ? 'Activate Now!' : '¡Activar ahora!'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Instructions */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{text.chooseHint}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition active:scale-95"
          >
            {language === 'en' ? 'Back to Game' : 'Volver a la partida'}
          </button>
        </div>
      </div>
    </div>
  );
};
