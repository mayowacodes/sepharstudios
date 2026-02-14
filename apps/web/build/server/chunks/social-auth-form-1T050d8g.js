import { C as attr_class, l as clsx, p as prevent_snippet_stringification, E as escape_html } from './index-C14HL8mA.js';
import { b as Card_title, d as Card_description } from './card-title-C-y0C6UW.js';
import { C as Constants } from './index4-Cnd3Rmm9.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { B as Button } from './button-B5TxIyzE.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { L as Loading_spinner } from './loading-spinner-BYlcQqmo.js';
import { a as signIn } from './auth-client-BmG0Nu2w.js';
import { a as toast } from './toast-state.svelte-CJQQ3D3L.js';

const getRedirectUrl = () => {
  return Constants.AFTERAUTH;
};
const handleSocialSignin = async (provider, callbackURL) => {
  await signIn.social({ provider, callbackURL }, {
    onSuccess: () => toast.success("Success Alert", { description: "Successful Sign in" }),
    onError: (ctx) => toast.error("Error Alert", { description: ctx.error.message })
  });
};
Auth_card_header[FILENAME] = "src/lib/authentication/ui/auth-card-header.svelte";
function Auth_card_header($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { title, description, class: className } = $$props;
      $$renderer2.push(`<div${attr_class(clsx(className))}>`);
      push_element($$renderer2, "div", 7, 0);
      $$renderer2.push(`<a href="/" class="flex items-center gap-2 self-center font-medium">`);
      push_element($$renderer2, "a", 8, 1);
      $$renderer2.push(`<div class="flex flex-col">`);
      push_element($$renderer2, "div", 9, 2);
      $$renderer2.push(`<!---->`);
      Card_title($$renderer2, {
        class: "text-xl",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(title)} ${escape_html(Constants.BRANDNAME)}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <!---->`);
      Card_description($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(description)}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    Auth_card_header
  );
}
Auth_card_header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Google_icon[FILENAME] = "src/lib/authentication/ui/google-icon.svelte";
function Google_icon($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className } = $$props;
      $$renderer2.push(`<svg${attr_class(clsx(cn("mr-2 h-4 w-4", className)))} viewBox="-0.5 0 48 48">`);
      push_element($$renderer2, "svg", 6, 0);
      $$renderer2.push(`<path d="m 9.8272727,24 c 0,-1.524267 0.2531593,-2.9856 0.7050003,-4.356267 L 2.6234546,13.604267 C 1.0820682,16.733867 0.21363636,20.260267 0.21363636,24 c 0,3.736533 0.86736364,7.2608 2.40661364,10.388267 l 7.904546,-6.0512 C 10.077227,26.9728 9.8272727,25.5168 9.8272727,24" fill="#fbbc05" style="fill-rule:evenodd">`);
      push_element($$renderer2, "path", 7, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`<path d="m 23.713636,10.133333 c 3.311364,0 6.302273,1.173334 8.652273,3.093334 L 39.202273,6.4 C 35.036364,2.7733333 29.695454,0.53333333 23.713636,0.53333333 c -9.286772,0 -17.2682269,5.31093337 -21.0901814,13.07093367 l 7.9088184,6.039466 c 1.822318,-5.531733 7.016886,-9.5104 13.181363,-9.5104" fill="#eb4335" style="fill-rule:evenodd">`);
      push_element($$renderer2, "path", 8, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`<path d="m 23.713636,37.866667 c -6.164477,0 -11.359045,-3.978667 -13.181363,-9.5104 l -7.9088184,6.0384 c 3.8219545,7.761066 11.8034094,13.072 21.0901814,13.072 5.731864,0 11.204159,-2.0352 15.311318,-5.848534 L 31.517773,35.8144 c -2.118205,1.3344 -4.785455,2.052267 -7.804137,2.052267" fill="#34a853" style="fill-rule:evenodd">`);
      push_element($$renderer2, "path", 9, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`<path d="m 46.145454,24 c 0,-1.386667 -0.213636,-2.88 -0.53409,-4.266667 H 23.713636 V 28.8 h 12.604546 c -0.630228,3.0912 -2.345728,5.467733 -4.800409,7.0144 l 7.507181,5.803733 C 43.339341,37.613867 46.145454,31.649067 46.145454,24" fill="#4285f4" style="fill-rule:evenodd">`);
      push_element($$renderer2, "path", 10, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Google_icon
  );
}
Google_icon.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Social_auth_form[FILENAME] = "src/lib/authentication/ui/social-auth-form.svelte";
function Social_auth_form($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { text } = $$props;
      let isSocialLoading = false;
      const callbackURL = getRedirectUrl();
      const handleSocial = async () => {
        isSocialLoading = true;
        await handleSocialSignin("google", callbackURL);
        isSocialLoading = false;
      };
      $$renderer2.push(`<div class="flex flex-col gap-4">`);
      push_element($$renderer2, "div", 17, 0);
      Button($$renderer2, {
        variant: "outline",
        class: "w-full",
        type: "button",
        disabled: isSocialLoading,
        onclick: handleSocial,
        children: prevent_snippet_stringification(($$renderer3) => {
          if (isSocialLoading) {
            $$renderer3.push("<!--[-->");
            Loading_spinner($$renderer3, {});
            $$renderer3.push(`<!---->Loading...`);
          } else {
            $$renderer3.push("<!--[!-->");
            Google_icon($$renderer3, {});
            $$renderer3.push(`<!---->${escape_html(text)}`);
          }
          $$renderer3.push(`<!--]-->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    Social_auth_form
  );
}
Social_auth_form.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Auth_card_header as A, Social_auth_form as S, getRedirectUrl as g };
//# sourceMappingURL=social-auth-form-1T050d8g.js.map
