import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeId = 'y2k-retro' | 'cartoon-rpg' | 'neo-brutalist';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  shortName: string;
  tagline: string;
  swatches: [string, string, string];
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'y2k-retro',
    name: 'Y2K Cypher',
    shortName: 'Y2K Cypher',
    tagline: 'Metallic chrome, electric blue, holographic gloss',
    swatches: ['#1E6BFF', '#00E5FF', '#E4ECF7'],
  },
  {
    id: 'cartoon-rpg',
    name: 'Cartoon Fantasy RPG',
    shortName: 'Cartoon RPG',
    tagline: 'Warm wood, thick brown ink, rarity badges',
    swatches: ['#7C4A22', '#FFC82C', '#57B836'],
  },
  {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist Arcade',
    shortName: 'Brutalist',
    tagline: 'Neon yellow, hot pink, hard black outlines',
    swatches: ['#FFE800', '#FF1F8F', '#000000'],
  },
];

export const DEFAULT_THEME: ThemeId = 'y2k-retro';
export const THEME_TTL_MS = 60 * 60 * 1000;

const DB_NAME = 'game_hub_theme_v1';
const STORE_NAME = 'theme';
const THEME_KEY = 'theme_id';

interface ThemeCacheRecord {
  theme_id: ThemeId;
  savedAt: number;
}

export function isValidTheme(val: unknown): val is ThemeId {
  return typeof val === 'string' && THEMES.some((t) => t.id === val);
}

export function pickRandomTheme(randomFn: () => number = Math.random): ThemeId {
  try {
    const r = randomFn();
    if (!Number.isFinite(r) || r < 0 || r >= 1) {
      return DEFAULT_THEME;
    }
    const idx = Math.floor(r * THEMES.length);
    return THEMES[idx]?.id ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function openThemeDb(dbFactory?: IDBFactory, dbName = DB_NAME): Promise<IDBDatabase | null> {
  const factory = dbFactory ?? (typeof indexedDB !== 'undefined' ? indexedDB : undefined);
  if (!factory) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = factory.open(dbName, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function readThemeRecord(
  dbFactory?: IDBFactory,
  dbName = DB_NAME
): Promise<{ ok: boolean; record: ThemeCacheRecord | null }> {
  const db = await openThemeDb(dbFactory, dbName);
  if (!db) return { ok: false, record: null };
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(THEME_KEY);
      req.onsuccess = () => {
        const val = req.result as ThemeCacheRecord | undefined;
        resolve({ ok: true, record: val ?? null });
      };
      req.onerror = () => resolve({ ok: false, record: null });
      tx.onabort = () => resolve({ ok: false, record: null });
    } catch {
      resolve({ ok: false, record: null });
    }
  });
}

async function writeThemeRecord(
  record: ThemeCacheRecord,
  dbFactory?: IDBFactory,
  dbName = DB_NAME
): Promise<boolean> {
  const db = await openThemeDb(dbFactory, dbName);
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record, THEME_KEY);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Resolves the active theme from IndexedDB with a 1-hour TTL.
 * Picks a random theme from THEMES on miss/expiry and falls back to DEFAULT_THEME
 * (Y2K Cypher) if randomization or IndexedDB read/write fails.
 */
export async function resolveOrCreateThemeInIndexedDB(options?: {
  nowFn?: () => number;
  randomFn?: () => number;
  ttlMs?: number;
  idb?: IDBFactory;
  dbName?: string;
}): Promise<ThemeId> {
  const now = (options?.nowFn ?? Date.now)();
  const ttlMs = options?.ttlMs ?? THEME_TTL_MS;
  const dbName = options?.dbName ?? DB_NAME;

  const { ok, record } = await readThemeRecord(options?.idb, dbName);
  if (!ok) {
    return DEFAULT_THEME;
  }

  if (
    record &&
    isValidTheme(record.theme_id) &&
    typeof record.savedAt === 'number' &&
    now - record.savedAt < ttlMs &&
    record.savedAt <= now + ttlMs
  ) {
    return record.theme_id;
  }

  const picked = pickRandomTheme(options?.randomFn);
  const saved = await writeThemeRecord({ theme_id: picked, savedAt: now }, options?.idb, dbName);
  return saved ? picked : DEFAULT_THEME;
}

let inFlightThemeResolution: Promise<ThemeId> | null = null;

function resolveThemeOnce(): Promise<ThemeId> {
  if (!inFlightThemeResolution) {
    inFlightThemeResolution = resolveOrCreateThemeInIndexedDB().finally(() => {
      inFlightThemeResolution = null;
    });
  }
  return inFlightThemeResolution;
}

interface ThemeContextValue {
  theme: ThemeId;
  themeMeta: ThemeMeta;
  setTheme: (next: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    let active = true;
    void resolveThemeOnce().then((resolved) => {
      if (active) {
        setThemeState(resolved);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeMeta: THEMES.find((t) => t.id === theme) ?? THEMES[0]!,
      setTheme: (next) => {
        const safeNext = isValidTheme(next) ? next : DEFAULT_THEME;
        setThemeState(safeNext);
        void writeThemeRecord({ theme_id: safeNext, savedAt: Date.now() });
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: DEFAULT_THEME,
      themeMeta: THEMES[0]!,
      setTheme: () => {},
    };
  }
  return ctx;
}
