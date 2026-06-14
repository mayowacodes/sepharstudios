/**
 * My List store + shared toggle.
 *
 * Exists so every surface that can add/remove from the default playlist
 * (detail page Bookmark CTA, MovieCard hover bookmark, the modal on a
 * search result, future hover-cards) speaks to the same:
 *   - membership snapshot (Svelte store, read-anywhere)
 *   - optimistic-update API call
 *   - toast confirmation
 *
 * The server-load functions still seed the initial membership ids per
 * page (so the detail page paints the right state without a network
 * round-trip). Subsequent toggles flow through `toggleMyList` which
 * mutates the store + fires `POST /api/my-list/<id>` or DELETE.
 *
 * Why a store and not just a function: catalog pages render many cards;
 * if any card calls the API, the OTHER cards (or the detail page) need
 * to know without re-rendering or re-querying. Subscribing to the
 * store keeps every surface in sync.
 */
import { writable } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { goto } from '$app/navigation';

interface MyListSnapshot {
	ids: Set<string>;
	/** Set of contentIds with an in-flight toggle. UI can disable
	 *  buttons / show a spinner without juggling component-local state. */
	pending: Set<string>;
}

function createStore() {
	const { subscribe, update, set } = writable<MyListSnapshot>({
		ids: new Set(),
		pending: new Set()
	});

	function seedIds(ids: Iterable<string>): void {
		update((s) => {
			for (const id of ids) s.ids.add(id);
			return { ...s };
		});
	}

	function has(id: string): boolean {
		let result = false;
		const unsub = subscribe((s) => { result = s.ids.has(id); });
		unsub();
		return result;
	}

	function isPending(id: string): boolean {
		let result = false;
		const unsub = subscribe((s) => { result = s.pending.has(id); });
		unsub();
		return result;
	}

	function markPending(id: string, on: boolean): void {
		update((s) => {
			if (on) s.pending.add(id);
			else s.pending.delete(id);
			return { ...s };
		});
	}

	function markMembership(id: string, inList: boolean): void {
		update((s) => {
			if (inList) s.ids.add(id);
			else s.ids.delete(id);
			return { ...s };
		});
	}

	async function toggle(args: {
		contentId: string;
		contentTitle: string;
		contentType?: string;
	}): Promise<boolean> {
		const { contentId, contentTitle, contentType } = args;
		if (isPending(contentId)) return has(contentId);

		const prev = has(contentId);
		const next = !prev;
		// Optimistic flip + mark pending so other components disable
		// their bookmark click while this round-trips.
		markMembership(contentId, next);
		markPending(contentId, true);

		try {
			const res = await fetch(`/api/my-list/${contentId}`, {
				method: next ? 'POST' : 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: next ? JSON.stringify({ contentType: contentType ?? 'movie' }) : undefined
			});
			if (!res.ok) {
				markMembership(contentId, prev);
				toast.error(next ? "Couldn't add to My List" : "Couldn't remove from My List", {
					description: 'Please try again in a moment.'
				});
				return prev;
			}
			if (next) {
				toast.success('Added to My List', {
					description: contentTitle,
					action: { label: 'View list', onClick: () => void goto('/watchlist') }
				});
			} else {
				toast('Removed from My List', { description: contentTitle });
			}
			return next;
		} catch (err) {
			markMembership(contentId, prev);
			console.error('myList.toggle error', err);
			toast.error('Network error', { description: 'Please try again.' });
			return prev;
		} finally {
			markPending(contentId, false);
		}
	}

	function reset(): void {
		set({ ids: new Set(), pending: new Set() });
	}

	return { subscribe, seedIds, has, isPending, toggle, reset };
}

export const myList = createStore();
