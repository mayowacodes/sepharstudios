import { E as escape_html, m as ensure_array_like, C as attr_class, x as stringify } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { R as ReviewType } from './admin-O9QWk6KR.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(admin)/admin/review/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let reviewQueue = [];
      let selectedType = "all";
      let selectedPriority = "all";
      const filteredQueue = reviewQueue.filter((item) => {
        const priorityMatch = selectedPriority === "all";
        return priorityMatch;
      });
      function getPriorityColor(priority) {
        switch (priority) {
          case "urgent":
            return "bg-red-600 text-white";
          case "high":
            return "bg-yellow-600 text-black";
          case "normal":
            return "bg-blue-600 text-white";
          case "low":
            return "bg-gray-600 text-white";
          default:
            return "bg-gray-600 text-white";
        }
      }
      function getReviewTypeColor(reviewType) {
        switch (reviewType) {
          case ReviewType.THEOLOGICAL:
            return "bg-purple-600 text-white";
          case ReviewType.CONTENT_MODERATION:
            return "bg-green-600 text-white";
          case ReviewType.FAMILY_SAFETY:
            return "bg-pink-600 text-white";
          case ReviewType.TECHNICAL_QA:
            return "bg-blue-600 text-white";
          default:
            return "bg-gray-600 text-white";
        }
      }
      function formatDate(date) {
        return date ? date.toLocaleDateString() : "No due date";
      }
      function getDaysUntilDue(dueDate) {
        if (!dueDate) return null;
        const today = /* @__PURE__ */ new Date();
        const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
        return diff;
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 117, 0);
      $$renderer2.push(`<div class="flex justify-between items-center">`);
      push_element($$renderer2, "div", 119, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 120, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 121, 6);
      $$renderer2.push(`Review Queue</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 122, 6);
      $$renderer2.push(`Content awaiting review and approval</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 126, 4);
      $$renderer2.push(`<div class="bg-red-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 127, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-red-400">`);
      push_element($$renderer2, "div", 128, 8);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.priority === "urgent").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-red-200">`);
      push_element($$renderer2, "div", 129, 8);
      $$renderer2.push(`Urgent</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-yellow-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 131, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 132, 8);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.priority === "high").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-yellow-200">`);
      push_element($$renderer2, "div", 133, 8);
      $$renderer2.push(`High</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-blue-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 135, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 136, 8);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.priority === "normal").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-blue-200">`);
      push_element($$renderer2, "div", 137, 8);
      $$renderer2.push(`Normal</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-gray-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 139, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-gray-400">`);
      push_element($$renderer2, "div", 140, 8);
      $$renderer2.push(`${escape_html(reviewQueue.length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-200">`);
      push_element($$renderer2, "div", 141, 8);
      $$renderer2.push(`Total</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 147, 2);
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      push_element($$renderer2, "div", 148, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 149, 6);
      $$renderer2.push(`<label for="reviewType" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 150, 8);
      $$renderer2.push(`Review Type</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "reviewType",
          value: selectedType,
          class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Types`);
          });
          $$renderer3.option({ value: ReviewType.THEOLOGICAL }, ($$renderer4) => {
            $$renderer4.push(`Theological Review`);
          });
          $$renderer3.option({ value: ReviewType.CONTENT_MODERATION }, ($$renderer4) => {
            $$renderer4.push(`Content Moderation`);
          });
          $$renderer3.option({ value: ReviewType.FAMILY_SAFETY }, ($$renderer4) => {
            $$renderer4.push(`Family Safety`);
          });
          $$renderer3.option({ value: ReviewType.TECHNICAL_QA }, ($$renderer4) => {
            $$renderer4.push(`Technical QA`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 164, 6);
      $$renderer2.push(`<label for="priority" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 165, 8);
      $$renderer2.push(`Priority</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "priority",
          value: selectedPriority,
          class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Priorities`);
          });
          $$renderer3.option({ value: "urgent" }, ($$renderer4) => {
            $$renderer4.push(`Urgent`);
          });
          $$renderer3.option({ value: "high" }, ($$renderer4) => {
            $$renderer4.push(`High`);
          });
          $$renderer3.option({ value: "normal" }, ($$renderer4) => {
            $$renderer4.push(`Normal`);
          });
          $$renderer3.option({ value: "low" }, ($$renderer4) => {
            $$renderer4.push(`Low`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">`);
      push_element($$renderer2, "div", 182, 2);
      $$renderer2.push(`<div class="overflow-x-auto">`);
      push_element($$renderer2, "div", 183, 4);
      $$renderer2.push(`<table class="w-full">`);
      push_element($$renderer2, "table", 184, 6);
      $$renderer2.push(`<thead class="bg-white/10">`);
      push_element($$renderer2, "thead", 185, 8);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 186, 10);
      $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
      push_element($$renderer2, "th", 187, 12);
      $$renderer2.push(`Content</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
      push_element($$renderer2, "th", 188, 12);
      $$renderer2.push(`Creator</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
      push_element($$renderer2, "th", 189, 12);
      $$renderer2.push(`Review Type</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
      push_element($$renderer2, "th", 190, 12);
      $$renderer2.push(`Priority</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
      push_element($$renderer2, "th", 191, 12);
      $$renderer2.push(`Due Date</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
      push_element($$renderer2, "th", 192, 12);
      $$renderer2.push(`Status</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
      push_element($$renderer2, "th", 193, 12);
      $$renderer2.push(`Actions</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody class="divide-y divide-gray-700">`);
      push_element($$renderer2, "tbody", 196, 8);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(filteredQueue);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        const daysUntilDue = getDaysUntilDue(item.dueDate);
        $$renderer2.push(`<tr class="hover:bg-white/5 transition-colors">`);
        push_element($$renderer2, "tr", 199, 12);
        $$renderer2.push(`<td class="px-6 py-4">`);
        push_element($$renderer2, "td", 200, 14);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 201, 16);
        $$renderer2.push(`<div class="font-medium text-white">`);
        push_element($$renderer2, "div", 202, 18);
        $$renderer2.push(`${escape_html(item.title)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-400">`);
        push_element($$renderer2, "div", 203, 18);
        $$renderer2.push(`${escape_html(item.contentType)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</td>`);
        pop_element();
        $$renderer2.push(`<td class="px-6 py-4">`);
        push_element($$renderer2, "td", 206, 14);
        $$renderer2.push(`<div class="text-sm text-white">`);
        push_element($$renderer2, "div", 207, 16);
        $$renderer2.push(`${escape_html(item.creatorName)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-xs text-gray-400">`);
        push_element($$renderer2, "div", 208, 16);
        $$renderer2.push(`Submitted ${escape_html(formatDate(item.submittedAt))}</div>`);
        pop_element();
        $$renderer2.push(`</td>`);
        pop_element();
        $$renderer2.push(`<td class="px-6 py-4">`);
        push_element($$renderer2, "td", 210, 14);
        $$renderer2.push(`<span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getReviewTypeColor(item.reviewType))}`)}>`);
        push_element($$renderer2, "span", 211, 16);
        $$renderer2.push(`${escape_html(item.reviewType.replace("_", " "))}</span>`);
        pop_element();
        $$renderer2.push(`</td>`);
        pop_element();
        $$renderer2.push(`<td class="px-6 py-4">`);
        push_element($$renderer2, "td", 215, 14);
        $$renderer2.push(`<span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getPriorityColor(item.priority))}`)}>`);
        push_element($$renderer2, "span", 216, 16);
        $$renderer2.push(`${escape_html(item.priority.toUpperCase())}</span>`);
        pop_element();
        $$renderer2.push(`</td>`);
        pop_element();
        $$renderer2.push(`<td class="px-6 py-4">`);
        push_element($$renderer2, "td", 220, 14);
        $$renderer2.push(`<div class="text-sm text-white">`);
        push_element($$renderer2, "div", 221, 16);
        $$renderer2.push(`${escape_html(formatDate(item.dueDate))}</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (daysUntilDue !== null) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attr_class(`text-xs ${stringify(daysUntilDue <= 1 ? "text-red-400" : daysUntilDue <= 3 ? "text-yellow-400" : "text-gray-400")}`)}>`);
          push_element($$renderer2, "div", 223, 18);
          $$renderer2.push(`${escape_html(daysUntilDue <= 0 ? "Overdue" : `${daysUntilDue} days left`)}</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="text-xs text-gray-400">`);
          push_element($$renderer2, "div", 227, 18);
          $$renderer2.push(`No deadline</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></td>`);
        pop_element();
        $$renderer2.push(`<td class="px-6 py-4">`);
        push_element($$renderer2, "td", 230, 14);
        if (item.assignedTo) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-sm text-green-400">`);
          push_element($$renderer2, "div", 232, 18);
          $$renderer2.push(`Assigned</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-xs text-gray-400">`);
          push_element($$renderer2, "div", 233, 18);
          $$renderer2.push(`${escape_html(item.assignedTo)}</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="text-sm text-yellow-400">`);
          push_element($$renderer2, "div", 235, 18);
          $$renderer2.push(`Unassigned</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></td>`);
        pop_element();
        $$renderer2.push(`<td class="px-6 py-4">`);
        push_element($$renderer2, "td", 238, 14);
        $$renderer2.push(`<div class="flex space-x-2">`);
        push_element($$renderer2, "div", 239, 16);
        $$renderer2.push(`<button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">`);
        push_element($$renderer2, "button", 240, 18);
        $$renderer2.push(`Review</button>`);
        pop_element();
        $$renderer2.push(` `);
        if (!item.assignedTo) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">`);
          push_element($$renderer2, "button", 247, 20);
          $$renderer2.push(`Assign</button>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></tbody>`);
      pop_element();
      $$renderer2.push(`</table>`);
      pop_element();
      $$renderer2.push(` `);
      if (filteredQueue.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 262, 8);
        $$renderer2.push(`<div class="text-4xl mb-4">`);
        push_element($$renderer2, "div", 263, 10);
        $$renderer2.push(`📋</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-xl text-white mb-2">`);
        push_element($$renderer2, "div", 264, 10);
        $$renderer2.push(`No items in queue</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400">`);
        push_element($$renderer2, "div", 265, 10);
        $$renderer2.push(`No content matches your current filters</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 272, 2);
      $$renderer2.push(`<button class="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">`);
      push_element($$renderer2, "button", 273, 4);
      $$renderer2.push(`<div class="text-2xl mb-2">`);
      push_element($$renderer2, "div", 274, 6);
      $$renderer2.push(`⛪</div>`);
      pop_element();
      $$renderer2.push(` <div class="font-medium">`);
      push_element($$renderer2, "div", 275, 6);
      $$renderer2.push(`Theological Reviews</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm opacity-80">`);
      push_element($$renderer2, "div", 276, 6);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.THEOLOGICAL).length)} pending</div>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(` <button class="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">`);
      push_element($$renderer2, "button", 279, 4);
      $$renderer2.push(`<div class="text-2xl mb-2">`);
      push_element($$renderer2, "div", 280, 6);
      $$renderer2.push(`🛡️</div>`);
      pop_element();
      $$renderer2.push(` <div class="font-medium">`);
      push_element($$renderer2, "div", 281, 6);
      $$renderer2.push(`Content Moderation</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm opacity-80">`);
      push_element($$renderer2, "div", 282, 6);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.CONTENT_MODERATION).length)} pending</div>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(` <button class="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-lg text-center transition-colors">`);
      push_element($$renderer2, "button", 285, 4);
      $$renderer2.push(`<div class="text-2xl mb-2">`);
      push_element($$renderer2, "div", 286, 6);
      $$renderer2.push(`👨‍👩‍👧‍👦</div>`);
      pop_element();
      $$renderer2.push(` <div class="font-medium">`);
      push_element($$renderer2, "div", 287, 6);
      $$renderer2.push(`Family Safety</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm opacity-80">`);
      push_element($$renderer2, "div", 288, 6);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.FAMILY_SAFETY).length)} pending</div>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(` <button class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">`);
      push_element($$renderer2, "button", 291, 4);
      $$renderer2.push(`<div class="text-2xl mb-2">`);
      push_element($$renderer2, "div", 292, 6);
      $$renderer2.push(`🔧</div>`);
      pop_element();
      $$renderer2.push(` <div class="font-medium">`);
      push_element($$renderer2, "div", 293, 6);
      $$renderer2.push(`Technical QA</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm opacity-80">`);
      push_element($$renderer2, "div", 294, 6);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.TECHNICAL_QA).length)} pending</div>`);
      pop_element();
      $$renderer2.push(`</button>`);
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
//# sourceMappingURL=_page.svelte-ChKNbJY7.js.map
