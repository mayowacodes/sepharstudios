import { E as escape_html, m as ensure_array_like, C as attr_class, x as stringify } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(admin)/admin/policies/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let policies = [];
      let selectedCategory = "all";
      const filteredPolicies = policies.filter((policy) => selectedCategory === "all");
      function getCategoryColor(category) {
        switch (category) {
          case "theological":
            return "bg-purple-600 text-white";
          case "family_safety":
            return "bg-pink-600 text-white";
          case "content":
            return "bg-green-600 text-white";
          case "technical":
            return "bg-blue-600 text-white";
          default:
            return "bg-gray-600 text-white";
        }
      }
      function getSeverityColor(severity) {
        switch (severity) {
          case "critical":
            return "bg-red-600 text-white";
          case "high":
            return "bg-orange-600 text-white";
          case "medium":
            return "bg-yellow-600 text-black";
          case "low":
            return "bg-green-600 text-white";
          default:
            return "bg-gray-600 text-white";
        }
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 193, 0);
      $$renderer2.push(`<div class="flex justify-between items-center">`);
      push_element($$renderer2, "div", 195, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 196, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 197, 6);
      $$renderer2.push(`Content Policies</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 198, 6);
      $$renderer2.push(`Manage guidelines and standards for content review</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">`);
      push_element($$renderer2, "button", 201, 4);
      $$renderer2.push(`Create New Policy</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 210, 2);
      $$renderer2.push(`<div class="bg-purple-600/20 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 211, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 212, 6);
      $$renderer2.push(`${escape_html(policies.filter((p) => p.category === "theological").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-purple-200">`);
      push_element($$renderer2, "div", 213, 6);
      $$renderer2.push(`Theological</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-pink-600/20 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 215, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-pink-400">`);
      push_element($$renderer2, "div", 216, 6);
      $$renderer2.push(`${escape_html(policies.filter((p) => p.category === "family_safety").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-pink-200">`);
      push_element($$renderer2, "div", 217, 6);
      $$renderer2.push(`Family Safety</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-green-600/20 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 219, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 220, 6);
      $$renderer2.push(`${escape_html(policies.filter((p) => p.category === "content").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-green-200">`);
      push_element($$renderer2, "div", 221, 6);
      $$renderer2.push(`Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-blue-600/20 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 223, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 224, 6);
      $$renderer2.push(`${escape_html(policies.filter((p) => p.category === "technical").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-blue-200">`);
      push_element($$renderer2, "div", 225, 6);
      $$renderer2.push(`Technical</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 rounded-xl p-6">`);
      push_element($$renderer2, "div", 230, 2);
      $$renderer2.push(`<div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 231, 4);
      $$renderer2.push(`<label for="filterByCategory" class="text-sm font-medium text-white">`);
      push_element($$renderer2, "label", 232, 6);
      $$renderer2.push(`Filter by Category:</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "filterByCategory",
          value: selectedCategory,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Categories`);
          });
          $$renderer3.option({ value: "theological" }, ($$renderer4) => {
            $$renderer4.push(`Theological`);
          });
          $$renderer3.option({ value: "family_safety" }, ($$renderer4) => {
            $$renderer4.push(`Family Safety`);
          });
          $$renderer3.option({ value: "content" }, ($$renderer4) => {
            $$renderer4.push(`Content Moderation`);
          });
          $$renderer3.option({ value: "technical" }, ($$renderer4) => {
            $$renderer4.push(`Technical`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 248, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(filteredPolicies);
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let policy = each_array[$$index_2];
        $$renderer2.push(`<div class="bg-white/10 rounded-xl p-6 space-y-4">`);
        push_element($$renderer2, "div", 250, 6);
        $$renderer2.push(`<div class="flex justify-between items-start">`);
        push_element($$renderer2, "div", 251, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 252, 10);
        $$renderer2.push(`<div class="flex items-center space-x-3 mb-2">`);
        push_element($$renderer2, "div", 253, 12);
        $$renderer2.push(`<h3 class="text-xl font-bold text-white">`);
        push_element($$renderer2, "h3", 254, 14);
        $$renderer2.push(`${escape_html(policy.title)}</h3>`);
        pop_element();
        $$renderer2.push(` <span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getCategoryColor(policy.category))}`)}>`);
        push_element($$renderer2, "span", 255, 14);
        $$renderer2.push(`${escape_html(policy.category.replace("_", " "))}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 text-sm">`);
        push_element($$renderer2, "p", 259, 12);
        $$renderer2.push(`${escape_html(policy.description)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 262, 10);
        $$renderer2.push(`<span${attr_class(`px-2 py-1 text-xs rounded-full ${stringify(getSeverityColor(policy.severity))}`)}>`);
        push_element($$renderer2, "span", 263, 12);
        $$renderer2.push(`${escape_html(policy.severity.toUpperCase())}</span>`);
        pop_element();
        $$renderer2.push(` <button${attr_class(`px-3 py-1 text-xs rounded-full transition-colors ${stringify(policy.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300")}`)}>`);
        push_element($$renderer2, "button", 266, 12);
        $$renderer2.push(`${escape_html(policy.isActive ? "Active" : "Inactive")}</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 276, 8);
        $$renderer2.push(`<h4 class="font-medium text-white mb-2">`);
        push_element($$renderer2, "h4", 277, 10);
        $$renderer2.push(`Requirements</h4>`);
        pop_element();
        $$renderer2.push(` <ul class="text-sm text-green-300 space-y-1">`);
        push_element($$renderer2, "ul", 278, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(policy.requirements.slice(0, 3));
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let requirement = each_array_1[$$index];
          $$renderer2.push(`<li>`);
          push_element($$renderer2, "li", 280, 14);
          $$renderer2.push(`• ${escape_html(requirement)}</li>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--> `);
        if (policy.requirements.length > 3) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<li class="text-gray-400">`);
          push_element($$renderer2, "li", 283, 14);
          $$renderer2.push(`... and ${escape_html(policy.requirements.length - 3)} more</li>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 289, 8);
        $$renderer2.push(`<h4 class="font-medium text-white mb-2">`);
        push_element($$renderer2, "h4", 290, 10);
        $$renderer2.push(`Common Violations</h4>`);
        pop_element();
        $$renderer2.push(` <ul class="text-sm text-red-300 space-y-1">`);
        push_element($$renderer2, "ul", 291, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(policy.violations.slice(0, 2));
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let violation = each_array_2[$$index_1];
          $$renderer2.push(`<li>`);
          push_element($$renderer2, "li", 293, 14);
          $$renderer2.push(`• ${escape_html(violation)}</li>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--> `);
        if (policy.violations.length > 2) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<li class="text-gray-400">`);
          push_element($$renderer2, "li", 296, 14);
          $$renderer2.push(`... and ${escape_html(policy.violations.length - 2)} more</li>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex justify-between items-center pt-4 border-t border-gray-600">`);
        push_element($$renderer2, "div", 302, 8);
        $$renderer2.push(`<div class="text-xs text-gray-400">`);
        push_element($$renderer2, "div", 303, 10);
        $$renderer2.push(`Updated ${escape_html(policy.updatedAt.toLocaleDateString())}</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex space-x-2">`);
        push_element($$renderer2, "div", 306, 10);
        $$renderer2.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">`);
        push_element($$renderer2, "button", 307, 12);
        $$renderer2.push(`Edit</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">`);
        push_element($$renderer2, "button", 313, 12);
        $$renderer2.push(`Archive</button>`);
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
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-XAX6bEHb.js.map
