/**
 * Download Manager — caches HLS segments for offline playback.
 *
 * Premium and Creator only, enforced server-side on the manifest endpoint
 * (which also gates PPV titles — a download is a permanent copy and cannot be
 * revoked, so it is a stricter check than streaming).
 *
 * Writes straight into the same CacheStorage bucket the service worker serves
 * from. `caches` is same-origin shared between page and worker, so the previous
 * postMessage round-trip per segment bought nothing and cost a full message
 * hop each — ~1,800 sequential round-trips for a two-hour film.
 */

/**
 * MUST match DOWNLOAD_CACHE in static/sw.js. The service worker answers
 * `.ts`/`.m3u8` requests cache-first from this bucket; a mismatch here means
 * everything downloads successfully and then plays nothing offline.
 */
const DOWNLOAD_CACHE = 'sephar-downloads-v1';

/** Which rendition to store. */
export type DownloadQuality = 'audio' | 'sd' | 'hd';

interface DownloadMeta {
  contentId: string;
  title: string;
  thumbnail: string | null;
  manifestUrl: string;
  segments: string[];
  downloadedAt: number;
  totalBytes?: number;
  /** Which rendition was stored. Absent on records written before this existed. */
  quality?: DownloadQuality;
}

interface Rendition {
  uri: string;
  bandwidth: number;
  resolution: string | null;
  /** No RESOLUTION attribute — the encoder's audio-only rung. */
  audioOnly: boolean;
}

/** Renditions listed by an HLS master playlist. */
function parseMaster(text: string): Rendition[] {
  const out: Rendition[] = [];
  const lines = text.split('\n').map((l) => l.trim());
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('#EXT-X-STREAM-INF:')) continue;
    const uri = lines[i + 1];
    if (!uri || uri.startsWith('#')) continue;
    const bandwidth = Number(/BANDWIDTH=(\d+)/.exec(line)?.[1] ?? 0);
    const resolution = /RESOLUTION=([\dx]+)/.exec(line)?.[1] ?? null;
    // An audio-only rendition MUST omit RESOLUTION per the HLS spec, which is
    // exactly how the encoder emits it — so its absence is the reliable test.
    out.push({ uri, bandwidth, resolution, audioOnly: resolution === null });
  }
  return out;
}

/**
 * Pick the rendition to store.
 *
 * Defaults to the best rung at or below 720p rather than the best available: a
 * downloaded title is watched on the device that downloaded it, and a 1080p or
 * 4K copy costs multiples of the storage for a difference most phone screens
 * cannot resolve. 'audio' selects the audio-only rung for listeners who want
 * the programme at a fraction of the size.
 */
function chooseRendition(renditions: Rendition[], quality: DownloadQuality): Rendition | null {
  if (renditions.length === 0) return null;
  if (quality === 'audio') return renditions.find((r) => r.audioOnly) ?? null;

  const video = renditions.filter((r) => !r.audioOnly);
  if (video.length === 0) return null;
  const height = (r: Rendition) => Number(r.resolution?.split('x')[1] ?? 0);
  const cap = quality === 'sd' ? 480 : 720;
  const eligible = video.filter((r) => height(r) <= cap);
  const pool = eligible.length > 0 ? eligible : video;
  return pool.reduce((best, r) => (height(r) > height(best) ? r : best), pool[0]);
}

