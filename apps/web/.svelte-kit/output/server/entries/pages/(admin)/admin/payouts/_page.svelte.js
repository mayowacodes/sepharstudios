import { Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html, jt as spread_props } from "../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Rotate_ccw } from "../../../../../chunks/rotate-ccw.js";
import { t as Wallet } from "../../../../../chunks/wallet.js";
import { n as toast } from "../../../../../chunks/toast-state.svelte.js";
import { t as Skeleton } from "../../../../../chunks/skeleton.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
import { t as PortalEmptyState } from "../../../../../chunks/PortalEmptyState.js";
import { t as PortalDataTable } from "../../../../../chunks/PortalDataTable.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/octagon-pause.svelte
function Octagon_pause($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "octagon-pause" },
		props,
		{ iconNode: [
			["path", { "d": "M10 15V9" }],
			["path", { "d": "M14 15V9" }],
			["path", { "d": "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" }]
		] }
	]));
}
//#endregion
//#region src/routes/(admin)/admin/payouts/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let rows = [];
		let status = "pending";
		let processor = "all";
		let loading = true;
		let busy = {};
		async function load() {
			loading = true;
			try {
				const params = new URLSearchParams();
				params.set("status", status);
				const res = await fetch(`/api/admin/payouts?${params}`);
				if (!res.ok) {
					console.error("[payouts] load HTTP", res.status);
					rows = [];
					return;
				}
				rows = (await res.json().catch(() => ({}))).payouts ?? [];
			} catch (err) {
				console.error("[payouts] load failed:", err);
				rows = [];
			} finally {
				loading = false;
			}
		}
		async function approve(r) {
			busy[r.id] = true;
			busy = { ...busy };
			try {
				const res = await fetch(`/api/admin/payouts/${r.id}/approve`, { method: "POST" });
				const body = await res.json();
				if (!res.ok) throw new Error(body.error ?? "Approval failed");
				toast.success(r.processor === "stripe" ? "Transfer sent" : "Approved");
				await load();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed");
			} finally {
				busy[r.id] = false;
				busy = { ...busy };
			}
		}
		async function retry(r) {
			if (!confirm(`Retry failed payout to ${r.creatorDisplayName ?? r.creatorName ?? r.creatorEmail ?? "creator"}?`)) return;
			busy[r.id] = true;
			busy = { ...busy };
			try {
				const res = await fetch(`/api/admin/payouts/${r.id}/retry`, { method: "POST" });
				const body = await res.json();
				if (!res.ok) throw new Error(body.error ?? body.detail ?? "Retry failed");
				toast.success(r.processor === "stripe" ? "Transfer resent" : "Queued for retry");
				await load();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Retry failed");
			} finally {
				busy[r.id] = false;
				busy = { ...busy };
			}
		}
		async function hold(r) {
			const reason = prompt("Reason for hold:");
			if (!reason) return;
			busy[r.id] = true;
			busy = { ...busy };
			try {
				if ((await fetch(`/api/admin/payouts/${r.id}/hold`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ reason })
				})).ok) {
					toast.success("On hold");
					await load();
				} else toast.error("Failed");
			} finally {
				busy[r.id] = false;
				busy = { ...busy };
			}
		}
		function money(cents, currency) {
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: currency || "USD"
			}).format(cents / 100);
		}
		function statusBadge(s) {
			if (s === "paid") return "bg-green-600/30 text-green-200";
			if (s === "failed" || s === "on_hold") return "bg-red-600/30 text-red-200";
			if (s === "in_transit" || s === "approved") return "bg-blue-600/30 text-blue-200";
			return "bg-yellow-600/30 text-yellow-200";
		}
		function processorBadge(p) {
			return p === "stripe" ? "bg-purple-600/30 text-purple-200" : "bg-orange-600/30 text-orange-200";
		}
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Finance",
			title: "Payouts",
			subtitle: "Review and approve creator payouts. Stripe transfers fire immediately on approve; Paystack payouts are queued for the existing settlement worker.",
			icon: Wallet
		});
		$$renderer.push(`<!----> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(Array(5));
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				Skeleton($$renderer, { class: "h-12 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			{
				function filters($$renderer) {
					$$renderer.select({
						value: status,
						class: "rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2",
						style: "background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
					}, ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array_1 = ensure_array_like([
							"pending",
							"approved",
							"in_transit",
							"paid",
							"failed",
							"on_hold",
							"all"
						]);
						for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
							let s = each_array_1[$$index_1];
							$$renderer.option({ value: s }, ($$renderer) => {
								$$renderer.push(`${escape_html(s.replace("_", " "))}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(` `);
					$$renderer.select({
						value: processor,
						class: "rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2",
						style: "background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
					}, ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array_2 = ensure_array_like([
							"all",
							"paystack",
							"stripe"
						]);
						for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
							let p = each_array_2[$$index_2];
							$$renderer.option({ value: p }, ($$renderer) => {
								$$renderer.push(`${escape_html(p)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
				}
				function row($$renderer, r) {
					$$renderer.push(`<div class="flex items-center gap-3 text-sm"><div class="min-w-0 flex-1"><div class="font-medium text-[hsl(var(--portal-text))] truncate">${escape_html(r.creatorDisplayName ?? r.creatorName ?? "—")}</div> <div class="text-xs text-[hsl(var(--portal-text-muted))] truncate">${escape_html(r.creatorEmail ?? "")}</div></div> <span${attr_class(`text-xs px-2 py-0.5 rounded uppercase tracking-wide font-semibold ${stringify(processorBadge(r.processor))}`)}>${escape_html(r.processor)}</span> <span class="hidden lg:inline text-xs text-[hsl(var(--portal-text-muted))]">${escape_html(new Date(r.periodStart).toLocaleDateString())} → ${escape_html(new Date(r.periodEnd).toLocaleDateString())}</span> <span class="text-sm font-semibold tabular-nums text-[hsl(var(--portal-text))] min-w-20 text-right">${escape_html(money(r.netCents, r.currency))}</span> <span${attr_class(`text-xs px-2 py-0.5 rounded capitalize font-medium ${stringify(statusBadge(r.status))}`)}>${escape_html(r.status.replace("_", " "))}</span></div>`);
				}
				function detail($$renderer, r) {
					$$renderer.push(`<div class="space-y-5"><div><div class="text-lg font-semibold text-[hsl(var(--portal-text))]">${escape_html(r.creatorDisplayName ?? r.creatorName ?? "—")}</div> `);
					if (r.creatorEmail) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="text-sm text-[hsl(var(--portal-text-muted))]">${escape_html(r.creatorEmail)}</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-2"><span${attr_class(`text-xs px-2 py-0.5 rounded uppercase tracking-wide font-semibold ${stringify(processorBadge(r.processor))}`)}>${escape_html(r.processor)}</span> <span${attr_class(`text-xs px-2 py-0.5 rounded capitalize font-medium ${stringify(statusBadge(r.status))}`)}>${escape_html(r.status.replace("_", " "))}</span></div> `);
					if (r.processor === "stripe" && !r.stripePayoutsEnabled) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="rounded-lg p-3 border" style="background: hsl(var(--portal-danger)/0.1); border-color: hsl(var(--portal-danger)/0.35); color: hsl(var(--portal-danger));"><div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Stripe not verified</div> <p class="text-xs">Account status: ${escape_html(r.stripeAccountStatus ?? "unknown")}. Cannot disburse until creator finishes onboarding.</p></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (r.failureReason) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="rounded-lg p-3 border" style="background: hsl(var(--portal-danger)/0.1); border-color: hsl(var(--portal-danger)/0.35); color: hsl(var(--portal-danger));"><div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Failure reason</div> <p class="text-xs whitespace-pre-wrap">${escape_html(r.failureReason)}</p></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="grid grid-cols-2 gap-3"><div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Period</div> <div class="text-sm text-[hsl(var(--portal-text))]">${escape_html(new Date(r.periodStart).toLocaleDateString())} → ${escape_html(new Date(r.periodEnd).toLocaleDateString())}</div></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Created</div> <div class="text-sm text-[hsl(var(--portal-text))]">${escape_html(new Date(r.createdAt).toLocaleDateString())}</div></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Gross</div> <div class="text-sm tabular-nums text-[hsl(var(--portal-text))]">${escape_html(money(r.grossCents, r.currency))}</div></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Platform fee</div> <div class="text-sm tabular-nums text-[hsl(var(--portal-text))]">${escape_html(money(r.platformFeeCents, r.currency))}</div></div> <div class="col-span-2 pt-2 border-t" style="border-color: hsl(var(--portal-border));"><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Net payable</div> <div class="text-2xl font-bold tabular-nums text-[hsl(var(--portal-text))]">${escape_html(money(r.netCents, r.currency))}</div></div></div> `);
					if (r.status === "pending") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="flex gap-2 pt-2">`);
						PortalButton($$renderer, {
							variant: "primary",
							size: "md",
							onclick: () => approve(r),
							disabled: busy[r.id],
							children: ($$renderer) => {
								Circle_check($$renderer, { class: "w-4 h-4" });
								$$renderer.push(`<!----> Approve`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						PortalButton($$renderer, {
							variant: "secondary",
							size: "md",
							onclick: () => hold(r),
							disabled: busy[r.id],
							children: ($$renderer) => {
								Octagon_pause($$renderer, { class: "w-4 h-4" });
								$$renderer.push(`<!----> Hold`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					} else if (r.status === "failed") {
						$$renderer.push("<!--[1-->");
						PortalButton($$renderer, {
							variant: "primary",
							size: "md",
							onclick: () => retry(r),
							disabled: busy[r.id],
							children: ($$renderer) => {
								Rotate_ccw($$renderer, { class: "w-4 h-4" });
								$$renderer.push(`<!----> ${escape_html(busy[r.id] ? "Retrying…" : "Retry")}`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				function empty($$renderer) {
					PortalEmptyState($$renderer, {
						icon: Wallet,
						title: "No payouts match these filters",
						description: "Try widening status or processor — the queue refreshes after each settlement run."
					});
				}
				PortalDataTable($$renderer, {
					items: rows,
					searchPlaceholder: "Search creator…",
					searchKey: "creatorDisplayName",
					filters,
					row,
					detail,
					empty,
					$$slots: {
						filters: true,
						row: true,
						detail: true,
						empty: true
					}
				});
			}
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
