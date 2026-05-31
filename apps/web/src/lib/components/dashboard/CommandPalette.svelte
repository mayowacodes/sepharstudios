<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import * as Command from '$lib/components/ui/command';
  import { resetMode, setMode } from 'mode-watcher';
  import {
    Home, Upload, Video, BarChart3, ShieldCheck, User, FileText, Inbox, Wallet,
    Users, ShieldAlert, Banknote, Activity, MessageSquare, Sparkles, Sun, Moon, Monitor
  } from '@lucide/svelte';

  type Variant = 'creator' | 'admin';

  interface RecentItem {
    id: string;
    title: string;
  }

  interface Props {
    open: boolean;
    variant?: Variant;
  }

  let { open = $bindable(false), variant = 'creator' }: Props = $props();

  let recent = $state<RecentItem[]>([]);

  // Re-load recent items when the palette opens (cheap; bounded to 5 rows).
  $effect(() => {
    if (!open) return;
    void loadRecent();
  });

  async function loadRecent() {
    try {
      const url = variant === 'creator' ? '/api/creator/content?limit=5' : '/api/admin/content?limit=5';
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.content ?? data.items ?? []);
      recent = list.slice(0, 5).map((c: { id: string; title: string }) => ({ id: c.id, title: c.title }));
    } catch { /* best-effort */ }
  }

  function go(href: string) {
    open = false;
    goto(href);
  }

  function setTheme(mode: 'light' | 'dark' | 'system') {
    if (mode === 'system') resetMode();
    else setMode(mode);
    open = false;
  }

  const creatorNav = [
    { href: '/creator', label: 'Dashboard', icon: Home },
    { href: '/creator/upload', label: 'Upload content', icon: Upload },
    { href: '/creator/content', label: 'Content library', icon: Video },
    { href: '/creator/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/creator/earnings', label: 'Earnings', icon: Wallet },
    { href: '/creator/moderation', label: 'Moderation', icon: ShieldCheck },
    { href: '/creator/inbox', label: 'Inbox', icon: Inbox },
    { href: '/creator/profile', label: 'Profile', icon: User },
    { href: '/creator/guidelines', label: 'Guidelines', icon: FileText }
  ];

  const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/review', label: 'Review queue', icon: ShieldCheck },
    { href: '/admin/content', label: 'Content', icon: Video },
    { href: '/admin/creators', label: 'Creators', icon: Users },
    { href: '/admin/creator-applications', label: 'Applications', icon: FileText },
    { href: '/admin/abuse', label: 'Abuse queue', icon: ShieldAlert },
    { href: '/admin/refunds', label: 'Refunds', icon: Banknote },
    { href: '/admin/payouts', label: 'Payouts', icon: Wallet },
    { href: '/admin/system-health', label: 'System health', icon: Activity },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/communications', label: 'Communications', icon: MessageSquare }
  ];

  const nav = $derived(variant === 'creator' ? creatorNav : adminNav);
</script>

<Command.Dialog bind:open>
  <Command.Input placeholder="Search commands, content, navigation…" />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Group heading="Navigation">
      {#each nav as item (item.href)}
        <Command.Item onSelect={() => go(item.href)}>
          {@const I = item.icon}
          <I />
          <span>{item.label}</span>
        </Command.Item>
      {/each}
    </Command.Group>

    {#if recent.length > 0}
      <Command.Separator />
      <Command.Group heading="Recent content">
        {#each recent as r (r.id)}
          <Command.Item onSelect={() => go(variant === 'creator' ? `/creator/content/${r.id}` : `/admin/content`)}>
            <Sparkles />
            <span class="truncate">{r.title}</span>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}

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
  </Command.List>
</Command.Dialog>
