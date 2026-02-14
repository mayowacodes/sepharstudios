import { L as slot } from './index-C14HL8mA.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './client2-BtPpI286.js';
import { p as page } from './index2-DN4t2Pgp.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';
import './client-CreTuECU.js';

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
_layout_[FILENAME] = "src/routes/(app)/kids/+layout@.svelte";
function _layout_($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let showNav;
      showNav = page.route.id !== "/(app)/kids/profile" && page.route.id !== "/(app)/kids";
      if (showNav) {
        $$renderer2.push("<!--[-->");
        KidsTopNav($$renderer2);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]-->`);
    },
    _layout_
  );
}
_layout_.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout_ as default };
//# sourceMappingURL=_layout@.svelte-BmLodSp2.js.map
