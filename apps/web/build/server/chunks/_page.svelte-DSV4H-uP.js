import { F as FILENAME } from './index-client-DVey9PBT.js';
import { E as escape_html, p as prevent_snippet_stringification } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { p as page } from './index2-DN4t2Pgp.js';
import { U as Users } from './users-CMHMaCG6.js';
import { U as User, F as File_text, L as Layout_dashboard } from './user-CU8eWwNU.js';
import './utils2-C-_3GP94.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';
import './Icon-DLeFNkXp.js';

_page[FILENAME] = "src/routes/(protected)/dashboard/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const user = page.data.user;
      $$renderer2.push(`<div class="flex flex-col gap-6">`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 11, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold">`);
      push_element($$renderer2, "h1", 12, 4);
      $$renderer2.push(`Dashboard</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 13, 4);
      $$renderer2.push(`Welcome back, ${escape_html(user?.name || "User")}!</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">`);
      push_element($$renderer2, "div", 16, 2);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            class: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "text-sm font-medium",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Total Users`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Users($$renderer4, { class: "h-4 w-4 text-muted-foreground" });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="text-2xl font-bold">`);
              push_element($$renderer4, "div", 23, 8);
              $$renderer4.push(`0</div>`);
              pop_element();
              $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 24, 8);
              $$renderer4.push(`Registered users</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            class: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "text-sm font-medium",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Active Sessions`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              User($$renderer4, { class: "h-4 w-4 text-muted-foreground" });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="text-2xl font-bold">`);
              push_element($$renderer4, "div", 34, 8);
              $$renderer4.push(`1</div>`);
              pop_element();
              $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 35, 8);
              $$renderer4.push(`Current session</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            class: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "text-sm font-medium",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Documents`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              File_text($$renderer4, { class: "h-4 w-4 text-muted-foreground" });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="text-2xl font-bold">`);
              push_element($$renderer4, "div", 45, 8);
              $$renderer4.push(`0</div>`);
              pop_element();
              $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 46, 8);
              $$renderer4.push(`Total files</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            class: "flex flex-row items-center justify-between space-y-0 pb-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "text-sm font-medium",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->System Status`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Layout_dashboard($$renderer4, { class: "h-4 w-4 text-muted-foreground" });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="text-2xl font-bold text-green-500">`);
              push_element($$renderer4, "div", 56, 8);
              $$renderer4.push(`Online</div>`);
              pop_element();
              $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 57, 8);
              $$renderer4.push(`All systems operational</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-DSV4H-uP.js.map
