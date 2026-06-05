import { At as stringify, Dt as spread_props, Lt as attr, Mt as html, St as derived, Tt as head, mt as onDestroy, vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { i as SiteMeta } from "../../../../chunks/constants.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { r as invalidateAll } from "../../../../chunks/client.js";
import { t as page } from "../../../../chunks/state.js";
import { t as copilotContext } from "../../../../chunks/copilot.js";
import "../../../../chunks/navigation.js";
import { t as VideoPlayer } from "../../../../chunks/VideoPlayer.js";
import { t as ReportButton } from "../../../../chunks/ReportButton.js";
import { n as sectionLabel, r as translateRole } from "../../../../chunks/role-labels.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/share-2.svelte
function Share_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "share-2" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "18",
				"cy": "5",
				"r": "3"
			}],
			["circle", {
				"cx": "6",
				"cy": "12",
				"r": "3"
			}],
			["circle", {
				"cx": "18",
				"cy": "19",
				"r": "3"
			}],
			["line", {
				"x1": "8.59",
				"x2": "15.42",
				"y1": "13.51",
				"y2": "17.49"
			}],
			["line", {
				"x1": "15.41",
				"x2": "8.59",
				"y1": "6.51",
				"y2": "10.49"
			}]
		] }
	]));
}
//#endregion
//#region src/lib/components/widgets/PPVPaywall.svelte
function PPVPaywall($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Fallback display when /api/content/[id]/price is unreachable. */
		let { contentId, contentTitle, priceCents, onPurchased } = $$props;
		let loading = false;
		const fallbackDisplay = derived(() => `$${(priceCents / 100).toFixed(2)}`);
		const canonicalDisplay = derived(() => fallbackDisplay());
		const localized = derived(() => null);
		$$renderer.push(`<div class="flex flex-col items-center justify-center gap-6 p-8 text-center max-w-md mx-auto"><div class="w-16 h-16 rounded-full bg-[#FFBF00]/10 flex items-center justify-center text-3xl">🎬</div> <div><h2 class="text-xl font-bold text-white mb-2">Premium Content</h2> <p class="text-gray-400 text-sm"><strong class="text-white">${escape_html(contentTitle)}</strong> is available as pay-per-view. Purchase once and watch anytime.</p></div> <div class="bg-white/5 border border-white/10 rounded-xl p-6 w-full"><div class="text-4xl font-bold text-[#FFBF00] mb-1">${escape_html(canonicalDisplay())}</div> `);
		if (localized()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-sm text-gray-300 mt-1">≈ <span class="font-medium text-white">${escape_html(localized().display)}</span> <span class="text-gray-500">(${escape_html(localized().currency)})</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="text-gray-400 text-sm mt-2">One-time purchase · Watch anytime</div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button${attr("disabled", loading, true)} class="w-full bg-[#FFBF00] hover:bg-[#FFBF00]/90 disabled:opacity-50 text-black font-semibold py-3 px-6 rounded-xl transition-colors">${escape_html(`Buy for ${canonicalDisplay()}`)}</button> `);
		if (localized()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-[10px] text-gray-500">Charged in ${escape_html(void 0)}. Local currency shown for reference; final amount may vary by your card's FX.</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <p class="text-gray-500 text-xs">Upgrade to <a href="/plans" class="text-[#FFBF00] underline">Premium</a> for unlimited access to all content.</p></div>`);
	});
}
//#endregion
//#region src/lib/components/widgets/ReviewSection.svelte
function ReviewSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { contentId, contentType = "movie" } = $$props;
		let reviews = [];
		let userRating = 0;
		const avgRating = derived(() => reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null);
		function starClass(star, current) {
			return star <= current ? "text-[#FFBF00]" : "text-gray-600";
		}
		$$renderer.push(`<div class="space-y-6"><div class="flex items-center gap-4"><h3 class="text-lg font-semibold text-white">Reviews</h3> `);
		if (avgRating()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-1"><span class="text-[#FFBF00] font-bold">${escape_html(avgRating())}</span> <span class="text-[#FFBF00]">★</span> <span class="text-gray-400 text-sm">(${escape_html(reviews.length)})</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"><p class="text-sm text-gray-400">Rate this content</p> <div class="flex gap-1"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4,
				5
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let star = each_array[$$index];
				$$renderer.push(`<button${attr_class(`text-2xl transition-colors ${stringify(starClass(star, userRating))}`)}${attr("aria-label", `Rate ${stringify(star)} star`)}>★</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array_1 = ensure_array_like([1, 2]);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				each_array_1[$$index_1];
				$$renderer.push(`<div class="h-20 bg-white/5 rounded-xl animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/widgets/ShareButton.svelte
function ShareButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { contentId, title, description = "" } = $$props;
		let open = false;
		const url = derived(() => `${SiteMeta.link}/watch/${contentId}`);
		derived(() => encodeURIComponent(url()));
		derived(() => encodeURIComponent(title));
		derived(() => encodeURIComponent(description.slice(0, 200)));
		$$renderer.push(`<div class="relative inline-block"><button type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors" aria-haspopup="menu"${attr("aria-expanded", open)}>`);
		Share_2($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> Share</button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/routes/watch/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		const content = derived(() => data.content);
		const videoSchema = derived(() => {
			if (!content()) return null;
			const watchUrl = `${SiteMeta.link}/watch/${content().id}`;
			return {
				"@context": "https://schema.org",
				"@type": "VideoObject",
				name: content().title,
				description: content().description ?? "",
				thumbnailUrl: content().thumbnail || content().posterUrl || `${SiteMeta.link}${SiteMeta.ogimage}`,
				uploadDate: content().createdAt ? new Date(content().createdAt).toISOString() : void 0,
				duration: content().duration ?? void 0,
				contentRating: content().ageRating ?? void 0,
				genre: (content().genres ?? []).filter(Boolean),
				inLanguage: content().language ?? "en",
				url: watchUrl,
				...content().trailerUrl ? { trailer: {
					"@type": "VideoObject",
					contentUrl: content().trailerUrl
				} } : {},
				isFamilyFriendly: content().ageRating === "All" || content().ageRating === "7+" || content().category === "kids"
			};
		});
		onDestroy(() => copilotContext.set(null));
		const startAt = derived(() => () => {
			const t = page.url.searchParams.get("t");
			return t ? parseInt(t, 10) : 0;
		});
		const src = derived(() => () => {
			if (content().playbackUrl) return content().playbackUrl;
			if (content().videoUrl) return content().videoUrl;
			if (content().videoId) return `/api/watch/${content().videoId}`;
			return "";
		});
		function handleEnded() {}
		head("1oiicp0", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(content().title)} — Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", content().description ?? "")}/> <meta property="og:type" content="video.other"/> <meta property="og:title"${attr("content", `${content().title} — Sephar Studios`)}/> <meta property="og:description"${attr("content", content().description ?? "")}/> <meta property="og:image"${attr("content", content().posterUrl || content().thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`)}/> <meta name="twitter:title"${attr("content", `${content().title} — Sephar Studios`)}/> <meta name="twitter:description"${attr("content", content().description ?? "")}/> <meta name="twitter:image"${attr("content", content().posterUrl || content().thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`)}/> `);
			if (videoSchema()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`${html(`<script type="application/ld+json">${JSON.stringify(videoSchema())}<\/script>`)}`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`<div class="min-h-screen bg-[#0b0c10] text-white"><div class="w-full bg-black">`);
		if (data.paywall?.required) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="aspect-video flex items-center justify-center bg-zinc-900">`);
			PPVPaywall($$renderer, {
				contentId: content().id,
				contentTitle: content().title,
				priceCents: data.paywall.priceCents,
				onPurchased: () => void invalidateAll()
			});
			$$renderer.push(`<!----></div>`);
		} else if (src()()) {
			$$renderer.push("<!--[1-->");
			VideoPlayer($$renderer, {
				src: src()(),
				poster: content().backdropUrl ?? content().thumbnail ?? content().posterAutoUrl ?? void 0,
				contentId: content().id,
				startAt: startAt()(),
				title: content().title,
				subtitles: data.subtitles,
				descriptions: data.descriptions,
				chapters: content().chapters ?? [],
				endScreen: data.nextUp ?? [],
				previewVtt: content().previewThumbnailsVtt ?? void 0,
				previewSprites: content().previewSpriteUrls ?? [],
				enableAds: true,
				onEnded: handleEnded
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="aspect-video flex items-center justify-center bg-zinc-900"><p class="text-zinc-400">${escape_html(content().processingStatus === "ready" ? "Video not available yet." : "Video is still processing.")}</p></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="max-w-5xl mx-auto px-4 py-8"><div class="flex flex-wrap items-start gap-4 mb-4"><div class="flex-1 min-w-0"><div class="flex items-start gap-3"><h1 class="text-3xl font-bold leading-tight flex-1">${escape_html(content().title)}</h1> `);
		ShareButton($$renderer, {
			contentId: content().id,
			title: content().title,
			description: content().description ?? ""
		});
		$$renderer.push(`<!----> `);
		ReportButton($$renderer, {
			targetType: "content",
			targetId: content().id
		});
		$$renderer.push(`<!----></div> <div class="flex flex-wrap gap-3 mt-2 text-sm text-zinc-400">`);
		if (content().year) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(content().year)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content().duration) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(content().duration)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content().ageRating) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="px-2 py-0.5 border border-zinc-600 rounded text-xs uppercase tracking-wide">${escape_html(content().ageRating)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content().rating) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="flex items-center gap-1"><span class="text-yellow-400">★</span> ${escape_html(content().rating)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content().language && content().language !== "English") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(content().language)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div> `);
		if (content().genres?.length) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2 mb-4"><!--[-->`);
			const each_array = ensure_array_like(content().genres);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let genre = each_array[$$index];
				$$renderer.push(`<span class="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">${escape_html(genre)}</span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content().description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-zinc-300 leading-relaxed mb-6 max-w-3xl">${escape_html(content().description)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content().bibleReference) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 mb-6 text-sm text-amber-400"><span>📖</span> <span>${escape_html(content().bibleReference)}</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content().cast && content().cast.length > 0 || content().crew && content().crew.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<details class="mb-6 surface-1 rounded-xl"><summary class="cursor-pointer px-4 py-3 text-sm font-medium text-white">${escape_html(sectionLabel("castAndCrew", data.viewerLocale))}</summary> <div class="px-4 pb-4 space-y-4">`);
			if (content().cast && content().cast.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div><div class="text-xs uppercase tracking-wide text-gray-400 mb-2">${escape_html(sectionLabel("cast", data.viewerLocale))}</div> <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"><!--[-->`);
				const each_array_1 = ensure_array_like(content().cast);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let p = each_array_1[$$index_1];
					$$renderer.push(`<li class="flex items-center gap-2">`);
					if (p.photoUrl) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<img${attr("src", p.photoUrl)} alt="" class="w-8 h-8 rounded-full object-cover"/>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div class="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">${escape_html((p.name ?? "?").charAt(0).toUpperCase())}</div>`);
					}
					$$renderer.push(`<!--]--> <div class="min-w-0"><div class="text-sm text-white truncate">${escape_html(p.name)}</div> <div class="text-xs text-gray-400 truncate">${escape_html(p.characterName ? `${sectionLabel("as", data.viewerLocale)} ${p.characterName}` : translateRole(p.role, data.viewerLocale))}</div></div></li>`);
				}
				$$renderer.push(`<!--]--></ul></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (content().crew && content().crew.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div><div class="text-xs uppercase tracking-wide text-gray-400 mb-2">${escape_html(sectionLabel("crew", data.viewerLocale))}</div> <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"><!--[-->`);
				const each_array_2 = ensure_array_like(content().crew);
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let p = each_array_2[$$index_2];
					$$renderer.push(`<li class="flex justify-between text-gray-200"><span>${escape_html(p.name)}</span> <span class="text-gray-400">${escape_html(translateRole(p.role, data.viewerLocale))}</span></li>`);
				}
				$$renderer.push(`<!--]--></ul></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></details>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <hr class="border-zinc-800 mb-8"/> `);
		ReviewSection($$renderer, {
			contentId: content().id,
			contentType: content().mediaType
		});
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
export { _page as default };
