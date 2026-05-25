import { a as push_element, b as pop_element, p as prevent_snippet_stringification, e as escape_html, i as ensure_array_like, j as attr_class, F as FILENAME } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/config.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../../chunks/card-title.js";
import "clsx";
import { B as Badge } from "../../../../chunks/badge.js";
import { B as Button } from "../../../../chunks/button.js";
import { C as Coins } from "../../../../chunks/coins.js";
import { D as Dollar_sign, T as Trending_up } from "../../../../chunks/trending-up.js";
import { C as Crown } from "../../../../chunks/crown.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { U as Users } from "../../../../chunks/users.js";
_page[FILENAME] = "src/routes/(admin)/admin/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
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
        stcBalance: "0"
      };
      let urgentReviews = [];
      $$renderer2.push(`<div class="space-y-8">`);
      push_element($$renderer2, "div", 104, 0);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 106, 2);
      $$renderer2.push(`<div class="flex justify-center items-center space-x-4 mb-4">`);
      push_element($$renderer2, "div", 107, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white">`);
      push_element($$renderer2, "h1", 108, 6);
      $$renderer2.push(`Admin Dashboard</h1>`);
      pop_element();
      $$renderer2.push(` `);
      Badge($$renderer2, {
        variant: "outline",
        class: "bg-green-500/20 text-green-400 border-green-400",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html("Web3 Disconnected")}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      if (parseFloat(adminWeb3Status.stcBalance) > 1e3) {
        $$renderer2.push("<!--[-->");
        Badge($$renderer2, {
          variant: "outline",
          class: "bg-yellow-500/20 text-yellow-400 border-yellow-400",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Super Admin`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 123, 4);
      $$renderer2.push(`Manage platform content and creator community</p>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">`);
      push_element($$renderer2, "div", 132, 2);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 133, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 134, 6);
      $$renderer2.push(`${escape_html(adminStats.pendingReviews)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 135, 6);
      $$renderer2.push(`Pending Reviews</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 138, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 139, 6);
      $$renderer2.push(`${escape_html(adminStats.totalCreators)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 140, 6);
      $$renderer2.push(`Active Creators</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 143, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 144, 6);
      $$renderer2.push(`${escape_html(adminStats.publishedContent)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 145, 6);
      $$renderer2.push(`Published Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 148, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-red-400">`);
      push_element($$renderer2, "div", 149, 6);
      $$renderer2.push(`${escape_html(adminStats.rejectedContent)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 150, 6);
      $$renderer2.push(`Rejected Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 153, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 154, 6);
      $$renderer2.push(`${escape_html(adminStats.totalViews.toLocaleString())}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 155, 6);
      $$renderer2.push(`Platform Views</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
      push_element($$renderer2, "div", 159, 2);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 160, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-yellow-300">`);
      push_element($$renderer2, "div", 161, 6);
      $$renderer2.push(`${escape_html(adminStats.pendingApplications)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 162, 6);
      $$renderer2.push(`Pending Creator Apps</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 164, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-green-300">`);
      push_element($$renderer2, "div", 165, 6);
      $$renderer2.push(`${escape_html(adminStats.approvedApplications7d)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 166, 6);
      $$renderer2.push(`Approved (7 days)</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 168, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-blue-300">`);
      push_element($$renderer2, "div", 169, 6);
      $$renderer2.push(`${escape_html(Number.isFinite(adminStats.avgApprovalHours) ? adminStats.avgApprovalHours.toFixed(1) : "0.0")}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 172, 6);
      $$renderer2.push(`Avg Approval (hrs)</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Card($$renderer2, {
        class: "bg-linear-to-r from-primary/20 to-secondary/20",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center space-x-2 text-white",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Coins($$renderer5, { class: "h-6 w-6" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 181, 8);
                  $$renderer5.push(`Platform Tokenomics Overview</span>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">`);
              push_element($$renderer4, "div", 185, 6);
              $$renderer4.push(`<div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 186, 8);
              Dollar_sign($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-green-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 188, 10);
              $$renderer4.push(`$${escape_html(tokenomicsStats.stcPrice.slice(0, 8))}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 189, 10);
              $$renderer4.push(`STC Price</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 191, 8);
              Crown($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-yellow-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 193, 10);
              $$renderer4.push(`${escape_html(tokenomicsStats.activeNFTs.toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 194, 10);
              $$renderer4.push(`Active NFTs</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 196, 8);
              Trending_up($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-blue-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 198, 10);
              $$renderer4.push(`$${escape_html(parseFloat(tokenomicsStats.monthlyRevenue).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 199, 10);
              $$renderer4.push(`Monthly Revenue</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 201, 8);
              Coins($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-orange-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 203, 10);
              $$renderer4.push(`${escape_html(parseFloat(tokenomicsStats.totalStaked).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 204, 10);
              $$renderer4.push(`STC Staked</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 206, 8);
              Activity($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-purple-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 208, 10);
              $$renderer4.push(`$${escape_html(parseFloat(tokenomicsStats.buybackAmount).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 209, 10);
              $$renderer4.push(`Monthly Buyback</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 211, 8);
              Users($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-cyan-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 213, 10);
              $$renderer4.push(`$${escape_html(parseFloat(tokenomicsStats.revenuePool).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 214, 10);
              $$renderer4.push(`Creator Pool</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="mt-4 flex space-x-3">`);
              push_element($$renderer4, "div", 217, 6);
              Button($$renderer4, {
                href: "/admin/tokenomics",
                class: "bg-primary hover:bg-primary/90",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Coins($$renderer5, { class: "mr-2 h-4 w-4" });
                  $$renderer5.push(`<!----> Manage Tokenomics`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                href: "/admin/creators",
                variant: "outline",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Users($$renderer5, { class: "mr-2 h-4 w-4" });
                  $$renderer5.push(`<!----> Creator Payments`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">`);
      push_element($$renderer2, "div", 231, 2);
      $$renderer2.push(`<a href="/admin/review" class="bg-linear-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-center hover:from-yellow-700 hover:to-orange-700 transition-all">`);
      push_element($$renderer2, "a", 232, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 233, 6);
      $$renderer2.push(`👁️</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 234, 6);
      $$renderer2.push(`Review Queue</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 235, 6);
      $$renderer2.push(`Review pending content</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/content" class="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center hover:from-blue-700 hover:to-indigo-700 transition-all">`);
      push_element($$renderer2, "a", 238, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 239, 6);
      $$renderer2.push(`🎬</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 240, 6);
      $$renderer2.push(`Content Library</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 241, 6);
      $$renderer2.push(`Manage all content</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/creators" class="bg-linear-to-r from-green-600 to-teal-600 rounded-xl p-6 text-center hover:from-green-700 hover:to-teal-700 transition-all">`);
      push_element($$renderer2, "a", 244, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 245, 6);
      $$renderer2.push(`👥</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 246, 6);
      $$renderer2.push(`Creators</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 247, 6);
      $$renderer2.push(`Manage creator accounts</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/tokenomics" class="bg-linear-to-r from-orange-600 to-amber-600 rounded-xl p-6 text-center hover:from-orange-700 hover:to-amber-700 transition-all">`);
      push_element($$renderer2, "a", 250, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 251, 6);
      $$renderer2.push(`💰</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 252, 6);
      $$renderer2.push(`Tokenomics</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 253, 6);
      $$renderer2.push(`STC &amp; Revenue Control</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/policies" class="bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-center hover:from-purple-700 hover:to-indigo-700 transition-all">`);
      push_element($$renderer2, "a", 256, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 257, 6);
      $$renderer2.push(`📋</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 258, 6);
      $$renderer2.push(`Policies</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 259, 6);
      $$renderer2.push(`Content guidelines</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/communications" class="bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-center hover:from-cyan-700 hover:to-blue-700 transition-all">`);
      push_element($$renderer2, "a", 262, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 263, 6);
      $$renderer2.push(`💬</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 264, 6);
      $$renderer2.push(`Messages</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 265, 6);
      $$renderer2.push(`Creator communication</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 270, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h2", 271, 4);
      $$renderer2.push(`Urgent Reviews Required</h2>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 272, 4);
      if (urgentReviews.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 274, 8);
        $$renderer2.push(`No pending content reviews.</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(urgentReviews);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let item = each_array[index];
          $$renderer2.push(`<div${attr_class(`flex items-center justify-between py-3 ${index < urgentReviews.length - 1 ? "border-b border-gray-700" : ""}`)}>`);
          push_element($$renderer2, "div", 277, 10);
          $$renderer2.push(`<div>`);
          push_element($$renderer2, "div", 278, 12);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 279, 14);
          $$renderer2.push(`"${escape_html(item.title)}" - ${escape_html(item.mediaType)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 280, 14);
          $$renderer2.push(`Submitted ${escape_html(new Date(item.createdAt).toLocaleDateString())}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">`);
          push_element($$renderer2, "span", 282, 12);
          $$renderer2.push(`Pending</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-6">`);
      push_element($$renderer2, "div", 288, 4);
      $$renderer2.push(`<a href="/admin/review" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg inline-block transition-colors">`);
      push_element($$renderer2, "a", 289, 6);
      $$renderer2.push(`Review All Pending Content</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
