import type { GameRecord } from '@game-hub/contract';

export type DetectedDevice = 'android' | 'ios' | 'desktop';

const DISMISS_PREFIX = 'game_hub:install_prompt_dismissed:';

export function detectDevicePlatform(userAgent?: string): DetectedDevice {
  const ua = (userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '')).toLowerCase();
  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  return 'desktop';
}

export function getStoreUrlForDevice(
  game: GameRecord,
  device: DetectedDevice
): { platform: 'android' | 'ios'; url: string } | null {
  if (device === 'android' && game.mobile.android.enabled && game.mobile.android.storeUrl) {
    return { platform: 'android', url: game.mobile.android.storeUrl };
  }
  if (device === 'ios' && game.mobile.ios.enabled && game.mobile.ios.storeUrl) {
    return { platform: 'ios', url: game.mobile.ios.storeUrl };
  }
  return null;
}

export function shouldShowInstallPrompt(
  game: GameRecord,
  device = detectDevicePlatform(),
  nowMs = Date.now()
): boolean {
  if (device === 'desktop') return false;
  if (!game.distribution.installPromptEnabled) return false;
  if (!getStoreUrlForDevice(game, device)) return false;

  const key = `${DISMISS_PREFIX}${game.id}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return true;
    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return true;
    const cooldownMs = (game.distribution.installPromptCooldownDays ?? 7) * 24 * 60 * 60 * 1000;
    return nowMs - dismissedAt >= cooldownMs;
  } catch {
    return true;
  }
}

export function dismissInstallPrompt(gameId: string, nowMs = Date.now()): void {
  try {
    localStorage.setItem(`${DISMISS_PREFIX}${gameId}`, String(nowMs));
  } catch {
    // ignore storage errors
  }
}
