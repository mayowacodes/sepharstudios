import { af as onDestroy, f as derived, b as ensure_array_like, q as escape_html, s as spread_props } from './index.js-DwRgOKlO.js';
import { I as Icon } from './Icon-C7ASqKku.js';
import { C as Circle_check } from './circle-check-BowncvVB.js';
import { S as Shield_check } from './shield-check-DPRvF1UX.js';
import { S as Shield } from './shield-DA0lQNaY.js';
import { U as Users } from './users-Cy8n6xcU.js';
import { W as Wrench } from './wrench-DzXrNI3M.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import { P as PortalEmptyState } from './PortalEmptyState-BsWmddDC.js';
import { S as StatChip } from './StatChip-ClK5eBsb.js';
import { T as Tabs, a as Tabs_list, b as Tabs_content, c as Tabs_trigger, R as ReviewType } from './tabs-iTnc9_dB.js';
import './utils2-DHW1aw82.js';

//#region ../../node_modules/.bun/@lucide+svelte@1.24.0+5726b9c92ebd8575/node_modules/@lucide/svelte/dist/icons/cross.svelte
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
		let activeTab = "content";
		let userReviews = [];
		function teardownLive() {
		}
		onDestroy(teardownLive);
		const stats = derived(() => ({
			encoding: reviewQueue.filter((i) => i.processingStatus && ![
				"ready",
				"failed",
				"cancelled",
				null
			].includes(i.processingStatus)).length,
			awaiting: reviewQueue.filter((i) => i.processingStatus === "ready" || i.processingStatus === null || i.processingStatus === void 0).length,
			failed: reviewQueue.filter((i) => i.processingStatus === "failed").length,
			total: reviewQueue.length
		}));
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				StatChip($$renderer, {
					label: "encoding",
					value: stats().encoding,
					tone: "yellow"
				});
				$$renderer.push(`<!----> `);
				StatChip($$renderer, {
					label: "awaiting",
					value: stats().awaiting,
					tone: "default"
				});
				$$renderer.push(`<!----> `);
				if (stats().failed > 0) {
					$$renderer.push("<!--[0-->");
					StatChip($$renderer, {
						label: "failed",
						value: stats().failed,
						tone: "red"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Review Queue",
				title: "Content review",
				subtitle: "Submissions and viewer reviews awaiting moderation. Press / to search.",
				icon: Shield_check,
				actions});
		}
		$$renderer.push(`<!----> `);
		if (Tabs) {
			$$renderer.push("<!--[-->");
			Tabs($$renderer, {
				value: activeTab,
				onValueChange: (v) => activeTab = v,
				children: ($$renderer) => {
					if (Tabs_list) {
						$$renderer.push("<!--[-->");
						Tabs_list($$renderer, {
							children: ($$renderer) => {
								if (Tabs_trigger) {
									$$renderer.push("<!--[-->");
									Tabs_trigger($$renderer, {
										value: "content",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Content queue (${escape_html(reviewQueue.length)})`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Tabs_trigger) {
									$$renderer.push("<!--[-->");
									Tabs_trigger($$renderer, {
										value: "user-reviews",
										children: ($$renderer) => {
											$$renderer.push(`<!---->User reviews (${escape_html(userReviews.filter((r) => !r.isApproved).length)} pending)`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Tabs_content) {
						$$renderer.push("<!--[-->");
						Tabs_content($$renderer, {
							value: "content",
							class: "mt-6 space-y-6",
							children: ($$renderer) => {
								$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-3 surface-2 rounded-xl p-4"><div><label for="reviewType" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Review type</label> `);
								$$renderer.select({
									id: "reviewType",
									value: selectedType,
									class: "w-full px-3 py-2 surface-2 border border-border rounded text-foreground text-sm"
								}, ($$renderer) => {
									$$renderer.option({ value: "all" }, ($$renderer) => {
										$$renderer.push(`All types`);
									});
									$$renderer.option({ value: ReviewType.THEOLOGICAL }, ($$renderer) => {
										$$renderer.push(`Theological`);
									});
									$$renderer.option({ value: ReviewType.CONTENT_MODERATION }, ($$renderer) => {
										$$renderer.push(`Content moderation`);
									});
									$$renderer.option({ value: ReviewType.FAMILY_SAFETY }, ($$renderer) => {
										$$renderer.push(`Family safety`);
									});
									$$renderer.option({ value: ReviewType.TECHNICAL_QA }, ($$renderer) => {
										$$renderer.push(`Technical QA`);
									});
								});
								$$renderer.push(`</div> <div><label for="priority" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Priority</label> `);
								$$renderer.select({
									id: "priority",
									value: selectedPriority,
									class: "w-full px-3 py-2 surface-2 border border-border rounded text-foreground text-sm"
								}, ($$renderer) => {
									$$renderer.option({ value: "all" }, ($$renderer) => {
										$$renderer.push(`All priorities`);
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
								$$renderer.push(`</div> <div class="flex items-end gap-2 text-xs text-muted-foreground"><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> live encoder feed</span></div></div> `);
								{
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"><!--[-->`);
									const each_array_1 = ensure_array_like(Array(4));
									for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
										each_array_1[$$index_1];
										$$renderer.push(`<div class="surface-1 rounded-xl overflow-hidden animate-pulse"><div class="aspect-video bg-muted"></div> <div class="p-4 space-y-2"><div class="h-4 bg-muted rounded w-3/4"></div> <div class="h-3 bg-muted rounded w-1/2"></div></div></div>`);
									}
									$$renderer.push(`<!--]--></div>`);
								}
								$$renderer.push(`<!--]--> <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2"><button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
								Cross($$renderer, { class: "w-4 h-4 text-purple-400" });
								$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Theological</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.THEOLOGICAL).length)} pending</div></div></button> <button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
								Shield($$renderer, { class: "w-4 h-4 text-emerald-400" });
								$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Moderation</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.CONTENT_MODERATION).length)} pending</div></div></button> <button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
								Users($$renderer, { class: "w-4 h-4 text-pink-400" });
								$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Family safety</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.FAMILY_SAFETY).length)} pending</div></div></button> <button class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">`);
								Wrench($$renderer, { class: "w-4 h-4 text-blue-400" });
								$$renderer.push(`<!----> <div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">Technical QA</div> <div class="text-xs text-muted-foreground">${escape_html(reviewQueue.filter((i) => i.reviewType === ReviewType.TECHNICAL_QA).length)} pending</div></div></button></div>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Tabs_content) {
						$$renderer.push("<!--[-->");
						Tabs_content($$renderer, {
							value: "user-reviews",
							class: "mt-6",
							children: ($$renderer) => {
								if (userReviews.length === 0) {
									$$renderer.push("<!--[1-->");
									PortalEmptyState($$renderer, {
										icon: Circle_check,
										title: "All caught up",
										description: "No pending user reviews to moderate.",
										tone: "success"
									});
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<div class="space-y-4"><!--[-->`);
									const each_array_3 = ensure_array_like(userReviews);
									for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
										let review = each_array_3[$$index_3];
										$$renderer.push(`<div class="surface-1 rounded-xl p-5 space-y-3"><div class="flex items-start justify-between gap-4"><div class="space-y-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="text-yellow-400">${escape_html("★".repeat(review.rating))}${escape_html("☆".repeat(5 - review.rating))}</span> <span class="text-xs text-muted-foreground uppercase">${escape_html(review.contentType)}</span> <span class="text-xs text-muted-foreground">Content: ${escape_html(review.contentId.slice(0, 8))}…</span></div> `);
										if (review.reviewText) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-foreground text-sm leading-relaxed">${escape_html(review.reviewText)}</p>`);
										} else {
											$$renderer.push("<!--[-1-->");
											$$renderer.push(`<p class="text-muted-foreground text-sm italic">No text — rating only</p>`);
										}
										$$renderer.push(`<!--]--> <p class="text-xs text-muted-foreground">Submitted ${escape_html(new Date(review.createdAt).toLocaleDateString())}</p></div> <div class="flex gap-2 shrink-0"><button class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm transition-colors">Approve</button> <button class="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-sm transition-colors">Delete</button></div></div></div>`);
									}
									$$renderer.push(`<!--]--></div>`);
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BZXFVo-F.js.map
