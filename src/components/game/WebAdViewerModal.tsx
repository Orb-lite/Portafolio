import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  Fish,
  Gamepad2,
} from 'lucide-react';
import { GameLanguage } from '../../game/localization';
import { GameVersion } from '../../game/types';

interface WebAdViewerModalProps {
  language?: GameLanguage;
  version?: GameVersion;
  onRewardEarned: () => void;
  onClose: () => void;
}

const AD_PROMOS = {
  conveyor: {
    id: 'conveyor' as const,
    code: 'CR',
    title: 'Conveyor Realms 3D',
    subtitleEn: '3D Conveyor Puzzle Action',
    subtitleEs: 'Acción Puzzle en Cintas 3D',
    src: '/assets/videos/conveyor-realms-gameplay.mp4',
  },
  fof: {
    id: 'fof' as const,
    code: 'FF',
    title: 'Fish Feeder 3D',
    subtitleEn: 'Coral Cove Ocean Puzzle',
    subtitleEs: 'Puzzle Acuático Coral Cove',
    src: '/assets/videos/fish-feeder-gameplay.mp4',
  },
};

export const WebAdViewerModal: React.FC<WebAdViewerModalProps> = ({
  language = 'es',
  version = 'chess',
  onRewardEarned,
  onClose,
}) => {
  const isEn = language === 'en';
  const TOTAL_DURATION = 10;
  const [activePromo, setActivePromo] = useState<'conveyor' | 'fof'>(
    version === 'fof' ? 'fof' : 'conveyor'
  );
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setActivePromo(version === 'fof' ? 'fof' : 'conveyor');
  }, [version]);

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

  const promo = AD_PROMOS[activePromo];
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
              {isEn ? 'Mobile Landscape Game Promo' : 'Promo Móvil Horizontal'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rewardGranted ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer shadow-md"
              >
                <span>{isEn ? 'Claim & Close' : 'Reclamar & Cerrar'}</span>
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleAttemptClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
                title={isEn ? 'Close ad' : 'Cerrar anuncio'}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Promo Switcher Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-white/10 text-[11px]">
          <span className="text-slate-400 font-semibold">
            {isEn ? 'Switch gameplay ad:' : 'Cambiar promo:'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActivePromo('conveyor')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                activePromo === 'conveyor'
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3 h-3" />
              <span>Conveyor Realms</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePromo('fof')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                activePromo === 'fof'
                  ? 'bg-teal-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Fish className="w-3 h-3" />
              <span>Fish Feeder</span>
            </button>
          </div>
        </div>

        {/* Landscape Smartphone Ad Player Viewport */}
        <div className="p-3 sm:p-4 bg-slate-950">
          <div className="relative rounded-[1.5rem] bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-2 border-2 border-slate-600/80 shadow-2xl">
            <div className="relative aspect-video w-full rounded-[1rem] bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-900">
              {/* Left Dynamic Island Notch */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-10 bg-slate-950/95 rounded-full z-20 flex flex-col items-center justify-center gap-1 border border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-900/80" />
              </div>

              <video
                key={promo.src}
                ref={videoRef}
                src={promo.src}
                className="w-full h-full object-contain bg-slate-950"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Brand Overlay */}
              <div className="absolute top-2.5 left-6 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 text-xs">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-white text-[10px]">
                  {promo.code}
                </div>
                <div>
                  <p className="font-bold text-white text-[11px] leading-tight">{promo.title}</p>
                  <p className="text-[9px] text-cyan-300">
                    {isEn ? promo.subtitleEn : promo.subtitleEs}
                  </p>
                </div>
              </div>

              {/* Play / Mute Controls */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/20 text-white transition cursor-pointer backdrop-blur"
                  title={isMuted ? (isEn ? 'Unmute' : 'Activar Sonido') : isEn ? 'Mute' : 'Silenciar'}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-rose-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-emerald-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) videoRef.current.pause();
                      else videoRef.current.play();
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/20 text-white transition cursor-pointer backdrop-blur"
                  title={isPlaying ? (isEn ? 'Pause' : 'Pausar') : isEn ? 'Play' : 'Reproducir'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                </button>
              </div>

              {/* Reward Status Banner */}
              {rewardGranted ? (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 z-30">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-3 shadow-lg animate-bounce">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {isEn ? 'Reward Earned!' : '¡Recompensa Obtenida!'}
                  </h3>
                  <p className="text-xs text-emerald-300 font-bold mt-1">
                    {isEn ? '+1 Life added to your inventory' : '+1 Vida añadida a tu inventario'}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    {isEn ? 'Back to Game' : 'Volver a Jugar'}
                  </button>
                </div>
              ) : (
                <div className="absolute bottom-2.5 left-6 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>
                    {isEn ? 'Life ready in:' : 'Vida lista en:'}{' '}
                    <strong className="text-white text-sm font-black">{timeLeft}s</strong>
                  </span>
                </div>
              )}

              {/* Bottom Home Indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/35 z-10 pointer-events-none" />
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
            <h4 className="text-xs font-black text-white">
              {isEn ? `Try ${promo.title} on Mobile` : `Prueba ${promo.title} en tu Celular`}
            </h4>
            <p className="text-[11px] text-slate-400">
              {isEn
                ? 'Landscape 60 FPS gameplay with 3D levels and cloud progress'
                : 'Gameplay horizontal a 60 FPS con niveles 3D y progreso en la nube'}
            </p>
          </div>
          <button
            onClick={() => window.open('https://github.com/Orb-lite/Portafolio', '_blank')}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer shrink-0"
          >
            {isEn ? 'View Details' : 'Ver Detalles'}
          </button>
        </div>

        {/* Skip Warning Modal Overlay */}
        {showSkipWarning && (
          <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center z-40 animate-in fade-in">
            <AlertTriangle className="h-12 w-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-black text-white">
              {isEn ? 'Exit without reward?' : '¿Salir sin recompensa?'}
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mt-1">
              {isEn
                ? `If you close the ad now you will not receive the free life. Only ${timeLeft} seconds left.`
                : `Si cierras el anuncio ahora no recibirás la vida gratuita. Solo faltan ${timeLeft} segundos.`}
            </p>
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setShowSkipWarning(false)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs transition hover:bg-amber-300 cursor-pointer"
              >
                {isEn ? `Continue Watching (${timeLeft}s)` : `Continuar Viendo (${timeLeft}s)`}
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                {isEn ? 'Exit Anyway' : 'Salir de Todos Modos'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
