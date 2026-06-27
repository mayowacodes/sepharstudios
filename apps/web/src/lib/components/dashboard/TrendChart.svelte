<script lang="ts">
  /**
   * Lightweight area chart for dashboard analytics. Inline SVG, no chart-lib
   * dependency — same approach as Sparkline, scaled up with axis labels +
   * hover tooltip. For richer charts (multi-series, axes legends, brushing),
   * use layerchart directly via the `chart-*` primitives.
   */

  interface Point {
    date: string | Date;
    value: number;
  }

  type Accent = 'portal' | 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'gray';

  interface Props {
    data: Point[];
    label: string;
    accent?: Accent;
    height?: number;
    formatValue?: (v: number) => string;
  }

  let {
    data,
    label,
    accent = 'portal',
    height = 220,
    formatValue = (v) => v.toLocaleString()
  }: Props = $props();

  // Default 'portal' pulls from the `--portal-accent` CSS variable so
  // the chart matches whichever portal palette is in scope (teal for
  // admin, cyan for creator). Explicit named accents stay supported
  // for one-off callers that need a specific tone (e.g. red for
  // failure trends).
  const ACCENT: Record<Accent, string> = {
    portal: 'hsl(var(--portal-accent, 175 60% 48%))',
    purple: 'rgb(168 85 247)',
    blue:   'rgb(59 130 246)',
    green:  'rgb(34 197 94)',
    yellow: 'rgb(234 179 8)',
    red:    'rgb(239 68 68)',
    orange: 'rgb(249 115 22)',
    gray:   'rgb(156 163 175)'
  };
  const color = $derived(ACCENT[accent]);

  // Inner width is responsive via viewBox; height is fixed per prop.
  const W = 600;
  const H = 200;
  const PAD = { top: 12, right: 12, bottom: 28, left: 40 };

  const parsed = $derived(data.map((p) => ({
    date: p.date instanceof Date ? p.date : new Date(p.date),
    value: Number(p.value) || 0
  })));

  const scales = $derived.by(() => {
    if (parsed.length === 0) return null;
    const values = parsed.map((p) => p.value);
    const min = Math.min(0, ...values);
    const max = Math.max(...values, 1);
    const xStep = (W - PAD.left - PAD.right) / Math.max(1, parsed.length - 1);
    return { min, max, xStep };
  });

  const linePath = $derived.by(() => {
    if (!scales) return { line: '', area: '' };
    const { min, max, xStep } = scales;
    const range = max - min || 1;
    const pts = parsed.map((p, i) => {
      const x = PAD.left + i * xStep;
      const y = PAD.top + (1 - (p.value - min) / range) * (H - PAD.top - PAD.bottom);
      return [x, y] as const;
    });
    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
    const area = `${line} L${pts[pts.length - 1][0]} ${H - PAD.bottom} L${pts[0][0]} ${H - PAD.bottom} Z`;
    return { line, area };
  });

  // Hover tooltip — closest-x point.
  let hoverIndex = $state<number | null>(null);
  let svgRef = $state<SVGSVGElement | null>(null);

  function onMove(e: PointerEvent) {
    if (!svgRef || !scales || parsed.length === 0) return;
    const rect = svgRef.getBoundingClientRect();
    const xInSvg = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round((xInSvg - PAD.left) / scales.xStep);
    hoverIndex = Math.max(0, Math.min(parsed.length - 1, i));
  }
  function onLeave() { hoverIndex = null; }

  function tickValues(): number[] {
    if (!scales) return [];
    return [scales.min, (scales.min + scales.max) / 2, scales.max];
  }

  function fmtDate(d: Date): string {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
</script>

<div
  class="rounded-xl p-5 border"
  style="background: hsl(var(--portal-bg-elevated, 222 22% 11%)/0.55); border-color: hsl(var(--portal-border, 215 14% 27%)); backdrop-filter: blur(8px);"
>
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-sm font-medium" style="color: hsl(var(--portal-text, 210 30% 92%));">{label}</h3>
    {#if hoverIndex !== null && parsed[hoverIndex]}
      <div class="text-xs" style="color: hsl(var(--portal-text-muted, 210 15% 60%));">
        <span class="font-medium tabular-nums" style="color: hsl(var(--portal-text, 210 30% 92%));">{formatValue(parsed[hoverIndex].value)}</span>
        <span class="ml-2">{fmtDate(parsed[hoverIndex].date)}</span>
      </div>
    {/if}
  </div>

  {#if parsed.length === 0}
    <div class="text-sm py-10 text-center" style="height: {height}px; color: hsl(var(--portal-text-muted, 210 15% 60%));">No data yet.</div>
  {:else}
    <svg
      bind:this={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      onpointermove={onMove}
      onpointerleave={onLeave}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`trend-grad-${accent}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={color} stop-opacity="0.4" />
          <stop offset="100%" stop-color={color} stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Y-axis gridlines + tick labels -->
      {#each tickValues() as t, i}
        {@const y = PAD.top + (i / (tickValues().length - 1)) * (H - PAD.top - PAD.bottom)}
        <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" stroke-width="1" />
        <text x={PAD.left - 6} y={y + 3} text-anchor="end" fill="hsl(var(--portal-text-muted, 210 15% 60%))" font-size="10">
          {formatValue(tickValues()[tickValues().length - 1 - i])}
        </text>
      {/each}

      <!-- Area + line -->
      {#if linePath.area}
        <path d={linePath.area} fill={`url(#trend-grad-${accent})`} />
      {/if}
      {#if linePath.line}
        <path
          d={linePath.line}
          fill="none"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {/if}

      <!-- Hover marker -->
      {#if hoverIndex !== null && scales && parsed[hoverIndex]}
        {@const x = PAD.left + hoverIndex * scales.xStep}
        {@const range = (scales.max - scales.min) || 1}
        {@const y = PAD.top + (1 - (parsed[hoverIndex].value - scales.min) / range) * (H - PAD.top - PAD.bottom)}
        <line x1={x} x2={x} y1={PAD.top} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.25)" stroke-dasharray="3 3" />
        <circle cx={x} cy={y} r="4" fill={color} stroke="white" stroke-width="1.5" />
      {/if}

      <!-- X-axis label (first / mid / last) -->
      {#if parsed.length > 0}
        {@const ticks = [0, Math.floor(parsed.length / 2), parsed.length - 1]}
        {#each ticks as ti}
          {@const x = PAD.left + ti * (scales?.xStep ?? 0)}
          <text x={x} y={H - PAD.bottom + 16} text-anchor="middle" fill="hsl(var(--portal-text-muted, 210 15% 60%))" font-size="10">
            {fmtDate(parsed[ti].date)}
          </text>
        {/each}
      {/if}
    </svg>
  {/if}
</div>
