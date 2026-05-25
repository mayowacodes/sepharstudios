import { a as push_element, b as pop_element, e as escape_html, i as ensure_array_like, j as attr_class, F as FILENAME } from "../../../../chunks/ui-libs.js";
_page[FILENAME] = "src/routes/(creator)/creator/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let creatorStats = {
        totalContent: 0,
        pendingReview: 0,
        published: 0,
        totalViews: 0,
        monthlyEarnings: 0
      };
      let recentActivity = [];
      $$renderer2.push(`<div class="space-y-8">`);
      push_element($$renderer2, "div", 33, 0);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 35, 2);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 36, 4);
      $$renderer2.push(`Welcome to Creator Studio</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 37, 4);
      $$renderer2.push(`Manage your faith-based content and reach believers worldwide</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">`);
      push_element($$renderer2, "div", 41, 2);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 42, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 43, 6);
      $$renderer2.push(`${escape_html(creatorStats.totalContent)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 44, 6);
      $$renderer2.push(`Total Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 47, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 48, 6);
      $$renderer2.push(`${escape_html(creatorStats.pendingReview)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 49, 6);
      $$renderer2.push(`Pending Review</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 52, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 53, 6);
      $$renderer2.push(`${escape_html(creatorStats.published)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 54, 6);
      $$renderer2.push(`Published</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 57, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 58, 6);
      $$renderer2.push(`${escape_html(creatorStats.totalViews.toLocaleString())}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 59, 6);
      $$renderer2.push(`Total Views</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 62, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-pink-400">`);
      push_element($$renderer2, "div", 63, 6);
      $$renderer2.push(`$${escape_html(creatorStats.monthlyEarnings.toFixed(2))}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 64, 6);
      $$renderer2.push(`This Month</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
      push_element($$renderer2, "div", 69, 2);
      $$renderer2.push(`<a href="/creator/upload" class="bg-linear-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center hover:from-purple-700 hover:to-blue-700 transition-all">`);
      push_element($$renderer2, "a", 70, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 71, 6);
      $$renderer2.push(`🎬</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 72, 6);
      $$renderer2.push(`Upload New Content</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200">`);
      push_element($$renderer2, "p", 73, 6);
      $$renderer2.push(`Share your ministry with the world</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/content" class="bg-linear-to-r from-green-600 to-teal-600 rounded-xl p-8 text-center hover:from-green-700 hover:to-teal-700 transition-all">`);
      push_element($$renderer2, "a", 76, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 77, 6);
      $$renderer2.push(`📚</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 78, 6);
      $$renderer2.push(`Manage Content</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200">`);
      push_element($$renderer2, "p", 79, 6);
      $$renderer2.push(`Edit and organize your library</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/analytics" class="bg-linear-to-r from-orange-600 to-red-600 rounded-xl p-8 text-center hover:from-orange-700 hover:to-red-700 transition-all">`);
      push_element($$renderer2, "a", 82, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 83, 6);
      $$renderer2.push(`📊</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 84, 6);
      $$renderer2.push(`View Analytics</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200">`);
      push_element($$renderer2, "p", 85, 6);
      $$renderer2.push(`Track your impact and growth</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 90, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h2", 91, 4);
      $$renderer2.push(`Recent Activity</h2>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 92, 4);
      if (recentActivity.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 94, 8);
        $$renderer2.push(`No recent activity yet.</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(recentActivity);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let activity = each_array[index];
          $$renderer2.push(`<div${attr_class(`flex items-center justify-between py-3 ${index < recentActivity.length - 1 ? "border-b border-gray-700" : ""}`)}>`);
          push_element($$renderer2, "div", 97, 10);
          $$renderer2.push(`<div>`);
          push_element($$renderer2, "div", 98, 12);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 99, 14);
          $$renderer2.push(`"${escape_html(activity.title)}"</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 100, 14);
          $$renderer2.push(`${escape_html(new Date(activity.createdAt).toLocaleString())}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">`);
          push_element($$renderer2, "span", 102, 12);
          $$renderer2.push(`${escape_html((activity.status || "submitted").replace(/_/g, " "))}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
