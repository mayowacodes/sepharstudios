import { Lt as attr, Ot as store_get, Pt as get, Tt as head, jt as unsubscribe_stores, vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/index-server.js";
import { t as Arrow_right } from "../../../../chunks/arrow-right.js";
import { t as Calendar } from "../../../../chunks/calendar.js";
import { t as Coins } from "../../../../chunks/coins.js";
import { t as Gift } from "../../../../chunks/gift.js";
import { t as Lock } from "../../../../chunks/lock.js";
import { t as Trending_up } from "../../../../chunks/trending-up.js";
import { t as Wallet } from "../../../../chunks/wallet.js";
import { t as Button } from "../../../../chunks/button.js";
import { a as isConnected, n as connectWallet, o as walletAddress, s as walletGeneration } from "../../../../chunks/wallet2.js";
import { s as stcToken } from "../../../../chunks/contracts2.js";
//#region src/routes/(app)/staking/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const TIERS = [
			{
				days: 30,
				discount: 5,
				label: "1 Month",
				tone: "bronze"
			},
			{
				days: 90,
				discount: 12,
				label: "3 Months",
				tone: "silver"
			},
			{
				days: 180,
				discount: 25,
				label: "6 Months",
				tone: "gold"
			},
			{
				days: 365,
				discount: 50,
				label: "1 Year",
				tone: "diamond"
			}
		];
		let balance = "0";
		let activeStake = {
			amount: "0",
			tier: 0,
			unlocksAt: null
		};
		let selectedTier = 2;
		let stakeAmount = "";
		let loading = false;
		let message = "";
		async function loadStakingData() {
			const startGen = get(walletGeneration);
			const startAddr = store_get($$store_subs ??= {}, "$walletAddress", walletAddress);
			try {
				const [bal, discount] = await Promise.all([stcToken.balanceOf(startAddr), stcToken.getUserDiscount(startAddr)]);
				if (get(walletGeneration) !== startGen) return;
				balance = bal;
				const tierIndex = TIERS.findIndex((t) => t.discount === discount);
				activeStake.tier = tierIndex >= 0 ? tierIndex : 0;
			} catch (err) {
				console.error("Failed to load staking data:", err);
			}
		}
		async function handleStake() {
			if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
				message = "Enter a valid amount";
				return;
			}
			if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) {
				message = "Connect your wallet to stake.";
				return;
			}
			if (parseFloat(stakeAmount) > parseFloat(balance)) {
				message = `Insufficient balance. You have ${balance} STC available.`;
				return;
			}
			const tier = TIERS[selectedTier];
			loading = true;
			message = "";
			try {
				const lockSeconds = tier.days * 86400;
				message = `Stake submitted (tx ${(await stcToken.stakeForDiscount(stakeAmount, lockSeconds)).slice(0, 10)}…). Discount activates after on-chain confirmation.`;
				await loadStakingData();
				stakeAmount = "";
			} catch (err) {
				const raw = err instanceof Error ? err.message : "Stake failed";
				if (/user rejected|user denied|rejected.*request/i.test(raw)) message = "Transaction cancelled.";
				else message = raw.length > 140 ? `${raw.slice(0, 140)}…` : raw;
			} finally {
				loading = false;
			}
		}
		head("15447ir", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>STC Staking · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Stake STC tokens to unlock subscription discounts and creator rewards."/>`);
		});
		$$renderer.push(`<div class="min-h-screen bg-background text-white px-4 py-10"><div class="max-w-5xl mx-auto space-y-8"><header class="text-center"><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-3">`);
		Lock($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> STC Token Staking</div> <h1 class="text-3xl md:text-4xl font-bold mb-3">Stake STC. Stream for less.</h1> <p class="text-muted-foreground max-w-xl mx-auto">Lock STC tokens for a fixed period and earn a permanent discount on your Sephar Studios subscription —
        the longer you stake, the deeper the discount.</p></header> `);
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-card border border-border rounded-2xl p-8 text-center space-y-4">`);
			Wallet($$renderer, { class: "w-10 h-10 text-primary mx-auto" });
			$$renderer.push(`<!----> <h2 class="text-xl font-semibold">Connect a wallet to start staking</h2> <p class="text-sm text-muted-foreground">Your STC balance, active stake and discount tier will appear here once you connect.</p> `);
			Button($$renderer, {
				onclick: () => connectWallet(),
				children: ($$renderer) => {
					$$renderer.push(`<!---->Connect Wallet`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid sm:grid-cols-3 gap-4"><div class="bg-card border border-border rounded-xl p-5"><div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">`);
			Coins($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----> Available STC</div> <div class="text-2xl font-bold">${escape_html(parseFloat(balance).toLocaleString())}</div></div> <div class="bg-card border border-border rounded-xl p-5"><div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">`);
			Gift($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----> Current Discount</div> <div class="text-2xl font-bold text-primary">${escape_html(TIERS[activeStake.tier].discount)}%</div></div> <div class="bg-card border border-border rounded-xl p-5"><div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">`);
			Calendar($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----> Unlocks</div> <div class="text-sm">${escape_html(activeStake.unlocksAt ?? "No active stake yet")}</div></div></div> <div class="bg-card border border-border rounded-2xl p-6 space-y-5"><h2 class="text-lg font-semibold">Choose a lock period</h2> <div class="grid grid-cols-2 md:grid-cols-4 gap-3"><!--[-->`);
			const each_array = ensure_array_like(TIERS);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let tier = each_array[i];
				$$renderer.push(`<button type="button"${attr_class(`text-left p-4 rounded-xl border transition-all ${selectedTier === i ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/50"}`)}><div class="text-xs text-muted-foreground">${escape_html(tier.label)}</div> <div class="text-2xl font-bold mt-1">${escape_html(tier.discount)}%</div> <div class="text-xs text-muted-foreground mt-1">subscription discount</div></button>`);
			}
			$$renderer.push(`<!--]--></div> <div class="pt-4 border-t border-border space-y-3"><label class="text-sm font-medium" for="stake-amount">Amount to stake (STC)</label> <div class="flex gap-2"><input id="stake-amount" type="number" min="0" step="0.01"${attr("value", stakeAmount)} placeholder="0.00" class="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"/> `);
			Button($$renderer, {
				variant: "outline",
				size: "sm",
				onclick: () => stakeAmount = balance,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Max`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			Button($$renderer, {
				class: "w-full",
				disabled: loading,
				onclick: handleStake,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(loading ? "Staking..." : `Stake for ${TIERS[selectedTier].label}`)} `);
					Arrow_right($$renderer, { class: "w-4 h-4 ml-2" });
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-xs text-muted-foreground">${escape_html(message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--> <div class="bg-card border border-border rounded-2xl p-6"><h2 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
		Trending_up($$renderer, { class: "w-5 h-5 text-primary" });
		$$renderer.push(`<!----> How STC staking works</h2> <ol class="space-y-3 text-sm text-muted-foreground"><li><span class="text-primary font-semibold">1.</span> Lock STC for a fixed period — your tokens stay yours, just unspendable until unlock.</li> <li><span class="text-primary font-semibold">2.</span> Your subscription cost drops by the staking discount automatically.</li> <li><span class="text-primary font-semibold">3.</span> Stack discounts with NFT subscription tier benefits.</li> <li><span class="text-primary font-semibold">4.</span> Withdraw anytime after the lock period ends — no penalties, no fees.</li></ol> <div class="mt-6 flex flex-wrap gap-3">`);
		Button($$renderer, {
			variant: "outline",
			href: "/exchange",
			children: ($$renderer) => {
				Coins($$renderer, { class: "w-4 h-4 mr-2" });
				$$renderer.push(`<!----> Buy STC`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			variant: "outline",
			href: "/liquidity",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Provide Liquidity`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			variant: "outline",
			href: "/token",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Token Overview`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
