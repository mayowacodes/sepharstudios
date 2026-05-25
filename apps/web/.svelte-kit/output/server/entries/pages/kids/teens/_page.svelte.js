import { a as push_element, b as pop_element, i as ensure_array_like, n as attr, l as stringify, m as attr_style, e as escape_html, F as FILENAME } from "../../../../chunks/ui-libs.js";
import { M as MediaGrid } from "../../../../chunks/MediaGrid.js";
_page[FILENAME] = "src/routes/kids/teens/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const { data } = $$props;
      let sections = (() => {
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
      })();
      let recentItems = [];
      $$renderer2.push(`<div class="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 p-4">`);
      push_element($$renderer2, "div", 36, 0);
      $$renderer2.push(`<div class="container mx-auto">`);
      push_element($$renderer2, "div", 37, 2);
      $$renderer2.push(`<header class="text-center mb-8">`);
      push_element($$renderer2, "header", 38, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-indigo-700 mb-2">`);
      push_element($$renderer2, "h1", 39, 6);
      $$renderer2.push(`Sephar Teens</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-lg text-indigo-600">`);
      push_element($$renderer2, "p", 40, 6);
      $$renderer2.push(`Faith-based content tailored for the next generation.</p>`);
      pop_element();
      $$renderer2.push(`</header>`);
      pop_element();
      $$renderer2.push(` `);
      if (recentItems.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<section class="mb-8">`);
        push_element($$renderer2, "section", 45, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-indigo-700 mb-4">`);
        push_element($$renderer2, "h2", 46, 8);
        $$renderer2.push(`Keep Watching</h2>`);
        pop_element();
        $$renderer2.push(` <div class="flex gap-4 overflow-x-auto pb-2">`);
        push_element($$renderer2, "div", 47, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(recentItems);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer2.push(`<a${attr("href", `/watch/${stringify(item.id)}?t=${stringify(item.positionSeconds)}`)} class="w-40 shrink-0 group">`);
          push_element($$renderer2, "a", 49, 12);
          $$renderer2.push(`<div class="relative aspect-video rounded-xl overflow-hidden bg-indigo-200 shadow">`);
          push_element($$renderer2, "div", 50, 14);
          if (item.thumbnail) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<img${attr("src", item.thumbnail)}${attr("alt", item.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>`);
            push_element($$renderer2, "img", 52, 18);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">`);
          push_element($$renderer2, "div", 54, 16);
          $$renderer2.push(`<div class="h-full bg-indigo-500"${attr_style(`width: ${stringify(item.completionPercent)}%`)}>`);
          push_element($$renderer2, "div", 55, 18);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">`);
          push_element($$renderer2, "div", 57, 16);
          $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-indigo-600 text-sm">`);
          push_element($$renderer2, "div", 58, 18);
          $$renderer2.push(`▶</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <p class="text-indigo-800 text-xs font-semibold mt-1 truncate">`);
          push_element($$renderer2, "p", 61, 14);
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
      $$renderer2.push(`<!--]--> `);
      if (sections.length > 0) {
        $$renderer2.push("<!--[-->");
        MediaGrid($$renderer2, { sections });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="p-12 text-center bg-white/50 backdrop-blur rounded-2xl border-2 border-dashed border-indigo-200">`);
        push_element($$renderer2, "div", 71, 6);
        $$renderer2.push(`<p class="text-indigo-600 font-medium">`);
        push_element($$renderer2, "p", 72, 8);
        $$renderer2.push(`No teen content available yet. Check back soon!</p>`);
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
export {
  _page as default
};
