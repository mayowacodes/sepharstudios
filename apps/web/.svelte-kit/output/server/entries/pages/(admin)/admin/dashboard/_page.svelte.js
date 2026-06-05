import { At as stringify, St as derived, wt as ensure_array_like, yt as attr_style, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Activity } from "../../../../../chunks/activity.js";
import { t as Clock } from "../../../../../chunks/clock.js";
import { t as Monitor } from "../../../../../chunks/monitor.js";
import { t as Shield_check } from "../../../../../chunks/shield-check.js";
import { t as Smartphone } from "../../../../../chunks/smartphone.js";
import { t as Tablet } from "../../../../../chunks/tablet.js";
import { t as Tv } from "../../../../../chunks/tv.js";
import { t as Users } from "../../../../../chunks/users.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import { a as Card, i as Card_content, n as Card_header, r as Card_description, t as Card_title } from "../../../../../chunks/card.js";
import { t as StatChip } from "../../../../../chunks/StatChip.js";
//#region src/routes/(admin)/admin/dashboard/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		const getDeviceIcon = (type) => {
			switch (type) {
				case "tv": return Tv;
				case "tablet": return Tablet;
				case "mobile": return Smartphone;
				default: return Monitor;
			}
		};
		const getDeviceColor = (type) => {
			switch (type) {
				case "tv": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
				case "tablet": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
				case "mobile": return "bg-green-500/10 text-green-500 border-green-500/20";
				default: return "bg-orange-500/10 text-orange-500 border-orange-500/20";
			}
		};
		const totalSessions = derived(() => data.deviceStats.reduce((acc, curr) => acc + curr.count, 0));
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				StatChip($$renderer, {
					label: "active sessions",
					value: totalSessions(),
					tone: "green"
				});
				$$renderer.push(`<!----> `);
				Activity($$renderer, { class: "w-4 h-4 text-green-500 animate-pulse" });
				$$renderer.push(`<!---->`);
			}
			PageHeader($$renderer, {
				icon: Shield_check,
				title: "Platform Pulse",
				subtitle: "Real-time device monitoring and session oversight.",
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
		const each_array = ensure_array_like(data.deviceStats);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let stat = each_array[$$index];
			const Icon = getDeviceIcon(stat.deviceType);
			Card($$renderer, {
				class: "relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300",
				children: ($$renderer) => {
					$$renderer.push(`<div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">`);
					if (Icon) {
						$$renderer.push("<!--[-->");
						Icon($$renderer, { class: "w-16 h-16" });
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(`</div> `);
					Card_header($$renderer, {
						class: "pb-2",
						children: ($$renderer) => {
							Card_description($$renderer, {
								class: "capitalize",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(stat.deviceType || "Unknown")}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Card_title($$renderer, {
								class: "text-3xl font-bold",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(stat.count)}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Card_content($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<div class="w-full bg-muted h-1 rounded-full overflow-hidden"><div class="h-full bg-orange-500"${attr_style(`width: ${stringify(stat.count / totalSessions() * 100)}%`)}></div></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--></div> <div class="space-y-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2 font-semibold text-xl">`);
		Clock($$renderer, { class: "w-5 h-5 text-orange-500" });
		$$renderer.push(`<!----> <h2>Live Session Feed</h2></div> `);
		Badge($$renderer, {
			variant: "outline",
			class: "font-mono",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Real-time Updates On`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> <div class="border rounded-2xl overflow-hidden bg-background divide-y">`);
		const each_array_1 = ensure_array_like(data.recentSessions);
		if (each_array_1.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let session = each_array_1[$$index_1];
				const DeviceIcon = getDeviceIcon(session.deviceType);
				$$renderer.push(`<div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-orange-500 group-hover:text-white transition-colors">`);
				Users($$renderer, { class: "w-5 h-5" });
				$$renderer.push(`<!----></div> <div><div class="font-medium">${escape_html(session.userName)}</div> <div class="text-xs text-muted-foreground">${escape_html(session.userEmail)}</div></div></div> <div class="hidden md:flex flex-col items-center gap-1">`);
				Badge($$renderer, {
					variant: "outline",
					class: getDeviceColor(session.deviceType),
					children: ($$renderer) => {
						$$renderer.push(`<div class="flex items-center gap-1">`);
						if (DeviceIcon) {
							$$renderer.push("<!--[-->");
							DeviceIcon($$renderer, { class: "w-3 h-3" });
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` <span class="capitalize">${escape_html(session.deviceType || "Desktop")}</span></div>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <span class="text-[10px] text-muted-foreground font-mono">${escape_html(session.ipAddress || "0.0.0.0")}</span></div> <div class="text-sm text-muted-foreground font-mono">${escape_html(new Date(session.createdAt).toLocaleTimeString())}</div></div>`);
			}
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push(`<div class="p-10 text-center text-muted-foreground">No active sessions detected.</div>`);
		}
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
export { _page as default };
