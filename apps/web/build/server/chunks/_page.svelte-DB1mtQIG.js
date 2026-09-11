import './index.js-BP8aAXBX.js';
import './auth-client-DeH3Z58S.js';
import { I as Input } from './input-EQDlPT2V.js';
import { B as Button } from './button--do5FSjb.js';
import { C as Card, a as Card_header, d as Card_content, c as Card_title, b as Card_description } from './card-BAW-4xbt.js';
import { L as Label } from './label-C1iXsXqG.js';
import './string-BQbu2QdC.js';
import './constants-DSOCQRom.js';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';
import './utils2-CqskQpUP.js';
import './index-D1eQaiDA.js';

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
//# sourceMappingURL=_page.svelte-DB1mtQIG.js.map
