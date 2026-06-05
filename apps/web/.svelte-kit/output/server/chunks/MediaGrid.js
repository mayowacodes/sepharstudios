import { Ot as store_get, St as derived, jt as unsubscribe_stores, kt as store_set, wt as ensure_array_like, zt as escape_html } from "./ui-libs.js";
import { n as mediaModalStore, t as MovieCard } from "./MovieCard.js";
//#region src/lib/components/MediaGrid.svelte
function MediaGrid($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { sections = [], mediaItems = [], title = "Featured" } = $$props;
		const resolvedSections = derived(() => {
			if (sections.length > 0) return sections;
			if (mediaItems.length > 0) return [{
				title,
				items: mediaItems
			}];
			return [];
		});
		const openModal = (media) => {
			store_set(mediaModalStore, {
				...store_get($$store_subs ??= {}, "$mediaModalStore", mediaModalStore),
				isOpen: true,
				media
			});
		};
		$$renderer.push(`<div class="space-y-10"><!--[-->`);
		const each_array = ensure_array_like(resolvedSections());
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let section = each_array[$$index_1];
			$$renderer.push(`<section><div class="flex items-center gap-3 mb-3 px-4"><span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]"></span> <h2 class="text-xl font-semibold text-white">${escape_html(section.title)}</h2></div> `);
			if (section.items.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mx-4 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">No titles available yet.</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x snap-mandatory"><!--[-->`);
				const each_array_1 = ensure_array_like(section.items);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let item = each_array_1[$$index];
					$$renderer.push(`<div class="shrink-0 w-44 sm:w-48 lg:w-56 snap-start">`);
					MovieCard($$renderer, {
						movie: item,
						onClick: () => openModal(item)
					});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></section>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { MediaGrid as t };
