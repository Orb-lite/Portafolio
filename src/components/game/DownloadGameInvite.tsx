import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Sparkles, CheckCircle2, Play, Pause, ExternalLink, QrCode, X, Layers, Flame } from 'lucide-react';
import realGameScreenshot from '../../assets/images/regenerated_image_1794206153590.png';

interface DownloadGameInviteProps {
  context?: 'win' | 'death';
  level?: number;
  compact?: boolean;
}

export const DownloadGameInvite: React.FC<DownloadGameInviteProps> = ({
  context = 'win',
  level = 1,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Video source for smartphone gameplay showcase
  const videoSrc = '/portfolio_assets/unreal-standalone-gameplay.mp4';

  const handleDownloadClick = () => {
    // Check if browser has deferred prompt
    const deferredPrompt = (window as unknown as { deferredPrompt?: { prompt: () => void } }).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setInstallStatus('¡Instalando en tu dispositivo móvil!');
    } else {
      setShowQrModal(true);
      setInstallStatus('¡Escanea el código QR o añade a tu pantalla de inicio!');
    }
  };

  return (
    <div className="w-full my-3 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-cyan-500/30 p-3.5 sm:p-4 text-left shadow-xl overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Title and Toggle */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-white tracking-tight">
                {context === 'death'
                  ? '¿Sin vidas? ¡Descárgalo en tu Celular!'
                  : '¡Lleva Conveyor Realms en tu Smartphone!'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                Android / iOS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              {context === 'death'
                ? 'Juega en pantalla completa táctil con notificaciones de vidas recuperadas.'
                : '100% optimizado para controles táctiles sin barras de navegador.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition shrink-0 cursor-pointer"
        >
          {isExpanded ? 'Ocultar' : 'Ver Teléfono'}
        </button>
      </div>

      {isExpanded && (
        <div className="relative z-10 space-y-3 pt-1">
          {/* Main Visual: Realistic Smartphone Mockup with Gameplay Video & Game Thumbnail */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            {/* Realistic Smartphone Frame */}
            <div className="relative w-40 sm:w-44 h-64 sm:h-72 rounded-[2rem] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-2 shadow-2xl border border-slate-600/80 shrink-0">
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
                    <span className="font-bold text-[8px] text-cyan-300">Conveyor 3D</span>
                  </div>

                  <span className="text-[8px] font-mono text-emerald-400 bg-slate-900/80 px-1 rounded">
                    60 FPS
                  </span>
                </div>

                {/* Bottom Touch Controls & Play Action */}
                <div className="relative z-10 p-2 pb-3 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 mb-1 animate-pulse">
                    <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  </div>
                  <span className="text-[8px] font-extrabold text-white tracking-wider uppercase">
                    Touch Controls
                  </span>
                </div>
              </div>
            </div>

            {/* Right Information & Benefits */}
            <div className="flex-1 space-y-2 text-left">
              {/* Thumbnail Card with Title */}
              <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <img
                  src={realGameScreenshot}
                  alt="Conveyor Realms Thumbnail"
                  className="w-14 h-10 rounded-lg object-cover border border-cyan-500/30 shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Conveyor Realms Mobile
                  </h4>
                  <p className="text-[10px] text-cyan-300 font-medium">
                    {level > 0 ? `Tu nivel ${level} listo para jugar` : 'Sincronizado con tu sesión'}
                  </p>
                </div>
              </div>

              {/* Mobile Features List */}
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Respuesta táctil instantánea a 60 FPS</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sin descargas pesadas de tiendas (Instalación instantánea)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Guarda tu sesión y nivel sin perder progreso</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-950/40 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>Descargar / Instalar en Celular</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>QR Móvil</span>
                </button>
              </div>

              {installStatus && (
                <p className="text-[10px] font-semibold text-emerald-300 animate-fade-in">
                  {installStatus}
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
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto mb-2 border border-cyan-400/40">
              <Smartphone className="w-5 h-5" />
            </div>

            <h3 className="text-base font-black text-white">
              Jugar en tu Smartphone
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Abre este enlace desde tu navegador móvil (Chrome o Safari) para instalar la aplicación en 1 clic:
            </p>

            {/* Thumbnail preview */}
            <div className="my-3 mx-auto w-32 aspect-video rounded-lg overflow-hidden border border-slate-700 shadow-md">
              <img
                src={realGameScreenshot}
                alt="Conveyor Realms Mobile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs font-mono text-cyan-300 break-all select-all">
              {window.location.origin}
            </div>

            <div className="mt-3 text-left bg-slate-800/60 rounded-xl p-3 border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <p className="font-bold text-amber-300">📱 Pasos de instalación:</p>
              <p>1. Abre el enlace en tu navegador móvil (Chrome / Safari).</p>
              <p>2. Pulsa en el menú (tres puntos o botón Compartir).</p>
              <p>3. Selecciona <strong>&quot;Añadir a pantalla de inicio&quot;</strong>.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
