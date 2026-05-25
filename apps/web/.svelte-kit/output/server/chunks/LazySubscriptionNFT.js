import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, j as attr_class, d as clsx, a as push_element, b as pop_element } from "./ui-libs.js";
import { I as Icon } from "./Icon.js";
import "clsx";
import { c as cn } from "./utils2.js";
Arrow_left[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/arrow-left.svelte";
function Arrow_left($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "m12 19-7-7 7-7" }],
        ["path", { "d": "M19 12H5" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "arrow-left" },
        /**
         * @component @name ArrowLeft
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTktNy03IDctNyIgLz4KICA8cGF0aCBkPSJNMTkgMTJINSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-left
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
    Arrow_left
  );
}
Arrow_left.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Spin_loader[FILENAME] = "src/lib/components/ui/spin-loader/spin-loader.svelte";
function Spin_loader($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className } = $$props;
      $$renderer2.push(`<div${attr_class(clsx(cn("size-4 animate-spin rounded-full border-b-2 border-t-2 border-white", className)))}>`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`</div>`);
      pop_element();
    },
    Spin_loader
  );
}
Spin_loader.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
LazyWalletConnect[FILENAME] = "src/lib/components/web3-lazy/LazyWalletConnect.svelte";
function LazyWalletConnect($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center p-8">`);
        push_element($$renderer2, "div", 24, 1);
        Spin_loader($$renderer2, { class: "size-8" });
        $$renderer2.push(`<!----> <p class="ml-3 text-muted-foreground">`);
        push_element($$renderer2, "p", 26, 2);
        $$renderer2.push(`Loading wallet connection...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    LazyWalletConnect
  );
}
LazyWalletConnect.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
LazySTCTokenDashboard[FILENAME] = "src/lib/components/web3-lazy/LazySTCTokenDashboard.svelte";
function LazySTCTokenDashboard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center p-8">`);
        push_element($$renderer2, "div", 24, 1);
        Spin_loader($$renderer2, { class: "size-8" });
        $$renderer2.push(`<!----> <p class="ml-3 text-muted-foreground">`);
        push_element($$renderer2, "p", 26, 2);
        $$renderer2.push(`Loading token dashboard...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    LazySTCTokenDashboard
  );
}
LazySTCTokenDashboard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
LazySubscriptionNFT[FILENAME] = "src/lib/components/web3-lazy/LazySubscriptionNFT.svelte";
function LazySubscriptionNFT($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center p-8">`);
        push_element($$renderer2, "div", 24, 1);
        Spin_loader($$renderer2, { class: "size-8" });
        $$renderer2.push(`<!----> <p class="ml-3 text-muted-foreground">`);
        push_element($$renderer2, "p", 26, 2);
        $$renderer2.push(`Loading subscription options...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    LazySubscriptionNFT
  );
}
LazySubscriptionNFT.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Arrow_left as A,
  LazySubscriptionNFT as L,
  LazySTCTokenDashboard as a,
  LazyWalletConnect as b
};
