import { q as escape_html } from './index.js-DwRgOKlO.js';
import { p as page } from './state-Dt886Sc8.js';
import './client-BnGpewQC.js';

//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}

export { Error as default };
//# sourceMappingURL=error.svelte-iFbZGvwS.js.map
