import type { GameRecord } from '@game-hub/contract';
import { Smartphone, Globe, X } from 'lucide-react';
import {
  dismissInstallPrompt,
  getStoreUrlForDevice,
  type DetectedDevice,
} from '../../services/installPromptPolicy';

export function InstallPromptModal({
  game,
  device,
  onContinueWeb,
  onClose,
}: {
  game: GameRecord;
  device: DetectedDevice;
  onContinueWeb: () => void;
  onClose: () => void;
}) {
  const store = getStoreUrlForDevice(game, device);
  if (!store) return null;

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
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <img src={game.icon} alt={game.title} className="h-12 w-12 rounded-xl" />
          <div>
            <h2 id="install-prompt-title" className="text-lg font-bold text-white">
              Play on the app
            </h2>
            <p className="text-xs text-slate-400">{game.title}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-300">
          Enjoy offline gameplay and the native {store.platform === 'android' ? 'Android' : 'iOS'} experience.
          {game.features.nativeAds
            ? ' Note: the native mobile app may display advertisements, whereas Web gameplay is ad-free.'
            : ''}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <Smartphone className="h-4 w-4" />
            Get the App ({store.platform === 'android' ? 'Google Play' : 'App Store'})
          </a>
          <button
            type="button"
            onClick={handleContinueWeb}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            <Globe className="h-4 w-4" />
            Continue Playing on Web
          </button>
        </div>
      </div>
    </div>
  );
}
