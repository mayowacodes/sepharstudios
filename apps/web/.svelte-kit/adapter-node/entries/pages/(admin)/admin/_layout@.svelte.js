import { _t as head, gt as ensure_array_like, jt as escape_html, kt as attr, ut as attr_class } from "../../../../chunks/ui-libs.js";
/* empty css                      */
import { t as page } from "../../../../chunks/state.js";
import "../../../../chunks/portal-navigation.js";
//#region src/lib/components/admin/AdminNav.svelte
function AdminNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const navItems = [
			{
				href: "/admin",
				label: "Dashboard",
				icon: "Home"
			},
			{
				href: "/admin/review",
				label: "Review Queue",
				icon: "Review"
			},
			{
				href: "/admin/content",
				label: "Content",
				icon: "Content"
			},
			{
				href: "/admin/creators",
				label: "Creators",
				icon: "Users"
			},
			{
				href: "/admin/creator-applications",
				label: "Applications",
				icon: "Apply"
			},
			{
				href: "/admin/analytics",
				label: "Analytics",
				icon: "Stats"
			},
			{
				href: "/admin/governance",
				label: "Governance",
				icon: "Gov"
			},
			{
				href: "/admin/settings",
				label: "Settings",
				icon: "Settings"
			}
		];
		const externalLinks = [{
			href: "https://creators.sepharstudios.com/creator",
			label: "Creator Portal",
			icon: "🎬"
		}, {
			href: "https://sepharstudios.com",
			label: "Main Site",
			icon: "🏠"
		}];
		const isActive = (path) => {
			if (path === "/admin") return page.url.pathname === "/admin";
			return page.url.pathname.startsWith(path);
		};
		$$renderer.push(`<nav class="bg-black/20 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4"><div class="flex items-center justify-between h-16"><div class="flex items-center space-x-4"><button class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors"><img src="/logo-alone-sepharstudios-bgless.png" alt="Sephar Studios" class="h-8 w-auto object-contain"/> <span class="text-2xl font-bold">Sephar Studios</span></button> <span class="text-red-400 font-medium">Admin Panel</span></div> <div class="hidden md:flex items-center space-x-1"><!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive(item.href) ? "bg-red-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`)}><span class="text-xs uppercase tracking-wide">${escape_html(item.icon)}</span> <span>${escape_html(item.label)}</span></a>`);
		}
		$$renderer.push(`<!--]--> <span class="mx-2 text-gray-500">|</span> <!--[-->`);
		const each_array_1 = ensure_array_like(externalLinks);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let item = each_array_1[$$index_1];
			$$renderer.push(`<a${attr("href", item.href)} target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"><span class="text-xs">${escape_html(item.icon)}</span> <span>${escape_html(item.label)}</span></a>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex items-center space-x-4"><button class="text-gray-300 hover:text-white" aria-label="Notifications">N</button> <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">A</div></div></div></div></nav>`);
	});
}
//#endregion
//#region src/routes/(admin)/admin/+layout@.svelte
function _layout_($$renderer, $$props) {
	let { children } = $$props;
	head("fkwoe4", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Admin - Sephar Studios</title>`);
		});
	});
	$$renderer.push(`<div class="admin-section min-h-screen bg-linear-to-b from-gray-900 to-black text-white">`);
	AdminNav($$renderer, {});
	$$renderer.push(`<!----> <main class="pt-20">`);
	children($$renderer);
	$$renderer.push(`<!----></main></div>`);
}
//#endregion
export { _layout_ as default };
