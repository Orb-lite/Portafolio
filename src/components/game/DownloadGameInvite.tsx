import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Sparkles, CheckCircle2, Play, QrCode, X, Laptop } from 'lucide-react';
import realGameScreenshot from '../../assets/images/regenerated_image_1794206153590.png';

interface DownloadGameInviteProps {
  context?: 'win' | 'death';
  level?: number;
  compact?: boolean;
  language?: 'en' | 'es';
  gameName?: string;
}

export const DownloadGameInvite: React.FC<DownloadGameInviteProps> = ({
  context = 'win',
  level = 1,
  compact = false,
  language = 'es',
  gameName,
}) => {
  const isEn = language === 'en';
  const effectiveGameName = gameName || (isEn ? 'Conveyor Realms & Fish Feeder' : 'Conveyor Realms & Fish Feeder');

  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Video source for smartphone gameplay showcase
  const videoSrc = '/portfolio_assets/unreal-standalone-gameplay.mp4';

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as unknown as { deferredPrompt?: Event }).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleDownloadClick = () => {
    const deferredPrompt = (window as unknown as { deferredPrompt?: { prompt: () => void; userChoice?: Promise<{ outcome: string }> } }).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      if (deferredPrompt.userChoice) {
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            setInstallStatus(isEn ? 'Game successfully installed on your device!' : '¡Juego instalado exitosamente en tu dispositivo!');
          }
        });
      }
      setInstallStatus(isEn ? 'Installing game on your device...' : '¡Instalando juego en tu dispositivo móvil...');
    } else {
      setShowQrModal(true);
      setInstallStatus(isEn ? 'Scan the QR code or tap Share > Add to Home Screen!' : '¡Escanea el código QR o pulsa Compartir > Añadir a pantalla de inicio!');
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
    setInstallStatus(isEn ? 'Downloaded offline game launcher!' : '¡Lanzador offline del juego descargado!');
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
                  ? (isEn ? '💀 Out of Lives? Download on Your Phone!' : '💀 ¿Sin vidas? ¡Descárgalo en tu Celular!')
                  : (isEn ? `🎉 Level ${level} Cleared! Play on Mobile!` : `🎉 ¡Nivel ${level} Completado! ¡Juega en tu Celular!`)}
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono">
                Android / iOS / PWA
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight truncate">
              {context === 'death'
                ? (isEn ? 'Full-screen touch mode with instant life recovery notifications.' : 'Pantalla completa táctil con notificaciones de vidas recuperadas.')
                : (isEn ? '100% full-screen touch controls with zero lag at 60 FPS.' : '100% optimizado para controles táctiles a 60 FPS sin barras de navegador.')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-bold text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 transition shrink-0 cursor-pointer shadow-sm"
        >
          {isExpanded ? (isEn ? 'Collapse' : 'Ocultar') : (isEn ? 'Show Phone Preview' : 'Ver Teléfono')}
        </button>
      </div>

      {isExpanded && (
        <div className="relative z-10 space-y-3 pt-1">
          {/* Main Visual: Realistic Smartphone Mockup with Gameplay Video & Game Thumbnail */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-slate-950/70 border border-slate-800 rounded-xl p-3 shadow-inner">
            {/* Realistic Smartphone Frame */}
            <div className="relative w-36 sm:w-44 h-60 sm:h-72 rounded-[2rem] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-2 shadow-2xl border border-slate-600/80 shrink-0">
              {/* Phone Speaker / Dynamic Island Notch */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-14 h-3 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800 mr-1" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-900/60" />
              </div>

              {/* Inner Smartphone Screen */}
              <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-slate-950 flex flex-col justify-between border border-slate-900">
                {/* Looping Gameplay Video */}
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />

                {/* Subtle glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-500/10 pointer-events-none" />

                {/* Top Phone Status & Mini Thumbnail Stamp */}
                <div className="relative z-10 p-2 pt-5 flex items-center justify-between text-[9px] text-white">
                  <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-700/80">
                    <img
                      src={realGameScreenshot}
                      alt="Game Thumbnail Icon"
                      className="w-3.5 h-3.5 rounded object-cover"
                    />
                    <span className="font-bold text-[8px] text-cyan-300 truncate max-w-[80px]">{effectiveGameName}</span>
                  </div>

                  <span className="text-[8px] font-mono text-emerald-400 bg-slate-900/80 px-1 rounded">
                    60 FPS
                  </span>
                </div>

                {/* Bottom Touch Controls & Play Action */}
                <div className="relative z-10 p-2 pb-3 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-400/40 mb-1 animate-pulse">
                    <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  </div>
                  <span className="text-[8px] font-extrabold text-white tracking-wider uppercase">
                    Touch Controls
                  </span>
                </div>
              </div>
            </div>

            {/* Right Information & Benefits */}
            <div className="flex-1 space-y-2.5 text-left w-full">
              {/* Thumbnail Card with Title */}
              <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <img
                  src={realGameScreenshot}
                  alt={`${effectiveGameName} Thumbnail`}
                  className="w-14 h-10 rounded-lg object-cover border border-cyan-500/40 shrink-0 shadow"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                    {effectiveGameName} Mobile
                  </h4>
                  <p className="text-[10px] text-cyan-300 font-semibold truncate">
                    {level > 0
                      ? (isEn ? `Level ${level} ready to play offline` : `Nivel ${level} listo para jugar`)
                      : (isEn ? 'Synced with your session' : 'Sincronizado con tu sesión')}
                  </p>
                </div>
              </div>

              {/* Mobile Features List */}
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Ultra-responsive touch input at locked 60 FPS' : 'Respuesta táctil instantánea a 60 FPS'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? '1-Click Instant Install (No heavy store downloads)' : 'Instalación instantánea en 1 clic (sin tiendas pesadas)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? `Progress and Level ${level} saved automatically` : `Progreso y Nivel ${level} guardados automáticamente`}</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isEn ? 'Download / Install on Phone' : 'Descargar / Instalar en Celular'}</span>
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
              {isEn ? 'Play on Your Smartphone' : 'Jugar en tu Smartphone'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {isEn
                ? 'Open this URL from your mobile browser (Chrome or Safari) to install in 1 click:'
                : 'Abre este enlace desde tu navegador móvil (Chrome o Safari) para instalar la aplicación en 1 clic:'}
            </p>

            {/* Thumbnail preview */}
            <div className="my-3 mx-auto w-32 aspect-video rounded-lg overflow-hidden border border-slate-700 shadow-md">
              <img
                src={realGameScreenshot}
                alt={`${effectiveGameName} Mobile`}
                className="w-full h-full object-cover"
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
