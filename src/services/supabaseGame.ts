import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface HighscoreEntry {
  id?: string;
  gamertag: string;
  score: number;
  wave: number;
  tiles_absorbed: number;
  created_at?: string;
}

export interface UserProfile {
  gamertag: string;
  best_score: number;
  games_played: number;
  total_tiles: number;
  last_played?: string;
}

const LOCAL_STORAGE_KEY_SCORES = 'tile_absorber_local_highscores_v1';
const LOCAL_STORAGE_KEY_USER = 'tile_absorber_active_user_v1';
const LOCAL_STORAGE_KEY_CONFIG = 'tile_absorber_supabase_cfg_v1';

// Default mock initial highscores for vibrant arcade feel
const DEFAULT_INITIAL_SCORES: HighscoreEntry[] = [
  { gamertag: 'ORB_LITE_PRO', score: 18450, wave: 8, tiles_absorbed: 142, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { gamertag: 'CYBER_ISAAC', score: 14200, wave: 6, tiles_absorbed: 110, created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { gamertag: 'NEON_RUNNER', score: 9800, wave: 4, tiles_absorbed: 78, created_at: new Date(Date.now() - 3600000 * 28).toISOString() },
  { gamertag: 'VOID_ABSORBER', score: 7200, wave: 3, tiles_absorbed: 56, created_at: new Date(Date.now() - 3600000 * 48).toISOString() },
  { gamertag: 'ARCADE_PILOT', score: 4500, wave: 2, tiles_absorbed: 35, created_at: new Date(Date.now() - 3600000 * 72).toISOString() },
];

export function getSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, isConfigured: true };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key, isConfigured: true };
      }
    }
  } catch (err) {
    console.warn('Failed to parse Supabase config from localStorage:', err);
  }

  return { url: '', key: '', isConfigured: false };
}

export function saveSupabaseConfig(url: string, key: string): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify({ url: url.trim(), key: key.trim() }));
  } catch (err) {
    console.error('Failed to save Supabase config:', err);
  }
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  const configSignature = `${config.url}::${config.key}`;
  if (cachedClient && cachedConfigKey === configSignature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.key, {
      auth: {
        persistSession: false,
      },
    });
    cachedConfigKey = configSignature;
    return cachedClient;
  } catch (err) {
    console.error('Error creating Supabase client:', err);
    return null;
  }
}

// Local storage highscore manager
export function getLocalHighscores(): HighscoreEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_SCORES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => b.score - a.score);
      }
    }
  } catch (err) {
    console.warn('Failed to read local scores:', err);
  }
  return DEFAULT_INITIAL_SCORES;
}

export function saveLocalScore(entry: HighscoreEntry): HighscoreEntry[] {
  const current = getLocalHighscores();
  const updated = [
    { ...entry, id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, created_at: new Date().toISOString() },
    ...current,
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_SCORES, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save score locally:', err);
  }
  return updated;
}

// User Profile manager
export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to get stored user:', err);
  }

  const defaultUser: UserProfile = {
    gamertag: 'PLAYER_ONE',
    best_score: 0,
    games_played: 0,
    total_tiles: 0,
    last_played: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(defaultUser));
  } catch {
    // noop
  }
  return defaultUser;
}

export function saveStoredUser(profile: UserProfile): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user:', err);
  }
}

// Remote Supabase Queries with graceful fallback
export async function fetchLeaderboard(): Promise<{ scores: HighscoreEntry[]; isOnline: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return { scores: getLocalHighscores(), isOnline: false };
  }

  try {
    const { data, error } = await client
      .from('tile_absorber_scores')
      .select('id, gamertag, score, wave, tiles_absorbed, created_at')
      .order('score', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('Supabase fetchLeaderboard error (falling back to local):', error.message);
      return { scores: getLocalHighscores(), isOnline: false };
    }

    if (data && data.length > 0) {
      return { scores: data as HighscoreEntry[], isOnline: true };
    }

    // If Supabase table is empty, return local scores
    return { scores: getLocalHighscores(), isOnline: true };
  } catch (err) {
    console.error('Error fetching leaderboard from Supabase:', err);
    return { scores: getLocalHighscores(), isOnline: false };
  }
}

