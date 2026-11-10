import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameVersion } from '../../game/types';
import { GameLanguage, GAME_TEXT } from '../../game/localization';
import {
  Sparkles,
  Map,
  RotateCcw,
  Clock3,
  Play,
  CircleDollarSign,
  ArrowRight,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DownloadGameInvite } from './DownloadGameInvite';
import { formatLifeCountdown } from '../../game/lives';

interface GameResultModalProps {
  type: 'win' | 'die';
  version: GameVersion;
  language: GameLanguage;
  level: number;
  frontierLevel?: number;
  timeElapsed?: number;
  totalTiles?: number;
  xpEarned?: number;
  lives?: number;
  maxLives?: number;
  nextLifeAt?: number | null;
  adProgress?: number;
  adsPerLife?: number;
  adsReady?: boolean;
  now?: number;
  adMessage?: string;
  onNextLevel?: () => void;
  onRetry?: () => void;
  onRestart?: () => void;
  onBackToPath?: () => void;
  onJumpToFrontier?: () => void;
  onWatchAd?: () => void;
}

/* -------------------------------------------------------------
 * Decorative Iridescent 3D Pearl Component
 * -----------------------------------------------------------*/
const Pearl: React.FC<{
  className?: string;
  size?: number;
  tint?: 'lavender' | 'cyan' | 'pink' | 'white' | 'gold';
}> = ({ className = '', size = 20, tint = 'white' }) => {
  const tintGradient = (() => {
    switch (tint) {
      case 'lavender':
        return 'from-purple-200 via-fuchsia-300 to-indigo-400';
      case 'cyan':
        return 'from-cyan-100 via-sky-200 to-teal-400';
      case 'pink':
        return 'from-rose-100 via-pink-200 to-rose-400';
      case 'gold':
        return 'from-amber-100 via-yellow-200 to-amber-400';
      default:
        return 'from-white via-slate-100 to-slate-300';
    }
  })();

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br ${tintGradient} shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_10px_rgba(255,255,255,0.7)_inset] border border-white/80 relative pointer-events-none select-none ${className}`}
    >
      {/* Specular curved highlight */}
      <div className="absolute top-[15%] left-[20%] w-[35%] h-[35%] rounded-full bg-white/90 blur-[0.3px]" />
    </div>
  );
};

/* -------------------------------------------------------------
 * Decorative 3D Golden Star with bevel & glossy shine
 * -----------------------------------------------------------*/
const GlossyStar: React.FC<{
  size?: number;
  rotate?: number;
  scale?: number;
  glow?: boolean;
}> = ({ size = 64, rotate = 0, scale = 1, glow = false }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg) scale(${scale})`,
      }}
      className={`relative inline-flex items-center justify-center transition-transform pointer-events-none select-none ${
        glow ? 'filter drop-shadow-[0_0_22px_rgba(251,191,36,0.85)]' : 'filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]'
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="starGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffea75" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="starGradBorder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <radialGradient id="starGloss" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Outer Bevel / Glow Path */}
        <polygon
          points="50,5 64,36 98,38 72,62 80,95 50,77 20,95 28,62 2,38 36,36"
          fill="url(#starGradFront)"
          stroke="url(#starGradBorder)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Inner Highlight Polygon */}
        <polygon
          points="50,14 60,38 86,40 66,58 72,83 50,69 28,83 34,58 14,40 40,38"
          fill="url(#starGloss)"
        />
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------
 * Decorative Golden Coin with Star Emboss
 * -----------------------------------------------------------*/
const StarCoin: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border-2 border-amber-100 shadow-[0_4px_10px_rgba(0,0,0,0.3),0_0_8px_rgba(253,224,71,0.5)] flex items-center justify-center relative pointer-events-none select-none ${className}`}
    >
      <span className="text-amber-950 font-black text-[11px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">★</span>
      <div className="absolute top-0.5 left-1 w-2 h-1 rounded-full bg-white/70 blur-[0.3px]" />
    </div>
  );
};

