import { k as head, q as escape_html, b as ensure_array_like } from './index.js-CxPEndTa.js';
import { M as Megaphone } from './megaphone-HgPRtjd7.js';
import { P as Plus } from './plus-NyypAj8P.js';
import { R as Refresh_cw } from './refresh-cw-BDMll6nq.js';
import { S as Search } from './search-DTs5QrbF.js';
import { I as Input } from './input-CHV7EKkW.js';
import { B as Button } from './button-DtPBvYl-.js';
import { B as Badge } from './badge-BfVc17Ti.js';
import { P as PortalHero } from './PortalHero-zB8z9paY.js';
import { C as Card, a as Card_header, c as Card_content, b as Card_title } from './card-BuaI8-6J.js';
import { L as Label } from './label-BnqN6F4y.js';
import './Icon-Bw1rnKTC.js';
import './utils2-DZI6czOR.js';
import './index-BoGG3uCW.js';

//#region src/routes/(admin)/admin/promo/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let advertisers = [];
		let campaigns = [];
		let loading = true;
		let error = null;
		let newAdvertiserName = "";
		let creating = false;
		let previewContentId = "";
		let previewing = false;
		let previewResult = null;
		async function load() {
			loading = true;
			error = null;
			try {
				const [aRes, cRes] = await Promise.all([fetch("/api/admin/promo/advertisers"), fetch("/api/admin/promo/campaigns")]);
				if (!aRes.ok || !cRes.ok) throw new Error("Failed to load promotions data");
				advertisers = (await aRes.json()).advertisers ?? [];
				campaigns = (await cRes.json()).campaigns ?? [];
			} catch (e) {
				error = e instanceof Error ? e.message : "Failed to load";
			} finally {
				loading = false;
			}
		}
		async function createAdvertiser() {
			if (!newAdvertiserName.trim()) return;
			creating = true;
			error = null;
			try {
				const res = await fetch("/api/admin/promo/advertisers", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name: newAdvertiserName.trim() })
				});
				const body = await res.json();
				if (!res.ok) throw new Error(body?.error ?? "Failed to create advertiser");
				newAdvertiserName = "";
				await load();
			} catch (e) {
				error = e instanceof Error ? e.message : "Failed to create";
			} finally {
				creating = false;
			}
		}
		/**
		* Dry-runs the auction. This is the answer to "why isn't my campaign
		* serving?" — it lists every campaign that lost and why, instead of leaving
		* an operator to reconstruct flight windows and targeting arrays by hand.
		*/
		async function runPreview() {
			if (!previewContentId.trim()) return;
			previewing = true;
			previewResult = null;
			error = null;
			try {
				const res = await fetch("/api/admin/promo/preview", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ contentId: previewContentId.trim() })
				});
				const body = await res.json();
				if (!res.ok) throw new Error(body?.error ?? "Preview failed");
				previewResult = body;
			} catch (e) {
				error = e instanceof Error ? e.message : "Preview failed";
			} finally {
				previewing = false;
			}
		}
		function statusVariant(status) {
			if (status === "active") return "default";
			if (status === "completed") return "secondary";
			return "outline";
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("uk6j6x", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Promotions · Admin</title>`);
				});
			});
			PortalHero($$renderer, {
				title: "Promotions",
				subtitle: "Advertisers, campaigns and the squeeze-back ad auction",
				icon: Megaphone
			});
			$$renderer.push(`<!----> <div class="space-y-6 p-4 md:p-6">`);
			if (error) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">${escape_html(error)}</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex justify-end">`);
			Button($$renderer, {
				variant: "outline",
				size: "sm",
				onclick: load,
				disabled: loading,
				children: ($$renderer) => {
					Refresh_cw($$renderer, { class: "size-4 mr-2" });
					$$renderer.push(`<!----> Refresh`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Advertisers`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "space-y-4",
						children: ($$renderer) => {
							$$renderer.push(`<div class="flex flex-wrap items-end gap-3"><div class="flex-1 min-w-[220px]">`);
							Label($$renderer, {
								for: "adv-name",
								children: ($$renderer) => {
									$$renderer.push(`<!---->New advertiser`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
								id: "adv-name",
								placeholder: "Acme Films",
								get value() {
									return newAdvertiserName;
								},
								set value($$value) {
									newAdvertiserName = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div> `);
							Button($$renderer, {
								onclick: createAdvertiser,
								disabled: creating || !newAdvertiserName.trim(),
								children: ($$renderer) => {
									Plus($$renderer, { class: "size-4 mr-2" });
									$$renderer.push(`<!----> Add`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div> `);
							if (loading) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-sm text-muted-foreground">Loading…</p>`);
							} else if (advertisers.length === 0) {
								$$renderer.push("<!--[1-->");
								$$renderer.push(`<p class="text-sm text-muted-foreground">No advertisers yet.</p>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead class="text-left text-muted-foreground"><tr><th class="py-2">Name</th><th>Slug</th><th>Kind</th><th>Active</th></tr></thead><tbody><!--[-->`);
								const each_array = ensure_array_like(advertisers);
								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
									let a = each_array[$$index];
									$$renderer.push(`<tr class="border-t"><td class="py-2">${escape_html(a.name)}</td><td class="font-mono text-xs">${escape_html(a.slug)}</td><td>`);
									Badge($$renderer, {
										variant: a.kind === "house" ? "secondary" : "outline",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(a.kind)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></td><td>${escape_html(a.isActive ? "Yes" : "No")}</td></tr>`);
								}
								$$renderer.push(`<!--]--></tbody></table></div>`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Campaigns`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							if (loading) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-sm text-muted-foreground">Loading…</p>`);
							} else if (campaigns.length === 0) {
								$$renderer.push("<!--[1-->");
								$$renderer.push(`<p class="text-sm text-muted-foreground">No campaigns yet.</p>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead class="text-left text-muted-foreground"><tr><th class="py-2">Campaign</th><th>Advertiser</th><th>Status</th><th>Priority</th><th>Delivered</th></tr></thead><tbody><!--[-->`);
								const each_array_1 = ensure_array_like(campaigns);
								for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
									let row = each_array_1[$$index_1];
									$$renderer.push(`<tr class="border-t"><td class="py-2">${escape_html(row.campaign.name)}</td><td class="text-muted-foreground">${escape_html(row.advertiserName ?? "—")}</td><td>`);
									Badge($$renderer, {
										variant: statusVariant(row.campaign.status),
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(row.campaign.status)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></td><td>${escape_html(row.campaign.priority)}</td><td>${escape_html(row.campaign.deliveredImpressions)}${escape_html(row.campaign.goalImpressions ? ` / ${row.campaign.goalImpressions}` : "")}</td></tr>`);
								}
								$$renderer.push(`<!--]--></tbody></table></div>`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Why isn't my campaign serving?`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						class: "space-y-4",
						children: ($$renderer) => {
							$$renderer.push(`<p class="text-sm text-muted-foreground">Runs the real auction against a title without recording an impression or
        touching frequency caps, and lists every campaign that lost with its reason.</p> <div class="flex flex-wrap items-end gap-3"><div class="flex-1 min-w-[260px]">`);
							Label($$renderer, {
								for: "preview-content",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Content ID`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
								id: "preview-content",
								placeholder: "media_library.id",
								get value() {
									return previewContentId;
								},
								set value($$value) {
									previewContentId = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div> `);
							Button($$renderer, {
								onclick: runPreview,
								disabled: previewing || !previewContentId.trim(),
								children: ($$renderer) => {
									Search($$renderer, { class: "size-4 mr-2" });
									$$renderer.push(`<!----> Dry run`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div> `);
							if (previewResult) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="rounded-md border p-3 space-y-2"><p class="text-sm font-medium">${escape_html(previewResult.wouldServe ? "An ad would serve." : "No ad would serve.")}</p> `);
								if (previewResult.rejections.length > 0) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<ul class="text-sm space-y-1"><!--[-->`);
									const each_array_2 = ensure_array_like(previewResult.rejections);
									for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
										let r = each_array_2[$$index_2];
										$$renderer.push(`<li class="flex justify-between gap-4 border-t pt-1"><span>${escape_html(r.campaignName)}</span> <span class="text-muted-foreground">${escape_html(r.reason)}</span></li>`);
									}
									$$renderer.push(`<!--]--></ul>`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<p class="text-sm text-muted-foreground">No campaigns were rejected.</p>`);
								}
								$$renderer.push(`<!--]--></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CNrgJca2.js.map
