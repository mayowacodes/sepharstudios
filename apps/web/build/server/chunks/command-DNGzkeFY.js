import { al as bind_props, aO as spread_props, C as Command$1, l as Command_input$1, n as Command_list$1, au as escape_html, h as Command_empty$1, i as Command_group$1, aW as useId, j as Command_group_heading, k as Command_group_items, o as Command_separator$1, m as Command_item$1 } from './ui-libs-BjzLDLAh.js';
import { S as Search } from './search-DjJyYABq.js';
import { c as cn } from './utils2-BaRxD-PE.js';
import { D as Dialog, d as Dialog_header, a as Dialog_content, e as Dialog_title, b as Dialog_description } from './dialog-gQmyR4Nc.js';

//#region src/lib/components/ui/command/command.svelte
function Command($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { api = null, ref = null, value = "", class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command$1) {
				$$renderer.push("<!--[-->");
				Command$1($$renderer, spread_props([
					{
						"data-slot": "command",
						class: cn("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className)
					},
					restProps,
					{
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						},
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
		bind_props($$props, {
			api,
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/command/command-dialog.svelte
function Command_dialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, ref = null, value = "", title = "Command Palette", description = "Search for a command to run", portalProps, children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog) {
				$$renderer.push("<!--[-->");
				Dialog($$renderer, spread_props([restProps, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Dialog_header) {
							$$renderer.push("<!--[-->");
							Dialog_header($$renderer, {
								class: "sr-only",
								children: ($$renderer) => {
									if (Dialog_title) {
										$$renderer.push("<!--[-->");
										Dialog_title($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(title)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Dialog_description) {
										$$renderer.push("<!--[-->");
										Dialog_description($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(description)}`);
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
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "overflow-hidden p-0",
								portalProps,
								children: ($$renderer) => {
									Command($$renderer, spread_props([
										{ class: "**:data-[slot=command-input-wrapper]:h-12 [&_[data-command-group]]:px-2 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5" },
										restProps,
										{
											children,
											get value() {
												return value;
											},
											set value($$value) {
												value = $$value;
												$$settled = false;
											},
											get ref() {
												return ref;
											},
											set ref($$value) {
												ref = $$value;
												$$settled = false;
											}
										}
									]));
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
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/command/command-empty.svelte
function Command_empty($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_empty$1) {
				$$renderer.push("<!--[-->");
				Command_empty$1($$renderer, spread_props([
					{
						"data-slot": "command-empty",
						class: cn("py-6 text-center text-sm", className)
					},
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
//#region src/lib/components/ui/command/command-group.svelte
function Command_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, heading, value, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_group$1) {
				$$renderer.push("<!--[-->");
				Command_group$1($$renderer, spread_props([
					{
						"data-slot": "command-group",
						class: cn("text-foreground overflow-hidden p-1", className),
						value: value ?? heading ?? `----${useId()}`
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
							if (heading) {
								$$renderer.push("<!--[0-->");
								if (Command_group_heading) {
									$$renderer.push("<!--[-->");
									Command_group_heading($$renderer, {
										class: "text-muted-foreground px-2 py-1.5 text-xs font-medium",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(heading)}`);
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
							if (Command_group_items) {
								$$renderer.push("<!--[-->");
								Command_group_items($$renderer, { children });
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
//#region src/lib/components/ui/command/command-item.svelte
function Command_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_item$1) {
				$$renderer.push("<!--[-->");
				Command_item$1($$renderer, spread_props([
					{
						"data-slot": "command-item",
						class: cn("aria-selected:bg-accent aria-selected:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
					},
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
//#region src/lib/components/ui/command/command-input.svelte
function Command_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, value = "", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex h-9 items-center gap-2 border-b ps-3 pe-8" data-slot="command-input-wrapper">`);
			Search($$renderer, { class: "size-4 shrink-0 opacity-50" });
			$$renderer.push(`<!----> `);
			if (Command_input$1) {
				$$renderer.push("<!--[-->");
				Command_input$1($$renderer, spread_props([
					{
						"data-slot": "command-input",
						class: cn("placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className)
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
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/command/command-list.svelte
function Command_list($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_list$1) {
				$$renderer.push("<!--[-->");
				Command_list$1($$renderer, spread_props([
					{
						"data-slot": "command-list",
						class: cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)
					},
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
//#region src/lib/components/ui/command/command-separator.svelte
function Command_separator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_separator$1) {
				$$renderer.push("<!--[-->");
				Command_separator$1($$renderer, spread_props([
					{
						"data-slot": "command-separator",
						class: cn("bg-border -mx-1 h-px", className)
					},
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

export { Command as C, Command_dialog as a, Command_empty as b, Command_group as c, Command_input as d, Command_item as e, Command_list as f, Command_separator as g };
//# sourceMappingURL=command-DNGzkeFY.js.map
