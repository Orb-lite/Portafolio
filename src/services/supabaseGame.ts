import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface HighscoreEntry {
  id?: string;
  gamertag: string;
  score: number;
  wave: number; // Represents the Level achieved
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

export interface SupabaseConfig {
  url: string;
  key: string;
  isConfigured: boolean;
}

const LOCAL_STORAGE_KEY_CONFIG = 'conveyor_realms_supabase_config_v1';
const LOCAL_STORAGE_KEY_SCORES = 'conveyor_realms_highscores_v2_real';
const LOCAL_STORAGE_KEY_USER = 'conveyor_realms_user_profile_v1';

// Hard reset: No mock scores. Only real players who actually play will appear.
const DEFAULT_INITIAL_SCORES: HighscoreEntry[] = [];

export const DEFAULT_SUPABASE_URL = 'https://kryibdmiwdeccniilzgx.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWliZG1pd2RlY2NuaWlsemd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxOTkzMzUsImV4cCI6MjEwOTc3NTMzNX0.KpMDyZkb0zCDI1rBKhBp4oFR1R-x39aevmnmu1gYMg0';

export function getSupabaseConfig(): SupabaseConfig {
  // 1. Check environment variables
  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && envUrl.startsWith('http')) {
    return { url: envUrl, key: envKey, isConfigured: true };
  }

  // 2. Check localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.url && parsed.key && typeof parsed.url === 'string' && parsed.url.startsWith('http')) {
          return { url: parsed.url, key: parsed.key, isConfigured: true };
        }
      }
    } catch (err) {
      console.warn('Failed to parse Supabase config from localStorage:', err);
    }
  }

  // 3. Fallback to preconfigured project credentials
  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
    return {
      url: DEFAULT_SUPABASE_URL,
      key: DEFAULT_SUPABASE_ANON_KEY,
      isConfigured: true,
    };
  }

  return { url: '', key: '', isConfigured: false };
}

export function saveSupabaseConfig(url: string, key: string): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify({ url: url.trim(), key: key.trim() }));
    cachedClient = null;
    cachedConfigKey = '';
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

export function getLocalHighscores(): HighscoreEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    // Purge old mock data from previous version
    localStorage.removeItem('conveyor_realms_highscores_v1');
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
  return [];
}

export function saveLocalScore(entry: HighscoreEntry): HighscoreEntry[] {
  const current = getLocalHighscores();
  const updated = [
    {
      ...entry,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    },
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

export function getStoredUser(): UserProfile {
  if (typeof localStorage === 'undefined') {
    return {
      gamertag: 'PLAYER_ONE',
      best_score: 0,
      games_played: 0,
      total_tiles: 0,
      last_played: new Date().toISOString(),
    };
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to get stored user:', err);
  }

  const defaultUser: UserProfile = {
    gamertag: 'PLAYER_' + Math.floor(100 + Math.random() * 900),
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

export async function fetchLeaderboard(): Promise<{ scores: HighscoreEntry[]; isOnline: boolean; error?: string }> {
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
      return { scores: getLocalHighscores(), isOnline: false, error: error.message };
    }

    if (data && data.length > 0) {
      return { scores: data as HighscoreEntry[], isOnline: true };
    }

    return { scores: getLocalHighscores(), isOnline: true };
  } catch (err) {
    console.error('Error fetching leaderboard from Supabase:', err);
    return { scores: getLocalHighscores(), isOnline: false, error: String(err) };
  }
}

export async function submitGameScore(scoreData: {
  gamertag: string;
  score: number;
  wave: number;
  tilesAbsorbed: number;
}): Promise<{ success: boolean; isOnline: boolean }> {
  const cleanTag = scoreData.gamertag.toUpperCase().trim() || 'ANONYMOUS';
  const newEntry: HighscoreEntry = {
    gamertag: cleanTag,
    score: scoreData.score,
    wave: scoreData.wave,
    tiles_absorbed: scoreData.tilesAbsorbed,
    created_at: new Date().toISOString(),
  };

  // Always save locally first
  saveLocalScore(newEntry);

  const currentUser = getStoredUser();
  const updatedUser: UserProfile = {
    gamertag: cleanTag,
    best_score: Math.max(currentUser.best_score || 0, scoreData.score),
    games_played: (currentUser.games_played || 0) + 1,
    total_tiles: (currentUser.total_tiles || 0) + scoreData.tilesAbsorbed,
    last_played: new Date().toISOString(),
  };
  saveStoredUser(updatedUser);

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
      console.warn('Supabase insert score warning:', scoreErr.message);
      return { success: true, isOnline: false };
    }

    // Try upserting user profile
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
      // Table might not exist yet, still consider score submission success
    }

    return { success: true, isOnline: true };
  } catch (err) {
    console.error('Error submitting score to Supabase:', err);
    return { success: true, isOnline: false };
  }
}

export const SUPABASE_SETUP_SQL = `-- 🎮 CONVEYOR REALMS / TILE ABSORBER - Script SQL para Supabase
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

-- 2. Tabla de perfiles de jugadores
create table if not exists public.tile_absorber_users (
  id uuid default gen_random_uuid() primary key,
  gamertag text unique not null,
  best_score integer default 0,
  games_played integer default 0,
  total_tiles integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habilitar Row Level Security (RLS)
alter table public.tile_absorber_scores enable row level security;
alter table public.tile_absorber_users enable row level security;

-- 4. Políticas de acceso público
drop policy if exists "Permitir lectura de puntuaciones a todos" on public.tile_absorber_scores;
create policy "Permitir lectura de puntuaciones a todos"
  on public.tile_absorber_scores for select
  using (true);

drop policy if exists "Permitir guardar puntuaciones" on public.tile_absorber_scores;
create policy "Permitir guardar puntuaciones"
  on public.tile_absorber_scores for insert
  with check (true);

drop policy if exists "Permitir lectura de jugadores a todos" on public.tile_absorber_users;
create policy "Permitir lectura de jugadores a todos"
  on public.tile_absorber_users for select
  using (true);

drop policy if exists "Permitir crear y actualizar perfiles de jugadores" on public.tile_absorber_users;
create policy "Permitir crear y actualizar perfiles de jugadores"
  on public.tile_absorber_users for all
  using (true);
`;
