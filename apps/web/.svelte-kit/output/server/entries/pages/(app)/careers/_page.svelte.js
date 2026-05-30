import { _t as head } from "../../../../chunks/ui-libs.js";
//#region src/routes/(app)/careers/+page.svelte
function _page($$renderer) {
	head("1n6ke1x", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Careers | Sephar Studios</title>`);
		});
		$$renderer.push(`<meta name="description" content="Join Sephar Studios and help build faith-based entertainment experiences for the world."/>`);
	});
	$$renderer.push(`<main class="container mx-auto px-4 py-16"><div class="max-w-3xl mx-auto text-center space-y-6"><h1 class="text-4xl md:text-5xl font-bold">Careers at Sephar Studios</h1> <p class="text-muted-foreground text-lg">We are growing our team across engineering, content, design, and operations.</p> <p class="text-muted-foreground">Send your resume and portfolio to <a href="mailto:info@sepharstudios.com" class="text-primary hover:underline">info@sepharstudios.com</a>.</p></div></main>`);
}
//#endregion
export { _page as default };