/** Segment URIs from a media playlist, resolved against its own URL. */
function parseSegments(text: string, playlistUrl: string): string[] {
  const base = new URL(playlistUrl);
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'))
    .map((l) => new URL(l, base).toString());
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

/**
 * Download content for offline use.
 *
 * Fetches the master playlist, picks one rendition, and writes the playlists
 * plus every segment straight into the CacheStorage bucket the service worker
 * reads from. The SW is still what SERVES them back during offline playback —
 * it just no longer sits in the write path.
 */
export async function downloadContent(
  contentId: string,
  title: string,
  thumbnail: string | null,
  onProgress?: (pct: number) => void,
  quality: DownloadQuality = 'hd'
): Promise<void> {
  if (!('caches' in window)) {
    throw new Error('This browser cannot store downloads');
  }

  // Authorisation is server-side and terminal. Never fall back to fetching the
  // manifest directly on failure — that would bypass the PPV and plan gates.
  const manifestRes = await fetch(`/api/downloads/manifest/${contentId}`);
  if (!manifestRes.ok) {
    const err = await manifestRes.json().catch(() => ({ error: 'Failed to fetch manifest' }));
    throw new Error(err.error ?? 'Failed to fetch manifest');
  }
  const { manifestUrl } = await manifestRes.json();

  const masterRes = await fetch(manifestUrl);
  if (!masterRes.ok) throw new Error('Failed to fetch HLS manifest');
  const masterText = await masterRes.text();

  const renditions = parseMaster(masterText);
  const chosen = chooseRendition(renditions, quality);
  if (!chosen) throw new Error(`No ${quality} rendition available for this title`);

  const playlistUrl = new URL(chosen.uri, manifestUrl).toString();
  const playlistRes = await fetch(playlistUrl);
  if (!playlistRes.ok) throw new Error('Failed to fetch variant playlist');
  const playlistText = await playlistRes.text();
  const segmentUrls = parseSegments(playlistText, playlistUrl);

  if (segmentUrls.length === 0) throw new Error('No segments found in manifest');

  const cache = await caches.open(DOWNLOAD_CACHE);

  // Cache the PLAYLISTS, not just the segments.
  //
  // This was the gap that made offline playback impossible: hls.js re-reads
  // master.m3u8 and the variant playlist on every load, so a fully-cached
  // segment set with no cached manifest plays nothing. The service worker
  // already intercepts `.m3u8`, it just had nothing to answer with.
  await cache.put(
    manifestUrl,
    new Response(masterText, { headers: { 'content-type': 'application/vnd.apple.mpegurl' } })
  );
  await cache.put(
    playlistUrl,
    new Response(playlistText, { headers: { 'content-type': 'application/vnd.apple.mpegurl' } })
  );

  // Bounded concurrency. A two-hour film is ~1,800 segments; firing them all at
  // once exhausts the connection pool and gets the app throttled or killed on
  // mobile, while one-at-a-time makes a long film take hours.
  const CONCURRENCY = 4;
  let done = 0;
  let bytes = 0;
  let cursor = 0;

  const worker = async () => {
    while (cursor < segmentUrls.length) {
      const url = segmentUrls[cursor++];
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Segment failed (${res.status})`);
      // clone() before cache.put — a Response body can only be read once, and
      // put() consumes it.
      const buf = await res.clone().arrayBuffer();
      bytes += buf.byteLength;
      await cache.put(url, res);
      done++;
      onProgress?.(Math.round((done / segmentUrls.length) * 100));
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  await saveMeta({
    contentId,
    title,
    thumbnail,
    manifestUrl,
    // Playlists are recorded alongside the segments so deleteDownload()
    // removes them too — otherwise a deleted title leaves manifests behind
    // that resolve to nothing.
    segments: [manifestUrl, playlistUrl, ...segmentUrls],
    downloadedAt: Date.now(),
    totalBytes: bytes,
    quality
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

  if (meta?.segments?.length) {
    // Delete straight from CacheStorage rather than messaging the service
    // worker: the page shares the same bucket, and a postMessage is
    // fire-and-forget, so eviction could silently not happen and leave the
    // device's storage quota consumed with no way for the user to reclaim it.
    try {
      const cache = await caches.open(DOWNLOAD_CACHE);
      await Promise.all(meta.segments.map((url) => cache.delete(url)));
    } catch {
      /* best-effort — the metadata record still goes */
    }
  }

  await deleteMeta(contentId);
}

/**
 * Get total storage used by downloads.
 */
export async function getDownloadStorageBytes(): Promise<number> {
  // Summed from the download records rather than asked of the service worker.
  // The SW's CACHE_SIZE reply is a postMessage round-trip that resolves to 0 if
  // the worker is not yet controlling the page — which is exactly the state
  // right after a hard reload, so the figure would read zero at the moment a
  // user is most likely to be looking at it.
  const all = await listDownloads();
  return all.reduce((sum, d) => sum + (d.totalBytes ?? 0), 0);
}

