import { Et as derived, kt as head } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/MediaGrid.js";
import "../../../../chunks/Recommendations2.js";
//#region src/routes/(app)/browse/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		derived(() => [
			{
				title: "Trending Movies",
				items: data.movies || []
			},
			{
				title: "Popular Shows",
				items: data.shows || []
			},
			{
				title: "Documentaries",
				items: data.documentaries || []
			}
		]);
		head("35mq2q", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Browse - Sephar Studios</title>`);
			});
		});
		$$renderer.push(`<div class="relative min-h-screen bg-(--surface-charcoal) text-white"><div class="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.12),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.12),transparent_40%)] pointer-events-none"></div> <main class="container relative z-10 pt-28 pb-16 mx-auto px-4">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></main></div>`);
	});
}
//#endregion
export { _page as default };
