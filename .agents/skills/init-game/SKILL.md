---
name: init-game
description: >-
  Onboard and prepare an external Flutter game repository so it can build for
  Flutter Web and be registered in Game Hub with a valid v2.0.0 manifest. Use
  this skill when the user invokes `/init-game`, `/initGame`, or asks to set up,
  initialize, or port a Flutter game repo (e.g. `--repo path/to/game_repo`) for
  Game Hub.
---

# Initialize a Flutter Game Repository for Game Hub

Use this runbook to prepare a Flutter game repository so it builds cleanly for
Flutter Web, complies with all Game Hub engineering constraints, and exports
everything needed to add it to Game Hub.

## Inputs

Parse the user's request for:

- `--repo <path>` (or a plain path): Path to the target Flutter game repository
  (relative to the `game_hub` workspace or absolute).
- `--id <game-id>` (optional): Existing ID in `config/repositories.local.yaml`
  if `--repo` is not provided.
- `--skip-build` (optional): Stop after `validate` / `doctor` without running
  `build` or `prepare-release`.

If neither `--repo` nor `--id` is provided, ask the user for the game repository
path before making any edits.

## Non-Negotiable Constraints

Before editing anything, enforce these rules from `AGENTS.md`:

1. **100% Ad-Free Web**: `features.webAds` MUST be `false`. Never import
   `google_mobile_ads` or any native ad SDK into Web compilation paths; always
   isolate behind `GameAds` (`WebAdsUnavailableAdapter` on Web) using
   conditional imports.
2. **Offline-First**: The game MUST launch offline using bundled content
   (`assets/content/default.json`). Never block startup on Firebase, and normal
   public gameplay MUST produce zero Firestore writes.
3. **No Game-Specific Hub Code**: Never modify `apps/hub` to hardcode a game.
   All metadata flows from validated `assets/manifest.json` v2.0.0.
4. **No Machine-Specific Absolute Paths or Secrets**: Use relative paths in
   `pubspec.yaml`, `config/repositories.local.yaml` (gitignored), and
   `manifest.json`. Never commit secrets or local absolute paths into public
   manifest fields.

## Procedure

### 1. Resolve Repo, Create `features/web` Branch & Run Initial Inspection

1. Resolve the target repository path (and ensure `packages/game_cli` is built
   with `pnpm build:cli` if `packages/game_cli/dist/cli.js` is missing).
2. Inside `<repo-path>`, create (or switch to) the `features/web` branch from
   the repo's default branch (`main` or `master`) before editing code:
   ```bash
   git checkout -b features/web
   ```
3. Run:
   ```bash
   pnpm game inspect --path <repo-path>
   ```
4. Review the JSON report: `usesFvm`, `fvmFlutterVersion`, `flutterCommand`,
   `hasWebDir`, `hasManifest`, `hasGamePlatformDep`, `usesAdMob`,
   `usesFirebase`, `dartIoFiles`, `bundledContentExists`, and `warnings`.
5. Also inspect `<repo-path>/pubspec.yaml` and scan `<repo-path>/lib/` for
   Web-incompatible packages:
   - `google_mobile_ads`
   - `dart:io`
   - `sqflite` / `path_provider` / native-only FFI plugins

### 2. Align Flutter (FVM) and Dart SDK Versions

1. Use the `flutterCommand` reported by `inspect` (`fvm flutter` when `.fvmrc`
   or `.fvm/` exists, otherwise `flutter`).
2. Verify `<flutterCommand> --version` inside `<repo-path>` and compare with:
   - `<repo-path>/pubspec.yaml` (`environment.sdk`)
   - `packages/game_platform/pubspec.yaml` (`environment.sdk` and
     `environment.flutter`)
3. If there is a mismatch (for example `.fvmrc` pins an older Flutter than
   `pubspec.yaml` or `game_platform` requires):
   - Check installed FVM versions with `fvm list`.
   - Recommend and—with user confirmation if changing SDK/FVM versions—update
     `.fvmrc` and/or `environment.sdk` so `<flutterCommand> pub get` succeeds.

### 3. Ensure Flutter Web Target Exists

If `hasWebDir` is `false`, run inside `<repo-path>`:

```bash
<flutterCommand> create --platforms=web .
```

### 4. Initialize Manifest v2.0.0 & Offline Content Fallback

1. If `hasManifest` is `false`, run:
   ```bash
   pnpm game init --path <repo-path>
   ```
