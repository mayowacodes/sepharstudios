<script lang="ts">
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Plus, User, Trash2 } from '@lucide/svelte';
  import { cn } from '$lib/utils';
  import { Label } from '$lib/components/ui/label';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from '$lib/components/ui/dialog';
  import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
  import { Input } from '$lib/components/ui/input';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  interface Profile {
    id: string;
    name: string;
    type: 'adult' | 'teen' | 'kids';
    avatarColor: string;
    avatarEmoji: string;
    isDefault: boolean;
    hasPin: boolean;
  }

  const PROFILE_TYPES = [
    { id: 'adult', label: 'Adult', description: 'Full access to all content' },
    { id: 'teen', label: 'Teen', description: 'Age-appropriate content for teenagers' },
    { id: 'kids', label: 'Kids', description: 'Child-friendly content only' }
  ];

  const AVATAR_COLORS = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'
  ];

  const AVATAR_EMOJIS = ['😊', '🦁', '🐺', '🦊', '🐻', '🦅', '🌟', '🎭'];

  let profiles = $state<Profile[]>(data.profiles as Profile[]);
  let loading = $state(false);
  let maxProfiles = $state(data.maxProfiles);
  let newName = $state('');
  let newType = $state<'adult' | 'teen' | 'kids'>('adult');
  let newColor = $state('bg-blue-500');
  let newEmoji = $state('😊');
  let creating = $state(false);
  let createError = $state('');
  let addDialogOpen = $state(false);

  async function createProfile() {
    if (!newName.trim()) { createError = 'Name is required'; return; }
    creating = true;
    createError = '';
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), type: newType, avatarColor: newColor, avatarEmoji: newEmoji })
      });
      const data = await res.json();
      if (!res.ok) {
        createError = data.error || 'Failed to create profile';
        return;
      }
      profiles = [...profiles, data];
      newName = '';
      newType = 'adult';
      newColor = 'bg-blue-500';
      newEmoji = '😊';
      addDialogOpen = false;
    } finally {
      creating = false;
    }
  }

  async function deleteProfile(id: string) {
    await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
    profiles = profiles.filter(p => p.id !== id);
  }

  function selectProfile(profile: Profile) {
    document.cookie = `activeProfileId=${profile.id}; path=/; max-age=86400`;
    window.location.href = '/dashboard';
  }
</script>

<div class="min-h-screen bg-linear-to-b from-background to-accent/10">
  <div class="container mx-auto px-4 py-16">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="mb-2 text-3xl font-bold">Who's Watching?</h1>
        <p class="text-muted-foreground">Choose a profile to start watching</p>
      </div>
      <div class="flex items-center gap-3">
        {#if maxProfiles > 2}
          <span class="text-xs text-muted-foreground">Family plan: {profiles.length}/{maxProfiles} profiles</span>
        {/if}
        <Button variant="outline" href="/parental-controls" size="sm">Parental Controls</Button>
      </div>
    </div>

    {#if loading}
      <div class="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
        {#each [1,2,3,4] as _}
          <div class="h-48 bg-white/5 rounded-xl animate-pulse"></div>
        {/each}
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
        {#each profiles as profile}
          <div class="relative group">
            <Card
              class="cursor-pointer transition-transform hover:scale-105"
              onclick={() => selectProfile(profile)}
            >
              <CardContent class="p-4 text-center">
                <div
                  class={cn(
                    'mx-auto h-32 w-32 rounded-lg',
                    profile.avatarColor,
                    'mb-4 flex items-center justify-center ring-primary group-hover:ring-4'
                  )}
                >
                  <span class="text-5xl">{profile.avatarEmoji || '👤'}</span>
                </div>
                <h3 class="text-lg font-medium">{profile.name}</h3>
                <p class="text-sm capitalize text-muted-foreground">{profile.type}</p>
                {#if profile.hasPin}
                  <p class="text-xs text-yellow-400 mt-1">PIN protected</p>
                {/if}
              </CardContent>
            </Card>

            {#if !profile.isDefault && profiles.length > 1}
              <button
                onclick={() => deleteProfile(profile.id)}
                class="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-red-600/80 p-1.5 rounded-full text-white"
                title="Delete profile"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            {/if}
          </div>
        {/each}

        {#if profiles.length < maxProfiles}
          <Dialog bind:open={addDialogOpen}>
            <DialogTrigger>
              <div class="cursor-pointer border-dashed transition-transform hover:scale-105 rounded-lg border-2 border-border bg-card text-card-foreground shadow-sm h-full min-h-48">
                <div class="flex h-full flex-col items-center justify-center p-4 text-center">
                  <div class="mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">
                    <Plus class="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 class="text-lg font-medium">Add Profile</h3>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Profile</DialogTitle>
                <DialogDescription>
                  Add a new profile for another person watching Sephar Studios
                </DialogDescription>
              </DialogHeader>
              <div class="space-y-6">
                <div class="space-y-2">
                  <Label for="pname">Profile Name</Label>
                  <Input id="pname" placeholder="Enter name" bind:value={newName} />
                </div>
                <div class="space-y-2">
                  <Label>Profile Type</Label>
                  <RadioGroup bind:value={newType}>
                    {#each PROFILE_TYPES as type}
                      <div class="flex items-center space-x-2">
                        <RadioGroupItem value={type.id} id={type.id} />
                        <Label for={type.id} class="flex-1">
                          <span class="font-medium">{type.label}</span>
                          <span class="text-sm text-muted-foreground block">{type.description}</span>
                        </Label>
                      </div>
                    {/each}
                  </RadioGroup>
                </div>
                <div class="space-y-2">
                  <Label>Avatar</Label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    {#each AVATAR_EMOJIS as emoji}
                      <button
                        type="button"
                        onclick={() => newEmoji = emoji}
                        class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl transition-all {newEmoji === emoji ? 'ring-4 ring-primary ring-offset-2 ring-offset-background' : ''}"
                      >{emoji}</button>
                    {/each}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    {#each AVATAR_COLORS as color}
                      <button
                        type="button"
                        aria-label={`Select ${color.replace('bg-', '').replace('-', ' ')} avatar color`}
                        onclick={() => newColor = color}
                        class={`w-8 h-8 rounded-full ${color} transition-all ${newColor === color ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : ''}`}
                      ></button>
                    {/each}
                  </div>
                </div>
                {#if createError}
                  <p class="text-sm text-red-400">{createError}</p>
                {/if}
                <DialogFooter>
                  <Button onclick={createProfile} disabled={creating}>
                    {creating ? 'Creating...' : 'Create Profile'}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        {:else}
          <div class="rounded-lg border-2 border-border bg-card/50 text-card-foreground opacity-60 min-h-48">
            <div class="flex h-full flex-col items-center justify-center p-4 text-center">
              <div class="mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">
                <User class="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 class="text-sm font-medium text-muted-foreground">Profile limit reached</h3>
              {#if maxProfiles <= 2}
                <p class="text-xs text-muted-foreground mt-1">Add Family add-on for up to 8</p>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
