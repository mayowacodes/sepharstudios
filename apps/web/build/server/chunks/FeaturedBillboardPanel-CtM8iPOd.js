import { q as escape_html, i as attr, b as ensure_array_like, x as attr_class, f as derived } from './index.js-DwRgOKlO.js';
import { S as Sparkles } from './sparkles-CSCGS45n.js';
import { C as ComingSoonCard } from './ComingSoonCard-DyZsTeER.js';
import { C as Circle_play } from './circle-play-Bz79mOxb.js';
import './client-BnGpewQC.js';
import { V as Volume_x } from './volume-x-CA54XE_R.js';
import { B as Button } from './button-CGRNF9DE.js';

//#endregion
//#region src/lib/components/sections/ComingSoonRow.svelte
function ComingSoonRow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items, title = "Coming Soon", seeMoreHref = "/coming-soon" } = $$props;
		if (items.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mb-10"><div class="flex items-center justify-between mb-3 px-4"><div class="flex items-center gap-3"><span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]"></span> <h2 class="text-xl font-semibold text-white inline-flex items-center gap-2">`);
			Sparkles($$renderer, { class: "h-5 w-5 text-[#FFBF00]" });
			$$renderer.push(`<!----> ${escape_html(title)}</h2></div> <a${attr("href", seeMoreHref)} class="text-sm text-white/60 hover:text-white">See all →</a></div> <div class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x"><!--[-->`);
			const each_array = ensure_array_like(items);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<div class="shrink-0 w-44 sm:w-48 lg:w-56 snap-start">`);
				ComingSoonCard($$renderer, { item });
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

//#region src/lib/components/FeaturedBillboardPanel.svelte
function FeaturedBillboardPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { featured, label = "Just Added", watchHref, detailHref } = $$props;
		const resolvedWatchHref = derived(() => watchHref ?? `/watch/${featured.slug || featured.id}`);
		$$renderer.push(`<div role="button" tabindex="0"${attr("aria-label", `Open ${featured.title}`)} class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 min-h-[70vh] lg:min-h-[80vh] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5E0E]/70">`);
		if (featured.trailerUrl) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<video${attr("src", featured.trailerUrl)}${attr("poster", featured.thumbnail ?? void 0)} class="absolute inset-0 h-full w-full object-cover" autoplay="" muted="" loop="" playsinline="" preload="metadata"></video>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<img${attr("src", featured.backdropUrl || featured.thumbnail || "")}${attr("alt", featured.title)} class="absolute inset-0 h-full w-full object-cover"/>`);
		}
		$$renderer.push(`<!--]--> <div class="absolute inset-0 bg-linear-to-tr from-black via-black/70 to-transparent pointer-events-none"></div> <div class="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent pointer-events-none"></div> `);
		if (featured.trailerUrl) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button"${attr("aria-label", "Unmute trailer")}${attr("aria-pressed", false)}${attr_class(`absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-full backdrop-blur-md px-4 py-2.5 text-sm font-semibold transition-all border border-white/20 bg-black/40 text-white/80 hover:bg-black/60`)}>`);
			$$renderer.push("<!--[0-->");
			Volume_x($$renderer, { class: "h-5 w-5" });
			$$renderer.push(`<!----> <span class="hidden sm:inline">Muted</span>`);
			$$renderer.push(`<!--]--></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="relative z-10 flex h-full min-h-[70vh] lg:min-h-[80vh] flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-3xl"><div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00] w-fit"><span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span> ${escape_html(label)}</div> <h2 class="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-display drop-shadow">${escape_html(featured.title)}</h2> `);
		if (featured.description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mt-3 text-white/80 line-clamp-3 max-w-2xl text-base sm:text-lg drop-shadow">${escape_html(featured.description)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mt-3 flex flex-wrap gap-3 text-sm text-white/70">`);
		if (featured.year) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(featured.year)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (featured.duration) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(featured.duration)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (featured.quality) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(featured.quality)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="mt-5">`);
		Button($$renderer, {
			size: "lg",
			class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]",
			href: resolvedWatchHref(),
			children: ($$renderer) => {
				Circle_play($$renderer, { class: "mr-2 h-5 w-5" });
				$$renderer.push(`<!----> Watch Now`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div></div>`);
	});
}

export { ComingSoonRow as C, FeaturedBillboardPanel as F };
//# sourceMappingURL=FeaturedBillboardPanel-CtM8iPOd.js.map
