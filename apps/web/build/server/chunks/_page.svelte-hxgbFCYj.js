import { f as derived } from './index.js-BP8aAXBX.js';
import { C as Constants } from './constants-DSOCQRom.js';
import { M as Mail } from './mail-CRUGZHP7.js';
import { S as Shield_alert } from './shield-alert-Cgwe5Fn0.js';
import './client-ZoNwVBKD.js';
import { X } from './x-CH8KQLcs.js';
import { p as page } from './state-DL22RgpG.js';
import { B as Button } from './button--do5FSjb.js';
import './mediaModalStore-D64OuSr2.js';
import './myList-Dunyrnu8.js';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';
import './utils2-CqskQpUP.js';
import './index-D1eQaiDA.js';
import './toast-state.svelte-B2rj3hM9.js';

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
//# sourceMappingURL=_page.svelte-hxgbFCYj.js.map
