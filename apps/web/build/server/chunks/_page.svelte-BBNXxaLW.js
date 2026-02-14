import { M as store_get, E as escape_html, p as prevent_snippet_stringification, m as ensure_array_like, N as unsubscribe_stores, g as spread_props, O as fallback, u as attr, C as attr_class, H as bind_props } from './index-C14HL8mA.js';
import { u as user } from './auth2-BmsAHpMQ.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { f as faithDocumentaries } from './documentaries-ZWPE74Cv.js';
import { d as derived, w as writable } from './index3-CnQVvK5M.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { B as Button } from './button-B5TxIyzE.js';
import { W as Wallet, i as isConnected } from './wallet-B7_7GztS.js';
import './config-Bjr_iq_c.js';
import { B as Book_open } from './book-open-B-22WauD.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { Z as Zap } from './zap-BWprV7m9.js';
import { G as Gift } from './gift-BiMWdY9f.js';
import { E as Eye } from './eye-Da_d-AVQ.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import './utils2-C-_3GP94.js';
import '@wagmi/core';
import '@wagmi/connectors';
import '@wagmi/core/chains';

Award[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/award.svelte";
function Award($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
          }
        ],
        ["circle", { "cx": "12", "cy": "8", "r": "6" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "award" },
        /**
         * @component @name Award
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUuNDc3IDEyLjg5IDEuNTE1IDguNTI2YS41LjUgMCAwIDEtLjgxLjQ3bC0zLjU4LTIuNjg3YTEgMSAwIDAgMC0xLjE5NyAwbC0zLjU4NiAyLjY4NmEuNS41IDAgMCAxLS44MS0uNDY5bDEuNTE0LTguNTI2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/award
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Award
  );
}
Award.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DocumentaryCard[FILENAME] = "src/lib/components/DocumentaryCard.svelte";
function DocumentaryCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let documentary = $$props["documentary"];
      let onClick = fallback($$props["onClick"], () => {
      });
      let onHover = fallback($$props["onHover"], () => {
      });
      const genreColor = (genre) => {
        switch (genre.toLowerCase()) {
          case "drama":
            return "bg-purple-600 text-white";
          case "action":
            return "bg-red-600 text-white";
          case "comedy":
            return "bg-yellow-400 text-black";
          case "animation":
            return "bg-pink-500 text-white";
          case "documentary":
            return "bg-blue-500 text-white";
          case "family":
            return "bg-green-500 text-white";
          case "faith":
          case "christian":
            return "bg-indigo-600 text-white";
          default:
            return "bg-gray-600 text-white";
        }
      };
      $$renderer2.push(`<div role="button" tabindex="0" class="relative group w-40 sm:w-48 lg:w-52 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none">`);
      push_element($$renderer2, "div", 65, 0);
      $$renderer2.push(`<div class="relative aspect-[2/3] bg-muted rounded-xl overflow-hidden">`);
      push_element($$renderer2, "div", 74, 2);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", documentary.thumbnail || "/placeholder-vertical.jpg")}${attr("alt", documentary.title)} class="w-full h-full object-cover" loading="lazy"/>`);
        push_element($$renderer2, "img", 85, 6);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (documentary.isNew) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute top-2 left-2 bg-green-600 dark:bg-green-400 text-white dark:text-black text-xs px-2 py-0.5 rounded-full z-30">`);
        push_element($$renderer2, "div", 95, 4);
        $$renderer2.push(`New Episode</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0">`);
      push_element($$renderer2, "div", 100, 2);
      $$renderer2.push(`<h3 class="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white">`);
      push_element($$renderer2, "h3", 101, 4);
      $$renderer2.push(`${escape_html(documentary.title)}</h3>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs mt-1 flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">`);
      push_element($$renderer2, "div", 103, 4);
      if (documentary.rating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">`);
        push_element($$renderer2, "span", 104, 30);
        $$renderer2.push(`${escape_html(documentary.rating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (documentary.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 105, 32);
        $$renderer2.push(`${escape_html(documentary.duration)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (documentary.quality) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 106, 31);
        $$renderer2.push(`${escape_html(documentary.quality)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (documentary.genres?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-2 flex flex-wrap gap-1">`);
        push_element($$renderer2, "div", 110, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(documentary.genres);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let genre = each_array[$$index];
          $$renderer2.push(`<span${attr_class(`text-[10px] px-2 py-0.5 rounded-full ${genreColor(genre)}`)}>`);
          push_element($$renderer2, "span", 112, 10);
          $$renderer2.push(`${escape_html(genre)}</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <p class="text-xs mt-2 text-white-700 dark:text-gray-300 line-clamp-3 transition-opacity duration-300">`);
      push_element($$renderer2, "p", 119, 4);
      $$renderer2.push(`${escape_html(documentary.description)}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
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
      var $$store_subs;
      let allDocumentaries = faithDocumentaries;
      let selectedCategory = writable(null);
      let selectedTopic = writable(null);
      let filteredDocumentaries = derived([selectedCategory, selectedTopic], ([$selectedCategory, $selectedTopic]) => {
        return allDocumentaries.filter((doc) => {
          const categoryMatch = !$selectedCategory || doc.genres?.includes($selectedCategory);
          const topicMatch = !$selectedTopic || doc.topics?.includes($selectedTopic);
          return categoryMatch && topicMatch;
        });
      });
      let categories = derived(writable(allDocumentaries), ($docs) => {
        const allCategories = /* @__PURE__ */ new Set();
        $docs.forEach((doc) => doc.genres?.forEach((g) => allCategories.add(g)));
        return Array.from(allCategories).sort();
      });
      let topics = derived(writable(allDocumentaries), ($docs) => {
        const allTopics = /* @__PURE__ */ new Set();
        $docs.forEach((doc) => doc.topics?.forEach((t) => allTopics.add(t)));
        return Array.from(allTopics).sort();
      });
      let tokenomicsStats = {
        stcBalance: "0",
        documentaryRewards: 0,
        stakingDiscount: 0,
        educationalBonus: 0,
        premiumMultiplier: 1.5
      };
      let showEarningNotification = false;
      let earningAmount = 0;
      let earningType = "documentary";
      function simulateDocumentaryReward() {
        const baseReward = Math.floor(Math.random() * 8) + 10;
        earningAmount = Math.floor(baseReward * tokenomicsStats.premiumMultiplier);
        earningType = "documentary";
        showEarningNotification = true;
        setTimeout(() => showEarningNotification = false, 5e3);
      }
      function simulateEducationalBonus() {
        earningAmount = Math.floor(Math.random() * 10) + 15;
        earningType = "educational";
        showEarningNotification = true;
        setTimeout(() => showEarningNotification = false, 5e3);
      }
      $$renderer2.push(`<main class="container mx-auto px-4 py-8">`);
      push_element($$renderer2, "main", 131, 2);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-center mb-8">`);
      push_element($$renderer2, "h1", 132, 4);
      $$renderer2.push(`Documentary Collection</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$user", user)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-center text-green-600 font-semibold mb-6">`);
        push_element($$renderer2, "p", 135, 6);
        $$renderer2.push(`Welcome, ${escape_html(store_get($$store_subs ??= {}, "$user", user).firstName)}!</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (showEarningNotification) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed top-4 right-4 z-50 animate-pulse">`);
        push_element($$renderer2, "div", 140, 6);
        Card($$renderer2, {
          class: "bg-accent border-accent/50 shadow-2xl",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-4",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="flex items-center space-x-3">`);
                push_element($$renderer4, "div", 143, 12);
                if (earningType === "documentary") {
                  $$renderer4.push("<!--[-->");
                  Book_open($$renderer4, { class: "h-6 w-6 text-accent-foreground" });
                  $$renderer4.push(`<!----> <div>`);
                  push_element($$renderer4, "div", 146, 16);
                  $$renderer4.push(`<p class="text-accent-foreground font-medium">`);
                  push_element($$renderer4, "p", 147, 18);
                  $$renderer4.push(`+${escape_html(earningAmount)} STC Earned!</p>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-accent-foreground/80 text-sm">`);
                  push_element($$renderer4, "p", 148, 18);
                  $$renderer4.push(`Documentary completed</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                  if (earningType === "educational") {
                    $$renderer4.push("<!--[-->");
                    Award($$renderer4, { class: "h-6 w-6 text-accent-foreground" });
                    $$renderer4.push(`<!----> <div>`);
                    push_element($$renderer4, "div", 152, 16);
                    $$renderer4.push(`<p class="text-accent-foreground font-medium">`);
                    push_element($$renderer4, "p", 153, 18);
                    $$renderer4.push(`+${escape_html(earningAmount)} STC Bonus!</p>`);
                    pop_element();
                    $$renderer4.push(` <p class="text-accent-foreground/80 text-sm">`);
                    push_element($$renderer4, "p", 154, 18);
                    $$renderer4.push(`Educational achievement</p>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                  } else {
                    $$renderer4.push("<!--[!-->");
                    if (earningType === "premium") {
                      $$renderer4.push("<!--[-->");
                      Crown($$renderer4, { class: "h-6 w-6 text-accent-foreground" });
                      $$renderer4.push(`<!----> <div>`);
                      push_element($$renderer4, "div", 158, 16);
                      $$renderer4.push(`<p class="text-accent-foreground font-medium">`);
                      push_element($$renderer4, "p", 159, 18);
                      $$renderer4.push(`+${escape_html(earningAmount)} STC Premium!</p>`);
                      pop_element();
                      $$renderer4.push(` <p class="text-accent-foreground/80 text-sm">`);
                      push_element($$renderer4, "p", 160, 18);
                      $$renderer4.push(`NFT subscriber bonus</p>`);
                      pop_element();
                      $$renderer4.push(`</div>`);
                      pop_element();
                    } else {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]-->`);
                  }
                  $$renderer4.push(`<!--]-->`);
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        Card($$renderer2, {
          class: "mb-8 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_title($$renderer4, {
                  class: "flex items-center space-x-2",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Book_open($$renderer5, { class: "h-6 w-6 text-accent" });
                    $$renderer5.push(`<!----> <span>`);
                    push_element($$renderer5, "span", 175, 12);
                    $$renderer5.push(`Premium Documentary Rewards</span>`);
                    pop_element();
                    $$renderer5.push(` `);
                    Badge($$renderer5, {
                      class: "bg-accent text-accent-foreground",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->Educational Content`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Card_content($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">`);
                push_element($$renderer4, "div", 180, 10);
                $$renderer4.push(`<div class="text-center">`);
                push_element($$renderer4, "div", 181, 12);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 182, 14);
                Coins($$renderer4, { class: "h-5 w-5 text-accent mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 184, 16);
                $$renderer4.push(`${escape_html(parseFloat(tokenomicsStats.stcBalance).toLocaleString())}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 186, 14);
                $$renderer4.push(`STC Balance</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 188, 12);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 189, 14);
                Book_open($$renderer4, { class: "h-5 w-5 text-primary mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 191, 16);
                $$renderer4.push(`${escape_html(tokenomicsStats.documentaryRewards)}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 193, 14);
                $$renderer4.push(`Documentary Rewards</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 195, 12);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 196, 14);
                Award($$renderer4, { class: "h-5 w-5 text-secondary mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 198, 16);
                $$renderer4.push(`${escape_html(tokenomicsStats.educationalBonus)}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 200, 14);
                $$renderer4.push(`Educational Bonus</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 202, 12);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 203, 14);
                Zap($$renderer4, { class: "h-5 w-5 text-yellow-500 mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 205, 16);
                $$renderer4.push(`${escape_html(tokenomicsStats.premiumMultiplier)}x</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 207, 14);
                $$renderer4.push(`Reward Multiplier</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 209, 12);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 210, 14);
                Gift($$renderer4, { class: "h-5 w-5 text-green-500 mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 212, 16);
                $$renderer4.push(`${escape_html(tokenomicsStats.stakingDiscount)}%</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 214, 14);
                $$renderer4.push(`Staking Bonus</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="bg-accent/10 p-4 rounded-lg mb-4">`);
                push_element($$renderer4, "div", 217, 10);
                $$renderer4.push(`<h4 class="font-medium text-accent mb-2">`);
                push_element($$renderer4, "h4", 218, 12);
                $$renderer4.push(`Premium Documentary Benefits:</h4>`);
                pop_element();
                $$renderer4.push(` <div class="grid md:grid-cols-2 gap-2 text-sm">`);
                push_element($$renderer4, "div", 219, 12);
                $$renderer4.push(`<div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 220, 14);
                Eye($$renderer4, { class: "h-4 w-4 text-accent" });
                $$renderer4.push(`<!----> <span>`);
                push_element($$renderer4, "span", 222, 16);
                $$renderer4.push(`10-18 STC per documentary (higher than regular content)</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 224, 14);
                Award($$renderer4, { class: "h-4 w-4 text-secondary" });
                $$renderer4.push(`<!----> <span>`);
                push_element($$renderer4, "span", 226, 16);
                $$renderer4.push(`Educational achievement bonuses</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 228, 14);
                Crown($$renderer4, { class: "h-4 w-4 text-primary" });
                $$renderer4.push(`<!----> <span>`);
                push_element($$renderer4, "span", 230, 16);
                $$renderer4.push(`${escape_html(tokenomicsStats.premiumMultiplier)}x multiplier for NFT subscribers</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 232, 14);
                Trending_up($$renderer4, { class: "h-4 w-4 text-green-500" });
                $$renderer4.push(`<!----> <span>`);
                push_element($$renderer4, "span", 234, 16);
                $$renderer4.push(`Knowledge-based reward scaling</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex justify-center space-x-2">`);
                push_element($$renderer4, "div", 238, 10);
                Button($$renderer4, {
                  size: "sm",
                  onclick: simulateDocumentaryReward,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Book_open($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Documentary Reward`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  size: "sm",
                  variant: "outline",
                  onclick: simulateEducationalBonus,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Award($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Educational Bonus`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Card($$renderer2, {
          class: "mb-8 bg-gradient-to-r from-orange-500/10 to-accent/10",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6 text-center",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="flex items-center justify-center mb-4">`);
                push_element($$renderer4, "div", 259, 10);
                Wallet($$renderer4, { class: "h-8 w-8 text-orange-500 mr-3" });
                $$renderer4.push(`<!----> <div>`);
                push_element($$renderer4, "div", 261, 12);
                $$renderer4.push(`<h3 class="text-lg font-semibold">`);
                push_element($$renderer4, "h3", 262, 14);
                $$renderer4.push(`Premium Educational Rewards</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground">`);
                push_element($$renderer4, "p", 263, 14);
                $$renderer4.push(`Documentaries offer the highest STC rewards on the platform</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">`);
                push_element($$renderer4, "div", 266, 10);
                $$renderer4.push(`<div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 267, 12);
                Book_open($$renderer4, { class: "h-4 w-4 text-primary" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 269, 14);
                $$renderer4.push(`10-18 STC per documentary</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 271, 12);
                Award($$renderer4, { class: "h-4 w-4 text-secondary" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 273, 14);
                $$renderer4.push(`Educational bonuses</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 275, 12);
                Crown($$renderer4, { class: "h-4 w-4 text-accent" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 277, 14);
                $$renderer4.push(`2x NFT subscriber multiplier</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 279, 12);
                Trending_up($$renderer4, { class: "h-4 w-4 text-green-500" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 281, 14);
                $$renderer4.push(`Knowledge achievement system</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex justify-center space-x-3">`);
                push_element($$renderer4, "div", 284, 10);
                Button($$renderer4, {
                  href: "/plans",
                  class: "bg-accent hover:bg-accent/90",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Crown($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Get Premium Access`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  href: "/tokens",
                  variant: "outline",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Coins($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Learn About STC`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--> <div class="flex flex-col md:flex-row justify-center gap-6 mb-8">`);
      push_element($$renderer2, "div", 298, 4);
      $$renderer2.push(`<div class="w-full md:w-1/3">`);
      push_element($$renderer2, "div", 299, 6);
      $$renderer2.push(`<label for="category" class="block text-lg font-semibold mb-2">`);
      push_element($$renderer2, "label", 300, 8);
      $$renderer2.push(`Filter by Genre:</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "category",
          value: store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory),
          class: "w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`All Genres`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$categories", categories));
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
      push_element($$renderer2, "div", 313, 6);
      $$renderer2.push(`<label for="topic" class="block text-lg font-semibold mb-2">`);
      push_element($$renderer2, "label", 314, 8);
      $$renderer2.push(`Filter by Topic:</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "topic",
          value: store_get($$store_subs ??= {}, "$selectedTopic", selectedTopic),
          class: "w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`All Topics`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$topics", topics));
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
      if (store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory) || store_get($$store_subs ??= {}, "$selectedTopic", selectedTopic)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex justify-center mb-6">`);
        push_element($$renderer2, "div", 329, 6);
        $$renderer2.push(`<button class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">`);
        push_element($$renderer2, "button", 330, 8);
        $$renderer2.push(`Clear All Filters</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$filteredDocumentaries", filteredDocumentaries).length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 340, 6);
        $$renderer2.push(`<p class="text-xl text-white/80">`);
        push_element($$renderer2, "p", 341, 8);
        $$renderer2.push(`No documentaries found matching your filters.</p>`);
        pop_element();
        $$renderer2.push(` <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">`);
        push_element($$renderer2, "button", 342, 8);
        $$renderer2.push(`Show All Documentaries</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">`);
        push_element($$renderer2, "div", 350, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$filteredDocumentaries", filteredDocumentaries));
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let documentary = each_array_2[$$index_2];
          DocumentaryCard($$renderer2, { documentary });
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></main>`);
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
//# sourceMappingURL=_page.svelte-BBNXxaLW.js.map
