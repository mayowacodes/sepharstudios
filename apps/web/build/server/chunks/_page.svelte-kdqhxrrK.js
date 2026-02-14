import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { M as MediaGrid } from './MediaGrid-BrYW30GP.js';
import { k as kidsMovies } from './kidsmovies-BEz4-jwt.js';
import { k as kidsShows } from './kidsshows-CVyWX38U.js';
import { k as kidsDocumentaries } from './kidsdocumentaries-CvDkAnJc.js';
import './index-C14HL8mA.js';
import './MovieCard-CvwAgsPz.js';
import './index3-CnQVvK5M.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './client-CreTuECU.js';

_page[FILENAME] = "src/routes/(app)/kids/kiddies/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const sections = [
        { title: "Kids Movies", items: kidsMovies },
        { title: "Kids Shows", items: kidsShows },
        { title: "Kids Documentaries", items: kidsDocumentaries }
      ];
      $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 p-4">`);
      push_element($$renderer2, "div", 25, 0);
      $$renderer2.push(`<div class="container mx-auto">`);
      push_element($$renderer2, "div", 26, 2);
      $$renderer2.push(`<header class="text-center mb-8">`);
      push_element($$renderer2, "header", 27, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-pink-700 mb-2">`);
      push_element($$renderer2, "h1", 28, 6);
      $$renderer2.push(`Faith Kids - Kiddies</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-lg text-pink-600">`);
      push_element($$renderer2, "p", 29, 6);
      $$renderer2.push(`Safe, fun, and faith-filled content for little ones!</p>`);
      pop_element();
      $$renderer2.push(`</header>`);
      pop_element();
      $$renderer2.push(` `);
      MediaGrid($$renderer2, { sections, mediaItems: [], title: "Kiddies Content" });
      $$renderer2.push(`<!----></div>`);
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
//# sourceMappingURL=_page.svelte-kdqhxrrK.js.map
