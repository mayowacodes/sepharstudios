import { jt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Activity } from "../../../../../chunks/activity.js";
import { t as Circle_alert } from "../../../../../chunks/circle-alert.js";
import { t as Coins } from "../../../../../chunks/coins.js";
import { t as Crown } from "../../../../../chunks/crown.js";
import { t as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { t as Refresh_cw } from "../../../../../chunks/refresh-cw.js";
import { t as Settings } from "../../../../../chunks/settings.js";
import { t as Trending_up } from "../../../../../chunks/trending-up.js";
import { t as Users } from "../../../../../chunks/users.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Input } from "../../../../../chunks/input.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../../chunks/card.js";
import { t as Label } from "../../../../../chunks/label.js";
//#region src/routes/(admin)/admin/tokenomics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let stcToken = null;
		let tokenAMM = null;
		let tokenomicsData = {
			stcPrice: "0",
			totalSupply: "0",
			circulatingSupply: "0",
			totalStaked: "0",
			monthlyRevenue: "0",
			buybackAmount: "0",
			creatorPool: "0",
			userRewardPool: "0",
			stakingTiers: {
				bronze: 0,
				silver: 0,
				gold: 0,
				platinum: 0
			}
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
		async function loadRevenueDistribution() {
			const res = await fetch("/api/admin/tokenomics");
			if (res.ok) {
				const data = await res.json();
				revenueDistribution = data.revenueDistribution || revenueDistribution;
				adminActions.newDistribution = { ...revenueDistribution };
				if (data.creatorStats) creatorStats = data.creatorStats;
			}
		}
		async function loadTokenomicsData() {
			try {
				if (!stcToken || !tokenAMM) {
					const mod = await import("../../../../../chunks/contracts2.js");
					stcToken = mod.stcToken;
					tokenAMM = mod.tokenAMM;
				}
				const [price, poolInfo, totalSupply] = await Promise.all([
					tokenAMM.getSTCPrice(),
					tokenAMM.getPoolInfo(),
					stcToken.totalSupply()
				]);
				const monthlyRev = parseFloat(poolInfo.monthlyRevenue);
				tokenomicsData = {
					stcPrice: price,
					totalSupply,
					circulatingSupply: (parseFloat(totalSupply) * .75).toString(),
					totalStaked: poolInfo.stcBalance,
					monthlyRevenue: poolInfo.monthlyRevenue,
					buybackAmount: (monthlyRev * (revenueDistribution.stcBuyback / 100)).toFixed(2),
					creatorPool: (monthlyRev * (revenueDistribution.creatorRevenue / 100)).toFixed(2),
					userRewardPool: (monthlyRev * (revenueDistribution.userRewards / 100)).toFixed(2),
					stakingTiers: await loadStakingTierData()
				};
			} catch (error) {
				console.error("Error loading tokenomics data:", error);
				tokenomicsData = {
					stcPrice: "0",
					totalSupply: "0",
					circulatingSupply: "0",
					totalStaked: "0",
					monthlyRevenue: "0",
					buybackAmount: "0",
					creatorPool: "0",
					userRewardPool: "0",
					stakingTiers: {
						bronze: 0,
						silver: 0,
						gold: 0,
						platinum: 0
					}
				};
			}
		}
		async function loadStakingTierData() {
			const res = await fetch("/api/admin/tokenomics");
			if (res.ok) return (await res.json()).stakingTiers || {
				bronze: 0,
				silver: 0,
				gold: 0,
				platinum: 0
			};
			return {
				bronze: 0,
				silver: 0,
				gold: 0,
				platinum: 0
			};
		}
		async function refreshAllData() {
			adminActions.isAdjusting = true;
			try {
				await loadRevenueDistribution();
				await loadTokenomicsData();
				await loadCreatorStats();
				adminActions.actionResult = "All tokenomics data refreshed successfully";
			} catch (error) {
				adminActions.actionResult = `Error refreshing data: ${error.message}`;
			} finally {
				adminActions.isAdjusting = false;
			}
		}
		async function loadCreatorStats() {
			const res = await fetch("/api/admin/tokenomics");
			if (res.ok) {
				const data = await res.json();
				if (data.creatorStats) creatorStats = data.creatorStats;
			}
		}
		async function adjustRevenueDistribution() {
			adminActions.isAdjusting = true;
			try {
				const total = Object.values(adminActions.newDistribution).reduce((sum, val) => sum + val, 0);
				if (Math.abs(total - 100) > .1) throw new Error("Distribution must total 100%");
				if (!(await fetch("/api/admin/tokenomics/distribution", {
					method: "PATCH",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ revenueDistribution: adminActions.newDistribution })
				})).ok) throw new Error("Failed to update distribution");
				revenueDistribution = { ...adminActions.newDistribution };
				adminActions.actionResult = "Revenue distribution updated successfully";
				await loadTokenomicsData();
				await loadCreatorStats();
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
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="space-y-8"><div class="text-center"><h1 class="text-4xl font-bold text-white mb-2">Tokenomics Control Panel</h1> <p class="text-xl text-gray-300">Manage STC token economics and revenue distribution</p></div> `);
			Card($$renderer, {
				class: "bg-linear-to-r from-primary/20 to-secondary/20",
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-white flex items-center",
								children: ($$renderer) => {
									Coins($$renderer, { class: "h-5 w-5 mr-2" });
									$$renderer.push(`<!----> STC Token Supply Information`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="text-center p-4 bg-white/10 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(parseFloat(tokenomicsData.totalSupply).toLocaleString())}</div> <div class="text-sm text-gray-300">Total Supply</div> <div class="text-xs text-gray-400">Maximum STC tokens</div></div> <div class="text-center p-4 bg-white/10 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(parseFloat(tokenomicsData.circulatingSupply).toLocaleString())}</div> <div class="text-sm text-gray-300">Circulating Supply</div> <div class="text-xs text-gray-400">${escape_html((parseFloat(tokenomicsData.circulatingSupply) / parseFloat(tokenomicsData.totalSupply) * 100).toFixed(1))}% of total</div></div> <div class="text-center p-4 bg-white/10 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(parseFloat(tokenomicsData.totalStaked).toLocaleString())}</div> <div class="text-sm text-gray-300">Total Staked</div> <div class="text-xs text-gray-400">${escape_html((parseFloat(tokenomicsData.totalStaked) / parseFloat(tokenomicsData.circulatingSupply) * 100).toFixed(1))}% of circulating</div></div></div> <div class="mt-4 flex justify-center">`);
							Button($$renderer, {
								onclick: refreshAllData,
								disabled: adminActions.isAdjusting,
								variant: "outline",
								children: ($$renderer) => {
									if (adminActions.isAdjusting) {
										$$renderer.push("<!--[0-->");
										Refresh_cw($$renderer, { class: "mr-2 h-4 w-4 animate-spin" });
										$$renderer.push(`<!----> Refreshing...`);
									} else {
										$$renderer.push("<!--[-1-->");
										Refresh_cw($$renderer, { class: "mr-2 h-4 w-4" });
										$$renderer.push(`<!----> Refresh Token Data`);
									}
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				class: "bg-linear-to-r from-accent/20 to-secondary/20",
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-white flex items-center",
								children: ($$renderer) => {
									Users($$renderer, { class: "h-5 w-5 mr-2" });
									$$renderer.push(`<!----> Staking Tiers Distribution`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div class="text-center p-4 bg-white/10 rounded-lg"><div class="text-2xl font-bold text-yellow-500">${escape_html(tokenomicsData.stakingTiers.bronze.toLocaleString())}</div> <div class="text-sm text-gray-300">Bronze Tier</div> <div class="text-xs text-gray-400">1K+ STC • 10% discount</div></div> <div class="text-center p-4 bg-white/10 rounded-lg"><div class="text-2xl font-bold text-gray-400">${escape_html(tokenomicsData.stakingTiers.silver.toLocaleString())}</div> <div class="text-sm text-gray-300">Silver Tier</div> <div class="text-xs text-gray-400">5K+ STC • 25% discount</div></div> <div class="text-center p-4 bg-white/10 rounded-lg"><div class="text-2xl font-bold text-amber-500">${escape_html(tokenomicsData.stakingTiers.gold.toLocaleString())}</div> <div class="text-sm text-gray-300">Gold Tier</div> <div class="text-xs text-gray-400">25K+ STC • 40% discount</div></div> <div class="text-center p-4 bg-white/10 rounded-lg"><div class="text-2xl font-bold text-purple-400">${escape_html(tokenomicsData.stakingTiers.platinum.toLocaleString())}</div> <div class="text-sm text-gray-300">Platinum Tier</div> <div class="text-xs text-gray-400">100K+ STC • 50% discount</div></div></div> <div class="mt-4 text-center"><div class="text-sm text-gray-300">Total Stakers: ${escape_html((tokenomicsData.stakingTiers.bronze + tokenomicsData.stakingTiers.silver + tokenomicsData.stakingTiers.gold + tokenomicsData.stakingTiers.platinum).toLocaleString())}</div> <div class="text-xs text-gray-400 mt-1">Distribution drives subscription discount utilization and platform loyalty</div></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
			Card($$renderer, {
				class: "bg-primary/20",
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-gray-300 flex items-center",
								children: ($$renderer) => {
									Dollar_sign($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> STC Price`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "pt-0",
						children: ($$renderer) => {
							$$renderer.push(`<div class="text-2xl font-bold text-white">$${escape_html(tokenomicsData.stcPrice.slice(0, 8))}</div> `);
							Badge($$renderer, {
								class: "text-xs mt-1",
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->USDC`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				class: "bg-secondary/20",
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-gray-300 flex items-center",
								children: ($$renderer) => {
									Coins($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> Total Staked`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "pt-0",
						children: ($$renderer) => {
							$$renderer.push(`<div class="text-2xl font-bold text-white">${escape_html(parseFloat(tokenomicsData.totalStaked).toLocaleString())}</div> `);
							Badge($$renderer, {
								class: "text-xs mt-1",
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->STC`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				class: "bg-accent/20",
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-gray-300 flex items-center",
								children: ($$renderer) => {
									Trending_up($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> Monthly Revenue`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "pt-0",
						children: ($$renderer) => {
							$$renderer.push(`<div class="text-2xl font-bold text-white">$${escape_html(parseFloat(tokenomicsData.monthlyRevenue).toLocaleString())}</div> `);
							Badge($$renderer, {
								class: "text-xs mt-1",
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->USD`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				class: "bg-green-500/20",
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-gray-300 flex items-center",
								children: ($$renderer) => {
									Activity($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> Monthly Buyback`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "pt-0",
						children: ($$renderer) => {
							$$renderer.push(`<div class="text-2xl font-bold text-white">$${escape_html(parseFloat(tokenomicsData.buybackAmount).toLocaleString())}</div> `);
							Badge($$renderer, {
								class: "text-xs mt-1",
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->USD`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			Card($$renderer, {
				class: "bg-white/5",
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-white flex items-center",
								children: ($$renderer) => {
									Settings($$renderer, { class: "h-5 w-5 mr-2" });
									$$renderer.push(`<!----> Revenue Distribution Settings`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "space-y-6",
						children: ($$renderer) => {
							$$renderer.push(`<div><h4 class="text-lg font-medium text-white mb-4">Current Distribution</h4> <div class="grid grid-cols-1 md:grid-cols-5 gap-4"><div class="text-center p-4 bg-blue-500/20 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(revenueDistribution.platformOperations)}%</div> <div class="text-sm text-gray-300">Platform Operations</div> <div class="text-xs text-gray-400">$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.platformOperations / 100).toLocaleString())}</div></div> <div class="text-center p-4 bg-green-500/20 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(revenueDistribution.creatorRevenue)}%</div> <div class="text-sm text-gray-300">Creator Revenue</div> <div class="text-xs text-gray-400">$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.creatorRevenue / 100).toLocaleString())}</div></div> <div class="text-center p-4 bg-orange-500/20 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(revenueDistribution.stcBuyback)}%</div> <div class="text-sm text-gray-300">STC Buyback</div> <div class="text-xs text-gray-400">$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.stcBuyback / 100).toLocaleString())}</div></div> <div class="text-center p-4 bg-purple-500/20 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(revenueDistribution.userRewards)}%</div> <div class="text-sm text-gray-300">User Rewards</div> <div class="text-xs text-gray-400">$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.userRewards / 100).toLocaleString())}</div></div> <div class="text-center p-4 bg-gray-500/20 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(revenueDistribution.platformReserve)}%</div> <div class="text-sm text-gray-300">Platform Reserve</div> <div class="text-xs text-gray-400">$${escape_html((parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.platformReserve / 100).toLocaleString())}</div></div></div></div> <div class="border-t border-gray-600 pt-6"><h4 class="text-lg font-medium text-white mb-4">Adjust Distribution</h4> <div class="grid grid-cols-1 md:grid-cols-5 gap-4"><div>`);
							Label($$renderer, {
								class: "text-gray-300",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Platform Operations (%)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
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
							$$renderer.push(`<!----></div> <div>`);
							Label($$renderer, {
								class: "text-gray-300",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Creator Revenue (%)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
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
							$$renderer.push(`<!----></div> <div>`);
							Label($$renderer, {
								class: "text-gray-300",
								children: ($$renderer) => {
									$$renderer.push(`<!---->STC Buyback (%)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
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
							$$renderer.push(`<!----></div> <div>`);
							Label($$renderer, {
								class: "text-gray-300",
								children: ($$renderer) => {
									$$renderer.push(`<!---->User Rewards (%)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
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
							$$renderer.push(`<!----></div> <div>`);
							Label($$renderer, {
								class: "text-gray-300",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Platform Reserve (%)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
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
							$$renderer.push(`<!----></div></div> <div class="mt-4 flex items-center space-x-4"><div class="text-sm text-gray-300">Total: ${escape_html(Object.values(adminActions.newDistribution).reduce((sum, val) => sum + Number(val), 0).toFixed(1))}%</div> `);
							if (Math.abs(Object.values(adminActions.newDistribution).reduce((sum, val) => sum + Number(val), 0) - 100) > .1) {
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									variant: "destructive",
									class: "text-xs",
									children: ($$renderer) => {
										Circle_alert($$renderer, { class: "h-3 w-3 mr-1" });
										$$renderer.push(`<!----> Must total 100%`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="mt-4 flex space-x-3">`);
							Button($$renderer, {
								onclick: adjustRevenueDistribution,
								disabled: adminActions.isAdjusting,
								class: "bg-primary hover:bg-primary/90",
								children: ($$renderer) => {
									if (adminActions.isAdjusting) {
										$$renderer.push("<!--[0-->");
										Refresh_cw($$renderer, { class: "mr-2 h-4 w-4 animate-spin" });
										$$renderer.push(`<!----> Updating...`);
									} else {
										$$renderer.push("<!--[-1-->");
										Settings($$renderer, { class: "mr-2 h-4 w-4" });
										$$renderer.push(`<!----> Update Distribution`);
									}
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "outline",
								onclick: resetDistribution,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Reset Changes`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div> `);
							if (adminActions.actionResult) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="mt-4 p-3 bg-gray-800 border rounded-lg"><p class="text-sm text-white">${escape_html(adminActions.actionResult)}</p></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				class: "bg-white/5",
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-white flex items-center",
								children: ($$renderer) => {
									Users($$renderer, { class: "h-5 w-5 mr-2" });
									$$renderer.push(`<!----> Creator Revenue Analytics`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="text-center p-4 bg-green-500/20 rounded-lg"><div class="text-2xl font-bold text-white">${escape_html(creatorStats.totalCreators)}</div> <div class="text-sm text-gray-300">Active Creators</div></div> <div class="text-center p-4 bg-blue-500/20 rounded-lg"><div class="text-2xl font-bold text-white">$${escape_html(creatorStats.averageRevenue.toLocaleString())}</div> <div class="text-sm text-gray-300">Average Monthly Revenue</div></div> <div class="text-center p-4 bg-yellow-500/20 rounded-lg"><div class="text-2xl font-bold text-white">$${escape_html(creatorStats.topCreatorEarnings.toLocaleString())}</div> <div class="text-sm text-gray-300">Top Creator Earnings</div></div> <div class="text-center p-4 bg-purple-500/20 rounded-lg"><div class="text-2xl font-bold text-white">$${escape_html(creatorStats.totalPayments.toLocaleString())}</div> <div class="text-sm text-gray-300">Total Monthly Payouts</div></div></div> <div class="mt-6 flex space-x-3">`);
							Button($$renderer, {
								href: "/admin/creators",
								class: "bg-secondary hover:bg-secondary/90",
								children: ($$renderer) => {
									Users($$renderer, { class: "mr-2 h-4 w-4" });
									$$renderer.push(`<!----> Manage Creator Payments`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								href: "/admin/analytics",
								variant: "outline",
								children: ($$renderer) => {
									Trending_up($$renderer, { class: "mr-2 h-4 w-4" });
									$$renderer.push(`<!----> View Full Analytics`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
			Button($$renderer, {
				href: "/admin/creators",
				class: "h-16 bg-green-600 hover:bg-green-700",
				children: ($$renderer) => {
					$$renderer.push(`<div class="text-center">`);
					Users($$renderer, { class: "h-6 w-6 mx-auto mb-1" });
					$$renderer.push(`<!----> <div class="text-sm font-medium">Manage Creators</div></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				href: "/admin/analytics",
				class: "h-16 bg-blue-600 hover:bg-blue-700",
				children: ($$renderer) => {
					$$renderer.push(`<div class="text-center">`);
					Trending_up($$renderer, { class: "h-6 w-6 mx-auto mb-1" });
					$$renderer.push(`<!----> <div class="text-sm font-medium">Revenue Analytics</div></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				href: "/admin",
				variant: "outline",
				class: "h-16",
				children: ($$renderer) => {
					$$renderer.push(`<div class="text-center">`);
					Crown($$renderer, { class: "h-6 w-6 mx-auto mb-1" });
					$$renderer.push(`<!----> <div class="text-sm font-medium">Back to Dashboard</div></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
