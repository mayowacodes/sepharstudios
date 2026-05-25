import { h as head, b as push_element, d as pop_element, e as ensure_array_like, g as attr, k as attr_class, i as stringify, l as escape_html, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { p as page } from './index2-DBoVEfQm.js';
import './client2-D3ciM3yf.js';
import './client-BZtJixNd.js';
import './exports-BuGzoaN1.js';

AdminNav[FILENAME] = "src/lib/components/admin/AdminNav.svelte";
function AdminNav($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const navItems = [
        { href: "/admin", label: "Dashboard", icon: "Home" },
        { href: "/admin/review", label: "Review Queue", icon: "Review" },
        { href: "/admin/content", label: "Content", icon: "Content" },
        { href: "/admin/creators", label: "Creators", icon: "Users" },
        {
          href: "/admin/creator-applications",
          label: "Applications",
          icon: "Apply"
        },
        { href: "/admin/analytics", label: "Analytics", icon: "Stats" },
        { href: "/admin/governance", label: "Governance", icon: "Gov" },
        { href: "/admin/settings", label: "Settings", icon: "Settings" }
      ];
      const isActive = (path) => {
        if (path === "/admin") return page.url.pathname === "/admin";
        return page.url.pathname.startsWith(path);
      };
      $$renderer2.push(`<nav class="bg-black/20 backdrop-blur-sm border-b border-white/10">`);
      push_element($$renderer2, "nav", 27, 0);
      $$renderer2.push(`<div class="container mx-auto px-4">`);
      push_element($$renderer2, "div", 28, 2);
      $$renderer2.push(`<div class="flex items-center justify-between h-16">`);
      push_element($$renderer2, "div", 29, 4);
      $$renderer2.push(`<div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 30, 6);
      $$renderer2.push(`<button class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">`);
      push_element($$renderer2, "button", 31, 8);
      $$renderer2.push(`<img src="/logo-alone-sepharstudios.png" alt="Sephar Studios" class="h-8 w-auto object-contain"/>`);
      push_element($$renderer2, "img", 32, 10);
      pop_element();
      $$renderer2.push(` <span class="text-2xl font-bold">`);
      push_element($$renderer2, "span", 33, 10);
      $$renderer2.push(`Sephar Studios</span>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(` <span class="text-red-400 font-medium">`);
      push_element($$renderer2, "span", 35, 8);
      $$renderer2.push(`Admin Panel</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="hidden md:flex items-center space-x-1">`);
      push_element($$renderer2, "div", 38, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(navItems);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${stringify(isActive(item.href) ? "bg-red-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
        push_element($$renderer2, "a", 40, 10);
        $$renderer2.push(`<span class="text-xs uppercase tracking-wide">`);
        push_element($$renderer2, "span", 44, 12);
        $$renderer2.push(`${escape_html(item.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <span>`);
        push_element($$renderer2, "span", 45, 12);
        $$renderer2.push(`${escape_html(item.label)}</span>`);
        pop_element();
        $$renderer2.push(`</a>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 50, 6);
      $$renderer2.push(`<button class="text-gray-300 hover:text-white" aria-label="Notifications">`);
      push_element($$renderer2, "button", 51, 8);
      $$renderer2.push(`N</button>`);
      pop_element();
      $$renderer2.push(` <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">`);
      push_element($$renderer2, "div", 52, 8);
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
      $$renderer2.push(`<div class="admin-section min-h-screen bg-linear-to-b from-gray-900 to-black text-white">`);
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
//# sourceMappingURL=_layout@.svelte-B3mPR9_C.js.map
