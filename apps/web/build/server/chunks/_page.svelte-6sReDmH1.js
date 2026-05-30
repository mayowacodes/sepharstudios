import { an as escape_html, ab as attr_class, al as ensure_array_like, aK as stringify, ai as derived } from './ui-libs-TtGtWAGI.js';
import { a as ReviewType } from './admin-CV_SQoTq.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(admin)/admin/review/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let reviewQueue = [];
		let selectedType = "all";
		let selectedPriority = "all";
		let userReviews = [];
		const filteredQueue = derived(() => reviewQueue.filter((item) => {
			return true;
		}));
		function getPriorityColor(priority) {
			switch (priority) {
				case "urgent": return "bg-red-600 text-white";
				case "high": return "bg-yellow-600 text-black";
				case "normal": return "bg-blue-600 text-white";
				case "low": return "bg-gray-600 text-white";
				default: return "bg-gray-600 text-white";
			}
		}
		function getReviewTypeColor(reviewType) {
			switch (reviewType) {
				case ReviewType.THEOLOGICAL: return "bg-purple-600 text-white";
				case ReviewType.CONTENT_MODERATION: return "bg-green-600 text-white";
				case ReviewType.FAMILY_SAFETY: return "bg-pink-600 text-white";
				case ReviewType.TECHNICAL_QA: return "bg-blue-600 text-white";
				default: return "bg-gray-600 text-white";
			}
		}
		function formatDate(date) {
			return date ? date.toLocaleDateString() : "No due date";
		}
		function getDaysUntilDue(dueDate) {
			if (!dueDate) return null;
			const today = /* @__PURE__ */ new Date();
			return Math.ceil((dueDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
		}
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="space-y-6"><div class="flex justify-between items-center"><div><h1 class="text-4xl font-bold text-white mb-2">Review Queue</h1> <p class="text-xl text-gray-300">Content and user reviews awaiting moderation</p></div> <div class="grid grid-cols-4 gap-4"><div class="bg-red-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-red-400">${escape_html(reviewQueue.filter((i) => i.priority === "urgent").length)}</div> <div class="text-xs text-red-200">Urgent</div></div> <div class="bg-yellow-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-yellow-400">${escape_html(reviewQueue.filter((i) => i.priority === "high").length)}</div> <div class="text-xs text-yellow-200">High</div></div> <div class="bg-blue-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-blue-400">${escape_html(reviewQueue.filter((i) => i.priority === "normal").length)}</div> <div class="text-xs text-blue-200">Normal</div></div> <div class="bg-gray-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-gray-400">${escape_html(reviewQueue.length)}</div> <div class="text-xs text-gray-200">Total</div></div></div></div> <div class="flex gap-2 border-b border-white/10 pb-0"><button${attr_class(`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors bg-white/10 text-white`)}>Content Queue (${escape_html(reviewQueue.length)})</button> <button${attr_class(`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors text-gray-400 hover:text-white`)}>User Reviews (${escape_html(userReviews.filter((r) => !r.isApproved).length)} pending)</button></div> `);
		{
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="reviewType" class="block text-sm font-medium text-white mb-2">Review Type</label> `);
			$$renderer.select({
				id: "reviewType",
				value: selectedType,
				class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
			}, ($$renderer) => {
				$$renderer.option({ value: "all" }, ($$renderer) => {
					$$renderer.push(`All Types`);
				});
				$$renderer.option({ value: ReviewType.THEOLOGICAL }, ($$renderer) => {
					$$renderer.push(`Theological Review`);
				});
				$$renderer.option({ value: ReviewType.CONTENT_MODERATION }, ($$renderer) => {
					$$renderer.push(`Content Moderation`);
				});
				$$renderer.option({ value: ReviewType.FAMILY_SAFETY }, ($$renderer) => {
					$$renderer.push(`Family Safety`);
				});
				$$renderer.option({ value: ReviewType.TECHNICAL_QA }, ($$renderer) => {
					$$renderer.push(`Technical QA`);
				});
			});
			$$renderer.push(`</div> <div><label for="priority" class="block text-sm font-medium text-white mb-2">Priority</label> `);
			$$renderer.select({
				id: "priority",
				value: selectedPriority,
				class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
			}, ($$renderer) => {
				$$renderer.option({ value: "all" }, ($$renderer) => {
					$$renderer.push(`All Priorities`);
				});
				$$renderer.option({ value: "urgent" }, ($$renderer) => {
					$$renderer.push(`Urgent`);
				});
				$$renderer.option({ value: "high" }, ($$renderer) => {
					$$renderer.push(`High`);
				});
				$$renderer.option({ value: "normal" }, ($$renderer) => {
					$$renderer.push(`Normal`);
				});
				$$renderer.option({ value: "low" }, ($$renderer) => {
					$$renderer.push(`Low`);
				});
			});
			$$renderer.push(`</div></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead class="bg-white/10"><tr><th class="px-6 py-4 text-left text-sm font-medium text-white">Content</th><th class="px-6 py-4 text-left text-sm font-medium text-white">Creator</th><th class="px-6 py-4 text-left text-sm font-medium text-white">Review Type</th><th class="px-6 py-4 text-left text-sm font-medium text-white">Priority</th><th class="px-6 py-4 text-left text-sm font-medium text-white">Due Date</th><th class="px-6 py-4 text-left text-sm font-medium text-white">Status</th><th class="px-6 py-4 text-left text-sm font-medium text-white">Actions</th></tr></thead><tbody class="divide-y divide-gray-700"><!--[-->`);
			const each_array_2 = ensure_array_like(filteredQueue());
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let item = each_array_2[$$index_2];
				const daysUntilDue = getDaysUntilDue(item.dueDate);
				$$renderer.push(`<tr class="hover:bg-white/5 transition-colors"><td class="px-6 py-4"><div><div class="font-medium text-white">${escape_html(item.title)}</div> <div class="text-sm text-gray-400">${escape_html(item.contentType)}</div></div></td><td class="px-6 py-4"><div class="text-sm text-white">${escape_html(item.creatorName)}</div> <div class="text-xs text-gray-400">Submitted ${escape_html(formatDate(item.submittedAt))}</div></td><td class="px-6 py-4"><span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getReviewTypeColor(item.reviewType))}`)}>${escape_html(item.reviewType.replace("_", " "))}</span></td><td class="px-6 py-4"><span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getPriorityColor(item.priority))}`)}>${escape_html(item.priority.toUpperCase())}</span></td><td class="px-6 py-4"><div class="text-sm text-white">${escape_html(formatDate(item.dueDate))}</div> `);
				if (daysUntilDue !== null) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div${attr_class(`text-xs ${daysUntilDue <= 1 ? "text-red-400" : daysUntilDue <= 3 ? "text-yellow-400" : "text-gray-400"}`)}>${escape_html(daysUntilDue <= 0 ? "Overdue" : `${daysUntilDue} days left`)}</div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="text-xs text-gray-400">No deadline</div>`);
				}
				$$renderer.push(`<!--]--></td><td class="px-6 py-4">`);
				if (item.assignedTo) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="text-sm text-green-400">Assigned</div> <div class="text-xs text-gray-400">${escape_html(item.assignedTo)}</div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="text-sm text-yellow-400">Unassigned</div>`);
				}
				$$renderer.push(`<!--]--></td><td class="px-6 py-4"><div class="flex space-x-2"><button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">Review</button> `);
				if (!item.assignedTo) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">Assign</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table> `);
			if (filteredQueue().length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-center py-12"><div class="text-4xl mb-4">📋</div> <div class="text-xl text-white mb-2">No items in queue</div> <div class="text-gray-400">No content matches your current filters</div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"><button class="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"><div class="text-2xl mb-2">⛪</div> <div class="font-medium">Theological Reviews</div> <div class="text-sm opacity-80">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.THEOLOGICAL).length)} pending</div></button> <button class="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"><div class="text-2xl mb-2">🛡️</div> <div class="font-medium">Content Moderation</div> <div class="text-sm opacity-80">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.CONTENT_MODERATION).length)} pending</div></button> <button class="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-lg text-center transition-colors"><div class="text-2xl mb-2">👨‍👩‍👧‍👦</div> <div class="font-medium">Family Safety</div> <div class="text-sm opacity-80">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.FAMILY_SAFETY).length)} pending</div></button> <button class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"><div class="text-2xl mb-2">🔧</div> <div class="font-medium">Technical QA</div> <div class="text-sm opacity-80">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.TECHNICAL_QA).length)} pending</div></button></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-6sReDmH1.js.map
