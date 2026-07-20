import { Et as derived, Ht as attr, Ot as ensure_array_like, St as attr_class, Wt as escape_html } from "../../../../../../chunks/ui-libs.js";
import { t as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { t as Heart } from "../../../../../../chunks/heart.js";
import { t as Lock } from "../../../../../../chunks/lock.js";
import { t as Message_square } from "../../../../../../chunks/message-square.js";
import { t as Pin } from "../../../../../../chunks/pin.js";
import { t as page } from "../../../../../../chunks/state.js";
import "../../../../../../chunks/navigation.js";
import { t as ReportButton } from "../../../../../../chunks/ReportButton.js";
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
		$$renderer.push(`<div${attr_class(`surface-1 border border-border/40 rounded-lg p-3 ${depth > 0 ? "ml-6" : ""}`)}><div class="flex items-start gap-3"><div class="bg-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold shrink-0">${escape_html((reply.authorName ?? "?").charAt(0).toUpperCase())}</div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 text-xs text-muted-foreground mb-1"><strong class="text-purple-300">${escape_html(reply.authorName ?? "unknown")}</strong> <span>·</span> <span>${escape_html(relativeTime(reply.createdAt))}</span> `);
		if (reply.status === "hidden") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-yellow-400">(pending review)</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <p class="text-foreground text-sm whitespace-pre-line">${escape_html(reply.body)}</p> <div class="flex items-center gap-4 mt-2 text-xs"><button type="button"${attr_class(`flex items-center gap-1 hover:text-pink-300 transition-colors ${reply.likedByMe ? "text-pink-400" : "text-muted-foreground"}`)}><span>❤️</span><span>${escape_html(reply.likeCount)}</span></button> <button type="button" class="text-muted-foreground hover:text-foreground">Reply</button> `);
		if (isAdmin || reply.status === "published") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="text-red-300 hover:text-red-100">Delete</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		ReportButton($$renderer, {
			targetType: "forum_reply",
			targetId: reply.id,
			variant: "button"
		});
		$$renderer.push(`<!----></div> `);
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
		let thread = null;
		let replies = [];
		let isAuthor = false;
		let isAdmin = false;
		let loading = true;
		let newReply = "";
		const threadId = derived(() => page.params.id);
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
		$$renderer.push(`<div class="container mx-auto max-w-4xl py-6 px-4 space-y-6"><a href="/creator/forum" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> Back to forum</a> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center text-muted-foreground py-12">Loading…</div>`);
		} else if (!thread) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-red-600/20 border border-red-600 text-red-100 rounded-lg p-6 text-center">Thread not found or has been removed.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<header class="surface-1 rounded-xl p-5 space-y-4"><div class="flex items-start justify-between gap-4"><div class="flex-1 min-w-0"><div class="flex items-center gap-1.5 flex-wrap mb-1">`);
			if (thread.isSticky) {
				$$renderer.push("<!--[0-->");
				Pin($$renderer, {
					class: "w-3.5 h-3.5 text-yellow-500",
					"aria-label": "Pinned"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (thread.isLocked) {
				$$renderer.push("<!--[0-->");
				Lock($$renderer, {
					class: "w-3.5 h-3.5 text-red-500",
					"aria-label": "Locked"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <h1 class="text-2xl font-semibold tracking-tight text-foreground">${escape_html(thread.title)}</h1> <div class="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 flex-wrap"><span>by <strong class="text-foreground">${escape_html(thread.authorName ?? "unknown")}</strong></span> <span>·</span> <span>${escape_html(relativeTime(thread.createdAt))}</span> <span>·</span> <span class="capitalize rounded-full surface-2 px-2 py-0.5">${escape_html(thread.category.replace("-", " "))}</span></div></div> <div class="flex items-center gap-2 shrink-0">`);
			if (!isAuthor) {
				$$renderer.push("<!--[0-->");
				ReportButton($$renderer, {
					targetType: "forum_thread",
					targetId: thread.id,
					variant: "button"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (isAuthor || isAdmin) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="text-xs text-red-400 hover:text-red-300">Delete</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <p class="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">${escape_html(thread.body)}</p> <div class="flex items-center gap-4 text-xs"><button type="button"${attr_class(`inline-flex items-center gap-1 hover:opacity-80 transition-opacity ${thread.likedByMe ? "text-pink-500" : "text-muted-foreground"}`)}>`);
			Heart($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----> ${escape_html(thread.likeCount)}</button> <span class="text-muted-foreground inline-flex items-center gap-1">`);
			Message_square($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----> ${escape_html(thread.replyCount)} ${escape_html(thread.replyCount === 1 ? "reply" : "replies")}</span></div></header> `);
			if (!thread.isLocked) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form class="surface-2 backdrop-blur-sm rounded-xl p-4 space-y-3"><label for="reply-body" class="text-sm font-medium text-foreground">Add a reply</label> <textarea id="reply-body" rows="3" minlength="3" maxlength="5000" required="" class="w-full px-3 py-2 surface-2 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-purple-500" placeholder="Share your thoughts…">`);
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
				$$renderer.push(`<div class="text-center text-muted-foreground py-6">No replies yet — be the first.</div>`);
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
	});
}
//#endregion
export { _page as default };
