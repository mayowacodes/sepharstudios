import { aJ as onDestroy, ah as attr, as as ensure_array_like, ai as attr_class, au as escape_html, aj as attr_style, aR as stringify, ap as derived } from './ui-libs-BjzLDLAh.js';

//#region src/lib/components/widgets/VideoPlayer.svelte
function VideoPlayer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
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
		let { src, poster, contentId, startAt = 0, title, subtitles = [], descriptions = [], chapters = [], endScreen = [], previewVtt, previewSprites = [], enableAds = false, onEnded, onTimeUpdate } = $$props;
		const currentChapter = derived(() => {
			if (!chapters || chapters.length === 0) return null;
			let active = null;
			for (const c of chapters) if (c.start <= currentTime) active = c;
			else break;
			return active;
		});
		const hoveredCue = derived(() => null);
		let playing = false;
		let currentTime = 0;
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
			return "0:00";
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
		$$renderer.push(`<!--]--></video> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (endScreen && endScreen.length > 0 && false);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->  <div${attr_class(`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 opacity-100`)} role="presentation">`);
		if (title) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-4 left-4 text-white text-sm font-medium drop-shadow">${escape_html(title)}</div>`);
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
		$$renderer.push(`<!--]--></button> <button aria-label="Skip backward 10 seconds" class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">↺10</button> <button aria-label="Skip forward 10 seconds" class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">10↻</button> <span class="text-white text-xs tabular-nums">${escape_html(formatTime())} / ${escape_html(formatTime())}</span> <div class="flex-1"></div> <div class="flex items-center gap-2"><button${attr("aria-label", "Mute")}${attr("aria-pressed", muted)} class="text-white hover:text-[#FF5E0E] transition-colors">`);
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

export { VideoPlayer as V };
//# sourceMappingURL=VideoPlayer-DiIZAVzI.js.map
