import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, f as bind_props, aq as Select$1, ar as Select_group$1, E as validate_snippet_args, a as push_element, b as pop_element, e as escape_html, as as Select_item$1, V as Portal, at as Select_scroll_up_button$1, au as Select_scroll_down_button$1, av as Select_content$1, aw as Select_viewport, ax as Select_trigger$1, i as ensure_array_like, c as attributes, d as clsx, j as attr_class, ay as Debounced, k as store_get, u as unsubscribe_stores } from "../../../../chunks/ui-libs.js";
import { B as Button } from "../../../../chunks/button.js";
import { I as Input } from "../../../../chunks/input.js";
import { D as Dialog, b as Dialog_content, c as Dialog_header, d as Dialog_title, e as Dialog_description, f as Dialog_footer } from "../../../../chunks/dialog-trigger.js";
import "../../../../chunks/label.js";
import { c as cn } from "../../../../chunks/utils2.js";
import { C as Check } from "../../../../chunks/check.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chevron_down } from "../../../../chunks/chevron-down.js";
import "../../../../chunks/separator.js";
import { p as page } from "../../../../chunks/index2.js";
import { a as adminRoles } from "../../../../chunks/index.js";
import { g as getRoleBadgeVariant, r as roles, i as infiniteScroll } from "../../../../chunks/fxn.js";
import { L as Loading_spinner } from "../../../../chunks/loading-spinner.js";
import "clsx";
import { t as toast } from "../../../../chunks/toast-state.svelte.js";
import { B as Badge } from "../../../../chunks/badge.js";
import { format } from "date-fns";
import { a as admin } from "../../../../chunks/auth-client.js";
import { A as Avatar, a as Avatar_image, b as Avatar_fallback } from "../../../../chunks/avatar-fallback.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { tv } from "tailwind-variants";
import { L as Loader_circle } from "../../../../chunks/loader-circle.js";
import { U as Users } from "../../../../chunks/users.js";
import { S as Search } from "../../../../chunks/search.js";
import { C as Circle_alert } from "../../../../chunks/circle-alert.js";
Chevron_up[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/chevron-up.svelte";
function Chevron_up($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [["path", { "d": "m18 15-6-6-6 6" }]];
      Icon($$renderer2, spread_props([
        { name: "chevron-up" },
        /**
         * @component @name ChevronUp
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTUtNi02LTYgNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-up
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
    Chevron_up
  );
}
Chevron_up.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Triangle_alert[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/triangle-alert.svelte";
function Triangle_alert($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
          }
        ],
        ["path", { "d": "M12 9v4" }],
        ["path", { "d": "M12 17h.01" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "triangle-alert" },
        /**
         * @component @name TriangleAlert
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiIC8+CiAgPHBhdGggZD0iTTEyIDl2NCIgLz4KICA8cGF0aCBkPSJNMTIgMTdoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/triangle-alert
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
    Triangle_alert
  );
}
Triangle_alert.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select[FILENAME] = "src/lib/components/ui/select/select.svelte";
function Select($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        open = false,
        value = void 0,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select$1($$renderer3, spread_props([
          restProps,
          {
            get open() {
              return open;
            },
            set open($$value) {
              open = $$value;
              $$settled = false;
            },
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
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
      bind_props($$props, { open, value });
    },
    Select
  );
}
Select.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_group[FILENAME] = "src/lib/components/ui/select/select-group.svelte";
function Select_group($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { ref = null, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select_group$1($$renderer3, spread_props([
          { "data-slot": "select-group" },
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
    Select_group
  );
}
Select_group.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_item[FILENAME] = "src/lib/components/ui/select/select-item.svelte";
function Select_item($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        value,
        label,
        children: childrenProp,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        {
          let children = function($$renderer4, { selected, highlighted }) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<span class="absolute end-2 flex size-3.5 items-center justify-center">`);
            push_element($$renderer4, "span", 27, 2);
            if (selected) {
              $$renderer4.push("<!--[-->");
              Check($$renderer4, { class: "size-4" });
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></span>`);
            pop_element();
            $$renderer4.push(` `);
            if (childrenProp) {
              $$renderer4.push("<!--[-->");
              childrenProp($$renderer4, { selected, highlighted });
              $$renderer4.push(`<!---->`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`${escape_html(label || value)}`);
            }
            $$renderer4.push(`<!--]-->`);
          };
          prevent_snippet_stringification(children);
          Select_item$1($$renderer3, spread_props([
            {
              value,
              "data-slot": "select-item",
              class: cn("data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className)
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
              children,
              $$slots: { default: true }
            }
          ]));
        }
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
    Select_item
  );
}
Select_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_portal[FILENAME] = "src/lib/components/ui/select/select-portal.svelte";
function Select_portal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Portal($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Select_portal
  );
}
Select_portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_scroll_up_button[FILENAME] = "src/lib/components/ui/select/select-scroll-up-button.svelte";
function Select_scroll_up_button($$renderer, $$props) {
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
        Select_scroll_up_button$1($$renderer3, spread_props([
          {
            "data-slot": "select-scroll-up-button",
            class: cn("flex cursor-default items-center justify-center py-1", className)
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
              Chevron_up($$renderer4, { class: "size-4" });
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
    Select_scroll_up_button
  );
}
Select_scroll_up_button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_scroll_down_button[FILENAME] = "src/lib/components/ui/select/select-scroll-down-button.svelte";
function Select_scroll_down_button($$renderer, $$props) {
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
        Select_scroll_down_button$1($$renderer3, spread_props([
          {
            "data-slot": "select-scroll-down-button",
            class: cn("flex cursor-default items-center justify-center py-1", className)
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
              Chevron_down($$renderer4, { class: "size-4" });
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
    Select_scroll_down_button
  );
}
Select_scroll_down_button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_content[FILENAME] = "src/lib/components/ui/select/select-content.svelte";
function Select_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        sideOffset = 4,
        portalProps,
        children,
        preventScroll = true,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Select_portal($$renderer3, spread_props([
          portalProps,
          {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Select_content$1($$renderer4, spread_props([
                {
                  sideOffset,
                  preventScroll,
                  "data-slot": "select-content",
                  class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--bits-select-content-available-height) min-w-[8rem] origin-(--bits-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)
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
                    Select_scroll_up_button($$renderer5, {});
                    $$renderer5.push(`<!----> <!---->`);
                    Select_viewport($$renderer5, {
                      class: cn("h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1 p-1"),
                      children: prevent_snippet_stringification(($$renderer6) => {
                        children?.($$renderer6);
                        $$renderer6.push(`<!---->`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Select_scroll_down_button($$renderer5, {});
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
    Select_content
  );
}
Select_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_trigger[FILENAME] = "src/lib/components/ui/select/select-trigger.svelte";
function Select_trigger($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        size = "default",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select_trigger$1($$renderer3, spread_props([
          {
            "data-slot": "select-trigger",
            "data-size": size,
            class: cn("border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none select-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
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
              $$renderer4.push(`<!----> `);
              Chevron_down($$renderer4, { class: "size-4 opacity-50" });
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
    Select_trigger
  );
}
Select_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_component[FILENAME] = "src/routes/(protected)/users/components/select-component.svelte";
function Select_component($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        options = [],
        value = "",
        placeholder,
        class: className,
        name,
        disabled = false,
        onValueChange
      } = $$props;
      const triggerContent = options.find((f) => f.value === value)?.label ?? placeholder;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select($$renderer3, {
          type: "single",
          name,
          disabled,
          onValueChange,
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->`);
            Select_trigger($$renderer4, {
              class: cn("w-[180px]", className),
              "aria-label": name,
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html(triggerContent)}`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <!---->`);
            Select_content($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->`);
                Select_group($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!--[-->`);
                    const each_array = ensure_array_like(options);
                    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                      let option = each_array[$$index];
                      $$renderer6.push(`<!---->`);
                      Select_item($$renderer6, {
                        value: option.value,
                        label: option.label,
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->${escape_html(option.label)}`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
                    }
                    $$renderer6.push(`<!--]-->`);
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
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { value });
    },
    Select_component
  );
}
Select_component.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DeleteDialog[FILENAME] = "src/routes/(protected)/users/components/DeleteDialog.svelte";
function DeleteDialog($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user, open, onOpenChange } = $$props;
      const me = page.data.user;
      let isLoading = false;
      const handleDelete = async () => {
        isLoading = true;
        try {
          const url = `/api/users/${user.id}`;
          const options = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ me, data: null })
          };
          const response = await fetch(url, options);
          const { status, message } = await response.json();
          if (status === "error") throw new Error(message);
          toast.success("Success Alert", { description: `Successfully deleted ${user.name}` });
          location.reload();
        } catch (err) {
          console.error("Failed to delete user:", err);
          toast.error("Error Alert", { description: err.message || "Failed to delete user" });
        } finally {
          isLoading = false;
        }
      };
      const handleOpenChange = (newOpen) => {
        if (!isLoading) onOpenChange(newOpen);
      };
      Dialog($$renderer2, {
        open,
        onOpenChange: handleOpenChange,
        children: prevent_snippet_stringification(($$renderer3) => {
          Dialog_content($$renderer3, {
            class: "sm:max-w-md",
            children: prevent_snippet_stringification(($$renderer4) => {
              Dialog_header($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Dialog_title($$renderer5, {
                    class: "flex items-center gap-2 text-red-600",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Triangle_alert($$renderer6, { class: "h-5 w-5" });
                      $$renderer6.push(`<!---->Delete User`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Dialog_description($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->This action cannot be undone. This will permanently delete the user.`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <div class="space-y-2 rounded-lg border bg-gray-50 p-4 dark:bg-secondary">`);
              push_element($$renderer4, "div", 54, 4);
              $$renderer4.push(`<div class="flex items-center justify-between">`);
              push_element($$renderer4, "div", 55, 6);
              $$renderer4.push(`<span class="text-sm font-medium">`);
              push_element($$renderer4, "span", 55, 53);
              $$renderer4.push(`Name:</span>`);
              pop_element();
              $$renderer4.push(`<span class="text-sm">`);
              push_element($$renderer4, "span", 55, 99);
              $$renderer4.push(`${escape_html(user.name)}</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center justify-between">`);
              push_element($$renderer4, "div", 56, 6);
              $$renderer4.push(`<span class="text-sm font-medium">`);
              push_element($$renderer4, "span", 56, 53);
              $$renderer4.push(`Role:</span>`);
              pop_element();
              $$renderer4.push(`<span class="text-sm capitalize">`);
              push_element($$renderer4, "span", 56, 99);
              $$renderer4.push(`${escape_html(user.role)}</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` `);
              Dialog_footer($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Button($$renderer5, {
                    type: "button",
                    variant: "outline",
                    class: "cursor-pointer",
                    onclick: () => handleOpenChange(false),
                    disabled: isLoading,
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->Cancel`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  if (isLoading) {
                    $$renderer5.push("<!--[-->");
                    Button($$renderer5, {
                      disabled: isLoading,
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Loading_spinner($$renderer6, { class: "text-white" });
                        $$renderer6.push(`<!----><span>`);
                        push_element($$renderer6, "span", 61, 74);
                        $$renderer6.push(`Deleting...</span>`);
                        pop_element();
                      }),
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer5.push("<!--[!-->");
                    Button($$renderer5, {
                      type: "button",
                      variant: "destructive",
                      onclick: handleDelete,
                      disabled: isLoading,
                      class: "cursor-pointer",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->Delete User`);
                      }),
                      $$slots: { default: true }
                    });
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
    DeleteDialog
  );
}
DeleteDialog.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table[FILENAME] = "src/lib/components/ui/table/table.svelte";
function Table($$renderer, $$props) {
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
      $$renderer2.push(`<div data-slot="table-container" class="relative w-full overflow-x-auto">`);
      push_element($$renderer2, "div", 13, 0);
      $$renderer2.push(`<table${attributes({
        "data-slot": "table",
        class: clsx(cn("w-full caption-bottom text-sm", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "table", 14, 1);
      children?.($$renderer2);
      $$renderer2.push(`<!----></table>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table
  );
}
Table.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_body[FILENAME] = "src/lib/components/ui/table/table-body.svelte";
function Table_body($$renderer, $$props) {
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
      $$renderer2.push(`<tbody${attributes({
        "data-slot": "table-body",
        class: clsx(cn("[&_tr:last-child]:border-0", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "tbody", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></tbody>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_body
  );
}
Table_body.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_cell[FILENAME] = "src/lib/components/ui/table/table-cell.svelte";
function Table_cell($$renderer, $$props) {
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
      $$renderer2.push(`<td${attributes({
        "data-slot": "table-cell",
        class: clsx(cn("bg-clip-padding p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "td", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></td>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_cell
  );
}
Table_cell.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_head[FILENAME] = "src/lib/components/ui/table/table-head.svelte";
function Table_head($$renderer, $$props) {
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
      $$renderer2.push(`<th${attributes({
        "data-slot": "table-head",
        class: clsx(cn("text-foreground h-10 bg-clip-padding px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "th", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></th>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_head
  );
}
Table_head.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_header[FILENAME] = "src/lib/components/ui/table/table-header.svelte";
function Table_header($$renderer, $$props) {
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
      $$renderer2.push(`<thead${attributes({
        "data-slot": "table-header",
        class: clsx(cn("[&_tr]:border-b", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "thead", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></thead>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_header
  );
}
Table_header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_row[FILENAME] = "src/lib/components/ui/table/table-row.svelte";
function Table_row($$renderer, $$props) {
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
      $$renderer2.push(`<tr${attributes({
        "data-slot": "table-row",
        class: clsx(cn("hover:[&,&>svelte-css-wrapper]:[&>th,td]:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "tr", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></tr>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_row
  );
}
Table_row.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Identity[FILENAME] = "src/lib/authentication/ui/user/Identity.svelte";
function Identity($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user, class: className, direction = "left" } = $$props;
      if (user) {
        $$renderer2.push("<!--[-->");
        if (direction === "left") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attr_class(clsx(cn("flex items-center gap-2 px-1 py-1.5 text-left text-sm", className)))}>`);
          push_element($$renderer2, "div", 10, 2);
          $$renderer2.push(`<!---->`);
          Avatar($$renderer2, {
            class: "size-8 rounded-lg",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->`);
              Avatar_image($$renderer3, { src: user?.image, alt: user?.name });
              $$renderer3.push(`<!----> <!---->`);
              Avatar_fallback($$renderer3, {
                class: "rounded-lg uppercase",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(user?.name?.slice(0, 2))}`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----> <div class="grid flex-1 text-left text-sm leading-tight">`);
          push_element($$renderer2, "div", 15, 3);
          $$renderer2.push(`<span class="truncate font-medium">`);
          push_element($$renderer2, "span", 16, 4);
          $$renderer2.push(`${escape_html(user?.name)}</span>`);
          pop_element();
          $$renderer2.push(` <span class="truncate text-xs text-muted-foreground">`);
          push_element($$renderer2, "span", 17, 4);
          $$renderer2.push(`${escape_html(user?.email)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (direction === "right") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attr_class(clsx(cn("flex items-center justify-end gap-2 px-1 py-1.5 text-sm", className)))}>`);
          push_element($$renderer2, "div", 22, 2);
          $$renderer2.push(`<div class="grid flex-1 text-right text-sm leading-tight">`);
          push_element($$renderer2, "div", 23, 3);
          $$renderer2.push(`<span class="truncate font-medium">`);
          push_element($$renderer2, "span", 24, 4);
          $$renderer2.push(`${escape_html(user?.name)}</span>`);
          pop_element();
          $$renderer2.push(` <span class="truncate text-xs text-muted-foreground">`);
          push_element($$renderer2, "span", 25, 4);
          $$renderer2.push(`${escape_html(user?.email)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <!---->`);
          Avatar($$renderer2, {
            class: "size-8 rounded-lg",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->`);
              Avatar_image($$renderer3, { src: user?.image, alt: user?.name });
              $$renderer3.push(`<!----> <!---->`);
              Avatar_fallback($$renderer3, {
                class: "rounded-lg uppercase",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(user?.name?.slice(0, 2))}`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----></div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    Identity
  );
}
Identity.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ListCard[FILENAME] = "src/routes/(protected)/users/components/ListCard.svelte";
function ListCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user, i, onDelete, screen } = $$props;
      let updating = null;
      const me = page.data.user;
      const isAdmin = adminRoles.includes(me.role);
      const num = i + 1;
      const roleVariant = getRoleBadgeVariant(user?.role);
      const updateUserRole = async (profile, newRole) => {
        if (!adminRoles.includes(me.role)) {
          toast.error("Access Denied", { description: "Only administrators can change user roles." });
          return;
        }
        updating = profile.id;
        try {
          const canChangeRole = await admin.hasPermission({ permissions: { user: ["set-role"] } });
          if (!canChangeRole.data?.success) throw new Error("Forbidden");
          await admin.setRole({ userId: profile.id, role: newRole });
          toast.success("Success", { description: "User role updated successfully." });
          location.reload();
        } catch (error) {
          console.error("Error updating user role:", error);
          toast.error("Error", { description: "Failed to update user role. Please try again." });
        } finally {
          updating = null;
        }
      };
      const onValueChange = async (profile, val) => {
        await updateUserRole(profile, val);
      };
      if (screen === "desktop") {
        $$renderer2.push("<!--[-->");
        Table_row($$renderer2, {
          class: "cursor-pointer hover:bg-muted/50",
          children: prevent_snippet_stringification(($$renderer3) => {
            Table_cell($$renderer3, {
              class: "font-medium",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(num)}.`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              class: "font-medium",
              children: prevent_snippet_stringification(($$renderer4) => {
                Identity($$renderer4, { user });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Badge($$renderer4, {
                  variant: roleVariant,
                  class: "capitalize",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(user.role)}`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(format(new Date(user.createdAt), "MMM dd, yyyy"))}`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              class: "flex h-full items-center justify-end gap-2 text-right",
              children: prevent_snippet_stringification(($$renderer4) => {
                if (isAdmin && me.id !== user?.id) {
                  $$renderer4.push("<!--[-->");
                  Select_component($$renderer4, {
                    disabled: updating === user.id,
                    value: user.role,
                    options: roles,
                    class: "h-full w-32 flex-1",
                    name: "role",
                    onValueChange: (val) => onValueChange(user, val),
                    placeholder: "Select role"
                  });
                  $$renderer4.push(`<!----> `);
                  Button($$renderer4, {
                    disabled: updating === user.id,
                    variant: "ghost",
                    size: "sm",
                    onclick: (e) => {
                      e.stopPropagation();
                      onDelete(user);
                    },
                    class: "h-8 w-8 cursor-pointer p-0 text-red-600 hover:bg-red-50 hover:text-red-700",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      Trash_2($$renderer5, { class: "h-4 w-4" });
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!---->`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<span class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "span", 67, 8);
                  $$renderer4.push(`${escape_html(me.id === user?.id ? "You" : "No access")}</span>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="rounded-lg border bg-white shadow-sm dark:bg-secondary/50">`);
        push_element($$renderer2, "div", 72, 2);
        $$renderer2.push(`<div class="border-b p-3">`);
        push_element($$renderer2, "div", 73, 4);
        $$renderer2.push(`<div class="flex items-start justify-between gap-2">`);
        push_element($$renderer2, "div", 74, 6);
        $$renderer2.push(`<div class="min-w-0 flex-1">`);
        push_element($$renderer2, "div", 75, 8);
        Identity($$renderer2, { user, class: "px-0" });
        $$renderer2.push(`<!----> <div class="mt-1 flex flex-wrap items-center gap-1.5">`);
        push_element($$renderer2, "div", 77, 10);
        Badge($$renderer2, {
          class: "text-xs",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(num)}`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Badge($$renderer2, {
          variant: roleVariant,
          class: "text-xs capitalize",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(user.role)}`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-2 p-3">`);
        push_element($$renderer2, "div", 84, 4);
        $$renderer2.push(`<div class="flex items-center justify-between text-xs">`);
        push_element($$renderer2, "div", 85, 6);
        $$renderer2.push(`<span class="text-muted-foreground">`);
        push_element($$renderer2, "span", 86, 8);
        $$renderer2.push(`Created ${escape_html(format(new Date(user.createdAt), "MMM dd, yyyy"))}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between border-t bg-muted/30 px-3 py-2">`);
        push_element($$renderer2, "div", 89, 4);
        if (isAdmin && me.id !== user?.id) {
          $$renderer2.push("<!--[-->");
          Select_component($$renderer2, {
            disabled: updating === user.id,
            value: user.role,
            options: roles,
            class: "h-8 flex-1 text-xs",
            name: "role",
            onValueChange: (val) => onValueChange(user, val),
            placeholder: "Select role"
          });
          $$renderer2.push(`<!----> `);
          Button($$renderer2, {
            disabled: updating === user.id,
            variant: "outline",
            size: "sm",
            onclick: () => onDelete(user),
            class: "ml-1.5 size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700",
            children: prevent_snippet_stringification(($$renderer3) => {
              Trash_2($$renderer3, { class: "size-3.5" });
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<span class="text-xs text-muted-foreground">`);
          push_element($$renderer2, "span", 94, 8);
          $$renderer2.push(`${escape_html(me.id === user?.id ? "You" : "No access")}</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    ListCard
  );
}
ListCard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Alert[FILENAME] = "src/lib/components/ui/alert/alert.svelte";
const alertVariants = tv({
  base: "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"
    }
  },
  defaultVariants: { variant: "default" }
});
function Alert($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        variant = "default",
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "alert",
        class: clsx(cn(alertVariants({ variant }), className)),
        ...restProps,
        role: "alert"
      })}>`);
      push_element($$renderer2, "div", 36, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Alert
  );
}
Alert.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Alert_description[FILENAME] = "src/lib/components/ui/alert/alert-description.svelte";
function Alert_description($$renderer, $$props) {
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
        "data-slot": "alert-description",
        class: clsx(cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Alert_description
  );
}
Alert_description.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Alert_title[FILENAME] = "src/lib/components/ui/alert/alert-title.svelte";
function Alert_title($$renderer, $$props) {
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
        "data-slot": "alert-title",
        class: clsx(cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Alert_title
  );
}
Alert_title.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(protected)/users/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let deletingUser = null;
      const onDelete = async (user) => deletingUser = user;
      let handleInput = "";
      const debouncedHandle = new Debounced(() => handleInput, 500);
      const usersQuery = infiniteScroll.listQuery(debouncedHandle.current, page.url.origin, "users");
      let stats = {
        creators: 0,
        admins: 0,
        editors: 0,
        banned: 0,
        newToday: 0,
        newWeek: 0
      };
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="flex flex-col gap-4">`);
        push_element($$renderer3, "div", 53, 0);
        $$renderer3.push(`<div class="flex flex-col gap-4">`);
        push_element($$renderer3, "div", 54, 2);
        $$renderer3.push(`<h1 class="text-2xl font-bold sm:text-3xl">`);
        push_element($$renderer3, "h1", 55, 4);
        $$renderer3.push(`Users (`);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isPending) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "inline h-4 w-4 animate-spin" });
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery)?.data?.total ?? 0)}`);
        }
        $$renderer3.push(`<!--]-->)</h1>`);
        pop_element();
        $$renderer3.push(` <p class="mt-2 text-muted-foreground">`);
        push_element($$renderer3, "p", 58, 4);
        $$renderer3.push(`Manage users</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="grid grid-cols-1 gap-4 md:grid-cols-4">`);
        push_element($$renderer3, "div", 61, 2);
        $$renderer3.push(`<div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background">`);
        push_element($$renderer3, "div", 62, 4);
        $$renderer3.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer3, "div", 63, 6);
        $$renderer3.push(`<div class="text-sm text-muted-foreground">`);
        push_element($$renderer3, "div", 64, 8);
        $$renderer3.push(`Total Users</div>`);
        pop_element();
        $$renderer3.push(` `);
        Users($$renderer3, { class: "h-4 w-4 text-muted-foreground" });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="mt-2 text-2xl font-semibold">`);
        push_element($$renderer3, "div", 67, 6);
        {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "h-4 w-4 animate-spin" });
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(` <div class="text-xs text-muted-foreground">`);
        push_element($$renderer3, "div", 74, 6);
        $$renderer3.push(`+${escape_html(stats.newToday)} today</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background">`);
        push_element($$renderer3, "div", 76, 4);
        $$renderer3.push(`<div class="text-sm text-muted-foreground">`);
        push_element($$renderer3, "div", 77, 6);
        $$renderer3.push(`Creators</div>`);
        pop_element();
        $$renderer3.push(` <div class="mt-2 text-2xl font-semibold">`);
        push_element($$renderer3, "div", 78, 6);
        $$renderer3.push(`${escape_html(stats.creators)}</div>`);
        pop_element();
        $$renderer3.push(` <div class="text-xs text-muted-foreground">`);
        push_element($$renderer3, "div", 79, 6);
        $$renderer3.push(`+${escape_html(stats.newWeek)} in 7 days</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background">`);
        push_element($$renderer3, "div", 81, 4);
        $$renderer3.push(`<div class="text-sm text-muted-foreground">`);
        push_element($$renderer3, "div", 82, 6);
        $$renderer3.push(`Admins / Editors</div>`);
        pop_element();
        $$renderer3.push(` <div class="mt-2 text-2xl font-semibold">`);
        push_element($$renderer3, "div", 83, 6);
        $$renderer3.push(`${escape_html(stats.admins + stats.editors)}</div>`);
        pop_element();
        $$renderer3.push(` <div class="text-xs text-muted-foreground">`);
        push_element($$renderer3, "div", 84, 6);
        $$renderer3.push(`${escape_html(stats.admins)} admins • ${escape_html(stats.editors)} editors</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background">`);
        push_element($$renderer3, "div", 86, 4);
        $$renderer3.push(`<div class="text-sm text-muted-foreground">`);
        push_element($$renderer3, "div", 87, 6);
        $$renderer3.push(`Banned Users</div>`);
        pop_element();
        $$renderer3.push(` <div class="mt-2 text-2xl font-semibold">`);
        push_element($$renderer3, "div", 88, 6);
        $$renderer3.push(`${escape_html(stats.banned)}</div>`);
        pop_element();
        $$renderer3.push(` <div class="text-xs text-muted-foreground">`);
        push_element($$renderer3, "div", 89, 6);
        $$renderer3.push(`Account blocks</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div class="flex flex-col items-center justify-between gap-4 md:flex-row">`);
        push_element($$renderer3, "div", 101, 2);
        $$renderer3.push(`<div class="relative grid w-full sm:max-w-md">`);
        push_element($$renderer3, "div", 102, 4);
        Search($$renderer3, {
          class: "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
        });
        $$renderer3.push(`<!----> `);
        Input($$renderer3, {
          placeholder: "Search users...",
          class: "px-10",
          get value() {
            return handleInput;
          },
          set value($$value) {
            handleInput = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isPending) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="p-6">`);
          push_element($$renderer3, "div", 109, 4);
          $$renderer3.push(`<div class="flex h-80 items-center justify-center">`);
          push_element($$renderer3, "div", 109, 21);
          $$renderer3.push(`<div class="size-20 animate-spin rounded-full border-b-2 border-primary">`);
          push_element($$renderer3, "div", 109, 72);
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<!---->`);
          Alert($$renderer3, {
            variant: "destructive",
            children: prevent_snippet_stringification(($$renderer4) => {
              Circle_alert($$renderer4, {});
              $$renderer4.push(`<!----> <!---->`);
              Alert_title($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error.name)}`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <!---->`);
              Alert_description($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error.cause)}<br/>`);
                  push_element($$renderer5, "br", 116, 50);
                  pop_element();
                  $$renderer5.push(`${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error.message)}`);
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
        }
        $$renderer3.push(`<!--]--> `);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isSuccess) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div>`);
          push_element($$renderer3, "div", 121, 4);
          $$renderer3.push(`<div class="hidden overflow-x-auto border bg-white lg:block dark:bg-background">`);
          push_element($$renderer3, "div", 123, 6);
          Table($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Table_header($$renderer4, {
                class: "sticky top-0 z-10 border-b bg-white dark:bg-secondary",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Table_row($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->S/N`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->User`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->Role`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->Joined`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        class: "text-right",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->Actions`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
                    }),
                    $$slots: { default: true }
                  });
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Table_body($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!--[-->`);
                  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).data.results);
                  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                    let user = each_array[i];
                    ListCard($$renderer5, { onDelete, screen: "desktop", i, user });
                  }
                  $$renderer5.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
          pop_element();
          $$renderer3.push(` <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">`);
          push_element($$renderer3, "div", 143, 6);
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).data.results);
          for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
            let user = each_array_1[i];
            ListCard($$renderer3, { onDelete, screen: "mobile", i, user });
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(` <div>`);
          push_element($$renderer3, "div", 150, 4);
          if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isFetching) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="flex items-center justify-center">`);
            push_element($$renderer3, "div", 152, 8);
            Loader_circle($$renderer3, { class: "h-6 w-6 animate-spin text-muted-foreground" });
            $$renderer3.push(`<!----> <span class="ml-2 text-muted-foreground">`);
            push_element($$renderer3, "span", 154, 10);
            $$renderer3.push(`Loading more...</span>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          } else {
            $$renderer3.push("<!--[!-->");
            if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).hasNextPage) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="justify-center">`);
              push_element($$renderer3, "div", 157, 8);
              Button($$renderer3, {
                class: "w-full sm:w-fit",
                onclick: () => store_get($$store_subs ??= {}, "$usersQuery", usersQuery).fetchNextPage(),
                disabled: !store_get($$store_subs ??= {}, "$usersQuery", usersQuery).hasNextPage || store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isFetchingNextPage,
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->Load More`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!----></div>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<p class="text-center text-sm text-muted-foreground">`);
              push_element($$renderer3, "p", 161, 8);
              $$renderer3.push(`Nothing more to load</p>`);
              pop_element();
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (deletingUser) {
          $$renderer3.push("<!--[-->");
          DeleteDialog($$renderer3, {
            user: deletingUser,
            open: !!deletingUser,
            onOpenChange: (open) => !open && (deletingUser = null)
          });
        } else {
          $$renderer3.push("<!--[!-->");
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
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
