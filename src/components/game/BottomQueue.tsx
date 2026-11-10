import React from 'react';
import { GameVersion, TileColor } from '../../game/types';

export interface QueueRunner {
  id: string;
  color: TileColor;
  capacity: number;
}

interface BottomQueueProps {
  version: GameVersion;
  activeRunnersCount: number;
  maxCapacity: number;
  queueColumns: QueueRunner[][]; // 4 columns
  onLaunch: (colIdx: number) => void;
  showTutorialHand: boolean;
  exposedColors?: TileColor[];
}

export const BottomQueue: React.FC<BottomQueueProps> = ({
  version,
  activeRunnersCount,
  maxCapacity = 5,
  queueColumns,
  onLaunch,
  showTutorialHand,
  exposedColors,
}) => {
  const isFoF = version === 'fof';
  const availableSlots = Math.max(0, maxCapacity - activeRunnersCount);

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-20 flex flex-col items-center pointer-events-none select-none">
      {/* Track Slots HUD */}
      <div className="flex items-center gap-3 sm:gap-4 mb-2 pointer-events-auto">
        {/* Counter indicator matching reference video: e.g. "5/5", "4/5" */}
        <div className="flex items-baseline gap-0.5 px-3 py-1 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg text-white font-black text-sm sm:text-base">
          <span className="text-amber-400">{availableSlots}</span>
          <span className="text-slate-400 font-semibold text-xs sm:text-sm">/{maxCapacity}</span>
        </div>

        {/* 5 slot boxes matching reference video */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: maxCapacity }).map((_, idx) => {
            const isFilled = idx < activeRunnersCount;
            return (
              <div
                key={idx}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                  isFilled
                    ? isFoF
                      ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                      : 'bg-indigo-600/30 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                    : 'bg-slate-900/60 border-slate-700/60'
                }`}
              >
                {isFilled && (
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      isFoF ? 'bg-cyan-300 shadow-sm' : 'bg-indigo-300 shadow-sm'
                    } animate-pulse`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Runner Columns matching reference video */}
      <div className="relative bg-slate-900/75 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 rounded-3xl border border-slate-700/70 shadow-2xl pointer-events-auto flex gap-3 sm:gap-5 justify-center items-end">
        {queueColumns.map((col, colIdx) => {
          const frontRunner = col[0];
          const hasRunner = Boolean(frontRunner);

          return (
            <div key={colIdx} className="relative flex flex-col-reverse items-center gap-1 sm:gap-1.5 w-12 sm:w-14">
              {/* Remaining runners in column (stacked upward) */}
              {col.slice(0, 4).map((runner, rowIdx) => {
                const isFront = rowIdx === 0;

                // Color styling for all 6 colors across both themes
                const getColorTheme = (color: TileColor) => {
                  if (isFoF) {
                    switch (color) {
                      case 'white':
                        return {
                          card: 'bg-gradient-to-b from-orange-50 to-amber-100 text-slate-900 border-2 border-orange-300 shadow-orange-500/20',
                          fin: 'bg-orange-500',
                          label: 'CLOWN',
                        };
                      case 'black':
                        return {
                          card: 'bg-gradient-to-b from-slate-800 to-slate-950 text-cyan-200 border-2 border-cyan-800/80 shadow-cyan-950/40',
                          fin: 'bg-cyan-400',
                          label: 'ANGLER',
                        };
                      case 'blue':
                        return {
                          card: 'bg-gradient-to-b from-sky-500 to-blue-700 text-white border-2 border-sky-300 shadow-blue-500/30',
                          fin: 'bg-sky-300',
                          label: 'TANG',
                        };
                      case 'yellow':
                        return {
                          card: 'bg-gradient-to-b from-amber-400 to-yellow-500 text-slate-950 border-2 border-yellow-200 shadow-amber-500/30',
                          fin: 'bg-yellow-200',
                          label: 'TANG JR',
                        };
                      case 'pink':
                        return {
                          card: 'bg-gradient-to-b from-rose-400 to-pink-600 text-white border-2 border-pink-300 shadow-pink-500/30',
                          fin: 'bg-pink-300',
                          label: 'AXOLOTL',
                        };
                      case 'green':
                        return {
                          card: 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white border-2 border-emerald-300 shadow-emerald-500/30',
                          fin: 'bg-emerald-300',
                          label: 'TURTLE',
                        };
                      case 'purple':
                        return { card: 'bg-gradient-to-b from-violet-500 to-purple-800 text-white border-2 border-violet-300 shadow-violet-500/30', fin: 'bg-violet-300', label: 'PUFFER' };
                      case 'red':
                        return { card: 'bg-gradient-to-b from-red-500 to-rose-800 text-white border-2 border-red-300 shadow-red-500/30', fin: 'bg-red-300', label: 'LIONFISH' };
                      case 'cyan':
                        return { card: 'bg-gradient-to-b from-cyan-400 to-teal-600 text-slate-950 border-2 border-cyan-200 shadow-cyan-500/30', fin: 'bg-cyan-100', label: 'BETTA' };
                      case 'orange':
                        return { card: 'bg-gradient-to-b from-orange-500 to-red-600 text-white border-2 border-orange-300 shadow-orange-500/30', fin: 'bg-orange-200', label: 'CLOWN' };
                      case 'magenta':
                        return { card: 'bg-gradient-to-b from-fuchsia-500 to-purple-700 text-white border-2 border-fuchsia-300 shadow-fuchsia-500/30', fin: 'bg-fuchsia-200', label: 'MAGENTA' };
                      case 'lime':
                        return { card: 'bg-gradient-to-b from-lime-400 to-green-600 text-slate-950 border-2 border-lime-200 shadow-lime-500/30', fin: 'bg-lime-100', label: 'LIME' };
                      default:
                        return {
                          card: 'bg-gradient-to-b from-orange-400 to-amber-600 text-white border-2 border-orange-300',
                          fin: 'bg-orange-300',
                          label: 'FISH',
                        };
                    }
                  } else {
                    switch (color) {
                      case 'white':
                        return {
                          card: 'bg-slate-100 text-slate-900 border-2 border-white shadow-slate-950/20',
                          fin: 'bg-slate-200',
                          label: 'WHITE',
                        };
                      case 'black':
                        return {
                          card: 'bg-slate-900 text-white border-2 border-slate-700 shadow-slate-950/40',
                          fin: 'bg-slate-800',
                          label: 'BLACK',
                        };
                      case 'blue':
                        return {
                          card: 'bg-blue-600 text-white border-2 border-blue-400 shadow-blue-900/30',
                          fin: 'bg-blue-400',
                          label: 'BLUE',
                        };
                      case 'yellow':
                        return {
                          card: 'bg-amber-400 text-slate-950 border-2 border-yellow-200 shadow-amber-900/30',
                          fin: 'bg-amber-300',
                          label: 'YELLOW',
                        };
                      case 'pink':
                        return {
                          card: 'bg-rose-500 text-white border-2 border-rose-300 shadow-rose-900/30',
                          fin: 'bg-rose-400',
                          label: 'PINK',
                        };
                      case 'green':
                        return {
                          card: 'bg-emerald-500 text-white border-2 border-emerald-300 shadow-emerald-900/30',
                          fin: 'bg-emerald-400',
                          label: 'GREEN',
                        };
                      case 'purple':
                        return { card: 'bg-violet-600 text-white border-2 border-violet-400 shadow-violet-900/30', fin: 'bg-violet-300', label: 'PURPLE' };
                      case 'red':
                        return { card: 'bg-red-600 text-white border-2 border-red-400 shadow-red-900/30', fin: 'bg-red-300', label: 'RED' };
                      case 'cyan':
                        return { card: 'bg-cyan-500 text-slate-950 border-2 border-cyan-300 shadow-cyan-900/30', fin: 'bg-cyan-200', label: 'CYAN' };
                      case 'orange':
                        return { card: 'bg-orange-500 text-white border-2 border-orange-300 shadow-orange-900/30', fin: 'bg-orange-200', label: 'ORANGE' };
                      case 'magenta':
                        return { card: 'bg-fuchsia-600 text-white border-2 border-fuchsia-400 shadow-fuchsia-900/30', fin: 'bg-fuchsia-300', label: 'MAGENTA' };
                      case 'lime':
                        return { card: 'bg-lime-400 text-slate-950 border-2 border-lime-200 shadow-lime-900/30', fin: 'bg-lime-200', label: 'LIME' };
                      default:
                        return {
                          card: 'bg-slate-100 text-slate-900 border-2 border-white',
                          fin: 'bg-slate-200',
                          label: 'RUNNER',
                        };
                    }
                  }
                };

                const theme = getColorTheme(runner.color);

                const isReadyToAbsorb = isFront && (!exposedColors || exposedColors.length === 0 || exposedColors.includes(runner.color));

                return (
                  <button
                    key={runner.id}
                    disabled={!isFront || availableSlots <= 0}
                    onClick={() => isFront && onLaunch(colIdx)}
                    className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                      isFront
                        ? availableSlots > 0
                          ? isReadyToAbsorb
                            ? 'cursor-pointer hover:-translate-y-1 active:scale-95 shadow-xl ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 scale-105'
                            : 'cursor-pointer opacity-70 hover:opacity-100 hover:-translate-y-0.5'
                          : 'opacity-50 cursor-not-allowed'
                        : 'opacity-40 scale-90 -translate-y-1 pointer-events-none'
                    } ${theme.card}`}
                  >
                    {/* Ears or Fish Fin Top Accent */}
                    {isFoF ? (
                      <div className="flex gap-1 absolute -top-1.5">
                        <div className={`w-2 h-2 rounded-full ${theme.fin}`} />
                      </div>
                    ) : (
                      <div className="flex gap-2 absolute -top-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${theme.fin}`} />
                        <div className={`w-2.5 h-2.5 rounded-full ${theme.fin}`} />
                      </div>
                    )}

                    {/* Number Badge */}
                    <span className="font-black text-sm sm:text-base tracking-tight z-10">
                      {runner.capacity}
                    </span>

                    {/* Sub-label/icon */}
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider opacity-85">
                      {theme.label}
                    </span>
                  </button>
                );
              })}

              {/* Hand Tutorial Guide Cursor (points at the first available front runner) */}
              {showTutorialHand && colIdx === 0 && hasRunner && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                      👆
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-slate-900/90 px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      TAP TO RUN
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
