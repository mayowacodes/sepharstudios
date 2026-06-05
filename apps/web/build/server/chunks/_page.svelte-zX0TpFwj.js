import { ah as attr, au as escape_html, aO as spread_props } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { K as KpiCard } from './KpiCard-p3Xq44Ey.js';
import { C as Clock } from './clock-DYMPyb02.js';
import { D as Dollar_sign } from './dollar-sign-DXCcLKfZ.js';
import { F as File_text } from './file-text-C_v9vOk2.js';
import { U as User_plus } from './user-plus-CNzOwJvd.js';
import { U as Users } from './users-B-WaIXgI.js';
import './button-DY9ayrhs.js';
import './badge-D5b1ba5P.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './skeleton-DCiPgxrC.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';

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
		$$renderer.push(`<div class="container mx-auto px-4 py-4 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button class="text-xs surface-1 hover:surface-2 rounded-full px-3 py-1.5 text-foreground inline-flex items-center gap-1 transition-colors">`);
				Megaphone($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Send broadcast</button> <button class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium inline-flex items-center gap-1 transition-opacity">`);
				User_plus($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Invite creator</button>`);
			}
			PageHeader($$renderer, {
				icon: Users,
				title: "Creator Management",
				subtitle: "Manage creators and their content on the platform.",
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
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-zX0TpFwj.js.map
