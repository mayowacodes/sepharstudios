import { Ct as attr_style, Et as derived, Ft as unsubscribe_stores, Ht as attr, Mt as store_get, Ot as ensure_array_like, Pt as stringify, Tt as bind_props, Wt as escape_html } from "./ui-libs.js";
import { n as Bookmark_check, t as Bookmark } from "./bookmark.js";
import "./navigation.js";
import { t as myList } from "./myList.js";
import { t as isRecentlyAdded } from "./recency.js";
//#region src/lib/components/kids/KidsMovieCard.svelte
function KidsMovieCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { movie } = $$props;
		$$renderer.push(`<div class="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border-4 border-yellow-300 bg-white text-center cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2" role="button" tabindex="0"${attr("aria-label", `Watch ${movie.title}`)}>`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<img${attr("src", movie.posterUrl || movie.thumbnailUrl || "/placeholder-vertical.jpg")}${attr("alt", movie.title)} width="320" height="192" loading="lazy" decoding="async" class="w-full h-48 object-cover"/>`);
		$$renderer.push(`<!--]--> `);
		if (isRecentlyAdded(movie.createdAt)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-2 left-2 bg-yellow-300 text-pink-700 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border-2 border-pink-300 shadow z-30">New!</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (typeof movie.progressPercent === "number" && movie.progressPercent > 0 && movie.progressPercent < 95) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute inset-x-0 bottom-14 sm:bottom-13 h-1.5 bg-pink-900/30 z-30"><div class="h-full bg-pink-500"${attr_style(`width: ${stringify(Math.max(2, Math.min(100, movie.progressPercent)))}%`)}></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button type="button" class="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/95 border-2 border-pink-300 shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 hover:scale-110 transition disabled:opacity-60 disabled:cursor-not-allowed"${attr("disabled", store_get($$store_subs ??= {}, "$myList", myList).pending.has(movie.id), true)}${attr("aria-label", store_get($$store_subs ??= {}, "$myList", myList).ids.has(movie.id) ? `Remove ${movie.title} from My List` : `Save ${movie.title} for later`)}>`);
		if (store_get($$store_subs ??= {}, "$myList", myList).ids.has(movie.id)) {
			$$renderer.push("<!--[0-->");
			Bookmark_check($$renderer, { class: "w-5 h-5" });
		} else {
			$$renderer.push("<!--[-1-->");
			Bookmark($$renderer, { class: "w-5 h-5" });
		}
		$$renderer.push(`<!--]--></button> <div class="p-2 bg-pink-100"><h3 class="font-bold text-lg text-pink-700">${escape_html(movie.title)}</h3> `);
		if (movie.genres?.length) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-xs text-gray-600">${escape_html(movie.genres.join(", "))}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/kids/CategoryFilter.svelte
function CategoryFilter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { categories = [], selected = null } = $$props;
		$$renderer.push(`<div class="text-center mb-6"><label for="genre-select" class="text-md font-semibold mr-2">🎬 Choose a Genre:</label> `);
		$$renderer.select({
			id: "genre-select",
			value: selected,
			class: "p-2 border border-yellow-400 rounded bg-white text-gray-800"
		}, ($$renderer) => {
			$$renderer.option({ value: null }, ($$renderer) => {
				$$renderer.push(`All`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(categories);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let cat = each_array[$$index];
				$$renderer.option({ value: cat }, ($$renderer) => {
					$$renderer.push(`${escape_html(cat)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div>`);
		bind_props($$props, { selected });
	});
}
//#endregion
//#region src/lib/components/kids/KidsMediaPage.svelte
function KidsMediaPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { title, mediaData } = $$props;
		let selectedCategory = null;
		const filteredMedia = derived(() => mediaData.filter((item) => !selectedCategory || item.genres?.includes(selectedCategory)));
		const allCategories = derived(() => [...new Set(mediaData.flatMap((m) => m.genres ?? []))].sort());
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<main class="p-4 max-w-7xl mx-auto"><h1 class="text-4xl font-bold text-yellow-600 text-center mb-6">${escape_html(title)}</h1> `);
			CategoryFilter($$renderer, {
				categories: allCategories(),
				get selected() {
					return selectedCategory;
				},
				set selected($$value) {
					selectedCategory = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			if (filteredMedia().length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-center mt-12 text-pink-600 text-lg">No media found in this category 💨</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6"><!--[-->`);
				const each_array = ensure_array_like(filteredMedia());
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let movie = each_array[$$index];
					KidsMovieCard($$renderer, { movie });
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></main>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { KidsMediaPage as t };
