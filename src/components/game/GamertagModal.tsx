import React, { useState } from 'react';
import { User, Sparkles, Check, X, Shield, Dices } from 'lucide-react';
import { getStoredUser, saveStoredUser, getSupabaseClient } from '../../services/supabaseGame';
import { GameLanguage } from '../../game/localization';

interface GamertagModalProps {
  language?: GameLanguage;
  onClose: () => void;
  onSave?: (newGamertag: string) => void;
}

const RANDOM_ADJECTIVES = ['CYBER', 'CHESS', 'TURBO', 'NEON', 'GOLDEN', 'REEF', 'TROPICAL', 'APEX', 'SWIFT', 'COSMIC'];
const RANDOM_NOUNS = ['MASTER', 'RUNNER', 'KNIGHT', 'WARRIOR', 'KING', 'PILOT', 'CHAMPION', 'SURFER', 'ORB', 'HERO'];

export const GamertagModal: React.FC<GamertagModalProps> = ({ language = 'es', onClose, onSave }) => {
  const isEn = language === 'en';
  const currentUser = getStoredUser();
  const [gamertag, setGamertag] = useState(currentUser.gamertag);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const generateRandom = () => {
    const adj = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
    const noun = RANDOM_NOUNS[Math.floor(Math.random() * RANDOM_NOUNS.length)];
    const num = Math.floor(10 + Math.random() * 89);
    setGamertag(`${adj}_${noun}_${num}`);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = gamertag.toUpperCase().trim().replace(/[^A-Z0-9_]/g, '');

    if (clean.length < 3) {
      setError(isEn ? 'Gamertag must be at least 3 characters.' : 'El Gamertag debe tener al menos 3 caracteres.');
      return;
    }
    if (clean.length > 16) {
      setError(isEn ? 'Gamertag cannot exceed 16 characters.' : 'El Gamertag no puede tener más de 16 caracteres.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const updatedProfile = {
        ...currentUser,
        gamertag: clean,
        last_played: new Date().toISOString(),
      };
      saveStoredUser(updatedProfile);

      // Upsert to Supabase if client is ready
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('tile_absorber_users').upsert(
            {
              gamertag: clean,
              best_score: updatedProfile.best_score || 0,
              games_played: updatedProfile.games_played || 0,
              total_tiles: updatedProfile.total_tiles || 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'gamertag' }
          );
        } catch {
          // ignore if table not present
        }
      }

      setSuccess(true);
      onSave?.(clean);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      setError('Error guardando perfil. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg font-black text-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{isEn ? "Player Profile" : "Perfil de Jugador"}</h3>
            <p className="text-xs text-slate-400">{isEn ? "Choose your Gamertag for the Hall of Fame" : "Elige tu Gamertag para el Salón de la Fama"}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Gamertag
            </label>
            <div className="relative">
              <input
                type="text"
                value={gamertag}
                onChange={(e) => {
                  setGamertag(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''));
                  setError('');
                }}
                maxLength={16}
                placeholder={isEn ? "EG: DIMPZ_ARTIST" : "EJ: DIMPZ_ARTIST"}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 font-mono font-black text-white tracking-wider text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition uppercase"
              />
              <button
                type="button"
                onClick={generateRandom}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition cursor-pointer"
                title={isEn ? "Generate random name" : "Generar nombre aleatorio"}
              >
                <Dices className="h-4 w-4" />
              </button>
            </div>
            {error && <p className="text-xs text-rose-400 font-semibold mt-1.5">{error}</p>}
            <p className="text-[10px] text-slate-400 mt-1">
              {isEn ? "Letters, numbers and underscores (3-16 chars)." : "Letras, números y guiones bajos (3-16 caracteres)."}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">{isEn ? "Highest Score:" : "Puntaje Máximo:"}</span>
            <span className="font-mono font-black text-amber-300">{currentUser.best_score.toLocaleString()} XP</span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              {isEn ? "Cancel" : "Cancelar"}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5"
            >
              {success ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{isEn ? "Saved!" : "¡Guardado!"}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{isEn ? "Save" : "Guardar"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
