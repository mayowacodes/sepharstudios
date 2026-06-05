import { Lt as attr, vt as attr_class, wt as ensure_array_like } from "../../../../../chunks/ui-libs.js";
//#region src/routes/kids/kiddies/profile/+page.svelte
function _page($$renderer) {
	let selectedAvatar = localStorage.getItem("avatar") || "/avatars/teen-1.png";
	const avatars = [
		"/avatars/teen-1.png",
		"/avatars/teen-2.png",
		"/avatars/teen-3.png",
		"/avatars/teen-4.png"
	];
	$$renderer.push(`<main class="p-8"><h1 class="text-3xl font-bold text-purple-700 mb-4">Choose Your Teen Avatar</h1> <div class="grid grid-cols-2 sm:grid-cols-4 gap-6"><!--[-->`);
	const each_array = ensure_array_like(avatars);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let avatar = each_array[$$index];
		$$renderer.push(`<button type="button" aria-label="Choose avatar"${attr("aria-pressed", selectedAvatar === avatar)} class="rounded-full focus:outline-none focus:ring-4 focus:ring-purple-300"><img${attr("src", avatar)} alt=""${attr_class(`w-24 h-24 rounded-full border-4 ${selectedAvatar === avatar ? "border-purple-500" : "border-transparent"} hover:scale-110 transition`)}/></button>`);
	}
	$$renderer.push(`<!--]--></div> <p class="mt-6 text-lg">Your selected avatar will appear in the top navigation.</p></main>`);
}
//#endregion
export { _page as default };
