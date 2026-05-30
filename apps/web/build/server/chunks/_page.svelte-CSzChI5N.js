import { at as head, aa as attr, an as escape_html, aK as stringify, al as ensure_array_like, ai as derived, ao as fallback, ae as bind_props } from './ui-libs-TtGtWAGI.js';
import { B as Bookmark } from './bookmark-ChhX2gSi.js';
import { C as Circle_play } from './circle-play-4IU9Q_fn.js';
import { P as Play } from './play-EdV4ja4g.js';
import { p as page } from './state-Cm-InHWy.js';
import './client-CZa6R-ON.js';
import { B as Button } from './button-D9M18H3C.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CGEdwVFL.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

//#region src/lib/components/TVShowCard.svelte
function TVShowCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let show = $$props["show"];
		let onClick = fallback($$props["onClick"], () => {});
		let onHover = fallback($$props["onHover"], () => {});
		$$renderer.push(`<div role="button" tabindex="0" class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-[1.02]"${attr("aria-label", `Watch ${show.title}`)}><div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<img${attr("src", show.thumbnail || "/placeholder-vertical.jpg")} alt="" width="280" height="420" loading="lazy" decoding="async" class="w-full h-full object-cover"/>`);
		$$renderer.push(`<!--]--> <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div></div> `);
		if (show.isNew) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">New Episode</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><h3 class="text-sm font-semibold line-clamp-2 text-white">${escape_html(show.title)}</h3> <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">`);
		if (show.rating) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">${escape_html(show.rating)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (show.duration) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(show.duration)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (show.quality) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(show.quality)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="mt-3 flex items-center gap-2"><button class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"${attr("aria-label", `Play ${show.title}`)}>`);
		Play($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Play</button> <button class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"${attr("aria-label", `Add ${show.title} to My List`)}>`);
		Bookmark($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> My List</button></div></div></div>`);
		bind_props($$props, {
			show,
			onClick,
			onHover
		});
	});
}
//#endregion
//#region src/routes/(app)/shows/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		let allTVShows = derived(() => data.shows || []);
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
		const featuredShow = derived(() => {
			if (!allTVShows()?.length) return null;
			return [...allTVShows()].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
		});
		let selectedCategory = null;
		let filteredTVShows = derived(() => allTVShows().filter((show) => true));
		let categories = derived(() => {
			const allCategories = /* @__PURE__ */ new Set();
			allTVShows().forEach((show) => show.genres?.forEach((g) => allCategories.add(g)));
			return Array.from(allCategories).sort();
		});
		const user = derived(() => page.data.user);
		head("1aqy6ts", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Christian TV Shows · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Faith-based and family-friendly TV shows streaming on Sephar Studios. Watch full seasons, new episodes, and exclusive originals."/>`);
		});
		$$renderer.push(`<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div> <main class="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 relative z-10"><section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto"><div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60"></div> <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]"><span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span> Featured Series</div> <h1 class="text-5xl sm:text-6xl font-extrabold text-display">Christian TV Shows</h1> <p class="text-white/70 text-lg">Seasoned stories and faith‑forward series for every age.</p></section> `);
		if (featuredShow()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 surface-glass"><img${attr("src", featuredShow().backdropUrl || featuredShow().thumbnail)}${attr("alt", featuredShow().title)} class="absolute inset-0 h-full w-full object-cover opacity-40"/> <div class="absolute inset-0 veil-strong"></div> <div class="relative z-10 grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]"><div class="space-y-4"><div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]"><span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span> New Series</div> <h2 class="text-4xl sm:text-5xl font-extrabold text-display">${escape_html(featuredShow().title)}</h2> <p class="text-white/70 line-clamp-3 max-w-xl">${escape_html(featuredShow().description)}</p> <div class="flex flex-wrap gap-3 text-sm text-white/60">`);
			if (featuredShow().year) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredShow().year)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (featuredShow().duration) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredShow().duration)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (featuredShow().quality) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredShow().quality)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-3 pt-2">`);
			Button($$renderer, {
				size: "lg",
				class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]",
				href: `/watch/${stringify(featuredShow().id)}`,
				children: ($$renderer) => {
					Circle_play($$renderer, { class: "mr-2 h-5 w-5" });
					$$renderer.push(`<!----> Watch Now`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="hidden lg:block"><div class="h-full w-full rounded-2xl overflow-hidden border border-[#FFBF00]/40 halo-ring"><img${attr("src", featuredShow().thumbnail)}${attr("alt", featuredShow().title)} class="h-full w-full object-cover"/></div></div></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (user()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-center text-white/70 font-semibold mb-6">Welcome, ${escape_html(user().name)}!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex justify-center mb-8"><div class="w-full md:w-1/3"><label for="category" class="block text-lg font-semibold mb-2 text-white/80">Filter by Category</label> `);
		$$renderer.select({
			id: "category",
			value: selectedCategory,
			class: "w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
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
		if (filteredTVShows().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><p class="text-xl text-white/80">No TV shows found for this category.</p> <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">Reset Filter</button></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"><!--[-->`);
			const each_array_1 = ensure_array_like(filteredTVShows());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let show = each_array_1[$$index_1];
				TVShowCard($$renderer, {
					show,
					onClick: () => {}
				});
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></main></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CSzChI5N.js.map
