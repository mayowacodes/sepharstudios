import { an as escape_html, aK as stringify, aI as store_get, aO as unsubscribe_stores } from './ui-libs-TtGtWAGI.js';
import { A as Activity } from './activity-D0q86z9F.js';
import { C as Calendar } from './calendar-CxjjBQYu.js';
import { W as WalletConnect } from './WalletConnect-DI9hjdh2.js';
import { C as Coins } from './coins-B3BwYJFB.js';
import { C as Crown } from './crown-BWSJY-VY.js';
import { D as Dollar_sign } from './dollar-sign-C9OpUDWI.js';
import { R as Refresh_cw } from './refresh-cw-DfpKCrMs.js';
import { S as Settings } from './settings-Hcbiy6MZ.js';
import { T as Trending_up } from './trending-up-ByWzB44I.js';
import { W as Wallet } from './wallet-hvKePUx2.js';
import { B as Button } from './button-D9M18H3C.js';
import { I as Input } from './input-BHWqom2S.js';
import { B as Badge } from './badge-HJ6WNmX7.js';
import { C as Card, c as Card_header, a as Card_content, d as Card_title } from './card-DdzYeJGJ.js';
import { i as isConnected } from './wallet2-CUQK2HjM.js';
import { L as Label } from './label-BV40bMri.js';
import './config-BPBzrUzB.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CGEdwVFL.js';
import './external-link-B4ZY0tn6.js';
import './zap-C4H7G9BI.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';
import './polygon-D78JtxJX.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';

