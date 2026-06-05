import { At as stringify, Lt as attr, St as derived, Tt as head, wt as ensure_array_like, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { t as Bookmark } from "../../../../chunks/bookmark.js";
import { t as Circle_play } from "../../../../chunks/circle-play.js";
import { t as Play } from "../../../../chunks/play.js";
import { t as page } from "../../../../chunks/state.js";
import "../../../../chunks/navigation.js";
import { t as Button } from "../../../../chunks/button.js";
//#region src/lib/components/DocumentaryCard.svelte
function DocumentaryCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { documentary, onClick = () => {}, onHover = () => {} } = $$props;
		$$renderer.push(`<div role="button" tabindex="0" class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-[1.02]"${attr("aria-label", `Watch ${documentary.title}`)}><div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<img${attr("src", documentary.thumbnail || "/placeholder-vertical.jpg")} alt="" width="280" height="420" loading="lazy" decoding="async" class="w-full h-full object-cover"/>`);
		$$renderer.push(`<!--]--> <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div></div> `);
		if (documentary.isNew) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">New Episode</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><h3 class="text-sm font-semibold line-clamp-2 text-white">${escape_html(documentary.title)}</h3> <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">`);
		if (documentary.rating) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">${escape_html(documentary.rating)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (documentary.duration) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(documentary.duration)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (documentary.quality) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(documentary.quality)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="mt-3 flex items-center gap-2"><button class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"${attr("aria-label", `Play ${documentary.title}`)}>`);
		Play($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Play</button> <button class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"${attr("aria-label", `Add ${documentary.title} to My List`)}>`);
		Bookmark($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> My List</button></div></div></div>`);
	});
}
//#endregion
//#region src/routes/(app)/documentaries/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		let allDocumentaries = derived(() => data.documentaries || []);
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
		const featuredDocumentary = derived(() => {
			if (!allDocumentaries()?.length) return null;
			return [...allDocumentaries()].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
		});
		let selectedCategory = null;
		let selectedTopic = null;
		let filteredDocumentaries = derived(() => allDocumentaries().filter((doc) => {
			return true;
		}));
		let categories = derived(() => {
			const allCategories = /* @__PURE__ */ new Set();
			allDocumentaries().forEach((doc) => doc.genres?.forEach((g) => allCategories.add(g)));
			return Array.from(allCategories).sort();
		});
		let topics = derived(() => {
			const allTopics = /* @__PURE__ */ new Set();
			allDocumentaries().forEach((doc) => doc.topics?.forEach((t) => allTopics.add(t)));
			return Array.from(allTopics).sort();
		});
		const user = derived(() => page.data.user);
		head("fpi0tv", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Christian Documentaries · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Inspiring faith-based documentaries — biographies, ministry stories, theological deep-dives, and more. Streaming on Sephar Studios."/>`);
		});
		$$renderer.push(`<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div> <main class="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 relative z-10"><section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto"><div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60"></div> <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]"><span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span> Deep Dive</div> <h1 class="text-5xl sm:text-6xl font-extrabold text-display">Documentary Collection</h1> <p class="text-white/70 text-lg">Explore faith, history, and inspiring journeys in depth.</p></section> `);
		if (featuredDocumentary()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 surface-glass"><img${attr("src", featuredDocumentary().backdropUrl || featuredDocumentary().thumbnail)}${attr("alt", featuredDocumentary().title)} class="absolute inset-0 h-full w-full object-cover opacity-40"/> <div class="absolute inset-0 veil-strong"></div> <div class="relative z-10 grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]"><div class="space-y-4"><div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]"><span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span> Just Added</div> <h2 class="text-4xl sm:text-5xl font-extrabold text-display">${escape_html(featuredDocumentary().title)}</h2> <p class="text-white/70 line-clamp-3 max-w-xl">${escape_html(featuredDocumentary().description)}</p> <div class="flex flex-wrap gap-3 text-sm text-white/60">`);
			if (featuredDocumentary().year) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredDocumentary().year)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (featuredDocumentary().duration) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredDocumentary().duration)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (featuredDocumentary().quality) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>${escape_html(featuredDocumentary().quality)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-3 pt-2">`);
			Button($$renderer, {
				size: "lg",
				class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]",
				href: `/watch/${stringify(featuredDocumentary().id)}`,
				children: ($$renderer) => {
					Circle_play($$renderer, { class: "mr-2 h-5 w-5" });
					$$renderer.push(`<!----> Watch Now`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="hidden lg:block"><div class="h-full w-full rounded-2xl overflow-hidden border border-[#FFBF00]/40 halo-ring"><img${attr("src", featuredDocumentary().thumbnail)}${attr("alt", featuredDocumentary().title)} class="h-full w-full object-cover"/></div></div></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (user()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-center text-white/70 font-semibold mb-6">Welcome, ${escape_html(user().name)}!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex flex-col md:flex-row justify-center gap-6 mb-8"><div class="w-full md:w-1/3"><label for="category" class="block text-lg font-semibold mb-2 text-white/80">Filter by Genre</label> `);
		$$renderer.select({
			id: "category",
			value: selectedCategory,
			class: "w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`All Genres`);
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
		$$renderer.push(`</div> <div class="w-full md:w-1/3"><label for="topic" class="block text-lg font-semibold mb-2 text-white/80">Filter by Topic</label> `);
		$$renderer.select({
			id: "topic",
			value: selectedTopic,
			class: "w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`All Topics`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(topics());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let topic = each_array_1[$$index_1];
				$$renderer.option({ value: topic }, ($$renderer) => {
					$$renderer.push(`${escape_html(topic)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (filteredDocumentaries().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><p class="text-xl text-white/80">No documentaries found matching your filters.</p> <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">Show All Documentaries</button></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
			const each_array_2 = ensure_array_like(filteredDocumentaries());
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let doc = each_array_2[$$index_2];
				DocumentaryCard($$renderer, { documentary: doc });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></main></div>`);
	});
}
//#endregion
export { _page as default };
