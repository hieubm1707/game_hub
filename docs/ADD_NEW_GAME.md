# Adding a New Flutter Game

Adding a compatible Flutter game requires **zero Game Hub code edits and zero Hub redeployments**.

## Step-by-Step Workflow

1. Add the local game repository path to `config/repositories.local.yaml` (gitignored).
2. Inspect compatibility:
   ```bash
   pnpm game inspect --path "/path/to/new-game"
   ```
3. Initialize `assets/manifest.json` (one-time per game):
   ```bash
   pnpm game init --path "/path/to/new-game"
   ```
4. Integrate `packages/game_platform` in the Flutter repo (one-time for previously unintegrated games): isolate AdMob behind `GameAds`, bundle offline fallback content at `assets/content/default.json`, and call `GamePlatform.initialize(...)`.
5. Verify readiness:
   ```bash
   pnpm game doctor --id new-game
   ```
6. Build & prepare versioned static release:
   ```bash
   pnpm game build --id new-game
   pnpm game prepare-release --id new-game
   pnpm game export-manifest --id new-game
   ```
7. Deploy `dist-releases/new-game/` to Cloudflare Pages Free (or serve locally with `pnpm game serve`).
8. Open `/admin/games/new` in the Game Hub, import `registry/manifests/new-game.manifest.json`, set `web.artifactUrl` to the deployed URL, save, and click **Publish**.
