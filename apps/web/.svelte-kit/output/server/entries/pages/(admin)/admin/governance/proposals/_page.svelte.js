import { kt as head } from "../../../../../../chunks/ui-libs.js";
import { t as File_text } from "../../../../../../chunks/file-text.js";
import { t as PortalHero } from "../../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../../chunks/PortalButton.js";
//#region src/routes/(admin)/admin/governance/proposals/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1fzek9k", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Proposals - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="mx-auto px-4 py-8 space-y-4 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					href: "/admin/governance/create",
					variant: "primary",
					size: "sm",
					children: ($$renderer) => {
						$$renderer.push(`<!---->+ New`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "DAO",
				title: "Proposals",
				subtitle: "Pending, queued, and historical DAO proposals.",
				icon: File_text,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="rounded-xl border border-border/40 overflow-hidden"><table class="w-full text-sm"><thead class="surface-1 text-foreground/80"><tr><th class="px-4 py-3 text-left">Title</th><th class="px-4 py-3 text-left">Type</th><th class="px-4 py-3 text-left">Risk</th><th class="px-4 py-3 text-left">Approvals</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-left">Created</th></tr></thead><tbody>`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<tr><td colspan="6" class="px-4 py-6 text-center text-muted-foreground">Loading proposals...</td></tr>`);
		$$renderer.push(`<!--]--></tbody></table></div></div>`);
	});
}
//#endregion
export { _page as default };
