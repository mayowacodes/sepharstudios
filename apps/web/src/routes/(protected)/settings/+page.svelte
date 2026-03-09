<script lang="ts">
  import { onMount } from 'svelte';
  import { Bell, Mail, CreditCard, LogOut } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  interface NotificationPrefs {
    newReleases: boolean;
    trialExpiry: boolean;
    paymentConfirmation: boolean;
    weeklyDigest: boolean;
    creatorUpdates: boolean;
  }

  interface SubscriptionStatus {
    status: string;
    plan: string | null;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
    trialDaysLeft: number | null;
  }

  type PlanName = 'basic' | 'premium' | 'creator';

  let prefs = $state<NotificationPrefs | null>(null);
  let sub = $state<SubscriptionStatus | null>(null);
  let loading = $state(true);
  let saving = $state(false);
  let changingPlan = $state(false);
  let cancelling = $state(false);
  let cancelConfirm = $state(false);
  let selectedPlan = $state<PlanName>('basic');
  let successMsg = $state('');

  onMount(async () => {
    const [prefsRes, subRes] = await Promise.all([
      fetch('/api/notifications/preferences'),
      fetch('/api/subscriptions/status')
    ]);
    if (prefsRes.ok) prefs = await prefsRes.json();
    if (subRes.ok) {
      sub = await subRes.json();
      if (sub?.plan === 'basic' || sub?.plan === 'premium' || sub?.plan === 'creator') {
        selectedPlan = sub.plan;
      }
    }
    loading = false;
  });

  async function savePrefs() {
    if (!prefs) return;
    saving = true;
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      successMsg = 'Preferences saved';
      setTimeout(() => successMsg = '', 3000);
    } finally {
      saving = false;
    }
  }

  async function cancelSubscription() {
    cancelling = true;
    try {
      const res = await fetch('/api/subscriptions/cancel', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        sub = { ...sub!, status: 'cancelled' };
        successMsg = `Subscription cancelled. Access continues until ${new Date(data.accessUntil).toLocaleDateString()}.`;
        cancelConfirm = false;
        setTimeout(() => successMsg = '', 8000);
      }
    } finally {
      cancelling = false;
    }
  }

  async function changePlan() {
    if (!sub || selectedPlan === sub.plan) return;
    changingPlan = true;
    try {
      const res = await fetch('/api/subscriptions/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        successMsg = data.error ?? 'Unable to change plan right now.';
        setTimeout(() => successMsg = '', 5000);
        return;
      }

      sub = { ...sub, plan: selectedPlan };
      successMsg = `Plan changed to ${selectedPlan}. Change will apply on your next billing cycle.`;
      setTimeout(() => successMsg = '', 6000);
    } finally {
      changingPlan = false;
    }
  }

  function toggle(key: keyof NotificationPrefs) {
    if (!prefs) return;
    prefs = { ...prefs, [key]: !prefs[key] };
  }

  const PREF_LABELS: Record<keyof NotificationPrefs, string> = {
    newReleases: 'New content releases',
    trialExpiry: 'Trial expiry reminders',
    paymentConfirmation: 'Payment confirmations',
    weeklyDigest: 'Weekly content digest',
    creatorUpdates: 'Creator you follow updates'
  };
</script>

<svelte:head>
  <title>Settings - Sephar Studios</title>
</svelte:head>

