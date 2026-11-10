import React from 'react';
import { Heart, Play, Clock3, CircleDollarSign, Map, X } from 'lucide-react';
import { formatLifeCountdown } from '../../game/lives';
import { DownloadGameInvite } from './DownloadGameInvite';

interface LifeModalProps {
  level: number;
  lives: number;
  maxLives: number;
  nextLifeAt: number | null;
  adProgress: number;
  adsPerLife: number;
  adsReady: boolean;
  now: number;
  adMessage: string;
  onRetry: () => void;
  onWatchAd: () => void;
  onBackToPath?: () => void;
}

export const LifeModal: React.FC<LifeModalProps> = ({
  level, lives, maxLives, nextLifeAt, adProgress, adsPerLife, adsReady, now, adMessage, onRetry, onWatchAd, onBackToPath,
}) => {
  const outOfLives = lives === 0;
  const progressText = `${Math.min(adProgress, adsPerLife)}/${adsPerLife}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md">
      <section className="relative w-full max-w-md sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-6 text-center text-slate-200 shadow-2xl">
        {onBackToPath && (
          <button
            type="button"
            onClick={onBackToPath}
            aria-label="Volver al Camino"
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pathway</span>
          </button>
        )}
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${outOfLives ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-400/15 text-amber-300'}`}>
          <Heart className="h-9 w-9 fill-current" />
        </div>
        <h2 className="text-2xl font-black text-white">{outOfLives ? 'Out of lives' : 'You got stuck'}</h2>
        <p className="mt-2 text-sm text-slate-300">
          {outOfLives
            ? `Level ${level} is paused. Wait for a life to recover, earn one with rewarded ads, or return to the pathway map.`
            : `You lost a life. You have ${lives} of ${maxLives} left. Retry this level when you're ready or check the pathway.`}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3">
          <Clock3 className="h-4 w-4 text-sky-300" />
          <span className="text-xs text-slate-400">Next life</span>
          <strong className="font-mono text-sm text-sky-200">{formatLifeCountdown(nextLifeAt, now)}</strong>
        </div>

        {lives < maxLives && (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
              <CircleDollarSign className="h-4 w-4" /> Rewarded video: {adsPerLife} {adsPerLife === 1 ? 'ad' : 'ads'} per life
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {level <= 30 ? 'Levels 1–30: one completed ad gives one life.' : 'From level 31: complete two ads to earn one life.'}
              {' '}Lives are capped at {maxLives}; ad rewards cannot be stored above that limit.
            </p>
            {adsPerLife > 1 && <p className="mt-1 text-xs text-amber-300">Ads completed for next life: {progressText}</p>}
            <button
              onClick={onWatchAd}
              disabled={!adsReady}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Play className="h-4 w-4 fill-current" />
              {adsReady ? 'Watch rewarded ad' : 'Rewarded ads available in the Android app'}
            </button>
            {adMessage && <p className="mt-2 text-xs text-rose-300">{adMessage}</p>}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={onRetry}
            disabled={outOfLives}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:from-emerald-300 hover:to-teal-200 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 cursor-pointer"
          >
            {outOfLives ? 'Wait for a life or watch an ad' : `Retry Level ${level}`}
          </button>

          {onBackToPath && (
            <button
              type="button"
              onClick={onBackToPath}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-3 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Map className="w-4 h-4 text-emerald-400" />
              <span>Volver al Camino (Pathway)</span>
            </button>
          )}
        </div>

        {/* Invite to download the game on smartphone with video and game thumbnail */}
        <DownloadGameInvite context="death" level={level} compact={false} />

        <p className="mt-3 text-[11px] text-slate-500">Your progress stays on Level {level} until you clear it.</p>
      </section>
    </div>
  );
};
