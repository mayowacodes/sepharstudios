import { q as escape_html } from './index.js-BP8aAXBX.js';
import { F as File_text } from './file-text-BWq_Qfpf.js';
import { L as Layout_dashboard } from './layout-dashboard-BBz-1-70.js';
import { U as User } from './user-BOId-Hm8.js';
import { U as Users } from './users-C2Q26AgN.js';
import { p as page } from './state-DL22RgpG.js';
import { C as Card, a as Card_header, c as Card_title, d as Card_content } from './card-BAW-4xbt.js';
import './Icon-DOH8dWtn.js';
import './client-ZoNwVBKD.js';
import './utils2-CqskQpUP.js';

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

export { _page as default };
//# sourceMappingURL=_page.svelte-CPVWKgV1.js.map
