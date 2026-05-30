import { yt as spread_props } from "../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Book_open } from "../../../../chunks/book-open.js";
import { t as External_link } from "../../../../chunks/external-link.js";
import { t as Settings } from "../../../../chunks/settings.js";
import { t as Button } from "../../../../chunks/button.js";
import { a as Card, i as Card_content, n as Card_header, r as Card_description, t as Card_title } from "../../../../chunks/card.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/code.svelte
function Code($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "code" },
		props,
		{ iconNode: [["path", { "d": "m16 18 6-6-6-6" }], ["path", { "d": "m8 6-6 6 6 6" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/rocket.svelte
function Rocket($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "rocket" },
		props,
		{ iconNode: [
			["path", { "d": "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }],
			["path", { "d": "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" }],
			["path", { "d": "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" }],
			["path", { "d": "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" }]
		] }
	]));
}
//#endregion
//#region src/routes/(protected)/documentation/+page.svelte
function _page($$renderer) {
	$$renderer.push(`<div class="flex flex-col gap-6"><div><h1 class="text-3xl font-bold">Documentation</h1> <p class="text-muted-foreground">Learn how to use and customize your application</p></div> <div class="grid gap-4 md:grid-cols-2">`);
	Card($$renderer, {
		children: ($$renderer) => {
			Card_header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex items-center gap-2">`);
					Book_open($$renderer, { class: "h-5 w-5" });
					$$renderer.push(`<!----> `);
					Card_title($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Getting Started`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					Card_description($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Learn the basics of your application`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card_content($$renderer, {
				class: "space-y-2",
				children: ($$renderer) => {
					$$renderer.push(`<p class="text-sm text-muted-foreground">This application is built with SvelteKit, Shadcn-Svelte, and Better Auth.
          It includes authentication, database management, and file storage out of the box.</p> `);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						href: "https://kit.svelte.dev/docs",
						target: "_blank",
						children: ($$renderer) => {
							External_link($$renderer, { class: "h-4 w-4 mr-2" });
							$$renderer.push(`<!---->SvelteKit Docs`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Card($$renderer, {
		children: ($$renderer) => {
			Card_header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex items-center gap-2">`);
					Code($$renderer, { class: "h-5 w-5" });
					$$renderer.push(`<!----> `);
					Card_title($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->UI Components`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					Card_description($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Shadcn-Svelte component library`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card_content($$renderer, {
				class: "space-y-2",
				children: ($$renderer) => {
					$$renderer.push(`<p class="text-sm text-muted-foreground">Beautiful, accessible, and customizable components built with Tailwind CSS.</p> `);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						href: "https://shadcn-svelte.com",
						target: "_blank",
						children: ($$renderer) => {
							External_link($$renderer, { class: "h-4 w-4 mr-2" });
							$$renderer.push(`<!---->Shadcn Docs`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Card($$renderer, {
		children: ($$renderer) => {
			Card_header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex items-center gap-2">`);
					Rocket($$renderer, { class: "h-5 w-5" });
					$$renderer.push(`<!----> `);
					Card_title($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Authentication`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					Card_description($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Better Auth for secure authentication`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card_content($$renderer, {
				class: "space-y-2",
				children: ($$renderer) => {
					$$renderer.push(`<p class="text-sm text-muted-foreground">Secure email/password and social authentication with session management.</p> `);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						href: "https://www.better-auth.com/docs",
						target: "_blank",
						children: ($$renderer) => {
							External_link($$renderer, { class: "h-4 w-4 mr-2" });
							$$renderer.push(`<!---->Better Auth Docs`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Card($$renderer, {
		children: ($$renderer) => {
			Card_header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex items-center gap-2">`);
					Settings($$renderer, { class: "h-5 w-5" });
					$$renderer.push(`<!----> `);
					Card_title($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Database`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					Card_description($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Drizzle ORM for database management`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Card_content($$renderer, {
				class: "space-y-2",
				children: ($$renderer) => {
					$$renderer.push(`<p class="text-sm text-muted-foreground">Type-safe SQL with automatic migrations and PostgreSQL support.</p> `);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						href: "https://orm.drizzle.team/docs",
						target: "_blank",
						children: ($$renderer) => {
							External_link($$renderer, { class: "h-4 w-4 mr-2" });
							$$renderer.push(`<!---->Drizzle Docs`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div></div>`);
}
//#endregion
export { _page as default };
