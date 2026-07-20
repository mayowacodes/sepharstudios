import { Et as derived, Ot as ensure_array_like, Wt as escape_html } from "../../../../../../chunks/ui-libs.js";
import { t as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { t as Banknote } from "../../../../../../chunks/banknote.js";
import { t as Shield_alert } from "../../../../../../chunks/shield-alert.js";
import { t as Users } from "../../../../../../chunks/users.js";
import { t as Video } from "../../../../../../chunks/video.js";
import { n as toast } from "../../../../../../chunks/toast-state.svelte.js";
import { t as page } from "../../../../../../chunks/state.js";
import { t as Skeleton } from "../../../../../../chunks/skeleton.js";
import { t as PortalHero } from "../../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../../chunks/PortalButton.js";
//#region src/routes/(admin)/admin/users/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const userId = derived(() => page.params.id);
		let data = null;
		let loading = true;
		let banning = false;
		async function load() {
			loading = true;
			try {
				const res = await fetch(`/api/admin/users/${userId()}`);
				if (!res.ok) {
					toast.error("Failed to load user");
					return;
				}
				data = await res.json();
			} finally {
				loading = false;
			}
		}
		async function warn() {
			const message = prompt("Warning message to send:");
			if (!message) return;
			if ((await fetch(`/api/admin/users/${userId()}/warn`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message })
			})).ok) toast.success("Warning sent");
			else toast.error("Failed to warn");
		}
		async function ban() {
			if (!data) return;
			const reason = prompt("Reason for ban:");
			if (!reason) return;
			const expiresAt = prompt("Ban expires at (YYYY-MM-DD, blank for permanent):") || null;
			banning = true;
			try {
				if ((await fetch(`/api/admin/users/${userId()}/ban`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						reason,
						expiresAt
					})
				})).ok) {
					toast.success("User banned");
					await load();
				} else toast.error("Failed to ban");
			} finally {
				banning = false;
			}
		}
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-6xl space-y-6"><a href="/admin/users" class="text-xs inline-flex items-center gap-1 transition-colors" style="color: hsl(var(--portal-accent));">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> All users</a> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			Skeleton($$renderer, { class: "h-24 rounded-xl" });
			$$renderer.push(`<!----> <div class="grid grid-cols-3 gap-3">`);
			Skeleton($$renderer, { class: "h-32 rounded-xl" });
			$$renderer.push(`<!----> `);
			Skeleton($$renderer, { class: "h-32 rounded-xl" });
			$$renderer.push(`<!----> `);
			Skeleton($$renderer, { class: "h-32 rounded-xl" });
			$$renderer.push(`<!----></div>`);
		} else if (data) {
			$$renderer.push("<!--[1-->");
			{
				function actions($$renderer) {
					if (!data?.user.banned) {
						$$renderer.push("<!--[0-->");
						PortalButton($$renderer, {
							variant: "secondary",
							size: "sm",
							onclick: warn,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Warn`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						PortalButton($$renderer, {
							variant: "destructive",
							size: "sm",
							onclick: ban,
							disabled: banning,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Ban`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				PortalHero($$renderer, {
					compact: true,
					eyebrow: "Audience · individual",
					title: data.user.name,
					subtitle: `${data.user.email} · joined ${new Date(data.user.createdAt).toLocaleDateString()} · role: ${data.user.role ?? "user"}${data.user.banned ? " · ⚠ BANNED" : ""}`,
					icon: Users,
					statusDot: !!data.user.banned,
					statusText: data.user.banned ? `Banned: ${data?.user.banReason ?? "(no reason)"}` : void 0,
					statusTone: data.user.banned ? "danger" : "neutral",
					actions,
					$$slots: { actions: true }
				});
			}
			$$renderer.push(`<!----> `);
			if (data.user.banned) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="surface-1 border border-red-500/40 bg-red-500/10 rounded-xl p-4"><div class="flex items-center gap-2 text-red-100">`);
				Shield_alert($$renderer, { class: "w-4 h-4" });
				$$renderer.push(`<!----> <span class="text-sm font-semibold">User is banned</span></div> <p class="text-sm text-red-50 mt-2">${escape_html(data.user.banReason ?? "No reason provided.")}</p> `);
				if (data.user.banExpires) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-xs text-red-200 mt-1">Expires: ${escape_html(new Date(data.user.banExpires).toLocaleString())}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-3 gap-3"><div class="surface-1 rounded-xl p-4"><div class="text-xs uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">`);
			Banknote($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> Lifetime PPV</div> <div class="text-2xl font-bold text-foreground mt-1">$${escape_html((data.ppvLifetimeCents / 100).toFixed(2))}</div> <div class="text-xs text-muted-foreground mt-1">${escape_html(data.ppvPurchases.length)} purchases</div></div> <div class="surface-1 rounded-xl p-4"><div class="text-xs uppercase tracking-wide text-muted-foreground">Subscription</div> `);
			if (data.subscription) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-2xl font-bold text-foreground mt-1 capitalize">${escape_html(data.subscription.tier)}</div> <div class="text-xs text-muted-foreground mt-1">until ${escape_html(new Date(data.subscription.endDate).toLocaleDateString())}${escape_html(data.subscription.autoRenew ? " · auto-renew" : "")}</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="text-2xl font-bold text-muted-foreground mt-1">—</div> <div class="text-xs text-muted-foreground mt-1">No active subscription</div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="surface-1 rounded-xl p-4"><div class="text-xs uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">`);
			Shield_alert($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> Reports against</div> <div class="text-2xl font-bold text-foreground mt-1">${escape_html(data.abuseReportsAgainst.length)}</div> <div class="text-xs text-muted-foreground mt-1">${escape_html(data.abuseReportsBy.length)} filed by them</div></div></div> `);
			if (data.ownedContent.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<section><h2 class="text-sm font-semibold text-foreground mb-2 inline-flex items-center gap-1.5">`);
				Video($$renderer, { class: "w-4 h-4" });
				$$renderer.push(`<!----> Content they own</h2> <div class="surface-1 rounded-xl overflow-hidden"><table class="w-full text-sm"><thead class="surface-1"><tr class="text-left text-xs uppercase tracking-wide text-muted-foreground"><th class="px-4 py-2">Title</th><th class="px-4 py-2">Status</th><th class="px-4 py-2 text-right">Views</th></tr></thead><tbody><!--[-->`);
				const each_array = ensure_array_like(data.ownedContent);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let c = each_array[$$index];
					$$renderer.push(`<tr class="border-t border-white/5"><td class="px-4 py-2 text-foreground">${escape_html(c.title)}</td><td class="px-4 py-2 text-xs text-foreground/80">${escape_html(c.status)}</td><td class="px-4 py-2 text-right text-foreground/80 tabular-nums">${escape_html((c.viewCount ?? 0).toLocaleString())}</td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div></section>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.ppvPurchases.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<section><h2 class="text-sm font-semibold text-foreground mb-2">PPV purchases</h2> <div class="surface-1 rounded-xl overflow-hidden"><table class="w-full text-sm"><thead class="surface-1"><tr class="text-left text-xs uppercase tracking-wide text-muted-foreground"><th class="px-4 py-2">Content</th><th class="px-4 py-2">Date</th><th class="px-4 py-2 text-right">Amount</th></tr></thead><tbody><!--[-->`);
				const each_array_1 = ensure_array_like(data.ppvPurchases);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let p = each_array_1[$$index_1];
					$$renderer.push(`<tr class="border-t border-white/5"><td class="px-4 py-2 text-foreground">${escape_html(p.contentTitle ?? p.contentId.slice(0, 12))}</td><td class="px-4 py-2 text-xs text-muted-foreground">${escape_html(new Date(p.createdAt).toLocaleDateString())}</td><td class="px-4 py-2 text-right tabular-nums">$${escape_html((p.amountPaidCents / 100).toFixed(2))} ${escape_html(p.currency ?? "USD")}</td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div></section>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.abuseReportsAgainst.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<section><h2 class="text-sm font-semibold text-foreground mb-2 inline-flex items-center gap-1.5">`);
				Shield_alert($$renderer, { class: "w-4 h-4 text-yellow-300" });
				$$renderer.push(`<!----> Reports against this user</h2> <ul class="space-y-1"><!--[-->`);
				const each_array_2 = ensure_array_like(data.abuseReportsAgainst);
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let r = each_array_2[$$index_2];
					$$renderer.push(`<li class="surface-1 rounded p-2 text-xs flex items-center gap-2"><span class="text-yellow-200 capitalize">${escape_html(r.category.replace("_", " "))}</span> <span class="text-muted-foreground">· ${escape_html(new Date(r.createdAt).toLocaleDateString())}</span> <span class="ml-auto text-muted-foreground">${escape_html(r.status)}</span></li>`);
				}
				$$renderer.push(`<!--]--></ul></section>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.recentSessions.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<section><h2 class="text-sm font-semibold text-foreground mb-2">Recent sessions</h2> <ul class="space-y-1 text-xs"><!--[-->`);
				const each_array_3 = ensure_array_like(data.recentSessions);
				for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
					let s = each_array_3[i];
					$$renderer.push(`<li class="surface-1 rounded p-2 flex justify-between text-foreground/80"><span>${escape_html(s.deviceType ?? "unknown")} · ${escape_html(s.ip ?? "?")}</span> <span class="text-muted-foreground">${escape_html(new Date(s.expiresAt).toLocaleString())}</span></li>`);
				}
				$$renderer.push(`<!--]--></ul></section>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
