import { ao as fallback, aa as attr, an as escape_html, ae as bind_props, aQ as writable } from './ui-libs-TtGtWAGI.js';
import { B as Bookmark } from './bookmark-ChhX2gSi.js';
import { P as Play } from './play-EdV4ja4g.js';
import './client-CZa6R-ON.js';

//#region src/lib/stores/mediaModalStore.ts
var { subscribe, update, set } = writable({
	isOpen: false,
	media: null
});
var mediaModalStore = {
	subscribe,
	open: (media) => update(() => ({
		isOpen: true,
		media
	})),
	close: () => set({
		isOpen: false,
		media: null
	})
};
//#endregion
//#region src/lib/components/MovieCard.svelte
function MovieCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let movie = $$props["movie"];
		let onClick = fallback($$props["onClick"], () => {});
		let onHover = fallback($$props["onHover"], () => {});
		$$renderer.push(`<div role="button" tabindex="0" class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-[1.02]"${attr("aria-label", `Watch ${movie.title}`)}><div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<img${attr("src", movie.thumbnail || "/placeholder-vertical.jpg")} alt="" width="280" height="420" loading="lazy" decoding="async" class="w-full h-full object-cover"/>`);
		$$renderer.push(`<!--]--> <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div></div> `);
		if (movie.isNew) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">New Episode</div>`);
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
		$$renderer.push(`<!----> Play</button> <button class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"${attr("aria-label", `Add ${movie.title} to My List`)}>`);
		Bookmark($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> My List</button></div></div></div>`);
		bind_props($$props, {
			movie,
			onClick,
			onHover
		});
	});
}

export { MovieCard as M, mediaModalStore as m };
//# sourceMappingURL=MovieCard-sO9ey_7_.js.map
