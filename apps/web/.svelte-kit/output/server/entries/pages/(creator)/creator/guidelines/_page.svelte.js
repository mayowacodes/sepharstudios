import { gt as ensure_array_like, jt as escape_html, ut as attr_class } from "../../../../../chunks/ui-libs.js";
//#region src/routes/(creator)/creator/guidelines/+page.svelte
function _page($$renderer) {
	let activeSection = "overview";
	const sections = [
		{
			id: "overview",
			title: "Overview",
			icon: "📋"
		},
		{
			id: "content",
			title: "Content Standards",
			icon: "🎬"
		},
		{
			id: "technical",
			title: "Technical Requirements",
			icon: "⚙️"
		},
		{
			id: "submission",
			title: "Submission Process",
			icon: "📤"
		},
		{
			id: "review",
			title: "Review Process",
			icon: "👁️"
		},
		{
			id: "best-practices",
			title: "Best Practices",
			icon: "⭐"
		}
	];
	$$renderer.push(`<div class="space-y-6"><div><h1 class="text-3xl font-bold text-white mb-2">Creator Guidelines</h1> <p class="text-gray-300">Everything you need to know about creating content for Sephar Studios</p></div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 sticky top-6"><nav class="space-y-2"><!--[-->`);
	const each_array = ensure_array_like(sections);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let section = each_array[$$index];
		$$renderer.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeSection === section.id ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`)}><span>${escape_html(section.icon)}</span> <span class="text-sm font-medium">${escape_html(section.title)}</span></button>`);
	}
	$$renderer.push(`<!--]--></nav></div></div> <div class="lg:col-span-3"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
	$$renderer.push("<!--[0-->");
	$$renderer.push(`<div class="space-y-6"><div><h2 class="text-2xl font-bold text-white mb-4">Welcome to Sephar Studios</h2> <p class="text-gray-300 mb-4">Sephar Studios is a faith-based streaming platform dedicated to sharing Christian content that inspires, 
                educates, and transforms lives. As a creator, you play a vital role in building a community centered around 
                faith, hope, and love.</p></div> <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4"><h3 class="text-lg font-bold text-white mb-2 flex items-center"><span class="mr-2">🎯</span> Our Mission</h3> <p class="text-blue-200">To provide a safe, inspiring platform where Christian creators can share their God-given talents 
                and stories to reach hearts worldwide with the message of Jesus Christ.</p></div> <div><h3 class="text-xl font-bold text-white mb-4">Core Values</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-white/5 rounded-lg p-4"><div class="text-lg font-medium text-white mb-2">🙏 Faith-Centered</div> <p class="text-gray-300 text-sm">All content should reflect Christian values and biblical principles.</p></div> <div class="bg-white/5 rounded-lg p-4"><div class="text-lg font-medium text-white mb-2">👨‍👩‍👧‍👦 Family-Friendly</div> <p class="text-gray-300 text-sm">Content should be appropriate for viewers of all ages in the family.</p></div> <div class="bg-white/5 rounded-lg p-4"><div class="text-lg font-medium text-white mb-2">⚡ High-Quality</div> <p class="text-gray-300 text-sm">We maintain high standards for both content quality and technical excellence.</p></div> <div class="bg-white/5 rounded-lg p-4"><div class="text-lg font-medium text-white mb-2">🌍 Global Impact</div> <p class="text-gray-300 text-sm">Content that reaches and transforms lives across cultures and communities.</p></div></div></div></div>`);
	$$renderer.push(`<!--]--></div></div></div></div>`);
}
//#endregion
export { _page as default };
