import { b as push_element, d as pop_element, e as ensure_array_like, g as attr, i as stringify, w as attr_style, l as escape_html, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { M as MediaGrid } from './MediaGrid-BerYjXrF.js';
import './MovieCard-CK0_TNVz.js';
import './client2-D3ciM3yf.js';
import './exports-BuGzoaN1.js';
import './play-Ba0LGIvv.js';
import './Icon-DVHDtCfs.js';

_page[FILENAME] = "src/routes/kids/kiddies/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const { data } = $$props;
      let sections = (() => {
        const content = data.content || [];
        return [
          {
            title: "Kiddies Movies",
            items: content.filter((item) => item.mediaType === "movie")
          },
          {
            title: "Kiddies Shows",
            items: content.filter((item) => item.mediaType === "show")
          },
          {
            title: "Kiddies Documentaries",
            items: content.filter((item) => item.mediaType === "documentary")
          }
        ].filter((section) => section.items.length > 0);
      })();
      let recentItems = [];
      $$renderer2.push(`<div class="min-h-screen bg-linear-to-br from-yellow-50 to-pink-100 p-4">`);
      push_element($$renderer2, "div", 37, 0);
      $$renderer2.push(`<div class="container mx-auto">`);
      push_element($$renderer2, "div", 38, 2);
      $$renderer2.push(`<header class="text-center mb-8">`);
      push_element($$renderer2, "header", 39, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-pink-700 mb-2">`);
      push_element($$renderer2, "h1", 40, 6);
      $$renderer2.push(`Faith Kids - Kiddies</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-lg text-pink-600">`);
      push_element($$renderer2, "p", 41, 6);
      $$renderer2.push(`Safe, fun, and faith-filled content for little ones!</p>`);
      pop_element();
      $$renderer2.push(`</header>`);
      pop_element();
      $$renderer2.push(` `);
      if (recentItems.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<section class="mb-8">`);
        push_element($$renderer2, "section", 46, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-pink-700 mb-4">`);
        push_element($$renderer2, "h2", 47, 8);
        $$renderer2.push(`Keep Watching 🎬</h2>`);
        pop_element();
        $$renderer2.push(` <div class="flex gap-4 overflow-x-auto pb-2">`);
        push_element($$renderer2, "div", 48, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(recentItems);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer2.push(`<a${attr("href", `/watch/${stringify(item.id)}?t=${stringify(item.positionSeconds)}`)} class="w-40 shrink-0 group">`);
          push_element($$renderer2, "a", 50, 12);
          $$renderer2.push(`<div class="relative aspect-video rounded-xl overflow-hidden bg-pink-200 shadow">`);
          push_element($$renderer2, "div", 51, 14);
          if (item.thumbnail) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<img${attr("src", item.thumbnail)}${attr("alt", item.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>`);
            push_element($$renderer2, "img", 53, 18);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">`);
          push_element($$renderer2, "div", 55, 16);
          $$renderer2.push(`<div class="h-full bg-pink-500"${attr_style(`width: ${stringify(item.completionPercent)}%`)}>`);
          push_element($$renderer2, "div", 56, 18);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">`);
          push_element($$renderer2, "div", 58, 16);
          $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-pink-600 text-sm">`);
          push_element($$renderer2, "div", 59, 18);
          $$renderer2.push(`▶</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <p class="text-pink-800 text-xs font-semibold mt-1 truncate">`);
          push_element($$renderer2, "p", 62, 14);
          $$renderer2.push(`${escape_html(item.title)}</p>`);
          pop_element();
          $$renderer2.push(`</a>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</section>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <section class="mb-8">`);
      push_element($$renderer2, "section", 70, 4);
      $$renderer2.push(`<a href="/kids/kiddies/bible-quiz" class="flex items-center gap-4 bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-300 rounded-2xl p-4 transition-colors">`);
      push_element($$renderer2, "a", 71, 6);
      $$renderer2.push(`<div class="text-4xl">`);
      push_element($$renderer2, "div", 75, 8);
      $$renderer2.push(`📖</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 76, 8);
      $$renderer2.push(`<p class="font-bold text-indigo-800">`);
      push_element($$renderer2, "p", 77, 10);
      $$renderer2.push(`Bible Quiz Time!</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-indigo-600 text-sm">`);
      push_element($$renderer2, "p", 78, 10);
      $$renderer2.push(`Answer questions and earn STC stars</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="ml-auto text-indigo-400 text-xl">`);
      push_element($$renderer2, "div", 80, 8);
      $$renderer2.push(`→</div>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` `);
      if (sections.length > 0) {
        $$renderer2.push("<!--[-->");
        MediaGrid($$renderer2, { sections });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="p-12 text-center bg-white/50 backdrop-blur rounded-2xl border-2 border-dashed border-pink-200">`);
        push_element($$renderer2, "div", 87, 6);
        $$renderer2.push(`<p class="text-pink-600 font-medium">`);
        push_element($$renderer2, "p", 88, 8);
        $$renderer2.push(`No kiddies content available yet. Check back soon!</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-B6PbjZfZ.js.map
