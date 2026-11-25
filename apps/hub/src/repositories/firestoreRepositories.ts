import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  setDoc,
  where,
  type Firestore,
} from 'firebase/firestore';
import type {
  CategoryRecord,
  CompactCatalogGame,
  GameRecord,
  GameReleaseRecord,
  GameStatus,
  PublicCatalogDocument,
} from '@game-hub/contract';
import { CatalogCacheService } from '../services/catalogCache';
import type {
  AdminGameRepository,
  CatalogRepository,
  CategoryRepository,
  GameReleaseRepository,
  GameRepository,
  HubRepositories,
  HubSettings,
  SettingsRepository,
} from './interfaces';

function toCompactGame(game: GameRecord): CompactCatalogGame {
  return {
    id: game.id,
    slug: game.slug,
    title: game.title,
    shortDescription: game.shortDescription,
    thumbnail: game.thumbnail,
    icon: game.icon,
    categories: game.categories,
    tags: game.tags,
    featured: game.featured,
    revision: game.revision,
    updatedAt: game.updatedAt,
  };
}

export function createFirestoreRepositories(
  db: Firestore,
  cache = new CatalogCacheService(Number(import.meta.env.VITE_CATALOG_CACHE_TTL_MINUTES || 60))
): HubRepositories {
  const catalog: CatalogRepository = {
    async getPublicCatalog(options) {
      return cache.getCatalog(async () => {
        const snap = await getDoc(doc(db, 'public_catalog', 'current'));
        if (!snap.exists()) {
          return {
            schemaVersion: '1.0.0',
            catalogVersion: 0,
            updatedAt: new Date().toISOString(),
            games: [],
          };
        }
        return snap.data() as PublicCatalogDocument;
      }, options);
    },
    async invalidateCache() {
      await cache.invalidateCatalog();
    },
  };

  const games: GameRepository = {
    async getPublicGameBySlug(slug, expectedRevision) {
      return cache.getGameDetail(slug, expectedRevision, async () => {
        const snap = await getDoc(doc(db, 'public_games', slug));
        if (!snap.exists()) return null;
        return snap.data() as GameRecord;
      });
    },
  };

  const categories: CategoryRepository = {
    async listEnabledCategories() {
      const q = query(collection(db, 'categories'), where('enabled', '==', true));
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => d.data() as CategoryRecord)
        .sort((a, b) => a.order - b.order);
    },
    async listAllCategories() {
      const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
      return snap.docs.map((d) => d.data() as CategoryRecord);
    },
    async saveCategory(category) {
      await setDoc(doc(db, 'categories', category.id), category);
    },
  };

  const settings: SettingsRepository = {
    async getPublicSettings() {
      const snap = await getDoc(doc(db, 'hub_settings', 'public'));
      if (!snap.exists()) {
        return {
          hubName: 'Game Hub',
          tagline: 'Free, offline-first Flutter games',
          defaultLocale: 'en',
          supportedLocales: ['en', 'vi'],
          catalogCacheTtlMinutes: 60,
          updatedAt: new Date().toISOString(),
        };
      }
      return snap.data() as HubSettings;
    },
    async updatePublicSettings(patch) {
      const current = await this.getPublicSettings();
      await setDoc(doc(db, 'hub_settings', 'public'), {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      });
    },
  };

  const adminGames: AdminGameRepository = {
    async listAllGames() {
      const snap = await getDocs(collection(db, 'games'));
      return snap.docs
        .map((d) => d.data() as GameRecord)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async getGameById(id) {
      const snap = await getDoc(doc(db, 'games', id));
      return snap.exists() ? (snap.data() as GameRecord) : null;
    },
    async createGame(input, actorUid) {
      const now = new Date().toISOString();
      const record: GameRecord = {
        ...input,
        features: { ...input.features, webAds: false },
        distribution: { ...input.distribution, allowWebPlay: true },
        revision: 1,
        createdAt: now,
        updatedAt: now,
      };

      await runTransaction(db, async (tx) => {
        const gameRef = doc(db, 'games', record.id);
        const slugRef = doc(db, 'slug_reservations', record.slug);
        const catalogRef = doc(db, 'public_catalog', 'current');

        const [existingGame, existingSlug, catalogSnap] = await Promise.all([
          tx.get(gameRef),
          tx.get(slugRef),
          tx.get(catalogRef),
        ]);

        if (existingGame.exists()) {
          throw new Error(`Game ID "${record.id}" already exists.`);
        }
        if (existingSlug.exists()) {
          throw new Error(`Slug "${record.slug}" is already reserved.`);
        }

        tx.set(gameRef, record);
        tx.set(slugRef, { gameId: record.id, reservedAt: now });

        if (record.status === 'published') {
          tx.set(doc(db, 'public_games', record.slug), record);
          const currentCatalog = catalogSnap.exists()
            ? (catalogSnap.data() as PublicCatalogDocument)
            : { schemaVersion: '1.0.0', catalogVersion: 0, updatedAt: now, games: [] };
          tx.set(catalogRef, {
            schemaVersion: '1.0.0',
            catalogVersion: (currentCatalog.catalogVersion || 0) + 1,
            updatedAt: now,
            games: [...currentCatalog.games.filter((g) => g.id !== record.id), toCompactGame(record)],
          });
        }

        tx.set(doc(db, 'admin_audit', `create-${record.id}-${Date.now()}`), {
          actorUid,
          action: 'create_game',
          targetId: record.id,
          status: record.status,
          timestamp: now,
        });
      });

      await cache.invalidateCatalog();
      return record;
    },

    async updateGame(id, patch, expectedRevision, actorUid) {
      const now = new Date().toISOString();
      let updatedRecord!: GameRecord;

      await runTransaction(db, async (tx) => {
        const gameRef = doc(db, 'games', id);
        const catalogRef = doc(db, 'public_catalog', 'current');
        const [gameSnap, catalogSnap] = await Promise.all([
          tx.get(gameRef),
          tx.get(catalogRef),
        ]);

        if (!gameSnap.exists()) throw new Error(`Game "${id}" not found.`);
        const existing = gameSnap.data() as GameRecord;
        if (existing.revision !== expectedRevision) {
          throw new Error(
            `Revision conflict: expected ${expectedRevision}, but server is at ${existing.revision}. Reload and retry.`
          );
        }

        const nextSlug = patch.slug ?? existing.slug;
        if (nextSlug !== existing.slug) {
          const newSlugSnap = await tx.get(doc(db, 'slug_reservations', nextSlug));
          if (newSlugSnap.exists()) {
            throw new Error(`Slug "${nextSlug}" is already reserved by another game.`);
          }
          tx.delete(doc(db, 'slug_reservations', existing.slug));
          tx.set(doc(db, 'slug_reservations', nextSlug), { gameId: id, reservedAt: now });
          tx.delete(doc(db, 'public_games', existing.slug));
        }

        updatedRecord = {
          ...existing,
          ...patch,
          id: existing.id,
          createdAt: existing.createdAt,
          features: { ...(patch.features ?? existing.features), webAds: false },
          distribution: { ...(patch.distribution ?? existing.distribution), allowWebPlay: true },
          revision: existing.revision + 1,
          updatedAt: now,
        };

        tx.set(gameRef, updatedRecord);

        const currentCatalog = catalogSnap.exists()
          ? (catalogSnap.data() as PublicCatalogDocument)
          : { schemaVersion: '1.0.0', catalogVersion: 0, updatedAt: now, games: [] };
        const filtered = currentCatalog.games.filter((g) => g.id !== id);

        if (updatedRecord.status === 'published') {
          tx.set(doc(db, 'public_games', updatedRecord.slug), updatedRecord);
          tx.set(catalogRef, {
            schemaVersion: '1.0.0',
            catalogVersion: (currentCatalog.catalogVersion || 0) + 1,
            updatedAt: now,
            games: [...filtered, toCompactGame(updatedRecord)],
          });
        } else {
          tx.delete(doc(db, 'public_games', updatedRecord.slug));
          tx.set(catalogRef, {
            schemaVersion: '1.0.0',
            catalogVersion: (currentCatalog.catalogVersion || 0) + 1,
            updatedAt: now,
            games: filtered,
          });
        }

        tx.set(doc(db, 'admin_audit', `update-${id}-${Date.now()}`), {
          actorUid,
          action: 'update_game',
          targetId: id,
          revision: updatedRecord.revision,
          status: updatedRecord.status,
          timestamp: now,
        });
      });

      await cache.invalidateCatalog();
      return updatedRecord;
    },

    async setGameStatus(id, status, expectedRevision, actorUid) {
      return this.updateGame(id, { status }, expectedRevision, actorUid);
    },

    async deleteGamePermanently(id, actorUid) {
      const now = new Date().toISOString();
      await runTransaction(db, async (tx) => {
        const gameRef = doc(db, 'games', id);
        const catalogRef = doc(db, 'public_catalog', 'current');
        const [gameSnap, catalogSnap] = await Promise.all([
          tx.get(gameRef),
          tx.get(catalogRef),
        ]);
        if (!gameSnap.exists()) return;
        const existing = gameSnap.data() as GameRecord;

        tx.delete(gameRef);
        tx.delete(doc(db, 'slug_reservations', existing.slug));
        tx.delete(doc(db, 'public_games', existing.slug));

        if (catalogSnap.exists()) {
          const currentCatalog = catalogSnap.data() as PublicCatalogDocument;
          tx.set(catalogRef, {
            schemaVersion: '1.0.0',
            catalogVersion: (currentCatalog.catalogVersion || 0) + 1,
            updatedAt: now,
            games: currentCatalog.games.filter((g) => g.id !== id),
          });
        }

        tx.set(doc(db, 'admin_audit', `delete-${id}-${Date.now()}`), {
          actorUid,
          action: 'delete_game_permanently',
          targetId: id,
          timestamp: now,
        });
      });
      await cache.invalidateCatalog();
    },
  };

  const releases: GameReleaseRepository = {
    async listReleasesForGame(gameId) {
      const q = query(collection(db, 'game_releases'), where('gameId', '==', gameId));
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => d.data() as GameReleaseRecord)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async registerRelease(release, actorUid) {
      const now = new Date().toISOString();
      const record: GameReleaseRecord = { ...release, createdAt: now };
      await setDoc(doc(db, 'game_releases', record.id), record);
      await setDoc(doc(db, 'admin_audit', `release-${record.id}-${Date.now()}`), {
        actorUid,
        action: 'register_release',
        targetId: record.id,
        timestamp: now,
      });
      return record;
    },
    async activateRelease(gameId, releaseId, expectedRevision, actorUid) {
      const releaseSnap = await getDoc(doc(db, 'game_releases', releaseId));
      if (!releaseSnap.exists()) throw new Error(`Release "${releaseId}" not found.`);
      const release = releaseSnap.data() as GameReleaseRecord;
      const existing = await adminGames.getGameById(gameId);
      if (!existing) throw new Error(`Game "${gameId}" not found.`);
      return adminGames.updateGame(
        gameId,
        {
          currentRelease: release.version,
          web: {
            ...existing.web,
            artifactUrl: release.artifactUrl,
            buildVersion: release.version,
          },
        },
        expectedRevision,
        actorUid
      );
    },
  };

  return { catalog, games, categories, settings, adminGames, releases };
}
