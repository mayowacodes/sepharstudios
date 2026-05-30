import { gt as ensure_array_like, jt as escape_html, ut as attr_class } from "../../../../chunks/ui-libs.js";
//#region src/routes/(creator)/creator/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let creatorStats = {
			totalContent: 0,
			pendingReview: 0,
			published: 0,
			totalViews: 0,
			monthlyEarnings: 0
		};
		let recentActivity = [];
		$$renderer.push(`<div class="space-y-8"><div class="text-center"><h1 class="text-4xl font-bold text-white mb-2">Welcome to Creator Studio</h1> <p class="text-xl text-gray-300">Manage your faith-based content and reach believers worldwide</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"><div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-blue-400">${escape_html(creatorStats.totalContent)}</div> <div class="text-gray-300 text-sm">Total Content</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-yellow-400">${escape_html(creatorStats.pendingReview)}</div> <div class="text-gray-300 text-sm">Pending Review</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-green-400">${escape_html(creatorStats.published)}</div> <div class="text-gray-300 text-sm">Published</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-purple-400">${escape_html(creatorStats.totalViews.toLocaleString())}</div> <div class="text-gray-300 text-sm">Total Views</div></div> <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"><div class="text-3xl font-bold text-pink-400">$${escape_html(creatorStats.monthlyEarnings.toFixed(2))}</div> <div class="text-gray-300 text-sm">This Month</div></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><a href="/creator/upload" class="bg-linear-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center hover:from-purple-700 hover:to-blue-700 transition-all"><div class="text-4xl mb-4">🎬</div> <h3 class="text-xl font-bold text-white mb-2">Upload New Content</h3> <p class="text-gray-200">Share your ministry with the world</p></a> <a href="/creator/content" class="bg-linear-to-r from-green-600 to-teal-600 rounded-xl p-8 text-center hover:from-green-700 hover:to-teal-700 transition-all"><div class="text-4xl mb-4">📚</div> <h3 class="text-xl font-bold text-white mb-2">Manage Content</h3> <p class="text-gray-200">Edit and organize your library</p></a> <a href="/creator/analytics" class="bg-linear-to-r from-orange-600 to-red-600 rounded-xl p-8 text-center hover:from-orange-700 hover:to-red-700 transition-all"><div class="text-4xl mb-4">📊</div> <h3 class="text-xl font-bold text-white mb-2">View Analytics</h3> <p class="text-gray-200">Track your impact and growth</p></a></div> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6"><h2 class="text-2xl font-bold text-white mb-4">Recent Activity</h2> <div class="space-y-4">`);
		if (recentActivity.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-gray-400 text-sm">No recent activity yet.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(recentActivity);
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let activity = each_array[index];
				$$renderer.push(`<div${attr_class(`flex items-center justify-between py-3 ${index < recentActivity.length - 1 ? "border-b border-gray-700" : ""}`)}><div><div class="text-white font-medium">"${escape_html(activity.title)}"</div> <div class="text-gray-400 text-sm">${escape_html(new Date(activity.createdAt).toLocaleString())}</div></div> <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">${escape_html((activity.status || "submitted").replace(/_/g, " "))}</span></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
export { _page as default };
