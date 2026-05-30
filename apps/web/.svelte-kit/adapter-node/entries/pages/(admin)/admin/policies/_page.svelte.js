import { St as stringify, gt as ensure_array_like, jt as escape_html, mt as derived, ut as attr_class } from "../../../../../chunks/ui-libs.js";
//#region src/routes/(admin)/admin/policies/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let policies = [];
		let selectedCategory = "all";
		const filteredPolicies = derived(() => policies.filter((policy) => true));
		function getCategoryColor(category) {
			switch (category) {
				case "theological": return "bg-purple-600 text-white";
				case "family_safety": return "bg-pink-600 text-white";
				case "content": return "bg-green-600 text-white";
				case "technical": return "bg-blue-600 text-white";
				default: return "bg-gray-600 text-white";
			}
		}
		function getSeverityColor(severity) {
			switch (severity) {
				case "critical": return "bg-red-600 text-white";
				case "high": return "bg-orange-600 text-white";
				case "medium": return "bg-yellow-600 text-black";
				case "low": return "bg-green-600 text-white";
				default: return "bg-gray-600 text-white";
			}
		}
		$$renderer.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h1 class="text-4xl font-bold text-white mb-2">Content Policies</h1> <p class="text-xl text-gray-300">Manage guidelines and standards for content review</p></div> <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">Create New Policy</button></div> <div class="grid grid-cols-4 gap-4"><div class="bg-purple-600/20 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-purple-400">${escape_html(policies.filter((p) => p.category === "theological").length)}</div> <div class="text-xs text-purple-200">Theological</div></div> <div class="bg-pink-600/20 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-pink-400">${escape_html(policies.filter((p) => p.category === "family_safety").length)}</div> <div class="text-xs text-pink-200">Family Safety</div></div> <div class="bg-green-600/20 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-green-400">${escape_html(policies.filter((p) => p.category === "content").length)}</div> <div class="text-xs text-green-200">Content</div></div> <div class="bg-blue-600/20 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-blue-400">${escape_html(policies.filter((p) => p.category === "technical").length)}</div> <div class="text-xs text-blue-200">Technical</div></div></div> <div class="bg-white/10 rounded-xl p-6"><div class="flex items-center space-x-4"><label for="filterByCategory" class="text-sm font-medium text-white">Filter by Category:</label> `);
		$$renderer.select({
			id: "filterByCategory",
			value: selectedCategory,
			class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
			$$renderer.push(`<div class="bg-white/10 rounded-xl p-6 space-y-4"><div class="flex justify-between items-start"><div><div class="flex items-center space-x-3 mb-2"><h3 class="text-xl font-bold text-white">${escape_html(policy.title)}</h3> <span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getCategoryColor(policy.category))}`)}>${escape_html(policy.category.replace("_", " "))}</span></div> <p class="text-gray-300 text-sm">${escape_html(policy.description)}</p></div> <div class="flex items-center space-x-2"><span${attr_class(`px-2 py-1 text-xs rounded-full ${stringify(getSeverityColor(policy.severity))}`)}>${escape_html(policy.severity.toUpperCase())}</span> <button${attr_class(`px-3 py-1 text-xs rounded-full transition-colors ${policy.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}`)}>${escape_html(policy.isActive ? "Active" : "Inactive")}</button></div></div> <div><h4 class="font-medium text-white mb-2">Requirements</h4> <ul class="text-sm text-green-300 space-y-1"><!--[-->`);
			const each_array_1 = ensure_array_like(policy.requirements.slice(0, 3));
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let requirement = each_array_1[$$index];
				$$renderer.push(`<li>• ${escape_html(requirement)}</li>`);
			}
			$$renderer.push(`<!--]--> `);
			if (policy.requirements.length > 3) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<li class="text-gray-400">... and ${escape_html(policy.requirements.length - 3)} more</li>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></ul></div> <div><h4 class="font-medium text-white mb-2">Common Violations</h4> <ul class="text-sm text-red-300 space-y-1"><!--[-->`);
			const each_array_2 = ensure_array_like(policy.violations.slice(0, 2));
			for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
				let violation = each_array_2[$$index_1];
				$$renderer.push(`<li>• ${escape_html(violation)}</li>`);
			}
			$$renderer.push(`<!--]--> `);
			if (policy.violations.length > 2) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<li class="text-gray-400">... and ${escape_html(policy.violations.length - 2)} more</li>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></ul></div> <div class="flex justify-between items-center pt-4 border-t border-gray-600"><div class="text-xs text-gray-400">Updated ${escape_html(policy.updatedAt.toLocaleDateString())}</div> <div class="flex space-x-2"><button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">Edit</button> <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">Archive</button></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
