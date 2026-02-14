import { t as head, D as attr_style, p as prevent_snippet_stringification, E as escape_html, m as ensure_array_like, C as attr_class, x as stringify, u as attr } from './index-C14HL8mA.js';
import { a as HomepageContent, C as Constants, b as getStyle } from './index4-Cnd3Rmm9.js';
import { B as Button } from './button-B5TxIyzE.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content, d as Card_description } from './card-title-C-y0C6UW.js';
import { p as page } from './index2-DN4t2Pgp.js';
import { A as Arrow_right } from './arrow-right-OsfR0UoT.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './Icon-DLeFNkXp.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';
import './utils2-C-_3GP94.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';

_page[FILENAME] = "src/routes/(app)/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const user = page.data.user;
      head("h7bcrl", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(HomepageContent.hero.title)} | ${escape_html(Constants.BRANDNAME)}</title>`);
        });
        $$renderer3.push(`<meta name="description"${attr("content", HomepageContent.hero.description)}/>`);
        push_element($$renderer3, "meta", 15, 2);
        pop_element();
      });
      $$renderer2.push(`<section class="relative overflow-hidden py-20 lg:py-32">`);
      push_element($$renderer2, "section", 19, 0);
      $$renderer2.push(`<div class="absolute inset-0 z-0">`);
      push_element($$renderer2, "div", 21, 2);
      $$renderer2.push(`<div class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"${attr_style(getStyle(HomepageContent.hero.backgroundImage))}>`);
      push_element($$renderer2, "div", 22, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="absolute inset-0 bg-black/50 dark:bg-black/70">`);
      push_element($$renderer2, "div", 26, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 29, 2);
      $$renderer2.push(`<div class="max-w-2xl animate-in slide-in-from-left-10 duration-700 fade-in">`);
      push_element($$renderer2, "div", 30, 4);
      Badge($$renderer2, {
        variant: "outline",
        class: "mb-6 animate-bounce border-primary/20 bg-primary/10 text-primary backdrop-blur-sm",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(HomepageContent.hero.subtitle)}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white dark:text-foreground">`);
      push_element($$renderer2, "h1", 34, 6);
      $$renderer2.push(`${escape_html(HomepageContent.hero.title)}</h1>`);
      pop_element();
      $$renderer2.push(` <p class="mb-8 text-lg text-white dark:text-muted-foreground sm:text-xl">`);
      push_element($$renderer2, "p", 37, 6);
      $$renderer2.push(`${escape_html(HomepageContent.hero.description)}</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-col gap-4 sm:flex-row">`);
      push_element($$renderer2, "div", 40, 6);
      if (user) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          href: HomepageContent.hero.loggedInCta.href,
          size: "lg",
          class: "group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div class="absolute inset-0 bg-white/20 translate-y-full rotate-45 transition-transform group-hover:translate-y-0">`);
            push_element($$renderer3, "div", 43, 13);
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` ${escape_html(HomepageContent.hero.loggedInCta.text)} `);
            Arrow_right($$renderer3, {
              class: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Button($$renderer2, {
          href: HomepageContent.hero.primaryCta.href,
          size: "lg",
          class: "group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div class="absolute inset-0 bg-white/20 translate-y-full rotate-45 transition-transform group-hover:translate-y-0">`);
            push_element($$renderer3, "div", 49, 12);
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` ${escape_html(HomepageContent.hero.primaryCta.text)} `);
            Arrow_right($$renderer3, {
              class: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Button($$renderer2, {
          href: HomepageContent.hero.secondaryCta.href,
          variant: "outline",
          size: "lg",
          class: "backdrop-blur-sm hover:bg-background/80",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(HomepageContent.hero.secondaryCta.text)}`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section class="border-y bg-muted/30 py-12">`);
      push_element($$renderer2, "section", 63, 0);
      $$renderer2.push(`<div class="container mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 64, 2);
      $$renderer2.push(`<div class="grid grid-cols-2 gap-8 md:grid-cols-4">`);
      push_element($$renderer2, "div", 65, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(HomepageContent.stats);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let stat = each_array[$$index];
        $$renderer2.push(`<div class="group text-center">`);
        push_element($$renderer2, "div", 67, 8);
        $$renderer2.push(`<div${attr_class(`mb-2 text-3xl font-bold md:text-4xl bg-gradient-to-r ${stringify(stat.gradient)} bg-clip-text text-transparent`)}>`);
        push_element($$renderer2, "div", 68, 10);
        $$renderer2.push(`${escape_html(stat.value)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">`);
        push_element($$renderer2, "div", 71, 10);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 72, 12);
        $$renderer2.push(`${escape_html(stat.emoji)}</span>`);
        pop_element();
        $$renderer2.push(` ${escape_html(stat.label)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section id="features" class="py-20 lg:py-32">`);
      push_element($$renderer2, "section", 82, 0);
      $$renderer2.push(`<div class="container mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 83, 2);
      $$renderer2.push(`<div class="mb-16 text-center">`);
      push_element($$renderer2, "div", 84, 4);
      Badge($$renderer2, {
        variant: "secondary",
        class: "mb-4",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(HomepageContent.features.badge)}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">`);
      push_element($$renderer2, "h2", 86, 6);
      $$renderer2.push(`${escape_html(HomepageContent.features.title)}</h2>`);
      pop_element();
      $$renderer2.push(` <p class="mx-auto max-w-2xl text-muted-foreground">`);
      push_element($$renderer2, "p", 87, 6);
      $$renderer2.push(`${escape_html(HomepageContent.features.description)}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">`);
      push_element($$renderer2, "div", 90, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(HomepageContent.features.items);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let feature = each_array_1[$$index_1];
        Card($$renderer2, {
          class: "group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-secondary/20",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div${attr_class(`absolute inset-0 bg-gradient-to-br ${stringify(feature.gradient)} opacity-0 transition-opacity duration-500 group-hover:opacity-5`)}>`);
            push_element($$renderer3, "div", 93, 10);
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` `);
            Card_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div${attr_class(`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stringify(feature.gradient)} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`)}>`);
                push_element($$renderer4, "div", 95, 12);
                feature.icon($$renderer4, { class: "h-6 w-6" });
                $$renderer4.push(`<!----></div>`);
                pop_element();
                $$renderer4.push(` `);
                Card_title($$renderer4, {
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(feature.title)}`);
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
                Card_description($$renderer4, {
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(feature.description)}`);
                  }),
                  $$slots: { default: true }
                });
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
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section class="py-20 relative overflow-hidden bg-muted/30">`);
      push_element($$renderer2, "section", 110, 0);
      $$renderer2.push(`<div class="absolute inset-0 overflow-hidden pointer-events-none opacity-5">`);
      push_element($$renderer2, "div", 111, 2);
      $$renderer2.push(`<div class="absolute top-1/4 left-10 w-48 h-48 bg-primary rounded-full blur-3xl">`);
      push_element($$renderer2, "div", 112, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="absolute bottom-1/4 right-10 w-48 h-48 bg-secondary rounded-full blur-3xl">`);
      push_element($$renderer2, "div", 113, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 116, 2);
      $$renderer2.push(`<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">`);
      push_element($$renderer2, "div", 117, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 118, 6);
      Badge($$renderer2, {
        class: "mb-4 bg-primary text-primary-foreground border-0",
        variant: "secondary",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(HomepageContent.mission.badge)}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <h2 class="mb-6 text-3xl font-bold md:text-4xl">`);
      push_element($$renderer2, "h2", 120, 8);
      $$renderer2.push(`${escape_html(HomepageContent.mission.title)}</h2>`);
      pop_element();
      $$renderer2.push(` <p class="mb-6 text-muted-foreground">`);
      push_element($$renderer2, "p", 121, 8);
      $$renderer2.push(`${escape_html(HomepageContent.mission.description)}</p>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 122, 8);
      $$renderer2.push(`<!--[-->`);
      const each_array_2 = ensure_array_like(HomepageContent.mission.values);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let value = each_array_2[$$index_2];
        $$renderer2.push(`<div class="flex items-start space-x-3 group">`);
        push_element($$renderer2, "div", 124, 12);
        $$renderer2.push(`<div class="relative">`);
        push_element($$renderer2, "div", 125, 14);
        $$renderer2.push(`<div${attr_class(`absolute inset-0 bg-gradient-to-br ${stringify(value.gradient)} rounded-lg blur-md opacity-50`)}>`);
        push_element($$renderer2, "div", 126, 16);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div${attr_class(`relative bg-gradient-to-br ${stringify(value.gradient)} rounded-lg p-2 shadow-lg group-hover:scale-110 transition-transform`)}>`);
        push_element($$renderer2, "div", 127, 16);
        value.icon($$renderer2, { class: "h-5 w-5 text-white" });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 131, 14);
        $$renderer2.push(`<h4 class="mb-1 font-semibold">`);
        push_element($$renderer2, "h4", 132, 16);
        $$renderer2.push(`${escape_html(value.title)}</h4>`);
        pop_element();
        $$renderer2.push(` <p class="text-sm text-muted-foreground">`);
        push_element($$renderer2, "p", 133, 16);
        $$renderer2.push(`${escape_html(value.description)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Card($$renderer2, {
        class: "shadow-2xl bg-gradient-to-br from-background to-muted border-2 border-primary/10",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "text-base",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Core Values`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Card_description($$renderer4, {
                class: "text-base",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->The principles that guide our approach`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="space-y-3">`);
              push_element($$renderer4, "div", 145, 10);
              $$renderer4.push(`<!--[-->`);
              const each_array_3 = ensure_array_like(HomepageContent.mission.coreValues);
              for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                let val = each_array_3[$$index_3];
                $$renderer4.push(`<div class="flex items-center space-x-3">`);
                push_element($$renderer4, "div", 147, 14);
                $$renderer4.push(`<div class="h-2 w-2 rounded-full bg-primary animate-pulse">`);
                push_element($$renderer4, "div", 148, 16);
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <span class="font-medium">`);
                push_element($$renderer4, "span", 149, 16);
                $$renderer4.push(`${escape_html(val)}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              }
              $$renderer4.push(`<!--]--></div>`);
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
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section class="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground relative overflow-hidden">`);
      push_element($$renderer2, "section", 160, 0);
      $$renderer2.push(`<div class="absolute inset-0 overflow-hidden pointer-events-none">`);
      push_element($$renderer2, "div", 161, 2);
      $$renderer2.push(`<div class="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">`);
      push_element($$renderer2, "div", 162, 4);
      $$renderer2.push(`⭐</div>`);
      pop_element();
      $$renderer2.push(` <div class="absolute bottom-10 right-10 text-7xl opacity-10 animate-bounce">`);
      push_element($$renderer2, "div", 163, 4);
      $$renderer2.push(`❤️</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="container mx-auto px-4 text-center sm:px-6 lg:px-8 relative z-10">`);
      push_element($$renderer2, "div", 166, 2);
      $$renderer2.push(`<div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border-2 border-white/30 mx-auto backdrop-blur-sm mb-6">`);
      push_element($$renderer2, "div", 167, 4);
      $$renderer2.push(`<span class="text-sm font-semibold">`);
      push_element($$renderer2, "span", 168, 6);
      $$renderer2.push(`${escape_html(HomepageContent.cta.badge)}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <h2 class="mb-6 text-3xl font-bold md:text-4xl drop-shadow-lg">`);
      push_element($$renderer2, "h2", 170, 4);
      $$renderer2.push(`${escape_html(HomepageContent.cta.title)}</h2>`);
      pop_element();
      $$renderer2.push(` <p class="mb-8 opacity-95 text-lg max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 171, 4);
      $$renderer2.push(`${escape_html(HomepageContent.cta.description)}</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-col justify-center gap-4 sm:flex-row">`);
      push_element($$renderer2, "div", 172, 4);
      if (user) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          href: "/dashboard",
          size: "lg",
          variant: "secondary",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Go to Dashboard `);
            Arrow_right($$renderer3, { class: "ml-2 h-5 w-5" });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Button($$renderer2, {
          href: "/auth/login?redirectTo=/dashboard",
          size: "lg",
          variant: "secondary",
          class: "shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(HomepageContent.cta.buttonText)} `);
            Arrow_right($$renderer3, { class: "ml-2 h-5 w-5" });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-DgbhEdkC.js.map
