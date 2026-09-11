import { am as store_get, q as escape_html, i as attr, x as attr_class, an as unsubscribe_stores } from './index.js-BP8aAXBX.js';
import { A as Activity } from './activity-DIO6mqKB.js';
import { P as PortalKpi } from './PortalKpi-DWNdHKY5.js';
import { C as Calendar } from './calendar-ClZxYROM.js';
import { C as Coins } from './coins-BlQRgSco.js';
import { C as Credit_card } from './credit-card-Dl5S6a8n.js';
import { C as Crown } from './crown-ma3Zd5B7.js';
import { D as Dollar_sign } from './dollar-sign-DtetC1ya.js';
import { R as Refresh_cw } from './refresh-cw-DheZzbPw.js';
import { S as Settings } from './settings-BOw-ku0u.js';
import { T as Trending_up } from './trending-up-C8sG-6Eo.js';
import { W as Wallet } from './wallet-Bahp6I3V.js';
import { I as Input } from './input-EQDlPT2V.js';
import { B as Button } from './button--do5FSjb.js';
import { B as Badge } from './badge-CZM4Npzh.js';
import { P as PortalHero } from './PortalHero-B80SkUjg.js';
import { C as Card, a as Card_header, d as Card_content, c as Card_title } from './card-BAW-4xbt.js';
import { i as isConnected } from './wallet2-CJELNKCp.js';
import { L as Label } from './label-C1iXsXqG.js';
import './config-CcRcDXhz.js';
import { W as WalletConnect } from './WalletConnect-Cama0ivj.js';
import './Icon-DOH8dWtn.js';
import './utils2-CqskQpUP.js';
import './index-D1eQaiDA.js';
import './stringify-cjaXfEgK.js';
import 'node:crypto';
import './http-D5cER_a5.js';
import './polygonAmoy-PO2ITH37.js';
import './check-check-DmlThrSa.js';
import './external-link-l5pl3dzR.js';
import './zap-X10ohogX.js';

//#region src/routes/(creator)/creator/earnings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let earningsData = {
			monthCents: 0,
			yearCents: 0,
			lifetimeCents: 0,
			revenueShare: 30};
		let series = { earnings: [] };
		let earningsDelta = 0;
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
		let payoutMethod = {
			requirementsPastDue: [],
			onboarding: false,
			saving: false
		};
		async function startStripeOnboarding() {
			payoutMethod.onboarding = true;
			try {
				const res = await fetch("/api/creator/payouts/stripe/onboard", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({})
				});
				const data = await res.json();
				if (!res.ok || !data.url) throw new Error(data.error ?? "Onboarding failed");
				window.location.href = data.url;
			} catch (err) {
				console.error(err);
				alert(err instanceof Error ? err.message : "Stripe onboarding failed");
			} finally {
				payoutMethod.onboarding = false;
			}
		}
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
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-8 max-w-7xl">`);
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Revenue",
				title: "Earnings",
				subtitle: `Track your revenue, STC tokens, and payment preferences. Tier: ${"Standard"} (${earningsData.revenueShare}% share).`,
				icon: Wallet
			});
			$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`);
			PortalKpi($$renderer, {
				label: "This Month",
				value: `$${(earningsData.monthCents / 100).toFixed(2)}`,
				icon: Dollar_sign,
				delta: earningsDelta,
				deltaLabel: "vs last month",
				sparkline: series.earnings
			});
			$$renderer.push(`<!----> `);
			PortalKpi($$renderer, {
				label: "This Year",
				value: `$${(earningsData.yearCents / 100).toLocaleString(void 0, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}`,
				icon: Calendar,
				deltaLabel: "12 months"
			});
			$$renderer.push(`<!----> `);
			PortalKpi($$renderer, {
				label: "Total Earned",
				value: `$${(earningsData.lifetimeCents / 100).toLocaleString(void 0, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}`,
				icon: Trending_up,
				deltaLabel: "lifetime"
			});
			$$renderer.push(`<!----> `);
			if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
				$$renderer.push("<!--[0-->");
				PortalKpi($$renderer, {
					label: "STC Value",
					value: `$${tokenomicsData.stcValue.toFixed(2)}`,
					icon: Coins,
					deltaLabel: `${parseFloat(tokenomicsData.totalStcEarned).toLocaleString()} STC`
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
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
					Card_content($$renderer, {
						class: "py-4 flex items-center justify-between",
						children: ($$renderer) => {
							$$renderer.push(`<div><div class="text-sm font-medium">Tax forms</div> <div class="text-xs text-muted-foreground">Submit W-9 / W-8BEN before annual 1099 generation.</div></div> `);
							Button($$renderer, {
								href: "/creator/earnings/tax-forms",
								variant: "outline",
								size: "sm",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Manage forms`);
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
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "flex items-center gap-2",
								children: ($$renderer) => {
									Credit_card($$renderer, { class: "h-5 w-5" });
									$$renderer.push(`<!----> <span>Setup payouts</span>`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "space-y-4",
						children: ($$renderer) => {
							$$renderer.push(`<p class="text-sm text-muted-foreground">Choose how the platform pays you. Paystack is best for NGN / African
        creators (instant local-bank settlement). Stripe Connect Express
        works for USD / global creators (bank or debit card, 30+ countries).</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><button type="button"${attr("disabled", payoutMethod.saving, true)}${attr_class(`text-left rounded-xl border p-4 transition-colors ${"border-orange-500 bg-orange-500/10" }`)}><div class="flex items-center justify-between"><div class="font-medium">Paystack</div> `);
							{
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									variant: "outline",
									children: ($$renderer) => {
										$$renderer.push(`<!---->Selected`);
									},
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!--]--></div> <div class="text-xs text-muted-foreground mt-1">NGN, KES, ZAR, GHS · local bank settlement</div></button> <button type="button"${attr("disabled", true, true)}${attr_class(`text-left rounded-xl border p-4 transition-colors ${"border-border/40 hover:surface-1"} ${"opacity-60 cursor-not-allowed" }`)}><div class="flex items-center justify-between"><div class="font-medium">Stripe Connect</div> `);
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="text-xs text-muted-foreground mt-1">USD, EUR, GBP and more · global bank settlement</div></button></div> `);
							{
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4 space-y-3"><div class="text-sm"><strong>Stripe Connect onboarding</strong> — connect a bank account or
            debit card to receive USD payouts. Stripe handles ID verification
            and tax forms.</div> `);
								if (payoutMethod.requirementsPastDue.length > 0) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div class="text-xs text-red-300">Past-due requirements: ${escape_html(payoutMethod.requirementsPastDue.join(", "))}</div>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> `);
								Button($$renderer, {
									onclick: startStripeOnboarding,
									disabled: payoutMethod.onboarding,
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(payoutMethod.onboarding ? "Redirecting…" : "Setup with Stripe")}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----></div>`);
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
								class: "flex items-center gap-2",
								children: ($$renderer) => {
									Dollar_sign($$renderer, { class: "h-5 w-5" });
									$$renderer.push(`<!----> <span>Earnings by content</span>`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="text-sm text-muted-foreground py-6 text-center">Loading…</p>`);
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
//# sourceMappingURL=_page.svelte-D8pw8Dpt.js.map
