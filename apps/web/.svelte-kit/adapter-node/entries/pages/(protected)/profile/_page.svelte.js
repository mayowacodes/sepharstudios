import { jt as escape_html, mt as derived, yt as spread_props } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/auth-client.js";
import { t as Constants } from "../../../../chunks/constants.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Eye_off } from "../../../../chunks/eye-off.js";
import { t as Eye } from "../../../../chunks/eye.js";
import { t as Lock } from "../../../../chunks/lock.js";
import { t as Mail } from "../../../../chunks/mail.js";
import { t as User } from "../../../../chunks/user.js";
import { t as page } from "../../../../chunks/state.js";
import "../../../../chunks/utils2.js";
import { t as Button } from "../../../../chunks/button.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../../chunks/avatar.js";
import { t as Input } from "../../../../chunks/input.js";
import { t as Separator } from "../../../../chunks/separator.js";
import { a as Card, i as Card_content, n as Card_header, r as Card_description, t as Card_title } from "../../../../chunks/card.js";
import { t as Label } from "../../../../chunks/label.js";
import "../../../../chunks/loading-spinner.js";
import "../../../../chunks/client2.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/camera.svelte
function Camera($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "camera" },
		props,
		{ iconNode: [["path", { "d": "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" }], ["circle", {
			"cx": "12",
			"cy": "13",
			"r": "3"
		}]] }
	]));
}
//#endregion
//#region src/lib/authentication/image-cropper.ts
var getFileFromUrl = async (url, name = "image.png") => {
	const blob = await (await fetch(url)).blob();
	return new File([blob], name, { type: blob.type });
};
//#endregion
//#region src/lib/authentication/ui/user-profile-image-cropper.svelte
function User_profile_image_cropper($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { src, onCropped } = $$props;
		$$renderer.push(`<div role="button" tabindex="0" aria-label="Change profile picture" class="relative group cursor-pointer inline-block">`);
		Avatar($$renderer, {
			class: "h-24 w-24 border-2 border-border transition-opacity group-hover:opacity-80",
			children: ($$renderer) => {
				Avatar_image($$renderer, { src });
				$$renderer.push(`<!----> `);
				Avatar_fallback($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!---->User`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">`);
		Camera($$renderer, { class: "h-6 w-6 text-white" });
		$$renderer.push(`<!----></div> <input type="file" accept="image/*" class="hidden"/></div>`);
	});
}
//#endregion
//#region src/lib/authentication/imageresize.ts
function resizeImage(file, options = {}) {
	const { maxWidth = 800, maxHeight = 800, quality = .8, format = "jpeg" } = options;
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();
		img.onload = () => {
			let width = img.width, height = img.height;
			if (width > maxWidth) {
				height = height * maxWidth / width;
				width = maxWidth;
			}
			if (height > maxHeight) {
				width = width * maxHeight / height;
				height = maxHeight;
			}
			canvas.width = Math.floor(width);
			canvas.height = Math.floor(height);
			ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => {
				if (blob) resolve(new File([blob], file.name, {
					type: `image/${format}`,
					lastModified: Date.now()
				}));
				else reject(/* @__PURE__ */ new Error("Failed to compress image"));
			}, `image/${format}`, quality);
		};
		img.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load image"));
		img.src = URL.createObjectURL(file);
	});
}
//#endregion
//#region src/lib/authentication/ui/update-user-form.svelte
function Update_user_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let saving = false;
		let image = null;
		let user = derived(() => page.data.session?.user);
		const onCropped = async (url) => {
			image = await resizeImage(await getFileFromUrl(url));
		};
		$$renderer.push(`<form class="w-full">`);
		Card($$renderer, {
			class: "shadow-sm",
			children: ($$renderer) => {
				Card_header($$renderer, {
					class: "pb-6 text-center",
					children: ($$renderer) => {
						$$renderer.push(`<div class="mb-4 flex justify-center">`);
						User_profile_image_cropper($$renderer, {
							src: image ? URL.createObjectURL(image) : user().image,
							onCropped
						});
						$$renderer.push(`<!----></div> `);
						Card_title($$renderer, {
							class: "text-xl",
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(user().name || user().email)}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Card_description($$renderer, {
							class: "capitalize",
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(user()?.role)}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					class: "space-y-6",
					children: ($$renderer) => {
						$$renderer.push(`<div class="space-y-2">`);
						Label($$renderer, {
							for: "name",
							class: "flex items-center gap-2",
							children: ($$renderer) => {
								User($$renderer, { class: "h-4 w-4" });
								$$renderer.push(`<!----> Name`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Input($$renderer, {
							id: "name",
							name: "name",
							value: user().name,
							placeholder: "Enter your name"
						});
						$$renderer.push(`<!----></div> <div class="space-y-2">`);
						Label($$renderer, {
							for: "email",
							class: "flex items-center gap-2",
							children: ($$renderer) => {
								Mail($$renderer, { class: "h-4 w-4" });
								$$renderer.push(`<!----> Email`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Input($$renderer, {
							id: "email",
							type: "email",
							value: user().email,
							disabled: true,
							class: "bg-muted text-muted-foreground"
						});
						$$renderer.push(`<!----> <p class="text-xs text-muted-foreground">Email cannot be changed directly.</p></div> <div class="pt-4">`);
						Button($$renderer, {
							type: "submit",
							disabled: saving,
							class: "w-full sm:w-fit",
							size: "lg",
							children: ($$renderer) => {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`Save Changes`);
								$$renderer.push(`<!--]-->`);
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
		$$renderer.push(`<!----></form>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/change-password-form.svelte
function Change_password_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let isPending = false;
		let showPassword = false;
		$$renderer.push(`<form class="w-full">`);
		Card($$renderer, {
			class: "shadow-sm",
			children: ($$renderer) => {
				Card_header($$renderer, {
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "flex items-center gap-2",
							children: ($$renderer) => {
								Lock($$renderer, { class: "size-4" });
								$$renderer.push(`<!----> Security`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Card_description($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<!---->Update your password to keep your account secure.`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					class: "space-y-4",
					children: ($$renderer) => {
						$$renderer.push(`<div class="space-y-2">`);
						Label($$renderer, {
							for: "password",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Current Password`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Input($$renderer, {
							id: "password",
							name: "password",
							type: showPassword ? "text" : "password",
							required: true
						});
						$$renderer.push(`<!----></div> <div class="space-y-2">`);
						Label($$renderer, {
							for: "newPassword",
							children: ($$renderer) => {
								$$renderer.push(`<!---->New Password`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> <div class="relative">`);
						Input($$renderer, {
							id: "newPassword",
							name: "newPassword",
							type: showPassword ? "text" : "password",
							required: true,
							class: "pr-10"
						});
						$$renderer.push(`<!----> `);
						Button($$renderer, {
							onclick: () => showPassword = !showPassword,
							class: "absolute right-0 top-0 h-full px-3",
							variant: "ghost",
							size: "icon",
							children: ($$renderer) => {
								if (showPassword) {
									$$renderer.push("<!--[0-->");
									Eye($$renderer, { class: "size-4" });
								} else {
									$$renderer.push("<!--[-1-->");
									Eye_off($$renderer, { class: "size-4" });
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div></div> `);
						Button($$renderer, {
							type: "submit",
							disabled: isPending,
							children: ($$renderer) => {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> Change Password`);
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
		$$renderer.push(`<!----></form>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/pages/user-profile.svelte
function User_profile($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		derived(() => page.data.session?.user?.id.includes(Constants.CREDENTIAL));
		$$renderer.push(`<div class="container max-w-4xl py-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"><div class="flex flex-col gap-2"><h1 class="text-3xl font-bold tracking-tight">Profile Settings</h1> <p class="text-muted-foreground">Manage your account information and preferences.</p></div> `);
		Separator($$renderer, {});
		$$renderer.push(`<!----> <div class="grid gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]"><div class="space-y-6">`);
		Update_user_form($$renderer, {});
		$$renderer.push(`<!----> `);
		Change_password_form($$renderer, {});
		$$renderer.push(`<!----></div> <div class="space-y-6"></div></div></div>`);
	});
}
//#endregion
//#region src/routes/(protected)/profile/+page.svelte
function _page($$renderer) {
	User_profile($$renderer, {});
}
//#endregion
export { _page as default };
