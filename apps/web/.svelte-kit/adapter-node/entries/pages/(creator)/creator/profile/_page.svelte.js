import { kt as attr } from "../../../../../chunks/ui-libs.js";
//#region src/routes/(creator)/creator/profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-bold text-white mb-2">Creator Profile</h1> <p class="text-gray-300">Manage your profile and ministry information</p></div> <div class="mt-4 sm:mt-0"><button${attr("disabled", false, true)} class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`💾 Save Changes`);
		$$renderer.push(`<!--]--></button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-white ml-4">Loading profile...</p></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
