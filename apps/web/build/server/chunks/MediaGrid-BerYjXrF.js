import { b as push_element, e as ensure_array_like, d as pop_element, l as escape_html, F as FILENAME, aa as store_set, j as store_get, u as unsubscribe_stores } from './ui-libs-Yf6h8PPk.js';
import { M as MovieCard, m as mediaModalStore } from './MovieCard-CK0_TNVz.js';

MediaGrid[FILENAME] = "src/lib/components/MediaGrid.svelte";
function MediaGrid($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let { sections = [], mediaItems = [], title = "Featured" } = $$props;
      const resolvedSections = (() => {
        if (sections.length > 0) return sections;
        if (mediaItems.length > 0) return [{ title, items: mediaItems }];
        return [];
      })();
      const openModal = (media) => {
        store_set(mediaModalStore, {
          ...store_get($$store_subs ??= {}, "$mediaModalStore", mediaModalStore),
          isOpen: true,
          media
        });
      };
      $$renderer2.push(`<div class="space-y-10">`);
      push_element($$renderer2, "div", 25, 0);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(resolvedSections);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let section = each_array[$$index_1];
        $$renderer2.push(`<section>`);
        push_element($$renderer2, "section", 27, 4);
        $$renderer2.push(`<div class="flex items-center gap-3 mb-3 px-4">`);
        push_element($$renderer2, "div", 28, 6);
        $$renderer2.push(`<span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]">`);
        push_element($$renderer2, "span", 29, 8);
        $$renderer2.push(`</span>`);
        pop_element();
        $$renderer2.push(` <h2 class="text-xl font-semibold text-white">`);
        push_element($$renderer2, "h2", 30, 8);
        $$renderer2.push(`${escape_html(section.title)}</h2>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (section.items.length === 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="mx-4 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">`);
          push_element($$renderer2, "div", 34, 8);
          $$renderer2.push(`No titles available yet.</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x snap-mandatory">`);
          push_element($$renderer2, "div", 38, 8);
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(section.items);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let item = each_array_1[$$index];
            $$renderer2.push(`<div class="shrink-0 w-44 sm:w-48 lg:w-56 snap-start">`);
            push_element($$renderer2, "div", 42, 12);
            MovieCard($$renderer2, { movie: item, onClick: () => openModal(item) });
            $$renderer2.push(`<!----></div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></section>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    MediaGrid
  );
}
MediaGrid.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { MediaGrid as M };
//# sourceMappingURL=MediaGrid-BerYjXrF.js.map
