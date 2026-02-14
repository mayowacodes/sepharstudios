import { M as store_get, p as prevent_snippet_stringification, E as escape_html, m as ensure_array_like, C as attr_class, x as stringify, D as attr_style, N as unsubscribe_stores, u as attr } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { B as Button } from './button-B5TxIyzE.js';
import { W as Wallet, i as isConnected, w as walletAddress } from './wallet-B7_7GztS.js';
import { s as stcToken, t as tokenAMM } from './contracts-1y8JjJRR.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import { A as Activity } from './activity-utKZCrS9.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { D as Dollar_sign } from './dollar-sign-DitbSj8h.js';
import { U as Users } from './users-CMHMaCG6.js';
import { R as Refresh_cw } from './refresh-cw-BTej-Wkl.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './utils2-C-_3GP94.js';
import './Icon-DLeFNkXp.js';
import '@wagmi/core';
import './config-Bjr_iq_c.js';
import '@wagmi/core/chains';
import '@wagmi/connectors';
import './index3-CnQVvK5M.js';
import 'viem';

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
      function loadAnalytics() {
        loading = true;
        setTimeout(
          () => {
            platformMetrics = {
              totalUsers: 45789,
              activeCreators: 342,
              totalContent: 2847,
              totalViews: 3847291,
              totalRevenue: 287459.75,
              newUsersToday: 127,
              contentPublishedToday: 23,
              viewsToday: 18472
            };
            contentAnalytics = [
              {
                category: "Sermons",
                count: 1247,
                views: 1847291,
                engagement: 0.087
              },
              {
                category: "Bible Studies",
                count: 689,
                views: 923847,
                engagement: 0.124
              },
              {
                category: "Worship",
                count: 445,
                views: 672934,
                engagement: 0.098
              },
              {
                category: "Youth Ministry",
                count: 278,
                views: 234891,
                engagement: 0.156
              },
              {
                category: "Testimonies",
                count: 188,
                views: 168328,
                engagement: 0.203
              }
            ];
            userGrowthData = [
              { date: "2024-08-01", users: 42345, creators: 298 },
              { date: "2024-08-08", users: 43120, creators: 305 },
              { date: "2024-08-15", users: 43890, creators: 315 },
              { date: "2024-08-22", users: 44567, creators: 324 },
              { date: "2024-08-29", users: 45234, creators: 335 },
              { date: "2024-09-05", users: 45789, creators: 342 }
            ];
            revenueData = [
              { month: "Jan", revenue: 245678, payouts: 184759 },
              { month: "Feb", revenue: 267834, payouts: 201234 },
              { month: "Mar", revenue: 289456, payouts: 217092 },
              { month: "Apr", revenue: 312789, payouts: 234591 },
              { month: "May", revenue: 334567, payouts: 250925 },
              { month: "Jun", revenue: 356890, payouts: 267667 },
              { month: "Jul", revenue: 378234, payouts: 283675 },
              { month: "Aug", revenue: 398567, payouts: 298925 }
            ];
            geographicData = [
              { country: "United States", users: 18456, percentage: 40.3 },
              { country: "Nigeria", users: 8934, percentage: 19.5 },
              { country: "United Kingdom", users: 4567, percentage: 10 },
              { country: "Canada", users: 3890, percentage: 8.5 },
              { country: "South Africa", users: 2845, percentage: 6.2 },
              { country: "Kenya", users: 2134, percentage: 4.7 },
              { country: "Ghana", users: 1845, percentage: 4 },
              { country: "Australia", users: 1567, percentage: 3.4 },
              { country: "Others", users: 1551, percentage: 3.4 }
            ];
            topCreators = [
              {
                name: "Pastor John Smith",
                ministry: "Faith Community Church",
                views: 125e3,
                content: 45,
                revenue: 2450.75
              },
              {
                name: "Dr. Elizabeth Davis",
                ministry: "Biblical Studies Institute",
                views: 245e3,
                content: 78,
                revenue: 4200
              },
              {
                name: "Sarah Johnson",
                ministry: "Gospel Harmony Ministry",
                views: 89e3,
                content: 32,
                revenue: 1650.25
              },
              {
                name: "Pastor Mark Thompson",
                ministry: "Grace Fellowship",
                views: 167e3,
                content: 56,
                revenue: 3100.5
              },
              {
                name: "Rebecca Martinez",
                ministry: "Youth for Christ",
                views: 76500,
                content: 28,
                revenue: 1275.8
              }
            ];
            topContent = [
              {
                title: "The Power of Prayer",
                creator: "Pastor John Smith",
                views: 45782,
                engagement: 0.156,
                category: "Sermons"
              },
              {
                title: "Understanding Grace",
                creator: "Dr. Elizabeth Davis",
                views: 38294,
                engagement: 0.142,
                category: "Bible Studies"
              },
              {
                title: "Worship in Spirit & Truth",
                creator: "Sarah Johnson",
                views: 34891,
                engagement: 0.187,
                category: "Worship"
              },
              {
                title: "Faith in Hard Times",
                creator: "Pastor Mark Thompson",
                views: 29847,
                engagement: 0.134,
                category: "Sermons"
              },
              {
                title: "Youth Ministry Essentials",
                creator: "Rebecca Martinez",
                views: 25634,
                engagement: 0.203,
                category: "Youth Ministry"
              }
            ];
            loading = false;
          },
          1e3
        );
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
      push_element($$renderer2, "div", 304, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 306, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 307, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white">`);
      push_element($$renderer2, "h1", 308, 6);
      $$renderer2.push(`Platform Analytics</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 309, 6);
      $$renderer2.push(`Monitor platform performance and user engagement</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 312, 4);
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
      push_element($$renderer2, "button", 334, 6);
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
          class: "bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_title($$renderer4, {
                  class: "flex items-center space-x-2",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Coins($$renderer5, { class: "h-6 w-6 text-accent" });
                    $$renderer5.push(`<!----> <span>`);
                    push_element($$renderer5, "span", 364, 10);
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
                  push_element($$renderer4, "div", 375, 10);
                  Refresh_cw($$renderer4, { class: "h-8 w-8 animate-spin mx-auto mb-4 text-primary" });
                  $$renderer4.push(`<!----> <p class="text-muted-foreground">`);
                  push_element($$renderer4, "p", 377, 12);
                  $$renderer4.push(`Loading tokenomics data...</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<div class="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">`);
                  push_element($$renderer4, "div", 381, 10);
                  $$renderer4.push(`<div class="flex items-center justify-between">`);
                  push_element($$renderer4, "div", 382, 12);
                  $$renderer4.push(`<div class="flex items-center space-x-3">`);
                  push_element($$renderer4, "div", 383, 14);
                  Wallet($$renderer4, { class: "h-6 w-6 text-blue-400" });
                  $$renderer4.push(`<!----> <div>`);
                  push_element($$renderer4, "div", 385, 16);
                  $$renderer4.push(`<h4 class="font-medium text-white">`);
                  push_element($$renderer4, "h4", 386, 18);
                  $$renderer4.push(`Admin Wallet Connected</h4>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "p", 387, 18);
                  $$renderer4.push(`${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress) ? `${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(0, 8)}...${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(-6)}` : "Not Connected")}</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-right">`);
                  push_element($$renderer4, "div", 392, 14);
                  $$renderer4.push(`<div class="text-lg font-bold text-white">`);
                  push_element($$renderer4, "div", 393, 16);
                  $$renderer4.push(`${escape_html(parseFloat(adminWalletInfo.stcBalance).toLocaleString())} STC</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 396, 16);
                  $$renderer4.push(`Admin Balance</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="mt-3 flex items-center justify-between text-sm">`);
                  push_element($$renderer4, "div", 399, 12);
                  $$renderer4.push(`<div class="flex items-center space-x-4">`);
                  push_element($$renderer4, "div", 400, 14);
                  Badge($$renderer4, {
                    variant: adminWalletInfo.adminPrivileges ? "default" : "secondary",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      $$renderer5.push(`<!---->${escape_html(adminWalletInfo.adminPrivileges ? "✓ Admin Privileges" : "Standard Access")}`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!----> <span class="text-muted-foreground">`);
                  push_element($$renderer4, "span", 404, 16);
                  $$renderer4.push(`Last Login: ${escape_html(new Date(adminWalletInfo.lastLogin).toLocaleTimeString())}</span>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-muted-foreground">`);
                  push_element($$renderer4, "div", 408, 14);
                  $$renderer4.push(`Network: Polygon</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">`);
                  push_element($$renderer4, "div", 415, 10);
                  $$renderer4.push(`<div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 416, 12);
                  Coins($$renderer4, { class: "h-6 w-6 text-accent mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 418, 14);
                  $$renderer4.push(`${escape_html(parseFloat(tokenomicsMetrics.stcPrice).toFixed(4))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 419, 14);
                  $$renderer4.push(`STC Price (USD)</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 421, 12);
                  Trending_up($$renderer4, { class: "h-6 w-6 text-primary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 423, 14);
                  $$renderer4.push(`$${escape_html(formatNumber(tokenomicsMetrics.marketCap))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 424, 14);
                  $$renderer4.push(`Market Cap</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 426, 12);
                  Activity($$renderer4, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 428, 14);
                  $$renderer4.push(`${escape_html(formatNumber(parseFloat(tokenomicsMetrics.totalStaked)))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 429, 14);
                  $$renderer4.push(`Total Staked</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 431, 12);
                  Crown($$renderer4, { class: "h-6 w-6 text-green-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 433, 14);
                  $$renderer4.push(`${escape_html(tokenomicsMetrics.nftHolders.toLocaleString())}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 434, 14);
                  $$renderer4.push(`NFT Holders</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 436, 12);
                  Dollar_sign($$renderer4, { class: "h-6 w-6 text-yellow-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 438, 14);
                  $$renderer4.push(`${escape_html(tokenomicsMetrics.stakingAPY)}%</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 439, 14);
                  $$renderer4.push(`Staking APY</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                  push_element($$renderer4, "div", 441, 12);
                  Users($$renderer4, { class: "h-6 w-6 text-purple-500 mx-auto mb-2" });
                  $$renderer4.push(`<!----> <div class="text-lg font-bold">`);
                  push_element($$renderer4, "div", 443, 14);
                  $$renderer4.push(`$${escape_html(formatNumber(tokenomicsMetrics.subscriptionRevenue))}</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "div", 444, 14);
                  $$renderer4.push(`Sub Revenue</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
                  push_element($$renderer4, "div", 449, 10);
                  $$renderer4.push(`<div class="space-y-4">`);
                  push_element($$renderer4, "div", 451, 12);
                  $$renderer4.push(`<h3 class="text-lg font-semibold flex items-center">`);
                  push_element($$renderer4, "h3", 452, 14);
                  Activity($$renderer4, { class: "h-5 w-5 mr-2 text-primary" });
                  $$renderer4.push(`<!----> Token Distribution</h3>`);
                  pop_element();
                  $$renderer4.push(` <div class="space-y-3">`);
                  push_element($$renderer4, "div", 456, 14);
                  $$renderer4.push(`<!--[-->`);
                  const each_array = ensure_array_like(tokenDistribution);
                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                    let dist = each_array[$$index];
                    $$renderer4.push(`<div class="flex items-center justify-between">`);
                    push_element($$renderer4, "div", 458, 18);
                    $$renderer4.push(`<div class="flex items-center space-x-3">`);
                    push_element($$renderer4, "div", 459, 20);
                    $$renderer4.push(`<div${attr_class(`w-3 h-3 rounded-full ${stringify(dist.color)}`)}>`);
                    push_element($$renderer4, "div", 460, 22);
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <span class="text-sm">`);
                    push_element($$renderer4, "span", 461, 22);
                    $$renderer4.push(`${escape_html(dist.category)}</span>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="text-right">`);
                    push_element($$renderer4, "div", 463, 20);
                    $$renderer4.push(`<div class="text-sm font-medium">`);
                    push_element($$renderer4, "div", 464, 22);
                    $$renderer4.push(`${escape_html(formatNumber(parseFloat(dist.amount)))}</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="text-xs text-muted-foreground">`);
                    push_element($$renderer4, "div", 465, 22);
                    $$renderer4.push(`${escape_html(dist.percentage)}%</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` <div class="w-full bg-muted rounded-full h-2">`);
                    push_element($$renderer4, "div", 468, 18);
                    $$renderer4.push(`<div${attr_class(`h-2 rounded-full ${stringify(dist.color)}`)}${attr_style(`width: ${stringify(dist.percentage)}%`)}>`);
                    push_element($$renderer4, "div", 469, 20);
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
                  push_element($$renderer4, "div", 476, 12);
                  $$renderer4.push(`<h3 class="text-lg font-semibold flex items-center">`);
                  push_element($$renderer4, "h3", 477, 14);
                  Crown($$renderer4, { class: "h-5 w-5 mr-2 text-accent" });
                  $$renderer4.push(`<!----> Staking Tiers</h3>`);
                  pop_element();
                  $$renderer4.push(` <div class="space-y-3">`);
                  push_element($$renderer4, "div", 481, 14);
                  $$renderer4.push(`<!--[-->`);
                  const each_array_1 = ensure_array_like(stakingTiers);
                  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                    let tier = each_array_1[$$index_1];
                    $$renderer4.push(`<div class="p-3 bg-white/5 rounded-lg">`);
                    push_element($$renderer4, "div", 483, 18);
                    $$renderer4.push(`<div class="flex items-center justify-between mb-2">`);
                    push_element($$renderer4, "div", 484, 20);
                    $$renderer4.push(`<span class="font-medium">`);
                    push_element($$renderer4, "span", 485, 22);
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
                    push_element($$renderer4, "div", 488, 20);
                    $$renderer4.push(`<div>`);
                    push_element($$renderer4, "div", 489, 22);
                    $$renderer4.push(`Min: ${escape_html(formatNumber(parseFloat(tier.minStake)))}</div>`);
                    pop_element();
                    $$renderer4.push(` <div>`);
                    push_element($$renderer4, "div", 490, 22);
                    $$renderer4.push(`Holders: ${escape_html(tier.holders.toLocaleString())}</div>`);
                    pop_element();
                    $$renderer4.push(` <div>`);
                    push_element($$renderer4, "div", 491, 22);
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
          class: "bg-gradient-to-r from-orange-500/10 to-accent/10 border-orange-500/20",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6 text-center",
              children: prevent_snippet_stringification(($$renderer4) => {
                Wallet($$renderer4, { class: "h-12 w-12 text-orange-500 mx-auto mb-4" });
                $$renderer4.push(`<!----> <h3 class="text-lg font-semibold mb-2">`);
                push_element($$renderer4, "h3", 505, 8);
                $$renderer4.push(`Web3 Analytics Unavailable</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground mb-4">`);
                push_element($$renderer4, "p", 506, 8);
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
        push_element($$renderer2, "div", 516, 4);
        $$renderer2.push(`<div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4">`);
        push_element($$renderer2, "div", 517, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300">`);
        push_element($$renderer2, "p", 518, 6);
        $$renderer2.push(`Loading analytics data...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
        push_element($$renderer2, "div", 522, 4);
        $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 523, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 524, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 525, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 526, 12);
        $$renderer2.push(`${escape_html(formatNumber(platformMetrics.totalUsers))}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 527, 12);
        $$renderer2.push(`Total Users</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-green-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 528, 12);
        $$renderer2.push(`+${escape_html(platformMetrics.newUsersToday)} today</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-blue-400 text-3xl">`);
        push_element($$renderer2, "div", 530, 10);
        $$renderer2.push(`👥</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 534, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 535, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 536, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 537, 12);
        $$renderer2.push(`${escape_html(platformMetrics.activeCreators)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 538, 12);
        $$renderer2.push(`Active Creators</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-purple-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 539, 12);
        $$renderer2.push(`${escape_html(formatNumber(platformMetrics.totalContent))} content items</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-purple-400 text-3xl">`);
        push_element($$renderer2, "div", 541, 10);
        $$renderer2.push(`🎬</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 545, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 546, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 547, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 548, 12);
        $$renderer2.push(`${escape_html(formatNumber(platformMetrics.totalViews))}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 549, 12);
        $$renderer2.push(`Total Views</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-green-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 550, 12);
        $$renderer2.push(`+${escape_html(formatNumber(platformMetrics.viewsToday))} today</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-green-400 text-3xl">`);
        push_element($$renderer2, "div", 552, 10);
        $$renderer2.push(`👁️</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 556, 6);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 557, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 558, 10);
        $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "div", 559, 12);
        $$renderer2.push(`${escape_html(formatCurrency(platformMetrics.totalRevenue))}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-300 text-sm">`);
        push_element($$renderer2, "div", 560, 12);
        $$renderer2.push(`Total Revenue</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-yellow-400 text-xs mt-1">`);
        push_element($$renderer2, "div", 561, 12);
        $$renderer2.push(`${escape_html(platformMetrics.contentPublishedToday)} published today</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-yellow-400 text-3xl">`);
        push_element($$renderer2, "div", 563, 10);
        $$renderer2.push(`💰</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 568, 4);
        $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 570, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 571, 8);
        $$renderer2.push(`Content by Category (${escape_html(
          "Views"
        )})</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 574, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(contentAnalytics);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let category = each_array_2[$$index_2];
          $$renderer2.push(`<div class="flex items-center justify-between">`);
          push_element($$renderer2, "div", 576, 12);
          $$renderer2.push(`<div class="flex items-center space-x-3">`);
          push_element($$renderer2, "div", 577, 14);
          $$renderer2.push(`<div${attr_class(`w-3 h-3 rounded-full ${stringify(getCategoryColor(category.category))}`)}>`);
          push_element($$renderer2, "div", 578, 16);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-white">`);
          push_element($$renderer2, "span", 579, 16);
          $$renderer2.push(`${escape_html(category.category)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-right">`);
          push_element($$renderer2, "div", 581, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 582, 16);
          $$renderer2.push(`${escape_html(category.count)} items</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 583, 16);
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
          push_element($$renderer2, "div", 596, 12);
          $$renderer2.push(`<div${attr_class(`h-2 rounded-full ${stringify(getCategoryColor(category.category))}`)}${attr_style(`width: ${stringify((() => {
            let value, maxValue;
            {
              value = category.views;
              maxValue = Math.max(...contentAnalytics.map((c) => c.views));
            }
            return maxValue > 0 ? value / maxValue * 100 : 0;
          })())}%`)}>`);
          push_element($$renderer2, "div", 597, 14);
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
        push_element($$renderer2, "div", 623, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 624, 8);
        $$renderer2.push(`Users by Country</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-3">`);
        push_element($$renderer2, "div", 625, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_3 = ensure_array_like(geographicData.slice(0, 6));
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let country = each_array_3[$$index_3];
          $$renderer2.push(`<div class="flex items-center justify-between">`);
          push_element($$renderer2, "div", 627, 12);
          $$renderer2.push(`<span class="text-white">`);
          push_element($$renderer2, "span", 628, 14);
          $$renderer2.push(`${escape_html(country.country)}</span>`);
          pop_element();
          $$renderer2.push(` <div class="flex items-center space-x-3">`);
          push_element($$renderer2, "div", 629, 14);
          $$renderer2.push(`<div class="w-24 bg-gray-700 rounded-full h-2">`);
          push_element($$renderer2, "div", 630, 16);
          $$renderer2.push(`<div class="h-2 bg-red-500 rounded-full"${attr_style(`width: ${stringify(country.percentage)}%`)}>`);
          push_element($$renderer2, "div", 631, 18);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-gray-300 text-sm w-12 text-right">`);
          push_element($$renderer2, "span", 636, 16);
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
        push_element($$renderer2, "div", 645, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 646, 6);
        $$renderer2.push(`Revenue &amp; Payouts Trend</h2>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-4 md:grid-cols-8 gap-4 items-end h-64">`);
        push_element($$renderer2, "div", 647, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_4 = ensure_array_like(revenueData);
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          let data = each_array_4[$$index_4];
          $$renderer2.push(`<div class="flex flex-col items-center space-y-2">`);
          push_element($$renderer2, "div", 649, 10);
          $$renderer2.push(`<div class="flex flex-col items-center space-y-1 flex-1 justify-end">`);
          push_element($$renderer2, "div", 650, 12);
          $$renderer2.push(`<div class="bg-green-500 rounded-t w-8"${attr_style(`height: ${stringify(data.revenue / Math.max(...revenueData.map((d) => d.revenue)) * 180)}px`)}${attr("title", `Revenue: ${stringify(formatCurrency(data.revenue))}`)}>`);
          push_element($$renderer2, "div", 651, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="bg-blue-500 rounded-b w-8"${attr_style(`height: ${stringify(data.payouts / Math.max(...revenueData.map((d) => d.payouts)) * 120)}px`)}${attr("title", `Payouts: ${stringify(formatCurrency(data.payouts))}`)}>`);
          push_element($$renderer2, "div", 656, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-gray-300 text-xs">`);
          push_element($$renderer2, "span", 662, 12);
          $$renderer2.push(`${escape_html(data.month)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-center space-x-6 mt-4">`);
        push_element($$renderer2, "div", 666, 6);
        $$renderer2.push(`<div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 667, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-green-500 rounded">`);
        push_element($$renderer2, "div", 668, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 669, 10);
        $$renderer2.push(`Revenue</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 671, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-blue-500 rounded">`);
        push_element($$renderer2, "div", 672, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 673, 10);
        $$renderer2.push(`Payouts</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 678, 4);
        $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 680, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 681, 8);
        $$renderer2.push(`Top Creators</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 682, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_5 = ensure_array_like(topCreators);
        for (let index = 0, $$length = each_array_5.length; index < $$length; index++) {
          let creator = each_array_5[index];
          $$renderer2.push(`<div class="flex items-center space-x-4">`);
          push_element($$renderer2, "div", 684, 12);
          $$renderer2.push(`<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">`);
          push_element($$renderer2, "div", 685, 14);
          $$renderer2.push(`${escape_html(index + 1)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex-1">`);
          push_element($$renderer2, "div", 688, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 689, 16);
          $$renderer2.push(`${escape_html(creator.name)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 690, 16);
          $$renderer2.push(`${escape_html(creator.ministry)}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-right">`);
          push_element($$renderer2, "div", 692, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 693, 16);
          $$renderer2.push(`${escape_html(formatNumber(creator.views))} views</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 694, 16);
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
        push_element($$renderer2, "div", 702, 6);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 703, 8);
        $$renderer2.push(`Top Content</h2>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 704, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_6 = ensure_array_like(topContent);
        for (let index = 0, $$length = each_array_6.length; index < $$length; index++) {
          let content = each_array_6[index];
          $$renderer2.push(`<div class="flex items-center space-x-4">`);
          push_element($$renderer2, "div", 706, 12);
          $$renderer2.push(`<div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">`);
          push_element($$renderer2, "div", 707, 14);
          $$renderer2.push(`${escape_html(index + 1)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex-1">`);
          push_element($$renderer2, "div", 710, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 711, 16);
          $$renderer2.push(`${escape_html(content.title)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 712, 16);
          $$renderer2.push(`${escape_html(content.creator)} • ${escape_html(content.category)}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-right">`);
          push_element($$renderer2, "div", 714, 14);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 715, 16);
          $$renderer2.push(`${escape_html(formatNumber(content.views))} views</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 716, 16);
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
        push_element($$renderer2, "div", 725, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 726, 6);
        $$renderer2.push(`User Growth Trend</h2>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-6 gap-4 items-end h-48">`);
        push_element($$renderer2, "div", 727, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_7 = ensure_array_like(userGrowthData);
        for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
          let data = each_array_7[$$index_7];
          $$renderer2.push(`<div class="flex flex-col items-center space-y-2">`);
          push_element($$renderer2, "div", 729, 10);
          $$renderer2.push(`<div class="flex flex-col items-center space-y-1 flex-1 justify-end">`);
          push_element($$renderer2, "div", 730, 12);
          $$renderer2.push(`<div class="bg-blue-500 rounded-t w-12"${attr_style(`height: ${stringify(data.users / Math.max(...userGrowthData.map((d) => d.users)) * 120)}px`)}${attr("title", `Users: ${stringify(data.users.toLocaleString())}`)}>`);
          push_element($$renderer2, "div", 731, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="bg-purple-500 rounded-b w-12"${attr_style(`height: ${stringify(data.creators / Math.max(...userGrowthData.map((d) => d.creators)) * 80)}px`)}${attr("title", `Creators: ${stringify(data.creators)}`)}>`);
          push_element($$renderer2, "div", 736, 14);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="text-gray-300 text-xs">`);
          push_element($$renderer2, "span", 742, 12);
          $$renderer2.push(`${escape_html(new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }))}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-center space-x-6 mt-4">`);
        push_element($$renderer2, "div", 746, 6);
        $$renderer2.push(`<div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 747, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-blue-500 rounded">`);
        push_element($$renderer2, "div", 748, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 749, 10);
        $$renderer2.push(`Users</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 751, 8);
        $$renderer2.push(`<div class="w-3 h-3 bg-purple-500 rounded">`);
        push_element($$renderer2, "div", 752, 10);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-300 text-sm">`);
        push_element($$renderer2, "span", 753, 10);
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
//# sourceMappingURL=_page.svelte-h7IDo07c.js.map
