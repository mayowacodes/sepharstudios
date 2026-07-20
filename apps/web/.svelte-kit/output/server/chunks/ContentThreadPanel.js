import { Et as derived, Ht as attr, Wt as escape_html, vt as onDestroy } from "./ui-libs.js";
import "./Icon.js";
import { t as Message_square } from "./message-square.js";
import { t as Send } from "./send.js";
import "./toast-state.svelte.js";
import "./live-region.js";
//#endregion
//#region src/lib/components/widgets/ContentThreadPanel.svelte
function ContentThreadPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** 'admin' renders the admin variant (admin on right, creator on left).
		*  'creator' renders the creator variant (creator on right, admin on left). */
		let { contentId, variant } = $$props;
		let messages = [];
		let composeText = "";
		derived(() => variant === "admin" ? `/api/admin/content/${contentId}/thread` : `/api/creator/content/${contentId}/thread`);
		let sse = null;
		onDestroy(() => {
			if (sse) {
				sse.close();
				sse = null;
			}
		});
		$$renderer.push(`<div class="surface-1 rounded-xl flex flex-col" style="min-height: 360px; max-height: 600px;"><header class="px-4 py-3 border-b border-white/10 flex items-center gap-2">`);
		Message_square($$renderer, { class: "w-4 h-4 text-purple-300" });
		$$renderer.push(`<!----> <h3 class="text-sm font-semibold text-white">${escape_html(variant === "admin" ? "Discussion with creator" : "Notes from admin")}</h3> `);
		if (messages.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-xs text-gray-500 ml-auto">${escape_html(messages.length)} message${escape_html(messages.length === 1 ? "" : "s")}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></header> <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-center text-gray-400 text-sm py-8">Loading…</div>`);
		$$renderer.push(`<!--]--></div> <footer class="border-t border-white/10 p-3 space-y-2"><textarea${attr("placeholder", variant === "admin" ? "Write a note to the creator…" : "Reply to admin…")} rows="2" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500">`);
		const $$body = escape_html(composeText);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> <div class="flex items-center justify-between"><span class="text-[11px] text-gray-500">Ctrl + Enter to send</span> <button type="button"${attr("disabled", !composeText.trim(), true)} class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm">`);
		Send($$renderer, { class: "w-3.5 h-3.5" });
		$$renderer.push(`<!----> ${escape_html("Send")}</button></div></footer></div>`);
	});
}
//#endregion
export { ContentThreadPanel as t };
