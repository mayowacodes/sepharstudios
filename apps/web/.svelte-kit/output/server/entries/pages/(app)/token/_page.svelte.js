import { Lt as attr, Ot as store_get, jt as unsubscribe_stores, vt as attr_class, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { t as Arrow_right } from "../../../../chunks/arrow-right.js";
import { t as Arrow_up_down } from "../../../../chunks/arrow-up-down.js";
import { t as Circle_alert } from "../../../../chunks/circle-alert.js";
import { t as Circle_check } from "../../../../chunks/circle-check.js";
import { t as Coins } from "../../../../chunks/coins.js";
import { t as External_link } from "../../../../chunks/external-link.js";
import { t as Loader_circle } from "../../../../chunks/loader-circle.js";
import { t as Lock } from "../../../../chunks/lock.js";
import { t as Refresh_cw } from "../../../../chunks/refresh-cw.js";
import { t as Wallet } from "../../../../chunks/wallet.js";
import { t as Zap } from "../../../../chunks/zap.js";
import { t as Button } from "../../../../chunks/button.js";
import "../../../../chunks/config.js";
import { a as isConnected, n as connectWallet, o as walletAddress } from "../../../../chunks/wallet2.js";
import { c as subscriptionContract, s as stcToken, u as usdcToken } from "../../../../chunks/contracts2.js";
import "viem";
import "@wagmi/core";
//#region src/routes/(app)/token/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let inputAmount = "";
		let stcBalance = "0";
		let usdcBalance = "0";
		let cooldownStatus = null;
		let stcRedeemAmount = "500";
		let stakingInfo = null;
		let topUpAmount = "";
		let isLoadingBalances = false;
		let isRedeeming = false;
		let txSuccess = "";
		let errorMsg = "";
		let subAddr = "";
		async function loadBalances(addr) {
			isLoadingBalances = true;
			try {
				const [stc, usdc, stakeData, status] = await Promise.all([
					stcToken.balanceOf(addr),
					usdcToken.balanceOf(addr),
					stcToken.getStakingInfo(addr),
					subscriptionContract.getSTCCooldownStatus(addr)
				]);
				stcBalance = parseFloat(stc).toLocaleString(void 0, { maximumFractionDigits: 2 });
				usdcBalance = parseFloat(usdc).toFixed(2);
				stakingInfo = stakeData;
				cooldownStatus = status;
			} catch (e) {
				console.error("Balance load error:", e);
			} finally {
				isLoadingBalances = false;
			}
		}
		async function handleRedeem() {
			if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) return;
			errorMsg = "";
			txSuccess = "";
			isRedeeming = true;
			try {
				const allowance = await stcToken.allowance(store_get($$store_subs ??= {}, "$walletAddress", walletAddress), subAddr);
				const redeemAmt = stcRedeemAmount.replace(/,/g, "");
				if (parseFloat(allowance) < parseFloat(redeemAmt)) await stcToken.approve(subAddr, redeemAmt);
				await subscriptionContract.mintSubscriptionWithSTC();
				txSuccess = "Success! 1 month Basic subscription activated.";
				if (store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) await loadBalances(store_get($$store_subs ??= {}, "$walletAddress", walletAddress));
			} catch (e) {
				if (e?.message?.includes("cooldown")) errorMsg = "Cooldown active — check your remaining wait time below.";
				else if (e?.message?.includes("Insufficient")) errorMsg = `You need at least ${stcRedeemAmount} STC to redeem a subscription.`;
				else if (e?.message?.includes("rejected")) errorMsg = "Transaction cancelled.";
				else errorMsg = "Redemption failed. Try again.";
			} finally {
				isRedeeming = false;
			}
		}
		function formatCooldown(secs) {
			if (secs <= 0) return "Ready now";
			const d = Math.floor(secs / 86400);
			const h = Math.floor(secs % 86400 / 3600);
			if (d > 0) return `${d}d ${h}h remaining`;
			return `${h}h remaining`;
		}
		$$renderer.push(`<div class="relative min-h-screen bg-(--surface-charcoal) text-white overflow-hidden"><div class="absolute inset-0 pointer-events-none"><div class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-[#FFBF00]/8 blur-[120px] rounded-full"></div> <div class="absolute bottom-0 right-1/4 w-100 h-75 bg-[#FF5E0E]/8 blur-[100px] rounded-full"></div></div> <div class="relative z-10 container mx-auto px-4 pt-28 pb-20 max-w-5xl"><div class="text-center mb-10"><div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-sm font-medium text-[#FFBF00] mb-4">`);
		Coins($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----> Studio Token · Polygon Network</div> <h1 class="text-4xl font-extrabold mb-2">STC Token</h1> <p class="text-white/55 max-w-xl mx-auto">Buy STC with USDC, sell STC for USDC, or redeem ${escape_html(stcRedeemAmount)} STC for a free month subscription.</p></div> <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mb-8 flex flex-wrap gap-6 items-center justify-between text-sm">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center gap-2 text-white/40 text-sm">`);
		Loader_circle($$renderer, { class: "h-4 w-4 animate-spin" });
		$$renderer.push(`<!----> Loading pool data...</div>`);
		$$renderer.push(`<!--]--></div> <div class="grid lg:grid-cols-5 gap-6"><div class="lg:col-span-3"><div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-lg font-bold">Swap</h2> <div class="flex rounded-xl border border-white/10 overflow-hidden text-sm"><button${attr_class(`px-4 py-1.5 transition-colors bg-[#FF5E0E] text-white`)}>Buy STC</button> <button${attr_class(`px-4 py-1.5 transition-colors text-white/50 hover:text-white/80`)}>Sell STC</button></div></div> <div class="rounded-xl border border-white/10 bg-white/5 p-4 mb-2"><div class="flex justify-between text-xs text-white/40 mb-2"><span>You pay</span> <span>Balance: ${escape_html(usdcBalance)} ${escape_html("USDC")} `);
		if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="ml-1 text-[#FF5E0E] hover:underline">MAX</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></span></div> <div class="flex items-center gap-3"><input type="number" placeholder="0.00"${attr("value", inputAmount)} min="0" class="flex-1 bg-transparent text-2xl font-bold outline-none placeholder-white/20 [appearance:textfield] [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none"/> <div class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span class="text-[#3cba54] font-bold text-base">$</span> USDC`);
		$$renderer.push(`<!--]--></div></div></div> <div class="flex justify-center my-2"><button class="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors" aria-label="Flip direction">`);
		Arrow_up_down($$renderer, { class: "h-4 w-4 text-white/60" });
		$$renderer.push(`<!----></button></div> <div class="rounded-xl border border-white/10 bg-white/5 p-4 mb-4"><div class="flex justify-between text-xs text-white/40 mb-2"><span>You receive (estimate)</span> <span>Balance: ${escape_html(stcBalance)} ${escape_html("STC")}</span></div> <div class="flex items-center gap-3"><div class="flex-1 text-2xl font-bold text-white/80">${escape_html("—")}</div> <div class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">`);
		$$renderer.push("<!--[0-->");
		Coins($$renderer, { class: "h-4 w-4 text-[#FFBF00]" });
		$$renderer.push(`<!----> STC`);
		$$renderer.push(`<!--]--></div></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (errorMsg) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400 mb-4">`);
			Circle_alert($$renderer, { class: "h-4 w-4 shrink-0" });
			$$renderer.push(`<!----> ${escape_html(errorMsg)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (txSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-400 mb-4">`);
			Circle_check($$renderer, { class: "h-4 w-4 shrink-0" });
			$$renderer.push(`<!----> ${escape_html(txSuccess)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {
				onclick: () => connectWallet("injected"),
				class: "w-full bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white h-12 text-base font-semibold",
				children: ($$renderer) => {
					Wallet($$renderer, { class: "mr-2 h-5 w-5" });
					$$renderer.push(`<!----> Connect Wallet`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[1-->");
			Button($$renderer, {
				disabled: true,
				class: "w-full h-12 text-base opacity-50 cursor-not-allowed",
				children: ($$renderer) => {
					$$renderer.push(`<!---->No liquidity in pool`);
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--> <p class="text-center text-xs text-white/30 mt-3">Internal platform AMM · Polygon Mainnet · Prices update in real time</p></div> <div class="mt-4 rounded-2xl border border-[#FFBF00]/20 bg-[#FFBF00]/5 backdrop-blur-md p-5"><div class="flex items-start justify-between gap-4"><div><p class="font-semibold mb-1 flex items-center gap-2">`);
		Coins($$renderer, { class: "h-4 w-4 text-[#FFBF00]" });
		$$renderer.push(`<!----> Redeem ${escape_html(stcRedeemAmount)} STC → 1 Free Month</p> <p class="text-sm text-white/55 leading-relaxed">Spend ${escape_html(stcRedeemAmount)} STC for one month Basic access. Cooldown: 100 days after 1st use, 200 days after 2nd, alternating. STC returns to platform pool.</p> `);
		if (store_get($$store_subs ??= {}, "$isConnected", isConnected) && cooldownStatus !== null) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p${attr_class(`text-xs mt-2 ${cooldownStatus.secondsRemaining === 0 ? "text-green-400" : "text-amber-400"}`)}>${escape_html(cooldownStatus.secondsRemaining === 0 ? "Ready to redeem" : formatCooldown(cooldownStatus.secondsRemaining) + ` · Next cooldown: ${cooldownStatus.nextCooldownDays} days`)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {
				onclick: () => connectWallet("injected"),
				variant: "outline",
				class: "shrink-0 border-[#FFBF00]/40 text-[#FFBF00] hover:bg-[#FFBF00]/10",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Connect`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			Button($$renderer, {
				onclick: handleRedeem,
				disabled: isRedeeming || cooldownStatus !== null && cooldownStatus.secondsRemaining > 0,
				class: "shrink-0 bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
				children: ($$renderer) => {
					if (isRedeeming) {
						$$renderer.push("<!--[0-->");
						Loader_circle($$renderer, { class: "mr-1 h-4 w-4 animate-spin" });
						$$renderer.push(`<!----> Redeeming...`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`Redeem`);
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--></div></div></div> <div class="lg:col-span-2 space-y-4"><div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5"><h3 class="font-semibold mb-4 flex items-center gap-2 text-sm text-white/70 uppercase tracking-wider">`);
		Wallet($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----> Your Wallet</h3> `);
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-4"><p class="text-sm text-white/40 mb-3">Connect your wallet to see balances</p> `);
			Button($$renderer, {
				onclick: () => connectWallet("injected"),
				class: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white w-full",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Connect Wallet`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <button class="mt-2 w-full text-xs text-white/40 hover:text-white/60 transition-colors">Use WalletConnect (mobile)</button></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"><div class="flex items-center gap-2">`);
			Coins($$renderer, { class: "h-5 w-5 text-[#FFBF00]" });
			$$renderer.push(`<!----> <div><p class="text-xs text-white/40">STC Balance</p> <p class="font-bold">${escape_html(isLoadingBalances ? "..." : stcBalance)}</p></div></div> <p class="text-xs text-white/30">Studio Token</p></div> <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"><div class="flex items-center gap-2"><span class="h-5 w-5 flex items-center justify-center text-[#3cba54] font-bold text-lg">$</span> <div><p class="text-xs text-white/40">USDC Balance</p> <p class="font-bold">${escape_html(isLoadingBalances ? "..." : usdcBalance)}</p></div></div> <p class="text-xs text-white/30">USD Coin</p></div> <button class="w-full text-xs text-white/30 hover:text-white/60 flex items-center justify-center gap-1 transition-colors py-1">`);
			Refresh_cw($$renderer, { class: "h-3 w-3" });
			$$renderer.push(`<!----> Refresh balances</button></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5"><h3 class="font-semibold mb-3 text-sm text-white/70 uppercase tracking-wider">How to Earn STC</h3> <div class="space-y-3 text-sm"><div class="flex items-start gap-3"><div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FF5E0E]/15 flex items-center justify-center shrink-0">`);
		Zap($$renderer, { class: "h-4 w-4 text-[#FF5E0E]" });
		$$renderer.push(`<!----></div> <div><p class="font-medium">Watch content</p> <p class="text-white/45 text-xs">1 STC per hour · Max 5 STC/day</p></div></div> <div class="flex items-start gap-3"><div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FFBF00]/15 flex items-center justify-center shrink-0">`);
		Arrow_right($$renderer, { class: "h-4 w-4 text-[#FFBF00]" });
		$$renderer.push(`<!----></div> <div><p class="font-medium">Refer a friend</p> <p class="text-white/45 text-xs">10 STC when they subscribe</p></div></div> <div class="flex items-start gap-3"><div class="mt-0.5 w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">`);
		Coins($$renderer, { class: "h-4 w-4 text-purple-400" });
		$$renderer.push(`<!----></div> <div><p class="font-medium">Buy with USDC</p> <p class="text-white/45 text-xs">Use the swap above</p></div></div></div></div> <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5"><h3 class="font-semibold mb-3 text-sm text-white/70 uppercase tracking-wider">STC Utility</h3> <div class="space-y-3 text-sm"><div class="flex items-start gap-3"><div class="mt-0.5 w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">`);
		Circle_check($$renderer, { class: "h-4 w-4 text-green-400" });
		$$renderer.push(`<!----></div> <div><p class="font-medium">Free subscription</p> <p class="text-white/45 text-xs">${escape_html(stcRedeemAmount)} STC = 1 month Basic</p></div></div> <div class="flex items-start gap-3"><div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FFBF00]/15 flex items-center justify-center shrink-0">`);
		Lock($$renderer, { class: "h-4 w-4 text-[#FFBF00]" });
		$$renderer.push(`<!----></div> <div><p class="font-medium">Stake for discount</p> <p class="text-white/45 text-xs">1,000–35,000 STC → 10–50% off</p></div></div> `);
		Button($$renderer, {
			href: "/plans",
			variant: "outline",
			class: "w-full mt-1 border-white/15 text-white/60 hover:bg-white/5 text-xs h-8",
			children: ($$renderer) => {
				$$renderer.push(`<!---->View Plans &amp; Staking `);
				External_link($$renderer, { class: "ml-1 h-3 w-3" });
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> `);
		if (store_get($$store_subs ??= {}, "$isConnected", isConnected) && stakingInfo && parseFloat(stakingInfo.amount) > 0 && !stakingInfo.isUnlocked) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="rounded-2xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-xl p-5"><h3 class="font-semibold mb-1 text-sm text-purple-300 uppercase tracking-wider flex items-center gap-2">`);
			Lock($$renderer, { class: "h-4 w-4" });
			$$renderer.push(`<!----> Top Up Stake</h3> <p class="text-xs text-white/45 mb-3">Add more STC to your existing stake to upgrade your discount tier without waiting for lock expiry.</p> <div class="mb-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60 space-y-1"><div class="flex justify-between"><span>Staked</span><span class="text-white/80 font-medium">${escape_html(parseFloat(stakingInfo.amount).toLocaleString(void 0, { maximumFractionDigits: 0 }))} STC</span></div> <div class="flex justify-between"><span>Tier</span><span class="text-purple-300 font-medium">Tier ${escape_html(stakingInfo.discountTier)} (${escape_html(stakingInfo.discountTier === 1 ? 10 : stakingInfo.discountTier === 2 ? 20 : stakingInfo.discountTier === 3 ? 35 : stakingInfo.discountTier === 4 ? 50 : 0)}% off)</span></div> <div class="flex justify-between"><span>Unstaked balance</span><span class="text-white/80 font-medium">${escape_html(stcBalance)} STC</span></div></div> <input type="number" placeholder="Amount to add"${attr("value", topUpAmount)} min="0" class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none mb-2 [appearance:textfield] [&amp;::-webkit-inner-spin-button]:appearance-none"/> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button disabled="" class="w-full rounded-lg bg-purple-500/20 text-purple-300/40 text-sm font-medium py-2 cursor-not-allowed">Enter amount</button>`);
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
