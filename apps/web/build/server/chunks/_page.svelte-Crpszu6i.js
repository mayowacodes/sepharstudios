import { j as store_get, b as push_element, d as pop_element, g as attr, l as escape_html, p as prevent_snippet_stringification, i as stringify, e as ensure_array_like, u as unsubscribe_stores, x as writable, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { p as page } from './index2-DBoVEfQm.js';
import { M as MovieCard } from './MovieCard-CK0_TNVz.js';
import { B as Button } from './button-C1v8XzqW.js';
import { C as Circle_play } from './circle-play-B9b5K8IA.js';
import './client-BZtJixNd.js';
import './client2-D3ciM3yf.js';
import './exports-BuGzoaN1.js';
import './play-Ba0LGIvv.js';
import './Icon-DVHDtCfs.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';

_page[FILENAME] = "src/routes/(app)/movies/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      const { data } = $$props;
      let allMovies = data.movies || [];
      const getNewestTimestamp = (item) => {
        if (item?.release_date) {
          const parsed = Date.parse(item.release_date);
          if (!Number.isNaN(parsed)) return parsed;
        }
        if (item?.year) {
          const yearNum = Number.parseInt(item.year, 10);
          if (!Number.isNaN(yearNum)) return new Date(yearNum, 0, 1).getTime();
        }
        return 0;
      };
      const featuredMovie = (() => {
        if (!allMovies?.length) return null;
        return [...allMovies].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
      })();
      let selectedCategory = writable(null);
      let filteredMovies = allMovies.filter((movie) => !store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory) || movie.genres?.includes(store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory)));
      let categories = (() => {
        const allCategories = /* @__PURE__ */ new Set();
        allMovies.forEach((movie) => movie.genres?.forEach((g) => allCategories.add(g)));
        return Array.from(allCategories).sort();
      })();
      const user = page.data.user;
      $$renderer2.push(`<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white">`);
      push_element($$renderer2, "div", 49, 0);
      $$renderer2.push(`<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]">`);
      push_element($$renderer2, "div", 50, 2);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <main class="container mx-auto px-4 py-10 relative z-10">`);
      push_element($$renderer2, "main", 51, 2);
      $$renderer2.push(`<section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto">`);
      push_element($$renderer2, "section", 52, 4);
      $$renderer2.push(`<div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60">`);
      push_element($$renderer2, "div", 53, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">`);
      push_element($$renderer2, "div", 54, 6);
      $$renderer2.push(`<span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]">`);
      push_element($$renderer2, "span", 55, 8);
      $$renderer2.push(`</span>`);
      pop_element();
      $$renderer2.push(` Featured Collection</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-5xl sm:text-6xl font-extrabold text-display">`);
      push_element($$renderer2, "h1", 58, 6);
      $$renderer2.push(`Christian Movies</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/70 text-lg">`);
      push_element($$renderer2, "p", 59, 6);
      $$renderer2.push(`Stream inspiring stories crafted for families and communities.</p>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` `);
      if (featuredMovie) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<section class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 surface-glass">`);
        push_element($$renderer2, "section", 63, 6);
        $$renderer2.push(`<img${attr("src", featuredMovie.backdropUrl || featuredMovie.thumbnail)}${attr("alt", featuredMovie.title)} class="absolute inset-0 h-full w-full object-cover opacity-40"/>`);
        push_element($$renderer2, "img", 64, 8);
        pop_element();
        $$renderer2.push(` <div class="absolute inset-0 veil-strong">`);
        push_element($$renderer2, "div", 69, 8);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="relative z-10 grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">`);
        push_element($$renderer2, "div", 70, 8);
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 71, 10);
        $$renderer2.push(`<div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">`);
        push_element($$renderer2, "div", 72, 12);
        $$renderer2.push(`<span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]">`);
        push_element($$renderer2, "span", 73, 14);
        $$renderer2.push(`</span>`);
        pop_element();
        $$renderer2.push(` Just Added</div>`);
        pop_element();
        $$renderer2.push(` <h2 class="text-4xl sm:text-5xl font-extrabold text-display">`);
        push_element($$renderer2, "h2", 76, 12);
        $$renderer2.push(`${escape_html(featuredMovie.title)}</h2>`);
        pop_element();
        $$renderer2.push(` <p class="text-white/70 line-clamp-3 max-w-xl">`);
        push_element($$renderer2, "p", 77, 12);
        $$renderer2.push(`${escape_html(featuredMovie.description)}</p>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-3 text-sm text-white/60">`);
        push_element($$renderer2, "div", 78, 12);
        if (featuredMovie.year) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 79, 38);
          $$renderer2.push(`${escape_html(featuredMovie.year)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (featuredMovie.duration) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 80, 42);
          $$renderer2.push(`${escape_html(featuredMovie.duration)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (featuredMovie.quality) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 81, 41);
          $$renderer2.push(`${escape_html(featuredMovie.quality)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-3 pt-2">`);
        push_element($$renderer2, "div", 83, 12);
        Button($$renderer2, {
          size: "lg",
          class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]",
          href: `/watch/${stringify(featuredMovie.id)}`,
          children: prevent_snippet_stringification(($$renderer3) => {
            Circle_play($$renderer3, { class: "mr-2 h-5 w-5" });
            $$renderer3.push(`<!----> Watch Now`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="hidden lg:block">`);
        push_element($$renderer2, "div", 90, 10);
        $$renderer2.push(`<div class="h-full w-full rounded-2xl overflow-hidden border border-[#FFBF00]/40 halo-ring">`);
        push_element($$renderer2, "div", 91, 12);
        $$renderer2.push(`<img${attr("src", featuredMovie.thumbnail)}${attr("alt", featuredMovie.title)} class="h-full w-full object-cover"/>`);
        push_element($$renderer2, "img", 92, 14);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</section>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (user) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-center text-white/70 font-semibold mb-6">`);
        push_element($$renderer2, "p", 100, 6);
        $$renderer2.push(`Welcome, ${escape_html(user.name)}!</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex justify-center mb-8">`);
      push_element($$renderer2, "div", 103, 4);
      $$renderer2.push(`<div class="w-full md:w-1/3">`);
      push_element($$renderer2, "div", 104, 6);
      $$renderer2.push(`<label for="category" class="block text-lg font-semibold mb-2 text-white/80">`);
      push_element($$renderer2, "label", 105, 8);
      $$renderer2.push(`Filter by Category</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "category",
          value: store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory),
          class: "w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: null }, ($$renderer4) => {
            $$renderer4.push(`All Categories`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(categories);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let category = each_array[$$index];
            $$renderer3.option({ value: category }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(category)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (filteredMovies.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 120, 6);
        $$renderer2.push(`<p class="text-xl text-white/80">`);
        push_element($$renderer2, "p", 121, 8);
        $$renderer2.push(`No movies found for this category.</p>`);
        pop_element();
        $$renderer2.push(` <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">`);
        push_element($$renderer2, "button", 122, 8);
        $$renderer2.push(`Reset Filter</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">`);
        push_element($$renderer2, "div", 130, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(filteredMovies);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let movie = each_array_1[$$index_1];
          MovieCard($$renderer2, { movie, onClick: () => {
          } });
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></main>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-Crpszu6i.js.map
