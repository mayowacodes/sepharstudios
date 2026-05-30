import { an as escape_html, al as ensure_array_like, ab as attr_class } from './ui-libs-TtGtWAGI.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(admin)/admin/workflow/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let workflowRules = [];
		let workflowStats = {
			totalProcessed: 0,
			avgProcessingTime: 0,
			approvalRate: 0,
			pendingReviews: 0
		};
		$$renderer.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h1 class="text-4xl font-bold text-white mb-2">Workflow Management</h1> <p class="text-xl text-gray-300">Automate content review and approval processes</p></div> <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">Create Workflow Rule</button></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="bg-blue-600/20 rounded-xl p-6 text-center"><div class="text-3xl font-bold text-blue-400 mb-2">${escape_html(workflowStats.totalProcessed)}</div> <div class="text-sm text-blue-200">Total Processed</div></div> <div class="bg-green-600/20 rounded-xl p-6 text-center"><div class="text-3xl font-bold text-green-400 mb-2">${escape_html(workflowStats.avgProcessingTime)}d</div> <div class="text-sm text-green-200">Avg. Processing Time</div></div> <div class="bg-purple-600/20 rounded-xl p-6 text-center"><div class="text-3xl font-bold text-purple-400 mb-2">${escape_html(workflowStats.approvalRate)}%</div> <div class="text-sm text-purple-200">Approval Rate</div></div> <div class="bg-yellow-600/20 rounded-xl p-6 text-center"><div class="text-3xl font-bold text-yellow-400 mb-2">${escape_html(workflowStats.pendingReviews)}</div> <div class="text-sm text-yellow-200">Pending Reviews</div></div></div> <div class="space-y-4"><h2 class="text-2xl font-bold text-white">Active Workflow Rules</h2> <!--[-->`);
		const each_array = ensure_array_like(workflowRules);
		for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
			let rule = each_array[$$index_2];
			$$renderer.push(`<div${attr_class(`bg-white/10 rounded-xl p-6 border-l-4 ${rule.isActive ? "border-green-600" : "border-gray-600"}`)}><div class="flex justify-between items-start mb-4"><div><div class="flex items-center space-x-3 mb-2"><h3 class="text-xl font-bold text-white">${escape_html(rule.name)}</h3> <span class="bg-gray-600 text-white px-2 py-1 text-xs rounded-full">Priority ${escape_html(rule.priority)}</span> <button${attr_class(`px-3 py-1 text-xs rounded-full transition-colors ${rule.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}`)}>${escape_html(rule.isActive ? "Active" : "Inactive")}</button></div> <p class="text-gray-300 text-sm mb-4">${escape_html(rule.description)}</p></div> <div class="flex space-x-2"><button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">Edit</button> <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">Delete</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div><h4 class="font-medium text-white mb-3 flex items-center"><span class="mr-2">🔍</span> Conditions</h4> <div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(rule.conditions);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let condition = each_array_1[$$index];
				$$renderer.push(`<div class="bg-white/5 p-3 rounded text-sm"><span class="text-blue-300">${escape_html(condition.field)}</span> <span class="text-gray-400 mx-2">${escape_html(condition.operator)}</span> <span class="text-green-300">"${escape_html(condition.value)}"</span></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div><h4 class="font-medium text-white mb-3 flex items-center"><span class="mr-2">⚡</span> Actions</h4> <div class="space-y-2"><!--[-->`);
			const each_array_2 = ensure_array_like(rule.actions);
			for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
				let action = each_array_2[$$index_1];
				$$renderer.push(`<div class="bg-white/5 p-3 rounded text-sm"><span class="text-purple-300">${escape_html(action.type.replace("_", " "))}</span> <span class="text-gray-400 mx-2">→</span> <span class="text-yellow-300">${escape_html(action.target)}: ${escape_html(action.value)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div> <div class="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-700">Created ${escape_html(rule.createdAt.toLocaleDateString())}</div></div>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D7DsxCNl.js.map
