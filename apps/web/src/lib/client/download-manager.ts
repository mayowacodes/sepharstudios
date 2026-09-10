import { browser } from '$app/environment';
import { api } from '$lib/api/client';

/**
 * Offline downloads (BUILD_PLAN §5.2).
 *
 * Walks an HLS master playlist, picks ONE rendition, and caches every segment
 * through the Cache API. Metadata lives in IndexedDB so the library survives a
 * reload and can be listed without touching the network.
 *
 * Why the Cache API rather than IndexedDB blobs: cached Responses are served
 * back through `caches.match()` by the service worker, so hls.js fetches
 * `segment_00042.ts` exactly as it would online and needs no offline-specific
 * code path. Storing blobs would mean re-implementing range requests and
 * content types by hand.
 *
 * This is the reason the Capacitor build bundles the app rather than pointing a
 * WebView at production: a remote shell has no origin of its own to cache into.
 */

const CACHE_NAME = 'sephar-downloads-v1';
const DB_NAME = 'sephar-downloads';
const DB_VERSION = 1;
const STORE = 'items';

export type DownloadState = 'queued' | 'downloading' | 'complete' | 'failed' | 'paused';

export interface DownloadRecord {
	contentId: string;
	title: string;
	state: DownloadState;
	/** 0–1. Segment count is known only after the playlist is parsed. */
	progress: number;
	totalSegments: number;
	doneSegments: number;
	bytes: number;
	quality: string;
	createdAt: number;
	error?: string;
}

// ── IndexedDB ────────────────────────────────────────────────────────────────

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) {
				db.createObjectStore(STORE, { keyPath: 'contentId' });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function put(record: DownloadRecord): Promise<void> {
	const db = await openDb();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(STORE, 'readwrite');
		tx.objectStore(STORE).put(record);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}

export async function listDownloads(): Promise<DownloadRecord[]> {
	if (!browser) return [];
	try {
		const db = await openDb();
		const rows = await new Promise<DownloadRecord[]>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readonly');
			const req = tx.objectStore(STORE).getAll();
			req.onsuccess = () => resolve(req.result as DownloadRecord[]);
			req.onerror = () => reject(req.error);
		});
		db.close();
		return rows.sort((a, b) => b.createdAt - a.createdAt);
	} catch {
		return [];
	}
}

export async function getDownload(contentId: string): Promise<DownloadRecord | null> {
	const all = await listDownloads();
	return all.find((r) => r.contentId === contentId) ?? null;
}

// ── Playlist parsing ─────────────────────────────────────────────────────────

interface Rendition {
	uri: string;
	bandwidth: number;
	resolution: string | null;
	audioOnly: boolean;
}

/**
 * Parse the renditions out of an HLS master playlist.
 *
 * Audio-only rungs are identified by the absence of RESOLUTION, which is how
 * the encoder emits them — a stream with no video track must not declare one.
 */
export function parseMaster(text: string): Rendition[] {
	const out: Rendition[] = [];
	const lines = text.split('\n').map((l) => l.trim());
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (!line.startsWith('#EXT-X-STREAM-INF:')) continue;
		const uri = lines[i + 1];
		if (!uri || uri.startsWith('#')) continue;
		const bandwidth = Number(/BANDWIDTH=(\d+)/.exec(line)?.[1] ?? 0);
		const resolution = /RESOLUTION=([\dx]+)/.exec(line)?.[1] ?? null;
		out.push({ uri, bandwidth, resolution, audioOnly: resolution === null });
	}
	return out;
}

/** Segment URIs from a media playlist, resolved against its own URL. */
export function parseSegments(text: string, playlistUrl: string): string[] {
	const base = new URL(playlistUrl);
	return text
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l && !l.startsWith('#'))
		.map((l) => new URL(l, base).toString());
}

/**
 * Choose which rendition to store.
 *
 * Defaults to the highest rung at or below 720p rather than the best available:
 * a downloaded title is watched on the device that downloaded it, and a 1080p
 * or 4K copy costs multiples of the storage for a difference most phone screens
 * cannot resolve. `audio` is offered explicitly for listeners who want the
 * programme at a fraction of the size.
 */
export function chooseRendition(renditions: Rendition[], quality: 'audio' | 'sd' | 'hd'): Rendition | null {
	if (renditions.length === 0) return null;
	if (quality === 'audio') {
		return renditions.find((r) => r.audioOnly) ?? null;
	}
	const video = renditions.filter((r) => !r.audioOnly);
	if (video.length === 0) return null;
	const height = (r: Rendition) => Number(r.resolution?.split('x')[1] ?? 0);
	const cap = quality === 'sd' ? 480 : 720;
	const eligible = video.filter((r) => height(r) <= cap);
	const pool = eligible.length > 0 ? eligible : video;
	return pool.reduce((best, r) => (height(r) > height(best) ? r : best), pool[0]);
}

