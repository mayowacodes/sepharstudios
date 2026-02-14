import { g as spread_props, p as prevent_snippet_stringification } from './index-C14HL8mA.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

Coins[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/coins.svelte";
function Coins($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["circle", { "cx": "8", "cy": "8", "r": "6" }],
        ["path", { "d": "M18.09 10.37A6 6 0 1 1 10.34 18" }],
        ["path", { "d": "M7 6h1v4" }],
        ["path", { "d": "m16.71 13.88.7.71-2.82 2.82" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "coins" },
        /**
         * @component @name Coins
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNiIgLz4KICA8cGF0aCBkPSJNMTguMDkgMTAuMzdBNiA2IDAgMSAxIDEwLjM0IDE4IiAvPgogIDxwYXRoIGQ9Ik03IDZoMXY0IiAvPgogIDxwYXRoIGQ9Im0xNi43MSAxMy44OC43LjcxLTIuODIgMi44MiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/coins
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
    Coins
  );
}
Coins.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Coins as C };
//# sourceMappingURL=coins-CelX_gXX.js.map
