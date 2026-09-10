# Android shell (Capacitor)

Wraps the SvelteKit SPA build as an installable Android app.

## Why this is a real bundle, not a webview pointed at production

`webDir` in `capacitor.config.json` points at `../web/build-static` — the
output of the SvelteKit **static** target (`BUILD_TARGET=static`). The APK
therefore ships the actual app assets on-device. Two reasons that matters:

1. **Play Store review.** A shell that just loads a remote URL is what Google's
   "minimum functionality" policy rejects. A real bundle with native plugins is
   not.
2. **Offline.** Downloads (BUILD_PLAN.md §5.2) are only possible if the app
   itself is on the device; only the media needs fetching.

The bundle talks to the deployed API over HTTPS. That origin is baked in at
build time from `PUBLIC_API_ORIGIN` (see `apps/web/vite.config.ts`).

## Config is JSON, not TypeScript, on purpose

The repo is on TypeScript 7, whose new compiler dropped the legacy API that
Capacitor's CLI uses to parse `capacitor.config.ts` (it fails with
`Cannot read properties of undefined (reading 'CommonJS')`). `capacitor.config.json`
needs no TypeScript at all. Revisit if Capacitor ships a TS7-compatible loader.

## Origins must stay in sync

The WebView serves the app from `http://localhost`. That origin appears in two
places on the server side and all three must agree:

- `apps/web/src/lib/auth.ts` — better-auth `trustedOrigins`
- `apps/web/src/hooks.server.ts` — `NATIVE_ORIGINS` (CORS allowlist)
- `capacitor.config.json` — `server.androidScheme` + `server.hostname`

## Auth

A `http://localhost` page is cross-origin to `sepharstudios.com`, so the session
cookie is never sent. Native signs in and carries a better-auth **bearer token**
instead, held by `tokenStore` in `apps/web/src/lib/api/client.ts`.

## Commands

Run from the repo root so the SPA is rebuilt first:

```
bun run build:android        # build SPA + cap sync + assembleRelease
```

Or step by step from here (requires `apps/web/build-static` to exist):

```
bun run sync                 # copy the SPA into android/
bun run build:apk:debug      # unsigned debug APK
bun run build:apk            # release APK (needs signing config)
bun run open                 # open in Android Studio
```

Requires JDK 21 and the Android SDK (`ANDROID_HOME`).
