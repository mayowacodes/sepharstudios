import './index.js-CxPEndTa.js';

//#region src/routes/(auth)/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="animate-in">`);
	children($$renderer);
	$$renderer.push(`<!----></div>`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CwFSwkev.js.map
