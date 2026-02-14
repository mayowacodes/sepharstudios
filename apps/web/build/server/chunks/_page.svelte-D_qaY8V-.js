import { M as store_get, p as prevent_snippet_stringification, E as escape_html, x as stringify, m as ensure_array_like, D as attr_style, N as unsubscribe_stores } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { B as Button } from './button-B5TxIyzE.js';
import { W as Wallet, i as isConnected, w as walletAddress } from './wallet-B7_7GztS.js';
import { g as getUserBalances, t as tokenAMM, s as stcToken } from './contracts-1y8JjJRR.js';
import { W as WalletConnect } from './WalletConnect-kbrpxgJC.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { D as Dollar_sign } from './dollar-sign-DitbSj8h.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import { A as Activity } from './activity-utKZCrS9.js';
import { R as Refresh_cw } from './refresh-cw-BTej-Wkl.js';
import { U as Users } from './users-CMHMaCG6.js';
import { S as Star } from './star-BD4Vo9gv.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './utils2-C-_3GP94.js';
import './Icon-DLeFNkXp.js';
import '@wagmi/core';
import './config-Bjr_iq_c.js';
import '@wagmi/core/chains';
import '@wagmi/connectors';
import './index3-CnQVvK5M.js';
import 'viem';
import './external-link-DQXvFabB.js';
import './zap-BWprV7m9.js';

