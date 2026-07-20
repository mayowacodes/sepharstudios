import { Et as derived, Ht as attr, Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
import { t as StatChip } from "../../../../../chunks/StatChip.js";
//#region src/routes/(admin)/admin/policies/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let policies = [];
		let selectedCategory = "all";
		let editingPolicy = null;
		let showCreateModal = false;
		const filteredPolicies = derived(() => policies.filter((policy) => true));
		function getCategoryColor(category) {
			switch (category) {
				case "theological": return "bg-purple-600 text-white";
				case "family_safety": return "bg-pink-600 text-white";
				case "content": return "bg-green-600 text-white";
				case "technical": return "bg-blue-600 text-white";
				default: return "bg-gray-600 text-foreground";
			}
		}
		function getSeverityColor(severity) {
			switch (severity) {
				case "critical": return "bg-red-600 text-white";
				case "high": return "bg-orange-600 text-white";
				case "medium": return "bg-yellow-600 text-black";
				case "low": return "bg-green-600 text-white";
				default: return "bg-gray-600 text-foreground";
			}
		}
		function createNewPolicy() {
			showCreateModal = true;
			editingPolicy = {
				id: Date.now().toString(),
				title: "",
				category: "content",
				description: "",
				requirements: [],
				violations: [],
				severity: "medium",
				isActive: true,
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date()
			};
		}
		$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: createNewPolicy,
					children: ($$renderer) => {
						$$renderer.push(`<!---->+ New policy`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Governance",
				title: "Content policies",
				subtitle: "Guidelines and standards for content review.",
				icon: File_text,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="flex flex-wrap gap-2">`);
		StatChip($$renderer, {
			label: "theological",
			value: policies.filter((p) => p.category === "theological").length,
			tone: "purple"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "family safety",
			value: policies.filter((p) => p.category === "family_safety").length,
			tone: "red"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "content",
			value: policies.filter((p) => p.category === "content").length,
			tone: "green"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "technical",
			value: policies.filter((p) => p.category === "technical").length,
			tone: "blue"
		});
		$$renderer.push(`<!----></div> <div class="surface-2 rounded-xl p-6"><div class="flex items-center space-x-4"><label for="filterByCategory" class="text-sm font-medium text-foreground">Filter by Category:</label> `);
		$$renderer.select({
			id: "filterByCategory",
			value: selectedCategory,
			class: "px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600 focus:border-transparent"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Categories`);
			});
			$$renderer.option({ value: "theological" }, ($$renderer) => {
				$$renderer.push(`Theological`);
			});
			$$renderer.option({ value: "family_safety" }, ($$renderer) => {
				$$renderer.push(`Family Safety`);
			});
			$$renderer.option({ value: "content" }, ($$renderer) => {
				$$renderer.push(`Content Moderation`);
			});
			$$renderer.option({ value: "technical" }, ($$renderer) => {
				$$renderer.push(`Technical`);
			});
		});
		$$renderer.push(`</div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><!--[-->`);
		const each_array = ensure_array_like(filteredPolicies());
		for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
			let policy = each_array[$$index_2];
			$$renderer.push(`<div class="surface-2 rounded-xl p-6 space-y-4"><div class="flex justify-between items-start"><div><div class="flex items-center space-x-3 mb-2"><h3 class="text-xl font-bold text-foreground">${escape_html(policy.title)}</h3> <span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getCategoryColor(policy.category))}`)}>${escape_html(policy.category.replace("_", " "))}</span></div> <p class="text-foreground/80 text-sm">${escape_html(policy.description)}</p></div> <div class="flex items-center space-x-2"><span${attr_class(`px-2 py-1 text-xs rounded-full ${stringify(getSeverityColor(policy.severity))}`)}>${escape_html(policy.severity.toUpperCase())}</span> <button${attr_class(`px-3 py-1 text-xs rounded-full transition-colors ${policy.isActive ? "bg-green-600 text-foreground" : "bg-gray-600 text-white/80"}`)}>${escape_html(policy.isActive ? "Active" : "Inactive")}</button></div></div> <div><h4 class="font-medium text-foreground mb-2">Requirements</h4> <ul class="text-sm text-green-300 space-y-1"><!--[-->`);
			const each_array_1 = ensure_array_like(policy.requirements.slice(0, 3));
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let requirement = each_array_1[$$index];
				$$renderer.push(`<li>• ${escape_html(requirement)}</li>`);
			}
			$$renderer.push(`<!--]--> `);
			if (policy.requirements.length > 3) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<li class="text-muted-foreground">... and ${escape_html(policy.requirements.length - 3)} more</li>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></ul></div> <div><h4 class="font-medium text-foreground mb-2">Common Violations</h4> <ul class="text-sm text-red-300 space-y-1"><!--[-->`);
			const each_array_2 = ensure_array_like(policy.violations.slice(0, 2));
			for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
				let violation = each_array_2[$$index_1];
				$$renderer.push(`<li>• ${escape_html(violation)}</li>`);
			}
			$$renderer.push(`<!--]--> `);
			if (policy.violations.length > 2) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<li class="text-muted-foreground">... and ${escape_html(policy.violations.length - 2)} more</li>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></ul></div> <div class="flex justify-between items-center pt-4 border-t border-gray-600"><div class="text-xs text-muted-foreground">Updated ${escape_html(policy.updatedAt.toLocaleDateString())}</div> <div class="flex space-x-2"><button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">Edit</button> <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">Archive</button></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (editingPolicy) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"><div class="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"><div class="p-6"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-foreground">${escape_html(showCreateModal ? "Create New Policy" : "Edit Policy")}</h2> <button class="text-muted-foreground hover:text-foreground" aria-label="Close policy modal"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="space-y-4"><div><label for="policyTitle" class="block text-sm font-medium text-foreground mb-2">Policy Title</label> <input id="policyTitle" type="text"${attr("value", editingPolicy.title)} class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground" placeholder="Enter policy title..."/></div> <div class="grid grid-cols-2 gap-4"><div><label for="policyCategory" class="block text-sm font-medium text-foreground mb-2">Category</label> `);
			$$renderer.select({
				id: "policyCategory",
				value: editingPolicy.category,
				class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"
			}, ($$renderer) => {
				$$renderer.option({ value: "theological" }, ($$renderer) => {
					$$renderer.push(`Theological`);
				});
				$$renderer.option({ value: "family_safety" }, ($$renderer) => {
					$$renderer.push(`Family Safety`);
				});
				$$renderer.option({ value: "content" }, ($$renderer) => {
					$$renderer.push(`Content Moderation`);
				});
				$$renderer.option({ value: "technical" }, ($$renderer) => {
					$$renderer.push(`Technical`);
				});
			});
			$$renderer.push(`</div> <div><label for="policySeverity" class="block text-sm font-medium text-foreground mb-2">Severity</label> `);
			$$renderer.select({
				id: "policySeverity",
				value: editingPolicy.severity,
				class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"
			}, ($$renderer) => {
				$$renderer.option({ value: "low" }, ($$renderer) => {
					$$renderer.push(`Low`);
				});
				$$renderer.option({ value: "medium" }, ($$renderer) => {
					$$renderer.push(`Medium`);
				});
				$$renderer.option({ value: "high" }, ($$renderer) => {
					$$renderer.push(`High`);
				});
				$$renderer.option({ value: "critical" }, ($$renderer) => {
					$$renderer.push(`Critical`);
				});
			});
			$$renderer.push(`</div></div> <div><label for="policyDescription" class="block text-sm font-medium text-foreground mb-2">Description</label> <textarea id="policyDescription" rows="3" class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground resize-none" placeholder="Describe the policy purpose and scope...">`);
			const $$body = escape_html(editingPolicy.description);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div></div> <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-600"><button class="bg-gray-600 hover:bg-gray-700 text-foreground px-6 py-2 rounded-lg transition-colors">Cancel</button> <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">Save Policy</button></div></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
