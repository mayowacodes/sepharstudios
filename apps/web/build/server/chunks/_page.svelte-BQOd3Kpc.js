import { ah as attr, ai as attr_class } from './ui-libs-BjzLDLAh.js';
import { K as KpiCard } from './KpiCard-p3Xq44Ey.js';
import { C as Circle_check } from './circle-check-Dew2U4ec.js';
import { C as Circle_x } from './circle-x-acgAH--Q.js';
import { C as Clock } from './clock-DYMPyb02.js';
import { F as File_text } from './file-text-C_v9vOk2.js';
import { V as Video } from './video-Dw3eSnUS.js';
import './client-Bo2aevGq.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import { C as ContentStatus, a as ContentType } from './creator-B732_51J.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './skeleton-DCiPgxrC.js';
import './utils2-BaRxD-PE.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(admin)/admin/content/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let allContent = [];
		let searchTerm = "";
		let selectedStatus = "all";
		let selectedType = "all";
		let sortBy = "newest";
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

export { _page as default };
//# sourceMappingURL=_page.svelte-BQOd3Kpc.js.map
