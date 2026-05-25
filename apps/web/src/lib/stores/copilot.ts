import { writable } from 'svelte/store';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COPILOT CONTEXT STORE
 * ─────────────────────────────────────────────────────────────────────────────
 * Content pages (movie detail, watch page) write their context here so the
 * floating copilot widget knows what the user is currently viewing.
 *
 * Usage on a movie page:
 *   import { copilotContext } from '$lib/stores/copilot';
 *   copilotContext.set({
 *     contentTitle: data.movie.title,
 *     contentDescription: data.movie.description,
 *     contentType: 'movie',
 *     bibleReference: data.movie.bibleReference,
 *     genres: data.movie.genres,
 *     topics: data.movie.topics
 *   });
 *
 *   onDestroy(() => copilotContext.set(null)); // clear when leaving the page
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface CopilotContext {
	contentTitle: string;
	contentDescription: string;
	contentType: string;           // 'movie' | 'documentary' | 'sermon' | etc.
	bibleReference?: string;
	genres?: string[];
	topics?: string[];
}

/** Set this from any content page. Null = general mode (no specific content). */
export const copilotContext = writable<CopilotContext | null>(null);

/** Control the open/closed state globally — so other elements can open the chat */
export const copilotOpen = writable<boolean>(false);
