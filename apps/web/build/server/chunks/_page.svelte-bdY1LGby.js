import { q as escape_html, b as ensure_array_like, i as attr, x as attr_class, ae as attr_style } from './index.js-CxPEndTa.js';
import './mediaModalStore-lqgzamJ3.js';
import { M as MediaGrid } from './MediaGrid-B0XzqJAh.js';
import { f as faithDocumentaries } from './documentaries-Bz8JPNE4.js';
import { f as faithMovies } from './movies-DFhk2mG9.js';
import { f as faithTVShows } from './shows-CM5HuZnq.js';
import './MovieCard-DcMJPgbN.js';
import './bookmark-ZSZZcAps.js';
import './Icon-Bw1rnKTC.js';
import './play-DF_bgYie.js';
import './client-DsZfmj3l.js';
import './myList-e_4PgnNM.js';
import './toast-state.svelte-jhYVYtU8.js';
import './recency-DE3UXdE2.js';

//#region src/lib/components/widgets/SkeletonLoader.svelte
function SkeletonLoader($$renderer, $$props) {
	let { width = "100%", height = "100px", rounded = true, className = "" } = $$props;
	$$renderer.push(`<div${attr_class(`bg-gray-300 animate-pulse ${rounded ? "rounded-lg" : ""} ${className}`)}${attr_style(`width: ${width}; height: ${height};`)}></div>`);
}
//#endregion
//#region src/lib/components/HeroCarousel.svelte
function HeroCarousel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { mediaItems = [], sectionTitle = "Trending" } = $$props;
		$$renderer.push(`<div class="section"><h2 class="text-3xl font-bold mb-6">${escape_html(sectionTitle)}</h2> `);
		{
			$$renderer.push("<!--[-1-->");
			SkeletonLoader($$renderer, {
				width: "100%",
				height: "200px",
				className: "mb-4"
			});
			$$renderer.push(`<!----> <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"><!--[-->`);
			const each_array_1 = ensure_array_like(mediaItems);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let item = each_array_1[$$index_1];
				$$renderer.push(`<div class="relative rounded-lg overflow-hidden group cursor-pointer" role="button" tabindex="0"${attr("aria-label", `Open modal for ${item.title}`)}>`);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<img${attr("src", item.thumbnail)}${attr("alt", item.title)} class="w-full h-full object-cover"/>`);
				$$renderer.push(`<!--]--> <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4"><h3 class="text-white text-lg font-bold">${escape_html(item.title)}</h3> <p class="text-white text-sm">${escape_html(item.description)}</p></div> `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="absolute bottom-4 left-4"><button class="bg-[#FF5E0E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FFBF00] transition"${attr("aria-label", `Watch Now: ${item.title}`)}>Watch Now</button></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/routes/(app)/features/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const featuredContent = [
			...faithMovies.filter((m) => m.featured),
			...faithTVShows.filter((s) => s.featured),
			...faithDocumentaries.filter((d) => d.featured)
		];
		$$renderer.push(`<main class="space-y-12 pb-12"><section class="relative">`);
		HeroCarousel($$renderer, { mediaItems: featuredContent });
		$$renderer.push(`<!----></section> <section class="container mx-auto px-4">`);
		MediaGrid($$renderer, {
			mediaItems: faithMovies,
			title: "Faith-Based Movies"
		});
		$$renderer.push(`<!----></section> <section class="container mx-auto px-4">`);
		MediaGrid($$renderer, {
			mediaItems: faithTVShows,
			title: "Christian TV Shows"
		});
		$$renderer.push(`<!----></section> <section class="container mx-auto px-4">`);
		MediaGrid($$renderer, {
			mediaItems: faithDocumentaries,
			title: "Christian Documentaries"
		});
		$$renderer.push(`<!----></section>  `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></main>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-bdY1LGby.js.map
