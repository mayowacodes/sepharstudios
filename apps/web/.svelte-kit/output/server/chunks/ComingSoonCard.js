import { Et as derived, Ht as attr, St as attr_class, Wt as escape_html } from "./ui-libs.js";
import "./bell-ring.js";
import { t as Bell } from "./bell.js";
import "./navigation.js";
//#region src/lib/components/ComingSoonCard.svelte
function ComingSoonCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item } = $$props;
		let subscribed = false;
		let busy = false;
		const detailPath = (m) => {
			const slug = m.slug || m.id;
			if (m.category === "kids") return `/kids/kiddies/${slug}`;
			if (m.category === "teens") return `/kids/teens/${slug}`;
			return `/movies/${slug}`;
		};
		const releaseLabel = derived(() => {
			const raw = item.scheduledPublishAt ?? item.releaseDate ?? null;
			if (!raw) return null;
			const ts = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
			if (Number.isNaN(ts)) return null;
			return new Date(ts).toLocaleDateString(void 0, {
				month: "short",
				day: "numeric"
			});
		});
		$$renderer.push(`<a${attr("href", detailPath(item))} class="relative group block w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:scale-[1.02]"${attr("aria-label", `Coming soon: ${item.title}`)}><div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card"><img${attr("src", item.posterUrl || item.thumbnail || "/placeholder-vertical.jpg")} alt="" width="280" height="420" loading="lazy" decoding="async" class="w-full h-full object-cover"/> <div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div> <button type="button"${attr("disabled", busy, true)}${attr("aria-pressed", subscribed)}${attr("aria-label", `Notify me when ${item.title} drops`)}${attr_class(`absolute top-2 right-2 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md transition-all disabled:opacity-60 bg-black/40 text-white/85 hover:bg-black/60 border border-white/15`)}>`);
		$$renderer.push("<!--[-1-->");
		Bell($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!--]--></button> `);
		if (releaseLabel()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute bottom-2 left-2 z-20 inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow">Releases ${escape_html(releaseLabel())}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="absolute inset-0 p-3 flex flex-col justify-end z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none"><h3 class="text-sm font-semibold line-clamp-2 text-white drop-shadow">${escape_html(item.title)}</h3></div></a>`);
	});
}
//#endregion
export { ComingSoonCard as t };
