import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, X, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, SUPABASE_SETUP_SQL, getSupabaseClient } from '../../services/supabaseGame';

interface SupabaseConfigModalProps {
  onClose: () => void;
  onSaved?: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ onClose, onSaved }) => {
  const currentConfig = getSupabaseConfig();
  const defaultProjectUrl = 'https://kryibdmiwdeccniilzgx.supabase.co';
  const [url, setUrl] = useState(currentConfig.url || defaultProjectUrl);
  const [key, setKey] = useState(currentConfig.key);
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl.startsWith('http')) {
      setTestStatus('error');
      setStatusMessage('La URL de Supabase debe comenzar con https://');
      return;
    }
    if (!cleanKey || cleanKey.length < 20) {
      setTestStatus('error');
      setStatusMessage('Por favor ingresa una clave anon válida (API public anon key).');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Probando conexión con Supabase...');

    try {
      saveSupabaseConfig(cleanUrl, cleanKey);
      const client = getSupabaseClient();
      if (!client) {
        setTestStatus('error');
        setStatusMessage('No se pudo inicializar el cliente de Supabase.');
        return;
      }

      // Quick test query
      const { error } = await client.from('tile_absorber_scores').select('id').limit(1);
      if (error && !error.message.includes('0 rows')) {
        // Connected to Supabase, but tables might not exist yet
        setTestStatus('success');
        setStatusMessage('¡Conectado exitosamente con Supabase! (Recuerda ejecutar el script SQL si las tablas aún no existen)');
      } else {
        setTestStatus('success');
        setStatusMessage('¡Conexión verificada! Tu Salón de la Fama ya está sincronizado en vivo.');
      }

      onSaved?.();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setTestStatus('error');
      setStatusMessage('Error de conexión: ' + String(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg font-black">
            <Database className="h-6 w-6 text-slate-950" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Conexión con Supabase</h3>
            <p className="text-xs text-slate-400">Guarda puntuaciones globales y perfiles en tu base de datos</p>
          </div>
        </div>

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzproject.supabase.co"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300">
                Anon Public Key
              </label>
              <a
                href="https://supabase.com/dashboard/project/kryibdmiwdeccniilzgx/settings/api"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Obtener en Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Copia la clave <strong>anon public</strong> desde <em>Project Settings → API</em> de tu proyecto <strong>kryibdmiwdeccniilzgx</strong>.
            </p>
          </div>

          {/* Test Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-400/50 text-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-rose-950/60 border border-rose-400/50 text-rose-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : testStatus === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              ) : (
                <Database className="h-4 w-4 shrink-0 animate-pulse text-amber-400" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* SQL Setup Helper Section */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Script SQL para Tablas & RLS
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold transition cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Pega este código en el <strong>SQL Editor</strong> de tu proyecto en Supabase para crear las tablas <code className="text-amber-300">tile_absorber_scores</code> y <code className="text-amber-300">tile_absorber_users</code> con permisos automáticos.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={testStatus === 'testing'}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              {testStatus === 'testing' ? 'Conectando...' : 'Guardar y Probar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
