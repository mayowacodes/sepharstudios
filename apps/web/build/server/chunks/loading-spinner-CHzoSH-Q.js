import { ab as attr_class, ag as clsx$1 } from './ui-libs-TtGtWAGI.js';
import { c as cn } from './utils2-C8dWVCac.js';

//#region src/lib/authentication/ui/loading-spinner.svelte
function Loading_spinner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className } = $$props;
		$$renderer.push(`<svg${attr_class(clsx$1(cn("mr-2 -ml-1 h-4 w-4 animate-spin text-white", className)))} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
	});
}

export { Loading_spinner as L };
//# sourceMappingURL=loading-spinner-CHzoSH-Q.js.map
