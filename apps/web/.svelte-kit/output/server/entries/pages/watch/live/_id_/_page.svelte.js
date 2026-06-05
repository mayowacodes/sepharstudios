import { Lt as attr, St as derived, Tt as head, mt as onDestroy, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import "../../../../../chunks/circle-check.js";
import "../../../../../chunks/eye-off.js";
import { t as Eye } from "../../../../../chunks/eye.js";
import "../../../../../chunks/pin.js";
import { t as Radio } from "../../../../../chunks/radio.js";
import { t as Send } from "../../../../../chunks/send.js";
import "../../../../../chunks/trash-2.js";
import "../../../../../chunks/live-region.js";
import { t as VideoPlayer } from "../../../../../chunks/VideoPlayer.js";
//#region src/lib/components/widgets/LiveChatPanel.svelte
function LiveChatPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** True when the signed-in user can moderate (creator or admin). */
		let { streamId, canModerate = false } = $$props;
		let messages = [];
		let composeText = "";
		derived(() => {
			const filtered = messages.filter((m) => m.status !== "removed" && (canModerate || m.status === "published"));
			const pinned = filtered.filter((m) => m.pinned);
			const rest = filtered.filter((m) => !m.pinned);
			return [...pinned, ...rest];
		});
		const pendingCount = derived(() => canModerate ? messages.filter((m) => m.status === "pending").length : 0);
		onDestroy(() => {});
		$$renderer.push(`<aside class="surface-1 rounded-xl flex flex-col h-full max-h-[600px]" aria-label="Live chat"><header class="px-3 py-2 border-b border-white/10 text-xs font-semibold text-white flex items-center gap-2"><span>Live chat</span> `);
		if (canModerate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-purple-300">· moderator</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (pendingCount() > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="ml-auto inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors"${attr("aria-label", `${pendingCount()} message${pendingCount() === 1 ? "" : "s"} pending review`)}>${escape_html(pendingCount())} pending</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></header> <div class="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-xs text-gray-500 text-center py-6">Loading…</div>`);
		$$renderer.push(`<!--]--></div> <footer class="border-t border-white/10 p-2"><div class="relative"><input type="text"${attr("value", composeText)} maxlength="280" placeholder="Say something…" class="w-full surface-2 rounded-lg pl-3 pr-9 py-2 text-xs text-white placeholder-gray-500" aria-label="Chat message"/> <button type="button"${attr("disabled", !composeText.trim(), true)} class="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-200 disabled:opacity-40" aria-label="Send">`);
		Send($$renderer, {
			class: "w-4 h-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button></div></footer></aside>`);
	});
}
//#endregion
//#region src/routes/watch/live/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		let status = data.stream.status;
		let viewerCount = data.stream.viewerCount;
		let playbackUrl = data.stream.playbackUrl;
		let recordingMediaId = data.stream.recordingMediaId;
		const hasRecording = derived(() => status === "ended" && !!recordingMediaId);
		const recordingHref = derived(() => recordingMediaId ? `/watch/${recordingMediaId}` : "#");
		onDestroy(() => {});
		head("1vm1o6z", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.stream.title)} — Sephar Studios LIVE</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-[#0b0c10] text-white"><div class="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 grid gap-4 lg:grid-cols-[1fr_360px]"><div><div class="w-full bg-black aspect-video max-h-[80vh] relative rounded-xl overflow-hidden">`);
		if (status === "live" && playbackUrl) {
			$$renderer.push("<!--[0-->");
			VideoPlayer($$renderer, {
				src: playbackUrl,
				title: data.stream.title,
				contentId: data.stream.id
			});
			$$renderer.push(`<!----> <div class="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white text-xs uppercase tracking-wider px-2 py-1 rounded">`);
			Radio($$renderer, { class: "w-3 h-3 animate-pulse" });
			$$renderer.push(`<!----> LIVE</div> <div class="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded inline-flex items-center gap-1">`);
			Eye($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> ${escape_html(viewerCount.toLocaleString())}</div>`);
		} else if (status === "idle" || status === "ingest") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">`);
			Radio($$renderer, {
				class: "w-10 h-10 animate-pulse",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <p class="text-sm">Stream is starting…</p></div>`);
		} else if (status === "ended" && hasRecording()) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<a${attr("href", recordingHref())} class="w-full h-full flex flex-col items-center justify-center text-purple-200 gap-3 hover:bg-white/5 transition-colors">`);
			if (data.stream.thumbnailUrl) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<img${attr("src", data.stream.thumbnailUrl)} alt="" class="max-h-40 rounded-lg shadow-2xl"/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <p class="text-base font-semibold">Watch the recording →</p> <p class="text-xs text-zinc-400">This live broadcast ended. The replay is available now.</p></a>`);
		} else if (status === "ended") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<div class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">`);
			Radio($$renderer, {
				class: "w-10 h-10",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <p class="text-sm">This stream has ended.</p> `);
			if (data.isOwner) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-xs text-zinc-500">Recording will appear here once processing finishes.</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="w-full h-full flex flex-col items-center justify-center text-red-300 gap-2">`);
			Radio($$renderer, {
				class: "w-10 h-10",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <p class="text-sm">Stream is currently offline.</p></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-4"><h1 class="text-2xl font-bold text-white">${escape_html(data.stream.title)}</h1> <p class="text-sm text-zinc-400 mt-1">${escape_html(data.stream.creatorName ?? "Creator")}</p> `);
		if (data.stream.description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-zinc-300 leading-relaxed mt-4">${escape_html(data.stream.description)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="lg:sticky lg:top-4 lg:self-start h-[600px] lg:h-[calc(100vh-2rem)] lg:max-h-[760px]">`);
		LiveChatPanel($$renderer, {
			streamId: data.stream.id,
			canModerate: data.canModerateChat
		});
		$$renderer.push(`<!----></div></div></div>`);
	});
}
//#endregion
export { _page as default };
