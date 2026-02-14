import { g as spread_props, p as prevent_snippet_stringification, h as attributes } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { U as Users } from './users-CMHMaCG6.js';
import { L as Layout_dashboard, F as File_text, U as User } from './user-CU8eWwNU.js';

Logo[FILENAME] = "src/lib/components/icons/logo.svelte";
function Logo($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className, $$slots, $$events, ...rest } = $$props;
      $$renderer2.push(`<img${attributes({
        src: "/logo.svg",
        alt: "Logo",
        class: "block dark:hidden " + (className || ""),
        ...rest
      })} onload="this.__e=event" onerror="this.__e=event"/>`);
      push_element($$renderer2, "img", 7, 0);
      pop_element();
      $$renderer2.push(` <img${attributes({
        src: "/logo-dark.svg",
        alt: "Logo",
        class: "hidden dark:block " + (className || ""),
        ...rest
      })} onload="this.__e=event" onerror="this.__e=event"/>`);
      push_element($$renderer2, "img", 8, 0);
      pop_element();
    },
    Logo
  );
}
Logo.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Book[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/book.svelte";
function Book($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "book" },
        /**
         * @component @name Book
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxOS41di0xNUEyLjUgMi41IDAgMCAxIDYuNSAySDE5YTEgMSAwIDAgMSAxIDF2MThhMSAxIDAgMCAxLTEgMUg2LjVhMSAxIDAgMCAxIDAtNUgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/book
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
    Book
  );
}
Book.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Cross[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/cross.svelte";
function Cross($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "cross" },
        /**
         * @component @name Cross
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCA5YTIgMiAwIDAgMC0yIDJ2MmEyIDIgMCAwIDAgMiAyaDRhMSAxIDAgMCAxIDEgMXY0YTIgMiAwIDAgMCAyIDJoMmEyIDIgMCAwIDAgMi0ydi00YTEgMSAwIDAgMSAxLTFoNGEyIDIgMCAwIDAgMi0ydi0yYTIgMiAwIDAgMC0yLTJoLTRhMSAxIDAgMCAxLTEtMVY0YTIgMiAwIDAgMC0yLTJoLTJhMiAyIDAgMCAwLTIgMnY0YTEgMSAwIDAgMS0xIDF6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/cross
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
    Cross
  );
}
Cross.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Globe[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/globe.svelte";
function Globe($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["circle", { "cx": "12", "cy": "12", "r": "10" }],
        [
          "path",
          { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }
        ],
        ["path", { "d": "M2 12h20" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "globe" },
        /**
         * @component @name Globe
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMmExNC41IDE0LjUgMCAwIDAgMCAyMCAxNC41IDE0LjUgMCAwIDAgMC0yMCIgLz4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/globe
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
    Globe
  );
}
Globe.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Heart[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/heart.svelte";
function Heart($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "heart" },
        /**
         * @component @name Heart
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiA5LjVhNS41IDUuNSAwIDAgMSA5LjU5MS0zLjY3Ni41Ni41NiAwIDAgMCAuODE4IDBBNS40OSA1LjQ5IDAgMCAxIDIyIDkuNWMwIDIuMjktMS41IDQtMyA1LjVsLTUuNDkyIDUuMzEzYTIgMiAwIDAgMS0zIC4wMTlMNSAxNWMtMS41LTEuNS0zLTMuMi0zLTUuNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/heart
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
    Heart
  );
}
Heart.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
House[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/house.svelte";
function House($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }
        ],
        [
          "path",
          {
            "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "house" },
        /**
         * @component @name House
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMjF2LThhMSAxIDAgMCAwLTEtMWgtNGExIDEgMCAwIDAtMSAxdjgiIC8+CiAgPHBhdGggZD0iTTMgMTBhMiAyIDAgMCAxIC43MDktMS41MjhsNy02YTIgMiAwIDAgMSAyLjU4MiAwbDcgNkEyIDIgMCAwIDEgMjEgMTB2OWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/house
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
    House
  );
}
House.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Lightbulb[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/lightbulb.svelte";
function Lightbulb($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
          }
        ],
        ["path", { "d": "M9 18h6" }],
        ["path", { "d": "M10 22h4" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "lightbulb" },
        /**
         * @component @name Lightbulb
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41IiAvPgogIDxwYXRoIGQ9Ik05IDE4aDYiIC8+CiAgPHBhdGggZD0iTTEwIDIyaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/lightbulb
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
    Lightbulb
  );
}
Lightbulb.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Music[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/music.svelte";
function Music($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M9 18V5l12-2v13" }],
        ["circle", { "cx": "6", "cy": "18", "r": "3" }],
        ["circle", { "cx": "18", "cy": "16", "r": "3" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "music" },
        /**
         * @component @name Music
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAxOFY1bDEyLTJ2MTMiIC8+CiAgPGNpcmNsZSBjeD0iNiIgY3k9IjE4IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjE4IiBjeT0iMTYiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/music
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
    Music
  );
}
Music.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["ADMIN"] = "admin";
  Role2["EDITOR"] = "editor";
  Role2["USER"] = "user";
  return Role2;
})(Role || {});
var Fields = /* @__PURE__ */ ((Fields2) => {
  Fields2["USER"] = "user";
  return Fields2;
})(Fields || {});
const MAX_ITEMS_PER_PAGE = 12;
var Constants = /* @__PURE__ */ ((Constants2) => {
  Constants2["BRANDNAME"] = "sepharstudios";
  Constants2["CREDENTIAL"] = "credential";
  Constants2["GOOGLE"] = "google";
  Constants2["AFTERAUTH"] = "/dashboard";
  Constants2["SUPPORTEMAIL"] = "support@sepharstudios.com";
  Constants2["BRANDWEBSITE"] = "https://sepharstudios.com";
  return Constants2;
})(Constants || {});
const SiteMeta = {
  title: "sepharstudios",
  description: "Welcome to sepharstudios - Your trusted platform",
  keywords: ["sepharstudios", "platform", "app"],
  ogimage: "/screenshot-wide.webp",
  link: "https://sepharstudios.com"
};
const HomepageContent = {
  hero: {
    subtitle: "sepharstudios",
    title: "Build Something Amazing",
    description: "A modern platform designed to help you achieve your goals with powerful tools and seamless experiences.",
    primaryCta: { text: "Get Started", href: "/auth/login?redirectTo=/dashboard" },
    secondaryCta: { text: "Learn More", href: "#features" },
    loggedInCta: { text: "Dashboard", href: "/dashboard" },
    backgroundImage: "/hero-bg.webp"
  },
  stats: [
    { value: "1000+", label: "Active Users", emoji: "👥", gradient: "from-pink-500 to-rose-500" },
    { value: "50+", label: "Team Members", emoji: "❤️", gradient: "from-[#f71002] to-[#fd6c02]" },
    { value: "24/7", label: "Support", emoji: "🎯", gradient: "from-cyan-500 to-blue-500" },
    { value: "100%", label: "Satisfaction", emoji: "✨", gradient: "from-emerald-500 to-teal-500" }
  ],
  features: {
    badge: "What We Do",
    title: "Excellence in Every Detail",
    description: "Our platform provides a comprehensive experience designed to meet your needs.",
    items: [
      { icon: Book, title: "Documentation", description: "Comprehensive guides and resources to help you get started quickly", gradient: "from-[#f71002] to-pink-500" },
      { icon: Music, title: "Easy Integration", description: "Seamlessly integrate with your existing tools and workflows", gradient: "from-cyan-500 to-blue-500" },
      { icon: Users, title: "Collaboration", description: "Work together with your team in real-time", gradient: "from-[#fd6c02] to-yellow-500" },
      { icon: Heart, title: "Support", description: "Dedicated support team ready to help you succeed", gradient: "from-emerald-500 to-teal-500" }
    ]
  },
  mission: {
    badge: "Our Vision",
    title: "Empowering Your Success",
    description: "We exist to provide exceptional tools and services that transform the way you work and achieve your goals.",
    values: [
      { icon: Cross, title: "Quality First", description: "Committed to delivering the highest quality in everything we do", gradient: "from-[#f71002] to-pink-500" },
      { icon: Globe, title: "Global Reach", description: "Accessible to users around the world with localized support", gradient: "from-cyan-500 to-blue-500" },
      { icon: Lightbulb, title: "Innovation", description: "Constantly evolving to bring you the latest features", gradient: "from-[#fd6c02] to-yellow-500" }
    ],
    coreValues: ["Excellence", "Innovation", "Reliability", "Security", "Support"]
  },
  cta: {
    badge: "Get Started",
    title: "Ready to Begin Your Journey?",
    description: "Join thousands of users who trust our platform for their daily needs.",
    buttonText: "Join Us Today"
  }
};
const getStyle = (imageUrl) => `background-image: url('${imageUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
const documentationRoles = [
  "admin",
  "editor",
  "user"
  /* USER */
];
const dashboardRoles = [
  "admin",
  "editor",
  "user"
  /* USER */
];
const usersRoles = [
  "admin"
  /* ADMIN */
];
const profileRoles = [
  "admin",
  "editor",
  "user"
  /* USER */
];
const homeRoles = [
  "admin",
  "editor",
  "user"
  /* USER */
];
const getNavigation = (reference) => {
  const isActive = (url) => reference === url;
  const data = {
    teams: [
      {
        name: "Homepage",
        logo: Logo,
        plan: "sepharstudios",
        url: "/"
      }
    ],
    navMain: [
      {
        title: "Documentation",
        url: "/documentation",
        roles: documentationRoles,
        icon: File_text,
        isActive: isActive("/documentation")
      },
      {
        title: "Dashboard",
        url: "/dashboard",
        roles: dashboardRoles,
        icon: Layout_dashboard,
        isActive: isActive("/dashboard")
      },
      {
        title: "Users",
        url: "/users",
        roles: usersRoles,
        icon: Users,
        isActive: isActive("/users")
      },
      {
        title: "Profile",
        url: "/profile",
        roles: profileRoles,
        icon: User,
        isActive: isActive("/profile")
      }
    ],
    publicNav: [
      { name: "Home", href: "/", icon: House, roles: homeRoles }
    ],
    privateNav: [
      { name: "Home", href: "/", icon: House, roles: homeRoles },
      { name: "Dashboard", href: "/dashboard", icon: Layout_dashboard, roles: dashboardRoles }
    ]
  };
  return data;
};
const adminRoles = [
  "admin"
  /* ADMIN */
];
const emptyMetalist = {
  total: 0,
  meta: { cursor: "", more: false, size: 0 },
  data: []
};

export { Constants as C, Fields as F, House as H, Logo as L, MAX_ITEMS_PER_PAGE as M, Role as R, SiteMeta as S, HomepageContent as a, getStyle as b, adminRoles as c, emptyMetalist as e, getNavigation as g, usersRoles as u };
//# sourceMappingURL=index4-Cnd3Rmm9.js.map
