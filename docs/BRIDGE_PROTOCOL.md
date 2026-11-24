# Game Hub Bridge Protocol v1.0.0

Communication between the Game Hub (`apps/hub`) and embedded Flutter Web games uses a strict, versioned `window.postMessage` envelope validated against `packages/game_contract/schemas/bridge-message.schema.json`.

## Envelope

```json
{
  "protocol": "game-hub",
  "protocolVersion": "1.0.0",
  "type": "GAME_READY",
  "gameId": "iq-puzzle-fixture",
  "sessionId": "sess-1234",
  "messageId": "iq-puzzle-fixture-1-1700000000000",
  "timestamp": 1700000000000,
  "payload": {}
}
```

## Events & Commands

- **Game -> Hub**: `GAME_READY`, `GAME_STARTED`, `GAME_PAUSED`, `GAME_RESUMED`, `GAME_COMPLETED`, `LEVEL_COMPLETED`, `SCORE_UPDATED`, `GAME_ERROR`, `REQUEST_FULLSCREEN`, `REQUEST_EXIT`.
- **Hub -> Game**: `HUB_INIT`, `PAUSE_GAME`, `RESUME_GAME`, `MUTE_AUDIO`, `UNMUTE_AUDIO`, `REQUEST_STATE`.

## Security & Cost Guarantees

- Explicit `targetOrigin` on every `postMessage` (never `'*'`).
- Strict `event.origin`, `event.source`, `gameId`, and `sessionId` verification.
- Message deduplication by `messageId`.
- Bridge events **never** trigger Firestore writes.
- Games remain fully playable in standalone mode when not embedded in the Hub.
