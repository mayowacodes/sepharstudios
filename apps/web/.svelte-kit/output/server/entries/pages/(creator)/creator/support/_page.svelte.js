import { Dt as spread_props, jt as unsubscribe_stores, vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import "../../../../../chunks/WalletConnect.js";
import "../../../../../chunks/navigation.js";
import "../../../../../chunks/button.js";
import "../../../../../chunks/badge.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import "../../../../../chunks/card.js";
import "../../../../../chunks/wallet2.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/life-buoy.svelte
function Life_buoy($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "life-buoy" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["path", { "d": "m4.93 4.93 4.24 4.24" }],
			["path", { "d": "m14.83 9.17 4.24-4.24" }],
			["path", { "d": "m14.83 14.83 4.24 4.24" }],
			["path", { "d": "m9.17 14.83-4.24 4.24" }],
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "4"
			}]
		] }
	]));
}
//#endregion
//#region src/routes/(creator)/creator/support/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let activeSection = "overview";
		const sections = [
			{
				id: "overview",
				title: "Support Overview",
				icon: "🆘"
			},
			{
				id: "getting-started",
				title: "Getting Started",
				icon: "🚀"
			},
			{
				id: "web3-help",
				title: "Web3 & STC Help",
				icon: "🔗"
			},
			{
				id: "technical",
				title: "Technical Issues",
				icon: "⚙️"
			},
			{
				id: "content",
				title: "Content Guidelines",
				icon: "📝"
			},
			{
				id: "monetization",
				title: "Monetization",
				icon: "💰"
			},
			{
				id: "contact",
				title: "Contact Support",
				icon: "📞"
			}
		];
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		PageHeader($$renderer, {
			icon: Life_buoy,
			title: "Creator Support",
			subtitle: "Get help with your creator journey on Sephar Studios."
		});
		$$renderer.push(`<!----> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1"><div class="surface-2 backdrop-blur-sm rounded-xl p-4 sticky top-6"><nav class="space-y-2"><!--[-->`);
		const each_array = ensure_array_like(sections);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let section = each_array[$$index];
			$$renderer.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeSection === section.id ? "bg-purple-600 text-foreground" : "text-foreground/80 hover:text-white hover:surface-2"}`)}><span>${escape_html(section.icon)}</span> <span class="text-sm font-medium">${escape_html(section.title)}</span></button>`);
		}
		$$renderer.push(`<!--]--></nav></div></div> <div class="lg:col-span-3"><div class="surface-2 backdrop-blur-sm rounded-xl p-6">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="space-y-6"><div><h2 class="text-2xl font-bold text-foreground mb-4">Welcome to Creator Support</h2> <p class="text-foreground/80 mb-4">We're here to help you succeed on the Sephar Studios platform. Find answers to common questions,
                get technical support, and learn best practices for creating impactful faith-based content.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">📚</span> Knowledge Base</h3> <p class="text-blue-200 mb-3">Comprehensive guides and tutorials for all aspects of content creation.</p> <button class="text-blue-300 hover:text-blue-100 font-medium">Browse Articles →</button></div> <div class="bg-green-600/20 border border-green-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">🎯</span> Quick Help</h3> <p class="text-green-200 mb-3">Get instant answers to the most frequently asked questions.</p> <button class="text-green-300 hover:text-green-100 font-medium">View FAQ →</button></div> <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">💬</span> Community Forum</h3> <p class="text-purple-200 mb-3">Connect with other creators and share experiences.</p> <a href="/creator/forum" class="text-purple-300 hover:text-purple-100 font-medium">Join Discussion →</a></div> <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">🛠️</span> Technical Support</h3> <p class="text-orange-200 mb-3">Get personalized help from our support team.</p> <button class="text-orange-300 hover:text-orange-100 font-medium">Submit Ticket →</button></div></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">⏰</span> Support Hours</h3> <div class="text-yellow-200"><p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p> <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p> <p><strong>Sunday:</strong> Closed (Emergency support available)</p> <p class="mt-2"><strong>Average Response Time:</strong> 2-4 hours during business hours</p></div></div></div>`);
		$$renderer.push(`<!--]--></div></div></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
