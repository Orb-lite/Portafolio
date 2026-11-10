import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Sparkles, RefreshCw, Database, User, X, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { fetchLeaderboard, HighscoreEntry, getStoredUser, getSupabaseConfig } from '../../services/supabaseGame';

interface LeaderboardModalProps {
  language?: 'en' | 'es';
  onClose: () => void;
  onOpenGamertag: () => void;
  onOpenSupabaseConfig?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  language = 'en',
  onClose,
  onOpenGamertag,
}) => {
  const isEn = language === 'en';
  const [scores, setScores] = useState<HighscoreEntry[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = getStoredUser();
  const config = getSupabaseConfig();

  const loadScores = async () => {
    setLoading(true);
    try {
      const res = await fetchLeaderboard();
      setScores(res.scores);
      setIsOnline(res.isOnline);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">{isEn ? 'Hall of Fame' : 'Salón de la Fama'}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'}`}>
                  {isOnline ? (isEn ? '🟢 Global Ranking' : '🟢 Clasificación global') : (isEn ? '🟡 Arcade Mode' : '🟡 Modo arcade')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isEn ? 'Your Gamertag:' : 'Tu Gamertag:'} <strong className="text-cyan-300">{currentUser.gamertag}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-2 py-2.5 text-xs">
          <button
            onClick={onOpenGamertag}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 font-bold transition cursor-pointer"
          >
            <User className="h-3.5 w-3.5" />
            <span>{isEn ? 'Edit Gamertag' : 'Editar Gamertag'}</span>
          </button>

          <button
            onClick={loadScores}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition cursor-pointer"
            title={isEn ? 'Refresh leaderboard' : 'Actualizar clasificación'}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>{isEn ? 'Refresh' : 'Actualizar'}</span>
          </button>
        </div>

        {/* Highscores Table List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2 scrollbar-thin">
          {scores.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              {isEn ? 'No scores yet. Be the first to play!' : 'Aún no hay puntuaciones. ¡Sé el primero en jugar!'}
            </div>
          ) : (
            scores.map((entry, idx) => {
              const isTop1 = idx === 0;
              const isTop2 = idx === 1;
              const isTop3 = idx === 2;
              const isMe = entry.gamertag.toUpperCase() === currentUser.gamertag.toUpperCase();

              return (
                <div
                  key={entry.id || `${entry.gamertag}_${idx}`}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                    isMe
                      ? 'bg-cyan-950/60 border-cyan-400/50 shadow-md ring-1 ring-cyan-400/30'
                      : isTop1
                      ? 'bg-amber-950/40 border-amber-400/40'
                      : isTop2
                      ? 'bg-slate-800/80 border-slate-400/30'
                      : isTop3
                      ? 'bg-amber-900/20 border-amber-700/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 text-center font-black text-sm">
                      {isTop1 ? (
                        <span className="text-amber-400 flex justify-center"><Trophy className="h-4 w-4" /></span>
                      ) : isTop2 ? (
                        <span className="text-slate-300 flex justify-center"><Medal className="h-4 w-4" /></span>
                      ) : isTop3 ? (
                        <span className="text-amber-600 flex justify-center"><Medal className="h-4 w-4" /></span>
                      ) : (
                        <span className="text-slate-500 font-mono text-xs">#{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-white tracking-wide">
                          {entry.gamertag}
                        </span>
                        {isMe && (
                          <span className="text-[9px] font-black bg-cyan-500 text-slate-950 px-1.5 py-0.2 rounded-full uppercase">
                            {isEn ? 'You' : 'Tú'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{isEn ? 'Level' : 'Nivel'} {entry.wave}</span>
                        <span>•</span>
                        <span>{entry.tiles_absorbed} {isEn ? 'tiles' : 'fichas'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm sm:text-base font-black text-amber-300">
                      {entry.score.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>{isEn ? 'Your score is submitted automatically when you complete each level.' : 'Tu puntuación se envía automáticamente al completar cada nivel.'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition cursor-pointer"
          >
            {isEn ? 'Close' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};
