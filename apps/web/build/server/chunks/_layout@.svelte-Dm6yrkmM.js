import { at as head, al as ensure_array_like, aa as attr, ab as attr_class, an as escape_html } from './ui-libs-TtGtWAGI.js';
import { p as page } from './state-Cm-InHWy.js';
import './client-CZa6R-ON.js';
import { B as Button } from './button-D9M18H3C.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

//#region src/lib/components/creator/CreatorNav.svelte
function CreatorNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const navItems = [
			{
				href: "/creator",
				label: "Dashboard",
				icon: "🏠"
			},
			{
				href: "/creator/upload",
				label: "Upload",
				icon: "📤"
			},
			{
				href: "/creator/content",
				label: "Content",
				icon: "🎬"
			},
			{
				href: "/creator/analytics",
				label: "Analytics",
				icon: "📊"
			},
			{
				href: "/creator/profile",
				label: "Profile",
				icon: "👤"
			},
			{
				href: "/creator/guidelines",
				label: "Guidelines",
				icon: "📋"
			}
		];
		const isActive = (path) => {
			if (path === "/creator") return page.url.pathname === "/creator";
			return page.url.pathname.startsWith(path);
		};
		$$renderer.push(`<nav class="bg-black/20 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4"><div class="flex items-center justify-between h-16"><div class="flex items-center space-x-4"><button class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors"><img src="/logo-alone-sepharstudios-bgless.png" alt="Sephar Studios" class="h-8 w-auto object-contain"/> <span class="text-2xl font-bold">Sephar Studios</span></button> <span class="text-purple-400 font-medium">Creator Studio</span></div> <div class="hidden md:flex items-center space-x-1"><!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive(item.href) ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`)}><span>${escape_html(item.icon)}</span> <span>${escape_html(item.label)}</span></a>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex items-center space-x-4"><button class="text-gray-300 hover:text-white">🔔</button> <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">M</div></div></div></div></nav>`);
	});
}
//#endregion
//#region src/lib/components/creator/CreatorFooter.svelte
function CreatorFooter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const creatorLinks = {
			"Creator Resources": [
				{
					label: "Upload Guidelines",
					href: "/creator/guidelines"
				},
				{
					label: "Creator Support",
					href: "/creator/support"
				},
				{
					label: "Best Practices",
					href: "/creator/best-practices"
				},
				{
					label: "Analytics Help",
					href: "/creator/analytics-help"
				}
			],
			"Community": [
				{
					label: "Creator Forum",
					href: "/creator/forum"
				},
				{
					label: "Events",
					href: "/creator/events"
				},
				{
					label: "Newsletter",
					href: "/creator/newsletter"
				},
				{
					label: "Success Stories",
					href: "/creator/success-stories"
				}
			],
			"Support": [
				{
					label: "Help Center",
					href: "/help"
				},
				{
					label: "Contact Us",
					href: "/contact"
				},
				{
					label: "Technical Support",
					href: "/creator/tech-support"
				},
				{
					label: "FAQ",
					href: "/faq"
				}
			],
			"Legal": [
				{
					label: "Creator Agreement",
					href: "/creator/agreement"
				},
				{
					label: "Privacy Policy",
					href: "/privacy"
				},
				{
					label: "Content Guidelines",
					href: "/guidelines"
				},
				{
					label: "Copyright Policy",
					href: "/creator/copyright"
				}
			]
		};
		$$renderer.push(`<footer class="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-auto"><div class="container mx-auto px-4 py-8"><div class="grid gap-8 md:grid-cols-2 lg:grid-cols-5"><div class="flex flex-col gap-4"><button class="flex items-center gap-3 text-2xl font-bold text-white hover:text-purple-300 transition-colors text-left"><img src="/logo-alone-sepharstudios-bgless.png" alt="Sephar Studios" class="h-8 w-auto object-contain"/> <span>Sephar Studios</span></button> <p class="text-sm text-gray-300">Empowering faith-based creators to share their ministry with the world.</p> <div class="p-4 bg-linear-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30"><button class="text-lg font-bold text-purple-300 hover:text-purple-100 transition-colors flex items-center gap-2"><span>🎬</span> <span>Get Movie Sponsorship</span></button> <p class="text-xs text-gray-400 mt-1">Fund your faith-based film projects</p></div></div> <!--[-->`);
		const each_array = ensure_array_like(Object.entries(creatorLinks));
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let [category, items] = each_array[$$index_1];
			$$renderer.push(`<div class="space-y-4"><h4 class="text-sm font-semibold text-purple-300">${escape_html(category)}</h4> <ul class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(items);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let item = each_array_1[$$index];
				$$renderer.push(`<li><a${attr("href", item.href)} class="text-sm text-gray-400 hover:text-white transition-colors">${escape_html(item.label)}</a></li>`);
			}
			$$renderer.push(`<!--]--></ul></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-8 border-t border-white/10 pt-8"><div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"><div class="text-center"><div class="text-2xl font-bold text-purple-400">342</div> <div class="text-xs text-gray-400">Active Creators</div></div> <div class="text-center"><div class="text-2xl font-bold text-blue-400">2.8K</div> <div class="text-xs text-gray-400">Content Published</div></div> <div class="text-center"><div class="text-2xl font-bold text-green-400">3.8M</div> <div class="text-xs text-gray-400">Total Views</div></div> <div class="text-center"><div class="text-2xl font-bold text-yellow-400">$287K</div> <div class="text-xs text-gray-400">Creator Earnings</div></div></div> <div class="flex flex-col md:flex-row items-center justify-between gap-4"><p class="text-sm text-gray-400">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Sephar Studios Creator Studio. All rights reserved.</p> <div class="flex items-center gap-4"><a href="https://facebook.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="Facebook"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg></a> <a href="https://twitter.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="Twitter"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg></a> <a href="https://instagram.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z"></path></svg></a> <a href="https://youtube.com/sepharstudios" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-purple-300 transition-colors" aria-label="YouTube"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.993 2.993 0 00-2.11-2.11C19.51 3.75 12 3.75 12 3.75s-7.51 0-9.388.326a2.993 2.993 0 00-2.11 2.11C.176 8.064.176 12 .176 12s0 3.936.326 5.814a2.993 2.993 0 002.11 2.11c1.878.326 9.388.326 9.388.326s7.51 0 9.388-.326a2.993 2.993 0 002.11-2.11C23.824 15.936 23.824 12 23.824 12s0-3.936-.326-5.814zM9.75 15.568V8.432L15.568 12 9.75 15.568z"></path></svg></a></div></div></div></div></footer>`);
	});
}
//#endregion
//#region src/routes/(creator)/creator/+layout@.svelte
function _layout_($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const user = page.data.user;
		head("1tcrg26", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Creator Studio - Sephar Studios</title>`);
			});
		});
		$$renderer.push(`<div class="creator-portal">`);
		if (user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="min-h-screen bg-linear-to-br from-primary/20 via-secondary/10 to-accent/20 flex flex-col">`);
			CreatorNav($$renderer);
			$$renderer.push(`<!----> <main class="container mx-auto px-4 py-8 grow">`);
			children($$renderer);
			$$renderer.push(`<!----></main> `);
			CreatorFooter($$renderer);
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted"><div class="text-center max-w-md px-6"><div class="mb-8"><div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"><svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div> <h1 class="text-3xl font-bold mb-4">Creator Access Required</h1> <p class="text-muted-foreground mb-8">Sign in to access the creator portal and start sharing your faith-based content with the world.</p></div> <div class="space-y-4">`);
			Button($$renderer, {
				href: "/auth/login?redirectTo=/creator",
				class: "w-full bg-primary hover:bg-primary/90",
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Sign In to Creator Portal`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="text-sm text-muted-foreground"><p>Don't have an account?</p> `);
			Button($$renderer, {
				href: "/auth/register?redirectTo=/creator",
				variant: "link",
				class: "text-primary hover:text-primary/80",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Sign up here`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="mt-8 pt-8 border-t border-border"><p class="text-xs text-muted-foreground">Need help getting started? `);
			Button($$renderer, {
				href: "/help",
				variant: "link",
				class: "text-primary p-0 h-auto",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Visit our help center`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></p></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _layout_ as default };
//# sourceMappingURL=_layout@.svelte-Dm6yrkmM.js.map
