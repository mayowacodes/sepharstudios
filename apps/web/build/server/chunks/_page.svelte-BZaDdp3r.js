import { aA as head, au as escape_html, aO as spread_props, ap as derived, aP as store_get, aV as unsubscribe_stores } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { A as Arrow_left } from './arrow-left-DITrNWiS.js';
import { U as User_plus } from './user-plus-CNzOwJvd.js';
import { B as Button } from './button-DY9ayrhs.js';
import { p as page } from './stores-dgIRD0v2.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';
import './client-Bo2aevGq.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/shield-x.svelte
function Shield_x($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "shield-x" },
		props,
		{ iconNode: [
			["path", { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }],
			["path", { "d": "m14.5 9.5-5 5" }],
			["path", { "d": "m9.5 9.5 5 5" }]
		] }
	]));
}
//#endregion
//#region src/routes/(app)/access-denied/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const reason = derived(() => store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("reason") ?? "unknown");
		const portal = derived(() => reason() === "admin" ? "Admin portal" : reason() === "creator" ? "Creator portal" : "this area");
		head("1bjvtds", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Access denied · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="robots" content="noindex"/>`);
		});
		$$renderer.push(`<div class="min-h-[70vh] flex items-center justify-center px-4"><div class="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-5"><div class="inline-flex w-14 h-14 items-center justify-center rounded-full bg-destructive/10 mx-auto">`);
		Shield_x($$renderer, {
			class: "w-7 h-7 text-destructive",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></div> `);
		if (reason() === "admin") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<h1 class="text-2xl font-bold">You're not an admin</h1> <p class="text-sm text-muted-foreground">The Admin portal is reserved for Sephar Studios staff. If you should have access, contact your team lead and ask them to grant you the admin role.</p> <div class="flex flex-col gap-2">`);
			Button($$renderer, {
				href: "/browse",
				variant: "default",
				children: ($$renderer) => {
					Arrow_left($$renderer, { class: "w-4 h-4 mr-2" });
					$$renderer.push(`<!----> Back to browse`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else if (reason() === "creator") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<h1 class="text-2xl font-bold">You're not a creator yet</h1> <p class="text-sm text-muted-foreground">The Creator portal is for approved Sephar Studios creators. To start publishing content, apply to become a creator — applications usually get reviewed within 3 business days.</p> <div class="flex flex-col gap-2">`);
			Button($$renderer, {
				href: "/apply/creator",
				variant: "default",
				children: ($$renderer) => {
					User_plus($$renderer, { class: "w-4 h-4 mr-2" });
					$$renderer.push(`<!----> Apply to become a creator`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				href: "/browse",
				variant: "outline",
				children: ($$renderer) => {
					Arrow_left($$renderer, { class: "w-4 h-4 mr-2" });
					$$renderer.push(`<!----> Back to browse`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<h1 class="text-2xl font-bold">Access denied</h1> <p class="text-sm text-muted-foreground">You don't have permission to view ${escape_html(portal())}. If you believe this is a mistake, sign out and back in, or contact support.</p> <div class="flex flex-col gap-2">`);
			Button($$renderer, {
				href: "/browse",
				variant: "default",
				children: ($$renderer) => {
					Arrow_left($$renderer, { class: "w-4 h-4 mr-2" });
					$$renderer.push(`<!----> Back to browse`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--> <p class="text-xs text-muted-foreground pt-2 border-t border-border">Need help? <a href="/contact" class="underline hover:text-foreground">Contact support</a></p></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BZaDdp3r.js.map
