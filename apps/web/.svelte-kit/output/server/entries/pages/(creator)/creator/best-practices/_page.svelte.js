import { vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Target } from "../../../../../chunks/target.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
//#region src/routes/(creator)/creator/best-practices/+page.svelte
function _page($$renderer) {
	let activeSection = "overview";
	const sections = [
		{
			id: "overview",
			title: "Overview",
			icon: "🎯"
		},
		{
			id: "content-strategy",
			title: "Content Strategy",
			icon: "📝"
		},
		{
			id: "production",
			title: "Production Quality",
			icon: "🎬"
		},
		{
			id: "engagement",
			title: "Audience Engagement",
			icon: "❤️"
		},
		{
			id: "growth",
			title: "Channel Growth",
			icon: "📈"
		},
		{
			id: "ministry",
			title: "Ministry Impact",
			icon: "✝️"
		}
	];
	$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
	PageHeader($$renderer, {
		icon: Target,
		title: "Best Practices",
		subtitle: "Proven strategies to maximize your ministry impact and grow your audience."
	});
	$$renderer.push(`<!----> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1"><div class="surface-2 backdrop-blur-sm rounded-xl p-4 sticky top-6"><nav class="space-y-2"><!--[-->`);
	const each_array = ensure_array_like(sections);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let section = each_array[$$index];
		$$renderer.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeSection === section.id ? "bg-purple-600 text-foreground" : "text-foreground/80 hover:text-white hover:surface-2"}`)}><span>${escape_html(section.icon)}</span> <span class="text-sm font-medium">${escape_html(section.title)}</span></button>`);
	}
	$$renderer.push(`<!--]--></nav></div></div> <div class="lg:col-span-3"><div class="surface-2 backdrop-blur-sm rounded-xl p-6">`);
	$$renderer.push("<!--[0-->");
	$$renderer.push(`<div class="space-y-6"><div><h2 class="text-2xl font-bold text-foreground mb-4">Best Practices Overview</h2> <p class="text-foreground/80 mb-4">Creating successful faith-based content requires more than just good intentions. These proven strategies
                will help you maximize your ministry impact and build a thriving creator community.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">🎯</span> Purpose-Driven Content</h3> <p class="text-blue-200 mb-3">Every piece of content should have a clear ministry purpose and call to action.</p> <ul class="text-blue-200 text-sm space-y-1"><li>• Define your ministry focus</li> <li>• Set clear content goals</li> <li>• Include actionable takeaways</li></ul></div> <div class="bg-green-600/20 border border-green-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">⚡</span> Consistent Excellence</h3> <p class="text-green-200 mb-3">Maintain high standards across all aspects of your content creation.</p> <ul class="text-green-200 text-sm space-y-1"><li>• Regular upload schedule</li> <li>• Professional presentation</li> <li>• Engaging storytelling</li></ul></div> <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">👥</span> Community Building</h3> <p class="text-purple-200 mb-3">Foster genuine connections and build a supportive faith community.</p> <ul class="text-purple-200 text-sm space-y-1"><li>• Respond to comments thoughtfully</li> <li>• Create discussion opportunities</li> <li>• Share personal experiences</li></ul></div> <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">📊</span> Data-Driven Growth</h3> <p class="text-orange-200 mb-3">Use analytics to understand your audience and improve your content.</p> <ul class="text-orange-200 text-sm space-y-1"><li>• Track engagement metrics</li> <li>• Analyze successful content</li> <li>• Test different approaches</li></ul></div></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">🏆</span> Success Metrics That Matter</h3> <p class="text-yellow-200 mb-3">Focus on metrics that reflect your ministry impact, not just vanity numbers.</p> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div class="text-center"><div class="text-2xl mb-1">💬</div> <div class="text-yellow-200">Meaningful Comments</div></div> <div class="text-center"><div class="text-2xl mb-1">🔄</div> <div class="text-yellow-200">Content Shares</div></div> <div class="text-center"><div class="text-2xl mb-1">⏱️</div> <div class="text-yellow-200">Watch Time</div></div> <div class="text-center"><div class="text-2xl mb-1">📧</div> <div class="text-yellow-200">Newsletter Signups</div></div></div></div></div>`);
	$$renderer.push(`<!--]--></div></div></div></div>`);
}
//#endregion
export { _page as default };
