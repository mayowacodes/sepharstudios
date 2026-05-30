import './ui-libs-TtGtWAGI.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(auth)/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="animate-in">`);
	children($$renderer);
	$$renderer.push(`<!----></div>`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-BWtN-5dm.js.map
