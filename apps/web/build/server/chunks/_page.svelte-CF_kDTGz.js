import { m as ensure_array_like, u as attr, E as escape_html, C as attr_class } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(app)/faq/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const faqs = [
        {
          question: "What is Sephar Studios?",
          answer: "Sephar Studios is a Christian streaming service that offers a wide range of faith-based movies, TV shows, documentaries, and original content to inspire and uplift your spirit."
        },
        {
          question: "How much does Sephar Studios cost?",
          answer: "Sephar Studios offers various subscription plans starting at $9.99 per month. We also offer a free trial for new users to explore our content before committing."
        },
        {
          question: "Can I watch Sephar Studios on multiple devices?",
          answer: "Yes, you can stream Sephar Studios on up to 4 devices simultaneously with a single subscription. Our platform is compatible with smartphones, tablets, smart TVs, and computers."
        },
        {
          question: "Is Sephar Studios available worldwide?",
          answer: "Currently, Sephar Studios is available in select regions. We are working to expand our service to more countries. Please check our website for the latest availability updates."
        },
        {
          question: "How can I cancel my subscription?",
          answer: "You can cancel your subscription at any time by visiting the 'Account' section on our website or app. Your subscription will remain active until the end of the current billing period."
        }
      ];
      let expandedIndex = null;
      $$renderer2.push(`<div class="max-w-3xl mx-auto px-4 py-8">`);
      push_element($$renderer2, "div", 41, 0);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-[#FF5E0E] mb-8 text-center">`);
      push_element($$renderer2, "h1", 42, 2);
      $$renderer2.push(`Frequently Asked Questions</h1>`);
      pop_element();
      $$renderer2.push(` <!--[-->`);
      const each_array = ensure_array_like(faqs);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let faq = each_array[index];
        $$renderer2.push(`<div class="border-b border-[#AF6E4D] last:border-b-0">`);
        push_element($$renderer2, "div", 47, 4);
        $$renderer2.push(`<button class="flex justify-between items-center py-4 w-full text-left cursor-pointer hover:bg-[#FFBF00]/10 transition-colors"${attr("aria-expanded", expandedIndex === index)}>`);
        push_element($$renderer2, "button", 48, 6);
        $$renderer2.push(`<h2 class="text-xl font-semibold text-[#AF6E4D]">`);
        push_element($$renderer2, "h2", 54, 8);
        $$renderer2.push(`${escape_html(faq.question)}</h2>`);
        pop_element();
        $$renderer2.push(` <span${attr_class("text-[#FF5E0E] text-2xl transition-transform", void 0, { "rotate-180": expandedIndex === index })}>`);
        push_element($$renderer2, "span", 57, 8);
        $$renderer2.push(`▼</span>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
        $$renderer2.push(` <div${attr_class("overflow-hidden transition-all duration-300", void 0, {
          "max-h-0": expandedIndex !== index,
          "max-h-96": expandedIndex === index
        })}>`);
        push_element($$renderer2, "div", 64, 6);
        $$renderer2.push(`<p class="text-[#AF6E4D] pb-4">`);
        push_element($$renderer2, "p", 69, 8);
        $$renderer2.push(`${escape_html(faq.answer)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CF_kDTGz.js.map
