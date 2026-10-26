# Baqio API documentation

Source of [api-doc.baqio.com](https://api-doc.baqio.com): the public API reference for Baqio, deployed on GitHub Pages.

## Structure

- `Baqio-Public-API.v1.json`: OpenAPI 3 specification (single source of truth for the reference).
- `docs/*.md`: guides, each rendered to `/guides/<name>/` (e.g. `docs/Webhooks.md` → `/guides/webhooks/`).
- `site/`: landing page, reference page (Scalar), Baqio theme and assets.
- `scripts/build.mjs`: builds everything into `dist/`.

## Local preview

```bash
npm install
npm run build
npm run serve
```

## Deployment

Every push to `master` touching the spec, guides or site rebuilds and deploys through
`.github/workflows/api-docs-pages.yml`. Pull requests only run the build.
