import { Et as head, Rt as clsx, Tt as ensure_array_like, jt as stringify, yt as attr_class, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Activity } from "../../../../../chunks/activity.js";
import { t as Refresh_cw } from "../../../../../chunks/refresh-cw.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../../chunks/card.js";
//#region src/routes/(admin)/admin/observability/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = null;
		let loading = true;
		let error = null;
		let days = 7;
		async function load() {
			loading = true;
			error = null;
			try {
				const res = await fetch(`/api/admin/observability?days=${days}`);
				if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Failed to load");
				data = await res.json();
			} catch (e) {
				error = e instanceof Error ? e.message : "Failed to load";
			} finally {
				loading = false;
			}
		}
		const pct = (v) => `${(v * 100).toFixed(1)}%`;
		const usd = (v) => `$${v.toFixed(2)}`;
		/**
		* Rates are shown with a severity colour rather than raw numbers alone —
		* "3.1%" means nothing without knowing whether that is normal. These
		* thresholds are starting points to be tuned once there is baseline data.
		*/
		function severity(rate, warn, bad) {
			if (rate >= bad) return "text-destructive";
			if (rate >= warn) return "text-amber-500";
			return "text-emerald-500";
		}
		head("1dsuyp3", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Observability · Admin</title>`);
			});
		});
		PortalHero($$renderer, {
			title: "Observability",
			subtitle: "Playback health, encode outcomes, AI spend and ad delivery",
			icon: Activity
		});
		$$renderer.push(`<!----> <div class="space-y-6 p-4 md:p-6">`);
		if (error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">${escape_html(error)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex items-center justify-between gap-3"><div class="flex gap-2"><!--[-->`);
		const each_array = ensure_array_like([
			1,
			7,
			30
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
		$$renderer.push(`<!----></div> `);
		if (loading && !data) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground">Loading…</p>`);
		} else if (data) {
			$$renderer.push("<!--[1-->");
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Playback health`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div><p class="text-xs text-muted-foreground">Sessions</p> <p class="text-2xl font-semibold">${escape_html(data.playback.sessions.toLocaleString())}</p></div> <div><p class="text-xs text-muted-foreground">Error rate</p> <p${attr_class(`text-2xl font-semibold ${stringify(severity(data.playback.errorRate, .05, .15))}`)}>${escape_html(pct(data.playback.errorRate))}</p></div> <div><p class="text-xs text-muted-foreground">Stall rate</p> <p${attr_class(`text-2xl font-semibold ${stringify(severity(data.playback.stallRate, .1, .25))}`)}>${escape_html(pct(data.playback.stallRate))}</p></div> <div><p class="text-xs text-muted-foreground">Fatal rate</p> <p${attr_class(`text-2xl font-semibold ${stringify(severity(data.playback.fatalRate, .01, .05))}`)}>${escape_html(pct(data.playback.fatalRate))}</p></div> <div><p class="text-xs text-muted-foreground">Avg startup</p> <p class="text-2xl font-semibold">${escape_html(data.playback.avgStartupMs)} ms</p></div> <div><p class="text-xs text-muted-foreground">Avg bitrate</p> <p class="text-2xl font-semibold">${escape_html(data.playback.avgBitrateKbps)} kbps</p></div> <div><p class="text-xs text-muted-foreground">Audio-only sessions</p> <p class="text-2xl font-semibold">${escape_html(pct(data.playback.audioOnlyRate))}</p> <p class="text-[11px] text-muted-foreground">low-bandwidth lever in use</p></div></div>`);
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
									$$renderer.push(`<!---->By geography and device`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							if (data.byGeo.length === 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-sm text-muted-foreground">No playback recorded in this window.</p>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead class="text-left text-muted-foreground"><tr><th class="py-2">Country</th><th>Device</th><th>Sessions</th><th>Avg bitrate</th><th>Error rate</th></tr></thead><tbody><!--[-->`);
								const each_array_1 = ensure_array_like(data.byGeo);
								for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
									let row = each_array_1[$$index_1];
									$$renderer.push(`<tr class="border-t"><td class="py-2">${escape_html(row.country ?? "—")}</td><td>${escape_html(row.deviceType ?? "—")}</td><td>${escape_html(row.sessions.toLocaleString())}</td><td>${escape_html(row.avgBitrateKbps)} kbps</td><td${attr_class(clsx(severity(row.sessions ? row.erroredSessions / row.sessions : 0, .05, .15)))}>${escape_html(pct(row.sessions ? row.erroredSessions / row.sessions : 0))}</td></tr>`);
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
			$$renderer.push(`<!----> <div class="grid gap-6 lg:grid-cols-2">`);
			Card($$renderer, {
				children: ($$renderer) => {
					Card_header($$renderer, {
						children: ($$renderer) => {
							Card_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Encode`);
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
							$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
							const each_array_2 = ensure_array_like(data.encode.byStatus);
							for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
								let s = each_array_2[$$index_2];
								Badge($$renderer, {
									variant: s.status === "failed" ? "destructive" : "secondary",
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(s.status ?? "unknown")}: ${escape_html(s.count)}`);
									},
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!--]--></div> `);
							if (data.encode.topFailures.length > 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div><p class="text-xs text-muted-foreground mb-1">Top failure reasons</p> <ul class="text-sm space-y-1"><!--[-->`);
								const each_array_3 = ensure_array_like(data.encode.topFailures);
								for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
									let f = each_array_3[$$index_3];
									$$renderer.push(`<li class="flex justify-between gap-3 border-t pt-1"><span class="truncate">${escape_html(f.reason)}</span> <span class="text-muted-foreground shrink-0">${escape_html(f.count)}</span></li>`);
								}
								$$renderer.push(`<!--]--></ul></div>`);
							} else $$renderer.push("<!--[-1-->");
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
									$$renderer.push(`<!---->AI spend &amp; ad delivery`);
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
							$$renderer.push(`<div class="grid grid-cols-2 gap-4"><div><p class="text-xs text-muted-foreground">AI spend</p> <p class="text-2xl font-semibold">${escape_html(usd(data.ai.usd))}</p> <p class="text-[11px] text-muted-foreground">${escape_html(data.ai.calls.toLocaleString())} calls</p></div> <div><p class="text-xs text-muted-foreground">Refused (over budget)</p> <p${attr_class(`text-2xl font-semibold ${data.ai.refusedCalls > 0 ? "text-amber-500" : ""}`)}>${escape_html(data.ai.refusedCalls)}</p> <p class="text-[11px] text-muted-foreground">rising = ceiling too low</p></div> <div><p class="text-xs text-muted-foreground">Ads served → started</p> <p class="text-2xl font-semibold">${escape_html(pct(data.ads.renderRate))}</p> <p class="text-[11px] text-muted-foreground">gap is mostly ad-blocking</p></div> <div><p class="text-xs text-muted-foreground">Ads completed</p> <p class="text-2xl font-semibold">${escape_html(data.ads.completed.toLocaleString())}</p></div></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
