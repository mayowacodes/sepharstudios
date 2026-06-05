import { aA as head } from './ui-libs-BjzLDLAh.js';
import { F as File_text } from './file-text-C_v9vOk2.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(admin)/admin/governance/proposals/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1fzek9k", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Proposals - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-4">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<a href="/admin/governance/create" class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium transition-opacity">+ New</a>`);
			}
			PageHeader($$renderer, {
				icon: File_text,
				title: "Governance Proposals",
				subtitle: "Pending, queued, and historical DAO proposals.",
				actions});
		}
		$$renderer.push(`<!----> <div class="rounded-xl border border-border/40 overflow-hidden"><table class="w-full text-sm"><thead class="surface-1 text-foreground/80"><tr><th class="px-4 py-3 text-left">Title</th><th class="px-4 py-3 text-left">Type</th><th class="px-4 py-3 text-left">Risk</th><th class="px-4 py-3 text-left">Approvals</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-left">Created</th></tr></thead><tbody>`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<tr><td colspan="6" class="px-4 py-6 text-center text-muted-foreground">Loading proposals...</td></tr>`);
		$$renderer.push(`<!--]--></tbody></table></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-pUxOt0jT.js.map
