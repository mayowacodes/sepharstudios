import { H as bind_props, E as escape_html, M as store_get, m as ensure_array_like, O as fallback, u as attr, P as store_set, N as unsubscribe_stores } from './index-C14HL8mA.js';
import './client2-BtPpI286.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { d as derived, w as writable } from './index3-CnQVvK5M.js';

KidsMovieCard[FILENAME] = "src/lib/components/kids/KidsMovieCard.svelte";
function KidsMovieCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let movie = $$props["movie"];
      $$renderer2.push(`<div class="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border-4 border-yellow-300 bg-white text-center cursor-pointer" role="button" tabindex="0">`);
      push_element($$renderer2, "div", 19, 0);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", movie.thumbnailUrl)}${attr("alt", movie.title)} class="w-full h-48 object-cover" loading="lazy"/>`);
        push_element($$renderer2, "img", 40, 4);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="p-2 bg-pink-100">`);
      push_element($$renderer2, "div", 48, 2);
      $$renderer2.push(`<h3 class="font-bold text-lg text-pink-700">`);
      push_element($$renderer2, "h3", 49, 4);
      $$renderer2.push(`${escape_html(movie.title)}</h3>`);
      pop_element();
      $$renderer2.push(` `);
      if (movie.genres?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xs text-gray-600">`);
        push_element($$renderer2, "p", 51, 6);
        $$renderer2.push(`${escape_html(movie.genres.join(", "))}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { movie });
    },
    KidsMovieCard
  );
}
KidsMovieCard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CategoryFilter[FILENAME] = "src/lib/components/kids/CategoryFilter.svelte";
function CategoryFilter($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let categories = fallback($$props["categories"], () => [], true);
      let selected = $$props["selected"];
      $$renderer2.push(`<div class="text-center mb-6">`);
      push_element($$renderer2, "div", 6, 0);
      $$renderer2.push(`<label for="genre-select" class="text-md font-semibold mr-2">`);
      push_element($$renderer2, "label", 7, 2);
      $$renderer2.push(`🎬 Choose a Genre:</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "genre-select",
          value: selected,
          class: "p-2 border border-yellow-400 rounded bg-white text-gray-800"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: null }, ($$renderer4) => {
            $$renderer4.push(`All`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(categories);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let cat = each_array[$$index];
            $$renderer3.option({ value: cat }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(cat)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { categories, selected });
    },
    CategoryFilter
  );
}
CategoryFilter.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
KidsMediaPage[FILENAME] = "src/lib/components/kids/KidsMediaPage.svelte";
function KidsMediaPage($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let title = $$props["title"];
      let mediaData = $$props["mediaData"];
      const selectedCategory = writable(null);
      const filteredMedia = derived(selectedCategory, ($selectedCategory) => mediaData.filter((item) => !$selectedCategory || item.genres?.includes($selectedCategory)));
      const allCategories = [...new Set(mediaData.flatMap((m) => m.genres ?? []))].sort();
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<main class="p-4 max-w-7xl mx-auto">`);
        push_element($$renderer3, "main", 17, 0);
        $$renderer3.push(`<h1 class="text-4xl font-bold text-yellow-600 text-center mb-6">`);
        push_element($$renderer3, "h1", 18, 2);
        $$renderer3.push(`${escape_html(title)}</h1>`);
        pop_element();
        $$renderer3.push(` `);
        CategoryFilter($$renderer3, {
          categories: allCategories,
          get selected() {
            return store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory);
          },
          set selected($$value) {
            store_set(selectedCategory, $$value);
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        if (store_get($$store_subs ??= {}, "$filteredMedia", filteredMedia).length === 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="text-center mt-12 text-pink-600 text-lg">`);
          push_element($$renderer3, "p", 23, 4);
          $$renderer3.push(`No media found in this category 💨</p>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">`);
          push_element($$renderer3, "div", 25, 4);
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$filteredMedia", filteredMedia));
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let movie = each_array[$$index];
            KidsMovieCard($$renderer3, { movie });
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--></main>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { title, mediaData });
    },
    KidsMediaPage
  );
}
KidsMediaPage.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { KidsMediaPage as K };
//# sourceMappingURL=KidsMediaPage-B8GIHLA3.js.map
