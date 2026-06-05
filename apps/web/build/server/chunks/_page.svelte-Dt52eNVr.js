import { aA as head, au as escape_html, as as ensure_array_like } from './ui-libs-BjzLDLAh.js';
import './button-DY9ayrhs.js';
import { C as Card, a as Card_content } from './card-DVq40lxr.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';

//#region src/routes/(app)/terms/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const sections = [
			{
				title: "1. Acceptance of Terms",
				content: `By accessing and using Sephar Studios, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`
			},
			{
				title: "2. User Accounts",
				content: `You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.`
			},
			{
				title: "3. Subscription Services",
				content: `Various subscription plans are available. Payment terms and conditions apply. Cancellation policies and refund terms are subject to the specific subscription plan.`
			},
			{
				title: "4. Content Usage",
				content: `Content on Sephar Studios is for personal, non-commercial use only. You may not download, copy, reproduce, distribute, or modify content without explicit permission.`
			},
			{
				title: "5. Faith-Based Guidelines",
				content: `All content must align with Christian teachings and values. We reserve the right to remove content that contradicts these principles.`
			},
			{
				title: "6. User Conduct",
				content: `Users must engage respectfully and constructively. Harassment, hate speech, or disruptive behavior will not be tolerated.`
			},
			{
				title: "7. Privacy",
				content: `Your privacy is important. Our Privacy Policy details how we collect, use, and protect your information.`
			},
			{
				title: "8. Content Moderation",
				content: `We reserve the right to moderate, edit, or remove content that violates our guidelines or terms of service.`
			},
			{
				title: "9. Intellectual Property",
				content: `All content on Sephar Studios is protected by copyright and other intellectual property rights.`
			},
			{
				title: "10. Termination",
				content: `We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion.`
			},
			{
				title: "11. Pay-Per-View (PPV) Purchases & Refunds",
				content: `PPV purchases are one-time payments that unlock access to the specific title. PPV purchases are non-refundable once playback has started. If playback never starts due to a verified platform-side failure, you may request a refund within 48 hours of purchase. Approved refunds are returned to the original Paystack payment method.`
			}
		];
		head("e48t45", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Terms of Service | Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Read our Terms of Service to understand your rights and responsibilities when using Sephar Studios."/>`);
		});
		$$renderer.push(`<main class="container mx-auto px-4 pt-32 pb-16"><section class="space-y-6 pb-24"><h1 class="text-4xl font-bold tracking-tight">Terms of Service</h1> <p class="text-muted-foreground">Last updated: ${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString())}</p> <div class="space-y-8"><!--[-->`);
		const each_array = ensure_array_like(sections);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let section = each_array[$$index];
			Card($$renderer, {
				class: "border border-gray-800 bg-background/50",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6",
						children: ($$renderer) => {
							$$renderer.push(`<h2 class="text-2xl font-semibold mb-4">${escape_html(section.title)}</h2> <p class="text-muted-foreground">${escape_html(section.content)}</p>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--></div> <div class="pt-12"><h2 class="text-2xl font-semibold mb-4">Contact Us</h2> <p class="text-muted-foreground">If you have any questions about these Terms of Service, please contact us at: <a href="mailto:info@sepharstudios.com" class="text-primary hover:underline">info@sepharstudios.com</a></p></div></section></main>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Dt52eNVr.js.map
