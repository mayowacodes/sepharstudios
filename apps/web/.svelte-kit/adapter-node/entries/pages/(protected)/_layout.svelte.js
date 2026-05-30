import { $ as mergeProps, At as clsx, It as getContext, K as Portal, Rt as setContext, St as stringify, a as Tooltip$1, et as MediaQuery, ft as attributes, gt as ensure_array_like, i as Tooltip_content$1, jt as escape_html, kt as attr, mt as derived, n as Tooltip_arrow, pt as bind_props, r as Tooltip_trigger$1, t as Tooltip_provider$1, ut as attr_class, yt as spread_props } from "../../../chunks/ui-libs.js";
import { r as signOut } from "../../../chunks/auth-client.js";
import { l as House, s as getNavigation, t as Constants } from "../../../chunks/constants.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { i as Sheet_content, n as Sheet_title, o as Sheet, r as Sheet_header, s as Chevron_right, t as Sheet_description } from "../../../chunks/sheet.js";
import { t as Log_out } from "../../../chunks/log-out.js";
import { t as User } from "../../../chunks/user.js";
import { n as toast } from "../../../chunks/toast-state.svelte.js";
import { n as toggleMode } from "../../../chunks/dist.js";
import { t as page } from "../../../chunks/state.js";
import { t as cn } from "../../../chunks/utils2.js";
import { n as buttonVariants, t as Button } from "../../../chunks/button.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../chunks/avatar.js";
import { a as Dropdown_menu_group, i as Dropdown_menu_item, n as Dropdown_menu_separator, o as Dropdown_menu_content, r as Dropdown_menu_label, s as Dropdown_menu, t as Dropdown_menu_trigger } from "../../../chunks/dropdown-menu.js";
import "../../../chunks/input.js";
import { t as Separator } from "../../../chunks/separator.js";
import { a as QueryClientProvider, o as useQueryClient, r as infiniteScroll, t as getRoleBadgeVariant } from "../../../chunks/fxn.js";
import { t as Badge } from "../../../chunks/badge.js";
import { tv } from "tailwind-variants";
//#region ../../node_modules/@lucide/svelte/dist/icons/chevrons-up-down.svelte
function Chevrons_up_down($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "chevrons-up-down" },
		props,
		{ iconNode: [["path", { "d": "m7 15 5 5 5-5" }], ["path", { "d": "m7 9 5-5 5 5" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/moon.svelte
function Moon($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "moon" },
		props,
		{ iconNode: [["path", { "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/panel-left.svelte
function Panel_left($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "panel-left" },
		props,
		{ iconNode: [["rect", {
			"width": "18",
			"height": "18",
			"x": "3",
			"y": "3",
			"rx": "2"
		}], ["path", { "d": "M9 3v18" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/sun.svelte
function Sun($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "sun" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "4"
			}],
			["path", { "d": "M12 2v2" }],
			["path", { "d": "M12 20v2" }],
			["path", { "d": "m4.93 4.93 1.41 1.41" }],
			["path", { "d": "m17.66 17.66 1.41 1.41" }],
			["path", { "d": "M2 12h2" }],
			["path", { "d": "M20 12h2" }],
			["path", { "d": "m6.34 17.66-1.41 1.41" }],
			["path", { "d": "m19.07 4.93-1.41 1.41" }]
		] }
	]));
}
//#endregion
//#region src/lib/hooks/is-mobile.svelte.ts
var DEFAULT_MOBILE_BREAKPOINT = 768;
var IsMobile = class extends MediaQuery {
	constructor(breakpoint = DEFAULT_MOBILE_BREAKPOINT) {
		super(`max-width: ${breakpoint - 1}px`);
	}
};
//#endregion
//#region src/lib/components/ui/sidebar/constants.ts
var SIDEBAR_COOKIE_NAME = "sidebar:state";
var SIDEBAR_COOKIE_MAX_AGE = 3600 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
//#endregion
//#region src/lib/components/ui/sidebar/context.svelte.ts
var SidebarState = class {
	props;
	#open = derived(() => this.props.open());
	get open() {
		return this.#open();
	}
	set open($$value) {
		return this.#open($$value);
	}
	openMobile = false;
	setOpen;
	#isMobile;
	#state = derived(() => this.open ? "expanded" : "collapsed");
	get state() {
		return this.#state();
	}
	set state($$value) {
		return this.#state($$value);
	}
	constructor(props) {
		this.setOpen = props.setOpen;
		this.#isMobile = new IsMobile();
		this.props = props;
	}
	get isMobile() {
		return this.#isMobile.current;
	}
	handleShortcutKeydown = (e) => {
		if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			this.toggle();
		}
	};
	setOpenMobile = (value) => {
		this.openMobile = value;
	};
	toggle = () => {
		return this.#isMobile.current ? this.openMobile = !this.openMobile : this.setOpen(!this.open);
	};
};
var SYMBOL_KEY = "scn-sidebar";
/**
* Instantiates a new `SidebarState` instance and sets it in the context.
*
* @param props The constructor props for the `SidebarState` class.
* @returns  The `SidebarState` instance.
*/
function setSidebar(props) {
	return setContext(Symbol.for(SYMBOL_KEY), new SidebarState(props));
}
/**
* Retrieves the `SidebarState` instance from the context. This is a class instance,
* so you cannot destructure it.
* @returns The `SidebarState` instance.
*/
function useSidebar() {
	return getContext(Symbol.for(SYMBOL_KEY));
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-content.svelte
function Sidebar_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "sidebar-content",
			"data-sidebar": "content",
			class: clsx(cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-footer.svelte
function Sidebar_footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "sidebar-footer",
			"data-sidebar": "footer",
			class: clsx(cn("flex flex-col gap-2 p-2", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-group-label.svelte
function Sidebar_group_label($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, children, child, class: className, $$slots, $$events, ...restProps } = $$props;
		const mergedProps = derived(() => ({
			class: cn("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
			"data-slot": "sidebar-group-label",
			"data-sidebar": "group-label",
			...restProps
		}));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-group.svelte
function Sidebar_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "sidebar-group",
			"data-sidebar": "group",
			class: clsx(cn("relative flex w-full min-w-0 flex-col p-2", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-header.svelte
function Sidebar_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "sidebar-header",
			"data-sidebar": "header",
			class: clsx(cn("flex flex-col gap-2 p-2", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-inset.svelte
function Sidebar_inset($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<main${attributes({
			"data-slot": "sidebar-inset",
			class: clsx(cn("bg-background relative flex w-full flex-1 flex-col", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></main>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/tooltip/tooltip.svelte
function Tooltip($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tooltip$1) {
				$$renderer.push("<!--[-->");
				Tooltip$1($$renderer, spread_props([restProps, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					}
				}]));
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
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/components/ui/tooltip/tooltip-trigger.svelte
function Tooltip_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tooltip_trigger$1) {
				$$renderer.push("<!--[-->");
				Tooltip_trigger$1($$renderer, spread_props([
					{ "data-slot": "tooltip-trigger" },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
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
//#region src/lib/components/ui/tooltip/tooltip-portal.svelte
function Tooltip_portal($$renderer, $$props) {
	let { $$slots, $$events, ...restProps } = $$props;
	if (Portal) {
		$$renderer.push("<!--[-->");
		Portal($$renderer, spread_props([restProps]));
		$$renderer.push("<!--]-->");
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push("<!--]-->");
	}
}
//#endregion
//#region src/lib/components/ui/tooltip/tooltip-content.svelte
function Tooltip_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, sideOffset = 0, side = "top", children, arrowClasses, portalProps, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Tooltip_portal($$renderer, spread_props([portalProps, {
				children: ($$renderer) => {
					if (Tooltip_content$1) {
						$$renderer.push("<!--[-->");
						Tooltip_content$1($$renderer, spread_props([
							{
								"data-slot": "tooltip-content",
								sideOffset,
								side,
								class: cn("bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--bits-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className)
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
									{
										function child($$renderer, { props }) {
											$$renderer.push(`<div${attributes({
												class: clsx(cn("bg-primary z-50 size-2.5 rotate-45 rounded-[2px]", "data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%_+_2px)]", "data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%_+_1px)]", "data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=right]:translate-y-1/2", "data-[side=left]:-translate-y-[calc(50%_-_3px)]", arrowClasses)),
												...props
											})}></div>`);
										}
										if (Tooltip_arrow) {
											$$renderer.push("<!--[-->");
											Tooltip_arrow($$renderer, {
												child,
												$$slots: { child: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
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
				},
				$$slots: { default: true }
			}]));
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
//#region src/lib/components/ui/tooltip/tooltip-provider.svelte
function Tooltip_provider($$renderer, $$props) {
	let { $$slots, $$events, ...restProps } = $$props;
	if (Tooltip_provider$1) {
		$$renderer.push("<!--[-->");
		Tooltip_provider$1($$renderer, spread_props([restProps]));
		$$renderer.push("<!--]-->");
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push("<!--]-->");
	}
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-menu-button.svelte
var sidebarMenuButtonVariants = tv({
	base: "peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Sidebar_menu_button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, child, variant = "default", size = "default", isActive = false, tooltipContent, tooltipContentProps, $$slots, $$events, ...restProps } = $$props;
		const sidebar = useSidebar();
		const buttonProps = derived(() => ({
			class: cn(sidebarMenuButtonVariants({
				variant,
				size
			}), className),
			"data-slot": "sidebar-menu-button",
			"data-sidebar": "menu-button",
			"data-size": size,
			"data-active": isActive,
			...restProps
		}));
		function Button($$renderer, { props }) {
			const mergedProps = mergeProps(buttonProps(), props);
			if (child) {
				$$renderer.push("<!--[0-->");
				child($$renderer, { props: mergedProps });
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button${attributes({ ...mergedProps })}>`);
				children?.($$renderer);
				$$renderer.push(`<!----></button>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		if (!tooltipContent) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {});
		} else {
			$$renderer.push("<!--[-1-->");
			if (Tooltip) {
				$$renderer.push("<!--[-->");
				Tooltip($$renderer, {
					children: ($$renderer) => {
						{
							function child($$renderer, { props }) {
								Button($$renderer, { props });
							}
							if (Tooltip_trigger) {
								$$renderer.push("<!--[-->");
								Tooltip_trigger($$renderer, {
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
						if (Tooltip_content) {
							$$renderer.push("<!--[-->");
							Tooltip_content($$renderer, spread_props([
								{
									side: "right",
									align: "center",
									hidden: sidebar.state !== "collapsed" || sidebar.isMobile
								},
								tooltipContentProps,
								{
									children: ($$renderer) => {
										if (typeof tooltipContent === "string") {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`${escape_html(tooltipContent)}`);
										} else if (tooltipContent) {
											$$renderer.push("<!--[1-->");
											tooltipContent($$renderer);
											$$renderer.push(`<!---->`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]-->`);
									},
									$$slots: { default: true }
								}
							]));
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
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-menu-item.svelte
function Sidebar_menu_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<li${attributes({
			"data-slot": "sidebar-menu-item",
			"data-sidebar": "menu-item",
			class: clsx(cn("group/menu-item relative", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></li>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-menu.svelte
function Sidebar_menu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<ul${attributes({
			"data-slot": "sidebar-menu",
			"data-sidebar": "menu",
			class: clsx(cn("flex w-full min-w-0 flex-col gap-1", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></ul>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-provider.svelte
function Sidebar_provider($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, open = true, onOpenChange = () => {}, class: className, style, children, $$slots, $$events, ...restProps } = $$props;
		setSidebar({
			open: () => open,
			setOpen: (value) => {
				open = value;
				onOpenChange(value);
				document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
			}
		});
		if (Tooltip_provider) {
			$$renderer.push("<!--[-->");
			Tooltip_provider($$renderer, {
				delayDuration: 0,
				children: ($$renderer) => {
					$$renderer.push(`<div${attributes({
						"data-slot": "sidebar-wrapper",
						style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH)}; --sidebar-width-icon: ${stringify(SIDEBAR_WIDTH_ICON)}; ${stringify(style)}`,
						class: clsx(cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)),
						...restProps
					})}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		bind_props($$props, {
			ref,
			open
		});
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-rail.svelte
function Sidebar_rail($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		useSidebar();
		$$renderer.push(`<button${attributes({
			"data-sidebar": "rail",
			"data-slot": "sidebar-rail",
			"aria-label": "Toggle Sidebar",
			tabindex: -1,
			title: "Toggle Sidebar",
			class: clsx(cn("hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-[calc(1/2*100%-1px)] after:w-[2px] sm:flex", "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full", "[[data-side=left][data-collapsible=offcanvas]_&]:-end-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-start-2", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></button>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar-trigger.svelte
function Sidebar_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, onclick, $$slots, $$events, ...restProps } = $$props;
		const sidebar = useSidebar();
		Button($$renderer, spread_props([
			{
				"data-sidebar": "trigger",
				"data-slot": "sidebar-trigger",
				variant: "ghost",
				size: "icon",
				class: cn("size-7", className),
				type: "button",
				onclick: (e) => {
					onclick?.(e);
					sidebar.toggle();
				}
			},
			restProps,
			{
				children: ($$renderer) => {
					Panel_left($$renderer, {});
					$$renderer.push(`<!----> <span class="sr-only">Toggle Sidebar</span>`);
				},
				$$slots: { default: true }
			}
		]));
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/sidebar/sidebar.svelte
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, side = "left", variant = "sidebar", collapsible = "offcanvas", class: className, children, $$slots, $$events, ...restProps } = $$props;
		const sidebar = useSidebar();
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (collapsible === "none") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attributes({
					class: clsx(cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)),
					...restProps
				})}>`);
				children?.($$renderer);
				$$renderer.push(`<!----></div>`);
			} else if (sidebar.isMobile) {
				$$renderer.push("<!--[1-->");
				var bind_get = () => sidebar.openMobile;
				var bind_set = (v) => sidebar.setOpenMobile(v);
				if (Sheet) {
					$$renderer.push("<!--[-->");
					Sheet($$renderer, spread_props([
						{
							get open() {
								return bind_get();
							},
							set open($$value) {
								bind_set($$value);
							}
						},
						restProps,
						{
							children: ($$renderer) => {
								if (Sheet_content) {
									$$renderer.push("<!--[-->");
									Sheet_content($$renderer, {
										"data-sidebar": "sidebar",
										"data-slot": "sidebar",
										"data-mobile": "true",
										class: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
										style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH_MOBILE)};`,
										side,
										children: ($$renderer) => {
											if (Sheet_header) {
												$$renderer.push("<!--[-->");
												Sheet_header($$renderer, {
													class: "sr-only",
													children: ($$renderer) => {
														if (Sheet_title) {
															$$renderer.push("<!--[-->");
															Sheet_title($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Sidebar`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Sheet_description) {
															$$renderer.push("<!--[-->");
															Sheet_description($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Displays the mobile sidebar.`);
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
											$$renderer.push(` <div class="flex h-full w-full flex-col">`);
											children?.($$renderer);
											$$renderer.push(`<!----></div>`);
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
						}
					]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="text-sidebar-foreground group peer hidden md:block"${attr("data-state", sidebar.state)}${attr("data-collapsible", sidebar.state === "collapsed" ? collapsible : "")}${attr("data-variant", variant)}${attr("data-side", side)} data-slot="sidebar"><div data-slot="sidebar-gap"${attr_class(clsx(cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")))}></div> <div${attributes({
					"data-slot": "sidebar-container",
					class: clsx(cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "start-0 group-data-[collapsible=offcanvas]:start-[calc(var(--sidebar-width)*-1)]" : "end-0 group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s", className)),
					...restProps
				})}><div data-sidebar="sidebar" data-slot="sidebar-inner" class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">`);
				children?.($$renderer);
				$$renderer.push(`<!----></div></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
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
//#region src/lib/components/nav-main.svelte
function Nav_main($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const user = page.data.user;
		let { items } = $$props;
		if (Sidebar_group) {
			$$renderer.push("<!--[-->");
			Sidebar_group($$renderer, {
				children: ($$renderer) => {
					if (Sidebar_group_label) {
						$$renderer.push("<!--[-->");
						Sidebar_group_label($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<!---->Platform`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Sidebar_menu) {
						$$renderer.push("<!--[-->");
						Sidebar_menu($$renderer, {
							class: "flex flex-col gap-1",
							children: ($$renderer) => {
								$$renderer.push(`<!--[-->`);
								const each_array = ensure_array_like(items);
								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
									let item = each_array[$$index];
									if (item.roles.includes(user.role)) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<a class="cursor-pointer"${attr("href", item.url)}>`);
										if (Sidebar_menu_item) {
											$$renderer.push("<!--[-->");
											Sidebar_menu_item($$renderer, {
												children: ($$renderer) => {
													if (Sidebar_menu_button) {
														$$renderer.push("<!--[-->");
														Sidebar_menu_button($$renderer, {
															class: cn(buttonVariants({ variant: item.isActive ? "outline" : "ghost" }), "justify-start cursor-pointer hover:text-current"),
															children: ($$renderer) => {
																if (item.icon) {
																	$$renderer.push("<!--[-->");
																	item.icon($$renderer, {});
																	$$renderer.push("<!--]-->");
																} else {
																	$$renderer.push("<!--[!-->");
																	$$renderer.push("<!--]-->");
																}
																$$renderer.push(` <span>${escape_html(item.title)}</span>`);
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
										$$renderer.push(`</a>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								}
								$$renderer.push(`<!--]-->`);
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
	});
}
//#endregion
//#region src/lib/components/nav-user.svelte
function Nav_user($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user } = $$props;
		const sidebar = useSidebar();
		const navItems = getNavigation(page.url.pathname);
		async function signOut() {
			try {
				await fetch("/api/auth/sign-out", { method: "POST" });
			} catch (err) {
				console.error("Sign out failed:", err);
			} finally {
				location.href = "/";
			}
		}
		if (Sidebar_menu) {
			$$renderer.push("<!--[-->");
			Sidebar_menu($$renderer, {
				children: ($$renderer) => {
					if (Sidebar_menu_item) {
						$$renderer.push("<!--[-->");
						Sidebar_menu_item($$renderer, {
							children: ($$renderer) => {
								if (Dropdown_menu) {
									$$renderer.push("<!--[-->");
									Dropdown_menu($$renderer, {
										children: ($$renderer) => {
											{
												function child($$renderer, { props }) {
													if (Sidebar_menu_button) {
														$$renderer.push("<!--[-->");
														Sidebar_menu_button($$renderer, spread_props([
															{
																size: "lg",
																class: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
															},
															props,
															{
																children: ($$renderer) => {
																	if (Avatar) {
																		$$renderer.push("<!--[-->");
																		Avatar($$renderer, {
																			class: "size-8 rounded-lg",
																			children: ($$renderer) => {
																				if (Avatar_image) {
																					$$renderer.push("<!--[-->");
																					Avatar_image($$renderer, {
																						src: user.image,
																						alt: user.name
																					});
																					$$renderer.push("<!--]-->");
																				} else {
																					$$renderer.push("<!--[!-->");
																					$$renderer.push("<!--]-->");
																				}
																				$$renderer.push(` `);
																				if (Avatar_fallback) {
																					$$renderer.push("<!--[-->");
																					Avatar_fallback($$renderer, {
																						class: "rounded-lg",
																						children: ($$renderer) => {
																							$$renderer.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
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
																	$$renderer.push(` <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium">${escape_html(user.name)}</span> <span class="truncate text-xs">${escape_html(user.email)}</span></div> `);
																	Chevrons_up_down($$renderer, { class: "ml-auto size-4" });
																	$$renderer.push(`<!---->`);
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
													class: "w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg",
													side: sidebar.isMobile ? "bottom" : "right",
													align: "end",
													sideOffset: 4,
													children: ($$renderer) => {
														if (Dropdown_menu_label) {
															$$renderer.push("<!--[-->");
															Dropdown_menu_label($$renderer, {
																class: "p-0 font-normal",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">`);
																	if (Avatar) {
																		$$renderer.push("<!--[-->");
																		Avatar($$renderer, {
																			class: "size-8 rounded-lg",
																			children: ($$renderer) => {
																				if (Avatar_image) {
																					$$renderer.push("<!--[-->");
																					Avatar_image($$renderer, {
																						src: user.image,
																						alt: user.name
																					});
																					$$renderer.push("<!--]-->");
																				} else {
																					$$renderer.push("<!--[!-->");
																					$$renderer.push("<!--]-->");
																				}
																				$$renderer.push(` `);
																				if (Avatar_fallback) {
																					$$renderer.push("<!--[-->");
																					Avatar_fallback($$renderer, {
																						class: "rounded-lg",
																						children: ($$renderer) => {
																							$$renderer.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
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
																	$$renderer.push(` <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium">${escape_html(user.name)}</span> <span class="truncate text-xs">${escape_html(user.email)}</span></div></div>`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Dropdown_menu_separator) {
															$$renderer.push("<!--[-->");
															Dropdown_menu_separator($$renderer, {});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Dropdown_menu_group) {
															$$renderer.push("<!--[-->");
															Dropdown_menu_group($$renderer, {
																class: "flex flex-col gap-1",
																children: ($$renderer) => {
																	if (Dropdown_menu_item) {
																		$$renderer.push("<!--[-->");
																		Dropdown_menu_item($$renderer, {
																			class: "cursor-pointer",
																			onclick: () => location.href = "/",
																			children: ($$renderer) => {
																				House($$renderer, {});
																				$$renderer.push(`<!---->Home`);
																			},
																			$$slots: { default: true }
																		});
																		$$renderer.push("<!--]-->");
																	} else {
																		$$renderer.push("<!--[!-->");
																		$$renderer.push("<!--]-->");
																	}
																	$$renderer.push(` <!--[-->`);
																	const each_array = ensure_array_like(navItems.navMain);
																	for (let i = 0, $$length = each_array.length; i < $$length; i++) {
																		let item = each_array[i];
																		if (item.roles.includes(user.role)) {
																			$$renderer.push("<!--[0-->");
																			if (Dropdown_menu_item) {
																				$$renderer.push("<!--[-->");
																				Dropdown_menu_item($$renderer, {
																					class: cn(buttonVariants({ variant: item.isActive ? "outline" : "ghost" }), "cursor-pointer justify-start"),
																					onclick: () => location.href = item.url,
																					children: ($$renderer) => {
																						if (item.icon) {
																							$$renderer.push("<!--[-->");
																							item.icon($$renderer, {});
																							$$renderer.push("<!--]-->");
																						} else {
																							$$renderer.push("<!--[!-->");
																							$$renderer.push("<!--]-->");
																						}
																						$$renderer.push(`${escape_html(item.title)}`);
																					},
																					$$slots: { default: true }
																				});
																				$$renderer.push("<!--]-->");
																			} else {
																				$$renderer.push("<!--[!-->");
																				$$renderer.push("<!--]-->");
																			}
																		} else $$renderer.push("<!--[-1-->");
																		$$renderer.push(`<!--]-->`);
																	}
																	$$renderer.push(`<!--]-->`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Dropdown_menu_separator) {
															$$renderer.push("<!--[-->");
															Dropdown_menu_separator($$renderer, {});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Dropdown_menu_item) {
															$$renderer.push("<!--[-->");
															Dropdown_menu_item($$renderer, {
																onclick: signOut,
																children: ($$renderer) => {
																	Log_out($$renderer, {});
																	$$renderer.push(`<!---->Log out`);
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
	});
}
//#endregion
//#region src/lib/components/team-switcher.svelte
function Team_switcher($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { teams } = $$props;
		useSidebar();
		let activeTeam = teams[0];
		if (Sidebar_menu) {
			$$renderer.push("<!--[-->");
			Sidebar_menu($$renderer, {
				children: ($$renderer) => {
					if (Sidebar_menu_item) {
						$$renderer.push("<!--[-->");
						Sidebar_menu_item($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<a href="/">`);
								if (Sidebar_menu_button) {
									$$renderer.push("<!--[-->");
									Sidebar_menu_button($$renderer, {
										size: "lg",
										class: "cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">`);
											if (activeTeam.logo) {
												$$renderer.push("<!--[-->");
												activeTeam.logo($$renderer, {
													class: "size-4",
													type: "normal"
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(`</div> <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium">${escape_html(activeTeam.name)}</span> <span class="truncate text-xs">${escape_html(activeTeam.plan)}</span></div> `);
											House($$renderer, { class: "ml-auto" });
											$$renderer.push(`<!---->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(`</a>`);
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
	});
}
//#endregion
//#region src/lib/components/app-sidebar.svelte
function App_sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, collapsible = "icon", $$slots, $$events, ...restProps } = $$props;
		const data = getNavigation(page.url.pathname);
		const user = page.data.user;
		if (Sidebar) {
			$$renderer.push("<!--[-->");
			Sidebar($$renderer, spread_props([
				{ collapsible },
				restProps,
				{
					children: ($$renderer) => {
						if (Sidebar_header) {
							$$renderer.push("<!--[-->");
							Sidebar_header($$renderer, {
								children: ($$renderer) => {
									Team_switcher($$renderer, { teams: data.teams });
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Sidebar_content) {
							$$renderer.push("<!--[-->");
							Sidebar_content($$renderer, {
								children: ($$renderer) => {
									Nav_main($$renderer, { items: data.navMain });
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Sidebar_footer) {
							$$renderer.push("<!--[-->");
							Sidebar_footer($$renderer, {
								children: ($$renderer) => {
									Nav_user($$renderer, { user });
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Sidebar_rail) {
							$$renderer.push("<!--[-->");
							Sidebar_rail($$renderer, {});
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
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/widgets/ModeToggle.svelte
function ModeToggle($$renderer) {
	Button($$renderer, {
		onclick: toggleMode,
		variant: "ghost",
		size: "icon",
		class: "h-9 w-9 rounded-full transition-colors hover:bg-muted",
		children: ($$renderer) => {
			Sun($$renderer, { class: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" });
			$$renderer.push(`<!----> `);
			Moon($$renderer, { class: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" });
			$$renderer.push(`<!----> <span class="sr-only">Toggle theme</span>`);
		},
		$$slots: { default: true }
	});
}
//#endregion
//#region src/lib/components/ui/breadcrumb/breadcrumb.svelte
function Breadcrumb($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<nav${attributes({
			"data-slot": "breadcrumb",
			class: clsx(className),
			"aria-label": "breadcrumb",
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></nav>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/breadcrumb/breadcrumb-item.svelte
function Breadcrumb_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<li${attributes({
			"data-slot": "breadcrumb-item",
			class: clsx(cn("inline-flex items-center gap-1.5", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></li>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/breadcrumb/breadcrumb-separator.svelte
function Breadcrumb_separator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<li${attributes({
			"data-slot": "breadcrumb-separator",
			role: "presentation",
			"aria-hidden": "true",
			class: clsx(cn("[&>svg]:size-3.5", className)),
			...restProps
		})}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			Chevron_right($$renderer, {});
		}
		$$renderer.push(`<!--]--></li>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/breadcrumb/breadcrumb-link.svelte
function Breadcrumb_link($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, href = void 0, child, children, $$slots, $$events, ...restProps } = $$props;
		const attrs = derived(() => ({
			"data-slot": "breadcrumb-link",
			class: cn("hover:text-foreground transition-colors", className),
			href,
			...restProps
		}));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: attrs() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<a${attributes({ ...attrs() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></a>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/breadcrumb/breadcrumb-list.svelte
function Breadcrumb_list($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<ol${attributes({
			"data-slot": "breadcrumb-list",
			class: clsx(cn("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></ol>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/crumb-path/crumb-path.svelte
function Crumb_path($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const getBreadcrumbs = (url) => {
			const segments = url.pathname.split("/").filter(Boolean);
			return segments.map((segment, index) => {
				return {
					name: segment,
					path: "/" + segments.slice(0, index + 1).join("/")
				};
			});
		};
		let breadcrumbs = getBreadcrumbs(page.url);
		if (Breadcrumb) {
			$$renderer.push("<!--[-->");
			Breadcrumb($$renderer, {
				children: ($$renderer) => {
					if (Breadcrumb_list) {
						$$renderer.push("<!--[-->");
						Breadcrumb_list($$renderer, {
							class: "items-center",
							children: ($$renderer) => {
								$$renderer.push(`<!--[-->`);
								const each_array = ensure_array_like(breadcrumbs);
								for (let i = 0, $$length = each_array.length; i < $$length; i++) {
									let { name, path } = each_array[i];
									if (Breadcrumb_item) {
										$$renderer.push("<!--[-->");
										Breadcrumb_item($$renderer, {
											class: i < breadcrumbs.length - 1 ? "hidden md:block" : "",
											children: ($$renderer) => {
												if (Breadcrumb_link) {
													$$renderer.push("<!--[-->");
													Breadcrumb_link($$renderer, {
														href: path,
														class: "capitalize max-w-20 line-clamp-1",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(name.replace(/-/g, " "))}`);
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
									$$renderer.push(` `);
									if (i < breadcrumbs.length - 1) {
										$$renderer.push("<!--[0-->");
										if (Breadcrumb_separator) {
											$$renderer.push("<!--[-->");
											Breadcrumb_separator($$renderer, { class: "hidden md:block -mb-0.5" });
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								}
								$$renderer.push(`<!--]-->`);
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
	});
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query-devtools/dist/Devtools.svelte
function Devtools($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Set this true if you want the dev tools to default to being open
		*/
		/**
		* The position of the TanStack logo to open and close the devtools panel.
		* 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'relative'
		* Defaults to 'bottom-right'.
		*/
		/**
		* The position of the Svelte Query devtools panel.
		* 'top' | 'bottom' | 'left' | 'right'
		* Defaults to 'bottom'.
		*/
		/**
		* Custom instance of QueryClient
		*/
		/**
		* Use this so you can define custom errors that can be shown in the devtools.
		*/
		/**
		* Use this to pass a nonce to the style tag that is added to the document head. This is useful if you are using a Content Security Policy (CSP) nonce to allow inline styles.
		*/
		/**
		* Use this so you can attach the devtool's styles to specific element in the DOM.
		*/
		/**
		* Set this to true to hide disabled queries from the devtools panel.
		*/
		let { initialIsOpen = false, buttonPosition = "bottom-right", position = "bottom", client = useQueryClient(), errorTypes = [], styleNonce = void 0, shadowDOMTarget = void 0, hideDisabledQueries = false } = $$props;
		$$renderer.push(`<div class="tsqd-parent-container"></div>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/user/logged-in.svelte
function Logged_in($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, class: className } = $$props;
		const logout = async () => {
			await signOut({ fetchOptions: {
				onError: (ctx) => {
					toast.error("Error Alert", { description: ctx.error.message });
				},
				onSuccess: () => {
					toast.success("Success Alert", { description: "Successfully signed out" });
					location.href = "/";
				}
			} });
		};
		const profile = () => {
			location.href = "/profile";
		};
		if (Dropdown_menu) {
			$$renderer.push("<!--[-->");
			Dropdown_menu($$renderer, {
				children: ($$renderer) => {
					if (Dropdown_menu_trigger) {
						$$renderer.push("<!--[-->");
						Dropdown_menu_trigger($$renderer, {
							class: cn(buttonVariants({
								variant: "outline",
								size: "icon"
							}), "cursor-pointer rounded-lg border-none outline-none", className),
							children: ($$renderer) => {
								if (Avatar) {
									$$renderer.push("<!--[-->");
									Avatar($$renderer, {
										class: "size-9 rounded-lg",
										children: ($$renderer) => {
											if (Avatar_image) {
												$$renderer.push("<!--[-->");
												Avatar_image($$renderer, {
													class: "rounded-lg",
													src: user.image,
													alt: user.name
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` `);
											if (Avatar_fallback) {
												$$renderer.push("<!--[-->");
												Avatar_fallback($$renderer, {
													class: "rounded-lg uppercase",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
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
					$$renderer.push(` `);
					if (Dropdown_menu_content) {
						$$renderer.push("<!--[-->");
						Dropdown_menu_content($$renderer, {
							class: "w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg",
							align: "end",
							sideOffset: 4,
							children: ($$renderer) => {
								if (Dropdown_menu_label) {
									$$renderer.push("<!--[-->");
									Dropdown_menu_label($$renderer, {
										class: "p-0 font-normal",
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">`);
											if (Avatar) {
												$$renderer.push("<!--[-->");
												Avatar($$renderer, {
													class: "size-8 rounded-lg",
													children: ($$renderer) => {
														if (Avatar_image) {
															$$renderer.push("<!--[-->");
															Avatar_image($$renderer, {
																src: user.image,
																alt: user.name
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Avatar_fallback) {
															$$renderer.push("<!--[-->");
															Avatar_fallback($$renderer, {
																class: "rounded-lg uppercase",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(user.name.slice(0, 2))}`);
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
											$$renderer.push(` <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium">${escape_html(user.name)}</span> <span class="truncate text-xs">${escape_html(user.email)}</span></div></div>`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` <div class="px-2 py-1.5 text-sm"><div class="flex items-center gap-2 mb-1"><span class="text-muted-foreground">Role:</span> `);
								Badge($$renderer, {
									class: "text-xs capitalize",
									variant: getRoleBadgeVariant(user.role),
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(user.role)}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----></div></div> `);
								if (Dropdown_menu_separator) {
									$$renderer.push("<!--[-->");
									Dropdown_menu_separator($$renderer, {});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Dropdown_menu_item) {
									$$renderer.push("<!--[-->");
									Dropdown_menu_item($$renderer, {
										class: "cursor-pointer",
										onclick: profile,
										children: ($$renderer) => {
											User($$renderer, {});
											$$renderer.push(`<!---->Profile`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Dropdown_menu_separator) {
									$$renderer.push("<!--[-->");
									Dropdown_menu_separator($$renderer, {});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Dropdown_menu_item) {
									$$renderer.push("<!--[-->");
									Dropdown_menu_item($$renderer, {
										class: "cursor-pointer",
										onclick: logout,
										children: ($$renderer) => {
											Log_out($$renderer, {});
											$$renderer.push(`<!---->Log out`);
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
	});
}
//#endregion
//#region src/lib/authentication/ui/user/auth-dialog.svelte
function Auth_dialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const user = page.data.user;
		if (user) {
			$$renderer.push("<!--[0-->");
			Logged_in($$renderer, { user });
		} else {
			$$renderer.push("<!--[-1-->");
			Button($$renderer, {
				href: `/auth/login?redirectTo=${Constants.AFTERAUTH}`,
				variant: "outline",
				class: "relative cursor-pointer rounded-lg p-0",
				size: "icon",
				children: ($$renderer) => {
					User($$renderer, { class: "size-4" });
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/billing/TrialBanner.svelte
function TrialBanner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/widgets/AchievementToast.svelte
function AchievementToast($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { achievement, onDismiss } = $$props;
		$$renderer.push(`<div${attr_class(`fixed bottom-6 right-6 z-50 transition-all duration-300 translate-y-8 opacity-0`)}><div class="bg-[#1a1a2e] border border-[#FFBF00]/40 rounded-2xl p-4 shadow-2xl shadow-black/60 max-w-xs flex items-start gap-3"><div class="w-12 h-12 rounded-full bg-[#FFBF00]/15 flex items-center justify-center text-2xl shrink-0">${escape_html(achievement.icon ?? "🏆")}</div> <div class="min-w-0"><div class="text-xs text-[#FFBF00] font-semibold uppercase tracking-wider mb-0.5">Achievement Unlocked!</div> <div class="text-white font-bold text-sm">${escape_html(achievement.name)}</div> `);
		if (achievement.stcReward > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-[#FFBF00] text-xs mt-0.5">+${escape_html(achievement.stcReward)} STC earned</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <button class="text-gray-500 hover:text-white shrink-0 transition-colors" aria-label="Dismiss">✕</button></div></div>`);
	});
}
//#endregion
//#region src/routes/(protected)/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		let achievementQueue = [];
		const currentAchievement = derived(() => achievementQueue[0] ?? null);
		function dismissAchievement() {
			achievementQueue = achievementQueue.slice(1);
		}
		$$renderer.push(`<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary">Skip to main content</a> `);
		if (Sidebar_provider) {
			$$renderer.push("<!--[-->");
			Sidebar_provider($$renderer, {
				children: ($$renderer) => {
					App_sidebar($$renderer, {});
					$$renderer.push(`<!----> `);
					if (Sidebar_inset) {
						$$renderer.push("<!--[-->");
						Sidebar_inset($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<header class="sticky top-0 left-0 z-1 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"><div class="flex items-center gap-2 px-4">`);
								if (Sidebar_trigger) {
									$$renderer.push("<!--[-->");
									Sidebar_trigger($$renderer, { class: "-ml-1" });
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								Separator($$renderer, {
									orientation: "vertical",
									class: "mr-2 data-[orientation=vertical]:h-4"
								});
								$$renderer.push(`<!----> `);
								Crumb_path($$renderer, {});
								$$renderer.push(`<!----></div> <div class="flex items-center gap-2 pr-4">`);
								ModeToggle($$renderer, {});
								$$renderer.push(`<!----> `);
								Auth_dialog($$renderer, {});
								$$renderer.push(`<!----></div></header> `);
								TrialBanner($$renderer, {});
								$$renderer.push(`<!----> <main id="main-content" tabindex="-1" class="flex flex-1 flex-col gap-4 p-4 py-0 animate-in">`);
								QueryClientProvider($$renderer, {
									client: infiniteScroll.queryClient,
									children: ($$renderer) => {
										children($$renderer);
										$$renderer.push(`<!----> `);
										Devtools($$renderer, {});
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----></main>`);
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
		$$renderer.push(` `);
		if (currentAchievement()) {
			$$renderer.push("<!--[0-->");
			AchievementToast($$renderer, {
				achievement: currentAchievement(),
				onDismiss: dismissAchievement
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _layout as default };
