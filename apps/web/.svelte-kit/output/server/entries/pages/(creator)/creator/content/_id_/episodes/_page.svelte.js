import { Et as derived, Ht as attr, Pt as stringify, Wt as escape_html } from "../../../../../../../chunks/ui-libs.js";
import { t as Arrow_left } from "../../../../../../../chunks/arrow-left.js";
import { t as Plus } from "../../../../../../../chunks/plus.js";
import { t as Tv } from "../../../../../../../chunks/tv.js";
import "../../../../../../../chunks/toast-state.svelte.js";
import { t as page } from "../../../../../../../chunks/state.js";
import { t as PortalHero } from "../../../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../../../chunks/PortalButton.js";
//#region src/routes/(creator)/creator/content/[id]/episodes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const showId = derived(() => page.params.id);
		let episodes = [];
		let dialogOpen = false;
		let editingId = null;
		let form = {
			seasonNumber: 1,
			episodeNumber: 1,
			title: "",
			description: "",
			thumbnail: "",
			videoUrl: "",
			duration: "",
			airDate: ""
		};
		function openCreate() {
			editingId = null;
			form = {
				seasonNumber: 1,
				episodeNumber: episodes.filter((e) => e.seasonNumber === 1).length + 1,
				title: "",
				description: "",
				thumbnail: "",
				videoUrl: "",
				duration: "",
				airDate: ""
			};
			dialogOpen = true;
		}
		const grouped = derived(() => {
			const map = /* @__PURE__ */ new Map();
			for (const e of episodes) {
				if (!map.has(e.seasonNumber)) map.set(e.seasonNumber, []);
				map.get(e.seasonNumber).push(e);
			}
			return Array.from(map.entries()).sort(([a], [b]) => a - b);
		});
		$$renderer.push(`<div class="container mx-auto py-8 px-4 space-y-6"><a${attr("href", `/creator/content/${showId()}`)} class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> Back to show</a> `);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: openCreate,
					children: ($$renderer) => {
						Plus($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Add episode`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Series",
				title: "Episodes",
				subtitle: `${stringify(episodes.length)} ${episodes.length === 1 ? "episode" : "episodes"} across ${stringify(grouped().length)} ${grouped().length === 1 ? "season" : "seasons"}.`,
				icon: Tv,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-center text-muted-foreground py-12">Loading…</div>`);
		$$renderer.push(`<!--]--></div> `);
		if (dialogOpen) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" role="presentation"><div class="bg-zinc-900 border border-border/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4" role="dialog" aria-modal="true" tabindex="-1"><h2 class="text-xl font-bold text-foreground">${escape_html(editingId ? "Edit episode" : "Add episode")}</h2> <div class="grid grid-cols-2 gap-3"><div><label for="ep-season" class="block text-xs text-foreground/80 mb-1">Season #</label> <input id="ep-season" type="number" min="1"${attr("value", form.seasonNumber)} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"/></div> <div><label for="ep-num" class="block text-xs text-foreground/80 mb-1">Episode #</label> <input id="ep-num" type="number" min="1"${attr("value", form.episodeNumber)} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"/></div></div> <div><label for="ep-title" class="block text-xs text-foreground/80 mb-1">Title *</label> <input id="ep-title"${attr("value", form.title)} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"/></div> <div><label for="ep-desc" class="block text-xs text-foreground/80 mb-1">Description</label> <textarea id="ep-desc" rows="3" class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground">`);
			const $$body = escape_html(form.description);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div> <div class="grid grid-cols-2 gap-3"><div><label for="ep-dur" class="block text-xs text-foreground/80 mb-1">Duration</label> <input id="ep-dur"${attr("value", form.duration)} placeholder="e.g. 42m" class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"/></div> <div><label for="ep-air" class="block text-xs text-foreground/80 mb-1">Air date</label> <input id="ep-air" type="date"${attr("value", form.airDate)} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"/></div></div> <div><div class="text-xs text-foreground/80 mb-1">Thumbnail</div> `);
			if (form.thumbnail) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<img${attr("src", form.thumbnail)} alt="" class="w-32 h-20 object-cover rounded mb-2"/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <label class="inline-block"><input type="file" accept="image/*" class="hidden"/> <span class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded">${escape_html(form.thumbnail ? "Replace thumbnail" : "Upload thumbnail")}</span></label></div> <div><div class="text-xs text-foreground/80 mb-1">Video file</div> `);
			if (form.videoUrl) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-xs text-green-400 mb-2">✓ Video uploaded</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <label class="inline-block"><input type="file" accept="video/*" class="hidden"/> <span class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded">${escape_html(form.videoUrl ? "Replace video" : "Upload video")}</span></label> <p class="text-xs text-muted-foreground mt-1">Episode videos skip the full encoder pipeline — uploads directly to storage.</p></div> <div class="flex justify-end gap-2 border-t border-border/40 pt-4"><button type="button" class="px-4 py-2 text-foreground/80 hover:text-foreground text-sm">Cancel</button> <button type="button" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">${escape_html(editingId ? "Save changes" : "Add episode")}</button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