// ── Download ─────────────────────────────────────────────────────────────────

/**
 * Download a title for offline playback.
 *
 * Segments are fetched with bounded concurrency, not all at once: a two-hour
 * film is ~1,800 segments, and firing that many requests at once will exhaust
 * the connection pool and, on mobile, get the app throttled or killed.
 */
export async function downloadContent(
	contentId: string,
	opts: { quality?: 'audio' | 'sd' | 'hd'; onProgress?: (r: DownloadRecord) => void } = {}
): Promise<DownloadRecord> {
	if (!browser) throw new Error('downloadContent is browser-only');
	if (!('caches' in window)) throw new Error('This browser cannot store downloads');

	const quality = opts.quality ?? 'hd';
	let record: DownloadRecord = {
		contentId,
		title: '',
		state: 'queued',
		progress: 0,
		totalSegments: 0,
		doneSegments: 0,
		bytes: 0,
		quality,
		createdAt: Date.now()
	};
	await put(record);

	const update = async (patch: Partial<DownloadRecord>) => {
		record = { ...record, ...patch };
		await put(record);
		opts.onProgress?.(record);
	};

	try {
		// Authorisation happens server-side. A failure here is terminal —
		// never fall back to fetching the manifest directly.
		const auth = await api<{ manifestUrl: string; title: string }>(
			`/api/downloads/manifest/${encodeURIComponent(contentId)}`
		);
		await update({ title: auth.title, state: 'downloading' });

		const masterRes = await fetch(auth.manifestUrl);
		if (!masterRes.ok) throw new Error(`Manifest unavailable (${masterRes.status})`);
		const masterText = await masterRes.text();

		const renditions = parseMaster(masterText);
		const chosen = chooseRendition(renditions, quality);
		if (!chosen) throw new Error(`No ${quality} rendition available for this title`);

		const playlistUrl = new URL(chosen.uri, auth.manifestUrl).toString();
		const playlistRes = await fetch(playlistUrl);
		if (!playlistRes.ok) throw new Error(`Playlist unavailable (${playlistRes.status})`);
		const playlistText = await playlistRes.text();
		const segments = parseSegments(playlistText, playlistUrl);

		await update({ totalSegments: segments.length });

		const cache = await caches.open(CACHE_NAME);
		// Cache the playlists too — hls.js re-reads them on every load, and a
		// cached ladder with an uncached manifest plays nothing offline.
		await cache.put(auth.manifestUrl, new Response(masterText, {
			headers: { 'content-type': 'application/vnd.apple.mpegurl' }
		}));
		await cache.put(playlistUrl, new Response(playlistText, {
			headers: { 'content-type': 'application/vnd.apple.mpegurl' }
		}));

		const CONCURRENCY = 4;
		let done = 0;
		let bytes = 0;
		let cursor = 0;

		const worker = async () => {
			while (cursor < segments.length) {
				const index = cursor++;
				const url = segments[index];
				const res = await fetch(url);
				if (!res.ok) throw new Error(`Segment ${index} failed (${res.status})`);
				const buf = await res.clone().arrayBuffer();
				bytes += buf.byteLength;
				await cache.put(url, res);
				done++;
				// Report every 10 segments — a per-segment write would put
				// ~1,800 IndexedDB transactions in the way of the download.
				if (done % 10 === 0 || done === segments.length) {
					await update({ doneSegments: done, bytes, progress: done / segments.length });
				}
			}
		};

		await Promise.all(Array.from({ length: CONCURRENCY }, worker));
		await update({ state: 'complete', progress: 1, doneSegments: done, bytes });
		return record;
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Download failed';
		await update({ state: 'failed', error: message });
		throw err;
	}
}

/** Remove a download and every segment it cached. */
export async function deleteDownload(contentId: string): Promise<void> {
	if (!browser) return;
	const record = await getDownload(contentId);
	if (!record) return;

	try {
		const cache = await caches.open(CACHE_NAME);
		const keys = await cache.keys();
		// Segment URLs contain the content's object prefix. Matching on the id
		// is coarse but safe: the cache holds only this app's downloads, and
		// leaving orphaned segments behind would silently consume the device's
		// storage quota with no way for the user to reclaim it.
		await Promise.all(
			keys.filter((k) => k.url.includes(contentId)).map((k) => cache.delete(k))
		);
	} catch {
		/* cache eviction is best-effort; the record still goes */
	}

	const db = await openDb();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(STORE, 'readwrite');
		tx.objectStore(STORE).delete(contentId);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}

/** Bytes currently held by downloads, for a storage-used indicator. */
export async function storageUsed(): Promise<number> {
	const all = await listDownloads();
	return all.reduce((sum, r) => sum + r.bytes, 0);
}
