import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2, AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { GameVersion } from '../../game/types';

const FISH_FEEDER_VIDEO = '/assets/aistudio/Fish_feeder_6c148142.mp4';
const TILE_ABSORBER_VIDEO = '/assets/aistudio/tile_absorber_64df8e71.mp4';

interface WebAdViewerModalProps {
  version?: GameVersion;
  onRewardEarned: () => void;
  onClose: () => void;
}

export const WebAdViewerModal: React.FC<WebAdViewerModalProps> = ({
  version = 'chess',
  onRewardEarned,
  onClose,
}) => {
  const isFoF = version === 'fof';
  const adVideoSrc = isFoF ? FISH_FEEDER_VIDEO : TILE_ABSORBER_VIDEO;
  const gameTitle = isFoF ? 'Fish Feeder' : 'Tile Absorber';
  const gameSubtitle = isFoF ? '3D Aquatic Pearl Puzzle' : 'AAA 3D Spatial Conveyor Puzzle';
  const badgeCode = isFoF ? 'FF' : 'TA';

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
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Ad Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-[10px] tracking-wider uppercase">
              AD
            </span>
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {gameTitle} · Rewarded Ad (Landscape Mobile)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rewardGranted ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer shadow-md"
              >
                <span>Reclamar & Cerrar</span>
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleAttemptClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
                title="Cerrar anuncio"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Landscape Mobile Phone Viewport */}
        <div className="p-3 sm:p-4 bg-slate-950">
          <div className="relative w-full aspect-video rounded-[1.8rem] sm:rounded-[2rem] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-2 sm:p-2.5 shadow-2xl border border-slate-600/80">
            {/* Left-Side Dynamic Island / Camera Notch (Landscape Smartphone) */}
            <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-2.5 sm:w-3 h-12 sm:h-16 bg-slate-950 rounded-full z-20 flex flex-col items-center justify-center gap-1.5 border border-slate-800/80 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-900/70" />
            </div>

            <div className="relative w-full h-full rounded-[1.35rem] sm:rounded-[1.5rem] bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-900">
              {/* Version-Specific Gameplay Video Ad */}
              <video
                key={adVideoSrc}
                ref={videoRef}
                src={adVideoSrc}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Interactive Ad Brand Overlay Banner */}
              <div className="absolute top-3 left-6 flex items-center gap-2 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-white text-[10px]">
                  {badgeCode}
                </div>
                <div>
                  <p className="font-bold text-white text-[11px] leading-tight">{gameTitle} · Dimpz Games</p>
                  <p className="text-[9px] text-cyan-300">{gameSubtitle}</p>
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
                  title={isMuted ? 'Activar Sonido' : 'Silenciar'}
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
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                </button>
              </div>

              {/* Reward Status Banner inside video */}
              {rewardGranted ? (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 z-20">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-3 shadow-lg animate-bounce">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="text-xl font-black text-white">¡Recompensa Obtenida!</h3>
                  <p className="text-xs text-emerald-300 font-bold mt-1">
                    +1 Vida añadida a tu inventario
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    Volver a Jugar
                  </button>
                </div>
              ) : (
                <div className="absolute bottom-3 left-6 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Vida lista en: <strong className="text-white text-sm font-black">{timeLeft}s</strong></span>
                </div>
              )}

              {/* Landscape Home Indicator Pill */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/40 pointer-events-none" />
            </div>
          </div>
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
            <h4 className="text-xs font-black text-white">Prueba {gameTitle} en Android / iOS</h4>
            <p className="text-[11px] text-slate-400">Juega sin conexión en modo horizontal con físicas 3D a 60 FPS</p>
          </div>
          <a
            href="https://github.com/Orb-lite/Portafolio"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer shrink-0"
          >
            Ver Detalles
          </a>
        </div>

        {/* Skip Warning Modal Overlay if trying to leave early */}
        {showSkipWarning && (
          <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center z-20 animate-in fade-in">
            <AlertTriangle className="h-12 w-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-black text-white">¿Salir sin recompensa?</h4>
            <p className="text-xs text-slate-300 max-w-xs mt-1">
              Si cierras el anuncio ahora no recibirás la vida gratuita. Solo faltan {timeLeft} segundos.
            </p>
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setShowSkipWarning(false)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs transition hover:bg-amber-300 cursor-pointer"
              >
                Continuar Viendo ({timeLeft}s)
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Salir de Todos Modos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
