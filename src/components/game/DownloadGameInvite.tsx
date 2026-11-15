import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  QrCode,
  X,
  Laptop,
  Fish,
  Gamepad2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GameVersion } from '../../game/types';
import realGameScreenshot from '../../assets/images/regenerated_image_1794206153590.png';

interface DownloadGameInviteProps {
  context?: 'win' | 'death';
  level?: number;
  compact?: boolean;
  language?: 'en' | 'es';
  gameName?: string;
  version?: GameVersion;
}

const PROMO_VIDEOS = {
  conveyor: {
    id: 'conveyor' as const,
    title: 'Conveyor Realms 3D',
    badge: 'Tile Absorber',
    videoSrc: '/assets/aistudio/tile_absorber_64df8e71.mp4',
  },
  fof: {
    id: 'fof' as const,
    title: 'Fish Feeder 3D',
    badge: 'Coral Cove',
    videoSrc: '/assets/aistudio/Fish_feeder_6c148142.mp4',
  },
};

export const DownloadGameInvite: React.FC<DownloadGameInviteProps> = ({
  context = 'win',
  level = 1,
  compact = false,
  language = 'es',
  gameName,
  version,
}) => {
  const isEn = language === 'en';
  const defaultIsFof =
    version === 'fof' || (gameName ? gameName.toLowerCase().includes('fish') : false);

  const [activePromo, setActivePromo] = useState<'conveyor' | 'fof'>(
    defaultIsFof ? 'fof' : 'conveyor'
  );
  const [isMuted, setIsMuted] = useState(true);
  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  useEffect(() => {
    setActivePromo(defaultIsFof ? 'fof' : 'conveyor');
  }, [defaultIsFof]);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as unknown as { deferredPrompt?: Event }).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const promo = PROMO_VIDEOS[activePromo];
  const isFofPromo = activePromo === 'fof';
  const effectiveGameName = gameName || promo.title;

  const handleDownloadClick = () => {
    const deferredPrompt = (
      window as unknown as {
        deferredPrompt?: {
          prompt: () => void;
          userChoice?: Promise<{ outcome: string }>;
        };
      }
    ).deferredPrompt;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      if (deferredPrompt.userChoice) {
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            setInstallStatus(
              isEn
                ? 'Game successfully installed on your device!'
                : '¡Juego instalado exitosamente en tu dispositivo!'
            );
          }
        });
      }
      setInstallStatus(
        isEn
          ? 'Installing game on your device...'
          : '¡Instalando juego en tu dispositivo móvil...'
      );
    } else {
      setShowQrModal(true);
      setInstallStatus(
        isEn
          ? 'Scan the QR code or tap Share > Add to Home Screen!'
          : '¡Escanea el código QR o pulsa Compartir > Añadir a pantalla de inicio!'
      );
    }
  };

  const handleDownloadOfflineBundle = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${effectiveGameName} - Mobile Game Launcher</title>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #020617; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { background: #0f172a; border: 1px solid #06b6d4; padding: 28px; border-radius: 24px; text-align: center; max-width: 90%; box-shadow: 0 20px 40px rgba(6,182,212,0.25); }
    h1 { margin: 0 0 10px; font-size: 22px; color: #38bdf8; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 20px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #6366f1); color: #020617; font-weight: 900; font-size: 15px; padding: 14px 28px; border-radius: 16px; text-decoration: none; box-shadow: 0 8px 20px rgba(6,182,212,0.4); }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎮 ${effectiveGameName}</h1>
    <p>${isEn ? 'Click below to launch the 60 FPS full-screen game on your mobile device!' : '¡Haz clic para iniciar el juego en pantalla completa a 60 FPS en tu celular o tablet!'}</p>
    <a class="btn" href="${window.location.href}" target="_blank">${isEn ? '🚀 Launch Game' : '🚀 Iniciar Juego'}</a>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${effectiveGameName.replace(/\s+/g, '_')}_Launcher.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setInstallStatus(
      isEn ? 'Downloaded offline game launcher!' : '¡Lanzador offline del juego descargado!'
    );
  };

  return (
    <div className="w-full my-3 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/85 to-slate-950 border border-cyan-500/35 p-3.5 sm:p-4 text-left shadow-2xl overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Title and Toggle */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
            <Smartphone className="w-5 h-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-white tracking-tight">
                {context === 'death'
                  ? isEn
                    ? `Out of Lives? Download ${promo.title}!`
                    : `¿Sin vidas? ¡Descarga ${promo.title} en tu Celular!`
                  : isEn
                  ? `Level ${level} Cleared! Play ${promo.title} on Mobile!`
                  : `¡Nivel ${level} Completado! ¡Juega ${promo.title} en tu Celular!`}
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono">
                Android / iOS / PWA
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight truncate">
              {context === 'death'
                ? isEn
                  ? 'Landscape 60 FPS mobile gameplay with touch controls & life alerts.'
                  : 'Gameplay móvil horizontal a 60 FPS con controles táctiles y alertas de vida.'
                : isEn
                ? '100% optimized for landscape touch controls at 60 FPS.'
                : '100% optimizado para pantalla horizontal táctil a 60 FPS.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-bold text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 transition shrink-0 cursor-pointer shadow-sm"
        >
          {isExpanded ? (isEn ? 'Collapse' : 'Ocultar') : isEn ? 'Show Phone Preview' : 'Ver Teléfono'}
        </button>
      </div>

      {isExpanded && (
        <div className="relative z-10 space-y-3 pt-1">
          {/* Promo Switcher: Tile Absorber vs Fish Feeder */}
          <div className="flex items-center justify-between gap-2 flex-wrap bg-slate-950/75 border border-slate-800 rounded-xl p-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              {isEn ? 'Mobile Promo Preview:' : 'Promo Móvil:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActivePromo('conveyor')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activePromo === 'conveyor'
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700/70'
                }`}
              >
                <Gamepad2 className="w-3 h-3" />
                <span>Conveyor Realms</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePromo('fof')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activePromo === 'fof'
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700/70'
                }`}
              >
                <Fish className="w-3 h-3" />
                <span>Fish Feeder</span>
              </button>
            </div>
          </div>

          {/* Main Visual: Realistic LANDSCAPE Smartphone Mockup + Benefits */}
          <div className="flex flex-col items-center gap-3.5 bg-slate-950/70 border border-slate-800 rounded-xl p-3 shadow-inner">
            {/* Realistic LANDSCAPE Smartphone Frame (16:9 widescreen orientation) */}
            <div className="relative w-full max-w-[440px] rounded-[1.75rem] bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-2 sm:p-2.5 shadow-2xl border-2 border-slate-600/80">
              {/* Top Hardware Volume/Power Buttons */}
              <div className="absolute -top-1 left-14 w-8 h-1 bg-slate-600 rounded-t-sm" />
              <div className="absolute -top-1 left-24 w-8 h-1 bg-slate-600 rounded-t-sm" />

              {/* Inner Smartphone Landscape Screen */}
              <div className="relative w-full aspect-video rounded-[1.2rem] overflow-hidden bg-slate-950 border border-slate-900 flex items-center justify-center">
                {/* Left Dynamic Island Notch (Landscape Orientation) */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-12 bg-slate-950/95 rounded-full z-20 flex flex-col items-center justify-center gap-1.5 border border-slate-800/80 shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-900/80" />
                </div>

                {/* Looping 16:9 Landscape Gameplay Video (un-cropped) */}
                <video
                  key={promo.videoSrc}
                  src={promo.videoSrc}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-contain bg-slate-950"
                />

                {/* Subtle glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-500/10 pointer-events-none" />

                {/* Top-right Phone Mode Badge, 60 FPS & Audio Toggle */}
                <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-md border backdrop-blur-xs ${
                      isFofPromo
                        ? 'bg-teal-950/85 text-teal-300 border-teal-400/40'
                        : 'bg-slate-900/85 text-cyan-300 border-cyan-400/40'
                    }`}
                  >
                    {promo.title}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300 bg-slate-900/85 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                    60 FPS
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 rounded-md bg-slate-900/85 hover:bg-slate-800 text-white border border-white/20 cursor-pointer transition"
                    title={
                      isMuted
                        ? isEn
                          ? 'Unmute promo'
                          : 'Activar sonido'
                        : isEn
                        ? 'Mute promo'
                        : 'Silenciar'
                    }
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3 text-rose-400" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-emerald-400" />
                    )}
                  </button>
                </div>

                {/* Bottom Home Gesture Indicator Bar (Landscape) */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/40 z-20 pointer-events-none" />
              </div>
            </div>

            {/* Info, Thumbnail & Action Buttons */}
            <div className="w-full space-y-2.5 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={realGameScreenshot}
                    alt={`${promo.title} Thumbnail`}
                    className="w-14 h-9 rounded-lg object-cover border border-cyan-500/40 shrink-0 shadow"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                      {promo.title} Mobile
                    </h4>
                    <p className="text-[10px] text-cyan-300 font-semibold truncate">
                      {level > 0
                        ? isEn
                          ? `Level ${level} ready in landscape mode`
                          : `Nivel ${level} listo en modo horizontal`
                        : isEn
                        ? 'Synced with your session'
                        : 'Sincronizado con tu sesión'}
                    </p>
                  </div>
                </div>

                <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-300">
                  <li className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{isEn ? '60 FPS Touch' : 'Táctil 60 FPS'}</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{isEn ? 'Instant PWA' : 'PWA Directa'}</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{isEn ? 'Auto Cloud Save' : 'Guardado Auto'}</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>
                    {isEn ? 'Download / Install on Phone' : 'Descargar / Instalar en Celular'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isEn ? 'Mobile QR' : 'QR Móvil'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadOfflineBundle}
                  title={isEn ? 'Download offline web launcher' : 'Descargar lanzador web offline'}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Laptop className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isEn ? 'Save .html' : 'Guardar .html'}</span>
                </button>
              </div>

              {installStatus && (
                <p className="text-[10px] font-bold text-emerald-300 animate-fade-in">
                  ✨ {installStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code / Share Instructions Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/40 p-5 text-center text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto mb-2 border border-cyan-400/40">
              <Smartphone className="w-5 h-5" />
            </div>

            <h3 className="text-base font-black text-white">
              {isEn ? `Play ${promo.title} on Smartphone` : `Jugar ${promo.title} en tu Smartphone`}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {isEn
                ? 'Open this URL from your mobile browser (Chrome or Safari) to install in 1 click:'
                : 'Abre este enlace desde tu navegador móvil (Chrome o Safari) para instalar la aplicación en 1 clic:'}
            </p>

            {/* Landscape Video Preview */}
            <div className="my-3 mx-auto w-full aspect-video rounded-xl overflow-hidden border border-slate-700 shadow-md bg-slate-950">
              <video
                src={promo.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs font-mono text-cyan-300 break-all select-all">
              {typeof window !== 'undefined' ? window.location.origin : ''}
            </div>

            <div className="mt-3 text-left bg-slate-800/60 rounded-xl p-3 border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <p className="font-bold text-amber-300">
                {isEn ? '📱 Fast Mobile Steps:' : '📱 Pasos de instalación:'}
              </p>
              <p>
                {isEn
                  ? '1. Open link on mobile (Chrome or Safari).'
                  : '1. Abre el enlace en tu navegador móvil (Chrome / Safari).'}
              </p>
              <p>
                {isEn
                  ? '2. Tap menu (three dots or Share button).'
                  : '2. Pulsa en el menú (tres puntos o botón Compartir).'}
              </p>
              <p>
                {isEn
                  ? '3. Tap "Add to Home Screen" / "Install App".'
                  : '3. Selecciona "Añadir a pantalla de inicio" o "Instalar Aplicación".'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs cursor-pointer shadow-md"
            >
              {isEn ? 'Got it!' : 'Entendido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
