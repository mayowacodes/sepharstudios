import { Bt as writable, Et as derived, Ft as unsubscribe_stores, Ht as attr, Mt as store_get, Ot as ensure_array_like, St as attr_class, Wt as escape_html, kt as head } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/index-server.js";
import { t as ComingSoonRow } from "../../../../chunks/ComingSoonRow.js";
import { t as page } from "../../../../chunks/state.js";
import "../../../../chunks/navigation.js";
import { t as MovieCard } from "../../../../chunks/MovieCard.js";
import { t as FeaturedBillboardPanel } from "../../../../chunks/FeaturedBillboardPanel.js";
//#region src/routes/(app)/movies/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const { data } = $$props;
		let allMovies = derived(() => data.movies || []);
		const getNewestTimestamp = (item) => {
			if (item?.createdAt) {
				const t = item.createdAt instanceof Date ? item.createdAt.getTime() : Date.parse(item.createdAt);
				if (!Number.isNaN(t)) return t;
			}
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
			return [...allMovies()].sort((a, b) => {
				const aPoster = !!(a.posterUrl || a.poster_url);
				if (aPoster !== !!(b.posterUrl || b.poster_url)) return aPoster ? -1 : 1;
				return getNewestTimestamp(b) - getNewestTimestamp(a);
			})[0];
		});
		let selectedCategory = writable(null);
		let onlyInProgress = page.url.searchParams.get("inProgress") === "1";
		const hasAnyProgress = derived(() => allMovies().some((m) => typeof m.progressPercent === "number" && m.progressPercent > 0 && m.progressPercent < 95));
		let filteredMovies = derived(() => allMovies().filter((movie) => {
			if (store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory) && !movie.genres?.includes(store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory))) return false;
			if (onlyInProgress && !(typeof movie.progressPercent === "number" && movie.progressPercent > 0 && movie.progressPercent < 95)) return false;
			return true;
		}));
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
			FeaturedBillboardPanel($$renderer, {
				featured: featuredMovie(),
				label: "Just Added"
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		ComingSoonRow($$renderer, { items: data.comingSoon ?? [] });
		$$renderer.push(`<!----> `);
		if (user()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-center text-white/70 font-semibold mb-6">Welcome, ${escape_html(user().name)}!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"><div class="w-full md:w-1/3"><label for="category" class="block text-lg font-semibold mb-2 text-white/80">Filter by Category</label> `);
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
		$$renderer.push(`</div> `);
		if (hasAnyProgress()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button"${attr_class(`self-start md:self-end px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${onlyInProgress ? "border-[#FF5E0E] bg-[#FF5E0E]/20 text-white shadow-[0_0_18px_rgba(255,94,14,0.35)]" : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"}`)}${attr("aria-pressed", onlyInProgress)}>${escape_html(onlyInProgress ? "Showing in progress" : "Continue watching")}</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (filteredMovies().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><p class="text-xl text-white/80">No movies found for this category.</p> <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">Reset Filter</button></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"><!--[-->`);
			const each_array_1 = ensure_array_like(filteredMovies());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let movie = each_array_1[$$index_1];
				MovieCard($$renderer, { movie });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></main></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
