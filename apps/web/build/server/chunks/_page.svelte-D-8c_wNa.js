import { ae as bind_props, aa as attr, an as escape_html, ao as fallback, ab as attr_class, E as Popover$1, aH as spread_props, G as Popover_trigger$1, F as Popover_content$1, I as Portal, C as Command$1, i as Command_input$1, k as Command_list$1, al as ensure_array_like, h as Command_empty$1, j as Command_item$1 } from './ui-libs-TtGtWAGI.js';
import { C as Check } from './check-B3T16oUO.js';
import { C as Chevron_down } from './chevron-down-mzP8AnTN.js';
import { C as Circle_alert } from './circle-alert-u3bBdSEX.js';
import { S as Search } from './search--wANa10U.js';
import { X } from './x-DtBkfd3e.js';
import './client-CZa6R-ON.js';
import { c as cn } from './utils2-C8dWVCac.js';
import { B as Button } from './button-D9M18H3C.js';
import { I as Input } from './input-BHWqom2S.js';
import { T as Textarea } from './textarea-DBgLAYR1.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CGEdwVFL.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';
import './index-CGfbhb6a.js';

//#region src/lib/components/Notifications.svelte
function Notifications($$renderer, $$props) {
	let type = fallback($$props["type"], "success");
	let message = $$props["message"];
	let duration = fallback($$props["duration"], 5e3);
	let visible = true;
	if (duration > 0) setTimeout(() => {
		visible = false;
	}, duration);
	if (visible) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="fixed top-4 right-4 z-50"><div${attr_class("flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg", void 0, {
			"bg-green-500": type === "success",
			"bg-red-500": type === "error"
		})}>`);
		if (type === "success") {
			$$renderer.push("<!--[0-->");
			Check($$renderer, { class: "w-5 h-5 text-white" });
		} else {
			$$renderer.push("<!--[-1-->");
			Circle_alert($$renderer, { class: "w-5 h-5 text-white" });
		}
		$$renderer.push(`<!--]--> <p class="text-white">${escape_html(message)}</p> <button class="ml-2 text-white hover:text-white/80">`);
		X($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></button></div></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
	bind_props($$props, {
		type,
		message,
		duration
	});
}
//#endregion
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
//#region src/lib/components/FileUpload.svelte
function FileUpload($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let label = $$props["label"];
		let name = $$props["name"];
		let accept = fallback($$props["accept"], "*");
		let required = fallback($$props["required"], false);
		let file = fallback($$props["file"], null);
		const dispatchChange = () => {
			dispatchEvent(new CustomEvent("change", { detail: { file } }));
		};
		function handleFileChange(event) {
			const input = event.target;
			if (input.files?.length) {
				file = input.files[0];
				dispatchChange();
			}
		}
		function removeFile() {
			file = null;
			dispatchChange();
		}
		$$renderer.push(`<div class="space-y-2"><label${attr("for", name)} class="text-sm font-medium">${escape_html(label)}</label> <div class="flex items-center gap-2">`);
		Input($$renderer, {
			id: name,
			type: "file",
			name,
			accept,
			required,
			onchange: handleFileChange
		});
		$$renderer.push(`<!----> `);
		if (file) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 text-sm border rounded-md p-2">${escape_html(file.name)} `);
			Button($$renderer, {
				size: "icon",
				variant: "ghost",
				onclick: removeFile,
				children: ($$renderer) => {
					X($$renderer, { size: 16 });
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
		bind_props($$props, {
			label,
			name,
			accept,
			required,
			file
		});
	});
}
//#endregion
//#region src/routes/(app)/sponsorships/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let form = $$props["form"];
		let isSubmitting = false;
		let files = {
			script: null,
			budget_breakdown: null,
			storyboard: null
		};
		let selectedGenre = "";
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
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="container mx-auto py-12 px-4"><div class="max-w-4xl mx-auto space-y-8"><div class="text-center space-y-4"><h1 class="text-4xl font-bold">Movie Production Sponsorship</h1> <p class="text-xl text-muted-foreground">Partner with Sephar Studios to bring your Christian movie project to life</p></div> `);
			if (form) {
				$$renderer.push("<!--[0-->");
				Notifications($$renderer, {
					type: form.success ? "success" : "error",
					message: form.message
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <form method="POST" action="?/submit" class="space-y-8" enctype="multipart/form-data"><div class="space-y-4"><h2 class="text-2xl font-semibold">Contact Information</h2> <div class="grid gap-4 md:grid-cols-2">`);
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
				children: ($$renderer) => {
					Popover_trigger($$renderer, {
						children: ($$renderer) => {
							Button($$renderer, {
								class: "w-full justify-between",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(selectedGenre || "Select genre")} `);
									Chevron_down($$renderer, { size: 16 });
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
							Command($$renderer, {
								children: ($$renderer) => {
									Command_input($$renderer, { placeholder: "Search genre..." });
									$$renderer.push(`<!----> `);
									Command_list($$renderer, {
										children: ($$renderer) => {
											Command_empty($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->No genres found.`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <!--[-->`);
											const each_array = ensure_array_like(genres);
											for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
												let genre = each_array[$$index];
												Command_item($$renderer, {
													onclick: () => selectGenre(genre),
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(genre)}`);
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
				placeholder: "Provide a brief overview of your project..."
			});
			$$renderer.push(`<!----></div></div> <div class="space-y-4"><h2 class="text-2xl font-semibold">Supporting Documents</h2> <div class="grid gap-6">`);
			FileUpload($$renderer, {
				label: "Script or Treatment",
				name: "script",
				accept: ".pdf,.doc,.docx",
				required: true,
				get file() {
					return files.script;
				},
				set file($$value) {
					files.script = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			FileUpload($$renderer, {
				label: "Budget Breakdown",
				name: "budget_breakdown",
				accept: ".pdf,.xls,.xlsx",
				required: true,
				get file() {
					return files.budget_breakdown;
				},
				set file($$value) {
					files.budget_breakdown = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			FileUpload($$renderer, {
				label: "Storyboard/Visual References",
				name: "storyboard",
				accept: ".pdf,.zip,.jpg,.png",
				get file() {
					return files.storyboard;
				},
				set file($$value) {
					files.storyboard = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> <div class="flex justify-end gap-4">`);
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
		bind_props($$props, {
			data,
			form
		});
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D-8c_wNa.js.map
