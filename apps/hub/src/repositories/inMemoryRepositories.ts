import {
  SUPPORTED_LOCALE_CODES,
  toCompactTranslations,
  type CategoryRecord,
  type GameRecord,
  type GameReleaseRecord,
  type GameStatus,
  type PublicCatalogDocument,
} from '@game-hub/contract';
import type { HubRepositories, HubSettings } from './interfaces';

export function createInMemoryRepositories(initial?: {
  games?: GameRecord[];
  categories?: CategoryRecord[];
  releases?: GameReleaseRecord[];
}): HubRepositories {
  const gamesMap = new Map<string, GameRecord>();
  for (const g of initial?.games ?? []) gamesMap.set(g.id, g);

  const categoriesMap = new Map<string, CategoryRecord>();
  for (const c of initial?.categories ?? [
    { id: 'puzzle', name: 'Puzzle', order: 1, enabled: true },
    { id: 'brain', name: 'Brain Training', order: 2, enabled: true },
    { id: 'casual', name: 'Casual', order: 3, enabled: true },
  ]) {
    categoriesMap.set(c.id, c);
  }

  const releasesMap = new Map<string, GameReleaseRecord>();
  for (const r of initial?.releases ?? []) releasesMap.set(r.id, r);

  let catalogVersion = 1;
  let settingsState: HubSettings = {
    hubName: 'Game Hub',
    tagline: 'Free, offline-first Flutter games',
    defaultLocale: 'en',
    supportedLocales: [...SUPPORTED_LOCALE_CODES],
    catalogCacheTtlMinutes: 60,
    updatedAt: new Date().toISOString(),
  };

  const buildCatalog = (): PublicCatalogDocument => ({
    schemaVersion: '1.0.0',
    catalogVersion,
    updatedAt: new Date().toISOString(),
    games: [...gamesMap.values()]
      .filter((g) => g.status === 'published')
      .map((g) => {
        const compactTranslations = toCompactTranslations(g.translations);
        return {
          id: g.id,
          slug: g.slug,
          title: g.title,
          shortDescription: g.shortDescription,
          ...(compactTranslations ? { translations: compactTranslations } : {}),
          thumbnail: g.thumbnail,
          icon: g.icon,
          categories: g.categories,
          tags: g.tags,
          featured: g.featured,
          revision: g.revision,
          updatedAt: g.updatedAt,
        };
      }),
  });

  const adminGames: HubRepositories['adminGames'] = {
    async listAllGames() {
      return [...gamesMap.values()];
    },
    async getGameById(id) {
      return gamesMap.get(id) ?? null;
    },
    async createGame(input) {
      if (gamesMap.has(input.id)) throw new Error(`Game ID "${input.id}" already exists.`);
      if ([...gamesMap.values()].some((g) => g.slug === input.slug)) {
        throw new Error(`Slug "${input.slug}" is already reserved.`);
      }
      const now = new Date().toISOString();
      const created: GameRecord = {
        ...input,
        features: { ...input.features, webAds: false },
        distribution: { ...input.distribution, allowWebPlay: true },
        revision: 1,
        createdAt: now,
        updatedAt: now,
      };
      if (!created.translations) {
        delete created.translations;
      }
      gamesMap.set(created.id, created);
      catalogVersion += 1;
      return created;
    },
    async updateGame(id, patch, expectedRevision) {
      const existing = gamesMap.get(id);
      if (!existing) throw new Error(`Game "${id}" not found.`);
      if (existing.revision !== expectedRevision) {
        throw new Error(`Revision conflict: expected ${expectedRevision}, got ${existing.revision}`);
      }
      const updated: GameRecord = {
        ...existing,
        ...patch,
        id: existing.id,
        revision: existing.revision + 1,
        updatedAt: new Date().toISOString(),
      };
      if ('translations' in patch && !patch.translations) {
        delete updated.translations;
      }
      gamesMap.set(id, updated);
      catalogVersion += 1;
      return updated;
    },
    async setGameStatus(id, status: GameStatus, expectedRevision, actorUid) {
      return this.updateGame(id, { status }, expectedRevision, actorUid);
    },
    async deleteGamePermanently(id) {
      gamesMap.delete(id);
      catalogVersion += 1;
    },
  };

  return {
    catalog: {
      async getPublicCatalog() {
        return { catalog: buildCatalog(), fromCache: false, stale: false };
      },
      async invalidateCache() {},
    },
    games: {
      async getPublicGameBySlug(slug) {
        return [...gamesMap.values()].find((g) => g.slug === slug && g.status === 'published') ?? null;
      },
    },
    categories: {
      async listEnabledCategories() {
        return [...categoriesMap.values()].filter((c) => c.enabled).sort((a, b) => a.order - b.order);
      },
      async listAllCategories() {
        return [...categoriesMap.values()].sort((a, b) => a.order - b.order);
      },
      async saveCategory(c) {
        categoriesMap.set(c.id, c);
      },
    },
    settings: {
      async getPublicSettings() {
        return settingsState;
      },
      async updatePublicSettings(patch) {
        settingsState = { ...settingsState, ...patch, updatedAt: new Date().toISOString() };
      },
    },
    adminGames,
    releases: {
      async listReleasesForGame(gameId) {
        return [...releasesMap.values()].filter((r) => r.gameId === gameId);
      },
      async registerRelease(r) {
        const created: GameReleaseRecord = { ...r, createdAt: new Date().toISOString() };
        releasesMap.set(created.id, created);
        return created;
      },
      async activateRelease(gameId, releaseId, expectedRevision, actorUid) {
        const rel = releasesMap.get(releaseId);
        if (!rel) throw new Error('Release not found');
        const existing = gamesMap.get(gameId);
        if (!existing) throw new Error('Game not found');
        return adminGames.updateGame(
          gameId,
          {
            currentRelease: rel.version,
            web: { ...existing.web, artifactUrl: rel.artifactUrl, buildVersion: rel.version },
          },
          expectedRevision,
          actorUid
        );
      },
    },
  };
}
