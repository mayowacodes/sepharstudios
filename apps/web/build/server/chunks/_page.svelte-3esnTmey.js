import { b as ensure_array_like, f as derived } from './index.js-DwRgOKlO.js';
import { P as PortalKpi } from './PortalKpi-DuR9asVZ.js';
import { S as Shield_alert } from './shield-alert-C9whcs6G.js';
import { U as Users } from './users-Cy8n6xcU.js';
import { S as Skeleton } from './skeleton-DrNJG5oW.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import './Icon-C7ASqKku.js';
import './utils2-DHW1aw82.js';

//#region src/routes/(admin)/admin/users/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let users = [];
		const stats = derived(() => ({
			total: users.length,
			creators: users.filter((u) => u.role === "creator").length,
			banned: users.filter((u) => u.banned).length,
			flagged: users.filter((u) => u.abuseReportsAgainst > 0).length
		}));
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "People",
			title: "Audience",
			subtitle: "View and manage end-users. Ban, warn, or open per-user detail for purchases + abuse history.",
			icon: Users
		});
		$$renderer.push(`<!----> <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">`);
		PortalKpi($$renderer, {
			label: "In view",
			value: stats().total,
			icon: Users
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Creators",
			value: stats().creators,
			icon: Users
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Banned",
			value: stats().banned,
			icon: Shield_alert
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Flagged",
			value: stats().flagged,
			icon: Shield_alert
		});
		$$renderer.push(`<!----></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(Array(8));
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				Skeleton($$renderer, { class: "h-14 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-3esnTmey.js.map
