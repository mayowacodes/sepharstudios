import { It as writable } from "./ui-libs.js";
import "./index-server.js";
//#region src/lib/stores/live-region.ts
/**
* Global screen-reader announcement store. Components that surface
* important status changes — encoder progress, new thread messages,
* live stream state, etc. — call `announce(text)` and a single
* `aria-live="polite"` region (mounted once in the root layout) reads
* it out.
*
* Why a store + not direct DOM manipulation: keeps the API testable +
* lets us debounce / queue future versions without touching callers.
*/
var buffer = writable("");
var lastAt = 0;
var queue = [];
var flushTimer = null;
/**
* Announce a short string. Calls within 600ms of each other are queued
* and joined; one assistive-tech utterance per ~600ms.
*/
function announce(text) {
	if (!text.trim()) return;
	const now = Date.now();
	queue.push(text.trim().slice(0, 200));
	if (flushTimer) clearTimeout(flushTimer);
	const delay = Math.max(0, 600 - (now - lastAt));
	flushTimer = setTimeout(() => {
		const message = queue.join(" · ");
		queue = [];
		flushTimer = null;
		lastAt = Date.now();
		buffer.set("");
		setTimeout(() => buffer.set(message), 30);
	}, delay);
}
var liveRegionBuffer = buffer;
//#endregion
export { liveRegionBuffer as n, announce as t };
