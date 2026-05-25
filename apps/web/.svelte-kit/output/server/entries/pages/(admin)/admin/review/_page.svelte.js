import { a as push_element, b as pop_element, e as escape_html, j as attr_class, i as ensure_array_like, l as stringify, F as FILENAME } from "../../../../../chunks/ui-libs.js";
import { R as ReviewType } from "../../../../../chunks/admin.js";
_page[FILENAME] = "src/routes/(admin)/admin/review/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let reviewQueue = [];
      let selectedType = "all";
      let selectedPriority = "all";
      let userReviews = [];
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
      push_element($$renderer2, "div", 130, 0);
      $$renderer2.push(`<div class="flex justify-between items-center">`);
      push_element($$renderer2, "div", 132, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 133, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 134, 6);
      $$renderer2.push(`Review Queue</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 135, 6);
      $$renderer2.push(`Content and user reviews awaiting moderation</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 139, 4);
      $$renderer2.push(`<div class="bg-red-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 140, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-red-400">`);
      push_element($$renderer2, "div", 141, 8);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.priority === "urgent").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-red-200">`);
      push_element($$renderer2, "div", 142, 8);
      $$renderer2.push(`Urgent</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-yellow-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 144, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 145, 8);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.priority === "high").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-yellow-200">`);
      push_element($$renderer2, "div", 146, 8);
      $$renderer2.push(`High</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-blue-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 148, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 149, 8);
      $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.priority === "normal").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-blue-200">`);
      push_element($$renderer2, "div", 150, 8);
      $$renderer2.push(`Normal</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-gray-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 152, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-gray-400">`);
      push_element($$renderer2, "div", 153, 8);
      $$renderer2.push(`${escape_html(reviewQueue.length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-200">`);
      push_element($$renderer2, "div", 154, 8);
      $$renderer2.push(`Total</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex gap-2 border-b border-white/10 pb-0">`);
      push_element($$renderer2, "div", 160, 2);
      $$renderer2.push(`<button${attr_class(`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${stringify(
        "bg-white/10 text-white"
      )}`)}>`);
      push_element($$renderer2, "button", 161, 4);
      $$renderer2.push(`Content Queue (${escape_html(reviewQueue.length)})</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${stringify("text-gray-400 hover:text-white")}`)}>`);
      push_element($$renderer2, "button", 167, 4);
      $$renderer2.push(`User Reviews (${escape_html(userReviews.filter((r) => !r.isApproved).length)} pending)</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 225, 2);
        $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
        push_element($$renderer2, "div", 226, 4);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 227, 6);
        $$renderer2.push(`<label for="reviewType" class="block text-sm font-medium text-white mb-2">`);
        push_element($$renderer2, "label", 228, 8);
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
        push_element($$renderer2, "div", 242, 6);
        $$renderer2.push(`<label for="priority" class="block text-sm font-medium text-white mb-2">`);
        push_element($$renderer2, "label", 243, 8);
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
        push_element($$renderer2, "div", 260, 2);
        $$renderer2.push(`<div class="overflow-x-auto">`);
        push_element($$renderer2, "div", 261, 4);
        $$renderer2.push(`<table class="w-full">`);
        push_element($$renderer2, "table", 262, 6);
        $$renderer2.push(`<thead class="bg-white/10">`);
        push_element($$renderer2, "thead", 263, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 264, 10);
        $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
        push_element($$renderer2, "th", 265, 12);
        $$renderer2.push(`Content</th>`);
        pop_element();
        $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
        push_element($$renderer2, "th", 266, 12);
        $$renderer2.push(`Creator</th>`);
        pop_element();
        $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
        push_element($$renderer2, "th", 267, 12);
        $$renderer2.push(`Review Type</th>`);
        pop_element();
        $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
        push_element($$renderer2, "th", 268, 12);
        $$renderer2.push(`Priority</th>`);
        pop_element();
        $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
        push_element($$renderer2, "th", 269, 12);
        $$renderer2.push(`Due Date</th>`);
        pop_element();
        $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
        push_element($$renderer2, "th", 270, 12);
        $$renderer2.push(`Status</th>`);
        pop_element();
        $$renderer2.push(`<th class="px-6 py-4 text-left text-sm font-medium text-white">`);
        push_element($$renderer2, "th", 271, 12);
        $$renderer2.push(`Actions</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody class="divide-y divide-gray-700">`);
        push_element($$renderer2, "tbody", 274, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(filteredQueue);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let item = each_array_1[$$index_1];
          const daysUntilDue = getDaysUntilDue(item.dueDate);
          $$renderer2.push(`<tr class="hover:bg-white/5 transition-colors">`);
          push_element($$renderer2, "tr", 277, 12);
          $$renderer2.push(`<td class="px-6 py-4">`);
          push_element($$renderer2, "td", 278, 14);
          $$renderer2.push(`<div>`);
          push_element($$renderer2, "div", 279, 16);
          $$renderer2.push(`<div class="font-medium text-white">`);
          push_element($$renderer2, "div", 280, 18);
          $$renderer2.push(`${escape_html(item.title)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-sm text-gray-400">`);
          push_element($$renderer2, "div", 281, 18);
          $$renderer2.push(`${escape_html(item.contentType)}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-6 py-4">`);
          push_element($$renderer2, "td", 284, 14);
          $$renderer2.push(`<div class="text-sm text-white">`);
          push_element($$renderer2, "div", 285, 16);
          $$renderer2.push(`${escape_html(item.creatorName)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-xs text-gray-400">`);
          push_element($$renderer2, "div", 286, 16);
          $$renderer2.push(`Submitted ${escape_html(formatDate(item.submittedAt))}</div>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-6 py-4">`);
          push_element($$renderer2, "td", 288, 14);
          $$renderer2.push(`<span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getReviewTypeColor(item.reviewType))}`)}>`);
          push_element($$renderer2, "span", 289, 16);
          $$renderer2.push(`${escape_html(item.reviewType.replace("_", " "))}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-6 py-4">`);
          push_element($$renderer2, "td", 293, 14);
          $$renderer2.push(`<span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getPriorityColor(item.priority))}`)}>`);
          push_element($$renderer2, "span", 294, 16);
          $$renderer2.push(`${escape_html(item.priority.toUpperCase())}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-6 py-4">`);
          push_element($$renderer2, "td", 298, 14);
          $$renderer2.push(`<div class="text-sm text-white">`);
          push_element($$renderer2, "div", 299, 16);
          $$renderer2.push(`${escape_html(formatDate(item.dueDate))}</div>`);
          pop_element();
          $$renderer2.push(` `);
          if (daysUntilDue !== null) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div${attr_class(`text-xs ${stringify(daysUntilDue <= 1 ? "text-red-400" : daysUntilDue <= 3 ? "text-yellow-400" : "text-gray-400")}`)}>`);
            push_element($$renderer2, "div", 301, 18);
            $$renderer2.push(`${escape_html(daysUntilDue <= 0 ? "Overdue" : `${daysUntilDue} days left`)}</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="text-xs text-gray-400">`);
            push_element($$renderer2, "div", 305, 18);
            $$renderer2.push(`No deadline</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></td>`);
          pop_element();
          $$renderer2.push(`<td class="px-6 py-4">`);
          push_element($$renderer2, "td", 308, 14);
          if (item.assignedTo) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="text-sm text-green-400">`);
            push_element($$renderer2, "div", 310, 18);
            $$renderer2.push(`Assigned</div>`);
            pop_element();
            $$renderer2.push(` <div class="text-xs text-gray-400">`);
            push_element($$renderer2, "div", 311, 18);
            $$renderer2.push(`${escape_html(item.assignedTo)}</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="text-sm text-yellow-400">`);
            push_element($$renderer2, "div", 313, 18);
            $$renderer2.push(`Unassigned</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></td>`);
          pop_element();
          $$renderer2.push(`<td class="px-6 py-4">`);
          push_element($$renderer2, "td", 316, 14);
          $$renderer2.push(`<div class="flex space-x-2">`);
          push_element($$renderer2, "div", 317, 16);
          $$renderer2.push(`<button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">`);
          push_element($$renderer2, "button", 318, 18);
          $$renderer2.push(`Review</button>`);
          pop_element();
          $$renderer2.push(` `);
          if (!item.assignedTo) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">`);
            push_element($$renderer2, "button", 325, 20);
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
          push_element($$renderer2, "div", 340, 8);
          $$renderer2.push(`<div class="text-4xl mb-4">`);
          push_element($$renderer2, "div", 341, 10);
          $$renderer2.push(`📋</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-xl text-white mb-2">`);
          push_element($$renderer2, "div", 342, 10);
          $$renderer2.push(`No items in queue</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400">`);
          push_element($$renderer2, "div", 343, 10);
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
        push_element($$renderer2, "div", 350, 2);
        $$renderer2.push(`<button class="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">`);
        push_element($$renderer2, "button", 351, 4);
        $$renderer2.push(`<div class="text-2xl mb-2">`);
        push_element($$renderer2, "div", 352, 6);
        $$renderer2.push(`⛪</div>`);
        pop_element();
        $$renderer2.push(` <div class="font-medium">`);
        push_element($$renderer2, "div", 353, 6);
        $$renderer2.push(`Theological Reviews</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm opacity-80">`);
        push_element($$renderer2, "div", 354, 6);
        $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.THEOLOGICAL).length)} pending</div>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">`);
        push_element($$renderer2, "button", 357, 4);
        $$renderer2.push(`<div class="text-2xl mb-2">`);
        push_element($$renderer2, "div", 358, 6);
        $$renderer2.push(`🛡️</div>`);
        pop_element();
        $$renderer2.push(` <div class="font-medium">`);
        push_element($$renderer2, "div", 359, 6);
        $$renderer2.push(`Content Moderation</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm opacity-80">`);
        push_element($$renderer2, "div", 360, 6);
        $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.CONTENT_MODERATION).length)} pending</div>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-lg text-center transition-colors">`);
        push_element($$renderer2, "button", 363, 4);
        $$renderer2.push(`<div class="text-2xl mb-2">`);
        push_element($$renderer2, "div", 364, 6);
        $$renderer2.push(`👨‍👩‍👧‍👦</div>`);
        pop_element();
        $$renderer2.push(` <div class="font-medium">`);
        push_element($$renderer2, "div", 365, 6);
        $$renderer2.push(`Family Safety</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm opacity-80">`);
        push_element($$renderer2, "div", 366, 6);
        $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.FAMILY_SAFETY).length)} pending</div>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">`);
        push_element($$renderer2, "button", 369, 4);
        $$renderer2.push(`<div class="text-2xl mb-2">`);
        push_element($$renderer2, "div", 370, 6);
        $$renderer2.push(`🔧</div>`);
        pop_element();
        $$renderer2.push(` <div class="font-medium">`);
        push_element($$renderer2, "div", 371, 6);
        $$renderer2.push(`Technical QA</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm opacity-80">`);
        push_element($$renderer2, "div", 372, 6);
        $$renderer2.push(`${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.TECHNICAL_QA).length)} pending</div>`);
        pop_element();
        $$renderer2.push(`</button>`);
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
export {
  _page as default
};
