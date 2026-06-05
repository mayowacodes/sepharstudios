import { as as ensure_array_like, ai as attr_class, au as escape_html, ah as attr } from './ui-libs-BjzLDLAh.js';
import { I as Inbox } from './inbox-DQ-hcBQa.js';
import './toast-state.svelte-Cuuior_F.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(admin)/admin/submissions/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let active = "stories";
		let statusFilter = "pending";
		let stories = [];
		let noteDrafts = {};
		const STATUS_OPTIONS = {
			stories: [
				"pending",
				"approved",
				"rejected"
			],
			sponsorships: [
				"pending",
				"reviewing",
				"approved",
				"rejected"
			],
			tickets: [
				"open",
				"in_progress",
				"resolved",
				"closed"
			]
		};
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		PageHeader($$renderer, {
			icon: Inbox,
			title: "Submissions",
			subtitle: "Triage success stories, sponsorship pitches, and support tickets."
		});
		$$renderer.push(`<!----> <div class="flex flex-wrap gap-2"><!--[-->`);
		const each_array = ensure_array_like([
			"stories",
			"sponsorships",
			"tickets"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${active === tab ? "bg-primary text-primary-foreground" : "surface-1 text-foreground/80 hover:surface-2"}`)}>${escape_html(tab)}</button>`);
		}
		$$renderer.push(`<!--]--> <div class="flex-1"></div> `);
		$$renderer.select({
			value: statusFilter,
			class: "px-3 py-2 surface-2 border border-border rounded-lg text-sm"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(STATUS_OPTIONS[active]);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let s = each_array_1[$$index_1];
				$$renderer.option({ value: s }, ($$renderer) => {
					$$renderer.push(`${escape_html(s)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> `);
		$$renderer.push("<!--[1-->");
		if (stories.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="surface-1 border border-border/40 rounded-xl p-12 text-center text-muted-foreground">No stories in this state.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array_2 = ensure_array_like(stories);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let s = each_array_2[$$index_2];
				$$renderer.push(`<div class="surface-1 border border-border/40 rounded-xl p-4"><div class="flex items-start justify-between gap-4"><div class="flex-1 min-w-0"><h3 class="font-semibold">${escape_html(s.name)}${escape_html(s.channel ? ` — ${s.channel}` : "")}</h3> <p class="text-sm text-foreground/80 mt-1 whitespace-pre-line">${escape_html(s.story)}</p> <p class="text-xs text-muted-foreground mt-2">Submitted ${escape_html(new Date(s.createdAt).toLocaleString())}</p></div> <span class="text-xs px-2 py-1 rounded-full bg-purple-700/40 text-purple-200">${escape_html(s.status)}</span></div> <input type="text"${attr("value", noteDrafts[s.id])} placeholder="Optional moderation note" class="w-full mt-3 px-3 py-2 surface-2 border border-border rounded text-sm"/> <div class="flex gap-2 mt-3"><button class="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm">Approve</button> <button class="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm">Reject</button> <button class="surface-2 hover:surface-3 px-3 py-1.5 rounded text-sm">Reset</button></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BqMqkNIN.js.map
