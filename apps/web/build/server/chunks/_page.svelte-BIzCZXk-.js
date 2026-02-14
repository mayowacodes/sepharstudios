import { t as head, p as prevent_snippet_stringification, m as ensure_array_like, E as escape_html, g as spread_props } from './index-C14HL8mA.js';
import { C as Card, c as Card_content } from './card-title-C-y0C6UW.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { E as Eye } from './eye-Da_d-AVQ.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import './utils2-C-_3GP94.js';

Target[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/target.svelte";
function Target($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["circle", { "cx": "12", "cy": "12", "r": "10" }],
        ["circle", { "cx": "12", "cy": "12", "r": "6" }],
        ["circle", { "cx": "12", "cy": "12", "r": "2" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "target" },
        /**
         * @component @name Target
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/target
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
    Target
  );
}
Target.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/about/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const milestones = [
        { year: 2024, text: "Launch of Sephar Studios platform" },
        {
          year: 2025,
          text: "Target to be among top 5 Christian media houses"
        },
        {
          year: 2025,
          text: "Target to be among top 10 media houses in the country"
        }
      ];
      head("6yh93n", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>About Us | Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description" content="Learn about Sephar Studios' mission to spread kingdom-friendly media content and draw souls to the kingdom of God."/>`);
        push_element($$renderer3, "meta", 14, 2);
        pop_element();
      });
      $$renderer2.push(`<main class="container pt-32 pb-16 text-white">`);
      push_element($$renderer2, "main", 17, 0);
      $$renderer2.push(`<section class="text-center space-y-6 pb-24">`);
      push_element($$renderer2, "section", 18, 2);
      $$renderer2.push(`<h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-[#FF5E0E]">`);
      push_element($$renderer2, "h1", 19, 4);
      $$renderer2.push(`Spreading Light Through Media</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-[#FFBF00] max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 22, 4);
      $$renderer2.push(`Sephar Studios is dedicated to producing excellent video content that draws people to the kingdom of God/keep them there.</p>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section class="grid md:grid-cols-2 gap-8 pb-24">`);
      push_element($$renderer2, "section", 27, 2);
      Card($$renderer2, {
        class: "bg-black/50 border-[#AF6E4D] text-white",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_content($$renderer3, {
            class: "p-6 space-y-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="flex items-center gap-3">`);
              push_element($$renderer4, "div", 30, 8);
              Target($$renderer4, { class: "w-8 h-8 text-[#FF5E0E]" });
              $$renderer4.push(`<!----> <h2 class="text-2xl font-bold text-[#FFBF00]">`);
              push_element($$renderer4, "h2", 32, 10);
              $$renderer4.push(`Our Mission</h2>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300] mb-4">`);
              push_element($$renderer4, "p", 34, 8);
              $$renderer4.push(`To produce various types of attractive video contents that are excellently done with the goal of drawing men to the kingdom through quality video contents that will cut across all works of life.</p>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300] mb-4">`);
              push_element($$renderer4, "p", 37, 8);
              $$renderer4.push(`We aim to shine the light of the kingdom to show people that there is a God-kind of way to do everything, and it is the only way to do everything.</p>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300]">`);
              push_element($$renderer4, "p", 40, 10);
              $$renderer4.push(`Our mission includes bringing together a mountain of kingdom-friendly available resources and making them easily accessible for people who are hungry for spiritual growth.</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "bg-black/50 border-[#AF6E4D] text-white",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_content($$renderer3, {
            class: "p-6 space-y-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="flex items-center gap-3">`);
              push_element($$renderer4, "div", 48, 8);
              Eye($$renderer4, { class: "w-8 h-8 text-[#FF5E0E]" });
              $$renderer4.push(`<!----> <h2 class="text-2xl font-bold text-[#FFBF00]">`);
              push_element($$renderer4, "h2", 50, 10);
              $$renderer4.push(`Our Vision</h2>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300] mb-4">`);
              push_element($$renderer4, "p", 52, 8);
              $$renderer4.push(`To spread kingdom-friendly media content, attracting and retaining souls for the kingdom of God.</p>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300] mb-4">`);
              push_element($$renderer4, "p", 55, 8);
              $$renderer4.push(`To use media as a vehicle to bring souls and profit to the kingdom of God.</p>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300]">`);
              push_element($$renderer4, "p", 58, 10);
              $$renderer4.push(`By the end of 2025, to be one of the top 5 Christian media houses and one of the top 10 media houses in the country.</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></section>`);
      pop_element();
      $$renderer2.push(` <section class="text-center pb-24">`);
      push_element($$renderer2, "section", 65, 2);
      $$renderer2.push(`<h2 class="text-3xl font-bold text-[#FF5E0E] mb-6">`);
      push_element($$renderer2, "h2", 66, 4);
      $$renderer2.push(`Our Core Values</h2>`);
      pop_element();
      $$renderer2.push(` <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">`);
      push_element($$renderer2, "div", 67, 4);
      Card($$renderer2, {
        class: "bg-black/50 border-[#AF6E4D] text-white",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_content($$renderer3, {
            class: "p-6 space-y-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<h3 class="text-xl font-semibold text-[#FFBF00]">`);
              push_element($$renderer4, "h3", 70, 10);
              $$renderer4.push(`Excellence</h3>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300]">`);
              push_element($$renderer4, "p", 71, 10);
              $$renderer4.push(`Committed to producing high-quality content that glorifies God and serves our audience.</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "bg-black/50 border-[#AF6E4D] text-white",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_content($$renderer3, {
            class: "p-6 space-y-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<h3 class="text-xl font-semibold text-[#FFBF00]">`);
              push_element($$renderer4, "h3", 79, 10);
              $$renderer4.push(`Kingdom Impact</h3>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#090300]">`);
              push_element($$renderer4, "p", 80, 10);
              $$renderer4.push(`Focused on creating content that advances God's kingdom and transforms lives.</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "bg-black/50 border-[#AF6E4D] text-white",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_content($$renderer3, {
            class: "p-6 space-y-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<h3 class="text-xl font-semibold text-[#FFBF00]">`);
              push_element($$renderer4, "h3", 88, 10);
              $$renderer4.push(`Accessibility</h3>`);
              pop_element();
              $$renderer4.push(` <p class="text-[#0e0500]">`);
              push_element($$renderer4, "p", 89, 10);
              $$renderer4.push(`Making quality Christian content easily accessible to everyone seeking spiritual growth.</p>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section class="relative">`);
      push_element($$renderer2, "section", 97, 2);
      $$renderer2.push(`<h2 class="text-3xl font-bold text-[#FF5E0E] text-center mb-8">`);
      push_element($$renderer2, "h2", 98, 6);
      $$renderer2.push(`Our Journey</h2>`);
      pop_element();
      $$renderer2.push(` <div class="absolute left-1/2 -translate-x-px h-full w-0.5 bg-[#FF5E0E]/20">`);
      push_element($$renderer2, "div", 99, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-12">`);
      push_element($$renderer2, "div", 100, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(milestones);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let milestone = each_array[$$index];
        $$renderer2.push(`<div class="relative flex items-center gap-8">`);
        push_element($$renderer2, "div", 102, 10);
        $$renderer2.push(`<div class="w-24 text-right flex-none">`);
        push_element($$renderer2, "div", 103, 12);
        $$renderer2.push(`<span class="text-[#FF5E0E] font-bold">`);
        push_element($$renderer2, "span", 104, 14);
        $$renderer2.push(`${escape_html(milestone.year)}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FF5E0E]">`);
        push_element($$renderer2, "div", 106, 12);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex-1 bg-black/50 p-4 rounded-lg border border-gray-800">`);
        push_element($$renderer2, "div", 107, 12);
        $$renderer2.push(`<p class="text-white">`);
        push_element($$renderer2, "p", 108, 14);
        $$renderer2.push(`${escape_html(milestone.text)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(`</main>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-BIzCZXk-.js.map
