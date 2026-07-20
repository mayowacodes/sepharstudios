import { Ot as ensure_array_like, St as attr_class, Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Chart_column } from "../../../../../chunks/chart-column.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
//#region src/routes/(creator)/creator/analytics-help/+page.svelte
function _page($$renderer) {
	let activeSection = "overview";
	const sections = [
		{
			id: "overview",
			title: "Analytics Overview",
			icon: "📊"
		},
		{
			id: "metrics",
			title: "Key Metrics",
			icon: "📈"
		},
		{
			id: "interpretation",
			title: "Data Interpretation",
			icon: "🔍"
		},
		{
			id: "optimization",
			title: "Content Optimization",
			icon: "⚡"
		},
		{
			id: "reporting",
			title: "Reports & Insights",
			icon: "📋"
		},
		{
			id: "troubleshooting",
			title: "Troubleshooting",
			icon: "🔧"
		}
	];
	$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-6xl">`);
	PortalHero($$renderer, {
		compact: true,
		eyebrow: "Guides",
		title: "Analytics help",
		subtitle: "Understand your audience and optimize your content performance.",
		icon: Chart_column
	});
	$$renderer.push(`<!----> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1"><div class="surface-2 backdrop-blur-sm rounded-xl p-4 sticky top-6"><nav class="space-y-2"><!--[-->`);
	const each_array = ensure_array_like(sections);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let section = each_array[$$index];
		$$renderer.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeSection === section.id ? "bg-purple-600 text-foreground" : "text-foreground/80 hover:text-white hover:surface-2"}`)}><span>${escape_html(section.icon)}</span> <span class="text-sm font-medium">${escape_html(section.title)}</span></button>`);
	}
	$$renderer.push(`<!--]--></nav></div></div> <div class="lg:col-span-3"><div class="surface-2 backdrop-blur-sm rounded-xl p-6">`);
	$$renderer.push("<!--[0-->");
	$$renderer.push(`<div class="space-y-6"><div><h2 class="text-2xl font-bold text-foreground mb-4">Analytics Overview</h2> <p class="text-foreground/80 mb-4">Analytics help you understand your audience, measure your ministry impact, and optimize your content
                to reach more people with the Gospel message.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">👁️</span> Audience Insights</h3> <p class="text-blue-200 mb-3">Understand who's watching your content and how they engage with your ministry.</p> <ul class="text-blue-200 text-sm space-y-1"><li>• Demographics and location data</li> <li>• Viewing patterns and preferences</li> <li>• Spiritual interest indicators</li></ul></div> <div class="bg-green-600/20 border border-green-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">⚡</span> Performance Metrics</h3> <p class="text-green-200 mb-3">Track how your content performs and identify opportunities for improvement.</p> <ul class="text-green-200 text-sm space-y-1"><li>• Watch time and retention rates</li> <li>• Engagement and interaction data</li> <li>• Growth and reach metrics</li></ul></div> <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">🎯</span> Ministry Impact</h3> <p class="text-purple-200 mb-3">Measure the spiritual impact of your content beyond traditional metrics.</p> <ul class="text-purple-200 text-sm space-y-1"><li>• Prayer request submissions</li> <li>• Testimony and life-change stories</li> <li>• Community building indicators</li></ul></div> <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">📈</span> Growth Tracking</h3> <p class="text-orange-200 mb-3">Monitor your channel's growth and identify successful content strategies.</p> <ul class="text-orange-200 text-sm space-y-1"><li>• Subscriber growth patterns</li> <li>• Content performance trends</li> <li>• Revenue and monetization data</li></ul></div></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2">📋 Getting Started</h3> <p class="text-yellow-200 mb-3">Analytics data becomes available 24-48 hours after content publication. Here's how to access and use it:</p> <ol class="text-yellow-200 text-sm space-y-1"><li>1. Navigate to Creator Dashboard → Analytics</li> <li>2. Select date range and content filters</li> <li>3. Review key metrics and identify trends</li> <li>4. Apply insights to optimize future content</li></ol></div></div>`);
	$$renderer.push(`<!--]--></div></div></div></div>`);
}
//#endregion
export { _page as default };
