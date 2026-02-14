import { t as head, E as escape_html, m as ensure_array_like, p as prevent_snippet_stringification } from './index-C14HL8mA.js';
import { C as Card, c as Card_content } from './card-title-C-y0C6UW.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './utils2-C-_3GP94.js';

_page[FILENAME] = "src/routes/(app)/privacy/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const sections = [
        {
          title: "Information We Collect",
          content: [
            {
              subtitle: "Personal Information",
              details: "Name, email address, payment information, and account preferences."
            },
            {
              subtitle: "Usage Data",
              details: "Viewing history, search queries, device information, and interaction with content."
            },
            {
              subtitle: "Technical Data",
              details: "IP address, browser type, device ID, and system information."
            }
          ]
        },
        {
          title: "How We Use Your Information",
          content: [
            {
              subtitle: "Service Provision",
              details: "To provide and maintain our streaming service, process payments, and personalize content recommendations."
            },
            {
              subtitle: "Communication",
              details: "To send service updates, newsletters, and respond to your inquiries."
            },
            {
              subtitle: "Analytics",
              details: "To improve our services, content offerings, and user experience."
            }
          ]
        },
        {
          title: "Data Protection",
          content: [
            {
              subtitle: "Security Measures",
              details: "We implement industry-standard security measures to protect your data."
            },
            {
              subtitle: "Data Retention",
              details: "We retain your data only for as long as necessary to provide our services."
            }
          ]
        },
        {
          title: "Your Rights",
          content: [
            {
              subtitle: "Access and Control",
              details: "You have the right to access, correct, or delete your personal information."
            },
            {
              subtitle: "Cookie Preferences",
              details: "You can manage your cookie preferences through your browser settings."
            }
          ]
        }
      ];
      head("xyq2mm", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Privacy Policy | Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description" content="Learn how Sephar Studios collects, uses, and protects your personal information."/>`);
        push_element($$renderer3, "meta", 70, 2);
        pop_element();
      });
      $$renderer2.push(`<main class="container pt-32 pb-16">`);
      push_element($$renderer2, "main", 73, 0);
      $$renderer2.push(`<section class="space-y-6 pb-24">`);
      push_element($$renderer2, "section", 74, 2);
      $$renderer2.push(`<h1 class="text-4xl font-bold tracking-tight">`);
      push_element($$renderer2, "h1", 75, 4);
      $$renderer2.push(`Privacy Policy</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 76, 4);
      $$renderer2.push(`Last updated: ${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString())}</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 78, 4);
      $$renderer2.push(`At Sephar Studios, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-8">`);
      push_element($$renderer2, "div", 82, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let section = each_array[$$index_1];
        Card($$renderer2, {
          class: "border border-gray-800 bg-background/50",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<h2 class="text-2xl font-semibold mb-4">`);
                push_element($$renderer4, "h2", 86, 12);
                $$renderer4.push(`${escape_html(section.title)}</h2>`);
                pop_element();
                $$renderer4.push(` <div class="space-y-6">`);
                push_element($$renderer4, "div", 87, 12);
                $$renderer4.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(section.content);
                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                  let item = each_array_1[$$index];
                  $$renderer4.push(`<div>`);
                  push_element($$renderer4, "div", 89, 16);
                  $$renderer4.push(`<h3 class="text-lg font-medium mb-2">`);
                  push_element($$renderer4, "h3", 90, 18);
                  $$renderer4.push(`${escape_html(item.subtitle)}</h3>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-muted-foreground">`);
                  push_element($$renderer4, "p", 91, 18);
                  $$renderer4.push(`${escape_html(item.details)}</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="pt-12">`);
      push_element($$renderer2, "div", 100, 4);
      $$renderer2.push(`<h2 class="text-2xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 101, 6);
      $$renderer2.push(`Contact Us</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 102, 6);
      $$renderer2.push(`If you have any questions about our Privacy Policy, please contact us at: <a href="mailto:sepherstudios@gmail.com" class="text-primary hover:underline">`);
      push_element($$renderer2, "a", 104, 8);
      $$renderer2.push(`sepharstudios@gmail.com</a>`);
      pop_element();
      $$renderer2.push(`</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
//# sourceMappingURL=_page.svelte-DqxrJPtl.js.map
