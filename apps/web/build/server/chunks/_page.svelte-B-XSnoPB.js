import { aa as attr, an as escape_html } from './ui-libs-TtGtWAGI.js';
import './client-CZa6R-ON.js';
import { C as ContentStatus, a as ContentType } from './creator-B732_51J.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(creator)/creator/content/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let contentLibrary = [];
		let selectedFilter = "all";
		let searchTerm = "";
		let selectedType = "all";
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-bold text-white mb-2">Content Library</h1> <p class="text-gray-300">Manage your submitted content and track review progress</p></div> <div class="mt-4 sm:mt-0"><a href="/creator/upload" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"><span class="mr-2">+</span> Upload New Content</a></div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label for="search" class="block text-sm font-medium text-white mb-2">Search Content</label> <input type="text" id="search"${attr("value", searchTerm)} placeholder="Search by title or description..." class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/></div> <div><label for="status-filter" class="block text-sm font-medium text-white mb-2">Filter by Status</label> `);
		$$renderer.select({
			id: "status-filter",
			value: selectedFilter,
			class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
		$$renderer.push(`</div> <div><label for="type-filter" class="block text-sm font-medium text-white mb-2">Filter by Type</label> `);
		$$renderer.select({
			id: "type-filter",
			value: selectedType,
			class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
		$$renderer.push(`</div> <div><div class="text-sm font-medium text-white mb-2">Quick Stats</div> <div class="text-2xl font-bold text-purple-400">${escape_html(contentLibrary.length)}</div> <div class="text-xs text-gray-400">Total Submissions</div></div></div></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-white ml-4">Loading your content...</p></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B-XSnoPB.js.map
