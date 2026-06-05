import { At as stringify, Lt as attr, St as derived } from "../../../../../../../chunks/ui-libs.js";
import { t as Arrow_left } from "../../../../../../../chunks/arrow-left.js";
import { t as Plus } from "../../../../../../../chunks/plus.js";
import { t as Tv } from "../../../../../../../chunks/tv.js";
import "../../../../../../../chunks/toast-state.svelte.js";
import { t as page } from "../../../../../../../chunks/state.js";
import { t as PageHeader } from "../../../../../../../chunks/PageHeader.js";
//#region src/routes/(creator)/creator/content/[id]/episodes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const showId = derived(() => page.params.id);
		let episodes = [];
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
				$$renderer.push(`<button type="button" class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium inline-flex items-center gap-1 transition-opacity">`);
				Plus($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Add episode</button>`);
			}
			PageHeader($$renderer, {
				icon: Tv,
				title: "Episodes",
				subtitle: `${stringify(episodes.length)} ${episodes.length === 1 ? "episode" : "episodes"} across ${stringify(grouped().length)} ${grouped().length === 1 ? "season" : "seasons"}.`,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-center text-muted-foreground py-12">Loading…</div>`);
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
