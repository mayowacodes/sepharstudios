import { Ot as ensure_array_like, Wt as escape_html, kt as head } from "../../../../chunks/ui-libs.js";
import { t as Eye } from "../../../../chunks/eye.js";
import { t as Target } from "../../../../chunks/target.js";
import { a as Card, i as Card_content } from "../../../../chunks/card.js";
//#region src/routes/(app)/about/+page.svelte
function _page($$renderer) {
	const milestones = [
		{
			year: 2024,
			text: "Launch of Sephar Studios platform"
		},
		{
			year: 2025,
			text: "Target to be among top 5 Christian media houses"
		},
		{
			year: 2025,
			text: "Target to be among top 10 media houses in the country"
		}
	];
	head("6yh93n", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>About Us | Sephar Studios</title>`);
		});
		$$renderer.push(`<meta name="description" content="Learn about Sephar Studios' mission to spread kingdom-friendly media content and draw souls to the kingdom of God."/>`);
	});
	$$renderer.push(`<main class="container pt-32 pb-16 mx-auto px-4"><section class="text-center space-y-6 pb-24"><h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-primary">Spreading Light Through Media</h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">Sephar Studios is dedicated to producing excellent video content that draws people to the kingdom of God.</p></section> <section class="grid md:grid-cols-2 gap-8 pb-24">`);
	Card($$renderer, {
		class: "border-primary/20 bg-muted/30",
		children: ($$renderer) => {
			Card_content($$renderer, {
				class: "p-6 space-y-4",
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex items-center gap-3">`);
					Target($$renderer, { class: "w-8 h-8 text-primary" });
					$$renderer.push(`<!----> <h2 class="text-2xl font-bold">Our Mission</h2></div> <p class="text-muted-foreground mb-4">To produce various types of attractive video contents that are excellently done with the goal of drawing men to the kingdom through quality video contents that will cut across all works of life.</p> <p class="text-muted-foreground mb-4">We aim to shine the light of the kingdom to show people that there is a God-kind of way to do everything, and it is the only way to do everything.</p> <p class="text-muted-foreground">Our mission includes bringing together a mountain of kingdom-friendly available resources and making them easily accessible for people who are hungry for spiritual growth.</p>`);
				},
				$$slots: { default: true }
			});
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Card($$renderer, {
		class: "border-primary/20 bg-muted/30",
		children: ($$renderer) => {
			Card_content($$renderer, {
				class: "p-6 space-y-4",
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex items-center gap-3">`);
					Eye($$renderer, { class: "w-8 h-8 text-primary" });
					$$renderer.push(`<!----> <h2 class="text-2xl font-bold">Our Vision</h2></div> <p class="text-muted-foreground mb-4">To spread kingdom-friendly media content, attracting and retaining souls for the kingdom of God.</p> <p class="text-muted-foreground mb-4">To use media as a vehicle to bring souls and profit to the kingdom of God.</p> <p class="text-muted-foreground">By the end of 2025, to be one of the top 5 Christian media houses and one of the top 10 media houses in the country.</p>`);
				},
				$$slots: { default: true }
			});
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></section> <section class="text-center pb-24"><h2 class="text-3xl font-bold text-primary mb-6">Our Core Values</h2> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">`);
	Card($$renderer, {
		class: "border-primary/20 bg-muted/30",
		children: ($$renderer) => {
			Card_content($$renderer, {
				class: "p-6 space-y-2",
				children: ($$renderer) => {
					$$renderer.push(`<h3 class="text-xl font-semibold">Excellence</h3> <p class="text-muted-foreground">Committed to producing high-quality content that glorifies God and serves our audience.</p>`);
				},
				$$slots: { default: true }
			});
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Card($$renderer, {
		class: "border-primary/20 bg-muted/30",
		children: ($$renderer) => {
			Card_content($$renderer, {
				class: "p-6 space-y-2",
				children: ($$renderer) => {
					$$renderer.push(`<h3 class="text-xl font-semibold">Kingdom Impact</h3> <p class="text-muted-foreground">Focused on creating content that advances God's kingdom and transforms lives.</p>`);
				},
				$$slots: { default: true }
			});
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Card($$renderer, {
		class: "border-primary/20 bg-muted/30",
		children: ($$renderer) => {
			Card_content($$renderer, {
				class: "p-6 space-y-2",
				children: ($$renderer) => {
					$$renderer.push(`<h3 class="text-xl font-semibold">Accessibility</h3> <p class="text-muted-foreground">Making quality Christian content easily accessible to everyone seeking spiritual growth.</p>`);
				},
				$$slots: { default: true }
			});
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div></section> <section class="relative"><h2 class="text-3xl font-bold text-primary text-center mb-8">Our Journey</h2> <div class="absolute left-1/2 -translate-x-px h-full w-0.5 bg-primary/20 hidden sm:block"></div> <div class="space-y-12"><!--[-->`);
	const each_array = ensure_array_like(milestones);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let milestone = each_array[$$index];
		$$renderer.push(`<div class="relative flex flex-col sm:flex-row items-center gap-8"><div class="w-full sm:w-24 text-center sm:text-right flex-none"><span class="text-primary font-bold">${escape_html(milestone.year)}</span></div> <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary hidden sm:block"></div> <div class="flex-1 bg-muted/30 p-4 rounded-lg border border-primary/20 w-full"><p>${escape_html(milestone.text)}</p></div></div>`);
	}
	$$renderer.push(`<!--]--></div></section></main>`);
}
//#endregion
export { _page as default };
