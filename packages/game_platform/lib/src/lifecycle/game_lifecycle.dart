typedef LifecycleCallback = void Function();

class GameLifecycle {
  final List<LifecycleCallback> _onPause = [];
  final List<LifecycleCallback> _onResume = [];

  void addPauseListener(LifecycleCallback cb) => _onPause.add(cb);
  void removePauseListener(LifecycleCallback cb) => _onPause.remove(cb);
  void addResumeListener(LifecycleCallback cb) => _onResume.add(cb);
  void removeResumeListener(LifecycleCallback cb) => _onResume.remove(cb);

  void notifyPaused() {
    for (final cb in List<LifecycleCallback>.from(_onPause)) {
      cb();
    }
  }

  void notifyResumed() {
    for (final cb in List<LifecycleCallback>.from(_onResume)) {
      cb();
    }
  }
}
