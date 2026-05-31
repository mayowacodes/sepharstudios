<script lang="ts">
  /**
   * Small inline metric chip — used in page headers to surface a quick
   * count beside the title (e.g. "23 urgent" / "12 pending").
   *
   * Distinct from KpiCard (full card) — this is a one-liner pill that
   * lives next to a title or above a section.
   */

  type Tone = 'default' | 'red' | 'yellow' | 'green' | 'blue' | 'purple';

  interface Props {
    label: string;
    value: string | number;
    tone?: Tone;
  }

  let { label, value, tone = 'default' }: Props = $props();

  const TONES: Record<Tone, string> = {
    default: 'bg-muted text-muted-foreground',
    red:     'bg-red-500/15 text-red-600 dark:text-red-300',
    yellow:  'bg-yellow-500/15 text-yellow-600 dark:text-yellow-300',
    green:   'bg-green-500/15 text-green-600 dark:text-green-300',
    blue:    'bg-blue-500/15 text-blue-600 dark:text-blue-300',
    purple:  'bg-purple-500/15 text-purple-600 dark:text-purple-300'
  };

  const cls = $derived(TONES[tone]);
</script>

<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium {cls}">
  <span class="font-semibold tabular-nums">{value}</span>
  <span class="opacity-80">{label}</span>
</span>
