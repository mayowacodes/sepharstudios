import { Ct as attr_style, Et as derived, Ft as unsubscribe_stores, Ht as attr, Mt as store_get, Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html, vt as onDestroy } from "./ui-libs.js";
import { t as Bell_ring } from "./bell-ring.js";
import { t as Bell } from "./bell.js";
import { n as Bookmark_check, t as Bookmark } from "./bookmark.js";
import { t as Check_check } from "./check-check.js";
import { t as Check } from "./check.js";
import { t as Circle_play } from "./circle-play.js";
import { t as Rotate_ccw } from "./rotate-ccw.js";
import { n as ShareButton, t as ReviewSection } from "./ReviewSection.js";
import { t as Volume_x } from "./volume-x.js";
import { t as X } from "./x.js";
import { n as toast } from "./toast-state.svelte.js";
import { n as goto } from "./client.js";
import "./navigation.js";
import { t as Button } from "./button.js";
import { t as myList } from "./myList.js";
//#region src/lib/components/widgets/MediaPreviewPlayer.svelte
function MediaPreviewPlayer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Start playback at this many seconds into the source. */
		/** Stop playback after this many seconds elapsed since `startAt`. */
		let { src, poster, startAt = 0, maxDurationSec = 60 } = $$props;
		let hlsInstance = null;
		derived(() => startAt + maxDurationSec);
		onDestroy(() => {
			if (hlsInstance) {
				try {
					hlsInstance.destroy();
				} catch {}
				hlsInstance = null;
			}
		});
		$$renderer.push(`<div class="relative w-full h-full bg-black rounded-xl overflow-hidden group"><video${attr("poster", poster)} class="w-full h-full object-cover" playsinline="" preload="metadata"></video> <button type="button"${attr("aria-label", "Unmute preview")} class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-60 group-hover:opacity-100 transition-opacity">`);
		$$renderer.push("<!--[-1-->");
		Volume_x($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!--]--></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/widgets/ParentalGate.svelte
