import type {
  CategoryRecord,
  GameRecord,
  GameReleaseRecord,
  GameStatus,
  PublicCatalogDocument,
} from '@game-hub/contract';

export interface HubSettings {
  hubName: string;
  tagline: string;
  defaultLocale: string;
  supportedLocales: string[];
  catalogCacheTtlMinutes: number;
  updatedAt: string;
}

export interface CatalogRepository {
  getPublicCatalog(options?: { forceRefresh?: boolean }): Promise<{
    catalog: PublicCatalogDocument;
    fromCache: boolean;
    stale: boolean;
  }>;
  invalidateCache(): Promise<void>;
}

export interface GameRepository {
  getPublicGameBySlug(slug: string, expectedRevision?: number): Promise<GameRecord | null>;
}

export interface CategoryRepository {
  listEnabledCategories(): Promise<CategoryRecord[]>;
  listAllCategories(): Promise<CategoryRecord[]>;
  saveCategory(category: CategoryRecord): Promise<void>;
}

export interface SettingsRepository {
  getPublicSettings(): Promise<HubSettings>;
  updatePublicSettings(settings: Partial<HubSettings>): Promise<void>;
}

export interface AdminGameRepository {
  listAllGames(): Promise<GameRecord[]>;
  getGameById(id: string): Promise<GameRecord | null>;
  createGame(game: Omit<GameRecord, 'revision' | 'createdAt' | 'updatedAt'>, actorUid: string): Promise<GameRecord>;
  updateGame(
    id: string,
    patch: Partial<GameRecord>,
    expectedRevision: number,
    actorUid: string
  ): Promise<GameRecord>;
  setGameStatus(
    id: string,
    status: GameStatus,
    expectedRevision: number,
    actorUid: string
  ): Promise<GameRecord>;
  deleteGamePermanently(id: string, actorUid: string): Promise<void>;
}

export interface GameReleaseRepository {
  listReleasesForGame(gameId: string): Promise<GameReleaseRecord[]>;
  registerRelease(release: Omit<GameReleaseRecord, 'createdAt'>, actorUid: string): Promise<GameReleaseRecord>;
  activateRelease(gameId: string, releaseId: string, expectedRevision: number, actorUid: string): Promise<GameRecord>;
}

export interface HubRepositories {
  catalog: CatalogRepository;
  games: GameRepository;
  categories: CategoryRepository;
  settings: SettingsRepository;
  adminGames: AdminGameRepository;
  releases: GameReleaseRepository;
}
