import { x as attr_class, c as clsx$1, q as escape_html } from './index.js-CxPEndTa.js';
import { E as Eye_off } from './eye-off-BlMWdH_R.js';
import { E as Eye } from './eye-BQ2rWv_J.js';
import './auth-client-D2kTnJzE.js';
import './client-DsZfmj3l.js';
import { c as cn } from './utils2-DZI6czOR.js';
import { I as Input } from './input-CHV7EKkW.js';
import { B as Button } from './button-DtPBvYl-.js';
import { C as Card, a as Card_header, c as Card_content, b as Card_title, d as Card_description } from './card-BuaI8-6J.js';
import { L as Label } from './label-BnqN6F4y.js';
import './Icon-Bw1rnKTC.js';
import './string-Buf0XXqb.js';
import './constants-BiiFHz9b.js';
import './file-text-By5QqCz6.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';
import './index-BoGG3uCW.js';

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
//# sourceMappingURL=_page.svelte-Cy7ST_xu.js.map
