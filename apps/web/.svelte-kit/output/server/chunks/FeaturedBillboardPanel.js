import { Et as derived, Ht as attr, St as attr_class, Wt as escape_html } from "./ui-libs.js";
import { t as Circle_play } from "./circle-play.js";
import "./ComingSoonRow.js";
import { t as Volume_x } from "./volume-x.js";
import "./navigation.js";
import { t as Button } from "./button.js";
//#region src/lib/components/FeaturedBillboardPanel.svelte
function FeaturedBillboardPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { featured, label = "Just Added", watchHref, detailHref } = $$props;
		const resolvedWatchHref = derived(() => watchHref ?? `/watch/${featured.slug || featured.id}`);
		derived(() => {
			if (detailHref) return detailHref;
			const slug = featured.slug || featured.id;
			if (featured.category === "kids") return `/kids/kiddies/${slug}`;
			if (featured.category === "teens") return `/kids/teens/${slug}`;
			return `/movies/${slug}`;
		});
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
//#endregion
export { FeaturedBillboardPanel as t };
