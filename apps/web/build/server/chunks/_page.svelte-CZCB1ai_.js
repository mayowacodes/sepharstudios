import { M as store_get, E as escape_html, p as prevent_snippet_stringification, m as ensure_array_like, N as unsubscribe_stores, g as spread_props, O as fallback, u as attr, C as attr_class, H as bind_props } from './index-C14HL8mA.js';
import { u as user } from './auth2-BmsAHpMQ.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { d as derived, w as writable } from './index3-CnQVvK5M.js';
import { f as faithTVShows } from './shows-BXPO8af7.js';
import { C as Card, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Button } from './button-B5TxIyzE.js';
import { W as Wallet, i as isConnected } from './wallet-B7_7GztS.js';
import './config-Bjr_iq_c.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { C as Clock } from './clock-5gZ3jTnF.js';
import { G as Gift } from './gift-BiMWdY9f.js';
import './utils2-C-_3GP94.js';
import '@wagmi/core';
import '@wagmi/connectors';
import '@wagmi/core/chains';

Play[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/play.svelte";
function Play($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "play" },
        /**
         * @component @name Play
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSA1YTIgMiAwIDAgMSAzLjAwOC0xLjcyOGwxMS45OTcgNi45OThhMiAyIDAgMCAxIC4wMDMgMy40NThsLTEyIDdBMiAyIDAgMCAxIDUgMTl6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/play
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
    Play
  );
}
Play.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
TVShowCard[FILENAME] = "src/lib/components/TVShowCard.svelte";
function TVShowCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let show = $$props["show"];
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
        $$renderer2.push(`<img${attr("src", show.thumbnail || "/placeholder-vertical.jpg")}${attr("alt", show.title)} class="w-full h-full object-cover" loading="lazy"/>`);
        push_element($$renderer2, "img", 85, 6);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (show.isNew) {
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
      $$renderer2.push(`${escape_html(show.title)}</h3>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs mt-1 flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">`);
      push_element($$renderer2, "div", 103, 4);
      if (show.rating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">`);
        push_element($$renderer2, "span", 104, 23);
        $$renderer2.push(`${escape_html(show.rating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (show.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 105, 25);
        $$renderer2.push(`${escape_html(show.duration)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (show.quality) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 106, 24);
        $$renderer2.push(`${escape_html(show.quality)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (show.genres?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-2 flex flex-wrap gap-1">`);
        push_element($$renderer2, "div", 110, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(show.genres);
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
      $$renderer2.push(`${escape_html(show.description)}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
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
      var $$store_subs;
      let allTVShows = faithTVShows;
      let selectedCategory = writable(null);
      let filteredTVShows = derived(selectedCategory, ($selectedCategory) => {
        return allTVShows.filter((show) => !$selectedCategory || show.genres?.includes($selectedCategory));
      });
      let categories = derived(writable(faithTVShows), ($shows) => {
        const allCategories = /* @__PURE__ */ new Set();
        $shows.forEach((show) => show.genres?.forEach((g) => allCategories.add(g)));
        return Array.from(allCategories).sort();
      });
      let tokenomicsStats = {
        stcBalance: "0",
        episodeRewards: 0,
        stakingDiscount: 0,
        seriesBonus: 0,
        watchStreak: 0
      };
      let showEarningNotification = false;
      let earningAmount = 0;
      let earningType = "episode";
      function simulateEpisodeReward() {
        earningAmount = Math.floor(Math.random() * 5) + 3;
        earningType = "episode";
        showEarningNotification = true;
        setTimeout(() => showEarningNotification = false, 4e3);
      }
      function simulateSeriesBonus() {
        earningAmount = Math.floor(Math.random() * 20) + 25;
        earningType = "series";
        showEarningNotification = true;
        setTimeout(() => showEarningNotification = false, 4e3);
      }
      function simulateStreakBonus() {
        earningAmount = Math.floor(Math.random() * 10) + 10;
        earningType = "streak";
        showEarningNotification = true;
        setTimeout(() => showEarningNotification = false, 4e3);
      }
      $$renderer2.push(`<main class="container mx-auto px-4 py-8">`);
      push_element($$renderer2, "main", 112, 0);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-center mb-8">`);
      push_element($$renderer2, "h1", 113, 0);
      $$renderer2.push(`Christian TV Shows</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$user", user)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-center text-green-600 font-semibold mb-6">`);
        push_element($$renderer2, "p", 116, 2);
        $$renderer2.push(`Welcome, ${escape_html(store_get($$store_subs ??= {}, "$user", user).firstName)}!</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (showEarningNotification) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed top-4 right-4 z-50 animate-bounce">`);
        push_element($$renderer2, "div", 121, 2);
        Card($$renderer2, {
          class: "bg-secondary border-secondary/50 shadow-xl",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-4",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="flex items-center space-x-3">`);
                push_element($$renderer4, "div", 124, 8);
                if (earningType === "episode") {
                  $$renderer4.push("<!--[-->");
                  Play($$renderer4, { class: "h-6 w-6 text-secondary-foreground" });
                  $$renderer4.push(`<!----> <div>`);
                  push_element($$renderer4, "div", 127, 12);
                  $$renderer4.push(`<p class="text-secondary-foreground font-medium">`);
                  push_element($$renderer4, "p", 128, 14);
                  $$renderer4.push(`+${escape_html(earningAmount)} STC Earned!</p>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-secondary-foreground/80 text-sm">`);
                  push_element($$renderer4, "p", 129, 14);
                  $$renderer4.push(`Episode completed</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                  if (earningType === "series") {
                    $$renderer4.push("<!--[-->");
                    Crown($$renderer4, { class: "h-6 w-6 text-secondary-foreground" });
                    $$renderer4.push(`<!----> <div>`);
                    push_element($$renderer4, "div", 133, 12);
                    $$renderer4.push(`<p class="text-secondary-foreground font-medium">`);
                    push_element($$renderer4, "p", 134, 14);
                    $$renderer4.push(`+${escape_html(earningAmount)} STC Bonus!</p>`);
                    pop_element();
                    $$renderer4.push(` <p class="text-secondary-foreground/80 text-sm">`);
                    push_element($$renderer4, "p", 135, 14);
                    $$renderer4.push(`Series completed</p>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                  } else {
                    $$renderer4.push("<!--[!-->");
                    if (earningType === "streak") {
                      $$renderer4.push("<!--[-->");
                      Clock($$renderer4, { class: "h-6 w-6 text-secondary-foreground" });
                      $$renderer4.push(`<!----> <div>`);
                      push_element($$renderer4, "div", 139, 12);
                      $$renderer4.push(`<p class="text-secondary-foreground font-medium">`);
                      push_element($$renderer4, "p", 140, 14);
                      $$renderer4.push(`+${escape_html(earningAmount)} STC Streak!</p>`);
                      pop_element();
                      $$renderer4.push(` <p class="text-secondary-foreground/80 text-sm">`);
                      push_element($$renderer4, "p", 141, 14);
                      $$renderer4.push(`${escape_html(tokenomicsStats.watchStreak)} days watching</p>`);
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
          class: "mb-8 bg-gradient-to-r from-secondary/10 to-accent/10",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-5 gap-4">`);
                push_element($$renderer4, "div", 154, 6);
                $$renderer4.push(`<div class="text-center">`);
                push_element($$renderer4, "div", 155, 8);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 156, 10);
                Coins($$renderer4, { class: "h-5 w-5 text-secondary mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 158, 12);
                $$renderer4.push(`${escape_html(parseFloat(tokenomicsStats.stcBalance).toLocaleString())}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 160, 10);
                $$renderer4.push(`STC Balance</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 162, 8);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 163, 10);
                Play($$renderer4, { class: "h-5 w-5 text-primary mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 165, 12);
                $$renderer4.push(`${escape_html(tokenomicsStats.episodeRewards)}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 167, 10);
                $$renderer4.push(`Episode Rewards</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 169, 8);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 170, 10);
                Crown($$renderer4, { class: "h-5 w-5 text-accent mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 172, 12);
                $$renderer4.push(`${escape_html(tokenomicsStats.seriesBonus)}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 174, 10);
                $$renderer4.push(`Series Bonuses</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 176, 8);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 177, 10);
                Clock($$renderer4, { class: "h-5 w-5 text-green-500 mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 179, 12);
                $$renderer4.push(`${escape_html(tokenomicsStats.watchStreak)}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 181, 10);
                $$renderer4.push(`Day Streak</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center">`);
                push_element($$renderer4, "div", 183, 8);
                $$renderer4.push(`<div class="flex items-center justify-center mb-2">`);
                push_element($$renderer4, "div", 184, 10);
                Gift($$renderer4, { class: "h-5 w-5 text-purple-500 mr-2" });
                $$renderer4.push(`<!----> <span class="text-lg font-bold">`);
                push_element($$renderer4, "span", 186, 12);
                $$renderer4.push(`${escape_html(tokenomicsStats.stakingDiscount)}%</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 188, 10);
                $$renderer4.push(`Staking Bonus</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="mt-4 text-center">`);
                push_element($$renderer4, "div", 191, 6);
                $$renderer4.push(`<p class="text-sm text-muted-foreground mb-3">`);
                push_element($$renderer4, "p", 192, 8);
                $$renderer4.push(`Earn 3-8 STC per episode + 25 STC series completion bonuses. Daily watching streaks unlock multipliers!</p>`);
                pop_element();
                $$renderer4.push(` <div class="flex justify-center space-x-2">`);
                push_element($$renderer4, "div", 195, 8);
                Button($$renderer4, {
                  size: "sm",
                  onclick: simulateEpisodeReward,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Play($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Episode Reward`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  size: "sm",
                  variant: "outline",
                  onclick: simulateSeriesBonus,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Crown($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Series Bonus`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  size: "sm",
                  variant: "outline",
                  onclick: simulateStreakBonus,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Clock($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Streak Bonus`);
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
          class: "mb-8 bg-gradient-to-r from-purple/10 to-secondary/10",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6 text-center",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="flex items-center justify-center mb-4">`);
                push_element($$renderer4, "div", 215, 6);
                Wallet($$renderer4, { class: "h-8 w-8 text-purple-500 mr-3" });
                $$renderer4.push(`<!----> <div>`);
                push_element($$renderer4, "div", 217, 8);
                $$renderer4.push(`<h3 class="text-lg font-semibold">`);
                push_element($$renderer4, "h3", 218, 10);
                $$renderer4.push(`Earn More with TV Shows</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground">`);
                push_element($$renderer4, "p", 219, 10);
                $$renderer4.push(`Connect wallet for episode rewards and series bonuses</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">`);
                push_element($$renderer4, "div", 222, 6);
                $$renderer4.push(`<div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 223, 8);
                Play($$renderer4, { class: "h-4 w-4 text-primary" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 225, 10);
                $$renderer4.push(`3-8 STC per episode</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 227, 8);
                Crown($$renderer4, { class: "h-4 w-4 text-secondary" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 229, 10);
                $$renderer4.push(`25+ STC series bonus</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 231, 8);
                Clock($$renderer4, { class: "h-4 w-4 text-accent" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 233, 10);
                $$renderer4.push(`Daily streak multipliers</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 235, 8);
                Gift($$renderer4, { class: "h-4 w-4 text-green-500" });
                $$renderer4.push(`<!----> <span class="text-sm">`);
                push_element($$renderer4, "span", 237, 10);
                $$renderer4.push(`NFT holder bonuses</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` `);
                Button($$renderer4, {
                  href: "/subscription",
                  class: "bg-secondary hover:bg-secondary/90",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Crown($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Get NFT Subscription`);
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
      push_element($$renderer2, "div", 248, 0);
      $$renderer2.push(`<div class="w-full md:w-1/3">`);
      push_element($$renderer2, "div", 249, 2);
      $$renderer2.push(`<label for="category" class="block text-lg font-semibold mb-2">`);
      push_element($$renderer2, "label", 250, 4);
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
      if (store_get($$store_subs ??= {}, "$filteredTVShows", filteredTVShows).length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 265, 2);
        $$renderer2.push(`<p class="text-xl text-white/80">`);
        push_element($$renderer2, "p", 266, 4);
        $$renderer2.push(`No TV shows found for this category.</p>`);
        pop_element();
        $$renderer2.push(` <button class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition">`);
        push_element($$renderer2, "button", 267, 4);
        $$renderer2.push(`Reset Filter</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">`);
        push_element($$renderer2, "div", 275, 2);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$filteredTVShows", filteredTVShows));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let show = each_array_1[$$index_1];
          TVShowCard($$renderer2, { show });
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
//# sourceMappingURL=_page.svelte-CZCB1ai_.js.map
