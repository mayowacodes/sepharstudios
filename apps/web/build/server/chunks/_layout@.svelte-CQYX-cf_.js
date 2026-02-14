import { M as store_get, t as head, N as unsubscribe_stores, m as ensure_array_like, u as attr, C as attr_class, x as stringify, E as escape_html, z as getContext } from './index-C14HL8mA.js';
import { p as page$1 } from './index2-DN4t2Pgp.js';
import './client2-BtPpI286.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './client-CreTuECU.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';

CreatorNav[FILENAME] = "src/lib/components/creator/CreatorNav.svelte";
function CreatorNav($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const navItems = [
        { href: "/creator", label: "Dashboard", icon: "🏠" },
        { href: "/creator/upload", label: "Upload", icon: "📤" },
        { href: "/creator/content", label: "Content", icon: "🎬" },
        { href: "/creator/analytics", label: "Analytics", icon: "📊" },
        { href: "/creator/profile", label: "Profile", icon: "👤" },
        { href: "/creator/guidelines", label: "Guidelines", icon: "📋" }
      ];
      const isActive = (path) => {
        if (path === "/creator") {
          return page$1.url.pathname === "/creator";
        }
        return page$1.url.pathname.startsWith(path);
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
      $$renderer2.push(` <span class="text-purple-400 font-medium">`);
      push_element($$renderer2, "span", 35, 8);
      $$renderer2.push(`Creator Studio</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="hidden md:flex items-center space-x-1">`);
      push_element($$renderer2, "div", 39, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(navItems);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${stringify(isActive(item.href) ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
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
      $$renderer2.push(` <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">`);
      push_element($$renderer2, "div", 56, 8);
      $$renderer2.push(`M</div>`);
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
    CreatorNav
  );
}
CreatorNav.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CreatorFooter[FILENAME] = "src/lib/components/creator/CreatorFooter.svelte";
function CreatorFooter($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const creatorLinks = {
        "Creator Resources": [
          { label: "Upload Guidelines", href: "/creator/guidelines" },
          { label: "Creator Support", href: "/creator/support" },
          { label: "Best Practices", href: "/creator/best-practices" },
          { label: "Analytics Help", href: "/creator/analytics-help" }
        ],
        "Community": [
          { label: "Creator Forum", href: "/creator/forum" },
          { label: "Events", href: "/creator/events" },
          { label: "Newsletter", href: "/creator/newsletter" },
          { label: "Success Stories", href: "/creator/success-stories" }
        ],
        "Support": [
          { label: "Help Center", href: "/help" },
          { label: "Contact Us", href: "/contact" },
          { label: "Technical Support", href: "/creator/tech-support" },
          { label: "FAQ", href: "/faq" }
        ],
        "Legal": [
          { label: "Creator Agreement", href: "/creator/agreement" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Content Guidelines", href: "/guidelines" },
          { label: "Copyright Policy", href: "/copyright" }
        ]
      };
      $$renderer2.push(`<footer class="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-auto">`);
      push_element($$renderer2, "footer", 42, 0);
      $$renderer2.push(`<div class="container mx-auto px-4 py-8">`);
      push_element($$renderer2, "div", 43, 2);
      $$renderer2.push(`<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-5">`);
      push_element($$renderer2, "div", 45, 4);
      $$renderer2.push(`<div class="flex flex-col gap-4">`);
      push_element($$renderer2, "div", 47, 6);
      $$renderer2.push(`<button class="text-2xl font-bold text-white hover:text-purple-300 transition-colors text-left">`);
      push_element($$renderer2, "button", 48, 8);
      $$renderer2.push(`Sephar Studios</button>`);
      pop_element();
      $$renderer2.push(` <p class="text-sm text-gray-300">`);
      push_element($$renderer2, "p", 54, 8);
      $$renderer2.push(`Empowering faith-based creators to share their ministry with the world.</p>`);
      pop_element();
      $$renderer2.push(` <div class="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">`);
      push_element($$renderer2, "div", 58, 8);
      $$renderer2.push(`<button class="text-lg font-bold text-purple-300 hover:text-purple-100 transition-colors flex items-center gap-2">`);
      push_element($$renderer2, "button", 59, 10);
      $$renderer2.push(`<span>`);
      push_element($$renderer2, "span", 63, 12);
      $$renderer2.push(`🎬</span>`);
      pop_element();
      $$renderer2.push(` <span>`);
      push_element($$renderer2, "span", 64, 12);
      $$renderer2.push(`Get Movie Sponsorship</span>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "p", 66, 10);
      $$renderer2.push(`Fund your faith-based film projects</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <!--[-->`);
      const each_array = ensure_array_like(Object.entries(creatorLinks));
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let [category, items] = each_array[$$index_1];
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 74, 8);
        $$renderer2.push(`<h4 class="text-sm font-semibold text-purple-300">`);
        push_element($$renderer2, "h4", 75, 10);
        $$renderer2.push(`${escape_html(category)}</h4>`);
        pop_element();
        $$renderer2.push(` <ul class="space-y-2">`);
        push_element($$renderer2, "ul", 76, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(items);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let item = each_array_1[$$index];
          $$renderer2.push(`<li>`);
          push_element($$renderer2, "li", 78, 14);
          $$renderer2.push(`<a${attr("href", item.href)} class="text-sm text-gray-400 hover:text-white transition-colors">`);
          push_element($$renderer2, "a", 79, 16);
          $$renderer2.push(`${escape_html(item.label)}</a>`);
          pop_element();
          $$renderer2.push(`</li>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-8 border-t border-white/10 pt-8">`);
      push_element($$renderer2, "div", 93, 4);
      $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">`);
      push_element($$renderer2, "div", 95, 6);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 96, 8);
      $$renderer2.push(`<div class="text-2xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 97, 10);
      $$renderer2.push(`342</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 98, 10);
      $$renderer2.push(`Active Creators</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 100, 8);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 101, 10);
      $$renderer2.push(`2.8K</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 102, 10);
      $$renderer2.push(`Content Published</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 104, 8);
      $$renderer2.push(`<div class="text-2xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 105, 10);
      $$renderer2.push(`3.8M</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 106, 10);
      $$renderer2.push(`Total Views</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 108, 8);
      $$renderer2.push(`<div class="text-2xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 109, 10);
      $$renderer2.push(`$287K</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 110, 10);
      $$renderer2.push(`Creator Earnings</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-col md:flex-row items-center justify-between gap-4">`);
      push_element($$renderer2, "div", 115, 6);
      $$renderer2.push(`<p class="text-sm text-gray-400">`);
      push_element($$renderer2, "p", 116, 8);
      $$renderer2.push(`© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Sephar Studios Creator Studio. All rights reserved.</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-4">`);
      push_element($$renderer2, "div", 121, 8);
      $$renderer2.push(`<a href="https://facebook.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="Facebook">`);
      push_element($$renderer2, "a", 122, 10);
      $$renderer2.push(`<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">`);
      push_element($$renderer2, "svg", 129, 12);
      $$renderer2.push(`<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z">`);
      push_element($$renderer2, "path", 130, 14);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="https://twitter.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="Twitter">`);
      push_element($$renderer2, "a", 133, 10);
      $$renderer2.push(`<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">`);
      push_element($$renderer2, "svg", 140, 12);
      $$renderer2.push(`<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z">`);
      push_element($$renderer2, "path", 141, 14);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="https://instagram.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="Instagram">`);
      push_element($$renderer2, "a", 144, 10);
      $$renderer2.push(`<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">`);
      push_element($$renderer2, "svg", 151, 12);
      $$renderer2.push(`<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z">`);
      push_element($$renderer2, "path", 152, 14);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="https://youtube.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="YouTube">`);
      push_element($$renderer2, "a", 155, 10);
      $$renderer2.push(`<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">`);
      push_element($$renderer2, "svg", 162, 12);
      $$renderer2.push(`<path d="M23.498 6.186a2.993 2.993 0 00-2.11-2.11C19.51 3.75 12 3.75 12 3.75s-7.51 0-9.388.326a2.993 2.993 0 00-2.11 2.11C.176 8.064.176 12 .176 12s0 3.936.326 5.814a2.993 2.993 0 002.11 2.11c1.878.326 9.388.326 9.388.326s7.51 0 9.388-.326a2.993 2.993 0 002.11-2.11C23.824 15.936 23.824 12 23.824 12s0-3.936-.326-5.814zM9.75 15.568V8.432L15.568 12 9.75 15.568z">`);
      push_element($$renderer2, "path", 163, 14);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</footer>`);
      pop_element();
    },
    CreatorFooter
  );
}
CreatorFooter.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = get_store("page");
    return store.subscribe(fn);
  }
};
function get_store(name) {
  try {
    return getStores()[name];
  } catch {
    throw new Error(
      `Cannot subscribe to '${name}' store on the server outside of a Svelte component, as it is bound to the current request via component context. This prevents state from leaking between users.For more information, see https://svelte.dev/docs/kit/state-management#avoid-shared-state-on-the-server`
    );
  }
}
_layout_[FILENAME] = "src/routes/(creator)/creator/+layout@.svelte";
function _layout_($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let { children } = $$props;
      const user = store_get($$store_subs ??= {}, "$page", page).data.session?.user;
      const isAuthenticated = !!user;
      head("1tcrg26", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Creator Studio - Sephar Studios</title>`);
        });
      });
      $$renderer2.push(`<div class="creator-portal">`);
      push_element($$renderer2, "div", 20, 0);
      if (isAuthenticated) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col">`);
        push_element($$renderer2, "div", 22, 4);
        CreatorNav($$renderer2);
        $$renderer2.push(`<!----> <main class="container mx-auto px-4 py-8 flex-grow">`);
        push_element($$renderer2, "main", 24, 6);
        children($$renderer2);
        $$renderer2.push(`<!----></main>`);
        pop_element();
        $$renderer2.push(` `);
        CreatorFooter($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="min-h-screen flex items-center justify-center bg-gray-900">`);
        push_element($$renderer2, "div", 30, 4);
        $$renderer2.push(`<div class="text-center">`);
        push_element($$renderer2, "div", 31, 6);
        $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h1", 32, 8);
        $$renderer2.push(`Creator Access Required</h1>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 mb-8">`);
        push_element($$renderer2, "p", 33, 8);
        $$renderer2.push(`Please sign in to access the creator portal.</p>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 34, 8);
        $$renderer2.push(`<a href="/sign-in" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">`);
        push_element($$renderer2, "a", 35, 10);
        $$renderer2.push(`Sign In</a>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 38, 10);
        $$renderer2.push(`<p class="text-gray-400 text-sm">`);
        push_element($$renderer2, "p", 39, 12);
        $$renderer2.push(`Don't have an account?</p>`);
        pop_element();
        $$renderer2.push(` <a href="/sign-up" class="text-purple-400 hover:text-purple-300 underline">`);
        push_element($$renderer2, "a", 40, 12);
        $$renderer2.push(`Sign up here</a>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _layout_
  );
}
_layout_.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout_ as default };
//# sourceMappingURL=_layout@.svelte-CQYX-cf_.js.map
