import { Dt as spread_props, It as writable, Lt as attr, Rt as clsx, St as derived, c as Scroll_area_corner, d as Scroll_area_viewport, f as Scroll_area$1, l as Scroll_area_thumb, u as Scroll_area_scrollbar$1, vt as attr_class, wt as ensure_array_like, xt as bind_props, zt as escape_html } from "../../../chunks/ui-libs.js";
import "../../../chunks/index-server.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Bell } from "../../../chunks/bell.js";
import { t as Chevron_right } from "../../../chunks/chevron-right.js";
import { n as Clapperboard, t as List_video } from "../../../chunks/list-video.js";
import { t as Clock } from "../../../chunks/clock.js";
import { t as Coins } from "../../../chunks/coins.js";
import { t as Crown } from "../../../chunks/crown.js";
import { t as Download } from "../../../chunks/download.js";
import { t as Log_out } from "../../../chunks/log-out.js";
import { t as Search } from "../../../chunks/search.js";
import { t as Settings } from "../../../chunks/settings.js";
import { t as User$1 } from "../../../chunks/user.js";
import { t as X } from "../../../chunks/x.js";
import { n as goto } from "../../../chunks/client.js";
import { t as page } from "../../../chunks/state.js";
import "../../../chunks/navigation.js";
import { t as cn } from "../../../chunks/utils2.js";
import { t as Button } from "../../../chunks/button.js";
import { a as Sheet_trigger, i as Sheet_content, n as Sheet_title, o as Sheet, r as Sheet_header, t as Sheet_description } from "../../../chunks/sheet.js";
import { a as Dropdown_menu_label, c as Dropdown_menu_content, i as Dropdown_menu_separator, o as Dropdown_menu_item, r as Dropdown_menu_trigger, u as Dropdown_menu } from "../../../chunks/dropdown-menu.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../chunks/avatar.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/menu.svelte
function Menu($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "menu" },
		props,
		{ iconNode: [
			["path", { "d": "M4 5h16" }],
			["path", { "d": "M4 12h16" }],
			["path", { "d": "M4 19h16" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/sections/MyStudiosDrawer.svelte
function MyStudiosDrawer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let isOpen = false;
		let activeSection = null;
		const userData = derived(() => page?.data?.user);
		page?.url.pathname;
		function getUserInitial(user) {
			if (!user) return "?";
			if (user.name) return user.name[0].toUpperCase();
			if (user.email) return user.email[0].toUpperCase();
			return "?";
		}
		const navSections = [
			{
				key: "profiles",
				label: "Profiles",
				icon: User$1,
				desc: "Switch or manage profiles"
			},
			{
				key: "mylist",
				label: "My List",
				icon: List_video,
				desc: "Saved content"
			},
			{
				key: "recommendations",
				label: "Recommended",
				icon: Clapperboard,
				desc: "Picked for you"
			},
			{
				key: "recent",
				label: "Recently Watched",
				icon: Clock,
				desc: "Continue watching"
			},
			{
				key: "downloads",
				label: "Downloads",
				icon: Download,
				desc: "Offline content"
			},
			{
				key: "settings",
				label: "Settings",
				icon: Settings,
				desc: "Preferences"
			},
			{
				key: "account",
				label: "Account",
				icon: User$1,
				desc: "Manage account"
			}
		];
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Sheet($$renderer, {
				get open() {
					return isOpen;
				},
				set open($$value) {
					isOpen = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Sheet_trigger($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<button class="studios-trigger svelte-1hr5ab1" aria-label="Open My Studios"><span class="studios-trigger-dot svelte-1hr5ab1"></span> <span class="studios-trigger-label svelte-1hr5ab1">My Studios</span></button>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Sheet_content($$renderer, {
						side: "left",
						class: "w-[min(380px,95vw)] h-full p-0 overflow-hidden border-r border-white/5 bg-transparent",
						children: ($$renderer) => {
							$$renderer.push(`<div class="studios-panel svelte-1hr5ab1" role="region" aria-label="My Studios"><div class="studios-hero svelte-1hr5ab1"><div class="studios-hero-bg svelte-1hr5ab1"></div> <div class="studios-hero-content svelte-1hr5ab1"><div class="studios-avatar svelte-1hr5ab1">`);
							if (userData()?.image) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<img${attr("src", userData().image)}${attr("alt", userData().name ?? "User")} class="w-full h-full object-cover rounded-full svelte-1hr5ab1"/>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<span class="studios-avatar-initial svelte-1hr5ab1">${escape_html(getUserInitial(userData()))}</span>`);
							}
							$$renderer.push(`<!--]--> <div class="studios-avatar-ring svelte-1hr5ab1"></div></div> <div class="studios-hero-info svelte-1hr5ab1"><h2 class="studios-name svelte-1hr5ab1">${escape_html(userData()?.name ?? "My Studios")}</h2> <p class="studios-email svelte-1hr5ab1">${escape_html(userData()?.email ?? "")}</p> <div class="studios-badge svelte-1hr5ab1">`);
							Crown($$renderer, { size: 10 });
							$$renderer.push(`<!----> <span class="svelte-1hr5ab1">Premium Member</span></div></div></div> <div class="studios-shimmer svelte-1hr5ab1"></div></div> <div class="studios-nav svelte-1hr5ab1"><!--[-->`);
							const each_array = ensure_array_like(navSections);
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let section = each_array[$$index];
								$$renderer.push(`<button${attr_class("studios-nav-item svelte-1hr5ab1", void 0, { "active": activeSection === section.key })}><div class="studios-nav-icon svelte-1hr5ab1">`);
								if (section.icon) {
									$$renderer.push("<!--[-->");
									section.icon($$renderer, { size: 16 });
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(`</div> <div class="studios-nav-text svelte-1hr5ab1"><span class="studios-nav-label svelte-1hr5ab1">${escape_html(section.label)}</span> <span class="studios-nav-desc svelte-1hr5ab1">${escape_html(section.desc)}</span></div> `);
								Chevron_right($$renderer, {
									size: 14,
									class: "studios-nav-chevron"
								});
								$$renderer.push(`<!----></button> `);
								if (activeSection === section.key) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div class="studios-section-content svelte-1hr5ab1">`);
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div class="studios-skeleton svelte-1hr5ab1"></div>`);
									$$renderer.push(`<!--]--></div>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]-->`);
							}
							$$renderer.push(`<!--]--></div> <div class="studios-footer svelte-1hr5ab1"><a href="/watchlist" class="studios-footer-link svelte-1hr5ab1">`);
							List_video($$renderer, { size: 14 });
							$$renderer.push(`<!----> Full My List</a> <a href="/token" class="studios-footer-link studios-footer-link--gold svelte-1hr5ab1">`);
							Coins($$renderer, { size: 14 });
							$$renderer.push(`<!----> STC Token</a> <a href="/settings" class="studios-footer-link svelte-1hr5ab1">`);
							Settings($$renderer, { size: 14 });
							$$renderer.push(`<!----> Settings</a></div></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/lib/components/Logo.svelte
function Logo($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let user = derived(() => page.data.user || null);
		let isAuthenticated = derived(() => !!user());
		let { class: className } = $$props;
		$$renderer.push(`<a${attr("href", isAuthenticated() ? "/browse" : "/")}${attr_class(clsx(cn("flex items-center space-x-2 transition-opacity hover:opacity-80", className)))}><img src="/logo-alone-sepharstudios-bgless.png" alt="Sephar Studios" class="h-8 w-auto object-contain"/> <!---->`);
		$$renderer.push(`<span class="font-extrabold tracking-tight text-base sm:text-lg md:text-xl text-white">${escape_html(isAuthenticated() ? "My Studios" : "Sephar Studios")}</span>`);
		$$renderer.push(`<!----></a>`);
	});
}
//#endregion
//#region src/lib/components/ui/scroll-area/scroll-area-scrollbar.svelte
function Scroll_area_scrollbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, orientation = "vertical", children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Scroll_area_scrollbar$1) {
				$$renderer.push("<!--[-->");
				Scroll_area_scrollbar$1($$renderer, spread_props([
					{
						"data-slot": "scroll-area-scrollbar",
						orientation,
						class: cn("flex touch-none p-px transition-colors select-none", orientation === "vertical" && "h-full w-2.5 border-s border-s-transparent", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							children?.($$renderer);
							$$renderer.push(`<!----> `);
							if (Scroll_area_thumb) {
								$$renderer.push("<!--[-->");
								Scroll_area_thumb($$renderer, {
									"data-slot": "scroll-area-thumb",
									class: "bg-border relative flex-1 rounded-full"
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/scroll-area/scroll-area.svelte
function Scroll_area($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, viewportRef = null, class: className, orientation = "vertical", scrollbarXClasses = "", scrollbarYClasses = "", children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Scroll_area$1) {
				$$renderer.push("<!--[-->");
				Scroll_area$1($$renderer, spread_props([
					{
						"data-slot": "scroll-area",
						class: cn("relative", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							if (Scroll_area_viewport) {
								$$renderer.push("<!--[-->");
								Scroll_area_viewport($$renderer, {
									"data-slot": "scroll-area-viewport",
									class: "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1",
									get ref() {
										return viewportRef;
									},
									set ref($$value) {
										viewportRef = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										children?.($$renderer);
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
							$$renderer.push(` `);
							if (orientation === "vertical" || orientation === "both") {
								$$renderer.push("<!--[0-->");
								Scroll_area_scrollbar($$renderer, {
									orientation: "vertical",
									class: scrollbarYClasses
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (orientation === "horizontal" || orientation === "both") {
								$$renderer.push("<!--[0-->");
								Scroll_area_scrollbar($$renderer, {
									orientation: "horizontal",
									class: scrollbarXClasses
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (Scroll_area_corner) {
								$$renderer.push("<!--[-->");
								Scroll_area_corner($$renderer, {});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			viewportRef
		});
	});
}
//#endregion
//#region src/lib/components/NotificationCenter.svelte
function NotificationCenter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open, onOpenChange } = $$props;
		Sheet($$renderer, {
			open,
			onOpenChange,
			children: ($$renderer) => {
				Sheet_content($$renderer, {
					children: ($$renderer) => {
						Sheet_header($$renderer, {
							children: ($$renderer) => {
								Sheet_title($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<!---->Notifications`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Sheet_description($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<!---->Stay updated with the latest content and features`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Scroll_area($$renderer, {
							class: "h-[calc(100vh-8rem)] pr-4",
							children: ($$renderer) => {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="flex justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`);
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/lib/components/Search.svelte
function Search_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { placeholder = "Search...", value = "" } = $$props;
		$$renderer.push(`<div class="relative w-full max-w-md"><input type="text"${attr("value", value)} class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"${attr("placeholder", placeholder)}/> <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">`);
		if (value) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="text-white/60 hover:text-white">`);
			X($$renderer, { class: "h-4 w-4" });
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Search($$renderer, { class: "h-4 w-4 text-white/60" });
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
//#region src/lib/components/widgets/User.svelte
function User($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const user = page.data.user;
		let isNotificationOpen = false;
		let isLoading = false;
		let canInstall = false;
		let deferredInstallPrompt = null;
		async function triggerInstall() {
			if (deferredInstallPrompt) {
				await deferredInstallPrompt.prompt();
				const { outcome } = await deferredInstallPrompt.userChoice;
				if (outcome === "accepted") localStorage.setItem("pwa-installed", "true");
				deferredInstallPrompt = null;
				canInstall = false;
			} else goto("/device-support#install");
		}
		function getUserInitials(user) {
			if (!user) return "U";
			if (user.name) {
				const names = user.name.split(" ");
				if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
				return names[0][0].toUpperCase();
			}
			if (user.email) return user.email[0].toUpperCase();
			return "U";
		}
		async function handleSignOut() {
			isLoading = true;
			try {
				await fetch("/api/auth/sign-out", { method: "POST" });
				window.location.href = "/";
			} catch (error) {
				console.error("Sign out error:", error);
				isLoading = false;
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex items-center gap-4">`);
			if (user) {
				$$renderer.push("<!--[0-->");
				Search_1($$renderer, {});
				$$renderer.push(`<!----> `);
				Sheet($$renderer, {
					get open() {
						return isNotificationOpen;
					},
					set open($$value) {
						isNotificationOpen = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						{
							function child($$renderer, { props }) {
								Button($$renderer, spread_props([
									{
										variant: "ghost",
										size: "icon"
									},
									props,
									{
										children: ($$renderer) => {
											Bell($$renderer, { class: "h-5 w-5" });
											$$renderer.push(`<!----> <span class="sr-only">Open notifications</span>`);
										},
										$$slots: { default: true }
									}
								]));
							}
							Sheet_trigger($$renderer, {
								child,
								$$slots: { child: true }
							});
						}
						$$renderer.push(`<!----> `);
						NotificationCenter($$renderer, {
							open: isNotificationOpen,
							onOpenChange: (val) => isNotificationOpen = val
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Dropdown_menu($$renderer, {
					children: ($$renderer) => {
						{
							function child($$renderer, { props }) {
								Button($$renderer, spread_props([
									{
										variant: "ghost",
										class: "relative h-10 w-10 rounded-full"
									},
									props,
									{
										children: ($$renderer) => {
											Avatar($$renderer, {
												class: "h-10 w-10",
												children: ($$renderer) => {
													if (user.image) {
														$$renderer.push("<!--[0-->");
														Avatar_image($$renderer, {
															src: user.image,
															alt: user.name || user.email
														});
													} else $$renderer.push("<!--[-1-->");
													$$renderer.push(`<!--]--> `);
													Avatar_fallback($$renderer, {
														class: "bg-primary text-primary-foreground",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(getUserInitials(user))}`);
														},
														$$slots: { default: true }
													});
													$$renderer.push(`<!---->`);
												},
												$$slots: { default: true }
											});
										},
										$$slots: { default: true }
									}
								]));
							}
							Dropdown_menu_trigger($$renderer, {
								child,
								$$slots: { child: true }
							});
						}
						$$renderer.push(`<!----> `);
						Dropdown_menu_content($$renderer, {
							class: "w-56 surface-glass border-white/10",
							align: "end",
							children: ($$renderer) => {
								Dropdown_menu_label($$renderer, {
									class: "font-normal",
									children: ($$renderer) => {
										$$renderer.push(`<div class="flex flex-col space-y-1">`);
										if (user.name) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-sm font-medium leading-none">${escape_html(user.name)}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <p class="text-xs leading-none text-muted-foreground">${escape_html(user.email)}</p></div>`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Dropdown_menu_separator($$renderer, {});
								$$renderer.push(`<!----> `);
								Dropdown_menu_item($$renderer, {
									onclick: () => goto("/profile"),
									children: ($$renderer) => {
										User$1($$renderer, { class: "mr-2 h-4 w-4" });
										$$renderer.push(`<!----> Profile`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Dropdown_menu_item($$renderer, {
									onclick: () => goto("/settings"),
									children: ($$renderer) => {
										Settings($$renderer, { class: "mr-2 h-4 w-4" });
										$$renderer.push(`<!----> Settings`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								if (canInstall) {
									$$renderer.push("<!--[0-->");
									Dropdown_menu_separator($$renderer, {});
									$$renderer.push(`<!----> `);
									Dropdown_menu_item($$renderer, {
										onclick: triggerInstall,
										class: "text-[#FFBF00] focus:text-[#FFBF00]",
										children: ($$renderer) => {
											Download($$renderer, { class: "mr-2 h-4 w-4" });
											$$renderer.push(`<!----> Install App`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> `);
								Dropdown_menu_separator($$renderer, {});
								$$renderer.push(`<!----> `);
								Dropdown_menu_item($$renderer, {
									onclick: handleSignOut,
									disabled: isLoading,
									children: ($$renderer) => {
										Log_out($$renderer, { class: "mr-2 h-4 w-4" });
										$$renderer.push(`<!----> ${escape_html(isLoading ? "Signing out..." : "Sign out")}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				Button($$renderer, {
					href: "/auth/login",
					variant: "ghost",
					class: "h-9",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Sign In`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					href: "/plans",
					size: "sm",
					class: "h-9 ml-4 bg-primary hover:bg-primary/90",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Get Started`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/lib/components/sections/header.svelte
function Header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const isNotificationOpen = writable(false);
		const user = derived(() => page.data.user);
		const isAuthenticated = derived(() => !!user());
		const isKidsPage = derived(() => page.url.pathname.startsWith("/kids/"));
		const navItems = [
			{
				href: "/",
				label: "Home"
			},
			{
				href: "/movies",
				label: "Movies"
			},
			{
				href: "/shows",
				label: "TV Shows"
			},
			{
				href: "/documentaries",
				label: "Documentaries"
			},
			{
				href: "/token",
				label: "STC Token"
			}
		];
		const isActive = (path) => {
			if (path === "/") return page.url.pathname === "/";
			return page.url.pathname.startsWith(path);
		};
		const navLinkClass = (path) => `relative inline-flex items-center h-9 text-sm font-medium leading-none transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#FF5E0E] after:transition-all after:duration-300 ${isActive(path) ? "after:w-full text-white" : "after:w-0 hover:after:w-full text-white/80"}`;
		if (!isKidsPage()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<header${attr_class(`transition-transform duration-300 ease-in-out sticky top-0 z-40 w-full border-b border-white/10 surface-glass `)}><div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto px-4"><div class="flex gap-6 md:gap-10 items-center">`);
			Sheet($$renderer, {
				children: ($$renderer) => {
					{
						function child($$renderer, { props }) {
							Button($$renderer, spread_props([
								{
									variant: "ghost",
									size: "icon",
									class: "md:hidden text-white/80 hover:text-white"
								},
								props,
								{
									children: ($$renderer) => {
										Menu($$renderer, { class: "h-5 w-5" });
										$$renderer.push(`<!----> <span class="sr-only">Toggle menu</span>`);
									},
									$$slots: { default: true }
								}
							]));
						}
						Sheet_trigger($$renderer, {
							child,
							$$slots: { child: true }
						});
					}
					$$renderer.push(`<!----> `);
					Sheet_content($$renderer, {
						side: "left",
						class: "p-4 space-y-4 surface-glass border-white/10",
						children: ($$renderer) => {
							$$renderer.push(`<!--[-->`);
							const each_array = ensure_array_like(navItems);
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let item = each_array[$$index];
								$$renderer.push(`<a${attr("href", item.href)} class="block text-lg font-semibold text-white/90 hover:text-white">${escape_html(item.label)}</a>`);
							}
							$$renderer.push(`<!--]--> <hr class="border-white/10"/> <a href="/kids/kiddies" class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">Kiddies</a> <a href="/kids/teens" class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">Teens</a> <a href="/archive" class="block font-semibold pl-4 text-sm text-muted-foreground">Archive Videos</a> <a href="/mayowa" class="block font-semibold pl-4 text-sm text-muted-foreground">Mayowa's Films</a> `);
							if (isAuthenticated()) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<hr class="border-white/10"/> <a href="/watchlist" class="block text-lg font-semibold text-white/90 hover:text-white">My List</a> <a href="/my-studios?tab=downloads" class="block text-lg font-semibold text-white/90 hover:text-white">Downloads</a> <a href="/my-studios?tab=recent" class="block text-lg font-semibold text-white/90 hover:text-white">Recently Watched</a> <a href="/settings" class="block text-lg font-semibold text-white/90 hover:text-white">Settings</a>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (isAuthenticated()) {
				$$renderer.push("<!--[0-->");
				MyStudiosDrawer($$renderer, {});
			} else {
				$$renderer.push("<!--[-1-->");
				Logo($$renderer, {});
			}
			$$renderer.push(`<!--]--> <nav class="hidden md:flex gap-6 items-center text-white/80"><!--[-->`);
			const each_array_1 = ensure_array_like(navItems);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let { href, label } = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", href)}${attr_class(clsx(navLinkClass(href)))}>${escape_html(label)}</a>`);
			}
			$$renderer.push(`<!--]--> <details class="relative group"><summary${attr_class(`relative inline-flex items-center h-9 leading-none cursor-pointer list-none text-sm font-medium transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#FF5E0E] after:transition-all after:duration-300 ${page.url.pathname.startsWith("/kids/") ? "after:w-full text-white" : "after:w-0 hover:after:w-full"}`)}>Kids</summary> <div class="absolute left-0 mt-2 w-48 rounded-lg z-50 surface-glass border-white/10"><a href="/kids/kiddies" class="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors">Kiddies</a> <a href="/kids/teens" class="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors">Teens</a> <hr class="my-1 border-white/10"/> <a href="/archive" class="block px-4 py-2 hover:bg-white/10 transition-colors text-sm text-muted-foreground">Archive Videos</a> <a href="/mayowa" class="block px-4 py-2 hover:bg-white/10 transition-colors text-sm text-muted-foreground">Mayowa's Films</a></div></details> `);
			if (isAuthenticated()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a href="/watchlist"${attr_class(clsx(navLinkClass("/watchlist")))}>My List</a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></nav></div> <div class="ml-auto flex items-center gap-2"><a href="/search" aria-label="Search" title="Search" class="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></a> `);
			User($$renderer, {});
			$$renderer.push(`<!----></div></div></header>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { isNotificationOpen });
	});
}
//#endregion
//#region src/lib/components/sections/footer.svelte
function Footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className = "" } = $$props;
		const links = {
			"About Us": [
				{
					label: "About",
					href: "/about"
				},
				{
					label: "Careers",
					href: "/careers"
				},
				{
					label: "Press",
					href: "/press"
				}
			],
			"Platform": [
				{
					label: "Plans & Pricing",
					href: "/plans"
				},
				{
					label: "STC Token",
					href: "/token"
				},
				{
					label: "Creator Hub",
					href: "/creator"
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
					label: "FAQ",
					href: "/faq"
				}
			],
			"Legal": [
				{
					label: "Terms of Service",
					href: "/terms"
				},
				{
					label: "Privacy Policy",
					href: "/privacy"
				},
				{
					label: "Content Guidelines",
					href: "/guidelines"
				}
			]
		};
		$$renderer.push(`<footer${attr_class(clsx(cn("border-t bg-background", className)))}><div class="container py-8 md:py-12 mx-auto px-4"><div class="grid gap-8 md:grid-cols-2 lg:grid-cols-5 items-start"><div class="flex flex-col gap-4 text-left">`);
		Logo($$renderer, {});
		$$renderer.push(`<!----> <p class="text-sm text-muted-foreground">Your trusted source for Christian content streaming.</p> <a href="/sponsorships" class="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"><strong>Get Movie Sponsorship</strong></a></div> <!--[-->`);
		const each_array = ensure_array_like(Object.entries(links));
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let [category, items] = each_array[$$index_1];
			$$renderer.push(`<div class="space-y-4 text-left justify-self-start"><h4 class="text-sm font-medium">${escape_html(category)}</h4> <ul class="space-y-2 m-0 p-0"><!--[-->`);
			const each_array_1 = ensure_array_like(items);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let item = each_array_1[$$index];
				$$renderer.push(`<li><a${attr("href", item.href)} class="text-sm text-muted-foreground hover:text-foreground transition-colors">${escape_html(item.label)}</a></li>`);
			}
			$$renderer.push(`<!--]--></ul></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-8 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"><p class="text-sm text-muted-foreground"><span>© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Sephar Studios.</span> All rights reserved.</p> <div class="flex items-center gap-4"><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg></a> <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg></a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z"></path></svg></a></div></div></div></footer>`);
	});
}
//#endregion
//#region src/routes/(app)/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="min-h-screen bg-linear-to-b from-background to-accent/10"><a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary">Skip to main content</a> `);
	Header($$renderer, {});
	$$renderer.push(`<!----> <main id="main-content" tabindex="-1" class="flex-1">`);
	children($$renderer);
	$$renderer.push(`<!----></main> `);
	Footer($$renderer, {});
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { _layout as default };
