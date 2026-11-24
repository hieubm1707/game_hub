import 'package:flutter_test/flutter_test.dart';
import 'package:game_platform/game_platform.dart';
import 'package:iq_puzzle_fixture/main.dart';

void main() {
  tearDown(GamePlatform.resetForTesting);

  testWidgets('renders IQ Puzzle fixture offline with bundled content', (tester) async {
    await GamePlatform.initialize(
      const GamePlatformConfig(
        gameId: 'iq-puzzle-fixture',
        manifestAsset: 'assets/manifest.json',
        environmentOverride: GameEnvironment.webEmbedded,
      ),
    );
    await tester.pumpWidget(const IqPuzzleFixtureApp());
    await tester.pumpAndSettle();

    expect(find.textContaining('IQ Puzzle'), findsOneWidget);
    expect(find.textContaining('Web Ads: OFF'), findsOneWidget);
  });
}
