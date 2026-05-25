import { a as push_element, b as pop_element, n as attr, e as escape_html, i as ensure_array_like, j as attr_class, l as stringify, F as FILENAME } from "../../../../../chunks/ui-libs.js";
_page[FILENAME] = "src/routes/(admin)/admin/settings/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let platformSettings = {
        siteName: "Sephar Studios",
        siteDescription: "Faith-based content streaming platform",
        maintenanceMode: false,
        registrationOpen: true,
        creatorApplicationsOpen: true,
        maxUploadSize: 5e3,
        supportedFormats: ["mp4", "mov", "avi", "mkv"],
        moderationMode: "hybrid",
        minContentDuration: 60,
        maxContentDuration: 7200
      };
      let loading = false;
      let activeTab = "platform";
      let newFormat = "";
      const tabs = [
        { id: "platform", label: "Platform", icon: "⚙️" },
        { id: "payment", label: "Payments", icon: "💳" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
        { id: "security", label: "Security", icon: "🔒" },
        { id: "ai", label: "AI Models", icon: "🤖" }
      ];
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 336, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 338, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 339, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white">`);
      push_element($$renderer2, "h1", 340, 6);
      $$renderer2.push(`Platform Settings</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 341, 6);
      $$renderer2.push(`Configure platform behavior and integrations</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 344, 4);
      $$renderer2.push(`<button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 345, 6);
      $$renderer2.push(`🔄 Reset to Default</button>`);
      pop_element();
      $$renderer2.push(` <button${attr("disabled", loading, true)} class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
      push_element($$renderer2, "button", 351, 6);
      $$renderer2.push(`${escape_html("💾 Save Changes")}</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-2">`);
      push_element($$renderer2, "div", 372, 2);
      $$renderer2.push(`<nav class="flex space-x-2">`);
      push_element($$renderer2, "nav", 373, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(tabs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tab = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${stringify(activeTab === tab.id ? "bg-red-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
        push_element($$renderer2, "button", 375, 8);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 379, 10);
        $$renderer2.push(`${escape_html(tab.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <span>`);
        push_element($$renderer2, "span", 380, 10);
        $$renderer2.push(`${escape_html(tab.label)}</span>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></nav>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">`);
        push_element($$renderer2, "div", 388, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white">`);
        push_element($$renderer2, "h2", 389, 6);
        $$renderer2.push(`Platform Configuration</h2>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 391, 6);
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 393, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 394, 10);
        $$renderer2.push(`<label for="siteName" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 395, 12);
        $$renderer2.push(`Site Name</label>`);
        pop_element();
        $$renderer2.push(` <input id="siteName" type="text"${attr("value", platformSettings.siteName)} class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 396, 12);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 404, 10);
        $$renderer2.push(`<label for="siteDescription" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 405, 12);
        $$renderer2.push(`Site Description</label>`);
        pop_element();
        $$renderer2.push(` <textarea id="siteDescription" rows="3" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500">`);
        push_element($$renderer2, "textarea", 406, 12);
        const $$body = escape_html(platformSettings.siteDescription);
        if ($$body) {
          $$renderer2.push(`${$$body}`);
        }
        $$renderer2.push(`</textarea>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 414, 10);
        $$renderer2.push(`<label for="maxUploadSize" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 415, 12);
        $$renderer2.push(`Max Upload Size (MB)</label>`);
        pop_element();
        $$renderer2.push(` <input id="maxUploadSize" type="number"${attr("value", platformSettings.maxUploadSize)} min="100" max="10000" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 416, 12);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 428, 8);
        $$renderer2.push(`<div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">`);
        push_element($$renderer2, "div", 429, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 430, 12);
        $$renderer2.push(`<div class="text-white font-medium">`);
        push_element($$renderer2, "div", 431, 14);
        $$renderer2.push(`Maintenance Mode</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 432, 14);
        $$renderer2.push(`Disable public access to the platform</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <label class="relative inline-flex items-center cursor-pointer">`);
        push_element($$renderer2, "label", 434, 12);
        $$renderer2.push(`<input type="checkbox"${attr("checked", platformSettings.maintenanceMode, true)} class="sr-only peer"/>`);
        push_element($$renderer2, "input", 435, 14);
        pop_element();
        $$renderer2.push(` <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600">`);
        push_element($$renderer2, "div", 436, 14);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">`);
        push_element($$renderer2, "div", 440, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 441, 12);
        $$renderer2.push(`<div class="text-white font-medium">`);
        push_element($$renderer2, "div", 442, 14);
        $$renderer2.push(`User Registration</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 443, 14);
        $$renderer2.push(`Allow new users to register</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <label class="relative inline-flex items-center cursor-pointer">`);
        push_element($$renderer2, "label", 445, 12);
        $$renderer2.push(`<input type="checkbox"${attr("checked", platformSettings.registrationOpen, true)} class="sr-only peer"/>`);
        push_element($$renderer2, "input", 446, 14);
        pop_element();
        $$renderer2.push(` <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600">`);
        push_element($$renderer2, "div", 447, 14);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">`);
        push_element($$renderer2, "div", 451, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 452, 12);
        $$renderer2.push(`<div class="text-white font-medium">`);
        push_element($$renderer2, "div", 453, 14);
        $$renderer2.push(`Creator Applications</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 454, 14);
        $$renderer2.push(`Allow new creator applications</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <label class="relative inline-flex items-center cursor-pointer">`);
        push_element($$renderer2, "label", 456, 12);
        $$renderer2.push(`<input type="checkbox"${attr("checked", platformSettings.creatorApplicationsOpen, true)} class="sr-only peer"/>`);
        push_element($$renderer2, "input", 457, 14);
        pop_element();
        $$renderer2.push(` <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600">`);
        push_element($$renderer2, "div", 458, 14);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 465, 6);
        $$renderer2.push(`<h3 class="text-lg font-bold text-white">`);
        push_element($$renderer2, "h3", 466, 8);
        $$renderer2.push(`Content Settings</h3>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 468, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 469, 10);
        $$renderer2.push(`<label for="moderationMode" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 470, 12);
        $$renderer2.push(`Moderation Mode</label>`);
        pop_element();
        $$renderer2.push(` `);
        $$renderer2.select(
          {
            id: "moderationMode",
            value: platformSettings.moderationMode,
            class: "w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "auto" }, ($$renderer4) => {
              $$renderer4.push(`Automatic`);
            });
            $$renderer3.option({ value: "manual" }, ($$renderer4) => {
              $$renderer4.push(`Manual Review`);
            });
            $$renderer3.option({ value: "hybrid" }, ($$renderer4) => {
              $$renderer4.push(`Hybrid (Auto + Manual)`);
            });
          }
        );
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-2 gap-4">`);
        push_element($$renderer2, "div", 482, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 483, 12);
        $$renderer2.push(`<label for="minDuration" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 484, 14);
        $$renderer2.push(`Min Duration (seconds)</label>`);
        pop_element();
        $$renderer2.push(` <input id="minDuration" type="number"${attr("value", platformSettings.minContentDuration)} min="30" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 485, 14);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 493, 12);
        $$renderer2.push(`<label for="maxDuration" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 494, 14);
        $$renderer2.push(`Max Duration (seconds)</label>`);
        pop_element();
        $$renderer2.push(` <input id="maxDuration" type="number"${attr("value", platformSettings.maxContentDuration)} min="300" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 495, 14);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 507, 8);
        $$renderer2.push(`<label for="newFormat" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 508, 10);
        $$renderer2.push(`Supported Video Formats</label>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-2 mb-3">`);
        push_element($$renderer2, "div", 509, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(platformSettings.supportedFormats);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let format = each_array_1[$$index_1];
          $$renderer2.push(`<span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">`);
          push_element($$renderer2, "span", 511, 14);
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 512, 16);
          $$renderer2.push(`.${escape_html(format)}</span>`);
          pop_element();
          $$renderer2.push(` <button class="text-red-200 hover:text-white">`);
          push_element($$renderer2, "button", 513, 16);
          $$renderer2.push(`×</button>`);
          pop_element();
          $$renderer2.push(`</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex space-x-2">`);
        push_element($$renderer2, "div", 517, 10);
        $$renderer2.push(`<input id="newFormat" type="text"${attr("value", newFormat)} placeholder="Add format (e.g., webm)" class="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 518, 12);
        pop_element();
        $$renderer2.push(` <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">`);
        push_element($$renderer2, "button", 525, 12);
        $$renderer2.push(`Add</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
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
export {
  _page as default
};