_page[FILENAME] = "src/routes/(creator)/creator/analytics/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let selectedPeriod = "30d";
      let selectedContent = "all";
      let revenueData = {
        stcBalance: "0",
        stcEarned: "0",
        stcValue: 0,
        fiatEarnings: 0,
        usdcEarnings: 0,
        totalRevenue: 0,
        revenueShare: 30,
        stcPrice: "0",
        stakingDiscount: 0,
        tier: "standard",
        nextTierRequirement: "0",
        isLoading: false
      };
      let earningsBreakdown = [
        { source: "Movie Completions", stc: 0, fiat: 0, count: 0 },
        { source: "TV Episode Views", stc: 0, fiat: 0, count: 0 },
        { source: "Documentary Premiums", stc: 0, fiat: 0, count: 0 },
        { source: "Subscription Bonuses", stc: 0, fiat: 0, count: 0 }
      ];
      let monthlyEarnings = [
        { month: "Aug", stc: 850, fiat: 425, total: 1275 },
        { month: "Jul", stc: 720, fiat: 360, total: 1080 },
        { month: "Jun", stc: 640, fiat: 320, total: 960 },
        { month: "May", stc: 580, fiat: 290, total: 870 },
        { month: "Apr", stc: 520, fiat: 260, total: 780 },
        { month: "Mar", stc: 480, fiat: 240, total: 720 }
      ];
      let tokenomicsLoading = false;
      async function loadRevenueData() {
        if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) return;
        tokenomicsLoading = true;
        try {
          const [balances, price, userDiscount] = await Promise.all([
            getUserBalances(store_get($$store_subs ??= {}, "$walletAddress", walletAddress)),
            tokenAMM.getSTCPrice(),
            stcToken.getUserDiscount(store_get($$store_subs ??= {}, "$walletAddress", walletAddress))
          ]);
          const stcEarned = "4250";
          const fiatEarnings = 2125;
          const totalRevenue = parseFloat(stcEarned) * parseFloat(price) + fiatEarnings;
          revenueData = {
            stcBalance: balances.stc,
            stcEarned,
            stcValue: parseFloat(stcEarned) * parseFloat(price),
            fiatEarnings,
            usdcEarnings: 850,
            // USDC payments
            totalRevenue,
            revenueShare: determineTierRevenueShare(parseFloat(balances.stc)),
            stcPrice: price,
            stakingDiscount: userDiscount,
            tier: determineTier(parseFloat(balances.stc), totalRevenue),
            nextTierRequirement: getNextTierRequirement(parseFloat(balances.stc)),
            isLoading: false
          };
          earningsBreakdown = [
            { source: "Movie Completions", stc: 1250, fiat: 625, count: 45 },
            { source: "TV Episode Views", stc: 1800, fiat: 900, count: 120 },
            {
              source: "Documentary Premiums",
              stc: 950,
              fiat: 475,
              count: 28
            },
            {
              source: "Subscription Bonuses",
              stc: 250,
              fiat: 125,
              count: 15
            }
          ];
        } catch (error) {
          console.error("Error loading revenue data:", error);
        } finally {
          tokenomicsLoading = false;
        }
      }
      function determineTierRevenueShare(stcBalance) {
        if (stcBalance >= 1e5) return 55;
        if (stcBalance >= 25e3) return 40;
        return 30;
      }
      function determineTier(stcBalance, revenue) {
        if (stcBalance >= 1e5 && revenue > 1e4) return "top_performer";
        if (stcBalance >= 25e3 && revenue > 5e3) return "exclusive";
        return "standard";
      }
      function getNextTierRequirement(stcBalance) {
        if (stcBalance < 25e3) return "25000";
        if (stcBalance < 1e5) return "100000";
        return "0";
      }
      function getTierColor(tier) {
        switch (tier) {
          case "top_performer":
            return "text-primary";
          case "exclusive":
            return "text-secondary";
          default:
            return "text-muted-foreground";
        }
      }
      function getTierIcon(tier) {
        switch (tier) {
          case "top_performer":
            return Crown;
          case "exclusive":
            return Star;
          default:
            return Users;
        }
      }
      function formatNumber(num) {
        if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
        if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
        return num.toString();
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 239, 0);
      $$renderer2.push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">`);
      push_element($$renderer2, "div", 241, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 242, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 243, 6);
      $$renderer2.push(`Analytics Dashboard</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 244, 6);
      $$renderer2.push(`Track your content performance and audience engagement</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 sm:mt-0 flex space-x-3">`);
      push_element($$renderer2, "div", 248, 4);
      $$renderer2.select(
        {
          value: selectedPeriod,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "7d" }, ($$renderer4) => {
            $$renderer4.push(`Last 7 days`);
          });
          $$renderer3.option({ value: "30d" }, ($$renderer4) => {
            $$renderer4.push(`Last 30 days`);
          });
          $$renderer3.option({ value: "90d" }, ($$renderer4) => {
            $$renderer4.push(`Last 90 days`);
          });
          $$renderer3.option({ value: "1y" }, ($$renderer4) => {
            $$renderer4.push(`Last year`);
          });
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          value: selectedContent,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Content`);
          });
          $$renderer3.option({ value: "3" }, ($$renderer4) => {
            $$renderer4.push(`Worship Night Live`);
          });
          $$renderer3.option({ value: "1" }, ($$renderer4) => {
            $$renderer4.push(`Faith in Action`);
          });
          $$renderer3.option({ value: "2" }, ($$renderer4) => {
            $$renderer4.push(`Sunday Sermon Series`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        Card($$renderer2, {
          class: "bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_title($$renderer4, {
                  class: "flex items-center space-x-2",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Coins($$renderer5, { class: "h-6 w-6 text-accent" });
                    $$renderer5.push(`<!----> <span>`);
                    push_element($$renderer5, "span", 277, 10);
                    $$renderer5.push(`Creator Revenue &amp; Tokenomics</span>`);
                    pop_element();
                    $$renderer5.push(` `);
                    Badge($$renderer5, {
                      variant: revenueData.tier === "top_performer" ? "default" : revenueData.tier === "exclusive" ? "secondary" : "outline",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(revenueData.tier === "top_performer" ? "Top Performer" : revenueData.tier === "exclusive" ? "Exclusive Partner" : "Standard Creator")}`);
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
                if (tokenomicsLoading) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="text-center py-8">`);
                  push_element($$renderer4, "div", 286, 10);
                  Refresh_cw($$renderer4, { class: "h-8 w-8 animate-spin mx-auto mb-4 text-primary" });
                  $$renderer4.push(`<!----> <p class="text-muted-foreground">`);
                  push_element($$renderer4, "p", 288, 12);
                  $$renderer4.push(`Loading revenue data...</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">`);
                  push_element($$renderer4, "div", 292, 10);
                  $$renderer4.push(`<div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 293, 12);
                  Dollar_sign($$renderer4, { class: "h-6 w-6 text-green-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 295, 14);
                  $$renderer4.push(`$${escape_html(revenueData.totalRevenue.toFixed(2))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 296, 14);
                  $$renderer4.push(`Total Revenue</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 298, 12);
                  Coins($$renderer4, { class: "h-6 w-6 text-accent mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 300, 14);
                  $$renderer4.push(`${escape_html(parseFloat(revenueData.stcEarned).toLocaleString())}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 301, 14);
                  $$renderer4.push(`STC Earned</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 303, 12);
                  Trending_up($$renderer4, { class: "h-6 w-6 text-primary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 305, 14);
                  $$renderer4.push(`$${escape_html(revenueData.stcValue.toFixed(2))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 306, 14);
                  $$renderer4.push(`STC Value</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 308, 12);
                  Activity($$renderer4, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 310, 14);
                  $$renderer4.push(`${escape_html(revenueData.revenueShare)}%</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 311, 14);
                  $$renderer4.push(`Revenue Share</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 313, 12);
                  if (getTierIcon(revenueData.tier)) {
                    $$renderer4.push("<!--[-->");
                    const TierIcon = getTierIcon(revenueData.tier);
                    $$renderer4.push(`<!---->`);
                    TierIcon($$renderer4, {
                      class: `h-6 w-6 mx-auto mb-2 ${stringify(getTierColor(revenueData.tier))}`
                    });
                    $$renderer4.push(`<!---->`);
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]--> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 318, 14);
                  $$renderer4.push(`${escape_html(revenueData.tier === "top_performer" ? "Top" : revenueData.tier === "exclusive" ? "Exclusive" : "Standard")}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 320, 14);
                  $$renderer4.push(`Creator Tier</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 322, 12);
                  Wallet($$renderer4, { class: "h-6 w-6 text-purple-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 324, 14);
                  $$renderer4.push(`${escape_html(parseFloat(revenueData.stcBalance).toLocaleString())}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 325, 14);
                  $$renderer4.push(`STC Balance</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">`);
                  push_element($$renderer4, "div", 330, 10);
                  $$renderer4.push(`<div class="space-y-4">`);
                  push_element($$renderer4, "div", 332, 12);
                  $$renderer4.push(`<h3 class="text-lg font-semibold flex items-center">`);
                  push_element($$renderer4, "h3", 333, 14);
                  Activity($$renderer4, { class: "h-5 w-5 mr-2 text-primary" });
                  $$renderer4.push(`<!----> Earnings by Content Type</h3>`);
                  pop_element();
                  $$renderer4.push(` <div class="space-y-3">`);
                  push_element($$renderer4, "div", 337, 14);
                  $$renderer4.push(`<!--[-->`);
                  const each_array = ensure_array_like(earningsBreakdown);
                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                    let earning = each_array[$$index];
                    $$renderer4.push(`<div class="p-3 bg-white/5 rounded-lg">`);
                    push_element($$renderer4, "div", 339, 18);
                    $$renderer4.push(`<div class="flex items-center justify-between mb-2">`);
                    push_element($$renderer4, "div", 340, 20);
                    $$renderer4.push(`<span class="font-medium">`);
                    push_element($$renderer4, "span", 341, 22);
                    $$renderer4.push(`${escape_html(earning.source)}</span>`);
                    pop_element();
                    $$renderer4.push(` `);
                    Badge($$renderer4, {
                      variant: "outline",
                      children: prevent_snippet_stringification(($$renderer5) => {
                        $$renderer5.push(`<!---->${escape_html(earning.count)} items`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer4.push(`<!----></div>`);
                    pop_element();
                    $$renderer4.push(` <div class="grid grid-cols-3 gap-2 text-sm">`);
                    push_element($$renderer4, "div", 344, 20);
                    $$renderer4.push(`<div>`);
                    push_element($$renderer4, "div", 345, 22);
                    $$renderer4.push(`<div class="text-muted-foreground">`);
                    push_element($$renderer4, "div", 346, 24);
                    $$renderer4.push(`STC</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="font-medium">`);
                    push_element($$renderer4, "div", 347, 24);
                    $$renderer4.push(`${escape_html(earning.stc.toLocaleString())}</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div>`);
                    push_element($$renderer4, "div", 349, 22);
                    $$renderer4.push(`<div class="text-muted-foreground">`);
                    push_element($$renderer4, "div", 350, 24);
                    $$renderer4.push(`Fiat</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="font-medium">`);
                    push_element($$renderer4, "div", 351, 24);
                    $$renderer4.push(`$${escape_html(earning.fiat)}</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div>`);
                    push_element($$renderer4, "div", 353, 22);
                    $$renderer4.push(`<div class="text-muted-foreground">`);
                    push_element($$renderer4, "div", 354, 24);
                    $$renderer4.push(`Total</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="font-medium">`);
                    push_element($$renderer4, "div", 355, 24);
                    $$renderer4.push(`$${escape_html((earning.stc * parseFloat(revenueData.stcPrice) + earning.fiat).toFixed(0))}</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                  }
                  $$renderer4.push(`<!--]--></div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="space-y-4">`);
                  push_element($$renderer4, "div", 364, 12);
                  $$renderer4.push(`<h3 class="text-lg font-semibold flex items-center">`);
                  push_element($$renderer4, "h3", 365, 14);
                  Trending_up($$renderer4, { class: "h-5 w-5 mr-2 text-secondary" });
                  $$renderer4.push(`<!----> Monthly Earnings Trend</h3>`);
                  pop_element();
                  $$renderer4.push(` <div class="space-y-3">`);
                  push_element($$renderer4, "div", 369, 14);
                  $$renderer4.push(`<!--[-->`);
                  const each_array_1 = ensure_array_like(monthlyEarnings);
                  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                    let month = each_array_1[$$index_1];
                    $$renderer4.push(`<div class="flex items-center justify-between">`);
                    push_element($$renderer4, "div", 371, 18);
                    $$renderer4.push(`<span class="text-sm font-medium">`);
                    push_element($$renderer4, "span", 372, 20);
                    $$renderer4.push(`${escape_html(month.month)}</span>`);
                    pop_element();
                    $$renderer4.push(` <div class="flex items-center space-x-4">`);
                    push_element($$renderer4, "div", 373, 20);
                    $$renderer4.push(`<div class="text-right">`);
                    push_element($$renderer4, "div", 374, 22);
                    $$renderer4.push(`<div class="text-sm font-medium">`);
                    push_element($$renderer4, "div", 375, 24);
                    $$renderer4.push(`$${escape_html(month.total)}</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                    push_element($$renderer4, "div", 376, 24);
                    $$renderer4.push(`${escape_html(month.stc)} STC + $${escape_html(month.fiat)}</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="w-20 bg-muted rounded-full h-2">`);
                    push_element($$renderer4, "div", 378, 22);
                    $$renderer4.push(`<div class="h-2 bg-gradient-to-r from-accent to-primary rounded-full"${attr_style(`width: ${stringify(month.total / Math.max(...monthlyEarnings.map((m) => m.total)) * 100)}%`)}>`);
                    push_element($$renderer4, "div", 379, 24);
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                  }
                  $$renderer4.push(`<!--]--></div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` `);
                  if (revenueData.nextTierRequirement !== "0") {
                    $$renderer4.push("<!--[-->");
                    $$renderer4.push(`<div class="p-4 bg-primary/10 border border-primary/20 rounded-lg">`);
                    push_element($$renderer4, "div", 393, 12);
                    $$renderer4.push(`<h4 class="font-semibold mb-2 flex items-center">`);
                    push_element($$renderer4, "h4", 394, 14);
                    Crown($$renderer4, { class: "h-5 w-5 mr-2 text-primary" });
                    $$renderer4.push(`<!----> Tier Upgrade Progress</h4>`);
                    pop_element();
                    $$renderer4.push(` <p class="text-sm text-muted-foreground mb-3">`);
                    push_element($$renderer4, "p", 398, 14);
                    $$renderer4.push(`Stake ${escape_html(formatNumber(parseFloat(revenueData.nextTierRequirement) - parseFloat(revenueData.stcBalance)))} more STC to unlock the next tier with higher revenue share</p>`);
                    pop_element();
                    $$renderer4.push(` <div class="flex items-center justify-between text-sm">`);
                    push_element($$renderer4, "div", 401, 14);
                    $$renderer4.push(`<span>`);
                    push_element($$renderer4, "span", 402, 16);
                    $$renderer4.push(`Current: ${escape_html(formatNumber(parseFloat(revenueData.stcBalance)))}</span>`);
                    pop_element();
                    $$renderer4.push(` <span>`);
                    push_element($$renderer4, "span", 403, 16);
                    $$renderer4.push(`Target: ${escape_html(formatNumber(parseFloat(revenueData.nextTierRequirement)))}</span>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="w-full bg-muted rounded-full h-2 mt-2">`);
                    push_element($$renderer4, "div", 405, 14);
                    $$renderer4.push(`<div class="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"${attr_style(`width: ${stringify(parseFloat(revenueData.stcBalance) / parseFloat(revenueData.nextTierRequirement) * 100)}%`)}>`);
                    push_element($$renderer4, "div", 406, 16);
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]--> <div class="flex justify-center space-x-3 mt-6">`);
                  push_element($$renderer4, "div", 414, 10);
                  Button($$renderer4, {
                    onclick: loadRevenueData,
                    disabled: tokenomicsLoading,
                    size: "sm",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      if (tokenomicsLoading) {
                        $$renderer5.push("<!--[-->");
                        Refresh_cw($$renderer5, { class: "mr-2 h-4 w-4 animate-spin" });
                      } else {
                        $$renderer5.push("<!--[!-->");
                        Refresh_cw($$renderer5, { class: "mr-2 h-4 w-4" });
                      }
                      $$renderer5.push(`<!--]--> Refresh Data`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!----> `);
                  Button($$renderer4, {
                    href: "/creator/earnings",
                    variant: "outline",
                    size: "sm",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      Dollar_sign($$renderer5, { class: "mr-2 h-4 w-4" });
                      $$renderer5.push(`<!----> Full Earnings Dashboard`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!----> `);
                  Button($$renderer4, {
                    href: "/tokens",
                    variant: "outline",
                    size: "sm",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      Coins($$renderer5, { class: "mr-2 h-4 w-4" });
                      $$renderer5.push(`<!----> Manage STC`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!----></div>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]-->`);
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
          class: "bg-gradient-to-r from-orange-500/10 to-accent/10 border-orange-500/20",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6 text-center",
              children: prevent_snippet_stringification(($$renderer4) => {
                Wallet($$renderer4, { class: "h-12 w-12 text-orange-500 mx-auto mb-4" });
                $$renderer4.push(`<!----> <h3 class="text-lg font-semibold mb-2">`);
                push_element($$renderer4, "h3", 439, 8);
                $$renderer4.push(`Enhanced Revenue Analytics</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground mb-4">`);
                push_element($$renderer4, "p", 440, 8);
                $$renderer4.push(`Connect wallet to access detailed STC earnings, tokenomics metrics, and tier benefits</p>`);
                pop_element();
                $$renderer4.push(` <div class="flex justify-center space-x-3">`);
                push_element($$renderer4, "div", 441, 8);
                WalletConnect($$renderer4);
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  href: "/creator/earnings",
                  variant: "outline",
                  size: "sm",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Dollar_sign($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> View Earnings`);
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
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center py-12">`);
        push_element($$renderer2, "div", 454, 4);
        $$renderer2.push(`<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white">`);
        push_element($$renderer2, "div", 455, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-white ml-4">`);
        push_element($$renderer2, "p", 456, 6);
        $$renderer2.push(`Loading analytics...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
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
//# sourceMappingURL=_page.svelte-D_qaY8V-.js.map
