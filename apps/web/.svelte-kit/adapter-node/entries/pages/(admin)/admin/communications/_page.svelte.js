import { a as push_element, b as pop_element, e as escape_html, n as attr, i as ensure_array_like, j as attr_class, l as stringify, F as FILENAME } from "../../../../../chunks/ui-libs.js";
_page[FILENAME] = "src/routes/(admin)/admin/communications/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let messages = [];
      let selectedFilter = "all";
      let selectedType = "all";
      let searchTerm = "";
      const filteredMessages = messages.filter((message) => {
        const searchMatch = searchTerm === "";
        return searchMatch;
      });
      function getTypeColor(type) {
        switch (type) {
          case "approval":
            return "bg-green-600 text-white";
          case "rejection":
            return "bg-red-600 text-white";
          case "feedback":
            return "bg-blue-600 text-white";
          case "clarification":
            return "bg-yellow-600 text-black";
          case "general":
            return "bg-gray-600 text-white";
          default:
            return "bg-gray-600 text-white";
        }
      }
      function getStatusColor(status) {
        switch (status) {
          case "sent":
            return "text-blue-400";
          case "read":
            return "text-yellow-400";
          case "replied":
            return "text-green-400";
          case "archived":
            return "text-gray-400";
          default:
            return "text-gray-400";
        }
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 196, 0);
      $$renderer2.push(`<div class="flex justify-between items-center">`);
      push_element($$renderer2, "div", 198, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 199, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 200, 6);
      $$renderer2.push(`Communications Center</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 201, 6);
      $$renderer2.push(`Manage creator communications and feedback</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex space-x-3">`);
      push_element($$renderer2, "div", 204, 4);
      $$renderer2.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">`);
      push_element($$renderer2, "button", 205, 6);
      $$renderer2.push(`Message Templates</button>`);
      pop_element();
      $$renderer2.push(` <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">`);
      push_element($$renderer2, "button", 211, 6);
      $$renderer2.push(`Compose Message</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 221, 2);
      $$renderer2.push(`<div class="bg-blue-600/20 rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 222, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-blue-400 mb-2">`);
      push_element($$renderer2, "div", 223, 6);
      $$renderer2.push(`${escape_html(messages.filter((m) => m.status === "sent").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-blue-200">`);
      push_element($$renderer2, "div", 224, 6);
      $$renderer2.push(`Sent Messages</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-yellow-600/20 rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 226, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-yellow-400 mb-2">`);
      push_element($$renderer2, "div", 227, 6);
      $$renderer2.push(`${escape_html(messages.filter((m) => !m.isFromAdmin && m.status === "sent").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-yellow-200">`);
      push_element($$renderer2, "div", 228, 6);
      $$renderer2.push(`Pending Responses</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-green-600/20 rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 230, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-green-400 mb-2">`);
      push_element($$renderer2, "div", 231, 6);
      $$renderer2.push(`${escape_html(messages.filter((m) => m.type === "approval").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-green-200">`);
      push_element($$renderer2, "div", 232, 6);
      $$renderer2.push(`Approvals Sent</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-red-600/20 rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 234, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-red-400 mb-2">`);
      push_element($$renderer2, "div", 235, 6);
      $$renderer2.push(`${escape_html(messages.filter((m) => m.type === "rejection").length)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-red-200">`);
      push_element($$renderer2, "div", 236, 6);
      $$renderer2.push(`Rejections Sent</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 rounded-xl p-6">`);
      push_element($$renderer2, "div", 241, 2);
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 242, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 243, 6);
      $$renderer2.push(`<label for="search" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 244, 8);
      $$renderer2.push(`Search</label>`);
      pop_element();
      $$renderer2.push(` <input id="search" type="text"${attr("value", searchTerm)} placeholder="Search messages..." class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400"/>`);
      push_element($$renderer2, "input", 245, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 254, 6);
      $$renderer2.push(`<label for="status" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 255, 8);
      $$renderer2.push(`Status</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "status",
          value: selectedFilter,
          class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Status`);
          });
          $$renderer3.option({ value: "sent" }, ($$renderer4) => {
            $$renderer4.push(`Sent`);
          });
          $$renderer3.option({ value: "read" }, ($$renderer4) => {
            $$renderer4.push(`Read`);
          });
          $$renderer3.option({ value: "replied" }, ($$renderer4) => {
            $$renderer4.push(`Replied`);
          });
          $$renderer3.option({ value: "archived" }, ($$renderer4) => {
            $$renderer4.push(`Archived`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 269, 6);
      $$renderer2.push(`<label for="type" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 270, 8);
      $$renderer2.push(`Type</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "type",
          value: selectedType,
          class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Types`);
          });
          $$renderer3.option({ value: "approval" }, ($$renderer4) => {
            $$renderer4.push(`Approvals`);
          });
          $$renderer3.option({ value: "rejection" }, ($$renderer4) => {
            $$renderer4.push(`Rejections`);
          });
          $$renderer3.option({ value: "feedback" }, ($$renderer4) => {
            $$renderer4.push(`Feedback`);
          });
          $$renderer3.option({ value: "clarification" }, ($$renderer4) => {
            $$renderer4.push(`Clarification`);
          });
          $$renderer3.option({ value: "general" }, ($$renderer4) => {
            $$renderer4.push(`General`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 288, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(filteredMessages);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let message = each_array[$$index_1];
        $$renderer2.push(`<div class="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors">`);
        push_element($$renderer2, "div", 290, 6);
        $$renderer2.push(`<div class="flex justify-between items-start mb-3">`);
        push_element($$renderer2, "div", 291, 8);
        $$renderer2.push(`<div class="flex items-center space-x-3">`);
        push_element($$renderer2, "div", 292, 10);
        $$renderer2.push(`<div class="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">`);
        push_element($$renderer2, "div", 293, 12);
        $$renderer2.push(`${escape_html(message.isFromAdmin ? "A" : message.creatorName.charAt(0))}</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 296, 12);
        $$renderer2.push(`<div class="font-medium text-white">`);
        push_element($$renderer2, "div", 297, 14);
        $$renderer2.push(`${escape_html(message.creatorName)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-400">`);
        push_element($$renderer2, "div", 298, 14);
        $$renderer2.push(`${escape_html(message.isFromAdmin ? "Admin" : "Creator")} • ${escape_html(message.createdAt.toLocaleDateString())}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 304, 10);
        $$renderer2.push(`<span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getTypeColor(message.type))}`)}>`);
        push_element($$renderer2, "span", 305, 12);
        $$renderer2.push(`${escape_html(message.type)}</span>`);
        pop_element();
        $$renderer2.push(` <span${attr_class(`text-sm ${stringify(getStatusColor(message.status))}`)}>`);
        push_element($$renderer2, "span", 308, 12);
        $$renderer2.push(`${escape_html(message.status)}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="mb-3">`);
        push_element($$renderer2, "div", 314, 8);
        $$renderer2.push(`<h3 class="text-lg font-medium text-white mb-1">`);
        push_element($$renderer2, "h3", 315, 10);
        $$renderer2.push(`${escape_html(message.subject)}</h3>`);
        pop_element();
        $$renderer2.push(` `);
        if (message.contentTitle) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-sm text-purple-300 mb-2">`);
          push_element($$renderer2, "div", 317, 12);
          $$renderer2.push(`Re: ${escape_html(message.contentTitle)}</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <p class="text-gray-300 text-sm line-clamp-3">`);
        push_element($$renderer2, "p", 321, 10);
        $$renderer2.push(`${escape_html(message.message)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (message.attachments && message.attachments.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="mb-3">`);
          push_element($$renderer2, "div", 325, 10);
          $$renderer2.push(`<div class="text-sm text-gray-400 mb-1">`);
          push_element($$renderer2, "div", 326, 12);
          $$renderer2.push(`Attachments:</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex flex-wrap gap-2">`);
          push_element($$renderer2, "div", 327, 12);
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(message.attachments);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let attachment = each_array_1[$$index];
            $$renderer2.push(`<span class="bg-blue-600 text-white px-2 py-1 text-xs rounded">`);
            push_element($$renderer2, "span", 329, 16);
            $$renderer2.push(`📎 ${escape_html(attachment)}</span>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex justify-between items-center pt-3 border-t border-gray-600">`);
        push_element($$renderer2, "div", 337, 8);
        $$renderer2.push(`<div class="text-xs text-gray-400">`);
        push_element($$renderer2, "div", 338, 10);
        $$renderer2.push(`${escape_html(message.isFromAdmin ? `Sent by ${message.adminName || "Admin"}` : "From Creator")}</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex space-x-2">`);
        push_element($$renderer2, "div", 342, 10);
        if (!message.isFromAdmin && message.status === "sent") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">`);
          push_element($$renderer2, "button", 344, 14);
          $$renderer2.push(`Mark Read</button>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">`);
        push_element($$renderer2, "button", 351, 12);
        $$renderer2.push(`Reply</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">`);
        push_element($$renderer2, "button", 357, 12);
        $$renderer2.push(`Archive</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> `);
      if (filteredMessages.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 369, 6);
        $$renderer2.push(`<div class="text-4xl mb-4">`);
        push_element($$renderer2, "div", 370, 8);
        $$renderer2.push(`💬</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-xl text-white mb-2">`);
        push_element($$renderer2, "div", 371, 8);
        $$renderer2.push(`No messages found</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400">`);
        push_element($$renderer2, "div", 372, 8);
        $$renderer2.push(`Try adjusting your filters or search terms</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
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
export {
  _page as default
};
