import { At as stringify, Lt as attr, St as derived, wt as ensure_array_like, yt as attr_style, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { t as MediaGrid } from "../../../../chunks/MediaGrid.js";
//#region src/routes/kids/teens/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		let sections = derived(() => {
			const content = data.content || [];
			return [
				{
					title: "Teen Movies",
					items: content.filter((item) => item.mediaType === "movie")
				},
				{
					title: "Teen Shows",
					items: content.filter((item) => item.mediaType === "show")
				},
				{
					title: "Teen Documentaries",
					items: content.filter((item) => item.mediaType === "documentary")
				}
			].filter((section) => section.items.length > 0);
		});
		let recentItems = [];
		$$renderer.push(`<div class="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 p-4"><div class="container mx-auto"><header class="text-center mb-8"><h1 class="text-4xl font-bold text-indigo-700 mb-2">Sephar Teens</h1> <p class="text-lg text-indigo-600">Faith-based content tailored for the next generation.</p></header> `);
		if (recentItems.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mb-8"><h2 class="text-xl font-bold text-indigo-700 mb-4">Keep Watching</h2> <div class="flex gap-4 overflow-x-auto pb-2"><!--[-->`);
			const each_array = ensure_array_like(recentItems);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/watch/${stringify(item.id)}?t=${stringify(item.positionSeconds)}`)} class="w-40 shrink-0 group"><div class="relative aspect-video rounded-xl overflow-hidden bg-indigo-200 shadow">`);
				if (item.thumbnail) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", item.thumbnail)}${attr("alt", item.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20"><div class="h-full bg-indigo-500"${attr_style(`width: ${stringify(item.completionPercent)}%`)}></div></div> <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><div class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-indigo-600 text-sm">▶</div></div></div> <p class="text-indigo-800 text-xs font-semibold mt-1 truncate">${escape_html(item.title)}</p></a>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (sections().length > 0) {
			$$renderer.push("<!--[0-->");
			MediaGrid($$renderer, { sections: sections() });
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="p-12 text-center bg-white/50 backdrop-blur rounded-2xl border-2 border-dashed border-indigo-200"><p class="text-indigo-600 font-medium">No teen content available yet. Check back soon!</p></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
