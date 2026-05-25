import { b as push_element, d as pop_element, p as prevent_snippet_stringification, t as validate_snippet_args, s as spread_props, l as escape_html, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { p as page } from './index2-DBoVEfQm.js';
import { B as Button } from './button-C1v8XzqW.js';
import { D as Dropdown_menu, a as Dropdown_menu_trigger, b as Dropdown_menu_content, e as Dropdown_menu_item } from './dropdown-menu-trigger-uQvQ2CZF.js';
import './client-BZtJixNd.js';
import './client2-D3ciM3yf.js';
import { U as Users } from './users-B4M3or-k.js';
import { I as Icon } from './Icon-DVHDtCfs.js';
import { C as Chevron_down } from './chevron-down-z9VFSzi1.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './exports-BuGzoaN1.js';

Baby[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/baby.svelte";
function Baby($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" }],
        ["path", { "d": "M15 12h.01" }],
        [
          "path",
          {
            "d": "M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"
          }
        ],
        ["path", { "d": "M9 12h.01" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "baby" },
        /**
         * @component @name Baby
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTZjLjUuMyAxLjIuNSAyIC41czEuNS0uMiAyLS41IiAvPgogIDxwYXRoIGQ9Ik0xNSAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTE5LjM4IDYuODEzQTkgOSAwIDAgMSAyMC44IDEwLjJhMiAyIDAgMCAxIDAgMy42IDkgOSAwIDAgMS0xNy42IDAgMiAyIDAgMCAxIDAtMy42QTkgOSAwIDAgMSAxMiAzYzIgMCAzLjUgMS4xIDMuNSAyLjVzLS45IDIuNS0yIDIuNWMtLjggMC0xLjUtLjQtMS41LTEiIC8+CiAgPHBhdGggZD0iTTkgMTJoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/baby
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
    Baby
  );
}
Baby.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
SafeExplorationMode[FILENAME] = "src/lib/components/kids/SafeExplorationMode.svelte";
function SafeExplorationMode($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { profileType = "kids", children } = $$props;
      {
        $$renderer2.push("<!--[!-->");
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]-->`);
    },
    SafeExplorationMode
  );
}
SafeExplorationMode.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout[FILENAME] = "src/routes/kids/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const { children } = $$props;
      const currentPath = page.url.pathname;
      currentPath.includes("/kids/kiddies");
      const isTeens = currentPath.includes("/kids/teens");
      const profileType = isTeens ? "teens" : "kids";
      const currentLabel = isTeens ? "Teens" : "Kiddies";
      $$renderer2.push(`<div class="min-h-screen bg-background flex flex-col">`);
      push_element($$renderer2, "div", 18, 0);
      $$renderer2.push(`<nav class="border-b bg-card px-4 py-2 flex items-center justify-between sticky top-0 z-50">`);
      push_element($$renderer2, "nav", 19, 2);
      $$renderer2.push(`<div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 20, 4);
      $$renderer2.push(`<a href="/" class="font-bold text-primary">`);
      push_element($$renderer2, "a", 21, 6);
      $$renderer2.push(`Sephar Studios</a>`);
      pop_element();
      $$renderer2.push(` <!---->`);
      Dropdown_menu($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->`);
          {
            let child = function($$renderer4, { props }) {
              validate_snippet_args($$renderer4);
              Button($$renderer4, spread_props([
                { variant: "outline", class: "flex items-center space-x-2" },
                props,
                {
                  children: prevent_snippet_stringification(($$renderer5) => {
                    if (isTeens) {
                      $$renderer5.push("<!--[-->");
                      Users($$renderer5, { class: "w-4 h-4" });
                    } else {
                      $$renderer5.push("<!--[!-->");
                      Baby($$renderer5, { class: "w-4 h-4" });
                    }
                    $$renderer5.push(`<!--]--> <span>`);
                    push_element($$renderer5, "span", 32, 14);
                    $$renderer5.push(`${escape_html(currentLabel)} Section</span>`);
                    pop_element();
                    $$renderer5.push(` `);
                    Chevron_down($$renderer5, { class: "w-4 h-4" });
                    $$renderer5.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                }
              ]));
            };
            prevent_snippet_stringification(child);
            Dropdown_menu_trigger($$renderer3, { child, $$slots: { child: true } });
          }
          $$renderer3.push(`<!----> <!---->`);
          Dropdown_menu_content($$renderer3, {
            class: "w-48",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Dropdown_menu_item($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<a href="/kids/kiddies" class="flex items-center space-x-2 w-full">`);
                  push_element($$renderer5, "a", 39, 12);
                  Baby($$renderer5, { class: "w-4 h-4" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 41, 14);
                  $$renderer5.push(`Kiddies</span>`);
                  pop_element();
                  $$renderer5.push(`</a>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <!---->`);
              Dropdown_menu_item($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<a href="/kids/teens" class="flex items-center space-x-2 w-full">`);
                  push_element($$renderer5, "a", 45, 12);
                  Users($$renderer5, { class: "w-4 h-4" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 47, 14);
                  $$renderer5.push(`Teens</span>`);
                  pop_element();
                  $$renderer5.push(`</a>`);
                  pop_element();
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
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-2">`);
      push_element($$renderer2, "div", 54, 4);
      $$renderer2.push(`<a href="/" class="text-sm text-muted-foreground hover:text-foreground">`);
      push_element($$renderer2, "a", 55, 6);
      $$renderer2.push(`Back to Main</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</nav>`);
      pop_element();
      $$renderer2.push(` <main class="flex-1">`);
      push_element($$renderer2, "main", 59, 2);
      SafeExplorationMode($$renderer2, {
        profileType,
        children: prevent_snippet_stringification(($$renderer3) => {
          children($$renderer3);
          $$renderer3.push(`<!---->`);
        })
      });
      $$renderer2.push(`<!----></main>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DbNC-bKw.js.map
