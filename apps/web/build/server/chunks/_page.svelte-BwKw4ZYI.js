import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as prevent_snippet_stringification, g as spread_props } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Card, a as Card_header, b as Card_title, d as Card_description, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Button } from './button-B5TxIyzE.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import './utils2-C-_3GP94.js';

Mail_check[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/mail-check.svelte";
function Mail_check($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"
          }
        ],
        ["path", { "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
        ["path", { "d": "m16 19 2 2 4-4" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "mail-check" },
        /**
         * @component @name MailCheck
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTNWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnYxMmMwIDEuMS45IDIgMiAyaDgiIC8+CiAgPHBhdGggZD0ibTIyIDctOC45NyA1LjdhMS45NCAxLjk0IDAgMCAxLTIuMDYgMEwyIDciIC8+CiAgPHBhdGggZD0ibTE2IDE5IDIgMiA0LTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/mail-check
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Mail_check
  );
}
Mail_check.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Auth_forget_password_success[FILENAME] = "src/lib/authentication/ui/pages/auth-forget-password-success.svelte";
function Auth_forget_password_success($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">`);
      push_element($$renderer2, "div", 6, 0);
      Card($$renderer2, {
        class: "w-full max-w-md text-center",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">`);
              push_element($$renderer4, "div", 9, 3);
              Mail_check($$renderer4, { class: "h-8 w-8 text-green-600" });
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(` `);
              Card_title($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Check Your Email`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Card_description($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->We've sent a password reset link to your email address. Please check your inbox.`);
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
              Button($$renderer4, {
                href: "/auth/login",
                variant: "outline",
                class: "w-full",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Back to Login`);
                }),
                $$slots: { default: true }
              });
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
    Auth_forget_password_success
  );
}
Auth_forget_password_success.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(auth)/auth/forget-password/success/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Auth_forget_password_success($$renderer2);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-BwKw4ZYI.js.map
