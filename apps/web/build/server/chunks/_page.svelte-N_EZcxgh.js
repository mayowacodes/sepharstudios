import { i as attr, x as attr_class, v as stringify, q as escape_html, ae as attr_style, f as derived, s as spread_props, c as clsx$1 } from './index.js-BP8aAXBX.js';
import { I as Icon } from './Icon-DOH8dWtn.js';
import { A as Arrow_up_right } from './arrow-up-right-DJNsInm9.js';
import { S as Skeleton } from './skeleton-6hclnaPy.js';
import { C as Clock } from './clock-CrS2iB71.js';
import { D as Dollar_sign } from './dollar-sign-DtetC1ya.js';
import { F as File_text } from './file-text-BWq_Qfpf.js';
import { M as Mail } from './mail-CRUGZHP7.js';
import { M as Megaphone } from './megaphone-CiGyROPY.js';
import { S as Send } from './send-CjdUsiSa.js';
import { U as User_plus } from './user-plus-3k8s5o-B.js';
import { U as Users } from './users-C2Q26AgN.js';
import { X } from './x-CH8KQLcs.js';
import './button--do5FSjb.js';
import './badge-CZM4Npzh.js';
import { P as PortalHero } from './PortalHero-B80SkUjg.js';
import { P as PortalButton } from './PortalButton-CmQGGkb7.js';
import './utils2-CqskQpUP.js';
import './index-D1eQaiDA.js';

