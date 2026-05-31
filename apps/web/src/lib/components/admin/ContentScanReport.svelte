<script lang="ts">
  import { Sparkles, AlertTriangle, CheckCircle2, XCircle, FileText, Image as ImageIcon, Languages } from '@lucide/svelte';

  interface SubtitleTrack {
    language: string;
    kind: 'transcription' | 'translation';
    default: boolean;
    vttUrl?: string;
    txtUrl?: string;
    durationSec?: number;
    wordCount?: number;
    quality?: {
      parseOk?: boolean;
      cueCount?: number;
      suspectedHallucination?: boolean;
      machineTranslated?: boolean;
    };
  }

  interface ScanReport {
    /** Legacy single-track shape — kept for old rows. */
    transcript?: { vttUrl?: string; txtUrl?: string; durationSec?: number; language?: string; wordCount?: number };
    /** Current shape: one entry per language. */
    subtitles?: SubtitleTrack[];
    thumbnails?: { posterUrl?: string; spriteUrls?: string[]; vttUrl?: string };
    frames?: Array<{ index: number; timestampSec: number; url: string }>;
    audioAvailable?: boolean;
    videoDurationSec?: number;
    partial?: boolean;
    aiVerdict?: {
      verdict: 'approve' | 'flag' | 'reject';
      theologyScore: number;
      familySafeScore: number;
      recommendedAgeRating: string;
      flags: string[];
      reason: string;
      transcriptExcerpts?: Array<{ text: string; reason: string }>;
    };
    startedAt?: string;
    completedAt?: string;
  }

  interface Props {
    status: string;            // 'idle' | 'in_progress' | 'complete' | 'failed' | 'skipped'
    report: ScanReport | null;
    contentId?: string;
    onRescanned?: () => void;
  }

  let { status, report, contentId, onRescanned }: Props = $props();

  let rescanning = $state(false);

  async function rescan() {
    if (!contentId) return;
    rescanning = true;
    try {
      const res = await fetch(`/api/admin/content/${contentId}/rescan`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Rescan failed');
      onRescanned?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Rescan failed');
    } finally {
      rescanning = false;
    }
  }

  const canRescan = $derived(
    !!contentId
    && !!report
    && (status === 'complete' || status === 'failed')
    && !!(
      report.transcript?.txtUrl
      || report.transcript?.vttUrl
      || (report.subtitles && report.subtitles.length > 0)
    )
  );

  // Per-track hallucination warning rolled up for the banner.
  const anyHallucination = $derived(
    !!report?.subtitles?.some((s) => s.quality?.suspectedHallucination)
  );

  function verdictClass(v: string): string {
    if (v === 'approve') return 'bg-green-600/20 border-green-500/40 text-green-100';
    if (v === 'reject') return 'bg-red-600/20 border-red-500/40 text-red-100';
    return 'bg-yellow-600/20 border-yellow-500/40 text-yellow-100';
  }

  function scoreClass(n: number): string {
    if (n >= 8) return 'text-green-300';
    if (n >= 5) return 'text-yellow-300';
    return 'text-red-300';
  }

  function formatTs(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div class="surface-1 rounded-xl p-4 space-y-4">
  <div class="flex items-center gap-2">
    <Sparkles class="w-4 h-4 text-purple-300" />
    <h3 class="text-sm font-semibold text-white">AI content scan</h3>
    <div class="ml-auto flex items-center gap-2">
      {#if status === 'idle'}
        <span class="text-xs text-gray-500">Not yet scanned</span>
      {:else if status === 'in_progress'}
        <span class="text-xs text-blue-300">Running…</span>
      {:else if status === 'complete'}
        <span class="text-xs text-green-300">Complete</span>
      {:else if status === 'failed'}
        <span class="text-xs text-red-300">Failed</span>
      {:else if status === 'skipped'}
        <span class="text-xs text-gray-400">Skipped</span>
      {/if}
      {#if canRescan}
        <button
          type="button"
          onclick={rescan}
          disabled={rescanning}
          class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40"
        >{rescanning ? 'Rescanning…' : 'Re-scan'}</button>
      {/if}
    </div>
  </div>

  {#if report?.partial}
    <div class="rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-100 px-3 py-2 text-xs inline-flex items-start gap-2">
      <AlertTriangle class="w-3 h-3 mt-0.5 shrink-0" />
      <div>
        <div class="font-semibold">Partial scan (timeout)</div>
        <div class="opacity-80">The orchestrator's scan timeout fired before every artifact was produced. Some subtitle tracks, frame samples, or sprites may be missing.</div>
      </div>
    </div>
  {/if}

  {#if anyHallucination}
    <div class="rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-100 px-3 py-2 text-xs inline-flex items-start gap-2">
      <AlertTriangle class="w-3 h-3 mt-0.5 shrink-0" />
      <div>
        <div class="font-semibold">Suspected hallucination</div>
        <div class="opacity-80">One or more transcript tracks shows Whisper-quality signals consistent with hallucinated content (repetitive cues, abnormal compression ratios). Re-listen before trusting the transcript verbatim.</div>
      </div>
    </div>
  {/if}

  {#if status === 'idle'}
    <p class="text-xs text-gray-400">
      The encoder hasn't produced scan artifacts yet. Once the orchestrator delivers a transcript + frame samples, the AI will evaluate this content against the doctrinal and family-safety guidelines.
    </p>
  {:else if status === 'in_progress'}
    <p class="text-xs text-blue-200">
      Scan in progress. The AI is reading the transcript and sampled frames; this usually takes under a minute.
    </p>
  {:else if status === 'failed'}
    <p class="text-xs text-red-200">
      The scan failed. Approve/reject manually based on your own review; the scan can be re-run from the system-health page.
    </p>
  {:else if report?.aiVerdict}
    <!-- Verdict banner -->
    <div class="rounded-lg border p-3 {verdictClass(report.aiVerdict.verdict)}">
      <div class="flex items-center gap-2">
        {#if report.aiVerdict.verdict === 'approve'}
          <CheckCircle2 class="w-4 h-4" />
        {:else if report.aiVerdict.verdict === 'reject'}
          <XCircle class="w-4 h-4" />
        {:else}
          <AlertTriangle class="w-4 h-4" />
        {/if}
        <span class="text-sm font-semibold uppercase tracking-wide">AI verdict: {report.aiVerdict.verdict}</span>
      </div>
      <p class="text-xs mt-2">{report.aiVerdict.reason}</p>
    </div>

    <!-- Score row -->
    <div class="grid grid-cols-3 gap-3">
      <div class="surface-2 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold tabular-nums {scoreClass(report.aiVerdict.theologyScore)}">
          {report.aiVerdict.theologyScore}/10
        </div>
        <div class="text-[10px] uppercase tracking-wide text-gray-400 mt-1">Theology</div>
      </div>
      <div class="surface-2 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold tabular-nums {scoreClass(report.aiVerdict.familySafeScore)}">
          {report.aiVerdict.familySafeScore}/10
        </div>
        <div class="text-[10px] uppercase tracking-wide text-gray-400 mt-1">Family safe</div>
      </div>
      <div class="surface-2 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-white tabular-nums">{report.aiVerdict.recommendedAgeRating}</div>
        <div class="text-[10px] uppercase tracking-wide text-gray-400 mt-1">Recommended age</div>
      </div>
    </div>

    {#if report.aiVerdict.flags && report.aiVerdict.flags.length > 0}
      <div>
        <div class="text-xs uppercase tracking-wide text-gray-400 mb-1">Flags</div>
        <ul class="space-y-1">
          {#each report.aiVerdict.flags as f (f)}
            <li class="text-xs text-yellow-100 inline-flex items-center gap-1.5">
              <AlertTriangle class="w-3 h-3" />
              {f}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if report.aiVerdict.transcriptExcerpts && report.aiVerdict.transcriptExcerpts.length > 0}
      <div>
        <div class="text-xs uppercase tracking-wide text-gray-400 mb-1 inline-flex items-center gap-1">
          <FileText class="w-3 h-3" /> Transcript excerpts flagged by AI
        </div>
        <ul class="space-y-2">
          {#each report.aiVerdict.transcriptExcerpts as e, i (i)}
            <li class="surface-2 rounded p-2 text-xs">
              <div class="text-gray-200 italic">"{e.text}"</div>
              <div class="text-yellow-300 mt-1">→ {e.reason}</div>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if report.frames && report.frames.length > 0}
      <details>
        <summary class="text-xs uppercase tracking-wide text-gray-400 cursor-pointer inline-flex items-center gap-1">
          <ImageIcon class="w-3 h-3" /> {report.frames.length} sampled frames
        </summary>
        <div class="grid grid-cols-5 gap-1 mt-2">
          {#each report.frames as f (f.index)}
            <a href={f.url} target="_blank" rel="noopener" class="block aspect-video bg-black/30 rounded overflow-hidden">
              <img src={f.url} alt={`Frame at ${formatTs(f.timestampSec)}`} class="w-full h-full object-cover" loading="lazy" />
            </a>
          {/each}
        </div>
      </details>
    {/if}

    {#if report.subtitles && report.subtitles.length > 0}
      <div>
        <div class="text-xs uppercase tracking-wide text-gray-400 mb-1 inline-flex items-center gap-1">
          <Languages class="w-3 h-3" /> Subtitle tracks ({report.subtitles.length})
        </div>
        <ul class="space-y-1.5">
          {#each report.subtitles as t (t.language + t.kind)}
            <li class="surface-2 rounded px-2 py-1.5 text-xs flex items-center gap-2 flex-wrap">
              <span class="font-mono uppercase font-semibold text-white">{t.language}</span>
              <span class="text-[10px] uppercase tracking-wide text-purple-300">{t.kind}</span>
              {#if t.default}
                <span class="text-[10px] uppercase tracking-wide text-green-300">default</span>
              {/if}
              {#if t.quality?.machineTranslated}
                <span class="text-[10px] uppercase tracking-wide text-blue-300">machine</span>
              {/if}
              {#if t.quality?.suspectedHallucination}
                <span class="text-[10px] uppercase tracking-wide text-orange-300 inline-flex items-center gap-0.5">
                  <AlertTriangle class="w-2.5 h-2.5" /> hallucination?
                </span>
              {/if}
              {#if t.quality?.parseOk === false}
                <span class="text-[10px] uppercase tracking-wide text-red-300">parse error</span>
              {/if}
              {#if t.wordCount}
                <span class="text-gray-500 ml-auto">{t.wordCount.toLocaleString()} words</span>
              {/if}
              {#if t.txtUrl}
                <a href={t.txtUrl} target="_blank" rel="noopener" class="text-purple-300 hover:text-purple-200 underline">.txt</a>
              {/if}
              {#if t.vttUrl}
                <a href={t.vttUrl} target="_blank" rel="noopener" class="text-purple-300 hover:text-purple-200 underline">.vtt</a>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {:else if report.transcript?.txtUrl}
      <div class="flex flex-wrap gap-2 text-xs">
        <a href={report.transcript.txtUrl} target="_blank" rel="noopener" class="text-purple-300 hover:text-purple-200 underline">
          Open transcript (text)
        </a>
        {#if report.transcript.vttUrl}
          <a href={report.transcript.vttUrl} target="_blank" rel="noopener" class="text-purple-300 hover:text-purple-200 underline">
            Open transcript (VTT)
          </a>
        {/if}
        {#if report.transcript.wordCount}
          <span class="text-gray-500">· {report.transcript.wordCount.toLocaleString()} words</span>
        {/if}
      </div>
    {/if}

    {#if report.thumbnails?.posterUrl || report.thumbnails?.vttUrl}
      <div class="text-xs text-gray-500 flex flex-wrap gap-2">
        {#if report.thumbnails.posterUrl}
          <a href={report.thumbnails.posterUrl} target="_blank" rel="noopener" class="text-purple-300 hover:text-purple-200 underline">auto-poster</a>
        {/if}
        {#if report.thumbnails.vttUrl}
          <a href={report.thumbnails.vttUrl} target="_blank" rel="noopener" class="text-purple-300 hover:text-purple-200 underline">scrubbing VTT</a>
        {/if}
        {#if report.thumbnails.spriteUrls && report.thumbnails.spriteUrls.length > 0}
          <span>· {report.thumbnails.spriteUrls.length} sprite sheet{report.thumbnails.spriteUrls.length === 1 ? '' : 's'}</span>
        {/if}
      </div>
    {/if}

  {/if}
</div>
