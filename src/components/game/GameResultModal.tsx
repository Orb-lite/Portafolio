import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameVersion } from '../../game/types';
import { GameLanguage, GAME_TEXT } from '../../game/localization';
import {
  Sparkles,
  Map,
  RotateCcw,
  CheckCircle2,
  Clock3,
  Play,
  CircleDollarSign,
  Smartphone,
  Download,
  Share2,
  Zap,
  ArrowRight,
  Trophy,
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
  const isEn = language === 'en';
  const t = GAME_TEXT[language];
  const isReplay = typeof frontierLevel === 'number' && level < frontierLevel;
  const outOfLives = lives === 0;

  const [showInviteModal, setShowInviteModal] = useState(false);

  // Determine exact popup artwork asset based on game, win/die, and language
  const popupImageSrc = (() => {
    if (isFoF) {
      if (isWin) {
        return isEn
          ? '/assets/popups/fof_win_en.png'
          : '/assets/popups/fof_win_es.png';
      } else {
        return isEn
          ? '/assets/popups/fof_lose_en.png'
          : '/assets/popups/fof_lose_es.png';
      }
    } else {
      if (isWin) {
        return isEn
          ? '/assets/popups/conveyor_win_en.png'
          : '/assets/popups/conveyor_win_es.png';
      } else {
        return isEn
          ? '/assets/popups/conveyor_lose_en.png'
          : '/assets/popups/conveyor_lose_es.png';
      }
    }
  })();

  // Confetti on win
  useEffect(() => {
    if (isWin) {
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: isFoF
            ? ['#38bdf8', '#f59e0b', '#06b6d4', '#f43f5e', '#ffffff']
            : ['#f8fafc', '#fbbf24', '#818cf8', '#38bdf8', '#c084fc'],
        });
        const timeout = setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 350);
        return () => clearTimeout(timeout);
      } catch {
        // fallback
      }
    }
  }, [isWin, isFoF]);

  const handleDownloadFreeClick = () => {
    const deferredPrompt = (window as unknown as { deferredPrompt?: { prompt: () => void } }).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      setShowInviteModal(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl max-h-[95vh] overflow-y-auto bg-slate-900/95 border border-slate-700/80 rounded-3xl p-3 sm:p-6 text-center shadow-2xl flex flex-col items-center">
        {/* Quick Pathway Button in top right */}
        {onBackToPath && (
          <button
            type="button"
            onClick={onBackToPath}
            aria-label={t.returnToPathway}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-lg"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.pathway}</span>
          </button>
        )}

        {/* Ambient background glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full filter blur-3xl opacity-35 pointer-events-none ${
            isWin
              ? isFoF
                ? 'bg-cyan-500'
                : 'bg-amber-400'
              : 'bg-rose-500'
          }`}
        />

        {/* Replay Pill Header if replaying past level */}
        {isWin && isReplay && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-black text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            {t.replayPastCleared}
          </div>
        )}

        {/* THE MAIN VISUAL POPUP SCREEN ARTWORK CARD */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group my-1">
          <img
            src={popupImageSrc}
            alt={isWin ? t.winTitleConveyor : t.loseTitleConveyor}
            className="w-full h-auto object-cover rounded-2xl select-none"
          />

          {/* Interactive clickable overlay over the DOWNLOAD FREE button */}
          <button
            type="button"
            onClick={handleDownloadFreeClick}
            aria-label={t.downloadFree}
            className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[68%] sm:w-[58%] h-[20%] rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 focus:outline-none"
            title={t.downloadFree}
          >
            <span className="sr-only">{t.downloadFree}</span>
          </button>
        </div>

        {/* Download action button below the card */}
        <div className="w-full mt-2 mb-3">
          <button
            type="button"
            onClick={handleDownloadFreeClick}
            className={`w-full py-3 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
              isFoF
                ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-slate-950 hover:brightness-110 shadow-orange-500/30'
                : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-cyan-500/30'
            }`}
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{t.downloadFree}</span>
            <Download className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* STATS & INFO BAR (For Win: Absorbed, Time, XP. For Die: Lives remaining, Next life countdown) */}
        {isWin ? (
          <div className="w-full grid grid-cols-3 gap-2 my-2 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 text-left shadow-md">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">{t.absorbedCount}</p>
              <p className="text-base sm:text-lg font-black text-white">{totalTiles}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">{t.timeElapsed}</p>
              <p className="text-base sm:text-lg font-black text-emerald-400">{timeElapsed}s</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">{t.xpEarned}</p>
              <p className="text-base sm:text-lg font-black text-amber-400">+{xpEarned}</p>
            </div>
          </div>
        ) : (
          <div className="w-full my-2 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {outOfLives ? t.outOfLives : `${t.lives}: ${lives}/${maxLives}`}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-sky-300 font-mono">
                <Clock3 className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.nextLifeIn} {formatLifeCountdown(nextLifeAt, now)}</span>
              </div>
            </div>

            {/* Rewarded video ad option if lives can be recovered */}
            {lives < maxLives && onWatchAd && (
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-200">
                  <CircleDollarSign className="w-4 h-4 text-amber-400" />
                  <span>{t.rewardedVideo}: {adsPerLife} {t.adsPerLife}</span>
                </div>
                <button
                  type="button"
                  onClick={onWatchAd}
                  disabled={!adsReady}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{adsReady ? t.watchAd : t.adsAvailableMobile}</span>
                </button>
              </div>
            )}
            {adMessage && <p className="text-xs text-rose-300">{adMessage}</p>}
          </div>
        )}

        {/* Auto-save confirmation pill */}
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 my-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] sm:text-[11px] font-semibold text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{t.autoSavedNotice}</span>
        </div>

        {/* PROMINENT INVITATION TO DOWNLOAD THE GAME (END OF LEVEL & ON DEATH) */}
        <DownloadGameInvite
          context={isWin ? 'win' : 'death'}
          level={level}
          language={language}
          gameName={isFoF ? 'Fish Feeder' : 'Conveyor Realms'}
          compact={false}
        />

        {/* GAMEPLAY ACTION BUTTONS */}
        <div className="w-full flex flex-col gap-2 mt-2">
          {/* WIN: Continue to Next Level */}
          {isWin && onNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.continueLevel} {level + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* WIN REPLAY: Jump to Frontier */}
          {isWin && isReplay && onJumpToFrontier && frontierLevel && (
            <button
              type="button"
              onClick={onJumpToFrontier}
              className="w-full py-3 rounded-xl font-bold text-sm bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/50 flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{t.jumpToFrontier} {frontierLevel}</span>
            </button>
          )}

          {/* DIE: Retry Level */}
          {!isWin && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={outOfLives}
              className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 text-slate-950 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{outOfLives ? t.outOfLives : `${t.retryLevel} ${level}`}</span>
            </button>
          )}

          {/* Replay this level (for Win) */}
          {isWin && onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.replayThisLevel}</span>
            </button>
          )}

          {/* Return to Pathway Map */}
          {onBackToPath && (
            <button
              type="button"
              onClick={onBackToPath}
              className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Map className="w-4 h-4 text-emerald-300" />
              <span>{t.returnToPathway}</span>
            </button>
          )}
        </div>

        {/* Creator attribution */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1 text-[11px] text-amber-400/90 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>By Dimpz Games · Isaac Gómez Estrada</span>
        </div>
      </div>

      {/* Mobile Download Invite Modal Overlay */}
      {showInviteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/40 p-4 sm:p-6 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer text-xs font-bold"
            >
              ✕ {t.close}
            </button>

            <DownloadGameInvite context={isWin ? 'win' : 'death'} level={level} compact={false} />
          </div>
        </div>
      )}
    </div>
  );
};
