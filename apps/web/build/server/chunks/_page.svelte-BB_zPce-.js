import { b as push_element, d as pop_element, j as store_get, p as prevent_snippet_stringification, l as escape_html, e as ensure_array_like, k as attr_class, i as stringify, w as attr_style, u as unsubscribe_stores, F as FILENAME, g as attr } from './ui-libs-Yf6h8PPk.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-Bb6tCQUO.js';
import { B as Badge } from './badge-D_nuztXS.js';
import { B as Button } from './button-C1v8XzqW.js';
import { W as Wallet, i as isConnected, w as walletAddress } from './wallet-DdtFC4L6.js';
import { s as stcToken, t as tokenAMM } from './contracts-DFOg1rza.js';
import { C as Coins } from './coins-CTU1RUMc.js';
import { T as Trending_up, D as Dollar_sign } from './trending-up-DhkfNATO.js';
import { A as Activity } from './activity-C1wuSsPl.js';
import { C as Crown } from './crown-D96XsnbH.js';
import { U as Users } from './users-B4M3or-k.js';
import { R as Refresh_cw } from './refresh-cw-ChMFf4d3.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './Icon-DVHDtCfs.js';
import './config-DiSGGbdB.js';
import 'node:crypto';
import './getAccount-CAZUvBhV.js';
import './sendRawTransaction-hYphdCNk.js';
import './node-DdUQjS54.js';

