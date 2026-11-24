import 'package:flutter/services.dart';

class GameHaptics {
  GameHaptics({required this.enabled});

  final bool enabled;

  Future<void> lightImpact() async {
    if (!enabled) return;
    try {
      await HapticFeedback.lightImpact();
    } catch (_) {}
  }

  Future<void> selectionClick() async {
    if (!enabled) return;
    try {
      await HapticFeedback.selectionClick();
    } catch (_) {}
  }
}
