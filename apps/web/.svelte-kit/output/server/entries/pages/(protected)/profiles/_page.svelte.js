import { At as clsx, gt as ensure_array_like, jt as escape_html, kt as attr, m as Radio_group$1, p as Radio_group_item$1, pt as bind_props, ut as attr_class, yt as spread_props } from "../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { t as Trash_2 } from "../../../../chunks/trash-2.js";
import { t as User } from "../../../../chunks/user.js";
import { t as cn } from "../../../../chunks/utils2.js";
import { t as Button } from "../../../../chunks/button.js";
import { t as Input } from "../../../../chunks/input.js";
import { a as Card, i as Card_content } from "../../../../chunks/card.js";
import { t as Label } from "../../../../chunks/label.js";
import { a as Dialog_footer, i as Dialog_header, n as Dialog_description, o as Dialog_title, r as Dialog_content, s as Dialog, t as Dialog_trigger } from "../../../../chunks/dialog.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/circle.svelte
function Circle($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "circle" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}]] }
	]));
}
//#endregion
//#region src/lib/components/ui/radio-group/radio-group.svelte
function Radio_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, value = "", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Radio_group$1) {
				$$renderer.push("<!--[-->");
				Radio_group$1($$renderer, spread_props([
					{
						"data-slot": "radio-group",
						class: cn("grid gap-3", className)
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
//#region src/lib/components/ui/radio-group/radio-group-item.svelte
function Radio_group_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function children($$renderer, { checked }) {
					$$renderer.push(`<div data-slot="radio-group-indicator" class="relative flex items-center justify-center">`);
					if (checked) {
						$$renderer.push("<!--[0-->");
						Circle($$renderer, { class: "fill-primary absolute start-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2" });
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				if (Radio_group_item$1) {
					$$renderer.push("<!--[-->");
					Radio_group_item$1($$renderer, spread_props([
						{
							"data-slot": "radio-group-item",
							class: cn("border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className)
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
//#region src/routes/(protected)/profiles/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const PROFILE_TYPES = [
			{
				id: "adult",
				label: "Adult",
				description: "Full access to all content"
			},
			{
				id: "teen",
				label: "Teen",
				description: "Age-appropriate content for teenagers"
			},
			{
				id: "kids",
				label: "Kids",
				description: "Child-friendly content only"
			}
		];
		const AVATAR_COLORS = [
			"bg-red-500",
			"bg-blue-500",
			"bg-green-500",
			"bg-yellow-500",
			"bg-purple-500",
			"bg-pink-500",
			"bg-orange-500",
			"bg-teal-500"
		];
		const AVATAR_EMOJIS = [
			"😊",
			"🦁",
			"🐺",
			"🦊",
			"🐻",
			"🦅",
			"🌟",
			"🎭"
		];
		let profiles = data.profiles;
		let maxProfiles = data.maxProfiles;
		let newName = "";
		let newType = "adult";
		let newColor = "bg-blue-500";
		let newEmoji = "😊";
		let creating = false;
		let createError = "";
		let addDialogOpen = false;
		async function createProfile() {
			if (!newName.trim()) {
				createError = "Name is required";
				return;
			}
			creating = true;
			createError = "";
			try {
				const res = await fetch("/api/profiles", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: newName.trim(),
						type: newType,
						avatarColor: newColor,
						avatarEmoji: newEmoji
					})
				});
				const data = await res.json();
				if (!res.ok) {
					createError = data.error || "Failed to create profile";
					return;
				}
				profiles = [...profiles, data];
				newName = "";
				newType = "adult";
				newColor = "bg-blue-500";
				newEmoji = "😊";
				addDialogOpen = false;
			} finally {
				creating = false;
			}
		}
		function selectProfile(profile) {
			document.cookie = `activeProfileId=${profile.id}; path=/; max-age=86400`;
			window.location.href = profile.type === "kids" ? "/kids/kiddies" : "/browse";
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="min-h-screen bg-linear-to-b from-background to-accent/10"><div class="container mx-auto px-4 py-16"><div class="mb-8 flex items-center justify-between"><div><h1 class="mb-2 text-3xl font-bold">Who's Watching?</h1> <p class="text-muted-foreground">Choose a profile to start watching</p></div> <div class="flex items-center gap-3">`);
			if (maxProfiles > 2) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-xs text-muted-foreground">Family plan: ${escape_html(profiles.length)}/${escape_html(maxProfiles)} profiles</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				variant: "outline",
				href: "/parental-controls",
				size: "sm",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Parental Controls`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> `);
			{
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5"><!--[-->`);
				const each_array_1 = ensure_array_like(profiles);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let profile = each_array_1[$$index_1];
					$$renderer.push(`<div class="relative group">`);
					Card($$renderer, {
						class: "cursor-pointer transition-transform hover:scale-105",
						onclick: () => selectProfile(profile),
						children: ($$renderer) => {
							Card_content($$renderer, {
								class: "p-4 text-center",
								children: ($$renderer) => {
									$$renderer.push(`<div${attr_class(clsx(cn("mx-auto h-32 w-32 rounded-lg", profile.avatarColor, "mb-4 flex items-center justify-center ring-primary group-hover:ring-4")))}><span class="text-5xl">${escape_html(profile.avatarEmoji || "👤")}</span></div> <h3 class="text-lg font-medium">${escape_html(profile.name)}</h3> <p class="text-sm capitalize text-muted-foreground">${escape_html(profile.type)}</p> `);
									if (profile.hasPin) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-xs text-yellow-400 mt-1">PIN protected</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (!profile.isDefault && profiles.length > 1) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<button class="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-red-600/80 p-1.5 rounded-full text-white" title="Delete profile">`);
						Trash_2($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----></button>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]--> `);
				if (profiles.length < maxProfiles) {
					$$renderer.push("<!--[0-->");
					Dialog($$renderer, {
						get open() {
							return addDialogOpen;
						},
						set open($$value) {
							addDialogOpen = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							Dialog_trigger($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<div class="cursor-pointer border-dashed transition-transform hover:scale-105 rounded-lg border-2 border-border bg-card text-card-foreground shadow-sm h-full min-h-48"><div class="flex h-full flex-col items-center justify-center p-4 text-center"><div class="mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">`);
									Plus($$renderer, { class: "h-16 w-16 text-muted-foreground" });
									$$renderer.push(`<!----></div> <h3 class="text-lg font-medium">Add Profile</h3></div></div>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Dialog_content($$renderer, {
								children: ($$renderer) => {
									Dialog_header($$renderer, {
										children: ($$renderer) => {
											Dialog_title($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->Create Profile`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Dialog_description($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->Add a new profile for another person watching Sephar Studios`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!---->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <div class="space-y-6"><div class="space-y-2">`);
									Label($$renderer, {
										for: "pname",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Profile Name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "pname",
										placeholder: "Enter name",
										get value() {
											return newName;
										},
										set value($$value) {
											newName = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="space-y-2">`);
									Label($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Profile Type`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Radio_group($$renderer, {
										get value() {
											return newType;
										},
										set value($$value) {
											newType = $$value;
											$$settled = false;
										},
										children: ($$renderer) => {
											$$renderer.push(`<!--[-->`);
											const each_array_2 = ensure_array_like(PROFILE_TYPES);
											for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
												let type = each_array_2[$$index_2];
												$$renderer.push(`<div class="flex items-center space-x-2">`);
												Radio_group_item($$renderer, {
													value: type.id,
													id: type.id
												});
												$$renderer.push(`<!----> `);
												Label($$renderer, {
													for: type.id,
													class: "flex-1",
													children: ($$renderer) => {
														$$renderer.push(`<span class="font-medium">${escape_html(type.label)}</span> <span class="text-sm text-muted-foreground block">${escape_html(type.description)}</span>`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----></div>`);
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="space-y-2">`);
									Label($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Avatar`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <div class="flex flex-wrap gap-2 mb-2"><!--[-->`);
									const each_array_3 = ensure_array_like(AVATAR_EMOJIS);
									for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
										let emoji = each_array_3[$$index_3];
										$$renderer.push(`<button type="button"${attr_class(`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl transition-all ${newEmoji === emoji ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""}`)}>${escape_html(emoji)}</button>`);
									}
									$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-2"><!--[-->`);
									const each_array_4 = ensure_array_like(AVATAR_COLORS);
									for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
										let color = each_array_4[$$index_4];
										$$renderer.push(`<button type="button"${attr("aria-label", `Select ${color.replace("bg-", "").replace("-", " ")} avatar color`)}${attr_class(`w-8 h-8 rounded-full ${color} transition-all ${newColor === color ? "ring-4 ring-offset-2 ring-offset-background ring-primary" : ""}`)}></button>`);
									}
									$$renderer.push(`<!--]--></div></div> `);
									if (createError) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-sm text-red-400">${escape_html(createError)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									Dialog_footer($$renderer, {
										children: ($$renderer) => {
											Button($$renderer, {
												onclick: createProfile,
												disabled: creating,
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(creating ? "Creating..." : "Create Profile")}`);
												},
												$$slots: { default: true }
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="rounded-lg border-2 border-border bg-card/50 text-card-foreground opacity-60 min-h-48"><div class="flex h-full flex-col items-center justify-center p-4 text-center"><div class="mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">`);
					User($$renderer, { class: "h-16 w-16 text-muted-foreground" });
					$$renderer.push(`<!----></div> <h3 class="text-sm font-medium text-muted-foreground">Profile limit reached</h3> `);
					if (maxProfiles <= 2) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-xs text-muted-foreground mt-1">Add Family add-on for up to 8</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
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
