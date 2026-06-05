import './ui-libs-BjzLDLAh.js';
import './auth-client-Cjc1-W_A.js';
import { I as Input } from './input-yLzKHphO.js';
import { B as Button } from './button-DY9ayrhs.js';
import { C as Card, c as Card_header, a as Card_content, d as Card_title, b as Card_description } from './card-DVq40lxr.js';
import { L as Label } from './label-DNCU-Jw_.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import './string-DVvRuJqu.js';
import './constants-BEpeHz1K.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';

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
//# sourceMappingURL=_page.svelte-Dr_szi5Z.js.map
