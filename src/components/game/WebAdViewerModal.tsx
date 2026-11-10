import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2, AlertTriangle, X, ShieldCheck } from 'lucide-react';

interface WebAdViewerModalProps {
  language?: 'en' | 'es';
  onRewardEarned: () => void;
  onClose: () => void;
}

export const WebAdViewerModal: React.FC<WebAdViewerModalProps> = ({
  language = 'en',
  onRewardEarned,
  onClose,
}) => {
  const isEn = language === 'en';
  const TOTAL_DURATION = 10; // 10 seconds rewarded ad
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback / simulation timer if video is paused or buffering
  useEffect(() => {
    if (!isPlaying || rewardGranted) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRewardGranted(true);
          onRewardEarned();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, rewardGranted, onRewardEarned]);

  const handleAttemptClose = () => {
    if (rewardGranted) {
      onClose();
    } else {
      setShowSkipWarning(true);
    }
  };

  const progressPct = ((TOTAL_DURATION - timeLeft) / TOTAL_DURATION) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Ad Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-[10px] tracking-wider uppercase">
              AD
            </span>
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {isEn ? 'HTTPS Rewarded Ad Viewer' : 'Reproductor de anuncios con recompensa HTTPS'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rewardGranted ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer shadow-md"
              >
                <span>{isEn ? 'Claim & Close' : 'Reclamar y cerrar'}</span>
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleAttemptClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                title={isEn ? 'Close ad' : 'Cerrar anuncio'}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ad Player Viewport */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Sample High Quality HTML5 Video Ad Stream */}
          <video
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Interactive Ad Brand Overlay Banner */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-white text-[10px]">
              CR
            </div>
            <div>
              <p className="font-bold text-white text-[11px] leading-tight">Conveyor Realms Studio</p>
              <p className="text-[9px] text-cyan-300">{isEn ? 'AAA Interactive Mobile Puzzle' : 'Puzzle interactivo móvil AAA'}</p>
            </div>
          </div>

          {/* Play / Mute Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white transition cursor-pointer backdrop-blur"
              title={isMuted ? (isEn ? 'Unmute' : 'Activar sonido') : (isEn ? 'Mute' : 'Silenciar')}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) videoRef.current.pause();
                  else videoRef.current.play();
                  setIsPlaying(!isPlaying);
                }
              }}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white transition cursor-pointer backdrop-blur"
              title={isPlaying ? (isEn ? 'Pause' : 'Pausar') : (isEn ? 'Play' : 'Reproducir')}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
            </button>
          </div>

          {/* Reward Status Banner inside video */}
          {rewardGranted ? (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-3 shadow-lg animate-bounce">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-black text-white">{isEn ? 'Reward Earned!' : '¡Recompensa obtenida!'}</h3>
              <p className="text-xs text-emerald-300 font-bold mt-1">
                {isEn ? '+1 life added to your inventory' : '+1 vida añadida a tu inventario'}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                {isEn ? 'Play Again' : 'Volver a jugar'}
              </button>
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{isEn ? 'Life ready in:' : 'Vida disponible en:'} <strong className="text-white text-sm font-black">{timeLeft}s</strong></span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Ad Call To Action Bar */}
        <div className="p-4 bg-slate-900/90 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-white">{isEn ? 'Try Conveyor Realms on Android' : 'Prueba Conveyor Realms en Android'}</h4>
            <p className="text-[11px] text-slate-400">{isEn ? 'Play offline with 100+ levels and 3D physics' : 'Juega sin conexión con más de 100 niveles y físicas 3D'}</p>
          </div>
          <button
            onClick={() => window.open('https://github.com/Orb-lite/Portafolio', '_blank')}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer shrink-0"
          >
            {isEn ? 'View Details' : 'Ver detalles'}
          </button>
        </div>

        {/* Skip Warning Modal Overlay if trying to leave early */}
        {showSkipWarning && (
          <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center z-20 animate-in fade-in">
            <AlertTriangle className="h-12 w-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-black text-white">{isEn ? 'Leave without a reward?' : '¿Salir sin recompensa?'}</h4>
            <p className="text-xs text-slate-300 max-w-xs mt-1">
              {isEn ? `Close the ad now and you will not receive the free life. Only ${timeLeft} seconds left.` : `Si cierras el anuncio ahora no recibirás la vida gratuita. Solo faltan ${timeLeft} segundos.`}
            </p>
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setShowSkipWarning(false)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs transition hover:bg-amber-300 cursor-pointer"
              >
                {isEn ? `Keep Watching (${timeLeft}s)` : `Seguir viendo (${timeLeft}s)`}
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                {isEn ? 'Leave Anyway' : 'Salir de todos modos'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
