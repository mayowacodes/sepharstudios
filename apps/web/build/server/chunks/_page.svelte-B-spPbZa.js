import { as as ensure_array_like, ah as attr, au as escape_html, ai as attr_class } from './ui-libs-BjzLDLAh.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(app)/faq/+page.svelte
function _page($$renderer) {
	const faqs = [
		{
			question: "What is Sephar Studios?",
			answer: "Sephar Studios is a Christian streaming service that offers a wide range of faith-based movies, TV shows, documentaries, and original content to inspire and uplift your spirit."
		},
		{
			question: "How much does Sephar Studios cost?",
			answer: "Sephar Studios offers various subscription plans starting at $9.99 per month. We also offer a free trial for new users to explore our content before committing."
		},
		{
			question: "Can I watch Sephar Studios on multiple devices?",
			answer: "Yes, you can stream Sephar Studios on up to 4 devices simultaneously with a single subscription. Our platform is compatible with smartphones, tablets, smart TVs, and computers."
		},
		{
			question: "Is Sephar Studios available worldwide?",
			answer: "Currently, Sephar Studios is available in select regions. We are working to expand our service to more countries. Please check our website for the latest availability updates."
		},
		{
			question: "How can I cancel my subscription?",
			answer: "You can cancel your subscription at any time by visiting the 'Account' section on our website or app. Your subscription will remain active until the end of the current billing period."
		}
	];
	let expandedIndex = null;
	$$renderer.push(`<div class="max-w-3xl mx-auto px-4 py-8"><h1 class="text-4xl font-bold text-[#FF5E0E] mb-8 text-center">Frequently Asked Questions</h1> <!--[-->`);
	const each_array = ensure_array_like(faqs);
	for (let index = 0, $$length = each_array.length; index < $$length; index++) {
		let faq = each_array[index];
		$$renderer.push(`<div class="border-b border-[#AF6E4D] last:border-b-0"><button class="flex justify-between items-center py-4 w-full text-left cursor-pointer hover:bg-[#FFBF00]/10 transition-colors"${attr("aria-expanded", expandedIndex === index)}><h2 class="text-xl font-semibold text-[#AF6E4D]">${escape_html(faq.question)}</h2> <span${attr_class("text-[#FF5E0E] text-2xl transition-transform", void 0, { "rotate-180": expandedIndex === index })}>▼</span></button> <div${attr_class("overflow-hidden transition-all duration-300", void 0, {
			"max-h-0": expandedIndex !== index,
			"max-h-96": expandedIndex === index
		})}><p class="text-[#AF6E4D] pb-4">${escape_html(faq.answer)}</p></div></div>`);
	}
	$$renderer.push(`<!--]--></div>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B-spPbZa.js.map
