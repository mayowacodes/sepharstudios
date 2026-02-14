import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as push_element, a as pop_element, v as validate_snippet_args } from './dev-cqarhAJ0.js';
import { h as attributes, l as clsx, p as prevent_snippet_stringification, E as escape_html, x as stringify, u as attr } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { C as Card, a as Card_header, c as Card_content } from './card-title-C-y0C6UW.js';
import { A as Auth_card_header, S as Social_auth_form, g as getRedirectUrl } from './social-auth-form-1T050d8g.js';
import { B as Button } from './button-B5TxIyzE.js';
import { L as Label } from './label-Bh2yW0Jf.js';
import { I as Input } from './input-BHRan7UY.js';
import './loading-spinner-BYlcQqmo.js';
import './auth-client-BmG0Nu2w.js';
import './index4-Cnd3Rmm9.js';
import { E as Eye } from './eye-Da_d-AVQ.js';
import { E as Eye_off } from './eye-off-Wh0l7jZa.js';
import './toast-state.svelte-CJQQ3D3L.js';
import './create-id-ozwDP4rH.js';
import './defu-BDNAzC90.js';
import 'zod';
import './shared-server-BeisX7n9.js';
import './Icon-DLeFNkXp.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';

Email_password_form_register[FILENAME] = "src/lib/authentication/ui/email-password-form-register.svelte";
function Email_password_form_register($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className, $$slots, $$events, ...restProps } = $$props;
      let isLoading = false;
      let isSocialLoading = false;
      let errors = {};
      let showPassword = false;
      const id = crypto.randomUUID();
      $$renderer2.push(`<form class="grid gap-3">`);
      push_element($$renderer2, "form", 51, 0);
      if (errors.general) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">`);
        push_element($$renderer2, "div", 52, 21);
        $$renderer2.push(`${escape_html(errors.general)}</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="grid gap-2">`);
      push_element($$renderer2, "div", 53, 1);
      Label($$renderer2, {
        for: `name-${stringify(id)}`,
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Name`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Input($$renderer2, {
        id: `name-${stringify(id)}`,
        type: "text",
        name: "name",
        placeholder: "John Doe",
        required: true,
        disabled: isLoading,
        class: cn(errors.name && "border-red-500"),
        autocomplete: "name"
      });
      $$renderer2.push(`<!----> `);
      if (errors.name) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-red-500">`);
        push_element($$renderer2, "p", 56, 19);
        $$renderer2.push(`${escape_html(errors.name)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="grid gap-2">`);
      push_element($$renderer2, "div", 58, 1);
      Label($$renderer2, {
        for: `email-${stringify(id)}`,
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Email`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Input($$renderer2, {
        id: `email-${stringify(id)}`,
        type: "email",
        name: "email",
        placeholder: "m@example.com",
        required: true,
        disabled: isLoading,
        class: cn(errors.email && "border-red-500"),
        autocomplete: "email"
      });
      $$renderer2.push(`<!----> `);
      if (errors.email) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-red-500">`);
        push_element($$renderer2, "p", 61, 20);
        $$renderer2.push(`${escape_html(errors.email)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="grid gap-2">`);
      push_element($$renderer2, "div", 63, 1);
      Label($$renderer2, {
        for: `password-${stringify(id)}`,
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Password`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="relative w-full">`);
      push_element($$renderer2, "div", 65, 2);
      Input($$renderer2, {
        id: `password-${stringify(id)}`,
        name: "password",
        type: showPassword ? "text" : "password",
        placeholder: "Your password...",
        required: true,
        disabled: isLoading,
        class: cn(errors.password && "border-red-500 pr-10"),
        autocomplete: "new-password"
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        onclick: () => showPassword = !showPassword,
        class: "absolute right-0 bottom-0",
        variant: "ghost",
        size: "icon",
        children: prevent_snippet_stringification(($$renderer3) => {
          if (showPassword) {
            $$renderer3.push("<!--[-->");
            Eye($$renderer3, {});
          } else {
            $$renderer3.push("<!--[!-->");
            Eye_off($$renderer3, {});
          }
          $$renderer3.push(`<!--]-->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (errors.password) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-red-500">`);
        push_element($$renderer2, "p", 71, 23);
        $$renderer2.push(`${escape_html(errors.password)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      Button($$renderer2, {
        type: "submit",
        class: "w-full",
        disabled: isSocialLoading,
        children: prevent_snippet_stringification(($$renderer3) => {
          {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`Signup`);
          }
          $$renderer3.push(`<!--]-->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></form>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center justify-end gap-4">`);
      push_element($$renderer2, "div", 77, 0);
      $$renderer2.push(`<div class="text-right text-sm">`);
      push_element($$renderer2, "div", 78, 1);
      $$renderer2.push(`Already have an account? <a${attr("href", `/auth/login?redirectTo=${stringify(encodeURIComponent(getRedirectUrl()))}`)} class="underline underline-offset-4 hover:no-underline">`);
      push_element($$renderer2, "a", 80, 2);
      $$renderer2.push(`Log in</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    Email_password_form_register
  );
}
Email_password_form_register.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Register_form[FILENAME] = "src/lib/authentication/ui/register-form.svelte";
prevent_snippet_stringification(Divider);
function Divider($$renderer) {
  validate_snippet_args($$renderer);
  $$renderer.push(`<div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">`);
  push_element($$renderer, "div", 12, 1);
  $$renderer.push(`<span class="relative z-10 bg-card px-2 text-muted-foreground">`);
  push_element($$renderer, "span", 13, 2);
  $$renderer.push(`Or continue with</span>`);
  pop_element();
  $$renderer.push(`</div>`);
  pop_element();
}
function Register_form($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className, $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<div${attributes({
        class: clsx(cn("flex flex-col gap-6", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 16, 0);
      $$renderer2.push(`<!---->`);
      Card($$renderer2, {
        class: "max-w-lg",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->`);
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Auth_card_header($$renderer4, {
                title: "Create account on",
                description: "Welcome! Create an account to get started"
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <!---->`);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="grid gap-6">`);
              push_element($$renderer4, "div", 22, 3);
              Social_auth_form($$renderer4, { text: "Sign up with Google" });
              $$renderer4.push(`<!----> `);
              Divider($$renderer4);
              $$renderer4.push(`<!----> `);
              Email_password_form_register($$renderer4, {});
              $$renderer4.push(`<!----></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    Register_form
  );
}
Register_form.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Auth_register[FILENAME] = "src/lib/authentication/ui/pages/auth-register.svelte";
function Auth_register($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
      push_element($$renderer2, "div", 4, 0);
      Register_form($$renderer2, { class: "w-full max-w-sm" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    Auth_register
  );
}
Auth_register.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(auth)/auth/register/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Auth_register($$renderer2);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CU-FrIK4.js.map
