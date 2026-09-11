import { i as attr, q as escape_html, b as ensure_array_like } from './index.js-CxPEndTa.js';
import { R as Radio } from './radio-BrUYmf9r.js';
import { S as Skeleton } from './skeleton-C99_WNvK.js';
import { P as PortalHero } from './PortalHero-zB8z9paY.js';
import './Icon-Bw1rnKTC.js';
import './utils2-DZI6czOR.js';

//#region src/routes/(creator)/creator/live/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let creating = false;
		let newTitle = "";
		let newDescription = "";
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-4xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Broadcast",
			title: "Go live",
			subtitle: "Create a stream, point OBS / Streamlabs at the RTMP URL + key, and go live. Viewers see the LIVE indicator on your watch page.",
			icon: Radio
		});
		$$renderer.push(`<!----> <section class="surface-1 rounded-xl p-4 space-y-3"><h2 class="text-sm font-semibold text-foreground">New stream</h2> <input type="text"${attr("value", newTitle)} placeholder="Stream title" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/> <textarea rows="2" placeholder="Description (optional)" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground resize-none">`);
		const $$body = escape_html(newDescription);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> <div class="flex justify-end"><button type="button"${attr("disabled", creating, true)} class="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm">${escape_html("Create stream")}</button></div></section> <section><h2 class="text-sm font-semibold text-foreground mb-3">Your streams</h2> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(Array(2));
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				Skeleton($$renderer, { class: "h-32 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-LkmILT2Z.js.map
