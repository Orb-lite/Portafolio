export const MAX_LIVES = 3;
export const LIFE_REGEN_MS = 24 * 60 * 60 * 1000;
export const LIFE_STORAGE_KEY = 'conveyor-realms-lives-v1';
export const PROGRESS_STORAGE_KEY = 'conveyor-realms-progress-v1';

export interface LifeState {
  lives: number;
  nextLifeAt: number | null;
  adProgress: number;
}

export interface SavedProgress {
  level: number;
  experience: number;
}

export function getInitialLifeState(): LifeState {
  if (typeof localStorage === 'undefined') return { lives: MAX_LIVES, nextLifeAt: null, adProgress: 0 };
  try {
    const raw = localStorage.getItem(LIFE_STORAGE_KEY);
    if (!raw) return { lives: MAX_LIVES, nextLifeAt: null, adProgress: 0 };
    const parsed = JSON.parse(raw) as Partial<LifeState>;
    const safe: LifeState = {
      lives: Math.max(0, Math.min(MAX_LIVES, Math.floor(parsed.lives ?? MAX_LIVES))),
      nextLifeAt: typeof parsed.nextLifeAt === 'number' ? parsed.nextLifeAt : null,
      adProgress: Math.max(0, Math.floor(parsed.adProgress ?? 0)),
    };
    return reconcileLifeState(safe, Date.now());
  } catch {
    return { lives: MAX_LIVES, nextLifeAt: null, adProgress: 0 };
  }
}

export function reconcileLifeState(state: LifeState, now: number): LifeState {
  let lives = Math.max(0, Math.min(MAX_LIVES, Math.floor(state.lives)));
  let nextLifeAt = state.nextLifeAt;
  let adProgress = Math.max(0, Math.floor(state.adProgress));

  while (lives < MAX_LIVES && nextLifeAt !== null && now >= nextLifeAt) {
    lives += 1;
    nextLifeAt = lives < MAX_LIVES ? nextLifeAt + LIFE_REGEN_MS : null;
  }
  if (lives === MAX_LIVES) {
    nextLifeAt = null;
    adProgress = 0;
  }
  return { lives, nextLifeAt, adProgress };
}

export function loseLife(state: LifeState, now: number): LifeState {
  const current = reconcileLifeState(state, now);
  if (current.lives <= 0) return current;
  const lives = current.lives - 1;
  return {
    lives,
    nextLifeAt: lives === MAX_LIVES ? null : current.nextLifeAt ?? now + LIFE_REGEN_MS,
    adProgress: current.adProgress,
  };
}

export function grantAdLife(state: LifeState, now: number, adsPerLife: number): { state: LifeState; lifeGranted: boolean } {
  const current = reconcileLifeState(state, now);
  if (current.lives >= MAX_LIVES) return { state: current, lifeGranted: false };
  const adProgress = current.adProgress + 1;
  if (adProgress < adsPerLife) return { state: { ...current, adProgress }, lifeGranted: false };
  const lives = Math.min(MAX_LIVES, current.lives + 1);
  return {
    state: {
      lives,
      nextLifeAt: lives >= MAX_LIVES ? null : current.nextLifeAt ?? now + LIFE_REGEN_MS,
      adProgress: 0,
    },
    lifeGranted: true,
  };
}

export function getSavedProgress(): SavedProgress {
  if (typeof localStorage === 'undefined') return { level: 1, experience: 0 };
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '{}') as Partial<SavedProgress>;
    return {
      level: Math.max(1, Math.floor(parsed.level ?? 1)),
      experience: Math.max(0, Math.floor(parsed.experience ?? 0)),
    };
  } catch {
    return { level: 1, experience: 0 };
  }
}

export function formatLifeCountdown(nextLifeAt: number | null, now: number): string {
  if (nextLifeAt === null) return '—';
  const remaining = Math.max(0, nextLifeAt - now);
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
