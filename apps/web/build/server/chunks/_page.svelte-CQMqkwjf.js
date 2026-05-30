import { an as escape_html, aa as attr, ab as attr_class } from './ui-libs-TtGtWAGI.js';
import { C as ContentStatus, a as ContentType } from './creator-B732_51J.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(admin)/admin/content/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let allContent = [];
		let searchTerm = "";
		let selectedStatus = "all";
		let selectedType = "all";
		let sortBy = "newest";
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between"><div><h1 class="text-3xl font-bold text-white mb-2">Content Management</h1> <p class="text-gray-300">Manage all submitted content across the platform</p></div> <div class="mt-4 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-4"><div class="bg-blue-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-blue-400">${escape_html(allContent.filter((c) => c.status === ContentStatus.SUBMITTED).length)}</div> <div class="text-blue-200 text-xs">Pending Review</div></div> <div class="bg-green-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-green-400">${escape_html(allContent.filter((c) => c.status === ContentStatus.PUBLISHED).length)}</div> <div class="text-green-200 text-xs">Published</div></div> <div class="bg-red-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-red-400">${escape_html(allContent.filter((c) => c.status === ContentStatus.REJECTED).length)}</div> <div class="text-red-200 text-xs">Rejected</div></div> <div class="bg-purple-600/20 rounded-lg p-3 text-center"><div class="text-2xl font-bold text-purple-400">${escape_html(allContent.length)}</div> <div class="text-purple-200 text-xs">Total Content</div></div></div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6"><div class="flex flex-col lg:flex-row gap-4 mb-4"><div class="flex-1"><input type="text"${attr("value", searchTerm)} placeholder="Search content, creators, or descriptions..." class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"/></div> <div class="flex flex-wrap gap-3">`);
		$$renderer.select({
			value: selectedStatus,
			class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Statuses`);
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
		$$renderer.push(` `);
		$$renderer.select({
			value: selectedType,
			class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
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
		$$renderer.push(` `);
		$$renderer.select({
			value: sortBy,
			class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
		}, ($$renderer) => {
			$$renderer.option({ value: "newest" }, ($$renderer) => {
				$$renderer.push(`Newest First`);
			});
			$$renderer.option({ value: "oldest" }, ($$renderer) => {
				$$renderer.push(`Oldest First`);
			});
			$$renderer.option({ value: "title" }, ($$renderer) => {
				$$renderer.push(`Title A-Z`);
			});
			$$renderer.option({ value: "creator" }, ($$renderer) => {
				$$renderer.push(`Creator A-Z`);
			});
			$$renderer.option({ value: "priority" }, ($$renderer) => {
				$$renderer.push(`Priority`);
			});
		});
		$$renderer.push(`</div> <div class="flex rounded-lg overflow-hidden"><button${attr_class(`px-4 py-2 bg-red-600 text-white`)}>📊</button> <button${attr_class(`px-4 py-2 bg-white/10 text-gray-300`)}>📄</button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-white ml-4">Loading content...</p></div>`);
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CQMqkwjf.js.map
