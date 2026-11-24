import 'package:flutter/material.dart';
import 'package:game_platform/game_platform.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await GamePlatform.initialize(
    const GamePlatformConfig(
      gameId: 'memory-match-fixture',
      manifestAsset: 'assets/manifest.json',
      offlineFirst: true,
      firebaseSyncEnabled: false,
      nativeAdsEnabled: false,
      hubBridgeEnabled: true,
    ),
  );

  runApp(const MemoryMatchFixtureApp());
}

class MemoryMatchFixtureApp extends StatelessWidget {
  const MemoryMatchFixtureApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Memory Match (Test Fixture)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF0EA5E9),
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      home: const MemoryBoardScreen(),
    );
  }
}

class MemoryBoardScreen extends StatefulWidget {
  const MemoryBoardScreen({super.key});

  @override
  State<MemoryBoardScreen> createState() => _MemoryBoardScreenState();
}

class _MemoryBoardScreenState extends State<MemoryBoardScreen> {
  List<String> _cards = [];
  final Set<int> _matched = {};
  int? _firstIndex;
  int _moves = 0;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final platform = GamePlatform.instance;
    final pack = await platform.contentRepository?.loadContent();
    final labels = (pack?.items ?? const [])
        .map((e) => (e['label'] as String?) ?? '?')
        .toList();
    final deck = [...labels, ...labels];
    if (!mounted) return;
    setState(() => _cards = deck);
    platform.bridge.sendEvent('GAME_READY', payload: {'pairs': labels.length});
  }

  void _tapCard(int index) {
    if (_matched.contains(index) || _firstIndex == index) return;
    setState(() {
      if (_firstIndex == null) {
        _firstIndex = index;
      } else {
        _moves += 1;
        if (_cards[_firstIndex!] == _cards[index]) {
          _matched.add(_firstIndex!);
          _matched.add(index);
          if (_matched.length == _cards.length) {
            GamePlatform.instance.bridge.sendEvent(
              'GAME_COMPLETED',
              payload: {'moves': _moves},
            );
          }
        }
        _firstIndex = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Memory Match (Fixture) • Moves: $_moves')),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: _cards.length,
        itemBuilder: (context, index) {
          final revealed = _matched.contains(index) || _firstIndex == index;
          return FilledButton.tonal(
            onPressed: () => _tapCard(index),
            child: Text(revealed ? _cards[index] : '?'),
          );
        },
      ),
    );
  }
}