//#region ../../node_modules/.bun/@lucide+svelte@1.24.0+5726b9c92ebd8575/node_modules/@lucide/svelte/dist/icons/arrow-down-right.svelte
function Arrow_down_right($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-down-right" },
		props,
		{ iconNode: [["path", { "d": "m7 7 10 10" }], ["path", { "d": "M17 7v10H7" }]] }
	]));
}
//#endregion
//#region ../../node_modules/.bun/@lucide+svelte@1.24.0+5726b9c92ebd8575/node_modules/@lucide/svelte/dist/icons/minus.svelte
function Minus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "minus" },
		props,
		{ iconNode: [["path", { "d": "M5 12h14" }]] }
	]));
}
//#endregion
//#region src/lib/components/dashboard/Sparkline.svelte
function Sparkline($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Tiny inline SVG sparkline — meant for KpiCard, not for full charts.
		* Auto-scales min/max from the data points; renders a smooth polyline with
		* an optional area gradient underneath.
		*
		* Lighter than pulling in layerchart for a 30-point line: zero deps,
		* inlines into the parent card with no layout shift.
		*/
		let { data, stroke, fillGradient = true, height = 32, width = 120, class: klass = "" } = $$props;
		const id = derived(() => `spark-grad-${Math.abs(data.length * 37 + (data[0] ?? 0))}`);
		const path = derived(() => {
			if (!data || data.length === 0) return {
				line: "",
				area: ""
			};
			if (data.length === 1) {
				const y = height / 2;
				return {
					line: `M0 ${y} L${width} ${y}`,
					area: ""
				};
			}
			const min = Math.min(...data);
			const range = Math.max(...data) - min || 1;
			const step = width / (data.length - 1);
			const line = data.map((v, i) => {
				return [i * step, height - (v - min) / range * (height - 2) - 1];
			}).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
			return {
				line,
				area: `${line} L${width} ${height} L0 ${height} Z`
			};
		});
		$$renderer.push(`<svg${attr("viewBox", `0 0 ${width} ${height}`)} width="100%"${attr("height", height)} preserveAspectRatio="none"${attr_class(clsx$1(klass))} aria-hidden="true">`);
		if (fillGradient) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<defs><linearGradient${attr("id", id())} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${attr("stop-color", stroke ?? "currentColor")} stop-opacity="0.35"></stop><stop offset="100%"${attr("stop-color", stroke ?? "currentColor")} stop-opacity="0"></stop></linearGradient></defs>`);
			if (path().area) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<path${attr("d", path().area)}${attr("fill", `url(#${id()})`)}></path>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if (path().line) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path${attr("d", path().line)} fill="none"${attr("stroke", stroke ?? "currentColor")} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region src/lib/components/dashboard/KpiCard.svelte
function KpiCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Used to stagger entrance — caller passes the index in its grid. */
		let { label, value, icon: Icon, href, delta = null, deltaLabel, sparkline, accent = "purple", variant = "default", loading = false, index = 0 } = $$props;
		const ACCENT = {
			purple: {
				bar: "bg-purple-500",
				text: "text-purple-300",
				spark: "rgb(168 85 247)"
			},
			blue: {
				bar: "bg-blue-500",
				text: "text-blue-300",
				spark: "rgb(59 130 246)"
			},
			green: {
				bar: "bg-green-500",
				text: "text-green-300",
				spark: "rgb(34 197 94)"
			},
			yellow: {
				bar: "bg-yellow-500",
				text: "text-yellow-300",
				spark: "rgb(234 179 8)"
			},
			red: {
				bar: "bg-red-500",
				text: "text-red-300",
				spark: "rgb(239 68 68)"
			},
			orange: {
				bar: "bg-orange-500",
				text: "text-orange-300",
				spark: "rgb(249 115 22)"
			},
			gray: {
				bar: "bg-gray-500",
				text: "text-gray-300",
				spark: "rgb(156 163 175)"
			}
		};
		const a = derived(() => ACCENT[accent]);
		const compact = derived(() => variant === "compact");
		function deltaClass(d) {
			if (d === null || d === void 0) return "text-gray-400";
			if (d > 0) return "text-green-400";
			if (d < 0) return "text-red-400";
			return "text-gray-400";
		}
		function body($$renderer) {
			$$renderer.push(`<div${attr_class(`surface-2 relative overflow-hidden rounded-xl ${compact() ? "p-4" : "p-5"} transition-colors hover:bg-foreground/5`)}><span${attr_class(`absolute inset-y-0 left-0 w-1 ${stringify(a().bar)}`)}></span> <div class="flex items-start justify-between gap-2"><div class="text-xs uppercase tracking-wide text-muted-foreground">${escape_html(label)}</div> `);
			if (Icon) {
				$$renderer.push("<!--[0-->");
				if (Icon) {
					$$renderer.push("<!--[-->");
					Icon($$renderer, { class: `w-4 h-4 ${stringify(a().text)}` });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="mt-2 flex items-baseline gap-2">`);
			if (loading) {
				$$renderer.push("<!--[0-->");
				Skeleton($$renderer, { class: compact() ? "h-6 w-20" : "h-8 w-28" });
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attr_class(`${compact() ? "text-xl" : "text-2xl"} font-semibold text-foreground tabular-nums`)}>${escape_html(value)}</div>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (!loading && (delta !== null && delta !== void 0 || sparkline)) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-3 flex items-end justify-between gap-3"><div${attr_class(`flex items-center gap-1 text-xs ${stringify(deltaClass(delta))}`)}>`);
				if (delta === null || delta === void 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-muted-foreground">—</span>`);
				} else if (delta > 0) {
					$$renderer.push("<!--[1-->");
					Arrow_up_right($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----> <span class="font-medium">+${escape_html(delta.toFixed(1))}%</span>`);
				} else if (delta < 0) {
					$$renderer.push("<!--[2-->");
					Arrow_down_right($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----> <span class="font-medium">${escape_html(delta.toFixed(1))}%</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					Minus($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----> <span class="font-medium">0%</span>`);
				}
				$$renderer.push(`<!--]--> `);
				if (deltaLabel) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-muted-foreground ml-1">${escape_html(deltaLabel)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> `);
				if (sparkline && sparkline.length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="w-24 h-8"${attr_style(`color: ${stringify(a().spark)}`)}>`);
					Sparkline($$renderer, { data: sparkline });
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		if (href) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a${attr("href", href)} class="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl">`);
			body($$renderer);
			$$renderer.push(`<!----></a>`);
		} else {
			$$renderer.push("<!--[-1-->");
			body($$renderer);
		}
		$$renderer.push(`<!--]-->`);
	});
}

