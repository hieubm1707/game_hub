import {
  validateBridgeMessage,
  type BridgeMessage,
  type HubToGameCommandType,
} from '@game-hub/contract';

export interface BridgeClientOptions {
  gameId: string;
  sessionId: string;
  targetOrigin: string;
  iframeWindow: () => Window | null;
  onEvent: (msg: BridgeMessage) => void;
}

export class GameHubBridgeClient {
  private readonly opts: BridgeClientOptions;
  private readonly seenMessageIds = new Set<string>();
  private seq = 0;
  private listener: ((event: MessageEvent) => void) | null = null;

  constructor(opts: BridgeClientOptions) {
    this.opts = opts;
  }

  start() {
    this.listener = (event: MessageEvent) => {
      if (event.origin !== this.opts.targetOrigin) return;
      const win = this.opts.iframeWindow();
      if (win && event.source !== win) return;

      const parsed = validateBridgeMessage(event.data);
      if (!parsed.valid || !parsed.data) return;

      const msg = parsed.data;
      if (msg.gameId !== this.opts.gameId) return;
      if (msg.sessionId !== this.opts.sessionId && msg.sessionId !== 'standalone') return;
      if (this.seenMessageIds.has(msg.messageId)) return;

      this.seenMessageIds.add(msg.messageId);
      if (this.seenMessageIds.size > 500) {
        const oldest = this.seenMessageIds.values().next().value;
        if (oldest) this.seenMessageIds.delete(oldest);
      }

      // Bridge events NEVER trigger Firestore writes.
      this.opts.onEvent(msg);
    };
    window.addEventListener('message', this.listener);
  }

  sendCommand(type: HubToGameCommandType, payload: Record<string, unknown> = {}) {
    const win = this.opts.iframeWindow();
    if (!win) return;
    this.seq += 1;
    const msg: BridgeMessage = {
      protocol: 'game-hub',
      protocolVersion: '1.0.0',
      type,
      gameId: this.opts.gameId,
      sessionId: this.opts.sessionId,
      messageId: `hub-${this.opts.sessionId}-${this.seq}`,
      timestamp: Date.now(),
      payload,
    };
    win.postMessage(msg, this.opts.targetOrigin);
  }

  dispose() {
    if (this.listener) {
      window.removeEventListener('message', this.listener);
      this.listener = null;
    }
    this.seenMessageIds.clear();
  }
}
