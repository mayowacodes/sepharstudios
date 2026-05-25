import { j as store_get, h as head, b as push_element, d as pop_element, p as prevent_snippet_stringification, g as attr, e as ensure_array_like, l as escape_html, u as unsubscribe_stores, F as FILENAME, x as writable } from './ui-libs-Yf6h8PPk.js';
import { C as Card, c as Card_content } from './card-title-Bb6tCQUO.js';
import { B as Button } from './button-C1v8XzqW.js';
import { C as Circle_play } from './circle-play-B9b5K8IA.js';
import { C as Check } from './check-BU5QHt2h.js';
import { X } from './x-Cylf_7jQ.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './Icon-DVHDtCfs.js';

_page[FILENAME] = "src/routes/(app)/guidelines/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let filteredGuidelines;
      const searchQuery = writable("");
      const guidelines = [
        {
          title: "Faith-Based Content",
          allowed: [
            "Content aligned with Christian teachings and values",
            "Biblical stories and adaptations",
            "Faith-promoting messages",
            "Family-friendly content",
            "Educational Christian material"
          ],
          prohibited: [
            "Content contradicting Christian beliefs",
            "Anti-religious messaging",
            "Explicit or adult content",
            "Violence or gore",
            "Inappropriate language"
          ]
        },
        {
          title: "Technical Requirements",
          allowed: [
            "High-definition video (1080p minimum)",
            "Clear audio quality",
            "Professional editing",
            "Proper lighting and composition",
            "Subtitles and closed captions"
          ],
          prohibited: [
            "Poor video quality",
            "Distorted audio",
            "Unstable footage",
            "Missing subtitles",
            "Improper aspect ratios"
          ]
        },
        {
          title: "Content Categories",
          allowed: [
            "Christian films and series",
            "Biblical documentaries",
            "Worship content",
            "Educational programs",
            "Family entertainment"
          ],
          prohibited: [
            "Non-Christian religious content",
            "Secular entertainment",
            "Political content",
            "Controversial topics",
            "Divisive messaging"
          ]
        }
      ];
      filteredGuidelines = guidelines.map((section) => ({
        ...section,
        allowed: section.allowed.filter((item) => item.toLowerCase().includes(store_get($$store_subs ??= {}, "$searchQuery", searchQuery).toLowerCase())),
        prohibited: section.prohibited.filter((item) => item.toLowerCase().includes(store_get($$store_subs ??= {}, "$searchQuery", searchQuery).toLowerCase()))
      }));
      head("lvikix", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Content Guidelines | Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description" content="Learn about our content guidelines and standards for faith-based content on Sephar Studios."/>`);
        push_element($$renderer3, "meta", 72, 2);
        pop_element();
      });
      $$renderer2.push(`<main class="container mx-auto px-4 pt-32 pb-16">`);
      push_element($$renderer2, "main", 75, 0);
      $$renderer2.push(`<section class="text-center space-y-6 pb-24">`);
      push_element($$renderer2, "section", 76, 2);
      $$renderer2.push(`<h1 class="text-4xl sm:text-6xl font-bold tracking-tight">`);
      push_element($$renderer2, "h1", 77, 4);
      $$renderer2.push(`Faith-Based Entertainment <br/>`);
      push_element($$renderer2, "br", 79, 6);
      pop_element();
      $$renderer2.push(` For The Whole Family</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-muted-foreground max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 82, 4);
      $$renderer2.push(`Stream thousands of faith-inspiring movies, shows, and documentaries. Start your free trial today.</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-center gap-4">`);
      push_element($$renderer2, "div", 85, 4);
      Button($$renderer2, {
        size: "lg",
        href: "/sign-up",
        class: "bg-primary hover:bg-primary/90",
        children: prevent_snippet_stringification(($$renderer3) => {
          Circle_play($$renderer3, { class: "mr-2 h-5 w-5" });
          $$renderer3.push(`<!----> Start Watching`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        size: "lg",
        variant: "outline",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Learn More`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section class="text-center space-y-6 pb-24">`);
      push_element($$renderer2, "section", 94, 2);
      $$renderer2.push(`<h1 class="text-4xl sm:text-6xl font-bold tracking-tight">`);
      push_element($$renderer2, "h1", 95, 4);
      $$renderer2.push(`Content Guidelines</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-muted-foreground max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 98, 4);
      $$renderer2.push(`Our content guidelines ensure alignment with our mission to provide quality, faith-based entertainment.</p>`);
      pop_element();
      $$renderer2.push(` <input type="text" placeholder="Search guidelines..."${attr("value", store_get($$store_subs ??= {}, "$searchQuery", searchQuery))} class="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-primary focus:border-primary"/>`);
      push_element($$renderer2, "input", 101, 4);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <section class="text-center space-y-8">`);
      push_element($$renderer2, "section", 109, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(filteredGuidelines);
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let section = each_array[$$index_2];
        if (section.allowed.length || section.prohibited.length) {
          $$renderer2.push("<!--[-->");
          Card($$renderer2, {
            class: "border border-gray-200",
            children: prevent_snippet_stringification(($$renderer3) => {
              Card_content($$renderer3, {
                class: "p-6 space-y-4",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<h2 class="text-center text-2xl font-bold">`);
                  push_element($$renderer4, "h2", 114, 12);
                  $$renderer4.push(`${escape_html(section.title)}</h2>`);
                  pop_element();
                  $$renderer4.push(` <div class="grid md:grid-cols-2 gap-6">`);
                  push_element($$renderer4, "div", 115, 12);
                  if (section.allowed.length) {
                    $$renderer4.push("<!--[-->");
                    $$renderer4.push(`<div>`);
                    push_element($$renderer4, "div", 117, 16);
                    $$renderer4.push(`<h3 class="text-lg font-semibold text-green-600 flex items-center gap-2">`);
                    push_element($$renderer4, "h3", 118, 18);
                    Check($$renderer4, { class: "w-5 h-5" });
                    $$renderer4.push(`<!----> Allowed</h3>`);
                    pop_element();
                    $$renderer4.push(` <ul class="list-disc list-inside text-muted-foreground">`);
                    push_element($$renderer4, "ul", 121, 18);
                    $$renderer4.push(`<!--[-->`);
                    const each_array_1 = ensure_array_like(section.allowed);
                    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                      let item = each_array_1[$$index];
                      $$renderer4.push(`<li>`);
                      push_element($$renderer4, "li", 123, 22);
                      $$renderer4.push(`${escape_html(item)}</li>`);
                      pop_element();
                    }
                    $$renderer4.push(`<!--]--></ul>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]--> `);
                  if (section.prohibited.length) {
                    $$renderer4.push("<!--[-->");
                    $$renderer4.push(`<div>`);
                    push_element($$renderer4, "div", 129, 16);
                    $$renderer4.push(`<h3 class="text-lg font-semibold text-center text-red-600 flex items-center gap-2">`);
                    push_element($$renderer4, "h3", 130, 18);
                    X($$renderer4, { class: "w-5 h-5" });
                    $$renderer4.push(`<!----> Prohibited</h3>`);
                    pop_element();
                    $$renderer4.push(` <ul class="list-disc list-inside text-muted-foreground">`);
                    push_element($$renderer4, "ul", 133, 18);
                    $$renderer4.push(`<!--[-->`);
                    const each_array_2 = ensure_array_like(section.prohibited);
                    for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                      let item = each_array_2[$$index_1];
                      $$renderer4.push(`<li>`);
                      push_element($$renderer4, "li", 135, 22);
                      $$renderer4.push(`${escape_html(item)}</li>`);
                      pop_element();
                    }
                    $$renderer4.push(`<!--]--></ul>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]--></div>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></section>`);
      pop_element();
      $$renderer2.push(`</main>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-B9hn7eDN.js.map
