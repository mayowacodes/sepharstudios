import { as as ensure_array_like, ai as attr_class, au as escape_html, ah as attr, aR as stringify, aO as spread_props } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { P as Plus } from './plus-edw59QPA.js';
import './client-Bo2aevGq.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/messages-square.svelte
function Messages_square($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "messages-square" },
		props,
		{ iconNode: [["path", { "d": "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }], ["path", { "d": "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1" }]] }
	]));
}
//#endregion
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
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button type="button" class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium inline-flex items-center gap-1 transition-opacity">`);
				Plus($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> New discussion</button>`);
			}
			PageHeader($$renderer, {
				icon: Messages_square,
				title: "Community Forum",
				subtitle: "Connect, learn, and grow with fellow faith-based creators.",
				actions});
		}
		$$renderer.push(`<!----> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1 space-y-6"><div class="surface-2 backdrop-blur-sm rounded-xl p-4"><h3 class="text-lg font-bold text-foreground mb-4">Categories</h3> <nav class="space-y-2"><!--[-->`);
		const each_array = ensure_array_like(categories);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let category = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeCategory === category.id ? "bg-purple-600 text-foreground" : "text-foreground/80 hover:text-white hover:surface-2"}`)}><span>${escape_html(category.icon)}</span> <span class="text-sm font-medium">${escape_html(category.title)}</span></button>`);
		}
		$$renderer.push(`<!--]--></nav></div> <div class="surface-2 backdrop-blur-sm rounded-xl p-4"><h3 class="text-lg font-bold text-foreground mb-4">Quick Links</h3> <div class="space-y-2"><a href="/creator/guidelines" class="block text-foreground/80 hover:text-foreground text-sm">📋 Content Guidelines</a> <a href="/creator/tech-support" class="block text-foreground/80 hover:text-foreground text-sm">🆘 Get Support</a> <a href="/creator/events" class="block text-foreground/80 hover:text-foreground text-sm">📅 Upcoming Events</a></div></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4"><h3 class="text-sm font-bold text-foreground mb-2">💛 Community Guidelines</h3> <ul class="text-yellow-200 text-xs space-y-1"><li>• Be respectful and encouraging</li> <li>• Stay on topic and relevant</li> <li>• No spam or self-promotion</li> <li>• Share with love and grace</li> <li>• Pray for one another</li></ul></div></div> <div class="lg:col-span-3 space-y-6"><div class="surface-2 backdrop-blur-sm rounded-xl p-4"><div class="flex flex-col md:flex-row gap-4"><div class="flex-1"><input type="text"${attr("value", searchTerm)} placeholder="Search discussions..." class="w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-purple-500"/></div> <div class="flex gap-2">`);
		$$renderer.select({
			value: sort,
			onchange: () => {
				page = 1;
			},
			class: "px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none"
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
			$$renderer.push(`<div class="text-center text-muted-foreground py-12">Loading discussions…</div>`);
		} else if (threads.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="surface-1 border border-border/40 rounded-xl p-12 text-center"><p class="text-foreground/80">No discussions yet in this category.</p> <button type="button" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Be the first to post</button></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-4"><!--[-->`);
			const each_array_1 = ensure_array_like(threads);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let thread = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/creator/forum/${thread.id}`)} class="block surface-2 backdrop-blur-sm rounded-xl p-6 hover:surface-3 transition-colors"><div class="flex items-start space-x-4"><div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold shrink-0">${escape_html((thread.authorName ?? "?").charAt(0).toUpperCase())}</div> <div class="flex-1"><div class="flex items-start justify-between gap-4"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1 flex-wrap">`);
				if (thread.isSticky) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-yellow-400" title="Pinned">📌</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (thread.isLocked) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-red-400" title="Locked">🔒</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <h3 class="text-lg font-medium text-foreground">${escape_html(thread.title)}</h3> <span${attr_class(`bg-${stringify(categoryColor(thread.category))}-600/40 text-${stringify(categoryColor(thread.category))}-100 text-xs px-2 py-1 rounded`)}>${escape_html(categoryTitle(thread.category))}</span></div> <p class="text-foreground/80 text-sm mb-2 line-clamp-2">${escape_html(thread.body)}</p> <div class="flex items-center gap-3 text-xs text-muted-foreground"><span>by <strong class="text-purple-400">${escape_html(thread.authorName ?? "unknown")}</strong></span> <span>•</span> <span>${escape_html(relativeTime(thread.lastReplyAt ?? thread.createdAt))}</span></div></div> <div class="text-right space-y-1 shrink-0"><div class="flex items-center space-x-3 text-sm text-muted-foreground"><span class="flex items-center"><span class="mr-1">💬</span>${escape_html(thread.replyCount)}</span> <span class="flex items-center"><span class="mr-1">❤️</span>${escape_html(thread.likeCount)}</span></div></div></div></div></div></a>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex justify-center items-center gap-2"><button type="button"${attr("disabled", page <= 1, true)} class="px-3 py-2 surface-2 rounded-lg text-foreground/80 hover:text-foreground disabled:opacity-40">Previous</button> <span class="text-sm text-muted-foreground px-2">Page ${escape_html(page)}</span> <button type="button"${attr("disabled", true, true)} class="px-3 py-2 surface-2 rounded-lg text-foreground/80 hover:text-foreground disabled:opacity-40">Next</button> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BBjEnTU9.js.map
