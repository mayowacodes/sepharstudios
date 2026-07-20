import { Ht as attr, Ot as ensure_array_like, St as attr_class, Wt as escape_html, jt as spread_props } from "../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
import { t as StatChip } from "../../../../../chunks/StatChip.js";
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
			approvalRate: 0,
			pendingReviews: 0
		};
		let editingRule = null;
		function createNewRule() {
			editingRule = {
				id: Date.now().toString(),
				name: "",
				description: "",
				conditions: [{
					field: "",
					operator: "",
					value: ""
				}],
				actions: [{
					type: "status_change",
					target: "",
					value: ""
				}],
				isActive: true,
				priority: 5,
				createdAt: /* @__PURE__ */ new Date()
			};
		}
		const fieldOptions = [
			"contentType",
			"ageRating",
			"status",
			"duration",
			"videoQuality",
			"fileSize",
			"rejectionCount",
			"creatorType",
			"ministryVerified"
		];
		const operatorOptions = [
			"equals",
			"not_equals",
			"in",
			"not_in",
			"greater_than",
			"less_than",
			"contains"
		];
		const actionTypes = [
			"status_change",
			"assign_reviewer",
			"send_notification",
			"escalate"
		];
		$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: createNewRule,
					children: ($$renderer) => {
						$$renderer.push(`<!---->+ New rule`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Automation",
				title: "Workflow",
				subtitle: "Automate content review and approval rules.",
				icon: Workflow,
				actions,
				$$slots: { actions: true }
			});
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
		if (editingRule) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"><div class="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"><div class="p-6"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-foreground">${escape_html(editingRule.id.length > 10 ? "Edit Workflow Rule" : "Create Workflow Rule")}</h2> <button class="text-muted-foreground hover:text-foreground" aria-label="Close workflow rule modal"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="ruleName" class="block text-sm font-medium text-foreground mb-2">Rule Name</label> <input id="ruleName" type="text"${attr("value", editingRule.name)} class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground" placeholder="Enter rule name..."/></div> <div><label for="rulePriority" class="block text-sm font-medium text-foreground mb-2">Priority (0 = Highest)</label> <input id="rulePriority" type="number"${attr("value", editingRule.priority)} min="0" max="10" class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"/></div></div> <div><label for="ruleDescription" class="block text-sm font-medium text-foreground mb-2">Description</label> <textarea id="ruleDescription" rows="2" class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground resize-none" placeholder="Describe what this rule does...">`);
			const $$body = escape_html(editingRule.description);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div> <div><div class="flex justify-between items-center mb-4"><h3 class="text-lg font-medium text-foreground">Conditions</h3> <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Add Condition</button></div> <div class="space-y-3"><!--[-->`);
			const each_array_3 = ensure_array_like(editingRule.conditions);
			for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
				let condition = each_array_3[i];
				$$renderer.push(`<div class="surface-1 p-4 rounded-lg flex items-center space-x-3">`);
				$$renderer.select({
					value: condition.field,
					class: "px-3 py-2 surface-2 border border-gray-600 rounded text-foreground text-sm"
				}, ($$renderer) => {
					$$renderer.option({ value: "" }, ($$renderer) => {
						$$renderer.push(`Select Field`);
					});
					$$renderer.push(`<!--[-->`);
					const each_array_4 = ensure_array_like(fieldOptions);
					for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
						let field = each_array_4[$$index_3];
						$$renderer.option({ value: field }, ($$renderer) => {
							$$renderer.push(`${escape_html(field)}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				});
				$$renderer.push(` `);
				$$renderer.select({
					value: condition.operator,
					class: "px-3 py-2 surface-2 border border-gray-600 rounded text-foreground text-sm"
				}, ($$renderer) => {
					$$renderer.option({ value: "" }, ($$renderer) => {
						$$renderer.push(`Operator`);
					});
					$$renderer.push(`<!--[-->`);
					const each_array_5 = ensure_array_like(operatorOptions);
					for (let $$index_4 = 0, $$length = each_array_5.length; $$index_4 < $$length; $$index_4++) {
						let operator = each_array_5[$$index_4];
						$$renderer.option({ value: operator }, ($$renderer) => {
							$$renderer.push(`${escape_html(operator.replace("_", " "))}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				});
				$$renderer.push(` <input type="text"${attr("value", condition.value)} placeholder="Value" class="flex-1 px-3 py-2 surface-2 border border-gray-600 rounded text-foreground text-sm"/> <button class="text-red-400 hover:text-red-300">×</button></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div><div class="flex justify-between items-center mb-4"><h3 class="text-lg font-medium text-foreground">Actions</h3> <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Add Action</button></div> <div class="space-y-3"><!--[-->`);
			const each_array_6 = ensure_array_like(editingRule.actions);
			for (let i = 0, $$length = each_array_6.length; i < $$length; i++) {
				let action = each_array_6[i];
				$$renderer.push(`<div class="surface-1 p-4 rounded-lg flex items-center space-x-3">`);
				$$renderer.select({
					value: action.type,
					class: "px-3 py-2 surface-2 border border-gray-600 rounded text-foreground text-sm"
				}, ($$renderer) => {
					$$renderer.push(`<!--[-->`);
					const each_array_7 = ensure_array_like(actionTypes);
					for (let $$index_6 = 0, $$length = each_array_7.length; $$index_6 < $$length; $$index_6++) {
						let actionType = each_array_7[$$index_6];
						$$renderer.option({ value: actionType }, ($$renderer) => {
							$$renderer.push(`${escape_html(actionType.replace("_", " "))}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				});
				$$renderer.push(` <input type="text"${attr("value", action.target)} placeholder="Target" class="flex-1 px-3 py-2 surface-2 border border-gray-600 rounded text-foreground text-sm"/> <input type="text"${attr("value", action.value)} placeholder="Value" class="flex-1 px-3 py-2 surface-2 border border-gray-600 rounded text-foreground text-sm"/> <button class="text-red-400 hover:text-red-300">×</button></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div> <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-600"><button class="bg-gray-600 hover:bg-gray-700 text-foreground px-6 py-2 rounded-lg transition-colors">Cancel</button> <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">Save Rule</button></div></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
