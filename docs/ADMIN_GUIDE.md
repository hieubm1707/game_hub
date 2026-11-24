# Administrator Guide

All routine catalog management is performed in the Hub Admin Dashboard at `/admin` (no Firebase Console required).

## Workflows

1. **Login**: Navigate to `/admin/login` and sign in with your provisioned administrator Email & Password.
2. **Import Manifest / Add Game**: Open `/admin/games/new`. Upload a validated `manifest.json` (parsed locally in the browser) or enter metadata manually. Review fields and click **Create Game**.
3. **Edit Game**: Open `/admin/games` -> **Edit**. When re-importing a newer build manifest, choose **Update build metadata only** to preserve administrator-edited descriptions and categories.
4. **Publish / Unpublish**: Use the **Publish** / **Unpublish** actions in `/admin/games`. Changes atomically update `games/{id}`, `public_games/{slug}`, and `public_catalog/current`. Public clients see updates on their next cache refresh (or click **Refresh Catalog**).
5. **Archive / Restore / Delete**: Use **Archive** for safe soft-removal from public discovery while preserving release history. Owners may permanently **Delete** a record (note: previously deployed static artifacts on Cloudflare Pages must be removed separately if desired).
6. **Release Management & Rollback**: Open `/admin/games/:id/releases` to register a deployed static build URL + version, activate it, or roll back to any previous release.
7. **Export Catalog**: Click **Export Catalog JSON** on `/admin` for browser-side backups (never includes credentials).
