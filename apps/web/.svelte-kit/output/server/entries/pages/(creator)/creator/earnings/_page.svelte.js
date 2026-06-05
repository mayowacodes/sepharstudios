import { Lt as attr, Ot as store_get, jt as unsubscribe_stores, vt as attr_class, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Activity } from "../../../../../chunks/activity.js";
import { t as KpiCard } from "../../../../../chunks/KpiCard.js";
import { t as Calendar } from "../../../../../chunks/calendar.js";
import { t as WalletConnect } from "../../../../../chunks/WalletConnect.js";
import { t as Coins } from "../../../../../chunks/coins.js";
import { t as Credit_card } from "../../../../../chunks/credit-card.js";
import { t as Crown } from "../../../../../chunks/crown.js";
import { t as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { t as Refresh_cw } from "../../../../../chunks/refresh-cw.js";
import { t as Settings } from "../../../../../chunks/settings.js";
import { t as Trending_up } from "../../../../../chunks/trending-up.js";
import { t as Wallet } from "../../../../../chunks/wallet.js";
import { t as Input } from "../../../../../chunks/input.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../../chunks/card.js";
import { a as isConnected } from "../../../../../chunks/wallet2.js";
import { t as Label } from "../../../../../chunks/label.js";
import "../../../../../chunks/contracts2.js";
//#region src/routes/(creator)/creator/earnings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let earningsData = {
			monthCents: 0,
			yearCents: 0,
			lifetimeCents: 0,
			revenueShare: 30,
			tier: "standard",
			contentCount: 0,
			totalViews: 0,
			completedWatches: 0
		};
		let series = { earnings: [] };
		let earningsDelta = 0;
		let loadingEarnings = true;
		let tokenomicsData = {
			stcBalance: "0",
			usdcBalance: "0",
			stcPrice: "0",
			stakingDiscount: 0,
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
			processor: "paystack",
			stripeStatus: null,
			stripePayoutsEnabled: false,
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
			$$renderer.push(`<div class="space-y-8">`);
			PageHeader($$renderer, {
				icon: Wallet,
				title: "Earnings",
				subtitle: `Track your revenue, STC tokens, and payment preferences. Tier: ${earningsData.tier === "top_performer" ? "Top Performer" : earningsData.tier === "exclusive" ? "Exclusive Partner" : "Standard"} (${earningsData.revenueShare}% share).`
			});
			$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`);
			KpiCard($$renderer, {
				label: "This Month",
				value: `$${(earningsData.monthCents / 100).toFixed(2)}`,
				icon: Dollar_sign,
				accent: "green",
				delta: earningsDelta,
				deltaLabel: "vs last month",
				sparkline: series.earnings,
				loading: loadingEarnings,
				index: 0
			});
			$$renderer.push(`<!----> `);
			KpiCard($$renderer, {
				label: "This Year",
				value: `$${(earningsData.yearCents / 100).toLocaleString(void 0, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}`,
				icon: Calendar,
				accent: "blue",
				deltaLabel: "12 months",
				loading: loadingEarnings,
				index: 1
			});
			$$renderer.push(`<!----> `);
			KpiCard($$renderer, {
				label: "Total Earned",
				value: `$${(earningsData.lifetimeCents / 100).toLocaleString(void 0, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}`,
				icon: Trending_up,
				accent: "purple",
				deltaLabel: "lifetime",
				loading: loadingEarnings,
				index: 2
			});
			$$renderer.push(`<!----> `);
			if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
				$$renderer.push("<!--[0-->");
				KpiCard($$renderer, {
					label: "STC Value",
					value: `$${tokenomicsData.stcValue.toFixed(2)}`,
					icon: Coins,
					accent: "orange",
					deltaLabel: `${parseFloat(tokenomicsData.totalStcEarned).toLocaleString()} STC`,
					loading: loadingEarnings,
					index: 3
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
								WalletConnect($$renderer, {});
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
								if (tokenomicsData.stakingDiscount > 0) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"><div class="flex items-center space-x-2">`);
									Crown($$renderer, { class: "h-5 w-5 text-green-500" });
									$$renderer.push(`<!----> <span class="font-medium">Staking Benefits Active</span></div> <p class="text-sm text-muted-foreground mt-1">You're earning ${escape_html(tokenomicsData.stakingDiscount)}% bonus on subscription discounts from your STC staking.</p></div>`);
								} else $$renderer.push("<!--[-1-->");
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
        works for USD / global creators (bank or debit card, 30+ countries).</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><button type="button"${attr("disabled", payoutMethod.saving, true)}${attr_class(`text-left rounded-xl border p-4 transition-colors ${payoutMethod.processor === "paystack" ? "border-orange-500 bg-orange-500/10" : "border-border/40 hover:surface-1"}`)}><div class="flex items-center justify-between"><div class="font-medium">Paystack</div> `);
							if (payoutMethod.processor === "paystack") {
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									variant: "outline",
									children: ($$renderer) => {
										$$renderer.push(`<!---->Selected`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="text-xs text-muted-foreground mt-1">NGN, KES, ZAR, GHS · local bank settlement</div></button> <button type="button"${attr("disabled", payoutMethod.saving || !payoutMethod.stripePayoutsEnabled, true)}${attr_class(`text-left rounded-xl border p-4 transition-colors ${payoutMethod.processor === "stripe" ? "border-purple-500 bg-purple-500/10" : "border-border/40 hover:surface-1"} ${!payoutMethod.stripePayoutsEnabled ? "opacity-60 cursor-not-allowed" : ""}`)}><div class="flex items-center justify-between"><div class="font-medium">Stripe Connect</div> `);
							if (payoutMethod.processor === "stripe") {
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									variant: "outline",
									children: ($$renderer) => {
										$$renderer.push(`<!---->Selected`);
									},
									$$slots: { default: true }
								});
							} else if (payoutMethod.stripeStatus === "verified") {
								$$renderer.push("<!--[1-->");
								Badge($$renderer, {
									variant: "outline",
									class: "text-green-300",
									children: ($$renderer) => {
										$$renderer.push(`<!---->Verified`);
									},
									$$slots: { default: true }
								});
							} else if (payoutMethod.stripeStatus) {
								$$renderer.push("<!--[2-->");
								Badge($$renderer, {
									variant: "outline",
									class: "text-yellow-300",
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(payoutMethod.stripeStatus)}`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="text-xs text-muted-foreground mt-1">USD, EUR, GBP and more · global bank settlement</div></button></div> `);
							if (payoutMethod.stripeStatus !== "verified") {
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
										$$renderer.push(`<!---->${escape_html(payoutMethod.onboarding ? "Redirecting…" : payoutMethod.stripeStatus ? "Continue Stripe setup" : "Setup with Stripe")}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----></div>`);
							} else $$renderer.push("<!--[-1-->");
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
//#endregion
export { _page as default };
