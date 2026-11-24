import 'package:flutter_test/flutter_test.dart';
import 'package:game_platform/game_platform.dart';
import 'package:memory_match_fixture/main.dart';

void main() {
  tearDown(GamePlatform.resetForTesting);

  testWidgets('renders Memory Match fixture offline', (tester) async {
    await GamePlatform.initialize(
      const GamePlatformConfig(
        gameId: 'memory-match-fixture',
        manifestAsset: 'assets/manifest.json',
        environmentOverride: GameEnvironment.webEmbedded,
        firebaseSyncEnabled: false,
        nativeAdsEnabled: false,
      ),
    );
    await tester.pumpWidget(const MemoryMatchFixtureApp());
    await tester.pumpAndSettle();

    expect(find.textContaining('Memory Match'), findsOneWidget);
  });
}
