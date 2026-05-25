import { b as push_element, d as pop_element, p as prevent_snippet_stringification, l as escape_html, i as stringify, j as store_get, e as ensure_array_like, s as spread_props, F as FILENAME, u as unsubscribe_stores } from './ui-libs-Yf6h8PPk.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-Bb6tCQUO.js';
import { B as Button } from './button-C1v8XzqW.js';
import { B as Badge } from './badge-D_nuztXS.js';
import { I as Input } from './input-CTVv5zOe.js';
import { L as Label } from './label-99BY3xOG.js';
import { i as isConnected, W as Wallet } from './wallet-DdtFC4L6.js';
import './config-DiSGGbdB.js';
import { W as WalletConnect } from './WalletConnect-Ce3t-cUa.js';
import { D as Dollar_sign, T as Trending_up } from './trending-up-DhkfNATO.js';
import { I as Icon } from './Icon-DVHDtCfs.js';
import { C as Coins } from './coins-CTU1RUMc.js';
import { A as Activity } from './activity-C1wuSsPl.js';
import { S as Settings } from './settings-Cfcdn-vF.js';
import { C as Crown } from './crown-D96XsnbH.js';
import { C as Credit_card } from './credit-card-Cy41K6n2.js';
import { R as Refresh_cw } from './refresh-cw-ChMFf4d3.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './getAccount-CAZUvBhV.js';
import 'node:crypto';
import './external-link-tdQgWcLh.js';
import './zap-CnVnzt1j.js';