//#region src/routes/(admin)/admin/creators/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let creators = [];
		let filteredCreators = [];
		let selectedCreators = [];
		let searchQuery = "";
		let statusFilter = "all";
		let verificationFilter = "all";
		let sortBy = "joinDate";
		function applyFilters() {
			filteredCreators = creators.filter((creator) => {
				return true;
			});
			filteredCreators.sort((a, b) => {
				let aValue, bValue;
				switch (sortBy) {
					case "name":
						aValue = a.name.toLowerCase();
						bValue = b.name.toLowerCase();
						break;
					case "joinDate":
						aValue = new Date(a.joinDate);
						bValue = new Date(b.joinDate);
						break;
					case "contentCount":
						aValue = a.contentCount;
						bValue = b.contentCount;
						break;
					case "totalViews":
						aValue = a.totalViews;
						bValue = b.totalViews;
						break;
					case "monthlyEarnings":
						aValue = a.monthlyEarnings;
						bValue = b.monthlyEarnings;
						break;
					default:
						aValue = a.joinDate;
						bValue = b.joinDate;
				}
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
			});
		}
		let broadcastOpen = false;
		let broadcastSubject = "";
		let broadcastBody = "";
		let broadcastTarget = "active";
		let broadcastSending = false;
		let inviteOpen = false;
		let inviteEmail = "";
		let inviteName = "";
		let inviteSending = false;
		$$renderer.push(`<div class="mx-auto px-4 py-4 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "secondary",
					size: "sm",
					onclick: () => broadcastOpen = true,
					children: ($$renderer) => {
						Megaphone($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Broadcast`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				PortalButton($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: () => inviteOpen = true,
					children: ($$renderer) => {
						User_plus($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Invite creator`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Community",
				title: "Creator management",
				subtitle: "Manage creators and their content on the platform.",
				icon: Users,
				actions});
		}
		$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`);
		KpiCard($$renderer, {
			label: "Active Creators",
			value: creators.filter((c) => c.status === "active").length,
			icon: Users,
			accent: "green",
			variant: "compact",
			index: 0
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Pending Approval",
			value: creators.filter((c) => c.status === "pending").length,
			icon: Clock,
			accent: "yellow",
			variant: "compact",
			index: 1
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Total Content",
			value: creators.reduce((sum, c) => sum + c.contentCount, 0),
			icon: File_text,
			accent: "blue",
			variant: "compact",
			index: 2
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Monthly Payouts",
			value: `$${creators.reduce((sum, c) => sum + c.monthlyEarnings, 0).toFixed(0)}`,
			icon: Dollar_sign,
			accent: "orange",
			variant: "compact",
			index: 3
		});
		$$renderer.push(`<!----></div> <div class="surface-1 backdrop-blur-sm rounded-xl p-6"><div class="flex flex-col lg:flex-row gap-4"><div class="flex-1"><input type="text" placeholder="Search creators, email, or ministry..."${attr("value", searchQuery)} class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"/></div> <div class="flex gap-4">`);
		$$renderer.select({
			value: statusFilter,
			onchange: applyFilters,
			class: "surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Status`);
			});
			$$renderer.option({ value: "active" }, ($$renderer) => {
				$$renderer.push(`Active`);
			});
			$$renderer.option({ value: "pending" }, ($$renderer) => {
				$$renderer.push(`Pending`);
			});
			$$renderer.option({ value: "suspended" }, ($$renderer) => {
				$$renderer.push(`Suspended`);
			});
		});
		$$renderer.push(` `);
		$$renderer.select({
			value: verificationFilter,
			onchange: applyFilters,
			class: "surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Verification`);
			});
			$$renderer.option({ value: "verified" }, ($$renderer) => {
				$$renderer.push(`Verified`);
			});
			$$renderer.option({ value: "pending" }, ($$renderer) => {
				$$renderer.push(`Pending`);
			});
			$$renderer.option({ value: "rejected" }, ($$renderer) => {
				$$renderer.push(`Rejected`);
			});
		});
		$$renderer.push(` `);
		$$renderer.select({
			value: sortBy,
			onchange: applyFilters,
			class: "surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
		}, ($$renderer) => {
			$$renderer.option({ value: "joinDate" }, ($$renderer) => {
				$$renderer.push(`Join Date`);
			});
			$$renderer.option({ value: "name" }, ($$renderer) => {
				$$renderer.push(`Name`);
			});
			$$renderer.option({ value: "contentCount" }, ($$renderer) => {
				$$renderer.push(`Content Count`);
			});
			$$renderer.option({ value: "totalViews" }, ($$renderer) => {
				$$renderer.push(`Total Views`);
			});
			$$renderer.option({ value: "monthlyEarnings" }, ($$renderer) => {
				$$renderer.push(`Monthly Earnings`);
			});
		});
		$$renderer.push(` <button class="surface-2 hover:surface-3 border border-gray-600 rounded-lg px-3 py-2 text-foreground transition-colors">${escape_html("↓")}</button></div></div></div> `);
		if (selectedCreators.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4"><div class="flex items-center justify-between"><span class="text-blue-400">${escape_html(selectedCreators.length)} creator(s) selected</span> <div class="flex gap-3"><button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Approve</button> <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Suspend</button> <button class="bg-gray-600 hover:bg-gray-700 text-foreground px-4 py-2 rounded-lg text-sm transition-colors">Clear</button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="surface-1 backdrop-blur-sm rounded-xl overflow-hidden">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="p-12 text-center"><div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div> <p class="text-foreground/80">Loading creators...</p></div>`);
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (broadcastOpen) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true"><div class="surface-glass border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4"><div class="flex items-center justify-between"><h3 class="text-base font-semibold text-foreground inline-flex items-center gap-2">`);
			Megaphone($$renderer, { class: "w-4 h-4 text-primary" });
			$$renderer.push(`<!----> Broadcast to creators</h3> <button class="text-muted-foreground hover:text-foreground" aria-label="Close">`);
			X($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button></div> <div><label for="b-target" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Audience</label> `);
			$$renderer.select({
				id: "b-target",
				value: broadcastTarget,
				class: "w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground"
			}, ($$renderer) => {
				$$renderer.option({ value: "active" }, ($$renderer) => {
					$$renderer.push(`Active creators only`);
				});
				$$renderer.option({ value: "pending" }, ($$renderer) => {
					$$renderer.push(`Pending creators only`);
				});
				$$renderer.option({ value: "all" }, ($$renderer) => {
					$$renderer.push(`All creators`);
				});
			});
			$$renderer.push(`</div> <div><label for="b-subject" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Subject</label> <input id="b-subject" type="text"${attr("value", broadcastSubject)} maxlength="120" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground"/></div> <div><label for="b-body" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</label> <textarea id="b-body" rows="5" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground resize-none">`);
			const $$body = escape_html(broadcastBody);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div> <p class="text-xs text-muted-foreground">Will send to ${escape_html(creators.filter((c) => c.status === broadcastTarget).length)} creator${escape_html(creators.filter((c) => c.status === broadcastTarget).length === 1 ? "" : "s")}.</p> <div class="flex gap-2 justify-end"><button class="px-3 py-1.5 rounded-md surface-1 hover:surface-2 text-foreground text-sm">Cancel</button> <button${attr("disabled", broadcastSending, true)} class="px-3 py-1.5 rounded-md bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5">`);
			Send($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> ${escape_html("Send broadcast")}</button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (inviteOpen) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true"><div class="surface-glass border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4"><div class="flex items-center justify-between"><h3 class="text-base font-semibold text-foreground inline-flex items-center gap-2">`);
			User_plus($$renderer, { class: "w-4 h-4 text-primary" });
			$$renderer.push(`<!----> Invite a creator</h3> <button class="text-muted-foreground hover:text-foreground" aria-label="Close">`);
			X($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button></div> <div><label for="i-email" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Email *</label> <input id="i-email" type="email"${attr("value", inviteEmail)} placeholder="creator@example.com" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground"/></div> <div><label for="i-name" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Display name (optional)</label> <input id="i-name" type="text"${attr("value", inviteName)} placeholder="Their channel name" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground"/></div> <p class="text-xs text-muted-foreground">An invitation email with a sign-up link will be sent.</p> <div class="flex gap-2 justify-end"><button class="px-3 py-1.5 rounded-md surface-1 hover:surface-2 text-foreground text-sm">Cancel</button> <button${attr("disabled", inviteSending, true)} class="px-3 py-1.5 rounded-md bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5">`);
			Mail($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> ${escape_html("Send invite")}</button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-N_EZcxgh.js.map
