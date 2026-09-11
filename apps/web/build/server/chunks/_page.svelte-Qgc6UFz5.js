import { k as head } from './index.js-BP8aAXBX.js';
import { B as Bell } from './bell-DqXql3zC.js';
import { C as Calendar } from './calendar-ClZxYROM.js';
import { V as Video } from './video-fthjtWII.js';
import './client-ZoNwVBKD.js';
import { B as Button } from './button--do5FSjb.js';
import './Icon-DOH8dWtn.js';
import './utils2-CqskQpUP.js';
import './index-D1eQaiDA.js';

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
//# sourceMappingURL=_page.svelte-Qgc6UFz5.js.map
