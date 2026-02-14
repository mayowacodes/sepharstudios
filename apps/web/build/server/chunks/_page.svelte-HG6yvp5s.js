import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as prevent_snippet_stringification, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Button } from './button-B5TxIyzE.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { I as Input } from './input-BHRan7UY.js';
import { L as Label } from './label-Bh2yW0Jf.js';
import { t as tokenAMM, s as stcToken } from './contracts-1y8JjJRR.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { R as Refresh_cw } from './refresh-cw-BTej-Wkl.js';
import { U as Users } from './users-CMHMaCG6.js';
import { D as Dollar_sign } from './dollar-sign-DitbSj8h.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import { A as Activity } from './activity-utKZCrS9.js';
import { S as Settings } from './settings-RkmMlorm.js';
import { C as Circle_alert } from './circle-alert-CjEH9fu-.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import './utils2-C-_3GP94.js';
import './create-id-ozwDP4rH.js';
import '@wagmi/core';
import './config-Bjr_iq_c.js';
import '@wagmi/core/chains';
import '@wagmi/connectors';
import 'viem';
import './Icon-DLeFNkXp.js';

_page[FILENAME] = "src/routes/(admin)/admin/tokenomics/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let tokenomicsData = {
        stcPrice: "0",
        totalSupply: "0",
        circulatingSupply: "0",
        totalStaked: "0",
        monthlyRevenue: "0",
        buybackAmount: "0",
        creatorPool: "0",
        userRewardPool: "0",
        stakingTiers: { bronze: 0, silver: 0, gold: 0, platinum: 0 }
      };
      let creatorStats = {
        totalCreators: 127,
        averageRevenue: 0,
        topCreatorEarnings: 0,
        totalPayments: 0
      };
      let revenueDistribution = {
        platformOperations: 55,
        creatorRevenue: 30,
        stcBuyback: 8,
        userRewards: 4,
        platformReserve: 3
      };
      let adminActions = {
        isAdjusting: false,
        actionResult: "",
        newDistribution: {
          platformOperations: 55,
          creatorRevenue: 30,
          stcBuyback: 8,
          userRewards: 4,
          platformReserve: 3
        }
      };
      async function loadTokenomicsData() {
        try {
          const [price, poolInfo, totalSupply] = await Promise.all([
            tokenAMM.getSTCPrice(),
            tokenAMM.getPoolInfo(),
            stcToken.totalSupply()
          ]);
          const monthlyRev = parseFloat(poolInfo.monthlyRevenue);
          const supply = parseFloat(totalSupply);
          const circulating = supply * 0.75;
          tokenomicsData = {
            stcPrice: price,
            totalSupply,
            circulatingSupply: circulating.toString(),
            totalStaked: poolInfo.stcBalance,
            monthlyRevenue: poolInfo.monthlyRevenue,
            buybackAmount: (monthlyRev * (revenueDistribution.stcBuyback / 100)).toFixed(2),
            creatorPool: (monthlyRev * (revenueDistribution.creatorRevenue / 100)).toFixed(2),
            userRewardPool: (monthlyRev * (revenueDistribution.userRewards / 100)).toFixed(2),
            stakingTiers: await loadStakingTierData()
          };
        } catch (error) {
          console.error("Error loading tokenomics data:", error);
          const monthlyRev = 5e4;
          tokenomicsData = {
            stcPrice: "0.25",
            totalSupply: "10000000",
            circulatingSupply: "7500000",
            totalStaked: "2500000",
            monthlyRevenue: monthlyRev.toString(),
            buybackAmount: (monthlyRev * (revenueDistribution.stcBuyback / 100)).toFixed(2),
            creatorPool: (monthlyRev * (revenueDistribution.creatorRevenue / 100)).toFixed(2),
            userRewardPool: (monthlyRev * (revenueDistribution.userRewards / 100)).toFixed(2),
            stakingTiers: {
              bronze: 15e3,
              // Mock fallback data
              silver: 8500,
              gold: 2800,
              platinum: 450
            }
          };
        }
      }
      async function loadStakingTierData() {
        return {
          bronze: Math.floor(Math.random() * 1e4) + 15e3,
          // 1K-5K STC holders
          silver: Math.floor(Math.random() * 5e3) + 8e3,
          // 5K-25K STC holders
          gold: Math.floor(Math.random() * 2e3) + 2500,
          // 25K-100K STC holders
          platinum: Math.floor(Math.random() * 500) + 400
          // 100K+ STC holders
        };
      }
      async function refreshAllData() {
        adminActions.isAdjusting = true;
        try {
          await loadTokenomicsData();
          loadCreatorStats();
          adminActions.actionResult = "All tokenomics data refreshed successfully";
        } catch (error) {
          adminActions.actionResult = `Error refreshing data: ${error.message}`;
        } finally {
          adminActions.isAdjusting = false;
        }
      }
      function loadCreatorStats() {
        const monthlyRev = parseFloat(tokenomicsData.monthlyRevenue) || 5e4;
        creatorStats = {
          totalCreators: 127,
          averageRevenue: Math.round(monthlyRev * 0.3 / 127),
          topCreatorEarnings: Math.round(monthlyRev * 0.3 * 0.15),
          // Top creator gets ~15% of total pool
          totalPayments: Math.round(monthlyRev * 0.3)
        };
      }
      async function adjustRevenueDistribution() {
        adminActions.isAdjusting = true;
        try {
          const total = Object.values(adminActions.newDistribution).reduce((sum, val) => sum + val, 0);
          if (Math.abs(total - 100) > 0.1) {
            throw new Error("Distribution must total 100%");
          }
          revenueDistribution = { ...adminActions.newDistribution };
          adminActions.actionResult = "Revenue distribution updated successfully";
          await loadTokenomicsData();
          loadCreatorStats();
        } catch (error) {
          adminActions.actionResult = `Error: ${error.message}`;
        } finally {
          adminActions.isAdjusting = false;
        }
      }
      function resetDistribution() {
        adminActions.newDistribution = { ...revenueDistribution };
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="space-y-8">`);
        push_element($$renderer3, "div", 185, 0);
        $$renderer3.push(`<div class="text-center">`);
        push_element($$renderer3, "div", 187, 2);
        $$renderer3.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
        push_element($$renderer3, "h1", 188, 4);
        $$renderer3.push(`Tokenomics Control Panel</h1>`);
        pop_element();
        $$renderer3.push(` <p class="text-xl text-gray-300">`);
        push_element($$renderer3, "p", 189, 4);
        $$renderer3.push(`Manage STC token economics and revenue distribution</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        Card($$renderer3, {
          class: "bg-gradient-to-r from-primary/20 to-secondary/20",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-white flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Coins($$renderer6, { class: "h-5 w-5 mr-2" });
                    $$renderer6.push(`<!----> STC Token Supply Information`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
                push_element($$renderer5, "div", 201, 6);
                $$renderer5.push(`<div class="text-center p-4 bg-white/10 rounded-lg">`);
                push_element($$renderer5, "div", 202, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 203, 10);
                $$renderer5.push(`${escape_html(parseFloat(tokenomicsData.totalSupply).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 204, 10);
                $$renderer5.push(`Total Supply</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 205, 10);
                $$renderer5.push(`Maximum STC tokens</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                push_element($$renderer5, "div", 207, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 208, 10);
                $$renderer5.push(`${escape_html(parseFloat(tokenomicsData.circulatingSupply).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 209, 10);
                $$renderer5.push(`Circulating Supply</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 210, 10);
                $$renderer5.push(`${escape_html((parseFloat(tokenomicsData.circulatingSupply) / parseFloat(tokenomicsData.totalSupply) * 100).toFixed(1))}% of total</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                push_element($$renderer5, "div", 212, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 213, 10);
                $$renderer5.push(`${escape_html(parseFloat(tokenomicsData.totalStaked).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 214, 10);
                $$renderer5.push(`Total Staked</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 215, 10);
                $$renderer5.push(`${escape_html((parseFloat(tokenomicsData.totalStaked) / parseFloat(tokenomicsData.circulatingSupply) * 100).toFixed(1))}% of circulating</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="mt-4 flex justify-center">`);
                push_element($$renderer5, "div", 218, 6);
                Button($$renderer5, {
                  onclick: refreshAllData,
                  disabled: adminActions.isAdjusting,
                  variant: "outline",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    if (adminActions.isAdjusting) {
                      $$renderer6.push("<!--[-->");
                      Refresh_cw($$renderer6, { class: "mr-2 h-4 w-4 animate-spin" });
                      $$renderer6.push(`<!----> Refreshing...`);
                    } else {
                      $$renderer6.push("<!--[!-->");
                      Refresh_cw($$renderer6, { class: "mr-2 h-4 w-4" });
                      $$renderer6.push(`<!----> Refresh Token Data`);
                    }
                    $$renderer6.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
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
          class: "bg-gradient-to-r from-accent/20 to-secondary/20",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-white flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Users($$renderer6, { class: "h-5 w-5 mr-2" });
                    $$renderer6.push(`<!----> Staking Tiers Distribution`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
                push_element($$renderer5, "div", 241, 6);
                $$renderer5.push(`<div class="text-center p-4 bg-white/10 rounded-lg">`);
                push_element($$renderer5, "div", 242, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-yellow-500">`);
                push_element($$renderer5, "div", 243, 10);
                $$renderer5.push(`${escape_html(tokenomicsData.stakingTiers.bronze.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 244, 10);
                $$renderer5.push(`Bronze Tier</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 245, 10);
                $$renderer5.push(`1K+ STC • 10% discount</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                push_element($$renderer5, "div", 247, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-gray-400">`);
                push_element($$renderer5, "div", 248, 10);
                $$renderer5.push(`${escape_html(tokenomicsData.stakingTiers.silver.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 249, 10);
                $$renderer5.push(`Silver Tier</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 250, 10);
                $$renderer5.push(`5K+ STC • 25% discount</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                push_element($$renderer5, "div", 252, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-amber-500">`);
                push_element($$renderer5, "div", 253, 10);
                $$renderer5.push(`${escape_html(tokenomicsData.stakingTiers.gold.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 254, 10);
                $$renderer5.push(`Gold Tier</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 255, 10);
                $$renderer5.push(`25K+ STC • 40% discount</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-white/10 rounded-lg">`);
                push_element($$renderer5, "div", 257, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-purple-400">`);
                push_element($$renderer5, "div", 258, 10);
                $$renderer5.push(`${escape_html(tokenomicsData.stakingTiers.platinum.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 259, 10);
                $$renderer5.push(`Platinum Tier</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 260, 10);
                $$renderer5.push(`100K+ STC • 50% discount</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="mt-4 text-center">`);
                push_element($$renderer5, "div", 263, 6);
                $$renderer5.push(`<div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 264, 8);
                $$renderer5.push(`Total Stakers: ${escape_html((tokenomicsData.stakingTiers.bronze + tokenomicsData.stakingTiers.silver + tokenomicsData.stakingTiers.gold + tokenomicsData.stakingTiers.platinum).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400 mt-1">`);
                push_element($$renderer5, "div", 267, 8);
                $$renderer5.push(`Distribution drives subscription discount utilization and platform loyalty</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
        push_element($$renderer3, "div", 275, 2);
        Card($$renderer3, {
          class: "bg-primary/20",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-gray-300 flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Dollar_sign($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> STC Price`);
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
                push_element($$renderer5, "div", 284, 8);
                $$renderer5.push(`$${escape_html(tokenomicsData.stcPrice.slice(0, 8))}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: "text-xs mt-1",
                  variant: "secondary",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->USDC`);
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
          class: "bg-secondary/20",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-gray-300 flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Coins($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> Total Staked`);
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
                push_element($$renderer5, "div", 297, 8);
                $$renderer5.push(`${escape_html(parseFloat(tokenomicsData.totalStaked).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: "text-xs mt-1",
                  variant: "secondary",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->STC`);
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
          class: "bg-accent/20",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-gray-300 flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Trending_up($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> Monthly Revenue`);
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
                push_element($$renderer5, "div", 310, 8);
                $$renderer5.push(`$${escape_html(parseFloat(tokenomicsData.monthlyRevenue).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: "text-xs mt-1",
                  variant: "secondary",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->USD`);
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
          class: "bg-green-500/20",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-sm font-medium text-gray-300 flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Activity($$renderer6, { class: "h-4 w-4 mr-2" });
                    $$renderer6.push(`<!----> Monthly Buyback`);
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
                push_element($$renderer5, "div", 323, 8);
                $$renderer5.push(`$${escape_html(parseFloat(tokenomicsData.buybackAmount).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  class: "text-xs mt-1",
                  variant: "secondary",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->USD`);
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
          class: "bg-white/5",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-white flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Settings($$renderer6, { class: "h-5 w-5 mr-2" });
                    $$renderer6.push(`<!----> Revenue Distribution Settings`);
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
                push_element($$renderer5, "div", 339, 6);
                $$renderer5.push(`<h4 class="text-lg font-medium text-white mb-4">`);
                push_element($$renderer5, "h4", 340, 8);
                $$renderer5.push(`Current Distribution</h4>`);
                pop_element();
                $$renderer5.push(` <div class="grid grid-cols-1 md:grid-cols-5 gap-4">`);
                push_element($$renderer5, "div", 341, 8);
                $$renderer5.push(`<div class="text-center p-4 bg-blue-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 342, 10);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 343, 12);
                $$renderer5.push(`${escape_html(revenueDistribution.platformOperations)}%</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 344, 12);
                $$renderer5.push(`Platform Operations</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 345, 12);
                $$renderer5.push(`$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.platformOperations / 100).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-green-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 347, 10);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 348, 12);
                $$renderer5.push(`${escape_html(revenueDistribution.creatorRevenue)}%</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 349, 12);
                $$renderer5.push(`Creator Revenue</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 350, 12);
                $$renderer5.push(`$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.creatorRevenue / 100).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-orange-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 352, 10);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 353, 12);
                $$renderer5.push(`${escape_html(revenueDistribution.stcBuyback)}%</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 354, 12);
                $$renderer5.push(`STC Buyback</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 355, 12);
                $$renderer5.push(`$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.stcBuyback / 100).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-purple-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 357, 10);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 358, 12);
                $$renderer5.push(`${escape_html(revenueDistribution.userRewards)}%</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 359, 12);
                $$renderer5.push(`User Rewards</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 360, 12);
                $$renderer5.push(`$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.userRewards / 100).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-gray-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 362, 10);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 363, 12);
                $$renderer5.push(`${escape_html(revenueDistribution.platformReserve)}%</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 364, 12);
                $$renderer5.push(`Platform Reserve</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-xs text-gray-400">`);
                push_element($$renderer5, "div", 365, 12);
                $$renderer5.push(`$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.platformReserve / 100).toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="border-t border-gray-600 pt-6">`);
                push_element($$renderer5, "div", 371, 6);
                $$renderer5.push(`<h4 class="text-lg font-medium text-white mb-4">`);
                push_element($$renderer5, "h4", 372, 8);
                $$renderer5.push(`Adjust Distribution</h4>`);
                pop_element();
                $$renderer5.push(` <div class="grid grid-cols-1 md:grid-cols-5 gap-4">`);
                push_element($$renderer5, "div", 373, 8);
                $$renderer5.push(`<div>`);
                push_element($$renderer5, "div", 374, 10);
                Label($$renderer5, {
                  class: "text-gray-300",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Platform Operations (%)`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "100",
                  get value() {
                    return adminActions.newDistribution.platformOperations;
                  },
                  set value($$value) {
                    adminActions.newDistribution.platformOperations = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` <div>`);
                push_element($$renderer5, "div", 384, 10);
                Label($$renderer5, {
                  class: "text-gray-300",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Creator Revenue (%)`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "100",
                  get value() {
                    return adminActions.newDistribution.creatorRevenue;
                  },
                  set value($$value) {
                    adminActions.newDistribution.creatorRevenue = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` <div>`);
                push_element($$renderer5, "div", 394, 10);
                Label($$renderer5, {
                  class: "text-gray-300",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->STC Buyback (%)`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "100",
                  get value() {
                    return adminActions.newDistribution.stcBuyback;
                  },
                  set value($$value) {
                    adminActions.newDistribution.stcBuyback = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` <div>`);
                push_element($$renderer5, "div", 404, 10);
                Label($$renderer5, {
                  class: "text-gray-300",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->User Rewards (%)`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "100",
                  get value() {
                    return adminActions.newDistribution.userRewards;
                  },
                  set value($$value) {
                    adminActions.newDistribution.userRewards = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` <div>`);
                push_element($$renderer5, "div", 414, 10);
                Label($$renderer5, {
                  class: "text-gray-300",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Platform Reserve (%)`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "100",
                  get value() {
                    return adminActions.newDistribution.platformReserve;
                  },
                  set value($$value) {
                    adminActions.newDistribution.platformReserve = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="mt-4 flex items-center space-x-4">`);
                push_element($$renderer5, "div", 426, 8);
                $$renderer5.push(`<div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 427, 10);
                $$renderer5.push(`Total: ${escape_html(Object.values(adminActions.newDistribution).reduce((sum, val) => sum + Number(val), 0).toFixed(1))}%</div>`);
                pop_element();
                $$renderer5.push(` `);
                if (Math.abs(Object.values(adminActions.newDistribution).reduce((sum, val) => sum + Number(val), 0) - 100) > 0.1) {
                  $$renderer5.push("<!--[-->");
                  Badge($$renderer5, {
                    variant: "destructive",
                    class: "text-xs",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Circle_alert($$renderer6, { class: "h-3 w-3 mr-1" });
                      $$renderer6.push(`<!----> Must total 100%`);
                    }),
                    $$slots: { default: true }
                  });
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
                $$renderer5.push(` <div class="mt-4 flex space-x-3">`);
                push_element($$renderer5, "div", 438, 8);
                Button($$renderer5, {
                  onclick: adjustRevenueDistribution,
                  disabled: adminActions.isAdjusting,
                  class: "bg-primary hover:bg-primary/90",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    if (adminActions.isAdjusting) {
                      $$renderer6.push("<!--[-->");
                      Refresh_cw($$renderer6, { class: "mr-2 h-4 w-4 animate-spin" });
                      $$renderer6.push(`<!----> Updating...`);
                    } else {
                      $$renderer6.push("<!--[!-->");
                      Settings($$renderer6, { class: "mr-2 h-4 w-4" });
                      $$renderer6.push(`<!----> Update Distribution`);
                    }
                    $$renderer6.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  variant: "outline",
                  onclick: resetDistribution,
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Reset Changes`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` `);
                if (adminActions.actionResult) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="mt-4 p-3 bg-gray-800 border rounded-lg">`);
                  push_element($$renderer5, "div", 458, 10);
                  $$renderer5.push(`<p class="text-sm text-white">`);
                  push_element($$renderer5, "p", 459, 12);
                  $$renderer5.push(`${escape_html(adminActions.actionResult)}</p>`);
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
          class: "bg-white/5",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_header($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Card_title($$renderer5, {
                  class: "text-white flex items-center",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Users($$renderer6, { class: "h-5 w-5 mr-2" });
                    $$renderer6.push(`<!----> Creator Revenue Analytics`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Card_content($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
                push_element($$renderer5, "div", 475, 6);
                $$renderer5.push(`<div class="text-center p-4 bg-green-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 476, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 477, 10);
                $$renderer5.push(`${escape_html(creatorStats.totalCreators)}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 478, 10);
                $$renderer5.push(`Active Creators</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-blue-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 480, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 481, 10);
                $$renderer5.push(`$${escape_html(creatorStats.averageRevenue.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 482, 10);
                $$renderer5.push(`Average Monthly Revenue</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-yellow-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 484, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 485, 10);
                $$renderer5.push(`$${escape_html(creatorStats.topCreatorEarnings.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 486, 10);
                $$renderer5.push(`Top Creator Earnings</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-center p-4 bg-purple-500/20 rounded-lg">`);
                push_element($$renderer5, "div", 488, 8);
                $$renderer5.push(`<div class="text-2xl font-bold text-white">`);
                push_element($$renderer5, "div", 489, 10);
                $$renderer5.push(`$${escape_html(creatorStats.totalPayments.toLocaleString())}</div>`);
                pop_element();
                $$renderer5.push(` <div class="text-sm text-gray-300">`);
                push_element($$renderer5, "div", 490, 10);
                $$renderer5.push(`Total Monthly Payouts</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="mt-6 flex space-x-3">`);
                push_element($$renderer5, "div", 494, 6);
                Button($$renderer5, {
                  href: "/admin/creators",
                  class: "bg-secondary hover:bg-secondary/90",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Users($$renderer6, { class: "mr-2 h-4 w-4" });
                    $$renderer6.push(`<!----> Manage Creator Payments`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  href: "/admin/analytics",
                  variant: "outline",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Trending_up($$renderer6, { class: "mr-2 h-4 w-4" });
                    $$renderer6.push(`<!----> View Full Analytics`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
        push_element($$renderer3, "div", 508, 2);
        Button($$renderer3, {
          href: "/admin/creators",
          class: "h-16 bg-green-600 hover:bg-green-700",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="text-center">`);
            push_element($$renderer4, "div", 510, 6);
            Users($$renderer4, { class: "h-6 w-6 mx-auto mb-1" });
            $$renderer4.push(`<!----> <div class="text-sm font-medium">`);
            push_element($$renderer4, "div", 512, 8);
            $$renderer4.push(`Manage Creators</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          href: "/admin/analytics",
          class: "h-16 bg-blue-600 hover:bg-blue-700",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="text-center">`);
            push_element($$renderer4, "div", 517, 6);
            Trending_up($$renderer4, { class: "h-6 w-6 mx-auto mb-1" });
            $$renderer4.push(`<!----> <div class="text-sm font-medium">`);
            push_element($$renderer4, "div", 519, 8);
            $$renderer4.push(`Revenue Analytics</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          href: "/admin",
          variant: "outline",
          class: "h-16",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="text-center">`);
            push_element($$renderer4, "div", 524, 6);
            Crown($$renderer4, { class: "h-6 w-6 mx-auto mb-1" });
            $$renderer4.push(`<!----> <div class="text-sm font-medium">`);
            push_element($$renderer4, "div", 526, 8);
            $$renderer4.push(`Back to Dashboard</div>`);
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
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-HG6yvp5s.js.map
