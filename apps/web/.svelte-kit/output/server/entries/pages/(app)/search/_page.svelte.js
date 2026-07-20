import { Ct as attr_style, Ft as unsubscribe_stores, Ht as attr, Mt as store_get, Ot as ensure_array_like, Pt as stringify, Wt as escape_html, kt as head } from "../../../../chunks/ui-libs.js";
import { n as Bookmark_check, t as Bookmark } from "../../../../chunks/bookmark.js";
import "../../../../chunks/loader-circle.js";
import { t as Play } from "../../../../chunks/play.js";
import { t as Search } from "../../../../chunks/search.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import { t as page } from "../../../../chunks/state.js";
import "../../../../chunks/navigation.js";
import { t as Button } from "../../../../chunks/button.js";
import { t as myList } from "../../../../chunks/myList.js";
//#region src/routes/(app)/search/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let query = page.url.searchParams.get("q") ?? "";
		let results = [];
		const exampleQueries = [
			"Movies about forgiveness and redemption",
			"Family-safe shows my kids will actually want to watch",
			"Documentaries about the early church",
			"Something uplifting after a hard week",
			"Stories that show prayer changing things"
		];
		head("ogmlmo", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Search · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Describe what you're looking for in plain English — our AI matches it to faith-based movies, shows and documentaries."/>`);
		});
		$$renderer.push(`<div class="min-h-screen bg-background text-white"><div class="max-w-5xl mx-auto px-4 py-10 space-y-8"><header class="text-center space-y-3"><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">`);
		Sparkles($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> AI-Powered Search</div> <h1 class="text-3xl md:text-4xl font-bold">Find something to watch</h1> <p class="text-muted-foreground max-w-xl mx-auto">Describe a mood, a theme, a Bible story, or even a feeling. Our semantic search
        understands what you mean — not just what you type.</p></header> <form class="relative max-w-2xl mx-auto">`);
		Search($$renderer, { class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" });
		$$renderer.push(`<!----> <input type="search"${attr("value", query)} placeholder="Describe what you want to watch…" class="w-full bg-card border border-border rounded-full pl-12 pr-32 py-4 text-base text-white placeholder:text-muted-foreground focus:border-primary outline-none transition-colors" aria-label="Search query" autofocus=""/> `);
		Button($$renderer, {
			type: "submit",
			disabled: query.trim().length < 3,
			class: "absolute right-2 top-1/2 -translate-y-1/2",
			children: ($$renderer) => {
				$$renderer.push(`<!---->${escape_html("Search")}`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></form> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="space-y-3 max-w-2xl mx-auto"><p class="text-xs uppercase tracking-wider text-muted-foreground">Try one of these</p> <div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like(exampleQueries);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let eq = each_array[$$index];
				$$renderer.push(`<button type="button" class="text-sm bg-card border border-border hover:border-primary/60 rounded-full px-4 py-1.5 text-muted-foreground hover:text-white transition-colors">${escape_html(eq)}</button>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (results.length > 0) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<section class="space-y-4"><h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">${escape_html(results.length)} match${escape_html(results.length === 1 ? "" : "es")}</h2> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"><!--[-->`);
			const each_array_1 = ensure_array_like(results);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let r = each_array_1[$$index_1];
				$$renderer.push(`<div class="group space-y-2 relative"><a${attr("href", r.link || `/watch/${r.id}`)} class="block space-y-2"><div class="aspect-2/3 rounded-lg overflow-hidden bg-card relative">`);
				if (r.posterUrl || r.thumbnail) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", r.posterUrl ?? r.thumbnail ?? "")}${attr("alt", r.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>`);
				}
				$$renderer.push(`<!--]--> <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">`);
				Play($$renderer, { class: "w-5 h-5 fill-white" });
				$$renderer.push(`<!----></div></div> `);
				if (typeof r.progressPercent === "number" && r.progressPercent > 0 && r.progressPercent < 95) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="absolute inset-x-0 bottom-0 h-1 bg-black/40"><div class="h-full bg-[#FF5E0E]"${attr_style(`width: ${stringify(Math.max(2, Math.min(100, r.progressPercent)))}%`)}></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <p class="text-sm font-semibold text-white truncate"${attr("title", r.title)}>${escape_html(r.title)}</p> <p class="text-xs text-muted-foreground capitalize">${escape_html(r.mediaType ?? "content")}${escape_html(r.year ? ` · ${r.year}` : "")}</p></a> <button type="button"${attr("disabled", store_get($$store_subs ??= {}, "$myList", myList).pending.has(r.id), true)}${attr("aria-label", store_get($$store_subs ??= {}, "$myList", myList).ids.has(r.id) ? `Remove ${r.title} from My List` : `Add ${r.title} to My List`)} class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80 disabled:opacity-60 disabled:cursor-not-allowed">`);
				if (store_get($$store_subs ??= {}, "$myList", myList).ids.has(r.id)) {
					$$renderer.push("<!--[0-->");
					Bookmark_check($$renderer, { class: "w-4 h-4" });
				} else {
					$$renderer.push("<!--[-1-->");
					Bookmark($$renderer, { class: "w-4 h-4" });
				}
				$$renderer.push(`<!--]--></button></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
