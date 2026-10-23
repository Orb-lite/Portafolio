import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.setCustomParameters({
  prompt: 'select_account',
});

export const ALLOWED_ADMIN_EMAIL = 'isaacgestrada94@gmail.com';
export const MASTER_ADMIN_PASSCODES = ['isaac2026', 'orblite2026', '3318359421', 'Isaac2026!'];

export interface AdminUser {
  email: string;
  displayName?: string;
  photoURL?: string;
  authMethod: 'google_oauth' | 'firebase_auth' | 'admin_passcode';
}

const SESSION_STORAGE_KEY = 'ig_admin_session_auth';

// Helper to get stored session
export const getStoredSession = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return parsed;
    }
  } catch (e) {
    /* ignore */
  }
  return null;
};

// Helper to save session
export const saveSession = (user: AdminUser) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    /* ignore */
  }
};

// Helper to clear session
export const clearSession = () => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    /* ignore */
  }
};

// Google Identity Services (GIS) Token Request
export const signInWithGoogleIdentityServices = (): Promise<{
  user: AdminUser;
  isAuthorized: boolean;
}> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window is not defined'));
    }

    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      return reject(new Error('Google Identity Services SDK not loaded'));
    }

    const clientId =
      firebaseConfig.oAuthClientId ||
      '834646135304-0c71savofie7k9r7uu03uclartlj1mnf.apps.googleusercontent.com';

    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        prompt: 'select_account',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            return reject(new Error(`Google OAuth error: ${tokenResponse.error}`));
          }
          if (!tokenResponse.access_token) {
            return reject(new Error('No access token returned from Google'));
          }

          try {
            // Fetch verified user profile directly from Google API
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!res.ok) {
              throw new Error('Failed to fetch user profile from Google');
            }

            const profile = await res.json();
            const email = (profile.email || '').toLowerCase();
            const isAuthorized = email === ALLOWED_ADMIN_EMAIL.toLowerCase();

            const adminUser: AdminUser = {
              email: profile.email || '',
              displayName: profile.name || 'Isaac Gómez Estrada',
              photoURL: profile.picture || '',
              authMethod: 'google_oauth',
            };

            if (isAuthorized) {
              saveSession(adminUser);
            }

            resolve({ user: adminUser, isAuthorized });
          } catch (fetchErr) {
            reject(fetchErr);
          }
        },
      });

      tokenClient.requestAccessToken();
    } catch (initErr) {
      reject(initErr);
    }
  });
};

// Firebase Auth fallback
export const signInWithFirebaseAuth = async (): Promise<{
  user: AdminUser;
  isAuthorized: boolean;
}> => {
  const result = await signInWithPopup(auth, provider);
  const email = (result.user.email || '').toLowerCase();
  const isAuthorized = email === ALLOWED_ADMIN_EMAIL.toLowerCase();

  const adminUser: AdminUser = {
    email: result.user.email || '',
    displayName: result.user.displayName || 'Isaac Gómez Estrada',
    photoURL: result.user.photoURL || '',
    authMethod: 'firebase_auth',
  };

  if (isAuthorized) {
    saveSession(adminUser);
  }

  return { user: adminUser, isAuthorized };
};

// Smart Dual-Engine Google Sign-in: Tries GIS first, then Firebase Auth
export const signInWithGoogleUnified = async (): Promise<{
  user: AdminUser;
  isAuthorized: boolean;
}> => {
  // Try Google Identity Services first if available
  const google = typeof window !== 'undefined' ? (window as any).google : null;
  if (google?.accounts?.oauth2) {
    try {
      return await signInWithGoogleIdentityServices();
    } catch (gisErr: any) {
      console.warn('GIS failed, falling back to Firebase Auth:', gisErr);
    }
  }

  // Fallback to Firebase Auth
  try {
    return await signInWithFirebaseAuth();
  } catch (fbErr: any) {
    console.error('Firebase Auth error:', fbErr);
    throw fbErr;
  }
};

// Emergency Admin Passcode (allows Isaac to unlock if browser blocks popups in iframe)
export const signInWithAdminPasscode = (passcode: string): {
  user: AdminUser;
  isAuthorized: boolean;
} => {
  const clean = passcode.trim();
  const isValid = MASTER_ADMIN_PASSCODES.includes(clean);

  if (isValid) {
    const adminUser: AdminUser = {
      email: ALLOWED_ADMIN_EMAIL,
      displayName: 'Isaac Gómez Estrada (Master Key)',
      authMethod: 'admin_passcode',
    };
    saveSession(adminUser);
    return { user: adminUser, isAuthorized: true };
  }

  throw new Error('Clave de administrador incorrecta.');
};

// Sign out
export const logoutAdmin = async (): Promise<void> => {
  clearSession();
  try {
    await signOut(auth);
  } catch {
    /* ignore */
  }
};
