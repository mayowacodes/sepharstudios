import { a as push_element, b as pop_element, F as FILENAME } from "../../../chunks/ui-libs.js";
import "clsx";
import "../../../chunks/button.js";
import { p as page } from "../../../chunks/index2.js";
import "../../../chunks/MediaGrid.js";
import "../../../chunks/RecentlyWatched.js";
_page[FILENAME] = "src/routes/(app)/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const { data } = $$props;
      page.data.user;
      [
        { title: "Trending Movies", items: data.movies || [] },
        { title: "Popular Shows", items: data.shows || [] },
        {
          title: "Inspiring Documentaries",
          items: data.documentaries || []
        }
      ];
      $$renderer2.push(`<div class="relative overflow-hidden min-h-screen bg-(--surface-charcoal) text-white">`);
      push_element($$renderer2, "div", 28, 0);
      $$renderer2.push(`<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]">`);
      push_element($$renderer2, "div", 29, 2);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <main class="container relative z-10 pt-32 pb-16 mx-auto px-4">`);
      push_element($$renderer2, "main", 32, 2);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></main>`);
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
