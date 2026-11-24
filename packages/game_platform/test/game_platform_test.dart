import 'package:flutter_test/flutter_test.dart';
import 'package:game_platform/game_platform.dart';

class _FakeBundledSource implements BundledContentSource {
  _FakeBundledSource(this.pack);
  final GameContentPack pack;

  @override
  Future<GameContentPack> loadBundled() async => pack;
}

class _FakeRemoteSource implements RemoteContentSource {
  _FakeRemoteSource({this.version, this.packs = const {}, this.error});

  final GameContentVersion? version;
  final Map<String, GameContentPack> packs;
  final Object? error;

  @override
  Future<GameContentVersion?> fetchLatestVersion(String gameId) async {
    if (error != null) throw error!;
    return version;
  }

  @override
  Future<GameContentPack> fetchPack(String packId) async {
    if (error != null) throw error!;
    final pack = packs[packId];
    if (pack == null) {
      throw const RemoteContentException(
        RemoteContentErrorCode.invalidContent,
        'Missing pack',
      );
    }
    return pack;
  }
}

class _FakeNativeAdsDelegate implements NativeAdsDelegate {
  bool initialized = false;
  int interstitialCount = 0;

  @override
  Future<void> initialize() async {
    initialized = true;
  }

  @override
  Future<AdResult> showInterstitial() async {
    interstitialCount += 1;
    return const AdResult(outcome: AdOutcome.shown);
  }

  @override
  Future<AdResult> showRewarded() async {
    return const AdResult(outcome: AdOutcome.rewarded, rewardEarned: true);
  }
}

