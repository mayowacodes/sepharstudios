import { Tt as head, wt as ensure_array_like } from "../../../../../chunks/ui-libs.js";
import { t as Landmark } from "../../../../../chunks/landmark.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import "../../../../../chunks/GovernanceStatusCard.js";
//#region src/routes/(admin)/admin/governance/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1vxzpf4", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<a href="/admin/governance/create" class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium transition-opacity">+ New Proposal</a>`);
			}
			PageHeader($$renderer, {
				icon: Landmark,
				title: "Governance",
				subtitle: "DAO proposals, treasury, and on-chain controls.",
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid md:grid-cols-4 gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="h-24 rounded-xl surface-1 animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div class="grid md:grid-cols-3 gap-4"><a href="/admin/governance/proposals" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors"><h3 class="text-foreground font-semibold">Proposals</h3> <p class="text-xs text-muted-foreground mt-1">View and review governance proposals</p></a> <a href="/admin/governance/execution" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors"><h3 class="text-foreground font-semibold">Execution</h3> <p class="text-xs text-muted-foreground mt-1">Queue and execute timelock actions</p></a> <a href="/admin/governance/treasury" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors"><h3 class="text-foreground font-semibold">Treasury</h3> <p class="text-xs text-muted-foreground mt-1">Monitor pools, inflows and runway</p></a> <a href="/admin/governance/emergency" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors"><h3 class="text-foreground font-semibold">Emergency</h3> <p class="text-xs text-muted-foreground mt-1">Pause controls and incident logs</p></a> <a href="/admin/governance/roles" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors"><h3 class="text-foreground font-semibold">Roles</h3> <p class="text-xs text-muted-foreground mt-1">Permissions matrix and admin roster</p></a> <a href="/admin/governance/reports" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors"><h3 class="text-foreground font-semibold">Reports</h3> <p class="text-xs text-muted-foreground mt-1">Generate governance transparency reports</p></a></div></div>`);
	});
}
//#endregion
export { _page as default };
