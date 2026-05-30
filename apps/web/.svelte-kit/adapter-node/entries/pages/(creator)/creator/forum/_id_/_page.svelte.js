import { Ct as unsubscribe_stores, bt as store_get, gt as ensure_array_like, jt as escape_html, kt as attr, mt as derived, ut as attr_class } from "../../../../../../chunks/ui-libs.js";
import "../../../../../../chunks/navigation.js";
import { t as page } from "../../../../../../chunks/stores.js";
//#region src/routes/(creator)/creator/forum/[id]/ForumReply.svelte
function ForumReply($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { reply, isAdmin, depth = 0, onReload } = $$props;
		function relativeTime(iso) {
			const diff = Date.now() - new Date(iso).getTime();
			if (diff < 6e4) return "just now";
			if (diff < 36e5) return `${Math.floor(diff / 6e4)}m`;
			if (diff < 864e5) return `${Math.floor(diff / 36e5)}h`;
			return `${Math.floor(diff / 864e5)}d`;
		}
		$$renderer.push(`<div${attr_class(`bg-white/5 border border-white/10 rounded-lg p-3 ${depth > 0 ? "ml-6" : ""}`)}><div class="flex items-start gap-3"><div class="bg-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold shrink-0">${escape_html((reply.authorName ?? "?").charAt(0).toUpperCase())}</div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 text-xs text-gray-400 mb-1"><strong class="text-purple-300">${escape_html(reply.authorName ?? "unknown")}</strong> <span>·</span> <span>${escape_html(relativeTime(reply.createdAt))}</span> `);
		if (reply.status === "hidden") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-yellow-400">(pending review)</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <p class="text-gray-100 text-sm whitespace-pre-line">${escape_html(reply.body)}</p> <div class="flex items-center gap-4 mt-2 text-xs"><button type="button"${attr_class(`flex items-center gap-1 hover:text-pink-300 transition-colors ${reply.likedByMe ? "text-pink-400" : "text-gray-400"}`)}><span>❤️</span><span>${escape_html(reply.likeCount)}</span></button> <button type="button" class="text-gray-400 hover:text-white">Reply</button> `);
		if (isAdmin || reply.status === "published") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="text-red-300 hover:text-red-100">Delete</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (reply.children.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-3 space-y-2"><!--[-->`);
			const each_array = ensure_array_like(reply.children);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let child = each_array[$$index];
				ForumReply($$renderer, {
					reply: child,
					isAdmin,
					depth: depth + 1,
					onReload
				});
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
//#region src/routes/(creator)/creator/forum/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let thread = null;
		let replies = [];
		let isAuthor = false;
		let isAdmin = false;
		let loading = true;
		let newReply = "";
		const threadId = derived(() => store_get($$store_subs ??= {}, "$page", page).params.id);
		async function load() {
			loading = true;
			try {
				const res = await fetch(`/api/forum/threads/${threadId()}`);
				if (!res.ok) {
					thread = null;
					return;
				}
				const body = await res.json();
				thread = body.thread;
				replies = body.replies;
				isAuthor = body.isAuthor;
				isAdmin = body.isAdmin;
			} finally {
				loading = false;
			}
		}
		function relativeTime(iso) {
			const diff = Date.now() - new Date(iso).getTime();
			if (diff < 6e4) return "just now";
			if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
			if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
			if (diff < 6048e5) return `${Math.floor(diff / 864e5)}d ago`;
			return new Date(iso).toLocaleDateString();
		}
		$$renderer.push(`<div class="max-w-4xl mx-auto py-6 space-y-6"><a href="/creator/forum" class="text-purple-400 hover:text-purple-300 text-sm">← Back to forum</a> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center text-gray-400 py-12">Loading…</div>`);
		} else if (!thread) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-red-600/20 border border-red-600 text-red-100 rounded-lg p-6 text-center">Thread not found or has been removed.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4"><div class="flex items-start justify-between gap-4"><div class="flex-1"><div class="flex items-center gap-2 flex-wrap mb-2">`);
			if (thread.isSticky) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-yellow-400">📌</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (thread.isLocked) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-red-400">🔒</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <h1 class="text-2xl font-bold text-white">${escape_html(thread.title)}</h1></div> <div class="flex items-center gap-3 text-xs text-gray-400"><span>by <strong class="text-purple-400">${escape_html(thread.authorName ?? "unknown")}</strong></span> <span>•</span> <span>${escape_html(relativeTime(thread.createdAt))}</span> <span>•</span> <span class="capitalize">${escape_html(thread.category.replace("-", " "))}</span></div></div> `);
			if (isAuthor || isAdmin) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="text-red-300 hover:text-red-100 text-sm">Delete</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <p class="text-gray-200 whitespace-pre-line">${escape_html(thread.body)}</p> <div class="flex items-center gap-4 text-sm"><button type="button"${attr_class(`flex items-center gap-1 hover:text-pink-300 transition-colors ${thread.likedByMe ? "text-pink-400" : "text-gray-300"}`)}><span>❤️</span> <span>${escape_html(thread.likeCount)}</span></button> <span class="text-gray-400 flex items-center gap-1"><span>💬</span><span>${escape_html(thread.replyCount)} ${escape_html(thread.replyCount === 1 ? "reply" : "replies")}</span></span></div></div> `);
			if (!thread.isLocked) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form class="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3"><label for="reply-body" class="text-sm font-medium text-white">Add a reply</label> <textarea id="reply-body" rows="3" minlength="3" maxlength="5000" required="" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500" placeholder="Share your thoughts…">`);
				const $$body = escape_html(newReply);
				if ($$body) $$renderer.push(`${$$body}`);
				$$renderer.push(`</textarea> `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="flex justify-end"><button type="submit"${attr("disabled", !newReply.trim(), true)} class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg">${escape_html("Reply")}</button></div></form>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="bg-red-600/10 border border-red-600/40 text-red-200 rounded-lg p-4 text-sm">🔒 This thread is locked. New replies are disabled.</div>`);
			}
			$$renderer.push(`<!--]--> `);
			if (replies.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-center text-gray-400 py-6">No replies yet — be the first.</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="space-y-3"><!--[-->`);
				const each_array = ensure_array_like(replies);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let reply = each_array[$$index];
					ForumReply($$renderer, {
						reply,
						isAdmin,
						onReload: load
					});
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
