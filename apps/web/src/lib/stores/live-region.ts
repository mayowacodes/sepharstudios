import { writable } from 'svelte/store';

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

const buffer = writable<string>('');

let lastAt = 0;
let queue: string[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Announce a short string. Calls within 600ms of each other are queued
 * and joined; one assistive-tech utterance per ~600ms.
 */
export function announce(text: string): void {
	if (!text.trim()) return;
	const now = Date.now();
	queue.push(text.trim().slice(0, 200));
	if (flushTimer) clearTimeout(flushTimer);
	const delay = Math.max(0, 600 - (now - lastAt));
	flushTimer = setTimeout(() => {
		const message = queue.join(' · ');
		queue = [];
		flushTimer = null;
		lastAt = Date.now();
		// Always toggle through empty first so duplicate strings still
		// re-announce to AT (some screen readers ignore identical updates).
		buffer.set('');
		setTimeout(() => buffer.set(message), 30);
	}, delay);
}

export const liveRegionBuffer = buffer;
