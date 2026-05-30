import { Ct as unsubscribe_stores, St as stringify, _t as head, bt as store_get, dt as attr_style, gt as ensure_array_like, jt as escape_html, kt as attr, mt as derived, ot as onDestroy, ut as attr_class, wt as html, yt as spread_props } from "../../../../chunks/ui-libs.js";
import { i as SiteMeta } from "../../../../chunks/constants.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as copilotContext } from "../../../../chunks/copilot.js";
import { t as page } from "../../../../chunks/stores.js";
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
//#region src/lib/components/widgets/VideoPlayer.svelte
function VideoPlayer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Audio descriptions (WCAG 1.2.5 / SC 1.2.7). Each entry is a separate
		* description track rendered as `<track kind="descriptions">`. Browsers
		* surface them via a media-controls picker; assistive tech reads them
		* out alongside the video soundtrack.
		*/
		let { src, poster, contentId, startAt = 0, title, subtitles = [], descriptions = [], onEnded } = $$props;
		let playing = false;
		let currentTime = 0;
		let duration = 0;
		let volume = 1;
		let muted = false;
		let fullscreen = false;
		let controlsTimer;
		let levels = [];
		let speed = 1;
		let progressInterval;
		let activeInterval;
		async function reportProgress() {}
		function formatTime(s) {
			if (!s || isNaN(s)) return "0:00";
			const h = Math.floor(s / 3600);
			const m = Math.floor(s % 3600 / 60);
			const sec = Math.floor(s % 60);
			return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}` : `${m}:${sec.toString().padStart(2, "0")}`;
		}
		const progressPct = derived(() => 0);
		const bufferedPct = derived(() => 0);
		const qualityLabel = derived(() => "Auto");
		onDestroy(() => {
			reportProgress();
			clearInterval(progressInterval);
			clearInterval(activeInterval);
			clearTimeout(controlsTimer);
		});
		$$renderer.push(`<div class="relative bg-black w-full aspect-video select-none group" role="application" aria-label="Video player" tabindex="0"><video${attr("poster", poster)} class="w-full h-full" playsinline=""><!--[-->`);
		const each_array = ensure_array_like(subtitles);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let sub = each_array[$$index];
			$$renderer.push(`<track kind="subtitles"${attr("label", sub.label)}${attr("src", sub.src)}${attr("srclang", sub.srclang)}/>`);
		}
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(descriptions);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let d = each_array_1[$$index_1];
			$$renderer.push(`<track kind="descriptions"${attr("label", d.label)}${attr("src", d.src)}${attr("srclang", d.srclang)}/>`);
		}
		$$renderer.push(`<!--]--></video>  <div${attr_class(`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 opacity-100`)} role="presentation">`);
		if (title) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-4 left-4 text-white text-sm font-medium drop-shadow">${escape_html(title)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->  <div class="mx-4 mb-2 h-1.5 bg-white/20 rounded-full cursor-pointer group/bar hover:h-3 transition-all relative" role="slider" aria-label="Video progress" aria-valuemin="0" aria-valuemax="100"${attr("aria-valuenow", Math.round(progressPct()))} tabindex="0"><div class="absolute inset-y-0 left-0 bg-white/30 rounded-full"${attr_style(`width: ${stringify(bufferedPct())}%`)}></div> <div class="absolute inset-y-0 left-0 bg-[#FF5E0E] rounded-full"${attr_style(`width: ${stringify(progressPct())}%`)}><div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow"></div></div></div> <div class="flex items-center gap-3 px-4 pb-4"><button${attr("aria-label", "Play")}${attr("aria-pressed", playing)} class="text-white hover:text-[#FF5E0E] transition-colors">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5,3 19,12 5,21"></polygon></svg>`);
		$$renderer.push(`<!--]--></button> <button aria-label="Skip backward 10 seconds" class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">↺10</button> <button aria-label="Skip forward 10 seconds" class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">10↻</button> <span class="text-white text-xs tabular-nums">${escape_html(formatTime(currentTime))} / ${escape_html(formatTime(duration))}</span> <div class="flex-1"></div> <div class="flex items-center gap-2"><button${attr("aria-label", "Mute")}${attr("aria-pressed", muted)} class="text-white hover:text-[#FF5E0E] transition-colors">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`);
		$$renderer.push(`<!--]--></button> <input type="range" min="0" max="1" step="0.05"${attr("value", volume)} aria-label="Volume" aria-valuemin="0" aria-valuemax="100"${attr("aria-valuenow", Math.round(volume * 100))} class="w-20 h-1 accent-[#FF5E0E] cursor-pointer"/></div> <div class="relative"><button class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1">${escape_html(speed)}x</button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (levels.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative"><button class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1">${escape_html(qualityLabel())}</button> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (subtitles.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors" aria-label="Toggle closed captions">CC</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button${attr("aria-label", "Enter fullscreen")}${attr("aria-pressed", fullscreen)} class="text-white hover:text-[#FF5E0E] transition-colors">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>`);
		$$renderer.push(`<!--]--></button></div></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<button type="button" aria-label="Play video" class="absolute inset-0 flex items-center justify-center pointer-events-none"><div class="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"><svg class="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"></polygon></svg></div></button>`);
		$$renderer.push(`<!--]--></div>`);
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
		var $$store_subs;
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
			const t = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("t");
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
		if (src()()) {
			$$renderer.push("<!--[0-->");
			VideoPlayer($$renderer, {
				src: src()(),
				poster: content().backdropUrl ?? content().thumbnail ?? void 0,
				contentId: content().id,
				startAt: startAt()(),
				title: content().title,
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
		$$renderer.push(`<!--]--> <hr class="border-zinc-800 mb-8"/> `);
		ReviewSection($$renderer, {
			contentId: content().id,
			contentType: content().mediaType
		});
		$$renderer.push(`<!----></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
