import { f as bind_props, U as Menu, s as spread_props, F as FILENAME, V as Portal, p as prevent_snippet_stringification, W as Dropdown_menu_content$1, X as Menu_group, Y as Menu_item, c as attributes, d as clsx, a as push_element, b as pop_element, Z as Menu_separator, _ as Menu_trigger } from "./ui-libs.js";
import { c as cn } from "./utils2.js";
Dropdown_menu[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu.svelte";
function Dropdown_menu($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { open = false, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Menu($$renderer3, spread_props([
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
    Dropdown_menu
  );
}
Dropdown_menu.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dropdown_menu_portal[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu-portal.svelte";
function Dropdown_menu_portal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Portal($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Dropdown_menu_portal
  );
}
Dropdown_menu_portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dropdown_menu_content[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu-content.svelte";
function Dropdown_menu_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        sideOffset = 4,
        portalProps,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Dropdown_menu_portal($$renderer3, spread_props([
          portalProps,
          {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Dropdown_menu_content$1($$renderer4, spread_props([
                {
                  "data-slot": "dropdown-menu-content",
                  sideOffset,
                  class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-[8rem] origin-(--bits-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none", className)
                },
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
    Dropdown_menu_content
  );
}
Dropdown_menu_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dropdown_menu_group[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu-group.svelte";
function Dropdown_menu_group($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { ref = null, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Menu_group($$renderer3, spread_props([
          { "data-slot": "dropdown-menu-group" },
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
    Dropdown_menu_group
  );
}
Dropdown_menu_group.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dropdown_menu_item[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu-item.svelte";
function Dropdown_menu_item($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        inset,
        variant = "default",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Menu_item($$renderer3, spread_props([
          {
            "data-slot": "dropdown-menu-item",
            "data-inset": inset,
            "data-variant": variant,
            class: cn("data-highlighted:bg-white/10 data-highlighted:text-white data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 data-[variant=destructive]:data-highlighted:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:ps-8 text-white/90 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
          },
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
    Dropdown_menu_item
  );
}
Dropdown_menu_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dropdown_menu_label[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu-label.svelte";
function Dropdown_menu_label($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        inset,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "dropdown-menu-label",
        "data-inset": inset,
        class: clsx(cn("px-2 py-1.5 text-sm font-semibold data-inset:ps-8", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 16, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Dropdown_menu_label
  );
}
Dropdown_menu_label.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dropdown_menu_separator[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu-separator.svelte";
function Dropdown_menu_separator($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Menu_separator($$renderer3, spread_props([
          {
            "data-slot": "dropdown-menu-separator",
            class: cn("bg-border -mx-1 my-1 h-px", className)
          },
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
    Dropdown_menu_separator
  );
}
Dropdown_menu_separator.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dropdown_menu_trigger[FILENAME] = "src/lib/components/ui/dropdown-menu/dropdown-menu-trigger.svelte";
function Dropdown_menu_trigger($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { ref = null, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Menu_trigger($$renderer3, spread_props([
          { "data-slot": "dropdown-menu-trigger" },
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
    Dropdown_menu_trigger
  );
}
Dropdown_menu_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Dropdown_menu as D,
  Dropdown_menu_trigger as a,
  Dropdown_menu_content as b,
  Dropdown_menu_item as c,
  Dropdown_menu_label as d,
  Dropdown_menu_separator as e,
  Dropdown_menu_group as f
};
