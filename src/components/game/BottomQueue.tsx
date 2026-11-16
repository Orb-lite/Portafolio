import React from 'react';
import { GameVersion, TileColor } from '../../game/types';
import { GameLanguage, GAME_TEXT, getLocalizedColorName } from '../../game/localization';

export interface QueueRunner {
  id: string;
  color: TileColor;
  capacity: number;
}

interface BottomQueueProps {
  version: GameVersion;
  activeRunnersCount: number;
  maxCapacity: number;
  queueColumns: QueueRunner[][]; // 4 columns, index 0 = front active launcher
  onLaunch: (colIdx: number) => void;
  showTutorialHand: boolean;
  exposedColors?: TileColor[];
  language?: GameLanguage;
}

const FishCardGlyph: React.FC<{ colorClass: string }> = ({ colorClass }) => (
  <svg viewBox="0 0 40 28" className="w-7 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.28)]" aria-hidden="true">
    <path
      d="M 14 14 C 14 6 24 4 32 10 C 36 13 36 15 32 18 C 24 24 14 22 14 14 Z"
      className={colorClass}
      fill="currentColor"
    />
    <path d="M 15 14 L 5 7 L 7 14 L 5 21 Z" className={colorClass} fill="currentColor" />
    <circle cx="29" cy="12" r="2.2" fill="#ffffff" />
    <circle cx="29.6" cy="12" r="1.1" fill="#0f172a" />
  </svg>
);

