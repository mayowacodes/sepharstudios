import { aA as head, au as escape_html, aP as store_get, ah as attr, aV as unsubscribe_stores, ap as derived } from './ui-libs-BjzLDLAh.js';
import { A as Arrow_right } from './arrow-right-rg3WMtsr.js';
import { A as Arrow_up_down } from './arrow-up-down-DCrEUum2.js';
import { C as Coins } from './coins-BbwCPe-f.js';
import { E as External_link } from './external-link-BUomdPel.js';
import { R as Refresh_cw } from './refresh-cw-BOgTab-0.js';
import { W as Wallet } from './wallet-DRYG0lzr.js';
import { B as Button } from './button-DY9ayrhs.js';
import { i as isConnected, c as connectWallet } from './wallet2-C50kGu0q.js';
import { t as tokenAMM } from './contracts2-Ddwyc3gK.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';
import './config-DS-2WH1m.js';
import './stringify-CbXG6ciN.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';
import './http-DCIt3x9N.js';
import './polygon-CgisD_XL.js';
import './chain-Bx4XJ_Uj.js';
import './sha2-Cn2-4DsP.js';
import './sendRawTransaction-C51V1yWv.js';
import './parseAbi-DF0R0BTC.js';
import './custom-1B_Soxgv.js';
import './parseUnits-CaMrifPu.js';

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
		async function handleSwap() {
			{
				message = "Enter a valid amount";
				return;
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
					$$renderer.push(`<!---->${escape_html(`Swap ${inputLabel()} for ${outputLabel()}`)} `);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-DhTN1trY.js.map
