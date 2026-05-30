import { ab as attr_class, ag as clsx$1, an as escape_html } from './ui-libs-TtGtWAGI.js';
import './auth-client-cjgC9VE2.js';
import { E as Eye_off } from './eye-off-C_8WDQet.js';
import { E as Eye } from './eye-sQYCeVmz.js';
import './client-CZa6R-ON.js';
import { c as cn } from './utils2-C8dWVCac.js';
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
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';
import './index-CGfbhb6a.js';

//#region src/lib/authentication/ui/reset-password-form.svelte
function Reset_password_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className, action = "Reset Password" } = $$props;
		let showPassword = false;
		$$renderer.push(`<form${attr_class(clsx$1(cn("w-full space-y-4", className)))}><div class="flex w-full flex-col gap-2">`);
		Label($$renderer, {
			for: "password",
			class: "font-medium",
			children: ($$renderer) => {
				$$renderer.push(`<!---->New Password`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="relative w-full">`);
		Input($$renderer, {
			id: "password",
			name: "password",
			type: showPassword ? "text" : "password",
			placeholder: "Enter your new password",
			required: true,
			class: "w-full pr-10"
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			onclick: () => showPassword = !showPassword,
			class: "absolute right-0 bottom-0",
			variant: "ghost",
			size: "icon",
			children: ($$renderer) => {
				if (showPassword) {
					$$renderer.push("<!--[0-->");
					Eye($$renderer, {});
				} else {
					$$renderer.push("<!--[-1-->");
					Eye_off($$renderer, {});
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> <div class="flex w-full flex-col gap-2">`);
		Label($$renderer, {
			for: "confirmPassword",
			class: "font-medium",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Confirm Password`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Input($$renderer, {
			id: "confirmPassword",
			name: "confirmPassword",
			type: "password",
			placeholder: "Confirm your new password",
			required: true,
			class: "w-full pr-10"
		});
		$$renderer.push(`<!----></div> `);
		$$renderer.push("<!--[-1-->");
		Button($$renderer, {
			type: "submit",
			class: "w-full",
			children: ($$renderer) => {
				$$renderer.push(`<!---->${escape_html(action)}`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!--]--></form>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/pages/auth-reset-password.svelte
function Auth_reset_password($$renderer) {
	$$renderer.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
	Card($$renderer, {
		class: "w-full max-w-md",
		children: ($$renderer) => {
			Card_header($$renderer, {
				children: ($$renderer) => {
					Card_title($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Reset Password`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_description($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Enter your new password`);
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
					Reset_password_form($$renderer, {});
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
//#region src/routes/(auth)/auth/reset-password/+page.svelte
function _page($$renderer) {
	Auth_reset_password($$renderer);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CD0VFOPJ.js.map
