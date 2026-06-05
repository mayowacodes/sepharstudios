import { aq as derived$1, al as bind_props, au as escape_html, aP as store_get, as as ensure_array_like, av as fallback, ah as attr, aY as writable, aQ as store_set, aV as unsubscribe_stores } from './ui-libs-BjzLDLAh.js';
import './client-Bo2aevGq.js';

//#region src/lib/components/kids/KidsMovieCard.svelte
function KidsMovieCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let movie = $$props["movie"];
		$$renderer.push(`<div class="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border-4 border-yellow-300 bg-white text-center cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2" role="button" tabindex="0"${attr("aria-label", `Watch ${movie.title}`)}>`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<img${attr("src", movie.thumbnailUrl)}${attr("alt", movie.title)} width="320" height="192" loading="lazy" decoding="async" class="w-full h-48 object-cover"/>`);
		$$renderer.push(`<!--]--> <div class="p-2 bg-pink-100"><h3 class="font-bold text-lg text-pink-700">${escape_html(movie.title)}</h3> `);
		if (movie.genres?.length) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-xs text-gray-600">${escape_html(movie.genres.join(", "))}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
		bind_props($$props, { movie });
	});
}
//#endregion
//#region src/lib/components/kids/CategoryFilter.svelte
function CategoryFilter($$renderer, $$props) {
	let categories = fallback($$props["categories"], () => [], true);
	let selected = $$props["selected"];
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
	bind_props($$props, {
		categories,
		selected
	});
}
//#endregion
//#region src/lib/components/kids/KidsMediaPage.svelte
function KidsMediaPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let title = $$props["title"];
		let mediaData = $$props["mediaData"];
		const selectedCategory = writable(null);
		const filteredMedia = derived$1(selectedCategory, ($selectedCategory) => mediaData.filter((item) => !$selectedCategory || item.genres?.includes($selectedCategory)));
		const allCategories = [...new Set(mediaData.flatMap((m) => m.genres ?? []))].sort();
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<main class="p-4 max-w-7xl mx-auto"><h1 class="text-4xl font-bold text-yellow-600 text-center mb-6">${escape_html(title)}</h1> `);
			CategoryFilter($$renderer, {
				categories: allCategories,
				get selected() {
					return store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory);
				},
				set selected($$value) {
					store_set(selectedCategory, $$value);
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			if (store_get($$store_subs ??= {}, "$filteredMedia", filteredMedia).length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-center mt-12 text-pink-600 text-lg">No media found in this category 💨</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6"><!--[-->`);
				const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$filteredMedia", filteredMedia));
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
		if ($$store_subs) unsubscribe_stores($$store_subs);
		bind_props($$props, {
			title,
			mediaData
		});
	});
}

export { KidsMediaPage as K };
//# sourceMappingURL=KidsMediaPage-BACCi20j.js.map