//#region src/routes/(creator)/creator/earnings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let earningsData = {
			monthCents: 0,
			yearCents: 0,
			lifetimeCents: 0,
			revenueShare: 30,
			tier: "standard"};
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
				const res = await fetch("/api/creator/payment-preferences", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						preference: paymentSettings.preference,
						fiatPct: paymentSettings.fiatPercentage,
						usdcPct: paymentSettings.usdcPercentage,
						stcPct: paymentSettings.stcPercentage
					})
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error ?? "Failed to update preferences");
				paymentSettings.updateResult = "Payment preferences updated successfully";
			} catch (error) {
				paymentSettings.updateResult = `Error: ${error.message}`;
			} finally {
				paymentSettings.isUpdating = false;
			}
		}
		function getTierColor(tier) {
			switch (tier) {
				case "top_performer": return "bg-primary text-primary-foreground";
				case "exclusive": return "bg-secondary text-secondary-foreground";
				default: return "bg-muted text-muted-foreground";
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="space-y-8"><div class="text-center"><h1 class="text-4xl font-bold text-white mb-2">Creator Earnings Dashboard</h1> <p class="text-xl text-gray-300">Track your revenue, STC tokens, and payment preferences</p></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-6">`);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-muted-foreground flex items-center",
								children: ($$renderer) => {
									Dollar_sign($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> This Month`);
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
							$$renderer.push(`<div class="text-2xl font-bold text-white">$${escape_html((earningsData.monthCents / 100).toFixed(2))}</div> `);
							Badge($$renderer, {
								class: "text-xs mt-1",
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(earningsData.revenueShare)}% share`);
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
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-muted-foreground flex items-center",
								children: ($$renderer) => {
									Calendar($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> This Year`);
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
							$$renderer.push(`<div class="text-2xl font-bold text-white">$${escape_html((earningsData.yearCents / 100).toLocaleString(void 0, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}))}</div> `);
							Badge($$renderer, {
								class: "text-xs mt-1",
								variant: "outline",
								children: ($$renderer) => {
									$$renderer.push(`<!---->12 months`);
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
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-muted-foreground flex items-center",
								children: ($$renderer) => {
									Trending_up($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> Total Earned`);
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
							$$renderer.push(`<div class="text-2xl font-bold text-white">$${escape_html((earningsData.lifetimeCents / 100).toLocaleString(void 0, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}))}</div> `);
							Badge($$renderer, {
								class: `text-xs mt-1 ${stringify(getTierColor(earningsData.tier))}`,
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html("Standard Creator")}`);
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
				children: ($$renderer) => {
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "text-sm font-medium text-muted-foreground flex items-center",
								children: ($$renderer) => {
									Coins($$renderer, { class: "h-4 w-4 mr-2" });
									$$renderer.push(`<!----> STC Value`);
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
							$$renderer.push(`<div class="text-2xl font-bold text-white">$${escape_html(tokenomicsData.stcValue.toFixed(2))}</div> `);
							Badge($$renderer, {
								class: "text-xs mt-1",
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(parseFloat(tokenomicsData.totalStcEarned).toLocaleString())} STC`);
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
				class: "bg-linear-to-r from-primary/10 to-secondary/10",
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "flex items-center space-x-2",
								children: ($$renderer) => {
									Coins($$renderer, { class: "h-6 w-6" });
									$$renderer.push(`<!----> <span>Web3 Tokenomics</span>`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="text-center py-8">`);
								Wallet($$renderer, { class: "h-12 w-12 text-muted-foreground mx-auto mb-4" });
								$$renderer.push(`<!----> <h3 class="text-lg font-medium mb-2">Connect Your Wallet</h3> <p class="text-muted-foreground mb-4">Connect your wallet to access STC tokens and Web3 earning features.</p> `);
								WalletConnect($$renderer);
								$$renderer.push(`<!----></div>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="space-y-6"><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div class="text-center p-4 bg-primary/10 rounded-lg">`);
								Coins($$renderer, { class: "h-6 w-6 text-primary mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(parseFloat(tokenomicsData.stcBalance).toLocaleString())}</div> <div class="text-xs text-muted-foreground">STC Balance</div></div> <div class="text-center p-4 bg-secondary/10 rounded-lg">`);
								Dollar_sign($$renderer, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">$${escape_html(parseFloat(tokenomicsData.usdcBalance).toLocaleString())}</div> <div class="text-xs text-muted-foreground">USDC Balance</div></div> <div class="text-center p-4 bg-accent/10 rounded-lg">`);
								Activity($$renderer, { class: "h-6 w-6 text-accent mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">${escape_html(parseFloat(tokenomicsData.totalStcEarned).toLocaleString())}</div> <div class="text-xs text-muted-foreground">STC Earned</div></div> <div class="text-center p-4 bg-green-500/10 rounded-lg">`);
								Trending_up($$renderer, { class: "h-6 w-6 text-green-500 mx-auto mb-2" });
								$$renderer.push(`<!----> <div class="text-lg font-bold">$${escape_html(tokenomicsData.stcPrice.slice(0, 8))}</div> <div class="text-xs text-muted-foreground">STC Price</div></div></div> `);
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--></div>`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "flex items-center space-x-2",
								children: ($$renderer) => {
									Settings($$renderer, { class: "h-6 w-6" });
									$$renderer.push(`<!----> <span>Payment Preferences</span>`);
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
							$$renderer.push(`<div>`);
							Label($$renderer, {
								class: "text-sm font-medium mb-3 block",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Payment Distribution`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div>`);
							Label($$renderer, {
								class: "text-xs text-muted-foreground",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Fiat (Bank Transfer)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <div class="flex items-center space-x-2">`);
							Input($$renderer, {
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
							$$renderer.push(`<!----> <span class="text-sm">%</span></div></div> <div>`);
							Label($$renderer, {
								class: "text-xs text-muted-foreground",
								children: ($$renderer) => {
									$$renderer.push(`<!---->USDC (Crypto)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <div class="flex items-center space-x-2">`);
							Input($$renderer, {
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
							$$renderer.push(`<!----> <span class="text-sm">%</span></div></div> <div>`);
							Label($$renderer, {
								class: "text-xs text-muted-foreground",
								children: ($$renderer) => {
									$$renderer.push(`<!---->STC Tokens`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <div class="flex items-center space-x-2">`);
							Input($$renderer, {
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
							$$renderer.push(`<!----> <span class="text-sm">%</span></div></div></div> <div class="mt-3 text-sm text-muted-foreground">Total: ${escape_html(paymentSettings.fiatPercentage + paymentSettings.usdcPercentage + paymentSettings.stcPercentage)}%</div> <div class="mt-4 flex space-x-3">`);
							Button($$renderer, {
								onclick: updatePaymentPreferences,
								disabled: paymentSettings.isUpdating,
								size: "sm",
								children: ($$renderer) => {
									if (paymentSettings.isUpdating) {
										$$renderer.push("<!--[0-->");
										Refresh_cw($$renderer, { class: "mr-2 h-4 w-4 animate-spin" });
										$$renderer.push(`<!----> Updating...`);
									} else {
										$$renderer.push("<!--[-1-->");
										Settings($$renderer, { class: "mr-2 h-4 w-4" });
										$$renderer.push(`<!----> Update Preferences`);
									}
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div> `);
							if (paymentSettings.updateResult) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="mt-3 p-3 bg-muted rounded-lg"><p class="text-sm">${escape_html(paymentSettings.updateResult)}</p></div>`);
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
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Recent Payments`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<div class="space-y-4">`);
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="text-sm text-muted-foreground py-6 text-center">Loading payment history…</p>`);
							$$renderer.push(`<!--]--></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
			Button($$renderer, {
				href: "/creator/analytics",
				class: "h-16",
				variant: "outline",
				children: ($$renderer) => {
					$$renderer.push(`<div class="text-center">`);
					Trending_up($$renderer, { class: "h-6 w-6 mx-auto mb-1" });
					$$renderer.push(`<!----> <div class="text-sm font-medium">Revenue Analytics</div></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				href: "/tokens",
				class: "h-16 bg-secondary hover:bg-secondary/90",
				children: ($$renderer) => {
					$$renderer.push(`<div class="text-center">`);
					Coins($$renderer, { class: "h-6 w-6 mx-auto mb-1" });
					$$renderer.push(`<!----> <div class="text-sm font-medium">Manage STC Tokens</div></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				href: "/creator",
				class: "h-16",
				variant: "outline",
				children: ($$renderer) => {
					$$renderer.push(`<div class="text-center">`);
					Crown($$renderer, { class: "h-6 w-6 mx-auto mb-1" });
					$$renderer.push(`<!----> <div class="text-sm font-medium">Creator Dashboard</div></div>`);
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
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B5TtGdD2.js.map
