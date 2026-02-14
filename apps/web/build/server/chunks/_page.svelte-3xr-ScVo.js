import { p as prevent_snippet_stringification, M as store_get, E as escape_html, N as unsubscribe_stores, u as attr, H as bind_props, O as fallback, m as ensure_array_like, g as spread_props } from './index-C14HL8mA.js';
import { S as Sheet, e as Sheet_trigger, a as Sheet_content } from './sheet-description-wTHP-mMu.js';
import { B as Button } from './button-B5TxIyzE.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as page } from './index2-DN4t2Pgp.js';
import { w as writable } from './index3-CnQVvK5M.js';
import { C as Chevron_down } from './chevron-down-BiSp9fvd.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { W as WalletConnect } from './WalletConnect-kbrpxgJC.js';
import { i as isConnected } from './wallet-B7_7GztS.js';
import './config-Bjr_iq_c.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { G as Gift } from './gift-BiMWdY9f.js';
import './dialog-content-DGfSWKw7.js';
import './create-id-ozwDP4rH.js';
import './noop-JjG5qwPG.js';
import './watch.svelte-ALR66MkX.js';
import './index-server-_G0R5Qhl.js';
import './scroll-lock-BKaGX-xL.js';
import './events-DndNBaun.js';
import './dom-context.svelte-DOhd7vND.js';
import './utils2-C-_3GP94.js';
import './x-DGP1viX5.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './card-title-C-y0C6UW.js';
import './badge-DBgw54iF.js';
import './external-link-DQXvFabB.js';
import './zap-BWprV7m9.js';
import '@wagmi/core';
import '@wagmi/connectors';
import '@wagmi/core/chains';

