import { Ct as unsubscribe_stores, bt as store_get, jt as escape_html, yt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
import { t as Coins } from "./coins.js";
import { t as External_link } from "./external-link.js";
import { t as Wallet } from "./wallet.js";
import { t as Zap } from "./zap.js";
import { t as Button } from "./button.js";
import { t as Badge } from "./badge.js";
import { a as Card, i as Card_content } from "./card.js";
import { a as isConnected, i as formatAddress, n as connectWallet, o as walletAddress, r as disconnectWallet, t as account } from "./wallet2.js";
import "./contracts.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/check-check.svelte
function Check_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "check-check" },
		props,
		{ iconNode: [["path", { "d": "M18 6 7 17l-5-5" }], ["path", { "d": "m22 10-7.5 7.5L13 16" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/copy.svelte
function Copy($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "copy" },
		props,
		{ iconNode: [["rect", {
			"width": "14",
			"height": "14",
			"x": "8",
			"y": "8",
			"rx": "2",
			"ry": "2"
		}], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]] }
	]));
}
//#endregion
//#region src/lib/components/web3/WalletConnect.svelte
function WalletConnect($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let isConnecting = false;
		let error = "";
		let balances = {
			stc: "0",
			usdc: "0"
		};
		let userAccess = {
			hasSubscription: false,
			subscriptionTier: 0,
			stakingDiscount: 0,
			stakingAmount: "0",
			hasAccess: false
		};
		let copied = false;
		async function handleConnect(connectorType = "injected") {
			isConnecting = true;
			error = "";
			try {
				await connectWallet(connectorType);
			} catch (err) {
				error = err.message || "Failed to connect wallet";
				console.error("Connection error:", err);
			} finally {
				isConnecting = false;
			}
		}
		async function handleDisconnect() {
			try {
				await disconnectWallet();
				balances = {
					stc: "0",
					usdc: "0"
				};
				userAccess = {
					hasSubscription: false,
					subscriptionTier: 0,
					stakingDiscount: 0,
					stakingAmount: "0",
					hasAccess: false
				};
			} catch (err) {
				error = err.message || "Failed to disconnect wallet";
			}
		}
		async function copyAddress() {
			if (store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) {
				await navigator.clipboard.writeText(store_get($$store_subs ??= {}, "$walletAddress", walletAddress));
				copied = true;
				setTimeout(() => copied = false, 2e3);
			}
		}
		function getTierName(tier) {
			return [
				"Basic",
				"Premium",
				"Creator"
			][tier] || "Unknown";
		}
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			Card($$renderer, {
				class: "w-full max-w-md mx-auto",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6 space-y-4",
						children: ($$renderer) => {
							$$renderer.push(`<div class="text-center space-y-2">`);
							Wallet($$renderer, { class: "mx-auto h-12 w-12 text-primary" });
							$$renderer.push(`<!----> <h3 class="text-xl font-semibold">Connect Your Wallet</h3> <p class="text-muted-foreground text-sm">Connect your wallet to access StudioChain tokens, NFT subscriptions, and premium features.</p></div> `);
							if (error) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"><p class="text-destructive text-sm">${escape_html(error)}</p></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> <div class="space-y-2">`);
							Button($$renderer, {
								class: "w-full justify-start bg-primary hover:bg-primary/90",
								disabled: isConnecting,
								onclick: () => handleConnect("injected"),
								children: ($$renderer) => {
									if (isConnecting) {
										$$renderer.push("<!--[0-->");
										Zap($$renderer, { class: "mr-2 h-4 w-4 animate-spin" });
										$$renderer.push(`<!----> Connecting...`);
									} else {
										$$renderer.push("<!--[-1-->");
										Wallet($$renderer, { class: "mr-2 h-4 w-4" });
										$$renderer.push(`<!----> MetaMask / Browser Wallet`);
									}
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "outline",
								class: "w-full justify-start",
								disabled: isConnecting,
								onclick: () => handleConnect("walletConnect"),
								children: ($$renderer) => {
									External_link($$renderer, { class: "mr-2 h-4 w-4" });
									$$renderer.push(`<!----> WalletConnect`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "outline",
								class: "w-full justify-start",
								disabled: isConnecting,
								onclick: () => handleConnect("coinbase"),
								children: ($$renderer) => {
									Coins($$renderer, { class: "mr-2 h-4 w-4" });
									$$renderer.push(`<!----> Coinbase Wallet`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div> <div class="text-center"><p class="text-xs text-muted-foreground">By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p></div>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			Card($$renderer, {
				class: "w-full",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6 space-y-6",
						children: ($$renderer) => {
							$$renderer.push(`<div class="flex items-center justify-between p-3 bg-accent/10 rounded-lg"><div class="flex items-center space-x-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative">`);
							Wallet($$renderer, { class: "h-4 w-4 text-primary-foreground" });
							$$renderer.push(`<!----> `);
							if (store_get($$store_subs ??= {}, "$account", account)?.status === "connected") {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div><p class="font-medium">${escape_html(formatAddress(store_get($$store_subs ??= {}, "$walletAddress", walletAddress) || "", 6))}</p> <p class="text-xs text-muted-foreground">`);
							if (store_get($$store_subs ??= {}, "$account", account)?.connector?.name) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`Connected via ${escape_html(store_get($$store_subs ??= {}, "$account", account).connector.name)}`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`Connected Wallet`);
							}
							$$renderer.push(`<!--]--></p></div></div> <div class="flex items-center space-x-2">`);
							Button($$renderer, {
								variant: "ghost",
								size: "sm",
								onclick: copyAddress,
								class: "h-8 w-8 p-0",
								children: ($$renderer) => {
									if (copied) {
										$$renderer.push("<!--[0-->");
										Check_check($$renderer, { class: "h-3 w-3 text-primary" });
									} else {
										$$renderer.push("<!--[-1-->");
										Copy($$renderer, { class: "h-3 w-3" });
									}
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "outline",
								size: "sm",
								onclick: handleDisconnect,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Disconnect`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div></div> <div class="grid grid-cols-2 gap-4"><div class="p-4 bg-primary/5 border border-primary/20 rounded-lg"><div class="flex items-center justify-between"><div><p class="text-sm text-muted-foreground">STC Balance</p> <p class="text-lg font-semibold text-primary">${escape_html(parseFloat(balances.stc).toFixed(2))}</p></div> <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">`);
							Coins($$renderer, { class: "h-4 w-4 text-primary" });
							$$renderer.push(`<!----></div></div></div> <div class="p-4 bg-secondary/5 border border-secondary/20 rounded-lg"><div class="flex items-center justify-between"><div><p class="text-sm text-muted-foreground">USDC Balance</p> <p class="text-lg font-semibold text-secondary">$${escape_html(parseFloat(balances.usdc).toFixed(2))}</p></div> <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center"><span class="text-xs font-bold text-secondary">$</span></div></div></div></div> <div class="space-y-3"><h4 class="font-medium">Account Status</h4> <div class="flex flex-wrap gap-2">`);
							if (userAccess.hasSubscription) {
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									class: "bg-primary text-primary-foreground",
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(getTierName(userAccess.subscriptionTier))} Subscriber`);
									},
									$$slots: { default: true }
								});
							} else {
								$$renderer.push("<!--[-1-->");
								Badge($$renderer, {
									variant: "outline",
									children: ($$renderer) => {
										$$renderer.push(`<!---->No Active Subscription`);
									},
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!--]--> `);
							if (userAccess.stakingDiscount > 0) {
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									class: "bg-accent text-accent-foreground",
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(userAccess.stakingDiscount)}% Staking Discount`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (parseFloat(userAccess.stakingAmount) > 0) {
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									variant: "secondary",
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(parseFloat(userAccess.stakingAmount).toFixed(0))} STC Staked`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> `);
							if (userAccess.hasAccess) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="p-3 bg-primary/10 border border-primary/20 rounded-lg"><p class="text-sm text-primary font-medium">✓ Premium Access Granted</p> <p class="text-xs text-muted-foreground mt-1">You have access to premium content and features.</p></div>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="p-3 bg-muted/50 border rounded-lg"><p class="text-sm font-medium">Get Premium Access</p> <p class="text-xs text-muted-foreground mt-1">Subscribe or stake STC tokens to unlock premium features.</p></div>`);
							}
							$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-2">`);
							Button($$renderer, {
								variant: "outline",
								size: "sm",
								href: "/tokens",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Manage STC`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "outline",
								size: "sm",
								href: "/subscription",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Subscription`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { WalletConnect as t };
