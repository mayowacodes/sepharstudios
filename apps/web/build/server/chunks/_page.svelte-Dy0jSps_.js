import { ah as attr, aR as stringify, ap as derived } from './ui-libs-BjzLDLAh.js';
import { A as Arrow_left } from './arrow-left-DITrNWiS.js';
import { P as Plus } from './plus-edw59QPA.js';
import { T as Tv } from './tv-DBoj9wtm.js';
import './toast-state.svelte-Cuuior_F.js';
import { p as page } from './state-D0xWVGEE.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './client-Bo2aevGq.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';

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
				actions});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-center text-muted-foreground py-12">Loading…</div>`);
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Dy0jSps_.js.map
