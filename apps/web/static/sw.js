// Sephar Studios Service Worker — handles offline HLS segment caching for downloads

// Bump these cache names whenever the SW logic itself changes (not just the
// shell assets) — the bump forces `install` to re-run on every client and
// the `activate` handler below to clean up the old caches. Without a bump,
// the browser keeps using the old SW until it naturally expires (~24h), so
// fixes like "stop intercepting /api/*" don't reach users until tomorrow.
const DOWNLOAD_CACHE = 'sephar-downloads-v1';
const SHELL_CACHE = 'sephar-shell-v4';

// App shell assets to cache on install
const SHELL_ASSETS = ['/', '/offline', '/favicon-96x96.png'];

self.addEventListener('install', (event) => {
  // Cache each shell asset INDEPENDENTLY. `cache.addAll(SHELL_ASSETS)` is
  // atomic — if any URL fails (e.g. `/` cross-origin-redirects, network
  // hiccup, 404), the whole install rejects and the service worker never
  // activates. Using Promise.allSettled means a single bad asset only
  // skips itself; the SW still installs and the navigation handler can
  // fall through to the network on the missing entry.
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(async (cache) => {
        const results = await Promise.allSettled(
          SHELL_ASSETS.map((asset) => cache.add(asset))
        );
        const failed = results.filter((r) => r.status === 'rejected').length;
        if (failed > 0) {
          console.warn(`[sw] ${failed}/${SHELL_ASSETS.length} shell assets failed to cache; SW still installing.`);
        }
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== DOWNLOAD_CACHE && k !== SHELL_CACHE).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Intercept fetch — serve HLS segments from download cache when offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // CRITICAL: Do NOT intercept API requests. Two reasons:
  //   1. `fetch()` inside a service worker does not proxy `xhr.upload.onprogress`
  //      back to the original XMLHttpRequest, so XHR uploads through the SW
  //      appear stuck at 0% the entire time even though bytes are transferring.
  //      This was breaking the asset-upload progress bar in the creator wizard.
  //   2. POST/PUT requests with bodies (e.g. multipart FormData for image
  //      uploads) can fail unpredictably when the SW reads + replays the body.
  // Letting /api/* go straight to the network removes the SW from a path
  // where it adds zero value (we never cache /api responses anyway) and
  // surfaces the real server response to the browser unfiltered.
  if (url.pathname.startsWith('/api/')) return;

  // Don't intercept non-GET requests on any other path either. Caches are
  // GET-only, and intercepting POST/PUT/DELETE just adds a useless detour
  // that can break body streams.
  if (event.request.method !== 'GET') return;

  // Ranged media requests bypass the SW entirely. cache.match() ignores
  // Range headers and would answer a partial-content request with a
  // full-body 200 — the classic SW/media pitfall (Safari's native HLS
  // loader issues ranged segment fetches). Let the network handle them.
  if (event.request.headers.has('range')) return;

  // Only intercept HLS segments (.ts) and manifests (.m3u8) for offline playback
  if (url.pathname.endsWith('.ts') || url.pathname.endsWith('.m3u8')) {
    event.respondWith(
      caches.open(DOWNLOAD_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        // Not cached — fetch from network and cache if it's a download request
        try {
          const response = await fetch(event.request);
          return response;
        } catch {
          return new Response('Offline', { status: 503 });
        }
      })
    );
    return;
  }

  // DO NOT intercept navigation requests. We used to serve them ourselves
  // (`fetch(req).catch(() => cached('/'))`) but that broke EVERY navigation
  // because SvelteKit's auth + redirect + HMR responses can resolve to a
  // Response object that respondWith() can't accept (opaqueredirect,
  // network-error responses, etc.) — throwing
  //   "Failed to convert value to 'Response'"
  // and aborting the navigation. Symptom: click a movie card, URL changes,
  // page renders blank / scrolled to top. Letting the browser handle
  // navigation natively (no respondWith) restores SvelteKit's normal
  // client-side router + SSR flow.
  //
  // We lose offline-fallback for navigations as a result. Acceptable
  // trade-off — viewers without network can't reach the catalog anyway,
  // and the legitimate SW use (HLS segment caching for downloads, push)
  // is unaffected.
  if (event.request.mode === 'navigate') return;

  // Default: don't intercept anything else either. The HLS segment +
  // manifest branch above already handles the playback caching path;
  // for everything else (scripts, CSS, images), the browser HTTP cache
  // is more reliable than us proxying through the SW.
});

// Web Push — server dispatches via /api/push/* with the registered VAPID
// keys. The payload is JSON: { title, body, url?, tag? }.
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload = { title: 'Sephar Studios', body: '' };
  try {
    payload = event.data.json();
  } catch {
    payload.body = event.data.text();
  }
  const options = {
    body: payload.body,
    icon: '/pwa-192x192.png',
    badge: '/favicon-96x96.png',
    tag: payload.tag,
    data: { url: payload.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Focus an existing tab when the user clicks the notification, or open a new
// one if no tab is open at that URL.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      if (client.url.includes(targetUrl) && 'focus' in client) {
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
  })());
});

// Message handler for download manager
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_SEGMENT') {
    const { url } = event.data;
    caches.open(DOWNLOAD_CACHE).then(async (cache) => {
      try {
        const response = await fetch(url);
        if (response.ok) await cache.put(url, response);
        event.source?.postMessage({ type: 'SEGMENT_CACHED', url, ok: true });
      } catch {
        event.source?.postMessage({ type: 'SEGMENT_CACHED', url, ok: false });
      }
    });
  }

  if (event.data?.type === 'DELETE_DOWNLOAD') {
    const { urls } = event.data;
    caches.open(DOWNLOAD_CACHE).then(async (cache) => {
      await Promise.all(urls.map((u) => cache.delete(u)));
      event.source?.postMessage({ type: 'DOWNLOAD_DELETED', urls });
    });
  }

  if (event.data?.type === 'CACHE_SIZE') {
    caches.open(DOWNLOAD_CACHE).then(async (cache) => {
      const keys = await cache.keys();
      let totalBytes = 0;
      for (const req of keys) {
        const resp = await cache.match(req);
        if (resp) {
          const buf = await resp.clone().arrayBuffer();
          totalBytes += buf.byteLength;
        }
      }
      event.source?.postMessage({ type: 'CACHE_SIZE_RESULT', bytes: totalBytes, count: keys.length });
    });
  }
});
