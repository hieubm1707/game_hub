import type { GameRecord } from '@game-hub/contract';

export interface ConfiguredStoreUrls {
  android: string | null;
  ios: string | null;
}

const DISMISS_PREFIX = 'game_hub:install_prompt_dismissed:';

export function getConfiguredStoreUrls(game: GameRecord): ConfiguredStoreUrls {
  const android = game.mobile.android.storeUrl?.trim() || null;
  const ios = game.mobile.ios.storeUrl?.trim() || null;
  return { android, ios };
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
