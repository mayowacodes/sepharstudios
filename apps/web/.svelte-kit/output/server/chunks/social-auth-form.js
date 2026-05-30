import { At as clsx, jt as escape_html, ut as attr_class } from "./ui-libs.js";
import { t as Constants } from "./constants.js";
import { t as cn } from "./utils2.js";
import { t as Button } from "./button.js";
import { r as Card_description, t as Card_title } from "./card.js";
import { t as Loading_spinner } from "./loading-spinner.js";
import { n as handleSocialSignin, t as getRedirectUrl } from "./client2.js";
//#region src/lib/authentication/ui/auth-card-header.svelte
function Auth_card_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { title, description, class: className } = $$props;
		$$renderer.push(`<div${attr_class(clsx(className))}><a href="/" class="flex items-center gap-2 self-center font-medium"><div class="flex flex-col">`);
		if (Card_title) {
			$$renderer.push("<!--[-->");
			Card_title($$renderer, {
				class: "text-xl",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(title)} ${escape_html(Constants.BRANDNAME)}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(` `);
		if (Card_description) {
			$$renderer.push("<!--[-->");
			Card_description($$renderer, {
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
		$$renderer.push(`</div></a></div>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/google-icon.svelte
function Google_icon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className } = $$props;
		$$renderer.push(`<svg${attr_class(clsx(cn("mr-2 h-4 w-4", className)))} viewBox="-0.5 0 48 48"><path d="m 9.8272727,24 c 0,-1.524267 0.2531593,-2.9856 0.7050003,-4.356267 L 2.6234546,13.604267 C 1.0820682,16.733867 0.21363636,20.260267 0.21363636,24 c 0,3.736533 0.86736364,7.2608 2.40661364,10.388267 l 7.904546,-6.0512 C 10.077227,26.9728 9.8272727,25.5168 9.8272727,24" fill="#fbbc05" style="fill-rule:evenodd"></path><path d="m 23.713636,10.133333 c 3.311364,0 6.302273,1.173334 8.652273,3.093334 L 39.202273,6.4 C 35.036364,2.7733333 29.695454,0.53333333 23.713636,0.53333333 c -9.286772,0 -17.2682269,5.31093337 -21.0901814,13.07093367 l 7.9088184,6.039466 c 1.822318,-5.531733 7.016886,-9.5104 13.181363,-9.5104" fill="#eb4335" style="fill-rule:evenodd"></path><path d="m 23.713636,37.866667 c -6.164477,0 -11.359045,-3.978667 -13.181363,-9.5104 l -7.9088184,6.0384 c 3.8219545,7.761066 11.8034094,13.072 21.0901814,13.072 5.731864,0 11.204159,-2.0352 15.311318,-5.848534 L 31.517773,35.8144 c -2.118205,1.3344 -4.785455,2.052267 -7.804137,2.052267" fill="#34a853" style="fill-rule:evenodd"></path><path d="m 46.145454,24 c 0,-1.386667 -0.213636,-2.88 -0.53409,-4.266667 H 23.713636 V 28.8 h 12.604546 c -0.630228,3.0912 -2.345728,5.467733 -4.800409,7.0144 l 7.507181,5.803733 C 43.339341,37.613867 46.145454,31.649067 46.145454,24" fill="#4285f4" style="fill-rule:evenodd"></path></svg>`);
	});
}
//#endregion
//#region src/lib/authentication/ui/social-auth-form.svelte
function Social_auth_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { text } = $$props;
		let isSocialLoading = false;
		const callbackURL = getRedirectUrl();
		const handleSocial = async () => {
			isSocialLoading = true;
			await handleSocialSignin("google", callbackURL);
			isSocialLoading = false;
		};
		$$renderer.push(`<div class="flex flex-col gap-4">`);
		Button($$renderer, {
			variant: "outline",
			class: "w-full",
			type: "button",
			disabled: isSocialLoading,
			onclick: handleSocial,
			children: ($$renderer) => {
				if (isSocialLoading) {
					$$renderer.push("<!--[0-->");
					Loading_spinner($$renderer, {});
					$$renderer.push(`<!---->Loading...`);
				} else {
					$$renderer.push("<!--[-1-->");
					Google_icon($$renderer, {});
					$$renderer.push(`<!---->${escape_html(text)}`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { Auth_card_header as n, Social_auth_form as t };
