import { u as attr, m as ensure_array_like, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(creator)/creator/tech-support/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let ticketForm = {
        subject: "",
        category: "",
        priority: "medium",
        description: "",
        email: "",
        attachments: []
      };
      let isSubmitting = false;
      const categories = [
        { value: "upload", label: "Upload Issues" },
        { value: "video-quality", label: "Video Quality Problems" },
        { value: "audio", label: "Audio Issues" },
        { value: "account", label: "Account Access" },
        { value: "analytics", label: "Analytics Problems" },
        { value: "monetization", label: "Monetization Issues" },
        { value: "mobile", label: "Mobile App Problems" },
        { value: "other", label: "Other Technical Issue" }
      ];
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 62, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 64, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 65, 4);
      $$renderer2.push(`Technical Support</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 66, 4);
      $$renderer2.push(`Get personalized help from our technical support team</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="bg-blue-600/20 border border-blue-600 rounded-xl p-6">`);
        push_element($$renderer2, "div", 71, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 72, 6);
        $$renderer2.push(`🔍 Quick Solutions</h2>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-200 mb-4">`);
        push_element($$renderer2, "p", 73, 6);
        $$renderer2.push(`Before submitting a ticket, try these common solutions that resolve 80% of technical issues:</p>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
        push_element($$renderer2, "div", 76, 6);
        $$renderer2.push(`<div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 77, 8);
        $$renderer2.push(`<h3 class="text-white font-medium mb-2">`);
        push_element($$renderer2, "h3", 78, 10);
        $$renderer2.push(`🔄 Clear Browser Cache</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-200 text-sm mb-2">`);
        push_element($$renderer2, "p", 79, 10);
        $$renderer2.push(`Fixes most dashboard and upload issues</p>`);
        pop_element();
        $$renderer2.push(` <button class="text-blue-300 hover:text-blue-100 text-sm">`);
        push_element($$renderer2, "button", 80, 10);
        $$renderer2.push(`How to clear cache →</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 82, 8);
        $$renderer2.push(`<h3 class="text-white font-medium mb-2">`);
        push_element($$renderer2, "h3", 83, 10);
        $$renderer2.push(`📱 Try Different Browser</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-200 text-sm mb-2">`);
        push_element($$renderer2, "p", 84, 10);
        $$renderer2.push(`Switch to Chrome, Firefox, or Safari</p>`);
        pop_element();
        $$renderer2.push(` <button class="text-blue-300 hover:text-blue-100 text-sm">`);
        push_element($$renderer2, "button", 85, 10);
        $$renderer2.push(`Supported browsers →</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 87, 8);
        $$renderer2.push(`<h3 class="text-white font-medium mb-2">`);
        push_element($$renderer2, "h3", 88, 10);
        $$renderer2.push(`🔌 Check Internet Connection</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-200 text-sm mb-2">`);
        push_element($$renderer2, "p", 89, 10);
        $$renderer2.push(`Ensure stable connection for uploads</p>`);
        pop_element();
        $$renderer2.push(` <button class="text-blue-300 hover:text-blue-100 text-sm">`);
        push_element($$renderer2, "button", 90, 10);
        $$renderer2.push(`Connection test →</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 92, 8);
        $$renderer2.push(`<h3 class="text-white font-medium mb-2">`);
        push_element($$renderer2, "h3", 93, 10);
        $$renderer2.push(`📚 Browse Help Articles</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-200 text-sm mb-2">`);
        push_element($$renderer2, "p", 94, 10);
        $$renderer2.push(`Step-by-step guides for common issues</p>`);
        pop_element();
        $$renderer2.push(` <a href="/creator/support" class="text-blue-300 hover:text-blue-100 text-sm">`);
        push_element($$renderer2, "a", 95, 10);
        $$renderer2.push(`View help center →</a>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 101, 4);
        $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-6">`);
        push_element($$renderer2, "h2", 102, 6);
        $$renderer2.push(`🎫 Submit Support Ticket</h2>`);
        pop_element();
        $$renderer2.push(` <form class="space-y-6">`);
        push_element($$renderer2, "form", 104, 6);
        $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 105, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 106, 10);
        $$renderer2.push(`<label for="email-input" class="block text-white font-medium mb-2">`);
        push_element($$renderer2, "label", 107, 12);
        $$renderer2.push(`Email Address *</label>`);
        pop_element();
        $$renderer2.push(` <input id="email-input" type="email"${attr("value", ticketForm.email)} placeholder="your.email@example.com" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" required/>`);
        push_element($$renderer2, "input", 108, 12);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 118, 10);
        $$renderer2.push(`<label for="priority-select" class="block text-white font-medium mb-2">`);
        push_element($$renderer2, "label", 119, 12);
        $$renderer2.push(`Priority Level</label>`);
        pop_element();
        $$renderer2.push(` `);
        $$renderer2.select(
          {
            id: "priority-select",
            value: ticketForm.priority,
            class: "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "low" }, ($$renderer4) => {
              $$renderer4.push(`🟢 Low - General question`);
            });
            $$renderer3.option({ value: "medium" }, ($$renderer4) => {
              $$renderer4.push(`🟡 Medium - Issue affecting workflow`);
            });
            $$renderer3.option({ value: "high" }, ($$renderer4) => {
              $$renderer4.push(`🟠 High - Can't upload or access account`);
            });
            $$renderer3.option({ value: "urgent" }, ($$renderer4) => {
              $$renderer4.push(`🔴 Urgent - Critical system failure`);
            });
          }
        );
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 133, 8);
        $$renderer2.push(`<label for="category-select" class="block text-white font-medium mb-2">`);
        push_element($$renderer2, "label", 134, 10);
        $$renderer2.push(`Issue Category *</label>`);
        pop_element();
        $$renderer2.push(` `);
        $$renderer2.select(
          {
            id: "category-select",
            value: ticketForm.category,
            class: "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500",
            required: true
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              $$renderer4.push(`Select a category...`);
            });
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(categories);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let category = each_array[$$index];
              $$renderer3.option({ value: category.value }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(category.label)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          }
        );
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 148, 8);
        $$renderer2.push(`<label for="subject-input" class="block text-white font-medium mb-2">`);
        push_element($$renderer2, "label", 149, 10);
        $$renderer2.push(`Subject *</label>`);
        pop_element();
        $$renderer2.push(` <input id="subject-input" type="text"${attr("value", ticketForm.subject)} placeholder="Brief description of your issue" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" required/>`);
        push_element($$renderer2, "input", 150, 10);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 160, 8);
        $$renderer2.push(`<label for="description-textarea" class="block text-white font-medium mb-2">`);
        push_element($$renderer2, "label", 161, 10);
        $$renderer2.push(`Detailed Description *</label>`);
        pop_element();
        $$renderer2.push(` <textarea id="description-textarea" rows="6" placeholder="Please provide as much detail as possible:
- What were you trying to do?
- What exactly happened?
- What did you expect to happen?
- When did this issue start?
- Are there any error messages?" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" required>`);
        push_element($$renderer2, "textarea", 162, 10);
        const $$body = escape_html(ticketForm.description);
        if ($$body) {
          $$renderer2.push(`${$$body}`);
        }
        $$renderer2.push(`</textarea>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 178, 8);
        $$renderer2.push(`<label for="file-upload" class="block text-white font-medium mb-2">`);
        push_element($$renderer2, "label", 179, 10);
        $$renderer2.push(`Attachments (Optional)</label>`);
        pop_element();
        $$renderer2.push(` <div class="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">`);
        push_element($$renderer2, "div", 180, 10);
        $$renderer2.push(`<input type="file" multiple accept="image/*,.pdf,.txt,.log" class="hidden" id="file-upload"/>`);
        push_element($$renderer2, "input", 181, 12);
        pop_element();
        $$renderer2.push(` <label for="file-upload" class="cursor-pointer">`);
        push_element($$renderer2, "label", 189, 12);
        $$renderer2.push(`<div class="text-4xl mb-2">`);
        push_element($$renderer2, "div", 190, 14);
        $$renderer2.push(`📎</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 mb-2">`);
        push_element($$renderer2, "p", 191, 14);
        $$renderer2.push(`Click to attach files</p>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-400 text-sm">`);
        push_element($$renderer2, "p", 192, 14);
        $$renderer2.push(`Screenshots, error logs, or other relevant files (Max 10MB each)</p>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (ticketForm.attachments.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="mt-4 space-y-2">`);
          push_element($$renderer2, "div", 197, 12);
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(ticketForm.attachments);
          for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
            let file = each_array_1[index];
            $$renderer2.push(`<div class="flex items-center justify-between bg-white/5 rounded-lg p-3">`);
            push_element($$renderer2, "div", 199, 16);
            $$renderer2.push(`<span class="text-white text-sm">`);
            push_element($$renderer2, "span", 200, 18);
            $$renderer2.push(`${escape_html(file.name)}</span>`);
            pop_element();
            $$renderer2.push(` <button type="button" class="text-red-400 hover:text-red-300">`);
            push_element($$renderer2, "button", 201, 18);
            $$renderer2.push(`✕</button>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">`);
        push_element($$renderer2, "div", 215, 8);
        $$renderer2.push(`<h3 class="text-white font-medium mb-2">`);
        push_element($$renderer2, "h3", 216, 10);
        $$renderer2.push(`📋 System Information</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-yellow-200 text-sm mb-3">`);
        push_element($$renderer2, "p", 217, 10);
        $$renderer2.push(`This information helps us diagnose your issue faster:</p>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">`);
        push_element($$renderer2, "div", 220, 10);
        $$renderer2.push(`<div class="space-y-1">`);
        push_element($$renderer2, "div", 221, 12);
        $$renderer2.push(`<div class="text-yellow-200">`);
        push_element($$renderer2, "div", 222, 14);
        $$renderer2.push(`Browser: <span class="text-white">`);
        push_element($$renderer2, "span", 222, 52);
        $$renderer2.push(`Chrome 120.0</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-yellow-200">`);
        push_element($$renderer2, "div", 223, 14);
        $$renderer2.push(`OS: <span class="text-white">`);
        push_element($$renderer2, "span", 223, 47);
        $$renderer2.push(`Windows 11</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-1">`);
        push_element($$renderer2, "div", 225, 12);
        $$renderer2.push(`<div class="text-yellow-200">`);
        push_element($$renderer2, "div", 226, 14);
        $$renderer2.push(`Screen: <span class="text-white">`);
        push_element($$renderer2, "span", 226, 51);
        $$renderer2.push(`1920x1080</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-yellow-200">`);
        push_element($$renderer2, "div", 227, 14);
        $$renderer2.push(`Connection: <span class="text-white">`);
        push_element($$renderer2, "span", 227, 55);
        $$renderer2.push(`Broadband</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between">`);
        push_element($$renderer2, "div", 233, 8);
        $$renderer2.push(`<div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 234, 10);
        $$renderer2.push(`* Required fields</div>`);
        pop_element();
        $$renderer2.push(` <button type="button"${attr("disabled", isSubmitting, true)} class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2">`);
        push_element($$renderer2, "button", 237, 10);
        {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 247, 14);
          $$renderer2.push(`🎫</span>`);
          pop_element();
          $$renderer2.push(` <span>`);
          push_element($$renderer2, "span", 248, 14);
          $$renderer2.push(`Submit Ticket</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</form>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
      push_element($$renderer2, "div", 298, 2);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 299, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 300, 6);
      $$renderer2.push(`💬</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 301, 6);
      $$renderer2.push(`Live Chat</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300 text-sm mb-4">`);
      push_element($$renderer2, "p", 302, 6);
      $$renderer2.push(`Get instant help during business hours. Perfect for quick questions and urgent issues.</p>`);
      pop_element();
      $$renderer2.push(` <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">`);
      push_element($$renderer2, "button", 305, 6);
      $$renderer2.push(`Start Chat</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 310, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 311, 6);
      $$renderer2.push(`📧</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 312, 6);
      $$renderer2.push(`Email Support</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300 text-sm mb-4">`);
      push_element($$renderer2, "p", 313, 6);
      $$renderer2.push(`Send detailed questions or issues directly to our support team via email.</p>`);
      pop_element();
      $$renderer2.push(` <a href="mailto:support@sepharstudios.com" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-center block">`);
      push_element($$renderer2, "a", 316, 6);
      $$renderer2.push(`Send Email</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 324, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 325, 6);
      $$renderer2.push(`👥</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 326, 6);
      $$renderer2.push(`Community Forum</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300 text-sm mb-4">`);
      push_element($$renderer2, "p", 327, 6);
      $$renderer2.push(`Get help from other creators who may have faced similar issues.</p>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/forum" class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-center block">`);
      push_element($$renderer2, "a", 330, 6);
      $$renderer2.push(`Visit Forum</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-red-600/20 border border-red-600 rounded-xl p-4">`);
      push_element($$renderer2, "div", 340, 2);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-2 flex items-center">`);
      push_element($$renderer2, "h3", 341, 4);
      $$renderer2.push(`<span class="mr-2">`);
      push_element($$renderer2, "span", 342, 6);
      $$renderer2.push(`🚨</span>`);
      pop_element();
      $$renderer2.push(` Emergency Support</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-red-200 text-sm">`);
      push_element($$renderer2, "p", 344, 4);
      $$renderer2.push(`For critical issues affecting live streams or urgent ministry needs outside business hours: <strong class="block mt-1">`);
      push_element($$renderer2, "strong", 346, 6);
      $$renderer2.push(`Call: (555) 123-HELP</strong>`);
      pop_element();
      $$renderer2.push(` Available 24/7 for genuine emergencies only.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 352, 2);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 353, 4);
      $$renderer2.push(`🕒 Support Hours &amp; Response Times</h3>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 354, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 355, 6);
      $$renderer2.push(`<h4 class="text-white font-medium mb-3">`);
      push_element($$renderer2, "h4", 356, 8);
      $$renderer2.push(`Business Hours</h4>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-1 text-sm text-gray-300">`);
      push_element($$renderer2, "div", 357, 8);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 358, 10);
      $$renderer2.push(`Monday - Friday: 9:00 AM - 6:00 PM EST</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 359, 10);
      $$renderer2.push(`Saturday: 10:00 AM - 4:00 PM EST</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 360, 10);
      $$renderer2.push(`Sunday: Closed (Emergency support only)</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 363, 6);
      $$renderer2.push(`<h4 class="text-white font-medium mb-3">`);
      push_element($$renderer2, "h4", 364, 8);
      $$renderer2.push(`Response Times</h4>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-1 text-sm text-gray-300">`);
      push_element($$renderer2, "div", 365, 8);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 366, 10);
      $$renderer2.push(`🔴 Urgent: Within 1 hour</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 367, 10);
      $$renderer2.push(`🟠 High: Within 2-4 hours</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 368, 10);
      $$renderer2.push(`🟡 Medium: Within 4-8 hours</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 369, 10);
      $$renderer2.push(`🟢 Low: Within 24 hours</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-DQHi7HZk.js.map
