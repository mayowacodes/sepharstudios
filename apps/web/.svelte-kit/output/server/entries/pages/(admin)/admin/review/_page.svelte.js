import { At as stringify, Dt as spread_props, St as derived, vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as Inbox } from "../../../../../chunks/inbox.js";
import { t as Shield_check } from "../../../../../chunks/shield-check.js";
import { t as Shield } from "../../../../../chunks/shield.js";
import { t as Users } from "../../../../../chunks/users.js";
import { t as Wrench } from "../../../../../chunks/wrench.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import { t as StatChip } from "../../../../../chunks/StatChip.js";
import { n as ReviewType } from "../../../../../chunks/admin.js";
import { t as EmptyState } from "../../../../../chunks/EmptyState.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/cross.svelte
function Cross($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "cross" },
		props,
		{ iconNode: [["path", { "d": "M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z" }]] }
	]));
}
//#endregion
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
				case "low": return "bg-gray-600 text-foreground";
				default: return "bg-gray-600 text-foreground";
			}
		}
		function getReviewTypeColor(reviewType) {
			switch (reviewType) {
				case ReviewType.THEOLOGICAL: return "bg-purple-600 text-white";
				case ReviewType.CONTENT_MODERATION: return "bg-green-600 text-white";
				case ReviewType.FAMILY_SAFETY: return "bg-pink-600 text-white";
				case ReviewType.TECHNICAL_QA: return "bg-blue-600 text-white";
				default: return "bg-gray-600 text-foreground";
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
		$$renderer.push(`<!--]--> <div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				StatChip($$renderer, {
					label: "urgent",
					value: reviewQueue.filter((i) => i.priority === "urgent").length,
					tone: "red"
				});
				$$renderer.push(`<!----> `);
				StatChip($$renderer, {
					label: "high",
					value: reviewQueue.filter((i) => i.priority === "high").length,
					tone: "yellow"
				});
				$$renderer.push(`<!----> `);
				StatChip($$renderer, {
					label: "total",
					value: reviewQueue.length,
					tone: "default"
				});
				$$renderer.push(`<!---->`);
			}
			PageHeader($$renderer, {
				icon: Shield_check,
				title: "Review Queue",
				subtitle: "Content and user reviews awaiting moderation.",
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="flex gap-2 border-b border-border/40 pb-0"><button${attr_class(`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors surface-2 text-foreground`)}>Content Queue (${escape_html(reviewQueue.length)})</button> <button${attr_class(`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors text-muted-foreground hover:text-foreground`)}>User Reviews (${escape_html(userReviews.filter((r) => !r.isApproved).length)} pending)</button></div> `);
		{
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="reviewType" class="block text-sm font-medium text-foreground mb-2">Review Type</label> `);
			$$renderer.select({
				id: "reviewType",
				value: selectedType,
				class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
			$$renderer.push(`</div> <div><label for="priority" class="block text-sm font-medium text-foreground mb-2">Priority</label> `);
			$$renderer.select({
				id: "priority",
				value: selectedPriority,
				class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
			$$renderer.push(`</div></div></div> <div class="surface-1 backdrop-blur-sm rounded-xl overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead class="surface-2"><tr><th class="px-6 py-4 text-left text-sm font-medium text-foreground">Content</th><th class="px-6 py-4 text-left text-sm font-medium text-foreground">Creator</th><th class="px-6 py-4 text-left text-sm font-medium text-foreground">Review Type</th><th class="px-6 py-4 text-left text-sm font-medium text-foreground">Priority</th><th class="px-6 py-4 text-left text-sm font-medium text-foreground">Due Date</th><th class="px-6 py-4 text-left text-sm font-medium text-foreground">Status</th><th class="px-6 py-4 text-left text-sm font-medium text-foreground">Actions</th></tr></thead><tbody class="divide-y divide-gray-700"><!--[-->`);
			const each_array_2 = ensure_array_like(filteredQueue());
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let item = each_array_2[$$index_2];
				const daysUntilDue = getDaysUntilDue(item.dueDate);
				$$renderer.push(`<tr class="hover:surface-1 transition-colors"><td class="px-6 py-4"><div><div class="font-medium text-foreground">${escape_html(item.title)}</div> <div class="text-sm text-muted-foreground">${escape_html(item.contentType)}</div></div></td><td class="px-6 py-4"><div class="text-sm text-foreground">${escape_html(item.creatorName)}</div> <div class="text-xs text-muted-foreground">Submitted ${escape_html(formatDate(item.submittedAt))}</div></td><td class="px-6 py-4"><span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getReviewTypeColor(item.reviewType))}`)}>${escape_html(item.reviewType.replace("_", " "))}</span></td><td class="px-6 py-4"><span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getPriorityColor(item.priority))}`)}>${escape_html(item.priority.toUpperCase())}</span></td><td class="px-6 py-4"><div class="text-sm text-foreground">${escape_html(formatDate(item.dueDate))}</div> `);
				if (daysUntilDue !== null) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div${attr_class(`text-xs ${daysUntilDue <= 1 ? "text-red-400" : daysUntilDue <= 3 ? "text-yellow-400" : "text-muted-foreground"}`)}>${escape_html(daysUntilDue <= 0 ? "Overdue" : `${daysUntilDue} days left`)}</div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="text-xs text-muted-foreground">No deadline</div>`);
				}
				$$renderer.push(`<!--]--></td><td class="px-6 py-4">`);
				if (item.assignedTo) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="text-sm text-green-400">Assigned</div> <div class="text-xs text-muted-foreground">${escape_html(item.assignedTo)}</div>`);
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
				EmptyState($$renderer, {
					icon: Inbox,
					title: "No items in queue",
					description: "No content matches your current filters."
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-2"><button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
			Cross($$renderer, { class: "w-4 h-4 text-purple-500" });
			$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Theological</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.THEOLOGICAL).length)} pending</div></div></button> <button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
			Shield($$renderer, { class: "w-4 h-4 text-green-500" });
			$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Moderation</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.CONTENT_MODERATION).length)} pending</div></div></button> <button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
			Users($$renderer, { class: "w-4 h-4 text-pink-500" });
			$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Family safety</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.FAMILY_SAFETY).length)} pending</div></div></button> <button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
			Wrench($$renderer, { class: "w-4 h-4 text-blue-500" });
			$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Technical QA</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.TECHNICAL_QA).length)} pending</div></div></button></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
