import { yt as spread_props } from "../../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../../chunks/Icon.js";
import { t as Button } from "../../../../../../chunks/button.js";
import { a as Card, i as Card_content, n as Card_header, r as Card_description, t as Card_title } from "../../../../../../chunks/card.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/mail-check.svelte
function Mail_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "mail-check" },
		props,
		{ iconNode: [
			["path", { "d": "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }],
			["path", { "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
			["path", { "d": "m16 19 2 2 4-4" }]
		] }
	]));
}
//#endregion
//#region src/lib/authentication/ui/pages/auth-forget-password-success.svelte
function Auth_forget_password_success($$renderer) {
	$$renderer.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
	Card($$renderer, {
		class: "w-full max-w-md text-center",
		children: ($$renderer) => {
			Card_header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">`);
					Mail_check($$renderer, { class: "h-8 w-8 text-green-600" });
					$$renderer.push(`<!----></div> `);
					Card_title($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Check Your Email`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_description($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->We've sent a password reset link to your email address. Please check your inbox.`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card_content($$renderer, {
				children: ($$renderer) => {
					Button($$renderer, {
						href: "/auth/login",
						variant: "outline",
						class: "w-full",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Back to Login`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div>`);
}
//#endregion
//#region src/routes/(auth)/auth/forget-password/success/+page.svelte
function _page($$renderer) {
	Auth_forget_password_success($$renderer, {});
}
//#endregion
export { _page as default };
