import { Et as derived, Ht as attr, Wt as escape_html, qt as run } from "../../../../../chunks/ui-libs.js";
import { t as Upload } from "../../../../../chunks/upload.js";
import { t as Video } from "../../../../../chunks/video.js";
import "../../../../../chunks/state.js";
import "../../../../../chunks/navigation.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
import { n as ContentStatus, r as ContentType } from "../../../../../chunks/creator.js";
//#region src/routes/(creator)/creator/content/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const initial = new URLSearchParams();
		let contentLibrary = [];
		let selectedFilter = initial.get("status") ?? "all";
		let searchTerm = initial.get("q") ?? "";
		let selectedType = initial.get("type") ?? "all";
		parseInt(initial.get("page") ?? "1", 10);
		let totalItems = 0;
		let selected = {};
		derived(() => Object.keys(selected).filter((id) => selected[id]));
		derived(() => contentLibrary);
		run(() => selectedFilter);
		run(() => selectedType);
		$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					href: "/creator/upload",
					variant: "primary",
					size: "sm",
					children: ($$renderer) => {
						Upload($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Upload`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Library",
				title: "Your content",
				subtitle: "Submitted, in review, published, archived — everything you've made.",
				icon: Video,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label for="search" class="block text-sm font-medium text-foreground mb-2">Search Content</label> <input type="text" id="search"${attr("value", searchTerm)} placeholder="Search by title or description..." class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/></div> <div><label for="status-filter" class="block text-sm font-medium text-foreground mb-2">Filter by Status</label> <div class="relative">`);
		$$renderer.select({
			id: "status-filter",
			value: selectedFilter,
			class: "w-full appearance-none px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
		}, ($$renderer) => {
			$$renderer.option({
				value: "all",
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`All Statuses`);
			});
			$$renderer.option({
				value: ContentStatus.DRAFT,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Draft`);
			});
			$$renderer.option({
				value: ContentStatus.SUBMITTED,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Submitted`);
			});
			$$renderer.option({
				value: ContentStatus.THEOLOGICAL_REVIEW,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Theological Review`);
			});
			$$renderer.option({
				value: ContentStatus.CONTENT_REVIEW,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Content Review`);
			});
			$$renderer.option({
				value: ContentStatus.TECHNICAL_QA,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Technical QA`);
			});
			$$renderer.option({
				value: ContentStatus.APPROVED,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Approved`);
			});
			$$renderer.option({
				value: ContentStatus.PUBLISHED,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Published`);
			});
			$$renderer.option({
				value: ContentStatus.REJECTED,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Rejected`);
			});
		});
		$$renderer.push(` <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div> <div><label for="type-filter" class="block text-sm font-medium text-foreground mb-2">Filter by Type</label> <div class="relative">`);
		$$renderer.select({
			id: "type-filter",
			value: selectedType,
			class: "w-full appearance-none px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
		}, ($$renderer) => {
			$$renderer.option({
				value: "all",
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`All Types`);
			});
			$$renderer.option({
				value: ContentType.MOVIE,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Movies`);
			});
			$$renderer.option({
				value: ContentType.SERIES,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Series`);
			});
			$$renderer.option({
				value: ContentType.DOCUMENTARY,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Documentaries`);
			});
			$$renderer.option({
				value: ContentType.SHORT_FILM,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Short Films`);
			});
			$$renderer.option({
				value: ContentType.SERMON,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Sermons`);
			});
			$$renderer.option({
				value: ContentType.WORSHIP,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Worship`);
			});
			$$renderer.option({
				value: ContentType.KIDS_CONTENT,
				class: "bg-background text-foreground"
			}, ($$renderer) => {
				$$renderer.push(`Kids Content`);
			});
		});
		$$renderer.push(` <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div> <div><div class="text-sm font-medium text-foreground mb-2">Quick Stats</div> <div class="text-2xl font-bold text-purple-400">${escape_html(totalItems)}</div> <div class="text-xs text-muted-foreground">Matching submissions</div></div></div></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-foreground ml-4">Loading your content...</p></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
