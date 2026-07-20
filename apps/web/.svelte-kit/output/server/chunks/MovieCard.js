import { Ct as attr_style, Ft as unsubscribe_stores, Ht as attr, Mt as store_get, Pt as stringify, Wt as escape_html } from "./ui-libs.js";
import { n as Bookmark_check, t as Bookmark } from "./bookmark.js";
import { t as Play } from "./play.js";
import "./navigation.js";
import "./mediaModalStore.js";
import { t as myList } from "./myList.js";
import { t as isRecentlyAdded } from "./recency.js";
//#region src/lib/components/MovieCard.svelte
function MovieCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { movie, onClick = () => {}, onHover = () => {} } = $$props;
		function newBadgeLabel(mt) {
			switch (mt) {
				case "movie": return "New Movie";
				case "short": return "New Short";
				case "series": return "New Episode";
				case "episode": return "New Episode";
				case "documentary": return "New Documentary";
				case "sermon": return "New Sermon";
				case "worship": return "New Worship";
				default: return "New";
			}
		}
		$$renderer.push(`<div role="button" tabindex="0" class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-[1.02]"${attr("aria-label", `Watch ${movie.title}`)}><div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<img${attr("src", movie.posterUrl || movie.poster_url || movie.thumbnail || "/placeholder-vertical.jpg")} alt="" width="280" height="420" loading="lazy" decoding="async" class="w-full h-full object-cover"/>`);
		$$renderer.push(`<!--]--> <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div> `);
		if (typeof movie.progressPercent === "number" && movie.progressPercent > 0 && movie.progressPercent < 95) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute inset-x-0 bottom-0 h-1 bg-black/40 z-20"><div class="h-full bg-[#FF5E0E]"${attr_style(`width: ${stringify(Math.max(2, Math.min(100, movie.progressPercent)))}%`)}></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (movie.isNew) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">${escape_html(newBadgeLabel(movie.mediaType))}</div>`);
		} else if (isRecentlyAdded(movie.createdAt)) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="absolute top-2 left-2 bg-[#FF5E0E] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full z-30 shadow">Just added</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><h3 class="text-sm font-semibold line-clamp-2 text-white">${escape_html(movie.title)}</h3> <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">`);
		if (movie.rating) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">${escape_html(movie.rating)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (movie.duration) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(movie.duration)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (movie.quality) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(movie.quality)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="mt-3 flex items-center gap-2"><button class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"${attr("aria-label", `Play ${movie.title}`)}>`);
		Play($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Play</button> <button class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition disabled:opacity-60 disabled:cursor-not-allowed"${attr("disabled", store_get($$store_subs ??= {}, "$myList", myList).pending.has(movie.id), true)}${attr("aria-label", store_get($$store_subs ??= {}, "$myList", myList).ids.has(movie.id) ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`)}>`);
		if (store_get($$store_subs ??= {}, "$myList", myList).ids.has(movie.id)) {
			$$renderer.push("<!--[0-->");
			Bookmark_check($$renderer, { class: "h-3.5 w-3.5" });
		} else {
			$$renderer.push("<!--[-1-->");
			Bookmark($$renderer, { class: "h-3.5 w-3.5" });
		}
		$$renderer.push(`<!--]--> My List</button></div></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { MovieCard as t };
