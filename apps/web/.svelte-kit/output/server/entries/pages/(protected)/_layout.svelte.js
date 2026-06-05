import { Dt as spread_props, Lt as attr, Rt as clsx, St as derived, bt as attributes, vt as attr_class, wt as ensure_array_like, xt as bind_props, zt as escape_html } from "../../../chunks/ui-libs.js";
import { s as getNavigation, t as Constants } from "../../../chunks/constants.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Chevron_right } from "../../../chunks/chevron-right.js";
import { t as House } from "../../../chunks/house.js";
import { t as Log_out } from "../../../chunks/log-out.js";
import { _ as Moon, a as Sidebar_menu, c as Sidebar_inset, d as Sidebar_group_label, g as Sun, h as useSidebar, i as Sidebar_provider, l as Sidebar_header, m as Sidebar_content, n as Sidebar_trigger, o as Sidebar_menu_item, p as Sidebar_footer, r as Sidebar_rail, s as Sidebar_menu_button, t as Sidebar, u as Sidebar_group } from "../../../chunks/sidebar.js";
import { t as User } from "../../../chunks/user.js";
import { r as signOut } from "../../../chunks/auth-client.js";
import { n as toast } from "../../../chunks/toast-state.svelte.js";
import { i as toggleMode } from "../../../chunks/dist.js";
import { t as page } from "../../../chunks/state.js";
import { t as cn } from "../../../chunks/utils2.js";
import { t as Separator } from "../../../chunks/separator.js";
import { n as buttonVariants, t as Button } from "../../../chunks/button.js";
import { a as Dropdown_menu_label, c as Dropdown_menu_content, i as Dropdown_menu_separator, o as Dropdown_menu_item, r as Dropdown_menu_trigger, s as Dropdown_menu_group, u as Dropdown_menu } from "../../../chunks/dropdown-menu.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../chunks/avatar.js";
import { a as QueryClientProvider, o as useQueryClient, r as infiniteScroll, t as getRoleBadgeVariant } from "../../../chunks/fxn.js";
import { t as Badge } from "../../../chunks/badge.js";
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
