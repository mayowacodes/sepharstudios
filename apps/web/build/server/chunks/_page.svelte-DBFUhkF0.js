import { f as derived } from './index.js-CxPEndTa.js';
import { C as Constants } from './constants-BiiFHz9b.js';
import { M as Mail } from './mail-7qGu_REA.js';
import { S as Shield_alert } from './shield-alert-DqY7tJTj.js';
import './client-DsZfmj3l.js';
import { X } from './x-57ZXvvuj.js';
import { p as page } from './state-p7jw8P-1.js';
import { B as Button } from './button-DtPBvYl-.js';
import './mediaModalStore-lqgzamJ3.js';
import './myList-e_4PgnNM.js';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';
import './utils2-DZI6czOR.js';
import './index-BoGG3uCW.js';
import './toast-state.svelte-jhYVYtU8.js';

//#endregion
//#region src/lib/components/widgets/AccessDeniedBanner.svelte
function AccessDeniedBanner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		if (derived(() => page.url.searchParams.get("denied"))() === "admin" && true) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="access-denied-banner svelte-19o2cg7" role="alert"><div class="access-denied-inner svelte-19o2cg7"><div class="access-denied-icon svelte-19o2cg7">`);
			Shield_alert($$renderer, { class: "w-5 h-5" });
			$$renderer.push(`<!----></div> <div class="access-denied-body svelte-19o2cg7"><p class="access-denied-title svelte-19o2cg7">Admin portal access required</p> <p class="access-denied-text svelte-19o2cg7">Your account doesn't have admin privileges. Reach out to the support team and we'll review your request.</p></div> <div class="access-denied-actions svelte-19o2cg7">`);
			Button($$renderer, {
				size: "sm",
				href: `mailto:${Constants.SUPPORTEMAIL}?subject=Admin%20access%20request`,
				children: ($$renderer) => {
					Mail($$renderer, { class: "w-4 h-4 mr-1.5" });
					$$renderer.push(`<!----> Contact support`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <button type="button" class="access-denied-close svelte-19o2cg7" aria-label="Dismiss notice">`);
			X($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/(app)/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		$$renderer.push(`<div class="relative overflow-hidden min-h-screen bg-(--surface-charcoal) text-white"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div> `);
		AccessDeniedBanner($$renderer);
		$$renderer.push(`<!----> <main class="container relative z-10 pt-32 pb-16 mx-auto px-4">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></main></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DBFUhkF0.js.map
