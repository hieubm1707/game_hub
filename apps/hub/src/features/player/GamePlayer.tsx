import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isSafeHttpUrl, type BridgeMessage, type GameRecord } from '@game-hub/contract';
import { ArrowLeft, Maximize2, Minimize2, Pause, Play, RefreshCw, SlidersHorizontal, Volume2, VolumeX } from 'lucide-react';
import { getLocalizedGameText, useI18n } from '../../app/I18nContext';
import { getAllowedGameOrigins } from '../../firebase/client';
import { GameHubBridgeClient } from '../../services/bridgeClient';

const FULLSCREEN_CONTROLS_HIDE_MS = 3000;
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function resolvePlayerBackground(color?: string | null): string {
  const trimmed = color?.trim();
  if (trimmed && HEX_COLOR_PATTERN.test(trimmed)) {
    return trimmed;
  }
  return '#000000';
}

interface WebkitFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface WebkitFullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

export function GamePlayer({
  game,
  onExit,
}: {
  game: GameRecord;
  onExit: () => void;
}) {
  const { locale, t } = useI18n();
  const localizedTitle = getLocalizedGameText(game, locale).title;
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<GameHubBridgeClient | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const iframeLoadedRef = useRef(false);

  const [sessionId] = useState(() => `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleControlsHide = useCallback(() => {
    clearHideTimer();
    setControlsVisible(true);
    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
      hideTimerRef.current = null;
    }, FULLSCREEN_CONTROLS_HIDE_MS);
  }, [clearHideTimer]);

  const enterFullscreen = useCallback(() => {
    const el = containerRef.current as WebkitFullscreenElement | null;
    if (!el) return;
    if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      void Promise.resolve(el.webkitRequestFullscreen()).catch(() => {});
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    const doc = document as WebkitFullscreenDocument;
    if (doc.exitFullscreen) {
      void doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      void Promise.resolve(doc.webkitExitFullscreen()).catch(() => {});
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as WebkitFullscreenDocument;
      const activeEl = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      const nextFullscreen = activeEl !== null && activeEl === containerRef.current;
      setIsFullscreen(nextFullscreen);
      if (nextFullscreen) {
        scheduleControlsHide();
      } else {
        clearHideTimer();
        setControlsVisible(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      clearHideTimer();
    };
  }, [scheduleControlsHide, clearHideTimer]);

  const allowedOrigins = useMemo(() => getAllowedGameOrigins(), []);

  const validatedUrl = useMemo(() => {
    const raw = game.web.artifactUrl;
    if (!raw || !game.web.enabled) return null;
    if (!isSafeHttpUrl(raw, allowedOrigins)) return null;
    const url = new URL(raw);
    url.searchParams.set('sessionId', sessionId);
    if (typeof window !== 'undefined') {
      url.searchParams.set('hubOrigin', window.location.origin);
    }
    return url;
  }, [game.web.artifactUrl, game.web.enabled, allowedOrigins, sessionId]);

  const isInvalidUrl = !validatedUrl;

  useEffect(() => {
    iframeLoadedRef.current = false;
    if (!validatedUrl) {
      return;
    }

    setStatus('loading');
    setErrorMsg(null);

    const bridge = new GameHubBridgeClient({
      gameId: game.id,
      sessionId,
      targetOrigin: validatedUrl.origin,
      iframeWindow: () => iframeRef.current?.contentWindow ?? null,
      onEvent: (msg: BridgeMessage) => {
        if (msg.type === 'GAME_READY' || msg.type === 'GAME_STARTED') {
          setStatus('ready');
        } else if (msg.type === 'SCORE_UPDATED' && typeof msg.payload.score === 'number') {
          setLastScore(msg.payload.score);
        } else if (msg.type === 'REQUEST_EXIT') {
          onExit();
        } else if (msg.type === 'REQUEST_FULLSCREEN') {
          enterFullscreen();
        } else if (msg.type === 'GAME_ERROR') {
          setStatus('error');
          setErrorMsg(String(msg.payload.message ?? 'Game reported an error.'));
        }
      },
    });
    bridge.start();
    bridgeRef.current = bridge;

    return () => {
      bridge.dispose();
      bridgeRef.current = null;
    };
  }, [game.id, sessionId, validatedUrl, onExit, reloadNonce, enterFullscreen]);

  useEffect(() => {
    if (iframeLoadedRef.current && game.web.hubBridgeEnabled && validatedUrl) {
      bridgeRef.current?.sendCommand('HUB_INIT', {
        locale,
        embedded: true,
      });
    }
  }, [locale, game.web.hubBridgeEnabled, validatedUrl]);

  const handleIframeLoad = () => {
    // Support games both with and without bridge integration.
    iframeLoadedRef.current = true;
    setStatus('ready');
    if (game.web.hubBridgeEnabled) {
      bridgeRef.current?.sendCommand('HUB_INIT', {
        locale,
        embedded: true,
      });
    }
  };

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    bridgeRef.current?.sendCommand(next ? 'PAUSE_GAME' : 'RESUME_GAME');
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    bridgeRef.current?.sendCommand(next ? 'MUTE_AUDIO' : 'UNMUTE_AUDIO');
  };

  const handleExitClick = () => {
    if (isFullscreen) {
      exitFullscreen();
    }
    onExit();
  };

  const aspectRatioStyle = {
    aspectRatio: `${game.web.aspectRatio.width} / ${game.web.aspectRatio.height}`,
  };
  const playerBgColor = resolvePlayerBackground(game.web.backgroundColor);

  return (
    <div
      ref={containerRef}
      style={isFullscreen ? { backgroundColor: playerBgColor } : undefined}
      className={
        isFullscreen
          ? 'relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden'
          : 'flex flex-col gap-4'
      }
    >
      {/* Top-right action button to manually open the control bar when hidden in fullscreen */}
      {isFullscreen && !controlsVisible && (
        <button
          type="button"
          data-testid="fullscreen-controls-reveal"
          onClick={scheduleControlsHide}
          title={t('player.showControls')}
          aria-label={t('player.showControls')}
          className="arcade-btn arcade-btn-sm arcade-btn-black absolute right-3 top-3 z-20 p-2 opacity-80 hover:opacity-100"
        >
          <SlidersHorizontal className="h-4 w-4 stroke-[2.5]" />
        </button>
      )}

      {/* Control Bezel */}
      <div
        data-testid="game-control-bar"
        data-controls-visible={String(!isFullscreen || controlsVisible)}
        onMouseEnter={isFullscreen ? clearHideTimer : undefined}
        onMouseLeave={isFullscreen ? scheduleControlsHide : undefined}
        className={`brutal-panel flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 ${
          isFullscreen
            ? `absolute inset-x-3 top-3 z-30 transition-all duration-300 ${
                controlsVisible
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-[120%] opacity-0 pointer-events-none'
              }`
            : ''
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleExitClick}
            className="arcade-btn arcade-btn-sm arcade-btn-yellow shrink-0 px-2.5 sm:px-3 py-1.5 text-xs"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            {t('common.exit')}
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-sm sm:text-base font-bold leading-tight">{localizedTitle}</h1>
            <p className="truncate font-numeric text-[10px] sm:text-[11px] font-bold uppercase hub-text-muted">
              v{game.currentRelease} • {t('player.webPlayer')}
              {lastScore !== null ? ` • ${t('player.score')}: ${lastScore}` : ''}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {lastScore !== null && (
            <div className="hub-topbar px-3 py-1 text-xs font-bold uppercase rounded-[var(--radius-badge)]">
              {t('player.score').toUpperCase()}: {lastScore}
            </div>
          )}

          {game.web.hubBridgeEnabled && (
            <>
              <button
                type="button"
                onClick={togglePause}
                className={`arcade-btn arcade-btn-sm p-2 ${
                  paused ? 'arcade-btn-pink' : 'arcade-btn-white'
                }`}
                title={paused ? t('player.resume') : t('player.pause')}
              >
                {paused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 stroke-[2.5]" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className={`arcade-btn arcade-btn-sm p-2 ${
                  muted ? 'arcade-btn-pink' : 'arcade-btn-white'
                }`}
                title={muted ? t('player.unmute') : t('player.mute')}
              >
                {muted ? <VolumeX className="h-4 w-4 stroke-[2.5]" /> : <Volume2 className="h-4 w-4 stroke-[2.5]" />}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            className="arcade-btn arcade-btn-sm arcade-btn-cyan p-2"
            title={t('player.reload')}
          >
            <RefreshCw className="h-4 w-4 stroke-[2.5]" />
          </button>
          {game.web.fullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="arcade-btn arcade-btn-sm arcade-btn-black p-2"
              title={isFullscreen ? t('player.exitFullscreen') : t('player.fullscreen')}
              aria-label={isFullscreen ? t('player.exitFullscreen') : t('player.fullscreen')}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 stroke-[2.5]" />
              ) : (
                <Maximize2 className="h-4 w-4 stroke-[2.5]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Monitor Frame */}
      <div
        style={{ backgroundColor: playerBgColor }}
        className={
          isFullscreen
            ? 'relative flex h-full w-full items-center justify-center p-0'
            : 'brutal-panel-lg relative mx-auto flex w-full max-w-4xl items-center justify-center p-3'
        }
      >
        {isInvalidUrl || status === 'error' ? (
          <div className="brutal-panel flex flex-col items-center justify-center gap-4 p-8 m-4 text-center">
            <span className="hub-alert-error px-2.5 py-0.5 font-numeric text-xs font-bold uppercase">
              {t('player.systemError')}
            </span>
            <p className="font-numeric text-sm font-bold">
              {isInvalidUrl ? t('player.untrustedOrigin') : errorMsg}
            </p>
            <button
              type="button"
              onClick={() => setReloadNonce((n) => n + 1)}
              className="arcade-btn arcade-btn-pink px-5 py-2 text-xs"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : (
          <div
            style={{
              ...aspectRatioStyle,
              backgroundColor: playerBgColor,
              borderColor: isFullscreen ? 'transparent' : 'var(--monitor-border)',
            }}
            className={
              isFullscreen
                ? 'relative max-h-screen max-w-full h-full overflow-hidden'
                : 'relative max-h-[78vh] w-full overflow-hidden border-[3px] rounded-[var(--radius-input)]'
            }
          >
            {status === 'loading' && (
              <div
                style={{ backgroundColor: playerBgColor }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 text-center"
              >
                <p className="font-numeric text-sm font-bold uppercase tracking-wider text-white">
                  {t('player.loadingGame', { title: localizedTitle })}
                </p>
                <div className="arcade-progress-track w-56">
                  <div className="arcade-loading-bar h-full w-full" />
                </div>
              </div>
            )}
            {validatedUrl && (
              <iframe
                key={reloadNonce}
                ref={iframeRef}
                src={validatedUrl.toString()}
                title={localizedTitle}
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={() => {
                  setStatus('error');
                  setErrorMsg(t('player.iframeFailed'));
                }}
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                allow="fullscreen"
                className="h-full w-full border-0"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
