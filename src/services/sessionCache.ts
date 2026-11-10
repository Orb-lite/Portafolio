/**
 * Session Cache Manager for Conveyor Realms & Portfolio
 * Handles high-reliability client-side caching across:
 * 1. Admin & Editor Authentication Sessions (Persistent TTL + Cross-tab sync)
 * 2. Resume Editor Customizations & Tailored CVs (Auto-save & restore)
 * 3. Game Run & Comodines State (Progress, level, lives, highscores)
 */

import { ResumeData, StyleConfig } from '../types/resume';
import { ResumeProfileType } from '../data/defaultResume';

// LocalStorage Keys
const KEYS = {
  ADMIN_SESSION: 'ig_admin_session_auth_v2',
  RESUME_CACHE_PREFIX: 'ig_cached_resume_',
  STYLE_CACHE: 'ig_cached_style_config_v1',
  GAME_COMODIN_SESSION: 'conveyor_realms_active_comodin_v1',
  GAME_PROGRESS: 'conveyor_realms_progress_v2',
};

// ==========================================
// 1. ADMIN AUTHENTICATION SESSION CACHE
// ==========================================

export interface CachedAuthSession {
  user: {
    email: string;
    displayName?: string;
    photoURL?: string;
    authMethod: 'google_oauth' | 'firebase_auth' | 'admin_passcode';
  };
  cachedAt: number;
  expiresAt: number; // 30 days default
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const saveAuthSessionToCache = (user: CachedAuthSession['user'], ttlMs = THIRTY_DAYS_MS): void => {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedAuthSession = {
      user,
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttlMs,
    };
    const serialized = JSON.stringify(payload);
    localStorage.setItem(KEYS.ADMIN_SESSION, serialized);
    sessionStorage.setItem(KEYS.ADMIN_SESSION, serialized);
  } catch (err) {
    console.warn('[SessionCache] Failed to save auth session:', err);
  }
};

export const getAuthSessionFromCache = (): CachedAuthSession['user'] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.ADMIN_SESSION) || sessionStorage.getItem(KEYS.ADMIN_SESSION);
    if (!raw) return null;

    const parsed: CachedAuthSession = JSON.parse(raw);
    if (!parsed || !parsed.user || !parsed.user.email) return null;

    // Check expiration
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      clearAuthSessionCache();
      return null;
    }

    return parsed.user;
  } catch (err) {
    console.warn('[SessionCache] Failed to read auth session:', err);
    return null;
  }
};

export const clearAuthSessionCache = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
    sessionStorage.removeItem(KEYS.ADMIN_SESSION);
  } catch {
    /* ignore */
  }
};

// ==========================================
// 2. RESUME EDITOR PERSISTENCE CACHE
// ==========================================

export interface CachedResumeData {
  profile: ResumeProfileType;
  language: 'es' | 'en';
  data: ResumeData;
  styleConfig?: StyleConfig;
  savedAt: number;
}

export const saveResumeToCache = (
  profile: ResumeProfileType,
  language: 'es' | 'en',
  data: ResumeData,
  styleConfig?: StyleConfig
): void => {
  if (typeof window === 'undefined') return;
  try {
    const key = `${KEYS.RESUME_CACHE_PREFIX}${profile}_${language}`;
    const payload: CachedResumeData = {
      profile,
      language,
      data,
      styleConfig,
      savedAt: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn('[SessionCache] Failed to cache resume edits:', err);
  }
};

export const getResumeFromCache = (
  profile: ResumeProfileType,
  language: 'es' | 'en'
): CachedResumeData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const key = `${KEYS.RESUME_CACHE_PREFIX}${profile}_${language}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearResumeCache = (profile?: ResumeProfileType, language?: 'es' | 'en'): void => {
  if (typeof window === 'undefined') return;
  try {
    if (profile && language) {
      localStorage.removeItem(`${KEYS.RESUME_CACHE_PREFIX}${profile}_${language}`);
    } else {
      // Clear all cached resumes
      Object.keys(localStorage)
        .filter((k) => k.startsWith(KEYS.RESUME_CACHE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    /* ignore */
  }
};

// ==========================================
// 3. GAME RUN & COMODINES SESSION CACHE
// ==========================================

export interface CachedComodinSession {
  level: number;
  selectedComodinId: string | null;
  hasUsedComodin: boolean;
  savedAt: number;
}

export const saveComodinSessionToCache = (
  level: number,
  selectedComodinId: string | null,
  hasUsedComodin: boolean
): void => {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedComodinSession = {
      level,
      selectedComodinId,
      hasUsedComodin,
      savedAt: Date.now(),
    };
    localStorage.setItem(KEYS.GAME_COMODIN_SESSION, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
};

export const getComodinSessionFromCache = (currentLevel: number): CachedComodinSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.GAME_COMODIN_SESSION);
    if (!raw) return null;
    const parsed: CachedComodinSession = JSON.parse(raw);
    // Only return if it matches the active playing level
    if (parsed.level === currentLevel) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
};
