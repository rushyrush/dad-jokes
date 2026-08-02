# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## What this is

A lightweight, static single-page app that serves random dad jokes. There is **no
application server and no build step beyond a container image** — everything the site
shows is plain HTML/CSS/JS plus a JSON joke corpus that nginx serves directly from
disk.

- **Live site:** https://dadjokes.rushdynamics.com/
- **Docker image:** `rushyrush/dad-jokes` (multi-arch: linux/amd64, linux/arm64)
- **Image registry repo:** `rushyrush/dad-jokes` on Docker Hub

## Repository layout

| Path | Purpose |
|------|---------|
| `assets/index.html` | Page markup (cards, orbs, buttons). |
| `assets/style.css` | All styling (glassmorphism, animated gradient, roaming orbs). |
| `assets/script.js` | App logic: fetch `db.json`, Fisher-Yates deck shuffle, no-repeat joke deck, card flip, copy-to-clipboard, orb wander engine. |
| `assets/db.json` | **The joke corpus.** Array of `{ "text": "..." }` objects. This is the file contributors edit most. |
| `assets/fonts/` | Self-hosted Inter woff2 (kept local on purpose — avoids Safari ITP privacy banner). |
| `assets/{favicon*,site.webmanifest}` | Icons + PWA manifest. |
| `Dockerfile` | Two-stage build: copies `assets/`, computes a content hash, and injects `?v=$SHA` cache-busting query params into `index.html`, then bakes into `nginx:alpine`. |
| `nginx.conf` | Minimal nginx server config (serves the static dir on port 80). |
| `.github/workflows/docker_build.yaml` | CI that builds & pushes the Docker image and bumps a semver git tag. |
| `.github/workflows/ci.yaml` | **Validation gate** (see below): runs on every PR and push to `master`. |

## The joke corpus (`assets/db.json`)

- Format: a JSON **array of objects**, each `{ "text": "<the joke>" }`.
- Keep jokes **short, family-friendly, and original** (clean "dad" humor).
- **No duplicate jokes** — CI fails if a duplicate is introduced.
- Top-level element with `:root`/`_meta` keys is **not allowed** — the file must be
  a plain array and is consumed by `script.js` as `data` directly.

## How to add a joke

1. Open `assets/db.json`.
2. Add a new `{ "text": "Your joke here." }` object (append near the others).
3. Keep the JSON valid and the typed-output identical in structure to existing entries.
4. Open a pull request (see below).

## Branching & PR workflow (IMPORTANT)

This repository does **not** accept direct pushes to `master`. All changes land via
**pull request from a fork**:

1. Fork `rushyrush/dad-jokes` under your own account (or a bot account).
2. Create a feature branch and commit your changes.
3. Push the branch to your fork.
4. Open the PR `your-fork:branch` → `rushyrush/dad-jokes:master`.

CI (`ci.yaml`) runs on every PR and must pass before merge. The Docker build + version
bump happen automatically on merge/push to `master` via `docker_build.yaml`.

## Build & local preview

```bash
# Serve assets/ locally with any static server to preview the frontend
python3 -m http.server 8080 --directory assets

# Or build/run the actual image
docker build -t dad-jokes .
docker run --rm -p 8080:80 dad-jokes
```

Cache-busting is injected at Docker build time, so a local `python -m http.server`
preview won't include the `?v=` query params — that's expected and harmless.

## Important constraints

- **Do not add external font/CDN assets.** Fonts are self-hosted deliberately.
- **Do not break the no-repeat joke deck** in `script.js` — it intentionally never
  repeats a joke within a full pass of the shuffled deck.
- **The Docker build is the only "bundler."** Avoid build tools/npm; keep it static.
