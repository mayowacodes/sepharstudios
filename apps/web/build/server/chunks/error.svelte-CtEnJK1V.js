import { au as escape_html } from './ui-libs-BjzLDLAh.js';
import { p as page } from './state-D0xWVGEE.js';
import './rolldown-runtime-pTpnEGsq.js';
import './client-Bo2aevGq.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';

//#region ../../node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}

export { Error as default };
//# sourceMappingURL=error.svelte-CtEnJK1V.js.map
