import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, a as push_element, b as pop_element, e as escape_html, j as attr_class, k as store_get, n as attr, u as unsubscribe_stores, l as stringify } from "../../../../chunks/ui-libs.js";
import { B as Button } from "../../../../chunks/button.js";
import { s as stcToken, a as subscriptionContract, u as usdcToken } from "../../../../chunks/contracts.js";
import { W as Wallet, i as isConnected, c as connectWallet, w as walletAddress } from "../../../../chunks/wallet.js";
import "../../../../chunks/config.js";
import { C as Coins } from "../../../../chunks/coins.js";
import { L as Loader_circle } from "../../../../chunks/loader-circle.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { R as Refresh_cw } from "../../../../chunks/refresh-cw.js";
import { Z as Zap } from "../../../../chunks/zap.js";
import { L as Lock } from "../../../../chunks/lock.js";
import { E as External_link } from "../../../../chunks/external-link.js";
import { C as Circle_alert } from "../../../../chunks/circle-alert.js";
Arrow_right[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/arrow-right.svelte";
function Arrow_right($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M5 12h14" }],
        ["path", { "d": "m12 5 7 7-7 7" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "arrow-right" },
        /**
         * @component @name ArrowRight
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
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
    Arrow_right
  );
}
Arrow_right.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Arrow_up_down[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/arrow-up-down.svelte";
function Arrow_up_down($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "m21 16-4 4-4-4" }],
        ["path", { "d": "M17 20V4" }],
        ["path", { "d": "m3 8 4-4 4 4" }],
        ["path", { "d": "M7 4v16" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "arrow-up-down" },
        /**
         * @component @name ArrowUpDown
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMTYtNCA0LTQtNCIgLz4KICA8cGF0aCBkPSJNMTcgMjBWNCIgLz4KICA8cGF0aCBkPSJtMyA4IDQtNCA0IDQiIC8+CiAgPHBhdGggZD0iTTcgNHYxNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-up-down
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
    Arrow_up_down
  );
}
Arrow_up_down.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Circle_check[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/circle-check.svelte";
function Circle_check($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["circle", { "cx": "12", "cy": "12", "r": "10" }],
        ["path", { "d": "m9 12 2 2 4-4" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "circle-check" },
        /**
         * @component @name CircleCheck
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtOSAxMiAyIDIgNC00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check
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
    Circle_check
  );
}
Circle_check.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/token/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let inputAmount = "";
      let stcReserveRaw = 0n;
      let stcBalance = "0";
      let usdcBalance = "0";
      let cooldownStatus = null;
      let stcRedeemAmount = "500";
      let stakingInfo = null;
      let topUpAmount = "";
      let isLoadingBalances = false;
      let isRedeeming = false;
      let txSuccess = "";
      let errorMsg = "";
      let subAddr = "";
      async function loadBalances(addr) {
        isLoadingBalances = true;
        try {
          const [stc, usdc, stakeData, status] = await Promise.all([
            stcToken.balanceOf(addr),
            usdcToken.balanceOf(addr),
            stcToken.getStakingInfo(addr),
            subscriptionContract.getSTCCooldownStatus(addr)
          ]);
          stcBalance = parseFloat(stc).toLocaleString(void 0, { maximumFractionDigits: 2 });
          usdcBalance = parseFloat(usdc).toFixed(2);
          stakingInfo = stakeData;
          cooldownStatus = status;
        } catch (e) {
          console.error("Balance load error:", e);
        } finally {
          isLoadingBalances = false;
        }
      }
      async function handleRedeem() {
        if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) return;
        errorMsg = "";
        txSuccess = "";
        isRedeeming = true;
        try {
          const allowance = await stcToken.allowance(store_get($$store_subs ??= {}, "$walletAddress", walletAddress), subAddr);
          const redeemAmt = stcRedeemAmount.replace(/,/g, "");
          if (parseFloat(allowance) < parseFloat(redeemAmt)) {
            await stcToken.approve(subAddr, redeemAmt);
          }
          await subscriptionContract.mintSubscriptionWithSTC();
          txSuccess = "Success! 1 month Basic subscription activated.";
          if (store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) await loadBalances(store_get($$store_subs ??= {}, "$walletAddress", walletAddress));
        } catch (e) {
          if (e?.message?.includes("cooldown")) {
            errorMsg = "Cooldown active — check your remaining wait time below.";
          } else if (e?.message?.includes("Insufficient")) {
            errorMsg = `You need at least ${stcRedeemAmount} STC to redeem a subscription.`;
          } else if (e?.message?.includes("rejected")) {
            errorMsg = "Transaction cancelled.";
          } else {
            errorMsg = "Redemption failed. Try again.";
          }
        } finally {
          isRedeeming = false;
        }
      }
      function formatCooldown(secs) {
        if (secs <= 0) return "Ready now";
        const d = Math.floor(secs / 86400);
        const h = Math.floor(secs % 86400 / 3600);
        if (d > 0) return `${d}d ${h}h remaining`;
        return `${h}h remaining`;
      }
      $$renderer2.push(`<div class="relative min-h-screen bg-(--surface-charcoal) text-white overflow-hidden">`);
      push_element($$renderer2, "div", 314, 0);
      $$renderer2.push(`<div class="absolute inset-0 pointer-events-none">`);
      push_element($$renderer2, "div", 316, 2);
      $$renderer2.push(`<div class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-[#FFBF00]/8 blur-[120px] rounded-full">`);
      push_element($$renderer2, "div", 317, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="absolute bottom-0 right-1/4 w-100 h-75 bg-[#FF5E0E]/8 blur-[100px] rounded-full">`);
      push_element($$renderer2, "div", 318, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="relative z-10 container mx-auto px-4 pt-28 pb-20 max-w-5xl">`);
      push_element($$renderer2, "div", 321, 2);
      $$renderer2.push(`<div class="text-center mb-10">`);
      push_element($$renderer2, "div", 324, 4);
      $$renderer2.push(`<div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-sm font-medium text-[#FFBF00] mb-4">`);
      push_element($$renderer2, "div", 325, 6);
      Coins($$renderer2, { class: "h-4 w-4" });
      $$renderer2.push(`<!----> Studio Token · Polygon Network</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-4xl font-extrabold mb-2">`);
      push_element($$renderer2, "h1", 328, 6);
      $$renderer2.push(`STC Token</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/55 max-w-xl mx-auto">`);
      push_element($$renderer2, "p", 329, 6);
      $$renderer2.push(`Buy STC with USDC, sell STC for USDC, or redeem ${escape_html(stcRedeemAmount)} STC for a free month subscription.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mb-8 flex flex-wrap gap-6 items-center justify-between text-sm">`);
      push_element($$renderer2, "div", 333, 4);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center gap-2 text-white/40 text-sm">`);
        push_element($$renderer2, "div", 335, 8);
        Loader_circle($$renderer2, { class: "h-4 w-4 animate-spin" });
        $$renderer2.push(`<!----> Loading pool data...</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="grid lg:grid-cols-5 gap-6">`);
      push_element($$renderer2, "div", 366, 4);
      $$renderer2.push(`<div class="lg:col-span-3">`);
      push_element($$renderer2, "div", 369, 6);
      $$renderer2.push(`<div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">`);
      push_element($$renderer2, "div", 370, 8);
      $$renderer2.push(`<div class="flex items-center justify-between mb-6">`);
      push_element($$renderer2, "div", 371, 10);
      $$renderer2.push(`<h2 class="text-lg font-bold">`);
      push_element($$renderer2, "h2", 372, 12);
      $$renderer2.push(`Swap</h2>`);
      pop_element();
      $$renderer2.push(` <div class="flex rounded-xl border border-white/10 overflow-hidden text-sm">`);
      push_element($$renderer2, "div", 374, 12);
      $$renderer2.push(`<button${attr_class(`px-4 py-1.5 transition-colors ${stringify(
        "bg-[#FF5E0E] text-white"
      )}`)}>`);
      push_element($$renderer2, "button", 375, 14);
      $$renderer2.push(`Buy STC</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`px-4 py-1.5 transition-colors ${stringify("text-white/50 hover:text-white/80")}`)}>`);
      push_element($$renderer2, "button", 379, 14);
      $$renderer2.push(`Sell STC</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-xl border border-white/10 bg-white/5 p-4 mb-2">`);
      push_element($$renderer2, "div", 387, 10);
      $$renderer2.push(`<div class="flex justify-between text-xs text-white/40 mb-2">`);
      push_element($$renderer2, "div", 388, 12);
      $$renderer2.push(`<span>`);
      push_element($$renderer2, "span", 389, 14);
      $$renderer2.push(`You pay</span>`);
      pop_element();
      $$renderer2.push(` <span>`);
      push_element($$renderer2, "span", 390, 14);
      $$renderer2.push(`Balance: ${escape_html(usdcBalance)} ${escape_html("USDC")} `);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="ml-1 text-[#FF5E0E] hover:underline">`);
        push_element($$renderer2, "button", 393, 18);
        $$renderer2.push(`MAX</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-3">`);
      push_element($$renderer2, "div", 397, 12);
      $$renderer2.push(`<input type="number" placeholder="0.00"${attr("value", inputAmount)} min="0" class="flex-1 bg-transparent text-2xl font-bold outline-none placeholder-white/20 [appearance:textfield] [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none"/>`);
      push_element($$renderer2, "input", 398, 14);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">`);
      push_element($$renderer2, "div", 405, 14);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-[#3cba54] font-bold text-base">`);
        push_element($$renderer2, "span", 407, 18);
        $$renderer2.push(`$</span>`);
        pop_element();
        $$renderer2.push(` USDC`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-center my-2">`);
      push_element($$renderer2, "div", 416, 10);
      $$renderer2.push(`<button class="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors" aria-label="Flip direction">`);
      push_element($$renderer2, "button", 417, 12);
      Arrow_up_down($$renderer2, { class: "h-4 w-4 text-white/60" });
      $$renderer2.push(`<!----></button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">`);
      push_element($$renderer2, "div", 427, 10);
      $$renderer2.push(`<div class="flex justify-between text-xs text-white/40 mb-2">`);
      push_element($$renderer2, "div", 428, 12);
      $$renderer2.push(`<span>`);
      push_element($$renderer2, "span", 429, 14);
      $$renderer2.push(`You receive (estimate)</span>`);
      pop_element();
      $$renderer2.push(` <span>`);
      push_element($$renderer2, "span", 430, 14);
      $$renderer2.push(`Balance: ${escape_html(stcBalance)} ${escape_html("STC")}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-3">`);
      push_element($$renderer2, "div", 432, 12);
      $$renderer2.push(`<div class="flex-1 text-2xl font-bold text-white/80">`);
      push_element($$renderer2, "div", 433, 14);
      $$renderer2.push(`${escape_html("—")}</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">`);
      push_element($$renderer2, "div", 436, 14);
      {
        $$renderer2.push("<!--[-->");
        Coins($$renderer2, { class: "h-4 w-4 text-[#FFBF00]" });
        $$renderer2.push(`<!----> STC`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (errorMsg) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400 mb-4">`);
        push_element($$renderer2, "div", 474, 12);
        Circle_alert($$renderer2, { class: "h-4 w-4 shrink-0" });
        $$renderer2.push(`<!----> ${escape_html(errorMsg)}</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (txSuccess) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-400 mb-4">`);
        push_element($$renderer2, "div", 479, 12);
        Circle_check($$renderer2, { class: "h-4 w-4 shrink-0" });
        $$renderer2.push(`<!----> ${escape_html(txSuccess)}</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          onclick: () => connectWallet("injected"),
          class: "w-full bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white h-12 text-base font-semibold",
          children: prevent_snippet_stringification(($$renderer3) => {
            Wallet($$renderer3, { class: "mr-2 h-5 w-5" });
            $$renderer3.push(`<!----> Connect Wallet`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        if (stcReserveRaw === 0n) {
          $$renderer2.push("<!--[-->");
          Button($$renderer2, {
            disabled: true,
            class: "w-full h-12 text-base opacity-50 cursor-not-allowed",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->No liquidity in pool`);
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
          {
            $$renderer2.push("<!--[-->");
            Button($$renderer2, {
              disabled: true,
              class: "w-full h-12 text-base opacity-50 cursor-not-allowed",
              children: prevent_snippet_stringification(($$renderer3) => {
                $$renderer3.push(`<!---->Enter an amount`);
              }),
              $$slots: { default: true }
            });
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--> <p class="text-center text-xs text-white/30 mt-3">`);
      push_element($$renderer2, "p", 526, 10);
      $$renderer2.push(`Internal platform AMM · Polygon Mainnet · Prices update in real time</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 rounded-2xl border border-[#FFBF00]/20 bg-[#FFBF00]/5 backdrop-blur-md p-5">`);
      push_element($$renderer2, "div", 532, 8);
      $$renderer2.push(`<div class="flex items-start justify-between gap-4">`);
      push_element($$renderer2, "div", 533, 10);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 534, 12);
      $$renderer2.push(`<p class="font-semibold mb-1 flex items-center gap-2">`);
      push_element($$renderer2, "p", 535, 14);
      Coins($$renderer2, { class: "h-4 w-4 text-[#FFBF00]" });
      $$renderer2.push(`<!----> Redeem ${escape_html(stcRedeemAmount)} STC → 1 Free Month</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-sm text-white/55 leading-relaxed">`);
      push_element($$renderer2, "p", 539, 14);
      $$renderer2.push(`Spend ${escape_html(stcRedeemAmount)} STC for one month Basic access. Cooldown: 100 days after 1st use, 200 days after 2nd, alternating. STC returns to platform pool.</p>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected) && cooldownStatus !== null) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p${attr_class(`text-xs mt-2 ${stringify(cooldownStatus.secondsRemaining === 0 ? "text-green-400" : "text-amber-400")}`)}>`);
        push_element($$renderer2, "p", 543, 16);
        $$renderer2.push(`${escape_html(cooldownStatus.secondsRemaining === 0 ? "Ready to redeem" : formatCooldown(cooldownStatus.secondsRemaining) + ` · Next cooldown: ${cooldownStatus.nextCooldownDays} days`)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          onclick: () => connectWallet("injected"),
          variant: "outline",
          class: "shrink-0 border-[#FFBF00]/40 text-[#FFBF00] hover:bg-[#FFBF00]/10",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Connect`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Button($$renderer2, {
          onclick: handleRedeem,
          disabled: isRedeeming || cooldownStatus !== null && cooldownStatus.secondsRemaining > 0,
          class: "shrink-0 bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
          children: prevent_snippet_stringification(($$renderer3) => {
            if (isRedeeming) {
              $$renderer3.push("<!--[-->");
              Loader_circle($$renderer3, { class: "mr-1 h-4 w-4 animate-spin" });
              $$renderer3.push(`<!----> Redeeming...`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`Redeem`);
            }
            $$renderer3.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="lg:col-span-2 space-y-4">`);
      push_element($$renderer2, "div", 572, 6);
      $$renderer2.push(`<div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">`);
      push_element($$renderer2, "div", 575, 8);
      $$renderer2.push(`<h3 class="font-semibold mb-4 flex items-center gap-2 text-sm text-white/70 uppercase tracking-wider">`);
      push_element($$renderer2, "h3", 576, 10);
      Wallet($$renderer2, { class: "h-4 w-4" });
      $$renderer2.push(`<!----> Your Wallet</h3>`);
      pop_element();
      $$renderer2.push(` `);
      if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-4">`);
        push_element($$renderer2, "div", 580, 12);
        $$renderer2.push(`<p class="text-sm text-white/40 mb-3">`);
        push_element($$renderer2, "p", 581, 14);
        $$renderer2.push(`Connect your wallet to see balances</p>`);
        pop_element();
        $$renderer2.push(` `);
        Button($$renderer2, {
          onclick: () => connectWallet("injected"),
          class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white w-full",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Connect Wallet`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> <button class="mt-2 w-full text-xs text-white/40 hover:text-white/60 transition-colors">`);
        push_element($$renderer2, "button", 585, 14);
        $$renderer2.push(`Use WalletConnect (mobile)</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-3">`);
        push_element($$renderer2, "div", 590, 12);
        $$renderer2.push(`<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">`);
        push_element($$renderer2, "div", 591, 14);
        $$renderer2.push(`<div class="flex items-center gap-2">`);
        push_element($$renderer2, "div", 592, 16);
        Coins($$renderer2, { class: "h-5 w-5 text-[#FFBF00]" });
        $$renderer2.push(`<!----> <div>`);
        push_element($$renderer2, "div", 594, 18);
        $$renderer2.push(`<p class="text-xs text-white/40">`);
        push_element($$renderer2, "p", 595, 20);
        $$renderer2.push(`STC Balance</p>`);
        pop_element();
        $$renderer2.push(` <p class="font-bold">`);
        push_element($$renderer2, "p", 596, 20);
        $$renderer2.push(`${escape_html(isLoadingBalances ? "..." : stcBalance)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-xs text-white/30">`);
        push_element($$renderer2, "p", 599, 16);
        $$renderer2.push(`Studio Token</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">`);
        push_element($$renderer2, "div", 601, 14);
        $$renderer2.push(`<div class="flex items-center gap-2">`);
        push_element($$renderer2, "div", 602, 16);
        $$renderer2.push(`<span class="h-5 w-5 flex items-center justify-center text-[#3cba54] font-bold text-lg">`);
        push_element($$renderer2, "span", 603, 18);
        $$renderer2.push(`$</span>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 604, 18);
        $$renderer2.push(`<p class="text-xs text-white/40">`);
        push_element($$renderer2, "p", 605, 20);
        $$renderer2.push(`USDC Balance</p>`);
        pop_element();
        $$renderer2.push(` <p class="font-bold">`);
        push_element($$renderer2, "p", 606, 20);
        $$renderer2.push(`${escape_html(isLoadingBalances ? "..." : usdcBalance)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-xs text-white/30">`);
        push_element($$renderer2, "p", 609, 16);
        $$renderer2.push(`USD Coin</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <button class="w-full text-xs text-white/30 hover:text-white/60 flex items-center justify-center gap-1 transition-colors py-1">`);
        push_element($$renderer2, "button", 611, 14);
        Refresh_cw($$renderer2, { class: "h-3 w-3" });
        $$renderer2.push(`<!----> Refresh balances</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">`);
      push_element($$renderer2, "div", 622, 8);
      $$renderer2.push(`<h3 class="font-semibold mb-3 text-sm text-white/70 uppercase tracking-wider">`);
      push_element($$renderer2, "h3", 623, 10);
      $$renderer2.push(`How to Earn STC</h3>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-3 text-sm">`);
      push_element($$renderer2, "div", 624, 10);
      $$renderer2.push(`<div class="flex items-start gap-3">`);
      push_element($$renderer2, "div", 625, 12);
      $$renderer2.push(`<div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FF5E0E]/15 flex items-center justify-center shrink-0">`);
      push_element($$renderer2, "div", 626, 14);
      Zap($$renderer2, { class: "h-4 w-4 text-[#FF5E0E]" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 629, 14);
      $$renderer2.push(`<p class="font-medium">`);
      push_element($$renderer2, "p", 630, 16);
      $$renderer2.push(`Watch content</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/45 text-xs">`);
      push_element($$renderer2, "p", 631, 16);
      $$renderer2.push(`1 STC per hour · Max 5 STC/day</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-start gap-3">`);
      push_element($$renderer2, "div", 634, 12);
      $$renderer2.push(`<div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FFBF00]/15 flex items-center justify-center shrink-0">`);
      push_element($$renderer2, "div", 635, 14);
      Arrow_right($$renderer2, { class: "h-4 w-4 text-[#FFBF00]" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 638, 14);
      $$renderer2.push(`<p class="font-medium">`);
      push_element($$renderer2, "p", 639, 16);
      $$renderer2.push(`Refer a friend</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/45 text-xs">`);
      push_element($$renderer2, "p", 640, 16);
      $$renderer2.push(`10 STC when they subscribe</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-start gap-3">`);
      push_element($$renderer2, "div", 643, 12);
      $$renderer2.push(`<div class="mt-0.5 w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">`);
      push_element($$renderer2, "div", 644, 14);
      Coins($$renderer2, { class: "h-4 w-4 text-purple-400" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 647, 14);
      $$renderer2.push(`<p class="font-medium">`);
      push_element($$renderer2, "p", 648, 16);
      $$renderer2.push(`Buy with USDC</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/45 text-xs">`);
      push_element($$renderer2, "p", 649, 16);
      $$renderer2.push(`Use the swap above</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">`);
      push_element($$renderer2, "div", 656, 8);
      $$renderer2.push(`<h3 class="font-semibold mb-3 text-sm text-white/70 uppercase tracking-wider">`);
      push_element($$renderer2, "h3", 657, 10);
      $$renderer2.push(`STC Utility</h3>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-3 text-sm">`);
      push_element($$renderer2, "div", 658, 10);
      $$renderer2.push(`<div class="flex items-start gap-3">`);
      push_element($$renderer2, "div", 659, 12);
      $$renderer2.push(`<div class="mt-0.5 w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">`);
      push_element($$renderer2, "div", 660, 14);
      Circle_check($$renderer2, { class: "h-4 w-4 text-green-400" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 663, 14);
      $$renderer2.push(`<p class="font-medium">`);
      push_element($$renderer2, "p", 664, 16);
      $$renderer2.push(`Free subscription</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/45 text-xs">`);
      push_element($$renderer2, "p", 665, 16);
      $$renderer2.push(`${escape_html(stcRedeemAmount)} STC = 1 month Basic</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-start gap-3">`);
      push_element($$renderer2, "div", 668, 12);
      $$renderer2.push(`<div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FFBF00]/15 flex items-center justify-center shrink-0">`);
      push_element($$renderer2, "div", 669, 14);
      Lock($$renderer2, { class: "h-4 w-4 text-[#FFBF00]" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 672, 14);
      $$renderer2.push(`<p class="font-medium">`);
      push_element($$renderer2, "p", 673, 16);
      $$renderer2.push(`Stake for discount</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-white/45 text-xs">`);
      push_element($$renderer2, "p", 674, 16);
      $$renderer2.push(`1,000–35,000 STC → 10–50% off</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Button($$renderer2, {
        href: "/plans",
        variant: "outline",
        class: "w-full mt-1 border-white/15 text-white/60 hover:bg-white/5 text-xs h-8",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->View Plans &amp; Staking `);
          External_link($$renderer3, { class: "ml-1 h-3 w-3" });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected) && stakingInfo && parseFloat(stakingInfo.amount) > 0 && !stakingInfo.isUnlocked) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="rounded-2xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-xl p-5">`);
        push_element($$renderer2, "div", 685, 10);
        $$renderer2.push(`<h3 class="font-semibold mb-1 text-sm text-purple-300 uppercase tracking-wider flex items-center gap-2">`);
        push_element($$renderer2, "h3", 686, 12);
        Lock($$renderer2, { class: "h-4 w-4" });
        $$renderer2.push(`<!----> Top Up Stake</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-xs text-white/45 mb-3">`);
        push_element($$renderer2, "p", 689, 12);
        $$renderer2.push(`Add more STC to your existing stake to upgrade your discount tier without waiting for lock expiry.</p>`);
        pop_element();
        $$renderer2.push(` <div class="mb-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60 space-y-1">`);
        push_element($$renderer2, "div", 692, 12);
        $$renderer2.push(`<div class="flex justify-between">`);
        push_element($$renderer2, "div", 693, 14);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 693, 48);
        $$renderer2.push(`Staked</span>`);
        pop_element();
        $$renderer2.push(`<span class="text-white/80 font-medium">`);
        push_element($$renderer2, "span", 693, 67);
        $$renderer2.push(`${escape_html(parseFloat(stakingInfo.amount).toLocaleString(void 0, { maximumFractionDigits: 0 }))} STC</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex justify-between">`);
        push_element($$renderer2, "div", 694, 14);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 694, 48);
        $$renderer2.push(`Tier</span>`);
        pop_element();
        $$renderer2.push(`<span class="text-purple-300 font-medium">`);
        push_element($$renderer2, "span", 694, 65);
        $$renderer2.push(`Tier ${escape_html(stakingInfo.discountTier)} (${escape_html(stakingInfo.discountTier === 1 ? 10 : stakingInfo.discountTier === 2 ? 20 : stakingInfo.discountTier === 3 ? 35 : stakingInfo.discountTier === 4 ? 50 : 0)}% off)</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex justify-between">`);
        push_element($$renderer2, "div", 695, 14);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 695, 48);
        $$renderer2.push(`Unstaked balance</span>`);
        pop_element();
        $$renderer2.push(`<span class="text-white/80 font-medium">`);
        push_element($$renderer2, "span", 695, 77);
        $$renderer2.push(`${escape_html(stcBalance)} STC</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <input type="number" placeholder="Amount to add"${attr("value", topUpAmount)} min="0" class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none mb-2 [appearance:textfield] [&amp;::-webkit-inner-spin-button]:appearance-none"/>`);
        push_element($$renderer2, "input", 697, 12);
        pop_element();
        $$renderer2.push(` `);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button disabled class="w-full rounded-lg bg-purple-500/20 text-purple-300/40 text-sm font-medium py-2 cursor-not-allowed">`);
          push_element($$renderer2, "button", 715, 14);
          $$renderer2.push(`Enter amount</button>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
export {
  _page as default
};
