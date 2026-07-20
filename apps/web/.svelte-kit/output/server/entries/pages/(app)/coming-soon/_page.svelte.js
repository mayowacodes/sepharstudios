import { Et as derived, Ot as ensure_array_like, Wt as escape_html, jt as spread_props, kt as head } from "../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import { t as ComingSoonCard } from "../../../../chunks/ComingSoonCard.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/calendar-days.svelte
function Calendar_days($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "calendar-days" },
		props,
		{ iconNode: [
			["path", { "d": "M8 2v4" }],
			["path", { "d": "M16 2v4" }],
			["rect", {
				"width": "18",
				"height": "18",
				"x": "3",
				"y": "4",
				"rx": "2"
			}],
			["path", { "d": "M3 10h18" }],
			["path", { "d": "M8 14h.01" }],
			["path", { "d": "M12 14h.01" }],
			["path", { "d": "M16 14h.01" }],
			["path", { "d": "M8 18h.01" }],
			["path", { "d": "M12 18h.01" }],
			["path", { "d": "M16 18h.01" }]
		] }
	]));
}
//#endregion
//#region src/routes/(app)/coming-soon/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		const grouped = derived(() => {
			const out = /* @__PURE__ */ new Map();
			for (const item of data.items ?? []) {
				const raw = item.scheduledPublishAt ?? item.releaseDate ?? null;
				if (!raw) continue;
				const ts = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
				if (Number.isNaN(ts)) continue;
				const d = new Date(ts);
				const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
				const label = d.toLocaleDateString(void 0, {
					month: "long",
					year: "numeric"
				});
				if (!out.has(key)) out.set(key, {
					label,
					items: []
				});
				out.get(key).items.push(item);
			}
			return [...out.entries()].map(([key, group]) => ({
				key,
				...group
			}));
		});
		head("gwzuyj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Coming Soon · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Faith-inspiring movies, shows, and documentaries dropping soon on Sephar Studios. Get notified when your most-anticipated titles go live."/>`);
		});
		$$renderer.push(`<div class="relative overflow-hidden min-h-screen bg-(--surface-charcoal) text-white"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div> <main class="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 relative z-10"><section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto"><div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60"></div> <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">`);
		Sparkles($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Coming Soon</div> <h1 class="text-5xl sm:text-6xl font-extrabold text-display">Releasing soon</h1> <p class="text-white/70 text-lg">Tap the bell on any title and we'll let you know the moment it goes live.</p></section> `);
		if (grouped().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/70">`);
			Calendar_days($$renderer, { class: "mx-auto h-10 w-10 mb-3 opacity-60" });
			$$renderer.push(`<!----> <p class="text-lg">Nothing scheduled right now.</p> <p class="text-sm text-white/50 mt-1">Check back soon — creators are uploading.</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(grouped());
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let group = each_array[$$index_1];
				$$renderer.push(`<section class="mb-12"><header class="flex items-center gap-3 mb-4"><span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]"></span> <h2 class="text-2xl font-semibold text-white">${escape_html(group.label)}</h2> <span class="text-sm text-white/50">${escape_html(group.items.length)} title${escape_html(group.items.length === 1 ? "" : "s")}</span></header> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"><!--[-->`);
				const each_array_1 = ensure_array_like(group.items);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let item = each_array_1[$$index];
					ComingSoonCard($$renderer, { item });
				}
				$$renderer.push(`<!--]--></div></section>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></main></div>`);
	});
}
//#endregion
export { _page as default };
