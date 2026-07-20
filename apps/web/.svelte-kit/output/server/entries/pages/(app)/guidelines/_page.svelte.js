import { Bt as writable, Et as derived, Ft as unsubscribe_stores, Ht as attr, Mt as store_get, Ot as ensure_array_like, Wt as escape_html, kt as head } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/index-server.js";
import { t as Check } from "../../../../chunks/check.js";
import { t as Circle_play } from "../../../../chunks/circle-play.js";
import { t as X } from "../../../../chunks/x.js";
import { t as Button } from "../../../../chunks/button.js";
import { a as Card, i as Card_content } from "../../../../chunks/card.js";
//#region src/routes/(app)/guidelines/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const searchQuery = writable("");
		const guidelines = [
			{
				title: "Faith-Based Content",
				allowed: [
					"Content aligned with Christian teachings and values",
					"Biblical stories and adaptations",
					"Faith-promoting messages",
					"Family-friendly content",
					"Educational Christian material"
				],
				prohibited: [
					"Content contradicting Christian beliefs",
					"Anti-religious messaging",
					"Explicit or adult content",
					"Violence or gore",
					"Inappropriate language"
				]
			},
			{
				title: "Technical Requirements",
				allowed: [
					"High-definition video (1080p minimum)",
					"Clear audio quality",
					"Professional editing",
					"Proper lighting and composition",
					"Subtitles and closed captions"
				],
				prohibited: [
					"Poor video quality",
					"Distorted audio",
					"Unstable footage",
					"Missing subtitles",
					"Improper aspect ratios"
				]
			},
			{
				title: "Content Categories",
				allowed: [
					"Christian films and series",
					"Biblical documentaries",
					"Worship content",
					"Educational programs",
					"Family entertainment"
				],
				prohibited: [
					"Non-Christian religious content",
					"Secular entertainment",
					"Political content",
					"Controversial topics",
					"Divisive messaging"
				]
			}
		];
		let filteredGuidelines = derived(() => guidelines.map((section) => ({
			...section,
			allowed: section.allowed.filter((item) => item.toLowerCase().includes(store_get($$store_subs ??= {}, "$searchQuery", searchQuery).toLowerCase())),
			prohibited: section.prohibited.filter((item) => item.toLowerCase().includes(store_get($$store_subs ??= {}, "$searchQuery", searchQuery).toLowerCase()))
		})));
		head("lvikix", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Content Guidelines | Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Learn about our content guidelines and standards for faith-based content on Sephar Studios."/>`);
		});
		$$renderer.push(`<main class="container mx-auto px-4 pt-32 pb-16"><section class="text-center space-y-6 pb-24"><h1 class="text-4xl sm:text-6xl font-bold tracking-tight">Faith-Based Entertainment <br/> For The Whole Family</h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">Stream thousands of faith-inspiring movies, shows, and documentaries. Start your free trial today.</p> <div class="flex justify-center gap-4">`);
		Button($$renderer, {
			size: "lg",
			href: "/auth/register",
			class: "bg-primary hover:bg-primary/90",
			children: ($$renderer) => {
				Circle_play($$renderer, { class: "mr-2 h-5 w-5" });
				$$renderer.push(`<!----> Start Watching`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			size: "lg",
			variant: "outline",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Learn More`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></section> <section class="text-center space-y-6 pb-24"><h1 class="text-4xl sm:text-6xl font-bold tracking-tight">Content Guidelines</h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">Our content guidelines ensure alignment with our mission to provide quality, faith-based entertainment.</p> <input type="text" placeholder="Search guidelines..."${attr("value", store_get($$store_subs ??= {}, "$searchQuery", searchQuery))} class="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-primary focus:border-primary"/></section> <section class="text-center space-y-8"><!--[-->`);
		const each_array = ensure_array_like(filteredGuidelines());
		for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
			let section = each_array[$$index_2];
			if (section.allowed.length || section.prohibited.length) {
				$$renderer.push("<!--[0-->");
				Card($$renderer, {
					class: "border border-gray-200",
					children: ($$renderer) => {
						Card_content($$renderer, {
							class: "p-6 space-y-4",
							children: ($$renderer) => {
								$$renderer.push(`<h2 class="text-center text-2xl font-bold">${escape_html(section.title)}</h2> <div class="grid md:grid-cols-2 gap-6">`);
								if (section.allowed.length) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div><h3 class="text-lg font-semibold text-green-600 flex items-center gap-2">`);
									Check($$renderer, { class: "w-5 h-5" });
									$$renderer.push(`<!----> Allowed</h3> <ul class="list-disc list-inside text-muted-foreground"><!--[-->`);
									const each_array_1 = ensure_array_like(section.allowed);
									for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
										let item = each_array_1[$$index];
										$$renderer.push(`<li>${escape_html(item)}</li>`);
									}
									$$renderer.push(`<!--]--></ul></div>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> `);
								if (section.prohibited.length) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div><h3 class="text-lg font-semibold text-center text-red-600 flex items-center gap-2">`);
									X($$renderer, { class: "w-5 h-5" });
									$$renderer.push(`<!----> Prohibited</h3> <ul class="list-disc list-inside text-muted-foreground"><!--[-->`);
									const each_array_2 = ensure_array_like(section.prohibited);
									for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
										let item = each_array_2[$$index_1];
										$$renderer.push(`<li>${escape_html(item)}</li>`);
									}
									$$renderer.push(`<!--]--></ul></div>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--></div>`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></section></main>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