<div class="min-h-screen bg-background px-4 py-10">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-8">Settings</h1>

    {#if successMsg}
      <div class="mb-6 bg-green-600/10 border border-green-600/20 text-green-400 rounded-lg px-4 py-3 text-sm">{successMsg}</div>
    {/if}

    {#if loading}
      <div class="space-y-4">
        {#each [1,2,3] as _}
          <div class="h-16 bg-white/5 rounded-xl animate-pulse"></div>
        {/each}
      </div>
    {:else}
      <!-- Subscription section -->
      {#if sub}
        <div class="bg-card border border-border rounded-xl p-5 mb-6">
          <div class="flex items-center gap-3 mb-4">
            <CreditCard class="w-5 h-5 text-muted-foreground" />
            <h2 class="font-semibold">Subscription</h2>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Plan</span>
              <span class="capitalize font-medium">{sub.plan ?? 'None'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Status</span>
              <span class="capitalize font-medium {sub.status === 'trial' ? 'text-green-400' : sub.status === 'active' ? 'text-blue-400' : 'text-red-400'}">
                {sub.status}
                {#if sub.trialDaysLeft !== null && sub.trialDaysLeft > 0}
                  ({sub.trialDaysLeft} days left)
                {/if}
              </span>
            </div>
            {#if sub.currentPeriodEnd}
              <div class="flex justify-between">
                <span class="text-muted-foreground">Next billing</span>
                <span>{new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>
              </div>
            {/if}
          </div>

          {#if sub.status === 'active' || sub.status === 'trial'}
            <div class="mt-4 pt-4 border-t border-border space-y-3">
              <div class="flex items-center gap-2">
                <label for="plan-select" class="text-xs text-muted-foreground">Change plan</label>
                <select
                  id="plan-select"
                  bind:value={selectedPlan}
                  class="h-8 rounded-md border border-border bg-background px-2 text-sm capitalize"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="creator">Creator</option>
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={changingPlan || selectedPlan === sub.plan}
                  onclick={changePlan}
                >
                  {changingPlan ? 'Updating...' : 'Update Plan'}
                </Button>
              </div>

              <div class="flex items-center justify-between gap-4">
              {#if cancelConfirm}
                <div class="flex items-center gap-2">
                  <span class="text-xs text-muted-foreground">Are you sure?</span>
                  <Button size="sm" variant="destructive" onclick={cancelSubscription} disabled={cancelling}>
                    {cancelling ? 'Cancelling...' : 'Yes, cancel'}
                  </Button>
                  <Button size="sm" variant="outline" onclick={() => cancelConfirm = false}>No</Button>
                </div>
              {:else}
                <button
                  onclick={() => cancelConfirm = true}
                  class="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                >
                  Cancel subscription
                </button>
              {/if}
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Notification preferences -->
      {#if prefs}
        <div class="bg-card border border-border rounded-xl p-5 mb-6">
          <div class="flex items-center gap-3 mb-4">
            <Bell class="w-5 h-5 text-muted-foreground" />
            <h2 class="font-semibold">Email Notifications</h2>
          </div>
          <div class="space-y-3">
            {#each Object.keys(prefs) as key}
              {@const k = key as keyof NotificationPrefs}
              <div class="flex items-center justify-between">
                <span class="text-sm">{PREF_LABELS[k]}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs[k]}
                  aria-label={prefs[k] ? `Disable ${PREF_LABELS[k]}` : `Enable ${PREF_LABELS[k]}`}
                  onclick={() => toggle(k)}
                  class="relative w-11 h-6 rounded-full transition-colors {prefs[k] ? 'bg-primary' : 'bg-muted'}"
                >
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform {prefs[k] ? 'translate-x-5' : ''}"></span>
                </button>
              </div>
            {/each}
          </div>
          <Button size="sm" onclick={savePrefs} disabled={saving} class="mt-4">
            {saving ? 'Saving...' : 'Save preferences'}
          </Button>
        </div>
      {/if}

      <!-- Account links -->
      <div class="bg-card border border-border rounded-xl p-5 space-y-3">
        <a href="/profile" class="flex items-center gap-3 text-sm hover:text-primary transition-colors py-1">
          <Mail class="w-4 h-4 text-muted-foreground" />
          Account & Profile
        </a>
        <a href="/parental-controls" class="flex items-center gap-3 text-sm hover:text-primary transition-colors py-1">
          <Bell class="w-4 h-4 text-muted-foreground" />
          Parental Controls
        </a>
        <form method="POST" action="/api/auth/sign-out">
          <button type="submit" class="flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-colors py-1 w-full text-left">
            <LogOut class="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    {/if}
  </div>
</div>
