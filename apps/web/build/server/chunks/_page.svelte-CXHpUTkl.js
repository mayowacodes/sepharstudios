import { aO as spread_props, as as ensure_array_like, au as escape_html, ap as derived } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { M as Mail } from './mail-Dk9lSnDl.js';
import { U as User } from './user-DvE0JuLE.js';
import './auth-client-Cjc1-W_A.js';
import { p as page } from './state-D0xWVGEE.js';
import { I as Input } from './input-yLzKHphO.js';
import { S as Separator } from './separator-CgNbu_BW.js';
import { B as Button } from './button-DY9ayrhs.js';
import { A as Avatar, b as Avatar_image, a as Avatar_fallback } from './avatar-DPaitGv5.js';
import { C as Card, c as Card_header, d as Card_title, b as Card_description, a as Card_content } from './card-DVq40lxr.js';
import { L as Label } from './label-DNCU-Jw_.js';
import './toast-state.svelte-Cuuior_F.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import './string-DVvRuJqu.js';
import './constants-BEpeHz1K.js';
import './file-text-C_v9vOk2.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './users-B-WaIXgI.js';
import './client-Bo2aevGq.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';

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
//#region src/lib/authentication/ui/user-profile-image-cropper.svelte
function User_profile_image_cropper($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { src} = $$props;
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
//#region src/lib/authentication/ui/update-user-form.svelte
function Update_user_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let saving = false;
		let user = derived(() => page.data.session?.user);
		$$renderer.push(`<form class="w-full">`);
		Card($$renderer, {
			class: "shadow-sm",
			children: ($$renderer) => {
				Card_header($$renderer, {
					class: "pb-6 text-center",
					children: ($$renderer) => {
						$$renderer.push(`<div class="mb-4 flex justify-center">`);
						User_profile_image_cropper($$renderer, {
							src: user().image});
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
//#region src/lib/authentication/ui/pages/user-profile.svelte
function User_profile($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let providers = [];
		function providerLabel(id) {
			if (id === "credential") return "Email + password";
			return id.charAt(0).toUpperCase() + id.slice(1);
		}
		$$renderer.push(`<div class="container max-w-4xl py-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"><div class="flex flex-col gap-2"><h1 class="text-3xl font-bold tracking-tight">Profile Settings</h1> <p class="text-muted-foreground">Manage your account information and preferences.</p></div> `);
		Separator($$renderer, {});
		$$renderer.push(`<!----> <div class="grid gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]"><div class="space-y-6">`);
		Update_user_form($$renderer);
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<!--]--></div> <div class="space-y-6">`);
		if (providers.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="border border-border rounded-lg p-5"><h3 class="text-base font-semibold mb-3">Linked sign-in methods</h3> <ul class="space-y-1.5 text-sm"><!--[-->`);
			const each_array = ensure_array_like(providers);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let p = each_array[$$index];
				$$renderer.push(`<li class="flex items-center justify-between"><span class="text-foreground">${escape_html(providerLabel(p))}</span> <span class="text-xs text-muted-foreground">linked</span></li>`);
			}
			$$renderer.push(`<!--]--></ul></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
//#region src/routes/(protected)/profile/+page.svelte
function _page($$renderer) {
	User_profile($$renderer);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CXHpUTkl.js.map
