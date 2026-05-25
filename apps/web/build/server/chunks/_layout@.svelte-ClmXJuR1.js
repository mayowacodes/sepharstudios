import { F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import './client2-D3ciM3yf.js';
import { p as page } from './index2-DBoVEfQm.js';
import './exports-BuGzoaN1.js';
import './client-BZtJixNd.js';

KidsTopNav[FILENAME] = "src/lib/components/kids/KidsTopNav.svelte";
function KidsTopNav($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      page.url.pathname.includes("/teens") ? "teens" : "kiddies";
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    KidsTopNav
  );
}
KidsTopNav.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout_[FILENAME] = "src/routes/kids/kiddies/+layout@.svelte";
function _layout_($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      const showNav = !page.url.pathname.endsWith("/kids") && !page.url.pathname.endsWith("/kids/profile");
      if (showNav) {
        $$renderer2.push("<!--[-->");
        KidsTopNav($$renderer2);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    },
    _layout_
  );
}
_layout_.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout_ as default };
//# sourceMappingURL=_layout@.svelte-ClmXJuR1.js.map