/* -------------------------------------------------------------
 * Cute Sad Orange Fish Mascot (Matching Image 2 Reference)
 * -----------------------------------------------------------*/
const SadFishMascot: React.FC<{ size?: number }> = ({ size = 96 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center pointer-events-none select-none filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
    >
      <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="fishBodyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffb347" />
            <stop offset="55%" stopColor="#ff7a29" />
            <stop offset="100%" stopColor="#e64a19" />
          </radialGradient>
          <linearGradient id="fishBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff275" />
            <stop offset="100%" stopColor="#ffb300" />
          </linearGradient>
          <linearGradient id="finGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9800" />
            <stop offset="100%" stopColor="#d84315" />
          </linearGradient>
        </defs>

        {/* Tail fin */}
        <path
          d="M 92 60 C 105 45 118 42 116 55 C 114 62 108 65 116 75 C 117 84 105 82 92 66 Z"
          fill="url(#finGrad)"
          stroke="#bf360c"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Top dorsal fin */}
        <path
          d="M 50 28 C 55 12 70 14 78 26 C 72 26 62 26 50 28 Z"
          fill="url(#finGrad)"
          stroke="#bf360c"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Main Chubby Body */}
        <ellipse
          cx="60"
          cy="62"
          rx="38"
          ry="34"
          fill="url(#fishBodyGrad)"
          stroke="#bf360c"
          strokeWidth="3"
        />

        {/* Cute belly highlight */}
        <path
          d="M 38 72 C 45 88 75 88 84 72 C 72 78 50 78 38 72 Z"
          fill="url(#fishBellyGrad)"
          opacity="0.75"
        />

        {/* Head gloss reflection */}
        <ellipse cx="48" cy="42" rx="12" ry="5" fill="#ffffff" opacity="0.45" transform="rotate(-15 48 42)" />

        {/* Left Sad Eye */}
        <g>
          {/* Eyebrow angled sad */}
          <path d="M 40 47 Q 46 44 50 49" stroke="#792900" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Eye */}
          <ellipse cx="45" cy="56" rx="5.5" ry="6.5" fill="#2d1500" />
          {/* Big teary catchlight */}
          <circle cx="43.5" cy="53.5" r="2.2" fill="#ffffff" />
          <circle cx="47" cy="58.5" r="1.1" fill="#ffffff" />
        </g>

        {/* Right Sad Eye */}
        <g>
          {/* Eyebrow angled sad */}
          <path d="M 64 49 Q 68 44 74 47" stroke="#792900" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Eye */}
          <ellipse cx="69" cy="56" rx="5.5" ry="6.5" fill="#2d1500" />
          {/* Big teary catchlight */}
          <circle cx="67.5" cy="53.5" r="2.2" fill="#ffffff" />
          <circle cx="71" cy="58.5" r="1.1" fill="#ffffff" />
        </g>

        {/* Sad downturned mouth */}
        <path
          d="M 52 74 Q 57 69 62 74"
          stroke="#5d1c00"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chubby side fins */}
        <path
          d="M 30 68 C 22 72 20 80 26 84 C 30 82 32 76 33 70 Z"
          fill="url(#finGrad)"
          stroke="#bf360c"
          strokeWidth="2"
        />

        {/* Tiny sad tear drop */}
        <path
          d="M 40 64 C 40 68 44 68 44 64 C 44 62 42 60 42 60 C 42 60 40 62 40 64 Z"
          fill="#67e8f9"
          stroke="#0891b2"
          strokeWidth="1"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};

