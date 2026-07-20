import { Et as derived, G as Select_scroll_down_button$1, J as Select_item$1, K as Select_viewport, Ot as ensure_array_like, St as attr_class, Tt as bind_props, Ut as clsx, W as Select_scroll_up_button$1, Wt as escape_html, Y as Select_content$1, d as Select$1, gt as on, it as Portal, jt as spread_props, mt as createSubscriber, q as Select_group$1, u as Select_trigger$1, wt as attributes } from "../../../../chunks/ui-libs.js";
import { a as adminRoles } from "../../../../chunks/constants.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Calendar } from "../../../../chunks/calendar.js";
import { t as Check } from "../../../../chunks/check.js";
import { t as Chevron_down } from "../../../../chunks/chevron-down.js";
import { t as Circle_alert } from "../../../../chunks/circle-alert.js";
import { t as Loader_circle } from "../../../../chunks/loader-circle.js";
import { t as Search } from "../../../../chunks/search.js";
import { t as Trash_2 } from "../../../../chunks/trash-2.js";
import { t as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { t as User } from "../../../../chunks/user.js";
import { t as Users } from "../../../../chunks/users.js";
import { t as admin } from "../../../../chunks/auth-client.js";
import { n as toast } from "../../../../chunks/toast-state.svelte.js";
import { t as page } from "../../../../chunks/state.js";
import { t as cn } from "../../../../chunks/utils2.js";
import { t as Input } from "../../../../chunks/input.js";
import "../../../../chunks/separator.js";
import { t as Button } from "../../../../chunks/button.js";
import { a as Dialog_footer, i as Dialog_header, n as Dialog_description, o as Dialog_title, r as Dialog_content, s as Dialog } from "../../../../chunks/dialog.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../../chunks/avatar.js";
import { n as roles, r as infiniteScroll, t as getRoleBadgeVariant } from "../../../../chunks/fxn.js";
import { t as Badge } from "../../../../chunks/badge.js";
import { t as Label } from "../../../../chunks/label.js";
import { t as Loading_spinner } from "../../../../chunks/loading-spinner.js";
import { tv } from "tailwind-variants";
//#region ../../node_modules/@lucide/svelte/dist/icons/chevron-up.svelte
function Chevron_up($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "chevron-up" },
		props,
		{ iconNode: [["path", { "d": "m18 15-6-6-6 6" }]] }
	]));
}
//#endregion
//#region src/lib/components/ui/select/select.svelte
function Select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, value = void 0, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Select$1) {
				$$renderer.push("<!--[-->");
				Select$1($$renderer, spread_props([restProps, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					get value() {
						return value;
					},
					set value($$value) {
						value = $$value;
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
		bind_props($$props, {
			open,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/select/select-group.svelte
function Select_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Select_group$1) {
				$$renderer.push("<!--[-->");
				Select_group$1($$renderer, spread_props([
					{ "data-slot": "select-group" },
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
//#region src/lib/components/ui/select/select-item.svelte
function Select_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, value, label, children: childrenProp, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function children($$renderer, { selected, highlighted }) {
					$$renderer.push(`<span class="absolute end-2 flex size-3.5 items-center justify-center">`);
					if (selected) {
						$$renderer.push("<!--[0-->");
						Check($$renderer, { class: "size-4" });
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></span> `);
					if (childrenProp) {
						$$renderer.push("<!--[0-->");
						childrenProp($$renderer, {
							selected,
							highlighted
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`${escape_html(label || value)}`);
					}
					$$renderer.push(`<!--]-->`);
				}
				if (Select_item$1) {
					$$renderer.push("<!--[-->");
					Select_item$1($$renderer, spread_props([
						{
							value,
							"data-slot": "select-item",
							class: cn("data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className)
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
							children,
							$$slots: { default: true }
						}
					]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
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
//#region src/lib/components/ui/select/select-portal.svelte
function Select_portal($$renderer, $$props) {
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
//#region src/lib/components/ui/select/select-scroll-up-button.svelte
function Select_scroll_up_button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Select_scroll_up_button$1) {
				$$renderer.push("<!--[-->");
				Select_scroll_up_button$1($$renderer, spread_props([
					{
						"data-slot": "select-scroll-up-button",
						class: cn("flex cursor-default items-center justify-center py-1", className)
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
							Chevron_up($$renderer, { class: "size-4" });
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
//#region src/lib/components/ui/select/select-scroll-down-button.svelte
function Select_scroll_down_button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Select_scroll_down_button$1) {
				$$renderer.push("<!--[-->");
				Select_scroll_down_button$1($$renderer, spread_props([
					{
						"data-slot": "select-scroll-down-button",
						class: cn("flex cursor-default items-center justify-center py-1", className)
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
							Chevron_down($$renderer, { class: "size-4" });
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
//#region src/lib/components/ui/select/select-content.svelte
function Select_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, sideOffset = 4, portalProps, children, preventScroll = true, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Select_portal($$renderer, spread_props([portalProps, {
				children: ($$renderer) => {
					if (Select_content$1) {
						$$renderer.push("<!--[-->");
						Select_content$1($$renderer, spread_props([
							{
								sideOffset,
								preventScroll,
								"data-slot": "select-content",
								class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--bits-select-content-available-height) min-w-[8rem] origin-(--bits-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)
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
									Select_scroll_up_button($$renderer, {});
									$$renderer.push(`<!----> `);
									if (Select_viewport) {
										$$renderer.push("<!--[-->");
										Select_viewport($$renderer, {
											class: cn("h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1 p-1"),
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
									Select_scroll_down_button($$renderer, {});
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
//#region src/lib/components/ui/select/select-trigger.svelte
function Select_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, size = "default", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Select_trigger$1) {
				$$renderer.push("<!--[-->");
				Select_trigger$1($$renderer, spread_props([
					{
						"data-slot": "select-trigger",
						"data-size": size,
						class: cn("border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none select-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
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
							Chevron_down($$renderer, { class: "size-4 opacity-50" });
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
//#region src/routes/(protected)/users/components/select-component.svelte
function Select_component($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { options = [], value = "", placeholder, class: className, name, disabled = false, onValueChange } = $$props;
		const triggerContent = derived(() => options.find((f) => f.value === value)?.label ?? placeholder);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Select) {
				$$renderer.push("<!--[-->");
				Select($$renderer, {
					type: "single",
					name,
					disabled,
					onValueChange,
					get value() {
						return value;
					},
					set value($$value) {
						value = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Select_trigger) {
							$$renderer.push("<!--[-->");
							Select_trigger($$renderer, {
								class: cn("w-[180px]", className),
								"aria-label": name,
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(triggerContent())}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Select_content) {
							$$renderer.push("<!--[-->");
							Select_content($$renderer, {
								children: ($$renderer) => {
									if (Select_group) {
										$$renderer.push("<!--[-->");
										Select_group($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!--[-->`);
												const each_array = ensure_array_like(options);
												for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
													let option = each_array[$$index];
													if (Select_item) {
														$$renderer.push("<!--[-->");
														Select_item($$renderer, {
															value: option.value,
															label: option.label,
															children: ($$renderer) => {
																$$renderer.push(`<!---->${escape_html(option.label)}`);
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
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/routes/(protected)/users/components/EditDialog.svelte
function EditDialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user = void 0, open = false, onOpenChange } = $$props;
		const me = page.data.user;
		const isAdmin = derived(() => adminRoles.includes(me.role));
		let isLoading = false;
		let formData = user;
		const handleOpenChange = (newOpen) => {
			onOpenChange(newOpen);
		};
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Dialog($$renderer, {
				open,
				onOpenChange: handleOpenChange,
				children: ($$renderer) => {
					Dialog_content($$renderer, {
						class: "sm:max-w-md",
						children: ($$renderer) => {
							Dialog_header($$renderer, {
								children: ($$renderer) => {
									Dialog_title($$renderer, {
										class: "flex items-center gap-2",
										children: ($$renderer) => {
											Calendar($$renderer, { class: "h-5 w-5" });
											$$renderer.push(`<!---->Edit User`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Dialog_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Update the user details.`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <form class="space-y-4"><div class="space-y-2">`);
							Label($$renderer, {
								for: "name",
								class: "text-sm font-medium",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Name *`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <div class="relative">`);
							User($$renderer, { class: "absolute top-3 left-3 h-4 w-4" });
							$$renderer.push(`<!----> `);
							Input($$renderer, {
								name: "name",
								id: "name",
								type: "text",
								placeholder: "Enter name",
								class: "pl-10",
								required: true,
								get value() {
									return formData.name;
								},
								set value($$value) {
									formData.name = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div></div> `);
							if (isAdmin() && me.id !== user?.id) {
								$$renderer.push("<!--[0-->");
								Select_component($$renderer, {
									disabled: isLoading,
									options: roles,
									class: "w-32",
									name: "role",
									placeholder: "Select role",
									get value() {
										return user.role;
									},
									set value($$value) {
										user.role = $$value;
										$$settled = false;
									}
								});
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<span class="text-sm text-muted-foreground">${escape_html(me.id === user?.id ? "You" : "No access")}</span>`);
							}
							$$renderer.push(`<!--]--> `);
							Dialog_footer($$renderer, {
								children: ($$renderer) => {
									Button($$renderer, {
										type: "button",
										variant: "outline",
										class: "cursor-pointer",
										onclick: () => handleOpenChange(false),
										disabled: isLoading,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Cancel`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									$$renderer.push("<!--[-1-->");
									Button($$renderer, {
										type: "submit",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Save User`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						},
						$$slots: { default: true }
					});
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
		bind_props($$props, {
			user,
			open
		});
	});
}
//#endregion
//#region src/routes/(protected)/users/components/DeleteDialog.svelte
function DeleteDialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, open, onOpenChange } = $$props;
		const me = page.data.user;
		let isLoading = false;
		const handleDelete = async () => {
			isLoading = true;
			try {
				const url = `/api/users/${user.id}`;
				const options = {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						me,
						data: null
					})
				};
				const { status, message } = await (await fetch(url, options)).json();
				if (status === "error") throw new Error(message);
				toast.success("Success Alert", { description: `Successfully deleted ${user.name}` });
				location.reload();
			} catch (err) {
				console.error("Failed to delete user:", err);
				toast.error("Error Alert", { description: err.message || "Failed to delete user" });
			} finally {
				isLoading = false;
			}
		};
		const handleOpenChange = (newOpen) => {
			if (!isLoading) onOpenChange(newOpen);
		};
		Dialog($$renderer, {
			open,
			onOpenChange: handleOpenChange,
			children: ($$renderer) => {
				Dialog_content($$renderer, {
					class: "sm:max-w-md",
					children: ($$renderer) => {
						Dialog_header($$renderer, {
							children: ($$renderer) => {
								Dialog_title($$renderer, {
									class: "flex items-center gap-2 text-red-600",
									children: ($$renderer) => {
										Triangle_alert($$renderer, { class: "h-5 w-5" });
										$$renderer.push(`<!---->Delete User`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Dialog_description($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<!---->This action cannot be undone. This will permanently delete the user.`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> <div class="space-y-2 rounded-lg border bg-gray-50 p-4 dark:bg-secondary"><div class="flex items-center justify-between"><span class="text-sm font-medium">Name:</span><span class="text-sm">${escape_html(user.name)}</span></div> <div class="flex items-center justify-between"><span class="text-sm font-medium">Role:</span><span class="text-sm capitalize">${escape_html(user.role)}</span></div></div> `);
						Dialog_footer($$renderer, {
							children: ($$renderer) => {
								Button($$renderer, {
									type: "button",
									variant: "outline",
									class: "cursor-pointer",
									onclick: () => handleOpenChange(false),
									disabled: isLoading,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Cancel`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								if (isLoading) {
									$$renderer.push("<!--[0-->");
									Button($$renderer, {
										disabled: isLoading,
										children: ($$renderer) => {
											Loading_spinner($$renderer, { class: "text-white" });
											$$renderer.push(`<!----><span>Deleting...</span>`);
										},
										$$slots: { default: true }
									});
								} else {
									$$renderer.push("<!--[-1-->");
									Button($$renderer, {
										type: "button",
										variant: "destructive",
										onclick: handleDelete,
										disabled: isLoading,
										class: "cursor-pointer",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Delete User`);
										},
										$$slots: { default: true }
									});
								}
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
//#region src/lib/components/ui/table/table.svelte
function Table($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div data-slot="table-container" class="relative w-full overflow-x-auto"><table${attributes({
			"data-slot": "table",
			class: clsx(cn("w-full caption-bottom text-sm", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></table></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-body.svelte
function Table_body($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<tbody${attributes({
			"data-slot": "table-body",
			class: clsx(cn("[&_tr:last-child]:border-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></tbody>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-cell.svelte
function Table_cell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<td${attributes({
			"data-slot": "table-cell",
			class: clsx(cn("bg-clip-padding p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></td>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-head.svelte
function Table_head($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<th${attributes({
			"data-slot": "table-head",
			class: clsx(cn("text-foreground h-10 bg-clip-padding px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></th>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-header.svelte
function Table_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<thead${attributes({
			"data-slot": "table-header",
			class: clsx(cn("[&_tr]:border-b", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></thead>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-row.svelte
function Table_row($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<tr${attributes({
			"data-slot": "table-row",
			class: clsx(cn("hover:[&,&>svelte-css-wrapper]:[&>th,td]:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></tr>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/authentication/ui/user/Identity.svelte
function Identity($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, class: className, direction = "left" } = $$props;
		if (user) {
			$$renderer.push("<!--[0-->");
			if (direction === "left") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx(cn("flex items-center gap-2 px-1 py-1.5 text-left text-sm", className)))}>`);
				if (Avatar) {
					$$renderer.push("<!--[-->");
					Avatar($$renderer, {
						class: "size-8 rounded-lg",
						children: ($$renderer) => {
							if (Avatar_image) {
								$$renderer.push("<!--[-->");
								Avatar_image($$renderer, {
									src: user?.image,
									alt: user?.name
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
										$$renderer.push(`<!---->${escape_html(user?.name?.slice(0, 2))}`);
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
				$$renderer.push(` <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium">${escape_html(user?.name)}</span> <span class="truncate text-xs text-muted-foreground">${escape_html(user?.email)}</span></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (direction === "right") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx(cn("flex items-center justify-end gap-2 px-1 py-1.5 text-sm", className)))}><div class="grid flex-1 text-right text-sm leading-tight"><span class="truncate font-medium">${escape_html(user?.name)}</span> <span class="truncate text-xs text-muted-foreground">${escape_html(user?.email)}</span></div> `);
				if (Avatar) {
					$$renderer.push("<!--[-->");
					Avatar($$renderer, {
						class: "size-8 rounded-lg",
						children: ($$renderer) => {
							if (Avatar_image) {
								$$renderer.push("<!--[-->");
								Avatar_image($$renderer, {
									src: user?.image,
									alt: user?.name
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
										$$renderer.push(`<!---->${escape_html(user?.name?.slice(0, 2))}`);
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
				$$renderer.push(`</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/(protected)/users/components/ListCard.svelte
function ListCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, i, onDelete, screen } = $$props;
		let updating = null;
		const dateFmt = new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "2-digit",
			year: "numeric"
		});
		const formatDate = (d) => dateFmt.format(new Date(d));
		const me = page.data.user;
		const isAdmin = derived(() => adminRoles.includes(me.role));
		const num = derived(() => i + 1);
		const roleVariant = derived(() => getRoleBadgeVariant(user?.role));
		const updateUserRole = async (profile, newRole) => {
			if (!adminRoles.includes(me.role)) {
				toast.error("Access Denied", { description: "Only administrators can change user roles." });
				return;
			}
			updating = profile.id;
			try {
				if (!(await admin.hasPermission({ permissions: { user: ["set-role"] } })).data?.success) throw new Error("Forbidden");
				await admin.setRole({
					userId: profile.id,
					role: newRole
				});
				toast.success("Success", { description: "User role updated successfully." });
				location.reload();
			} catch (error) {
				console.error("Error updating user role:", error);
				toast.error("Error", { description: "Failed to update user role. Please try again." });
			} finally {
				updating = null;
			}
		};
		const onValueChange = async (profile, val) => {
			await updateUserRole(profile, val);
		};
		if (screen === "desktop") {
			$$renderer.push("<!--[0-->");
			Table_row($$renderer, {
				class: "cursor-pointer hover:bg-muted/50",
				children: ($$renderer) => {
					Table_cell($$renderer, {
						class: "font-medium",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(num())}.`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Table_cell($$renderer, {
						class: "font-medium",
						children: ($$renderer) => {
							Identity($$renderer, { user });
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Table_cell($$renderer, {
						children: ($$renderer) => {
							Badge($$renderer, {
								variant: roleVariant(),
								class: "capitalize",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(user.role)}`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Table_cell($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(formatDate(user.createdAt))}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Table_cell($$renderer, {
						class: "flex h-full items-center justify-end gap-2 text-right",
						children: ($$renderer) => {
							if (isAdmin() && me.id !== user?.id) {
								$$renderer.push("<!--[0-->");
								Select_component($$renderer, {
									disabled: updating === user.id,
									value: user.role,
									options: roles,
									class: "h-full w-32 flex-1",
									name: "role",
									onValueChange: (val) => onValueChange(user, val),
									placeholder: "Select role"
								});
								$$renderer.push(`<!----> `);
								Button($$renderer, {
									disabled: updating === user.id,
									variant: "ghost",
									size: "sm",
									onclick: (e) => {
										e.stopPropagation();
										onDelete(user);
									},
									class: "h-8 w-8 cursor-pointer p-0 text-red-600 hover:bg-red-50 hover:text-red-700",
									children: ($$renderer) => {
										Trash_2($$renderer, { class: "h-4 w-4" });
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<span class="text-sm text-muted-foreground">${escape_html(me.id === user?.id ? "You" : "No access")}</span>`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="rounded-lg border bg-white shadow-sm dark:bg-secondary/50"><div class="border-b p-3"><div class="flex items-start justify-between gap-2"><div class="min-w-0 flex-1">`);
			Identity($$renderer, {
				user,
				class: "px-0"
			});
			$$renderer.push(`<!----> <div class="mt-1 flex flex-wrap items-center gap-1.5">`);
			Badge($$renderer, {
				class: "text-xs",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(num())}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Badge($$renderer, {
				variant: roleVariant(),
				class: "text-xs capitalize",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(user.role)}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div></div></div> <div class="space-y-2 p-3"><div class="flex items-center justify-between text-xs"><span class="text-muted-foreground">Created ${escape_html(formatDate(user.createdAt))}</span></div></div> <div class="flex items-center justify-between border-t bg-muted/30 px-3 py-2">`);
			if (isAdmin() && me.id !== user?.id) {
				$$renderer.push("<!--[0-->");
				Select_component($$renderer, {
					disabled: updating === user.id,
					value: user.role,
					options: roles,
					class: "h-8 flex-1 text-xs",
					name: "role",
					onValueChange: (val) => onValueChange(user, val),
					placeholder: "Select role"
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					disabled: updating === user.id,
					variant: "outline",
					size: "sm",
					onclick: () => onDelete(user),
					class: "ml-1.5 size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700",
					children: ($$renderer) => {
						Trash_2($$renderer, { class: "size-3.5" });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="text-xs text-muted-foreground">${escape_html(me.id === user?.id ? "You" : "No access")}</span>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow = void 0;
//#endregion
//#region ../../node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber((update) => {
			const cleanupFocusIn = on(window, "focusin", update);
			const cleanupFocusOut = on(window, "focusout", update);
			return () => {
				cleanupFocusIn();
				cleanupFocusOut();
			};
		});
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement(this.#document);
	}
};
new ActiveElement();
//#endregion
//#region ../../node_modules/runed/dist/internal/utils/is.js
function isFunction(value) {
	return typeof value === "function";
}
//#endregion
//#region ../../node_modules/runed/dist/utilities/extract/extract.svelte.js
function extract(value, defaultValue) {
	if (isFunction(value)) {
		const gotten = value();
		if (gotten === void 0) return defaultValue;
		return gotten;
	}
	if (value === void 0) return defaultValue;
	return value;
}
//#endregion
//#region ../../node_modules/runed/dist/utilities/use-debounce/use-debounce.svelte.js
function useDebounce(callback, wait) {
	let context = null;
	const wait$ = derived(() => extract(wait, 250));
	function debounced(...args) {
		if (context) {
			if (context.timeout) clearTimeout(context.timeout);
		} else {
			let resolve;
			let reject;
			context = {
				timeout: null,
				runner: null,
				promise: new Promise((res, rej) => {
					resolve = res;
					reject = rej;
				}),
				resolve,
				reject
			};
		}
		context.runner = async () => {
			if (!context) return;
			const ctx = context;
			context = null;
			try {
				ctx.resolve(await callback.apply(this, args));
			} catch (error) {
				ctx.reject(error);
			}
		};
		context.timeout = setTimeout(context.runner, wait$());
		return context.promise;
	}
	debounced.cancel = async () => {
		if (!context || context.timeout === null) {
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!context || context.timeout === null) return;
		}
		clearTimeout(context.timeout);
		context.reject("Cancelled");
		context = null;
	};
	debounced.runScheduledNow = async () => {
		if (!context || !context.timeout) {
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!context || !context.timeout) return;
		}
		clearTimeout(context.timeout);
		context.timeout = null;
		await context.runner?.();
	};
	Object.defineProperty(debounced, "pending", {
		enumerable: true,
		get() {
			return !!context?.timeout;
		}
	});
	return debounced;
}
//#endregion
//#region ../../node_modules/runed/dist/utilities/watch/watch.svelte.js
function runWatcher(sources, flush, effect, options = {}) {
	const { lazy = false } = options;
}
function watch(sources, effect, options) {
	runWatcher(sources, "post", effect, options);
}
function watchPre(sources, effect, options) {
	runWatcher(sources, "pre", effect, options);
}
watch.pre = watchPre;
function watchOnce(source, effect) {}
function watchOncePre(source, effect) {}
watchOnce.pre = watchOncePre;
//#endregion
//#region ../../node_modules/runed/dist/internal/utils/function.js
function noop() {}
//#endregion
//#region ../../node_modules/runed/dist/utilities/debounced/debounced.svelte.js
var Debounced = class {
	#current;
	#debounceFn;
	/**
	* @param getter A function that returns the state to watch.
	* @param wait The length of time to wait in ms, defaults to 250.
	*/
	constructor(getter, wait = 250) {
		this.#current = getter();
		this.cancel = this.cancel.bind(this);
		this.setImmediately = this.setImmediately.bind(this);
		this.updateImmediately = this.updateImmediately.bind(this);
		this.#debounceFn = useDebounce(() => {
			this.#current = getter();
		}, wait);
		watch(getter, () => {
			this.#debounceFn().catch(noop);
		});
	}
	/**
	* Get the debounced value.
	*/
	get current() {
		return this.#current;
	}
	/**
	* Whether a timer is currently pending.
	*/
	get pending() {
		return this.#debounceFn.pending;
	}
	/**
	* Cancel the latest timer.
	*/
	cancel() {
		this.#debounceFn.cancel();
	}
	/**
	* Run the debounced function immediately.
	*/
	updateImmediately() {
		return this.#debounceFn.runScheduledNow();
	}
	/**
	* Set the `current` value without waiting.
	*/
	setImmediately(v) {
		this.cancel();
		this.#current = v;
	}
};
//#endregion
//#region ../../node_modules/runed/dist/utilities/resource/resource.svelte.js
function debounce(fn, delay) {
	let timeoutId;
	let lastResolve = null;
	return (...args) => {
		return new Promise((resolve) => {
			if (lastResolve) lastResolve(void 0);
			lastResolve = resolve;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				const result = await fn(...args);
				if (lastResolve) {
					lastResolve(result);
					lastResolve = null;
				}
			}, delay);
		});
	};
}
function throttle(fn, delay) {
	let lastRun = 0;
	let lastPromise = null;
	return (...args) => {
		const now = Date.now();
		if (lastRun && now - lastRun < delay) return lastPromise ?? Promise.resolve(void 0);
		lastRun = now;
		lastPromise = fn(...args);
		return lastPromise;
	};
}
function runResource(source, fetcher, options = {}, effectFn) {
	const { lazy = false, once = false, initialValue, debounce: debounceTime, throttle: throttleTime } = options;
	let current = initialValue;
	let loading = initialValue === void 0 && !lazy;
	let error = void 0;
	let cleanupFns = [];
	const runCleanup = () => {
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
	};
	const onCleanup = (fn) => {
		cleanupFns = [...cleanupFns, fn];
	};
	const baseFetcher = async (value, previousValue, refetching = false) => {
		try {
			loading = true;
			error = void 0;
			runCleanup();
			const controller = new AbortController();
			onCleanup(() => controller.abort());
			const result = await fetcher(value, previousValue, {
				data: current,
				refetching,
				onCleanup,
				signal: controller.signal
			});
			current = result;
			return result;
		} catch (e) {
			if (!(e instanceof DOMException && e.name === "AbortError")) error = e;
			return;
		} finally {
			loading = false;
		}
	};
	const runFetcher = debounceTime ? debounce(baseFetcher, debounceTime) : throttleTime ? throttle(baseFetcher, throttleTime) : baseFetcher;
	const sources = Array.isArray(source) ? source : [source];
	let prevValues;
	effectFn((values, previousValues) => {
		if (once && prevValues) return;
		prevValues = values;
		runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? previousValues : previousValues?.[0]);
	}, { lazy });
	return {
		get current() {
			return current;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		mutate: (value) => {
			current = value;
		},
		refetch: (info) => {
			const values = sources.map((s) => s());
			return runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? values : values[0], info ?? true);
		}
	};
}
function resource(source, fetcher, options) {
	return runResource(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getters = () => sources.map((s) => s());
		watch(getters, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
function resourcePre(source, fetcher, options) {
	return runResource(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getter = () => sources.map((s) => s());
		watch.pre(getter, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
resource.pre = resourcePre;
//#endregion
//#region src/lib/components/ui/alert/alert.svelte
var alertVariants = tv({
	base: "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
	variants: { variant: {
		default: "bg-card text-card-foreground",
		destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"
	} },
	defaultVariants: { variant: "default" }
});
function Alert($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert",
			class: clsx(cn(alertVariants({ variant }), className)),
			...restProps,
			role: "alert"
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert/alert-description.svelte
function Alert_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert-description",
			class: clsx(cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert/alert-title.svelte
function Alert_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert-title",
			class: clsx(cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/routes/(protected)/users/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let editingUser = null;
		let deletingUser = null;
		const onDelete = async (user) => deletingUser = user;
		let handleInput = "";
		const debouncedHandle = new Debounced(() => handleInput, 500);
		const usersQuery = derived(() => infiniteScroll.listQuery(debouncedHandle.current, page.url.origin, "users"));
		let stats = {
			totalUsers: 0,
			creators: 0,
			admins: 0,
			editors: 0,
			banned: 0,
			newToday: 0,
			newWeek: 0
		};
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex flex-col gap-4"><div class="flex flex-col gap-4"><h1 class="text-2xl font-bold sm:text-3xl">Users (`);
			if (usersQuery().isPending) {
				$$renderer.push("<!--[0-->");
				Loader_circle($$renderer, { class: "inline h-4 w-4 animate-spin" });
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(usersQuery()?.data?.total ?? 0)}`);
			}
			$$renderer.push(`<!--]-->)</h1> <p class="mt-2 text-muted-foreground">Manage users</p></div> <div class="grid grid-cols-1 gap-4 md:grid-cols-4"><div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background"><div class="flex items-center justify-between"><div class="text-sm text-muted-foreground">Total Users</div> `);
			Users($$renderer, { class: "h-4 w-4 text-muted-foreground" });
			$$renderer.push(`<!----></div> <div class="mt-2 text-2xl font-semibold">`);
			$$renderer.push("<!--[0-->");
			Loader_circle($$renderer, { class: "h-4 w-4 animate-spin" });
			$$renderer.push(`<!--]--></div> <div class="text-xs text-muted-foreground">+${escape_html(stats.newToday)} today</div></div> <div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background"><div class="text-sm text-muted-foreground">Creators</div> <div class="mt-2 text-2xl font-semibold">${escape_html(stats.creators)}</div> <div class="text-xs text-muted-foreground">+${escape_html(stats.newWeek)} in 7 days</div></div> <div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background"><div class="text-sm text-muted-foreground">Admins / Editors</div> <div class="mt-2 text-2xl font-semibold">${escape_html(stats.admins + stats.editors)}</div> <div class="text-xs text-muted-foreground">${escape_html(stats.admins)} admins • ${escape_html(stats.editors)} editors</div></div> <div class="rounded-lg border bg-white p-4 shadow-sm dark:bg-background"><div class="text-sm text-muted-foreground">Banned Users</div> <div class="mt-2 text-2xl font-semibold">${escape_html(stats.banned)}</div> <div class="text-xs text-muted-foreground">Account blocks</div></div></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex flex-col items-center justify-between gap-4 md:flex-row"><div class="relative grid w-full sm:max-w-md">`);
			Search($$renderer, { class: "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" });
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				placeholder: "Search users...",
				class: "px-10",
				get value() {
					return handleInput;
				},
				set value($$value) {
					handleInput = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> `);
			if (usersQuery().isPending) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="p-6"><div class="flex h-80 items-center justify-center"><div class="size-20 animate-spin rounded-full border-b-2 border-primary"></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (usersQuery().error) {
				$$renderer.push("<!--[0-->");
				if (Alert) {
					$$renderer.push("<!--[-->");
					Alert($$renderer, {
						variant: "destructive",
						children: ($$renderer) => {
							Circle_alert($$renderer, {});
							$$renderer.push(`<!----> `);
							if (Alert_title) {
								$$renderer.push("<!--[-->");
								Alert_title($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(usersQuery().error.name)}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
							$$renderer.push(` `);
							if (Alert_description) {
								$$renderer.push("<!--[-->");
								Alert_description($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(usersQuery().error.cause)}<br/>${escape_html(usersQuery().error.message)}`);
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
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (usersQuery().isSuccess) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div><div class="hidden overflow-x-auto border bg-white lg:block dark:bg-background">`);
				Table($$renderer, {
					children: ($$renderer) => {
						Table_header($$renderer, {
							class: "sticky top-0 z-10 border-b bg-white dark:bg-secondary",
							children: ($$renderer) => {
								Table_row($$renderer, {
									children: ($$renderer) => {
										Table_head($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->S/N`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Table_head($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->User`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Table_head($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->Role`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Table_head($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->Joined`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Table_head($$renderer, {
											class: "text-right",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Actions`);
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
						$$renderer.push(`<!----> `);
						Table_body($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<!--[-->`);
								const each_array = ensure_array_like(usersQuery().data.results);
								for (let i = 0, $$length = each_array.length; i < $$length; i++) {
									let user = each_array[i];
									ListCard($$renderer, {
										onDelete,
										screen: "desktop",
										i,
										user
									});
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden"><!--[-->`);
				const each_array_1 = ensure_array_like(usersQuery().data.results);
				for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
					let user = each_array_1[i];
					ListCard($$renderer, {
						onDelete,
						screen: "mobile",
						i,
						user
					});
				}
				$$renderer.push(`<!--]--></div></div> <div>`);
				if (usersQuery().isFetching) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center justify-center">`);
					Loader_circle($$renderer, { class: "h-6 w-6 animate-spin text-muted-foreground" });
					$$renderer.push(`<!----> <span class="ml-2 text-muted-foreground">Loading more...</span></div>`);
				} else if (usersQuery().hasNextPage) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<div class="justify-center">`);
					Button($$renderer, {
						class: "w-full sm:w-fit",
						onclick: () => usersQuery().fetchNextPage(),
						disabled: !usersQuery().hasNextPage || usersQuery().isFetchingNextPage,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Load More`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<p class="text-center text-sm text-muted-foreground">Nothing more to load</p>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (editingUser) {
				$$renderer.push("<!--[0-->");
				EditDialog($$renderer, {
					user: editingUser,
					open: !!editingUser,
					onOpenChange: (open) => !open && (editingUser = null)
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (deletingUser) {
				$$renderer.push("<!--[0-->");
				DeleteDialog($$renderer, {
					user: deletingUser,
					open: !!deletingUser,
					onOpenChange: (open) => !open && (deletingUser = null)
				});
			} else $$renderer.push("<!--[-1-->");
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
export { _page as default };
