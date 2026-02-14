import { E as escape_html, u as attr, C as attr_class, x as stringify } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as ContentStatus, a as ContentType } from './creator-DR-vwnH8.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(admin)/admin/content/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let allContent = [];
      let searchTerm = "";
      let selectedStatus = "all";
      let selectedType = "all";
      let sortBy = "newest";
      let currentPage = 1;
      let itemsPerPage = 12;
      (() => {
        let filtered = allContent.filter((content) => {
          const searchMatch = searchTerm === "";
          return searchMatch;
        });
        switch (sortBy) {
          case "newest":
            filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
            break;
          case "oldest":
            filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
            break;
          case "title":
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "creator":
            filtered.sort((a, b) => a.creatorName.localeCompare(b.creatorName));
            break;
          case "priority":
            const priorityOrder = {
              [ContentStatus.DRAFT]: 5,
              [ContentStatus.SUBMITTED]: 4,
              [ContentStatus.THEOLOGICAL_REVIEW]: 3,
              [ContentStatus.CONTENT_REVIEW]: 2,
              [ContentStatus.TECHNICAL_QA]: 1,
              [ContentStatus.APPROVED]: 0,
              [ContentStatus.PUBLISHED]: -1,
              [ContentStatus.REJECTED]: 0,
              [ContentStatus.ARCHIVED]: -2
            };
            filtered.sort((a, b) => (priorityOrder[b.status] || 0) - (priorityOrder[a.status] || 0));
            break;
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filtered.slice(startIndex, startIndex + itemsPerPage);
      })();
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 276, 0);
      $$renderer2.push(`<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">`);
      push_element($$renderer2, "div", 278, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 279, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 280, 6);
      $$renderer2.push(`Content Management</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 281, 6);
      $$renderer2.push(`Manage all submitted content across the platform</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 285, 4);
      $$renderer2.push(`<div class="bg-blue-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 286, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 287, 8);
      $$renderer2.push(`${escape_html(allContent.filter((c) => c.status === ContentStatus.SUBMITTED).length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-blue-200 text-xs">`);
      push_element($$renderer2, "div", 288, 8);
      $$renderer2.push(`Pending Review</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-green-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 290, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 291, 8);
      $$renderer2.push(`${escape_html(allContent.filter((c) => c.status === ContentStatus.PUBLISHED).length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-green-200 text-xs">`);
      push_element($$renderer2, "div", 292, 8);
      $$renderer2.push(`Published</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-red-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 294, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-red-400">`);
      push_element($$renderer2, "div", 295, 8);
      $$renderer2.push(`${escape_html(allContent.filter((c) => c.status === ContentStatus.REJECTED).length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-red-200 text-xs">`);
      push_element($$renderer2, "div", 296, 8);
      $$renderer2.push(`Rejected</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-purple-600/20 rounded-lg p-3 text-center">`);
      push_element($$renderer2, "div", 298, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 299, 8);
      $$renderer2.push(`${escape_html(allContent.length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-purple-200 text-xs">`);
      push_element($$renderer2, "div", 300, 8);
      $$renderer2.push(`Total Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 306, 2);
      $$renderer2.push(`<div class="flex flex-col lg:flex-row gap-4 mb-4">`);
      push_element($$renderer2, "div", 307, 4);
      $$renderer2.push(`<div class="flex-1">`);
      push_element($$renderer2, "div", 309, 6);
      $$renderer2.push(`<input type="text"${attr("value", searchTerm)} placeholder="Search content, creators, or descriptions..." class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 310, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-wrap gap-3">`);
      push_element($$renderer2, "div", 319, 6);
      $$renderer2.select(
        {
          value: selectedStatus,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Statuses`);
          });
          $$renderer3.option({ value: ContentStatus.SUBMITTED }, ($$renderer4) => {
            $$renderer4.push(`Submitted`);
          });
          $$renderer3.option({ value: ContentStatus.THEOLOGICAL_REVIEW }, ($$renderer4) => {
            $$renderer4.push(`Theological Review`);
          });
          $$renderer3.option({ value: ContentStatus.CONTENT_REVIEW }, ($$renderer4) => {
            $$renderer4.push(`Content Review`);
          });
          $$renderer3.option({ value: ContentStatus.TECHNICAL_QA }, ($$renderer4) => {
            $$renderer4.push(`Technical QA`);
          });
          $$renderer3.option({ value: ContentStatus.APPROVED }, ($$renderer4) => {
            $$renderer4.push(`Approved`);
          });
          $$renderer3.option({ value: ContentStatus.PUBLISHED }, ($$renderer4) => {
            $$renderer4.push(`Published`);
          });
          $$renderer3.option({ value: ContentStatus.REJECTED }, ($$renderer4) => {
            $$renderer4.push(`Rejected`);
          });
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          value: selectedType,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Types`);
          });
          $$renderer3.option({ value: ContentType.MOVIE }, ($$renderer4) => {
            $$renderer4.push(`Movies`);
          });
          $$renderer3.option({ value: ContentType.SERIES }, ($$renderer4) => {
            $$renderer4.push(`Series`);
          });
          $$renderer3.option({ value: ContentType.DOCUMENTARY }, ($$renderer4) => {
            $$renderer4.push(`Documentaries`);
          });
          $$renderer3.option({ value: ContentType.SERMON }, ($$renderer4) => {
            $$renderer4.push(`Sermons`);
          });
          $$renderer3.option({ value: ContentType.WORSHIP }, ($$renderer4) => {
            $$renderer4.push(`Worship`);
          });
          $$renderer3.option({ value: ContentType.KIDS_CONTENT }, ($$renderer4) => {
            $$renderer4.push(`Kids Content`);
          });
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          value: sortBy,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "newest" }, ($$renderer4) => {
            $$renderer4.push(`Newest First`);
          });
          $$renderer3.option({ value: "oldest" }, ($$renderer4) => {
            $$renderer4.push(`Oldest First`);
          });
          $$renderer3.option({ value: "title" }, ($$renderer4) => {
            $$renderer4.push(`Title A-Z`);
          });
          $$renderer3.option({ value: "creator" }, ($$renderer4) => {
            $$renderer4.push(`Creator A-Z`);
          });
          $$renderer3.option({ value: "priority" }, ($$renderer4) => {
            $$renderer4.push(`Priority`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex rounded-lg overflow-hidden">`);
      push_element($$renderer2, "div", 360, 6);
      $$renderer2.push(`<button${attr_class(`px-4 py-2 ${stringify("bg-red-600 text-white")}`)}>`);
      push_element($$renderer2, "button", 361, 8);
      $$renderer2.push(`📊</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`px-4 py-2 ${stringify("bg-white/10 text-gray-300")}`)}>`);
      push_element($$renderer2, "button", 367, 8);
      $$renderer2.push(`📄</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center py-12">`);
        push_element($$renderer2, "div", 414, 4);
        $$renderer2.push(`<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white">`);
        push_element($$renderer2, "div", 415, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-white ml-4">`);
        push_element($$renderer2, "p", 416, 6);
        $$renderer2.push(`Loading content...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-Dbj89h53.js.map
