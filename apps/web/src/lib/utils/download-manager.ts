/**
 * Download Manager — caches HLS segments via Service Worker for offline playback.
 * Available to Premium and Creator plan users only (enforced server-side on manifest endpoint).
 */

interface DownloadMeta {
  contentId: string;
  title: string;
  thumbnail: string | null;
  manifestUrl: string;
  segments: string[];
  downloadedAt: number;
  totalBytes?: number;
}

const DB_NAME = 'sephar-downloads';
const DB_VERSION = 1;
const STORE = 'downloads';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'contentId' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveMeta(meta: DownloadMeta): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(meta);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteMeta(contentId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(contentId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listDownloads(): Promise<DownloadMeta[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as DownloadMeta[]);
    req.onerror = () => reject(req.error);
  });
}

export async function isDownloaded(contentId: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(contentId);
    req.onsuccess = () => resolve(!!req.result);
    req.onerror = () => resolve(false);
  });
}

function getServiceWorker(): ServiceWorker | null {
  return navigator.serviceWorker?.controller ?? null;
}

/**
 * Download content for offline use.
 * Fetches the HLS manifest, parses segment URLs, caches via Service Worker.
 */
export async function downloadContent(
  contentId: string,
  title: string,
  thumbnail: string | null,
  onProgress?: (pct: number) => void
): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported — offline downloads unavailable');
  }

  // Get signed manifest from server
  const manifestRes = await fetch(`/api/downloads/manifest/${contentId}`);
  if (!manifestRes.ok) {
    const err = await manifestRes.json().catch(() => ({ error: 'Failed to fetch manifest' }));
    throw new Error(err.error ?? 'Failed to fetch manifest');
  }
  const { manifestUrl } = await manifestRes.json();

  // Parse HLS master playlist to get segment URLs
  const m3u8Res = await fetch(manifestUrl);
  if (!m3u8Res.ok) throw new Error('Failed to fetch HLS manifest');
  const m3u8Text = await m3u8Res.text();

  const baseUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf('/') + 1);
  const segmentUrls: string[] = [];

  for (const line of m3u8Text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    // Could be a sub-playlist (multi-quality) or segment
    if (trimmed.endsWith('.m3u8')) {
      // Fetch sub-playlist for the lowest quality level
      const subUrl = trimmed.startsWith('http') ? trimmed : baseUrl + trimmed;
      const subRes = await fetch(subUrl);
      if (subRes.ok) {
        const subText = await subRes.text();
        const subBase = subUrl.substring(0, subUrl.lastIndexOf('/') + 1);
        for (const subLine of subText.split('\n')) {
          const s = subLine.trim();
          if (s && !s.startsWith('#') && s.endsWith('.ts')) {
            segmentUrls.push(s.startsWith('http') ? s : subBase + s);
          }
        }
      }
      break; // Only cache one quality level (lowest bandwidth)
    }
    if (trimmed.endsWith('.ts')) {
      segmentUrls.push(trimmed.startsWith('http') ? trimmed : baseUrl + trimmed);
    }
  }

  if (segmentUrls.length === 0) throw new Error('No segments found in manifest');

  // Wait for SW to be ready
  await navigator.serviceWorker.ready;

  let cached = 0;
  for (const url of segmentUrls) {
    await new Promise<void>((resolve) => {
      const sw = getServiceWorker();
      if (!sw) { resolve(); return; }

      const handler = (event: MessageEvent) => {
        if (event.data?.type === 'SEGMENT_CACHED' && event.data.url === url) {
          navigator.serviceWorker.removeEventListener('message', handler);
          cached++;
          onProgress?.(Math.round((cached / segmentUrls.length) * 100));
          resolve();
        }
      };
      navigator.serviceWorker.addEventListener('message', handler);
      sw.postMessage({ type: 'CACHE_SEGMENT', url });
    });
  }

  await saveMeta({
    contentId,
    title,
    thumbnail,
    manifestUrl,
    segments: segmentUrls,
    downloadedAt: Date.now()
  });
}

/**
 * Delete a downloaded content item from cache and IndexedDB.
 */
export async function deleteDownload(contentId: string): Promise<void> {
  const db = await openDB();
  const meta: DownloadMeta | undefined = await new Promise((resolve) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(contentId);
    req.onsuccess = () => resolve(req.result as DownloadMeta | undefined);
    req.onerror = () => resolve(undefined);
  });

  if (meta?.segments) {
    const sw = getServiceWorker();
    if (sw) {
      sw.postMessage({ type: 'DELETE_DOWNLOAD', urls: meta.segments });
    }
  }

  await deleteMeta(contentId);
}

/**
 * Get total storage used by downloads.
 */
export async function getDownloadStorageBytes(): Promise<number> {
  return new Promise(async (resolve) => {
    if (!('serviceWorker' in navigator)) { resolve(0); return; }
    await navigator.serviceWorker.ready;
    const sw = getServiceWorker();
    if (!sw) { resolve(0); return; }

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_SIZE_RESULT') {
        navigator.serviceWorker.removeEventListener('message', handler);
        resolve(event.data.bytes);
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);
    sw.postMessage({ type: 'CACHE_SIZE' });
  });
}
