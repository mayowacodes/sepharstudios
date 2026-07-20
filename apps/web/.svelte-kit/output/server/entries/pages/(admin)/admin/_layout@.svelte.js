import { kt as head } from "../../../../chunks/ui-libs.js";
import { t as PortalShell } from "../../../../chunks/PortalShell.js";
/* empty css                      */
//#region src/routes/(admin)/admin/+layout@.svelte
function _layout_($$renderer, $$props) {
	let { children } = $$props;
	head("fkwoe4", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Admin - Sephar Studios</title>`);
		});
	});
	PortalShell($$renderer, {
		portal: "admin",
		children: ($$renderer) => {
			children($$renderer);
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _layout_ as default };