Calendar[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/calendar.svelte";
function Calendar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M8 2v4" }],
        ["path", { "d": "M16 2v4" }],
        [
          "rect",
          { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }
        ],
        ["path", { "d": "M3 10h18" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "calendar" },
        /**
         * @component @name Calendar
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/calendar
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
    Calendar
  );
}
Calendar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(creator)/creator/earnings/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let earningsData = {
        monthlyRevenue: 1247.5,
        yearlyRevenue: 12450,
        totalEarnings: 38500,
        revenueShare: 35,
        tier: "exclusive"
      };
      let paymentHistory = [
        {
          date: "2024-09-01",
          amount: 1247.5,
          type: "mixed",
          breakdown: { fiat: 623.75, usdc: 374.25, stc: 249.5 },
          status: "completed"
        },
        {
          date: "2024-08-01",
          amount: 1156.25,
          type: "mixed",
          breakdown: { fiat: 578.13, usdc: 347.88, stc: 230.24 },
          status: "completed"
        },
        {
          date: "2024-07-01",
          amount: 987.35,
          type: "fiat",
          breakdown: { fiat: 987.35, usdc: 0, stc: 0 },
          status: "completed"
        }
      ];
      let tokenomicsData = {
        stcBalance: "0",
        usdcBalance: "0",
        stcPrice: "0",
        totalStcEarned: "0",
        stcValue: 0
      };
      let paymentSettings = {
        preference: "mixed",
        fiatPercentage: 50,
        usdcPercentage: 30,
        stcPercentage: 20,
        isUpdating: false,
        updateResult: ""
      };
      async function updatePaymentPreferences() {
        paymentSettings.isUpdating = true;
        paymentSettings.updateResult = "";
        try {
          const total = paymentSettings.fiatPercentage + paymentSettings.usdcPercentage + paymentSettings.stcPercentage;
          if (Math.abs(total - 100) > 0.1) {
            throw new Error("Percentages must total 100%");
          }
          paymentSettings.updateResult = "Payment preferences updated successfully";
        } catch (error) {
          paymentSettings.updateResult = `Error: ${error.message}`;
        } finally {
          paymentSettings.isUpdating = false;
        }
      }
      function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      }
      function getTierColor(tier) {
        switch (tier) {
          case "top_performer":
            return "bg-primary text-primary-foreground";
          case "exclusive":
            return "bg-secondary text-secondary-foreground";
          default:
            return "bg-muted text-muted-foreground";
        }
      }
      function getPaymentTypeIcon(type) {
        switch (type) {
          case "fiat":
            return Credit_card;
          case "usdc":
            return Dollar_sign;
          case "stc":
            return Coins;
          default:
            return Wallet;
        }
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="space-y-8">`);
        push_element($$renderer3, "div", 166, 0);
        $$renderer3.push(`<div class="text-center">`);
        push_element($$renderer3, "div", 168, 2);
        $$renderer3.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
        push_element($$renderer3, "h1", 169, 4);
        $$renderer3.push(`Creator Earnings Dashboard</h1>`);
        pop_element();
        $$renderer3.push(` <p class="text-xl text-gray-300">`);
        push_element($$renderer3, "p", 170, 4);
        $$renderer3.push(`Track your revenue, STC tokens, and payment preferences</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="grid grid-cols-1 md:grid-cols-4 gap-6">`);
        push_element($$renderer3, "div", 174, 2);
        Card($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-muted-foreground flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Dollar_sign($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> This Month`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              class: "pt-0",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 183, 8);
                $$renderer5.push(`$${escape_html(earningsData.monthlyRevenue.toFixed(2))}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: "text-xs mt-1",
                  variant: "secondary",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html(earningsData.revenueShare)}% share`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-muted-foreground flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Calendar($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> This Year`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              class: "pt-0",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 196, 8);
                $$renderer5.push(`$${escape_html(earningsData.yearlyRevenue.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: "text-xs mt-1",
                  variant: "outline",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->12 months`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-muted-foreground flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Trending_up($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> Total Earned`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              class: "pt-0",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 209, 8);
                $$renderer5.push(`$${escape_html(earningsData.totalEarnings.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: `text-xs mt-1 ${stringify(getTierColor(earningsData.tier))}`,
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html("Exclusive Partner")}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-muted-foreground flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Coins($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> STC Value`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              class: "pt-0",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 225, 8);
                $$renderer5.push(`$${escape_html(tokenomicsData.stcValue.toFixed(2))}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: "text-xs mt-1",
                  variant: "secondary",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html(parseFloat(tokenomicsData.totalStcEarned).toLocaleString())} STC`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` `);
        Card($$renderer3, {
          class: "bg-linear-to-r from-primary/10 to-secondary/10",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "flex items-center space-x-2",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Coins($$renderer6, { class: "h-6 w-6" });
                    $$renderer6.push(`<!----> <span>`);
                    push_element($$renderer6, "span", 236, 8);
                    $$renderer6.push(`Web3 Tokenomics</span>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="text-center py-8">`);
                  push_element($$renderer5, "div", 241, 8);
                  Wallet($$renderer5, { class: "h-12 w-12 text-muted-foreground mx-auto mb-4" });
                  $$renderer5.push(`<!----> <h3 class="text-lg font-medium mb-2">`);
                  push_element($$renderer5, "h3", 243, 10);
                  $$renderer5.push(`Connect Your Wallet</h3>`);
                  pop_element();
                  $$renderer5.push(` <p class="text-muted-foreground mb-4">`);
                  push_element($$renderer5, "p", 244, 10);
                  $$renderer5.push(`Connect your wallet to access STC tokens and Web3 earning features.</p>`);
                  pop_element();
                  $$renderer5.push(` `);
                  WalletConnect($$renderer5);
                  $$renderer5.push(`<!----></div>`);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push(`<div class="space-y-6">`);
                  push_element($$renderer5, "div", 248, 8);
                  $$renderer5.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
                  push_element($$renderer5, "div", 250, 10);
                  $$renderer5.push(`<div class="text-center p-4 bg-primary/10 rounded-lg">`);
                  push_element($$renderer5, "div", 251, 12);
                  Coins($$renderer5, { class: "h-6 w-6 text-primary mx-auto mb-2" });
                  $$renderer5.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer5, "div", 253, 14);
                  $$renderer5.push(`${escape_html(parseFloat(tokenomicsData.stcBalance).toLocaleString())}</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer5, "div", 254, 14);
                  $$renderer5.push(`STC Balance</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-center p-4 bg-secondary/10 rounded-lg">`);
                  push_element($$renderer5, "div", 256, 12);
                  Dollar_sign($$renderer5, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
                  $$renderer5.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer5, "div", 258, 14);
                  $$renderer5.push(`$${escape_html(parseFloat(tokenomicsData.usdcBalance).toLocaleString())}</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer5, "div", 259, 14);
                  $$renderer5.push(`USDC Balance</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-center p-4 bg-accent/10 rounded-lg">`);
                  push_element($$renderer5, "div", 261, 12);
                  Activity($$renderer5, { class: "h-6 w-6 text-accent mx-auto mb-2" });
                  $$renderer5.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer5, "div", 263, 14);
                  $$renderer5.push(`${escape_html(parseFloat(tokenomicsData.totalStcEarned).toLocaleString())}</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer5, "div", 264, 14);
                  $$renderer5.push(`STC Earned</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-center p-4 bg-green-500/10 rounded-lg">`);
                  push_element($$renderer5, "div", 266, 12);
                  Trending_up($$renderer5, { class: "h-6 w-6 text-green-500 mx-auto mb-2" });
                  $$renderer5.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer5, "div", 268, 14);
                  $$renderer5.push(`$${escape_html(tokenomicsData.stcPrice.slice(0, 8))}</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer5, "div", 269, 14);
                  $$renderer5.push(`STC Price</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` `);
                  {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--></div>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "flex items-center space-x-2",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Settings($$renderer6, { class: "h-6 w-6" });
                    $$renderer6.push(`<!----> <span>`);
                    push_element($$renderer6, "span", 294, 8);
                    $$renderer6.push(`Payment Preferences</span>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              class: "space-y-6",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div>`);
                push_element($$renderer5, "div", 298, 6);
                Label($$renderer5, {
                  class: "text-sm font-medium mb-3 block",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Payment Distribution`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-3 gap-4">`);
                push_element($$renderer5, "div", 300, 8);
                $$renderer5.push(`<div>`);
                push_element($$renderer5, "div", 301, 10);
                Label($$renderer5, {
                  class: "text-xs text-muted-foreground",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Fiat (Bank Transfer)`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="flex items-center space-x-2">`);
                push_element($$renderer5, "div", 303, 12);
                Input($$renderer5, {
                  type: "number",
                  min: "0",
                  max: "100",
                  class: "w-20",
                  get value() {
                    return paymentSettings.fiatPercentage;
                  },
                  set value($$value) {
                    paymentSettings.fiatPercentage = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> <span class="text-sm">`);
                push_element($$renderer5, "span", 311, 14);
                $$renderer5.push(`%</span>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div>`);
                push_element($$renderer5, "div", 314, 10);
                Label($$renderer5, {
                  class: "text-xs text-muted-foreground",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->USDC (Crypto)`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="flex items-center space-x-2">`);
                push_element($$renderer5, "div", 316, 12);
                Input($$renderer5, {
                  type: "number",
                  min: "0",
                  max: "100",
                  class: "w-20",
                  get value() {
                    return paymentSettings.usdcPercentage;
                  },
                  set value($$value) {
                    paymentSettings.usdcPercentage = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> <span class="text-sm">`);
                push_element($$renderer5, "span", 324, 14);
                $$renderer5.push(`%</span>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div>`);
                push_element($$renderer5, "div", 327, 10);
                Label($$renderer5, {
                  class: "text-xs text-muted-foreground",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->STC Tokens`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="flex items-center space-x-2">`);
                push_element($$renderer5, "div", 329, 12);
                Input($$renderer5, {
                  type: "number",
                  min: "0",
                  max: "100",
                  class: "w-20",
                  get value() {
                    return paymentSettings.stcPercentage;
                  },
                  set value($$value) {
                    paymentSettings.stcPercentage = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> <span class="text-sm">`);
                push_element($$renderer5, "span", 337, 14);
                $$renderer5.push(`%</span>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="mt-3 text-sm text-muted-foreground">`);
                push_element($$renderer5, "div", 342, 8);
                $$renderer5.push(`Total: ${escape_html(paymentSettings.fiatPercentage + paymentSettings.usdcPercentage + paymentSettings.stcPercentage)}%</div>`);
                pop_element();
                $$renderer5.push(` <div class="mt-4 flex space-x-3">`);
                push_element($$renderer5, "div", 346, 8);
                Button($$renderer5, {
                  onclick: updatePaymentPreferences,
                  disabled: paymentSettings.isUpdating,
                  size: "sm",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    if (paymentSettings.isUpdating) {
                      $$renderer6.push("<!--[-->");
                      Refresh_cw($$renderer6, { class: "mr-2 h-4 w-4 animate-spin" });
                      $$renderer6.push(`<!----> Updating...`);
                    } else {
                      $$renderer6.push("<!--[!-->");
                      Settings($$renderer6, { class: "mr-2 h-4 w-4" });
                      $$renderer6.push(`<!----> Update Preferences`);
                    }
                    $$renderer6.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` `);
                if (paymentSettings.updateResult) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="mt-3 p-3 bg-muted rounded-lg">`);
                  push_element($$renderer5, "div", 363, 10);
                  $$renderer5.push(`<p class="text-sm">`);
                  push_element($$renderer5, "p", 364, 12);
                  $$renderer5.push(`${escape_html(paymentSettings.updateResult)}</p>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Recent Payments`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="space-y-4">`);
                push_element($$renderer5, "div", 377, 6);
                $$renderer5.push(`<!--[-->`);
                const each_array = ensure_array_like(paymentHistory);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let payment = each_array[$$index];
                  $$renderer5.push(`<div class="flex items-center justify-between p-4 border rounded-lg">`);
                  push_element($$renderer5, "div", 379, 10);
                  $$renderer5.push(`<div class="flex items-center space-x-4">`);
                  push_element($$renderer5, "div", 380, 12);
                  $$renderer5.push(`<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">`);
                  push_element($$renderer5, "div", 381, 14);
                  if (getPaymentTypeIcon(payment.type)) {
                    $$renderer5.push("<!--[-->");
                    const PaymentIcon = getPaymentTypeIcon(payment.type);
                    $$renderer5.push(`<!---->`);
                    PaymentIcon($$renderer5, { class: "h-5 w-5 text-primary" });
                    $$renderer5.push(`<!---->`);
                  } else {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--></div>`);
                  pop_element();
                  $$renderer5.push(` <div>`);
                  push_element($$renderer5, "div", 387, 14);
                  $$renderer5.push(`<div class="font-medium">`);
                  push_element($$renderer5, "div", 388, 16);
                  $$renderer5.push(`$${escape_html(payment.amount.toFixed(2))}</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-sm text-muted-foreground">`);
                  push_element($$renderer5, "div", 389, 16);
                  $$renderer5.push(`${escape_html(formatDate(payment.date))}</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` <div class="text-right">`);
                  push_element($$renderer5, "div", 392, 12);
                  Badge($$renderer5, {
                    variant: "outline",
                    class: "mb-2",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(payment.status === "completed" ? "Completed" : "Pending")}`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  if (payment.type === "mixed") {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<div class="text-xs text-muted-foreground">`);
                    push_element($$renderer5, "div", 397, 16);
                    $$renderer5.push(`$${escape_html(payment.breakdown.fiat.toFixed(2))} + $${escape_html(payment.breakdown.usdc.toFixed(2))} + ${escape_html(payment.breakdown.stc.toFixed(0))} STC</div>`);
                    pop_element();
                  } else {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--></div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
        push_element($$renderer3, "div", 409, 2);
        Button($$renderer3, {
          href: "/creator/analytics",
          class: "h-16",
          variant: "outline",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="text-center">`);
            push_element($$renderer4, "div", 411, 6);
            Trending_up($$renderer4, { class: "h-6 w-6 mx-auto mb-1" });
            $$renderer4.push(`<!----> <div class="text-sm font-medium">`);
            push_element($$renderer4, "div", 413, 8);
            $$renderer4.push(`Revenue Analytics</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          href: "/tokens",
          class: "h-16 bg-secondary hover:bg-secondary/90",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="text-center">`);
            push_element($$renderer4, "div", 418, 6);
            Coins($$renderer4, { class: "h-6 w-6 mx-auto mb-1" });
            $$renderer4.push(`<!----> <div class="text-sm font-medium">`);
            push_element($$renderer4, "div", 420, 8);
            $$renderer4.push(`Manage STC Tokens</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          href: "/creator",
          class: "h-16",
          variant: "outline",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="text-center">`);
            push_element($$renderer4, "div", 425, 6);
            Crown($$renderer4, { class: "h-6 w-6 mx-auto mb-1" });
            $$renderer4.push(`<!----> <div class="text-sm font-medium">`);
            push_element($$renderer4, "div", 427, 8);
            $$renderer4.push(`Creator Dashboard</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-Cw74lpYx.js.map
