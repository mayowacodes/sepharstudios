import { m as ensure_array_like, C as attr_class, x as stringify, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(creator)/creator/agreement/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let activeSection = "overview";
      const sections = [
        { id: "overview", title: "Agreement Overview", icon: "📋" },
        {
          id: "content-standards",
          title: "Content Standards",
          icon: "✝️"
        },
        {
          id: "rights-responsibilities",
          title: "Rights & Responsibilities",
          icon: "⚖️"
        },
        { id: "monetization", title: "Monetization Terms", icon: "💰" },
        {
          id: "intellectual-property",
          title: "Intellectual Property",
          icon: "©️"
        },
        {
          id: "community-guidelines",
          title: "Community Guidelines",
          icon: "👥"
        }
      ];
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 21, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 23, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 24, 4);
      $$renderer2.push(`Creator Agreement</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 25, 4);
      $$renderer2.push(`Terms and conditions for content creators on Sephar Studios</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">`);
        push_element($$renderer2, "div", 40, 4);
        $$renderer2.push(`<div class="flex items-center">`);
        push_element($$renderer2, "div", 41, 6);
        $$renderer2.push(`<span class="text-2xl mr-3">`);
        push_element($$renderer2, "span", 42, 8);
        $$renderer2.push(`⚠️</span>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 43, 8);
        $$renderer2.push(`<h3 class="text-lg font-bold text-white">`);
        push_element($$renderer2, "h3", 44, 10);
        $$renderer2.push(`Agreement Required</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-yellow-200">`);
        push_element($$renderer2, "p", 45, 10);
        $$renderer2.push(`Please review and accept our Creator Agreement to continue using creator features.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="text-center text-gray-400 text-sm">`);
      push_element($$renderer2, "div", 52, 2);
      $$renderer2.push(`Last updated: January 15, 2024 | Version 2.1</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 56, 2);
      $$renderer2.push(`<div class="lg:col-span-1">`);
      push_element($$renderer2, "div", 58, 4);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 sticky top-6">`);
      push_element($$renderer2, "div", 59, 6);
      $$renderer2.push(`<nav class="space-y-2">`);
      push_element($$renderer2, "nav", 60, 8);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let section = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${stringify(activeSection === section.id ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
        push_element($$renderer2, "button", 62, 12);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 66, 14);
        $$renderer2.push(`${escape_html(section.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <span class="text-sm font-medium">`);
        push_element($$renderer2, "span", 67, 14);
        $$renderer2.push(`${escape_html(section.title)}</span>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></nav>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-6 pt-6 border-t border-white/20">`);
        push_element($$renderer2, "div", 73, 10);
        $$renderer2.push(`<button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm mb-3">`);
        push_element($$renderer2, "button", 74, 12);
        $$renderer2.push(`${escape_html("View")} Full Agreement</button>`);
        pop_element();
        $$renderer2.push(` <button class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm">`);
        push_element($$renderer2, "button", 80, 12);
        $$renderer2.push(`Accept Agreement</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="lg:col-span-3">`);
      push_element($$renderer2, "div", 92, 4);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 93, 6);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-6">`);
        push_element($$renderer2, "div", 95, 10);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 96, 12);
        $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h2", 97, 14);
        $$renderer2.push(`Creator Agreement Overview</h2>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 mb-4">`);
        push_element($$renderer2, "p", 98, 14);
        $$renderer2.push(`Welcome to Sephar Studios! This Creator Agreement outlines the terms and conditions for content creators
                using our faith-based streaming platform. By creating and uploading content, you agree to these terms.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">`);
        push_element($$renderer2, "div", 104, 12);
        $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-2 flex items-center">`);
        push_element($$renderer2, "h3", 105, 14);
        $$renderer2.push(`<span class="mr-2">`);
        push_element($$renderer2, "span", 106, 16);
        $$renderer2.push(`🎯</span>`);
        pop_element();
        $$renderer2.push(` Our Mission</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-200">`);
        push_element($$renderer2, "p", 108, 14);
        $$renderer2.push(`Sephar Studios exists to provide a safe, inspiring platform where Christian creators can share their
                God-given talents and stories to reach hearts worldwide with the message of Jesus Christ.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
        push_element($$renderer2, "div", 114, 12);
        $$renderer2.push(`<div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 115, 14);
        $$renderer2.push(`<h4 class="font-medium text-white mb-2 flex items-center">`);
        push_element($$renderer2, "h4", 116, 16);
        $$renderer2.push(`<span class="mr-2">`);
        push_element($$renderer2, "span", 117, 18);
        $$renderer2.push(`✅</span>`);
        pop_element();
        $$renderer2.push(` What We Provide</h4>`);
        pop_element();
        $$renderer2.push(` <ul class="text-gray-300 text-sm space-y-1">`);
        push_element($$renderer2, "ul", 119, 16);
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 120, 18);
        $$renderer2.push(`• Global streaming platform</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 121, 18);
        $$renderer2.push(`• Content hosting and delivery</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 122, 18);
        $$renderer2.push(`• Analytics and insights</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 123, 18);
        $$renderer2.push(`• Creator community and support</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 124, 18);
        $$renderer2.push(`• Monetization opportunities</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 125, 18);
        $$renderer2.push(`• Technical infrastructure</li>`);
        pop_element();
        $$renderer2.push(`</ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 129, 14);
        $$renderer2.push(`<h4 class="font-medium text-white mb-2 flex items-center">`);
        push_element($$renderer2, "h4", 130, 16);
        $$renderer2.push(`<span class="mr-2">`);
        push_element($$renderer2, "span", 131, 18);
        $$renderer2.push(`🤝</span>`);
        pop_element();
        $$renderer2.push(` What We Expect</h4>`);
        pop_element();
        $$renderer2.push(` <ul class="text-gray-300 text-sm space-y-1">`);
        push_element($$renderer2, "ul", 133, 16);
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 134, 18);
        $$renderer2.push(`• Faith-based, family-friendly content</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 135, 18);
        $$renderer2.push(`• Adherence to community guidelines</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 136, 18);
        $$renderer2.push(`• Original or properly licensed material</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 137, 18);
        $$renderer2.push(`• Respectful interaction with community</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 138, 18);
        $$renderer2.push(`• Compliance with technical standards</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 139, 18);
        $$renderer2.push(`• Commitment to Christian values</li>`);
        pop_element();
        $$renderer2.push(`</ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">`);
        push_element($$renderer2, "div", 144, 12);
        $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-2 flex items-center">`);
        push_element($$renderer2, "h3", 145, 14);
        $$renderer2.push(`<span class="mr-2">`);
        push_element($$renderer2, "span", 146, 16);
        $$renderer2.push(`⭐</span>`);
        pop_element();
        $$renderer2.push(` Creator Benefits</h3>`);
        pop_element();
        $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-3 gap-4">`);
        push_element($$renderer2, "div", 148, 14);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 149, 16);
        $$renderer2.push(`<div class="text-green-200 font-medium">`);
        push_element($$renderer2, "div", 150, 18);
        $$renderer2.push(`Platform Features</div>`);
        pop_element();
        $$renderer2.push(` <ul class="text-green-200 text-sm space-y-1">`);
        push_element($$renderer2, "ul", 151, 18);
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 152, 20);
        $$renderer2.push(`• Unlimited uploads</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 153, 20);
        $$renderer2.push(`• 4K video support</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 154, 20);
        $$renderer2.push(`• Live streaming</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 155, 20);
        $$renderer2.push(`• Custom thumbnails</li>`);
        pop_element();
        $$renderer2.push(`</ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 158, 16);
        $$renderer2.push(`<div class="text-green-200 font-medium">`);
        push_element($$renderer2, "div", 159, 18);
        $$renderer2.push(`Growth Tools</div>`);
        pop_element();
        $$renderer2.push(` <ul class="text-green-200 text-sm space-y-1">`);
        push_element($$renderer2, "ul", 160, 18);
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 161, 20);
        $$renderer2.push(`• Detailed analytics</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 162, 20);
        $$renderer2.push(`• Audience insights</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 163, 20);
        $$renderer2.push(`• SEO optimization</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 164, 20);
        $$renderer2.push(`• Cross-promotion</li>`);
        pop_element();
        $$renderer2.push(`</ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 167, 16);
        $$renderer2.push(`<div class="text-green-200 font-medium">`);
        push_element($$renderer2, "div", 168, 18);
        $$renderer2.push(`Support &amp; Community</div>`);
        pop_element();
        $$renderer2.push(` <ul class="text-green-200 text-sm space-y-1">`);
        push_element($$renderer2, "ul", 169, 18);
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 170, 20);
        $$renderer2.push(`• 24/7 technical support</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 171, 20);
        $$renderer2.push(`• Creator workshops</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 172, 20);
        $$renderer2.push(`• Networking events</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 173, 20);
        $$renderer2.push(`• Ministry resources</li>`);
        pop_element();
        $$renderer2.push(`</ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">`);
        push_element($$renderer2, "div", 179, 12);
        $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-2">`);
        push_element($$renderer2, "h3", 180, 14);
        $$renderer2.push(`📜 Key Agreement Points</h3>`);
        pop_element();
        $$renderer2.push(` <ul class="text-purple-200 text-sm space-y-2">`);
        push_element($$renderer2, "ul", 181, 14);
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 182, 16);
        $$renderer2.push(`• You retain ownership of your original content</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 183, 16);
        $$renderer2.push(`• We reserve the right to review and moderate content</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 184, 16);
        $$renderer2.push(`• Content must align with Christian values and our guidelines</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 185, 16);
        $$renderer2.push(`• We provide platform services, you create amazing content</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 186, 16);
        $$renderer2.push(`• Both parties can terminate the agreement with proper notice</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 187, 16);
        $$renderer2.push(`• Disputes are resolved through Christian mediation when possible</li>`);
        pop_element();
        $$renderer2.push(`</ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
        push_element($$renderer2, "div", 672, 4);
        $$renderer2.push(`<h3 class="text-xl font-bold text-white mb-4">`);
        push_element($$renderer2, "h3", 673, 6);
        $$renderer2.push(`Ready to Join Our Creator Community?</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 mb-6">`);
        push_element($$renderer2, "p", 674, 6);
        $$renderer2.push(`By accepting this agreement, you're committing to help us build a platform that honors God
        and serves the global Christian community.</p>`);
        pop_element();
        $$renderer2.push(` <div class="flex flex-col md:flex-row gap-4 justify-center">`);
        push_element($$renderer2, "div", 678, 6);
        $$renderer2.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">`);
        push_element($$renderer2, "button", 679, 8);
        $$renderer2.push(`📄 Download Full Agreement (PDF)</button>`);
        pop_element();
        $$renderer2.push(` <button class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium">`);
        push_element($$renderer2, "button", 685, 8);
        $$renderer2.push(`✅ I Accept the Creator Agreement</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-xs text-gray-400 mt-4">`);
        push_element($$renderer2, "p", 692, 6);
        $$renderer2.push(`By clicking "I Accept", you agree to abide by all terms and conditions outlined in this agreement.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-5oMjp_6C.js.map
