<script lang="ts">
  import { enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
  import * as Command from '$lib/components/ui/command';
  import { ChevronDown, Upload, X } from '@lucide/svelte';

  let { data, form } = $props();

  let isSubmitting = $state(false);
  let scriptFile = $state<File | null>(null);
  let budgetFile = $state<File | null>(null);
  let storyboardFile = $state<File | null>(null);
  let selectedGenre = $state('');
  let genrePopoverOpen = $state(false);

  const genres = [
    'Drama',
    'Documentary',
    'Educational',
    'Family',
    'Christian',
    'Historical',
    'Inspirational'
  ];

  // The legacy <Notifications> component used `export let` + global
  // dispatchEvent that didn't survive the Svelte 5 migration and was
  // 500ing this page on SSR. svelte-sonner toasts (used everywhere else
  // in the app) replace it cleanly.
  $effect(() => {
    if (!form) return;
    if (form.success) toast.success(form.message);
    else if (form.message) toast.error(form.message);
  });

  function selectGenre(genre: string) {
    selectedGenre = genre;
    genrePopoverOpen = false;
  }

  function pickFile(setter: (f: File | null) => void) {
    return (e: Event) => {
      const input = e.currentTarget as HTMLInputElement;
      setter(input.files?.[0] ?? null);
    };
  }

  function clearFile(setter: (f: File | null) => void, inputId: string) {
    setter(null);
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    if (el) el.value = '';
  }
</script>

<svelte:head>
  <title>Movie Production Sponsorship — Sephar Studios</title>
</svelte:head>

<div class="container mx-auto py-12 px-4">
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold">Movie Production Sponsorship</h1>
      <p class="text-xl text-muted-foreground">Partner with Sephar Studios to bring your Christian movie project to life</p>
    </div>

    <form
      method="POST"
      action="?/submit"
      class="space-y-8"
      enctype="multipart/form-data"
      use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => {
          isSubmitting = false;
          await update();
        };
      }}
    >
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Contact Information</h2>

        <div class="grid gap-4 md:grid-cols-2">
          {#if !data?.user}
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">Full Name</label>
              <Input id="name" name="name" required />
            </div>

            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email Address</label>
              <Input id="email" name="email" type="email" required />
            </div>
          {/if}
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Project Details</h2>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label for="title" class="text-sm font-medium">Project Title</label>
            <Input id="title" name="title" required />
          </div>

          <div class="space-y-2">
            <label for="genre" class="text-sm font-medium">Genre</label>
            <Popover bind:open={genrePopoverOpen}>
              <PopoverTrigger>
                <Button class="w-full justify-between" type="button">
                  {selectedGenre || 'Select genre'} <ChevronDown class="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-50 p-2">
                <Command.Root>
                  <Command.Input placeholder="Search genre..." />
                  <Command.List>
                    <Command.Empty>No genres found.</Command.Empty>
                    {#each genres as g (g)}
                      <Command.Item onSelect={() => selectGenre(g)}>{g}</Command.Item>
                    {/each}
                  </Command.List>
                </Command.Root>
              </PopoverContent>
            </Popover>
            <input type="hidden" name="genre" value={selectedGenre} required />
          </div>
        </div>

        <div class="space-y-2">
          <label for="synopsis" class="text-sm font-medium">Project Synopsis</label>
          <Textarea
            id="synopsis"
            name="synopsis"
            rows={4}
            required
            placeholder="Provide a brief overview of your project (40+ characters)..."
          />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Supporting Documents</h2>

        <div class="grid gap-6">
          <div class="space-y-2">
            <label for="script-input" class="text-sm font-medium">Script or Treatment</label>
            <div class="flex items-center gap-2">
              <Input id="script-input" type="file" name="script" accept=".pdf,.doc,.docx" required onchange={pickFile((f) => (scriptFile = f))} />
              {#if scriptFile}
                <div class="flex items-center gap-2 text-sm border rounded-md p-2">
                  <Upload class="w-4 h-4" />
                  <span class="truncate max-w-40">{scriptFile.name}</span>
                  <Button type="button" size="icon" variant="ghost" onclick={() => clearFile((f) => (scriptFile = f), 'script-input')}>
                    <X class="w-4 h-4" />
                  </Button>
                </div>
              {/if}
            </div>
          </div>

          <div class="space-y-2">
            <label for="budget-input" class="text-sm font-medium">Budget Breakdown</label>
            <div class="flex items-center gap-2">
              <Input id="budget-input" type="file" name="budget_breakdown" accept=".pdf,.xls,.xlsx" required onchange={pickFile((f) => (budgetFile = f))} />
              {#if budgetFile}
                <div class="flex items-center gap-2 text-sm border rounded-md p-2">
                  <Upload class="w-4 h-4" />
                  <span class="truncate max-w-40">{budgetFile.name}</span>
                  <Button type="button" size="icon" variant="ghost" onclick={() => clearFile((f) => (budgetFile = f), 'budget-input')}>
                    <X class="w-4 h-4" />
                  </Button>
                </div>
              {/if}
            </div>
          </div>

          <div class="space-y-2">
            <label for="storyboard-input" class="text-sm font-medium">Storyboard / Visual References</label>
            <div class="flex items-center gap-2">
              <Input id="storyboard-input" type="file" name="storyboard" accept=".pdf,.zip,.jpg,.png" onchange={pickFile((f) => (storyboardFile = f))} />
              {#if storyboardFile}
                <div class="flex items-center gap-2 text-sm border rounded-md p-2">
                  <Upload class="w-4 h-4" />
                  <span class="truncate max-w-40">{storyboardFile.name}</span>
                  <Button type="button" size="icon" variant="ghost" onclick={() => clearFile((f) => (storyboardFile = f), 'storyboard-input')}>
                    <X class="w-4 h-4" />
                  </Button>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <Button type="reset" variant="outline">Reset</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit Request'}
        </Button>
      </div>
    </form>
  </div>
</div>
