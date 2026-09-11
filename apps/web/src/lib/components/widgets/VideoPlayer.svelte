<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import type HlsType from 'hls.js';

  // hls.js is ~120 KB minified — only loaded when an .m3u8 source is actually
  // played and the browser doesn't support HLS natively (Safari does).
  // Cached after first dynamic import so re-init on src change reuses it.
  let HlsCtor: typeof HlsType | null = null;
  async function loadHls() {
    if (!HlsCtor) {
      HlsCtor = (await import('hls.js')).default;
    }
    return HlsCtor;
  }

  interface Props {
    src: string;           // HLS manifest URL (.m3u8) or direct video URL
    poster?: string;
    contentId?: string;    // for progress reporting
    startAt?: number;      // seconds to resume from
    title?: string;
    /**
     * Cinematic metadata shown in the player's hover overlay. `ageRating`
     * renders as a small bordered pill in the top strip; `genres` render
     * as glass chips next to it (first 3 only — anything more clutters
     * the player and is already on the page below).
     */
    ageRating?: string;
    genres?: string[];
    subtitles?: Array<{ label: string; src: string; srclang: string }>;
    /**
     * Audio descriptions (WCAG 1.2.5 / SC 1.2.7). Each entry is a separate
     * description track rendered as `<track kind="descriptions">`. Browsers
     * surface them via a media-controls picker; assistive tech reads them
     * out alongside the video soundtrack.
     */
    descriptions?: Array<{ label: string; src: string; srclang: string }>;
    /**
     * Chapter markers. start in seconds; tick marks render above the seek
     * bar and `>` / `<` keys jump between chapters.
     */
    chapters?: Array<{ start: number; title: string }>;
    /** Slots for the end-screen overlay (Item 3). */
    /**
     * End-screen cards shown in the final ~10% of playback. `href`
     * (when present) wins over the default `/watch/<slug-or-id>` —
     * useful for next-episode cards that need `?episode=<id>`
     * appended. `kind` labels the card with a small chip ("NEXT
     * EPISODE", "UP NEXT", etc.) for context.
     */
    endScreen?: Array<{
      id: string;
      slug?: string | null;
      title: string;
      thumbnail: string | null;
      duration: string | null;
      href?: string;
      kind?: string;
    }>;
    /**
     * When true, the end-screen header swaps to a "You've reached the
     * end of the series" finale message and the auto-advance
     * countdown is suppressed. Filler cards (genre / creator picks)
     * still render below.
     */
    endOfSeries?: boolean;
    /**
     * Direct URL to the next episode (when watching a TV title and
     * there is one). Two pieces of UX hang off this:
     *   - A small "Next Episode" button next to the play controls so
     *     viewers can skip ahead without waiting for the end-screen.
     *   - Automatic navigation at 95% playback (Netflix-style "skip
     *     credits"). Suppresses the end-screen countdown for that case
     *     so the auto-advance fires once, not twice.
     */
    nextEpisodeHref?: string;
    /**
     * Scrubbing-preview VTT URL produced by the encoder orchestrator's
     * scan-ready webhook. Cues encode a sprite-sheet region in the cue
     * text as `sprite_N.jpg#xywh=x,y,w,h` (relative path or absolute URL).
     */
    previewVtt?: string;
    /**
     * Sprite sheet URLs that the VTT cues reference. Used to resolve
     * relative `sprite_N.jpg` cue text against the right host.
     */
    previewSprites?: string[];
    onEnded?: () => void;
    /** Fires on every `timeupdate` (~4×/sec). Useful when the parent
     *  wants to anchor a UI affordance to the playhead (e.g. the admin
     *  review page's "Add note at MM:SS" button). */
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    /**
     * Play a pre-roll before the main content, when the break schedule
     * contains a `kind='preroll'` cue.
     *
     * The pre-roll used to be a separate mechanism that swapped `src` on the
     * main <video>, which is why the playback-init effect had to know about
     * ads at all. It is now just an ad break at position 0, rendered on the
     * ad element like every other break — full-frame rather than squeezed,
     * since there is no movie playing underneath to squeeze.
     *
     * Full VAST support (wrappers, quartile pixels, click tracking) is handled
     * server-side in $lib/server/ads/vast.ts, not by an SDK in the page.
     */
    enableAds?: boolean;
    /**
     * Squeeze-back mid-roll ads. Defaults false so the other three
     * VideoPlayer consumers (live, creator preview, admin review) are
     * untouched — only the watch page opts in.
     */
    enableBreakAds?: boolean;
  }

  let {
    src, poster, contentId, startAt = 0, title,
    ageRating, genres = [],
    subtitles = [], descriptions = [], chapters = [], endScreen = [],
    endOfSeries = false,
    nextEpisodeHref,
    previewVtt, previewSprites = [],
    enableAds = false,
    enableBreakAds = false,
    onEnded, onTimeUpdate
  }: Props = $props();

  // Resume position, captured ONCE at component init and never re-read.
  //
  // Why this is not just `startAt`: initHls() reads it, and initHls() is called
  // from the src-owning $effect below. In Svelte 5 a prop read inside a function
  // called by an effect becomes a dependency of that effect — so reading the
  // prop directly made `startAt` an *implicit* dependency of playback init.
  // watch/[id]/+page.svelte passes `startAt={startAt()}` from a $derived, so any
  // re-evaluation of that derived (an invalidateAll() after a PPV purchase, for
  // one) re-ran the effect, and initHls unconditionally does `hls.destroy()` —
  // tearing down and rebuilding the whole HLS pipeline in the middle of
  // playback. Capturing the value here severs that edge: the resume position is
  // a mount-time concern and genuinely never changes on a live player.
  // svelte-ignore state_referenced_locally
  const initialStartAt = startAt;

  // Auto-advance to the next episode at 95% completion. Netflix-style
  // "skip credits" — for TV titles the back-end of the file is usually
  // credits the viewer doesn't watch, so jumping ahead saves them the
  // dead time. Fires once per video; suppressed when we have no next
  // episode OR when we're at the end of the series. The 95% threshold
  // is high enough that mid-episode scrubbing past 90% (which
  // currently triggers the end-screen) doesn't accidentally auto-jump.
  let autoAdvancedFired = $state(false);
  $effect(() => {
    if (!nextEpisodeHref || endOfSeries || autoAdvancedFired) return;
    if (duration > 0 && currentTime / duration >= 0.95) {
      autoAdvancedFired = true;
      window.location.href = nextEpisodeHref;
    }
  });

  // Cap the chips shown in-player so the strip stays readable; the page
  // body below the player still shows the full genre list.
  const displayGenres = $derived((genres ?? []).slice(0, 3));

  // End-screen overlay state. Dismiss persists until the next mount;
  // countdown decrements each second once the overlay is visible.
  let endScreenDismissed = $state(false);
  let endScreenCountdown = $state(10);
  let endScreenInterval: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    const visible = endScreenVisible;
    // Three cases where we still show the overlay but suppress the
    // auto-advance countdown:
    //   1. End of series — there's nowhere we'd auto-jump to.
    //   2. nextEpisodeHref is set — the 95% auto-advance effect
    //      handles forward navigation for TV titles; the end-screen
    //      countdown would race it.
    // The overlay still renders so viewers can click "Watch Next"
    // manually before the 95% mark if they want it sooner.
    if (visible && !endScreenInterval && !endOfSeries && !nextEpisodeHref) {
      endScreenInterval = setInterval(() => {
        endScreenCountdown = Math.max(0, endScreenCountdown - 1);
        if (endScreenCountdown === 0 && endScreen[0]) {
          if (endScreenInterval) { clearInterval(endScreenInterval); endScreenInterval = null; }
          // Navigate to the first card.
          window.location.href = endScreen[0].href || `/watch/${endScreen[0].slug || endScreen[0].id}`;
        }
      }, 1000);
    } else if (!visible && endScreenInterval) {
      clearInterval(endScreenInterval);
      endScreenInterval = null;
    }
  });

  // Current chapter label, recomputed on every timeupdate.
  const currentChapter = $derived.by(() => {
    if (!chapters || chapters.length === 0) return null;
    let active: { start: number; title: string } | null = null;
    for (const c of chapters) {
      if (c.start <= currentTime) active = c;
      else break;
    }
    return active;
  });

  // Skip Intro / Skip Credits affordance. We recognise chapters by
  // their title alone — no schema change required, just a convention
  // creators follow when chaptering their videos:
  //   "Intro", "Opening", "Theme" → intro range = [chapter.start, next.start)
  //   "Credits", "Outro", "End"   → outro range = [chapter.start, duration]
  // When `currentTime` falls inside an intro or outro range, a
  // floating Skip button renders in the bottom-right corner. Click
  // jumps to the end of that range — either the next chapter's start
  // (intro) or to the end-screen / onEnded (outro). Auto-advance via
  // 95%-completion still wins if the chapter range starts that late.
  const SKIP_INTRO_NAMES = /^(intro|opening|theme|opening credits)$/i;
  const SKIP_OUTRO_NAMES = /^(credits|outro|end|end credits|closing|ending)$/i;

  const skipIntroTarget = $derived.by(() => {
    if (!chapters || chapters.length === 0) return null;
    // Look at the current chapter; if it's an intro chapter and we're
    // still inside it, surface the skip target (next chapter's start,
    // or current+90s as a fallback when there's no next chapter).
    const ch = currentChapter;
    if (!ch || !SKIP_INTRO_NAMES.test(ch.title.trim())) return null;
    const idx = chapters.findIndex((c) => c.start === ch.start);
    const next = idx >= 0 ? chapters[idx + 1] : undefined;
    const target = next ? next.start : ch.start + 90;
    if (currentTime >= target) return null; // already past it
    return target;
  });

  const skipOutroTarget = $derived.by(() => {
    if (!chapters || chapters.length === 0) return null;
    const ch = currentChapter;
    if (!ch || !SKIP_OUTRO_NAMES.test(ch.title.trim())) return null;
    // Outro skip jumps near the end so the existing end-screen logic
    // takes over (and the 95% auto-advance fires for TV titles). We
    // intentionally stop 0.5s before duration to make sure the
    // `ended` event fires after seek + brief play.
    if (duration <= 0) return null;
    return Math.max(0, duration - 0.5);
  });

  function jumpToChapter(start: number) {
    if (videoEl && Number.isFinite(start)) videoEl.currentTime = start;
  }

  function nextChapter() {
    if (!chapters || chapters.length === 0) return;
    const idx = chapters.findIndex((c) => c.start > currentTime);
    if (idx >= 0) jumpToChapter(chapters[idx].start);
  }

  function prevChapter() {
    if (!chapters || chapters.length === 0) return;
    // Find the chapter that started before "current minus 2s" so a quick
    // double-tap on `<` walks backwards instead of restarting the current.
    const cutoff = currentTime - 2;
    let target = chapters[0].start;
    for (const c of chapters) {
      if (c.start < cutoff) target = c.start;
      else break;
    }
    jumpToChapter(target);
  }

  let videoEl = $state<HTMLVideoElement | undefined>();
  let containerEl = $state<HTMLDivElement | undefined>();
  let hls: HlsType | null = null;
  // Monotonic token guarding initHls. It's async (awaits the hls.js
  // dynamic import), so two overlapping calls both used to pass the
  // `if (hls) destroy` check while parked at the import and then BOTH
  // constructed an Hls instance — the first leaked (worker + media
  // listeners) and both attached to the same <video>. Each call takes
  // a token; stale calls bail after every await.
  let initSeq = 0;
  // Bounded recovery for fatal hls.js errors. Without a cap, a
  // permanently-404ing manifest put startLoad() into an unbounded
  // retry storm against storage.
  let recoveryAttempts = 0;
  const MAX_RECOVERY_ATTEMPTS = 3;
  let playbackFailed = $state(false);

  // ─── Scrubbing-preview thumbnails ──────────────────────────────────────
  // Cues parsed from `previewVtt`. Each cue covers a time window and
  // points at a sprite region (`sprite_N.jpg#xywh=x,y,w,h`).
  interface PreviewCue {
    startSec: number;
    endSec: number;
    spriteUrl: string;
    x: number; y: number; w: number; h: number;
  }
  let previewCues = $state<PreviewCue[]>([]);

  function resolveSpriteUrl(ref: string): string {
    // Absolute → use as-is. Relative → resolve against the first sprite URL
    // (they all share a directory) or the previewVtt URL itself.
    if (/^https?:\/\//.test(ref) || ref.startsWith('/')) return ref;
    const base = previewSprites[0] ?? previewVtt;
    if (!base) return ref;
    try {
      return new URL(ref, base).toString();
    } catch {
      return ref;
    }
  }

  function vttTimeToSeconds(ts: string): number {
    const parts = ts.split(':');
    const sec = parseFloat(parts.pop() ?? '0');
    const min = parseInt(parts.pop() ?? '0', 10);
    const hr = parseInt(parts.pop() ?? '0', 10);
    return (Number.isFinite(hr) ? hr : 0) * 3600 + (Number.isFinite(min) ? min : 0) * 60 + (Number.isFinite(sec) ? sec : 0);
  }

  function parsePreviewVtt(vtt: string): PreviewCue[] {
    const out: PreviewCue[] = [];
    const blocks = vtt.replace(/\r\n/g, '\n').split(/\n\n+/);
    for (const block of blocks) {
      const lines = block.split('\n').filter(Boolean);
      if (lines.length === 0) continue;
      if (lines[0] === 'WEBVTT' || lines[0].startsWith('NOTE') || lines[0].startsWith('STYLE')) continue;
      const tsLine = lines.find((l) => l.includes('-->'));
      if (!tsLine) continue;
      const [startRaw, endRaw] = tsLine.split('-->').map((s) => s.trim());
      const startSec = vttTimeToSeconds(startRaw);
      const endSec = vttTimeToSeconds(endRaw);
      if (!Number.isFinite(startSec) || !Number.isFinite(endSec) || endSec <= startSec) continue;
      const payload = lines.slice(lines.indexOf(tsLine) + 1).join('').trim();
      if (!payload) continue;
      const hashIdx = payload.indexOf('#xywh=');
      if (hashIdx === -1) continue;
      const ref = payload.slice(0, hashIdx);
      const xywh = payload.slice(hashIdx + '#xywh='.length).split(',').map((n) => parseInt(n, 10));
      if (xywh.length !== 4 || xywh.some((n) => !Number.isFinite(n))) continue;
      out.push({
        startSec,
        endSec,
        spriteUrl: resolveSpriteUrl(ref),
        x: xywh[0], y: xywh[1], w: xywh[2], h: xywh[3]
      });
    }
    return out.sort((a, b) => a.startSec - b.startSec);
  }

  $effect(() => {
    // Re-fetch when previewVtt changes.
    const url = previewVtt;
    if (!url) { previewCues = []; return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const text = await res.text();
        if (!cancelled) previewCues = parsePreviewVtt(text);
      } catch { /* silent — no previews is acceptable */ }
    })();
    return () => { cancelled = true; };
  });

  function findPreviewCue(sec: number): PreviewCue | null {
    if (previewCues.length === 0) return null;
    // Cues are sorted; binary-search would be overkill (<200 entries
    // typically), linear is fine and predictable.
    for (let i = 0; i < previewCues.length; i++) {
      const c = previewCues[i];
      if (sec >= c.startSec && sec < c.endSec) return c;
    }
    return previewCues[previewCues.length - 1];
  }

  // Hover state for the floating preview.
  let previewHoverPct = $state<number | null>(null);
  let previewHoverSec = $state(0);
  const hoveredCue = $derived(previewHoverPct !== null ? findPreviewCue(previewHoverSec) : null);

  function onProgressMove(e: MouseEvent) {
    if (previewCues.length === 0 || duration <= 0) return;
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    previewHoverPct = ratio * 100;
    previewHoverSec = ratio * duration;
  }
  function onProgressLeave() {
    previewHoverPct = null;
  }
  function formatHover(sec: number): string {
    const total = Math.max(0, Math.floor(sec));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Playback state
  let playing = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);

  // Single source of truth for "is the end screen showing".
  //
  // Declared here, below `currentTime`/`duration`, because a $derived evaluates
  // where it is written — placing it up with the other end-screen state would
  // read those bindings before their declarations.
  //
  // This predicate used to be written out twice: once for the countdown effect
  // and once inline in the markup. Two copies of a condition this fiddly drift,
  // and the failure mode was ugly — the markup could hide the overlay while the
  // effect still believed it visible, leaving the countdown running behind
  // nothing until it fired `window.location.href` and navigated the viewer away
  // from a page showing no end screen at all. One derived, read in both places,
  // makes that unrepresentable.
  /**
   * Ad-break phase. Declared here, well above the rest of the ad controller,
   * because `endScreenVisible` below reads `adActive` — and a $derived
   * evaluates where it is written, so it cannot reference a binding declared
   * further down the file. The remaining ad state lives with the controller.
   */
  let adPhase = $state<'idle' | 'playing' | 'ending'>('idle');
  const adActive = $derived(adPhase === 'playing' || adPhase === 'ending');

  const endScreenVisible = $derived(
    endScreen.length > 0 && duration > 0
    && currentTime / duration > 0.9 && !endScreenDismissed
    // Never behind an ad: the countdown would keep ticking under the ad pane
    // and could navigate the viewer away mid-break.
    && !adActive
  );
  let buffered = $state(0);
  let volume = $state(1);
  let muted = $state(false);
  let fullscreen = $state(false);
  let controlsVisible = $state(true);
  let controlsTimer: ReturnType<typeof setTimeout>;

  // Quality levels
  let levels = $state<Array<{ height: number; bitrate: number; index: number }>>([]);
  let currentLevel = $state(-1); // -1 = auto
  let showQualityMenu = $state(false);

  // Speed
  let speed = $state(1);
  let showSpeedMenu = $state(false);
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Progress reporting
  let progressInterval: ReturnType<typeof setInterval>;
  let lastReportedTime = 0;
  let activeInterval: ReturnType<typeof setInterval> | undefined;

  async function reportProgress() {
    if (!contentId || !videoEl || duration === 0) return;
    const pos = Math.floor(videoEl.currentTime);
    if (Math.abs(pos - lastReportedTime) < 5) return; // only if moved 5+ seconds
    lastReportedTime = pos;
    try {
      await fetch('/api/watch/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          positionSeconds: pos,
          durationSeconds: Math.floor(duration)
        })
      });
    } catch { /* non-critical */ }
  }

  async function pingActiveViewer() {
    if (!contentId || !playing) return;
    try {
      await fetch('/api/watch/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      });
    } catch { /* non-critical, just feeds the realtime counter */ }
  }

  async function initHls(video: HTMLVideoElement, url: string) {
    const token = ++initSeq;

    // Tripwire for the one failure this whole design exists to prevent.
    //
    // initHls() destroys and rebuilds the HLS pipeline. If it runs while an ad
    // break is open, something has made ad state a dependency of the src-owning
    // $effect, and the movie is being torn down mid-ad — which presents as the
    // video going black and restarting when the ad ends.
    //
    // Deliberately NOT dev-only: the failure would first appear in production,
    // on a real break, and a check that is compiled out there is a check that
    // never fires when it matters. One console.error on a path that should
    // never execute costs nothing.
    if (adPhase !== 'idle') {
      console.error(
        `[VideoPlayer] initHls called during an ad break (initSeq=${token}, adPhase=${adPhase}). ` +
        'Ad state has leaked into the playback-init effect — the HLS pipeline is being ' +
        'destroyed mid-ad. See the comment above that effect.'
      );
    }
    if (hls) { hls.destroy(); hls = null; }
    recoveryAttempts = 0;
    playbackFailed = false;

    const isHlsUrl = url.includes('.m3u8');
    const canPlayNative = video.canPlayType('application/vnd.apple.mpegurl');

    // Only pay the 120 KB cost when we actually need hls.js (HLS source + no
    // native support). Safari and direct MP4 sources skip the dynamic import.
    if (isHlsUrl && !canPlayNative) {
      const Hls = await loadHls();
      // Another initHls started while we awaited the import — it owns
      // the element now; constructing here would leak a second instance.
      if (token !== initSeq) return;
      if (!Hls.isSupported()) {
        video.src = url;
        if (initialStartAt > 0) video.currentTime = initialStartAt;
        return;
      }

      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        startLevel: -1 // auto
      });
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        levels = data.levels.map((l, i) => ({ height: l.height, bitrate: l.bitrate, index: i }));
        if (initialStartAt > 0) video.currentTime = initialStartAt;
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        currentLevel = data.level;
        const lvl = levels[data.level];
        if (lvl) telemetryNoteLevel(Math.round(lvl.bitrate / 1000));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        // Non-fatal errors are counted but not surfaced — a handful of
        // recovered segment errors is normal, a hundred is a CDN problem, and
        // only the aggregate can tell them apart.
        telemetryErrorCount += 1;
        if (!data.fatal) return;
        telemetryFatal = `${data.type}: ${data.details}`;
        // Bounded recovery. A permanently-broken source (404ing
        // manifest, undecodable stream) used to loop startLoad() /
        // recoverMediaError() forever — an unbounded request storm.
        // After MAX attempts, tear down and surface an error overlay.
        recoveryAttempts += 1;
        if (recoveryAttempts > MAX_RECOVERY_ATTEMPTS) {
          hls?.destroy();
          hls = null;
          playbackFailed = true;
          return;
        }
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls?.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls?.recoverMediaError();
            break;
          default:
            hls?.destroy();
            hls = null;
            playbackFailed = true;
            break;
        }
      });
    } else if (isHlsUrl && canPlayNative) {
      // Native HLS (Safari)
      video.src = url;
      if (initialStartAt > 0) {
        video.addEventListener('loadedmetadata', () => { video.currentTime = initialStartAt; }, { once: true });
      }
      video.play().catch(() => {});
    } else {
      // Direct MP4/WebM — no HLS machinery needed
      video.src = url;
      if (initialStartAt > 0) video.currentTime = initialStartAt;
    }
  }

  function setQuality(index: number) {
    if (hls) {
      hls.currentLevel = index;
      currentLevel = index;
    }
    showQualityMenu = false;
  }

  function setSpeed(s: number) {
    speed = s;
    if (videoEl) videoEl.playbackRate = s;
    showSpeedMenu = false;
  }

  function togglePlay() {
    if (!videoEl) return;
    if (videoEl.paused) videoEl.play();
    else videoEl.pause();
  }

  function seek(e: MouseEvent) {
    if (!videoEl || !duration) return;
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    videoEl.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }

  /**
   * Duck factor applied to the movie while a short ad plays over it.
   * Plain `let`, not `$state` — nothing renders from it, and keeping it
   * non-reactive guarantees it can never become a dependency of the
   * playback-init effect.
   */
  let ducking = false;
  const DUCK_FACTOR = 0.2;

  /**
   * THE ONLY writer of `videoEl.volume` / `videoEl.muted`.
   *
   * `volume` state always holds the USER'S INTENT; the element carries
   * intent x duck factor. Before this, three separate places wrote the element
   * directly, so ducking to 0.2 made the slider visibly jump to 20% and a user
   * who touched the slider mid-ad permanently lost their original level. With a
   * single writer, a mid-duck adjustment sets intent, the duck stays applied,
   * and restoring is just `ducking = false; applyVolume()` — no saved-value
   * bookkeeping, so no restore bug.
   *
   * Mute always wins: ducking never unmutes, and a muted player mutes the ad
   * too (autoplay policy, and basic decency).
   */
  function applyVolume() {
    if (!videoEl) return;
    videoEl.volume = volume * (ducking ? DUCK_FACTOR : 1);
    videoEl.muted = muted;
  }

  function toggleMute() {
    if (!videoEl) return;
    muted = !muted;
    applyVolume();
  }

  function changeVolume(e: Event) {
    volume = parseFloat((e.target as HTMLInputElement).value);
    muted = volume === 0;
    applyVolume();
  }

  async function toggleFullscreen() {
    if (!containerEl) return;
    if (!document.fullscreenElement) {
      await containerEl.requestFullscreen();
      fullscreen = true;
    } else {
      await document.exitFullscreen();
      fullscreen = false;
    }
  }

  // Picture-in-Picture support. Browser API gives us a floating
  // mini-player that survives tab switches — useful when the viewer
  // wants to keep watching while reading something else. Not every
  // browser surfaces it (Firefox has its own UI; some embedded views
  // strip it), so we feature-detect and only render the toggle when
  // the API is available + the current video isn't already disabled
  // from PiP via `disablePictureInPicture`.
  let inPip = $state(false);
  const pipSupported = $derived(
    typeof document !== 'undefined'
      && 'pictureInPictureEnabled' in document
      && (document as Document & { pictureInPictureEnabled?: boolean }).pictureInPictureEnabled === true
  );
  async function togglePip(): Promise<void> {
    if (!videoEl) return;
    try {
      const docWithPip = document as Document & {
        pictureInPictureElement?: Element | null;
        exitPictureInPicture?: () => Promise<void>;
      };
      const elWithPip = videoEl as HTMLVideoElement & {
        requestPictureInPicture?: () => Promise<PictureInPictureWindow>;
      };
      if (docWithPip.pictureInPictureElement) {
        await docWithPip.exitPictureInPicture?.();
        inPip = false;
      } else {
        await elWithPip.requestPictureInPicture?.();
        inPip = true;
      }
    } catch (err) {
      console.warn('[VideoPlayer] PiP toggle failed', err);
    }
  }
  // Watch the document's PiP state so we re-sync our flag if the user
  // closes the PiP window via the browser's own UI rather than our
  // button — keeps the toggle's visual state honest.
  $effect(() => {
    if (typeof window === 'undefined') return;
    const onEnter = () => { inPip = true; };
    const onLeave = () => { inPip = false; };
    videoEl?.addEventListener('enterpictureinpicture', onEnter);
    videoEl?.addEventListener('leavepictureinpicture', onLeave);
    return () => {
      videoEl?.removeEventListener('enterpictureinpicture', onEnter);
      videoEl?.removeEventListener('leavepictureinpicture', onLeave);
    };
  });

  // Auto-PiP when the player scrolls out of view during playback — so
  // the viewer can keep watching while they scroll down to read the
  // description / cast / reviews on the same page. Uses
  // IntersectionObserver to fire exactly when the player becomes
  // <10% visible, and only when it's actively playing (we don't pop
  // out a paused player). The opposite transition is intentionally NOT
  // handled — we don't slam back to inline when the player scrolls
  // into view again because some viewers prefer to keep PiP up while
  // they scroll back. They can close PiP via the button or the native
  // window's ✕.
  $effect(() => {
    if (typeof window === 'undefined' || !containerEl || !pipSupported) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (!entry) return;
        // Also suppressed during an ad break: a PiP window renders only the
        // video surface, so the squeeze and the whole ad pane would be
        // invisible. This adds `adActive` as a dependency of the *PiP* effect
        // only — that effect just creates an IntersectionObserver, so
        // re-creating it twice per break is free. It is NOT a dependency of the
        // src-owning effect, which is the one that must never see ad state.
        //
        // Only auto-PiP when the player is mostly out of view AND it's
        // currently playing AND we're not already in PiP AND we're not
        // in fullscreen (would conflict). Browsers also bail on
        // `requestPictureInPicture` outside a user-gesture context —
        // we silently swallow that since "scroll past while watching"
        // is a chain of user gestures and Chrome / Edge / Safari all
        // honour it in practice.
        if (
          entry.intersectionRatio < 0.1
          && playing
          && !inPip
          && !fullscreen
          && !adActive
        ) {
          try { await togglePip(); } catch { /* gesture-context bail; not worth surfacing */ }
        }
      },
      { threshold: [0, 0.1, 0.5, 1] }
    );
    observer.observe(containerEl);
    return () => observer.disconnect();
  });

  function showControls() {
    controlsVisible = true;
    clearTimeout(controlsTimer);
    if (playing) {
      controlsTimer = setTimeout(() => { controlsVisible = false; }, 3000);
    }
  }

  function formatTime(s: number) {
    if (!s || isNaN(s)) return '0:00';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
      : `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!videoEl) return;
    // Don't hijack keys when the user is typing in any editable surface.
    // The handler is wired to <svelte:window>, so EVERY keystroke on the
    // page reaches it — including those targeted at the review form's
    // General Feedback textarea. Without this guard, pressing space
    // toggled play/pause AND `preventDefault()` swallowed the space so
    // it never reached the textarea (typing "great lets test" came out
    // as "greatletstest"). Same fix lives on EnhancedVideoPlayer.
    const a = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null;
    if (a && (
      a.tagName === 'INPUT' ||
      a.tagName === 'TEXTAREA' ||
      a.tagName === 'SELECT' ||
      a.isContentEditable
    )) return;
    // During an ad break, seeking and chapter jumps are meaningless (and in
    // pause mode the movie isn't moving at all). Volume, mute and fullscreen
    // stay live so the viewer keeps the controls that matter. Escape must never
    // skip an ad.
    if (adActive) {
      switch (e.key) {
        case 'm': toggleMute(); break;
        case 'ArrowUp': volume = Math.min(1, volume + 0.1); applyVolume(); break;
        case 'ArrowDown': volume = Math.max(0, volume - 0.1); applyVolume(); break;
        case 'f': if (adLayout === 'squeeze') toggleFullscreen(); break;
        case ' ': case 'k': e.preventDefault(); break;   // swallowed on purpose
      }
      return;
    }

    switch (e.key) {
      case ' ': case 'k': e.preventDefault(); togglePlay(); break;
      case 'ArrowRight': videoEl.currentTime = Math.min(videoEl.currentTime + 10, duration); break;
      case 'ArrowLeft': videoEl.currentTime = Math.max(videoEl.currentTime - 10, 0); break;
      case 'ArrowUp': volume = Math.min(1, volume + 0.1); applyVolume(); break;
      case 'ArrowDown': volume = Math.max(0, volume - 0.1); applyVolume(); break;
      case 'f': toggleFullscreen(); break;
      case 'm': toggleMute(); break;
      case '.': case '>': e.preventDefault(); nextChapter(); break;
      case ',': case '<': e.preventDefault(); prevChapter(); break;
      // `n` jumps straight to the next episode when one is loaded.
      // No-op for movies + final episodes. Matches YouTube's Shift+N
      // shortcut spirit but with a single keystroke since we're in a
      // dedicated player surface, not a global page.
      case 'n':
        if (nextEpisodeHref) {
          e.preventDefault();
          window.location.href = nextEpisodeHref;
        }
        break;
      // `?` (which is Shift+/ on US layouts) opens the shortcut
      // help overlay. `/` is included so users on layouts without
      // an easy `?` still get a fast keystroke. The overlay closes
      // on Esc (below), outside-click, or another `?` press.
      case '?': case '/':
        e.preventDefault();
        shortcutsOpen = !shortcutsOpen;
        break;
      // Escape, in precedence order: dismiss the shortcuts overlay, else
      // leave fullscreen. Previously absent entirely, despite the comment
      // above having claimed Esc closed the overlay — only outside-click
      // and the Close button ever did.
      //
      // Deliberately does NOT call preventDefault when neither applies: the
      // browser's own Escape behaviour (stopping a media load, closing a
      // native dialog) should still work when the player has nothing to
      // dismiss.
      case 'Escape':
        if (shortcutsOpen) {
          e.preventDefault();
          shortcutsOpen = false;
        } else if (document.fullscreenElement) {
          e.preventDefault();
          void toggleFullscreen();
        }
        break;
    }
  }

  // Keyboard-shortcut help overlay state. Triggered by `?` (also `/`)
  // and the inline help button in the controls row. Stays open until
  // Esc, click-outside, or another `?`.
  let shortcutsOpen = $state(false);

  const progressPct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
  const bufferedPct = $derived(duration > 0 ? (buffered / duration) * 100 : 0);
  const qualityLabel = $derived(
    currentLevel === -1 ? 'Auto' : levels[currentLevel] ? `${levels[currentLevel].height}p` : 'Auto'
  );

  onMount(() => {
    if (!videoEl) return;

    const v = videoEl;
    v.volume = volume;


    // Track the first play of this session — used for funnel analysis (sign-up
    // → subscribe → watch-start → watch-complete). Subsequent plays (pause →
    // resume) don't re-fire. Guard against the global Openpanel script not
    // having loaded yet (no env vars set).
    let watchStartTracked = false;
    v.addEventListener('play', () => {
      playing = true;
      showControls();
      void pingActiveViewer();
      if (!watchStartTracked) {
        watchStartTracked = true;
        try {
          // Openpanel's client-side `op` is added by app.html; if the env vars
          // aren't set, the script never loads and `op` is undefined — safe.
          const op = (window as unknown as { op?: (event: string, props?: Record<string, unknown>) => void }).op;
          op?.('watch_start', { contentId, title });
        } catch { /* analytics is best-effort */ }
      }
    });
    v.addEventListener('pause', () => { playing = false; controlsVisible = true; clearTimeout(controlsTimer); });
    v.addEventListener('waiting', () => {
      // A `waiting` before playback has begun is startup, not a stall.
      if (telemetryStartupMs > 0) telemetryStallBeganAt = Date.now();
    });
    v.addEventListener('playing', () => {
      if (telemetryStartupMs === 0 && telemetryStartedAt > 0) {
        telemetryStartupMs = Date.now() - telemetryStartedAt;
      } else if (telemetryStallBeganAt > 0) {
        telemetryStallCount += 1;
        telemetryStallMs += Date.now() - telemetryStallBeganAt;
        telemetryStallBeganAt = 0;
      }
    });

    v.addEventListener('timeupdate', () => {
      onPlayheadForAds(v.currentTime);
      currentTime = v.currentTime;
      onTimeUpdate?.(v.currentTime, v.duration);
    });
    v.addEventListener('durationchange', () => { duration = v.duration; });
    v.addEventListener('progress', () => {
      if (v.buffered.length > 0) buffered = v.buffered.end(v.buffered.length - 1);
    });
    v.addEventListener('ended', () => {
      onEnded?.();
      reportProgress();
    });
    v.addEventListener('volumechange', () => {
      // While ducked, the element's volume is intent x 0.2 — reading it back
      // into `volume` would overwrite the user's real setting with the ducked
      // one and then restore to that lower value when the ad ends. Sync only
      // mute, which the duck never touches.
      if (ducking) { muted = v.muted; return; }
      volume = v.volume;
      muted = v.muted;
    });

    // Named so the cleanup can remove it — the old anonymous handler
    // leaked a document-level listener (holding the whole component
    // closure alive) on every player mount.
    const onFullscreenChange = () => { fullscreen = !!document.fullscreenElement; };
    document.addEventListener('fullscreenchange', onFullscreenChange);

    // Report progress every 30 seconds
    progressInterval = setInterval(reportProgress, 30_000);
    // Telemetry every 60s. Less frequent than progress on purpose: it is
    // diagnostic, not user-visible, and each post is a row update.
    telemetryStartedAt = Date.now();
    telemetryInterval = setInterval(() => void reportTelemetry(false), 60000);
    // Heartbeat the realtime active-viewer counter every 30s while playing.
    // First ping fires immediately on first play (below) so the counter
    // doesn't lag by up to 30s.
    activeInterval = setInterval(pingActiveViewer, 30_000);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      clearInterval(progressInterval);
      clearInterval(activeInterval);
      clearTimeout(controlsTimer);
    };
  });

  onDestroy(() => {
    reportProgress();
    // Invalidate any in-flight initHls so it can't construct an Hls
    // instance after teardown.
    initSeq += 1;
    hls?.destroy();
    hls = null;
    // Final telemetry flush before anything else is torn down — it reads
    // currentTime and levels, which the teardown below invalidates.
    void reportTelemetry(true);
    if (telemetryInterval) { clearInterval(telemetryInterval); telemetryInterval = null; }
    clearInterval(progressInterval);
    clearInterval(activeInterval);
    clearTimeout(controlsTimer);
    // Ad timers. endBreak() is idempotent, but it also restores volume and
    // resumes the movie — neither of which makes sense during teardown, so
    // clear the timers directly rather than calling it.
    if (adWatchdog) { clearTimeout(adWatchdog); adWatchdog = null; }
    if (adTicker) { clearInterval(adTicker); adTicker = null; }
    // The end-screen countdown + preroll skip timer were NOT cleared
    // here before — an orphaned end-screen interval kept counting after
    // the viewer navigated away and then fired window.location.href,
    // yanking them to a different title from an unrelated page.
    if (endScreenInterval) { clearInterval(endScreenInterval); endScreenInterval = null; }
  });

  // ───────────────────────────────────────────────────────────────────────
  // PLAYBACK TELEMETRY
  //
  // Views and watch-seconds say how much was watched; they say nothing about
  // whether it played WELL. Without this, a region the CDN serves badly is
  // indistinguishable from a region that simply watches less.
  //
  // All plain `let` — none of it renders, and keeping it non-reactive
  // guarantees it can never become a dependency of the playback-init effect.
  // ───────────────────────────────────────────────────────────────────────
  let telemetrySessionId: string | null = null;
  let telemetryStartedAt = 0;
  let telemetryStartupMs = 0;
  let telemetryStallCount = 0;
  let telemetryStallMs = 0;
  let telemetryErrorCount = 0;
  let telemetryFatal: string | null = null;
  let telemetryStallBeganAt = 0;
  let telemetryInterval: ReturnType<typeof setInterval> | null = null;
  // Time-weighted bitrate: sum(kbps x ms) / sum(ms). A plain mean over switch
  // events would let a 2-second dip to 360p count as much as an hour at 1080p.
  let telemetryBitrateWeighted = 0;
  let telemetryBitrateMs = 0;
  let telemetryLastLevelAt = 0;
  let telemetryLastKbps = 0;

  function telemetryNoteLevel(kbps: number) {
    const now = Date.now();
    if (telemetryLastLevelAt > 0 && telemetryLastKbps > 0) {
      const dt = now - telemetryLastLevelAt;
      telemetryBitrateWeighted += telemetryLastKbps * dt;
      telemetryBitrateMs += dt;
    }
    telemetryLastLevelAt = now;
    telemetryLastKbps = kbps;
  }

  function telemetryEffectiveKbps(): number {
    telemetryNoteLevel(telemetryLastKbps);
    return telemetryBitrateMs > 0
      ? Math.round(telemetryBitrateWeighted / telemetryBitrateMs)
      : telemetryLastKbps;
  }

  function telemetryPayload() {
    const level = levels[currentLevel];
    return {
      sessionId: telemetrySessionId,
      contentId,
      effectiveBitrateKbps: telemetryEffectiveKbps(),
      startupMs: telemetryStartupMs,
      stallCount: telemetryStallCount,
      stallSeconds: Math.round(telemetryStallMs / 1000),
      errorCount: telemetryErrorCount,
      fatalError: telemetryFatal,
      // `height === 0` marks the audio-only rung — the signal that the
      // low-bandwidth lever is actually being used.
      finalQuality: level ? (level.height ? `${level.height}p` : 'audio') : null,
      watchedSeconds: Math.floor(currentTime)
    };
  }

  async function reportTelemetry(final = false) {
    if (!contentId) return;
    const payload = JSON.stringify(telemetryPayload());
    try {
      if (final && navigator.sendBeacon) {
        // Must survive the page going away — that is exactly when the most
        // interesting sessions (rage-quits after a stall) end.
        navigator.sendBeacon('/api/watch/telemetry', new Blob([payload], { type: 'application/json' }));
        return;
      }
      const res = await fetch('/api/watch/telemetry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload
      });
      const body = await res.json().catch(() => null);
      if (body?.sessionId) telemetrySessionId = body.sessionId;
    } catch {
      /* telemetry must never break playback */
    }
  }

  // ───────────────────────────────────────────────────────────────────────
  // SQUEEZE-BACK ADS
  //
  // At a cue point the movie scales to 60% from the top-left and an ad renders
  // in the L-shaped remainder. Ads <= 30s duck the movie audio and let it play
  // on; longer ads pause it and restore full size afterwards. On phones there
  // is no squeeze — the movie pauses and the ad takes the whole frame.
  //
  // THE CARDINAL RULE: none of this state may ever be read by the src-owning
  // $effect below. That effect calls initHls(), which unconditionally does
  // `hls.destroy()`, so a new dependency there would tear down and rebuild the
  // entire HLS pipeline mid-ad — the exact failure the old `adsDecisionPending`
  // comment above documents. The ad renders from a SECOND <video> element for
  // the same reason, which also keeps reportProgress()'s reads of
  // videoEl.currentTime honest.
  // ───────────────────────────────────────────────────────────────────────
  type AdBreakPlan = { breakId: string; positionSeconds: number; kind: 'preroll' | 'midroll'; squeezeScale: number };
  type AdDecisionAd = {
    decisionId: string; campaignId: string; creativeId: string; src: string;
    kind: 'video' | 'vast'; durationSeconds: number | null;
    behavior: 'duck' | 'pause'; squeezeScale: number;
    clickUrl: string | null; ctaLabel: string | null;
    headline: string | null; body: string | null; mobileBehavior: string;
  };

  let adPlan = $state<AdBreakPlan[]>([]);
  let ad = $state<AdDecisionAd | null>(null);
  let adVideoEl = $state<HTMLVideoElement | undefined>();
  let adLayout = $state<'squeeze' | 'takeover'>('squeeze');
  let adBehavior = $state<'duck' | 'pause'>('pause');
  let adRemaining = $state(0);
  let adScale = $state(0.6);
  let canSqueeze = $state(true);

  // Non-reactive on purpose: consumed breaks and resume intent are bookkeeping,
  // never rendered, and must not create reactive edges anywhere near playback.
  const consumedBreaks = new Set<string>();
  let resumeAfterAd = false;
  let adWatchdog: ReturnType<typeof setTimeout> | null = null;
  let adTicker: ReturnType<typeof setInterval> | null = null;
  let breakInFlight = false;

  /** Scale is applied to the wrapper, never to the container or the controls. */
  const stageStyle = $derived(
    adActive && adLayout === 'squeeze' ? `transform: scale(${adScale});` : ''
  );

  /** Percentage the movie occupies while squeezed, for sizing the ad panes. */
  const scalePct = $derived(adActive && adLayout === 'squeeze' ? adScale * 100 : 100);

  async function loadAdPlan() {
    if (!enableBreakAds || !contentId) return;
    try {
      const qs = new URLSearchParams({ contentId });
      if (duration > 0) qs.set('runtime', String(Math.floor(duration)));
      const res = await fetch(`/api/promo/plan?${qs}`);
      if (!res.ok) return;
      const body = await res.json();
      adPlan = Array.isArray(body?.breaks) ? body.breaks : [];
    } catch {
      adPlan = [];
    }
  }

  function adBeacon(type: string, extra: Record<string, unknown> = {}) {
    if (!ad) return;
    const payload = JSON.stringify({
      decisionId: ad.decisionId, campaignId: ad.campaignId, creativeId: ad.creativeId,
      type, wasMuted: muted, layout: adLayout, ...extra
    });
    try {
      // Terminal events must survive navigation and tab close.
      if ((type === 'complete' || type === 'skip' || type === 'error') && navigator.sendBeacon) {
        navigator.sendBeacon('/api/promo/e', new Blob([payload], { type: 'application/json' }));
      } else {
        void fetch('/api/promo/e', { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload });
      }
    } catch { /* a beacon must never break playback */ }
  }

  async function startBreak(plan: AdBreakPlan) {
    if (breakInFlight || adActive || !videoEl) return;
    breakInFlight = true;
    consumedBreaks.add(plan.breakId);
    try {
      const res = await fetch('/api/promo/decision', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contentId, breakId: plan.breakId })
      });
      const body = res.ok ? await res.json() : null;
      const decision: AdDecisionAd | null = body?.ad ?? null;
      if (!decision) return;                       // no fill — skip the break silently

      // A PiP window shows only the video surface, so a squeeze would be
      // invisible. Leave PiP first; if we can't, don't serve an unseen ad.
      if (inPip) {
        try { await document.exitPictureInPicture(); } catch { return; }
      }

      ad = decision;
      adScale = plan.squeezeScale || decision.squeezeScale || 0.6;
      // A pre-roll is ALWAYS full-frame. Squeezing implies a movie playing in
      // the remaining space, and at position 0 there is nothing there yet — a
      // squeezed pre-roll would show a 60% black rectangle beside the ad.
      adLayout = plan.kind === 'preroll' ? 'takeover' : (canSqueeze ? 'squeeze' : 'takeover');
      // A takeover has no visible movie to duck against, so it always pauses.
      adBehavior = adLayout === 'takeover' ? 'pause' : decision.behavior;
      adRemaining = decision.durationSeconds ?? 0;
      adPhase = 'playing';

      if (adBehavior === 'pause') {
        resumeAfterAd = !videoEl.paused;
        videoEl.pause();
      } else {
        ducking = true;
        applyVolume();
      }

      await tick();
      if (adVideoEl) {
        adVideoEl.src = decision.src;
        adVideoEl.muted = muted;
        adVideoEl.volume = volume;
        try {
          await adVideoEl.play();
        } catch {
          // Autoplay refused with sound — retry muted rather than losing the
          // impression entirely.
          try { adVideoEl.muted = true; await adVideoEl.play(); }
          catch { endBreak('error'); return; }
        }
      }

      adBeacon('start');
      announceAd(
        adBehavior === 'pause'
          ? 'Advertisement. Your movie is paused.'
          : 'Advertisement. Your movie continues at reduced volume.'
      );

      adTicker = setInterval(() => {
        if (adVideoEl && Number.isFinite(adVideoEl.duration)) {
          adRemaining = Math.max(0, Math.ceil(adVideoEl.duration - adVideoEl.currentTime));
        } else if (adRemaining > 0) {
          adRemaining -= 1;
        }
      }, 1000);

      // Escalation watchdog: an advertiser can declare 15s and serve 60s. If a
      // ducked ad outruns its declared length, the movie has been playing
      // unheard underneath it — switch to pause rather than let it run on.
      if (adBehavior === 'duck' && decision.durationSeconds) {
        adWatchdog = setTimeout(() => {
          if (adPhase === 'playing' && adBehavior === 'duck') {
            adBeacon('error', { reason: 'duration_mismatch' });
            adBehavior = 'pause';
            ducking = false;
            applyVolume();
            if (videoEl && !videoEl.paused) { resumeAfterAd = true; videoEl.pause(); }
          }
        }, (decision.durationSeconds + 2) * 1000);
      }
    } catch {
      endBreak('error');
    } finally {
      breakInFlight = false;
    }
  }

  /**
   * Ends a break. MUST be idempotent and unconditionally safe — it is called
   * from `ended`, `error`, the watchdog, and onDestroy. The invariant it
   * protects: the movie is never left paused or ducked because an ad failed.
   */
  function endBreak(reason: 'complete' | 'skip' | 'error') {
    if (adPhase === 'idle') return;
    adPhase = 'ending';
    if (adWatchdog) { clearTimeout(adWatchdog); adWatchdog = null; }
    if (adTicker) { clearInterval(adTicker); adTicker = null; }

    const watched = adVideoEl && Number.isFinite(adVideoEl.currentTime)
      ? Math.floor(adVideoEl.currentTime) : 0;
    adBeacon(reason, { watchedSeconds: watched });

    ducking = false;
    applyVolume();

    if (adVideoEl) {
      adVideoEl.pause();
      adVideoEl.removeAttribute('src');
      adVideoEl.load();                       // free the decoder
    }

    if (resumeAfterAd && videoEl) { void videoEl.play().catch(() => {}); }
    resumeAfterAd = false;

    announceAd('Advertisement finished. Returning to your movie.');

    // Let the un-squeeze transition play out before unmounting the panes.
    setTimeout(() => { adPhase = 'idle'; ad = null; }, 450);
  }

  /** Coarse announcements only — a per-second countdown would spam AT. */
  function announceAd(msg: string) {
    try { adLiveMessage = msg; } catch { /* ignore */ }
  }
  let adLiveMessage = $state('');

  /**
   * Can this viewport actually show a squeeze?
   *
   * Layout is a CLIENT question, answered by real measurement — not by the
   * server's `locals.deviceType`, which does not exist at all in the
   * static/native build and would miss a resized desktop window or the player
   * embedded at ~50% width on the creator page. Targeting and reporting use the
   * server's device bucket; layout uses this. They will sometimes disagree,
   * which is why the impression records both.
   *
   * iOS is excluded outright: Safari permits only one <video> playing at a
   * time, so duck-and-continue is physically impossible there. Those viewers
   * get the pause-and-takeover path instead.
   */
  $effect(() => {
    if (typeof window === 'undefined' || !containerEl) return;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const mq = window.matchMedia('(min-width: 768px)');
    const evaluate = () => {
      canSqueeze = mq.matches && (containerEl?.clientWidth ?? 0) >= 640 && !isIOS;
    };
    evaluate();
    mq.addEventListener('change', evaluate);
    // A SEPARATE observer from the PiP IntersectionObserver — do not overload
    // that one; they answer different questions and have different lifetimes.
    const ro = new ResizeObserver(evaluate);
    ro.observe(containerEl);
    return () => { mq.removeEventListener('change', evaluate); ro.disconnect(); };
  });

  // Fetch the break schedule once the real duration is known. `duration` comes
  // from loadedmetadata, and the 90% cutoff cannot be computed without it —
  // mediaLibrary.duration is a display string ('2h 7m'), not seconds.
  let adPlanRequested = false;
  $effect(() => {
    if (enableBreakAds && contentId && duration > 0 && !adPlanRequested) {
      adPlanRequested = true;
      void loadAdPlan();
    }
  });

  /**
   * Fire the pre-roll cue, if the schedule has one.
   *
   * Separate from the mid-roll path because a pre-roll is not reached by the
   * playhead — it must run before the movie starts, not when `currentTime`
   * crosses 0.
   */
  let prerollAttempted = false;
  $effect(() => {
    if (!enableAds || prerollAttempted || adPlan.length === 0 || !videoEl) return;
    const pre = adPlan.find((b) => b.kind === 'preroll');
    if (!pre) { prerollAttempted = true; return; }
    prerollAttempted = true;
    // Hold the movie while the pre-roll plays; startBreak's pause branch
    // records that it should resume afterwards.
    void startBreak(pre);
  });

  /** Called from the existing timeupdate listener — no new listener. */
  function onPlayheadForAds(t: number) {
    if (!enableBreakAds || adActive || breakInFlight || adPlan.length === 0) return;
    for (const b of adPlan) {
      if (consumedBreaks.has(b.breakId)) continue;
      if (b.kind === 'preroll') continue;
      // Trigger once the playhead reaches the cue. A seek past several breaks
      // consumes them all but only opens the last one, so scrubbing to the end
      // cannot queue four ads.
      if (t >= b.positionSeconds && t < b.positionSeconds + 2) {
        void startBreak(b);
        return;
      }
    }
  }

  // Single owner of playback init: runs on mount and on every src change.
  //
  // This effect reads EXACTLY two things — `videoEl` and `src` — and that is
  // load-bearing. `initHls` unconditionally destroys the current Hls instance,
  // so anything else that becomes a dependency here tears down playback when it
  // changes. It previously also read `adsDecisionPending` and `prerollActive`,
  // because the old pre-roll played through this same <video> element and had
  // to suppress the main init until it finished.
  //
  // The pre-roll now runs as a `kind='preroll'` ad break on its own <video>
  // element like every other break, so those flags are gone and this reduces to
  // its irreducible form. DO NOT add a dependency here. Ad state in particular
  // belongs on the non-reactive controller further up.
  $effect(() => {
    if (videoEl && src) {
      initHls(videoEl, src);
    }
  });
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- role="application" tells AT to defer keyboard handling to this widget.
     Keyboard control lives on <svelte:window onkeydown={handleKeyDown}/> above
     so play/pause/seek work with the keyboard even when this div isn't focused.
     The onkeydown noop satisfies the rule that any clickable element also have
     a keyboard-event handler. svelte-check's a11y rules don't yet recognise
     role="application" as interactive, so the warnings above are suppressed. -->
<div
  bind:this={containerEl}
  class="relative bg-black w-full aspect-video select-none group"
  onmousemove={showControls}
  onclick={() => { togglePlay(); showControls(); }}
  onkeydown={() => {}}
  role="application"
  aria-label="Video player"
  tabindex="0"
>
  <!-- Video stage.
       ALWAYS RENDERED — never wrap this in {#if}/{#each}/{#key}. A conditional
       wrapper would tear down the subtree, `videoEl` would become undefined and
       then a NEW element, and the src-owning $effect would re-run initHls() —
       destroying the HLS pipeline mid-ad. All squeeze state travels through the
       style attribute below, which mutates an attribute and nothing else.

       `absolute inset-0` is geometrically identical to the previous static-flow
       `w-full h-full`, because the container's height is fixed by aspect-video —
       so all four consumers render byte-identically at rest.

       Transform, not width/height: the compositor handles it, so the decoded
       video surface is never re-scaled and no layout is recomputed per frame.
       origin-top-left + a uniform scale means the movie occupies exactly the
       top-left scale x scale box with its aspect ratio intact, and the
       remainder is a literal L. -->
  <div
    class="absolute inset-0 origin-top-left will-change-transform transition-transform duration-500 ease-out motion-reduce:transition-none motion-reduce:duration-0"
    style={stageStyle}
  >
    <video
      bind:this={videoEl}
      {poster}
      class="w-full h-full"
      playsinline
    >
      {#each subtitles as sub}
        <track kind="subtitles" label={sub.label} src={sub.src} srclang={sub.srclang} />
      {/each}
      {#each descriptions as d}
        <track kind="descriptions" label={d.label} src={d.src} srclang={d.srclang} />
      {/each}
    </video>
  </div>

  <!-- Ad panes.
       Placed immediately after the stage with NO z-index, deliberately. The
       existing stack works by DOM order: <video> (auto) -> end screen (z-10) ->
       controls overlay (auto, later in DOM) -> skip buttons (z-30) ->
       failure/shortcuts (z-40). Inserting here with no z-index paints the ad
       above the movie and below the controls, which is exactly right. Giving
       the controls an explicit z-index to "fix" ordering would silently invert
       today's end-screen-covers-controls behaviour. -->
  {#if adActive && ad}
    {#if adLayout === 'squeeze'}
      <!-- Right column of the L -->
      <div
        class="absolute top-0 right-0 h-full bg-black flex flex-col"
        style="width: {100 - scalePct}%"
        role="region"
        aria-label="Advertisement"
        onclick={(e) => e.stopPropagation()}
        onkeydown={() => {}}
      >
        <video
          bind:this={adVideoEl}
          class="w-full flex-1 object-contain"
          playsinline
          disablepictureinpicture
          onended={() => endBreak('complete')}
          onerror={() => endBreak('error')}
        ></video>
        {@render adChrome()}
      </div>
      <!-- Bottom-left leg of the L, beneath the squeezed movie -->
      <div
        class="absolute left-0 bottom-0 bg-black text-white px-4 py-3 overflow-hidden"
        style="width: {scalePct}%; height: {100 - scalePct}%"
        onclick={(e) => e.stopPropagation()}
        onkeydown={() => {}}
        role="region"
        aria-label="Advertisement details"
      >
        {#if ad.headline}<p class="text-sm font-semibold truncate">{ad.headline}</p>{/if}
        {#if ad.body}<p class="text-xs text-white/70 line-clamp-2">{ad.body}</p>{/if}
      </div>
    {:else}
      <!-- Mobile takeover: the movie is paused underneath, frame preserved. -->
      <div
        class="absolute inset-0 bg-black flex flex-col"
        role="region"
        aria-label="Advertisement"
        onclick={(e) => e.stopPropagation()}
        onkeydown={() => {}}
      >
        <video
          bind:this={adVideoEl}
          class="w-full flex-1 object-contain"
          playsinline
          disablepictureinpicture
          onended={() => endBreak('complete')}
          onerror={() => endBreak('error')}
        ></video>
        {@render adChrome()}
      </div>
    {/if}
  {/if}

  <!-- Playback-failure overlay. Set when hls.js exhausts its bounded
       recovery attempts (broken manifest, undecodable stream). Before
       this, fatal errors were swallowed silently — the viewer saw a
       frozen frame with no explanation, and we had no way to tell
       codec problems from CORS from missing objects. Retry re-runs the
       full init (fresh manifest fetch). -->
  {#if playbackFailed}
    <div class="absolute inset-0 z-40 bg-black/85 flex flex-col items-center justify-center gap-3 text-center p-6">
      <div class="text-white text-lg font-semibold">Playback failed</div>
      <p class="text-white/60 text-sm max-w-md">
        The video stream couldn't be loaded. This is usually temporary —
        try again, or come back in a few minutes while we sort it out.
      </p>
      <button
        type="button"
        onclick={() => { if (videoEl && src) initHls(videoEl, src); }}
        class="mt-2 px-5 py-2 rounded-full bg-white/90 hover:bg-white text-black text-sm font-semibold transition-colors"
      >
        Try again
      </button>
    </div>
  {/if}

  <!-- Skip Intro / Skip Credits — floating button in the bottom-right,
       OUTSIDE the controls fade so viewers can hit it even when the
       controls are hidden (they're idle, watching, then suddenly the
       theme kicks in). Only renders when the current chapter matches
       the naming convention (see SKIP_INTRO_NAMES / SKIP_OUTRO_NAMES). -->
  {#if skipIntroTarget !== null}
    <button
      type="button"
      onclick={(e) => { e.stopPropagation(); if (videoEl) videoEl.currentTime = skipIntroTarget!; }}
      class="absolute bottom-20 right-4 z-30 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-black text-sm font-semibold shadow-lg transition-colors backdrop-blur"
    >
      Skip Intro
    </button>
  {:else if skipOutroTarget !== null}
    <button
      type="button"
      onclick={(e) => { e.stopPropagation(); if (videoEl) videoEl.currentTime = skipOutroTarget!; }}
      class="absolute bottom-20 right-4 z-30 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-black text-sm font-semibold shadow-lg transition-colors backdrop-blur"
    >
      Skip Credits
    </button>
  {/if}

  <!-- Pre-roll ad chrome. The pre-roll plays from the same <video>; this
       overlay shows the "Ad" badge + countdown + skip button. -->

  <!-- End-screen overlay: appears during the last 10% of playback if there
       are next-up cards. Click any card to navigate; X dismisses. -->
  {#if endScreenVisible}
    <div
      class="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 transition-opacity"
      role="region"
      aria-label="Next up suggestions"
    >
      <div class="w-full max-w-3xl space-y-4">
        {#if endOfSeries}
          <!-- Finale banner — replaces the "Up next" header when the
               viewer has reached the last episode of the series. The
               filler cards below still appear so they can keep watching
               related content; this header just gives the moment its
               proper weight. -->
          <div class="text-center space-y-2 mb-2">
            <div class="text-4xl">🎬</div>
            <h3 class="text-white text-xl font-semibold">You've reached the end of the series</h3>
            <p class="text-white/70 text-sm">Thanks for watching. Here are a few more to explore.</p>
          </div>
        {/if}
        <div class="flex items-center justify-between">
          <h3 class="text-white text-lg font-semibold">{endOfSeries ? 'More like this' : 'Up next'}</h3>
          <button
            type="button"
            onclick={() => (endScreenDismissed = true)}
            class="text-gray-300 hover:text-white text-sm"
            aria-label="Dismiss"
          >Dismiss</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-{Math.min(endScreen.length, 3)} gap-3">
          {#each endScreen as item, i (item.id)}
            <a
              href={item.href || `/watch/${item.slug || item.id}`}
              class="block group surface-1 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
            >
              <div class="aspect-video bg-black/50 relative">
                {#if item.thumbnail}
                  <img src={item.thumbnail} alt="" class="w-full h-full object-cover" />
                {/if}
                {#if item.kind}
                  <div class="absolute top-2 left-2 bg-purple-600/90 text-white text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium">
                    {item.kind}
                  </div>
                {/if}
                {#if i === 0 && endScreenCountdown > 0}
                  <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    Playing in {endScreenCountdown}s
                  </div>
                {/if}
              </div>
              <div class="p-2">
                <div class="text-sm text-white font-medium line-clamp-2 group-hover:text-purple-300">{item.title}</div>
                {#if item.duration}
                  <div class="text-xs text-gray-400 mt-0.5">{item.duration}</div>
                {/if}
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Controls overlay — click is only used to stop propagation to the container -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="absolute left-0 top-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 {controlsVisible ? 'opacity-100' : 'opacity-0'}"
    style="width: {scalePct}%; height: {scalePct}%"
    onclick={(e) => e.stopPropagation()}
    onkeydown={() => {}}
    role="presentation"
  >
    <!-- Top metadata strip: age rating + first 3 genres as glass chips.
         Sits above the small title so the cinematic feel reads age + genre
         first, then title. All inherit the parent's opacity transition. -->
    <!-- Top region inside the controls overlay: title (large, with a
         gradient backdrop) + age/genre strip below it. The whole region
         fades in/out with the controls so the title only appears when
         the user moves the mouse or pauses — it's gone the rest of the
         time. Modern streaming feel without permanent chrome.

         The `{#key title}` makes the title element remount with a
         300ms fade whenever the title prop changes — used by the
         watch page when navigating between episodes (?episode= URL
         changes) so the new title fades in instead of snapping. -->
    {#if title}
      <div class="absolute top-0 inset-x-0 pointer-events-none bg-linear-to-b from-black/60 via-black/20 to-transparent pt-3 pb-10 px-4">
        <!-- Relative wrapper + absolute child = a true cross-fade
             between consecutive titles (e.g. episode transitions on
             a TV title). 200ms matches the watch-page episode badge. -->
        <div class="relative h-6 sm:h-7">
          {#key title}
            <div
              in:fade={{ duration: 200 }}
              out:fade={{ duration: 200 }}
              class="absolute inset-0 text-white text-sm sm:text-base font-medium drop-shadow truncate"
            >
              {title}
            </div>
          {/key}
        </div>
        {#if ageRating || displayGenres.length > 0}
          <div class="mt-1.5 flex flex-wrap items-center gap-2">
            {#if ageRating}
              <span class="px-2 py-0.5 border border-white/30 rounded text-[10px] uppercase tracking-wider text-white/90 bg-black/30 backdrop-blur-sm">
                {ageRating}
              </span>
            {/if}
            {#each displayGenres as genre (genre)}
              <span class="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[10px] text-white/90">
                {genre}
              </span>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Current chapter label (only when chapters are present) -->
    {#if currentChapter}
      <div class="mx-4 mb-1 text-xs text-white/80 truncate">
        <span class="text-white/60">Chapter:</span> {currentChapter.title}
      </div>
    {/if}

    <!-- Progress bar — keyboard arrow keys handled globally by handleKeyDown -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="mx-4 mb-2 h-1.5 bg-white/20 rounded-full cursor-pointer group/bar hover:h-3 transition-all relative"
      onclick={seek}
      onmousemove={onProgressMove}
      onmouseleave={onProgressLeave}
      onkeydown={() => {}}
      role="slider"
      aria-label="Video progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(progressPct)}
      tabindex="0"
    >
      <!-- Floating scrubbing-preview thumbnail (R+5 sprite/VTT artifacts). -->
      {#if hoveredCue && previewHoverPct !== null}
        <div
          class="absolute bottom-full mb-3 -translate-x-1/2 pointer-events-none rounded-md overflow-hidden shadow-2xl ring-1 ring-black/50 bg-black"
          style="left: {previewHoverPct}%; width: {hoveredCue.w}px; height: {hoveredCue.h}px;"
        >
          <div
            class="absolute inset-0"
            style="background-image: url({hoveredCue.spriteUrl}); background-position: -{hoveredCue.x}px -{hoveredCue.y}px; background-repeat: no-repeat;"
          ></div>
          <div class="absolute bottom-0 inset-x-0 text-center text-[10px] text-white bg-black/70 px-1 py-0.5 font-mono">
            {formatHover(previewHoverSec)}
          </div>
        </div>
      {/if}
      <!-- Buffered -->
      <div class="absolute inset-y-0 left-0 bg-white/30 rounded-full" style="width: {bufferedPct}%"></div>
      <!-- Played -->
      <div class="absolute inset-y-0 left-0 bg-[#FF5E0E] rounded-full" style="width: {progressPct}%">
        <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow"></div>
      </div>
      <!-- Chapter tick marks (skip the 0s start; that's just the bar origin) -->
      {#if chapters && chapters.length > 0 && duration > 0}
        {#each chapters as c (c.start)}
          {#if c.start > 0 && c.start < duration}
            <div
              class="absolute top-1/2 -translate-y-1/2 w-0.5 h-full bg-white/70 pointer-events-none"
              style="left: {(c.start / duration) * 100}%"
              title={c.title}
            ></div>
          {/if}
        {/each}
      {/if}
    </div>


    <!-- Controls row -->
    <div class="flex items-center gap-3 px-4 pb-4">
      <!-- Play/Pause -->
      <button
        onclick={togglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
        aria-pressed={playing}
        class="text-white hover:text-[#FF5E0E] transition-colors"
      >
        {#if playing}
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        {:else}
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
        {/if}
      </button>

      <!-- Skip back/forward -->
      <button
        onclick={() => { if (videoEl) videoEl.currentTime -= 10; }}
        aria-label="Skip backward 10 seconds"
        class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold"
      >
        ↺10
      </button>
      <button
        onclick={() => { if (videoEl) videoEl.currentTime += 10; }}
        aria-label="Skip forward 10 seconds"
        class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold"
      >
        10↻
      </button>

      <!-- Next Episode button — only renders when nextEpisodeHref is set
           (TV titles with a successor episode). Click jumps straight to
           the next episode; viewers don't have to wait for the end-
           screen overlay or scrub forward. Keyboard shortcut is `n`. -->
      {#if nextEpisodeHref}
        <a
          href={nextEpisodeHref}
          aria-label="Play next episode (N)"
          title="Next episode (N)"
          class="text-white hover:text-[#FF5E0E] transition-colors inline-flex items-center gap-1 text-xs font-semibold"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="6,4 14,12 6,20" />
            <rect x="15" y="4" width="3" height="16" />
          </svg>
          <span class="hidden sm:inline">Next</span>
        </a>
      {/if}

      <!-- Time -->
      <span class="text-white text-xs tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Volume -->
      <div class="flex items-center gap-2">
        <button
          onclick={toggleMute}
          aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
          aria-pressed={muted}
          class="text-white hover:text-[#FF5E0E] transition-colors"
        >
          {#if muted || volume === 0}
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
          {:else if volume < 0.5}
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
          {:else}
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          {/if}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          oninput={changeVolume}
          aria-label="Volume"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(volume * 100)}
          class="w-20 h-1 accent-[#FF5E0E] cursor-pointer"
        />
      </div>

      <!-- Playback speed -->
      <div class="relative">
        <button
          onclick={(e) => { e.stopPropagation(); showSpeedMenu = !showSpeedMenu; showQualityMenu = false; }}
          class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1"
        >
          {speed}x
        </button>
        {#if showSpeedMenu}
          <div class="absolute bottom-8 right-0 bg-black/90 border border-white/10 rounded-lg overflow-hidden w-20 z-50">
            {#each SPEEDS as s}
              <button
                onclick={(e) => { e.stopPropagation(); setSpeed(s); }}
                class="block w-full px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors {speed === s ? 'text-[#FF5E0E]' : 'text-white'}"
              >{s}x</button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Quality -->
      {#if levels.length > 0}
        <div class="relative">
          <button
            onclick={(e) => { e.stopPropagation(); showQualityMenu = !showQualityMenu; showSpeedMenu = false; }}
            class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1"
          >
            {qualityLabel}
          </button>
          {#if showQualityMenu}
            <div class="absolute bottom-8 right-0 bg-black/90 border border-white/10 rounded-lg overflow-hidden w-24 z-50">
              <button
                onclick={(e) => { e.stopPropagation(); setQuality(-1); }}
                class="block w-full px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors {currentLevel === -1 ? 'text-[#FF5E0E]' : 'text-white'}"
              >Auto</button>
              {#each levels as level}
                <button
                  onclick={(e) => { e.stopPropagation(); setQuality(level.index); }}
                  class="block w-full px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors {currentLevel === level.index ? 'text-[#FF5E0E]' : 'text-white'}"
                >{level.height}p</button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Subtitles toggle (if available) -->
      {#if subtitles.length > 0}
        <button
          onclick={(e) => { e.stopPropagation(); if (videoEl) { const t = videoEl.textTracks[0]; if (t) t.mode = t.mode === 'showing' ? 'hidden' : 'showing'; } }}
          class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors"
          aria-label="Toggle closed captions"
        >CC</button>
      {/if}

      <!-- Keyboard shortcuts opener — `?` icon next to fullscreen.
           Press the actual `?` key as the keyboard shortcut, or click
           this button. -->
      <button
        type="button"
        onclick={() => (shortcutsOpen = true)}
        aria-label="Show keyboard shortcuts"
        class="text-white/70 hover:text-[#FF5E0E] transition-colors text-base font-bold"
      >?</button>

      <!-- Picture-in-Picture toggle — only renders when the browser
           actually supports the API. Sits next to Fullscreen because
           it's an alternate "display surface" control. The icon
           matches the standard PiP glyph (rectangle within rectangle). -->
      {#if pipSupported}
        <button
          onclick={togglePip}
          aria-label={inPip ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}
          aria-pressed={inPip}
          class="text-white hover:text-[#FF5E0E] transition-colors"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/>
          </svg>
        </button>
      {/if}

      <!-- Fullscreen -->
      <button
        onclick={toggleFullscreen}
        aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-pressed={fullscreen}
        class="text-white hover:text-[#FF5E0E] transition-colors"
      >
        {#if fullscreen}
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
        {:else}
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Keyboard shortcut help overlay — opens via the `?` key or the
       inline help button in the controls. Click anywhere outside the
       panel or press Esc to close. Lists every shortcut grouped by
       function so viewers can learn them all at a glance. -->
  {#if shortcutsOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
      onclick={(e) => { e.stopPropagation(); shortcutsOpen = false; }}
      role="button"
      tabindex="-1"
      aria-label="Close shortcuts"
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="max-w-md w-full bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 text-white"
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold">Keyboard shortcuts</h3>
          <button
            type="button"
            onclick={() => (shortcutsOpen = false)}
            class="text-white/60 hover:text-white text-sm"
            aria-label="Close"
          >Close</button>
        </div>
        <dl class="space-y-2.5 text-sm">
          {#each [
            { keys: ['Space', 'K'], action: 'Play / pause' },
            { keys: ['←'], action: 'Back 10 seconds' },
            { keys: ['→'], action: 'Forward 10 seconds' },
            { keys: ['↑'], action: 'Volume up' },
            { keys: ['↓'], action: 'Volume down' },
            { keys: ['M'], action: 'Mute / unmute' },
            { keys: ['F'], action: 'Fullscreen' },
            { keys: ['<', ','], action: 'Previous chapter' },
            { keys: ['>', '.'], action: 'Next chapter' },
            { keys: ['N'], action: 'Next episode (TV titles)' },
            { keys: ['?', '/'], action: 'Show this help' }
          ] as row (row.action)}
            <div class="flex items-center justify-between gap-4">
              <dd class="text-white/80">{row.action}</dd>
              <dt class="flex items-center gap-1 shrink-0">
                {#each row.keys as k, i (k)}
                  {#if i > 0}<span class="text-white/40 text-xs">or</span>{/if}
                  <kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-xs font-mono">{k}</kbd>
                {/each}
              </dt>
            </div>
          {/each}
        </dl>
      </div>
    </div>
  {/if}

  <!-- Center play button (shown when paused) -->
  {#if !playing && controlsVisible}
    <button
      type="button"
      aria-label="Play video"
      onclick={togglePlay}
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div class="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white">
        <svg class="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
      </div>
    </button>
  {/if}
</div>
\n
{#snippet adChrome()}
  <div class="flex items-center justify-between gap-3 px-3 py-2 bg-black/80">
    <span class="text-[10px] uppercase tracking-wider bg-white/20 text-white px-1.5 py-0.5 rounded">Ad</span>
    <!-- aria-hidden: a per-second ticker announced by a live region spams
         assistive tech. Coarse announcements go through the region below. -->
    <span class="text-xs text-white/80" aria-hidden="true">
      {adRemaining > 0 ? `${adRemaining}s` : ''}
    </span>
    {#if ad?.clickUrl}
      <a
        href={ad.clickUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        class="text-xs font-medium bg-white text-black px-3 py-1.5 rounded min-h-[44px] inline-flex items-center"
        onclick={() => adBeacon('click')}
      >
        {ad.ctaLabel ?? 'Learn more'}
      </a>
    {/if}
  </div>
{/snippet}

<!-- Coarse ad announcements. Deliberately not on the countdown. -->
<div class="sr-only" role="status" aria-live="polite">{adLiveMessage}</div>
