import { ad as attributes, ag as clsx$1, an as escape_html, aK as stringify, aa as attr } from './ui-libs-TtGtWAGI.js';
import './auth-client-cjgC9VE2.js';
import { E as Eye_off } from './eye-off-C_8WDQet.js';
import { E as Eye } from './eye-sQYCeVmz.js';
import { c as cn } from './utils2-C8dWVCac.js';
import { B as Button } from './button-D9M18H3C.js';
import { I as Input } from './input-BHWqom2S.js';
import { C as Card, c as Card_header, a as Card_content } from './card-DdzYeJGJ.js';
import { L as Label } from './label-BV40bMri.js';
import { A as Auth_card_header, S as Social_auth_form, g as getRedirectUrl } from './social-auth-form-CtZZhd0E.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import './string-BCawZznR.js';
import './constants-ChVx7CIu.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';
import './index-CGfbhb6a.js';
import './loading-spinner-CHzoSH-Q.js';
import './toast-state.svelte-BmEXLjm2.js';

//#region src/lib/authentication/ui/email-password-form.svelte
function Email_password_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className, $$slots, $$events, ...restProps } = $$props;
		let isLoading = false;
		let isSocialLoading = false;
		let errors = {};
		let showPassword = false;
		const id = crypto.randomUUID();
		$$renderer.push(`<form class="grid gap-3" aria-label="Sign in form" novalidate="">`);
		if (errors.general) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div role="alert" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">${escape_html(errors.general)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid gap-2">`);
		Label($$renderer, {
			for: `email-${stringify(id)}`,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Email`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Input($$renderer, {
			id: `email-${stringify(id)}`,
			type: "email",
			name: "email",
			placeholder: "m@example.com",
			required: true,
			disabled: isLoading,
			class: cn(errors.email && "border-red-500"),
			autocomplete: "email",
			"aria-invalid": !!errors.email,
			"aria-describedby": errors.email ? `email-error-${id}` : void 0
		});
		$$renderer.push(`<!----> `);
		if (errors.email) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p${attr("id", `email-error-${stringify(id)}`)} class="text-sm text-red-500" role="alert">${escape_html(errors.email)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="grid gap-2"><div class="flex w-full items-center justify-between">`);
		Label($$renderer, {
			for: `password-${stringify(id)}`,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Password`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			href: `/auth/forget-password?redirectTo=${stringify(encodeURIComponent(getRedirectUrl()))}`,
			class: "h-fit px-0 text-muted-foreground",
			variant: "link",
			size: "sm",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Forgot your password?`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> <div class="relative w-full">`);
		Input($$renderer, {
			id: `password-${stringify(id)}`,
			name: "password",
			type: showPassword ? "text" : "password",
			placeholder: "Your password...",
			required: true,
			disabled: isLoading,
			class: cn(errors.password && "border-red-500 pr-10"),
			autocomplete: "current-password",
			"aria-invalid": !!errors.password,
			"aria-describedby": errors.password ? `password-error-${id}` : void 0
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			onclick: () => showPassword = !showPassword,
			class: "absolute right-0 bottom-0",
			variant: "ghost",
			size: "icon",
			"aria-label": showPassword ? "Hide password" : "Show password",
			"aria-pressed": showPassword,
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
		$$renderer.push(`<!----></div> `);
		if (errors.password) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p${attr("id", `password-error-${stringify(id)}`)} class="text-sm text-red-500" role="alert">${escape_html(errors.password)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		Button($$renderer, {
			type: "submit",
			class: "w-full",
			disabled: isSocialLoading,
			children: ($$renderer) => {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Signin`);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></form> <div class="flex items-center justify-end gap-4"><div class="text-right text-sm">Don't have an account? <a${attr("href", `/auth/register?redirectTo=${stringify(encodeURIComponent(getRedirectUrl()))}`)} class="underline underline-offset-4 hover:no-underline">Register</a></div></div>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/login-form.svelte
function Divider($$renderer) {
	$$renderer.push(`<div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"><span class="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span></div>`);
}
function Login_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			class: clsx$1(cn("flex flex-col gap-6", className)),
			...restProps
		})}>`);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								Auth_card_header($$renderer, {
									title: "Sign in to",
									description: "Welcome back! Sign in to continue"
								});
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<div class="grid gap-6">`);
								Social_auth_form($$renderer, { text: "Sign in with Google" });
								$$renderer.push(`<!----> `);
								Divider($$renderer);
								$$renderer.push(`<!----> `);
								Email_password_form($$renderer, {});
								$$renderer.push(`<!----></div>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/pages/auth-login.svelte
function Auth_login($$renderer) {
	$$renderer.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
	Login_form($$renderer, { class: "w-full max-w-sm" });
	$$renderer.push(`<!----></div>`);
}
//#endregion
//#region src/routes/(auth)/auth/login/+page.svelte
function _page($$renderer) {
	Auth_login($$renderer);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DKbgVbMt.js.map
