import { Et as derived, kt as head } from "../../../../../chunks/ui-libs.js";
import "../../../../../chunks/Icon.js";
import "../../../../../chunks/camera.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Circle_x } from "../../../../../chunks/circle-x.js";
import { t as Clock } from "../../../../../chunks/clock.js";
import "../../../../../chunks/external-link.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
import { t as Loader_circle } from "../../../../../chunks/loader-circle.js";
import "../../../../../chunks/upload.js";
import "../../../../../chunks/user.js";
import "../../../../../chunks/x.js";
import "../../../../../chunks/input.js";
import "../../../../../chunks/button.js";
import "../../../../../chunks/label.js";
import "../../../../../chunks/textarea.js";
//#endregion
//#region src/routes/(app)/apply/creator/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let applicationStatus = "new";
		let formData = {
			creatorType: "individual",
			displayName: "",
			legalName: "",
			organizationName: "",
			organizationType: "",
			organizationWebsite: "",
			organizationAddress: "",
			taxId: "",
			contactEmail: "",
			contactPhone: "",
			bio: "",
			portfolioUrl: "",
			socialLinks: {
				youtube: "",
				facebook: "",
				instagram: "",
				twitter: "",
				website: "",
				podcast: ""
			},
			documents: []
		};
		derived(() => formData.creatorType === "organization");
		derived(() => () => {
			switch (applicationStatus) {
				case "approved": return {
					icon: Circle_check,
					color: "#22c55e",
					bg: "rgba(34,197,94,0.1)",
					border: "rgba(34,197,94,0.3)",
					label: "Approved",
					message: "Your account is approved. You can access the creator portal."
				};
				case "rejected": return {
					icon: Circle_x,
					color: "#ef4444",
					bg: "rgba(239,68,68,0.1)",
					border: "rgba(239,68,68,0.3)",
					label: "Rejected",
					message: "Your last application was rejected. You can update and resubmit."
				};
				case "pending": return {
					icon: Clock,
					color: "hsl(var(--secondary))",
					bg: "rgba(255,191,0,0.08)",
					border: "rgba(255,191,0,0.3)",
					label: "Under Review",
					message: "Your application is under review. We'll notify you soon."
				};
				default: return {
					icon: File_text,
					color: "hsl(var(--primary))",
					bg: "rgba(255,94,14,0.08)",
					border: "rgba(255,94,14,0.25)",
					label: "New Application",
					message: "Complete the form below and submit your application."
				};
			}
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1fblyd", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Creator Application - Sephar Studios</title>`);
				});
				$$renderer.push(`<meta name="description" content="Apply to publish content on Sephar Studios as an individual creator or organisation."/>`);
			});
			$$renderer.push(`<div class="apply-page svelte-1fblyd"><div class="page-header svelte-1fblyd"><div class="header-eyebrow svelte-1fblyd"><span class="eyebrow-dot svelte-1fblyd"></span> <span>Creator Programme</span></div> <h1 class="page-title svelte-1fblyd">Creator Application</h1> <p class="page-subtitle svelte-1fblyd">Apply to publish content on Sephar Studios as an individual or organisation.</p></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="loading-state svelte-1fblyd">`);
			Loader_circle($$renderer, { class: "spin-icon" });
			$$renderer.push(`<!----> <span>Loading application…</span></div>`);
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
