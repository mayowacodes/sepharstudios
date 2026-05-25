import { s as spread_props, p as prevent_snippet_stringification, F as FILENAME, f as bind_props, N as Accordion$1, O as Accordion_content$1, j as attr_class, d as clsx, a as push_element, b as pop_element, P as Accordion_item$1, Q as Accordion_header, T as Accordion_trigger$1, o as head, i as ensure_array_like, e as escape_html, q as store_set, w as writable, k as store_get, u as unsubscribe_stores } from "../../../../chunks/ui-libs.js";
import { C as Card, c as Card_content } from "../../../../chunks/card-title.js";
import "clsx";
import { I as Input } from "../../../../chunks/input.js";
import { T as Textarea } from "../../../../chunks/textarea.js";
import { B as Button } from "../../../../chunks/button.js";
import { c as cn } from "../../../../chunks/utils2.js";
import { C as Chevron_down } from "../../../../chunks/chevron-down.js";
import { S as Search } from "../../../../chunks/search.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { C as Circle_question_mark } from "../../../../chunks/circle-question-mark.js";
import { I as Icon } from "../../../../chunks/Icon.js";
Message_circle[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/message-circle.svelte";
function Message_circle($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "message-circle" },
        /**
         * @component @name MessageCircle
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi45OTIgMTYuMzQyYTIgMiAwIDAgMSAuMDk0IDEuMTY3bC0xLjA2NSAzLjI5YTEgMSAwIDAgMCAxLjIzNiAxLjE2OGwzLjQxMy0uOTk4YTIgMiAwIDAgMSAxLjA5OS4wOTIgMTAgMTAgMCAxIDAtNC43NzctNC43MTkiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/message-circle
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
    Message_circle
  );
}
Message_circle.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Accordion[FILENAME] = "src/lib/components/ui/accordion/accordion.svelte";
function Accordion($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { ref = null, value = void 0, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Accordion$1($$renderer3, spread_props([
          { "data-slot": "accordion" },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref, value });
    },
    Accordion
  );
}
Accordion.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Accordion_content[FILENAME] = "src/lib/components/ui/accordion/accordion-content.svelte";
function Accordion_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Accordion_content$1($$renderer3, spread_props([
          {
            "data-slot": "accordion-content",
            class: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div${attr_class(clsx(cn("pt-0 pb-4", className)))}>`);
              push_element($$renderer4, "div", 19, 1);
              children?.($$renderer4);
              $$renderer4.push(`<!----></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Accordion_content
  );
}
Accordion_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Accordion_item[FILENAME] = "src/lib/components/ui/accordion/accordion-item.svelte";
function Accordion_item($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Accordion_item$1($$renderer3, spread_props([
          {
            "data-slot": "accordion-item",
            class: cn("border-b last:border-b-0", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Accordion_item
  );
}
Accordion_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Accordion_trigger[FILENAME] = "src/lib/components/ui/accordion/accordion-trigger.svelte";
function Accordion_trigger($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        level = 3,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Accordion_header($$renderer3, {
          level,
          class: "flex",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->`);
            Accordion_trigger$1($$renderer4, spread_props([
              {
                "data-slot": "accordion-trigger",
                class: cn("focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180", className)
              },
              restProps,
              {
                get ref() {
                  return ref;
                },
                set ref($$value) {
                  ref = $$value;
                  $$settled = false;
                },
                children: prevent_snippet_stringification(($$renderer5) => {
                  children?.($$renderer5);
                  $$renderer5.push(`<!----> `);
                  Chevron_down($$renderer5, {
                    class: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              }
            ]));
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Accordion_trigger
  );
}
Accordion_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/help/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let filteredFaqs;
      const activeAccordion = writable(void 0);
      const faqs = [
        {
          category: "Account & Billing",
          items: [
            {
              question: "How do I create an account?",
              answer: "You can create an account by clicking the 'Sign Up' button on the top right of our homepage. Follow the prompts to enter your information and choose a subscription plan."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We process payments securely through Paystack using major credit and debit cards."
            },
            {
              question: "How do I cancel my subscription?",
              answer: "You can cancel your subscription at any time through your account settings. Navigate to 'Subscription' and click 'Cancel Subscription'."
            },
            {
              question: "What is your PPV refund policy?",
              answer: "PPV purchases are non-refundable after playback starts. If playback never starts because of a verified platform issue, contact support within 48 hours for review."
            }
          ]
        },
        {
          category: "Content & Playback",
          items: [
            {
              question: "What devices can I watch on?",
              answer: "You can watch on your computer, smartphone, tablet, smart TV, and other streaming devices."
            },
            {
              question: "Can I download content to watch offline?",
              answer: "Yes, premium subscribers can download content for offline viewing on mobile devices."
            },
            {
              question: "How do I report inappropriate content?",
              answer: "Use the 'Report' button on any video player to flag inappropriate content. Our team will review it promptly."
            }
          ]
        },
        {
          category: "Technical Support",
          items: [
            {
              question: "What internet speed do I need?",
              answer: "We recommend at least 5 Mbps for HD streaming and 15 Mbps for 4K content."
            },
            {
              question: "How do I fix buffering issues?",
              answer: "Try clearing your browser cache, checking your internet connection, or lowering the video quality."
            }
          ]
        }
      ];
      let searchQuery = "";
      let contactForm = { name: "", email: "", subject: "", message: "" };
      filteredFaqs = faqs.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter((category) => category.items.length > 0);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        head("l9h94x", $$renderer3, ($$renderer4) => {
          $$renderer4.title(($$renderer5) => {
            $$renderer5.push(`<title>Help Center | Sephar Studios</title>`);
          });
          $$renderer4.push(`<meta name="description" content="Get help and support for your Sephar Studios experience. Find answers to common questions and contact our support team."/>`);
          push_element($$renderer4, "meta", 100, 2);
          pop_element();
        });
        $$renderer3.push(`<main class="container mx-auto px-4 pt-32 pb-16">`);
        push_element($$renderer3, "main", 103, 0);
        $$renderer3.push(`<section class="text-center space-y-6 pb-24">`);
        push_element($$renderer3, "section", 104, 2);
        $$renderer3.push(`<h1 class="text-4xl sm:text-6xl font-bold tracking-tight">`);
        push_element($$renderer3, "h1", 105, 4);
        $$renderer3.push(`How Can We Help?</h1>`);
        pop_element();
        $$renderer3.push(` <p class="text-xl text-muted-foreground max-w-2xl mx-auto">`);
        push_element($$renderer3, "p", 108, 4);
        $$renderer3.push(`Find answers to common questions or contact our support team.</p>`);
        pop_element();
        $$renderer3.push(` <div class="relative max-w-xl mx-auto">`);
        push_element($$renderer3, "div", 111, 4);
        Search($$renderer3, {
          class: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5"
        });
        $$renderer3.push(`<!----> `);
        Input($$renderer3, {
          type: "search",
          placeholder: "Search for answers...",
          class: "pl-10",
          get value() {
            return searchQuery;
          },
          set value($$value) {
            searchQuery = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</section>`);
        pop_element();
        $$renderer3.push(` <section class="grid md:grid-cols-3 gap-8 pb-24">`);
        push_element($$renderer3, "section", 117, 2);
        Card($$renderer3, {
          class: "bg-background border",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_content($$renderer4, {
              class: "p-6 text-center space-y-4",
              children: prevent_snippet_stringification(($$renderer5) => {
                Mail($$renderer5, { class: "mx-auto h-12 w-12 text-primary" });
                $$renderer5.push(`<!----> <h3 class="text-xl font-semibold">`);
                push_element($$renderer5, "h3", 121, 8);
                $$renderer5.push(`Email Support</h3>`);
                pop_element();
                $$renderer5.push(` <p class="text-muted-foreground">`);
                push_element($$renderer5, "p", 122, 8);
                $$renderer5.push(`Get in touch with our support team via email.</p>`);
                pop_element();
                $$renderer5.push(` <a href="mailto:support@sepharstudios.com" class="text-primary hover:underline">`);
                push_element($$renderer5, "a", 123, 8);
                $$renderer5.push(`support@sepharstudios.com</a>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          class: "bg-background border",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_content($$renderer4, {
              class: "p-6 text-center space-y-4",
              children: prevent_snippet_stringification(($$renderer5) => {
                Circle_question_mark($$renderer5, { class: "mx-auto h-12 w-12 text-secondary" });
                $$renderer5.push(`<!----> <h3 class="text-xl font-semibold">`);
                push_element($$renderer5, "h3", 132, 8);
                $$renderer5.push(`FAQs</h3>`);
                pop_element();
                $$renderer5.push(` <p class="text-muted-foreground">`);
                push_element($$renderer5, "p", 133, 8);
                $$renderer5.push(`Find answers to commonly asked questions.</p>`);
                pop_element();
                $$renderer5.push(` `);
                Button($$renderer5, {
                  variant: "outline",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Browse FAQs`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          class: "bg-background border",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_content($$renderer4, {
              class: "p-6 text-center space-y-4",
              children: prevent_snippet_stringification(($$renderer5) => {
                Message_circle($$renderer5, { class: "mx-auto h-12 w-12 text-accent" });
                $$renderer5.push(`<!----> <h3 class="text-xl font-semibold">`);
                push_element($$renderer5, "h3", 141, 8);
                $$renderer5.push(`Contact Us</h3>`);
                pop_element();
                $$renderer5.push(` <p class="text-muted-foreground">`);
                push_element($$renderer5, "p", 142, 8);
                $$renderer5.push(`Send us a message and we'll get back to you.</p>`);
                pop_element();
                $$renderer5.push(` `);
                Button($$renderer5, {
                  variant: "outline",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Contact Support`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></section>`);
        pop_element();
        $$renderer3.push(` <section class="text-center pb-24">`);
        push_element($$renderer3, "section", 148, 2);
        $$renderer3.push(`<h2 class="text-3xl font-bold mb-6">`);
        push_element($$renderer3, "h2", 149, 4);
        $$renderer3.push(`Frequently Asked Questions</h2>`);
        pop_element();
        $$renderer3.push(` `);
        if (filteredFaqs.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(filteredFaqs);
          for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
            let category = each_array[$$index_1];
            $$renderer3.push(`<div class="mb-8">`);
            push_element($$renderer3, "div", 152, 8);
            $$renderer3.push(`<h3 class="text-xl font-semibold mb-4">`);
            push_element($$renderer3, "h3", 153, 10);
            $$renderer3.push(`${escape_html(category.category)}</h3>`);
            pop_element();
            $$renderer3.push(` `);
            Accordion($$renderer3, {
              type: "single",
              get value() {
                return store_get($$store_subs ??= {}, "$activeAccordion", activeAccordion);
              },
              set value($$value) {
                store_set(activeAccordion, $$value);
                $$settled = false;
              },
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(category.items);
                for (let i = 0, $$length2 = each_array_1.length; i < $$length2; i++) {
                  let item = each_array_1[i];
                  Accordion_item($$renderer4, {
                    value: `${category.category}-${i}`,
                    children: prevent_snippet_stringification(($$renderer5) => {
                      Accordion_trigger($$renderer5, {
                        children: prevent_snippet_stringification(($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(item.question)}`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> `);
                      Accordion_content($$renderer5, {
                        children: prevent_snippet_stringification(($$renderer6) => {
                          $$renderer6.push(`<p class="text-muted-foreground">`);
                          push_element($$renderer6, "p", 159, 18);
                          $$renderer6.push(`${escape_html(item.answer)}</p>`);
                          pop_element();
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!---->`);
                    }),
                    $$slots: { default: true }
                  });
                }
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div>`);
            pop_element();
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<p class="text-center text-muted-foreground">`);
          push_element($$renderer3, "p", 167, 6);
          $$renderer3.push(`No results found for "${escape_html(searchQuery)}". Try a different search term.</p>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--></section>`);
        pop_element();
        $$renderer3.push(` <section>`);
        push_element($$renderer3, "section", 173, 2);
        $$renderer3.push(`<h2 class="text-center text-3xl font-bold mb-6">`);
        push_element($$renderer3, "h2", 174, 4);
        $$renderer3.push(`Contact Support</h2>`);
        pop_element();
        $$renderer3.push(` `);
        Card($$renderer3, {
          class: "max-w-3xl mx-auto bg-background border",
          children: prevent_snippet_stringification(($$renderer4) => {
            Card_content($$renderer4, {
              class: "p-6",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<form class="space-y-4">`);
                push_element($$renderer5, "form", 177, 8);
                $$renderer5.push(`<div class="grid sm:grid-cols-2 gap-4">`);
                push_element($$renderer5, "div", 178, 10);
                Input($$renderer5, {
                  placeholder: "Name",
                  required: true,
                  get value() {
                    return contactForm.name;
                  },
                  set value($$value) {
                    contactForm.name = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "email",
                  placeholder: "Email",
                  required: true,
                  get value() {
                    return contactForm.email;
                  },
                  set value($$value) {
                    contactForm.email = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  placeholder: "Subject",
                  required: true,
                  get value() {
                    return contactForm.subject;
                  },
                  set value($$value) {
                    contactForm.subject = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                Textarea($$renderer5, {
                  placeholder: "Message",
                  rows: 6,
                  required: true,
                  get value() {
                    return contactForm.message;
                  },
                  set value($$value) {
                    contactForm.message = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  type: "submit",
                  class: "w-full",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Send Message`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></form>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></section>`);
        pop_element();
        $$renderer3.push(`</main>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
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
