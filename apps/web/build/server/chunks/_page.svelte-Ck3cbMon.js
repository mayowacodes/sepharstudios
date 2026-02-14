import { u as attr, E as escape_html, m as ensure_array_like, C as attr_class, x as stringify } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

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
        { id: "security", label: "Security", icon: "🔒" }
      ];
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 161, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 163, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 164, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white">`);
      push_element($$renderer2, "h1", 165, 6);
      $$renderer2.push(`Platform Settings</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 166, 6);
      $$renderer2.push(`Configure platform behavior and integrations</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4">`);
      push_element($$renderer2, "div", 169, 4);
      $$renderer2.push(`<button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 170, 6);
      $$renderer2.push(`🔄 Reset to Default</button>`);
      pop_element();
      $$renderer2.push(` <button${attr("disabled", loading, true)} class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
      push_element($$renderer2, "button", 176, 6);
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
      push_element($$renderer2, "div", 197, 2);
      $$renderer2.push(`<nav class="flex space-x-2">`);
      push_element($$renderer2, "nav", 198, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(tabs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tab = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${stringify(activeTab === tab.id ? "bg-red-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
        push_element($$renderer2, "button", 200, 8);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 204, 10);
        $$renderer2.push(`${escape_html(tab.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <span>`);
        push_element($$renderer2, "span", 205, 10);
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
        push_element($$renderer2, "div", 213, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white">`);
        push_element($$renderer2, "h2", 214, 6);
        $$renderer2.push(`Platform Configuration</h2>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 216, 6);
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 218, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 219, 10);
        $$renderer2.push(`<label for="siteName" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 220, 12);
        $$renderer2.push(`Site Name</label>`);
        pop_element();
        $$renderer2.push(` <input id="siteName" type="text"${attr("value", platformSettings.siteName)} class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 221, 12);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 229, 10);
        $$renderer2.push(`<label for="siteDescription" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 230, 12);
        $$renderer2.push(`Site Description</label>`);
        pop_element();
        $$renderer2.push(` <textarea id="siteDescription" rows="3" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500">`);
        push_element($$renderer2, "textarea", 231, 12);
        const $$body = escape_html(platformSettings.siteDescription);
        if ($$body) {
          $$renderer2.push(`${$$body}`);
        }
        $$renderer2.push(`</textarea>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 239, 10);
        $$renderer2.push(`<label for="maxUploadSize" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 240, 12);
        $$renderer2.push(`Max Upload Size (MB)</label>`);
        pop_element();
        $$renderer2.push(` <input id="maxUploadSize" type="number"${attr("value", platformSettings.maxUploadSize)} min="100" max="10000" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 241, 12);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 253, 8);
        $$renderer2.push(`<div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">`);
        push_element($$renderer2, "div", 254, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 255, 12);
        $$renderer2.push(`<div class="text-white font-medium">`);
        push_element($$renderer2, "div", 256, 14);
        $$renderer2.push(`Maintenance Mode</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 257, 14);
        $$renderer2.push(`Disable public access to the platform</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <label class="relative inline-flex items-center cursor-pointer">`);
        push_element($$renderer2, "label", 259, 12);
        $$renderer2.push(`<input type="checkbox"${attr("checked", platformSettings.maintenanceMode, true)} class="sr-only peer"/>`);
        push_element($$renderer2, "input", 260, 14);
        pop_element();
        $$renderer2.push(` <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600">`);
        push_element($$renderer2, "div", 261, 14);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">`);
        push_element($$renderer2, "div", 265, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 266, 12);
        $$renderer2.push(`<div class="text-white font-medium">`);
        push_element($$renderer2, "div", 267, 14);
        $$renderer2.push(`User Registration</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 268, 14);
        $$renderer2.push(`Allow new users to register</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <label class="relative inline-flex items-center cursor-pointer">`);
        push_element($$renderer2, "label", 270, 12);
        $$renderer2.push(`<input type="checkbox"${attr("checked", platformSettings.registrationOpen, true)} class="sr-only peer"/>`);
        push_element($$renderer2, "input", 271, 14);
        pop_element();
        $$renderer2.push(` <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600">`);
        push_element($$renderer2, "div", 272, 14);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">`);
        push_element($$renderer2, "div", 276, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 277, 12);
        $$renderer2.push(`<div class="text-white font-medium">`);
        push_element($$renderer2, "div", 278, 14);
        $$renderer2.push(`Creator Applications</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 279, 14);
        $$renderer2.push(`Allow new creator applications</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <label class="relative inline-flex items-center cursor-pointer">`);
        push_element($$renderer2, "label", 281, 12);
        $$renderer2.push(`<input type="checkbox"${attr("checked", platformSettings.creatorApplicationsOpen, true)} class="sr-only peer"/>`);
        push_element($$renderer2, "input", 282, 14);
        pop_element();
        $$renderer2.push(` <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600">`);
        push_element($$renderer2, "div", 283, 14);
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
        push_element($$renderer2, "div", 290, 6);
        $$renderer2.push(`<h3 class="text-lg font-bold text-white">`);
        push_element($$renderer2, "h3", 291, 8);
        $$renderer2.push(`Content Settings</h3>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 293, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 294, 10);
        $$renderer2.push(`<label for="moderationMode" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 295, 12);
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
        push_element($$renderer2, "div", 307, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 308, 12);
        $$renderer2.push(`<label for="minDuration" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 309, 14);
        $$renderer2.push(`Min Duration (seconds)</label>`);
        pop_element();
        $$renderer2.push(` <input id="minDuration" type="number"${attr("value", platformSettings.minContentDuration)} min="30" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 310, 14);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 318, 12);
        $$renderer2.push(`<label for="maxDuration" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 319, 14);
        $$renderer2.push(`Max Duration (seconds)</label>`);
        pop_element();
        $$renderer2.push(` <input id="maxDuration" type="number"${attr("value", platformSettings.maxContentDuration)} min="300" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 320, 14);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 332, 8);
        $$renderer2.push(`<label for="newFormat" class="block text-gray-300 text-sm font-medium mb-2">`);
        push_element($$renderer2, "label", 333, 10);
        $$renderer2.push(`Supported Video Formats</label>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-wrap gap-2 mb-3">`);
        push_element($$renderer2, "div", 334, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(platformSettings.supportedFormats);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let format = each_array_1[$$index_1];
          $$renderer2.push(`<span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">`);
          push_element($$renderer2, "span", 336, 14);
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 337, 16);
          $$renderer2.push(`.${escape_html(format)}</span>`);
          pop_element();
          $$renderer2.push(` <button class="text-red-200 hover:text-white">`);
          push_element($$renderer2, "button", 338, 16);
          $$renderer2.push(`×</button>`);
          pop_element();
          $$renderer2.push(`</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="flex space-x-2">`);
        push_element($$renderer2, "div", 342, 10);
        $$renderer2.push(`<input id="newFormat" type="text"${attr("value", newFormat)} placeholder="Add format (e.g., webm)" class="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/>`);
        push_element($$renderer2, "input", 343, 12);
        pop_element();
        $$renderer2.push(` <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">`);
        push_element($$renderer2, "button", 350, 12);
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
//# sourceMappingURL=_page.svelte-Ck3cbMon.js.map
