import { b as push_element, p as prevent_snippet_stringification, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { B as Button } from './button-C1v8XzqW.js';
import { I as Input } from './input-CTVv5zOe.js';
import { L as Label } from './label-99BY3xOG.js';
import './auth-client-CKB8eq8F.js';
import './loading-spinner-CzOnEu1I.js';
import { C as Card, a as Card_header, b as Card_title, d as Card_description, c as Card_content } from './card-title-Bb6tCQUO.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './defu-DQ_N96GS.js';
import 'zod';
import './index-DDpoV-rm.js';
import './Icon-DVHDtCfs.js';
import './layout-dashboard-xPr2miEu.js';
import './users-B4M3or-k.js';
import './user-CxFDLytf.js';
import './shared-server-BeisX7n9.js';

Forget_password_form[FILENAME] = "src/lib/authentication/ui/forget-password-form.svelte";
function Forget_password_form($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<form class="w-full max-w-sm space-y-4">`);
      push_element($$renderer2, "form", 42, 0);
      $$renderer2.push(`<div class="flex w-full flex-col gap-2">`);
      push_element($$renderer2, "div", 43, 1);
      Label($$renderer2, {
        for: "email",
        class: "font-medium",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Email Address`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Input($$renderer2, {
        id: "email",
        name: "email",
        type: "email",
        placeholder: "Enter your email",
        required: true,
        class: "w-full"
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
        Button($$renderer2, {
          type: "submit",
          class: "w-full",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Send Reset Link`);
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></form>`);
      pop_element();
    },
    Forget_password_form
  );
}
Forget_password_form.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Auth_forget_password[FILENAME] = "src/lib/authentication/ui/pages/auth-forget-password.svelte";
function Auth_forget_password($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
      push_element($$renderer2, "div", 5, 0);
      Card($$renderer2, {
        class: "w-full max-w-md",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Forgot Password`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Card_description($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Enter your email to receive a password reset link`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Forget_password_form($$renderer4);
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
    Auth_forget_password
  );
}
Auth_forget_password.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(auth)/auth/forget-password/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Auth_forget_password($$renderer2);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CIHr6hwI.js.map
