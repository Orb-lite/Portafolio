import React, { useState, useEffect } from 'react';
import {
  AdminUser,
  ALLOWED_ADMIN_EMAIL,
  getStoredSession,
  signInWithGoogleUnified,
  signInWithAdminPasscode,
  logoutAdmin,
} from '../../services/authService';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Loader2,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EditorAuthGateProps {
  onClose: () => void;
  language?: 'es' | 'en';
  onSessionChange?: (user: AdminUser | null) => void;
  children: (props: { user: AdminUser; onLogout: () => void }) => React.ReactNode;
}

export const EditorAuthGate: React.FC<EditorAuthGateProps> = ({
  onClose,
  language = 'es',
  onSessionChange,
  children,
}) => {
  const isEn = language === 'en';
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPasscodeOption, setShowPasscodeOption] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Check stored session on mount
  useEffect(() => {
    const existing = getStoredSession();
    if (existing) {
      setCurrentUser(existing);
      setIsAuthorized(true);
      onSessionChange?.(existing);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    setPasscodeError(null);
    try {
      const { user, isAuthorized: authorized } = await signInWithGoogleUnified();
      setCurrentUser(user);
      setIsAuthorized(authorized);
      if (authorized) {
        onSessionChange?.(user);
      } else {
        setAuthError(
          isEn
            ? `Access Denied: The account ${user.email} is not authorized. Access is restricted exclusively to ${ALLOWED_ADMIN_EMAIL}.`
            : `Acceso Denegado: La cuenta ${user.email} no está autorizada. El acceso está restringido exclusivamente a ${ALLOWED_ADMIN_EMAIL}.`
        );
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      const code = err.code || '';
      let msg = isEn
        ? 'Could not connect with Google. Your browser or preview iframe might be blocking popups.'
        : 'No se pudo conectar con Google. Es posible que el navegador o el iframe del preview esté bloqueando las ventanas emergentes.';

      if (code === 'auth/popup-blocked') {
        msg = isEn
          ? 'Popup was blocked by your browser. Please allow popups or use the master admin key below.'
          : 'La ventana emergente fue bloqueada por tu navegador. Por favor habilita los popups o usa la clave maestra de administrador abajo.';
      } else if (code === 'auth/unauthorized-domain') {
        msg = isEn
          ? 'Preview domain is pending OAuth authorization in Firebase console. You can use the master admin key below.'
          : 'El dominio temporal del preview requiere autorización en la consola de Firebase. Puedes usar la clave maestra de administrador abajo.';
      }

      setAuthError(msg);
      setShowPasscodeOption(true); // Automatically offer the direct passcode fallback so Isaac is never stuck
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    try {
      const { user, isAuthorized: authorized } = signInWithAdminPasscode(passcodeInput);
      setCurrentUser(user);
      setIsAuthorized(authorized);
      if (authorized) {
        onSessionChange?.(user);
      }
    } catch (err: any) {
      setPasscodeError(err.message || 'Clave incorrecta.');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentUser(null);
    setIsAuthorized(false);
    setAuthError(null);
    setPasscodeInput('');
    onSessionChange?.(null);
  };

  // 1. Initial Session Verification
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3 border border-slate-200">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-700">
            {isEn ? 'Verifying admin authorization...' : 'Verificando autorización de administrador...'}
          </p>
        </div>
      </div>
    );
  }

  // 2. User is NOT logged in yet
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-5 my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase border border-amber-300">
              {isEn ? 'Restricted Access' : 'Acceso Restringido'}
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEn ? 'Portfolio & Resume Editor' : 'Editor de Portafolio & CV'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isEn
                ? 'This administration panel is restricted exclusively to Isaac Gómez Estrada. Sign in with your authorized Google account to continue.'
                : 'Este panel de edición y personalización de CV está restringido exclusivamente a Isaac Gómez Estrada. Inicia sesión con tu cuenta de Google autorizada.'}
            </p>
            <div className="pt-1">
              <span className="inline-block text-[11px] font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 font-semibold">
                {ALLOWED_ADMIN_EMAIL}
              </span>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 text-left">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{authError}</p>
              </div>
            </div>
          )}

          {/* Primary Action: Official Google Sign-In Button */}
          <div className="pt-1 flex flex-col items-center gap-3">
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  <span>{isEn ? 'Connecting with Google...' : 'Conectando con Google...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isEn ? 'Sign in with Google' : 'Iniciar sesión con Google'}</span>
                </>
              )}
            </button>

            {/* Direct Admin Passcode Option (Ensures Isaac is never locked out by browser iframe popup blockers) */}
            <div className="w-full pt-2">
              <button
                type="button"
                onClick={() => setShowPasscodeOption(!showPasscodeOption)}
                className="w-full text-[11px] text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 py-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {isEn
                    ? 'Browser blocking popups? Enter with admin key'
                    : '¿El navegador bloquea popups? Acceder con clave'}
                </span>
                {showPasscodeOption ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showPasscodeOption && (
                <form
                  onSubmit={handlePasscodeLogin}
                  className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 animate-fade-in"
                >
                  <label className="block text-[11px] font-semibold text-slate-700">
                    {isEn ? 'Admin Passcode or Phone Number:' : 'Clave de Administrador o Teléfono:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      placeholder="isaac2026 / teléfono"
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      {isEn ? 'Unlock' : 'Entrar'}
                    </button>
                  </div>
                  {passcodeError && (
                    <p className="text-[11px] text-rose-600 font-medium">{passcodeError}</p>
                  )}
                </form>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to public portfolio' : 'Volver al portafolio público'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. User logged in with an UNAUTHORIZED email
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-rose-200 overflow-hidden text-center p-7 sm:p-8 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full uppercase border border-rose-300">
              {isEn ? 'Access Denied' : 'Acceso No Autorizado'}
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEn ? 'Unauthorized Account' : 'Cuenta No Autorizada'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isEn ? (
                <>
                  You signed in as <strong>{currentUser.email}</strong>, but this editor is strictly reserved for{' '}
                  <span className="font-mono text-rose-700 font-bold">{ALLOWED_ADMIN_EMAIL}</span>.
                </>
              ) : (
                <>
                  Has iniciado sesión como <strong>{currentUser.email}</strong>, pero este editor está reservado
                  exclusivamente para{' '}
                  <span className="font-mono text-rose-700 font-bold">{ALLOWED_ADMIN_EMAIL}</span>.
                </>
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
            >
              <LogOut className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Sign out & switch account' : 'Cerrar sesión e intentar con otra cuenta'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to public portfolio' : 'Volver al portafolio público'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. User is AUTHORIZED as isaacgestrada94@gmail.com
  return (
    <>
      {/* Authorized Admin Top Header Notification Bar */}
      <div className="no-print bg-emerald-950 text-white border-b border-emerald-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50 relative shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
            ✓
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-emerald-300">
              {isEn ? 'Admin Session Active:' : 'Sesión de Administrador Activa:'}
            </span>
            <span className="font-mono text-[11px] bg-emerald-900/80 text-emerald-100 px-2 py-0.5 rounded border border-emerald-700">
              {currentUser.email}
            </span>
            {currentUser.authMethod === 'admin_passcode' && (
              <span className="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-700/60 px-1.5 py-0.5 rounded">
                Master Key
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-700/60 transition-colors text-[11px] font-semibold"
            title={isEn ? 'Sign out of admin session' : 'Cerrar sesión de administrador'}
          >
            <LogOut className="w-3 h-3 text-emerald-400" />
            <span>{isEn ? 'Sign Out' : 'Cerrar Sesión'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 transition-colors text-[11px] font-semibold"
            title={isEn ? 'Exit editor and return to public view' : 'Salir del editor y volver a la vista pública'}
          >
            <ArrowLeft className="w-3 h-3 text-slate-400" />
            <span>{isEn ? 'Exit Editor' : 'Salir del Editor'}</span>
          </button>
        </div>
      </div>

      {children({ user: currentUser, onLogout: handleLogout })}
    </>
  );
};
