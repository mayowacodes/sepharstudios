import { At as clsx, St as stringify, ft as attributes, jt as escape_html, kt as attr } from "../../../../../chunks/ui-libs.js";
import "../../../../../chunks/auth-client.js";
import "../../../../../chunks/constants.js";
import { t as Eye_off } from "../../../../../chunks/eye-off.js";
import { t as Eye } from "../../../../../chunks/eye.js";
import { t as cn } from "../../../../../chunks/utils2.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Input } from "../../../../../chunks/input.js";
import { a as Card, i as Card_content, n as Card_header } from "../../../../../chunks/card.js";
import { t as Label } from "../../../../../chunks/label.js";
import "../../../../../chunks/loading-spinner.js";
import { t as getRedirectUrl } from "../../../../../chunks/client2.js";
import { n as Auth_card_header, t as Social_auth_form } from "../../../../../chunks/social-auth-form.js";
//#region src/lib/authentication/ui/email-password-form-register.svelte
function Email_password_form_register($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className, $$slots, $$events, ...restProps } = $$props;
		let isLoading = false;
		let isSocialLoading = false;
		let errors = {};
		let showPassword = false;
		const id = crypto.randomUUID();
		getRedirectUrl();
		$$renderer.push(`<form class="grid gap-3" aria-label="Create account form" novalidate="">`);
		if (errors.general) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div role="alert" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">${escape_html(errors.general)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid gap-2">`);
		Label($$renderer, {
			for: `name-${stringify(id)}`,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Name`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Input($$renderer, {
			id: `name-${stringify(id)}`,
			type: "text",
			name: "name",
			placeholder: "John Doe",
			required: true,
			disabled: isLoading,
			class: cn(errors.name && "border-red-500"),
			autocomplete: "name",
			"aria-invalid": !!errors.name,
			"aria-describedby": errors.name ? `name-error-${id}` : void 0
		});
		$$renderer.push(`<!----> `);
		if (errors.name) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p${attr("id", `name-error-${stringify(id)}`)} class="text-sm text-red-500" role="alert">${escape_html(errors.name)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
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
		$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
		Label($$renderer, {
			for: `password-${stringify(id)}`,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Password`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="relative w-full">`);
		Input($$renderer, {
			id: `password-${stringify(id)}`,
			name: "password",
			type: showPassword ? "text" : "password",
			placeholder: "Your password...",
			required: true,
			disabled: isLoading,
			class: cn(errors.password && "border-red-500 pr-10"),
			autocomplete: "new-password",
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
				$$renderer.push(`Signup`);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></form> <div class="flex items-center justify-end gap-4"><div class="text-right text-sm">Already have an account? <a${attr("href", `/auth/login?redirectTo=${stringify(encodeURIComponent(getRedirectUrl()))}`)} class="underline underline-offset-4 hover:no-underline">Log in</a></div></div>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/register-form.svelte
function Divider($$renderer) {
	$$renderer.push(`<div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"><span class="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span></div>`);
}
function Register_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			class: clsx(cn("flex flex-col gap-6", className)),
			...restProps
		})}>`);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				class: "max-w-lg",
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								Auth_card_header($$renderer, {
									title: "Create account on",
									description: "Welcome! Create an account to get started"
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
								Social_auth_form($$renderer, { text: "Sign up with Google" });
								$$renderer.push(`<!----> `);
								Divider($$renderer);
								$$renderer.push(`<!----> `);
								Email_password_form_register($$renderer, {});
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
//#region src/lib/authentication/ui/pages/auth-register.svelte
function Auth_register($$renderer) {
	$$renderer.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
	Register_form($$renderer, { class: "w-full max-w-sm" });
	$$renderer.push(`<!----></div>`);
}
//#endregion
//#region src/routes/(auth)/auth/register/+page.svelte
function _page($$renderer) {
	Auth_register($$renderer, {});
}
//#endregion
export { _page as default };
