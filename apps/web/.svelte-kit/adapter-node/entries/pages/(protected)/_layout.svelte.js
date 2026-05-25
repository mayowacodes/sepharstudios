import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, ap as MediaQuery, J as setContext, x as getContext, t as derived, c as attributes, d as clsx, a as push_element, b as pop_element, f as bind_props, az as Tooltip$1, aA as Tooltip_trigger$1, V as Portal, aB as Tooltip_content$1, E as validate_snippet_args, aC as Tooltip_arrow, aD as Tooltip_provider$1, aE as mergeProps, e as escape_html, l as stringify, n as attr, j as attr_class, i as ensure_array_like, z as fallback, G as onDestroy, aF as slot } from "../../../chunks/ui-libs.js";
import "clsx";
import { c as cn } from "../../../chunks/utils2.js";
import "../../../chunks/input.js";
import { tv } from "tailwind-variants";
import { S as Separator } from "../../../chunks/separator.js";
import { B as Button, b as buttonVariants } from "../../../chunks/button.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { S as Sheet, b as Sheet_content, c as Sheet_header, d as Sheet_title, e as Sheet_description, C as Chevron_right } from "../../../chunks/sheet-description.js";
import { p as page } from "../../../chunks/index2.js";
import { A as Avatar, a as Avatar_image, b as Avatar_fallback } from "../../../chunks/avatar-fallback.js";
import { D as Dropdown_menu, a as Dropdown_menu_trigger, b as Dropdown_menu_content, d as Dropdown_menu_label, e as Dropdown_menu_separator, f as Dropdown_menu_group, c as Dropdown_menu_item } from "../../../chunks/dropdown-menu-trigger.js";
import { g as getNavigation, H as House, C as Constants } from "../../../chunks/index.js";
import { L as Log_out } from "../../../chunks/log-out.js";
import { t as toggleMode } from "../../../chunks/mode-watcher.js";
import "style-to-object";
import { s as setQueryClientContext, u as useQueryClient, g as getRoleBadgeVariant, i as infiniteScroll } from "../../../chunks/fxn.js";
import { b as signOut } from "../../../chunks/auth-client.js";
import { B as Badge } from "../../../chunks/badge.js";
import { U as User } from "../../../chunks/user.js";
import { t as toast } from "../../../chunks/toast-state.svelte.js";
import { QueryClient } from "@tanstack/query-core";
Chevrons_up_down[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/chevrons-up-down.svelte";
function Chevrons_up_down($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "m7 15 5 5 5-5" }],
        ["path", { "d": "m7 9 5-5 5 5" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "chevrons-up-down" },
        /**
         * @component @name ChevronsUpDown
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNyAxNSA1IDUgNS01IiAvPgogIDxwYXRoIGQ9Im03IDkgNS01IDUgNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevrons-up-down
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
    Chevrons_up_down
  );
}
Chevrons_up_down.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Moon[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/moon.svelte";
function Moon($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "moon" },
        /**
         * @component @name Moon
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAuOTg1IDEyLjQ4NmE5IDkgMCAxIDEtOS40NzMtOS40NzJjLjQwNS0uMDIyLjYxNy40Ni40MDIuODAzYTYgNiAwIDAgMCA4LjI2OCA4LjI2OGMuMzQ0LS4yMTUuODI1LS4wMDQuODAzLjQwMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/moon
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
    Moon
  );
}
Moon.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Panel_left[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/panel-left.svelte";
function Panel_left($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "rect",
          { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }
        ],
        ["path", { "d": "M9 3v18" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "panel-left" },
        /**
         * @component @name PanelLeft
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/panel-left
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
    Panel_left
  );
}
Panel_left.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sun[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/sun.svelte";
function Sun($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["circle", { "cx": "12", "cy": "12", "r": "4" }],
        ["path", { "d": "M12 2v2" }],
        ["path", { "d": "M12 20v2" }],
        ["path", { "d": "m4.93 4.93 1.41 1.41" }],
        ["path", { "d": "m17.66 17.66 1.41 1.41" }],
        ["path", { "d": "M2 12h2" }],
        ["path", { "d": "M20 12h2" }],
        ["path", { "d": "m6.34 17.66-1.41 1.41" }],
        ["path", { "d": "m19.07 4.93-1.41 1.41" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "sun" },
        /**
         * @component @name Sun
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIwdjIiIC8+CiAgPHBhdGggZD0ibTQuOTMgNC45MyAxLjQxIDEuNDEiIC8+CiAgPHBhdGggZD0ibTE3LjY2IDE3LjY2IDEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMiAxMmgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im02LjM0IDE3LjY2LTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sun
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
    Sun
  );
}
Sun.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const DEFAULT_MOBILE_BREAKPOINT = 768;
class IsMobile extends MediaQuery {
  constructor(breakpoint = DEFAULT_MOBILE_BREAKPOINT) {
    super(`max-width: ${breakpoint - 1}px`);
  }
}
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
class SidebarState {
  props;
  #open = derived(() => this.props.open());
  get open() {
    return this.#open();
  }
  set open($$value) {
    return this.#open($$value);
  }
  openMobile = false;
  setOpen;
  #isMobile;
  #state = derived(() => this.open ? "expanded" : "collapsed");
  get state() {
    return this.#state();
  }
  set state($$value) {
    return this.#state($$value);
  }
  constructor(props) {
    this.setOpen = props.setOpen;
    this.#isMobile = new IsMobile();
    this.props = props;
  }
  // Convenience getter for checking if the sidebar is mobile
  // without this, we would need to use `sidebar.isMobile.current` everywhere
  get isMobile() {
    return this.#isMobile.current;
  }
  // Event handler to apply to the `<svelte:window>`
  handleShortcutKeydown = (e) => {
    if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.toggle();
    }
  };
  setOpenMobile = (value) => {
    this.openMobile = value;
  };
  toggle = () => {
    return this.#isMobile.current ? this.openMobile = !this.openMobile : this.setOpen(!this.open);
  };
}
const SYMBOL_KEY = "scn-sidebar";
function setSidebar(props) {
  return setContext(Symbol.for(SYMBOL_KEY), new SidebarState(props));
}
function useSidebar() {
  return getContext(Symbol.for(SYMBOL_KEY));
}
Sidebar_content[FILENAME] = "src/lib/components/ui/sidebar/sidebar-content.svelte";
function Sidebar_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "sidebar-content",
        "data-sidebar": "content",
        class: clsx(cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_content
  );
}
Sidebar_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_footer[FILENAME] = "src/lib/components/ui/sidebar/sidebar-footer.svelte";
function Sidebar_footer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "sidebar-footer",
        "data-sidebar": "footer",
        class: clsx(cn("flex flex-col gap-2 p-2", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_footer
  );
}
Sidebar_footer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_group_label[FILENAME] = "src/lib/components/ui/sidebar/sidebar-group-label.svelte";
function Sidebar_group_label($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        children,
        child,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const mergedProps = {
        class: cn("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
        "data-slot": "sidebar-group-label",
        "data-sidebar": "group-label",
        ...restProps
      };
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "div", 31, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Sidebar_group_label
  );
}
Sidebar_group_label.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_group[FILENAME] = "src/lib/components/ui/sidebar/sidebar-group.svelte";
function Sidebar_group($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "sidebar-group",
        "data-sidebar": "group",
        class: clsx(cn("relative flex w-full min-w-0 flex-col p-2", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_group
  );
}
Sidebar_group.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_header[FILENAME] = "src/lib/components/ui/sidebar/sidebar-header.svelte";
function Sidebar_header($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "sidebar-header",
        "data-sidebar": "header",
        class: clsx(cn("flex flex-col gap-2 p-2", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_header
  );
}
Sidebar_header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_inset[FILENAME] = "src/lib/components/ui/sidebar/sidebar-inset.svelte";
function Sidebar_inset($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<main${attributes({
        "data-slot": "sidebar-inset",
        class: clsx(cn("bg-background relative flex w-full flex-1 flex-col", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "main", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></main>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_inset
  );
}
Sidebar_inset.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Tooltip[FILENAME] = "src/lib/components/ui/tooltip/tooltip.svelte";
function Tooltip($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { open = false, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Tooltip$1($$renderer3, spread_props([
          restProps,
          {
            get open() {
              return open;
            },
            set open($$value) {
              open = $$value;
              $$settled = false;
            }
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
      bind_props($$props, { open });
    },
    Tooltip
  );
}
Tooltip.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Tooltip_trigger[FILENAME] = "src/lib/components/ui/tooltip/tooltip-trigger.svelte";
function Tooltip_trigger($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { ref = null, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Tooltip_trigger$1($$renderer3, spread_props([
          { "data-slot": "tooltip-trigger" },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
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
    Tooltip_trigger
  );
}
Tooltip_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Tooltip_portal[FILENAME] = "src/lib/components/ui/tooltip/tooltip-portal.svelte";
function Tooltip_portal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Portal($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Tooltip_portal
  );
}
Tooltip_portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Tooltip_content[FILENAME] = "src/lib/components/ui/tooltip/tooltip-content.svelte";
function Tooltip_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        sideOffset = 0,
        side = "top",
        children,
        arrowClasses,
        portalProps,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Tooltip_portal($$renderer3, spread_props([
          portalProps,
          {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Tooltip_content$1($$renderer4, spread_props([
                {
                  "data-slot": "tooltip-content",
                  sideOffset,
                  side,
                  class: cn("bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--bits-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className)
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
                  children: prevent_snippet_stringification(($$renderer5) => {
                    children?.($$renderer5);
                    $$renderer5.push(`<!----> <!---->`);
                    {
                      let child = function($$renderer6, { props }) {
                        validate_snippet_args($$renderer6);
                        $$renderer6.push(`<div${attributes({
                          class: clsx(cn("bg-primary z-50 size-2.5 rotate-45 rounded-[2px]", "data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%_+_2px)]", "data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%_+_1px)]", "data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=right]:translate-y-1/2", "data-[side=left]:-translate-y-[calc(50%_-_3px)]", arrowClasses)),
                          ...props
                        })}>`);
                        push_element($$renderer6, "div", 38, 4);
                        $$renderer6.push(`</div>`);
                        pop_element();
                      };
                      prevent_snippet_stringification(child);
                      Tooltip_arrow($$renderer5, { child, $$slots: { child: true } });
                    }
                    $$renderer5.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                }
              ]));
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          }
        ]));
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Tooltip_content
  );
}
Tooltip_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Tooltip_provider[FILENAME] = "src/lib/components/ui/tooltip/tooltip-provider.svelte";
function Tooltip_provider($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Tooltip_provider$1($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Tooltip_provider
  );
}
Tooltip_provider.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_menu_button[FILENAME] = "src/lib/components/ui/sidebar/sidebar-menu-button.svelte";
const sidebarMenuButtonVariants = tv({
  base: "peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline: "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});
function Sidebar_menu_button($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        child,
        variant = "default",
        size = "default",
        isActive = false,
        tooltipContent,
        tooltipContentProps,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const sidebar = useSidebar();
      const buttonProps = {
        class: cn(sidebarMenuButtonVariants({ variant, size }), className),
        "data-slot": "sidebar-menu-button",
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        ...restProps
      };
      prevent_snippet_stringification(Button2);
      function Button2($$renderer3, { props }) {
        validate_snippet_args($$renderer3);
        const mergedProps = mergeProps(buttonProps, props);
        if (child) {
          $$renderer3.push("<!--[-->");
          child($$renderer3, { props: mergedProps });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<button${attributes({ ...mergedProps })}>`);
          push_element($$renderer3, "button", 75, 2);
          children?.($$renderer3);
          $$renderer3.push(`<!----></button>`);
          pop_element();
        }
        $$renderer3.push(`<!--]-->`);
      }
      if (!tooltipContent) {
        $$renderer2.push("<!--[-->");
        Button2($$renderer2, {});
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!---->`);
        Tooltip($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->`);
            {
              let child2 = function($$renderer4, { props }) {
                validate_snippet_args($$renderer4);
                Button2($$renderer4, { props });
              };
              prevent_snippet_stringification(child2);
              Tooltip_trigger($$renderer3, { child: child2, $$slots: { child: true } });
            }
            $$renderer3.push(`<!----> <!---->`);
            Tooltip_content($$renderer3, spread_props([
              {
                side: "right",
                align: "center",
                hidden: sidebar.state !== "collapsed" || sidebar.isMobile
              },
              tooltipContentProps,
              {
                children: prevent_snippet_stringification(($$renderer4) => {
                  if (typeof tooltipContent === "string") {
                    $$renderer4.push("<!--[-->");
                    $$renderer4.push(`${escape_html(tooltipContent)}`);
                  } else {
                    $$renderer4.push("<!--[!-->");
                    if (tooltipContent) {
                      $$renderer4.push("<!--[-->");
                      tooltipContent($$renderer4);
                      $$renderer4.push(`<!---->`);
                    } else {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]-->`);
                  }
                  $$renderer4.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              }
            ]));
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Sidebar_menu_button
  );
}
Sidebar_menu_button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_menu_item[FILENAME] = "src/lib/components/ui/sidebar/sidebar-menu-item.svelte";
function Sidebar_menu_item($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<li${attributes({
        "data-slot": "sidebar-menu-item",
        "data-sidebar": "menu-item",
        class: clsx(cn("group/menu-item relative", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "li", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></li>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_menu_item
  );
}
Sidebar_menu_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_menu[FILENAME] = "src/lib/components/ui/sidebar/sidebar-menu.svelte";
function Sidebar_menu($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<ul${attributes({
        "data-slot": "sidebar-menu",
        "data-sidebar": "menu",
        class: clsx(cn("flex w-full min-w-0 flex-col gap-1", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "ul", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></ul>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_menu
  );
}
Sidebar_menu.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_provider[FILENAME] = "src/lib/components/ui/sidebar/sidebar-provider.svelte";
function Sidebar_provider($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        open = true,
        onOpenChange = () => {
        },
        class: className,
        style,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      setSidebar({
        open: () => open,
        setOpen: (value) => {
          open = value;
          onOpenChange(value);
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
      });
      $$renderer2.push(`<!---->`);
      Tooltip_provider($$renderer2, {
        delayDuration: 0,
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<div${attributes({
            "data-slot": "sidebar-wrapper",
            style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH)}; --sidebar-width-icon: ${stringify(SIDEBAR_WIDTH_ICON)}; ${stringify(style)}`,
            class: clsx(cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)),
            ...restProps
          })}>`);
          push_element($$renderer3, "div", 41, 1);
          children?.($$renderer3);
          $$renderer3.push(`<!----></div>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
      bind_props($$props, { ref, open });
    },
    Sidebar_provider
  );
}
Sidebar_provider.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_rail[FILENAME] = "src/lib/components/ui/sidebar/sidebar-rail.svelte";
function Sidebar_rail($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      useSidebar();
      $$renderer2.push(`<button${attributes({
        "data-sidebar": "rail",
        "data-slot": "sidebar-rail",
        "aria-label": "Toggle Sidebar",
        tabindex: -1,
        title: "Toggle Sidebar",
        class: clsx(cn("hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-[calc(1/2*100%-1px)] after:w-[2px] sm:flex", "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full", "[[data-side=left][data-collapsible=offcanvas]_&]:-end-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-start-2", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "button", 16, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Sidebar_rail
  );
}
Sidebar_rail.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar_trigger[FILENAME] = "src/lib/components/ui/sidebar/sidebar-trigger.svelte";
function Sidebar_trigger($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        onclick,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const sidebar = useSidebar();
      Button($$renderer2, spread_props([
        {
          "data-sidebar": "trigger",
          "data-slot": "sidebar-trigger",
          variant: "ghost",
          size: "icon",
          class: cn("size-7", className),
          type: "button",
          onclick: (e) => {
            onclick?.(e);
            sidebar.toggle();
          }
        },
        restProps,
        {
          children: prevent_snippet_stringification(($$renderer3) => {
            Panel_left($$renderer3, {});
            $$renderer3.push(`<!----> <span class="sr-only">`);
            push_element($$renderer3, "span", 34, 1);
            $$renderer3.push(`Toggle Sidebar</span>`);
            pop_element();
          }),
          $$slots: { default: true }
        }
      ]));
      bind_props($$props, { ref });
    },
    Sidebar_trigger
  );
}
Sidebar_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Sidebar[FILENAME] = "src/lib/components/ui/sidebar/sidebar.svelte";
function Sidebar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        side = "left",
        variant = "sidebar",
        collapsible = "offcanvas",
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const sidebar = useSidebar();
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (collapsible === "none") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div${attributes({
            class: clsx(cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)),
            ...restProps
          })}>`);
          push_element($$renderer3, "div", 26, 1);
          children?.($$renderer3);
          $$renderer3.push(`<!----></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
          if (sidebar.isMobile) {
            $$renderer3.push("<!--[-->");
            var bind_get = () => sidebar.openMobile;
            var bind_set = (v) => sidebar.setOpenMobile(v);
            $$renderer3.push(`<!---->`);
            Sheet($$renderer3, spread_props([
              {
                get open() {
                  return bind_get();
                },
                set open($$value) {
                  bind_set($$value);
                }
              },
              restProps,
              {
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->`);
                  Sheet_content($$renderer4, {
                    "data-sidebar": "sidebar",
                    "data-slot": "sidebar",
                    "data-mobile": "true",
                    class: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
                    style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH_MOBILE)};`,
                    side,
                    children: prevent_snippet_stringification(($$renderer5) => {
                      $$renderer5.push(`<!---->`);
                      Sheet_header($$renderer5, {
                        class: "sr-only",
                        children: prevent_snippet_stringification(($$renderer6) => {
                          $$renderer6.push(`<!---->`);
                          Sheet_title($$renderer6, {
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<!---->Sidebar`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!----> <!---->`);
                          Sheet_description($$renderer6, {
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<!---->Displays the mobile sidebar.`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!---->`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> <div class="flex h-full w-full flex-col">`);
                      push_element($$renderer5, "div", 53, 3);
                      children?.($$renderer5);
                      $$renderer5.push(`<!----></div>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!---->`);
                }),
                $$slots: { default: true }
              }
            ]));
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div class="text-sidebar-foreground group peer hidden md:block"${attr("data-state", sidebar.state)}${attr("data-collapsible", sidebar.state === "collapsed" ? collapsible : "")}${attr("data-variant", variant)}${attr("data-side", side)} data-slot="sidebar">`);
            push_element($$renderer3, "div", 59, 1);
            $$renderer3.push(`<div data-slot="sidebar-gap"${attr_class(clsx(cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")))}>`);
            push_element($$renderer3, "div", 69, 2);
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` <div${attributes({
              "data-slot": "sidebar-container",
              class: clsx(cn(
                "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
                side === "left" ? "start-0 group-data-[collapsible=offcanvas]:start-[calc(var(--sidebar-width)*-1)]" : "end-0 group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-width)*-1)]",
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s",
                className
              )),
              ...restProps
            })}>`);
            push_element($$renderer3, "div", 80, 2);
            $$renderer3.push(`<div data-sidebar="sidebar" data-slot="sidebar-inner" class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">`);
            push_element($$renderer3, "div", 95, 3);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Sidebar
  );
}
Sidebar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Nav_main[FILENAME] = "src/lib/components/nav-main.svelte";
function Nav_main($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const user = page.data.user;
      let { items } = $$props;
      $$renderer2.push(`<!---->`);
      Sidebar_group($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->`);
          Sidebar_group_label($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->Platform`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <!---->`);
          Sidebar_menu($$renderer3, {
            class: "flex flex-col gap-1",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              const each_array = ensure_array_like(items);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let item = each_array[$$index];
                if (item.roles.includes(user.role)) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<a class="cursor-pointer"${attr("href", item.url)}>`);
                  push_element($$renderer4, "a", 30, 8);
                  $$renderer4.push(`<!---->`);
                  Sidebar_menu_item($$renderer4, {
                    children: prevent_snippet_stringification(($$renderer5) => {
                      $$renderer5.push(`<!---->`);
                      Sidebar_menu_button($$renderer5, {
                        class: cn(buttonVariants({ variant: item.isActive ? "outline" : "ghost" }), "justify-start cursor-pointer hover:text-current"),
                        children: prevent_snippet_stringification(($$renderer6) => {
                          $$renderer6.push(`<!---->`);
                          item.icon($$renderer6, {});
                          $$renderer6.push(`<!----> <span>`);
                          push_element($$renderer6, "span", 34, 14);
                          $$renderer6.push(`${escape_html(item.title)}</span>`);
                          pop_element();
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!---->`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!----></a>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]-->`);
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    },
    Nav_main
  );
}
Nav_main.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Nav_user[FILENAME] = "src/lib/components/nav-user.svelte";
function Nav_user($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user } = $$props;
      const sidebar = useSidebar();
      const navItems = getNavigation(page.url.pathname);
      $$renderer2.push(`<!---->`);
      Sidebar_menu($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->`);
          Sidebar_menu_item($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Dropdown_menu($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->`);
                  {
                    let child = function($$renderer6, { props }) {
                      validate_snippet_args($$renderer6);
                      $$renderer6.push(`<!---->`);
                      Sidebar_menu_button($$renderer6, spread_props([
                        {
                          size: "lg",
                          class: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        },
                        props,
                        {
                          children: prevent_snippet_stringification(($$renderer7) => {
                            $$renderer7.push(`<!---->`);
                            Avatar($$renderer7, {
                              class: "size-8 rounded-lg",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                $$renderer8.push(`<!---->`);
                                Avatar_image($$renderer8, { src: user.image, alt: user.name });
                                $$renderer8.push(`<!----> <!---->`);
                                Avatar_fallback($$renderer8, {
                                  class: "rounded-lg",
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    $$renderer9.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!---->`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer7.push(`<!----> <div class="grid flex-1 text-left text-sm leading-tight">`);
                            push_element($$renderer7, "div", 31, 12);
                            $$renderer7.push(`<span class="truncate font-medium">`);
                            push_element($$renderer7, "span", 32, 14);
                            $$renderer7.push(`${escape_html(user.name)}</span>`);
                            pop_element();
                            $$renderer7.push(` <span class="truncate text-xs">`);
                            push_element($$renderer7, "span", 33, 14);
                            $$renderer7.push(`${escape_html(user.email)}</span>`);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                            $$renderer7.push(` `);
                            Chevrons_up_down($$renderer7, { class: "ml-auto size-4" });
                            $$renderer7.push(`<!---->`);
                          }),
                          $$slots: { default: true }
                        }
                      ]));
                      $$renderer6.push(`<!---->`);
                    };
                    prevent_snippet_stringification(child);
                    Dropdown_menu_trigger($$renderer5, { child, $$slots: { child: true } });
                  }
                  $$renderer5.push(`<!----> <!---->`);
                  Dropdown_menu_content($$renderer5, {
                    class: "w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg",
                    side: sidebar.isMobile ? "bottom" : "right",
                    align: "end",
                    sideOffset: 4,
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->`);
                      Dropdown_menu_label($$renderer6, {
                        class: "p-0 font-normal",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">`);
                          push_element($$renderer7, "div", 41, 10);
                          $$renderer7.push(`<!---->`);
                          Avatar($$renderer7, {
                            class: "size-8 rounded-lg",
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<!---->`);
                              Avatar_image($$renderer8, { src: user.image, alt: user.name });
                              $$renderer8.push(`<!----> <!---->`);
                              Avatar_fallback($$renderer8, {
                                class: "rounded-lg",
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!---->`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer7.push(`<!----> <div class="grid flex-1 text-left text-sm leading-tight">`);
                          push_element($$renderer7, "div", 46, 12);
                          $$renderer7.push(`<span class="truncate font-medium">`);
                          push_element($$renderer7, "span", 47, 14);
                          $$renderer7.push(`${escape_html(user.name)}</span>`);
                          pop_element();
                          $$renderer7.push(` <span class="truncate text-xs">`);
                          push_element($$renderer7, "span", 48, 14);
                          $$renderer7.push(`${escape_html(user.email)}</span>`);
                          pop_element();
                          $$renderer7.push(`</div>`);
                          pop_element();
                          $$renderer7.push(`</div>`);
                          pop_element();
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> <!---->`);
                      Dropdown_menu_separator($$renderer6, {});
                      $$renderer6.push(`<!----> <!---->`);
                      Dropdown_menu_group($$renderer6, {
                        class: "flex flex-col gap-1",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->`);
                          Dropdown_menu_item($$renderer7, {
                            class: "cursor-pointer",
                            onclick: () => location.href = "/",
                            children: prevent_snippet_stringification(($$renderer8) => {
                              House($$renderer8, {});
                              $$renderer8.push(`<!---->Home`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer7.push(`<!----> <!--[-->`);
                          const each_array = ensure_array_like(navItems.navMain);
                          for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                            let item = each_array[i];
                            if (item.roles.includes(user.role)) {
                              $$renderer7.push("<!--[-->");
                              $$renderer7.push(`<!---->`);
                              Dropdown_menu_item($$renderer7, {
                                class: cn(buttonVariants({ variant: item.isActive ? "outline" : "ghost" }), "cursor-pointer justify-start"),
                                onclick: () => location.href = item.url,
                                children: prevent_snippet_stringification(($$renderer8) => {
                                  $$renderer8.push(`<!---->`);
                                  item.icon($$renderer8, {});
                                  $$renderer8.push(`<!---->${escape_html(item.title)}`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!---->`);
                            } else {
                              $$renderer7.push("<!--[!-->");
                            }
                            $$renderer7.push(`<!--]-->`);
                          }
                          $$renderer7.push(`<!--]-->`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> <!---->`);
                      Dropdown_menu_separator($$renderer6, {});
                      $$renderer6.push(`<!----> <!---->`);
                      Dropdown_menu_item($$renderer6, {
                        onclick: () => location.href = "/auth/logout",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          Log_out($$renderer7, {});
                          $$renderer7.push(`<!---->Log out`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
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
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    },
    Nav_user
  );
}
Nav_user.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Team_switcher[FILENAME] = "src/lib/components/team-switcher.svelte";
function Team_switcher($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { teams } = $$props;
      useSidebar();
      let activeTeam = teams[0];
      $$renderer2.push(`<!---->`);
      Sidebar_menu($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->`);
          Sidebar_menu_item($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<a href="/">`);
              push_element($$renderer4, "a", 13, 4);
              $$renderer4.push(`<!---->`);
              Sidebar_menu_button($$renderer4, {
                size: "lg",
                class: "cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">`);
                  push_element($$renderer5, "div", 15, 8);
                  $$renderer5.push(`<!---->`);
                  activeTeam.logo($$renderer5, { class: "size-4", type: "normal" });
                  $$renderer5.push(`<!----></div>`);
                  pop_element();
                  $$renderer5.push(` <div class="grid flex-1 text-left text-sm leading-tight">`);
                  push_element($$renderer5, "div", 18, 8);
                  $$renderer5.push(`<span class="truncate font-medium">`);
                  push_element($$renderer5, "span", 19, 10);
                  $$renderer5.push(`${escape_html(activeTeam.name)}</span>`);
                  pop_element();
                  $$renderer5.push(` <span class="truncate text-xs">`);
                  push_element($$renderer5, "span", 20, 10);
                  $$renderer5.push(`${escape_html(activeTeam.plan)}</span>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` `);
                  House($$renderer5, { class: "ml-auto" });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></a>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    },
    Team_switcher
  );
}
Team_switcher.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
App_sidebar[FILENAME] = "src/lib/components/app-sidebar.svelte";
function App_sidebar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        collapsible = "icon",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const data = getNavigation(page.url.pathname);
      const user = page.data.user;
      $$renderer2.push(`<!---->`);
      Sidebar($$renderer2, spread_props([
        { collapsible },
        restProps,
        {
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->`);
            Sidebar_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Team_switcher($$renderer4, { teams: data.teams });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> <!---->`);
            Sidebar_content($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Nav_main($$renderer4, { items: data.navMain });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> <!---->`);
            Sidebar_footer($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Nav_user($$renderer4, { user });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> <!---->`);
            Sidebar_rail($$renderer3, {});
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
      $$renderer2.push(`<!---->`);
      bind_props($$props, { ref });
    },
    App_sidebar
  );
}
App_sidebar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ModeToggle[FILENAME] = "src/lib/components/widgets/ModeToggle.svelte";
function ModeToggle($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Button($$renderer2, {
        onclick: toggleMode,
        variant: "ghost",
        size: "icon",
        class: "h-9 w-9 rounded-full transition-colors hover:bg-muted",
        children: prevent_snippet_stringification(($$renderer3) => {
          Sun($$renderer3, {
            class: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          });
          $$renderer3.push(`<!----> `);
          Moon($$renderer3, {
            class: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          });
          $$renderer3.push(`<!----> <span class="sr-only">`);
          push_element($$renderer3, "span", 10, 2);
          $$renderer3.push(`Toggle theme</span>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
    },
    ModeToggle
  );
}
ModeToggle.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Breadcrumb[FILENAME] = "src/lib/components/ui/breadcrumb/breadcrumb.svelte";
function Breadcrumb($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<nav${attributes({
        "data-slot": "breadcrumb",
        class: clsx(className),
        "aria-label": "breadcrumb",
        ...restProps
      })}>`);
      push_element($$renderer2, "nav", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></nav>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Breadcrumb
  );
}
Breadcrumb.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Breadcrumb_item[FILENAME] = "src/lib/components/ui/breadcrumb/breadcrumb-item.svelte";
function Breadcrumb_item($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<li${attributes({
        "data-slot": "breadcrumb-item",
        class: clsx(cn("inline-flex items-center gap-1.5", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "li", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></li>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Breadcrumb_item
  );
}
Breadcrumb_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Breadcrumb_separator[FILENAME] = "src/lib/components/ui/breadcrumb/breadcrumb-separator.svelte";
function Breadcrumb_separator($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<li${attributes({
        "data-slot": "breadcrumb-separator",
        role: "presentation",
        "aria-hidden": "true",
        class: clsx(cn("[&>svg]:size-3.5", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "li", 14, 0);
      if (children) {
        $$renderer2.push("<!--[-->");
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        Chevron_right($$renderer2, {});
      }
      $$renderer2.push(`<!--]--></li>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Breadcrumb_separator
  );
}
Breadcrumb_separator.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Breadcrumb_link[FILENAME] = "src/lib/components/ui/breadcrumb/breadcrumb-link.svelte";
function Breadcrumb_link($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        href = void 0,
        child,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const attrs = {
        "data-slot": "breadcrumb-link",
        class: cn("hover:text-foreground transition-colors", className),
        href,
        ...restProps
      };
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: attrs });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<a${attributes({ ...attrs })}>`);
        push_element($$renderer2, "a", 28, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></a>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Breadcrumb_link
  );
}
Breadcrumb_link.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Breadcrumb_list[FILENAME] = "src/lib/components/ui/breadcrumb/breadcrumb-list.svelte";
function Breadcrumb_list($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<ol${attributes({
        "data-slot": "breadcrumb-list",
        class: clsx(cn("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "ol", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></ol>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Breadcrumb_list
  );
}
Breadcrumb_list.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Crumb_path[FILENAME] = "src/lib/components/ui/crumb-path/crumb-path.svelte";
function Crumb_path($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const getBreadcrumbs = (url) => {
        const segments = url.pathname.split("/").filter(Boolean);
        return segments.map((segment, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          const name = segment;
          return { name, path };
        });
      };
      let breadcrumbs = getBreadcrumbs(page.url);
      $$renderer2.push(`<!---->`);
      Breadcrumb($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->`);
          Breadcrumb_list($$renderer3, {
            class: "items-center",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              const each_array = ensure_array_like(breadcrumbs);
              for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                let { name, path } = each_array[i];
                $$renderer4.push(`<!---->`);
                Breadcrumb_item($$renderer4, {
                  class: i < breadcrumbs.length - 1 ? "hidden md:block" : "",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->`);
                    Breadcrumb_link($$renderer5, {
                      href: path,
                      class: "capitalize max-w-20 line-clamp-1",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(name.replace(/-/g, " "))}`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                if (i < breadcrumbs.length - 1) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<!---->`);
                  Breadcrumb_separator($$renderer4, { class: "hidden md:block -mb-0.5" });
                  $$renderer4.push(`<!---->`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]-->`);
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    },
    Crumb_path
  );
}
Crumb_path.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
QueryClientProvider[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@tanstack/svelte-query/dist/QueryClientProvider.svelte";
function QueryClientProvider($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let client = fallback($$props["client"], () => new QueryClient(), true);
      setQueryClientContext(client);
      onDestroy(() => {
        client.unmount();
      });
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { client });
    },
    QueryClientProvider
  );
}
QueryClientProvider.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Devtools[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@tanstack/svelte-query-devtools/dist/Devtools.svelte";
function Devtools($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let initialIsOpen = fallback($$props["initialIsOpen"], false);
      let buttonPosition = fallback($$props["buttonPosition"], "bottom-right");
      let position = fallback($$props["position"], "bottom");
      let client = fallback($$props["client"], useQueryClient, true);
      let errorTypes = fallback($$props["errorTypes"], () => [], true);
      let styleNonce = fallback($$props["styleNonce"], void 0);
      let shadowDOMTarget = fallback($$props["shadowDOMTarget"], void 0);
      let hideDisabledQueries = fallback($$props["hideDisabledQueries"], false);
      $$renderer2.push(`<div class="tsqd-parent-container">`);
      push_element($$renderer2, "div", 63, 0);
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, {
        initialIsOpen,
        buttonPosition,
        position,
        client,
        errorTypes,
        styleNonce,
        shadowDOMTarget,
        hideDisabledQueries
      });
    },
    Devtools
  );
}
Devtools.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Logged_in[FILENAME] = "src/lib/authentication/ui/user/logged-in.svelte";
function Logged_in($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user, class: className } = $$props;
      const logout = async () => {
        await signOut({
          fetchOptions: {
            onError: (ctx) => {
              toast.error("Error Alert", { description: ctx.error.message });
            },
            onSuccess: () => {
              toast.success("Success Alert", { description: "Successfully signed out" });
              location.href = "/auth/login";
            }
          }
        });
      };
      const profile = () => {
        location.href = "/profile";
      };
      $$renderer2.push(`<!---->`);
      Dropdown_menu($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->`);
          Dropdown_menu_trigger($$renderer3, {
            class: cn(buttonVariants({ variant: "outline", size: "icon" }), "cursor-pointer rounded-lg border-none outline-none", className),
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Avatar($$renderer4, {
                class: "size-9 rounded-lg",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->`);
                  Avatar_image($$renderer5, { class: "rounded-lg", src: user.image, alt: user.name });
                  $$renderer5.push(`<!----> <!---->`);
                  Avatar_fallback($$renderer5, {
                    class: "rounded-lg uppercase",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
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
          $$renderer3.push(`<!----> <!---->`);
          Dropdown_menu_content($$renderer3, {
            class: "w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg",
            align: "end",
            sideOffset: 4,
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Dropdown_menu_label($$renderer4, {
                class: "p-0 font-normal",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">`);
                  push_element($$renderer5, "div", 31, 3);
                  $$renderer5.push(`<!---->`);
                  Avatar($$renderer5, {
                    class: "size-8 rounded-lg",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->`);
                      Avatar_image($$renderer6, { src: user.image, alt: user.name });
                      $$renderer6.push(`<!----> <!---->`);
                      Avatar_fallback($$renderer6, {
                        class: "rounded-lg uppercase",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> <div class="grid flex-1 text-left text-sm leading-tight">`);
                  push_element($$renderer5, "div", 36, 4);
                  $$renderer5.push(`<span class="truncate font-medium">`);
                  push_element($$renderer5, "span", 37, 5);
                  $$renderer5.push(`${escape_html(user.name)}</span>`);
                  pop_element();
                  $$renderer5.push(` <span class="truncate text-xs">`);
                  push_element($$renderer5, "span", 38, 5);
                  $$renderer5.push(`${escape_html(user.email)}</span>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <div class="px-2 py-1.5 text-sm">`);
              push_element($$renderer4, "div", 42, 2);
              $$renderer4.push(`<div class="flex items-center gap-2 mb-1">`);
              push_element($$renderer4, "div", 43, 3);
              $$renderer4.push(`<span class="text-muted-foreground">`);
              push_element($$renderer4, "span", 44, 4);
              $$renderer4.push(`Role:</span>`);
              pop_element();
              $$renderer4.push(` `);
              Badge($$renderer4, {
                class: "text-xs capitalize",
                variant: getRoleBadgeVariant(user.role),
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(user.role)}`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <!---->`);
              Dropdown_menu_separator($$renderer4, {});
              $$renderer4.push(`<!----> <!---->`);
              Dropdown_menu_item($$renderer4, {
                class: "cursor-pointer",
                onclick: profile,
                children: prevent_snippet_stringification(($$renderer5) => {
                  User($$renderer5, {});
                  $$renderer5.push(`<!---->Profile`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <!---->`);
              Dropdown_menu_separator($$renderer4, {});
              $$renderer4.push(`<!----> <!---->`);
              Dropdown_menu_item($$renderer4, {
                class: "cursor-pointer",
                onclick: logout,
                children: prevent_snippet_stringification(($$renderer5) => {
                  Log_out($$renderer5, {});
                  $$renderer5.push(`<!---->Log out`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    },
    Logged_in
  );
}
Logged_in.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Auth_dialog[FILENAME] = "src/lib/authentication/ui/user/auth-dialog.svelte";
function Auth_dialog($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const user = page.data.user;
      if (user) {
        $$renderer2.push("<!--[-->");
        Logged_in($$renderer2, { user });
      } else {
        $$renderer2.push("<!--[!-->");
        Button($$renderer2, {
          href: `/auth/login?redirectTo=${Constants.AFTERAUTH}`,
          variant: "outline",
          class: "relative cursor-pointer rounded-lg p-0",
          size: "icon",
          children: prevent_snippet_stringification(($$renderer3) => {
            User($$renderer3, { class: "size-4" });
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]-->`);
    },
    Auth_dialog
  );
}
Auth_dialog.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
TrialBanner[FILENAME] = "src/lib/components/billing/TrialBanner.svelte";
function TrialBanner($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    TrialBanner
  );
}
TrialBanner.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout[FILENAME] = "src/routes/(protected)/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      $$renderer2.push(`<!---->`);
      Sidebar_provider($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          App_sidebar($$renderer3, {});
          $$renderer3.push(`<!----> <!---->`);
          Sidebar_inset($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<header class="sticky top-0 left-0 z-1 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">`);
              push_element($$renderer4, "header", 51, 4);
              $$renderer4.push(`<div class="flex items-center gap-2 px-4">`);
              push_element($$renderer4, "div", 54, 6);
              $$renderer4.push(`<!---->`);
              Sidebar_trigger($$renderer4, { class: "-ml-1" });
              $$renderer4.push(`<!----> `);
              Separator($$renderer4, {
                orientation: "vertical",
                class: "mr-2 data-[orientation=vertical]:h-4"
              });
              $$renderer4.push(`<!----> `);
              Crumb_path($$renderer4);
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center gap-2 pr-4">`);
              push_element($$renderer4, "div", 59, 6);
              ModeToggle($$renderer4);
              $$renderer4.push(`<!----> `);
              Auth_dialog($$renderer4);
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</header>`);
              pop_element();
              $$renderer4.push(` `);
              TrialBanner($$renderer4);
              $$renderer4.push(`<!----> <div class="flex flex-1 flex-col gap-4 p-4 py-0 animate-in">`);
              push_element($$renderer4, "div", 65, 4);
              QueryClientProvider($$renderer4, {
                client: infiniteScroll.queryClient,
                children: prevent_snippet_stringification(($$renderer5) => {
                  children($$renderer5);
                  $$renderer5.push(`<!----> `);
                  Devtools($$renderer5, {});
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
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
