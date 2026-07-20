import { Et as derived, vt as onDestroy } from "../../../../../../chunks/ui-libs.js";
import "../../../../../../chunks/Icon.js";
import "../../../../../../chunks/archive.js";
import "../../../../../../chunks/arrow-left.js";
import "../../../../../../chunks/bell.js";
import "../../../../../../chunks/circle-check.js";
import "../../../../../../chunks/circle-x.js";
import "../../../../../../chunks/file-text.js";
import "../../../../../../chunks/film.js";
import "../../../../../../chunks/loader-circle.js";
import "../../../../../../chunks/ContentThreadPanel.js";
import "../../../../../../chunks/rocket.js";
import "../../../../../../chunks/sparkles.js";
import "../../../../../../chunks/trash-2.js";
import "../../../../../../chunks/triangle-alert.js";
import "../../../../../../chunks/state.js";
import "../../../../../../chunks/navigation.js";
import { a as ReviewResult, o as ReviewType } from "../../../../../../chunks/tabs.js";
import "../../../../../../chunks/VideoPlayer.js";
//#endregion
//#region src/routes/(admin)/admin/review/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let currentReview = {
			reviewType: ReviewType.THEOLOGICAL,
			result: void 0,
			feedback: "",
			detailedNotes: []
		};
		(/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		derived(() => false);
		let evtSource = null;
		let pollTimer = null;
		function teardownLive() {
			if (evtSource) {
				evtSource.close();
				evtSource = null;
			}
			if (pollTimer) {
				clearInterval(pollTimer);
				pollTimer = null;
			}
		}
		onDestroy(teardownLive);
		derived(() => Math.max(0, Math.min(100, 0)));
		derived(() => !!currentReview.result && true);
		derived(() => false);
		const isApproved = derived(() => false);
		derived(() => isApproved() && true);
		derived(() => currentReview.result === ReviewResult.APPROVED ? "Approve review" : currentReview.result === ReviewResult.APPROVE_COMING_SOON ? "Approve as Coming Soon" : currentReview.result === ReviewResult.REJECTED ? "Reject submission" : currentReview.result === ReviewResult.NEEDS_REVISION ? "Request revision" : "Submit review");
		derived(() => false);
		derived(() => false);
		derived(() => false);
		$$renderer.push("<!--[1-->");
		$$renderer.push(`<div class="container mx-auto px-4 py-12 text-center text-muted-foreground text-sm">Loading content…</div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
