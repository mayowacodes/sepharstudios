import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { O as fallback, E as escape_html, m as ensure_array_like, u as attr, H as bind_props, C as attr_class, D as attr_style } from './index-C14HL8mA.js';
import './MovieCard-CvwAgsPz.js';
import './client2-BtPpI286.js';
import { M as MediaGrid } from './MediaGrid-BrYW30GP.js';
import 'hls.js';
import './dropdown-menu-trigger-DAk9gdtZ.js';
import './button-B5TxIyzE.js';
import { f as faithMovies } from './movies-Djfl5jjt.js';
import { f as faithTVShows } from './shows-BXPO8af7.js';
import { f as faithDocumentaries } from './documentaries-ZWPE74Cv.js';
import './index3-CnQVvK5M.js';
import './exports-BuGzoaN1.js';
import './client-CreTuECU.js';
import './scroll-lock-BKaGX-xL.js';
import './noop-JjG5qwPG.js';
import './create-id-ozwDP4rH.js';
import './watch.svelte-ALR66MkX.js';
import './index-server-_G0R5Qhl.js';
import './events-DndNBaun.js';
import './dom-context.svelte-DOhd7vND.js';
import './popper-layer-force-mount-DvMEtyRB.js';
import './utils2-C-_3GP94.js';

SkeletonLoader[FILENAME] = "src/lib/components/widgets/SkeletonLoader.svelte";
function SkeletonLoader($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let width = fallback(
        $$props["width"],
        "100%"
        // Default width, can be overridden
      );
      let height = fallback(
        $$props["height"],
        "100px"
        // Default height, can be overridden
      );
      let rounded = fallback(
        $$props["rounded"],
        true
        // Whether the skeleton is rounded
      );
      let className = fallback(
        $$props["className"],
        ""
        // Additional classes for custom styling
      );
      $$renderer2.push(`<div${attr_class(`bg-gray-300 animate-pulse ${rounded ? "rounded-lg" : ""} ${className}`)}${attr_style(`width: ${width}; height: ${height};`)}>`);
      push_element($$renderer2, "div", 8, 0);
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { width, height, rounded, className });
    },
    SkeletonLoader
  );
}
SkeletonLoader.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
HeroCarousel[FILENAME] = "src/lib/components/HeroCarousel.svelte";
function HeroCarousel($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let mediaItems = fallback($$props["mediaItems"], () => [], true);
      let sectionTitle = fallback($$props["sectionTitle"], "Trending");
      $$renderer2.push(`<div class="section">`);
      push_element($$renderer2, "div", 41, 0);
      $$renderer2.push(`<h2 class="text-3xl font-bold mb-6">`);
      push_element($$renderer2, "h2", 42, 2);
      $$renderer2.push(`${escape_html(sectionTitle)}</h2>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
        SkeletonLoader($$renderer2, { width: "100%", height: "200px", className: "mb-4" });
        $$renderer2.push(`<!----> <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">`);
        push_element($$renderer2, "div", 54, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(mediaItems);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let item = each_array_1[$$index_1];
          $$renderer2.push(`<div class="relative rounded-lg overflow-hidden group cursor-pointer" role="button" tabindex="0"${attr("aria-label", `Open modal for ${item.title}`)}>`);
          push_element($$renderer2, "div", 56, 8);
          {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<img${attr("src", item.thumbnail)}${attr("alt", item.title)} class="w-full h-full object-cover"/>`);
            push_element($$renderer2, "img", 75, 12);
            pop_element();
          }
          $$renderer2.push(`<!--]--> <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">`);
          push_element($$renderer2, "div", 83, 10);
          $$renderer2.push(`<h3 class="text-white text-lg font-bold">`);
          push_element($$renderer2, "h3", 84, 12);
          $$renderer2.push(`${escape_html(item.title)}</h3>`);
          pop_element();
          $$renderer2.push(` <p class="text-white text-sm">`);
          push_element($$renderer2, "p", 85, 12);
          $$renderer2.push(`${escape_html(item.description)}</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="absolute bottom-4 left-4">`);
          push_element($$renderer2, "div", 103, 10);
          $$renderer2.push(`<button class="bg-[#FF5E0E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FFBF00] transition"${attr("aria-label", `Watch Now: ${item.title}`)}>`);
          push_element($$renderer2, "button", 104, 12);
          $$renderer2.push(`Watch Now</button>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { mediaItems, sectionTitle });
    },
    HeroCarousel
  );
}
HeroCarousel.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/features/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const featuredContent = [
        ...faithMovies.filter((m) => m.featured),
        ...faithTVShows.filter((s) => s.featured),
        ...faithDocumentaries.filter((d) => d.featured)
      ];
      $$renderer2.push(`<main class="space-y-12 pb-12">`);
      push_element($$renderer2, "main", 22, 2);
      $$renderer2.push(`<section class="relative">`);
      push_element($$renderer2, "section", 24, 4);
      HeroCarousel($$renderer2, { mediaItems: featuredContent });
      $$renderer2.push(`<!----></section>`);
      pop_element();
      $$renderer2.push(` <section class="container mx-auto px-4">`);
      push_element($$renderer2, "section", 34, 4);
      MediaGrid($$renderer2, {
        mediaItems: (
          /* handle play action */
          faithMovies
        ),
        title: "Faith-Based Movies"
      });
      $$renderer2.push(`<!----></section>`);
      pop_element();
      $$renderer2.push(` <section class="container mx-auto px-4">`);
      push_element($$renderer2, "section", 39, 4);
      MediaGrid($$renderer2, { mediaItems: faithTVShows, title: "Christian TV Shows" });
      $$renderer2.push(`<!----></section>`);
      pop_element();
      $$renderer2.push(` <section class="container mx-auto px-4">`);
      push_element($$renderer2, "section", 44, 4);
      MediaGrid($$renderer2, {
        mediaItems: faithDocumentaries,
        title: "Christian Documentaries"
      });
      $$renderer2.push(`<!----></section>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></main>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-BWA_jObT.js.map
