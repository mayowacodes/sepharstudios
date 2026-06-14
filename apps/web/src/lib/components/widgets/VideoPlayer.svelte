<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
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
    enableAds?: boolean;
  }

  let {
    src, poster, contentId, startAt = 0, title,
    ageRating, genres = [],
    subtitles = [], descriptions = [], chapters = [], endScreen = [],
    endOfSeries = false,
    nextEpisodeHref,
    previewVtt, previewSprites = [],
    enableAds = false,
    onEnded, onTimeUpdate
  }: Props = $props();

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
    const visible = endScreen && endScreen.length > 0 && duration > 0
      && currentTime / duration > 0.9 && !endScreenDismissed;
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
    if (hls) { hls.destroy(); hls = null; }

    const isHlsUrl = url.includes('.m3u8');
    const canPlayNative = video.canPlayType('application/vnd.apple.mpegurl');

    // Only pay the 120 KB cost when we actually need hls.js (HLS source + no
    // native support). Safari and direct MP4 sources skip the dynamic import.
    if (isHlsUrl && !canPlayNative) {
      const Hls = await loadHls();
      if (!Hls.isSupported()) {
        video.src = url;
        if (startAt > 0) video.currentTime = startAt;
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
        if (startAt > 0) video.currentTime = startAt;
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        currentLevel = data.level;
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else if (isHlsUrl && canPlayNative) {
      // Native HLS (Safari)
      video.src = url;
      if (startAt > 0) {
        video.addEventListener('loadedmetadata', () => { video.currentTime = startAt; }, { once: true });
      }
      video.play().catch(() => {});
    } else {
      // Direct MP4/WebM — no HLS machinery needed
      video.src = url;
      if (startAt > 0) video.currentTime = startAt;
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

  function toggleMute() {
    if (!videoEl) return;
    muted = !muted;
    videoEl.muted = muted;
  }

  function changeVolume(e: Event) {
    volume = parseFloat((e.target as HTMLInputElement).value);
    if (videoEl) { videoEl.volume = volume; videoEl.muted = volume === 0; }
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
    switch (e.key) {
      case ' ': case 'k': e.preventDefault(); togglePlay(); break;
      case 'ArrowRight': videoEl.currentTime = Math.min(videoEl.currentTime + 10, duration); break;
      case 'ArrowLeft': videoEl.currentTime = Math.max(videoEl.currentTime - 10, 0); break;
      case 'ArrowUp': volume = Math.min(1, volume + 0.1); if (videoEl) videoEl.volume = volume; break;
      case 'ArrowDown': volume = Math.max(0, volume - 0.1); if (videoEl) videoEl.volume = volume; break;
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
    }
  }

  const progressPct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
  const bufferedPct = $derived(duration > 0 ? (buffered / duration) * 100 : 0);
  const qualityLabel = $derived(
    currentLevel === -1 ? 'Auto' : levels[currentLevel] ? `${levels[currentLevel].height}p` : 'Auto'
  );

  // Pre-roll ad state. When the player is mounted with enableAds=true and
  // the server returns a non-null preroll URL, we play that first, then
  // swap to the main content on `ended`. Skip button shows after 5s.
  let prerollUrl = $state<string | null>(null);
  let prerollActive = $state(false);
  let prerollSkippableAt = $state(5);
  let prerollSkippableTimer: ReturnType<typeof setInterval> | null = null;

  function endPreroll(reason: 'completed' | 'skipped' | 'error') {
    prerollActive = false;
    if (prerollSkippableTimer) { clearInterval(prerollSkippableTimer); prerollSkippableTimer = null; }
    try {
      const op = (window as unknown as { op?: (event: string, props?: Record<string, unknown>) => void }).op;
      op?.('ad_preroll_end', { contentId, reason });
    } catch { /* analytics best-effort */ }
    if (videoEl && src) initHls(videoEl, src);
  }

  onMount(() => {
    if (!videoEl) return;

    const v = videoEl;
    v.volume = volume;

    if (enableAds && contentId) {
      void (async () => {
        try {
          const res = await fetch(`/api/ads/vast-tag?contentId=${encodeURIComponent(contentId)}`);
          if (!res.ok) { initHls(v, src); return; }
          const body = await res.json();
          if (!body?.url) { initHls(v, src); return; }
          prerollUrl = body.url;
          prerollActive = true;
          prerollSkippableAt = 5;
          prerollSkippableTimer = setInterval(() => {
            prerollSkippableAt = Math.max(0, prerollSkippableAt - 1);
            if (prerollSkippableAt === 0 && prerollSkippableTimer) {
              clearInterval(prerollSkippableTimer);
              prerollSkippableTimer = null;
            }
          }, 1000);
          v.src = body.url;
          v.play().catch(() => endPreroll('error'));
          try {
            const op = (window as unknown as { op?: (event: string, props?: Record<string, unknown>) => void }).op;
            op?.('ad_preroll_start', { contentId });
          } catch { /* analytics best-effort */ }
        } catch {
          initHls(v, src);
        }
      })();
    } else {
      initHls(v, src);
    }

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
    v.addEventListener('timeupdate', () => {
      currentTime = v.currentTime;
      onTimeUpdate?.(v.currentTime, v.duration);
    });
    v.addEventListener('durationchange', () => { duration = v.duration; });
    v.addEventListener('progress', () => {
      if (v.buffered.length > 0) buffered = v.buffered.end(v.buffered.length - 1);
    });
    v.addEventListener('ended', () => {
      if (prerollActive) {
        endPreroll('completed');
        return;
      }
      onEnded?.();
      reportProgress();
    });
    v.addEventListener('volumechange', () => { volume = v.volume; muted = v.muted; });

    document.addEventListener('fullscreenchange', () => { fullscreen = !!document.fullscreenElement; });

    // Report progress every 30 seconds
    progressInterval = setInterval(reportProgress, 30_000);
    // Heartbeat the realtime active-viewer counter every 30s while playing.
    // First ping fires immediately on first play (below) so the counter
    // doesn't lag by up to 30s.
    activeInterval = setInterval(pingActiveViewer, 30_000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(activeInterval);
      clearTimeout(controlsTimer);
    };
  });

  onDestroy(() => {
    reportProgress();
    hls?.destroy();
    clearInterval(progressInterval);
    clearInterval(activeInterval);
    clearTimeout(controlsTimer);
  });

  // Re-init when src changes
  $effect(() => {
    if (videoEl && src) initHls(videoEl, src);
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
  <!-- Video element -->
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


  <!-- Pre-roll ad chrome. The pre-roll plays from the same <video>; this
       overlay shows the "Ad" badge + countdown + skip button. -->
  {#if prerollActive && prerollUrl}
    <div class="absolute top-3 left-3 z-20 inline-flex items-center gap-2 bg-black/70 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded">
      Ad
    </div>
    <div class="absolute bottom-3 right-3 z-20">
      {#if prerollSkippableAt > 0}
        <span class="bg-black/70 text-white text-xs px-3 py-1.5 rounded">Skip in {prerollSkippableAt}s</span>
      {:else}
        <button
          type="button"
          onclick={() => endPreroll('skipped')}
          class="bg-white/90 hover:bg-white text-black text-xs font-semibold px-3 py-1.5 rounded"
        >Skip ad →</button>
      {/if}
    </div>
  {/if}

  <!-- End-screen overlay: appears during the last 10% of playback if there
       are next-up cards. Click any card to navigate; X dismisses. -->
  {#if endScreen && endScreen.length > 0 && duration > 0 && currentTime / duration > 0.9 && !endScreenDismissed}
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
    class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 {controlsVisible ? 'opacity-100' : 'opacity-0'}"
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
