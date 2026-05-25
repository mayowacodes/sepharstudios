import { z as fallback, a as push_element, n as attr, b as pop_element, e as escape_html, f as bind_props, F as FILENAME, p as prevent_snippet_stringification, l as stringify, i as ensure_array_like } from "../../../../chunks/ui-libs.js";
import { p as page } from "../../../../chunks/index2.js";
import "../../../../chunks/client2.js";
import { P as Play, B as Bookmark } from "../../../../chunks/play.js";
import { B as Button } from "../../../../chunks/button.js";
import { C as Circle_play } from "../../../../chunks/circle-play.js";
DocumentaryCard[FILENAME] = "src/lib/components/DocumentaryCard.svelte";
function DocumentaryCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let documentary = $$props["documentary"];
      let onClick = fallback($$props["onClick"], () => {
      });
      let onHover = fallback($$props["onHover"], () => {
      });
      $$renderer2.push(`<div role="button" tabindex="0" class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none hover:scale-[1.02]">`);
      push_element($$renderer2, "div", 41, 0);
      $$renderer2.push(`<div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">`);
      push_element($$renderer2, "div", 50, 2);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", documentary.thumbnail || "/placeholder-vertical.jpg")}${attr("alt", documentary.title)} class="w-full h-full object-cover" loading="lazy"/>`);
        push_element($$renderer2, "img", 61, 6);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">`);
      push_element($$renderer2, "div", 68, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (documentary.isNew) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">`);
        push_element($$renderer2, "div", 72, 4);
        $$renderer2.push(`New Episode</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">`);
      push_element($$renderer2, "div", 77, 2);
      $$renderer2.push(`<h3 class="text-sm font-semibold line-clamp-2 text-white">`);
      push_element($$renderer2, "h3", 78, 4);
      $$renderer2.push(`${escape_html(documentary.title)}</h3>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">`);
      push_element($$renderer2, "div", 80, 4);
      if (documentary.rating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">`);
        push_element($$renderer2, "span", 81, 30);
        $$renderer2.push(`${escape_html(documentary.rating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (documentary.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 82, 32);
        $$renderer2.push(`${escape_html(documentary.duration)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (documentary.quality) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 83, 31);
        $$renderer2.push(`${escape_html(documentary.quality)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-3 flex items-center gap-2">`);
      push_element($$renderer2, "div", 86, 4);
      $$renderer2.push(`<button class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"${attr("aria-label", `Play ${documentary.title}`)}>`);
      push_element($$renderer2, "button", 87, 6);
      Play($$renderer2, { class: "h-3.5 w-3.5" });
      $$renderer2.push(`<!----> Play</button>`);
      pop_element();
      $$renderer2.push(` <button class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"${attr("aria-label", `Add ${documentary.title} to My List`)}>`);
      push_element($$renderer2, "button", 95, 6);
      Bookmark($$renderer2, { class: "h-3.5 w-3.5" });
      $$renderer2.push(`<!----> My List</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { documentary, onClick, onHover });
    },
    DocumentaryCard
  );
}
DocumentaryCard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/documentaries/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const { data } = $$props;
      let allDocumentaries = data.documentaries || [];
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
      const featuredDocumentary = (() => {
        if (!allDocumentaries?.length) return null;
        return [...allDocumentaries].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
      })();
      let selectedCategory = null;
      let selectedTopic = null;
      let filteredDocumentaries = allDocumentaries.filter((doc) => {
        const categoryMatch = !selectedCategory;
        const topicMatch = !selectedTopic;
        return categoryMatch && topicMatch;
      });
      let categories = (() => {
        const allCategories = /* @__PURE__ */ new Set();
        allDocumentaries.forEach((doc) => doc.genres?.forEach((g) => allCategories.add(g)));
        return Array.from(allCategories).sort();
      })();
      let topics = (() => {
        const allTopics = /* @__PURE__ */ new Set();
        allDocumentaries.forEach((doc) => doc.topics?.forEach((t) => allTopics.add(t)));
        return Array.from(allTopics).sort();
      })();
      const user = page.data.user;
      $$renderer2.push(`<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white">`);
      push_element($$renderer2, "div", 62, 0);
      $$renderer2.push(`<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]">`);
      push_element($$renderer2, "div", 63, 2);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <main class="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 relative z-10">`);
      push_element($$renderer2, "main", 64, 2);
      $$renderer2.push(`<section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto">`);
      push_element($$renderer2, "section", 65, 4);
      $$renderer2.push(`<div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60">`);
      push_element($$renderer2, "div", 66, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">`);
      push_element($$renderer2, "div", 67, 6);
      $$renderer2.push(`<span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]">`);
      push_element($$renderer2, "span", 68, 8);
      $$renderer2.push(`</span>`);
      pop_element();
      $$renderer2.push(` Deep Dive</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-5xl sm:text-6xl font-extrabold text-display">`);
      push_element($$renderer2, "h1", 71, 6);
      $$renderer2.push(`Documentary Collection</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/70 text-lg">`);
      push_element($$renderer2, "p", 72, 6);
      $$renderer2.push(`Explore faith, history, and inspiring journeys in depth.</p>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` `);
      if (featuredDocumentary) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<section class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 surface-glass">`);
        push_element($$renderer2, "section", 76, 6);
        $$renderer2.push(`<img${attr("src", featuredDocumentary.backdropUrl || featuredDocumentary.thumbnail)}${attr("alt", featuredDocumentary.title)} class="absolute inset-0 h-full w-full object-cover opacity-40"/>`);
        push_element($$renderer2, "img", 77, 8);
        pop_element();
        $$renderer2.push(` <div class="absolute inset-0 veil-strong">`);
        push_element($$renderer2, "div", 82, 8);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="relative z-10 grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">`);
        push_element($$renderer2, "div", 83, 8);
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 84, 10);
        $$renderer2.push(`<div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">`);
        push_element($$renderer2, "div", 85, 12);
        $$renderer2.push(`<span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]">`);
        push_element($$renderer2, "span", 86, 14);
        $$renderer2.push(`</span>`);
        pop_element();
        $$renderer2.push(` Just Added</div>`);
        pop_element();
        $$renderer2.push(` <h2 class="text-4xl sm:text-5xl font-extrabold text-display">`);
        push_element($$renderer2, "h2", 89, 12);
        $$renderer2.push(`${escape_html(featuredDocumentary.title)}</h2>`);
        pop_element();
        $$renderer2.push(` <p class="text-white/70 line-clamp-3 max-w-xl">`);
        push_element($$renderer2, "p", 90, 12);
        $$renderer2.push(`${escape_html(featuredDocumentary.description)}</p>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-3 text-sm text-white/60">`);
        push_element($$renderer2, "div", 91, 12);
        if (featuredDocumentary.year) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 92, 44);
          $$renderer2.push(`${escape_html(featuredDocumentary.year)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (featuredDocumentary.duration) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 93, 48);
          $$renderer2.push(`${escape_html(featuredDocumentary.duration)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (featuredDocumentary.quality) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 94, 47);
          $$renderer2.push(`${escape_html(featuredDocumentary.quality)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-3 pt-2">`);
        push_element($$renderer2, "div", 96, 12);
        Button($$renderer2, {
          size: "lg",
          class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]",
          href: `/watch/${stringify(featuredDocumentary.id)}`,
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
        push_element($$renderer2, "div", 103, 10);
        $$renderer2.push(`<div class="h-full w-full rounded-2xl overflow-hidden border border-[#FFBF00]/40 halo-ring">`);
        push_element($$renderer2, "div", 104, 12);
        $$renderer2.push(`<img${attr("src", featuredDocumentary.thumbnail)}${attr("alt", featuredDocumentary.title)} class="h-full w-full object-cover"/>`);
        push_element($$renderer2, "img", 105, 14);
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
        push_element($$renderer2, "p", 113, 6);
        $$renderer2.push(`Welcome, ${escape_html(user.name)}!</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex flex-col md:flex-row justify-center gap-6 mb-8">`);
      push_element($$renderer2, "div", 116, 4);
      $$renderer2.push(`<div class="w-full md:w-1/3">`);
      push_element($$renderer2, "div", 117, 6);
      $$renderer2.push(`<label for="category" class="block text-lg font-semibold mb-2 text-white/80">`);
      push_element($$renderer2, "label", 118, 8);
      $$renderer2.push(`Filter by Genre</label>`);
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
            $$renderer4.push(`All Genres`);
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
      $$renderer2.push(` <div class="w-full md:w-1/3">`);
      push_element($$renderer2, "div", 131, 6);
      $$renderer2.push(`<label for="topic" class="block text-lg font-semibold mb-2 text-white/80">`);
      push_element($$renderer2, "label", 132, 8);
      $$renderer2.push(`Filter by Topic</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "topic",
          value: selectedTopic,
          class: "w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`All Topics`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(topics);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let topic = each_array_1[$$index_1];
            $$renderer3.option({ value: topic }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(topic)}`);
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
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (filteredDocumentaries.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 158, 6);
        $$renderer2.push(`<p class="text-xl text-white/80">`);
        push_element($$renderer2, "p", 159, 8);
        $$renderer2.push(`No documentaries found matching your filters.</p>`);
        pop_element();
        $$renderer2.push(` <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">`);
        push_element($$renderer2, "button", 160, 8);
        $$renderer2.push(`Show All Documentaries</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">`);
        push_element($$renderer2, "div", 168, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(filteredDocumentaries);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let doc = each_array_2[$$index_2];
          DocumentaryCard($$renderer2, { documentary: doc });
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
