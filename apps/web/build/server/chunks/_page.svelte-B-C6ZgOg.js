import { aM as run, ah as attr, au as escape_html } from './ui-libs-BjzLDLAh.js';
import { U as Upload } from './upload-DY_WtRs7.js';
import { V as Video } from './video-Dw3eSnUS.js';
import './client-Bo2aevGq.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import { C as ContentStatus, a as ContentType } from './creator-B732_51J.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(creator)/creator/content/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const initial = new URLSearchParams();
		let selectedFilter = initial.get("status") ?? "all";
		let searchTerm = initial.get("q") ?? "";
		let selectedType = initial.get("type") ?? "all";
		parseInt(initial.get("page") ?? "1", 10);
		let totalItems = 0;
		run(() => selectedFilter);
		run(() => selectedType);
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<a href="/creator/upload" class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium inline-flex items-center gap-1 transition-opacity">`);
				Upload($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Upload</a>`);
			}
			PageHeader($$renderer, {
				icon: Video,
				title: "Content Library",
				subtitle: "Manage your submitted content and track review progress.",
				actions});
		}
		$$renderer.push(`<!----> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label for="search" class="block text-sm font-medium text-foreground mb-2">Search Content</label> <input type="text" id="search"${attr("value", searchTerm)} placeholder="Search by title or description..." class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/></div> <div><label for="status-filter" class="block text-sm font-medium text-foreground mb-2">Filter by Status</label> `);
		$$renderer.select({
			id: "status-filter",
			value: selectedFilter,
			class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-purple-600 focus:border-transparent"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Statuses`);
			});
			$$renderer.option({ value: ContentStatus.DRAFT }, ($$renderer) => {
				$$renderer.push(`Draft`);
			});
			$$renderer.option({ value: ContentStatus.SUBMITTED }, ($$renderer) => {
				$$renderer.push(`Submitted`);
			});
			$$renderer.option({ value: ContentStatus.THEOLOGICAL_REVIEW }, ($$renderer) => {
				$$renderer.push(`Theological Review`);
			});
			$$renderer.option({ value: ContentStatus.CONTENT_REVIEW }, ($$renderer) => {
				$$renderer.push(`Content Review`);
			});
			$$renderer.option({ value: ContentStatus.TECHNICAL_QA }, ($$renderer) => {
				$$renderer.push(`Technical QA`);
			});
			$$renderer.option({ value: ContentStatus.APPROVED }, ($$renderer) => {
				$$renderer.push(`Approved`);
			});
			$$renderer.option({ value: ContentStatus.PUBLISHED }, ($$renderer) => {
				$$renderer.push(`Published`);
			});
			$$renderer.option({ value: ContentStatus.REJECTED }, ($$renderer) => {
				$$renderer.push(`Rejected`);
			});
		});
		$$renderer.push(`</div> <div><label for="type-filter" class="block text-sm font-medium text-foreground mb-2">Filter by Type</label> `);
		$$renderer.select({
			id: "type-filter",
			value: selectedType,
			class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-purple-600 focus:border-transparent"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Types`);
			});
			$$renderer.option({ value: ContentType.MOVIE }, ($$renderer) => {
				$$renderer.push(`Movies`);
			});
			$$renderer.option({ value: ContentType.SERIES }, ($$renderer) => {
				$$renderer.push(`Series`);
			});
			$$renderer.option({ value: ContentType.DOCUMENTARY }, ($$renderer) => {
				$$renderer.push(`Documentaries`);
			});
			$$renderer.option({ value: ContentType.SHORT_FILM }, ($$renderer) => {
				$$renderer.push(`Short Films`);
			});
			$$renderer.option({ value: ContentType.SERMON }, ($$renderer) => {
				$$renderer.push(`Sermons`);
			});
			$$renderer.option({ value: ContentType.WORSHIP }, ($$renderer) => {
				$$renderer.push(`Worship`);
			});
			$$renderer.option({ value: ContentType.KIDS_CONTENT }, ($$renderer) => {
				$$renderer.push(`Kids Content`);
			});
		});
		$$renderer.push(`</div> <div><div class="text-sm font-medium text-foreground mb-2">Quick Stats</div> <div class="text-2xl font-bold text-purple-400">${escape_html(totalItems)}</div> <div class="text-xs text-muted-foreground">Matching submissions</div></div></div></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-foreground ml-4">Loading your content...</p></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B-C6ZgOg.js.map
