import { Wt as escape_html } from "../../../../chunks/ui-libs.js";
import { t as File_text } from "../../../../chunks/file-text.js";
import { t as Layout_dashboard } from "../../../../chunks/layout-dashboard.js";
import { t as User } from "../../../../chunks/user.js";
import { t as Users } from "../../../../chunks/users.js";
import { t as page } from "../../../../chunks/state.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../chunks/card.js";
//#region src/routes/(protected)/dashboard/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const user = page.data.user;
		$$renderer.push(`<div class="flex flex-col gap-6"><div><h1 class="text-3xl font-bold">Dashboard</h1> <p class="text-muted-foreground">Welcome back, ${escape_html(user?.name || "User")}!</p></div> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">`);
		Card($$renderer, {
			children: ($$renderer) => {
				Card_header($$renderer, {
					class: "flex flex-row items-center justify-between space-y-0 pb-2",
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "text-sm font-medium",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Total Users`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Users($$renderer, { class: "h-4 w-4 text-muted-foreground" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<div class="text-2xl font-bold">0</div> <p class="text-xs text-muted-foreground">Registered users</p>`);
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
					class: "flex flex-row items-center justify-between space-y-0 pb-2",
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "text-sm font-medium",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Active Sessions`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						User($$renderer, { class: "h-4 w-4 text-muted-foreground" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<div class="text-2xl font-bold">1</div> <p class="text-xs text-muted-foreground">Current session</p>`);
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
					class: "flex flex-row items-center justify-between space-y-0 pb-2",
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "text-sm font-medium",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Documents`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						File_text($$renderer, { class: "h-4 w-4 text-muted-foreground" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<div class="text-2xl font-bold">0</div> <p class="text-xs text-muted-foreground">Total files</p>`);
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
					class: "flex flex-row items-center justify-between space-y-0 pb-2",
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "text-sm font-medium",
							children: ($$renderer) => {
								$$renderer.push(`<!---->System Status`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Layout_dashboard($$renderer, { class: "h-4 w-4 text-muted-foreground" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<div class="text-2xl font-bold text-green-500">Online</div> <p class="text-xs text-muted-foreground">All systems operational</p>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
export { _page as default };
