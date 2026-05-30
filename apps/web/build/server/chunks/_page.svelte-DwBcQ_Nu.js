import { al as ensure_array_like, ab as attr_class, an as escape_html, aa as attr, aK as stringify } from './ui-libs-TtGtWAGI.js';
import './client-CZa6R-ON.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(creator)/creator/forum/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const categories = [
			{
				id: "all",
				title: "All Topics",
				icon: "💬",
				color: "purple"
			},
			{
				id: "getting-started",
				title: "Getting Started",
				icon: "🚀",
				color: "blue"
			},
			{
				id: "technical",
				title: "Technical Help",
				icon: "⚙️",
				color: "green"
			},
			{
				id: "content-creation",
				title: "Content Creation",
				icon: "🎬",
				color: "orange"
			},
			{
				id: "ministry",
				title: "Ministry & Faith",
				icon: "✝️",
				color: "yellow"
			},
			{
				id: "community",
				title: "Community",
				icon: "❤️",
				color: "red"
			}
		];
		let activeCategory = "all";
		let searchTerm = "";
		let sort = "latest";
		let threads = [];
		let page = 1;
		function categoryTitle(id) {
			return categories.find((c) => c.id === id)?.title ?? id;
		}
		function categoryColor(id) {
			return categories.find((c) => c.id === id)?.color ?? "gray";
		}
		function relativeTime(iso) {
			if (!iso) return "";
			const t = new Date(iso).getTime();
			const diff = Date.now() - t;
			if (diff < 6e4) return "just now";
			if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
			if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
			if (diff < 6048e5) return `${Math.floor(diff / 864e5)}d ago`;
			return new Date(iso).toLocaleDateString();
		}
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><h1 class="text-3xl font-bold text-white mb-2">Creator Community Forum</h1> <p class="text-gray-300">Connect, learn, and grow together with fellow faith-based creators</p></div> <button type="button" class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors">✍️ Start New Discussion</button></div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1 space-y-6"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-4"><h3 class="text-lg font-bold text-white mb-4">Categories</h3> <nav class="space-y-2"><!--[-->`);
		const each_array = ensure_array_like(categories);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let category = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeCategory === category.id ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`)}><span>${escape_html(category.icon)}</span> <span class="text-sm font-medium">${escape_html(category.title)}</span></button>`);
		}
		$$renderer.push(`<!--]--></nav></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4"><h3 class="text-lg font-bold text-white mb-4">Quick Links</h3> <div class="space-y-2"><a href="/creator/guidelines" class="block text-gray-300 hover:text-white text-sm">📋 Content Guidelines</a> <a href="/creator/tech-support" class="block text-gray-300 hover:text-white text-sm">🆘 Get Support</a> <a href="/creator/events" class="block text-gray-300 hover:text-white text-sm">📅 Upcoming Events</a></div></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4"><h3 class="text-sm font-bold text-white mb-2">💛 Community Guidelines</h3> <ul class="text-yellow-200 text-xs space-y-1"><li>• Be respectful and encouraging</li> <li>• Stay on topic and relevant</li> <li>• No spam or self-promotion</li> <li>• Share with love and grace</li> <li>• Pray for one another</li></ul></div></div> <div class="lg:col-span-3 space-y-6"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-4"><div class="flex flex-col md:flex-row gap-4"><div class="flex-1"><input type="text"${attr("value", searchTerm)} placeholder="Search discussions..." class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"/></div> <div class="flex gap-2">`);
		$$renderer.select({
			value: sort,
			onchange: () => {
				page = 1;
			},
			class: "px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
		}, ($$renderer) => {
			$$renderer.option({ value: "latest" }, ($$renderer) => {
				$$renderer.push(`Most Recent`);
			});
			$$renderer.option({ value: "top" }, ($$renderer) => {
				$$renderer.push(`Most Liked`);
			});
		});
		$$renderer.push(`</div></div></div> `);
		if (threads.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center text-gray-400 py-12">Loading discussions…</div>`);
		} else if (threads.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-white/5 border border-white/10 rounded-xl p-12 text-center"><p class="text-gray-300">No discussions yet in this category.</p> <button type="button" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Be the first to post</button></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-4"><!--[-->`);
			const each_array_1 = ensure_array_like(threads);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let thread = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/creator/forum/${thread.id}`)} class="block bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"><div class="flex items-start space-x-4"><div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold shrink-0">${escape_html((thread.authorName ?? "?").charAt(0).toUpperCase())}</div> <div class="flex-1"><div class="flex items-start justify-between gap-4"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1 flex-wrap">`);
				if (thread.isSticky) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-yellow-400" title="Pinned">📌</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (thread.isLocked) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-red-400" title="Locked">🔒</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <h3 class="text-lg font-medium text-white">${escape_html(thread.title)}</h3> <span${attr_class(`bg-${stringify(categoryColor(thread.category))}-600/40 text-${stringify(categoryColor(thread.category))}-100 text-xs px-2 py-1 rounded`)}>${escape_html(categoryTitle(thread.category))}</span></div> <p class="text-gray-300 text-sm mb-2 line-clamp-2">${escape_html(thread.body)}</p> <div class="flex items-center gap-3 text-xs text-gray-400"><span>by <strong class="text-purple-400">${escape_html(thread.authorName ?? "unknown")}</strong></span> <span>•</span> <span>${escape_html(relativeTime(thread.lastReplyAt ?? thread.createdAt))}</span></div></div> <div class="text-right space-y-1 shrink-0"><div class="flex items-center space-x-3 text-sm text-gray-400"><span class="flex items-center"><span class="mr-1">💬</span>${escape_html(thread.replyCount)}</span> <span class="flex items-center"><span class="mr-1">❤️</span>${escape_html(thread.likeCount)}</span></div></div></div></div></div></a>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex justify-center items-center gap-2"><button type="button"${attr("disabled", page <= 1, true)} class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white disabled:opacity-40">Previous</button> <span class="text-sm text-gray-400 px-2">Page ${escape_html(page)}</span> <button type="button"${attr("disabled", true, true)} class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white disabled:opacity-40">Next</button> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DwBcQ_Nu.js.map
