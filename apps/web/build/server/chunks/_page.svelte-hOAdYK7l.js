import { h as head, b as push_element, d as pop_element, l as escape_html, e as ensure_array_like, p as prevent_snippet_stringification, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { C as Card, c as Card_content } from './card-title-Bb6tCQUO.js';
import './button-C1v8XzqW.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';

_page[FILENAME] = "src/routes/(app)/terms/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const sections = [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing and using Sephar Studios, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`
        },
        {
          title: "2. User Accounts",
          content: `You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.`
        },
        {
          title: "3. Subscription Services",
          content: `Various subscription plans are available. Payment terms and conditions apply. Cancellation policies and refund terms are subject to the specific subscription plan.`
        },
        {
          title: "4. Content Usage",
          content: `Content on Sephar Studios is for personal, non-commercial use only. You may not download, copy, reproduce, distribute, or modify content without explicit permission.`
        },
        {
          title: "5. Faith-Based Guidelines",
          content: `All content must align with Christian teachings and values. We reserve the right to remove content that contradicts these principles.`
        },
        {
          title: "6. User Conduct",
          content: `Users must engage respectfully and constructively. Harassment, hate speech, or disruptive behavior will not be tolerated.`
        },
        {
          title: "7. Privacy",
          content: `Your privacy is important. Our Privacy Policy details how we collect, use, and protect your information.`
        },
        {
          title: "8. Content Moderation",
          content: `We reserve the right to moderate, edit, or remove content that violates our guidelines or terms of service.`
        },
        {
          title: "9. Intellectual Property",
          content: `All content on Sephar Studios is protected by copyright and other intellectual property rights.`
        },
        {
          title: "10. Termination",
          content: `We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion.`
        },
        {
          title: "11. Pay-Per-View (PPV) Purchases & Refunds",
          content: `PPV purchases are one-time payments that unlock access to the specific title. PPV purchases are non-refundable once playback has started. If playback never starts due to a verified platform-side failure, you may request a refund within 48 hours of purchase. Approved refunds are returned to the original Paystack payment method.`
        }
      ];
      head("e48t45", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Terms of Service | Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description" content="Read our Terms of Service to understand your rights and responsibilities when using Sephar Studios."/>`);
        push_element($$renderer3, "meta", 55, 2);
        pop_element();
      });
      $$renderer2.push(`<main class="container mx-auto px-4 pt-32 pb-16">`);
      push_element($$renderer2, "main", 58, 0);
      $$renderer2.push(`<section class="space-y-6 pb-24">`);
      push_element($$renderer2, "section", 59, 2);
      $$renderer2.push(`<h1 class="text-4xl font-bold tracking-tight">`);
      push_element($$renderer2, "h1", 60, 4);
      $$renderer2.push(`Terms of Service</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 61, 4);
      $$renderer2.push(`Last updated: ${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString())}</p>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-8">`);
      push_element($$renderer2, "div", 63, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let section = each_array[$$index];
        Card($$renderer2, {
          class: "border border-gray-800 bg-background/50",
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<h2 class="text-2xl font-semibold mb-4">`);
                push_element($$renderer4, "h2", 67, 12);
                $$renderer4.push(`${escape_html(section.title)}</h2>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground">`);
                push_element($$renderer4, "p", 68, 12);
                $$renderer4.push(`${escape_html(section.content)}</p>`);
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
      push_element($$renderer2, "div", 74, 4);
      $$renderer2.push(`<h2 class="text-2xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 75, 6);
      $$renderer2.push(`Contact Us</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 76, 6);
      $$renderer2.push(`If you have any questions about these Terms of Service, please contact us at: <a href="mailto:info@sepharstudios.com" class="text-primary hover:underline">`);
      push_element($$renderer2, "a", 78, 8);
      $$renderer2.push(`info@sepharstudios.com</a>`);
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
//# sourceMappingURL=_page.svelte-hOAdYK7l.js.map
