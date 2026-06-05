import { Lt as attr, Ot as store_get, St as derived, Tt as head, jt as unsubscribe_stores, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { t as Arrow_right } from "../../../../chunks/arrow-right.js";
import { t as Arrow_up_down } from "../../../../chunks/arrow-up-down.js";
import { t as Coins } from "../../../../chunks/coins.js";
import { t as External_link } from "../../../../chunks/external-link.js";
import { t as Refresh_cw } from "../../../../chunks/refresh-cw.js";
import { t as Wallet } from "../../../../chunks/wallet.js";
import { t as Button } from "../../../../chunks/button.js";
import { a as isConnected, n as connectWallet, o as walletAddress } from "../../../../chunks/wallet2.js";
import { l as tokenAMM, s as stcToken, u as usdcToken } from "../../../../chunks/contracts2.js";
//#region src/routes/(app)/exchange/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let inputAmount = "";
		let outputEstimate = "0";
		let priceImpact = 0;
		let stcPrice = "0";
		let usdcBalance = "0";
		let loading = false;
		let message = "";
		async function loadPrice() {
			try {
				stcPrice = await tokenAMM.getSTCPrice();
			} catch (err) {
				console.error("Price load failed:", err);
			}
		}
		async function loadBalances() {
			try {
				const [stc, usdc] = await Promise.all([stcToken.balanceOf(store_get($$store_subs ??= {}, "$walletAddress", walletAddress)), usdcToken.balanceOf(store_get($$store_subs ??= {}, "$walletAddress", walletAddress))]);
				usdcBalance = usdc;
			} catch (err) {
				console.error("Balance load failed:", err);
			}
		}
		async function handleSwap() {
			if (!inputAmount || parseFloat(inputAmount) <= 0) {
				message = "Enter a valid amount";
				return;
			}
			if (!store_get($$store_subs ??= {}, "$walletAddress", walletAddress)) {
				message = "Connect your wallet to swap.";
				return;
			}
			if (parseFloat(inputAmount) > parseFloat(usdcBalance)) {
				message = `Insufficient USDC balance.`;
				return;
			}
			loading = true;
			message = "";
			try {
				const ammAddress = tokenAMM.contractAddress();
				message = "Approving USDC…";
				await usdcToken.approve(ammAddress, inputAmount);
				const minOut = (parseFloat(outputEstimate) * .99).toFixed(18);
				message = "Swapping…";
				message = `Swap submitted (tx ${(await tokenAMM.swapUSDCForSTC(inputAmount, minOut)).slice(0, 10)}…). Balances will refresh shortly.`;
				inputAmount = "";
				outputEstimate = "0";
				setTimeout(() => void loadBalances(), 2e3);
			} catch (err) {
				const raw = err instanceof Error ? err.message : "Swap failed";
				if (/user rejected|user denied|rejected.*request/i.test(raw)) message = "Transaction cancelled.";
				else message = raw.length > 140 ? `${raw.slice(0, 140)}…` : raw;
			} finally {
				loading = false;
			}
		}
		const inputLabel = derived(() => "USDC");
		const outputLabel = derived(() => "STC");
		const inputBalance = derived(() => usdcBalance);
		head("t8evgf", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>STC Exchange · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Buy and sell STC tokens through the in-app AMM pool."/>`);
		});
		$$renderer.push(`<div class="min-h-screen bg-background text-white px-4 py-10"><div class="max-w-3xl mx-auto space-y-8"><header class="text-center"><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-3">`);
		Arrow_up_down($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> STC ⇄ USDC</div> <h1 class="text-3xl md:text-4xl font-bold mb-3">STC Token Exchange</h1> <p class="text-muted-foreground max-w-xl mx-auto">Swap between STC and USDC directly through the Sephar Studios AMM pool. No external bridges, no centralised order book.</p></header> <div class="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">`);
		Coins($$renderer, { class: "w-5 h-5 text-primary" });
		$$renderer.push(`<!----></div> <div><div class="text-xs text-muted-foreground">STC Price</div> <div class="text-xl font-bold">$${escape_html(parseFloat(stcPrice).toFixed(4))} <span class="text-sm text-muted-foreground">USDC</span></div></div></div> `);
		Button($$renderer, {
			variant: "outline",
			size: "sm",
			onclick: loadPrice,
			children: ($$renderer) => {
				Refresh_cw($$renderer, { class: "w-4 h-4 mr-2" });
				$$renderer.push(`<!----> Refresh`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> `);
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-card border border-border rounded-2xl p-8 text-center space-y-4">`);
			Wallet($$renderer, { class: "w-10 h-10 text-primary mx-auto" });
			$$renderer.push(`<!----> <h2 class="text-xl font-semibold">Connect a wallet to swap</h2> `);
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
			$$renderer.push(`<div class="bg-card border border-border rounded-2xl p-6 space-y-4"><div class="space-y-2"><div class="flex justify-between text-xs text-muted-foreground"><span>You pay</span> <span>Balance: ${escape_html(parseFloat(inputBalance()).toLocaleString())} ${escape_html(inputLabel())}</span></div> <div class="flex gap-2 items-center bg-background border border-border rounded-lg px-3 py-3"><input type="number" min="0" step="0.0001"${attr("value", inputAmount)} placeholder="0.00" class="flex-1 bg-transparent text-lg font-semibold outline-none"/> <span class="text-sm font-semibold text-muted-foreground">${escape_html(inputLabel())}</span></div></div> <div class="flex justify-center"><button type="button" class="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors" aria-label="Flip direction">`);
			Arrow_up_down($$renderer, { class: "w-5 h-5 text-primary" });
			$$renderer.push(`<!----></button></div> <div class="space-y-2"><div class="flex justify-between text-xs text-muted-foreground"><span>You receive</span> <span>Price impact: ${escape_html(priceImpact.toFixed(2))}%</span></div> <div class="flex gap-2 items-center bg-background border border-border rounded-lg px-3 py-3"><input type="text" readonly=""${attr("value", outputEstimate)} class="flex-1 bg-transparent text-lg font-semibold outline-none"/> <span class="text-sm font-semibold text-muted-foreground">${escape_html(outputLabel())}</span></div></div> `);
			Button($$renderer, {
				class: "w-full",
				disabled: loading,
				onclick: handleSwap,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(loading ? "Swapping..." : `Swap ${inputLabel()} for ${outputLabel()}`)} `);
					Arrow_right($$renderer, { class: "w-4 h-4 ml-2" });
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-xs text-muted-foreground text-center">${escape_html(message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="text-xs text-muted-foreground pt-3 border-t border-border space-y-1"><div class="flex justify-between"><span>Pool fee</span><span>0.30%</span></div> <div class="flex justify-between"><span>Slippage tolerance</span><span>1.0%</span></div></div></div>`);
		}
		$$renderer.push(`<!--]--> <div class="flex flex-wrap gap-3 justify-center">`);
		Button($$renderer, {
			variant: "outline",
			href: "/staking",
			children: ($$renderer) => {
				$$renderer.push(`<span>Stake STC</span>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			variant: "outline",
			href: "/liquidity",
			children: ($$renderer) => {
				$$renderer.push(`<span>Provide Liquidity</span>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			variant: "outline",
			href: "/token",
			children: ($$renderer) => {
				$$renderer.push(`<span>Token Overview</span> `);
				External_link($$renderer, { class: "w-3.5 h-3.5 ml-2" });
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
