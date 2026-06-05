import './ui-libs-BjzLDLAh.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(web3)/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		$$renderer.push(`<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary">Skip to main content</a> <div class="web3-layout min-h-screen svelte-1whnx50"><main id="main-content" tabindex="-1" class="container mx-auto px-4 py-8">`);
		children($$renderer);
		$$renderer.push(`<!----></main></div>`);
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Cs-eM8k9.js.map
