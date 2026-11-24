import 'package:web/web.dart' as web;

bool isRunningInIframe() {
  try {
    return web.window.self != web.window.top;
  } catch (_) {
    // Cross-origin access to window.top throws SecurityError when embedded.
    return true;
  }
}
