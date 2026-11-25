import type { GameRecord } from '@game-hub/contract';
import { Smartphone, Globe, X } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
    >
      <div className="relative w-full max-w-md brutal-panel-lg overflow-hidden">
        <div className="hub-topbar flex items-center justify-between px-5 py-3">
          <span className="text-xs font-bold uppercase tracking-wider">
            // NATIVE APP AVAILABLE
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="arcade-btn arcade-btn-sm arcade-btn-yellow p-1"
          >
            <X className="h-4 w-4 stroke-[3]" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3.5">
            <img
              src={game.icon}
              alt={game.title}
              className="h-14 w-14 border-[length:var(--border-w)] hub-divider rounded-[var(--radius-input)] bg-white object-cover brutal-shadow-sm"
            />
            <div>
              <h2 id="install-prompt-title" className="text-xl font-bold">
                Play on the app
              </h2>
              <p className="font-numeric text-xs font-bold uppercase hub-text-muted">{game.title}</p>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium leading-relaxed">
            Enjoy offline gameplay and the native mobile app experience.
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
                Get on Google Play
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
                Get on App Store
              </a>
            )}
            <button
              type="button"
              onClick={handleContinueWeb}
              className="arcade-btn arcade-btn-yellow w-full px-4 py-3 text-xs"
            >
              <Globe className="h-4 w-4 stroke-[2.5]" />
              Continue Playing on Web
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
