import { at as head, an as escape_html, al as ensure_array_like } from './ui-libs-TtGtWAGI.js';
import { C as Card, a as Card_content } from './card-DdzYeJGJ.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-C8dWVCac.js';

//#region src/routes/(app)/privacy/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const sections = [
			{
				title: "Information We Collect",
				content: [
					{
						subtitle: "Personal Information",
						details: "Name, email address, payment information, and account preferences."
					},
					{
						subtitle: "Usage Data",
						details: "Viewing history, search queries, device information, and interaction with content."
					},
					{
						subtitle: "Technical Data",
						details: "IP address, browser type, device ID, and system information."
					}
				]
			},
			{
				title: "How We Use Your Information",
				content: [
					{
						subtitle: "Service Provision",
						details: "To provide and maintain our streaming service, process payments, and personalize content recommendations."
					},
					{
						subtitle: "Communication",
						details: "To send service updates, newsletters, and respond to your inquiries."
					},
					{
						subtitle: "Analytics",
						details: "To improve our services, content offerings, and user experience."
					}
				]
			},
			{
				title: "Data Protection",
				content: [{
					subtitle: "Security Measures",
					details: "We implement industry-standard security measures to protect your data."
				}, {
					subtitle: "Data Retention",
					details: "We retain your data only for as long as necessary to provide our services."
				}]
			},
			{
				title: "Your Rights",
				content: [{
					subtitle: "Access and Control",
					details: "You have the right to access, correct, or delete your personal information."
				}, {
					subtitle: "Cookie Preferences",
					details: "You can manage your cookie preferences through your browser settings."
				}]
			}
		];
		head("xyq2mm", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Privacy Policy | Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Learn how Sephar Studios collects, uses, and protects your personal information."/>`);
		});
		$$renderer.push(`<main class="container mx-auto px-4 pt-32 pb-16"><section class="space-y-6 pb-24"><h1 class="text-4xl font-bold tracking-tight">Privacy Policy</h1> <p class="text-muted-foreground">Last updated: ${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString())}</p> <p class="text-muted-foreground">At Sephar Studios, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p> <div class="space-y-8"><!--[-->`);
		const each_array = ensure_array_like(sections);
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let section = each_array[$$index_1];
			Card($$renderer, {
				class: "border border-gray-800 bg-background/50",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6",
						children: ($$renderer) => {
							$$renderer.push(`<h2 class="text-2xl font-semibold mb-4">${escape_html(section.title)}</h2> <div class="space-y-6"><!--[-->`);
							const each_array_1 = ensure_array_like(section.content);
							for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
								let item = each_array_1[$$index];
								$$renderer.push(`<div><h3 class="text-lg font-medium mb-2">${escape_html(item.subtitle)}</h3> <p class="text-muted-foreground">${escape_html(item.details)}</p></div>`);
							}
							$$renderer.push(`<!--]--></div>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--></div> <div class="pt-12"><h2 class="text-2xl font-semibold mb-4">Contact Us</h2> <p class="text-muted-foreground">If you have any questions about our Privacy Policy, please contact us at: <a href="mailto:info@sepharstudios.com" class="text-primary hover:underline">info@sepharstudios.com</a></p></div></section></main>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CEaMSiz1.js.map