_page[FILENAME] = "src/routes/(admin)/admin/analytics/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let platformMetrics = {
        totalUsers: 0,
        activeCreators: 0,
        totalContent: 0,
        totalViews: 0,
        totalRevenue: 0,
        newUsersToday: 0,
        contentPublishedToday: 0,
        viewsToday: 0
      };
      let contentAnalytics = [];
      let userGrowthData = [];
      let revenueData = [];
      let geographicData = [];
      let topCreators = [];
      let topContent = [];
      let tokenomicsMetrics = {
        totalStcSupply: "0",
        circulatingSupply: "0",
        stcPrice: "0",
        marketCap: 0,
        totalStaked: "0",
        stakingRewards: "0",
        totalEarned: "0",
        burnRate: "0",
        subscriptionRevenue: 0,
        nftHolders: 0,
        avgStakeAmount: "0",
        stakingAPY: 0
      };
      let tokenDistribution = [];
      let stakingTiers = [];
      let loading = true;
      let tokenomicsLoading = false;
      let selectedTimeRange = "30d";
      let selectedMetric = "views";
      let adminWalletInfo = {
        stcBalance: "0",
        adminPrivileges: false,
        lastLogin: "",
        isLoading: false
      };
      async function loadAdminWalletInfo() {
        if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) return;
        adminWalletInfo.isLoading = true;
        try {
          const balance = await stcToken.balanceOf(store_get($$store_subs ??= {}, "$walletAddress", walletAddress));
          adminWalletInfo = {
            stcBalance: balance,
            adminPrivileges: true,
            // TODO: Check actual admin privileges from contract
            lastLogin: (/* @__PURE__ */ new Date()).toISOString(),
            isLoading: false
          };
        } catch (error) {
          console.error("Error loading admin wallet info:", error);
          adminWalletInfo.isLoading = false;
        }
      }
      async function loadTokenomicsData() {
        tokenomicsLoading = true;
        try {
          const [totalSupply, price] = await Promise.all([stcToken.totalSupply(), tokenAMM.getSTCPrice()]);
          tokenomicsMetrics = {
            totalStcSupply: totalSupply,
            circulatingSupply: (parseFloat(totalSupply) * 0.75).toString(),
            stcPrice: price,
            marketCap: parseFloat(totalSupply) * parseFloat(price),
            totalStaked: (parseFloat(totalSupply) * 0.35).toString(),
            stakingRewards: "245000",
            totalEarned: "1250000",
            burnRate: "12500",
            subscriptionRevenue: 125e3,
            nftHolders: 2847,
            avgStakeAmount: "15000",
            stakingAPY: 12.5
          };
          tokenDistribution = [
            {
              category: "Circulating Supply",
              amount: tokenomicsMetrics.circulatingSupply,
              percentage: 75,
              color: "bg-primary"
            },
            {
              category: "Staked Tokens",
              amount: tokenomicsMetrics.totalStaked,
              percentage: 35,
              color: "bg-secondary"
            },
            {
              category: "Rewards Pool",
              amount: tokenomicsMetrics.stakingRewards,
              percentage: 15,
              color: "bg-accent"
            },
            {
              category: "Treasury",
              amount: "500000",
              percentage: 10,
              color: "bg-green-500"
            }
          ];
          stakingTiers = [
            {
              tier: "Bronze",
              minStake: "1000",
              discount: 10,
              holders: 15e3,
              totalStaked: "25000000"
            },
            {
              tier: "Silver",
              minStake: "5000",
              discount: 25,
              holders: 8500,
              totalStaked: "75000000"
            },
            {
              tier: "Gold",
              minStake: "25000",
              discount: 40,
              holders: 2800,
              totalStaked: "125000000"
            },
            {
              tier: "Platinum",
              minStake: "100000",
              discount: 50,
              holders: 450,
              totalStaked: "85000000"
            }
          ];
        } catch (error) {
          console.error("Error loading tokenomics data:", error);
        } finally {
          tokenomicsLoading = false;
        }
      }
      async function loadAnalytics() {
        loading = true;
        try {
          const res = await fetch(`/api/admin/analytics?range=${selectedTimeRange}`);
          if (res.ok) {
            const data = await res.json();
            platformMetrics = data.platformMetrics;
            contentAnalytics = data.contentAnalytics;
            userGrowthData = data.userGrowthData;
            revenueData = data.revenueData;
            geographicData = data.geographicData;
            topCreators = data.topCreators;
            topContent = data.topContent;
          }
        } finally {
          loading = false;
        }
      }
      function formatNumber(num) {
        if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
        if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
        return num.toString();
      }
      function formatCurrency(amount) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
      }
      function formatPercentage(value) {
        return (value * 100).toFixed(1) + "%";
      }
      function getCategoryColor(category) {
        const colors = {
          "Sermons": "bg-blue-500",
          "Bible Studies": "bg-green-500",
          "Worship": "bg-purple-500",
          "Youth Ministry": "bg-yellow-500",
          "Testimonies": "bg-pink-500"
        };
        return colors[category] || "bg-gray-500";
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 246, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 248, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 249, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white">`);
      push_element($$renderer2, "h1", 250, 6);
      $$renderer2.push(`Platform Analytics</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 251, 6);
      $$renderer2.push(`Monitor platform performance and user engagement</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 254, 4);
      $$renderer2.select(
        {
          value: selectedTimeRange,
          onchange: loadAnalytics,
          class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "7d" }, ($$renderer4) => {
            $$renderer4.push(`Last 7 Days`);
          });
          $$renderer3.option({ value: "30d" }, ($$renderer4) => {
            $$renderer4.push(`Last 30 Days`);
          });
          $$renderer3.option({ value: "90d" }, ($$renderer4) => {
            $$renderer4.push(`Last 90 Days`);
          });
          $$renderer3.option({ value: "1y" }, ($$renderer4) => {
            $$renderer4.push(`Last Year`);
          });
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          value: selectedMetric,
          class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "views" }, ($$renderer4) => {
            $$renderer4.push(`Views`);
          });
          $$renderer3.option({ value: "revenue" }, ($$renderer4) => {
            $$renderer4.push(`Revenue`);
          });
          $$renderer3.option({ value: "engagement" }, ($$renderer4) => {
            $$renderer4.push(`Engagement`);
          });
          $$renderer3.option({ value: "users" }, ($$renderer4) => {
            $$renderer4.push(`Users`);
          });
        }
      );
      $$renderer2.push(` <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 276, 6);
      $$renderer2.push(`📊 Export Report</button>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          onclick: () => {
            loadTokenomicsData();
            if (store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) loadAdminWalletInfo();
          },
          disabled: tokenomicsLoading || adminWalletInfo.isLoading,
          variant: "outline",
          children: prevent_snippet_stringification(($$renderer3) => {
            if (tokenomicsLoading || adminWalletInfo.isLoading) {
              $$renderer3.push("<!--[-->");
              Refresh_cw($$renderer3, { class: "mr-2 h-4 w-4 animate-spin" });
            } else {
              $$renderer3.push("<!--[!-->");
              Coins($$renderer3, { class: "mr-2 h-4 w-4" });
            }
            $$renderer3.push(`<!--]--> Refresh Data`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        Card($$renderer2, {
          class: "bg-linear-to-r from-primary/20 to-accent/20 border-primary/30",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_title($$renderer4, {
                  class: "flex items-center space-x-2",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Coins($$renderer5, { class: "h-6 w-6 text-accent" });
                    $$renderer5.push(`<!----> <span>`);
                    push_element($$renderer5, "span", 306, 10);
                    $$renderer5.push(`StudioChain Tokenomics Dashboard</span>`);
                    pop_element();
                    $$renderer5.push(` `);
                    Badge($$renderer5, {
                      variant: "secondary",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->Admin View`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    if (store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) {
                      $$renderer5.push("<!--[-->");
                      Badge($$renderer5, {
                        variant: "outline",
                        class: "text-xs",
                        children: prevent_snippet_stringification(($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(0, 6))}...${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(-4))}`);
                        }),
                        $$slots: { default: true }
                      });
                    } else {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]-->`);
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
                  push_element($$renderer4, "div", 317, 10);
                  Refresh_cw($$renderer4, { class: "h-8 w-8 animate-spin mx-auto mb-4 text-primary" });
                  $$renderer4.push(`<!----> <p class="text-muted-foreground">`);
                  push_element($$renderer4, "p", 319, 12);
                  $$renderer4.push(`Loading tokenomics data...</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<div class="mb-6 p-4 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">`);
                  push_element($$renderer4, "div", 323, 10);
                  $$renderer4.push(`<div class="flex items-center justify-between">`);
                  push_element($$renderer4, "div", 324, 12);
                  $$renderer4.push(`<div class="flex items-center space-x-3">`);
                  push_element($$renderer4, "div", 325, 14);
                  Wallet($$renderer4, { class: "h-6 w-6 text-blue-400" });
                  $$renderer4.push(`<!----> <div>`);
                  push_element($$renderer4, "div", 327, 16);
                  $$renderer4.push(`<h4 class="font-medium text-white">`);
                  push_element($$renderer4, "h4", 328, 18);
                  $$renderer4.push(`Admin Wallet Connected</h4>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "p", 329, 18);
                  $$renderer4.push(`${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress) ? `${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(0, 8)}...${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(-6)}` : "Not Connected")}</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-right">`);
                  push_element($$renderer4, "div", 334, 14);
                  $$renderer4.push(`<div class="text-lg font-bold text-white">`);
                  push_element($$renderer4, "div", 335, 16);
                  $$renderer4.push(`${escape_html(parseFloat(adminWalletInfo.stcBalance).toLocaleString())} STC</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 338, 16);
                  $$renderer4.push(`Admin Balance</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="mt-3 flex items-center justify-between text-sm">`);
                  push_element($$renderer4, "div", 341, 12);
                  $$renderer4.push(`<div class="flex items-center space-x-4">`);
                  push_element($$renderer4, "div", 342, 14);
                  Badge($$renderer4, {
                    variant: adminWalletInfo.adminPrivileges ? "default" : "secondary",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      $$renderer5.push(`<!---->${escape_html(adminWalletInfo.adminPrivileges ? "✓ Admin Privileges" : "Standard Access")}`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!----> <span class="text-muted-foreground">`);
                  push_element($$renderer4, "span", 346, 16);
                  $$renderer4.push(`Last Login: ${escape_html(new Date(adminWalletInfo.lastLogin).toLocaleTimeString())}</span>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-muted-foreground">`);
                  push_element($$renderer4, "div", 350, 14);
                  $$renderer4.push(`Network: Polygon</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">`);
                  push_element($$renderer4, "div", 357, 10);
                  $$renderer4.push(`<div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 358, 12);
                  Coins($$renderer4, { class: "h-6 w-6 text-accent mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 360, 14);
                  $$renderer4.push(`${escape_html(parseFloat(tokenomicsMetrics.stcPrice).toFixed(4))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 361, 14);
                  $$renderer4.push(`STC Price (USD)</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 363, 12);
                  Trending_up($$renderer4, { class: "h-6 w-6 text-primary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 365, 14);
                  $$renderer4.push(`$${escape_html(formatNumber(tokenomicsMetrics.marketCap))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 366, 14);
                  $$renderer4.push(`Market Cap</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 368, 12);
                  Activity($$renderer4, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 370, 14);
                  $$renderer4.push(`${escape_html(formatNumber(parseFloat(tokenomicsMetrics.totalStaked)))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 371, 14);
                  $$renderer4.push(`Total Staked</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 373, 12);
                  Crown($$renderer4, { class: "h-6 w-6 text-green-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 375, 14);
                  $$renderer4.push(`${escape_html(tokenomicsMetrics.nftHolders.toLocaleString())}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 376, 14);
                  $$renderer4.push(`NFT Holders</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 378, 12);
                  Dollar_sign($$renderer4, { class: "h-6 w-6 text-yellow-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 380, 14);
                  $$renderer4.push(`${escape_html(tokenomicsMetrics.stakingAPY)}%</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 381, 14);
                  $$renderer4.push(`Staking APY</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 383, 12);
                  Users($$renderer4, { class: "h-6 w-6 text-purple-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 385, 14);
                  $$renderer4.push(`$${escape_html(formatNumber(tokenomicsMetrics.subscriptionRevenue))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 386, 14);
                  $$renderer4.push(`Sub Revenue</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
                  push_element($$renderer4, "div", 391, 10);
                  $$renderer4.push(`<div class="space-y-4">`);
                  push_element($$renderer4, "div", 393, 12);
                  $$renderer4.push(`<h3 class="text-lg font-semibold flex items-center">`);
                  push_element($$renderer4, "h3", 394, 14);
                  Activity($$renderer4, { class: "h-5 w-5 mr-2 text-primary" });
                  $$renderer4.push(`<!----> Token Distribution</h3>`);
                  pop_element();
                  $$renderer4.push(` <div class="space-y-3">`);
                  push_element($$renderer4, "div", 398, 14);
                  $$renderer4.push(`<!--[-->`);
                  const each_array = ensure_array_like(tokenDistribution);
                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                    let dist = each_array[$$index];
                    $$renderer4.push(`<div class="flex items-center justify-between">`);
                    push_element($$renderer4, "div", 400, 18);
                    $$renderer4.push(`<div class="flex items-center space-x-3">`);
                    push_element($$renderer4, "div", 401, 20);
                    $$renderer4.push(`<div${attr_class(`w-3 h-3 rounded-full ${stringify(dist.color)}`)}>`);
                    push_element($$renderer4, "div", 402, 22);
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <span class="text-sm">`);
                    push_element($$renderer4, "span", 403, 22);
                    $$renderer4.push(`${escape_html(dist.category)}</span>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="text-right">`);
                    push_element($$renderer4, "div", 405, 20);
                    $$renderer4.push(`<div class="text-sm font-medium">`);
                    push_element($$renderer4, "div", 406, 22);
                    $$renderer4.push(`${escape_html(formatNumber(parseFloat(dist.amount)))}</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                    push_element($$renderer4, "div", 407, 22);
                    $$renderer4.push(`${escape_html(dist.percentage)}%</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="w-full bg-muted rounded-full h-2">`);
                    push_element($$renderer4, "div", 410, 18);
                    $$renderer4.push(`<div${attr_class(`h-2 rounded-full ${stringify(dist.color)}`)}${attr_style(`width: ${stringify(dist.percentage)}%`)}>`);
                    push_element($$renderer4, "div", 411, 20);
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
                  push_element($$renderer4, "div", 418, 12);
                  $$renderer4.push(`<h3 class="text-lg font-semibold flex items-center">`);
                  push_element($$renderer4, "h3", 419, 14);
                  Crown($$renderer4, { class: "h-5 w-5 mr-2 text-accent" });
                  $$renderer4.push(`<!----> Staking Tiers</h3>`);
                  pop_element();
                  $$renderer4.push(` <div class="space-y-3">`);
                  push_element($$renderer4, "div", 423, 14);
                  $$renderer4.push(`<!--[-->`);
                  const each_array_1 = ensure_array_like(stakingTiers);
                  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                    let tier = each_array_1[$$index_1];
                    $$renderer4.push(`<div class="p-3 bg-white/5 rounded-lg">`);
                    push_element($$renderer4, "div", 425, 18);
                    $$renderer4.push(`<div class="flex items-center justify-between mb-2">`);
                    push_element($$renderer4, "div", 426, 20);
                    $$renderer4.push(`<span class="font-medium">`);
                    push_element($$renderer4, "span", 427, 22);
                    $$renderer4.push(`${escape_html(tier.tier)}</span>`);
                    pop_element();
                    $$renderer4.push(` `);
                    Badge($$renderer4, {
                      variant: "outline",
                      children: prevent_snippet_stringification(($$renderer5) => {
                        $$renderer5.push(`<!---->${escape_html(tier.discount)}% discount`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer4.push(`<!----></div>`);
                    pop_element();
                    $$renderer4.push(` <div class="grid grid-cols-3 gap-2 text-xs text-muted-foreground">`);
                    push_element($$renderer4, "div", 430, 20);
                    $$renderer4.push(`<div>`);
                    push_element($$renderer4, "div", 431, 22);
                    $$renderer4.push(`Min: ${escape_html(formatNumber(parseFloat(tier.minStake)))}</div>`);
                    pop_element();
                    $$renderer4.push(` <div>`);
                    push_element($$renderer4, "div", 432, 22);
                    $$renderer4.push(`Holders: ${escape_html(tier.holders.toLocaleString())}</div>`);
                    pop_element();
                    $$renderer4.push(` <div>`);
                    push_element($$renderer4, "div", 433, 22);
                    $$renderer4.push(`Staked: ${escape_html(formatNumber(parseFloat(tier.totalStaked)))}</div>`);
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
          class: "bg-linear-to-r from-orange-500/10 to-accent/10 border-orange-500/20",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6 text-center",
              children: prevent_snippet_stringification(($$renderer4) => {
                Wallet($$renderer4, { class: "h-12 w-12 text-orange-500 mx-auto mb-4" });
                $$renderer4.push(`<!----> <h3 class="text-lg font-semibold mb-2">`);
                push_element($$renderer4, "h3", 447, 8);
                $$renderer4.push(`Web3 Analytics Unavailable</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground mb-4">`);
                push_element($$renderer4, "p", 448, 8);
                $$renderer4.push(`Connect wallet to access comprehensive tokenomics analytics and STC token insights</p>`);
                pop_element();
                $$renderer4.push(` `);
                Button($$renderer4, {
                  class: "bg-primary hover:bg-primary/90",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Wallet($$renderer5, { class: "mr-2 h-4 w-4" });
                    $$renderer5.push(`<!----> Connect Wallet for Full Analytics`);
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
      $$renderer2.push(`<!--]--> `);
      if (loading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 458, 4);
        $$renderer2.push(`<div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4">`);
        push_element($$renderer2, "div", 459, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300">`);
        push_element($$renderer2, "p", 460, 6);
        $$renderer2.push(`Loading analytics data...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
        push_element($$renderer2, "div", 464, 4);
        $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 465, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 466, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 467, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 468, 12);
        $$renderer2.push(`${escape_html(formatNumber(platformMetrics.totalUsers))}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 469, 12);
        $$renderer2.push(`Total Users</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-green-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 470, 12);
        $$renderer2.push(`+${escape_html(platformMetrics.newUsersToday)} today</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-blue-400 text-3xl">`);
        push_element($$renderer2, "div", 472, 10);
        $$renderer2.push(`👥</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 476, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 477, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 478, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 479, 12);
        $$renderer2.push(`${escape_html(platformMetrics.activeCreators)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 480, 12);
        $$renderer2.push(`Active Creators</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-purple-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 481, 12);
        $$renderer2.push(`${escape_html(formatNumber(platformMetrics.totalContent))} content items</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-purple-400 text-3xl">`);
        push_element($$renderer2, "div", 483, 10);
        $$renderer2.push(`🎬</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 487, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 488, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 489, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 490, 12);
        $$renderer2.push(`${escape_html(formatNumber(platformMetrics.totalViews))}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 491, 12);
        $$renderer2.push(`Total Views</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-green-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 492, 12);
        $$renderer2.push(`+${escape_html(formatNumber(platformMetrics.viewsToday))} today</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-green-400 text-3xl">`);
        push_element($$renderer2, "div", 494, 10);
        $$renderer2.push(`👁️</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 498, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 499, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 500, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 501, 12);
        $$renderer2.push(`${escape_html(formatCurrency(platformMetrics.totalRevenue))}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 502, 12);
        $$renderer2.push(`Total Revenue</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-yellow-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 503, 12);
        $$renderer2.push(`${escape_html(platformMetrics.contentPublishedToday)} published today</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-yellow-400 text-3xl">`);
        push_element($$renderer2, "div", 505, 10);
        $$renderer2.push(`💰</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 510, 4);
        $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 512, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 513, 8);
        $$renderer2.push(`Content by Category (${escape_html(
          "Views"
        )})</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 516, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(contentAnalytics);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let category = each_array_2[$$index_2];
          $$renderer2.push(`<div class="flex items-center justify-between">`);
          push_element($$renderer2, "div", 518, 12);
          $$renderer2.push(`<div class="flex items-center space-x-3">`);
          push_element($$renderer2, "div", 519, 14);
          $$renderer2.push(`<div${attr_class(`w-3 h-3 rounded-full ${stringify(getCategoryColor(category.category))}`)}>`);
          push_element($$renderer2, "div", 520, 16);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-white">`);
          push_element($$renderer2, "span", 521, 16);
          $$renderer2.push(`${escape_html(category.category)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-right">`);
          push_element($$renderer2, "div", 523, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 524, 16);
          $$renderer2.push(`${escape_html(category.count)} items</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 525, 16);
          {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`${escape_html(formatNumber(category.views))} views`);
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="w-full bg-gray-700 rounded-full h-2">`);
          push_element($$renderer2, "div", 538, 12);
          $$renderer2.push(`<div${attr_class(`h-2 rounded-full ${stringify(getCategoryColor(category.category))}`)}${attr_style(`width: ${stringify((() => {
            let value, maxValue;
            {
              value = category.views;
              maxValue = Math.max(...contentAnalytics.map((c) => c.views));
            }
            return maxValue > 0 ? value / maxValue * 100 : 0;
          })())}%`)}>`);
          push_element($$renderer2, "div", 539, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 565, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 566, 8);
        $$renderer2.push(`Users by Country</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-3">`);
        push_element($$renderer2, "div", 567, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_3 = ensure_array_like(geographicData.slice(0, 6));
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let country = each_array_3[$$index_3];
          $$renderer2.push(`<div class="flex items-center justify-between">`);
          push_element($$renderer2, "div", 569, 12);
          $$renderer2.push(`<span class="text-white">`);
          push_element($$renderer2, "span", 570, 14);
          $$renderer2.push(`${escape_html(country.country)}</span>`);
          pop_element();
          $$renderer2.push(` <div class="flex items-center space-x-3">`);
          push_element($$renderer2, "div", 571, 14);
          $$renderer2.push(`<div class="w-24 bg-gray-700 rounded-full h-2">`);
          push_element($$renderer2, "div", 572, 16);
          $$renderer2.push(`<div class="h-2 bg-red-500 rounded-full"${attr_style(`width: ${stringify(country.percentage)}%`)}>`);
          push_element($$renderer2, "div", 573, 18);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-gray-300 text-sm w-12 text-right">`);
          push_element($$renderer2, "span", 578, 16);
          $$renderer2.push(`${escape_html(country.percentage)}%</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 587, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 588, 6);
        $$renderer2.push(`Revenue &amp; Payouts Trend</h2>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-4 md:grid-cols-8 gap-4 items-end h-64">`);
        push_element($$renderer2, "div", 589, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_4 = ensure_array_like(revenueData);
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          let data = each_array_4[$$index_4];
          $$renderer2.push(`<div class="flex flex-col items-center space-y-2">`);
          push_element($$renderer2, "div", 591, 10);
          $$renderer2.push(`<div class="flex flex-col items-center space-y-1 flex-1 justify-end">`);
          push_element($$renderer2, "div", 592, 12);
          $$renderer2.push(`<div class="bg-green-500 rounded-t w-8"${attr_style(`height: ${stringify(data.revenue / Math.max(...revenueData.map((d) => d.revenue)) * 180)}px`)}${attr("title", `Revenue: ${stringify(formatCurrency(data.revenue))}`)}>`);
          push_element($$renderer2, "div", 593, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="bg-blue-500 rounded-b w-8"${attr_style(`height: ${stringify(data.payouts / Math.max(...revenueData.map((d) => d.payouts)) * 120)}px`)}${attr("title", `Payouts: ${stringify(formatCurrency(data.payouts))}`)}>`);
          push_element($$renderer2, "div", 598, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-gray-300 text-xs">`);
          push_element($$renderer2, "span", 604, 12);
          $$renderer2.push(`${escape_html(data.month)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-center space-x-6 mt-4">`);
        push_element($$renderer2, "div", 608, 6);
        $$renderer2.push(`<div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 609, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-green-500 rounded">`);
        push_element($$renderer2, "div", 610, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 611, 10);
        $$renderer2.push(`Revenue</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 613, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-blue-500 rounded">`);
        push_element($$renderer2, "div", 614, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 615, 10);
        $$renderer2.push(`Payouts</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 620, 4);
        $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 622, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 623, 8);
        $$renderer2.push(`Top Creators</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 624, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_5 = ensure_array_like(topCreators);
        for (let index = 0, $$length = each_array_5.length; index < $$length; index++) {
          let creator = each_array_5[index];
          $$renderer2.push(`<div class="flex items-center space-x-4">`);
          push_element($$renderer2, "div", 626, 12);
          $$renderer2.push(`<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">`);
          push_element($$renderer2, "div", 627, 14);
          $$renderer2.push(`${escape_html(index + 1)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex-1">`);
          push_element($$renderer2, "div", 630, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 631, 16);
          $$renderer2.push(`${escape_html(creator.name)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 632, 16);
          $$renderer2.push(`${escape_html(creator.ministry)}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-right">`);
          push_element($$renderer2, "div", 634, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 635, 16);
          $$renderer2.push(`${escape_html(formatNumber(creator.views))} views</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 636, 16);
          $$renderer2.push(`${escape_html(creator.content)} content • ${escape_html(formatCurrency(creator.revenue))}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 644, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 645, 8);
        $$renderer2.push(`Top Content</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 646, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_6 = ensure_array_like(topContent);
        for (let index = 0, $$length = each_array_6.length; index < $$length; index++) {
          let content = each_array_6[index];
          $$renderer2.push(`<div class="flex items-center space-x-4">`);
          push_element($$renderer2, "div", 648, 12);
          $$renderer2.push(`<div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">`);
          push_element($$renderer2, "div", 649, 14);
          $$renderer2.push(`${escape_html(index + 1)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex-1">`);
          push_element($$renderer2, "div", 652, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 653, 16);
          $$renderer2.push(`${escape_html(content.title)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 654, 16);
          $$renderer2.push(`${escape_html(content.creator)} • ${escape_html(content.category)}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-right">`);
          push_element($$renderer2, "div", 656, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 657, 16);
          $$renderer2.push(`${escape_html(formatNumber(content.views))} views</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 658, 16);
          $$renderer2.push(`${escape_html(formatPercentage(content.engagement))} engagement</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 667, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 668, 6);
        $$renderer2.push(`User Growth Trend</h2>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-6 gap-4 items-end h-48">`);
        push_element($$renderer2, "div", 669, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_7 = ensure_array_like(userGrowthData);
        for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
          let data = each_array_7[$$index_7];
          $$renderer2.push(`<div class="flex flex-col items-center space-y-2">`);
          push_element($$renderer2, "div", 671, 10);
          $$renderer2.push(`<div class="flex flex-col items-center space-y-1 flex-1 justify-end">`);
          push_element($$renderer2, "div", 672, 12);
          $$renderer2.push(`<div class="bg-blue-500 rounded-t w-12"${attr_style(`height: ${stringify(data.users / Math.max(...userGrowthData.map((d) => d.users)) * 120)}px`)}${attr("title", `Users: ${stringify(data.users.toLocaleString())}`)}>`);
          push_element($$renderer2, "div", 673, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="bg-purple-500 rounded-b w-12"${attr_style(`height: ${stringify(data.creators / Math.max(...userGrowthData.map((d) => d.creators)) * 80)}px`)}${attr("title", `Creators: ${stringify(data.creators)}`)}>`);
          push_element($$renderer2, "div", 678, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-gray-300 text-xs">`);
          push_element($$renderer2, "span", 684, 12);
          $$renderer2.push(`${escape_html(new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }))}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-center space-x-6 mt-4">`);
        push_element($$renderer2, "div", 688, 6);
        $$renderer2.push(`<div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 689, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-blue-500 rounded">`);
        push_element($$renderer2, "div", 690, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 691, 10);
        $$renderer2.push(`Users</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 693, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-purple-500 rounded">`);
        push_element($$renderer2, "div", 694, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 695, 10);
        $$renderer2.push(`Creators</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
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
//# sourceMappingURL=_page.svelte-BB_zPce-.js.map
