import { at as head, aH as spread_props } from './ui-libs-TtGtWAGI.js';
import { I as Icon } from './Icon-CGEdwVFL.js';
import { B as Bell } from './bell-Cv37r-Zg.js';
import { C as Calendar } from './calendar-CxjjBQYu.js';
import './client-CZa6R-ON.js';
import { B as Button } from './button-D9M18H3C.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/video.svelte
function Video($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "video" },
		props,
		{ iconNode: [["path", { "d": "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" }], ["rect", {
			"x": "2",
			"y": "6",
			"width": "14",
			"height": "12",
			"rx": "2"
		}]] }
	]));
}
//#endregion
//#region src/routes/(app)/webinars/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1tufhkd", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Webinars · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Live and on-demand sessions for Sephar Studios creators, viewers and STC holders."/>`);
		});
		$$renderer.push(`<div class="min-h-screen bg-background text-white px-4 py-10"><div class="max-w-5xl mx-auto space-y-10"><header class="text-center space-y-3"><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">`);
		Video($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> Live &amp; On-Demand</div> <h1 class="text-3xl md:text-4xl font-bold">Sephar Studios Webinars</h1> <p class="text-muted-foreground max-w-2xl mx-auto">Weekly sessions for creators, viewers and STC holders — production craft, theology,
        platform mechanics and token economics, taught by the people building Sephar Studios.</p></header> <section class="space-y-4"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold flex items-center gap-2">`);
		Calendar($$renderer, { class: "w-5 h-5 text-primary" });
		$$renderer.push(`<!----> Upcoming sessions</h2> `);
		Button($$renderer, {
			variant: "outline",
			size: "sm",
			children: ($$renderer) => {
				Bell($$renderer, { class: "w-4 h-4 mr-2" });
				$$renderer.push(`<!----> Subscribe to calendar`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground py-6 text-center">Loading webinars…</p>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></section> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section class="bg-card border border-border rounded-2xl p-6 text-center space-y-3"><h2 class="text-lg font-semibold">Want to speak at a session?</h2> <p class="text-sm text-muted-foreground max-w-xl mx-auto">Pitch a topic to our creator success team. Approved sessions reach 200+ live viewers and stay in the archive permanently.</p> `);
		Button($$renderer, {
			href: "/contact",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Pitch a session`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></section></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-lfsECEWt.js.map
