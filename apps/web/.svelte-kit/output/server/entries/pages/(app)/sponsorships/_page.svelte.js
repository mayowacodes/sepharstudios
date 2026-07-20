import { D as Popover_trigger$1, Ht as attr, O as Popover_content$1, Ot as ensure_array_like, Tt as bind_props, Wt as escape_html, it as Portal, jt as spread_props, kt as head, y as Popover$1 } from "../../../../chunks/ui-libs.js";
import { t as Chevron_down } from "../../../../chunks/chevron-down.js";
import { t as Upload } from "../../../../chunks/upload.js";
import { t as X } from "../../../../chunks/x.js";
import "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as cn } from "../../../../chunks/utils2.js";
import { t as Input } from "../../../../chunks/input.js";
import { t as Button } from "../../../../chunks/button.js";
import { c as Command, i as Command_item, n as Command_list, o as Command_empty, r as Command_input } from "../../../../chunks/command.js";
import { t as Textarea } from "../../../../chunks/textarea.js";
//#region src/lib/components/ui/popover/popover.svelte
function Popover($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Popover$1) {
				$$renderer.push("<!--[-->");
				Popover$1($$renderer, spread_props([restProps, {
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
//#region src/lib/components/ui/popover/popover-portal.svelte
function Popover_portal($$renderer, $$props) {
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
//#region src/lib/components/ui/popover/popover-content.svelte
function Popover_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, sideOffset = 4, align = "center", portalProps, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Popover_portal($$renderer, spread_props([portalProps, {
				children: ($$renderer) => {
					if (Popover_content$1) {
						$$renderer.push("<!--[-->");
						Popover_content$1($$renderer, spread_props([
							{
								"data-slot": "popover-content",
								sideOffset,
								align,
								class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className)
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
//#region src/lib/components/ui/popover/popover-trigger.svelte
function Popover_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Popover_trigger$1) {
				$$renderer.push("<!--[-->");
				Popover_trigger$1($$renderer, spread_props([
					{
						"data-slot": "popover-trigger",
						class: cn("", className)
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
//#region src/routes/(app)/sponsorships/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let isSubmitting = false;
		let scriptFile = null;
		let budgetFile = null;
		let storyboardFile = null;
		let selectedGenre = "";
		let genrePopoverOpen = false;
		const genres = [
			"Drama",
			"Documentary",
			"Educational",
			"Family",
			"Christian",
			"Historical",
			"Inspirational"
		];
		function selectGenre(genre) {
			selectedGenre = genre;
			genrePopoverOpen = false;
		}
		function pickFile(setter) {
			return (e) => {
				const input = e.currentTarget;
				setter(input.files?.[0] ?? null);
			};
		}
		function clearFile(setter, inputId) {
			setter(null);
			const el = document.getElementById(inputId);
			if (el) el.value = "";
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("2rmv4b", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Movie Production Sponsorship — Sephar Studios</title>`);
				});
			});
			$$renderer.push(`<div class="container mx-auto py-12 px-4"><div class="max-w-4xl mx-auto space-y-8"><div class="text-center space-y-4"><h1 class="text-4xl font-bold">Movie Production Sponsorship</h1> <p class="text-xl text-muted-foreground">Partner with Sephar Studios to bring your Christian movie project to life</p></div> <form method="POST" action="?/submit" class="space-y-8" enctype="multipart/form-data"><div class="space-y-4"><h2 class="text-2xl font-semibold">Contact Information</h2> <div class="grid gap-4 md:grid-cols-2">`);
			if (!data?.user) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="space-y-2"><label for="name" class="text-sm font-medium">Full Name</label> `);
				Input($$renderer, {
					id: "name",
					name: "name",
					required: true
				});
				$$renderer.push(`<!----></div> <div class="space-y-2"><label for="email" class="text-sm font-medium">Email Address</label> `);
				Input($$renderer, {
					id: "email",
					name: "email",
					type: "email",
					required: true
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="space-y-4"><h2 class="text-2xl font-semibold">Project Details</h2> <div class="grid gap-4 md:grid-cols-2"><div class="space-y-2"><label for="title" class="text-sm font-medium">Project Title</label> `);
			Input($$renderer, {
				id: "title",
				name: "title",
				required: true
			});
			$$renderer.push(`<!----></div> <div class="space-y-2"><label for="genre" class="text-sm font-medium">Genre</label> `);
			Popover($$renderer, {
				get open() {
					return genrePopoverOpen;
				},
				set open($$value) {
					genrePopoverOpen = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Popover_trigger($$renderer, {
						children: ($$renderer) => {
							Button($$renderer, {
								class: "w-full justify-between",
								type: "button",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(selectedGenre || "Select genre")} `);
									Chevron_down($$renderer, { class: "w-4 h-4" });
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Popover_content($$renderer, {
						class: "w-50 p-2",
						children: ($$renderer) => {
							if (Command) {
								$$renderer.push("<!--[-->");
								Command($$renderer, {
									children: ($$renderer) => {
										if (Command_input) {
											$$renderer.push("<!--[-->");
											Command_input($$renderer, { placeholder: "Search genre..." });
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(` `);
										if (Command_list) {
											$$renderer.push("<!--[-->");
											Command_list($$renderer, {
												children: ($$renderer) => {
													if (Command_empty) {
														$$renderer.push("<!--[-->");
														Command_empty($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<!---->No genres found.`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` <!--[-->`);
													const each_array = ensure_array_like(genres);
													for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
														let g = each_array[$$index];
														if (Command_item) {
															$$renderer.push("<!--[-->");
															Command_item($$renderer, {
																onSelect: () => selectGenre(g),
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(g)}`);
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
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <input type="hidden" name="genre"${attr("value", selectedGenre)} required=""/></div></div> <div class="space-y-2"><label for="synopsis" class="text-sm font-medium">Project Synopsis</label> `);
			Textarea($$renderer, {
				id: "synopsis",
				name: "synopsis",
				rows: 4,
				required: true,
				placeholder: "Provide a brief overview of your project (40+ characters)..."
			});
			$$renderer.push(`<!----></div></div> <div class="space-y-4"><h2 class="text-2xl font-semibold">Supporting Documents</h2> <div class="grid gap-6"><div class="space-y-2"><label for="script-input" class="text-sm font-medium">Script or Treatment</label> <div class="flex items-center gap-2">`);
			Input($$renderer, {
				id: "script-input",
				type: "file",
				name: "script",
				accept: ".pdf,.doc,.docx",
				required: true,
				onchange: pickFile((f) => scriptFile = f)
			});
			$$renderer.push(`<!----> `);
			if (scriptFile) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 text-sm border rounded-md p-2">`);
				Upload($$renderer, { class: "w-4 h-4" });
				$$renderer.push(`<!----> <span class="truncate max-w-40">${escape_html(scriptFile.name)}</span> `);
				Button($$renderer, {
					type: "button",
					size: "icon",
					variant: "ghost",
					onclick: () => clearFile((f) => scriptFile = f, "script-input"),
					children: ($$renderer) => {
						X($$renderer, { class: "w-4 h-4" });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="space-y-2"><label for="budget-input" class="text-sm font-medium">Budget Breakdown</label> <div class="flex items-center gap-2">`);
			Input($$renderer, {
				id: "budget-input",
				type: "file",
				name: "budget_breakdown",
				accept: ".pdf,.xls,.xlsx",
				required: true,
				onchange: pickFile((f) => budgetFile = f)
			});
			$$renderer.push(`<!----> `);
			if (budgetFile) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 text-sm border rounded-md p-2">`);
				Upload($$renderer, { class: "w-4 h-4" });
				$$renderer.push(`<!----> <span class="truncate max-w-40">${escape_html(budgetFile.name)}</span> `);
				Button($$renderer, {
					type: "button",
					size: "icon",
					variant: "ghost",
					onclick: () => clearFile((f) => budgetFile = f, "budget-input"),
					children: ($$renderer) => {
						X($$renderer, { class: "w-4 h-4" });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="space-y-2"><label for="storyboard-input" class="text-sm font-medium">Storyboard / Visual References</label> <div class="flex items-center gap-2">`);
			Input($$renderer, {
				id: "storyboard-input",
				type: "file",
				name: "storyboard",
				accept: ".pdf,.zip,.jpg,.png",
				onchange: pickFile((f) => storyboardFile = f)
			});
			$$renderer.push(`<!----> `);
			if (storyboardFile) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 text-sm border rounded-md p-2">`);
				Upload($$renderer, { class: "w-4 h-4" });
				$$renderer.push(`<!----> <span class="truncate max-w-40">${escape_html(storyboardFile.name)}</span> `);
				Button($$renderer, {
					type: "button",
					size: "icon",
					variant: "ghost",
					onclick: () => clearFile((f) => storyboardFile = f, "storyboard-input"),
					children: ($$renderer) => {
						X($$renderer, { class: "w-4 h-4" });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div></div></div> <div class="flex justify-end gap-4">`);
			Button($$renderer, {
				type: "reset",
				variant: "outline",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Reset`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				type: "submit",
				disabled: isSubmitting,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html("Submit Request")}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></form></div></div>`);
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
