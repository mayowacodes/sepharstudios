import { Dt as spread_props, Lt as attr, wt as ensure_array_like, zt as escape_html } from "../../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../../chunks/Icon.js";
import { t as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import "../../../../../../chunks/navigation.js";
import { t as PageHeader } from "../../../../../../chunks/PageHeader.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/message-square-plus.svelte
function Message_square_plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "message-square-plus" },
		props,
		{ iconNode: [
			["path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }],
			["path", { "d": "M12 8v6" }],
			["path", { "d": "M9 11h6" }]
		] }
	]));
}
//#endregion
//#region src/routes/(creator)/creator/forum/new/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const categories = [
			{
				id: "getting-started",
				title: "Getting Started",
				icon: "🚀"
			},
			{
				id: "technical",
				title: "Technical Help",
				icon: "⚙️"
			},
			{
				id: "content-creation",
				title: "Content Creation",
				icon: "🎬"
			},
			{
				id: "ministry",
				title: "Ministry & Faith",
				icon: "✝️"
			},
			{
				id: "community",
				title: "Community",
				icon: "❤️"
			}
		];
		let title = "";
		let category = "";
		let body = "";
		let submitting = false;
		$$renderer.push(`<div class="container mx-auto max-w-3xl py-8 px-4 space-y-6"><a href="/creator/forum" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> Back to forum</a> `);
		PageHeader($$renderer, {
			icon: Message_square_plus,
			title: "Start a Discussion",
			subtitle: "All posts are moderated by AI before publishing. Be kind and on-topic."
		});
		$$renderer.push(`<!----> <form class="surface-2 backdrop-blur-sm rounded-xl p-6 space-y-4"><div><label for="thread-title" class="block text-foreground font-medium mb-2">Title *</label> <input id="thread-title" type="text"${attr("value", title)} minlength="5" maxlength="255" required="" class="w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500"/></div> <div><label for="thread-category" class="block text-foreground font-medium mb-2">Category *</label> `);
		$$renderer.select({
			id: "thread-category",
			value: category,
			required: true,
			class: "w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`Choose a category`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(categories);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let cat = each_array[$$index];
				$$renderer.option({ value: cat.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(cat.icon)} ${escape_html(cat.title)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div><label for="thread-body" class="block text-foreground font-medium mb-2">Body *</label> <textarea id="thread-body" rows="8" minlength="20" maxlength="10000" required="" class="w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500" placeholder="Share your question, idea, or testimony…">`);
		const $$body = escape_html(body);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex justify-end gap-2"><button type="button" class="px-4 py-2 text-foreground/80 hover:text-foreground">Cancel</button> <button type="submit"${attr("disabled", submitting, true)} class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium">${escape_html("Post Discussion")}</button></div></form></div>`);
	});
}
//#endregion
export { _page as default };
