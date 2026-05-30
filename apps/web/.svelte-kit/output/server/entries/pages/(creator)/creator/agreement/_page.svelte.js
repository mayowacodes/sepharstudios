import { gt as ensure_array_like, jt as escape_html, ut as attr_class } from "../../../../../chunks/ui-libs.js";
//#region src/routes/(creator)/creator/agreement/+page.svelte
function _page($$renderer) {
	let activeSection = "overview";
	const sections = [
		{
			id: "overview",
			title: "Agreement Overview",
			icon: "📋"
		},
		{
			id: "content-standards",
			title: "Content Standards",
			icon: "✝️"
		},
		{
			id: "rights-responsibilities",
			title: "Rights & Responsibilities",
			icon: "⚖️"
		},
		{
			id: "monetization",
			title: "Monetization Terms",
			icon: "💰"
		},
		{
			id: "intellectual-property",
			title: "Intellectual Property",
			icon: "©️"
		},
		{
			id: "community-guidelines",
			title: "Community Guidelines",
			icon: "👥"
		}
	];
	$$renderer.push(`<div class="space-y-6"><div><h1 class="text-3xl font-bold text-white mb-2">Creator Agreement</h1> <p class="text-gray-300">Terms and conditions for content creators on Sephar Studios</p></div> `);
	$$renderer.push("<!--[-1-->");
	$$renderer.push(`<div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4"><div class="flex items-center"><span class="text-2xl mr-3">⚠️</span> <div><h3 class="text-lg font-bold text-white">Agreement Required</h3> <p class="text-yellow-200">Please review and accept our Creator Agreement to continue using creator features.</p></div></div></div>`);
	$$renderer.push(`<!--]--> <div class="text-center text-gray-400 text-sm">Last updated: January 15, 2024 | Version 2.1</div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 sticky top-6"><nav class="space-y-2"><!--[-->`);
	const each_array = ensure_array_like(sections);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let section = each_array[$$index];
		$$renderer.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeSection === section.id ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`)}><span>${escape_html(section.icon)}</span> <span class="text-sm font-medium">${escape_html(section.title)}</span></button>`);
	}
	$$renderer.push(`<!--]--></nav> `);
	$$renderer.push("<!--[0-->");
	$$renderer.push(`<div class="mt-6 pt-6 border-t border-white/20"><button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm mb-3">${escape_html("View")} Full Agreement</button> <button class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm">Accept Agreement</button></div>`);
	$$renderer.push(`<!--]--></div></div> <div class="lg:col-span-3"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
	$$renderer.push("<!--[0-->");
	$$renderer.push(`<div class="space-y-6"><div><h2 class="text-2xl font-bold text-white mb-4">Creator Agreement Overview</h2> <p class="text-gray-300 mb-4">Welcome to Sephar Studios! This Creator Agreement outlines the terms and conditions for content creators
                using our faith-based streaming platform. By creating and uploading content, you agree to these terms.</p></div> <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4"><h3 class="text-lg font-bold text-white mb-2 flex items-center"><span class="mr-2">🎯</span> Our Mission</h3> <p class="text-blue-200">Sephar Studios exists to provide a safe, inspiring platform where Christian creators can share their
                God-given talents and stories to reach hearts worldwide with the message of Jesus Christ.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-white/5 rounded-lg p-4"><h4 class="font-medium text-white mb-2 flex items-center"><span class="mr-2">✅</span> What We Provide</h4> <ul class="text-gray-300 text-sm space-y-1"><li>• Global streaming platform</li> <li>• Content hosting and delivery</li> <li>• Analytics and insights</li> <li>• Creator community and support</li> <li>• Monetization opportunities</li> <li>• Technical infrastructure</li></ul></div> <div class="bg-white/5 rounded-lg p-4"><h4 class="font-medium text-white mb-2 flex items-center"><span class="mr-2">🤝</span> What We Expect</h4> <ul class="text-gray-300 text-sm space-y-1"><li>• Faith-based, family-friendly content</li> <li>• Adherence to community guidelines</li> <li>• Original or properly licensed material</li> <li>• Respectful interaction with community</li> <li>• Compliance with technical standards</li> <li>• Commitment to Christian values</li></ul></div></div> <div class="bg-green-600/20 border border-green-600 rounded-lg p-4"><h3 class="text-lg font-bold text-white mb-2 flex items-center"><span class="mr-2">⭐</span> Creator Benefits</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><div class="text-green-200 font-medium">Platform Features</div> <ul class="text-green-200 text-sm space-y-1"><li>• Unlimited uploads</li> <li>• 4K video support</li> <li>• Live streaming</li> <li>• Custom thumbnails</li></ul></div> <div><div class="text-green-200 font-medium">Growth Tools</div> <ul class="text-green-200 text-sm space-y-1"><li>• Detailed analytics</li> <li>• Audience insights</li> <li>• SEO optimization</li> <li>• Cross-promotion</li></ul></div> <div><div class="text-green-200 font-medium">Support &amp; Community</div> <ul class="text-green-200 text-sm space-y-1"><li>• 24/7 technical support</li> <li>• Creator workshops</li> <li>• Networking events</li> <li>• Ministry resources</li></ul></div></div></div> <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4"><h3 class="text-lg font-bold text-white mb-2">📜 Key Agreement Points</h3> <ul class="text-purple-200 text-sm space-y-2"><li>• You retain ownership of your original content</li> <li>• We reserve the right to review and moderate content</li> <li>• Content must align with Christian values and our guidelines</li> <li>• We provide platform services, you create amazing content</li> <li>• Both parties can terminate the agreement with proper notice</li> <li>• Disputes are resolved through Christian mediation when possible</li></ul></div></div>`);
	$$renderer.push(`<!--]--></div></div></div> `);
	$$renderer.push("<!--[0-->");
	$$renderer.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><h3 class="text-xl font-bold text-white mb-4">Ready to Join Our Creator Community?</h3> <p class="text-gray-300 mb-6">By accepting this agreement, you're committing to help us build a platform that honors God
        and serves the global Christian community.</p> <div class="flex flex-col md:flex-row gap-4 justify-center"><button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">📄 Download Full Agreement (PDF)</button> <button class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium">✅ I Accept the Creator Agreement</button></div> <p class="text-xs text-gray-400 mt-4">By clicking "I Accept", you agree to abide by all terms and conditions outlined in this agreement.</p></div>`);
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
export { _page as default };
