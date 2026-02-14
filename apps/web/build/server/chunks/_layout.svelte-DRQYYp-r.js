import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { m as ensure_array_like, p as prevent_snippet_stringification, E as escape_html, u as attr, x as stringify } from './index-C14HL8mA.js';
import { p as page } from './index2-DN4t2Pgp.js';
import { g as getNavigation, C as Constants, L as Logo } from './index4-Cnd3Rmm9.js';
import { M as ModeToggle, A as Auth_dialog } from './auth-dialog-YCvZogn2.js';
import { B as Button } from './button-B5TxIyzE.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';
import './Icon-DLeFNkXp.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';
import './mode-watcher-B7MTKdAr.js';
import './index-server-_G0R5Qhl.js';
import './auth-client-BmG0Nu2w.js';
import './defu-BDNAzC90.js';
import 'zod';
import './shared-server-BeisX7n9.js';
import './fxn-BOos7yUf.js';
import './avatar-fallback-Sz8ic2oI.js';
import './utils2-C-_3GP94.js';
import './create-id-ozwDP4rH.js';
import './watch.svelte-ALR66MkX.js';
import './dom-context.svelte-DOhd7vND.js';
import './badge-DBgw54iF.js';
import './dropdown-menu-trigger-DAk9gdtZ.js';
import './scroll-lock-BKaGX-xL.js';
import './noop-JjG5qwPG.js';
import './events-DndNBaun.js';
import './popper-layer-force-mount-DvMEtyRB.js';
import './toast-state.svelte-CJQQ3D3L.js';

BrandLink[FILENAME] = "src/lib/components/widgets/BrandLink.svelte";
function BrandLink($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<a href="/" rel="prefetch" aria-label="logo" class="flex items-center gap-2">`);
      push_element($$renderer2, "a", 5, 0);
      Logo($$renderer2, { class: "w-[70px] h-[40px]" });
      $$renderer2.push(`<!----> <span class="font-bold text-lg hidden sm:block">`);
      push_element($$renderer2, "span", 7, 2);
      $$renderer2.push(`${escape_html(Constants.BRANDNAME)}</span>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
    },
    BrandLink
  );
}
BrandLink.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Header[FILENAME] = "src/lib/components/sections/header.svelte";
function Header($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const user = page.data.user;
      const navData = getNavigation(page.url.pathname);
      const navigation = user ? navData.privateNav : navData.publicNav;
      const isActive = (path) => page.url.pathname === path;
      $$renderer2.push(`<div class="bg-background sticky top-0 left-0 z-[11]">`);
      push_element($$renderer2, "div", 17, 0);
      $$renderer2.push(`<header class="border-b shadow-sm">`);
      push_element($$renderer2, "header", 18, 2);
      $$renderer2.push(`<div class="center">`);
      push_element($$renderer2, "div", 19, 4);
      $$renderer2.push(`<div class="flex h-16 items-center justify-between">`);
      push_element($$renderer2, "div", 20, 6);
      BrandLink($$renderer2);
      $$renderer2.push(`<!----> <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 22, 8);
      $$renderer2.push(`<nav class="hidden space-x-2 md:flex">`);
      push_element($$renderer2, "nav", 23, 10);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(navigation);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        if (!user || user && item.roles.includes(user.role)) {
          $$renderer2.push("<!--[-->");
          Button($$renderer2, {
            href: item.href,
            variant: isActive(item.href) ? "default" : "outline",
            size: "sm",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->`);
              item.icon($$renderer3, { class: "mr-2 h-4 w-4" });
              $$renderer3.push(`<!----> ${escape_html(item.name)}`);
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></nav>`);
      pop_element();
      $$renderer2.push(` `);
      ModeToggle($$renderer2);
      $$renderer2.push(`<!----> `);
      Auth_dialog($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</header>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    Header
  );
}
Header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Footer[FILENAME] = "src/lib/components/sections/footer.svelte";
function Footer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<footer class="border-t bg-muted">`);
      push_element($$renderer2, "footer", 5, 0);
      $$renderer2.push(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 6, 2);
      $$renderer2.push(`<div class="pt-8 border-t border-border text-center">`);
      push_element($$renderer2, "div", 7, 4);
      $$renderer2.push(`<p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 8, 6);
      $$renderer2.push(`© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} ${escape_html(Constants.BRANDNAME)}. All rights reserved.<br/>`);
      push_element($$renderer2, "br", 9, 80);
      pop_element();
      $$renderer2.push(` <a${attr("href", `mailto:${stringify(Constants.SUPPORTEMAIL)}`)} class="hover:underline">`);
      push_element($$renderer2, "a", 10, 8);
      $$renderer2.push(`✉️ ${escape_html(Constants.SUPPORTEMAIL)}</a>`);
      pop_element();
      $$renderer2.push(`</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</footer>`);
      pop_element();
    },
    Footer
  );
}
Footer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout[FILENAME] = "src/routes/(app)/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      $$renderer2.push(`<div class="flex min-h-screen flex-col animate-in">`);
      push_element($$renderer2, "div", 7, 0);
      Header($$renderer2);
      $$renderer2.push(`<!----> <main class="flex-1">`);
      push_element($$renderer2, "main", 9, 2);
      children($$renderer2);
      $$renderer2.push(`<!----></main>`);
      pop_element();
      $$renderer2.push(` `);
      Footer($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DRQYYp-r.js.map
