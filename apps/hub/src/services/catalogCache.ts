import type { GameRecord, PublicCatalogDocument } from '@game-hub/contract';

interface CacheEnvelope<T> {
  value: T;
  fetchedAt: number;
}

const DB_NAME = 'game_hub_cache_v1';
const STORE_NAME = 'kv';
const CATALOG_KEY = 'public_catalog_current';
const GAME_DETAIL_PREFIX = 'public_game_detail:';
const MAX_DETAIL_ENTRIES = 50;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet<T>(key: string): Promise<CacheEnvelope<T> | null> {
  const db = await openDb();
  if (!db) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as CacheEnvelope<T>) : null;
    } catch {
      return null;
    }
  }
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve((req.result as CacheEnvelope<T>) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet<T>(key: string, envelope: CacheEnvelope<T>): Promise<void> {
  const db = await openDb();
  if (!db) {
    try {
      localStorage.setItem(key, JSON.stringify(envelope));
    } catch {
      // ignore quota errors
    }
    return;
  }
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(envelope, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export class CatalogCacheService {
  private readonly ttlMs: number;
  private inFlightCatalog: Promise<PublicCatalogDocument> | null = null;
  private detailMemory = new Map<string, GameRecord>();

  constructor(ttlMinutes = 60) {
    this.ttlMs = ttlMinutes * 60 * 1000;
  }

  async getCatalog(
    fetcher: () => Promise<PublicCatalogDocument>,
    options?: { forceRefresh?: boolean }
  ): Promise<{ catalog: PublicCatalogDocument; fromCache: boolean; stale: boolean }> {
    const cached = await idbGet<PublicCatalogDocument>(CATALOG_KEY);
    const now = Date.now();
    const isFresh = cached !== null && now - cached.fetchedAt < this.ttlMs;

    if (cached && isFresh && !options?.forceRefresh) {
      return { catalog: cached.value, fromCache: true, stale: false };
    }

    const fetchFresh = async () => {
      if (!this.inFlightCatalog) {
        this.inFlightCatalog = fetcher()
          .then(async (fresh) => {
            await idbSet(CATALOG_KEY, { value: fresh, fetchedAt: Date.now() });
            return fresh;
          })
          .finally(() => {
            this.inFlightCatalog = null;
          });
      }
      return this.inFlightCatalog;
    };

    // Stale-while-revalidate when cached data exists and not forcing refresh
    if (cached && !options?.forceRefresh) {
      void fetchFresh().catch(() => {
        // Keep last known valid catalog on quota exhaustion or network error
      });
      return { catalog: cached.value, fromCache: true, stale: true };
    }

    try {
      const fresh = await fetchFresh();
      return { catalog: fresh, fromCache: false, stale: false };
    } catch (err) {
      if (cached) {
        return { catalog: cached.value, fromCache: true, stale: true };
      }
      throw err;
    }
  }

  async getGameDetail(
    slug: string,
    expectedRevision: number | undefined,
    fetcher: () => Promise<GameRecord | null>
  ): Promise<GameRecord | null> {
    const mem = this.detailMemory.get(slug);
    if (mem && (expectedRevision === undefined || mem.revision === expectedRevision)) {
      return mem;
    }

    const cached = await idbGet<GameRecord>(`${GAME_DETAIL_PREFIX}${slug}`);
    if (
      cached &&
      (expectedRevision === undefined || cached.value.revision === expectedRevision) &&
      Date.now() - cached.fetchedAt < this.ttlMs
    ) {
      this.rememberDetail(slug, cached.value);
      return cached.value;
    }

    try {
      const fresh = await fetcher();
      if (fresh) {
        this.rememberDetail(slug, fresh);
        await idbSet(`${GAME_DETAIL_PREFIX}${slug}`, { value: fresh, fetchedAt: Date.now() });
      }
      return fresh;
    } catch (err) {
      if (cached) return cached.value;
      throw err;
    }
  }

  async invalidateCatalog(): Promise<void> {
    await idbSet(CATALOG_KEY, {
      value: { schemaVersion: '1.0.0', catalogVersion: 0, updatedAt: '', games: [] },
      fetchedAt: 0,
    });
    this.detailMemory.clear();
  }

  private rememberDetail(slug: string, game: GameRecord) {
    if (this.detailMemory.size >= MAX_DETAIL_ENTRIES) {
      const firstKey = this.detailMemory.keys().next().value;
      if (firstKey) this.detailMemory.delete(firstKey);
    }
    this.detailMemory.set(slug, game);
  }
}
