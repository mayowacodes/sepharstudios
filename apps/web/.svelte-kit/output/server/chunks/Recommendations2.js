import { Ot as ensure_array_like } from "./ui-libs.js";
//#region src/lib/components/sections/dashboard/RecentlyWatched.svelte
function RecentlyWatched($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section><h2 class="text-xl font-semibold mb-4">Continue Watching</h2> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="w-44 shrink-0 space-y-2"><div class="aspect-video bg-white/5 rounded-lg animate-pulse"></div> <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/components/sections/dashboard/Recommendations.svelte
function Recommendations($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section><h2 class="text-xl font-semibold mb-4">Recommended for You</h2> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="w-36 shrink-0 space-y-2"><div class="aspect-2/3 bg-white/5 rounded-lg animate-pulse"></div> <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
export { RecentlyWatched as n, Recommendations as t };
