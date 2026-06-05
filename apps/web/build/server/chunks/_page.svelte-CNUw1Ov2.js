import { ai as attr_class, an as clsx$1, au as escape_html } from './ui-libs-BjzLDLAh.js';
import { E as Eye_off } from './eye-off-D8_Msbvt.js';
import { E as Eye } from './eye-GDuWLMeR.js';
import './auth-client-Cjc1-W_A.js';
import './client-Bo2aevGq.js';
import { c as cn } from './utils2-BaRxD-PE.js';
import { I as Input } from './input-yLzKHphO.js';
import { B as Button } from './button-DY9ayrhs.js';
import { C as Card, c as Card_header, a as Card_content, d as Card_title, b as Card_description } from './card-DVq40lxr.js';
import { L as Label } from './label-DNCU-Jw_.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './shared-server-DUDL94jl.js';
import './string-DVvRuJqu.js';
import './constants-BEpeHz1K.js';
import './file-text-C_v9vOk2.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';
import './index-DHDJW1Vo.js';

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
//# sourceMappingURL=_page.svelte-CNUw1Ov2.js.map
