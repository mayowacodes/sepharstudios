import { an as escape_html, al as ensure_array_like, ab as attr_class } from './ui-libs-TtGtWAGI.js';
import { A as Activity } from './activity-D0q86z9F.js';
import { C as Coins } from './coins-B3BwYJFB.js';
import { C as Crown } from './crown-BWSJY-VY.js';
import { D as Dollar_sign } from './dollar-sign-C9OpUDWI.js';
import { T as Trending_up } from './trending-up-ByWzB44I.js';
import { U as Users } from './users-Bb_ynahW.js';
import { B as Button } from './button-D9M18H3C.js';
import { B as Badge } from './badge-HJ6WNmX7.js';
import { C as Card, c as Card_header, d as Card_title, a as Card_content } from './card-DdzYeJGJ.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CGEdwVFL.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

//#region src/routes/(admin)/admin/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let adminStats = {
			pendingReviews: 0,
			totalCreators: 0,
			publishedContent: 0,
			rejectedContent: 0,
			totalViews: 0,
			pendingApplications: 0,
			approvedApplications7d: 0,
			avgApprovalHours: 0
		};
		let tokenomicsStats = {
			stcPrice: "0",
			totalStaked: "0",
			activeNFTs: 0,
			monthlyRevenue: "0",
			revenuePool: "0",
			buybackAmount: "0"
		};
		let adminWeb3Status = {
			stcBalance: "0"};
		let urgentReviews = [];
		$$renderer.push(`<div class="space-y-8"><div class="text-center"><div class="flex justify-center items-center space-x-4 mb-4"><h1 class="text-4xl font-bold text-white">Admin Dashboard</h1> `);
		Badge($$renderer, {
			variant: "outline",
			class: "bg-green-500/20 text-green-400 border-green-400",
			children: ($$renderer) => {
				$$renderer.push(`<!---->${escape_html("Web3 Disconnected")}`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (parseFloat(adminWeb3Status.stcBalance) > 1e3) {
			$$renderer.push("<!--[0-->");
			Badge($$renderer, {
				variant: "outline",
				class: "bg-yellow-500/20 text-yellow-400 border-yellow-400",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Super Admin`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <p class="text-xl text-gray-300">Manage platform content and creator community</p> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-yellow-400">${escape_html(adminStats.pendingReviews)}</div> <div class="text-gray-300 text-sm">Pending Reviews</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-blue-400">${escape_html(adminStats.totalCreators)}</div> <div class="text-gray-300 text-sm">Active Creators</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-green-400">${escape_html(adminStats.publishedContent)}</div> <div class="text-gray-300 text-sm">Published Content</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-red-400">${escape_html(adminStats.rejectedContent)}</div> <div class="text-gray-300 text-sm">Rejected Content</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-purple-400">${escape_html(adminStats.totalViews.toLocaleString())}</div> <div class="text-gray-300 text-sm">Platform Views</div></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-yellow-300">${escape_html(adminStats.pendingApplications)}</div> <div class="text-gray-300 text-sm">Pending Creator Apps</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-green-300">${escape_html(adminStats.approvedApplications7d)}</div> <div class="text-gray-300 text-sm">Approved (7 days)</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-blue-300">${escape_html(Number.isFinite(adminStats.avgApprovalHours) ? adminStats.avgApprovalHours.toFixed(1) : "0.0")}</div> <div class="text-gray-300 text-sm">Avg Approval (hrs)</div></div></div> `);
		Card($$renderer, {
			class: "bg-linear-to-r from-primary/20 to-secondary/20",
			children: ($$renderer) => {
				Card_header($$renderer, {
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "flex items-center space-x-2 text-white",
							children: ($$renderer) => {
								Coins($$renderer, { class: "h-6 w-6" });
								$$renderer.push(`<!----> <span>Platform Tokenomics Overview</span>`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"><div class="text-center p-3 bg-white/10 rounded-lg">`);
						Dollar_sign($$renderer, { class: "h-6 w-6 mx-auto mb-2 text-green-400" });
						$$renderer.push(`<!----> <div class="text-lg font-bold text-white">$${escape_html(tokenomicsStats.stcPrice.slice(0, 8))}</div> <div class="text-xs text-gray-300">STC Price</div></div> <div class="text-center p-3 bg-white/10 rounded-lg">`);
						Crown($$renderer, { class: "h-6 w-6 mx-auto mb-2 text-yellow-400" });
						$$renderer.push(`<!----> <div class="text-lg font-bold text-white">${escape_html(tokenomicsStats.activeNFTs.toLocaleString())}</div> <div class="text-xs text-gray-300">Active NFTs</div></div> <div class="text-center p-3 bg-white/10 rounded-lg">`);
						Trending_up($$renderer, { class: "h-6 w-6 mx-auto mb-2 text-blue-400" });
						$$renderer.push(`<!----> <div class="text-lg font-bold text-white">$${escape_html(parseFloat(tokenomicsStats.monthlyRevenue).toLocaleString())}</div> <div class="text-xs text-gray-300">Monthly Revenue</div></div> <div class="text-center p-3 bg-white/10 rounded-lg">`);
						Coins($$renderer, { class: "h-6 w-6 mx-auto mb-2 text-orange-400" });
						$$renderer.push(`<!----> <div class="text-lg font-bold text-white">${escape_html(parseFloat(tokenomicsStats.totalStaked).toLocaleString())}</div> <div class="text-xs text-gray-300">STC Staked</div></div> <div class="text-center p-3 bg-white/10 rounded-lg">`);
						Activity($$renderer, { class: "h-6 w-6 mx-auto mb-2 text-purple-400" });
						$$renderer.push(`<!----> <div class="text-lg font-bold text-white">$${escape_html(parseFloat(tokenomicsStats.buybackAmount).toLocaleString())}</div> <div class="text-xs text-gray-300">Monthly Buyback</div></div> <div class="text-center p-3 bg-white/10 rounded-lg">`);
						Users($$renderer, { class: "h-6 w-6 mx-auto mb-2 text-cyan-400" });
						$$renderer.push(`<!----> <div class="text-lg font-bold text-white">$${escape_html(parseFloat(tokenomicsStats.revenuePool).toLocaleString())}</div> <div class="text-xs text-gray-300">Creator Pool</div></div></div> <div class="mt-4 flex space-x-3">`);
						Button($$renderer, {
							href: "/admin/tokenomics",
							class: "bg-primary hover:bg-primary/90",
							children: ($$renderer) => {
								Coins($$renderer, { class: "mr-2 h-4 w-4" });
								$$renderer.push(`<!----> Manage Tokenomics`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Button($$renderer, {
							href: "/admin/creators",
							variant: "outline",
							children: ($$renderer) => {
								Users($$renderer, { class: "mr-2 h-4 w-4" });
								$$renderer.push(`<!----> Creator Payments`);
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
		$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"><a href="/admin/review" class="bg-linear-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-center hover:from-yellow-700 hover:to-orange-700 transition-all"><div class="text-3xl mb-3">👁️</div> <h3 class="text-lg font-bold text-white mb-1">Review Queue</h3> <p class="text-gray-200 text-sm">Review pending content</p></a> <a href="/admin/content" class="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center hover:from-blue-700 hover:to-indigo-700 transition-all"><div class="text-3xl mb-3">🎬</div> <h3 class="text-lg font-bold text-white mb-1">Content Library</h3> <p class="text-gray-200 text-sm">Manage all content</p></a> <a href="/admin/creators" class="bg-linear-to-r from-green-600 to-teal-600 rounded-xl p-6 text-center hover:from-green-700 hover:to-teal-700 transition-all"><div class="text-3xl mb-3">👥</div> <h3 class="text-lg font-bold text-white mb-1">Creators</h3> <p class="text-gray-200 text-sm">Manage creator accounts</p></a> <a href="/admin/tokenomics" class="bg-linear-to-r from-orange-600 to-amber-600 rounded-xl p-6 text-center hover:from-orange-700 hover:to-amber-700 transition-all"><div class="text-3xl mb-3">💰</div> <h3 class="text-lg font-bold text-white mb-1">Tokenomics</h3> <p class="text-gray-200 text-sm">STC &amp; Revenue Control</p></a> <a href="/admin/policies" class="bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-center hover:from-purple-700 hover:to-indigo-700 transition-all"><div class="text-3xl mb-3">📋</div> <h3 class="text-lg font-bold text-white mb-1">Policies</h3> <p class="text-gray-200 text-sm">Content guidelines</p></a> <a href="/admin/communications" class="bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-center hover:from-cyan-700 hover:to-blue-700 transition-all"><div class="text-3xl mb-3">💬</div> <h3 class="text-lg font-bold text-white mb-1">Messages</h3> <p class="text-gray-200 text-sm">Creator communication</p></a></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-2xl font-bold text-white mb-4">Urgent Reviews Required</h2> <div class="space-y-4">`);
		if (urgentReviews.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-gray-400 text-sm">No pending content reviews.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(urgentReviews);
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let item = each_array[index];
				$$renderer.push(`<div${attr_class(`flex items-center justify-between py-3 ${index < urgentReviews.length - 1 ? "border-b border-gray-700" : ""}`)}><div><div class="text-white font-medium">"${escape_html(item.title)}" - ${escape_html(item.mediaType)}</div> <div class="text-gray-400 text-sm">Submitted ${escape_html(new Date(item.createdAt).toLocaleDateString())}</div></div> <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">Pending</span></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-6"><a href="/admin/review" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg inline-block transition-colors">Review All Pending Content</a></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D-FpN_uG.js.map
