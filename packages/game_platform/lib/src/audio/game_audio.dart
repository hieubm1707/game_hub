import 'package:flutter/foundation.dart';

class GameAudio {
  final ValueNotifier<bool> muted = ValueNotifier<bool>(false);

  bool get isMuted => muted.value;

  void mute() => muted.value = true;
  void unmute() => muted.value = false;
  void toggleMute() => muted.value = !muted.value;
}
