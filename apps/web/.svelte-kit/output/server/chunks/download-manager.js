//#region src/lib/utils/download-manager.ts
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
var DOWNLOAD_CACHE = "sephar-downloads-v1";
var DB_NAME = "sephar-downloads";
var DB_VERSION = 1;
var STORE = "downloads";
function openDB() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "contentId" });
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function deleteMeta(contentId) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(contentId);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function listDownloads() {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function isDownloaded(contentId) {
	const db = await openDB();
	return new Promise((resolve) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(contentId);
		req.onsuccess = () => resolve(!!req.result);
		req.onerror = () => resolve(false);
	});
}
/**
* Delete a downloaded content item from cache and IndexedDB.
*/
async function deleteDownload(contentId) {
	const db = await openDB();
	const meta = await new Promise((resolve) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(contentId);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => resolve(void 0);
	});
	if (meta?.segments?.length) try {
		const cache = await caches.open(DOWNLOAD_CACHE);
		await Promise.all(meta.segments.map((url) => cache.delete(url)));
	} catch {}
	await deleteMeta(contentId);
}
/**
* Get total storage used by downloads.
*/
async function getDownloadStorageBytes() {
	return (await listDownloads()).reduce((sum, d) => sum + (d.totalBytes ?? 0), 0);
}
//#endregion
export { listDownloads as i, getDownloadStorageBytes as n, isDownloaded as r, deleteDownload as t };
