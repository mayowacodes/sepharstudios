import { Ct as derived, Et as head, Tt as ensure_array_like, yt as attr_class, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Coins } from "../../../../../chunks/coins.js";
import { t as Refresh_cw } from "../../../../../chunks/refresh-cw.js";
import { t as Save } from "../../../../../chunks/save.js";
import { t as Input } from "../../../../../chunks/input.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../../chunks/card.js";
import { t as Label } from "../../../../../chunks/label.js";
//#region src/routes/(admin)/admin/ai-costs/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let byCategory = [];
		let byOperation = [];
		let budgets = [];
		let refusedCalls = 0;
		let days = 30;
		let loading = true;
		let error = null;
		let saving = false;
		let platformLimit = "";
		async function load() {
			loading = true;
			error = null;
			try {
				const res = await fetch(`/api/admin/ai-costs?days=${days}`);
				if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Failed to load");
				const body = await res.json();
				byCategory = body.byCategory ?? [];
				byOperation = body.byOperation ?? [];
				budgets = body.budgets ?? [];
				refusedCalls = body.refusedCalls ?? 0;
				const platform = budgets.find((b) => b.scope === "platform");
				platformLimit = platform?.limitUsd != null ? String(platform.limitUsd) : "";
			} catch (e) {
				error = e instanceof Error ? e.message : "Failed to load";
			} finally {
				loading = false;
			}
		}
		async function savePlatformCap() {
			saving = true;
			error = null;
			try {
				const trimmed = platformLimit.trim();
				const limitUsd = trimmed === "" ? null : Number(trimmed);
				if (limitUsd !== null && (!Number.isFinite(limitUsd) || limitUsd < 0)) throw new Error("Enter a non-negative number, or leave blank for no cap");
				const res = await fetch("/api/admin/ai-costs", {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						scope: "platform",
						scopeId: "platform",
						limitUsd
					})
				});
				if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Failed to save");
				await load();
			} catch (e) {
				error = e instanceof Error ? e.message : "Failed to save";
			} finally {
				saving = false;
			}
		}
		const usd = (v) => `$${v.toFixed(2)}`;
		const totalUsd = derived(() => byCategory.reduce((s, r) => s + r.usd, 0));
		const platformBudget = derived(() => budgets.find((b) => b.scope === "platform") ?? null);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("15snkc7", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>AI costs · Admin</title>`);
				});
			});
			PortalHero($$renderer, {
				title: "AI costs",
				subtitle: "Spend by feature, and the ceilings that bound it",
				icon: Coins
			});
			$$renderer.push(`<!----> <div class="space-y-6 p-4 md:p-6">`);
			if (error) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">${escape_html(error)}</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex items-center justify-between gap-3"><div class="flex gap-2"><!--[-->`);
			const each_array = ensure_array_like([
				7,
				30,
				90
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let d = each_array[$$index];
				Button($$renderer, {
					variant: days === d ? "default" : "outline",
					size: "sm",
					onclick: () => {
						days = d;
						load();
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(d)}d`);
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--></div> `);
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
			$$renderer.push(`<!----></div> <div class="grid gap-6 lg:grid-cols-3">`);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Total spend`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<p class="text-3xl font-semibold">${escape_html(usd(totalUsd()))}</p> <p class="text-xs text-muted-foreground">last ${escape_html(days)} days</p>`);
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
									$$renderer.push(`<!---->This month`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<p class="text-3xl font-semibold">${escape_html(usd(platformBudget()?.spentUsd ?? 0))}</p> <p class="text-xs text-muted-foreground">${escape_html(platformBudget()?.limitUsd != null ? `of ${usd(platformBudget().limitUsd)} cap` : "no cap set")}</p>`);
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
									$$renderer.push(`<!---->Refused calls`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<p${attr_class(`text-3xl font-semibold ${refusedCalls > 0 ? "text-amber-500" : ""}`)}>${escape_html(refusedCalls)}</p> <p class="text-xs text-muted-foreground">rising means a ceiling is too low</p>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
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
									$$renderer.push(`<!---->Platform monthly cap`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<div class="flex flex-wrap items-end gap-3"><div class="flex-1 min-w-[200px]">`);
							Label($$renderer, {
								for: "cap",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Limit (USD) — leave blank for no cap`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
								id: "cap",
								placeholder: "250.00",
								inputmode: "decimal",
								get value() {
									return platformLimit;
								},
								set value($$value) {
									platformLimit = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div> `);
							Button($$renderer, {
								onclick: savePlatformCap,
								disabled: saving,
								children: ($$renderer) => {
									Save($$renderer, { class: "size-4 mr-2" });
									$$renderer.push(`<!----> Save`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="grid gap-6 lg:grid-cols-2">`);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->By category`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							if (byCategory.length === 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-sm text-muted-foreground">No spend recorded.</p>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<table class="w-full text-sm"><thead class="text-left text-muted-foreground"><tr><th class="py-2">Category</th><th>Calls</th><th class="text-right">Spend</th></tr></thead><tbody><!--[-->`);
								const each_array_1 = ensure_array_like(byCategory);
								for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
									let r = each_array_1[$$index_1];
									$$renderer.push(`<tr class="border-t"><td class="py-2">`);
									Badge($$renderer, {
										variant: "outline",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(r.category)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></td><td>${escape_html(r.calls.toLocaleString())}</td><td class="text-right">${escape_html(usd(r.usd))}</td></tr>`);
								}
								$$renderer.push(`<!--]--></tbody></table>`);
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
									$$renderer.push(`<!---->By feature`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							if (byOperation.length === 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-sm text-muted-foreground">No spend recorded.</p>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="max-h-[420px] overflow-y-auto"><table class="w-full text-sm"><thead class="text-left text-muted-foreground sticky top-0 bg-background"><tr><th class="py-2">Operation</th><th>Calls</th><th class="text-right">Spend</th></tr></thead><tbody><!--[-->`);
								const each_array_2 = ensure_array_like(byOperation);
								for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
									let r = each_array_2[$$index_2];
									$$renderer.push(`<tr class="border-t"><td class="py-2 truncate">${escape_html(r.operation)}</td><td>${escape_html(r.calls.toLocaleString())}</td><td class="text-right">${escape_html(usd(r.usd))}</td></tr>`);
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
			$$renderer.push(`<!----></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