2. Update `<repo-path>/assets/manifest.json` using real metadata from the
   game's `pubspec.yaml`, `README.md`, and Android/iOS configs (reference
   `fixtures/games/iq_puzzle_fixture/assets/manifest.json`):
   - `schemaVersion`: `"2.0.0"`
   - `id` and `slug`: lowercase kebab-case identifier
   - `metadata`: accurate `title`, `shortDescription`, `description`,
     `howToPlay`, `categories`, `tags`, `developer`, `supportedLocales`
   - `assets`: valid relative or public URL paths for `icon`, `thumbnail`,
     `screenshots`
   - `web`: `enabled: true`, `buildVersion`, `entrypoint: "index.html"`,
     `orientation`, `aspectRatio`, `backgroundColor` (extract the game's main
     background hex color `#RRGGBB` from Flutter theme/UI such as
     `scaffoldBackgroundColor`, root `Scaffold`/`Container` background,
     `web/manifest.json` `background_color`, or `web/index.html` so Game Hub's
     fullscreen backdrop matches the game seamlessly), `supportsTouch`,
     `supportsKeyboard`, `hubBridgeEnabled: true`
   - `mobile`: populate `android.packageId` / `ios.bundleId` if present
   - `content`: `bundledContentAsset: "assets/content/default.json"`,
     `offlineFirst: true`
   - `features`: `webAds: false` (mandatory), `nativeAds` matching actual
     native ad usage, `localStorage: true`, `hubBridge: true`
3. If `bundledContentExists` is `false`, create
   `<repo-path>/assets/content/default.json` with a valid bundled default
   content pack (or wire the game's existing bundled puzzle/level data into it)
   so the game launches offline out of the box.

### 5. Wire `game_platform` and Assets in `pubspec.yaml`

1. Add `game_platform` to `<repo-path>/pubspec.yaml` using a **relative** path
   to `game_hub/packages/game_platform`:
   ```yaml
   dependencies:
     game_platform:
       path: ../../game_hub/packages/game_platform
   ```
   (Compute the exact relative path from `<repo-path>` to
   `<workspace-root>/packages/game_platform`.)
2. Ensure `flutter.assets` in `<repo-path>/pubspec.yaml` includes **all**
   required manifest, offline content, and **public icon/thumbnail assets** so
   Flutter Web bundles them into `build/web/assets/assets/...`:
   ```yaml
   flutter:
     assets:
       - assets/manifest.json
       - assets/content/default.json
       - assets/<path-to-icon>
       - assets/<path-to-thumbnail>
   ```
   - Verify the icon and thumbnail files actually exist under `<repo-path>/assets/`.
     If the repo does not yet have public icon/thumbnail images under `assets/`,
     copy or convert them from the game's existing branding/launcher icon (e.g.
     `ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png`)
     into `assets/` and declare them in `pubspec.yaml` so they are publicly
     served after Web build.
3. Run `<flutterCommand> pub get` in `<repo-path>` to verify dependency
   resolution.

### 6. Make Native-Only Features Web-Safe

Do not break Android/iOS behavior; isolate native-only code cleanly:

1. **AdMob (`google_mobile_ads`)**:
   - Never import `package:google_mobile_ads/google_mobile_ads.dart` in files
     compiled on Web.
   - Use conditional imports (`if (dart.library.html)` / `if (dart.library.js_interop)`)
     or delegate through `game_platform`'s `GameAds` (`WebAdsUnavailableAdapter`
     on Web, `NativeAdsAdapter` on Android/iOS).
   - Ensure Web UI hides ad banners and ad-reward buttons gracefully.
2. **Local Storage (`sqflite`, `path_provider`, `dart:io`)**:
   - Guard or split storage implementations with conditional imports so Web
     does not call native SQLite channels or `dart:io`.
   - Provide a Web storage adapter (e.g., backed by `game_platform`'s
     `PlatformStorage` / `GameStorage` or `localStorage`).
3. **Hub Bridge (recommended)**:
   - Wire `GameHubBridge` from `game_platform` to emit ready/lifecycle events
     when hosted inside Game Hub's iframe.
4. **Mobile-Viewport Frame on Web (`WebMobileFrame`)**:
   - On Flutter Web, portrait/mobile-first games MUST always render their mobile
     UI layout (max width `430.0`, centered horizontally) with the extra
     horizontal letterbox area on both sides filled with the game's main
     background color (matching `web.backgroundColor` in `manifest.json` /
     `scaffoldBackgroundColor`), while staying a no-op pass-through on native
     Android/iOS.
   - Add a `WebMobileFrame` widget (following the `blindspot` reference pattern)
     and wrap the app's `MaterialApp` / `MaterialApp.router` `builder` output
     with it:
     ```dart
     class WebMobileFrame extends StatelessWidget {
       static const double maxMobileWidth = 430.0;

       final Widget child;
       final bool enabled;
       final Color backgroundColor;

       const WebMobileFrame({
         super.key,
         required this.child,
         this.enabled = kIsWeb,
         required this.backgroundColor,
       });

       @override
       Widget build(BuildContext context) {
         if (!enabled) return child;

         return ColoredBox(
           color: backgroundColor,
           child: LayoutBuilder(
             builder: (context, constraints) {
               final frameWidth = constraints.maxWidth > maxMobileWidth
                   ? maxMobileWidth
                   : constraints.maxWidth;
               final frameHeight = constraints.maxHeight;
               final media = MediaQuery.of(context);

               return Center(
                 child: ClipRect(
                   child: SizedBox(
                     width: frameWidth,
                     height: frameHeight,
                     child: MediaQuery(
                       data: media.copyWith(size: Size(frameWidth, frameHeight)),
                       child: child,
                     ),
                   ),
                 ),
               );
             },
           ),
         );
       }
     }
     ```
   - Override `MediaQuery` `size` to `Size(frameWidth, frameHeight)` inside the
     frame so all screens, dialogs, and responsive breakpoints see mobile
     dimensions on desktop browsers.
   - Add a widget test verifying that on Web (`enabled: true`) a wide viewport
     (e.g. `1280x800`) constrains the child to `<= 430.0` width and fills the
     outer `ColoredBox` with the game's background color, while `enabled: false`
     renders the child unchanged.

