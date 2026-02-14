import { t as head, m as ensure_array_like, u as attr, C as attr_class, x as stringify, E as escape_html } from './index-C14HL8mA.js';
import { p as page } from './index2-DN4t2Pgp.js';
import './client2-BtPpI286.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './client-CreTuECU.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';

AdminNav[FILENAME] = "src/lib/components/admin/AdminNav.svelte";
function AdminNav($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const navItems = [
        { href: "/admin", label: "Dashboard", icon: "🏠" },
        { href: "/admin/review", label: "Review Queue", icon: "👁️" },
        { href: "/admin/content", label: "Content", icon: "🎬" },
        { href: "/admin/creators", label: "Creators", icon: "👥" },
        { href: "/admin/analytics", label: "Analytics", icon: "📈" },
        { href: "/admin/settings", label: "Settings", icon: "⚙️" }
      ];
      const isActive = (path) => {
        if (path === "/admin") {
          return page.url.pathname === "/admin";
        }
        return page.url.pathname.startsWith(path);
      };
      $$renderer2.push(`<nav class="bg-black/20 backdrop-blur-sm border-b border-white/10">`);
      push_element($$renderer2, "nav", 27, 0);
      $$renderer2.push(`<div class="container mx-auto px-4">`);
      push_element($$renderer2, "div", 28, 2);
      $$renderer2.push(`<div class="flex items-center justify-between h-16">`);
      push_element($$renderer2, "div", 29, 4);
      $$renderer2.push(`<div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 31, 6);
      $$renderer2.push(`<button class="text-2xl font-bold text-white hover:text-gray-300 transition-colors">`);
      push_element($$renderer2, "button", 32, 8);
      $$renderer2.push(`Sephar Studios</button>`);
      pop_element();
      $$renderer2.push(` <span class="text-red-400 font-medium">`);
      push_element($$renderer2, "span", 35, 8);
      $$renderer2.push(`Admin Panel</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="hidden md:flex items-center space-x-1">`);
      push_element($$renderer2, "div", 39, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(navItems);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${stringify(isActive(item.href) ? "bg-red-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
        push_element($$renderer2, "a", 41, 10);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 45, 12);
        $$renderer2.push(`${escape_html(item.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <span>`);
        push_element($$renderer2, "span", 46, 12);
        $$renderer2.push(`${escape_html(item.label)}</span>`);
        pop_element();
        $$renderer2.push(`</a>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 52, 6);
      $$renderer2.push(`<button class="text-gray-300 hover:text-white">`);
      push_element($$renderer2, "button", 53, 8);
      $$renderer2.push(`🔔</button>`);
      pop_element();
      $$renderer2.push(` <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">`);
      push_element($$renderer2, "div", 56, 8);
      $$renderer2.push(`A</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</nav>`);
      pop_element();
    },
    AdminNav
  );
}
AdminNav.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout_[FILENAME] = "src/routes/(admin)/admin/+layout@.svelte";
function _layout_($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      head("fkwoe4", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Admin - Sephar Studios</title>`);
        });
      });
      $$renderer2.push(`<div class="admin-section min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">`);
      push_element($$renderer2, "div", 13, 0);
      AdminNav($$renderer2);
      $$renderer2.push(`<!----> <main class="pt-20">`);
      push_element($$renderer2, "main", 15, 1);
      children($$renderer2);
      $$renderer2.push(`<!----></main>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _layout_
  );
}
_layout_.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout_ as default };
//# sourceMappingURL=_layout@.svelte-nYaWqzO0.js.map
