import { Bt as writable } from "./ui-libs.js";
import "./index-server.js";
import { n as toast } from "./toast-state.svelte.js";
import { n as goto } from "./client.js";
import "./navigation.js";
//#region src/lib/stores/myList.ts
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
function createStore() {
	const { subscribe, update, set } = writable({
		ids: /* @__PURE__ */ new Set(),
		pending: /* @__PURE__ */ new Set()
	});
	function seedIds(ids) {
		update((s) => {
			for (const id of ids) s.ids.add(id);
			return { ...s };
		});
	}
	function has(id) {
		let result = false;
		subscribe((s) => {
			result = s.ids.has(id);
		})();
		return result;
	}
	function isPending(id) {
		let result = false;
		subscribe((s) => {
			result = s.pending.has(id);
		})();
		return result;
	}
	function markPending(id, on) {
		update((s) => {
			if (on) s.pending.add(id);
			else s.pending.delete(id);
			return { ...s };
		});
	}
	function markMembership(id, inList) {
		update((s) => {
			if (inList) s.ids.add(id);
			else s.ids.delete(id);
			return { ...s };
		});
	}
	async function toggle(args) {
		const { contentId, contentTitle, contentType } = args;
		if (isPending(contentId)) return has(contentId);
		const prev = has(contentId);
		const next = !prev;
		markMembership(contentId, next);
		markPending(contentId, true);
		try {
			if (!(await fetch(`/api/my-list/${contentId}`, {
				method: next ? "POST" : "DELETE",
				headers: { "Content-Type": "application/json" },
				body: next ? JSON.stringify({ contentType: contentType ?? "movie" }) : void 0
			})).ok) {
				markMembership(contentId, prev);
				toast.error(next ? "Couldn't add to My List" : "Couldn't remove from My List", { description: "Please try again in a moment." });
				return prev;
			}
			if (next) toast.success("Added to My List", {
				description: contentTitle,
				action: {
					label: "View list",
					onClick: () => void goto("/watchlist")
				}
			});
			else toast("Removed from My List", { description: contentTitle });
			return next;
		} catch (err) {
			markMembership(contentId, prev);
			console.error("myList.toggle error", err);
			toast.error("Network error", { description: "Please try again." });
			return prev;
		} finally {
			markPending(contentId, false);
		}
	}
	function reset() {
		set({
			ids: /* @__PURE__ */ new Set(),
			pending: /* @__PURE__ */ new Set()
		});
	}
	return {
		subscribe,
		seedIds,
		has,
		isPending,
		toggle,
		reset
	};
}
var myList = createStore();
//#endregion
export { myList as t };