export async function submitGameScore(scoreData: {
  gamertag: string;
  score: number;
  wave: number;
  tilesAbsorbed: number;
}): Promise<{ success: boolean; isOnline: boolean }> {
  // Always record locally first
  const newEntry: HighscoreEntry = {
    gamertag: scoreData.gamertag.toUpperCase().trim() || 'ANONYMOUS',
    score: scoreData.score,
    wave: scoreData.wave,
    tiles_absorbed: scoreData.tilesAbsorbed,
    created_at: new Date().toISOString(),
  };
  saveLocalScore(newEntry);

  // Update stored user profile
  const currentUser = getStoredUser();
  const updatedUser: UserProfile = {
    gamertag: newEntry.gamertag,
    best_score: Math.max(currentUser.best_score, scoreData.score),
    games_played: (currentUser.games_played || 0) + 1,
    total_tiles: (currentUser.total_tiles || 0) + scoreData.tilesAbsorbed,
    last_played: new Date().toISOString(),
  };
  saveStoredUser(updatedUser);

  // If Supabase is connected, submit remotely
  const client = getSupabaseClient();
  if (!client) {
    return { success: true, isOnline: false };
  }

  try {
    const { error: scoreErr } = await client.from('tile_absorber_scores').insert([
      {
        gamertag: newEntry.gamertag,
        score: newEntry.score,
        wave: newEntry.wave,
        tiles_absorbed: newEntry.tiles_absorbed,
      },
    ]);

    if (scoreErr) {
      console.warn('Supabase insert score error:', scoreErr.message);
      return { success: true, isOnline: false };
    }

    // Try upserting user profile in tile_absorber_users
    try {
      await client.from('tile_absorber_users').upsert(
        {
          gamertag: updatedUser.gamertag,
          best_score: updatedUser.best_score,
          games_played: updatedUser.games_played,
          total_tiles: updatedUser.total_tiles,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'gamertag' }
      );
    } catch {
      // noop if table not yet created
    }

    return { success: true, isOnline: true };
  } catch (err) {
    console.error('Error submitting score to Supabase:', err);
    return { success: true, isOnline: false };
  }
}

export const SUPABASE_SETUP_SQL = `-- 🎮 TILE ABSORBER - Script SQL para Configuración en Supabase
-- Pega este código en el SQL Editor de tu Dashboard de Supabase (https://app.supabase.com)

-- 1. Tabla de puntuaciones altas (Leaderboard)
create table if not exists public.tile_absorber_scores (
  id uuid default gen_random_uuid() primary key,
  gamertag text not null,
  score integer not null,
  wave integer not null default 1,
  tiles_absorbed integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de perfiles y usuarios de jugadores
create table if not exists public.tile_absorber_users (
  id uuid default gen_random_uuid() primary key,
  gamertag text unique not null,
  best_score integer default 0,
  games_played integer default 0,
  total_tiles integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habilitar Row Level Security (RLS) y permitir lectura y registro público
alter table public.tile_absorber_scores enable row level security;
alter table public.tile_absorber_users enable row level security;

-- Políticas de seguridad para tile_absorber_scores
drop policy if exists "Permitir lectura de puntuaciones a todos" on public.tile_absorber_scores;
create policy "Permitir lectura de puntuaciones a todos"
  on public.tile_absorber_scores for select
  using (true);

drop policy if exists "Permitir guardar puntuaciones" on public.tile_absorber_scores;
create policy "Permitir guardar puntuaciones"
  on public.tile_absorber_scores for insert
  with check (true);

-- Políticas de seguridad para tile_absorber_users
drop policy if exists "Permitir lectura de jugadores a todos" on public.tile_absorber_users;
create policy "Permitir lectura de jugadores a todos"
  on public.tile_absorber_users for select
  using (true);

drop policy if exists "Permitir crear y actualizar perfiles de jugadores" on public.tile_absorber_users;
create policy "Permitir crear y actualizar perfiles de jugadores"
  on public.tile_absorber_users for all
  using (true);
`;