function ParentalGate($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onPass, onClose } = $$props;
		let factorA = 0;
		let factorB = 0;
		let answer = "";
		let lockoutUntil = 0;
		let lockoutRemaining = 0;
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="button" tabindex="-1" aria-label="Close grown-up check"><div${attr_class(`w-full max-w-md bg-gradient-to-br from-yellow-50 to-pink-100 rounded-3xl shadow-2xl border-4 border-pink-300 p-6 relative `)} role="dialog" tabindex="-1" aria-labelledby="parental-gate-title" aria-modal="true"><button type="button" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-pink-200 hover:bg-pink-300 text-pink-700 flex items-center justify-center" aria-label="Close">`);
			X($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button> <div id="parental-gate-title" class="text-center space-y-1 mb-5"><div class="text-3xl">🪧</div> <h2 class="text-xl font-bold text-pink-700">Grown-up check!</h2> <p class="text-sm text-pink-700/70">Quick math to make sure a grown-up is here.</p></div> `);
			if (lockoutUntil > Date.now()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-center space-y-3 py-4"><div class="text-4xl">⏳</div> <div class="text-pink-700 font-semibold">Hold on a moment</div> <div class="text-sm text-pink-700/70">Too many tries. Try again in ${escape_html(lockoutRemaining)}s.</div></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="space-y-4"><div class="text-center text-4xl sm:text-5xl font-bold text-pink-700">${escape_html(factorA)} × ${escape_html(factorB)} = ?</div> <input${attr("value", answer)} type="number" inputmode="numeric" placeholder="Your answer" class="w-full px-4 py-3 rounded-xl bg-white border-2 border-pink-300 text-pink-800 text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400" aria-label="Answer"/> <button type="button" class="w-full px-4 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold shadow-lg transition-colors">I'm a grown-up</button> `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/MediaDetailPage.svelte
function MediaDetailPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		/** Resolved master playlist URL (server load runs encoder-playback helper). */
		/** Workflow state. When 'coming_soon', the page replaces the
		*  Watch CTA with a Notify-me toggle and hides Mark as Watched.
		*  Other values render the normal playable layout. */
		/** Planned go-live timestamp for coming_soon rows. Drives the
		*  "Releases [date]" copy under the title. */
		/** Set when the most-recent progress row is for a TV episode.
		*  Used to enrich the Resume CTA label ("Resume S2 E5 · 12:34"). */
		/** True when the loader has advanced us to the next unwatched
		*  episode (last one was complete). Drives a "Watch Next" CTA
		*  instead of "Resume". */
		/** TV series episodes — empty/undefined for movies & documentaries. */
		/** Server-supplied progress for this title (signed-in viewers only).
		*  When present + non-trivial, the hero shows a Resume CTA next to
		*  the standard Watch button. */
		/** True when this content is already in the user's default
		*  playlist ("My List"). Drives the initial bookmark button state. */
		/** Future hook for kids/teens variants; defaults to standard. */
		/** Length of the auto-play preview clip. Detail-page default is 60s
		*  for adults; kids/teens will pass shorter values in their routes. */
		let { content, episodes = [], watchProgress = null, isInMyList = false, mode = "standard", previewDurationSec = 60 } = $$props;
		const inList = derived(() => isInMyList);
		const togglingList = derived(() => store_get($$store_subs ??= {}, "$myList", myList).pending.has(content.id));
		async function toggleMyList() {
			await myList.toggle({
				contentId: content.id,
				contentTitle: content.title,
				contentType: content.mediaType ?? "movie"
			});
		}
		const isComingSoon = derived(() => content.status === "coming_soon");
		let notifySubscribed = false;
		let notifyBusy = false;
		const releaseLabel = derived(() => {
			const raw = content.scheduledPublishAt ?? null;
			if (!raw) return null;
			const ts = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
			if (Number.isNaN(ts)) return null;
			return new Date(ts).toLocaleDateString(void 0, {
				month: "long",
				day: "numeric",
				year: "numeric"
			});
		});
		async function toggleNotify() {
			if (notifyBusy) return;
			notifyBusy = true;
			const previous = notifySubscribed;
			notifySubscribed = !notifySubscribed;
			try {
				const res = await fetch(`/api/coming-soon/${content.id}/notify`, { method: "POST" });
				if (!res.ok) {
					notifySubscribed = previous;
					toast.error("Couldn't update reminder");
					return;
				}
				notifySubscribed = !!(await res.json()).subscribed;
				toast.success(notifySubscribed ? `We'll notify you when ${content.title} drops` : `Reminder removed for ${content.title}`);
			} catch {
				notifySubscribed = previous;
				toast.error("Network error");
			} finally {
				notifyBusy = false;
			}
		}
		let markingWatched = false;
		const looksWatched = derived(() => (watchProgress?.completionPercent ?? 0) >= 95);
		let gateOpen = false;
		let pendingHref = null;
		const theme = derived(() => {
			switch (mode) {
				case "kids": return {
					pageBg: "bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-100 text-pink-900",
					backdropOpacity: "opacity-20",
					backdropGradient: "bg-gradient-to-b from-transparent via-pink-50/60 to-yellow-50",
					titleClasses: "text-pink-700",
					titleSize: "text-5xl sm:text-6xl",
					metaTextColor: "text-pink-700/80",
					ageChipClasses: "border-pink-400 text-pink-700",
					genreChipClasses: "bg-pink-200 text-pink-800 border-pink-300 text-sm",
					descTextColor: "text-pink-900/80",
					descToggleColor: "text-pink-600 hover:text-pink-800",
					bibleColor: "text-amber-600",
					chipBoxClasses: "bg-white border-pink-200",
					chipTextPrimary: "text-pink-800",
					chipTextSecondary: "text-pink-500",
					watchClass: "bg-pink-500 hover:bg-pink-600 text-white shadow-[0_0_24px_rgba(236,72,153,0.5)] hover:scale-110 transition-all",
					watchLabel: "Play!",
					outlineBtnClass: "border-pink-400 text-pink-700 hover:bg-pink-100",
					ctaSize: "lg",
					previewBorder: "border-pink-300",
					avatarSize: "w-8 h-8",
					featuringHeading: "You'll see",
					showMoreLabel: "Read more",
					showLessLabel: "Show less"
				};
				case "teens": return {
					pageBg: "bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white",
					backdropOpacity: "opacity-30",
					backdropGradient: "bg-gradient-to-b from-transparent via-indigo-950/60 to-indigo-950",
					titleClasses: "text-white",
					titleSize: "text-4xl sm:text-5xl",
					metaTextColor: "text-indigo-100/80",
					ageChipClasses: "border-indigo-300/40 text-indigo-100",
					genreChipClasses: "bg-indigo-500/20 border-indigo-300/30 text-indigo-100 text-xs",
					descTextColor: "text-indigo-50/90",
					descToggleColor: "text-indigo-200/70 hover:text-white",
					bibleColor: "text-amber-300",
					chipBoxClasses: "bg-indigo-500/10 border-indigo-300/20",
					chipTextPrimary: "text-indigo-50",
					chipTextSecondary: "text-indigo-200/60",
					watchClass: "bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:scale-105 transition-all",
					watchLabel: "Watch",
					outlineBtnClass: "border-indigo-300/40 text-white hover:bg-indigo-500/20",
					ctaSize: "lg",
					previewBorder: "border-indigo-300/30",
					avatarSize: "w-6 h-6",
					featuringHeading: "Featuring",
					showMoreLabel: "Show more",
					showLessLabel: "Show less"
				};
				default: return {
					pageBg: "bg-[#0b0c10] text-white",
					backdropOpacity: "opacity-40",
					backdropGradient: "bg-gradient-to-b from-transparent via-[#0b0c10]/40 to-[#0b0c10]",
					titleClasses: "text-white",
					titleSize: "text-4xl sm:text-5xl",
					metaTextColor: "text-white/70",
					ageChipClasses: "border-white/30 text-white",
					genreChipClasses: "bg-white/8 backdrop-blur-sm border-white/10 text-white/90 text-xs",
					descTextColor: "text-white/80",
					descToggleColor: "text-white/60 hover:text-white",
					bibleColor: "text-amber-300/90",
					chipBoxClasses: "bg-white/5 border-white/10",
					chipTextPrimary: "text-white/90",
					chipTextSecondary: "text-white/50",
					watchClass: "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_24px_rgba(255,94,14,0.5)] hover:scale-105 transition-all",
					watchLabel: "Watch",
					outlineBtnClass: "border-white/20 text-white hover:bg-white/10 backdrop-blur-sm",
					ctaSize: "lg",
					previewBorder: "border-white/10",
					avatarSize: "w-6 h-6",
					featuringHeading: "Featuring",
					showMoreLabel: "Show more",
					showLessLabel: "Show less"
				};
			}
		});
		const firstEpisodeId = derived(() => {
			if (!episodes || episodes.length === 0) return null;
			return [...episodes].sort((a, b) => a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber)[0]?.id ?? null;
		});
		const watchHref = derived(() => {
			const base = `/watch/${content.slug || content.id}`;
			return firstEpisodeId() ? `${base}?episode=${firstEpisodeId()}` : base;
		});
		const resumeHref = derived(() => {
			if (!watchProgress) return watchHref();
			const base = `/watch/${content.slug || content.id}`;
			const params = new URLSearchParams();
			params.set("t", String(watchProgress.positionSeconds));
			const episodeId = watchProgress.episodeId ?? firstEpisodeId();
			if (episodeId) params.set("episode", episodeId);
			return `${base}?${params.toString()}`;
		});
		const showResume = derived(() => !!watchProgress);
		const resumeTimeLabel = derived(() => {
			if (!watchProgress) return "";
			const total = Math.max(0, Math.floor(watchProgress.positionSeconds));
			const h = Math.floor(total / 3600);
			const m = Math.floor(total % 3600 / 60);
			const s = total % 60;
			const pad = (n) => String(n).padStart(2, "0");
			return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
		});
		const resumeEpisodeLabel = derived(() => {
			if (!watchProgress) return "";
			const ep = watchProgress.episodeSeason != null && watchProgress.episodeNumber != null ? `S${watchProgress.episodeSeason} E${watchProgress.episodeNumber}` : null;
			if (watchProgress.isNextEpisode) return ep ?? "";
			return ep ? `${ep} · ${resumeTimeLabel()}` : resumeTimeLabel();
		});
		const primaryCtaLabel = derived(() => watchProgress?.isNextEpisode ? "Watch Next" : "Resume");
		const PARENTAL_GATE_TTL_MS = 900 * 1e3;
		const PARENTAL_GATE_KEY = "sephar.parentalGate.passedUntil";
		function readGateExpiry() {
			if (typeof sessionStorage === "undefined") return 0;
			const raw = sessionStorage.getItem(PARENTAL_GATE_KEY);
			const n = raw ? Number.parseInt(raw, 10) : 0;
			return Number.isFinite(n) ? n : 0;
		}
		function writeGateExpiry(epochMs) {
			if (typeof sessionStorage === "undefined") return;
			sessionStorage.setItem(PARENTAL_GATE_KEY, String(epochMs));
		}
		function onCtaClick(href, e) {
			if (mode !== "kids") return;
			if (readGateExpiry() > Date.now()) return;
			e.preventDefault();
			pendingHref = href;
			gateOpen = true;
		}
		function onGatePass() {
			writeGateExpiry(Date.now() + PARENTAL_GATE_TTL_MS);
			const href = pendingHref;
			gateOpen = false;
			pendingHref = null;
			if (href) goto(href);
		}
		function onGateClose() {
			gateOpen = false;
			pendingHref = null;
		}
		const seasonMap = derived(() => {
			const map = /* @__PURE__ */ new Map();
			for (const ep of episodes ?? []) {
				const list = map.get(ep.seasonNumber) ?? [];
				list.push(ep);
				map.set(ep.seasonNumber, list);
			}
			for (const list of map.values()) list.sort((a, b) => a.episodeNumber - b.episodeNumber);
			return Array.from(map.entries()).sort(([a], [b]) => a - b);
		});
		const hasPreview = derived(() => !!content.playbackUrl);
		const hasDescription = derived(() => (content.description ?? "").trim().length > 0);
		const heroGenres = derived(() => (content.genres ?? []).slice(0, 4));
		$$renderer.push(`<div${attr_class(`relative min-h-screen ${stringify(theme().pageBg)}`)}><div class="absolute inset-x-0 top-0 h-[60vh] overflow-hidden"><img${attr("src", content.backdropUrl || content.posterUrl || content.thumbnail || "/placeholder-vertical.jpg")} alt=""${attr_class(`w-full h-full object-cover ${stringify(theme().backdropOpacity)}`)}/> <div${attr_class(`absolute inset-0 ${stringify(theme().backdropGradient)}`)}></div></div> <main class="relative z-10 container mx-auto px-4 pt-24 pb-12"><div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center mb-12"><div class="space-y-5 max-w-2xl"><div${attr_class(`flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider ${stringify(theme().metaTextColor)}`)}>`);
		if (content.mediaType) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span${attr_class(`px-2 py-0.5 rounded-full ${stringify(theme().chipBoxClasses)} border`)}>${escape_html(content.mediaType)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (mode !== "standard") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="px-2 py-0.5 rounded-full bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/30">${escape_html(mode)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (content.logoTitleUrl) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", content.logoTitleUrl)}${attr("alt", content.title)} class="max-h-28 sm:max-h-36 lg:max-h-44 w-auto object-contain drop-shadow-lg"/> <h1 class="sr-only">${escape_html(content.title)}</h1>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<h1${attr_class(`${stringify(theme().titleSize)} font-extrabold leading-tight text-display drop-shadow-lg ${stringify(theme().titleClasses)}`)}>${escape_html(content.title)}</h1>`);
		}
		$$renderer.push(`<!--]--> <div${attr_class(`flex flex-wrap items-center gap-3 text-sm ${stringify(theme().metaTextColor)}`)}>`);
		if (content.ageRating) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span${attr_class(`px-2 py-0.5 border rounded text-[11px] uppercase tracking-wider ${stringify(theme().ageChipClasses)}`)}>${escape_html(content.ageRating)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content.year) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(content.year)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content.duration) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(content.duration)} min</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content.language && content.language !== "English") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(content.language)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (heroGenres().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like(heroGenres());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let g = each_array[$$index];
				$$renderer.push(`<span${attr_class(`px-3 py-1 rounded-full border ${stringify(theme().genreChipClasses)}`)}>${escape_html(g)}</span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (hasDescription()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div><p${attr_class(`leading-relaxed ${stringify(theme().descTextColor)} line-clamp-2`)}>${escape_html(content.description)}</p> `);
			if ((content.description?.length ?? 0) > 140) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button"${attr_class(`text-xs mt-1 underline-offset-2 hover:underline ${stringify(theme().descToggleColor)}`)}>${escape_html(theme().showMoreLabel)}</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content.bibleReference) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`flex items-center gap-2 text-sm ${stringify(theme().bibleColor)}`)}><span>📖</span> <span>${escape_html(content.bibleReference)}</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (content.cast && content.cast.length > 0 || content.crew && content.crew.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="pt-2"><div${attr_class(`text-xs uppercase tracking-wider ${stringify(theme().metaTextColor)} mb-2`)}>${escape_html(theme().featuringHeading)}</div> <div class="flex flex-wrap gap-3"><!--[-->`);
			const each_array_1 = ensure_array_like((content.cast ?? []).slice(0, 6));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let p = each_array_1[$$index_1];
				$$renderer.push(`<div${attr_class(`flex items-center gap-2 px-2 py-1 rounded-full border ${stringify(theme().chipBoxClasses)}`)}>`);
				if (p.photoUrl) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", p.photoUrl)} alt=""${attr_class(`${stringify(theme().avatarSize)} rounded-full object-cover`)}/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div${attr_class(`${stringify(theme().avatarSize)} rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center`)}>${escape_html((p.name ?? "?").charAt(0).toUpperCase())}</div>`);
				}
				$$renderer.push(`<!--]--> <div class="text-xs"><div${attr_class(`${stringify(theme().chipTextPrimary)} leading-tight`)}>${escape_html(p.name)}</div> `);
				if (p.characterName) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div${attr_class(`${stringify(theme().chipTextSecondary)} leading-tight`)}>as ${escape_html(p.characterName)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--> <!--[-->`);
			const each_array_2 = ensure_array_like((content.crew ?? []).slice(0, 3));
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let p = each_array_2[$$index_2];
				$$renderer.push(`<div${attr_class(`flex items-center gap-2 px-2 py-1 rounded-full border ${stringify(theme().chipBoxClasses)}`)}>`);
				if (p.photoUrl) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", p.photoUrl)} alt=""${attr_class(`${stringify(theme().avatarSize)} rounded-full object-cover`)}/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div${attr_class(`${stringify(theme().avatarSize)} rounded-full bg-zinc-600 text-white text-[10px] font-bold flex items-center justify-center`)}>${escape_html((p.name ?? "?").charAt(0).toUpperCase())}</div>`);
				}
				$$renderer.push(`<!--]--> <div class="text-xs"><div${attr_class(`${stringify(theme().chipTextPrimary)} leading-tight`)}>${escape_html(p.name)}</div> <div${attr_class(`${stringify(theme().chipTextSecondary)} leading-tight`)}>${escape_html(p.role)}</div></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex flex-wrap items-center gap-3 pt-3">`);
		if (isComingSoon()) {
			$$renderer.push("<!--[0-->");
			if (releaseLabel()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="w-full text-sm text-white/70">Releases <span class="font-semibold text-white">${escape_html(releaseLabel())}</span></p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				size: theme().ctaSize,
				onclick: toggleNotify,
				disabled: notifyBusy,
				class: notifySubscribed ? "bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]" : theme().outlineBtnClass,
				children: ($$renderer) => {
					if (notifySubscribed) {
						$$renderer.push("<!--[0-->");
						Bell_ring($$renderer, { class: "mr-2 h-5 w-5" });
						$$renderer.push(`<!----> You'll be notified`);
					} else {
						$$renderer.push("<!--[-1-->");
						Bell($$renderer, { class: "mr-2 h-5 w-5" });
						$$renderer.push(`<!----> Notify me when it drops`);
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		} else if (showResume()) {
			$$renderer.push("<!--[1-->");
			Button($$renderer, {
				size: theme().ctaSize,
				href: resumeHref(),
				onclick: (e) => onCtaClick(resumeHref(), e),
				class: theme().watchClass,
				children: ($$renderer) => {
					Circle_play($$renderer, { class: "mr-2 h-5 w-5" });
					$$renderer.push(`<!----> ${escape_html(primaryCtaLabel())}${escape_html(resumeEpisodeLabel() ? ` · ${resumeEpisodeLabel()}` : "")}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (!watchProgress?.isNextEpisode) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					size: theme().ctaSize,
					variant: "outline",
					href: watchHref(),
					onclick: (e) => onCtaClick(watchHref(), e),
					class: theme().outlineBtnClass,
					children: ($$renderer) => {
						Rotate_ccw($$renderer, { class: "mr-2 h-4 w-4" });
						$$renderer.push(`<!----> Start over`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			Button($$renderer, {
				size: theme().ctaSize,
				href: watchHref(),
				onclick: (e) => onCtaClick(watchHref(), e),
				class: theme().watchClass,
				children: ($$renderer) => {
					Circle_play($$renderer, { class: "mr-2 h-5 w-5" });
					$$renderer.push(`<!----> ${escape_html(theme().watchLabel)}`);
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--> `);
		Button($$renderer, {
			size: theme().ctaSize,
			variant: "outline",
			class: theme().outlineBtnClass,
			disabled: togglingList(),
			onclick: toggleMyList,
			children: ($$renderer) => {
				if (inList()) {
					$$renderer.push("<!--[0-->");
					Bookmark_check($$renderer, { class: "mr-2 h-4 w-4" });
					$$renderer.push(`<!----> In My List`);
				} else {
					$$renderer.push("<!--[-1-->");
					Bookmark($$renderer, { class: "mr-2 h-4 w-4" });
					$$renderer.push(`<!----> My List`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		ShareButton($$renderer, {
			contentId: content.slug || content.id,
			title: content.title,
			description: content.description ?? ""
		});
		$$renderer.push(`<!----> `);
		if (mode !== "kids" && !isComingSoon()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button"${attr("disabled", markingWatched, true)}${attr("aria-pressed", looksWatched())}${attr("aria-label", looksWatched() ? `Remove watched status from ${content.title}` : `Mark ${content.title} as watched`)}${attr_class(`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${stringify(looksWatched() ? "border-green-500/50 bg-green-500/15 text-green-200 hover:bg-green-500/25" : theme().outlineBtnClass)}`)}>`);
			if (looksWatched()) {
				$$renderer.push("<!--[0-->");
				Check_check($$renderer, { class: "h-4 w-4" });
				$$renderer.push(`<!----> Watched`);
			} else {
				$$renderer.push("<!--[-1-->");
				Check($$renderer, { class: "h-4 w-4" });
				$$renderer.push(`<!----> Mark watched`);
			}
			$$renderer.push(`<!--]--></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (showResume() && watchProgress && !watchProgress.isNextEpisode) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="pt-2 max-w-md"><div class="h-1 bg-white/10 rounded-full overflow-hidden"><div${attr_class(`h-full ${mode === "kids" ? "bg-pink-500" : mode === "teens" ? "bg-indigo-500" : "bg-[#FF5E0E]"}`)}${attr_style(`width: ${stringify(Math.max(2, Math.min(100, watchProgress.completionPercent)))}%`)}></div></div> <div${attr_class(`text-[10px] uppercase tracking-wider ${stringify(theme().metaTextColor)} mt-1`)}>${escape_html(watchProgress.completionPercent)}% watched</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div${attr_class(`aspect-video w-full rounded-xl overflow-hidden border shadow-2xl ${stringify(theme().previewBorder)}`)}>`);
		if (hasPreview() && content.playbackUrl) {
			$$renderer.push("<!--[0-->");
			MediaPreviewPlayer($$renderer, {
				src: content.playbackUrl,
				poster: content.backdropUrl ?? content.thumbnail ?? void 0,
				maxDurationSec: previewDurationSec
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-center p-6">`);
			Circle_play($$renderer, { class: "w-12 h-12 text-white/30 mb-3" });
			$$renderer.push(`<!----> <div class="text-white/60 text-sm">Preview will be available once encoding completes.</div></div>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (seasonMap().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mb-12"><h2 class="text-xl font-bold text-white mb-4">Episodes</h2> <div class="space-y-6"><!--[-->`);
			const each_array_3 = ensure_array_like(seasonMap());
			for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
				let [season, eps] = each_array_3[$$index_4];
				$$renderer.push(`<div><div class="text-sm uppercase tracking-wider text-white/50 mb-3">Season ${escape_html(season)}</div> <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"><!--[-->`);
				const each_array_4 = ensure_array_like(eps);
				for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
					let ep = each_array_4[$$index_3];
					$$renderer.push(`<li><a${attr("href", `/watch/${content.slug || content.id}?episode=${ep.id}`)} class="block rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#FF5E0E]/60 hover:bg-white/8 transition-colors"><div class="aspect-video bg-black/40 relative">`);
					if (ep.thumbnail) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<img${attr("src", ep.thumbnail)} alt="" class="w-full h-full object-cover"/>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] uppercase tracking-wider">E${escape_html(ep.episodeNumber)}</div> `);
					if (ep.duration) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px]">${escape_html(ep.duration)}</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="p-3 space-y-1"><div class="text-sm font-semibold text-white truncate">${escape_html(ep.title)}</div> `);
					if (ep.description) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="text-xs text-white/60 line-clamp-2">${escape_html(ep.description)}</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></a></li>`);
				}
				$$renderer.push(`<!--]--></ul></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section class="mb-12">`);
		ReviewSection($$renderer, {
			contentId: content.id,
			contentType: content.mediaType ?? "movie"
		});
		$$renderer.push(`<!----></section></main> `);
		ParentalGate($$renderer, {
			open: gateOpen,
			onPass: onGatePass,
			onClose: onGateClose
		});
		$$renderer.push(`<!----></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { MediaDetailPage as t };