void main() {
  tearDown(GamePlatform.resetForTesting);

  group('Manifest parsing', () {
    test('parses valid v2.0.0 manifest and rejects webAds=true', () {
      final loader = ManifestLoader();
      final valid = loader.parseJson('''
      {
        "schemaVersion": "2.0.0",
        "id": "iq-puzzle",
        "slug": "iq-puzzle",
        "version": "1.0.0",
        "metadata": { "title": "IQ Puzzle", "categories": ["puzzle"] },
        "features": { "webAds": false, "nativeAds": true },
        "distribution": { "allowWebPlay": true },
        "content": { "offlineFirst": true, "syncEnabled": true }
      }
      ''');
      expect(valid.id, 'iq-puzzle');
      expect(valid.webAds, isFalse);

      expect(
        () => loader.parseJson('''
        {
          "schemaVersion": "2.0.0",
          "id": "bad",
          "slug": "bad",
          "version": "1.0.0",
          "features": { "webAds": true }
        }
        '''),
        throwsA(isA<GameManifestException>()),
      );
    });
  });

  group('Storage namespaces', () {
    test('isolates keys per gameId', () async {
      final base = InMemoryGameStorage();
      final g1 = NamespacedGameStorage(delegate: base, gameId: 'game-a');
      final g2 = NamespacedGameStorage(delegate: base, gameId: 'game-b');

      await g1.setString('high_score', '100');
      await g2.setString('high_score', '250');

      expect(await g1.getString('high_score'), '100');
      expect(await g2.getString('high_score'), '250');
    });
  });

  group('Offline-first content sync', () {
    final bundledPack = const GameContentPack(
      id: 'bundled-1',
      gameId: 'iq-puzzle',
      contentVersion: '1.0.0',
      schemaVersion: '1.0.0',
      items: [
        {'id': 'q1', 'prompt': '1+1=?'}
      ],
    );

    test('loads bundled content immediately offline on first launch', () async {
      final storage = InMemoryGameStorage();
      final repo = OfflineFirstContentRepository(
        gameId: 'iq-puzzle',
        bundledSource: _FakeBundledSource(bundledPack),
        localSource: StorageLocalContentSource(storage),
        remoteSource: _FakeRemoteSource(
          error: const RemoteContentException(
            RemoteContentErrorCode.offline,
            'No internet',
          ),
        ),
      );

      final content = await repo.loadContent();
      expect(content.contentVersion, '1.0.0');
      expect(content.source, 'bundled');

      final sync = await repo.synchronize();
      expect(sync.status, SyncStatus.failed);
      // Bundled content remains intact.
      expect((await repo.loadContent()).contentVersion, '1.0.0');
    });

    test('stages remote update and activates only at safe boundary', () async {
      final storage = InMemoryGameStorage();
      final remotePack = const GameContentPack(
        id: 'pack-1.1.0',
        gameId: 'iq-puzzle',
        contentVersion: '1.1.0',
        schemaVersion: '1.0.0',
        items: [
          {'id': 'q2', 'prompt': '2+2=?'}
        ],
      );
      final repo = OfflineFirstContentRepository(
        gameId: 'iq-puzzle',
        bundledSource: _FakeBundledSource(bundledPack),
        localSource: StorageLocalContentSource(storage),
        remoteSource: _FakeRemoteSource(
          version: const GameContentVersion(
            gameId: 'iq-puzzle',
            contentVersion: '1.1.0',
            schemaVersion: '1.0.0',
            packIds: ['pack-1.1.0'],
          ),
          packs: {'pack-1.1.0': remotePack},
        ),
      );

      final syncResult = await repo.synchronize();
      expect(syncResult.status, SyncStatus.staged);

      // Active content has not mutated mid-level yet.
      expect((await repo.loadContent()).contentVersion, '1.0.0');

      // Activate at safe boundary.
      expect(await repo.activatePendingContent(), isTrue);
      final active = await repo.loadContent();
      expect(active.contentVersion, '1.1.0');
      expect(active.source, 'local');
    });

    test('enforces sync interval and handles quota exhaustion gracefully', () async {
      var now = DateTime(2026, 1, 1, 12, 0);
      final storage = InMemoryGameStorage();
      final repo = OfflineFirstContentRepository(
        gameId: 'iq-puzzle',
        bundledSource: _FakeBundledSource(bundledPack),
        localSource: StorageLocalContentSource(storage),
        remoteSource: _FakeRemoteSource(
          error: const RemoteContentException(
            RemoteContentErrorCode.quotaExhausted,
            'resource-exhausted',
          ),
        ),
      );
      final service = ContentSyncService(
        repository: repo,
        storage: storage,
        policy: const SyncPolicy(versionCheckIntervalHours: 24),
        clock: () => now,
      );

      final res1 = await service.synchronizeIfEligible();
      expect(res1.status, SyncStatus.quotaExhausted);
      expect(service.state.consecutiveFailures, 1);

      // Immediately retrying should be skipped due to backoff.
      final res2 = await service.synchronizeIfEligible();
      expect(res2.status, SyncStatus.skipped);
    });
  });

  group('Native-only advertising', () {
    test('Web environment uses WebAdsUnavailableAdapter and never rewards', () async {
      final platform = await GamePlatform.initialize(
        const GamePlatformConfig(
          gameId: 'iq-puzzle',
          environmentOverride: GameEnvironment.webEmbedded,
          nativeAdsEnabled: true,
        ),
      );

      expect(platform.capabilities.supportsNativeAds, isFalse);
      expect(platform.ads.isAvailable, isFalse);
      final rewarded = await platform.ads.showRewarded();
      expect(rewarded.outcome, AdOutcome.unavailable);
      expect(rewarded.rewardEarned, isFalse);
    });

    test('Android environment delegates to NativeAdsAdapter', () async {
      final delegate = _FakeNativeAdsDelegate();
      final platform = await GamePlatform.initialize(
        GamePlatformConfig(
          gameId: 'iq-puzzle',
          environmentOverride: GameEnvironment.android,
          nativeAdsEnabled: true,
          nativeAdsDelegate: delegate,
        ),
      );

      expect(platform.capabilities.supportsNativeAds, isTrue);
      expect(delegate.initialized, isTrue);
      final inter = await platform.ads.showInterstitial();
      expect(inter.outcome, AdOutcome.shown);
      expect(delegate.interstitialCount, 1);
    });
  });

  group('Bridge protocol', () {
    test('parses valid bridge messages and rejects malformed ones', () {
      final parsed = BridgeMessage.tryParse({
        'protocol': 'game-hub',
        'protocolVersion': '1.0.0',
        'type': 'HUB_INIT',
        'gameId': 'iq-puzzle',
        'sessionId': 'sess-1',
        'messageId': 'msg-1',
        'timestamp': 1700000000000,
        'payload': {'locale': 'en'},
      });
      expect(parsed, isNotNull);
      expect(parsed!.type, 'HUB_INIT');
      expect(parsed.payload['locale'], 'en');

      expect(BridgeMessage.tryParse({'protocol': 'invalid'}), isNull);
    });
  });
}
