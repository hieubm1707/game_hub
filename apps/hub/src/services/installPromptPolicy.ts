import { isSafeHttpUrl, type GameRecord } from '@game-hub/contract';

export interface ConfiguredStoreUrls {
  android: string | null;
  ios: string | null;
}

const DISMISS_PREFIX = 'game_hub:install_prompt_dismissed:';

function toSafeStoreUrl(url?: string | null): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  return isSafeHttpUrl(trimmed) ? trimmed : null;
}

export function getConfiguredStoreUrls(game: GameRecord): ConfiguredStoreUrls {
  return {
    android: toSafeStoreUrl(game.mobile.android.storeUrl),
    ios: toSafeStoreUrl(game.mobile.ios.storeUrl),
  };
}

export function hasConfiguredStoreUrls(game: GameRecord): boolean {
  const { android, ios } = getConfiguredStoreUrls(game);
  return Boolean(android || ios);
}

export function shouldShowInstallPrompt(
  game: GameRecord,
  nowMs = Date.now()
): boolean {
  if (!game.distribution.installPromptEnabled) return false;
  if (!hasConfiguredStoreUrls(game)) return false;

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
