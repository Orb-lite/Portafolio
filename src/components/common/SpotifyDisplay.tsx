import React, { useState } from 'react';
import { Music2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface SpotifyDisplayProps {
  language?: 'es' | 'en';
}

const SPOTIFY_EMBED_URL =
  'https://open.spotify.com/embed/playlist/37i9dQZF1E8NkuY4NBItXx?utm_source=generator&si=21963c3747a940a1';
const SPOTIFY_PLAYLIST_URL =
  'https://open.spotify.com/playlist/37i9dQZF1E8NkuY4NBItXx?si=21963c3747a940a1';

export const SpotifyDisplay: React.FC<SpotifyDisplayProps> = ({ language = 'es' }) => {
  const isEn = language === 'en';
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <section
      aria-label={isEn ? 'Spotify Studio Playlist Display' : 'Reproductor Spotify del Portafolio'}
      className="no-print max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 pb-8"
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/90 border border-emerald-500/30 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                  {isEn ? 'Spotify Studio Soundtrack' : 'Soundtrack del Portafolio · Spotify'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Spotify Mix
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isEn
                  ? 'Listen while exploring 3D environments, AI workflows, and game design drafts.'
                  : 'Escucha música mientras exploras los entornos 3D, automatizaciones y borradores de diseño.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={SPOTIFY_PLAYLIST_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
            >
              <span>{isEn ? 'Open in Spotify' : 'Abrir en Spotify'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-expanded={!isCollapsed}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>{isCollapsed ? (isEn ? 'Expand' : 'Mostrar') : isEn ? 'Minimize' : 'Minimizar'}</span>
              {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Embedded Spotify Player (kept mounted when minimized to avoid stopping playback) */}
        <div className={isCollapsed ? 'hidden' : 'p-3 sm:p-4 bg-slate-950/60'}>
          <iframe
            data-testid="embed-iframe"
            title={isEn ? 'Spotify Playlist Player' : 'Reproductor de Playlist en Spotify'}
            src={SPOTIFY_EMBED_URL}
            width="100%"
            height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full h-[352px] rounded-xl border-0 block"
          />
        </div>
      </div>
    </section>
  );
};
