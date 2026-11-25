export type GameStatus = 'draft' | 'published' | 'disabled' | 'archived';

export type GameOrientation = 'portrait' | 'landscape' | 'any';

export interface GameManifest {
  schemaVersion: '2.0.0';
  id: string;
  slug: string;
  version: string;
  metadata: {
    title: string;
    shortDescription: string;
    description: string;
    howToPlay?: string;
    categories: string[];
    tags?: string[];
    developer?: string;
    defaultLocale: string;
    supportedLocales: string[];
  };
  assets: {
    icon: string;
    thumbnail: string;
    screenshots?: string[];
  };
  web: {
    enabled: boolean;
    artifactUrl: string | null;
    buildVersion: string;
    entrypoint: string;
    buildStrategy: 'javascript' | 'wasm';
    orientation: GameOrientation;
    aspectRatio: {
      width: number;
      height: number;
    };
    fullscreen?: boolean;
    backgroundColor?: string | null;
    supportsTouch?: boolean;
    supportsKeyboard?: boolean;
    supportsOffline?: boolean;
    hubBridgeEnabled?: boolean;
  };
  mobile: {
    android: {
      enabled: boolean;
      packageId?: string | null;
      storeUrl?: string | null;
      appLink?: string | null;
    };
    ios: {
      enabled: boolean;
      bundleId?: string | null;
      appStoreId?: string | null;
      storeUrl?: string | null;
      universalLink?: string | null;
    };
  };
  content: {
    source: 'bundled' | 'firebase' | 'hybrid';
    provider?: 'firestore' | 'rtdb' | 'none' | null;
    projectRef?: string | null;
    remoteMetadataPath?: string | null;
    bundledContentAsset?: string | null;
    bundledContentVersion?: string | null;
    offlineFirst: boolean;
    syncEnabled: boolean;
    syncIntervalHours?: number;
  };
  features: {
    localStorage: boolean;
    firebaseContentSync: boolean;
    nativeAds: boolean;
    webAds: false;
    playerAuthentication: boolean;
    hubBridge: boolean;
  };
  distribution: {
    installPromptEnabled: boolean;
    installPromptCooldownDays: number;
    allowWebPlay: true;
  };
  integration: {
    platformPackageVersion: string;
    bridgeProtocolVersion: string;
  };
}

export interface CompactCatalogGame {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  icon: string;
  categories: string[];
  tags?: string[];
  featured: boolean;
  revision: number;
  updatedAt: string;
}

export interface PublicCatalogDocument {
  schemaVersion: string;
  catalogVersion: number;
  updatedAt: string;
  games: CompactCatalogGame[];
}

export interface GameRecord {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  howToPlay?: string;
  categories: string[];
  tags: string[];
  developer: string;
  icon: string;
  thumbnail: string;
  screenshots: string[];
  featured: boolean;
  status: GameStatus;
  revision: number;
  manifestVersion: string;
  currentRelease: string;
  web: {
    enabled: boolean;
    artifactUrl: string | null;
    buildVersion: string;
    orientation: GameOrientation;
    aspectRatio: { width: number; height: number };
    fullscreen: boolean;
    backgroundColor?: string | null;
    supportsTouch: boolean;
    supportsKeyboard: boolean;
    hubBridgeEnabled: boolean;
  };
  mobile: GameManifest['mobile'];
  distribution: GameManifest['distribution'];
  features: GameManifest['features'];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  description?: string;
  order: number;
  enabled: boolean;
}

export interface GameReleaseRecord {
  id: string;
  gameId: string;
  version: string;
  artifactUrl: string;
  published: boolean;
  checksum?: string;
  notes?: string;
  createdAt: string;
}

export type GameToHubEventType =
  | 'GAME_READY'
  | 'GAME_STARTED'
  | 'GAME_PAUSED'
  | 'GAME_RESUMED'
  | 'GAME_COMPLETED'
  | 'LEVEL_COMPLETED'
  | 'SCORE_UPDATED'
  | 'GAME_ERROR'
  | 'REQUEST_FULLSCREEN'
  | 'REQUEST_EXIT';

export type HubToGameCommandType =
  | 'HUB_INIT'
  | 'PAUSE_GAME'
  | 'RESUME_GAME'
  | 'MUTE_AUDIO'
  | 'UNMUTE_AUDIO'
  | 'REQUEST_STATE';

export type BridgeMessageType = GameToHubEventType | HubToGameCommandType;

export interface BridgeMessage {
  protocol: 'game-hub';
  protocolVersion: '1.0.0';
  type: BridgeMessageType;
  gameId: string;
  sessionId: string;
  messageId: string;
  timestamp: number;
  payload: Record<string, unknown>;
}
