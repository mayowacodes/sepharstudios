<script lang="ts">
  import { onMount } from 'svelte';
  import { Shield, Lock, Eye, FileText } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  interface Profile {
    id: string;
    name: string;
    type: 'adult' | 'teen' | 'kids';
    avatarColor: string;
    avatarEmoji: string;
    hasPin: boolean;
    contentRating: string;
    safeModeEnabled: boolean;
  }

  let profiles = $state<Profile[]>([]);
  let loading = $state(true);
  let selectedProfileId = $state<string | null>(null);
  let pinAction = $state<'set' | 'remove' | null>(null);
  let pinInput = $state('');
  let confirmPin = $state('');
  let pinError = $state('');
  let saving = $state(false);
  let successMsg = $state('');

  const CONTENT_RATINGS = [
    { value: 'G', label: 'G — General audiences' },
    { value: 'PG', label: 'PG — Parental guidance' },
    { value: 'PG13', label: 'PG-13 — Parents strongly cautioned' },
    { value: 'R', label: 'R — Restricted' },
    { value: 'all', label: 'All content' }
  ];

  onMount(async () => {
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) profiles = await res.json();
    } finally {
      loading = false;
    }
  });

  const selected = $derived(profiles.find(p => p.id === selectedProfileId));

  async function savePin() {
    if (pinInput.length < 4) { pinError = 'PIN must be at least 4 digits'; return; }
    if (pinAction === 'set' && pinInput !== confirmPin) { pinError = 'PINs do not match'; return; }
    saving = true;
    pinError = '';
    try {
      const res = await fetch(`/api/profiles/${selectedProfileId}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: pinAction === 'set' ? 'set' : 'remove', pin: pinInput })
      });
      if (res.ok) {
        profiles = profiles.map(p =>
          p.id === selectedProfileId ? { ...p, hasPin: pinAction === 'set' } : p
        );
        successMsg = pinAction === 'set' ? 'PIN set successfully' : 'PIN removed';
        pinAction = null;
        pinInput = '';
        confirmPin = '';
        setTimeout(() => successMsg = '', 3000);
      } else {
        const d = await res.json();
        pinError = d.error || 'Failed to update PIN';
      }
    } finally {
      saving = false;
    }
  }

  async function updateSetting(profileId: string, field: 'contentRating' | 'safeModeEnabled', value: string | boolean) {
    const res = await fetch(`/api/profiles/${profileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    });
    if (res.ok) {
      profiles = profiles.map(p => p.id === profileId ? { ...p, [field]: value } : p);
    }
  }
</script>

<svelte:head>
  <title>Parental Controls - Sephar Studios</title>
</svelte:head>

<div class="min-h-screen bg-background px-4 py-10">
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center gap-3 mb-2">
      <Shield class="w-6 h-6 text-green-400" />
      <h1 class="text-2xl font-bold">Parental Controls</h1>
    </div>
    <p class="text-muted-foreground text-sm mb-8">Set PIN locks and content restrictions per profile.</p>

    {#if loading}
      <div class="space-y-3">
        {#each [1,2,3] as _}
          <div class="h-16 bg-white/5 rounded-xl animate-pulse"></div>
        {/each}
      </div>
    {:else}
      <!-- Profile selector -->
      <div class="flex flex-wrap gap-3 mb-8">
        {#each profiles as profile}
          <button
            onclick={() => { selectedProfileId = profile.id; pinAction = null; pinInput = ''; confirmPin = ''; }}
            class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all {selectedProfileId === profile.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-muted-foreground/40'}"
          >
            <div class="w-7 h-7 rounded-full {profile.avatarColor} flex items-center justify-center text-sm">
              {profile.avatarEmoji || '👤'}
            </div>
            <span class="text-sm font-medium">{profile.name}</span>
            <span class="text-xs text-muted-foreground capitalize">({profile.type})</span>
          </button>
        {/each}
      </div>

      {#if successMsg}
        <div class="mb-4 bg-green-600/10 border border-green-600/20 text-green-400 rounded-lg px-4 py-3 text-sm">{successMsg}</div>
      {/if}

      {#if selected}
        <div class="space-y-4">
          <!-- PIN management -->
          <div class="bg-card border border-border rounded-xl p-5">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <Lock class="w-5 h-5 text-muted-foreground" />
                <div>
                  <p class="font-semibold text-sm">Profile PIN</p>
                  <p class="text-xs text-muted-foreground">
                    {selected.hasPin ? 'PIN is active — required to switch to this profile from Kids mode' : 'No PIN set'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onclick={() => { pinAction = selected.hasPin ? 'remove' : 'set'; pinInput = ''; confirmPin = ''; pinError = ''; }}
              >
                {selected.hasPin ? 'Remove PIN' : 'Set PIN'}
              </Button>
            </div>
            {#if pinAction}
              <div class="mt-4 space-y-3 border-t border-border pt-4">
                <input
                  type="password"
                  inputmode="numeric"
                  maxlength="8"
                  bind:value={pinInput}
                  placeholder={pinAction === 'set' ? 'Enter new PIN' : 'Enter current PIN to confirm removal'}
                  class="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {#if pinAction === 'set'}
                  <input
                    type="password"
                    inputmode="numeric"
                    maxlength="8"
                    bind:value={confirmPin}
                    placeholder="Confirm PIN"
                    class="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                {/if}
                {#if pinError}<p class="text-xs text-red-400">{pinError}</p>{/if}
                <div class="flex gap-2">
                  <Button size="sm" onclick={savePin} disabled={saving}>
                    {saving ? 'Saving...' : 'Confirm'}
                  </Button>
                  <Button size="sm" variant="outline" onclick={() => { pinAction = null; pinInput = ''; confirmPin = ''; }}>
                    Cancel
                  </Button>
                </div>
              </div>
            {/if}
          </div>

          <!-- Content rating -->
          <div class="bg-card border border-border rounded-xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <Eye class="w-5 h-5 text-muted-foreground" />
              <div>
                <p class="font-semibold text-sm">Content Rating Limit</p>
                <p class="text-xs text-muted-foreground">Block content above this rating for this profile</p>
              </div>
            </div>
            <div class="space-y-2">
              {#each CONTENT_RATINGS as rating}
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contentRating"
                    value={rating.value}
                    checked={selected.contentRating === rating.value}
                    onchange={() => updateSetting(selected.id, 'contentRating', rating.value)}
                    class="accent-primary"
                  />
                  <span class="text-sm">{rating.label}</span>
                </label>
              {/each}
            </div>
          </div>

          <!-- Safe mode -->
          <div class="bg-card border border-border rounded-xl p-5">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <Shield class="w-5 h-5 text-muted-foreground" />
                <div>
                  <p class="font-semibold text-sm">Safe Exploration Mode</p>
                  <p class="text-xs text-muted-foreground">Limits browsing to kids/family sections only</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={selected.safeModeEnabled}
                aria-label={selected.safeModeEnabled ? `Disable safe mode for ${selected.name}` : `Enable safe mode for ${selected.name}`}
                onclick={() => updateSetting(selected.id, 'safeModeEnabled', !selected.safeModeEnabled)}
                class="relative w-11 h-6 rounded-full transition-colors {selected.safeModeEnabled ? 'bg-primary' : 'bg-muted'}"
              >
                <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform {selected.safeModeEnabled ? 'translate-x-5' : ''}"></span>
              </button>
            </div>
          </div>

          <!-- Viewing report link -->
          <div class="bg-card border border-border rounded-xl p-5">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <FileText class="w-5 h-5 text-muted-foreground" />
                <div>
                  <p class="font-semibold text-sm">Viewing Report</p>
                  <p class="text-xs text-muted-foreground">See what {selected.name} has been watching</p>
                </div>
              </div>
              <Button size="sm" variant="outline" href="/api/parental/report?profileId={selected.id}" target="_blank">
                View Report
              </Button>
            </div>
          </div>
        </div>
      {:else}
        <p class="text-muted-foreground text-sm">Select a profile above to manage its controls.</p>
      {/if}
    {/if}
  </div>
</div>
