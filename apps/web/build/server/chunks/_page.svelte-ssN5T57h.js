import './ui-libs-TtGtWAGI.js';
import './auth-client-cjgC9VE2.js';
import { B as Button } from './button-D9M18H3C.js';
import { I as Input } from './input-BHWqom2S.js';
import { C as Card, c as Card_header, a as Card_content, d as Card_title, b as Card_description } from './card-DdzYeJGJ.js';
import { L as Label } from './label-BV40bMri.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import './string-BCawZznR.js';
import './constants-ChVx7CIu.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

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
//# sourceMappingURL=_page.svelte-ssN5T57h.js.map
