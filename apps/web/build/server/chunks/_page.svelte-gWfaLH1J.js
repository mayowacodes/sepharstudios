import { F as FILENAME } from './index-client-DVey9PBT.js';
import { u as attr, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as ContentStatus, a as ContentType } from './creator-DR-vwnH8.js';

_page[FILENAME] = "src/routes/(creator)/creator/content/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let contentLibrary = [];
      let selectedFilter = "all";
      let searchTerm = "";
      let selectedType = "all";
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 168, 0);
      $$renderer2.push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">`);
      push_element($$renderer2, "div", 170, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 171, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 172, 6);
      $$renderer2.push(`Content Library</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 173, 6);
      $$renderer2.push(`Manage your submitted content and track review progress</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 sm:mt-0">`);
      push_element($$renderer2, "div", 175, 4);
      $$renderer2.push(`<a href="/creator/upload" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">`);
      push_element($$renderer2, "a", 176, 6);
      $$renderer2.push(`<span class="mr-2">`);
      push_element($$renderer2, "span", 180, 8);
      $$renderer2.push(`+</span>`);
      pop_element();
      $$renderer2.push(` Upload New Content</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 186, 2);
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 187, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 189, 6);
      $$renderer2.push(`<label for="search" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 190, 8);
      $$renderer2.push(`Search Content</label>`);
      pop_element();
      $$renderer2.push(` <input type="text" id="search"${attr("value", searchTerm)} placeholder="Search by title or description..." class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 191, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 201, 6);
      $$renderer2.push(`<label for="status-filter" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 202, 8);
      $$renderer2.push(`Filter by Status</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "status-filter",
          value: selectedFilter,
          class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Statuses`);
          });
          $$renderer3.option({ value: ContentStatus.DRAFT }, ($$renderer4) => {
            $$renderer4.push(`Draft`);
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
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 221, 6);
      $$renderer2.push(`<label for="type-filter" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 222, 8);
      $$renderer2.push(`Filter by Type</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "type-filter",
          value: selectedType,
          class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
          $$renderer3.option({ value: ContentType.SHORT_FILM }, ($$renderer4) => {
            $$renderer4.push(`Short Films`);
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
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 240, 6);
      $$renderer2.push(`<div class="text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "div", 241, 8);
      $$renderer2.push(`Quick Stats</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-2xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 242, 8);
      $$renderer2.push(`${escape_html(contentLibrary.length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 243, 8);
      $$renderer2.push(`Total Submissions</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center py-12">`);
        push_element($$renderer2, "div", 250, 4);
        $$renderer2.push(`<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white">`);
        push_element($$renderer2, "div", 251, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-white ml-4">`);
        push_element($$renderer2, "p", 252, 6);
        $$renderer2.push(`Loading your content...</p>`);
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
//# sourceMappingURL=_page.svelte-gWfaLH1J.js.map
