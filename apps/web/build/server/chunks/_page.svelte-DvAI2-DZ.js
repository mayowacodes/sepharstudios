import { aa as attr, al as ensure_array_like, an as escape_html } from './ui-libs-TtGtWAGI.js';
import './client-CZa6R-ON.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(creator)/creator/forum/new/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const categories = [
			{
				id: "getting-started",
				title: "Getting Started",
				icon: "🚀"
			},
			{
				id: "technical",
				title: "Technical Help",
				icon: "⚙️"
			},
			{
				id: "content-creation",
				title: "Content Creation",
				icon: "🎬"
			},
			{
				id: "ministry",
				title: "Ministry & Faith",
				icon: "✝️"
			},
			{
				id: "community",
				title: "Community",
				icon: "❤️"
			}
		];
		let title = "";
		let category = "";
		let body = "";
		let submitting = false;
		$$renderer.push(`<div class="max-w-3xl mx-auto py-8 space-y-6"><div><a href="/creator/forum" class="text-purple-400 hover:text-purple-300 text-sm">← Back to forum</a> <h1 class="text-3xl font-bold text-white mt-2">Start a New Discussion</h1> <p class="text-gray-300 text-sm mt-1">All posts are moderated by AI before publishing. Be kind and on-topic.</p></div> <form class="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4"><div><label for="thread-title" class="block text-white font-medium mb-2">Title *</label> <input id="thread-title" type="text"${attr("value", title)} minlength="5" maxlength="255" required="" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"/></div> <div><label for="thread-category" class="block text-white font-medium mb-2">Category *</label> `);
		$$renderer.select({
			id: "thread-category",
			value: category,
			required: true,
			class: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`Choose a category`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(categories);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let cat = each_array[$$index];
				$$renderer.option({ value: cat.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(cat.icon)} ${escape_html(cat.title)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div><label for="thread-body" class="block text-white font-medium mb-2">Body *</label> <textarea id="thread-body" rows="8" minlength="20" maxlength="10000" required="" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500" placeholder="Share your question, idea, or testimony…">`);
		const $$body = escape_html(body);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex justify-end gap-2"><button type="button" class="px-4 py-2 text-gray-300 hover:text-white">Cancel</button> <button type="submit"${attr("disabled", submitting, true)} class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium">${escape_html("Post Discussion")}</button></div></form></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DvAI2-DZ.js.map
