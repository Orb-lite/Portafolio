import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export const ALLOWED_ADMIN_EMAIL = 'isaacgestrada94@gmail.com';

// In-memory token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthChange: (user: User | null, isAuthorized: boolean) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const email = user.email?.toLowerCase() || '';
      const isAuthorized = email === ALLOWED_ADMIN_EMAIL.toLowerCase();
      onAuthChange(user, isAuthorized);
    } else {
      cachedAccessToken = null;
      onAuthChange(null, false);
    }
  });
};

export const signInWithGoogle = async (): Promise<{
  user: User;
  isAuthorized: boolean;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;

    const email = result.user.email?.toLowerCase() || '';
    const isAuthorized = email === ALLOWED_ADMIN_EMAIL.toLowerCase();

    return {
      user: result.user,
      isAuthorized,
      accessToken: cachedAccessToken || '',
    };
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logoutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};
