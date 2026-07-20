import { Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Save } from "../../../../../chunks/save.js";
import { t as User } from "../../../../../chunks/user.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
//#region src/routes/(creator)/creator/profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let profileData = {
			creatorType: "individual",
			personalInfo: {
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				bio: "",
				profileImage: ""
			},
			ministryInfo: {
				ministryName: "",
				ministryWebsite: "",
				denomination: "",
				yearsInMinistry: "",
				ministryDescription: "",
				ministryAddress: "",
				isVerified: false,
				verificationDocuments: []
			},
			socialLinks: {
				youtube: "",
				facebook: "",
				instagram: "",
				twitter: "",
				website: "",
				podcast: ""
			},
			preferences: {
				publicProfile: true,
				emailNotifications: true,
				reviewNotifications: true,
				marketingEmails: false,
				showContactInfo: false
			}
		};
		let isSaving = false;
		let saveStatus = "";
		async function saveProfile() {
			isSaving = true;
			saveStatus = "";
			try {
				if (!(await fetch("/api/creator/profile", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(profileData)
				})).ok) throw new Error("Failed to save profile");
				saveStatus = "success";
				setTimeout(() => saveStatus = "", 3e3);
			} catch (error) {
				saveStatus = "error";
				setTimeout(() => saveStatus = "", 3e3);
			} finally {
				isSaving = false;
			}
		}
		$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-5xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: saveProfile,
					disabled: isSaving,
					loading: isSaving,
					children: ($$renderer) => {
						if (!isSaving) {
							$$renderer.push("<!--[0-->");
							Save($$renderer, { class: "w-3.5 h-3.5" });
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> ${escape_html(isSaving ? "Saving…" : "Save")}`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Identity",
				title: "Creator profile",
				subtitle: "Manage your profile and ministry information.",
				icon: User,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		if (saveStatus === "success") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-green-600/20 border border-green-600 rounded-lg p-4"><div class="text-green-200 flex items-center"><span class="mr-2">✅</span> Profile updated successfully!</div></div>`);
		} else if (saveStatus === "error") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-red-600/20 border border-red-600 rounded-lg p-4"><div class="text-red-200 flex items-center"><span class="mr-2">❌</span> Failed to save profile. Please try again.</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-foreground ml-4">Loading profile...</p></div>`);
		$$renderer.push(`<!--]--> <div class="fixed bottom-0 inset-x-0 z-30 backdrop-blur-md border-t pointer-events-none" style="background: hsl(var(--portal-bg-elevated)/0.92); border-color: hsl(var(--portal-border));"><div class="mx-auto px-4 py-3 max-w-5xl flex items-center justify-between gap-3 pointer-events-auto"><div class="text-xs" style="color: hsl(var(--portal-text-muted));">`);
		if (saveStatus === "success") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span style="color: hsl(var(--portal-success));">Saved.</span>`);
		} else if (saveStatus === "error") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<span style="color: hsl(var(--portal-danger));">Save failed — try again.</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`Changes auto-save once you hit Save.`);
		}
		$$renderer.push(`<!--]--></div> `);
		PortalButton($$renderer, {
			variant: "primary",
			size: "md",
			onclick: saveProfile,
			disabled: isSaving,
			loading: isSaving,
			children: ($$renderer) => {
				if (!isSaving) {
					$$renderer.push("<!--[0-->");
					Save($$renderer, { class: "w-4 h-4" });
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> ${escape_html(isSaving ? "Saving…" : "Save changes")}`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> <div aria-hidden="true" class="h-20"></div></div>`);
	});
}
//#endregion
export { _page as default };
