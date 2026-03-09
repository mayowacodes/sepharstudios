<script lang="ts">
  import { enhance } from '$app/forms';
  import Notifications from '$lib/components/Notifications.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
  import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from '$lib/components/ui/command';
  import { ChevronDown } from '@lucide/svelte';
  import FileUpload from '$lib/components/FileUpload.svelte';

  export let data;
  export let form;

  let isSubmitting = false;
  let files: {
  script: File | null;
  budget_breakdown: File | null;
  storyboard: File | null;
} = {
  script: null,
  budget_breakdown: null,
  storyboard: null
};

  let selectedGenre: string = "";
  const genres = [
    'Drama',
    'Documentary',
    'Educational',
    'Family',
    'Christian',
    'Historical',
    'Inspirational'
  ];

  function selectGenre(genre: string) {
    selectedGenre = genre;
  }
</script>

<div class="container mx-auto py-12 px-4">
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold">Movie Production Sponsorship</h1>
      <p class="text-xl text-muted-foreground">Partner with Sephar Studios to bring your Christian movie project to life</p>
    </div>

    {#if form}
      <Notifications type={form.success ? 'success' : 'error'} message={form.message} />
    {/if}

    <form method="POST" action="?/submit" class="space-y-8" use:enhance={() => { isSubmitting = true; return async ({ result, update }) => { isSubmitting = false; await update(); }; }} enctype="multipart/form-data">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Contact Information</h2>

        <div class="grid gap-4 md:grid-cols-2">
          {#if !data?.session}
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
            <Popover>
              <PopoverTrigger>
                <Button class="w-full justify-between">
                  {selectedGenre || "Select genre"} <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-[200px] p-2">
                <Command>
                  <CommandInput placeholder="Search genre..." />
                  <CommandList>
                    <CommandEmpty>No genres found.</CommandEmpty>
                    {#each genres as genre}
                      <CommandItem onclick={() => selectGenre(genre)}>
                        {genre}
                      </CommandItem>
                    {/each}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <input type="hidden" name="genre" value={selectedGenre} required />
          </div>
        </div>

        <div class="space-y-2">
          <label for="synopsis" class="text-sm font-medium">Project Synopsis</label>
          <Textarea id="synopsis" name="synopsis" rows={4} required placeholder="Provide a brief overview of your project..." />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Supporting Documents</h2>

        <div class="grid gap-6">
          <FileUpload label="Script or Treatment" name="script" accept=".pdf,.doc,.docx"
           bind:file={files.script} on:change={(e: CustomEvent<{ file: File | null }>) => files.script = e.detail.file} required />

          <FileUpload label="Budget Breakdown" name="budget_breakdown" accept=".pdf,.xls,.xlsx"
           bind:file={files.budget_breakdown} on:change={(e: CustomEvent<{ file: File | null }>) => files.budget_breakdown = e.detail.file} required />

          <FileUpload label="Storyboard/Visual References" name="storyboard" accept=".pdf,.zip,.jpg,.png"
           bind:file={files.storyboard} on:change={(e: CustomEvent<{ file: File | null }>) => files.storyboard = e.detail.file} />
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <Button type="reset" variant="outline">Reset</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
      </div>
    </form>
  </div>
</div>
