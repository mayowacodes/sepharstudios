import { q as escape_html, ae as attr_style, v as stringify, i as attr, b as ensure_array_like, f as derived, af as onDestroy, x as attr_class, am as store_get, an as unsubscribe_stores } from './index.js-DwRgOKlO.js';
import { A as Activity } from './activity-Bl9SI4l0.js';
import { P as PortalKpi } from './PortalKpi-DuR9asVZ.js';
import { C as Chart_column } from './chart-column-DYUpt23O.js';
import { C as Coins } from './coins-BATWQo6i.js';
import { C as Crown } from './crown-D5hwc3L9.js';
import { D as Dollar_sign } from './dollar-sign-BWUy4XbE.js';
import { F as File_text } from './file-text-CHS0iqgH.js';
import { R as Radio } from './radio-CnkvYoqw.js';
import { T as Trending_up } from './trending-up-_dhWQ2d_.js';
import { U as Users } from './users-Cy8n6xcU.js';
import { W as Wallet } from './wallet-DReqm_Mo.js';
import { S as Skeleton } from './skeleton-DrNJG5oW.js';
import { B as Button } from './button-CGRNF9DE.js';
import { B as Badge } from './badge-BhiwSYj1.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import { C as Card, a as Card_header, c as Card_title, d as Card_content } from './card-BPxJt-G5.js';
import { i as isConnected, w as walletAddress } from './wallet2-BPPkEj4k.js';
import './Icon-C7ASqKku.js';
import './utils2-DHW1aw82.js';
import './index-CMAaDatn.js';
import './config-CCybBZCm.js';
import './stringify-cjaXfEgK.js';
import 'node:crypto';
import './http-D5cER_a5.js';
import './polygonAmoy-PO2ITH37.js';

