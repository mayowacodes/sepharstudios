import { ai as derived, an as escape_html, aa as attr, ab as attr_class, aH as spread_props } from './ui-libs-TtGtWAGI.js';
import { I as Icon } from './Icon-CGEdwVFL.js';
import { C as Chevron_down } from './chevron-down-mzP8AnTN.js';
import { U as Users } from './users-Bb_ynahW.js';
import { b as beforeNavigate } from './client-CZa6R-ON.js';
import { p as page } from './state-Cm-InHWy.js';
import { B as Button } from './button-D9M18H3C.js';
import { D as Dropdown_menu, f as Dropdown_menu_trigger, a as Dropdown_menu_content, c as Dropdown_menu_item } from './dropdown-menu-Dg5aZQ3h.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/baby.svelte
function Baby($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "baby" },
		props,
		{ iconNode: [
			["path", { "d": "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" }],
			["path", { "d": "M15 12h.01" }],
			["path", { "d": "M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" }],
			["path", { "d": "M9 12h.01" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/kids/SafeExplorationMode.svelte
function SafeExplorationMode($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Profile type — 'kids' enforces strict allow-list, 'teens' is slightly relaxed */
		let { profileType = "kids", children } = $$props;
		const KIDS_ALLOWED_PREFIXES = [
			"/kids/",
			"/watch/",
			"/auth/",
			"/api/"
		];
		const TEENS_ALLOWED_PREFIXES = [
			"/kids/",
			"/watch/",
			"/auth/",
			"/api/",
			"/plans",
			"/checkout"
		];
		let blocked = false;
		function isAllowed(url) {
			return (profileType === "teens" ? TEENS_ALLOWED_PREFIXES : KIDS_ALLOWED_PREFIXES).some((p) => url.startsWith(p));
		}
		beforeNavigate(({ to, cancel }) => {
			if (!to) return;
			const path = to.url.pathname;
			if (!isAllowed(path)) {
				cancel();
				blocked = true;
			}
		});
		if (blocked) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-pink-100 to-indigo-200"><div class="text-center px-8 py-10 bg-white rounded-3xl shadow-2xl max-w-sm mx-4"><div class="text-6xl mb-4">🔒</div> <h2 class="text-2xl font-bold text-gray-800 mb-2">${escape_html(profileType === "teens" ? "That area is for grown-ups" : "Oops! Wrong way!")}</h2> <p class="text-gray-500 text-sm mb-6">${escape_html(profileType === "teens" ? "That section is not available on this profile." : "This part of the app is only for adults. Let's go back to the fun stuff!")}</p> <div class="flex flex-col gap-3"><a${attr("href", profileType === "teens" ? "/kids/teens" : "/kids/kiddies")}${attr_class(`block w-full py-3 px-6 rounded-2xl font-bold text-white ${profileType === "teens" ? "bg-indigo-500 hover:bg-indigo-600" : "bg-pink-500 hover:bg-pink-600"} transition-colors shadow-md`)}>${escape_html(profileType === "teens" ? "Back to Teens" : "Back to Kids Zone")}</a> <a href="/profiles" class="block w-full py-3 px-6 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Switch Profile</a></div></div></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/kids/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { children } = $$props;
		const currentPath = derived(() => page.url.pathname);
		const isTeens = derived(() => currentPath().includes("/kids/teens"));
		const profileType = derived(() => isTeens() ? "teens" : "kids");
		const currentLabel = derived(() => isTeens() ? "Teens" : "Kiddies");
		$$renderer.push(`<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary">Skip to main content</a> <div class="min-h-screen bg-background flex flex-col"><nav class="border-b bg-card px-4 py-2 flex items-center justify-between sticky top-0 z-50"><div class="flex items-center space-x-4"><button class="font-bold text-primary hover:opacity-80 transition-opacity">Sephar Studios</button> `);
		if (Dropdown_menu) {
			$$renderer.push("<!--[-->");
			Dropdown_menu($$renderer, {
				children: ($$renderer) => {
					{
						function child($$renderer, { props }) {
							Button($$renderer, spread_props([
								{
									variant: "outline",
									class: "flex items-center space-x-2"
								},
								props,
								{
									children: ($$renderer) => {
										if (isTeens()) {
											$$renderer.push("<!--[0-->");
											Users($$renderer, { class: "w-4 h-4" });
										} else {
											$$renderer.push("<!--[-1-->");
											Baby($$renderer, { class: "w-4 h-4" });
										}
										$$renderer.push(`<!--]--> <span>${escape_html(currentLabel())} Section</span> `);
										Chevron_down($$renderer, { class: "w-4 h-4" });
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								}
							]));
						}
						if (Dropdown_menu_trigger) {
							$$renderer.push("<!--[-->");
							Dropdown_menu_trigger($$renderer, {
								child,
								$$slots: { child: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					}
					$$renderer.push(` `);
					if (Dropdown_menu_content) {
						$$renderer.push("<!--[-->");
						Dropdown_menu_content($$renderer, {
							class: "w-48",
							children: ($$renderer) => {
								if (Dropdown_menu_item) {
									$$renderer.push("<!--[-->");
									Dropdown_menu_item($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<a href="/kids/kiddies" class="flex items-center space-x-2 w-full">`);
											Baby($$renderer, { class: "w-4 h-4" });
											$$renderer.push(`<!----> <span>Kiddies</span></a>`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Dropdown_menu_item) {
									$$renderer.push("<!--[-->");
									Dropdown_menu_item($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<a href="/kids/teens" class="flex items-center space-x-2 w-full">`);
											Users($$renderer, { class: "w-4 h-4" });
											$$renderer.push(`<!----> <span>Teens</span></a>`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div> <div class="flex items-center space-x-2"><button class="text-sm text-muted-foreground hover:text-foreground">Back to Main</button></div></nav> <main id="main-content" tabindex="-1" class="flex-1">`);
		SafeExplorationMode($$renderer, {
			profileType: profileType(),
			children: ($$renderer) => {
				children($$renderer);
				$$renderer.push(`<!---->`);
			}});
		$$renderer.push(`<!----></main></div>`);
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Bpn9y0Xr.js.map
