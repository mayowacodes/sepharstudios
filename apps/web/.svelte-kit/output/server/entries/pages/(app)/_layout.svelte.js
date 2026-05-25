import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, a as push_element, b as pop_element, n as attr, e as escape_html, i as ensure_array_like, j as attr_class, z as fallback, d as clsx, f as bind_props, ah as Scroll_area_scrollbar$1, ai as Scroll_area_thumb, aj as Scroll_area$1, ak as Scroll_area_viewport, al as Scroll_area_corner, E as validate_snippet_args, w as writable } from "../../../chunks/ui-libs.js";
import "clsx";
import { p as page } from "../../../chunks/index2.js";
import { S as Sheet, a as Sheet_trigger, b as Sheet_content, C as Chevron_right, c as Sheet_header, d as Sheet_title, e as Sheet_description } from "../../../chunks/sheet-description.js";
import { C as Crown } from "../../../chunks/crown.js";
import { U as User$1 } from "../../../chunks/user.js";
import { L as List_video, C as Clapperboard } from "../../../chunks/list-video.js";
import { C as Clock } from "../../../chunks/clock.js";
import { D as Download } from "../../../chunks/download.js";
import { S as Settings } from "../../../chunks/settings.js";
import { C as Coins } from "../../../chunks/coins.js";
import { c as cn } from "../../../chunks/utils2.js";
import { B as Button } from "../../../chunks/button.js";
import { g as goto } from "../../../chunks/client2.js";
import { A as Avatar, a as Avatar_image, b as Avatar_fallback } from "../../../chunks/avatar-fallback.js";
import { D as Dropdown_menu, a as Dropdown_menu_trigger, b as Dropdown_menu_content, d as Dropdown_menu_label, e as Dropdown_menu_separator, c as Dropdown_menu_item } from "../../../chunks/dropdown-menu-trigger.js";
import { X } from "../../../chunks/x.js";
import { S as Search } from "../../../chunks/search.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { L as Log_out } from "../../../chunks/log-out.js";
Bell[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/bell.svelte";
function Bell($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M10.268 21a2 2 0 0 0 3.464 0" }],
        [
          "path",
          {
            "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "bell" },
        /**
         * @component @name Bell
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuMjY4IDIxYTIgMiAwIDAgMCAzLjQ2NCAwIiAvPgogIDxwYXRoIGQ9Ik0zLjI2MiAxNS4zMjZBMSAxIDAgMCAwIDQgMTdoMTZhMSAxIDAgMCAwIC43NC0xLjY3M0MxOS40MSAxMy45NTYgMTggMTIuNDk5IDE4IDhBNiA2IDAgMCAwIDYgOGMwIDQuNDk5LTEuNDExIDUuOTU2LTIuNzM4IDcuMzI2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/bell
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
    Bell
  );
}
Bell.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Menu[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/menu.svelte";
function Menu($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M4 5h16" }],
        ["path", { "d": "M4 12h16" }],
        ["path", { "d": "M4 19h16" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "menu" },
        /**
         * @component @name Menu
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCA1aDE2IiAvPgogIDxwYXRoIGQ9Ik00IDEyaDE2IiAvPgogIDxwYXRoIGQ9Ik00IDE5aDE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/menu
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
    Menu
  );
}
Menu.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
MyStudiosDrawer[FILENAME] = "src/lib/components/sections/MyStudiosDrawer.svelte";
function MyStudiosDrawer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let isOpen = false;
      let activeSection = null;
      const userData = page?.data?.user;
      page?.url.pathname;
      function getUserInitial(user) {
        if (!user) return "?";
        if (user.name) return user.name[0].toUpperCase();
        if (user.email) return user.email[0].toUpperCase();
        return "?";
      }
      const navSections = [
        {
          key: "profiles",
          label: "Profiles",
          icon: User$1,
          desc: "Switch or manage profiles"
        },
        {
          key: "mylist",
          label: "My List",
          icon: List_video,
          desc: "Saved content"
        },
        {
          key: "recommendations",
          label: "Recommended",
          icon: Clapperboard,
          desc: "Picked for you"
        },
        {
          key: "recent",
          label: "Recently Watched",
          icon: Clock,
          desc: "Continue watching"
        },
        {
          key: "downloads",
          label: "Downloads",
          icon: Download,
          desc: "Offline content"
        },
        {
          key: "settings",
          label: "Settings",
          icon: Settings,
          desc: "Preferences"
        },
        {
          key: "account",
          label: "Account",
          icon: User$1,
          desc: "Manage account"
        }
      ];
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Sheet($$renderer3, {
          get open() {
            return isOpen;
          },
          set open($$value) {
            isOpen = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            Sheet_trigger($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<button class="studios-trigger svelte-1hr5ab1" aria-label="Open My Studios">`);
                push_element($$renderer5, "button", 101, 4);
                $$renderer5.push(`<span class="studios-trigger-dot svelte-1hr5ab1">`);
                push_element($$renderer5, "span", 102, 6);
                $$renderer5.push(`</span>`);
                pop_element();
                $$renderer5.push(` <span class="studios-trigger-label svelte-1hr5ab1">`);
                push_element($$renderer5, "span", 103, 6);
                $$renderer5.push(`My Studios</span>`);
                pop_element();
                $$renderer5.push(`</button>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Sheet_content($$renderer4, {
              side: "left",
              class: "w-[min(380px,95vw)] h-full p-0 overflow-hidden border-r border-white/5 bg-transparent",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="studios-panel svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 111, 4);
                $$renderer5.push(`<div class="studios-hero svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 117, 6);
                $$renderer5.push(`<div class="studios-hero-bg svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 118, 8);
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="studios-hero-content svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 119, 8);
                $$renderer5.push(`<div class="studios-avatar svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 120, 10);
                if (userData?.image) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<img${attr("src", userData.image)}${attr("alt", userData.name ?? "User")} class="w-full h-full object-cover rounded-full svelte-1hr5ab1"/>`);
                  push_element($$renderer5, "img", 122, 14);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push(`<span class="studios-avatar-initial svelte-1hr5ab1">`);
                  push_element($$renderer5, "span", 124, 14);
                  $$renderer5.push(`${escape_html(getUserInitial(userData))}</span>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]--> <div class="studios-avatar-ring svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 126, 12);
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="studios-hero-info svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 128, 10);
                $$renderer5.push(`<h2 class="studios-name svelte-1hr5ab1">`);
                push_element($$renderer5, "h2", 129, 12);
                $$renderer5.push(`${escape_html(userData?.name ?? "My Studios")}</h2>`);
                pop_element();
                $$renderer5.push(` <p class="studios-email svelte-1hr5ab1">`);
                push_element($$renderer5, "p", 130, 12);
                $$renderer5.push(`${escape_html(userData?.email ?? "")}</p>`);
                pop_element();
                $$renderer5.push(` <div class="studios-badge svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 131, 12);
                Crown($$renderer5, { size: 10 });
                $$renderer5.push(`<!----> <span class="svelte-1hr5ab1">`);
                push_element($$renderer5, "span", 133, 14);
                $$renderer5.push(`Premium Member</span>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="studios-shimmer svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 138, 8);
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="studios-nav svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 142, 6);
                $$renderer5.push(`<!--[-->`);
                const each_array = ensure_array_like(navSections);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let section = each_array[$$index];
                  $$renderer5.push(`<button${attr_class("studios-nav-item svelte-1hr5ab1", void 0, { "active": activeSection === section.key })}>`);
                  push_element($$renderer5, "button", 144, 10);
                  $$renderer5.push(`<div class="studios-nav-icon svelte-1hr5ab1">`);
                  push_element($$renderer5, "div", 149, 12);
                  $$renderer5.push(`<!---->`);
                  section.icon($$renderer5, { size: 16 });
                  $$renderer5.push(`<!----></div>`);
                  pop_element();
                  $$renderer5.push(` <div class="studios-nav-text svelte-1hr5ab1">`);
                  push_element($$renderer5, "div", 152, 12);
                  $$renderer5.push(`<span class="studios-nav-label svelte-1hr5ab1">`);
                  push_element($$renderer5, "span", 153, 14);
                  $$renderer5.push(`${escape_html(section.label)}</span>`);
                  pop_element();
                  $$renderer5.push(` <span class="studios-nav-desc svelte-1hr5ab1">`);
                  push_element($$renderer5, "span", 154, 14);
                  $$renderer5.push(`${escape_html(section.desc)}</span>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Chevron_right($$renderer5, { size: 14, class: "studios-nav-chevron" });
                  $$renderer5.push(`<!----></button>`);
                  pop_element();
                  $$renderer5.push(` `);
                  if (activeSection === section.key) {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<div class="studios-section-content svelte-1hr5ab1">`);
                    push_element($$renderer5, "div", 161, 12);
                    {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<div class="studios-skeleton svelte-1hr5ab1">`);
                      push_element($$renderer5, "div", 163, 16);
                      $$renderer5.push(`</div>`);
                      pop_element();
                    }
                    $$renderer5.push(`<!--]--></div>`);
                    pop_element();
                  } else {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]-->`);
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
                $$renderer5.push(` <div class="studios-footer svelte-1hr5ab1">`);
                push_element($$renderer5, "div", 185, 6);
                $$renderer5.push(`<a href="/my-list" class="studios-footer-link svelte-1hr5ab1">`);
                push_element($$renderer5, "a", 186, 8);
                List_video($$renderer5, { size: 14 });
                $$renderer5.push(`<!----> Full My List</a>`);
                pop_element();
                $$renderer5.push(` <a href="/token" class="studios-footer-link studios-footer-link--gold svelte-1hr5ab1">`);
                push_element($$renderer5, "a", 190, 8);
                Coins($$renderer5, { size: 14 });
                $$renderer5.push(`<!----> STC Token</a>`);
                pop_element();
                $$renderer5.push(` <a href="/settings" class="studios-footer-link svelte-1hr5ab1">`);
                push_element($$renderer5, "a", 194, 8);
                Settings($$renderer5, { size: 14 });
                $$renderer5.push(`<!----> Settings</a>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
    },
    MyStudiosDrawer
  );
}
MyStudiosDrawer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Logo[FILENAME] = "src/lib/components/Logo.svelte";
function Logo($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let user, isAuthenticated;
      let className = fallback($$props["class"], void 0);
      user = page.data.user || null;
      isAuthenticated = !!user;
      $$renderer2.push(`<a${attr("href", isAuthenticated ? "/dashboard" : "/")}${attr_class(clsx(cn("flex items-center space-x-2 transition-opacity hover:opacity-80", className)))}>`);
      push_element($$renderer2, "a", 22, 0);
      $$renderer2.push(`<img src="/logo-alone-sepharstudios.png" alt="Sephar Studios" class="h-8 w-auto object-contain"/>`);
      push_element($$renderer2, "img", 29, 2);
      pop_element();
      $$renderer2.push(` <!---->`);
      {
        $$renderer2.push(`<span class="font-extrabold tracking-tight text-base sm:text-lg md:text-xl text-white">`);
        push_element($$renderer2, "span", 32, 4);
        $$renderer2.push(`${escape_html(isAuthenticated ? "My Studios" : "Sephar Studios")}</span>`);
        pop_element();
      }
      $$renderer2.push(`<!----></a>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    Logo
  );
}
Logo.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Scroll_area_scrollbar[FILENAME] = "src/lib/components/ui/scroll-area/scroll-area-scrollbar.svelte";
function Scroll_area_scrollbar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        orientation = "vertical",
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Scroll_area_scrollbar$1($$renderer3, spread_props([
          {
            "data-slot": "scroll-area-scrollbar",
            orientation,
            class: cn("flex touch-none p-px transition-colors select-none", orientation === "vertical" && "h-full w-2.5 border-s border-s-transparent", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            children: prevent_snippet_stringification(($$renderer4) => {
              children?.($$renderer4);
              $$renderer4.push(`<!----> <!---->`);
              Scroll_area_thumb($$renderer4, {
                "data-slot": "scroll-area-thumb",
                class: "bg-border relative flex-1 rounded-full"
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Scroll_area_scrollbar
  );
}
Scroll_area_scrollbar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Scroll_area[FILENAME] = "src/lib/components/ui/scroll-area/scroll-area.svelte";
function Scroll_area($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        viewportRef = null,
        class: className,
        orientation = "vertical",
        scrollbarXClasses = "",
        scrollbarYClasses = "",
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Scroll_area$1($$renderer3, spread_props([
          { "data-slot": "scroll-area", class: cn("relative", className) },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Scroll_area_viewport($$renderer4, {
                "data-slot": "scroll-area-viewport",
                class: "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1",
                get ref() {
                  return viewportRef;
                },
                set ref($$value) {
                  viewportRef = $$value;
                  $$settled = false;
                },
                children: prevent_snippet_stringification(($$renderer5) => {
                  children?.($$renderer5);
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              if (orientation === "vertical" || orientation === "both") {
                $$renderer4.push("<!--[-->");
                Scroll_area_scrollbar($$renderer4, { orientation: "vertical", class: scrollbarYClasses });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (orientation === "horizontal" || orientation === "both") {
                $$renderer4.push("<!--[-->");
                Scroll_area_scrollbar($$renderer4, { orientation: "horizontal", class: scrollbarXClasses });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> <!---->`);
              Scroll_area_corner($$renderer4, {});
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref, viewportRef });
    },
    Scroll_area
  );
}
Scroll_area.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
NotificationCenter[FILENAME] = "src/lib/components/NotificationCenter.svelte";
function NotificationCenter($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { open, onOpenChange } = $$props;
      Sheet($$renderer2, {
        open,
        onOpenChange,
        children: prevent_snippet_stringification(($$renderer3) => {
          Sheet_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Sheet_header($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Sheet_title($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->Notifications`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Sheet_description($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->Stay updated with the latest content and features`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Scroll_area($$renderer4, {
                class: "h-[calc(100vh-8rem)] pr-4",
                children: prevent_snippet_stringification(($$renderer5) => {
                  {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<div class="flex justify-center py-8">`);
                    push_element($$renderer5, "div", 80, 8);
                    $$renderer5.push(`<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">`);
                    push_element($$renderer5, "div", 81, 10);
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                  }
                  $$renderer5.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
    },
    NotificationCenter
  );
}
NotificationCenter.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Search_1[FILENAME] = "src/lib/components/Search.svelte";
function Search_1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let placeholder = fallback($$props["placeholder"], "Search...");
      let value = fallback($$props["value"], "");
      $$renderer2.push(`<div class="relative w-full max-w-md">`);
      push_element($$renderer2, "div", 35, 0);
      $$renderer2.push(`<input type="text"${attr("value", value)} class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"${attr("placeholder", placeholder)}/>`);
      push_element($$renderer2, "input", 36, 2);
      pop_element();
      $$renderer2.push(` <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">`);
      push_element($$renderer2, "div", 43, 2);
      if (value) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button type="button" class="text-white/60 hover:text-white">`);
        push_element($$renderer2, "button", 45, 6);
        X($$renderer2, { class: "h-4 w-4" });
        $$renderer2.push(`<!----></button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      Search($$renderer2, { class: "h-4 w-4 text-white/60" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { placeholder, value });
    },
    Search_1
  );
}
Search_1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
User[FILENAME] = "src/lib/components/widgets/User.svelte";
function User($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const user = page.data.user;
      let isNotificationOpen = false;
      let isLoading = false;
      function getUserInitials(user2) {
        if (!user2) return "U";
        if (user2.name) {
          const names = user2.name.split(" ");
          if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
          }
          return names[0][0].toUpperCase();
        }
        if (user2.email) {
          return user2.email[0].toUpperCase();
        }
        return "U";
      }
      async function handleSignOut() {
        isLoading = true;
        try {
          await fetch("/api/auth/sign-out", { method: "POST" });
          window.location.href = "/";
        } catch (error) {
          console.error("Sign out error:", error);
          isLoading = false;
        }
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="flex items-center gap-4">`);
        push_element($$renderer3, "div", 84, 0);
        if (user) {
          $$renderer3.push("<!--[-->");
          Search_1($$renderer3, {});
          $$renderer3.push(`<!----> `);
          Sheet($$renderer3, {
            get open() {
              return isNotificationOpen;
            },
            set open($$value) {
              isNotificationOpen = $$value;
              $$settled = false;
            },
            children: prevent_snippet_stringification(($$renderer4) => {
              {
                let child = function($$renderer5, { props }) {
                  validate_snippet_args($$renderer5);
                  Button($$renderer5, spread_props([
                    { variant: "ghost", size: "icon" },
                    props,
                    {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Bell($$renderer6, { class: "h-5 w-5" });
                        $$renderer6.push(`<!----> <span class="sr-only">`);
                        push_element($$renderer6, "span", 95, 12);
                        $$renderer6.push(`Open notifications</span>`);
                        pop_element();
                      }),
                      $$slots: { default: true }
                    }
                  ]));
                };
                prevent_snippet_stringification(child);
                Sheet_trigger($$renderer4, { child, $$slots: { child: true } });
              }
              $$renderer4.push(`<!----> `);
              NotificationCenter($$renderer4, {
                open: isNotificationOpen,
                onOpenChange: (val) => isNotificationOpen = val
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Dropdown_menu($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              {
                let child = function($$renderer5, { props }) {
                  validate_snippet_args($$renderer5);
                  Button($$renderer5, spread_props([
                    { variant: "ghost", class: "relative h-10 w-10 rounded-full" },
                    props,
                    {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Avatar($$renderer6, {
                          class: "h-10 w-10",
                          children: prevent_snippet_stringification(($$renderer7) => {
                            if (user.image) {
                              $$renderer7.push("<!--[-->");
                              Avatar_image($$renderer7, { src: user.image, alt: user.name || user.email });
                            } else {
                              $$renderer7.push("<!--[!-->");
                            }
                            $$renderer7.push(`<!--]--> `);
                            Avatar_fallback($$renderer7, {
                              class: "bg-primary text-primary-foreground",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                $$renderer8.push(`<!---->${escape_html(getUserInitials(user))}`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer7.push(`<!---->`);
                          }),
                          $$slots: { default: true }
                        });
                      }),
                      $$slots: { default: true }
                    }
                  ]));
                };
                prevent_snippet_stringification(child);
                Dropdown_menu_trigger($$renderer4, { child, $$slots: { child: true } });
              }
              $$renderer4.push(`<!----> `);
              Dropdown_menu_content($$renderer4, {
                class: "w-56 surface-glass border-white/10",
                align: "end",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Dropdown_menu_label($$renderer5, {
                    class: "font-normal",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<div class="flex flex-col space-y-1">`);
                      push_element($$renderer6, "div", 120, 10);
                      if (user.name) {
                        $$renderer6.push("<!--[-->");
                        $$renderer6.push(`<p class="text-sm font-medium leading-none">`);
                        push_element($$renderer6, "p", 122, 14);
                        $$renderer6.push(`${escape_html(user.name)}</p>`);
                        pop_element();
                      } else {
                        $$renderer6.push("<!--[!-->");
                      }
                      $$renderer6.push(`<!--]--> <p class="text-xs leading-none text-muted-foreground">`);
                      push_element($$renderer6, "p", 124, 12);
                      $$renderer6.push(`${escape_html(user.email)}</p>`);
                      pop_element();
                      $$renderer6.push(`</div>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Dropdown_menu_separator($$renderer5, {});
                  $$renderer5.push(`<!----> `);
                  Dropdown_menu_item($$renderer5, {
                    onclick: () => goto(),
                    children: prevent_snippet_stringification(($$renderer6) => {
                      User$1($$renderer6, { class: "mr-2 h-4 w-4" });
                      $$renderer6.push(`<!----> Profile`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Dropdown_menu_item($$renderer5, {
                    onclick: () => goto(),
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Settings($$renderer6, { class: "mr-2 h-4 w-4" });
                      $$renderer6.push(`<!----> Settings`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--> `);
                  Dropdown_menu_separator($$renderer5, {});
                  $$renderer5.push(`<!----> `);
                  Dropdown_menu_item($$renderer5, {
                    onclick: handleSignOut,
                    disabled: isLoading,
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Log_out($$renderer6, { class: "mr-2 h-4 w-4" });
                      $$renderer6.push(`<!----> ${escape_html(isLoading ? "Signing out..." : "Sign out")}`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[!-->");
          Button($$renderer3, {
            href: "/auth/login",
            variant: "ghost",
            class: "h-9",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->Sign In`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            href: "/plans",
            size: "sm",
            class: "h-9 ml-4 bg-primary hover:bg-primary/90",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->Get Started`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
    },
    User
  );
}
User.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Header[FILENAME] = "src/lib/components/sections/header.svelte";
function Header($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const isNotificationOpen = writable(false);
      const user = page.data.user;
      const isAuthenticated = !!user;
      const isKidsPage = page.url.pathname.startsWith("/kids/");
      const navItems = [
        { href: "/", label: "Home" },
        { href: "/movies", label: "Movies" },
        { href: "/shows", label: "TV Shows" },
        { href: "/documentaries", label: "Documentaries" },
        { href: "/token", label: "STC Token" }
      ];
      const isActive = (path) => {
        if (path === "/") {
          return page.url.pathname === "/";
        }
        return page.url.pathname.startsWith(path);
      };
      const navLinkClass = (path) => `relative inline-flex items-center h-9 text-sm font-medium leading-none transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#FF5E0E] after:transition-all after:duration-300 ${isActive(path) ? "after:w-full text-white" : "after:w-0 hover:after:w-full text-white/80"}`;
      if (!isKidsPage) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<header${attr_class(`transition-transform duration-300 ease-in-out sticky top-0 z-40 w-full border-b border-white/10 surface-glass ${""}`)}>`);
        push_element($$renderer2, "header", 58, 0);
        $$renderer2.push(`<div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto px-4">`);
        push_element($$renderer2, "div", 59, 2);
        $$renderer2.push(`<div class="flex gap-6 md:gap-10 items-center">`);
        push_element($$renderer2, "div", 60, 4);
        Sheet($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            {
              let child = function($$renderer4, { props }) {
                validate_snippet_args($$renderer4);
                Button($$renderer4, spread_props([
                  {
                    variant: "ghost",
                    size: "icon",
                    class: "md:hidden text-white/80 hover:text-white"
                  },
                  props,
                  {
                    children: prevent_snippet_stringification(($$renderer5) => {
                      Menu($$renderer5, { class: "h-5 w-5" });
                      $$renderer5.push(`<!----> <span class="sr-only">`);
                      push_element($$renderer5, "span", 67, 14);
                      $$renderer5.push(`Toggle menu</span>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  }
                ]));
              };
              prevent_snippet_stringification(child);
              Sheet_trigger($$renderer3, { child, $$slots: { child: true } });
            }
            $$renderer3.push(`<!----> `);
            Sheet_content($$renderer3, {
              side: "left",
              class: "p-4 space-y-4 surface-glass border-white/10",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!--[-->`);
                const each_array = ensure_array_like(navItems);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let item = each_array[$$index];
                  $$renderer4.push(`<a${attr("href", item.href)} class="block text-lg font-semibold text-white/90 hover:text-white">`);
                  push_element($$renderer4, "a", 73, 12);
                  $$renderer4.push(`${escape_html(item.label)}</a>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]--> <hr class="border-white/10"/>`);
                push_element($$renderer4, "hr", 75, 10);
                pop_element();
                $$renderer4.push(` <a href="/kids/kiddies" class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">`);
                push_element($$renderer4, "a", 76, 10);
                $$renderer4.push(`Kiddies</a>`);
                pop_element();
                $$renderer4.push(` <a href="/kids/teens" class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">`);
                push_element($$renderer4, "a", 77, 10);
                $$renderer4.push(`Teens</a>`);
                pop_element();
                $$renderer4.push(` <a href="/archive" class="block font-semibold pl-4 text-sm text-muted-foreground">`);
                push_element($$renderer4, "a", 78, 10);
                $$renderer4.push(`Archive Videos</a>`);
                pop_element();
                $$renderer4.push(` <a href="/mayowa" class="block font-semibold pl-4 text-sm text-muted-foreground">`);
                push_element($$renderer4, "a", 79, 10);
                $$renderer4.push(`Mayowa's Films</a>`);
                pop_element();
                $$renderer4.push(` `);
                if (isAuthenticated) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<hr class="border-white/10"/>`);
                  push_element($$renderer4, "hr", 81, 12);
                  pop_element();
                  $$renderer4.push(` <a href="/my-list" class="block text-lg font-semibold text-white/90 hover:text-white">`);
                  push_element($$renderer4, "a", 82, 12);
                  $$renderer4.push(`My List</a>`);
                  pop_element();
                  $$renderer4.push(` <a href="/downloads" class="block text-lg font-semibold text-white/90 hover:text-white">`);
                  push_element($$renderer4, "a", 83, 12);
                  $$renderer4.push(`Downloads</a>`);
                  pop_element();
                  $$renderer4.push(` <a href="/recently-watched" class="block text-lg font-semibold text-white/90 hover:text-white">`);
                  push_element($$renderer4, "a", 84, 12);
                  $$renderer4.push(`Recently Watched</a>`);
                  pop_element();
                  $$renderer4.push(` <a href="/settings" class="block text-lg font-semibold text-white/90 hover:text-white">`);
                  push_element($$renderer4, "a", 85, 12);
                  $$renderer4.push(`Settings</a>`);
                  pop_element();
                  $$renderer4.push(` <a href="/account" class="block text-lg font-semibold text-white/90 hover:text-white">`);
                  push_element($$renderer4, "a", 86, 12);
                  $$renderer4.push(`Account</a>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        if (isAuthenticated) {
          $$renderer2.push("<!--[-->");
          MyStudiosDrawer($$renderer2);
        } else {
          $$renderer2.push("<!--[!-->");
          Logo($$renderer2, {});
        }
        $$renderer2.push(`<!--]--> <nav class="hidden md:flex gap-6 items-center text-white/80">`);
        push_element($$renderer2, "nav", 99, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(navItems);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let { href, label } = each_array_1[$$index_1];
          $$renderer2.push(`<a${attr("href", href)}${attr_class(clsx(navLinkClass(href)))}>`);
          push_element($$renderer2, "a", 101, 10);
          $$renderer2.push(`${escape_html(label)}</a>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--> <details class="relative group">`);
        push_element($$renderer2, "details", 105, 8);
        $$renderer2.push(`<summary${attr_class(`relative inline-flex items-center h-9 leading-none cursor-pointer list-none text-sm font-medium transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#FF5E0E] after:transition-all after:duration-300 ${page.url.pathname.startsWith("/kids/") ? "after:w-full text-white" : "after:w-0 hover:after:w-full"}`)}>`);
        push_element($$renderer2, "summary", 106, 10);
        $$renderer2.push(`Kids</summary>`);
        pop_element();
        $$renderer2.push(` <div class="absolute left-0 mt-2 w-48 rounded-lg z-50 surface-glass border-white/10">`);
        push_element($$renderer2, "div", 107, 10);
        $$renderer2.push(`<a href="/kids/kiddies" class="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors">`);
        push_element($$renderer2, "a", 108, 12);
        $$renderer2.push(`Kiddies</a>`);
        pop_element();
        $$renderer2.push(` <a href="/kids/teens" class="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors">`);
        push_element($$renderer2, "a", 115, 12);
        $$renderer2.push(`Teens</a>`);
        pop_element();
        $$renderer2.push(` <hr class="my-1 border-white/10"/>`);
        push_element($$renderer2, "hr", 122, 12);
        pop_element();
        $$renderer2.push(` <a href="/archive" class="block px-4 py-2 hover:bg-white/10 transition-colors text-sm text-muted-foreground">`);
        push_element($$renderer2, "a", 123, 12);
        $$renderer2.push(`Archive Videos</a>`);
        pop_element();
        $$renderer2.push(` <a href="/mayowa" class="block px-4 py-2 hover:bg-white/10 transition-colors text-sm text-muted-foreground">`);
        push_element($$renderer2, "a", 130, 12);
        $$renderer2.push(`Mayowa's Films</a>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</details>`);
        pop_element();
        $$renderer2.push(` `);
        if (isAuthenticated) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<a href="/my-list"${attr_class(clsx(navLinkClass("/my-list")))}>`);
          push_element($$renderer2, "a", 141, 10);
          $$renderer2.push(`My List</a>`);
          pop_element();
          $$renderer2.push(` <a href="/library"${attr_class(clsx(navLinkClass("/library")))}>`);
          push_element($$renderer2, "a", 142, 10);
          $$renderer2.push(`Library</a>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></nav>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="ml-auto flex items-center gap-2">`);
        push_element($$renderer2, "div", 147, 4);
        User($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</header>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { isNotificationOpen });
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
      let className = fallback($$props["class"], "");
      const links = {
        "About Us": [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Press", href: "/press" }
        ],
        "Platform": [
          { label: "Plans & Pricing", href: "/plans" },
          { label: "STC Token", href: "/token" },
          { label: "Creator Hub", href: "/creator" }
        ],
        "Support": [
          { label: "Help Center", href: "/help" },
          { label: "Contact Us", href: "/contact" },
          { label: "FAQ", href: "/faq" }
        ],
        "Legal": [
          { label: "Terms of Service", href: "/terms" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Content Guidelines", href: "/guidelines" }
        ]
      };
      $$renderer2.push(`<footer${attr_class(clsx(cn("border-t bg-background", className)))}>`);
      push_element($$renderer2, "footer", 33, 0);
      $$renderer2.push(`<div class="container py-8 md:py-12 mx-auto px-4">`);
      push_element($$renderer2, "div", 34, 2);
      $$renderer2.push(`<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-5 items-start">`);
      push_element($$renderer2, "div", 35, 4);
      $$renderer2.push(`<div class="flex flex-col gap-4 text-left">`);
      push_element($$renderer2, "div", 36, 6);
      Logo($$renderer2, {});
      $$renderer2.push(`<!----> <p class="text-sm text-muted-foreground">`);
      push_element($$renderer2, "p", 38, 8);
      $$renderer2.push(`Your trusted source for Christian content streaming.</p>`);
      pop_element();
      $$renderer2.push(` <a href="/sponsorships" class="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">`);
      push_element($$renderer2, "a", 41, 8);
      $$renderer2.push(`<strong>`);
      push_element($$renderer2, "strong", 49, 9);
      $$renderer2.push(`Get Movie Sponsorship</strong>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <!--[-->`);
      const each_array = ensure_array_like(Object.entries(links));
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let [category, items] = each_array[$$index_1];
        $$renderer2.push(`<div class="space-y-4 text-left justify-self-start">`);
        push_element($$renderer2, "div", 53, 8);
        $$renderer2.push(`<h4 class="text-sm font-medium">`);
        push_element($$renderer2, "h4", 54, 10);
        $$renderer2.push(`${escape_html(category)}</h4>`);
        pop_element();
        $$renderer2.push(` <ul class="space-y-2 m-0 p-0">`);
        push_element($$renderer2, "ul", 55, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(items);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let item = each_array_1[$$index];
          $$renderer2.push(`<li>`);
          push_element($$renderer2, "li", 57, 14);
          $$renderer2.push(`<a${attr("href", item.href)} class="text-sm text-muted-foreground hover:text-foreground transition-colors">`);
          push_element($$renderer2, "a", 58, 16);
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
      $$renderer2.push(` <div class="mt-8 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">`);
      push_element($$renderer2, "div", 70, 4);
      $$renderer2.push(`<p class="text-sm text-muted-foreground">`);
      push_element($$renderer2, "p", 71, 6);
      $$renderer2.push(`<span>`);
      push_element($$renderer2, "span", 72, 8);
      $$renderer2.push(`© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Sephar Studios.</span>`);
      pop_element();
      $$renderer2.push(` All rights reserved.</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-4">`);
      push_element($$renderer2, "div", 74, 6);
      $$renderer2.push(`<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">`);
      push_element($$renderer2, "a", 75, 8);
      $$renderer2.push(`<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">`);
      push_element($$renderer2, "svg", 82, 10);
      $$renderer2.push(`<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z">`);
      push_element($$renderer2, "path", 83, 12);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">`);
      push_element($$renderer2, "a", 86, 8);
      $$renderer2.push(`<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">`);
      push_element($$renderer2, "svg", 93, 10);
      $$renderer2.push(`<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z">`);
      push_element($$renderer2, "path", 94, 12);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">`);
      push_element($$renderer2, "a", 97, 8);
      $$renderer2.push(`<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">`);
      push_element($$renderer2, "svg", 104, 10);
      $$renderer2.push(`<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z">`);
      push_element($$renderer2, "path", 105, 12);
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
      $$renderer2.push(`</footer>`);
      pop_element();
      bind_props($$props, { class: className });
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
      $$renderer2.push(`<div class="min-h-screen bg-linear-to-b from-background to-accent/10">`);
      push_element($$renderer2, "div", 7, 0);
      Header($$renderer2, {});
      $$renderer2.push(`<!----> <main class="flex-1">`);
      push_element($$renderer2, "main", 9, 2);
      children($$renderer2);
      $$renderer2.push(`<!----></main>`);
      pop_element();
      $$renderer2.push(` `);
      Footer($$renderer2, {});
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _layout as default
};
