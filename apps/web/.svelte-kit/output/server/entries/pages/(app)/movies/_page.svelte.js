import { At as stringify, It as writable, Lt as attr, Ot as store_get, St as derived, Tt as head, jt as unsubscribe_stores, wt as ensure_array_like, zt as escape_html } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/index-server.js";
import { t as Circle_play } from "../../../../chunks/circle-play.js";
import { t as page } from "../../../../chunks/state.js";
import { t as Button } from "../../../../chunks/button.js";
import { t as MovieCard } from "../../../../chunks/MovieCard.js";
//#region src/routes/(app)/movies/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const { data } = $$props;
		let allMovies = derived(() => data.movies || []);
		const getNewestTimestamp = (item) => {
			if (item?.release_date) {
				const parsed = Date.parse(item.release_date);
				if (!Number.isNaN(parsed)) return parsed;
			}
			if (item?.year) {
				const yearNum = Number.parseInt(item.year, 10);
				if (!Number.isNaN(yearNum)) return new Date(yearNum, 0, 1).getTime();
			}
			return 0;
		};
		const featuredMovie = derived(() => {
			if (!allMovies()?.length) return null;
			return [...allMovies()].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
		});
		let selectedCategory = writable(null);
		let filteredMovies = derived(() => allMovies().filter((movie) => !store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory) || movie.genres?.includes(store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory))));
		let categories = derived(() => {
			const allCategories = /* @__PURE__ */ new Set();
			allMovies().forEach((movie) => movie.genres?.forEach((g) => allCategories.add(g)));
			return Array.from(allCategories).sort();
		});
		const user = derived(() => page.data.user);
		head("ef3vy7", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Christian Movies · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Faith-based and family-friendly movies streaming on Sephar Studios. New releases, classics, documentaries, and more."/>`);
		});
		$$renderer.push(`<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div> <main class="container mx-auto px-4 py-10 relative z-10"><section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto"><div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60"></div> <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]"><span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span> Featured Collection</div> <h1 class="text-5xl sm:text-6xl font-extrabold text-display">Christian Movies</h1> <p class="text-white/70 text-lg">Stream inspiring stories crafted for families and communities.</p></section> `);
		if (featuredMovie()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 surface-glass"><img${attr("src", featuredMovie().backdropUrl || featuredMovie().thumbnail)}${attr("alt", featuredMovie().title)} class="absolute inset-0 h-full w-full object-cover opacity-40"/> <div class="absolute inset-0 veil-strong"></div> <div class="relative z-10 grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]"><div class="space-y-4"><div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]"><span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span> Just Added</div> <h2 class="text-4xl sm:text-5xl font-extrabold text-display">${escape_html(featuredMovie().title)}</h2> <p class="text-white/70 line-clamp-3 max-w-xl">${escape_html(featuredMovie().description)}</p> <div class="flex flex-wrap gap-3 text-sm text-white/60">`);
			if (featuredMovie().year) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredMovie().year)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (featuredMovie().duration) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredMovie().duration)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (featuredMovie().quality) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredMovie().quality)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-3 pt-2">`);
			Button($$renderer, {
				size: "lg",
				class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]",
				href: `/watch/${stringify(featuredMovie().id)}`,
				children: ($$renderer) => {
					Circle_play($$renderer, { class: "mr-2 h-5 w-5" });
					$$renderer.push(`<!----> Watch Now`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="hidden lg:block"><div class="h-full w-full rounded-2xl overflow-hidden border border-[#FFBF00]/40 halo-ring"><img${attr("src", featuredMovie().thumbnail)}${attr("alt", featuredMovie().title)} class="h-full w-full object-cover"/></div></div></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (user()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-center text-white/70 font-semibold mb-6">Welcome, ${escape_html(user().name)}!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex justify-center mb-8"><div class="w-full md:w-1/3"><label for="category" class="block text-lg font-semibold mb-2 text-white/80">Filter by Category</label> `);
		$$renderer.select({
			id: "category",
			value: store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory),
			class: "w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
		}, ($$renderer) => {
			$$renderer.option({ value: null }, ($$renderer) => {
				$$renderer.push(`All Categories`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(categories());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let category = each_array[$$index];
				$$renderer.option({ value: category }, ($$renderer) => {
					$$renderer.push(`${escape_html(category)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div></div> `);
		if (filteredMovies().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><p class="text-xl text-white/80">No movies found for this category.</p> <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">Reset Filter</button></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"><!--[-->`);
			const each_array_1 = ensure_array_like(filteredMovies());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let movie = each_array_1[$$index_1];
				MovieCard($$renderer, {
					movie,
					onClick: () => {}
				});
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></main></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
