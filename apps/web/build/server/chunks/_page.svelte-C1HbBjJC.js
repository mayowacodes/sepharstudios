import { aa as attr, an as escape_html, al as ensure_array_like, ab as attr_class } from './ui-libs-TtGtWAGI.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(admin)/admin/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let platformSettings = {
			siteName: "Sephar Studios",
			siteDescription: "Faith-based content streaming platform",
			maintenanceMode: false,
			registrationOpen: true,
			creatorApplicationsOpen: true,
			maxUploadSize: 5e3,
			supportedFormats: [
				"mp4",
				"mov",
				"avi",
				"mkv"
			],
			moderationMode: "hybrid",
			minContentDuration: 60,
			maxContentDuration: 7200
		};
		let loading = false;
		let activeTab = "platform";
		let newFormat = "";
		const tabs = [
			{
				id: "platform",
				label: "Platform",
				icon: "⚙️"
			},
			{
				id: "payment",
				label: "Payments",
				icon: "💳"
			},
			{
				id: "notifications",
				label: "Notifications",
				icon: "🔔"
			},
			{
				id: "security",
				label: "Security",
				icon: "🔒"
			},
			{
				id: "ai",
				label: "AI Models",
				icon: "🤖"
			}
		];
		$$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-white">Platform Settings</h1> <p class="text-gray-300">Configure platform behavior and integrations</p></div> <div class="flex items-center space-x-4"><button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">🔄 Reset to Default</button> <button${attr("disabled", loading, true)} class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">${escape_html("💾 Save Changes")}</button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-2"><nav class="flex space-x-2"><!--[-->`);
		const each_array = ensure_array_like(tabs);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			$$renderer.push(`<button${attr_class(`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? "bg-red-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`)}><span>${escape_html(tab.icon)}</span> <span>${escape_html(tab.label)}</span></button>`);
		}
		$$renderer.push(`<!--]--></nav></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6"><h2 class="text-xl font-bold text-white">Platform Configuration</h2> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="space-y-4"><div><label for="siteName" class="block text-gray-300 text-sm font-medium mb-2">Site Name</label> <input id="siteName" type="text"${attr("value", platformSettings.siteName)} class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/></div> <div><label for="siteDescription" class="block text-gray-300 text-sm font-medium mb-2">Site Description</label> <textarea id="siteDescription" rows="3" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500">`);
			const $$body = escape_html(platformSettings.siteDescription);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div> <div><label for="maxUploadSize" class="block text-gray-300 text-sm font-medium mb-2">Max Upload Size (MB)</label> <input id="maxUploadSize" type="number"${attr("value", platformSettings.maxUploadSize)} min="100" max="10000" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/></div></div> <div class="space-y-4"><div class="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div><div class="text-white font-medium">Maintenance Mode</div> <div class="text-gray-400 text-sm">Disable public access to the platform</div></div> <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox"${attr("checked", platformSettings.maintenanceMode, true)} class="sr-only peer"/> <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div></label></div> <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div><div class="text-white font-medium">User Registration</div> <div class="text-gray-400 text-sm">Allow new users to register</div></div> <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox"${attr("checked", platformSettings.registrationOpen, true)} class="sr-only peer"/> <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div></label></div> <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div><div class="text-white font-medium">Creator Applications</div> <div class="text-gray-400 text-sm">Allow new creator applications</div></div> <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox"${attr("checked", platformSettings.creatorApplicationsOpen, true)} class="sr-only peer"/> <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div></label></div></div></div> <div class="space-y-4"><h3 class="text-lg font-bold text-white">Content Settings</h3> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div><label for="moderationMode" class="block text-gray-300 text-sm font-medium mb-2">Moderation Mode</label> `);
			$$renderer.select({
				id: "moderationMode",
				value: platformSettings.moderationMode,
				class: "w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
			}, ($$renderer) => {
				$$renderer.option({ value: "auto" }, ($$renderer) => {
					$$renderer.push(`Automatic`);
				});
				$$renderer.option({ value: "manual" }, ($$renderer) => {
					$$renderer.push(`Manual Review`);
				});
				$$renderer.option({ value: "hybrid" }, ($$renderer) => {
					$$renderer.push(`Hybrid (Auto + Manual)`);
				});
			});
			$$renderer.push(`</div> <div class="grid grid-cols-2 gap-4"><div><label for="minDuration" class="block text-gray-300 text-sm font-medium mb-2">Min Duration (seconds)</label> <input id="minDuration" type="number"${attr("value", platformSettings.minContentDuration)} min="30" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"/></div> <div><label for="maxDuration" class="block text-gray-300 text-sm font-medium mb-2">Max Duration (seconds)</label> <input id="maxDuration" type="number"${attr("value", platformSettings.maxContentDuration)} min="300" class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"/></div></div></div> <div><label for="newFormat" class="block text-gray-300 text-sm font-medium mb-2">Supported Video Formats</label> <div class="flex flex-wrap gap-2 mb-3"><!--[-->`);
			const each_array_1 = ensure_array_like(platformSettings.supportedFormats);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let format = each_array_1[$$index_1];
				$$renderer.push(`<span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"><span>.${escape_html(format)}</span> <button class="text-red-200 hover:text-white">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex space-x-2"><input id="newFormat" type="text"${attr("value", newFormat)} placeholder="Add format (e.g., webm)" class="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"/> <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">Add</button></div></div></div></div>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C1HbBjJC.js.map
