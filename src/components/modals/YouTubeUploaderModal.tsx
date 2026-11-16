import React, { useState } from 'react';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Youtube,
  Sparkles,
  Lock,
  Globe,
  Film,
  Play,
  Share2,
  Tag,
  FileText,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import {
  YouTubeVideoMetadata,
  YouTubeChannelProfile,
  DEFAULT_YOUTUBE_PORTFOLIO_POSTS,
  authenticateYouTube,
  uploadToYouTube,
  getCachedYouTubeToken,
  getCachedChannelProfile,
} from '../../services/youtubeService';

interface YouTubeUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'es' | 'en';
  onVideoUploaded?: (projectId: string, youtubeId: string) => void;
}

export function YouTubeUploaderModal({
  isOpen,
  onClose,
  language = 'es',
  onVideoUploaded,
}: YouTubeUploaderModalProps) {
  const isEn = language === 'en';
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getCachedYouTubeToken());
  const [channelProfile, setChannelProfile] = useState<YouTubeChannelProfile | null>(() => getCachedChannelProfile());
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [videos, setVideos] = useState<YouTubeVideoMetadata[]>(DEFAULT_YOUTUBE_PORTFOLIO_POSTS);
  const [activeEditingId, setActiveEditingId] = useState<string>(DEFAULT_YOUTUBE_PORTFOLIO_POSTS[0].id);
  const [isBatchUploading, setIsBatchUploading] = useState<boolean>(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnectGoogle = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const { token, profile } = await authenticateYouTube();
      setIsAuthenticated(true);
      setChannelProfile(profile);
    } catch (err: any) {
      console.error('Google YouTube OAuth error:', err);
      setAuthError(err.message || 'No se pudo completar la autorización con Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUpdateField = (
    id: string,
    field: keyof YouTubeVideoMetadata,
    value: any
  ) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleUploadSingle = async (video: YouTubeVideoMetadata) => {
    if (!isAuthenticated) {
      await handleConnectGoogle();
      if (!getCachedYouTubeToken()) return;
    }

    handleUpdateField(video.id, 'status', 'uploading');
    handleUpdateField(video.id, 'progress', 5);
    handleUpdateField(video.id, 'errorMessage', undefined);

    try {
      const result = await uploadToYouTube(video, (progress) => {
        handleUpdateField(video.id, 'progress', progress);
      });

      handleUpdateField(video.id, 'status', 'completed');
      handleUpdateField(video.id, 'uploadedVideoId', result.videoId);
      handleUpdateField(video.id, 'progress', 100);

      if (video.linkedProjectId && onVideoUploaded) {
        onVideoUploaded(video.linkedProjectId, result.videoId);
      }
    } catch (err: any) {
      console.error('Upload error for', video.title, err);
      handleUpdateField(video.id, 'status', 'error');
      handleUpdateField(video.id, 'errorMessage', err.message || 'Error al subir a YouTube');
    }
  };

  const handleUploadAll = async () => {
    if (!isAuthenticated) {
      await handleConnectGoogle();
      if (!getCachedYouTubeToken()) return;
    }

    setIsBatchUploading(true);
    const pendingVideos = videos.filter((v) => v.status !== 'completed');

    for (const v of pendingVideos) {
      await handleUploadSingle(v);
    }
    setIsBatchUploading(false);
  };

  const handleCopyPost = (video: YouTubeVideoMetadata) => {
    const postText = `${video.title}\n\n${video.description}\n\nTags: ${video.tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ')}`;
    navigator.clipboard.writeText(postText);
    setCopiedPostId(video.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const activeVideo = videos.find((v) => v.id === activeEditingId) || videos[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isEn ? 'YouTube Video Publisher Studio' : 'Publicador de Videos en YouTube'}</span>
                <span className="text-[11px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                  OAuth 2.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isEn
                  ? 'Connect your Google account to upload portfolio clips directly to your channel with tailored SEO descriptions.'
                  : 'Conecta tu cuenta de Google para subir los videos de tu portafolio directamente a tu canal con títulos y descripciones optimizadas.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Authentication Banner */}
        <div className="px-6 py-3.5 bg-slate-800/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400">
                      {isEn ? 'Google Account Connected' : 'Cuenta de Google Conectada'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-xs text-slate-300 font-medium">
                    {channelProfile?.title || 'YouTube Channel Ready'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    {isEn ? 'Google Account Not Connected Yet' : 'Cuenta de Google No Conectada Aún'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isEn ? 'Authorize with your Google account to enable 1-click publishing' : 'Autoriza tu cuenta para habilitar la subida automática a tu canal'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={handleConnectGoogle}
                disabled={isAuthenticating}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isEn ? 'Authorizing...' : 'Conectando con Google...'}</span>
                  </>
                ) : (
                  <>
                    <Youtube className="w-4 h-4" />
                    <span>{isEn ? 'Connect Google Account' : 'Conectar Cuenta de Google'}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUploadAll}
                disabled={isBatchUploading}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isBatchUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isEn ? 'Uploading Batch...' : 'Subiendo Lote...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>{isEn ? 'Upload All to YouTube' : 'Subir Todos a YouTube'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="px-6 py-2.5 bg-red-950/70 border-b border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Modal Main Content: Left Queue List + Right Detail Editor */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Video List (5 cols) */}
          <div className="lg:col-span-5 border-r border-slate-800 overflow-y-auto p-4 space-y-2.5 bg-slate-950/50">
            <div className="px-2 pb-1 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>{isEn ? 'Portfolio Videos Queue' : 'Cola de Videos del Portafolio'} ({videos.length})</span>
            </div>

            {videos.map((vid) => {
              const isSelected = vid.id === activeEditingId;
              const isCompleted = vid.status === 'completed';
              const isUploading = vid.status === 'uploading';
              const isError = vid.status === 'error';

              return (
                <div
                  key={vid.id}
                  onClick={() => setActiveEditingId(vid.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-sky-500 ring-1 ring-sky-500/50 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-16 rounded-lg bg-slate-950 overflow-hidden relative shrink-0 border border-slate-700/60 flex items-center justify-center">
                    {vid.thumbnailSrc ? (
                      <img src={vid.thumbnailSrc} alt={vid.title} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="w-6 h-6 text-slate-600" />
                    )}
                    {isCompleted && (
                      <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-1">
                        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                        <span className="text-[10px] font-mono text-sky-300 font-bold">{vid.progress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{vid.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                        {vid.localVideoSrc.split('/').pop()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] mt-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {vid.privacyStatus === 'public'
                          ? isEn ? 'Public' : 'Público'
                          : vid.privacyStatus === 'unlisted'
                          ? isEn ? 'Unlisted' : 'No Listado'
                          : isEn ? 'Private' : 'Privado'}
                      </span>

                      {isCompleted && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{isEn ? 'Published' : 'Publicado'}</span>
                        </span>
                      )}
                      {isUploading && (
                        <span className="text-sky-400 font-bold animate-pulse">
                          {vid.progress}%
                        </span>
                      )}
                      {isError && (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Error</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Editor & Action Panel (7 cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-4 bg-slate-900">
            {activeVideo && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                      {isEn ? 'Video Post Details' : 'Configuración de Publicación'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {activeVideo.title}
                    </h3>
                  </div>

                  {activeVideo.uploadedVideoId && (
                    <a
                      href={`https://youtu.be/${activeVideo.uploadedVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-red-600/30 transition-colors shrink-0"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>{isEn ? 'Watch on YouTube' : 'Ver en YouTube'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Upload Status Card if Uploading or Completed */}
                {activeVideo.status === 'uploading' && (
                  <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sky-300 flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                        <span>{isEn ? 'Uploading to your YouTube Channel...' : 'Subiendo a tu canal de YouTube...'}</span>
                      </span>
                      <span className="font-mono text-sky-400 font-bold">{activeVideo.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-sky-400 transition-all duration-300"
                        style={{ width: `${activeVideo.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {activeVideo.status === 'completed' && activeVideo.uploadedVideoId && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-between gap-3 text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold block">
                          {isEn ? 'Video Successfully Published!' : '¡Video Publicado Exitosamente!'}
                        </span>
                        <span className="text-[11px] text-emerald-400/80 font-mono">
                          ID: {activeVideo.uploadedVideoId} · https://youtu.be/{activeVideo.uploadedVideoId}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://youtu.be/${activeVideo.uploadedVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shrink-0"
                    >
                      {isEn ? 'Open Link' : 'Abrir Video'}
                    </a>
                  </div>
                )}

                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>{isEn ? 'YouTube Video Title' : 'Título del Video'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {activeVideo.title.length}/100
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={activeVideo.title}
                    onChange={(e) => handleUpdateField(activeVideo.id, 'title', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-sky-500 transition-colors"
                  />
                </div>

                {/* Privacy & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {isEn ? 'Privacy' : 'Privacidad'}
                    </label>
                    <select
                      value={activeVideo.privacyStatus}
                      onChange={(e) =>
                        handleUpdateField(
                          activeVideo.id,
                          'privacyStatus',
                          e.target.value as 'public' | 'unlisted' | 'private'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-sky-500"
                    >
                      <option value="public">{isEn ? 'Public' : 'Público (Recomendado)'}</option>
                      <option value="unlisted">{isEn ? 'Unlisted' : 'No Listado'}</option>
                      <option value="private">{isEn ? 'Private' : 'Privado'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {isEn ? 'Category' : 'Categoría YouTube'}
                    </label>
                    <select
                      value={activeVideo.categoryId}
                      onChange={(e) => handleUpdateField(activeVideo.id, 'categoryId', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-sky-500"
                    >
                      <option value="20">Gaming (Videojuegos)</option>
                      <option value="28">Science & Technology (Ciencia y Tecnología)</option>
                      <option value="27">Education (Educación)</option>
                    </select>
                  </div>
                </div>

                {/* Description TextArea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isEn ? 'Video Description & Post Content' : 'Descripción del Video y Redes Sociales'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPost(activeVideo)}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedPostId === activeVideo.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{isEn ? 'Copied!' : '¡Copiado!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isEn ? 'Copy Post Text' : 'Copiar Texto del Post'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={activeVideo.description}
                    onChange={(e) => handleUpdateField(activeVideo.id, 'description', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-sans leading-relaxed focus:outline-hidden focus:border-sky-500 transition-colors"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isEn ? 'Tags / Keywords' : 'Etiquetas / Palabras Clave'}</span>
                  </label>
                  <input
                    type="text"
                    value={activeVideo.tags.join(', ')}
                    onChange={(e) =>
                      handleUpdateField(
                        activeVideo.id,
                        'tags',
                        e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                      )
                    }
                    placeholder="Unreal Engine, Technical Artist, Shaders, C++..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleCopyPost(activeVideo)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-300" />
                    <span>{isEn ? 'Copy for LinkedIn / Social Media' : 'Copiar para LinkedIn / Redes'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUploadSingle(activeVideo)}
                    disabled={activeVideo.status === 'uploading'}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {activeVideo.status === 'uploading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isEn ? 'Uploading...' : 'Subiendo Video...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>
                          {activeVideo.status === 'completed'
                            ? isEn ? 'Re-upload to YouTube' : 'Volver a Subir a YouTube'
                            : isEn ? 'Upload to YouTube Channel' : 'Subir a mi Canal de YouTube'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
