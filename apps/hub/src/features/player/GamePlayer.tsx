import { useEffect, useMemo, useRef, useState } from 'react';
import { isSafeHttpUrl, type BridgeMessage, type GameRecord } from '@game-hub/contract';
import { ArrowLeft, Maximize2, Pause, Play, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { getAllowedGameOrigins } from '../../firebase/client';
import { GameHubBridgeClient } from '../../services/bridgeClient';

export function GamePlayer({
  game,
  onExit,
}: {
  game: GameRecord;
  onExit: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<GameHubBridgeClient | null>(null);

  const [sessionId] = useState(() => `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);

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

  useEffect(() => {
    if (!validatedUrl) {
      setStatus('error');
      setErrorMsg('This game artifact URL is missing or not from a trusted origin.');
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
          void containerRef.current?.requestFullscreen?.().catch(() => {});
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
  }, [game.id, sessionId, validatedUrl, onExit, reloadNonce]);

  const handleIframeLoad = () => {
    // Support games both with and without bridge integration.
    setStatus('ready');
    if (game.web.hubBridgeEnabled) {
      bridgeRef.current?.sendCommand('HUB_INIT', {
        locale: 'en',
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

  const requestFullscreen = () => {
    void containerRef.current?.requestFullscreen?.().catch(() => {});
  };

  const aspectRatioStyle = {
    aspectRatio: `${game.web.aspectRatio.width} / ${game.web.aspectRatio.height}`,
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white">{game.title}</h1>
            <p className="text-xs text-slate-400">
              v{game.currentRelease} • Ad-free Web Player
              {lastScore !== null ? ` • Score: ${lastScore}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {game.web.hubBridgeEnabled && (
            <>
              <button
                type="button"
                onClick={togglePause}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                title={paused ? 'Resume' : 'Pause'}
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Reload game"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {game.web.fullscreen && (
            <button
              type="button"
              onClick={requestFullscreen}
              className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl items-center justify-center rounded-2xl border border-slate-800 bg-black p-2">
        {status === 'error' ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <p className="text-sm font-medium text-rose-400">{errorMsg}</p>
            <button
              type="button"
              onClick={() => setReloadNonce((n) => n + 1)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Retry
            </button>
          </div>
        ) : (
          <div
            style={aspectRatioStyle}
            className="relative max-h-[78vh] w-full overflow-hidden rounded-xl bg-slate-950"
          >
            {status === 'loading' && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/90 text-sm text-slate-300">
                Loading {game.title}...
              </div>
            )}
            {validatedUrl && (
              <iframe
                key={reloadNonce}
                ref={iframeRef}
                src={validatedUrl.toString()}
                title={game.title}
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={() => {
                  setStatus('error');
                  setErrorMsg('Failed to load game iframe.');
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
