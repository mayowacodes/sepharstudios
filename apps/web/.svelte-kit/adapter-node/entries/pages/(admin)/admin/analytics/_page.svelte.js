import { Ct as unsubscribe_stores, St as stringify, bt as store_get, dt as attr_style, gt as ensure_array_like, jt as escape_html, kt as attr, ut as attr_class } from "../../../../../chunks/ui-libs.js";
import { t as Activity } from "../../../../../chunks/activity.js";
import { t as Coins } from "../../../../../chunks/coins.js";
import { t as Crown } from "../../../../../chunks/crown.js";
import { t as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { t as Refresh_cw } from "../../../../../chunks/refresh-cw.js";
import { t as Trending_up } from "../../../../../chunks/trending-up.js";
import { t as Users } from "../../../../../chunks/users.js";
import { t as Wallet } from "../../../../../chunks/wallet.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../../chunks/card.js";
import { a as isConnected, o as walletAddress } from "../../../../../chunks/wallet2.js";
//#region src/routes/(admin)/admin/analytics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let stcToken = null;
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
		let selectedTimeRange = "30d";
		let selectedMetric = "views";
		let adminWalletInfo = {
			stcBalance: "0",
			adminPrivileges: false,
			lastLogin: "",
			isLoading: false
		};
		async function loadAdminWalletInfo() {
			if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress) || true) return;
			adminWalletInfo.isLoading = true;
			try {
				adminWalletInfo = {
					stcBalance: await stcToken.balanceOf(store_get($$store_subs ??= {}, "$walletAddress", walletAddress)),
					adminPrivileges: true,
					lastLogin: (/* @__PURE__ */ new Date()).toISOString(),
					isLoading: false
				};
			} catch (error) {
				console.error("Error loading admin wallet info:", error);
				adminWalletInfo.isLoading = false;
			}
		}
		async function loadTokenomicsData() {}
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
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD"
			}).format(amount);
		}
		function formatPercentage(value) {
			return (value * 100).toFixed(1) + "%";
		}
		function getCategoryColor(category) {
			return {
				"Sermons": "bg-blue-500",
				"Bible Studies": "bg-green-500",
				"Worship": "bg-purple-500",
				"Youth Ministry": "bg-yellow-500",
				"Testimonies": "bg-pink-500"
			}[category] || "bg-gray-500";
		}
		$$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-white">Platform Analytics</h1> <p class="text-gray-300">Monitor platform performance and user engagement</p></div> <div class="flex items-center space-x-4">`);
		$$renderer.select({
			value: selectedTimeRange,
			onchange: loadAnalytics,
			class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
		}, ($$renderer) => {
			$$renderer.option({ value: "7d" }, ($$renderer) => {
				$$renderer.push(`Last 7 Days`);
			});
			$$renderer.option({ value: "30d" }, ($$renderer) => {
				$$renderer.push(`Last 30 Days`);
			});
			$$renderer.option({ value: "90d" }, ($$renderer) => {
				$$renderer.push(`Last 90 Days`);
			});
			$$renderer.option({ value: "1y" }, ($$renderer) => {
				$$renderer.push(`Last Year`);
			});
		});
		$$renderer.push(` `);
		$$renderer.select({
			value: selectedMetric,
			class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
		}, ($$renderer) => {
			$$renderer.option({ value: "views" }, ($$renderer) => {
				$$renderer.push(`Views`);
			});
			$$renderer.option({ value: "revenue" }, ($$renderer) => {
				$$renderer.push(`Revenue`);
			});
			$$renderer.option({ value: "engagement" }, ($$renderer) => {
				$$renderer.push(`Engagement`);
			});
			$$renderer.option({ value: "users" }, ($$renderer) => {
				$$renderer.push(`Users`);
			});
		});
		$$renderer.push(` <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">📊 Export Report</button> `);
		if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {
				onclick: () => {
					loadTokenomicsData();
					if (store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) loadAdminWalletInfo();
				},
				disabled: adminWalletInfo.isLoading,
				variant: "outline",
				children: ($$renderer) => {
					if (adminWalletInfo.isLoading) {
						$$renderer.push("<!--[0-->");
						Refresh_cw($$renderer, { class: "mr-2 h-4 w-4 animate-spin" });
					} else {
						$$renderer.push("<!--[-1-->");
						Coins($$renderer, { class: "mr-2 h-4 w-4" });
					}
					$$renderer.push(`<!--]--> Refresh Data`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> `);
		if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			Card($$renderer, {
				class: "bg-linear-to-r from-primary/20 to-accent/20 border-primary/30",
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "flex items-center space-x-2",
								children: ($$renderer) => {
									Coins($$renderer, { class: "h-6 w-6 text-accent" });
									$$renderer.push(`<!----> <span>StudioChain Tokenomics Dashboard</span> `);
									Badge($$renderer, {
										variant: "secondary",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Admin View`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: "outline",
											class: "text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(0, 6))}...${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(-4))}`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							{
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="mb-6 p-4 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"><div class="flex items-center justify-between"><div class="flex items-center space-x-3">`);
								Wallet($$renderer, { class: "h-6 w-6 text-blue-400" });
								$$renderer.push(`<!----> <div><h4 class="font-medium text-white">Admin Wallet Connected</h4> <p class="text-sm text-muted-foreground">${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress) ? `${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(0, 8)}...${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(-6)}` : "Not Connected")}</p></div></div> <div class="text-right"><div class="text-lg font-bold text-white">${escape_html(parseFloat(adminWalletInfo.stcBalance).toLocaleString())} STC</div> <div class="text-xs text-muted-foreground">Admin Balance</div></div></div> <div class="mt-3 flex items-center justify-between text-sm"><div class="flex items-center space-x-4">`);
								Badge($$renderer, {
									variant: adminWalletInfo.adminPrivileges ? "default" : "secondary",
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(adminWalletInfo.adminPrivileges ? "✓ Admin Privileges" : "Standard Access")}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> <span class="text-muted-foreground">Last Login: ${escape_html(new Date(adminWalletInfo.lastLogin).toLocaleTimeString())}</span></div> <div class="text-muted-foreground">Network: Polygon</div></div></div> <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"><div class="text-center p-4 bg-white/10 rounded-lg">`);
								Coins($$renderer, { class: "h-6 w-6 text-accent mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(parseFloat(tokenomicsMetrics.stcPrice).toFixed(4))}</div> <div class="text-xs text-muted-foreground">STC Price (USD)</div></div> <div class="text-center p-4 bg-white/10 rounded-lg">`);
								Trending_up($$renderer, { class: "h-6 w-6 text-primary mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">$${escape_html(formatNumber(tokenomicsMetrics.marketCap))}</div> <div class="text-xs text-muted-foreground">Market Cap</div></div> <div class="text-center p-4 bg-white/10 rounded-lg">`);
								Activity($$renderer, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(formatNumber(parseFloat(tokenomicsMetrics.totalStaked)))}</div> <div class="text-xs text-muted-foreground">Total Staked</div></div> <div class="text-center p-4 bg-white/10 rounded-lg">`);
								Crown($$renderer, { class: "h-6 w-6 text-green-500 mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(tokenomicsMetrics.nftHolders.toLocaleString())}</div> <div class="text-xs text-muted-foreground">NFT Holders</div></div> <div class="text-center p-4 bg-white/10 rounded-lg">`);
								Dollar_sign($$renderer, { class: "h-6 w-6 text-yellow-500 mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(tokenomicsMetrics.stakingAPY)}%</div> <div class="text-xs text-muted-foreground">Staking APY</div></div> <div class="text-center p-4 bg-white/10 rounded-lg">`);
								Users($$renderer, { class: "h-6 w-6 text-purple-500 mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">$${escape_html(formatNumber(tokenomicsMetrics.subscriptionRevenue))}</div> <div class="text-xs text-muted-foreground">Sub Revenue</div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="space-y-4"><h3 class="text-lg font-semibold flex items-center">`);
								Activity($$renderer, { class: "h-5 w-5 mr-2 text-primary" });
								$$renderer.push(`<!----> Token Distribution</h3> <div class="space-y-3"><!--[-->`);
								const each_array = ensure_array_like(tokenDistribution);
								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
									let dist = each_array[$$index];
									$$renderer.push(`<div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div${attr_class(`w-3 h-3 rounded-full ${stringify(dist.color)}`)}></div> <span class="text-sm">${escape_html(dist.category)}</span></div> <div class="text-right"><div class="text-sm font-medium">${escape_html(formatNumber(parseFloat(dist.amount)))}</div> <div class="text-xs text-muted-foreground">${escape_html(dist.percentage)}%</div></div></div> <div class="w-full bg-muted rounded-full h-2"><div${attr_class(`h-2 rounded-full ${stringify(dist.color)}`)}${attr_style(`width: ${stringify(dist.percentage)}%`)}></div></div>`);
								}
								$$renderer.push(`<!--]--></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold flex items-center">`);
								Crown($$renderer, { class: "h-5 w-5 mr-2 text-accent" });
								$$renderer.push(`<!----> Staking Tiers</h3> <div class="space-y-3"><!--[-->`);
								const each_array_1 = ensure_array_like(stakingTiers);
								for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
									let tier = each_array_1[$$index_1];
									$$renderer.push(`<div class="p-3 bg-white/5 rounded-lg"><div class="flex items-center justify-between mb-2"><span class="font-medium">${escape_html(tier.tier)}</span> `);
									Badge($$renderer, {
										variant: "outline",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(tier.discount)}% discount`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid grid-cols-3 gap-2 text-xs text-muted-foreground"><div>Min: ${escape_html(formatNumber(parseFloat(tier.minStake)))}</div> <div>Holders: ${escape_html(tier.holders.toLocaleString())}</div> <div>Staked: ${escape_html(formatNumber(parseFloat(tier.totalStaked)))}</div></div></div>`);
								}
								$$renderer.push(`<!--]--></div></div></div>`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			Card($$renderer, {
				class: "bg-linear-to-r from-orange-500/10 to-accent/10 border-orange-500/20",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6 text-center",
						children: ($$renderer) => {
							Wallet($$renderer, { class: "h-12 w-12 text-orange-500 mx-auto mb-4" });
							$$renderer.push(`<!----> <h3 class="text-lg font-semibold mb-2">Web3 Analytics Unavailable</h3> <p class="text-muted-foreground mb-4">Connect wallet to access comprehensive tokenomics analytics and STC token insights</p> `);
							Button($$renderer, {
								class: "bg-primary hover:bg-primary/90",
								children: ($$renderer) => {
									Wallet($$renderer, { class: "mr-2 h-4 w-4" });
									$$renderer.push(`<!----> Connect Wallet for Full Analytics`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div> <p class="text-gray-300">Loading analytics data...</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-white">${escape_html(formatNumber(platformMetrics.totalUsers))}</div> <div class="text-gray-300 text-sm">Total Users</div> <div class="text-green-400 text-xs mt-1">+${escape_html(platformMetrics.newUsersToday)} today</div></div> <div class="text-blue-400 text-3xl">👥</div></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-white">${escape_html(platformMetrics.activeCreators)}</div> <div class="text-gray-300 text-sm">Active Creators</div> <div class="text-purple-400 text-xs mt-1">${escape_html(formatNumber(platformMetrics.totalContent))} content items</div></div> <div class="text-purple-400 text-3xl">🎬</div></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-white">${escape_html(formatNumber(platformMetrics.totalViews))}</div> <div class="text-gray-300 text-sm">Total Views</div> <div class="text-green-400 text-xs mt-1">+${escape_html(formatNumber(platformMetrics.viewsToday))} today</div></div> <div class="text-green-400 text-3xl">👁️</div></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-white">${escape_html(formatCurrency(platformMetrics.totalRevenue))}</div> <div class="text-gray-300 text-sm">Total Revenue</div> <div class="text-yellow-400 text-xs mt-1">${escape_html(platformMetrics.contentPublishedToday)} published today</div></div> <div class="text-yellow-400 text-3xl">💰</div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-white mb-4">Content by Category (${escape_html("Views")})</h2> <div class="space-y-4"><!--[-->`);
			const each_array_2 = ensure_array_like(contentAnalytics);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let category = each_array_2[$$index_2];
				$$renderer.push(`<div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div${attr_class(`w-3 h-3 rounded-full ${stringify(getCategoryColor(category.category))}`)}></div> <span class="text-white">${escape_html(category.category)}</span></div> <div class="text-right"><div class="text-white font-medium">${escape_html(category.count)} items</div> <div class="text-gray-400 text-sm">`);
				$$renderer.push("<!--[0-->");
				$$renderer.push(`${escape_html(formatNumber(category.views))} views`);
				$$renderer.push(`<!--]--></div></div></div> <div class="w-full bg-gray-700 rounded-full h-2"><div${attr_class(`h-2 rounded-full ${stringify(getCategoryColor(category.category))}`)}${attr_style(`width: ${stringify((() => {
					let value, maxValue;
					value = category.views;
					maxValue = Math.max(...contentAnalytics.map((c) => c.views));
					return maxValue > 0 ? value / maxValue * 100 : 0;
				})())}%`)}></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-white mb-4">Users by Country</h2> <div class="space-y-3"><!--[-->`);
			const each_array_3 = ensure_array_like(geographicData.slice(0, 6));
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let country = each_array_3[$$index_3];
				$$renderer.push(`<div class="flex items-center justify-between"><span class="text-white">${escape_html(country.country)}</span> <div class="flex items-center space-x-3"><div class="w-24 bg-gray-700 rounded-full h-2"><div class="h-2 bg-red-500 rounded-full"${attr_style(`width: ${stringify(country.percentage)}%`)}></div></div> <span class="text-gray-300 text-sm w-12 text-right">${escape_html(country.percentage)}%</span></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-white mb-4">Revenue &amp; Payouts Trend</h2> <div class="grid grid-cols-4 md:grid-cols-8 gap-4 items-end h-64"><!--[-->`);
			const each_array_4 = ensure_array_like(revenueData);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let data = each_array_4[$$index_4];
				$$renderer.push(`<div class="flex flex-col items-center space-y-2"><div class="flex flex-col items-center space-y-1 flex-1 justify-end"><div class="bg-green-500 rounded-t w-8"${attr_style(`height: ${stringify(data.revenue / Math.max(...revenueData.map((d) => d.revenue)) * 180)}px`)}${attr("title", `Revenue: ${stringify(formatCurrency(data.revenue))}`)}></div> <div class="bg-blue-500 rounded-b w-8"${attr_style(`height: ${stringify(data.payouts / Math.max(...revenueData.map((d) => d.payouts)) * 120)}px`)}${attr("title", `Payouts: ${stringify(formatCurrency(data.payouts))}`)}></div></div> <span class="text-gray-300 text-xs">${escape_html(data.month)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex items-center justify-center space-x-6 mt-4"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-green-500 rounded"></div> <span class="text-gray-300 text-sm">Revenue</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-blue-500 rounded"></div> <span class="text-gray-300 text-sm">Payouts</span></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-white mb-4">Top Creators</h2> <div class="space-y-4"><!--[-->`);
			const each_array_5 = ensure_array_like(topCreators);
			for (let index = 0, $$length = each_array_5.length; index < $$length; index++) {
				let creator = each_array_5[index];
				$$renderer.push(`<div class="flex items-center space-x-4"><div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(index + 1)}</div> <div class="flex-1"><div class="text-white font-medium">${escape_html(creator.name)}</div> <div class="text-gray-400 text-sm">${escape_html(creator.ministry)}</div></div> <div class="text-right"><div class="text-white font-medium">${escape_html(formatNumber(creator.views))} views</div> <div class="text-gray-400 text-sm">${escape_html(creator.content)} content • ${escape_html(formatCurrency(creator.revenue))}</div></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-white mb-4">Top Content</h2> <div class="space-y-4"><!--[-->`);
			const each_array_6 = ensure_array_like(topContent);
			for (let index = 0, $$length = each_array_6.length; index < $$length; index++) {
				let content = each_array_6[index];
				$$renderer.push(`<div class="flex items-center space-x-4"><div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(index + 1)}</div> <div class="flex-1"><div class="text-white font-medium">${escape_html(content.title)}</div> <div class="text-gray-400 text-sm">${escape_html(content.creator)} • ${escape_html(content.category)}</div></div> <div class="text-right"><div class="text-white font-medium">${escape_html(formatNumber(content.views))} views</div> <div class="text-gray-400 text-sm">${escape_html(formatPercentage(content.engagement))} engagement</div></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-white mb-4">User Growth Trend</h2> <div class="grid grid-cols-6 gap-4 items-end h-48"><!--[-->`);
			const each_array_7 = ensure_array_like(userGrowthData);
			for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
				let data = each_array_7[$$index_7];
				$$renderer.push(`<div class="flex flex-col items-center space-y-2"><div class="flex flex-col items-center space-y-1 flex-1 justify-end"><div class="bg-blue-500 rounded-t w-12"${attr_style(`height: ${stringify(data.users / Math.max(...userGrowthData.map((d) => d.users)) * 120)}px`)}${attr("title", `Users: ${stringify(data.users.toLocaleString())}`)}></div> <div class="bg-purple-500 rounded-b w-12"${attr_style(`height: ${stringify(data.creators / Math.max(...userGrowthData.map((d) => d.creators)) * 80)}px`)}${attr("title", `Creators: ${stringify(data.creators)}`)}></div></div> <span class="text-gray-300 text-xs">${escape_html(new Date(data.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric"
				}))}</span></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex items-center justify-center space-x-6 mt-4"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-blue-500 rounded"></div> <span class="text-gray-300 text-sm">Users</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-purple-500 rounded"></div> <span class="text-gray-300 text-sm">Creators</span></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
