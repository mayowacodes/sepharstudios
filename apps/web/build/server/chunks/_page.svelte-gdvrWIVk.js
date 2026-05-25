import { h as head, b as push_element, l as escape_html, d as pop_element, e as ensure_array_like, u as unsubscribe_stores, $ as onDestroy, g as attr, k as attr_class, i as stringify, w as attr_style, j as store_get, o as getContext, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import './client2-D3ciM3yf.js';
import 'hls.js';
import './exports-BuGzoaN1.js';

const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = get_store("page");
    return store.subscribe(fn);
  }
};
function get_store(name) {
  try {
    return getStores()[name];
  } catch {
    throw new Error(
      `Cannot subscribe to '${name}' store on the server outside of a Svelte component, as it is bound to the current request via component context. This prevents state from leaking between users.For more information, see https://svelte.dev/docs/kit/state-management#avoid-shared-state-on-the-server`
    );
  }
}
VideoPlayer[FILENAME] = "src/lib/components/widgets/VideoPlayer.svelte";
function VideoPlayer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        src,
        poster,
        contentId,
        startAt = 0,
        title,
        subtitles = [],
        onEnded
      } = $$props;
      let volume = 1;
      let controlsTimer;
      let levels = [];
      let speed = 1;
      let progressInterval;
      async function reportProgress() {
        return;
      }
      function formatTime(s) {
        return "0:00";
      }
      const progressPct = 0;
      const bufferedPct = 0;
      const qualityLabel = "Auto";
      onDestroy(() => {
        reportProgress();
        clearInterval(progressInterval);
        clearTimeout(controlsTimer);
      });
      $$renderer2.push(`<div class="relative bg-black w-full aspect-video select-none group">`);
      push_element($$renderer2, "div", 246, 0);
      $$renderer2.push(`<video${attr(
        "poster",
        // Re-init when src changes
        poster
      )} class="w-full h-full" playsinline>`);
      push_element($$renderer2, "video", 253, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(subtitles);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let sub = each_array[$$index];
        $$renderer2.push(`<track kind="subtitles"${attr("label", sub.label)}${attr("src", sub.src)}${attr("srclang", sub.srclang)}/>`);
        push_element($$renderer2, "track", 260, 6);
        pop_element();
      }
      $$renderer2.push(`<!--]--></video>`);
      pop_element();
      $$renderer2.push(`  <div${attr_class(`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${stringify("opacity-100")}`)}>`);
      push_element($$renderer2, "div", 266, 2);
      if (title) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute top-4 left-4 text-white text-sm font-medium drop-shadow">`);
        push_element($$renderer2, "div", 272, 6);
        $$renderer2.push(`${escape_html(title)}</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->  <div class="mx-4 mb-2 h-1.5 bg-white/20 rounded-full cursor-pointer group/bar hover:h-3 transition-all relative">`);
      push_element($$renderer2, "div", 277, 4);
      $$renderer2.push(`<div class="absolute inset-y-0 left-0 bg-white/30 rounded-full"${attr_style(`width: ${stringify(bufferedPct)}%`)}>`);
      push_element($$renderer2, "div", 282, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="absolute inset-y-0 left-0 bg-[#FF5E0E] rounded-full"${attr_style(`width: ${stringify(progressPct)}%`)}>`);
      push_element($$renderer2, "div", 284, 6);
      $$renderer2.push(`<div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow">`);
      push_element($$renderer2, "div", 285, 8);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-3 px-4 pb-4">`);
      push_element($$renderer2, "div", 290, 4);
      $$renderer2.push(`<button class="text-white hover:text-[#FF5E0E] transition-colors">`);
      push_element($$renderer2, "button", 292, 6);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">`);
        push_element($$renderer2, "svg", 296, 10);
        $$renderer2.push(`<polygon points="5,3 19,12 5,21">`);
        push_element($$renderer2, "polygon", 296, 64);
        $$renderer2.push(`</polygon>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(` <button class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">`);
      push_element($$renderer2, "button", 301, 6);
      $$renderer2.push(`↺10</button>`);
      pop_element();
      $$renderer2.push(` <button class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">`);
      push_element($$renderer2, "button", 304, 6);
      $$renderer2.push(`10↻</button>`);
      pop_element();
      $$renderer2.push(` <span class="text-white text-xs tabular-nums">`);
      push_element($$renderer2, "span", 309, 6);
      $$renderer2.push(`${escape_html(formatTime())} / ${escape_html(formatTime())}</span>`);
      pop_element();
      $$renderer2.push(` <div class="flex-1">`);
      push_element($$renderer2, "div", 312, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-2">`);
      push_element($$renderer2, "div", 315, 6);
      $$renderer2.push(`<button class="text-white hover:text-[#FF5E0E] transition-colors">`);
      push_element($$renderer2, "button", 316, 8);
      {
        $$renderer2.push("<!--[!-->");
        {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">`);
          push_element($$renderer2, "svg", 322, 12);
          $$renderer2.push(`<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z">`);
          push_element($$renderer2, "path", 322, 66);
          $$renderer2.push(`</path>`);
          pop_element();
          $$renderer2.push(`</svg>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(` <input type="range" min="0" max="1" step="0.05"${attr("value", volume)} class="w-20 h-1 accent-[#FF5E0E] cursor-pointer"/>`);
      push_element($$renderer2, "input", 325, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="relative">`);
      push_element($$renderer2, "div", 337, 6);
      $$renderer2.push(`<button class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1">`);
      push_element($$renderer2, "button", 338, 8);
      $$renderer2.push(`${escape_html(speed)}x</button>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (levels.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="relative">`);
        push_element($$renderer2, "div", 358, 8);
        $$renderer2.push(`<button class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1">`);
        push_element($$renderer2, "button", 359, 10);
        $$renderer2.push(`${escape_html(qualityLabel)}</button>`);
        pop_element();
        $$renderer2.push(` `);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (subtitles.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors" title="Toggle subtitles">`);
        push_element($$renderer2, "button", 384, 8);
        $$renderer2.push(`CC</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <button class="text-white hover:text-[#FF5E0E] transition-colors">`);
      push_element($$renderer2, "button", 392, 6);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">`);
        push_element($$renderer2, "svg", 396, 10);
        $$renderer2.push(`<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z">`);
        push_element($$renderer2, "path", 396, 64);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button type="button" aria-label="Play video" class="absolute inset-0 flex items-center justify-center pointer-events-none">`);
        push_element($$renderer2, "button", 404, 4);
        $$renderer2.push(`<div class="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white">`);
        push_element($$renderer2, "div", 410, 6);
        $$renderer2.push(`<svg class="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">`);
        push_element($$renderer2, "svg", 411, 8);
        $$renderer2.push(`<polygon points="5,3 19,12 5,21">`);
        push_element($$renderer2, "polygon", 411, 67);
        $$renderer2.push(`</polygon>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    VideoPlayer
  );
}
VideoPlayer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ReviewSection[FILENAME] = "src/lib/components/widgets/ReviewSection.svelte";
function ReviewSection($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { contentId, contentType = "movie" } = $$props;
      let reviews = [];
      let userRating = 0;
      const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
      function starClass(star, current) {
        return star <= current ? "text-[#FFBF00]" : "text-gray-600";
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 63, 0);
      $$renderer2.push(`<div class="flex items-center gap-4">`);
      push_element($$renderer2, "div", 64, 1);
      $$renderer2.push(`<h3 class="text-lg font-semibold text-white">`);
      push_element($$renderer2, "h3", 65, 2);
      $$renderer2.push(`Reviews</h3>`);
      pop_element();
      $$renderer2.push(` `);
      if (avgRating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center gap-1">`);
        push_element($$renderer2, "div", 67, 3);
        $$renderer2.push(`<span class="text-[#FFBF00] font-bold">`);
        push_element($$renderer2, "span", 68, 4);
        $$renderer2.push(`${escape_html(avgRating)}</span>`);
        pop_element();
        $$renderer2.push(` <span class="text-[#FFBF00]">`);
        push_element($$renderer2, "span", 69, 4);
        $$renderer2.push(`★</span>`);
        pop_element();
        $$renderer2.push(` <span class="text-gray-400 text-sm">`);
        push_element($$renderer2, "span", 70, 4);
        $$renderer2.push(`(${escape_html(reviews.length)})</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">`);
        push_element($$renderer2, "div", 77, 2);
        $$renderer2.push(`<p class="text-sm text-gray-400">`);
        push_element($$renderer2, "p", 78, 3);
        $$renderer2.push(`Rate this content</p>`);
        pop_element();
        $$renderer2.push(` <div class="flex gap-1">`);
        push_element($$renderer2, "div", 79, 3);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like([1, 2, 3, 4, 5]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let star = each_array[$$index];
          $$renderer2.push(`<button${attr_class(`text-2xl transition-colors ${stringify(starClass(star, userRating))}`)}${attr("aria-label", `Rate ${stringify(star)} star`)}>`);
          push_element($$renderer2, "button", 81, 5);
          $$renderer2.push(`★</button>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` `);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-3">`);
        push_element($$renderer2, "div", 114, 2);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like([1, 2]);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          each_array_1[$$index_1];
          $$renderer2.push(`<div class="h-20 bg-white/5 rounded-xl animate-pulse">`);
          push_element($$renderer2, "div", 116, 4);
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    ReviewSection
  );
}
ReviewSection.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/watch/[id]/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      const { data } = $$props;
      const content = data.content;
      const startAt = () => {
        const t = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("t");
        return t ? parseInt(t, 10) : 0;
      };
      const src = () => {
        if (content.playbackUrl) return content.playbackUrl;
        if (content.videoUrl) return content.videoUrl;
        if (content.videoId) return `/api/watch/${content.videoId}`;
        return "";
      };
      function handleEnded() {
      }
      head("1oiicp0", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(content.title)} — Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description"${attr("content", content.description ?? "")}/>`);
        push_element($$renderer3, "meta", 30, 2);
        pop_element();
      });
      $$renderer2.push(`<div class="min-h-screen bg-[#0b0c10] text-white">`);
      push_element($$renderer2, "div", 33, 0);
      $$renderer2.push(`<div class="w-full bg-black">`);
      push_element($$renderer2, "div", 35, 2);
      if (src()) {
        $$renderer2.push("<!--[-->");
        VideoPlayer($$renderer2, {
          src: src(),
          poster: content.backdropUrl ?? content.thumbnail ?? void 0,
          contentId: content.id,
          startAt: startAt(),
          title: content.title,
          onEnded: handleEnded
        });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="aspect-video flex items-center justify-center bg-zinc-900">`);
        push_element($$renderer2, "div", 46, 6);
        $$renderer2.push(`<p class="text-zinc-400">`);
        push_element($$renderer2, "p", 47, 8);
        $$renderer2.push(`${escape_html(content.processingStatus === "ready" ? "Video not available yet." : "Video is still processing.")}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="max-w-5xl mx-auto px-4 py-8">`);
      push_element($$renderer2, "div", 55, 2);
      $$renderer2.push(`<div class="flex flex-wrap items-start gap-4 mb-4">`);
      push_element($$renderer2, "div", 57, 4);
      $$renderer2.push(`<div class="flex-1 min-w-0">`);
      push_element($$renderer2, "div", 58, 6);
      $$renderer2.push(`<h1 class="text-3xl font-bold leading-tight">`);
      push_element($$renderer2, "h1", 59, 8);
      $$renderer2.push(`${escape_html(content.title)}</h1>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-wrap gap-3 mt-2 text-sm text-zinc-400">`);
      push_element($$renderer2, "div", 60, 8);
      if (content.year) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 62, 12);
        $$renderer2.push(`${escape_html(content.year)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 65, 12);
        $$renderer2.push(`${escape_html(content.duration)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content.ageRating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="px-2 py-0.5 border border-zinc-600 rounded text-xs uppercase tracking-wide">`);
        push_element($$renderer2, "span", 68, 12);
        $$renderer2.push(`${escape_html(content.ageRating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content.rating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="flex items-center gap-1">`);
        push_element($$renderer2, "span", 73, 12);
        $$renderer2.push(`<span class="text-yellow-400">`);
        push_element($$renderer2, "span", 74, 14);
        $$renderer2.push(`★</span>`);
        pop_element();
        $$renderer2.push(` ${escape_html(content.rating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content.language && content.language !== "English") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 79, 12);
        $$renderer2.push(`${escape_html(content.language)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (content.genres?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-wrap gap-2 mb-4">`);
        push_element($$renderer2, "div", 87, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(content.genres);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let genre = each_array[$$index];
          $$renderer2.push(`<span class="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">`);
          push_element($$renderer2, "span", 89, 10);
          $$renderer2.push(`${escape_html(genre)}</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-zinc-300 leading-relaxed mb-6 max-w-3xl">`);
        push_element($$renderer2, "p", 96, 6);
        $$renderer2.push(`${escape_html(content.description)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content.bibleReference) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center gap-2 mb-6 text-sm text-amber-400">`);
        push_element($$renderer2, "div", 101, 6);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 102, 8);
        $$renderer2.push(`📖</span>`);
        pop_element();
        $$renderer2.push(` <span>`);
        push_element($$renderer2, "span", 103, 8);
        $$renderer2.push(`${escape_html(content.bibleReference)}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <hr class="border-zinc-800 mb-8"/>`);
      push_element($$renderer2, "hr", 108, 4);
      pop_element();
      $$renderer2.push(` `);
      ReviewSection($$renderer2, { contentId: content.id, contentType: content.mediaType });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-gdvrWIVk.js.map