export const GameResultModal: React.FC<GameResultModalProps> = ({
  type,
  version,
  language = 'es',
  level,
  frontierLevel,
  timeElapsed = 0,
  totalTiles = 0,
  xpEarned = 0,
  lives = 3,
  maxLives = 3,
  nextLifeAt = null,
  adProgress = 0,
  adsPerLife = 1,
  adsReady = false,
  now = Date.now(),
  adMessage = '',
  onNextLevel,
  onRetry,
  onRestart,
  onBackToPath,
  onJumpToFrontier,
  onWatchAd,
}) => {
  const isWin = type === 'win';
  const isFoF = version === 'fof';
  const t = GAME_TEXT[language];
  const isReplay = typeof frontierLevel === 'number' && level < frontierLevel;
  const outOfLives = lives === 0;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Confetti celebration on win
  useEffect(() => {
    if (isWin) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#38bdf8', '#fbbf24', '#f59e0b', '#f43f5e', '#ffffff'],
        });
        const timer = setTimeout(() => {
          confetti({
            particleCount: 45,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.6 },
          });
          confetti({
            particleCount: 45,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.6 },
          });
        }, 320);
        return () => clearTimeout(timer);
      } catch {
        // graceful fallback
      }
    }
  }, [isWin]);

  const handleDownloadFreeClick = () => {
    const deferredPrompt = (window as unknown as { deferredPrompt?: { prompt: () => void } }).deferredPrompt;
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        return;
      } catch {
        // fallback to invite modal
      }
    }
    setShowInviteModal(true);
  };

  const titleText = isWin
    ? (isFoF ? t.winTitleFof : t.winTitleConveyor)
    : (isFoF ? t.loseTitleFof : t.loseTitleConveyor);

  const subtitleText = isWin
    ? (isFoF ? t.winSubtextFof : t.winSubtextConveyor)
    : (isFoF ? t.loseSubtextFof : t.loseSubtextConveyor);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-result-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto"
    >
      {/* Outer wrapper positioning floating pearls and decorations */}
      <div className="relative w-full max-w-xl my-auto pt-10 sm:pt-14 pb-4">
        {/* Floating Pearls around perimeter matching reference screenshot */}
        <Pearl size={24} tint="lavender" className="absolute top-12 -left-2 sm:-left-4 z-20 animate-pulse" />
        <Pearl size={16} tint="cyan" className="absolute top-20 left-6 z-20 opacity-80" />
        <Pearl size={28} tint="white" className="absolute top-1/2 -left-4 sm:-left-6 z-20 shadow-cyan-500/50" />
        <Pearl size={18} tint="pink" className="absolute bottom-16 -left-1 sm:-left-3 z-20" />
        <Pearl size={22} tint="cyan" className="absolute bottom-6 left-10 z-20" />

        <Pearl size={22} tint="lavender" className="absolute top-14 -right-1 sm:-right-3 z-20" />
        <Pearl size={26} tint="cyan" className="absolute top-24 -right-4 sm:-right-5 z-20" />
        <Pearl size={28} tint="white" className="absolute top-2/3 -right-4 sm:-right-6 z-20" />
        <Pearl size={18} tint="pink" className="absolute bottom-20 right-6 z-20" />
        <Pearl size={16} tint="lavender" className="absolute bottom-8 -right-1 z-20" />

        {/* Golden star coins around perimeter (Win only) */}
        {isWin && (
          <>
            <StarCoin size={30} className="absolute top-10 right-16 sm:right-24 z-20 rotate-12" />
            <StarCoin size={26} className="absolute bottom-24 -left-3 sm:-left-5 z-20 -rotate-12" />
            <StarCoin size={32} className="absolute bottom-10 -right-2 sm:-right-4 z-20 rotate-6" />
          </>
        )}

        {/* Top Rim Mascot or Stars Deco (Partially overlaps the top edge) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none">
          {isWin ? (
            <div className="flex items-end justify-center gap-1 sm:gap-3">
              <GlossyStar size={54} rotate={-14} scale={0.92} />
              <GlossyStar size={78} rotate={0} scale={1.05} glow={true} />
              <GlossyStar size={54} rotate={14} scale={0.92} />
            </div>
          ) : (
            <div className="-mb-2">
              <SadFishMascot size={90} />
            </div>
          )}
        </div>

        {/* THE FROSTED TRANSLUCENT GLASS CAPSULE */}
        <div
          className={`relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-9 pt-14 sm:pt-16 text-center text-white border-2 border-white/70 shadow-[0_25px_65px_rgba(8,145,178,0.35),0_0_40px_rgba(255,255,255,0.25)_inset] transition-all overflow-hidden ${
            isFoF
              ? 'backdrop-blur-2xl bg-white/20 sm:bg-white/25'
              : 'backdrop-blur-2xl bg-slate-900/60 sm:bg-slate-900/70 border-cyan-300/60'
          }`}
          style={{
            background: isFoF
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.32) 0%, rgba(200, 240, 255, 0.18) 50%, rgba(255, 255, 255, 0.28) 100%)'
              : undefined,
          }}
        >
          {/* Top highlight specular curved reflection arc */}
          <div className="absolute top-1.5 left-10 right-10 h-3 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
          <div className="absolute top-3 left-6 w-24 h-12 rounded-full bg-white/20 blur-md pointer-events-none -rotate-12" />

          {/* Replay Pill Header if replaying past level */}
          {isWin && isReplay && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-white/30 border border-white/60 text-xs font-black text-amber-300 uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t.replayPastCleared}
            </div>
          )}

          {/* MAIN HEADLINE (¡NIVEL COMPLETADO! / ¡PERDISTE!) */}
          <h1
            id="game-result-title"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] mt-1 mb-2 uppercase"
          >
            {titleText}
          </h1>

          {/* SUBTITLE */}
          <p className="text-sm sm:text-base md:text-lg font-bold text-white/95 max-w-md mx-auto mb-6 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
            {subtitleText}
          </p>

          {/* BIG GLOSSY AMBER-ORANGE PILL BUTTON: ✨ DESCARGAR GRATIS */}
          <div className="w-full flex justify-center mb-6">
            <button
              type="button"
              onClick={handleDownloadFreeClick}
              aria-label={t.downloadFree}
              className="group relative w-full sm:w-[84%] max-w-md py-3.5 sm:py-4 px-6 rounded-full font-black text-lg sm:text-xl text-white tracking-wide border-2 border-white/90 shadow-[0_12px_28px_rgba(255,140,0,0.55),0_-3px_8px_rgba(255,255,255,0.45)_inset] bg-gradient-to-b from-[#ffbe3b] via-[#ff8d00] to-[#e65c00] hover:brightness-110 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-3"
            >
              {/* Inner top gloss highlight bar */}
              <div className="absolute top-1.5 left-6 right-6 h-1.5 rounded-full bg-white/50 blur-[0.4px] pointer-events-none" />

              <span className="text-xl sm:text-2xl filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">✨</span>
              <span className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] font-black uppercase">
                {t.downloadFree}
              </span>
            </button>
          </div>

          {/* GAMEPLAY ACTION BUTTONS: Pathway, Replay / Restart, and Next Level (if win) */}
          <div className="w-full max-w-md mx-auto flex flex-col gap-2.5">
            {/* WIN: Continue to Next Level */}
            {isWin && onNextLevel && (
              <button
                type="button"
                onClick={onNextLevel}
                className="w-full py-3.5 px-6 rounded-full font-black text-base sm:text-lg text-white border-2 border-white/80 shadow-[0_10px_24px_rgba(16,185,129,0.45),0_-2px_6px_rgba(255,255,255,0.4)_inset] bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-700 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t.continueLevel} {level + 1}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {/* DIE: Retry Level */}
            {!isWin && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={outOfLives}
                className="w-full py-3.5 px-6 rounded-full font-black text-base sm:text-lg text-white border-2 border-white/80 shadow-[0_10px_24px_rgba(16,185,129,0.45),0_-2px_6px_rgba(255,255,255,0.4)_inset] bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-700 hover:brightness-110 disabled:opacity-50 disabled:grayscale active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{outOfLives ? t.outOfLives : `${t.retryLevel} ${level}`}</span>
              </button>
            )}

            {/* Replay past cleared jump */}
            {isWin && isReplay && onJumpToFrontier && frontierLevel && (
              <button
                type="button"
                onClick={onJumpToFrontier}
                className="w-full py-2.5 px-4 rounded-full font-bold text-sm text-amber-200 border border-amber-300/60 bg-white/15 hover:bg-white/25 backdrop-blur-md transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.jumpToFrontier} {frontierLevel}</span>
              </button>
            )}

            {/* Secondary actions row: Volver al Camino (Pathway) & Volver a Iniciar (Restart) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Return to Pathway */}
              {onBackToPath && (
                <button
                  type="button"
                  onClick={onBackToPath}
                  className="py-2.5 px-3 rounded-full font-bold text-xs sm:text-sm text-white border border-white/60 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-md transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Map className="w-4 h-4 text-emerald-200" />
                  <span className="truncate">{t.returnToPathway}</span>
                </button>
              )}

              {/* Replay / Restart current level */}
              {(isWin ? onRestart : onRetry) && (
                <button
                  type="button"
                  onClick={isWin ? onRestart : onRetry}
                  className="py-2.5 px-3 rounded-full font-bold text-xs sm:text-sm text-white border border-white/60 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-md transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4 text-amber-200" />
                  <span className="truncate">{isWin ? t.replayThisLevel : t.retryLevel}</span>
                </button>
              )}
            </div>

            {/* Lives countdown and ad watch option if died */}
            {!isWin && lives < maxLives && (
              <div className="mt-1 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-white font-bold">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-300" />
                    <span>{t.lives}: {lives}/{maxLives}</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-200 font-mono text-[11px]">
                    <Clock3 className="w-3.5 h-3.5" />
                    <span>{t.nextLifeIn} {formatLifeCountdown(nextLifeAt, now)}</span>
                  </div>
                </div>

                {onWatchAd && (
                  <div className="pt-2 border-t border-white/20 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-amber-200 text-[11px]">
                      <CircleDollarSign className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t.rewardedVideo}: {adsPerLife}</span>
                    </div>
                    <button
                      type="button"
                      onClick={onWatchAd}
                      disabled={!adsReady}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>{adsReady ? t.watchAd : t.adsAvailableMobile}</span>
                    </button>
                  </div>
                )}
                {adMessage && <p className="text-[11px] text-rose-200">{adMessage}</p>}
              </div>
            )}

            {/* Optional Collapsible Stats Drawer */}
            {isWin && (
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setShowStats(!showStats)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition cursor-pointer"
                >
                  <span>{showStats ? 'Ocultar estadísticas' : 'Ver estadísticas'}</span>
                  {showStats ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showStats && (
                  <div className="grid grid-cols-3 gap-2 mt-2 p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-center animate-in fade-in duration-200">
                    <div>
                      <p className="text-[10px] font-semibold text-white/70 uppercase">{t.absorbedCount}</p>
                      <p className="text-base font-black text-white">{totalTiles}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white/70 uppercase">{t.timeElapsed}</p>
                      <p className="text-base font-black text-emerald-200">{timeElapsed}s</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white/70 uppercase">{t.xpEarned}</p>
                      <p className="text-base font-black text-amber-200">+{xpEarned}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Creator Attribution */}
          <div className="mt-4 pt-2 border-t border-white/20 flex items-center justify-center gap-1 text-[11px] text-white/80 font-medium">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Fish Feeder · By Dimpz Games · Isaac Gómez</span>
          </div>
        </div>
      </div>

      {/* Mobile Download Invite Modal Overlay */}
      {showInviteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-400/50 p-4 sm:p-6 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer text-xs font-bold"
            >
              ✕ {t.close}
            </button>

            <DownloadGameInvite
              context={isWin ? 'win' : 'death'}
              level={level}
              language={language}
              gameName={isFoF ? 'Fish Feeder' : 'Conveyor Realms'}
              compact={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
