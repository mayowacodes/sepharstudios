import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, a as push_element, b as pop_element, e as escape_html, i as ensure_array_like, m as attr_style, l as stringify } from "../../../../../chunks/ui-libs.js";
import { B as Badge } from "../../../../../chunks/badge.js";
import { C as Card, a as Card_header, d as Card_description, b as Card_title, c as Card_content } from "../../../../../chunks/card-title.js";
import "clsx";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { A as Activity } from "../../../../../chunks/activity.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { U as Users } from "../../../../../chunks/users.js";
import { M as Monitor, S as Smartphone, T as Tablet, a as Tv } from "../../../../../chunks/tv.js";
Shield_check[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/shield-check.svelte";
function Shield_check($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
          }
        ],
        ["path", { "d": "m9 12 2 2 4-4" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "shield-check" },
        /**
         * @component @name ShieldCheck
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8+CiAgPHBhdGggZD0ibTkgMTIgMiAyIDQtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shield-check
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
    Shield_check
  );
}
Shield_check.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(admin)/admin/dashboard/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const { data } = $$props;
      const getDeviceIcon = (type) => {
        switch (type) {
          case "tv":
            return Tv;
          case "tablet":
            return Tablet;
          case "mobile":
            return Smartphone;
          default:
            return Monitor;
        }
      };
      const getDeviceColor = (type) => {
        switch (type) {
          case "tv":
            return "bg-purple-500/10 text-purple-500 border-purple-500/20";
          case "tablet":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
          case "mobile":
            return "bg-green-500/10 text-green-500 border-green-500/20";
          default:
            return "bg-orange-500/10 text-orange-500 border-orange-500/20";
        }
      };
      const totalSessions = data.deviceStats.reduce((acc, curr) => acc + curr.count, 0);
      $$renderer2.push(`<div class="p-8 max-w-7xl mx-auto space-y-10">`);
      push_element($$renderer2, "div", 29, 0);
      $$renderer2.push(`<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">`);
      push_element($$renderer2, "div", 31, 2);
      $$renderer2.push(`<div class="space-y-1">`);
      push_element($$renderer2, "div", 32, 4);
      $$renderer2.push(`<div class="flex items-center gap-2 text-orange-500 font-medium">`);
      push_element($$renderer2, "div", 33, 6);
      Shield_check($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>`);
      push_element($$renderer2, "span", 35, 8);
      $$renderer2.push(`Admin Security Console</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-4xl font-bold tracking-tight">`);
      push_element($$renderer2, "h1", 37, 6);
      $$renderer2.push(`Platform Pulse</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground text-lg">`);
      push_element($$renderer2, "p", 38, 6);
      $$renderer2.push(`Real-time device monitoring and session oversight.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-muted-foreground/10">`);
      push_element($$renderer2, "div", 41, 4);
      $$renderer2.push(`<div class="flex flex-col items-end">`);
      push_element($$renderer2, "div", 42, 6);
      $$renderer2.push(`<span class="text-sm text-muted-foreground">`);
      push_element($$renderer2, "span", 43, 8);
      $$renderer2.push(`Active Sessions</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-2xl font-bold font-mono tracking-tighter">`);
      push_element($$renderer2, "span", 44, 8);
      $$renderer2.push(`${escape_html(totalSessions)}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="h-8 w-px bg-muted-foreground/20">`);
      push_element($$renderer2, "div", 46, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Activity($$renderer2, { class: "w-8 h-8 text-green-500 animate-pulse" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 52, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.deviceStats);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let stat = each_array[$$index];
        const Icon2 = getDeviceIcon(stat.deviceType);
        Card($$renderer2, {
          class: "relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">`);
            push_element($$renderer3, "div", 56, 8);
            $$renderer3.push(`<!---->`);
            Icon2($$renderer3, { class: "w-16 h-16" });
            $$renderer3.push(`<!----></div>`);
            pop_element();
            $$renderer3.push(` `);
            Card_header($$renderer3, {
              class: "pb-2",
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_description($$renderer4, {
                  class: "capitalize",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(stat.deviceType || "Unknown")}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Card_title($$renderer4, {
                  class: "text-3xl font-bold",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(stat.count)}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Card_content($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="w-full bg-muted h-1 rounded-full overflow-hidden">`);
                push_element($$renderer4, "div", 64, 10);
                $$renderer4.push(`<div class="h-full bg-orange-500"${attr_style(`width: ${stringify(stat.count / totalSessions * 100)}%`)}>`);
                push_element($$renderer4, "div", 65, 12);
                $$renderer4.push(`</div>`);
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
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 76, 2);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 77, 4);
      $$renderer2.push(`<div class="flex items-center gap-2 font-semibold text-xl">`);
      push_element($$renderer2, "div", 78, 6);
      Clock($$renderer2, { class: "w-5 h-5 text-orange-500" });
      $$renderer2.push(`<!----> <h2>`);
      push_element($$renderer2, "h2", 80, 8);
      $$renderer2.push(`Live Session Feed</h2>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Badge($$renderer2, {
        variant: "outline",
        class: "font-mono",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Real-time Updates On`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div class="border rounded-2xl overflow-hidden bg-background divide-y">`);
      push_element($$renderer2, "div", 85, 4);
      const each_array_1 = ensure_array_like(data.recentSessions);
      if (each_array_1.length !== 0) {
        $$renderer2.push("<!--[-->");
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let session = each_array_1[$$index_1];
          const DeviceIcon = getDeviceIcon(session.deviceType);
          $$renderer2.push(`<div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">`);
          push_element($$renderer2, "div", 88, 8);
          $$renderer2.push(`<div class="flex items-center gap-4">`);
          push_element($$renderer2, "div", 89, 10);
          $$renderer2.push(`<div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-orange-500 group-hover:text-white transition-colors">`);
          push_element($$renderer2, "div", 90, 12);
          Users($$renderer2, { class: "w-5 h-5" });
          $$renderer2.push(`<!----></div>`);
          pop_element();
          $$renderer2.push(` <div>`);
          push_element($$renderer2, "div", 93, 12);
          $$renderer2.push(`<div class="font-medium">`);
          push_element($$renderer2, "div", 94, 14);
          $$renderer2.push(`${escape_html(session.userName)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-xs text-muted-foreground">`);
          push_element($$renderer2, "div", 95, 14);
          $$renderer2.push(`${escape_html(session.userEmail)}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="hidden md:flex flex-col items-center gap-1">`);
          push_element($$renderer2, "div", 99, 10);
          Badge($$renderer2, {
            variant: "outline",
            class: getDeviceColor(session.deviceType),
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<div class="flex items-center gap-1">`);
              push_element($$renderer3, "div", 101, 14);
              $$renderer3.push(`<!---->`);
              DeviceIcon($$renderer3, { class: "w-3 h-3" });
              $$renderer3.push(`<!----> <span class="capitalize">`);
              push_element($$renderer3, "span", 103, 16);
              $$renderer3.push(`${escape_html(session.deviceType || "Desktop")}</span>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----> <span class="text-[10px] text-muted-foreground font-mono">`);
          push_element($$renderer2, "span", 106, 12);
          $$renderer2.push(`${escape_html(session.ipAddress || "0.0.0.0")}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-sm text-muted-foreground font-mono">`);
          push_element($$renderer2, "div", 109, 10);
          $$renderer2.push(`${escape_html(new Date(session.createdAt).toLocaleTimeString())}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="p-10 text-center text-muted-foreground">`);
        push_element($$renderer2, "div", 114, 8);
        $$renderer2.push(`No active sessions detected.</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
