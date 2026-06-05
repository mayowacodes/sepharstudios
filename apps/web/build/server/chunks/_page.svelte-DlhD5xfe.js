import { as as ensure_array_like, ai as attr_class, au as escape_html, aO as spread_props } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import { S as StatChip } from './StatChip-QDTW_eIe.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/workflow.svelte
function Workflow($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "workflow" },
		props,
		{ iconNode: [
			["rect", {
				"width": "8",
				"height": "8",
				"x": "3",
				"y": "3",
				"rx": "2"
			}],
			["path", { "d": "M7 11v4a2 2 0 0 0 2 2h4" }],
			["rect", {
				"width": "8",
				"height": "8",
				"x": "13",
				"y": "13",
				"rx": "2"
			}]
		] }
	]));
}
//#endregion
//#region src/routes/(admin)/admin/workflow/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let workflowRules = [];
		let workflowStats = {
			totalProcessed: 0,
			avgProcessingTime: 0,
			approvalRate: 0};
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium transition-opacity">+ New rule</button>`);
			}
			PageHeader($$renderer, {
				icon: Workflow,
				title: "Workflow",
				subtitle: "Automate content review and approval rules.",
				actions});
		}
		$$renderer.push(`<!----> <div class="flex flex-wrap gap-2">`);
		StatChip($$renderer, {
			label: "processed",
			value: workflowStats.totalProcessed,
			tone: "blue"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "avg days",
			value: workflowStats.avgProcessingTime,
			tone: "green"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "approval %",
			value: workflowStats.approvalRate,
			tone: "purple"
		});
		$$renderer.push(`<!----></div> <div class="space-y-4"><h2 class="text-2xl font-bold text-foreground">Active Workflow Rules</h2> <!--[-->`);
		const each_array = ensure_array_like(workflowRules);
		for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
			let rule = each_array[$$index_2];
			$$renderer.push(`<div${attr_class(`surface-2 rounded-xl p-6 border-l-4 ${rule.isActive ? "border-green-600" : "border-gray-600"}`)}><div class="flex justify-between items-start mb-4"><div><div class="flex items-center space-x-3 mb-2"><h3 class="text-xl font-bold text-foreground">${escape_html(rule.name)}</h3> <span class="bg-gray-600 text-foreground px-2 py-1 text-xs rounded-full">Priority ${escape_html(rule.priority)}</span> <button${attr_class(`px-3 py-1 text-xs rounded-full transition-colors ${rule.isActive ? "bg-green-600 text-foreground" : "bg-gray-600 text-white/80"}`)}>${escape_html(rule.isActive ? "Active" : "Inactive")}</button></div> <p class="text-foreground/80 text-sm mb-4">${escape_html(rule.description)}</p></div> <div class="flex space-x-2"><button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">Edit</button> <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">Delete</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div><h4 class="font-medium text-foreground mb-3 flex items-center"><span class="mr-2">🔍</span> Conditions</h4> <div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(rule.conditions);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let condition = each_array_1[$$index];
				$$renderer.push(`<div class="surface-1 p-3 rounded text-sm"><span class="text-blue-300">${escape_html(condition.field)}</span> <span class="text-muted-foreground mx-2">${escape_html(condition.operator)}</span> <span class="text-green-300">"${escape_html(condition.value)}"</span></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div><h4 class="font-medium text-foreground mb-3 flex items-center"><span class="mr-2">⚡</span> Actions</h4> <div class="space-y-2"><!--[-->`);
			const each_array_2 = ensure_array_like(rule.actions);
			for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
				let action = each_array_2[$$index_1];
				$$renderer.push(`<div class="surface-1 p-3 rounded text-sm"><span class="text-purple-300">${escape_html(action.type.replace("_", " "))}</span> <span class="text-muted-foreground mx-2">→</span> <span class="text-yellow-300">${escape_html(action.target)}: ${escape_html(action.value)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div> <div class="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">Created ${escape_html(rule.createdAt.toLocaleDateString())}</div></div>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DlhD5xfe.js.map