Circle_plus[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/circle-plus.svelte";
function Circle_plus($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["circle", { "cx": "12", "cy": "12", "r": "10" }],
        ["path", { "d": "M8 12h8" }],
        ["path", { "d": "M12 8v8" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "circle-plus" },
        /**
         * @component @name CirclePlus
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNOCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik0xMiA4djgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-plus
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
    Circle_plus
  );
}
Circle_plus.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Pencil[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/pencil.svelte";
function Pencil($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          }
        ],
        ["path", { "d": "m15 5 4 4" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "pencil" },
        /**
         * @component @name Pencil
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
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
    Pencil
  );
}
Pencil.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Hero[FILENAME] = "src/lib/components/sections/dashboard/Hero.svelte";
function Hero($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let user = $$props["user"];
      $$renderer2.push(`<section class="flex items-center justify-between flex-wrap gap-4">`);
      push_element($$renderer2, "section", 5, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 6, 2);
      $$renderer2.push(`<h1 class="text-2xl md:text-4xl font-bold">`);
      push_element($$renderer2, "h1", 7, 4);
      $$renderer2.push(`Welcome to <span class="text-primary">`);
      push_element($$renderer2, "span", 7, 58);
      $$renderer2.push(`My Studios</span>`);
      pop_element();
      $$renderer2.push(`</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 8, 4);
      $$renderer2.push(`Hello, ${escape_html(user.name)} 👋</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <img${attr("src", user.avatarUrl || "/default-avatar.png")} alt="Avatar" class="w-16 h-16 rounded-full object-cover border"/>`);
      push_element($$renderer2, "img", 10, 2);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      bind_props($$props, { user });
    },
    Hero
  );
}
Hero.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const currentProfile = writable(null);
EditProfileModal[FILENAME] = "src/lib/components/profile/EditProfileModal.svelte";
function EditProfileModal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let isOpen = fallback($$props["isOpen"], false);
      let profile = $$props["profile"];
      let onSave = $$props["onSave"];
      let onClose = $$props["onClose"];
      let newName = profile.name;
      let newAvatarUrl = profile.avatarUrl ?? "";
      if (isOpen) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">`);
        push_element($$renderer2, "div", 27, 2);
        $$renderer2.push(`<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">`);
        push_element($$renderer2, "div", 28, 4);
        $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
        push_element($$renderer2, "h2", 29, 6);
        $$renderer2.push(`Edit Profile</h2>`);
        pop_element();
        $$renderer2.push(` <div class="mb-4">`);
        push_element($$renderer2, "div", 31, 6);
        $$renderer2.push(`<label for="name" class="block text-sm font-medium text-gray-700">`);
        push_element($$renderer2, "label", 32, 8);
        $$renderer2.push(`Profile Name</label>`);
        pop_element();
        $$renderer2.push(` <input id="name" type="text" class="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${attr("value", newName)} placeholder="Enter profile name"/>`);
        push_element($$renderer2, "input", 33, 8);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="mb-4">`);
        push_element($$renderer2, "div", 42, 6);
        $$renderer2.push(`<label for="avatar" class="block text-sm font-medium text-gray-700">`);
        push_element($$renderer2, "label", 43, 8);
        $$renderer2.push(`Avatar URL</label>`);
        pop_element();
        $$renderer2.push(` <input id="avatar" type="text" class="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${attr("value", newAvatarUrl)} placeholder="Enter avatar URL or base64 image"/>`);
        push_element($$renderer2, "input", 44, 8);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex justify-end gap-4">`);
        push_element($$renderer2, "div", 53, 6);
        $$renderer2.push(`<button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">`);
        push_element($$renderer2, "button", 54, 8);
        $$renderer2.push(`Cancel</button>`);
        pop_element();
        $$renderer2.push(` <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">`);
        push_element($$renderer2, "button", 60, 8);
        $$renderer2.push(`Save</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { isOpen, profile, onSave, onClose });
    },
    EditProfileModal
  );
}
EditProfileModal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ProfileSwitcher[FILENAME] = "src/lib/components/sections/dashboard/ProfileSwitcher.svelte";
function ProfileSwitcher($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      const maxProfiles = 8;
      let open = false;
      let editProfile = null;
      const profileSlots = writable([
        {
          id: "1",
          type: "adult",
          name: "Dad",
          avatar: "",
          parental: false
        },
        {
          id: "2",
          type: "adult",
          name: "Mom",
          avatar: "",
          parental: false
        },
        {
          id: "3",
          type: "adult",
          name: "John",
          avatar: "",
          parental: false
        },
        {
          id: "4",
          type: "adult",
          name: "Jane",
          avatar: "",
          parental: false
        },
        {
          id: "5",
          type: "teen",
          name: "Alex",
          avatar: "",
          parental: true
        },
        {
          id: "6",
          type: "teen",
          name: "Sam",
          avatar: "",
          parental: true
        },
        {
          id: "7",
          type: "kid",
          name: "Lily",
          avatar: "",
          parental: true
        },
        {
          id: "8",
          type: "kid",
          name: "Tommy",
          avatar: "",
          parental: true
        }
      ]);
      function updateProfile(updated) {
        profileSlots.update((slots) => slots.map((p) => p.id === updated.id ? updated : p));
        editProfile = null;
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Sheet($$renderer3, {
          get open() {
            return open;
          },
          set open($$value) {
            open = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            Sheet_trigger($$renderer4, {
              class: "inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition cursor-pointer",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 47, 4);
                $$renderer5.push(`${escape_html(store_get($$store_subs ??= {}, "$currentProfile", currentProfile)?.name ?? "Select Profile")}</span>`);
                pop_element();
                $$renderer5.push(` `);
                Chevron_down($$renderer5, { class: "w-4 h-4" });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Sheet_content($$renderer4, {
              side: "bottom",
              class: "p-6 sm:max-w-md",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h2 class="text-lg font-semibold mb-4">`);
                push_element($$renderer5, "h2", 52, 4);
                $$renderer5.push(`Manage Profiles</h2>`);
                pop_element();
                $$renderer5.push(` <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">`);
                push_element($$renderer5, "div", 54, 4);
                $$renderer5.push(`<!--[-->`);
                const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$profileSlots", profileSlots));
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let profile = each_array[$$index];
                  $$renderer5.push(`<div class="flex flex-col items-center gap-2 p-3 bg-muted rounded-xl hover:bg-muted/70 transition cursor-pointer relative">`);
                  push_element($$renderer5, "div", 56, 8);
                  $$renderer5.push(`<div class="relative group">`);
                  push_element($$renderer5, "div", 57, 10);
                  $$renderer5.push(`<button class="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-white text-lg font-bold">`);
                  push_element($$renderer5, "button", 58, 12);
                  $$renderer5.push(`${escape_html(profile.name[0])}</button>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Pencil($$renderer5, {
                    class: "w-4 h-4 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm cursor-pointer group-hover:scale-110",
                    onclick: () => editProfile = profile
                  });
                  $$renderer5.push(`<!----></div>`);
                  pop_element();
                  $$renderer5.push(` <span class="text-sm">`);
                  push_element($$renderer5, "span", 69, 10);
                  $$renderer5.push(`${escape_html(profile.name)}</span>`);
                  pop_element();
                  $$renderer5.push(` <span class="text-xs text-muted-foreground capitalize">`);
                  push_element($$renderer5, "span", 70, 10);
                  $$renderer5.push(`${escape_html(profile.type)} ${escape_html(profile.parental ? "(Parental)" : "")}</span>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
                $$renderer5.push(` `);
                if (store_get($$store_subs ??= {}, "$profileSlots", profileSlots).length < maxProfiles) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<button class="flex items-center gap-2 text-sm font-medium text-primary hover:underline">`);
                  push_element($$renderer5, "button", 78, 6);
                  Circle_plus($$renderer5, { class: "w-4 h-4" });
                  $$renderer5.push(`<!----> Add New Profile</button>`);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push(`<p class="text-xs text-muted-foreground">`);
                  push_element($$renderer5, "p", 85, 6);
                  $$renderer5.push(`Maximum of 8 profiles reached.</p>`);
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
        $$renderer3.push(`<!----> `);
        if (editProfile) {
          $$renderer3.push("<!--[-->");
          EditProfileModal($$renderer3, {
            profile: {
              id: editProfile.id,
              name: editProfile.name,
              avatarUrl: editProfile.avatar
            },
            onSave: (updated) => updateProfile({ ...editProfile, ...updated }),
            onClose: () => editProfile = null
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    ProfileSwitcher
  );
}
ProfileSwitcher.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Downloads[FILENAME] = "src/lib/components/sections/dashboard/Downloads.svelte";
function Downloads($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let downloads = fallback(
        $$props["downloads"],
        () => [
          {
            id: "1",
            title: "The Chosen",
            thumbnailUrl: "/thumbnails/the-chosen.jpg",
            downloadDate: "2025-04-08"
          },
          {
            id: "2",
            title: "Pilgrim’s Progress",
            thumbnailUrl: "/thumbnails/pilgrims-progress.jpg",
            downloadDate: "2025-04-06"
          }
        ],
        true
      );
      $$renderer2.push(`<section>`);
      push_element($$renderer2, "section", 20, 0);
      $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 21, 2);
      $$renderer2.push(`Downloads</h2>`);
      pop_element();
      $$renderer2.push(` `);
      if (downloads.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-muted-foreground">`);
        push_element($$renderer2, "p", 24, 4);
        $$renderer2.push(`No downloads available.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 26, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(downloads);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let download = each_array[$$index];
          $$renderer2.push(`<div class="flex items-center space-x-4 bg-muted-foreground/10 p-4 rounded shadow-md">`);
          push_element($$renderer2, "div", 28, 8);
          $$renderer2.push(`<img${attr("src", download.thumbnailUrl)}${attr("alt", download.title)} class="w-16 h-16 object-cover rounded"/>`);
          push_element($$renderer2, "img", 29, 10);
          pop_element();
          $$renderer2.push(` <div class="flex-1">`);
          push_element($$renderer2, "div", 30, 10);
          $$renderer2.push(`<strong>`);
          push_element($$renderer2, "strong", 31, 12);
          $$renderer2.push(`${escape_html(download.title)}</strong>`);
          pop_element();
          $$renderer2.push(` <p class="text-sm text-muted">`);
          push_element($$renderer2, "p", 32, 12);
          $$renderer2.push(`Downloaded on ${escape_html(download.downloadDate)}</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          Button($$renderer2, {
            variant: "ghost",
            class: "text-sm",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Delete`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></section>`);
      pop_element();
      bind_props($$props, { downloads });
    },
    Downloads
  );
}
Downloads.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
MyList[FILENAME] = "src/lib/components/sections/dashboard/MyList.svelte";
function MyList($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let myList = [
        {
          id: "1",
          title: "The Chosen",
          thumbnailUrl: "/thumbnails/the-chosen.jpg",
          type: "TV Show"
        },
        {
          id: "2",
          title: "Pilgrim’s Progress",
          thumbnailUrl: "/thumbnails/pilgrims-progress.jpg",
          type: "Movie"
        }
      ];
      $$renderer2.push(`<section>`);
      push_element($$renderer2, "section", 19, 0);
      $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 20, 2);
      $$renderer2.push(`My List</h2>`);
      pop_element();
      $$renderer2.push(` `);
      if (myList.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-muted-foreground">`);
        push_element($$renderer2, "p", 23, 4);
        $$renderer2.push(`You haven't added anything to your list yet.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">`);
        push_element($$renderer2, "div", 25, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(myList);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer2.push(`<a${attr("href", `/media/${item.id}`)} class="group relative rounded overflow-hidden shadow hover:scale-105 transition">`);
          push_element($$renderer2, "a", 27, 8);
          $$renderer2.push(`<img${attr("src", item.thumbnailUrl)}${attr("alt", item.title)} class="w-full h-48 object-cover rounded"/>`);
          push_element($$renderer2, "img", 28, 10);
          pop_element();
          $$renderer2.push(` <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-sm">`);
          push_element($$renderer2, "div", 29, 10);
          $$renderer2.push(`<strong>`);
          push_element($$renderer2, "strong", 30, 12);
          $$renderer2.push(`${escape_html(item.title)}</strong>`);
          pop_element();
          $$renderer2.push(` <span class="block text-xs text-muted">`);
          push_element($$renderer2, "span", 31, 12);
          $$renderer2.push(`${escape_html(item.type)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</a>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></section>`);
      pop_element();
    },
    MyList
  );
}
MyList.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
RecentlyWatched[FILENAME] = "src/lib/components/sections/dashboard/RecentlyWatched.svelte";
function RecentlyWatched($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let recentlyWatched = fallback(
        $$props["recentlyWatched"],
        () => [
          {
            id: "1",
            title: "The Chosen",
            thumbnailUrl: "/thumbnails/the-chosen.jpg",
            lastWatched: "2025-04-08"
          },
          {
            id: "2",
            title: "Pilgrim’s Progress",
            thumbnailUrl: "/thumbnails/pilgrims-progress.jpg",
            lastWatched: "2025-04-06"
          }
        ],
        true
      );
      $$renderer2.push(`<section>`);
      push_element($$renderer2, "section", 20, 0);
      $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 21, 2);
      $$renderer2.push(`Recently Watched</h2>`);
      pop_element();
      $$renderer2.push(` `);
      if (recentlyWatched.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-muted-foreground">`);
        push_element($$renderer2, "p", 24, 4);
        $$renderer2.push(`You haven't watched anything recently.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 26, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(recentlyWatched);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer2.push(`<div class="flex items-center space-x-4 bg-muted-foreground/10 p-4 rounded shadow-md">`);
          push_element($$renderer2, "div", 28, 8);
          $$renderer2.push(`<img${attr("src", item.thumbnailUrl)}${attr("alt", item.title)} class="w-16 h-16 object-cover rounded"/>`);
          push_element($$renderer2, "img", 29, 10);
          pop_element();
          $$renderer2.push(` <div class="flex-1">`);
          push_element($$renderer2, "div", 30, 10);
          $$renderer2.push(`<strong>`);
          push_element($$renderer2, "strong", 31, 12);
          $$renderer2.push(`${escape_html(item.title)}</strong>`);
          pop_element();
          $$renderer2.push(` <p class="text-sm text-muted">`);
          push_element($$renderer2, "p", 32, 12);
          $$renderer2.push(`Last watched on ${escape_html(item.lastWatched)}</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          Button($$renderer2, {
            variant: "ghost",
            class: "text-sm",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Resume`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></section>`);
      pop_element();
      bind_props($$props, { recentlyWatched });
    },
    RecentlyWatched
  );
}
RecentlyWatched.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Recommendations[FILENAME] = "src/lib/components/sections/dashboard/Recommendations.svelte";
function Recommendations($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let recommendations = fallback(
        $$props["recommendations"],
        () => [
          {
            id: "1",
            title: "The Passion of the Christ",
            thumbnailUrl: "/thumbnails/the-passion-of-the-christ.jpg",
            genre: "Drama"
          },
          {
            id: "2",
            title: "The Ten Commandments",
            thumbnailUrl: "/thumbnails/the-ten-commandments.jpg",
            genre: "Historical"
          }
        ],
        true
      );
      $$renderer2.push(`<section>`);
      push_element($$renderer2, "section", 20, 0);
      $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 21, 2);
      $$renderer2.push(`Recommended for You</h2>`);
      pop_element();
      $$renderer2.push(` `);
      if (recommendations.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-muted-foreground">`);
        push_element($$renderer2, "p", 24, 4);
        $$renderer2.push(`We couldn't find any recommendations for you right now.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 26, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(recommendations);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let recommendation = each_array[$$index];
          $$renderer2.push(`<div class="flex items-center space-x-4 bg-muted-foreground/10 p-4 rounded shadow-md">`);
          push_element($$renderer2, "div", 28, 8);
          $$renderer2.push(`<img${attr("src", recommendation.thumbnailUrl)}${attr("alt", recommendation.title)} class="w-16 h-16 object-cover rounded"/>`);
          push_element($$renderer2, "img", 29, 10);
          pop_element();
          $$renderer2.push(` <div class="flex-1">`);
          push_element($$renderer2, "div", 30, 10);
          $$renderer2.push(`<strong>`);
          push_element($$renderer2, "strong", 31, 12);
          $$renderer2.push(`${escape_html(recommendation.title)}</strong>`);
          pop_element();
          $$renderer2.push(` <p class="text-sm text-muted">`);
          push_element($$renderer2, "p", 32, 12);
          $$renderer2.push(`${escape_html(recommendation.genre)}</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          Button($$renderer2, {
            variant: "ghost",
            class: "text-sm",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Watch Now`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></section>`);
      pop_element();
      bind_props($$props, { recommendations });
    },
    Recommendations
  );
}
Recommendations.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Settings[FILENAME] = "src/lib/components/sections/dashboard/Settings.svelte";
function Settings($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let settings = fallback($$props["settings"], () => ({ notificationsEnabled: true, language: "English" }), true);
      $$renderer2.push(`<section>`);
      push_element($$renderer2, "section", 21, 0);
      $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 22, 2);
      $$renderer2.push(`Settings</h2>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 24, 2);
      $$renderer2.push(`<div class="flex items-center justify-between p-4 bg-muted-foreground/10 rounded shadow-md">`);
      push_element($$renderer2, "div", 25, 4);
      $$renderer2.push(`<span class="font-medium">`);
      push_element($$renderer2, "span", 26, 6);
      $$renderer2.push(`Notifications</span>`);
      pop_element();
      $$renderer2.push(` <label class="switch">`);
      push_element($$renderer2, "label", 27, 6);
      $$renderer2.push(`<input type="checkbox"${attr("checked", settings.notificationsEnabled, true)}/>`);
      push_element($$renderer2, "input", 28, 8);
      pop_element();
      $$renderer2.push(` <span class="slider round">`);
      push_element($$renderer2, "span", 29, 8);
      $$renderer2.push(`</span>`);
      pop_element();
      $$renderer2.push(`</label>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center justify-between p-4 bg-muted-foreground/10 rounded shadow-md">`);
      push_element($$renderer2, "div", 33, 4);
      $$renderer2.push(`<span class="font-medium">`);
      push_element($$renderer2, "span", 34, 6);
      $$renderer2.push(`Language</span>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select({ class: "p-2 rounded", value: settings.language }, ($$renderer3) => {
        $$renderer3.option({ value: "English" }, ($$renderer4) => {
          $$renderer4.push(`English`);
        });
        $$renderer3.option({ value: "Spanish" }, ($$renderer4) => {
          $$renderer4.push(`Spanish`);
        });
        $$renderer3.option({ value: "French" }, ($$renderer4) => {
          $$renderer4.push(`French`);
        });
      });
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      bind_props($$props, { settings });
    },
    Settings
  );
}
Settings.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
AccountSettings[FILENAME] = "src/lib/components/sections/dashboard/AccountSettings.svelte";
function AccountSettings($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let accountSettings = fallback($$props["accountSettings"], () => ({ email: "user@example.com", password: "••••••••" }), true);
      let newEmail = accountSettings.email;
      let newPassword = accountSettings.password;
      $$renderer2.push(`<section>`);
      push_element($$renderer2, "section", 20, 0);
      $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 21, 2);
      $$renderer2.push(`Account Settings</h2>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 23, 2);
      $$renderer2.push(`<div class="flex flex-col p-4 bg-muted-foreground/10 rounded shadow-md">`);
      push_element($$renderer2, "div", 24, 4);
      $$renderer2.push(`<label for="email" class="font-medium">`);
      push_element($$renderer2, "label", 25, 6);
      $$renderer2.push(`Email</label>`);
      pop_element();
      $$renderer2.push(` <input id="email" type="email" class="p-2 rounded mt-2"${attr("value", newEmail)} placeholder="Enter your email"/>`);
      push_element($$renderer2, "input", 26, 6);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-col p-4 bg-muted-foreground/10 rounded shadow-md">`);
      push_element($$renderer2, "div", 35, 4);
      $$renderer2.push(`<label for="password" class="font-medium">`);
      push_element($$renderer2, "label", 36, 6);
      $$renderer2.push(`Password</label>`);
      pop_element();
      $$renderer2.push(` <input id="password" type="password" class="p-2 rounded mt-2"${attr("value", newPassword)} placeholder="Enter your password"/>`);
      push_element($$renderer2, "input", 37, 6);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Button($$renderer2, {
        variant: "default",
        class: "mt-4",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Save Changes`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      bind_props($$props, { accountSettings });
    },
    AccountSettings
  );
}
AccountSettings.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/my-studios/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      const user = page.data?.user;
      let userTokenBalance = "0";
      let userStakingDiscount = 0;
      Sheet($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Sheet_trigger($$renderer3, {
            class: "text-xl font-bold text-orange-500 hover:text-orange-600 transition",
            children: prevent_snippet_stringification(($$renderer4) => {
              Button($$renderer4, {
                variant: "ghost",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Open My Studios`);
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Sheet_content($$renderer3, {
            side: "left",
            class: "w-[90vw] max-w-2xl h-full p-6 space-y-10 overflow-y-auto bg-background border-r",
            children: prevent_snippet_stringification(($$renderer4) => {
              if (user) {
                $$renderer4.push("<!--[-->");
                Hero($$renderer4, { user });
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<p class="text-sm text-muted-foreground italic">`);
                push_element($$renderer4, "p", 58, 8);
                $$renderer4.push(`Loading user info...</p>`);
                pop_element();
              }
              $$renderer4.push(`<!--]--> <div class="space-y-1">`);
              push_element($$renderer4, "div", 62, 4);
              $$renderer4.push(`<h2 class="text-2xl font-semibold text-orange-500">`);
              push_element($$renderer4, "h2", 63, 6);
              $$renderer4.push(`Welcome to My Studios</h2>`);
              pop_element();
              $$renderer4.push(` <p class="text-muted-foreground text-sm">`);
              push_element($$renderer4, "p", 64, 6);
              $$renderer4.push(`Manage everything in one place</p>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 68, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground">`);
              push_element($$renderer4, "h3", 69, 6);
              $$renderer4.push(`Switch Profile</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30">`);
              push_element($$renderer4, "div", 70, 6);
              ProfileSwitcher($$renderer4);
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 76, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground">`);
              push_element($$renderer4, "h3", 77, 6);
              $$renderer4.push(`Recommended for You</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30">`);
              push_element($$renderer4, "div", 78, 6);
              Recommendations($$renderer4, {});
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 84, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground">`);
              push_element($$renderer4, "h3", 85, 6);
              $$renderer4.push(`My List</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30">`);
              push_element($$renderer4, "div", 86, 6);
              MyList($$renderer4);
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 92, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground">`);
              push_element($$renderer4, "h3", 93, 6);
              $$renderer4.push(`Recently Watched</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30">`);
              push_element($$renderer4, "div", 94, 6);
              RecentlyWatched($$renderer4, {});
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 100, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground">`);
              push_element($$renderer4, "h3", 101, 6);
              $$renderer4.push(`Downloads</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30">`);
              push_element($$renderer4, "div", 102, 6);
              Downloads($$renderer4, {});
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 108, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground">`);
              push_element($$renderer4, "h3", 109, 6);
              $$renderer4.push(`Settings</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30">`);
              push_element($$renderer4, "div", 110, 6);
              Settings($$renderer4, {});
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 116, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground flex items-center space-x-2">`);
              push_element($$renderer4, "h3", 117, 6);
              Crown($$renderer4, { class: "h-4 w-4 text-primary" });
              $$renderer4.push(`<!----> <span>`);
              push_element($$renderer4, "span", 119, 8);
              $$renderer4.push(`NFT Subscription &amp; Tokens</span>`);
              pop_element();
              $$renderer4.push(`</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30 space-y-4">`);
              push_element($$renderer4, "div", 121, 6);
              if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="grid grid-cols-2 gap-4">`);
                push_element($$renderer4, "div", 123, 10);
                $$renderer4.push(`<div class="text-center p-3 bg-primary/5 rounded-lg">`);
                push_element($$renderer4, "div", 124, 12);
                Coins($$renderer4, { class: "h-6 w-6 text-primary mx-auto mb-1" });
                $$renderer4.push(`<!----> <p class="text-sm font-medium">`);
                push_element($$renderer4, "p", 126, 14);
                $$renderer4.push(`${escape_html(parseFloat(userTokenBalance).toLocaleString())}</p>`);
                pop_element();
                $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
                push_element($$renderer4, "p", 127, 14);
                $$renderer4.push(`STC Tokens</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center p-3 bg-secondary/5 rounded-lg">`);
                push_element($$renderer4, "div", 129, 12);
                Gift($$renderer4, { class: "h-6 w-6 text-secondary mx-auto mb-1" });
                $$renderer4.push(`<!----> <p class="text-sm font-medium">`);
                push_element($$renderer4, "p", 131, 14);
                $$renderer4.push(`${escape_html(userStakingDiscount)}%</p>`);
                pop_element();
                $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
                push_element($$renderer4, "p", 132, 14);
                $$renderer4.push(`Discount</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex space-x-2">`);
                push_element($$renderer4, "div", 135, 10);
                Button($$renderer4, {
                  size: "sm",
                  href: "/subscription",
                  class: "flex-1",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Crown($$renderer5, { class: "h-3 w-3 mr-1" });
                    $$renderer5.push(`<!----> NFT Sub`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  size: "sm",
                  variant: "outline",
                  href: "/tokens",
                  class: "flex-1",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Coins($$renderer5, { class: "h-3 w-3 mr-1" });
                    $$renderer5.push(`<!----> Tokens`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
                WalletConnect($$renderer4);
              }
              $$renderer4.push(`<!--]--></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 152, 4);
              $$renderer4.push(`<h3 class="text-md font-medium mb-2 text-muted-foreground">`);
              push_element($$renderer4, "h3", 153, 6);
              $$renderer4.push(`Account</h3>`);
              pop_element();
              $$renderer4.push(` <div class="rounded-lg border p-4 bg-muted/30">`);
              push_element($$renderer4, "div", 154, 6);
              AccountSettings($$renderer4, {});
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-3xr-ScVo.js.map
