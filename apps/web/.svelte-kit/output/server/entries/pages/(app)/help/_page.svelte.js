import { Dt as spread_props, It as writable, Ot as store_get, Rt as clsx, St as derived, Tt as head, at as Accordion_item$1, it as Accordion_header, jt as unsubscribe_stores, kt as store_set, nt as Accordion_content$1, ot as Accordion$1, rt as Accordion_trigger$1, vt as attr_class, wt as ensure_array_like, xt as bind_props, zt as escape_html } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/index-server.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Chevron_down } from "../../../../chunks/chevron-down.js";
import { t as Circle_question_mark } from "../../../../chunks/circle-question-mark.js";
import { t as Mail } from "../../../../chunks/mail.js";
import { t as Search } from "../../../../chunks/search.js";
import { t as cn } from "../../../../chunks/utils2.js";
import { t as Input } from "../../../../chunks/input.js";
import { t as Button } from "../../../../chunks/button.js";
import { a as Card, i as Card_content } from "../../../../chunks/card.js";
import { t as Textarea } from "../../../../chunks/textarea.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/message-circle.svelte
function Message_circle($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "message-circle" },
		props,
		{ iconNode: [["path", { "d": "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" }]] }
	]));
}
//#endregion
//#region src/lib/components/ui/accordion/accordion.svelte
function Accordion($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Accordion$1) {
				$$renderer.push("<!--[-->");
				Accordion$1($$renderer, spread_props([
					{ "data-slot": "accordion" },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/accordion/accordion-content.svelte
function Accordion_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Accordion_content$1) {
				$$renderer.push("<!--[-->");
				Accordion_content$1($$renderer, spread_props([
					{
						"data-slot": "accordion-content",
						class: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							$$renderer.push(`<div${attr_class(clsx(cn("pt-0 pb-4", className)))}>`);
							children?.($$renderer);
							$$renderer.push(`<!----></div>`);
						},
						$$slots: { default: true }
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/accordion/accordion-item.svelte
function Accordion_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Accordion_item$1) {
				$$renderer.push("<!--[-->");
				Accordion_item$1($$renderer, spread_props([
					{
						"data-slot": "accordion-item",
						class: cn("border-b last:border-b-0", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/accordion/accordion-trigger.svelte
function Accordion_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, level = 3, children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Accordion_header) {
				$$renderer.push("<!--[-->");
				Accordion_header($$renderer, {
					level,
					class: "flex",
					children: ($$renderer) => {
						if (Accordion_trigger$1) {
							$$renderer.push("<!--[-->");
							Accordion_trigger$1($$renderer, spread_props([
								{
									"data-slot": "accordion-trigger",
									class: cn("focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180", className)
								},
								restProps,
								{
									get ref() {
										return ref;
									},
									set ref($$value) {
										ref = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										children?.($$renderer);
										$$renderer.push(`<!----> `);
										Chevron_down($$renderer, { class: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" });
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								}
							]));
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/routes/(app)/help/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		writable(null);
		const activeAccordion = writable(void 0);
		const faqs = [
			{
				category: "Account & Billing",
				items: [
					{
						question: "How do I create an account?",
						answer: "You can create an account by clicking the 'Sign Up' button on the top right of our homepage. Follow the prompts to enter your information and choose a subscription plan."
					},
					{
						question: "What payment methods do you accept?",
						answer: "We process payments securely through Paystack using major credit and debit cards."
					},
					{
						question: "How do I cancel my subscription?",
						answer: "You can cancel your subscription at any time through your account settings. Navigate to 'Subscription' and click 'Cancel Subscription'."
					},
					{
						question: "What is your PPV refund policy?",
						answer: "PPV purchases are non-refundable after playback starts. If playback never starts because of a verified platform issue, contact support within 48 hours for review."
					}
				]
			},
			{
				category: "Content & Playback",
				items: [
					{
						question: "What devices can I watch on?",
						answer: "You can watch on your computer, smartphone, tablet, smart TV, and other streaming devices."
					},
					{
						question: "Can I download content to watch offline?",
						answer: "Yes, premium subscribers can download content for offline viewing on mobile devices."
					},
					{
						question: "How do I report inappropriate content?",
						answer: "Use the 'Report' button on any video player to flag inappropriate content. Our team will review it promptly."
					}
				]
			},
			{
				category: "Technical Support",
				items: [{
					question: "What internet speed do I need?",
					answer: "We recommend at least 5 Mbps for HD streaming and 15 Mbps for 4K content."
				}, {
					question: "How do I fix buffering issues?",
					answer: "Try clearing your browser cache, checking your internet connection, or lowering the video quality."
				}]
			}
		];
		let searchQuery = "";
		let contactForm = {
			name: "",
			email: "",
			subject: "",
			message: ""
		};
		let filteredFaqs = derived(() => faqs.map((category) => ({
			...category,
			items: category.items.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
		})).filter((category) => category.items.length > 0));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("l9h94x", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Help Center | Sephar Studios</title>`);
				});
				$$renderer.push(`<meta name="description" content="Get help and support for your Sephar Studios experience. Find answers to common questions and contact our support team."/>`);
			});
			$$renderer.push(`<main class="container mx-auto px-4 pt-32 pb-16"><section class="text-center space-y-6 pb-24"><h1 class="text-4xl sm:text-6xl font-bold tracking-tight">How Can We Help?</h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">Find answers to common questions or contact our support team.</p> <div class="relative max-w-xl mx-auto">`);
			Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" });
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				type: "search",
				placeholder: "Search for answers...",
				class: "pl-10",
				get value() {
					return searchQuery;
				},
				set value($$value) {
					searchQuery = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></section> <section class="grid md:grid-cols-3 gap-8 pb-24">`);
			Card($$renderer, {
				class: "bg-background border",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6 text-center space-y-4",
						children: ($$renderer) => {
							Mail($$renderer, { class: "mx-auto h-12 w-12 text-primary" });
							$$renderer.push(`<!----> <h3 class="text-xl font-semibold">Email Support</h3> <p class="text-muted-foreground">Get in touch with our support team via email.</p> <a href="mailto:support@sepharstudios.com" class="text-primary hover:underline">support@sepharstudios.com</a>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				class: "bg-background border",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6 text-center space-y-4",
						children: ($$renderer) => {
							Circle_question_mark($$renderer, { class: "mx-auto h-12 w-12 text-secondary" });
							$$renderer.push(`<!----> <h3 class="text-xl font-semibold">FAQs</h3> <p class="text-muted-foreground">Find answers to commonly asked questions.</p> `);
							Button($$renderer, {
								variant: "outline",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Browse FAQs`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card($$renderer, {
				class: "bg-background border",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6 text-center space-y-4",
						children: ($$renderer) => {
							Message_circle($$renderer, { class: "mx-auto h-12 w-12 text-accent" });
							$$renderer.push(`<!----> <h3 class="text-xl font-semibold">Contact Us</h3> <p class="text-muted-foreground">Send us a message and we'll get back to you.</p> `);
							Button($$renderer, {
								variant: "outline",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Contact Support`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></section> <section class="text-center pb-24"><h2 class="text-3xl font-bold mb-6">Frequently Asked Questions</h2> `);
			if (filteredFaqs().length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(filteredFaqs());
				for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
					let category = each_array[$$index_1];
					$$renderer.push(`<div class="mb-8"><h3 class="text-xl font-semibold mb-4">${escape_html(category.category)}</h3> `);
					Accordion($$renderer, {
						type: "single",
						get value() {
							return store_get($$store_subs ??= {}, "$activeAccordion", activeAccordion);
						},
						set value($$value) {
							store_set(activeAccordion, $$value);
							$$settled = false;
						},
						children: ($$renderer) => {
							$$renderer.push(`<!--[-->`);
							const each_array_1 = ensure_array_like(category.items);
							for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
								let item = each_array_1[i];
								Accordion_item($$renderer, {
									value: `${category.category}-${i}`,
									children: ($$renderer) => {
										Accordion_trigger($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(item.question)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Accordion_content($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<p class="text-muted-foreground">${escape_html(item.answer)}</p>`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<p class="text-center text-muted-foreground">No results found for "${escape_html(searchQuery)}". Try a different search term.</p>`);
			}
			$$renderer.push(`<!--]--></section> <section><h2 class="text-center text-3xl font-bold mb-6">Contact Support</h2> `);
			Card($$renderer, {
				class: "max-w-3xl mx-auto bg-background border",
				children: ($$renderer) => {
					Card_content($$renderer, {
						class: "p-6",
						children: ($$renderer) => {
							$$renderer.push(`<form class="space-y-4"><div class="grid sm:grid-cols-2 gap-4">`);
							Input($$renderer, {
								placeholder: "Name",
								required: true,
								get value() {
									return contactForm.name;
								},
								set value($$value) {
									contactForm.name = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
								type: "email",
								placeholder: "Email",
								required: true,
								get value() {
									return contactForm.email;
								},
								set value($$value) {
									contactForm.email = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div> `);
							Input($$renderer, {
								placeholder: "Subject",
								required: true,
								get value() {
									return contactForm.subject;
								},
								set value($$value) {
									contactForm.subject = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----> `);
							Textarea($$renderer, {
								placeholder: "Message",
								rows: 6,
								required: true,
								get value() {
									return contactForm.message;
								},
								set value($$value) {
									contactForm.message = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								type: "submit",
								class: "w-full",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Send Message`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></section></main>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
