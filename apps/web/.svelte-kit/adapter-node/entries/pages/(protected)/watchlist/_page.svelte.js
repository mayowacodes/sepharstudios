import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, o as head, a as push_element, b as pop_element, i as ensure_array_like } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/button.js";
import { I as Icon } from "../../../../chunks/Icon.js";
List[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/list.svelte";
function List($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M3 5h.01" }],
        ["path", { "d": "M3 12h.01" }],
        ["path", { "d": "M3 19h.01" }],
        ["path", { "d": "M8 5h13" }],
        ["path", { "d": "M8 12h13" }],
        ["path", { "d": "M8 19h13" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "list" },
        /**
         * @component @name List
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA1aC4wMSIgLz4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTloLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDVoMTMiIC8+CiAgPHBhdGggZD0iTTggMTJoMTMiIC8+CiAgPHBhdGggZD0iTTggMTloMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
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
    List
  );
}
List.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(protected)/watchlist/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let playlists = [];
      const defaultList = playlists.find((p) => p.isDefault);
      defaultList?.items ?? [];
      head("4hkdye", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>My List - Sephar Studios</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen bg-background px-4 py-10">`);
      push_element($$renderer2, "div", 97, 0);
      $$renderer2.push(`<div class="max-w-5xl mx-auto">`);
      push_element($$renderer2, "div", 98, 2);
      $$renderer2.push(`<div class="flex items-center gap-3 mb-8">`);
      push_element($$renderer2, "div", 99, 4);
      List($$renderer2, { class: "w-6 h-6 text-primary" });
      $$renderer2.push(`<!----> <h1 class="text-2xl font-bold">`);
      push_element($$renderer2, "h1", 101, 6);
      $$renderer2.push(`My List</h1>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">`);
        push_element($$renderer2, "div", 108, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like([1, 2, 3, 4, 5, 6, 7, 8]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          each_array[$$index];
          $$renderer2.push(`<div class="space-y-2">`);
          push_element($$renderer2, "div", 110, 10);
          $$renderer2.push(`<div class="aspect-2/3 bg-white/5 rounded-lg animate-pulse">`);
          push_element($$renderer2, "div", 111, 12);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse">`);
          push_element($$renderer2, "div", 112, 12);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
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
