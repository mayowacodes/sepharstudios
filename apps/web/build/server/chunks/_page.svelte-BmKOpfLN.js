import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as prevent_snippet_stringification, C as attr_class, l as clsx, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { B as Button } from './button-B5TxIyzE.js';
import { I as Input } from './input-BHRan7UY.js';
import { L as Label } from './label-Bh2yW0Jf.js';
import './auth-client-BmG0Nu2w.js';
import './loading-spinner-BYlcQqmo.js';
import { p as page } from './index2-DN4t2Pgp.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { E as Eye } from './eye-Da_d-AVQ.js';
import { E as Eye_off } from './eye-off-Wh0l7jZa.js';
import { C as Card, a as Card_header, b as Card_title, d as Card_description, c as Card_content } from './card-title-C-y0C6UW.js';
import './create-id-ozwDP4rH.js';
import './defu-BDNAzC90.js';
import 'zod';
import './index4-Cnd3Rmm9.js';
import './Icon-DLeFNkXp.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';
import './shared-server-BeisX7n9.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';

Reset_password_form[FILENAME] = "src/lib/authentication/ui/reset-password-form.svelte";
function Reset_password_form($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className, action = "Reset Password" } = $$props;
      let showPassword = false;
      String(page.url.searchParams.get("token"));
      $$renderer2.push(`<form${attr_class(clsx(cn("w-full space-y-4", className)))}>`);
      push_element($$renderer2, "form", 32, 0);
      $$renderer2.push(`<div class="flex w-full flex-col gap-2">`);
      push_element($$renderer2, "div", 33, 1);
      Label($$renderer2, {
        for: "password",
        class: "font-medium",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->New Password`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="relative w-full">`);
      push_element($$renderer2, "div", 35, 2);
      Input($$renderer2, {
        id: "password",
        name: "password",
        type: showPassword ? "text" : "password",
        placeholder: "Enter your new password",
        required: true,
        class: "w-full pr-10"
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
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex w-full flex-col gap-2">`);
      push_element($$renderer2, "div", 42, 1);
      Label($$renderer2, {
        for: "confirmPassword",
        class: "font-medium",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Confirm Password`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Input($$renderer2, {
        id: "confirmPassword",
        name: "confirmPassword",
        type: "password",
        placeholder: "Confirm your new password",
        required: true,
        class: "w-full pr-10"
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
            $$renderer3.push(`<!---->${escape_html(action)}`);
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></form>`);
      pop_element();
    },
    Reset_password_form
  );
}
Reset_password_form.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Auth_reset_password[FILENAME] = "src/lib/authentication/ui/pages/auth-reset-password.svelte";
function Auth_reset_password($$renderer, $$props) {
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
                  $$renderer5.push(`<!---->Reset Password`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Card_description($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Enter your new password`);
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
              Reset_password_form($$renderer4, {});
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
    Auth_reset_password
  );
}
Auth_reset_password.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(auth)/auth/reset-password/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Auth_reset_password($$renderer2);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-BmKOpfLN.js.map
