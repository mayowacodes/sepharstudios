import { Tt as head } from "../../../../chunks/ui-libs.js";
import { t as PortalShell } from "../../../../chunks/PortalShell.js";
/* empty css                      */
import { t as page } from "../../../../chunks/state.js";
import { t as Button } from "../../../../chunks/button.js";
//#region src/routes/(creator)/creator/+layout@.svelte
function _layout_($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const user = page.data.user;
		head("1tcrg26", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Creator Studio - Sephar Studios</title>`);
			});
		});
		if (user) {
			$$renderer.push("<!--[0-->");
			PortalShell($$renderer, {
				portal: "creator",
				children: ($$renderer) => {
					children($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted"><div class="text-center max-w-md px-6"><div class="mb-8"><div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"><svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div> <h1 class="text-3xl font-bold mb-4">Creator Access Required</h1> <p class="text-muted-foreground mb-8">Sign in to access the creator portal and start sharing your faith-based content with the world.</p></div> <div class="space-y-4">`);
			Button($$renderer, {
				href: "/auth/login?redirectTo=/creator",
				class: "w-full bg-primary hover:bg-primary/90",
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Sign In to Creator Portal`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="text-sm text-muted-foreground"><p>Don't have an account?</p> `);
			Button($$renderer, {
				href: "/auth/register?redirectTo=/creator",
				variant: "link",
				class: "text-primary hover:text-primary/80",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Sign up here`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="mt-8 pt-8 border-t border-border"><p class="text-xs text-muted-foreground">Need help getting started? `);
			Button($$renderer, {
				href: "/help",
				variant: "link",
				class: "text-primary p-0 h-auto",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Visit our help center`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></p></div></div></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _layout_ as default };
