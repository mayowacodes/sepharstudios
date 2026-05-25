import { c as attributes, d as clsx, a as push_element, b as pop_element, F as FILENAME, s as spread_props, p as prevent_snippet_stringification } from "./ui-libs.js";
import { I as Icon } from "./Icon.js";
import { L as Layout_dashboard, F as File_text } from "./layout-dashboard.js";
import { U as Users } from "./users.js";
import { U as User } from "./user.js";
Logo[FILENAME] = "src/lib/components/icons/logo.svelte";
function Logo($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className, $$slots, $$events, ...rest } = $$props;
      $$renderer2.push(`<img${attributes({
        src: "/logo-alone-sepharstudios.png",
        alt: "Sephar Studios",
        class: clsx(className || ""),
        ...rest
      })} onload="this.__e=event" onerror="this.__e=event"/>`);
      push_element($$renderer2, "img", 7, 0);
      pop_element();
    },
    Logo
  );
}
Logo.render = function() {
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
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["ADMIN"] = "admin";
  Role2["EDITOR"] = "editor";
  Role2["CREATOR"] = "creator";
  Role2["USER"] = "user";
  return Role2;
})(Role || {});
var Fields = /* @__PURE__ */ ((Fields2) => {
  Fields2["USER"] = "user";
  return Fields2;
})(Fields || {});
const MAX_ITEMS_PER_PAGE = 12;
var Constants = /* @__PURE__ */ ((Constants2) => {
  Constants2["BRANDNAME"] = "Sephar Studios";
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
export {
  Constants as C,
  Fields as F,
  House as H,
  MAX_ITEMS_PER_PAGE as M,
  Role as R,
  SiteMeta as S,
  adminRoles as a,
  emptyMetalist as e,
  getNavigation as g,
  usersRoles as u
};
