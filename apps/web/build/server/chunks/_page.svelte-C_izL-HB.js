import { ah as attr, as as ensure_array_like, ap as derived } from './ui-libs-BjzLDLAh.js';
import { K as KpiCard } from './KpiCard-p3Xq44Ey.js';
import { S as Search } from './search-DjJyYABq.js';
import { S as Shield_alert } from './shield-alert-B18q9sfB.js';
import { U as Users } from './users-B-WaIXgI.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './utils2-BaRxD-PE.js';

//#region src/routes/(admin)/admin/users/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let users = [];
		let q = "";
		let roleFilter = "all";
		let bannedFilter = "all";
		const stats = derived(() => ({
			total: users.length,
			creators: users.filter((u) => u.role === "creator").length,
			banned: users.filter((u) => u.banned).length,
			flagged: users.filter((u) => u.abuseReportsAgainst > 0).length
		}));
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		PageHeader($$renderer, {
			icon: Users,
			title: "Audience",
			subtitle: "View and manage end-users. Ban, warn, or open per-user detail for purchases + abuse history."
		});
		$$renderer.push(`<!----> <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">`);
		KpiCard($$renderer, {
			label: "In view",
			value: stats().total,
			icon: Users,
			accent: "blue",
			variant: "compact",
			index: 0
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Creators",
			value: stats().creators,
			icon: Users,
			accent: "purple",
			variant: "compact",
			index: 1
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Banned",
			value: stats().banned,
			icon: Shield_alert,
			accent: "red",
			variant: "compact",
			index: 2
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Flagged",
			value: stats().flagged,
			icon: Shield_alert,
			accent: "yellow",
			variant: "compact",
			index: 3
		});
		$$renderer.push(`<!----></div> <div class="flex flex-wrap gap-3 items-center"><div class="relative w-80">`);
		Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" });
		$$renderer.push(`<!----> <input type="text"${attr("value", q)} placeholder="Search name or email…" class="w-full surface-2 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder-gray-500"/></div> `);
		$$renderer.select({
			value: roleFilter,
			class: "surface-2 rounded-lg px-3 py-2 text-sm text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All roles`);
			});
			$$renderer.option({ value: "user" }, ($$renderer) => {
				$$renderer.push(`User`);
			});
			$$renderer.option({ value: "creator" }, ($$renderer) => {
				$$renderer.push(`Creator`);
			});
			$$renderer.option({ value: "admin" }, ($$renderer) => {
				$$renderer.push(`Admin`);
			});
		});
		$$renderer.push(` `);
		$$renderer.select({
			value: bannedFilter,
			class: "surface-2 rounded-lg px-3 py-2 text-sm text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All status`);
			});
			$$renderer.option({ value: "false" }, ($$renderer) => {
				$$renderer.push(`Active`);
			});
			$$renderer.option({ value: "true" }, ($$renderer) => {
				$$renderer.push(`Banned`);
			});
		});
		$$renderer.push(`</div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(Array(8));
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				Skeleton($$renderer, { class: "h-14 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C_izL-HB.js.map
