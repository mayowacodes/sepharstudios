import { M as store_get, E as escape_html, p as prevent_snippet_stringification, m as ensure_array_like, N as unsubscribe_stores } from './index-C14HL8mA.js';
import { u as user } from './auth2-BmsAHpMQ.js';
import { M as MovieCard } from './MovieCard-CvwAgsPz.js';
import { f as faithMovies } from './movies-Djfl5jjt.js';
import { d as derived, w as writable } from './index3-CnQVvK5M.js';
import { C as Card, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Button } from './button-B5TxIyzE.js';
import { W as Wallet, i as isConnected } from './wallet-B7_7GztS.js';
import './config-Bjr_iq_c.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import { S as Star } from './star-BD4Vo9gv.js';
import { G as Gift } from './gift-BiMWdY9f.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './utils2-C-_3GP94.js';
import './Icon-DLeFNkXp.js';
import '@wagmi/core';
import '@wagmi/connectors';
import '@wagmi/core/chains';

_page[FILENAME] = "src/routes/(app)/movies/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let allMovies = faithMovies;
      let selectedCategory = writable(null);
      let filteredMovies = derived(selectedCategory, ($selectedCategory) => {
        return allMovies.filter((movie) => !$selectedCategory || movie.genres?.includes($selectedCategory));
      });
      let categories = derived(writable(faithMovies), ($movies) => {
        const allCategories = /* @__PURE__ */ new Set();
        $movies.forEach((movie) => movie.genres?.forEach((g) => allCategories.add(g)));
        return Array.from(allCategories).sort();
      });
      let tokenomicsStats = {
        stcBalance: "0",
        potentialEarnings: 0,
        stakingDiscount: 0
      };
      let showEarningNotification = false;
      let earningAmount = 0;
      function simulateEarningReward() {
        earningAmount = Math.floor(Math.random() * 10) + 5;
        showEarningNotification = true;
        setTimeout(() => showEarningNotification = false, 5e3);
      }
      $$renderer2.push(`<main class="container mx-auto px-4 py-8">`);
      push_element($$renderer2, "main", 91, 0);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-center mb-8">`);
      push_element($$renderer2, "h1", 92, 2);
      $$renderer2.push(`Christian Movies</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$user", user)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-center text-green-600 font-semibold mb-6">`);
        push_element($$renderer2, "p", 95, 4);
        $$renderer2.push(`Welcome, ${escape_html(store_get($$store_subs ??= {}, "$user", user).firstName)}!</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (showEarningNotification) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed top-4 right-4 z-50 animate-pulse">`);
        push_element($$renderer2, "div", 100, 4);
        Card($$renderer2, {
          class: "bg-primary border-primary/50 shadow-lg",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-4",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="flex items-center space-x-3">`);
                push_element($$renderer4, "div", 103, 10);
                Coins($$renderer4, { class: "h-6 w-6 text-primary-foreground" });
                $$renderer4.push(`<!----> <div>`);
                push_element($$renderer4, "div", 105, 12);
                $$renderer4.push(`<p class="text-primary-foreground font-medium">`);
                push_element($$renderer4, "p", 106, 14);
                $$renderer4.push(`+${escape_html(earningAmount)} STC Earned!</p>`);
                pop_element();
                $$renderer4.push(` <p class="text-primary-foreground/80 text-sm">`);
                push_element($$renderer4, "p", 107, 14);
                $$renderer4.push(`Keep watching to earn more</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
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
          class: "mb-8 bg-gradient-to-r from-primary/10 to-secondary/10",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
                push_element($$renderer4, "div", 119, 8);
                $$renderer4.push(`<div class="text-center">`);
                push_element($$renderer4, "div", 120, 10);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 121, 12);
                Coins($$renderer4, { class: "h-5 w-5 text-primary mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 123, 14);
                $$renderer4.push(`${escape_html(parseFloat(tokenomicsStats.stcBalance).toLocaleString())}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 125, 12);
                $$renderer4.push(`STC Balance</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 127, 10);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 128, 12);
                Trending_up($$renderer4, { class: "h-5 w-5 text-secondary mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 130, 14);
                $$renderer4.push(`${escape_html(tokenomicsStats.potentialEarnings)}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 132, 12);
                $$renderer4.push(`Potential STC</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 134, 10);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 135, 12);
                {
                  $$renderer4.push("<!--[!-->");
                  Star($$renderer4, { class: "h-5 w-5 text-muted-foreground mr-2" });
                  $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                  push_element($$renderer4, "span", 141, 16);
                  $$renderer4.push(`Free</span>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 144, 12);
                $$renderer4.push(`Access Level</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 146, 10);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 147, 12);
                Gift($$renderer4, { class: "h-5 w-5 text-green-500 mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 149, 14);
                $$renderer4.push(`${escape_html(tokenomicsStats.stakingDiscount)}%</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 151, 12);
                $$renderer4.push(`Staking Discount</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="mt-4 text-center">`);
                push_element($$renderer4, "div", 154, 8);
                $$renderer4.push(`<p class="text-sm text-muted-foreground mb-3">`);
                push_element($$renderer4, "p", 155, 10);
                $$renderer4.push(`Earn 5-15 STC tokens for each movie you watch to completion. Higher rewards for NFT subscribers!</p>`);
                pop_element();
                $$renderer4.push(` <div class="flex justify-center space-x-3">`);
                push_element($$renderer4, "div", 158, 10);
                Button($$renderer4, {
                  size: "sm",
                  onclick: simulateEarningReward,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Coins($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Test Earn STC`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  size: "sm",
                  variant: "outline",
                  href: "/tokens",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->Manage Tokens`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Card($$renderer2, {
          class: "mb-8 bg-gradient-to-r from-accent/10 to-primary/10",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6 text-center",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="flex items-center justify-center mb-4">`);
                push_element($$renderer4, "div", 173, 8);
                Wallet($$renderer4, { class: "h-8 w-8 text-accent mr-3" });
                $$renderer4.push(`<!----> <div>`);
                push_element($$renderer4, "div", 175, 10);
                $$renderer4.push(`<h3 class="text-lg font-semibold">`);
                push_element($$renderer4, "h3", 176, 12);
                $$renderer4.push(`Earn STC Tokens While Watching</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground">`);
                push_element($$renderer4, "p", 177, 12);
                $$renderer4.push(`Connect your wallet to start earning rewards</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">`);
                push_element($$renderer4, "div", 180, 8);
                $$renderer4.push(`<div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 181, 10);
                Coins($$renderer4, { class: "h-4 w-4 text-primary" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 183, 12);
                $$renderer4.push(`5-15 STC per movie</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 185, 10);
                Crown($$renderer4, { class: "h-4 w-4 text-secondary" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 187, 12);
                $$renderer4.push(`NFT holder bonuses</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 189, 10);
                Gift($$renderer4, { class: "h-4 w-4 text-accent" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 191, 12);
                $$renderer4.push(`Staking discounts</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` `);
                Button($$renderer4, {
                  href: "/plans",
                  class: "bg-primary hover:bg-primary/90",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Crown($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Start Earning Now`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--> <div class="flex justify-center mb-8">`);
      push_element($$renderer2, "div", 202, 2);
      $$renderer2.push(`<div class="w-full md:w-1/3">`);
      push_element($$renderer2, "div", 203, 4);
      $$renderer2.push(`<label for="category" class="block text-lg font-semibold mb-2">`);
      push_element($$renderer2, "label", 204, 6);
      $$renderer2.push(`Filter by Category:</label>`);
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
            $$renderer4.push(`All Categories`);
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
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$filteredMovies", filteredMovies).length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 219, 4);
        $$renderer2.push(`<p class="text-xl text-white/80">`);
        push_element($$renderer2, "p", 220, 6);
        $$renderer2.push(`No movies found for this category.</p>`);
        pop_element();
        $$renderer2.push(` <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">`);
        push_element($$renderer2, "button", 221, 6);
        $$renderer2.push(`Reset Filter</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">`);
        push_element($$renderer2, "div", 229, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$filteredMovies", filteredMovies));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let movie = each_array_1[$$index_1];
          MovieCard($$renderer2, { movie });
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
//# sourceMappingURL=_page.svelte-3-tIqBjn.js.map
