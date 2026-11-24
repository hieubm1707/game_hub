import 'package:flutter/material.dart';
import 'package:game_platform/game_platform.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await GamePlatform.initialize(
    const GamePlatformConfig(
      gameId: 'iq-puzzle-fixture',
      manifestAsset: 'assets/manifest.json',
      offlineFirst: true,
      firebaseSyncEnabled: true,
      nativeAdsEnabled: true,
      hubBridgeEnabled: true,
      allowedHubOrigins: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
      ],
    ),
  );

  runApp(const IqPuzzleFixtureApp());
}

class IqPuzzleFixtureApp extends StatelessWidget {
  const IqPuzzleFixtureApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IQ Puzzle (Test Fixture)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF4F46E5),
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      home: const PuzzleScreen(),
    );
  }
}

class PuzzleScreen extends StatefulWidget {
  const PuzzleScreen({super.key});

  @override
  State<PuzzleScreen> createState() => _PuzzleScreenState();
}

class _PuzzleScreenState extends State<PuzzleScreen> {
  GameContentPack? _pack;
  int _index = 0;
  int _score = 0;
  int _highScore = 0;
  bool _paused = false;
  String? _feedback;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final platform = GamePlatform.instance;
    platform.lifecycle.addPauseListener(() {
      if (mounted) setState(() => _paused = true);
    });
    platform.lifecycle.addResumeListener(() {
      if (mounted) setState(() => _paused = false);
    });

    final savedHigh = await platform.storage.getString('high_score');
    final pack = await platform.contentRepository?.loadContent();

    if (!mounted) return;
    setState(() {
      _highScore = int.tryParse(savedHigh ?? '0') ?? 0;
      _pack = pack;
    });

    platform.bridge.sendEvent('GAME_READY', payload: {
      'contentVersion': pack?.contentVersion ?? 'unknown',
      'adsAvailable': platform.ads.isAvailable,
    });
    platform.bridge.sendEvent('GAME_STARTED');
  }

  Future<void> _answer(int choiceIndex) async {
    final pack = _pack;
    if (pack == null || _paused) return;
    final item = pack.items[_index];
    final correctIndex = (item['answerIndex'] as num).toInt();
    final isCorrect = choiceIndex == correctIndex;

    final platform = GamePlatform.instance;
    await platform.haptics.selectionClick();

    setState(() {
      if (isCorrect) {
        _score += 10;
        _feedback = 'Correct! +10';
        if (_score > _highScore) {
          _highScore = _score;
          platform.storage.setString('high_score', '$_highScore');
        }
      } else {
        _feedback = 'Try the next one!';
      }

      if (_index + 1 < pack.items.length) {
        _index += 1;
      } else {
        _index = 0;
        platform.bridge.sendEvent('LEVEL_COMPLETED', payload: {'score': _score});
      }
    });

    platform.bridge.sendEvent('SCORE_UPDATED', payload: {
      'score': _score,
      'highScore': _highScore,
    });
  }

  @override
  Widget build(BuildContext context) {
    final pack = _pack;
    final platform = GamePlatform.instance;

    if (pack == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final current = pack.items[_index];
    final options = (current['options'] as List).cast<String>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('IQ Puzzle (Fixture)'),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Text('Score: $_score | Best: $_highScore'),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Chip(
              label: Text(
                'Offline Content v${pack.contentVersion} (${pack.source}) • Web Ads: ${platform.ads.isAvailable ? "ON" : "OFF"}',
              ),
            ),
            const SizedBox(height: 20),
            if (_paused)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('Paused by Game Hub', textAlign: TextAlign.center),
                ),
              ),
            Text(
              'Question ${_index + 1} of ${pack.items.length}',
              style: Theme.of(context).textTheme.labelLarge,
            ),
            const SizedBox(height: 8),
            Text(
              current['prompt'] as String,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 20),
            for (var i = 0; i < options.length; i++)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: FilledButton.tonal(
                  onPressed: _paused ? null : () => _answer(i),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    child: Text(options[i]),
                  ),
                ),
              ),
            if (_feedback != null) ...[
              const SizedBox(height: 12),
              Text(_feedback!, textAlign: TextAlign.center),
            ],
            const Spacer(),
            OutlinedButton(
              onPressed: () => platform.bridge.sendEvent('REQUEST_EXIT'),
              child: const Text('Exit to Hub'),
            ),
          ],
        ),
      ),
    );
  }
}
