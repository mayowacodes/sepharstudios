import './index.js-DwRgOKlO.js';
import './auth-client-CfxjbcXZ.js';
import { I as Input } from './input-BgrW0-uG.js';
import { B as Button } from './button-CGRNF9DE.js';
import { C as Card, a as Card_header, d as Card_content, c as Card_title, b as Card_description } from './card-BPxJt-G5.js';
import { L as Label } from './label-BQMLimC0.js';
import './string-BwaV7M5i.js';
import './constants-RccSloty.js';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';
import './utils2-DHW1aw82.js';
import './index-CMAaDatn.js';

//#region src/lib/authentication/ui/forget-password-form.svelte
function Forget_password_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<form class="w-full max-w-sm space-y-4"><div class="flex w-full flex-col gap-2">`);
		Label($$renderer, {
			for: "email",
			class: "font-medium",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Email Address`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Input($$renderer, {
			id: "email",
			name: "email",
			type: "email",
			placeholder: "Enter your email",
			required: true,
			class: "w-full"
		});
		$$renderer.push(`<!----></div> `);
		$$renderer.push("<!--[-1-->");
		Button($$renderer, {
			type: "submit",
			class: "w-full",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Send Reset Link`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!--]--></form>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/pages/auth-forget-password.svelte
function Auth_forget_password($$renderer) {
	$$renderer.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
	Card($$renderer, {
		class: "w-full max-w-md",
		children: ($$renderer) => {
			Card_header($$renderer, {
				children: ($$renderer) => {
					Card_title($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Forgot Password`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_description($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Enter your email to receive a password reset link`);
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
					Forget_password_form($$renderer);
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
//#region src/routes/(auth)/auth/forget-password/+page.svelte
function _page($$renderer) {
	Auth_forget_password($$renderer);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-mxvFdfp_.js.map
