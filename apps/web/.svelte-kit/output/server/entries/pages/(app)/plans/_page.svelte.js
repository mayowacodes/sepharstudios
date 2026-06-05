import { At as stringify, Ot as store_get, Tt as head, jt as unsubscribe_stores, wt as ensure_array_like, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { t as WalletConnect } from "../../../../chunks/WalletConnect.js";
import { t as Check } from "../../../../chunks/check.js";
import { t as Coins } from "../../../../chunks/coins.js";
import { t as Crown } from "../../../../chunks/crown.js";
import { t as Gift } from "../../../../chunks/gift.js";
import { t as Star } from "../../../../chunks/star.js";
import { t as Wallet } from "../../../../chunks/wallet.js";
import { t as Zap } from "../../../../chunks/zap.js";
import { t as Button } from "../../../../chunks/button.js";
import { t as Badge } from "../../../../chunks/badge.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../chunks/card.js";
import { a as isConnected } from "../../../../chunks/wallet2.js";
import "../../../../chunks/contracts2.js";
//#region src/routes/(app)/plans/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		/** Displayed price (after any discount) */
		/** Pre-discount price; only set when a staking discount is applied */
		/** Billing cadence label, e.g. "/month" or "every 2 months" */
		/** Number of profile accounts allowed on this tier */
		/** Whether this tier exposes kids-mode profiles */
		/** Whether ads are shown on this tier */
		let plans = [
			{
				id: "freemium",
				name: "Freemium",
				price: 1,
				cadence: "every 2 months",
				maxProfiles: 1,
				kidsAllowed: false,
				hasAds: true,
				features: [
					"HD streaming with ads",
					"1 profile",
					"Access to standard library",
					"Cancel anytime"
				],
				nftBenefits: ["Earn STC by watching", "No staking discount on this tier"]
			},
			{
				id: "basic",
				name: "Basic",
				price: 4,
				cadence: "/month",
				maxProfiles: 2,
				kidsAllowed: false,
				hasAds: false,
				features: [
					"HD streaming — ad-free",
					"2 profiles",
					"Download on 1 device",
					"Cancel anytime"
				],
				nftBenefits: [
					"Subscription NFT on Polygon",
					"Earn 5 STC/day watching",
					"Stake STC for up to 10% off"
				]
			},
			{
				id: "premium",
				name: "Premium (Family)",
				price: 10,
				cadence: "/month",
				maxProfiles: 8,
				kidsAllowed: true,
				hasAds: false,
				features: [
					"4K Ultra HD streaming",
					"8 profiles (kids profile included)",
					"Full content library",
					"Downloads on 2 devices",
					"Offline viewing",
					"Cancel anytime"
				],
				nftBenefits: [
					"Enhanced NFT benefits",
					"Earn 5 STC/day watching",
					"Stake STC for up to 50% off",
					"Early access to new content"
				],
				isPopular: true
			},
			{
				id: "creator",
				name: "Creator",
				price: 10,
				cadence: "/month",
				maxProfiles: 2,
				kidsAllowed: false,
				hasAds: false,
				features: [
					"Everything in Basic",
					"Upload & publish content",
					"Revenue share dashboard",
					"Creator analytics",
					"Priority support"
				],
				nftBenefits: [
					"Creator NFT badge",
					"30% revenue share on your content",
					"Governance voting rights",
					"Exclusive creator community"
				]
			}
		];
		let userDiscount = 0;
		let stakingAmount = "0";
		let showWalletModal = false;
		function getPlanIcon(planId) {
			switch (planId) {
				case "creator": return Crown;
				case "premium": return Star;
				case "freemium": return Zap;
				default: return Coins;
			}
		}
		head("19dwmhu", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Plans &amp; Pricing · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Choose your Sephar Studios plan: freemium with ads, basic ad-free, premium family (8 profiles + kids mode), or creator. STC stakers get up to 50% off."/>`);
		});
		$$renderer.push(`<div class="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl pt-32 pb-16"><div class="text-center space-y-4 mb-8"><h1 class="text-3xl font-bold gradient-text svelte-19dwmhu">Choose Your Plan</h1> <p class="text-muted-foreground max-w-2xl mx-auto">Start with 3 months free on Basic, Premium or Creator. Freemium starts billing immediately at $1 every 2 months. `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></p> <div class="inline-flex items-center gap-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-full px-4 py-1.5 text-sm">`);
		Gift($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----> 3 months free on Basic, Premium &amp; Creator</div></div> `);
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-lg"><div class="grid md:grid-cols-2 gap-6 items-center"><div><h2 class="text-lg font-semibold mb-2 flex items-center">`);
			Wallet($$renderer, { class: "h-5 w-5 mr-2 text-primary" });
			$$renderer.push(`<!----> Connect Wallet for NFT Benefits</h2> <p class="text-sm text-muted-foreground mb-4">Connect your wallet to get your subscription as an NFT and unlock exclusive Web3 features.
            You can still subscribe without a wallet using traditional payments.</p> `);
			Button($$renderer, {
				variant: "outline",
				size: "sm",
				onclick: () => showWalletModal = true,
				children: ($$renderer) => {
					Wallet($$renderer, { class: "h-4 w-4 mr-2" });
					$$renderer.push(`<!----> Connect Wallet`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <div class="space-y-2 text-sm"><div class="flex items-center space-x-2">`);
			Crown($$renderer, { class: "h-4 w-4 text-primary" });
			$$renderer.push(`<!----> <span>Subscription NFT ownership</span></div> <div class="flex items-center space-x-2">`);
			Gift($$renderer, { class: "h-4 w-4 text-secondary" });
			$$renderer.push(`<!----> <span>Stake STC tokens for up to 50% off</span></div> <div class="flex items-center space-x-2">`);
			Zap($$renderer, { class: "h-4 w-4 text-accent" });
			$$renderer.push(`<!----> <span>Cross-platform verification</span></div></div></div></div>`);
		} else if (parseFloat(stakingAmount) > 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">`);
			Coins($$renderer, { class: "h-4 w-4 text-primary-foreground" });
			$$renderer.push(`<!----></div> <div><h4 class="font-medium">Staking Discount Active</h4> <p class="text-sm text-muted-foreground">${escape_html(parseFloat(stakingAmount).toLocaleString())} STC staked • ${escape_html(userDiscount)}% discount applied</p></div></div> `);
			Button($$renderer, {
				variant: "outline",
				size: "sm",
				href: "/tokens",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Manage Staking`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
		const each_array = ensure_array_like(plans);
		for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
			let plan = each_array[$$index_2];
			const PlanIcon = getPlanIcon(plan.id);
			Card($$renderer, {
				class: `relative ${plan.isPopular ? "border-primary/50 bg-primary/5" : ""}`,
				children: ($$renderer) => {
					if (plan.isPopular) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="absolute -top-2 left-1/2 -translate-x-1/2">`);
						Badge($$renderer, {
							class: "bg-primary text-primary-foreground",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Most Popular`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (plan.hasAds) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="absolute -top-2 right-3">`);
						Badge($$renderer, {
							variant: "secondary",
							class: "text-[10px]",
							children: ($$renderer) => {
								$$renderer.push(`<!---->With ads`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								class: "flex items-center space-x-2",
								children: ($$renderer) => {
									if (PlanIcon) {
										$$renderer.push("<!--[-->");
										PlanIcon($$renderer, { class: `h-5 w-5 text-${plan.isPopular ? "primary" : "muted-foreground"}` });
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` <span>${escape_html(plan.name)}</span>`);
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
							$$renderer.push(`<div class="space-y-2"><div class="flex items-baseline flex-wrap">`);
							if (plan.originalPrice && plan.originalPrice !== plan.price) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span class="text-lg line-through text-muted-foreground mr-2">$${escape_html(plan.originalPrice.toFixed(2))}</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> <span class="text-3xl font-bold">$${escape_html(plan.price.toFixed(2))}</span> <span class="text-muted-foreground ml-1">${escape_html(plan.cadence)}</span></div> `);
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="space-y-3"><h4 class="font-medium text-sm">Platform Features</h4> <ul class="space-y-2"><!--[-->`);
							const each_array_1 = ensure_array_like(plan.features);
							for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
								let feature = each_array_1[$$index];
								$$renderer.push(`<li class="flex items-center">`);
								Check($$renderer, { class: "h-4 w-4 text-primary mr-2 shrink-0" });
								$$renderer.push(`<!----> <span class="text-sm">${escape_html(feature)}</span></li>`);
							}
							$$renderer.push(`<!--]--></ul></div> <div class="space-y-3 pt-3 border-t border-border"><h4 class="font-medium text-sm flex items-center">`);
							Crown($$renderer, { class: "h-4 w-4 mr-1 text-secondary" });
							$$renderer.push(`<!----> NFT Ownership Benefits</h4> <ul class="space-y-2"><!--[-->`);
							const each_array_2 = ensure_array_like(plan.nftBenefits);
							for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
								let benefit = each_array_2[$$index_1];
								$$renderer.push(`<li class="flex items-center">`);
								Star($$renderer, { class: "h-3 w-3 text-secondary mr-2 shrink-0" });
								$$renderer.push(`<!----> <span class="text-xs text-muted-foreground">${escape_html(benefit)}</span></li>`);
							}
							$$renderer.push(`<!--]--></ul></div> `);
							Button($$renderer, {
								class: "w-full",
								variant: plan.isPopular ? "default" : "outline",
								href: `/checkout?plan=${stringify(plan.id)}`,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Start Free Trial`);
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
		}
		$$renderer.push(`<!--]--></div> <div class="mt-12 space-y-8"><div class="text-center space-y-4"><h2 class="text-2xl font-bold">How NFT Subscriptions Work</h2> <div class="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto"><div class="text-center space-y-2"><div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-sm font-bold">1</div> <h4 class="font-medium">Subscribe</h4> <p class="text-xs text-muted-foreground">Pay with fiat (credit card)</p></div> <div class="text-center space-y-2"><div class="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto text-sm font-bold">2</div> <h4 class="font-medium">NFT Minted</h4> <p class="text-xs text-muted-foreground">Subscription NFT sent to wallet</p></div> <div class="text-center space-y-2"><div class="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto text-sm font-bold">3</div> <h4 class="font-medium">Own &amp; Transfer</h4> <p class="text-xs text-muted-foreground">Share with family or friends</p></div> <div class="text-center space-y-2"><div class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto text-sm font-bold">4</div> <h4 class="font-medium">Enjoy Benefits</h4> <p class="text-xs text-muted-foreground">Exclusive perks &amp; rewards</p></div></div></div> <div><h2 class="text-xl font-bold mb-4 text-center">Staking Discounts</h2> <p class="text-sm text-muted-foreground text-center mb-6">Lock STC tokens to reduce your monthly price. Earn STC free by watching — no purchase needed.</p> <div class="overflow-hidden rounded-xl border border-border"><table class="w-full text-sm"><thead class="bg-muted/30"><tr><th class="text-left px-4 py-3 text-muted-foreground font-medium">Tier</th><th class="text-left px-4 py-3 text-muted-foreground font-medium">Discount</th><th class="text-left px-4 py-3 text-muted-foreground font-medium">How to reach</th><th class="text-left px-4 py-3 text-muted-foreground font-medium">Price on $10/mo</th></tr></thead><tbody class="divide-y divide-border"><tr><td class="px-4 py-3">Tier 1</td><td class="px-4 py-3 text-green-400">10% off</td><td class="px-4 py-3 text-muted-foreground">1,000+ STC locked 90d+</td><td class="px-4 py-3">$9</td></tr><tr><td class="px-4 py-3">Tier 2</td><td class="px-4 py-3 text-green-400">20% off</td><td class="px-4 py-3 text-muted-foreground">3,500+ STC or 1,000+ for 2yr</td><td class="px-4 py-3">$8</td></tr><tr><td class="px-4 py-3">Tier 3</td><td class="px-4 py-3 text-green-400">35% off</td><td class="px-4 py-3 text-muted-foreground">10,000+ STC or 3,500+ for 2yr</td><td class="px-4 py-3">$6.50</td></tr><tr><td class="px-4 py-3">Tier 4</td><td class="px-4 py-3 text-green-400">50% off</td><td class="px-4 py-3 text-muted-foreground">35,000+ STC or 10,000+ for 2yr</td><td class="px-4 py-3">$5</td></tr></tbody></table></div> <p class="text-xs text-muted-foreground mt-3 text-center">Tier 1 is reachable in ~200 days of watching at 5 STC/day — no purchase needed.</p></div> <div class="grid md:grid-cols-2 gap-6">`);
		Card($$renderer, {
			children: ($$renderer) => {
				Card_header($$renderer, {
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "flex items-center space-x-2",
							children: ($$renderer) => {
								Gift($$renderer, { class: "h-5 w-5 text-primary" });
								$$renderer.push(`<!----> <span>Why Choose NFT Subscriptions?</span>`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					class: "space-y-3 text-sm",
					children: ($$renderer) => {
						$$renderer.push(`<div>✓ <strong>True Ownership:</strong> Your subscription is stored on the blockchain</div> <div>✓ <strong>Family Sharing:</strong> Transfer your NFT to family members</div> <div>✓ <strong>Cross-Platform:</strong> Use on partner streaming services</div> <div>✓ <strong>Exclusive Rewards:</strong> NFT holder-only benefits and airdrops</div> <div>✓ <strong>Transparent:</strong> View your payment history on-chain</div>`);
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
								Coins($$renderer, { class: "h-5 w-5 text-secondary" });
								$$renderer.push(`<!----> <span>STC Token Benefits</span>`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					class: "space-y-3 text-sm",
					children: ($$renderer) => {
						$$renderer.push(`<div>💰 <strong>Earn Tokens:</strong> Watch content and earn STC rewards</div> <div>🔒 <strong>Stake for Discounts:</strong> Up to 50% off subscription fees</div> <div>🗳️ <strong>Governance Rights:</strong> Vote on platform decisions</div> <div>🎁 <strong>Exclusive Access:</strong> Early content and feature access</div> <div>📈 <strong>Token Growth:</strong> Benefit from platform revenue growth</div> <div class="pt-2">`);
						Button($$renderer, {
							variant: "outline",
							size: "sm",
							href: "/tokens",
							class: "w-full",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Learn About STC Tokens`);
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
		$$renderer.push(`<!----></div></div></div> `);
		if (showWalletModal) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div class="bg-background p-6 rounded-lg max-w-md w-full mx-4"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold">Connect Wallet</h3> `);
			Button($$renderer, {
				variant: "ghost",
				size: "sm",
				onclick: () => showWalletModal = false,
				children: ($$renderer) => {
					$$renderer.push(`<!---->×`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			WalletConnect($$renderer, {});
			$$renderer.push(`<!----> <div class="mt-4 text-center">`);
			Button($$renderer, {
				variant: "ghost",
				size: "sm",
				onclick: () => showWalletModal = false,
				class: "text-muted-foreground",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Continue without wallet`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
