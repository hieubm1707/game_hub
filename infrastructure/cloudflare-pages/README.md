# Cloudflare Pages Static Hosting Configuration

The Game Hub and all Flutter Web game builds deploy as pure static sites on **Cloudflare Pages Free** (zero Workers, zero Pages Functions, zero R2).

## Hub Project (`game-hub`)

- **Build command**: `pnpm build:hub`
- **Build output directory**: `apps/hub/dist`
- **SPA fallback**: `apps/hub/public/_redirects` (`/* /index.html 200`)
- **Security headers**: `apps/hub/public/_headers` (CSP, `frame-src`, `frame-ancestors 'none'`, `X-Robots-Tag: noindex` on `/admin/*`)

## Game Artifact Projects

Each Flutter Web game deploys independently from `dist-releases/<game-id>/` with immutable versioned paths:

```text
https://<game-id>.pages.dev/releases/1.0.0/index.html
https://<game-id>.pages.dev/releases/1.1.0/index.html
```

Include a `_headers` file on each game artifact project permitting framing ONLY from the Hub origin:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: frame-ancestors https://game-hub.pages.dev http://localhost:5173 http://127.0.0.1:5173;
```
