<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Command from '$lib/components/ui/command';
  import { Sparkles, Zap, Compass, Sun, Moon, Monitor } from '@lucide/svelte';
  import { resetMode, setMode } from 'mode-watcher';
  import { ADMIN_NAV, CREATOR_NAV } from './portal-nav';
  import { openSlideOver } from './slide-over-store';
  import { queueCopilotQuery } from './copilot-rail-store';
  import ApproveNextReviewPanel from './panels/ApproveNextReviewPanel.svelte';
  import IssueRefundPanel from './panels/IssueRefundPanel.svelte';
  import SendCreatorNotePanel from './panels/SendCreatorNotePanel.svelte';
  import ReplyToThreadPanel from './panels/ReplyToThreadPanel.svelte';

  /**
   * Hybrid command palette — three semantic sections (Actions, Navigate,
   * Ask Copilot) with verb-aware ranking. Replaces the legacy
   * CommandPalette.svelte for portal use.
   *
   * - Verb-shaped queries ("approve…", "refund…") rank ACTIONS first
   * - Noun-shaped queries ("payouts", "review") rank NAVIGATE first
   * - Free-form questions ("how many…", "why does…") show the Ask Copilot
   *   row, which hands the query off to the persistent Copilot rail
   */

  interface Props {
    open: boolean;
    variant: 'admin' | 'creator';
    /** Called by the shell when the user wants the Copilot rail opened. */
    onAskCopilot?: () => void;
  }

  let { open = $bindable(false), variant, onAskCopilot }: Props = $props();

  let query = $state('');

  // Whenever the dialog closes, reset the query so the next open starts fresh.
  $effect(() => {
    if (!open) query = '';
  });

  const navGroups = $derived(variant === 'admin' ? ADMIN_NAV : CREATOR_NAV);
  const flatNav = $derived(navGroups.flatMap((g) => g.items));

  interface ActionDef {
    id: string;
    label: string;
    verbs: string[];
    perform: () => void;
    portals: Array<'admin' | 'creator'>;
  }

  const ACTIONS: ActionDef[] = [
    {
      id: 'approve-next-review',
      label: 'Approve next pending review',
      verbs: ['approve', 'review', 'next'],
      portals: ['admin'],
      perform: () => {
        openSlideOver({
          id: 'approve-next-review',
          title: 'Approve next',
          component: ApproveNextReviewPanel
        });
      }
    },
    {
      id: 'issue-refund',
      label: 'Issue refund…',
      verbs: ['refund', 'issue', 'return'],
      portals: ['admin'],
      perform: () => {
        openSlideOver({
          id: 'issue-refund',
          title: 'Issue refund',
          component: IssueRefundPanel
        });
      }
    },
    {
      id: 'send-creator-note',
      label: 'Send creator note…',
      verbs: ['note', 'message', 'send', 'write'],
      portals: ['admin'],
      perform: () => {
        openSlideOver({
          id: 'send-creator-note',
          title: 'Send creator note',
          component: SendCreatorNotePanel
        });
      }
    },
    {
      id: 'open-refunds',
      label: 'Open refunds queue',
      verbs: ['refunds', 'queue'],
      portals: ['admin'],
      perform: () => { goto('/admin/refunds'); }
    },
    {
      id: 'open-creator-applications',
      label: 'Open creator applications',
      verbs: ['application', 'creator', 'approve'],
      portals: ['admin'],
      perform: () => { goto('/admin/creator-applications'); }
    },
    {
      id: 'upload-content',
      label: 'Upload new content',
      verbs: ['upload', 'create', 'new'],
      portals: ['creator'],
      perform: () => { goto('/creator/upload'); }
    },
    {
      id: 'reply-to-thread',
      label: 'Reply to latest admin thread…',
      verbs: ['reply', 'thread', 'admin', 'respond'],
      portals: ['creator'],
      perform: () => {
        openSlideOver({
          id: 'reply-to-thread',
          title: 'Reply to thread',
          component: ReplyToThreadPanel
        });
      }
    },
    {
      id: 'open-inbox',
      label: 'Open inbox',
      verbs: ['inbox', 'messages'],
      portals: ['creator'],
      perform: () => { goto('/creator/inbox'); }
    }
  ];

  const visibleActions = $derived(ACTIONS.filter((a) => a.portals.includes(variant)));

  function tokens(s: string): string[] {
    return s.toLowerCase().split(/\s+/).filter(Boolean);
  }

  function scoreAction(a: ActionDef, q: string): number {
    if (!q.trim()) return 0;
    const qt = tokens(q);
    const text = (a.label + ' ' + a.verbs.join(' ')).toLowerCase();
    let score = 0;
    for (const t of qt) {
      if (text.includes(t)) score += 1;
      if (a.verbs.some((v) => v.startsWith(t))) score += 2; // verb-first bonus
    }
    return score;
  }

  function scoreNav(item: { label: string; href: string }, q: string): number {
    if (!q.trim()) return 0;
    const qt = tokens(q);
    const text = (item.label + ' ' + item.href).toLowerCase();
    let score = 0;
    for (const t of qt) {
      if (text.includes(t)) score += 1;
    }
    return score;
  }

  const isQuestion = $derived(
    /[?]$/.test(query.trim()) ||
    /^(how|what|why|when|who|which|can|does|is|are|will|should)\b/i.test(query.trim())
  );

  const rankedActions = $derived.by(() => {
    if (!query.trim()) return visibleActions;
    return visibleActions
      .map((a) => ({ a, score: scoreAction(a, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.a);
  });

  const rankedNav = $derived.by(() => {
    if (!query.trim()) return flatNav;
    return flatNav
      .map((item) => ({ item, score: scoreNav(item, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  });

  function runAction(a: ActionDef) {
    open = false;
    a.perform();
  }

  function go(href: string) {
    open = false;
    goto(href);
  }

  function askCopilot() {
    const q = query.trim();
    if (!q) return;
    queueCopilotQuery(q);
    open = false;
    onAskCopilot?.();
  }

  function setTheme(mode: 'light' | 'dark' | 'system') {
    if (mode === 'system') resetMode();
    else setMode(mode);
    open = false;
  }
</script>

<Command.Dialog bind:open shouldFilter={false}>
  <Command.Input bind:value={query} placeholder="Type a command, page, or question…" />
  <Command.List>
    {#if rankedActions.length === 0 && rankedNav.length === 0 && !isQuestion}
      <Command.Empty>No results. Press Enter to ask the Copilot.</Command.Empty>
    {/if}

    {#if rankedActions.length > 0}
      <Command.Group heading="Actions">
        {#each rankedActions as a (a.id)}
          <Command.Item onSelect={() => runAction(a)}>
            <Zap />
            <span>{a.label}</span>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}

    {#if rankedNav.length > 0}
      {#if rankedActions.length > 0}<Command.Separator />{/if}
      <Command.Group heading="Navigate">
        {#each rankedNav.slice(0, 8) as item (item.href)}
          {@const I = item.icon}
          <Command.Item onSelect={() => go(item.href)}>
            <I />
            <span>{item.label}</span>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}

    {#if query.trim() && (isQuestion || (rankedActions.length === 0 && rankedNav.length === 0))}
      <Command.Separator />
      <Command.Group heading="Ask Copilot">
        <Command.Item onSelect={askCopilot}>
          <Sparkles />
          <span class="truncate">"{query.trim()}"</span>
        </Command.Item>
      </Command.Group>
    {/if}

    {#if !query.trim()}
      <Command.Separator />
      <Command.Group heading="Theme">
        <Command.Item onSelect={() => setTheme('light')}>
          <Sun /><span>Light mode</span>
        </Command.Item>
        <Command.Item onSelect={() => setTheme('dark')}>
          <Moon /><span>Dark mode</span>
        </Command.Item>
        <Command.Item onSelect={() => setTheme('system')}>
          <Monitor /><span>System mode</span>
        </Command.Item>
      </Command.Group>
    {/if}

    {#if !query.trim()}
      <Command.Separator />
      <Command.Group heading="Tip">
        <Command.Item disabled>
          <Compass />
          <span class="text-xs">Type a question to ask the Copilot · ⌘J toggles rail · ⌘B toggles sidebar</span>
        </Command.Item>
      </Command.Group>
    {/if}
  </Command.List>
</Command.Dialog>
