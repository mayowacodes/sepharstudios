import { at as head, an as escape_html, aI as store_get, ab as attr_class, aa as attr, aO as unsubscribe_stores, aH as spread_props } from './ui-libs-TtGtWAGI.js';
import { I as Icon } from './Icon-CGEdwVFL.js';
import { A as Arrow_right } from './arrow-right-rdQt-AO1.js';
import { C as Coins } from './coins-B3BwYJFB.js';
import { T as Trending_up } from './trending-up-ByWzB44I.js';
import { W as Wallet } from './wallet-hvKePUx2.js';
import { B as Button } from './button-D9M18H3C.js';
import { i as isConnected, c as connectWallet } from './wallet2-CUQK2HjM.js';
import './config-BPBzrUzB.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';
import './polygon-D78JtxJX.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';

//#region ../../node_modules/@lucide/svelte/dist/icons/droplets.svelte
function Droplets($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "droplets" },
		props,
		{ iconNode: [["path", { "d": "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" }], ["path", { "d": "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/info.svelte
function Info($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "info" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["path", { "d": "M12 16v-4" }],
			["path", { "d": "M12 8h.01" }]
		] }
	]));
}
//#endregion
//#region src/routes/(app)/liquidity/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let pool = {
			stcBalance: "0",
			usdcBalance: "0",
			totalLiquidity: 0
		};
		let myShare = {
			lp: "0",
			stc: "0",
			usdc: "0"};
		let stcAmount = "";
		let usdcAmount = "";
		let loading = false;
		let message = "";
		async function handleAdd() {
			{
				message = "Enter STC amount";
				return;
			}
		}
		head("1osdd2a", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>STC Liquidity · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Provide liquidity to the STC/USDC pool and earn a share of swap fees."/>`);
		});
		$$renderer.push(`<div class="min-h-screen bg-background text-white px-4 py-10"><div class="max-w-4xl mx-auto space-y-8"><header class="text-center"><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-3">`);
		Droplets($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> STC/USDC Pool</div> <h1 class="text-3xl md:text-4xl font-bold mb-3">Provide Liquidity</h1> <p class="text-muted-foreground max-w-xl mx-auto">Deposit STC and USDC in equal value to the pool. You'll earn a proportional share of the 0.30% swap fee
        on every trade — passive income that compounds while the catalogue grows.</p></header> <div class="grid sm:grid-cols-3 gap-4"><div class="bg-card border border-border rounded-xl p-5"><div class="text-xs text-muted-foreground uppercase tracking-wide mb-2">STC in pool</div> <div class="text-xl font-bold">${escape_html(parseFloat(pool.stcBalance).toLocaleString())}</div></div> <div class="bg-card border border-border rounded-xl p-5"><div class="text-xs text-muted-foreground uppercase tracking-wide mb-2">USDC in pool</div> <div class="text-xl font-bold">$${escape_html(parseFloat(pool.usdcBalance).toLocaleString())}</div></div> <div class="bg-card border border-border rounded-xl p-5"><div class="text-xs text-muted-foreground uppercase tracking-wide mb-2">Total liquidity</div> <div class="text-xl font-bold">$${escape_html(pool.totalLiquidity.toLocaleString())}</div></div></div> `);
		if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-card border border-border rounded-2xl p-8 text-center space-y-4">`);
			Wallet($$renderer, { class: "w-10 h-10 text-primary mx-auto" });
			$$renderer.push(`<!----> <h2 class="text-xl font-semibold">Connect a wallet to provide liquidity</h2> `);
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
			$$renderer.push(`<div class="bg-card border border-border rounded-2xl p-5"><div class="flex items-center justify-between mb-3"><h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your position</h2> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="grid grid-cols-3 gap-3 text-sm"><div><div class="text-xs text-muted-foreground">LP tokens</div> <div class="font-semibold">${escape_html(parseFloat(myShare.lp).toLocaleString(void 0, { maximumFractionDigits: 4 }))}</div></div> <div><div class="text-xs text-muted-foreground">STC</div> <div class="font-semibold">${escape_html(parseFloat(myShare.stc).toLocaleString(void 0, { maximumFractionDigits: 2 }))}</div></div> <div><div class="text-xs text-muted-foreground">USDC</div> <div class="font-semibold">$${escape_html(parseFloat(myShare.usdc).toLocaleString(void 0, { maximumFractionDigits: 2 }))}</div></div></div></div> <div class="bg-card border border-border rounded-2xl p-6 space-y-4"><div class="flex gap-2 border-b border-border pb-3"><button${attr_class(`px-4 py-1.5 text-sm rounded-lg transition-colors bg-primary text-primary-foreground`)}>Add Liquidity</button> <button${attr_class(`px-4 py-1.5 text-sm rounded-lg transition-colors text-muted-foreground hover:text-white`)}>Remove</button></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-3"><label class="block text-xs text-muted-foreground" for="add-stc">STC amount</label> <input id="add-stc" type="number" min="0" step="0.01"${attr("value", stcAmount)} placeholder="0.00" class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"/> <label class="block text-xs text-muted-foreground" for="add-usdc">USDC amount (auto-matched)</label> <input id="add-usdc" type="number" min="0" step="0.01"${attr("value", usdcAmount)} placeholder="0.00" class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"/> `);
			Button($$renderer, {
				class: "w-full",
				disabled: loading,
				onclick: handleAdd,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html("Add Liquidity")} `);
					Arrow_right($$renderer, { class: "w-4 h-4 ml-2" });
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
			$$renderer.push(`<!--]--> `);
			if (message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-xs text-muted-foreground text-center">${escape_html(message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div class="bg-card border border-border rounded-2xl p-6 space-y-3"><h2 class="text-lg font-semibold flex items-center gap-2">`);
		Info($$renderer, { class: "w-5 h-5 text-primary" });
		$$renderer.push(`<!----> Things to know</h2> <ul class="text-sm text-muted-foreground space-y-2"><li class="flex gap-2">`);
		Coins($$renderer, { class: "w-4 h-4 mt-0.5 text-primary shrink-0" });
		$$renderer.push(`<!----> You must supply both STC and USDC in equal value at the current pool ratio.</li> <li class="flex gap-2">`);
		Trending_up($$renderer, { class: "w-4 h-4 mt-0.5 text-primary shrink-0" });
		$$renderer.push(`<!----> You receive LP tokens representing your share. Burn them anytime to withdraw your underlying assets + earned fees.</li> <li class="flex gap-2">`);
		Droplets($$renderer, { class: "w-4 h-4 mt-0.5 text-primary shrink-0" });
		$$renderer.push(`<!----> Impermanent loss applies — if STC price diverges significantly from USDC, your withdrawn position may be worth less than holding spot.</li></ul> <div class="pt-3 flex flex-wrap gap-3">`);
		Button($$renderer, {
			variant: "outline",
			href: "/staking",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Stake STC`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			variant: "outline",
			href: "/exchange",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Swap STC`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-DFO7lPew.js.map
