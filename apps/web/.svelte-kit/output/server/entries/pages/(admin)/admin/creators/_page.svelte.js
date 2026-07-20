import { Ht as attr, Wt as escape_html, jt as spread_props } from "../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as KpiCard } from "../../../../../chunks/KpiCard.js";
import { t as Clock } from "../../../../../chunks/clock.js";
import "../../../../../chunks/coins.js";
import "../../../../../chunks/credit-card.js";
import { t as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
import { t as Mail } from "../../../../../chunks/mail.js";
import { t as Send } from "../../../../../chunks/send.js";
import { t as User_plus } from "../../../../../chunks/user-plus.js";
import { t as Users } from "../../../../../chunks/users.js";
import "../../../../../chunks/wallet.js";
import { t as X } from "../../../../../chunks/x.js";
import "../../../../../chunks/input.js";
import "../../../../../chunks/button.js";
import "../../../../../chunks/badge.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
import "../../../../../chunks/card.js";
import "../../../../../chunks/label.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/megaphone.svelte
function Megaphone($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "megaphone" },
		props,
		{ iconNode: [
			["path", { "d": "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" }],
			["path", { "d": "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" }],
			["path", { "d": "M8 6v8" }]
		] }
	]));
}
//#endregion
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
				actions,
				$$slots: { actions: true }
			});
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
//#endregion
export { _page as default };