### 7. Register Locally in `config/repositories.local.yaml`

If the game is not already listed in `config/repositories.local.yaml`
(gitignored), add an entry using a relative path from `game_hub`:

```yaml
  - id: <game-id>
    path: "<relative-path-to-repo>"
    type: game
    notes: "Flutter Web + offline-first game"
```

### 8. Validate, Test, Build, and Export Release

Run the verification pipeline from the `game_hub` root:

```bash
pnpm game doctor --id <game-id>
pnpm game validate --id <game-id>
```

Run tests in the game repo:

```bash
(cd <repo-path> && <flutterCommand> test)
```

Unless `--skip-build` was specified, build the Web release and export artifacts
for Game Hub:

```bash
pnpm game build --id <game-id> --base-href /
pnpm game prepare-release --id <game-id>
pnpm game export-manifest --id <game-id>
```

Confirm the outputs exist:
- `<repo-path>/build/web/index.html` and `<repo-path>/build/web/assets/assets/...` (including icon & thumbnail)
- `dist-releases/<game-id>/releases/<buildVersion>/index.html`
- `registry/manifests/<game-id>.manifest.json`
- `registry/exports/<game-id>-<buildVersion>.release.json`

### 9. Deploy to Vercel (`vercel --prod`) & Update Public URLs in `manifest.json`

Unless `--skip-build` was specified:

1. **`cd` directly into the game repo's `build/web` directory** before running
   Vercel CLI (so Vercel uses the game repo context instead of `game_hub`):
   ```bash
   cd <repo-path>/build/web
   vercel --prod
   ```
2. On first-time setup when prompted by Vercel CLI:
   - Enter the project **Name** (e.g. `<game-id>`).
   - **Connect Git** when asked (connect to the game's own repository).
   - **Customize settings?** -> Choose **`no`** (static pre-built output).
3. Copy the public production URL returned by Vercel (e.g.
   `https://<game-name>.vercel.app`) and update `<repo-path>/assets/manifest.json`
   using Flutter Web's **`/assets/assets/...`** path format for bundled assets:
   ```json
   "assets": {
     "icon": "https://<game-name>.vercel.app/assets/assets/<path-to-icon>",
     "thumbnail": "https://<game-name>.vercel.app/assets/assets/<path-to-thumbnail>",
     "screenshots": []
   },
   "web": {
     "artifactUrl": "https://<game-name>.vercel.app/index.html"
   },
   "content": {
     "bundledContentAsset": "https://<game-name>.vercel.app/assets/assets/content/default.json"
   }
   ```
4. Re-validate and re-export the manifest to Game Hub:
   ```bash
   pnpm game validate --id <game-id>
   pnpm game export-manifest --id <game-id>
   ```
5. Verify that `https://<game-name>.vercel.app/index.html`, `assets.icon`, and
   `assets.thumbnail` all return **HTTP 200**.

### 10. Commit on `features/web` and Merge Back into `main`

After all code changes, public assets, tests, `manifest.json` URL updates, and
Vercel deployment checks are complete:

1. Inside `<repo-path>`, commit all changes cleanly by scope on `features/web`
   (never commit `build/`, `.vercel/`, or `.dart_tool/`) and push:
   ```bash
   git push -u origin features/web
   ```
2. Switch back to the repository's default branch (`main`, or `master` if the
   repo uses `master`), merge `features/web`, and push:
   ```bash
   git checkout main
   git merge --no-edit features/web
   git push origin main
   ```

## Final Report

Summarize for the user:
1. Changes made in the game repository (FVM/SDK, `manifest.json`, `default.json`,
   `pubspec.yaml` including public icon/thumbnail assets, Web-safe ad/storage
   isolation, `WebMobileFrame` mobile viewport wrapper on Web).
2. Results of `doctor`, `validate`, `<flutterCommand> test`, `build`,
   `prepare-release`, and `export-manifest`.
3. Vercel production URL (`https://<game-name>.vercel.app/index.html`), HTTP 200
   verification of `/assets/assets/...` public icon/thumbnail URLs, and Git
   branch merge status (`features/web` -> `main`/`master`).
4. How to preview or register the game in Game Hub:
   - Import `registry/manifests/<game-id>.manifest.json` in Hub Admin (`/admin/games/new`) and publish.
5. Any remaining manual items (e.g., store links or screenshots).
