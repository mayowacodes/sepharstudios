import { m as ensure_array_like, C as attr_class, x as stringify, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(creator)/creator/guidelines/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let activeSection = "overview";
      const sections = [
        { id: "overview", title: "Overview", icon: "📋" },
        { id: "content", title: "Content Standards", icon: "🎬" },
        { id: "technical", title: "Technical Requirements", icon: "⚙️" },
        { id: "submission", title: "Submission Process", icon: "📤" },
        { id: "review", title: "Review Process", icon: "👁️" },
        { id: "best-practices", title: "Best Practices", icon: "⭐" }
      ];
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 15, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 17, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 18, 4);
      $$renderer2.push(`Creator Guidelines</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 19, 4);
      $$renderer2.push(`Everything you need to know about creating content for Sephar Studios</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 22, 2);
      $$renderer2.push(`<div class="lg:col-span-1">`);
      push_element($$renderer2, "div", 24, 4);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 sticky top-6">`);
      push_element($$renderer2, "div", 25, 6);
      $$renderer2.push(`<nav class="space-y-2">`);
      push_element($$renderer2, "nav", 26, 8);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let section = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${stringify(activeSection === section.id ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
        push_element($$renderer2, "button", 28, 12);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 32, 14);
        $$renderer2.push(`${escape_html(section.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <span class="text-sm font-medium">`);
        push_element($$renderer2, "span", 33, 14);
        $$renderer2.push(`${escape_html(section.title)}</span>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></nav>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="lg:col-span-3">`);
      push_element($$renderer2, "div", 41, 4);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 42, 6);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-6">`);
        push_element($$renderer2, "div", 44, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 45, 12);
        $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 46, 14);
        $$renderer2.push(`Welcome to Sephar Studios</h2>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 mb-4">`);
        push_element($$renderer2, "p", 47, 14);
        $$renderer2.push(`Sephar Studios is a faith-based streaming platform dedicated to sharing Christian content that inspires, 
                educates, and transforms lives. As a creator, you play a vital role in building a community centered around 
                faith, hope, and love.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">`);
        push_element($$renderer2, "div", 54, 12);
        $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-2 flex items-center">`);
        push_element($$renderer2, "h3", 55, 14);
        $$renderer2.push(`<span class="mr-2">`);
        push_element($$renderer2, "span", 56, 16);
        $$renderer2.push(`🎯</span>`);
        pop_element();
        $$renderer2.push(` Our Mission</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-200">`);
        push_element($$renderer2, "p", 58, 14);
        $$renderer2.push(`To provide a safe, inspiring platform where Christian creators can share their God-given talents 
                and stories to reach hearts worldwide with the message of Jesus Christ.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 64, 12);
        $$renderer2.push(`<h3 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h3", 65, 14);
        $$renderer2.push(`Core Values</h3>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
        push_element($$renderer2, "div", 66, 14);
        $$renderer2.push(`<div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 67, 16);
        $$renderer2.push(`<div class="text-lg font-medium text-white mb-2">`);
        push_element($$renderer2, "div", 68, 18);
        $$renderer2.push(`🙏 Faith-Centered</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 text-sm">`);
        push_element($$renderer2, "p", 69, 18);
        $$renderer2.push(`All content should reflect Christian values and biblical principles.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 71, 16);
        $$renderer2.push(`<div class="text-lg font-medium text-white mb-2">`);
        push_element($$renderer2, "div", 72, 18);
        $$renderer2.push(`👨‍👩‍👧‍👦 Family-Friendly</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 text-sm">`);
        push_element($$renderer2, "p", 73, 18);
        $$renderer2.push(`Content should be appropriate for viewers of all ages in the family.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 75, 16);
        $$renderer2.push(`<div class="text-lg font-medium text-white mb-2">`);
        push_element($$renderer2, "div", 76, 18);
        $$renderer2.push(`⚡ High-Quality</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 text-sm">`);
        push_element($$renderer2, "p", 77, 18);
        $$renderer2.push(`We maintain high standards for both content quality and technical excellence.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 79, 16);
        $$renderer2.push(`<div class="text-lg font-medium text-white mb-2">`);
        push_element($$renderer2, "div", 80, 18);
        $$renderer2.push(`🌍 Global Impact</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 text-sm">`);
        push_element($$renderer2, "p", 81, 18);
        $$renderer2.push(`Content that reaches and transforms lives across cultures and communities.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-sxuaud7b.js.map
