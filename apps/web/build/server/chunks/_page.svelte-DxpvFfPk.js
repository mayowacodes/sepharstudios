import { b as ensure_array_like, f as derived } from './index.js-CxPEndTa.js';
import { P as PortalKpi } from './PortalKpi-jd2ahlGW.js';
import { S as Shield_alert } from './shield-alert-DqY7tJTj.js';
import { U as Users } from './users-BHfWNfsK.js';
import { S as Skeleton } from './skeleton-C99_WNvK.js';
import { P as PortalHero } from './PortalHero-zB8z9paY.js';
import './Icon-Bw1rnKTC.js';
import './utils2-DZI6czOR.js';

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
//# sourceMappingURL=_page.svelte-DxpvFfPk.js.map
