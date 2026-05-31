<script lang="ts">
  /**
   * Tiny inline SVG sparkline — meant for KpiCard, not for full charts.
   * Auto-scales min/max from the data points; renders a smooth polyline with
   * an optional area gradient underneath.
   *
   * Lighter than pulling in layerchart for a 30-point line: zero deps,
   * inlines into the parent card with no layout shift.
   */

  interface Props {
    data: number[];
    stroke?: string;          // CSS color string (defaults to currentColor)
    fillGradient?: boolean;
    height?: number;
    width?: number;
    class?: string;
  }

  let {
    data,
    stroke,
    fillGradient = true,
    height = 32,
    width = 120,
    class: klass = ''
  }: Props = $props();

  const id = $derived(`spark-grad-${Math.abs(data.length * 37 + (data[0] ?? 0))}`);

  const path = $derived.by(() => {
    if (!data || data.length === 0) return { line: '', area: '' };
    if (data.length === 1) {
      const y = height / 2;
      return { line: `M0 ${y} L${width} ${y}`, area: '' };
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const points = data.map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return [x, y] as const;
    });
    const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
    const area = `${line} L${width} ${height} L0 ${height} Z`;
    return { line, area };
  });
</script>

<svg
  viewBox={`0 0 ${width} ${height}`}
  width="100%"
  height={height}
  preserveAspectRatio="none"
  class={klass}
  aria-hidden="true"
>
  {#if fillGradient}
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color={stroke ?? 'currentColor'} stop-opacity="0.35" />
        <stop offset="100%" stop-color={stroke ?? 'currentColor'} stop-opacity="0" />
      </linearGradient>
    </defs>
    {#if path.area}
      <path d={path.area} fill={`url(#${id})`} />
    {/if}
  {/if}
  {#if path.line}
    <path
      d={path.line}
      fill="none"
      stroke={stroke ?? 'currentColor'}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  {/if}
</svg>
