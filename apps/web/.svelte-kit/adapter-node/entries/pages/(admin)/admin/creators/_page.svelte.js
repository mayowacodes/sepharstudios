import { jt as escape_html, kt as attr } from "../../../../../chunks/ui-libs.js";
import "../../../../../chunks/coins.js";
import "../../../../../chunks/credit-card.js";
import "../../../../../chunks/dollar-sign.js";
import "../../../../../chunks/wallet.js";
import "../../../../../chunks/button.js";
import "../../../../../chunks/input.js";
import "../../../../../chunks/badge.js";
import "../../../../../chunks/card.js";
import "../../../../../chunks/label.js";
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
		$$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-white">Creator Management</h1> <p class="text-gray-300">Manage creators and their content on the platform</p></div> <div class="flex items-center space-x-4"><button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">📧 Send Broadcast</button> <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">➕ Invite Creator</button></div></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="text-2xl font-bold text-white">${escape_html(creators.filter((c) => c.status === "active").length)}</div> <div class="text-gray-300 text-sm">Active Creators</div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="text-2xl font-bold text-yellow-400">${escape_html(creators.filter((c) => c.status === "pending").length)}</div> <div class="text-gray-300 text-sm">Pending Approval</div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="text-2xl font-bold text-blue-400">${escape_html(creators.reduce((sum, c) => sum + c.contentCount, 0))}</div> <div class="text-gray-300 text-sm">Total Content</div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="text-2xl font-bold text-green-400">$${escape_html(creators.reduce((sum, c) => sum + c.monthlyEarnings, 0).toFixed(0))}</div> <div class="text-gray-300 text-sm">Monthly Payouts</div></div></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><div class="flex flex-col lg:flex-row gap-4"><div class="flex-1"><input type="text" placeholder="Search creators, email, or ministry..."${attr("value", searchQuery)} class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/></div> <div class="flex gap-4">`);
		$$renderer.select({
			value: statusFilter,
			onchange: applyFilters,
			class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
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
			class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
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
			class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
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
		$$renderer.push(` <button class="bg-white/10 hover:bg-white/20 border border-gray-600 rounded-lg px-3 py-2 text-white transition-colors">${escape_html("↓")}</button></div></div></div> `);
		if (selectedCreators.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4"><div class="flex items-center justify-between"><span class="text-blue-400">${escape_html(selectedCreators.length)} creator(s) selected</span> <div class="flex gap-3"><button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Approve</button> <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Suspend</button> <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Clear</button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="p-12 text-center"><div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div> <p class="text-gray-300">Loading creators...</p></div>`);
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
