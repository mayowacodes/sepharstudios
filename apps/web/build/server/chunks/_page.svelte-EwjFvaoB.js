import { ah as attr, as as ensure_array_like, au as escape_html } from './ui-libs-BjzLDLAh.js';
import { W as Wrench } from './wrench-COyHjEdl.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(creator)/creator/tech-support/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let ticketForm = {
			subject: "",
			category: "",
			priority: "normal",
			description: "",
			email: "",
			attachments: []
		};
		let isSubmitting = false;
		const categories = [
			{
				value: "video-playback",
				label: "Upload / Playback Issues"
			},
			{
				value: "streaming-quality",
				label: "Video Quality Problems"
			},
			{
				value: "audio-issues",
				label: "Audio Issues"
			},
			{
				value: "login",
				label: "Account Access"
			},
			{
				value: "profile",
				label: "Profile / Analytics Problems"
			},
			{
				value: "monetization",
				label: "Monetization Issues"
			},
			{
				value: "payments",
				label: "Payment Issues"
			},
			{
				value: "mobile",
				label: "Mobile App Problems"
			},
			{
				value: "other",
				label: "Other Technical Issue"
			}
		];
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		PageHeader($$renderer, {
			icon: Wrench,
			title: "Technical Support",
			subtitle: "Get personalized help from our technical support team."
		});
		$$renderer.push(`<!----> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-blue-600/20 border border-blue-600 rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-4">🔍 Quick Solutions</h2> <p class="text-blue-200 mb-4">Before submitting a ticket, try these common solutions that resolve 80% of technical issues:</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="surface-1 rounded-lg p-4"><h3 class="text-foreground font-medium mb-2">🔄 Clear Browser Cache</h3> <p class="text-blue-200 text-sm mb-2">Fixes most dashboard and upload issues</p> <button class="text-blue-300 hover:text-blue-100 text-sm">How to clear cache →</button></div> <div class="surface-1 rounded-lg p-4"><h3 class="text-foreground font-medium mb-2">📱 Try Different Browser</h3> <p class="text-blue-200 text-sm mb-2">Switch to Chrome, Firefox, or Safari</p> <button class="text-blue-300 hover:text-blue-100 text-sm">Supported browsers →</button></div> <div class="surface-1 rounded-lg p-4"><h3 class="text-foreground font-medium mb-2">🔌 Check Internet Connection</h3> <p class="text-blue-200 text-sm mb-2">Ensure stable connection for uploads</p> <button class="text-blue-300 hover:text-blue-100 text-sm">Connection test →</button></div> <div class="surface-1 rounded-lg p-4"><h3 class="text-foreground font-medium mb-2">📚 Browse Help Articles</h3> <p class="text-blue-200 text-sm mb-2">Step-by-step guides for common issues</p> <a href="/creator/support" class="text-blue-300 hover:text-blue-100 text-sm">View help center →</a></div></div></div> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><h2 class="text-xl font-bold text-foreground mb-6">🎫 Submit Support Ticket</h2> <form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="email-input" class="block text-foreground font-medium mb-2">Email Address *</label> <input id="email-input" type="email"${attr("value", ticketForm.email)} placeholder="your.email@example.com" class="w-full px-4 py-3 surface-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-purple-500" required=""/></div> <div><label for="priority-select" class="block text-foreground font-medium mb-2">Priority Level</label> `);
			$$renderer.select({
				id: "priority-select",
				value: ticketForm.priority,
				class: "w-full px-4 py-3 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500"
			}, ($$renderer) => {
				$$renderer.option({ value: "low" }, ($$renderer) => {
					$$renderer.push(`🟢 Low - General question`);
				});
				$$renderer.option({ value: "normal" }, ($$renderer) => {
					$$renderer.push(`🟡 Normal - Issue affecting workflow`);
				});
				$$renderer.option({ value: "high" }, ($$renderer) => {
					$$renderer.push(`🟠 High - Can't upload or access account`);
				});
				$$renderer.option({ value: "urgent" }, ($$renderer) => {
					$$renderer.push(`🔴 Urgent - Critical system failure`);
				});
			});
			$$renderer.push(`</div></div> <div><label for="category-select" class="block text-foreground font-medium mb-2">Issue Category *</label> `);
			$$renderer.select({
				id: "category-select",
				value: ticketForm.category,
				class: "w-full px-4 py-3 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500",
				required: true
			}, ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`Select a category...`);
				});
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(categories);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let category = each_array[$$index];
					$$renderer.option({ value: category.value }, ($$renderer) => {
						$$renderer.push(`${escape_html(category.label)}`);
					});
				}
				$$renderer.push(`<!--]-->`);
			});
			$$renderer.push(`</div> <div><label for="subject-input" class="block text-foreground font-medium mb-2">Subject *</label> <input id="subject-input" type="text"${attr("value", ticketForm.subject)} placeholder="Brief description of your issue" class="w-full px-4 py-3 surface-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-purple-500" required=""/></div> <div><label for="description-textarea" class="block text-foreground font-medium mb-2">Detailed Description *</label> <textarea id="description-textarea" rows="6" placeholder="Please provide as much detail as possible:
- What were you trying to do?
- What exactly happened?
- What did you expect to happen?
- When did this issue start?
- Are there any error messages?" class="w-full px-4 py-3 surface-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-purple-500" required="">`);
			const $$body = escape_html(ticketForm.description);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div> <div><label for="file-upload" class="block text-foreground font-medium mb-2">Attachments (Optional)</label> <div class="border-2 border-dashed border-border rounded-lg p-6 text-center"><input type="file" multiple="" accept="image/*,.pdf,.txt,.log" class="hidden" id="file-upload"/> <label for="file-upload" class="cursor-pointer"><div class="text-4xl mb-2">📎</div> <p class="text-foreground/80 mb-2">Click to attach files</p> <p class="text-muted-foreground text-sm">Screenshots, error logs, or other relevant files (Max 10MB each)</p></label></div> `);
			if (ticketForm.attachments.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-4 space-y-2"><!--[-->`);
				const each_array_1 = ensure_array_like(ticketForm.attachments);
				for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
					let file = each_array_1[index];
					$$renderer.push(`<div class="flex items-center justify-between surface-1 rounded-lg p-3"><span class="text-foreground text-sm">${escape_html(file.name)}</span> <button type="button" class="text-red-400 hover:text-red-300">✕</button></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4"><h3 class="text-foreground font-medium mb-2">📋 System Information</h3> <p class="text-yellow-200 text-sm mb-3">This information helps us diagnose your issue faster:</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div class="space-y-1"><div class="text-yellow-200">Browser: <span class="text-foreground">Chrome 120.0</span></div> <div class="text-yellow-200">OS: <span class="text-foreground">Windows 11</span></div></div> <div class="space-y-1"><div class="text-yellow-200">Screen: <span class="text-foreground">1920x1080</span></div> <div class="text-yellow-200">Connection: <span class="text-foreground">Broadband</span></div></div></div></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex items-center justify-between"><div class="text-muted-foreground text-sm">* Required fields</div> <button type="button"${attr("disabled", isSubmitting, true)} class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2">`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span>🎫</span> <span>Submit Ticket</span>`);
			$$renderer.push(`<!--]--></button></div></form></div>`);
		}
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="text-3xl mb-3">💬</div> <h3 class="text-lg font-bold text-foreground mb-2">Live Chat</h3> <p class="text-foreground/80 text-sm mb-4">Get instant help during business hours. Perfect for quick questions and urgent issues.</p> <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">Start Chat</button></div> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="text-3xl mb-3">📧</div> <h3 class="text-lg font-bold text-foreground mb-2">Email Support</h3> <p class="text-foreground/80 text-sm mb-4">Send detailed questions or issues directly to our support team via email.</p> <a href="mailto:support@sepharstudios.com" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-center block">Send Email</a></div> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><div class="text-3xl mb-3">👥</div> <h3 class="text-lg font-bold text-foreground mb-2">Community Forum</h3> <p class="text-foreground/80 text-sm mb-4">Get help from other creators who may have faced similar issues.</p> <a href="/creator/forum" class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-center block">Visit Forum</a></div></div> <div class="bg-red-600/20 border border-red-600 rounded-xl p-4"><h3 class="text-lg font-bold text-foreground mb-2 flex items-center"><span class="mr-2">🚨</span> Emergency Support</h3> <p class="text-red-200 text-sm">For critical issues affecting live streams or urgent ministry needs outside business hours: <strong class="block mt-1">Call: (555) 123-HELP</strong> Available 24/7 for genuine emergencies only.</p></div> <div class="surface-2 backdrop-blur-sm rounded-xl p-6"><h3 class="text-lg font-bold text-foreground mb-4">🕒 Support Hours &amp; Response Times</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h4 class="text-foreground font-medium mb-3">Business Hours</h4> <div class="space-y-1 text-sm text-foreground/80"><div>Monday - Friday: 9:00 AM - 6:00 PM EST</div> <div>Saturday: 10:00 AM - 4:00 PM EST</div> <div>Sunday: Closed (Emergency support only)</div></div></div> <div><h4 class="text-foreground font-medium mb-3">Response Times</h4> <div class="space-y-1 text-sm text-foreground/80"><div>🔴 Urgent: Within 1 hour</div> <div>🟠 High: Within 2-4 hours</div> <div>🟡 Medium: Within 4-8 hours</div> <div>🟢 Low: Within 24 hours</div></div></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-EwjFvaoB.js.map
