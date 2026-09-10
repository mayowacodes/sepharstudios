import { b as ensure_array_like, x as attr_class, i as attr } from './index.js-DwRgOKlO.js';
import { P as PortalKpi } from './PortalKpi-DuR9asVZ.js';
import { C as Circle_check } from './circle-check-BowncvVB.js';
import { C as Circle_x } from './circle-x-CpOjacCe.js';
import { C as Clock } from './clock-Dg8sFht_.js';
import { F as File_text } from './file-text-CHS0iqgH.js';
import { V as Video } from './video-C8afl4S0.js';
import './client-BnGpewQC.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import { C as ContentStatus, a as ContentType } from './creator-B732_51J.js';
import './Icon-C7ASqKku.js';

//#region src/routes/(admin)/admin/content/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let allContent = [];
		let searchTerm = "";
		let selectedStatus = "all";
		let selectedType = "all";
		let sortBy = "newest";
		$$renderer.push(`<div class="mx-auto px-4 py-4 space-y-6 max-w-7xl">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Library",
			title: "Content management",
			subtitle: "Every submission, published title, and archived row in one place.",
			icon: Video
		});
		$$renderer.push(`<!----> <div class="grid grid-cols-2 lg:grid-cols-4 gap-3"><!--[-->`);
		const each_array = ensure_array_like([
			{
				label: "Pending Review",
				value: allContent.filter((c) => c.status === ContentStatus.SUBMITTED).length,
				icon: Clock,
				filter: ContentStatus.SUBMITTED
			},
			{
				label: "Published",
				value: allContent.filter((c) => c.status === ContentStatus.PUBLISHED).length,
				icon: Circle_check,
				filter: ContentStatus.PUBLISHED
			},
			{
				label: "Rejected",
				value: allContent.filter((c) => c.status === ContentStatus.REJECTED).length,
				icon: Circle_x,
				filter: ContentStatus.REJECTED
			},
			{
				label: "Total Content",
				value: allContent.length,
				icon: File_text,
				filter: "all"
			}
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let kpi = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class("text-left block w-full rounded-2xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--portal-accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--portal-bg-base))] svelte-uv4m4f", void 0, { "is-active": selectedStatus === kpi.filter })}${attr("aria-pressed", selectedStatus === kpi.filter)}${attr("aria-label", `Filter by ${kpi.label}`)}>`);
			PortalKpi($$renderer, {
				label: kpi.label,
				value: kpi.value,
				icon: kpi.icon
			});
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="flex flex-col lg:flex-row gap-4 mb-4"><div class="flex-1"><input type="text"${attr("value", searchTerm)} placeholder="Search content, creators, or descriptions..." class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"/></div> <div class="flex flex-wrap gap-3">`);
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
//# sourceMappingURL=_page.svelte-BZoDj67G.js.map