export const BottomQueue: React.FC<BottomQueueProps> = ({
  version,
  activeRunnersCount,
  maxCapacity = 5,
  queueColumns,
  onLaunch,
  showTutorialHand,
  exposedColors,
  language = 'es',
}) => {
  const isFoF = version === 'fof';
  const availableSlots = Math.max(0, maxCapacity - activeRunnersCount);
  const visibleRows = isFoF ? 3 : 4;
  const firstActiveCol = queueColumns.findIndex((c) => c.length > 0);

  return (
    <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 z-20 flex flex-col items-center pointer-events-none select-none px-2">
      {/* Track Slots HUD */}
      <div className="flex items-center gap-2.5 sm:gap-3 mb-2 pointer-events-auto">
        <div
          className={`flex items-baseline gap-0.5 px-3 py-1 rounded-full font-black text-xs sm:text-sm shadow-lg tabular-nums ${
            isFoF
              ? 'bg-white text-slate-800 border-2 border-sky-200 shadow-[0_6px_16px_rgba(14,116,144,0.28)]'
              : 'bg-slate-900 border border-slate-700 text-white'
          }`}
        >
          <span className={isFoF ? 'text-sky-600' : 'text-amber-300'}>{availableSlots}</span>
          <span className={`${isFoF ? 'text-slate-400' : 'text-slate-400'} font-bold text-[11px]`}>
            /{maxCapacity}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxCapacity }).map((_, idx) => {
            const isFilled = idx < activeRunnersCount;
            return (
              <div
                key={idx}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  isFoF
                    ? isFilled
                      ? 'bg-gradient-to-b from-amber-300 to-orange-500 border-white shadow-[0_3px_10px_rgba(249,115,22,0.45)]'
                      : 'bg-white/90 border-sky-200 shadow-sm'
                    : isFilled
                    ? 'bg-indigo-600 border-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.45)]'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                {isFilled && (
                  <div className={`w-2.5 h-2.5 rounded-full ${isFoF ? 'bg-white' : 'bg-indigo-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Selector Platter: 4 Columns x 3/4 Visible Rows */}
      <div
        className={`relative pointer-events-auto flex gap-2.5 sm:gap-4 justify-center items-end transition-all ${
          isFoF
            ? 'px-5 sm:px-8 pt-4 pb-3 sm:pt-5 sm:pb-3.5 rounded-t-[3.2rem] rounded-b-[2rem] bg-gradient-to-b from-white via-[#f8fafc] to-[#e2e8f0] border-4 border-white shadow-[0_14px_35px_rgba(14,116,144,0.38),0_-3px_8px_rgba(148,163,184,0.28)_inset]'
            : 'px-3 sm:px-6 py-2.5 sm:py-3 rounded-[2rem] bg-slate-900/95 border border-slate-700 shadow-2xl'
        }`}
      >
        {queueColumns.map((col, colIdx) => {
          const frontRunner = col[0];
          const hasRunner = Boolean(frontRunner);

          return (
            <div key={colIdx} className="relative flex flex-col-reverse items-center gap-1 sm:gap-1.5 w-13 sm:w-16">
              {col.slice(0, visibleRows).map((runner, rowIdx) => {
                const isFront = rowIdx === 0;

                const getColorTheme = (color: TileColor) => {
                  if (isFoF) {
                    switch (color) {
                      case 'white':
                        return {
                          card: 'bg-gradient-to-b from-orange-100 to-amber-200 text-slate-900 border-2 border-orange-300',
                          fin: 'text-orange-500',
                          dot: 'bg-orange-500',
                        };
                      case 'black':
                        return {
                          card: 'bg-gradient-to-b from-slate-700 to-slate-900 text-cyan-200 border-2 border-cyan-700',
                          fin: 'text-cyan-300',
                          dot: 'bg-cyan-400',
                        };
                      case 'blue':
                        return {
                          card: 'bg-gradient-to-b from-sky-400 to-blue-600 text-white border-2 border-sky-200',
                          fin: 'text-sky-100',
                          dot: 'bg-sky-200',
                        };
                      case 'yellow':
                        return {
                          card: 'bg-gradient-to-b from-amber-300 to-yellow-500 text-slate-950 border-2 border-yellow-100',
                          fin: 'text-amber-900',
                          dot: 'bg-amber-700',
                        };
                      case 'pink':
                        return {
                          card: 'bg-gradient-to-b from-rose-400 to-pink-600 text-white border-2 border-pink-200',
                          fin: 'text-pink-100',
                          dot: 'bg-pink-200',
                        };
                      case 'green':
                        return {
                          card: 'bg-gradient-to-b from-emerald-400 to-teal-600 text-white border-2 border-emerald-200',
                          fin: 'text-emerald-100',
                          dot: 'bg-emerald-200',
                        };
                      case 'purple':
                        return {
                          card: 'bg-gradient-to-b from-violet-400 to-purple-700 text-white border-2 border-violet-200',
                          fin: 'text-violet-100',
                          dot: 'bg-violet-200',
                        };
                      case 'red':
                        return {
                          card: 'bg-gradient-to-b from-red-400 to-rose-700 text-white border-2 border-red-200',
                          fin: 'text-red-100',
                          dot: 'bg-red-200',
                        };
                      case 'cyan':
                        return {
                          card: 'bg-gradient-to-b from-cyan-300 to-teal-500 text-slate-950 border-2 border-cyan-100',
                          fin: 'text-cyan-950',
                          dot: 'bg-cyan-800',
                        };
                      case 'orange':
                        return {
                          card: 'bg-gradient-to-b from-orange-400 to-red-500 text-white border-2 border-orange-200',
                          fin: 'text-orange-100',
                          dot: 'bg-orange-200',
                        };
                      case 'magenta':
                        return {
                          card: 'bg-gradient-to-b from-fuchsia-400 to-purple-700 text-white border-2 border-fuchsia-200',
                          fin: 'text-fuchsia-100',
                          dot: 'bg-fuchsia-200',
                        };
                      case 'lime':
                        return {
                          card: 'bg-gradient-to-b from-lime-300 to-green-600 text-slate-950 border-2 border-lime-100',
                          fin: 'text-lime-950',
                          dot: 'bg-lime-800',
                        };
                      default:
                        return {
                          card: 'bg-gradient-to-b from-orange-400 to-amber-600 text-white border-2 border-orange-200',
                          fin: 'text-orange-100',
                          dot: 'bg-orange-200',
                        };
                    }
                  } else {
                    switch (color) {
                      case 'white':
                        return { card: 'bg-slate-100 text-slate-900 border-2 border-white', fin: 'text-slate-700', dot: 'bg-slate-300' };
                      case 'black':
                        return { card: 'bg-slate-900 text-white border-2 border-slate-700', fin: 'text-slate-200', dot: 'bg-slate-700' };
                      case 'blue':
                        return { card: 'bg-blue-600 text-white border-2 border-blue-400', fin: 'text-blue-200', dot: 'bg-blue-400' };
                      case 'yellow':
                        return { card: 'bg-amber-400 text-slate-950 border-2 border-yellow-200', fin: 'text-amber-900', dot: 'bg-amber-300' };
                      case 'pink':
                        return { card: 'bg-rose-500 text-white border-2 border-rose-300', fin: 'text-rose-200', dot: 'bg-rose-400' };
                      case 'green':
                        return { card: 'bg-emerald-500 text-white border-2 border-emerald-300', fin: 'text-emerald-200', dot: 'bg-emerald-400' };
                      case 'purple':
                        return { card: 'bg-violet-600 text-white border-2 border-violet-400', fin: 'text-violet-200', dot: 'bg-violet-300' };
                      case 'red':
                        return { card: 'bg-red-600 text-white border-2 border-red-400', fin: 'text-red-200', dot: 'bg-red-300' };
                      case 'cyan':
                        return { card: 'bg-cyan-500 text-slate-950 border-2 border-cyan-300', fin: 'text-cyan-950', dot: 'bg-cyan-200' };
                      case 'orange':
                        return { card: 'bg-orange-500 text-white border-2 border-orange-300', fin: 'text-orange-100', dot: 'bg-orange-200' };
                      case 'magenta':
                        return { card: 'bg-fuchsia-600 text-white border-2 border-fuchsia-400', fin: 'text-fuchsia-200', dot: 'bg-fuchsia-300' };
                      case 'lime':
                        return { card: 'bg-lime-400 text-slate-950 border-2 border-lime-200', fin: 'text-lime-950', dot: 'bg-lime-200' };
                      default:
                        return { card: 'bg-slate-100 text-slate-900 border-2 border-white', fin: 'text-slate-700', dot: 'bg-slate-200' };
                    }
                  }
                };

                const theme = getColorTheme(runner.color);
                const label = getLocalizedColorName(runner.color, isFoF, language);
                const isReadyToAbsorb =
                  isFront && (!exposedColors || exposedColors.length === 0 || exposedColors.includes(runner.color));

                if (isFoF && !isFront) {
                  return (
                    <div
                      key={runner.id}
                      className={`w-10 h-6 sm:w-12 sm:h-7 rounded-xl flex items-center justify-center opacity-80 shadow-sm pointer-events-none ${theme.card}`}
                    >
                      <span className="font-black text-[11px] tabular-nums">{runner.capacity}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={runner.id}
                    type="button"
                    disabled={!isFront || availableSlots <= 0}
                    onClick={() => isFront && onLaunch(colIdx)}
                    className={`relative w-13 h-15 sm:w-16 sm:h-17 rounded-2xl flex flex-col items-center justify-center transition-transform duration-150 ${
                      isFront
                        ? availableSlots > 0
                          ? isReadyToAbsorb
                            ? isFoF
                              ? 'cursor-pointer hover:-translate-y-1 active:scale-95 shadow-lg ring-2 ring-amber-400 ring-offset-2 ring-offset-white'
                              : 'cursor-pointer hover:-translate-y-1 active:scale-95 shadow-xl ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 scale-105'
                            : 'cursor-pointer opacity-75 hover:opacity-100 hover:-translate-y-0.5'
                          : 'opacity-50 cursor-not-allowed'
                        : 'opacity-45 scale-90 -translate-y-0.5 pointer-events-none'
                    } ${theme.card}`}
                  >
                    {!isFoF && (
                      <div className="flex gap-2 absolute -top-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                        <div className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                      </div>
                    )}

                    {isFoF && <FishCardGlyph colorClass={theme.fin} />}

                    <span className="font-black text-sm sm:text-base tracking-tight tabular-nums leading-none mt-0.5">
                      {runner.capacity}
                    </span>

                    <span className="text-[7px] sm:text-[8px] font-extrabold uppercase tracking-wider opacity-90 truncate max-w-[90%]">
                      {label}
                    </span>
                  </button>
                );
              })}

              {showTutorialHand && colIdx === (firstActiveCol >= 0 ? firstActiveCol : 0) && hasRunner && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]" aria-hidden="true">
                      👆
                    </span>
                    <span className="text-[10px] font-black text-amber-200 bg-slate-900 px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap border border-amber-400/50">
                      {GAME_TEXT[language].tapFishHint}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
