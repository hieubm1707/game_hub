import { describe, expect, it } from 'vitest';
import { validateBridgeMessage, validateManifest, isSafeHttpUrl } from '../src/validator.js';

function createValidManifest() {
  return {
    schemaVersion: '2.0.0',
    id: 'iq-puzzle',
    slug: 'iq-puzzle',
    version: '1.0.0',
    metadata: {
      title: 'IQ Puzzle',
      shortDescription: 'Train your brain offline.',
      description: 'A collection of offline logic puzzles.',
      categories: ['puzzle', 'brain'],
      tags: ['iq', 'offline'],
      developer: 'Nonprofit Hub',
      defaultLocale: 'en',
      supportedLocales: ['en', 'vi'],
    },
    assets: {
      icon: 'assets/icon.webp',
      thumbnail: 'assets/thumbnail.webp',
      screenshots: [],
    },
    web: {
      enabled: true,
      artifactUrl: 'https://iq-puzzle.pages.dev/releases/1.0.0/index.html',
      buildVersion: '1.0.0',
      entrypoint: 'index.html',
      buildStrategy: 'javascript',
      orientation: 'portrait',
      aspectRatio: { width: 9, height: 16 },
      fullscreen: true,
      supportsTouch: true,
      supportsKeyboard: true,
      supportsOffline: false,
      hubBridgeEnabled: true,
    },
    mobile: {
      android: {
        enabled: true,
        packageId: 'org.gamehub.iqpuzzle',
        storeUrl: 'https://play.google.com/store/apps/details?id=org.gamehub.iqpuzzle',
        appLink: null,
      },
      ios: {
        enabled: false,
        bundleId: null,
        appStoreId: null,
        storeUrl: null,
        universalLink: null,
      },
    },
    content: {
      source: 'hybrid',
      provider: 'firestore',
      projectRef: 'game-default',
      remoteMetadataPath: 'content_metadata/iq-puzzle',
      bundledContentAsset: 'assets/content/default.json',
      bundledContentVersion: '1.0.0',
      offlineFirst: true,
      syncEnabled: true,
      syncIntervalHours: 24,
    },
    features: {
      localStorage: true,
      firebaseContentSync: true,
      nativeAds: true,
      webAds: false,
      playerAuthentication: false,
      hubBridge: true,
    },
    distribution: {
      installPromptEnabled: true,
      installPromptCooldownDays: 7,
      allowWebPlay: true,
    },
    integration: {
      platformPackageVersion: '1.0.0',
      bridgeProtocolVersion: '1.0.0',
    },
  };
}

describe('game_contract manifest validation', () => {
  it('accepts a valid v2.0.0 manifest', () => {
    const result = validateManifest(createValidManifest());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects manifests that enable webAds', () => {
    const m = createValidManifest();
    (m.features as Record<string, unknown>).webAds = true;
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('webAds'))).toBe(true);
  });

  it('rejects manifests with local absolute paths in public fields', () => {
    const m = createValidManifest();
    m.assets.icon = '/Users/admin/Desktop/icon.png';
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('local absolute path'))).toBe(true);
  });

  it('rejects unsafe javascript: iframe artifact URLs', () => {
    const m = createValidManifest();
    m.web.artifactUrl = 'javascript:alert(1)';
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
  });

  it('enforces allowedArtifactOrigins when provided', () => {
    const m = createValidManifest();
    expect(
      validateManifest(m, { allowedArtifactOrigins: ['https://trusted.pages.dev'] }).valid
    ).toBe(false);
    expect(
      validateManifest(m, { allowedArtifactOrigins: ['https://iq-puzzle.pages.dev'] }).valid
    ).toBe(true);
  });

  it('validates bridge messages strictly', () => {
    const valid = validateBridgeMessage({
      protocol: 'game-hub',
      protocolVersion: '1.0.0',
      type: 'GAME_READY',
      gameId: 'iq-puzzle',
      sessionId: 'sess-123',
      messageId: 'msg-1',
      timestamp: Date.now(),
      payload: {},
    });
    expect(valid.valid).toBe(true);

    const invalid = validateBridgeMessage({
      protocol: 'other',
      type: 'UNKNOWN',
    });
    expect(invalid.valid).toBe(false);
  });

  it('validates safe HTTP URLs properly', () => {
    expect(isSafeHttpUrl('https://example.pages.dev/game/index.html')).toBe(true);
    expect(isSafeHttpUrl('http://localhost:8090/index.html')).toBe(true);
    expect(isSafeHttpUrl('http://evil.com/index.html')).toBe(false);
    expect(isSafeHttpUrl('data:text/html,<h1>hi</h1>')).toBe(false);
  });

  it('supports HTTPS wildcard origin patterns safely', () => {
    const allowed = ['https://*.vercel.app', 'https://gamehub-*.pages.dev'];
    expect(isSafeHttpUrl('https://blindspot.vercel.app/index.html', allowed)).toBe(true);
    expect(isSafeHttpUrl('https://blindspot-preview-123.vercel.app/', allowed)).toBe(true);
    expect(isSafeHttpUrl('https://gamehub-puzzle.pages.dev/releases/1.0.0/', allowed)).toBe(true);
    expect(isSafeHttpUrl('https://other-puzzle.pages.dev/', allowed)).toBe(false);
    expect(isSafeHttpUrl('https://vercel.app/', allowed)).toBe(false);
    expect(isSafeHttpUrl('https://evil-vercel.app/', allowed)).toBe(false);
    expect(isSafeHttpUrl('https://nested.sub.vercel.app/', allowed)).toBe(false);
    expect(isSafeHttpUrl('http://blindspot.vercel.app/', allowed)).toBe(false);
  });
});
