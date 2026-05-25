import { z as fallback, a as push_element, n as attr, b as pop_element, e as escape_html, f as bind_props, F as FILENAME, p as prevent_snippet_stringification, l as stringify, i as ensure_array_like } from "../../../../chunks/ui-libs.js";
import { p as page } from "../../../../chunks/index2.js";
import "../../../../chunks/client2.js";
import { P as Play, B as Bookmark } from "../../../../chunks/play.js";
import { B as Button } from "../../../../chunks/button.js";
import { C as Circle_play } from "../../../../chunks/circle-play.js";
TVShowCard[FILENAME] = "src/lib/components/TVShowCard.svelte";
function TVShowCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let show = $$props["show"];
      let onClick = fallback($$props["onClick"], () => {
      });
      let onHover = fallback($$props["onHover"], () => {
      });
      $$renderer2.push(`<div role="button" tabindex="0" class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none hover:scale-[1.02]">`);
      push_element($$renderer2, "div", 59, 0);
      $$renderer2.push(`<div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">`);
      push_element($$renderer2, "div", 68, 2);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", show.thumbnail || "/placeholder-vertical.jpg")}${attr("alt", show.title)} class="w-full h-full object-cover" loading="lazy"/>`);
        push_element($$renderer2, "img", 79, 6);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">`);
      push_element($$renderer2, "div", 86, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (show.isNew) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">`);
        push_element($$renderer2, "div", 90, 4);
        $$renderer2.push(`New Episode</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">`);
      push_element($$renderer2, "div", 95, 2);
      $$renderer2.push(`<h3 class="text-sm font-semibold line-clamp-2 text-white">`);
      push_element($$renderer2, "h3", 96, 4);
      $$renderer2.push(`${escape_html(show.title)}</h3>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">`);
      push_element($$renderer2, "div", 98, 4);
      if (show.rating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">`);
        push_element($$renderer2, "span", 99, 23);
        $$renderer2.push(`${escape_html(show.rating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (show.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 100, 25);
        $$renderer2.push(`${escape_html(show.duration)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (show.quality) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 101, 24);
        $$renderer2.push(`${escape_html(show.quality)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-3 flex items-center gap-2">`);
      push_element($$renderer2, "div", 104, 4);
      $$renderer2.push(`<button class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"${attr("aria-label", `Play ${show.title}`)}>`);
      push_element($$renderer2, "button", 105, 6);
      Play($$renderer2, { class: "h-3.5 w-3.5" });
      $$renderer2.push(`<!----> Play</button>`);
      pop_element();
      $$renderer2.push(` <button class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"${attr("aria-label", `Add ${show.title} to My List`)}>`);
      push_element($$renderer2, "button", 113, 6);
      Bookmark($$renderer2, { class: "h-3.5 w-3.5" });
      $$renderer2.push(`<!----> My List</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { show, onClick, onHover });
    },
    TVShowCard
  );
}
TVShowCard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/shows/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const { data } = $$props;
      let allTVShows = data.shows || [];
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
      const featuredShow = (() => {
        if (!allTVShows?.length) return null;
        return [...allTVShows].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
      })();
      let selectedCategory = null;
      let filteredTVShows = allTVShows.filter((show) => !selectedCategory);
      let categories = (() => {
        const allCategories = /* @__PURE__ */ new Set();
        allTVShows.forEach((show) => show.genres?.forEach((g) => allCategories.add(g)));
        return Array.from(allCategories).sort();
      })();
      const user = page.data.user;
      $$renderer2.push(`<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white">`);
      push_element($$renderer2, "div", 48, 0);
      $$renderer2.push(`<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]">`);
      push_element($$renderer2, "div", 49, 2);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <main class="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 relative z-10">`);
      push_element($$renderer2, "main", 50, 2);
      $$renderer2.push(`<section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto">`);
      push_element($$renderer2, "section", 51, 4);
      $$renderer2.push(`<div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60">`);
      push_element($$renderer2, "div", 52, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">`);
      push_element($$renderer2, "div", 53, 6);
      $$renderer2.push(`<span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]">`);
      push_element($$renderer2, "span", 54, 8);
      $$renderer2.push(`</span>`);
      pop_element();
      $$renderer2.push(` Featured Series</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-5xl sm:text-6xl font-extrabold text-display">`);
      push_element($$renderer2, "h1", 57, 6);
      $$renderer2.push(`Christian TV Shows</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/70 text-lg">`);
      push_element($$renderer2, "p", 58, 6);
      $$renderer2.push(`Seasoned stories and faith‑forward series for every age.</p>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` `);
      if (featuredShow) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<section class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 surface-glass">`);
        push_element($$renderer2, "section", 62, 6);
        $$renderer2.push(`<img${attr("src", featuredShow.backdropUrl || featuredShow.thumbnail)}${attr("alt", featuredShow.title)} class="absolute inset-0 h-full w-full object-cover opacity-40"/>`);
        push_element($$renderer2, "img", 63, 8);
        pop_element();
        $$renderer2.push(` <div class="absolute inset-0 veil-strong">`);
        push_element($$renderer2, "div", 68, 8);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="relative z-10 grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">`);
        push_element($$renderer2, "div", 69, 8);
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 70, 10);
        $$renderer2.push(`<div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">`);
        push_element($$renderer2, "div", 71, 12);
        $$renderer2.push(`<span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]">`);
        push_element($$renderer2, "span", 72, 14);
        $$renderer2.push(`</span>`);
        pop_element();
        $$renderer2.push(` New Series</div>`);
        pop_element();
        $$renderer2.push(` <h2 class="text-4xl sm:text-5xl font-extrabold text-display">`);
        push_element($$renderer2, "h2", 75, 12);
        $$renderer2.push(`${escape_html(featuredShow.title)}</h2>`);
        pop_element();
        $$renderer2.push(` <p class="text-white/70 line-clamp-3 max-w-xl">`);
        push_element($$renderer2, "p", 76, 12);
        $$renderer2.push(`${escape_html(featuredShow.description)}</p>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-3 text-sm text-white/60">`);
        push_element($$renderer2, "div", 77, 12);
        if (featuredShow.year) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 78, 37);
          $$renderer2.push(`${escape_html(featuredShow.year)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (featuredShow.duration) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 79, 41);
          $$renderer2.push(`${escape_html(featuredShow.duration)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (featuredShow.quality) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 80, 40);
          $$renderer2.push(`${escape_html(featuredShow.quality)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-3 pt-2">`);
        push_element($$renderer2, "div", 82, 12);
        Button($$renderer2, {
          size: "lg",
          class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]",
          href: `/watch/${stringify(featuredShow.id)}`,
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
        push_element($$renderer2, "div", 89, 10);
        $$renderer2.push(`<div class="h-full w-full rounded-2xl overflow-hidden border border-[#FFBF00]/40 halo-ring">`);
        push_element($$renderer2, "div", 90, 12);
        $$renderer2.push(`<img${attr("src", featuredShow.thumbnail)}${attr("alt", featuredShow.title)} class="h-full w-full object-cover"/>`);
        push_element($$renderer2, "img", 91, 14);
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
        push_element($$renderer2, "p", 99, 6);
        $$renderer2.push(`Welcome, ${escape_html(user.name)}!</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex justify-center mb-8">`);
      push_element($$renderer2, "div", 102, 4);
      $$renderer2.push(`<div class="w-full md:w-1/3">`);
      push_element($$renderer2, "div", 103, 6);
      $$renderer2.push(`<label for="category" class="block text-lg font-semibold mb-2 text-white/80">`);
      push_element($$renderer2, "label", 104, 8);
      $$renderer2.push(`Filter by Category</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "category",
          value: selectedCategory,
          class: "w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
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
      if (filteredTVShows.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 119, 6);
        $$renderer2.push(`<p class="text-xl text-white/80">`);
        push_element($$renderer2, "p", 120, 8);
        $$renderer2.push(`No TV shows found for this category.</p>`);
        pop_element();
        $$renderer2.push(` <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">`);
        push_element($$renderer2, "button", 121, 8);
        $$renderer2.push(`Reset Filter</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">`);
        push_element($$renderer2, "div", 129, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(filteredTVShows);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let show = each_array_1[$$index_1];
          TVShowCard($$renderer2, { show, onClick: () => {
          } });
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
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
