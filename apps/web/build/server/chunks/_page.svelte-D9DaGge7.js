import { b as push_element, d as pop_element, l as escape_html, g as attr, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import './card-title-Bb6tCQUO.js';
import './button-C1v8XzqW.js';
import './badge-D_nuztXS.js';
import './input-CTVv5zOe.js';
import './label-99BY3xOG.js';
import './config-DiSGGbdB.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import 'node:crypto';

_page[FILENAME] = "src/routes/(admin)/admin/creators/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let creators = [];
      let filteredCreators = [];
      let selectedCreators = [];
      let searchQuery = "";
      let statusFilter = "all";
      let verificationFilter = "all";
      let sortBy = "joinDate";
      function applyFilters() {
        filteredCreators = creators.filter((creator) => {
          const matchesVerification = verificationFilter === "all";
          return matchesVerification;
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
          {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 212, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 214, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 215, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white">`);
      push_element($$renderer2, "h1", 216, 6);
      $$renderer2.push(`Creator Management</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 217, 6);
      $$renderer2.push(`Manage creators and their content on the platform</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 220, 4);
      $$renderer2.push(`<button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 221, 6);
      $$renderer2.push(`📧 Send Broadcast</button>`);
      pop_element();
      $$renderer2.push(` <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 224, 6);
      $$renderer2.push(`➕ Invite Creator</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 231, 2);
      $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 232, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "div", 233, 6);
      $$renderer2.push(`${escape_html(creators.filter((c) => c.status === "active").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 234, 6);
      $$renderer2.push(`Active Creators</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 236, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 237, 6);
      $$renderer2.push(`${escape_html(creators.filter((c) => c.status === "pending").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 238, 6);
      $$renderer2.push(`Pending Approval</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 240, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 241, 6);
      $$renderer2.push(`${escape_html(creators.reduce((sum, c) => sum + c.contentCount, 0))}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 242, 6);
      $$renderer2.push(`Total Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 244, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 245, 6);
      $$renderer2.push(`$${escape_html(creators.reduce((sum, c) => sum + c.monthlyEarnings, 0).toFixed(0))}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 246, 6);
      $$renderer2.push(`Monthly Payouts</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 251, 2);
      $$renderer2.push(`<div class="flex flex-col lg:flex-row gap-4">`);
      push_element($$renderer2, "div", 252, 4);
      $$renderer2.push(`<div class="flex-1">`);
      push_element($$renderer2, "div", 254, 6);
      $$renderer2.push(`<input type="text" placeholder="Search creators, email, or ministry..."${attr("value", searchQuery)} class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/>`);
      push_element($$renderer2, "input", 255, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex gap-4">`);
      push_element($$renderer2, "div", 265, 6);
      $$renderer2.select(
        {
          value: statusFilter,
          onchange: applyFilters,
          class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Status`);
          });
          $$renderer3.option({ value: "active" }, ($$renderer4) => {
            $$renderer4.push(`Active`);
          });
          $$renderer3.option({ value: "pending" }, ($$renderer4) => {
            $$renderer4.push(`Pending`);
          });
          $$renderer3.option({ value: "suspended" }, ($$renderer4) => {
            $$renderer4.push(`Suspended`);
          });
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          value: verificationFilter,
          onchange: applyFilters,
          class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Verification`);
          });
          $$renderer3.option({ value: "verified" }, ($$renderer4) => {
            $$renderer4.push(`Verified`);
          });
          $$renderer3.option({ value: "pending" }, ($$renderer4) => {
            $$renderer4.push(`Pending`);
          });
          $$renderer3.option({ value: "rejected" }, ($$renderer4) => {
            $$renderer4.push(`Rejected`);
          });
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          value: sortBy,
          onchange: applyFilters,
          class: "bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "joinDate" }, ($$renderer4) => {
            $$renderer4.push(`Join Date`);
          });
          $$renderer3.option({ value: "name" }, ($$renderer4) => {
            $$renderer4.push(`Name`);
          });
          $$renderer3.option({ value: "contentCount" }, ($$renderer4) => {
            $$renderer4.push(`Content Count`);
          });
          $$renderer3.option({ value: "totalViews" }, ($$renderer4) => {
            $$renderer4.push(`Total Views`);
          });
          $$renderer3.option({ value: "monthlyEarnings" }, ($$renderer4) => {
            $$renderer4.push(`Monthly Earnings`);
          });
        }
      );
      $$renderer2.push(` <button class="bg-white/10 hover:bg-white/20 border border-gray-600 rounded-lg px-3 py-2 text-white transition-colors">`);
      push_element($$renderer2, "button", 300, 8);
      $$renderer2.push(`${escape_html("↓")}</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (selectedCreators.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">`);
        push_element($$renderer2, "div", 312, 4);
        $$renderer2.push(`<div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 313, 6);
        $$renderer2.push(`<span class="text-blue-400">`);
        push_element($$renderer2, "span", 314, 8);
        $$renderer2.push(`${escape_html(selectedCreators.length)} creator(s) selected</span>`);
        pop_element();
        $$renderer2.push(` <div class="flex gap-3">`);
        push_element($$renderer2, "div", 315, 8);
        $$renderer2.push(`<button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">`);
        push_element($$renderer2, "button", 316, 10);
        $$renderer2.push(`Approve</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">`);
        push_element($$renderer2, "button", 322, 10);
        $$renderer2.push(`Suspend</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">`);
        push_element($$renderer2, "button", 328, 10);
        $$renderer2.push(`Clear</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">`);
      push_element($$renderer2, "div", 340, 2);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="p-12 text-center">`);
        push_element($$renderer2, "div", 342, 6);
        $$renderer2.push(`<div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4">`);
        push_element($$renderer2, "div", 343, 8);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300">`);
        push_element($$renderer2, "p", 344, 8);
        $$renderer2.push(`Loading creators...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-D9DaGge7.js.map
