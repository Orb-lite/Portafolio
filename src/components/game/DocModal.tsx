import React from 'react';
import { X, Sparkles, Crown, Fish, PawPrint, Bird, CarFront, Plane } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const worlds = [
  { icon: Crown, levels: '1–9', name: 'Chess Kingdom' },
  { icon: Fish, levels: '10–19', name: 'Fish of Fortune' },
  { icon: PawPrint, levels: '20–29', name: 'Land Animals' },
  { icon: Bird, levels: '30–39', name: 'Birds' },
  { icon: Sparkles, levels: '40–49', name: 'Humans' },
  { icon: CarFront, levels: '50–59', name: 'Cars' },
  { icon: Plane, levels: '60+', name: 'Aircraft' },
];

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">How to Play</h2>
            <p className="text-xs text-slate-400">Conveyor Realms · By Dimpz Games</p>
          </div>
          <button onClick={onClose} aria-label="Close game guide" className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
          <section className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4 text-amber-400" /> Clear the board
            </h3>
            <p className="leading-relaxed text-slate-300">
              Send a matching piece from the queue onto the conveyor. It collects exposed tiles of its color as it travels around the board. Plan your launches to open new paths and clear every tile to advance.
            </p>
            <ul className="mt-3 space-y-1.5 text-slate-300">
              <li>• Launch pieces from the four columns at the bottom.</li>
              <li>• Up to five pieces can travel on the conveyor at once.</li>
              <li>• Clear one board to complete one level. XP is your score.</li>
              <li>• Break a shield to reveal a tile; it becomes absorbable after the 3-second countdown.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-700/70 bg-slate-950/30 p-4">
            <h3 className="mb-3 text-sm font-bold text-white">Worlds</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {worlds.map(({ icon: Icon, levels, name }) => (
                <div key={name} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                  <Icon className="h-4 w-4 shrink-0 text-amber-300" />
                  <span className="font-semibold text-slate-100">{name}</span>
                  <span className="ml-auto font-mono text-[10px] text-slate-400">{levels}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4">
            <h3 className="mb-2 text-sm font-bold text-amber-300">Growing challenge</h3>
            <p className="leading-relaxed text-slate-300">
              Boards expand from 8×8 up to 64×64. The camera pulls back as they grow, more colors join the puzzle, and protective shields appear more often. The world scenery changes as you enter each new level range.
            </p>
          </section>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Sparkles className="h-3.5 w-3.5" /> By Dimpz Games
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-xl bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700">Close</button>
        </div>
      </div>
    </div>
  );
};
