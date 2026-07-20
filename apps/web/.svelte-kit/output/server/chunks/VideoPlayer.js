import { Ct as attr_style, Et as derived, Ht as attr, Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html, vt as onDestroy } from "./ui-libs.js";
//#region src/lib/components/widgets/VideoPlayer.svelte
function VideoPlayer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Cinematic metadata shown in the player's hover overlay. `ageRating`
		* renders as a small bordered pill in the top strip; `genres` render
		* as glass chips next to it (first 3 only — anything more clutters
		* the player and is already on the page below).
		*/
		/**
		* Audio descriptions (WCAG 1.2.5 / SC 1.2.7). Each entry is a separate
		* description track rendered as `<track kind="descriptions">`. Browsers
		* surface them via a media-controls picker; assistive tech reads them
		* out alongside the video soundtrack.
		*/
		/**
		* Chapter markers. start in seconds; tick marks render above the seek
		* bar and `>` / `<` keys jump between chapters.
		*/
		/** Slots for the end-screen overlay (Item 3). */
		/**
		* End-screen cards shown in the final ~10% of playback. `href`
		* (when present) wins over the default `/watch/<slug-or-id>` —
		* useful for next-episode cards that need `?episode=<id>`
		* appended. `kind` labels the card with a small chip ("NEXT
		* EPISODE", "UP NEXT", etc.) for context.
		*/
		/**
		* When true, the end-screen header swaps to a "You've reached the
		* end of the series" finale message and the auto-advance
		* countdown is suppressed. Filler cards (genre / creator picks)
		* still render below.
		*/
		/**
		* Direct URL to the next episode (when watching a TV title and
		* there is one). Two pieces of UX hang off this:
		*   - A small "Next Episode" button next to the play controls so
		*     viewers can skip ahead without waiting for the end-screen.
		*   - Automatic navigation at 95% playback (Netflix-style "skip
		*     credits"). Suppresses the end-screen countdown for that case
		*     so the auto-advance fires once, not twice.
		*/
		/**
		* Scrubbing-preview VTT URL produced by the encoder orchestrator's
		* scan-ready webhook. Cues encode a sprite-sheet region in the cue
		* text as `sprite_N.jpg#xywh=x,y,w,h` (relative path or absolute URL).
		*/
		/**
		* Sprite sheet URLs that the VTT cues reference. Used to resolve
		* relative `sprite_N.jpg` cue text against the right host.
		*/
		/** Fires on every `timeupdate` (~4×/sec). Useful when the parent
		*  wants to anchor a UI affordance to the playhead (e.g. the admin
		*  review page's "Add note at MM:SS" button). */
		/**
		* When true (and contentId set), VideoPlayer auto-fetches
		* /api/ads/vast-tag and plays the returned URL as a pre-roll before
		* the main content. Treats the URL as a direct video src — sufficient
		* for raw MP4 creatives.
		*
		* Upgrade path to full VAST tracking (impression / quartile / click-
		* thru / complete pings): replace the inline pre-roll <video> below
		* with a Google IMA SDK ad-display container, parse the URL as VAST
		* XML, and fire the tracking events emitted by IMA. The contract this
		* exposes (skip on null, swap to main src on ad complete) is
		* unchanged so the upgrade is local to the player.
		*/
		let { src, poster, contentId, startAt = 0, title, ageRating, genres = [], subtitles = [], descriptions = [], chapters = [], endScreen = [], endOfSeries = false, nextEpisodeHref, previewVtt, previewSprites = [], enableAds = false, onEnded, onTimeUpdate } = $$props;
		const displayGenres = derived(() => (genres ?? []).slice(0, 3));
		let endScreenInterval = null;
		const currentChapter = derived(() => {
			if (!chapters || chapters.length === 0) return null;
			let active = null;
			for (const c of chapters) if (c.start <= currentTime) active = c;
			else break;
			return active;
		});
		const SKIP_INTRO_NAMES = /^(intro|opening|theme|opening credits)$/i;
		const SKIP_OUTRO_NAMES = /^(credits|outro|end|end credits|closing|ending)$/i;
		const skipIntroTarget = derived(() => {
			if (!chapters || chapters.length === 0) return null;
			const ch = currentChapter();
			if (!ch || !SKIP_INTRO_NAMES.test(ch.title.trim())) return null;
			const idx = chapters.findIndex((c) => c.start === ch.start);
			const next = idx >= 0 ? chapters[idx + 1] : void 0;
			const target = next ? next.start : ch.start + 90;
			if (currentTime >= target) return null;
			return target;
		});
		const skipOutroTarget = derived(() => {
			if (!chapters || chapters.length === 0) return null;
			const ch = currentChapter();
			if (!ch || !SKIP_OUTRO_NAMES.test(ch.title.trim())) return null;
			if (duration <= 0) return null;
			return Math.max(0, duration - .5);
		});
		let hls = null;
		let initSeq = 0;
		const hoveredCue = derived(() => null);
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
		let inPip = false;
		const pipSupported = derived(() => typeof document !== "undefined" && "pictureInPictureEnabled" in document && document.pictureInPictureEnabled === true);
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
		let prerollSkippableTimer = null;
		onDestroy(() => {
			reportProgress();
			initSeq += 1;
			hls?.destroy();
			hls = null;
			clearInterval(progressInterval);
			clearInterval(activeInterval);
			clearTimeout(controlsTimer);
			if (endScreenInterval) {
				clearInterval(endScreenInterval);
				endScreenInterval = null;
			}
			if (prerollSkippableTimer) {
				clearInterval(prerollSkippableTimer);
				prerollSkippableTimer = null;
			}
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
		$$renderer.push(`<!--]--></video> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (skipIntroTarget() !== null) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="absolute bottom-20 right-4 z-30 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-black text-sm font-semibold shadow-lg transition-colors backdrop-blur">Skip Intro</button>`);
		} else if (skipOutroTarget() !== null) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<button type="button" class="absolute bottom-20 right-4 z-30 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-black text-sm font-semibold shadow-lg transition-colors backdrop-blur">Skip Credits</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (endScreen && endScreen.length > 0 && false);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->  <div${attr_class(`absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 opacity-100`)} role="presentation">`);
		if (title) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-0 inset-x-0 pointer-events-none bg-linear-to-b from-black/60 via-black/20 to-transparent pt-3 pb-10 px-4"><div class="relative h-6 sm:h-7"><!---->`);
			$$renderer.push(`<div class="absolute inset-0 text-white text-sm sm:text-base font-medium drop-shadow truncate">${escape_html(title)}</div>`);
			$$renderer.push(`<!----></div> `);
			if (ageRating || displayGenres().length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-1.5 flex flex-wrap items-center gap-2">`);
				if (ageRating) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="px-2 py-0.5 border border-white/30 rounded text-[10px] uppercase tracking-wider text-white/90 bg-black/30 backdrop-blur-sm">${escape_html(ageRating)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <!--[-->`);
				const each_array_3 = ensure_array_like(displayGenres());
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					let genre = each_array_3[$$index_3];
					$$renderer.push(`<span class="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[10px] text-white/90">${escape_html(genre)}</span>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (currentChapter()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mx-4 mb-1 text-xs text-white/80 truncate"><span class="text-white/60">Chapter:</span> ${escape_html(currentChapter().title)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->  <div class="mx-4 mb-2 h-1.5 bg-white/20 rounded-full cursor-pointer group/bar hover:h-3 transition-all relative" role="slider" aria-label="Video progress" aria-valuemin="0" aria-valuemax="100"${attr("aria-valuenow", Math.round(progressPct()))} tabindex="0">`);
		if (hoveredCue() && false);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="absolute inset-y-0 left-0 bg-white/30 rounded-full"${attr_style(`width: ${stringify(bufferedPct())}%`)}></div> <div class="absolute inset-y-0 left-0 bg-[#FF5E0E] rounded-full"${attr_style(`width: ${stringify(progressPct())}%`)}><div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow"></div></div> `);
		if (chapters && chapters.length > 0 && false);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex items-center gap-3 px-4 pb-4"><button${attr("aria-label", "Play")}${attr("aria-pressed", playing)} class="text-white hover:text-[#FF5E0E] transition-colors">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5,3 19,12 5,21"></polygon></svg>`);
		$$renderer.push(`<!--]--></button> <button aria-label="Skip backward 10 seconds" class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">↺10</button> <button aria-label="Skip forward 10 seconds" class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">10↻</button> `);
		if (nextEpisodeHref) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a${attr("href", nextEpisodeHref)} aria-label="Play next episode (N)" title="Next episode (N)" class="text-white hover:text-[#FF5E0E] transition-colors inline-flex items-center gap-1 text-xs font-semibold"><svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><polygon points="6,4 14,12 6,20"></polygon><rect x="15" y="4" width="3" height="16"></rect></svg> <span class="hidden sm:inline">Next</span></a>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <span class="text-white text-xs tabular-nums">${escape_html(formatTime(currentTime))} / ${escape_html(formatTime(duration))}</span> <div class="flex-1"></div> <div class="flex items-center gap-2"><button${attr("aria-label", "Mute")}${attr("aria-pressed", muted)} class="text-white hover:text-[#FF5E0E] transition-colors">`);
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
		$$renderer.push(`<!--]--> <button type="button" aria-label="Show keyboard shortcuts" class="text-white/70 hover:text-[#FF5E0E] transition-colors text-base font-bold">?</button> `);
		if (pipSupported()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button${attr("aria-label", "Enter Picture-in-Picture")}${attr("aria-pressed", inPip)} class="text-white hover:text-[#FF5E0E] transition-colors"><svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"></path></svg></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button${attr("aria-label", "Enter fullscreen")}${attr("aria-pressed", fullscreen)} class="text-white hover:text-[#FF5E0E] transition-colors">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>`);
		$$renderer.push(`<!--]--></button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<button type="button" aria-label="Play video" class="absolute inset-0 flex items-center justify-center pointer-events-none"><div class="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"><svg class="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"></polygon></svg></div></button>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { VideoPlayer as t };
