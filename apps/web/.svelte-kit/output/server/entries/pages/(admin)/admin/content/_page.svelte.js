import { Lt as attr, St as derived, vt as attr_class } from "../../../../../chunks/ui-libs.js";
import { t as KpiCard } from "../../../../../chunks/KpiCard.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Circle_x } from "../../../../../chunks/circle-x.js";
import { t as Clock } from "../../../../../chunks/clock.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
import { t as Video } from "../../../../../chunks/video.js";
import "../../../../../chunks/navigation.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import { n as ContentStatus, r as ContentType } from "../../../../../chunks/creator.js";
//#region src/routes/(admin)/admin/content/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let allContent = [];
		let searchTerm = "";
		let selectedStatus = "all";
		let selectedType = "all";
		let sortBy = "newest";
		let currentPage = 1;
		let itemsPerPage = 12;
		let totalItems = 0;
		derived(() => {
			let filtered = allContent.filter((content) => {
				return true;
			});
			switch (sortBy) {
				case "newest":
					filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
					break;
				case "oldest":
					filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
					break;
				case "title":
					filtered.sort((a, b) => a.title.localeCompare(b.title));
					break;
				case "creator":
					filtered.sort((a, b) => a.creatorName.localeCompare(b.creatorName));
					break;
				case "priority":
					const priorityOrder = {
						[ContentStatus.DRAFT]: 5,
						[ContentStatus.SUBMITTED]: 4,
						[ContentStatus.THEOLOGICAL_REVIEW]: 3,
						[ContentStatus.CONTENT_REVIEW]: 2,
						[ContentStatus.TECHNICAL_QA]: 1,
						[ContentStatus.APPROVED]: 0,
						[ContentStatus.PUBLISHED]: -1,
						[ContentStatus.REJECTED]: 0,
						[ContentStatus.ARCHIVED]: -2
					};
					filtered.sort((a, b) => (priorityOrder[b.status] || 0) - (priorityOrder[a.status] || 0));
					break;
			}
			totalItems = filtered.length;
			const startIndex = (currentPage - 1) * itemsPerPage;
			return filtered.slice(startIndex, 12);
		});
		derived(() => Math.ceil(totalItems / itemsPerPage));
		$$renderer.push(`<div class="container mx-auto px-4 py-4 space-y-6">`);
		PageHeader($$renderer, {
			icon: Video,
			title: "Content Management",
			subtitle: "Manage all submitted content across the platform."
		});
		$$renderer.push(`<!----> <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">`);
		KpiCard($$renderer, {
			label: "Pending Review",
			value: allContent.filter((c) => c.status === ContentStatus.SUBMITTED).length,
			icon: Clock,
			accent: "blue",
			variant: "compact",
			index: 0
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Published",
			value: allContent.filter((c) => c.status === ContentStatus.PUBLISHED).length,
			icon: Circle_check,
			accent: "green",
			variant: "compact",
			index: 1
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Rejected",
			value: allContent.filter((c) => c.status === ContentStatus.REJECTED).length,
			icon: Circle_x,
			accent: "red",
			variant: "compact",
			index: 2
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Total Content",
			value: allContent.length,
			icon: File_text,
			accent: "purple",
			variant: "compact",
			index: 3
		});
		$$renderer.push(`<!----></div> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="flex flex-col lg:flex-row gap-4 mb-4"><div class="flex-1"><input type="text"${attr("value", searchTerm)} placeholder="Search content, creators, or descriptions..." class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"/></div> <div class="flex flex-wrap gap-3">`);
		$$renderer.select({
			value: selectedStatus,
			class: "px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600"
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
			class: "px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600"
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
			class: "px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600"
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
		$$renderer.push(`</div> <div class="flex rounded-lg overflow-hidden"><button${attr_class(`px-4 py-2 bg-red-600 text-foreground`)}>📊</button> <button${attr_class(`px-4 py-2 surface-2 text-white/80`)}>📄</button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-foreground ml-4">Loading content...</p></div>`);
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
