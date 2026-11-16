import React, { useState } from 'react';
import { X, Trophy, Lock, Play, Star, Sparkles, MapPin, ChevronRight, Crown, Fish, Cpu, Gem, CloudFog } from 'lucide-react';
import { WORLD_BLOCKS, WorldBlock, getWorldForLevel } from '../../game/worlds';

interface LevelPathwayModalProps {
  isOpen: boolean;
  currentLevel: number;
  highestUnlockedLevel: number;
  experience: number;
  expToLevelUp: number;
  onSelectLevel: (lvl: number) => void;
  onClose: () => void;
}

export const LevelPathwayModal: React.FC<LevelPathwayModalProps> = ({
  isOpen,
  currentLevel,
  highestUnlockedLevel,
  experience,
  expToLevelUp,
  onSelectLevel,
  onClose,
}) => {
  const currentWorld = getWorldForLevel(currentLevel);

  if (!isOpen) return null;

  const getWorldIcon = (worldId: string) => {
    switch (worldId) {
      case 'chess_kingdom': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'coral_cove': return <Fish className="w-5 h-5 text-cyan-400" />;
      case 'cyber_grid': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'golden_vault': return <Gem className="w-5 h-5 text-emerald-400" />;
      default: return <Crown className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">

        {/* Top Floating Glass Navigation Header */}
        <div className="relative z-20 px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg font-black text-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  World Journey Pathway
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Candy Crush Saga Style
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Current Realm: <strong className="text-white">{currentWorld.name}</strong> • Level {currentLevel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Player XP HUD */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{experience} XP</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Continuous Adventure Road with Seamless Cross-Fade Transitions */}
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {WORLD_BLOCKS.map((world, worldIdx) => {
            const isWorldUnlocked = highestUnlockedLevel >= world.levelsRange[0];
            const isCurrentWorld = currentWorld.id === world.id;
            const levels = [];
            for (let l = world.levelsRange[0]; l <= Math.min(12, world.levelsRange[1]); l++) {
              levels.push(l);
            }

            return (
              <section key={world.id} className="relative overflow-hidden border-b border-white/5">
                {/* 1. Seamless Background Image Container */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                    isWorldUnlocked ? 'opacity-45 scale-100' : 'opacity-20 grayscale scale-105'
                  }`}
                  style={{
                    backgroundImage: `url(${world.themeTexture})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '280px 280px',
                  }}
                />

                {/* 2. Soft Edge Vignette & Smooth Inter-World Dissolve Gradients */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, 
                      ${worldIdx > 0 ? WORLD_BLOCKS[worldIdx - 1].floorColor + 'bb' : '#020617'} 0%, 
                      ${world.floorColor}66 18%, 
                      ${world.floorColor}55 82%, 
                      ${worldIdx < WORLD_BLOCKS.length - 1 ? WORLD_BLOCKS[worldIdx + 1].floorColor + 'bb' : '#020617'} 100%)`,
                  }}
                />

                {/* 3. Candy Crush Fog-of-War Shroud over Locked World Blocks */}
                {!isWorldUnlocked && (
                  <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/75 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                    {/* Drifting Volumetric Cloud Mist Illustration */}
                    <div className="relative mb-3">
                      <div className="w-20 h-20 rounded-full bg-slate-800/80 border-2 border-slate-600 flex items-center justify-center shadow-2xl relative z-10">
                        <Lock className="w-9 h-9 text-amber-400/90" />
                      </div>
                      <CloudFog className="w-24 h-24 text-slate-400/40 absolute -top-4 -left-4 animate-pulse" />
                      <CloudFog className="w-24 h-24 text-slate-300/30 absolute -top-2 -right-4 animate-pulse delay-300" />
                    </div>

                    <div className="max-w-md bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-lg">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                        Fog of War Enshrouded
                      </span>
                      <h4 className="text-base font-black text-white mt-1.5">{world.name}</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Clear Level {world.levelsRange[0] - 1} in the previous realm to dispel the mystical fog and unlock these challenges!
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. World Content & Roadmap Nodes */}
                <div className="relative z-10 p-5 sm:p-7 max-w-4xl mx-auto">
                  {/* World Header Banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/20"
                        style={{ backgroundColor: `${world.floorColor}` }}
                      >
                        {getWorldIcon(world.id)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            {world.name}
                          </h3>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shadow-sm"
                            style={{
                              backgroundColor: `${world.accentColor}25`,
                              color: world.accentColor,
                              borderColor: `${world.accentColor}60`,
                            }}
                          >
                            {world.badgeTag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{world.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-800">
                        Levels {world.levelsRange[0]} - {world.levelsRange[1] === 999 ? '12+' : world.levelsRange[1]}
                      </span>
                    </div>
                  </div>

                  {/* Level Path Nodes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                    {levels.map((lvl) => {
                      const isUnlocked = lvl <= highestUnlockedLevel;
                      const isCurrent = lvl === currentLevel;
                      const isCompleted = lvl < highestUnlockedLevel;

                      return (
                        <button
                          key={lvl}
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (isUnlocked) {
                              onSelectLevel(lvl);
                              onClose();
                            }
                          }}
                          className={`relative group rounded-2xl p-4 text-left transition-all duration-300 border flex flex-col justify-between h-32 ${
                            isCurrent
                              ? 'bg-gradient-to-b from-amber-500/30 to-slate-900 border-amber-400 ring-2 ring-amber-400/60 shadow-xl shadow-amber-500/20 cursor-pointer scale-102'
                              : isCompleted
                              ? 'bg-slate-900/85 hover:bg-slate-800/90 border-slate-700/80 hover:border-slate-500 shadow-md cursor-pointer'
                              : isUnlocked
                              ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 cursor-pointer'
                              : 'bg-slate-950/70 border-slate-800/60 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          {/* Node Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-base font-black ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                                Level {lvl}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black shadow-sm">
                                  CURRENT
                                </span>
                              )}
                            </div>

                            <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-slate-800/90 border border-slate-700/60 shadow-inner">
                              {isUnlocked ? (
                                isCompleted ? (
                                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                                )
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </div>
                          </div>

                          {/* Node Description */}
                          <div>
                            <p className="text-[11px] font-bold text-slate-200">
                              {lvl <= 3 ? '8x8 Chess Arena' : lvl <= 6 ? '10x10 Coral Reef' : '12x12 Master Grid'}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {lvl <= 3 ? '2 Colors • Classic' : lvl <= 6 ? '3-4 Colors • Bubbles' : '5-6 Colors • High Density'}
                            </p>
                          </div>

                          {/* Stars & Action */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 3 }).map((_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  className={`w-3.5 h-3.5 ${
                                    isCompleted
                                      ? 'text-amber-400 fill-amber-400'
                                      : isCurrent && starIdx === 0
                                      ? 'text-amber-400/80 fill-amber-400/50'
                                      : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>

                            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white flex items-center gap-0.5">
                              {isUnlocked ? (isCurrent ? 'Play Now' : 'Replay') : 'Locked'}
                              {isUnlocked && <ChevronRight className="w-3 h-3 text-amber-400" />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative z-20 px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/90 backdrop-blur-md text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Made by Isaac Gómez • Technical Artist
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 transition font-bold cursor-pointer"
          >
            Return to Arena
          </button>
        </div>
      </div>
    </div>
  );
};
