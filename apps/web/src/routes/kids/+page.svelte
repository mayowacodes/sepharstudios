<script lang="ts">
  // Landing page for /kids. The kids portal has two age bands (kiddies + teens)
  // mounted at `/kids/kiddies` and `/kids/teens`, but until now there was no
  // root page, so hitting `/kids` 404'd. This page is a simple chooser that
  // routes the visitor into the right band. It reuses the kids layout
  // (src/routes/kids/+layout.svelte) — header, footer, theme are inherited.
  import { Baby, Users, ArrowRight } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Kids · Sephar Studios</title>
  <meta name="description" content="Choose between Kiddies and Teens — safe, faith-aware viewing for every age." />
</svelte:head>

<main id="main-content" class="flex-1 flex items-center justify-center p-6">
  <div class="max-w-3xl w-full text-center space-y-8">
    <header class="space-y-3">
      <h1 class="text-4xl md:text-5xl font-extrabold text-primary">Welcome to Kids</h1>
      <p class="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
        Safe, faith-aware viewing for every age. Pick the experience that fits.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        href="/kids/kiddies"
        class="group bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3"
      >
        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Baby class="w-8 h-8 text-primary" />
        </div>
        <h2 class="text-2xl font-bold">Kiddies</h2>
        <p class="text-sm text-muted-foreground">
          Bright stories and gentle lessons for younger viewers.
        </p>
        <span class="inline-flex items-center text-primary font-medium gap-1 group-hover:gap-2 transition-all">
          Open Kiddies <ArrowRight class="w-4 h-4" />
        </span>
      </a>

      <a
        href="/kids/teens"
        class="group bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3"
      >
        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Users class="w-8 h-8 text-primary" />
        </div>
        <h2 class="text-2xl font-bold">Teens</h2>
        <p class="text-sm text-muted-foreground">
          Bigger questions, deeper stories — built for older kids.
        </p>
        <span class="inline-flex items-center text-primary font-medium gap-1 group-hover:gap-2 transition-all">
          Open Teens <ArrowRight class="w-4 h-4" />
        </span>
      </a>
    </div>
  </div>
</main>
