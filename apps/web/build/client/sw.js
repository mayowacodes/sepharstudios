// Sephar Studios Service Worker — handles offline HLS segment caching for downloads

const DOWNLOAD_CACHE = 'sephar-downloads-v1';
const SHELL_CACHE = 'sephar-shell-v1';

// App shell assets to cache on install
const SHELL_ASSETS = ['/', '/offline', '/favicon-96x96.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
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

  // For navigation requests, serve shell or network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match('/');
        return cached || new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // Default: network first, fall back to shell cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
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
