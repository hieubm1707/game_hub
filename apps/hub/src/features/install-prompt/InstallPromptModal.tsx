import type { GameRecord } from '@game-hub/contract';
import { Smartphone, Globe, X } from 'lucide-react';
import { getLocalizedGameText, useI18n } from '../../app/I18nContext';
import {
  dismissInstallPrompt,
  getConfiguredStoreUrls,
} from '../../services/installPromptPolicy';

export function InstallPromptModal({
  game,
  onContinueWeb,
  onClose,
}: {
  game: GameRecord;
  onContinueWeb: () => void;
  onClose: () => void;
}) {
  const { locale, t } = useI18n();
  const localized = getLocalizedGameText(game, locale);
  const { android, ios } = getConfiguredStoreUrls(game);
  if (!android && !ios) return null;

  const handleContinueWeb = () => {
    dismissInstallPrompt(game.id);
    onContinueWeb();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-prompt-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4"
    >
      <div className="relative w-full max-w-md brutal-panel-lg overflow-hidden">
        <div className="hub-topbar flex items-center justify-between px-4 sm:px-5 py-3">
          <span className="text-xs font-bold uppercase tracking-wider">
            {t('install.topbar')}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="arcade-btn arcade-btn-sm arcade-btn-yellow p-1"
          >
            <X className="h-4 w-4 stroke-[3]" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3.5">
            <img
              src={game.icon}
              alt={localized.title}
              className="h-14 w-14 shrink-0 border-[length:var(--border-w)] hub-divider rounded-[var(--radius-input)] bg-white object-cover brutal-shadow-sm"
            />
            <div className="min-w-0">
              <h2 id="install-prompt-title" className="text-lg sm:text-xl font-bold break-words">
                {t('install.title')}
              </h2>
              <p className="font-numeric text-xs font-bold uppercase hub-text-muted truncate">
                {localized.title}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium leading-relaxed">
            {t('install.desc')}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {android && (
              <a
                href={android}
                target="_blank"
                rel="noopener noreferrer"
                className="arcade-btn arcade-btn-lime w-full px-4 py-3 text-xs"
              >
                <Smartphone className="h-4 w-4 stroke-[2.5]" />
                {t('detail.getGooglePlay')}
              </a>
            )}
            {ios && (
              <a
                href={ios}
                target="_blank"
                rel="noopener noreferrer"
                className="arcade-btn arcade-btn-cyan w-full px-4 py-3 text-xs"
              >
                <Smartphone className="h-4 w-4 stroke-[2.5]" />
                {t('detail.getAppStore')}
              </a>
            )}
            <button
              type="button"
              onClick={handleContinueWeb}
              className="arcade-btn arcade-btn-yellow w-full px-4 py-3 text-xs"
            >
              <Globe className="h-4 w-4 stroke-[2.5]" />
              {t('install.continueWeb')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