//#region src/lib/components/dashboard/TrendChart.svelte
function TrendChart($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Lightweight area chart for dashboard analytics. Inline SVG, no chart-lib
		* dependency — same approach as Sparkline, scaled up with axis labels +
		* hover tooltip. For richer charts (multi-series, axes legends, brushing),
		* use layerchart directly via the `chart-*` primitives.
		*/
		let { data, label, accent = "portal", height = 220, formatValue = (v) => v.toLocaleString() } = $$props;
		const ACCENT = {
			portal: "hsl(var(--portal-accent, 175 60% 48%))",
			purple: "rgb(168 85 247)",
			blue: "rgb(59 130 246)",
			green: "rgb(34 197 94)",
			yellow: "rgb(234 179 8)",
			red: "rgb(239 68 68)",
			orange: "rgb(249 115 22)",
			gray: "rgb(156 163 175)"
		};
		const color = derived(() => ACCENT[accent]);
		const W = 600;
		const H = 200;
		const PAD = {
			top: 12,
			right: 12,
			bottom: 28,
			left: 40
		};
		const parsed = derived(() => data.map((p) => ({
			date: p.date instanceof Date ? p.date : new Date(p.date),
			value: Number(p.value) || 0
		})));
		const scales = derived(() => {
			if (parsed().length === 0) return null;
			const values = parsed().map((p) => p.value);
			return {
				min: Math.min(0, ...values),
				max: Math.max(...values, 1),
				xStep: (W - PAD.left - PAD.right) / Math.max(1, parsed().length - 1)
			};
		});
		const linePath = derived(() => {
			if (!scales()) return {
				line: "",
				area: ""
			};
			const { min, max, xStep } = scales();
			const range = max - min || 1;
			const pts = parsed().map((p, i) => {
				return [PAD.left + i * xStep, PAD.top + (1 - (p.value - min) / range) * (H - PAD.top - PAD.bottom)];
			});
			const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
			return {
				line,
				area: `${line} L${pts[pts.length - 1][0]} ${H - PAD.bottom} L${pts[0][0]} ${H - PAD.bottom} Z`
			};
		});
		function tickValues() {
			if (!scales()) return [];
			return [
				scales().min,
				(scales().min + scales().max) / 2,
				scales().max
			];
		}
		function fmtDate(d) {
			return d.toLocaleDateString(void 0, {
				month: "short",
				day: "numeric"
			});
		}
		$$renderer.push(`<div class="rounded-xl p-5 border" style="background: hsl(var(--portal-bg-elevated, 222 22% 11%)/0.55); border-color: hsl(var(--portal-border, 215 14% 27%)); backdrop-filter: blur(8px);"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-medium" style="color: hsl(var(--portal-text, 210 30% 92%));">${escape_html(label)}</h3> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (parsed().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-sm py-10 text-center"${attr_style(`height: ${stringify(height)}px; color: hsl(var(--portal-text-muted, 210 15% 60%));`)}>No data yet.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<svg${attr("viewBox", `0 0 ${W} ${H}`)} width="100%"${attr("height", height)} preserveAspectRatio="none" role="img"${attr("aria-label", label)}><defs><linearGradient${attr("id", `trend-grad-${accent}`)} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${attr("stop-color", color())} stop-opacity="0.4"></stop><stop offset="100%"${attr("stop-color", color())} stop-opacity="0"></stop></linearGradient></defs><!--[-->`);
			const each_array = ensure_array_like(tickValues());
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				const y = PAD.top + i / (tickValues().length - 1) * (H - PAD.top - PAD.bottom);
				$$renderer.push(`<line${attr("x1", PAD.left)}${attr("x2", W - PAD.right)}${attr("y1", y)}${attr("y2", y)} stroke="rgba(255,255,255,0.07)" stroke-width="1"></line><text${attr("x", PAD.left - 6)}${attr("y", y + 3)} text-anchor="end" fill="hsl(var(--portal-text-muted, 210 15% 60%))" font-size="10">${escape_html(formatValue(tickValues()[tickValues().length - 1 - i]))}</text>`);
			}
			$$renderer.push(`<!--]-->`);
			if (linePath().area) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<path${attr("d", linePath().area)}${attr("fill", `url(#trend-grad-${accent})`)}></path>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			if (linePath().line) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<path${attr("d", linePath().line)} fill="none"${attr("stroke", color())} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			if (parsed().length > 0) {
				$$renderer.push("<!--[0-->");
				const ticks = [
					0,
					Math.floor(parsed().length / 2),
					parsed().length - 1
				];
				$$renderer.push(`<!--[-->`);
				const each_array_1 = ensure_array_like(ticks);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let ti = each_array_1[$$index_1];
					const x = PAD.left + ti * (scales()?.xStep ?? 0);
					$$renderer.push(`<text${attr("x", x)}${attr("y", H - PAD.bottom + 16)} text-anchor="middle" fill="hsl(var(--portal-text-muted, 210 15% 60%))" font-size="10">${escape_html(fmtDate(parsed()[ti].date))}</text>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></svg>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

//#region src/routes/(admin)/admin/analytics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let series = {
			users: [],
			revenue: [],
			content: []
		};
		let deltas = {
			users: 0,
			revenue: 0,
			content: 0
		};
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
			stcPrice: "0",
			marketCap: 0,
			totalStaked: "0",
			subscriptionRevenue: 0,
			nftHolders: 0,
			stakingAPY: 0
		};
		let tokenDistribution = [];
		let stakingTiers = [];
		let loading = true;
		let selectedTimeRange = "30d";
		let selectedMetric = "views";
		let adminWalletInfo = {
			stcBalance: "0",
			lastLogin: "",
			isLoading: false
		};
		let liveEvents = [];
		let evtSource = null;
		function relativeTime(iso) {
			const diff = Date.now() - new Date(iso).getTime();
			if (diff < 1e4) return "just now";
			if (diff < 6e4) return `${Math.floor(diff / 1e3)}s ago`;
			if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
			return new Date(iso).toLocaleTimeString();
		}
		async function loadAdminWalletInfo() {
			if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress) || true) return;
		}
		async function loadTokenomicsData() {}
		async function loadAnalytics() {
			loading = true;
			try {
				const res = await fetch(`/api/admin/analytics?range=${selectedTimeRange}`);
				if (!res.ok) {
					console.error("[admin/analytics] load HTTP", res.status);
					return;
				}
				const data = await res.json().catch(() => null);
				if (!data) return;
				platformMetrics = data.platformMetrics;
				contentAnalytics = data.contentAnalytics;
				userGrowthData = data.userGrowthData;
				revenueData = data.revenueData;
				geographicData = data.geographicData;
				topCreators = data.topCreators;
				topContent = data.topContent;
				series = data.series ?? {
					users: [],
					revenue: [],
					content: []
				};
				deltas = data.deltas ?? {
					users: 0,
					revenue: 0,
					content: 0
				};
			} catch (err) {
				console.error("[admin/analytics] load failed:", err);
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
		onDestroy(() => {
			evtSource?.close();
			evtSource = null;
		});
		$$renderer.push(`<div class="mx-auto px-4 py-4 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				$$renderer.select({
					value: selectedTimeRange,
					onchange: loadAnalytics,
					class: "rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2",
					style: "background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
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
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Platform",
				title: "Mission analytics",
				subtitle: "Monitor platform performance and user engagement.",
				icon: Chart_column,
				actions});
		}
		$$renderer.push(`<!----> `);
		if (liveEvents.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5"><div class="flex items-center gap-2 mb-3">`);
			Radio($$renderer, { class: "w-4 h-4 text-emerald-300 animate-pulse" });
			$$renderer.push(`<!----> <h2 class="text-sm font-semibold text-foreground">Live now</h2> <span class="text-xs text-muted-foreground">— ${escape_html(liveEvents.length)} recent ${escape_html(liveEvents.length === 1 ? "event" : "events")}</span></div> <ul class="space-y-1.5 max-h-48 overflow-y-auto"><!--[-->`);
			const each_array = ensure_array_like(liveEvents);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let ev = each_array[$$index];
				$$renderer.push(`<li class="flex items-center gap-2 text-xs"><span${attr_class(`inline-block w-1.5 h-1.5 rounded-full ${ev.kind === "watch_complete" ? "bg-emerald-400" : "bg-yellow-300"} shrink-0`)}></span> <span class="text-foreground truncate flex-1">${escape_html(ev.kind === "watch_complete" ? "Completed" : "Started watching")}: ${escape_html(ev.title)}</span> <span class="text-muted-foreground shrink-0">${escape_html(relativeTime(ev.at))}</span></li>`);
			}
			$$renderer.push(`<!--]--></ul></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(4));
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				each_array_1[i];
				Skeleton($$renderer, { class: "h-28 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`);
			PortalKpi($$renderer, {
				label: "Total Users",
				value: platformMetrics.totalUsers,
				icon: Users,
				delta: deltas.users,
				deltaLabel: "vs prior 30d",
				sparkline: series.users,
				formatValue: formatNumber
			});
			$$renderer.push(`<!----> `);
			PortalKpi($$renderer, {
				label: "Active Creators",
				value: platformMetrics.activeCreators,
				icon: Crown,
				formatValue: formatNumber
			});
			$$renderer.push(`<!----> `);
			PortalKpi($$renderer, {
				label: "Content",
				value: platformMetrics.totalContent,
				icon: File_text,
				delta: deltas.content,
				deltaLabel: "vs prior 30d",
				sparkline: series.content,
				formatValue: formatNumber
			});
			$$renderer.push(`<!----> `);
			PortalKpi($$renderer, {
				label: "Revenue",
				value: formatCurrency(platformMetrics.totalRevenue),
				icon: Dollar_sign,
				delta: deltas.revenue,
				deltaLabel: "vs prior 30d",
				sparkline: series.revenue
			});
			$$renderer.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">`);
			if (series.users.length > 0) {
				$$renderer.push("<!--[0-->");
				const today = /* @__PURE__ */ new Date();
				TrendChart($$renderer, {
					label: "New users (30d)",
					accent: "blue",
					data: series.users.map((v, i) => ({
						date: /* @__PURE__ */ new Date(today.getTime() - (series.users.length - 1 - i) * 864e5),
						value: v
					})),
					formatValue: (v) => formatNumber(v)
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (series.revenue.length > 0) {
				$$renderer.push("<!--[0-->");
				const today = /* @__PURE__ */ new Date();
				TrendChart($$renderer, {
					label: "Revenue (30d)",
					accent: "green",
					data: series.revenue.map((v, i) => ({
						date: /* @__PURE__ */ new Date(today.getTime() - (series.revenue.length - 1 - i) * 864e5),
						value: v
					})),
					formatValue: (v) => formatCurrency(v)
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div class="flex items-center justify-end gap-2">`);
		$$renderer.select({
			value: selectedMetric,
			class: "surface-2 rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
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
					{
						$$renderer.push("<!--[-1-->");
						Coins($$renderer, { class: "mr-2 h-4 w-4" });
					}
					$$renderer.push(`<!--]--> Refresh Data`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
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
								$$renderer.push(`<!----> <div><h4 class="font-medium text-foreground">Admin Wallet Connected</h4> <p class="text-sm text-muted-foreground">${escape_html(store_get($$store_subs ??= {}, "$walletAddress", walletAddress) ? `${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(0, 8)}...${store_get($$store_subs ??= {}, "$walletAddress", walletAddress).slice(-6)}` : "Not Connected")}</p></div></div> <div class="text-right"><div class="text-lg font-bold text-foreground">${escape_html(parseFloat(adminWalletInfo.stcBalance).toLocaleString())} STC</div> <div class="text-xs text-muted-foreground">Admin Balance</div></div></div> <div class="mt-3 flex items-center justify-between text-sm"><div class="flex items-center space-x-4">`);
								Badge($$renderer, {
									variant: "secondary",
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html("Standard Access")}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> <span class="text-muted-foreground">Last Login: ${escape_html(new Date(adminWalletInfo.lastLogin).toLocaleTimeString())}</span></div> <div class="text-muted-foreground">Network: Polygon</div></div></div> <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"><div class="text-center p-4 surface-2 rounded-lg">`);
								Coins($$renderer, { class: "h-6 w-6 text-accent mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(parseFloat(tokenomicsMetrics.stcPrice).toFixed(4))}</div> <div class="text-xs text-muted-foreground">STC Price (USD)</div></div> <div class="text-center p-4 surface-2 rounded-lg">`);
								Trending_up($$renderer, { class: "h-6 w-6 text-primary mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">$${escape_html(formatNumber(tokenomicsMetrics.marketCap))}</div> <div class="text-xs text-muted-foreground">Market Cap</div></div> <div class="text-center p-4 surface-2 rounded-lg">`);
								Activity($$renderer, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(formatNumber(parseFloat(tokenomicsMetrics.totalStaked)))}</div> <div class="text-xs text-muted-foreground">Total Staked</div></div> <div class="text-center p-4 surface-2 rounded-lg">`);
								Crown($$renderer, { class: "h-6 w-6 text-green-500 mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(tokenomicsMetrics.nftHolders.toLocaleString())}</div> <div class="text-xs text-muted-foreground">NFT Holders</div></div> <div class="text-center p-4 surface-2 rounded-lg">`);
								Dollar_sign($$renderer, { class: "h-6 w-6 text-yellow-500 mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(tokenomicsMetrics.stakingAPY)}%</div> <div class="text-xs text-muted-foreground">Staking APY</div></div> <div class="text-center p-4 surface-2 rounded-lg">`);
								Users($$renderer, { class: "h-6 w-6 text-purple-500 mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">$${escape_html(formatNumber(tokenomicsMetrics.subscriptionRevenue))}</div> <div class="text-xs text-muted-foreground">Sub Revenue</div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="space-y-4"><h3 class="text-lg font-semibold flex items-center">`);
								Activity($$renderer, { class: "h-5 w-5 mr-2 text-primary" });
								$$renderer.push(`<!----> Token Distribution</h3> <div class="space-y-3"><!--[-->`);
								const each_array_2 = ensure_array_like(tokenDistribution);
								for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
									let dist = each_array_2[$$index_2];
									$$renderer.push(`<div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div${attr_class(`w-3 h-3 rounded-full ${stringify(dist.color)}`)}></div> <span class="text-sm">${escape_html(dist.category)}</span></div> <div class="text-right"><div class="text-sm font-medium">${escape_html(formatNumber(parseFloat(dist.amount)))}</div> <div class="text-xs text-muted-foreground">${escape_html(dist.percentage)}%</div></div></div> <div class="w-full bg-muted rounded-full h-2"><div${attr_class(`h-2 rounded-full ${stringify(dist.color)}`)}${attr_style(`width: ${stringify(dist.percentage)}%`)}></div></div>`);
								}
								$$renderer.push(`<!--]--></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold flex items-center">`);
								Crown($$renderer, { class: "h-5 w-5 mr-2 text-accent" });
								$$renderer.push(`<!----> Staking Tiers</h3> <div class="space-y-3"><!--[-->`);
								const each_array_3 = ensure_array_like(stakingTiers);
								for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
									let tier = each_array_3[$$index_3];
									$$renderer.push(`<div class="p-3 surface-1 rounded-lg"><div class="flex items-center justify-between mb-2"><span class="font-medium">${escape_html(tier.tier)}</span> `);
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
			$$renderer.push(`<div class="text-center py-12"><div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div> <p class="text-foreground/80">Loading analytics data...</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div class="surface-1 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-foreground">${escape_html(formatNumber(platformMetrics.totalUsers))}</div> <div class="text-foreground/80 text-sm">Total Users</div> <div class="text-green-400 text-xs mt-1">+${escape_html(platformMetrics.newUsersToday)} today</div></div> <div class="text-blue-400 text-3xl">👥</div></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-foreground">${escape_html(platformMetrics.activeCreators)}</div> <div class="text-foreground/80 text-sm">Active Creators</div> <div class="text-purple-400 text-xs mt-1">${escape_html(formatNumber(platformMetrics.totalContent))} content items</div></div> <div class="text-purple-400 text-3xl">🎬</div></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-foreground">${escape_html(formatNumber(platformMetrics.totalViews))}</div> <div class="text-foreground/80 text-sm">Total Views</div> <div class="text-green-400 text-xs mt-1">+${escape_html(formatNumber(platformMetrics.viewsToday))} today</div></div> <div class="text-green-400 text-3xl">👁️</div></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><div><div class="text-2xl font-bold text-foreground">${escape_html(formatCurrency(platformMetrics.totalRevenue))}</div> <div class="text-foreground/80 text-sm">Total Revenue</div> <div class="text-yellow-400 text-xs mt-1">${escape_html(platformMetrics.contentPublishedToday)} published today</div></div> <div class="text-yellow-400 text-3xl">💰</div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="surface-1 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-4">Content by Category (${escape_html("Views")})</h2> <div class="space-y-4"><!--[-->`);
			const each_array_4 = ensure_array_like(contentAnalytics);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let category = each_array_4[$$index_4];
				$$renderer.push(`<div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div${attr_class(`w-3 h-3 rounded-full ${stringify(getCategoryColor(category.category))}`)}></div> <span class="text-foreground">${escape_html(category.category)}</span></div> <div class="text-right"><div class="text-foreground font-medium">${escape_html(category.count)} items</div> <div class="text-muted-foreground text-sm">`);
				$$renderer.push("<!--[0-->");
				$$renderer.push(`${escape_html(formatNumber(category.views))} views`);
				$$renderer.push(`<!--]--></div></div></div> <div class="w-full bg-gray-700 rounded-full h-2"><div${attr_class(`h-2 rounded-full ${stringify(getCategoryColor(category.category))}`)}${attr_style(`width: ${stringify((() => {
					let value, maxValue;
					value = category.views;
					maxValue = Math.max(...contentAnalytics.map((c) => c.views));
					return maxValue > 0 ? value / maxValue * 100 : 0;
				})())}%`)}></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-4">Users by Country</h2> <div class="space-y-3"><!--[-->`);
			const each_array_5 = ensure_array_like(geographicData.slice(0, 6));
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let country = each_array_5[$$index_5];
				$$renderer.push(`<div class="flex items-center justify-between"><span class="text-foreground">${escape_html(country.country)}</span> <div class="flex items-center space-x-3"><div class="w-24 bg-gray-700 rounded-full h-2"><div class="h-2 bg-red-500 rounded-full"${attr_style(`width: ${stringify(country.percentage)}%`)}></div></div> <span class="text-foreground/80 text-sm w-12 text-right">${escape_html(country.percentage)}%</span></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-4">Revenue &amp; Payouts Trend</h2> <div class="grid grid-cols-4 md:grid-cols-8 gap-4 items-end h-64"><!--[-->`);
			const each_array_6 = ensure_array_like(revenueData);
			for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
				let data = each_array_6[$$index_6];
				$$renderer.push(`<div class="flex flex-col items-center space-y-2"><div class="flex flex-col items-center space-y-1 flex-1 justify-end"><div class="bg-green-500 rounded-t w-8"${attr_style(`height: ${stringify(data.revenue / Math.max(...revenueData.map((d) => d.revenue)) * 180)}px`)}${attr("title", `Revenue: ${stringify(formatCurrency(data.revenue))}`)}></div> <div class="bg-blue-500 rounded-b w-8"${attr_style(`height: ${stringify(data.payouts / Math.max(...revenueData.map((d) => d.payouts)) * 120)}px`)}${attr("title", `Payouts: ${stringify(formatCurrency(data.payouts))}`)}></div></div> <span class="text-foreground/80 text-xs">${escape_html(data.month)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex items-center justify-center space-x-6 mt-4"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-green-500 rounded"></div> <span class="text-foreground/80 text-sm">Revenue</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-blue-500 rounded"></div> <span class="text-foreground/80 text-sm">Payouts</span></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="surface-1 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-4">Top Creators</h2> <div class="space-y-4"><!--[-->`);
			const each_array_7 = ensure_array_like(topCreators);
			for (let index = 0, $$length = each_array_7.length; index < $$length; index++) {
				let creator = each_array_7[index];
				$$renderer.push(`<div class="flex items-center space-x-4"><div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(index + 1)}</div> <div class="flex-1"><div class="text-foreground font-medium">${escape_html(creator.name)}</div> <div class="text-muted-foreground text-sm">${escape_html(creator.ministry)}</div></div> <div class="text-right"><div class="text-foreground font-medium">${escape_html(formatNumber(creator.views))} views</div> <div class="text-muted-foreground text-sm">${escape_html(creator.content)} content • ${escape_html(formatCurrency(creator.revenue))}</div></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-4">Top Content</h2> <div class="space-y-4"><!--[-->`);
			const each_array_8 = ensure_array_like(topContent);
			for (let index = 0, $$length = each_array_8.length; index < $$length; index++) {
				let content = each_array_8[index];
				$$renderer.push(`<div class="flex items-center space-x-4"><div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(index + 1)}</div> <div class="flex-1"><div class="text-foreground font-medium">${escape_html(content.title)}</div> <div class="text-muted-foreground text-sm">${escape_html(content.creator)} • ${escape_html(content.category)}</div></div> <div class="text-right"><div class="text-foreground font-medium">${escape_html(formatNumber(content.views))} views</div> <div class="text-muted-foreground text-sm">${escape_html(formatPercentage(content.engagement))} engagement</div></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-4">User Growth Trend</h2> <div class="grid grid-cols-6 gap-4 items-end h-48"><!--[-->`);
			const each_array_9 = ensure_array_like(userGrowthData);
			for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
				let data = each_array_9[$$index_9];
				$$renderer.push(`<div class="flex flex-col items-center space-y-2"><div class="flex flex-col items-center space-y-1 flex-1 justify-end"><div class="bg-blue-500 rounded-t w-12"${attr_style(`height: ${stringify(data.users / Math.max(...userGrowthData.map((d) => d.users)) * 120)}px`)}${attr("title", `Users: ${stringify(data.users.toLocaleString())}`)}></div> <div class="bg-purple-500 rounded-b w-12"${attr_style(`height: ${stringify(data.creators / Math.max(...userGrowthData.map((d) => d.creators)) * 80)}px`)}${attr("title", `Creators: ${stringify(data.creators)}`)}></div></div> <span class="text-foreground/80 text-xs">${escape_html(new Date(data.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric"
				}))}</span></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex items-center justify-center space-x-6 mt-4"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-blue-500 rounded"></div> <span class="text-foreground/80 text-sm">Users</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-purple-500 rounded"></div> <span class="text-foreground/80 text-sm">Creators</span></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D7ac_PtG.js.map
