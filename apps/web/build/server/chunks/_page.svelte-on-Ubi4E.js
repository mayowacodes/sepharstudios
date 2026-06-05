import { as as ensure_array_like, ah as attr, au as escape_html } from './ui-libs-BjzLDLAh.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(app)/contact/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let formData = {
			name: "",
			email: "",
			subject: "",
			message: ""
		};
		let isSubmitting = false;
		$$renderer.push(`<div class="max-w-4xl mx-auto px-4 py-12"><h1 class="text-4xl font-bold text-[#FF5E0E] mb-8 text-center">Contact Us</h1> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form class="space-y-6"><!--[-->`);
		const each_array = ensure_array_like(Object.entries(formData));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let [key, value] = each_array[$$index];
			$$renderer.push(`<div><label${attr("for", key)} class="block text-sm font-medium text-[#AF6E4D]">${escape_html(key.charAt(0).toUpperCase() + key.slice(1))}</label> `);
			if (key === "message") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<textarea${attr("id", key)} required="" rows="5" class="mt-1 block w-full rounded-md border border-[#AF6E4D] shadow-sm focus:border-[#FF5E0E] focus:ring focus:ring-[#FFBF00] focus:ring-opacity-50 p-2">`);
				const $$body = escape_html(formData[key]);
				if ($$body) $$renderer.push(`${$$body}`);
				$$renderer.push(`</textarea>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<input${attr("type", key === "email" ? "email" : "text")}${attr("id", key)}${attr("value", formData[key])} required="" class="mt-1 block w-full rounded-md border border-[#AF6E4D] shadow-sm focus:border-[#FF5E0E] focus:ring focus:ring-[#FFBF00] focus:ring-opacity-50 p-2"/>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div><button type="submit"${attr("disabled", isSubmitting, true)} class="w-full bg-[#FF5E0E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF5E0E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">${escape_html("Send Message")}</button></div></form> <div class="mt-12 text-center"><h2 class="text-2xl font-bold text-[#FF5E0E] mb-4">Other Ways to Reach Us</h2> <div class="space-y-2 text-[#AF6E4D]"><p>Email: <a href="mailto:info@sepharstudios.com" class="underline">info@sepharstudios.com</a></p> <p>Phone: <a href="tel:+1234567890" class="underline">+1 (234) 567-890</a></p> <p>Address: Lagos, Nigeria</p></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-on-Ubi4E.js.map
