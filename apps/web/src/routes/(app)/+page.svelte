<script lang="ts">
	import { PlayCircle, Film, Crown, Users } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { page } from "$app/state";

  const user = $derived(page.data.user);
</script>

<main class="container pt-32 pb-16 mx-auto px-4">
  <section class="text-center space-y-6 pb-24">
    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight">
      Faith-Based Entertainment
      <br />
      For The Whole Family
    </h1>
    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
      Stream thousands of faith-inspiring movies, shows, and documentaries. Start your free trial today.
    </p>
    <div class="flex justify-center gap-4">
      {#if user}
        <Button size="lg" href="/dashboard" class="bg-primary hover:bg-primary/90">
          <PlayCircle class="mr-2 h-5 w-5" />
          Continue Watching
        </Button>
      {:else}
        <Button size="lg" href="/auth/login" class="bg-primary hover:bg-primary/90">
          <PlayCircle class="mr-2 h-5 w-5" />
          Start Watching
        </Button>
      {/if}
      <Button size="lg" variant="outline" href="/about">Learn More</Button>
    </div>
  </section>

  <section class="grid md:grid-cols-3 gap-8 pb-24">
    <div class="space-y-4 text-center">
      <Film class="mx-auto h-12 w-12 text-primary" />
      <h3 class="text-xl font-semibold">Extensive Library</h3>
      <p class="text-muted-foreground">Access thousands of faith-based movies, shows, and documentaries.</p>
    </div>
    <div class="space-y-4 text-center">
      <Users class="mx-auto h-12 w-12 text-secondary" />
      <h3 class="text-xl font-semibold">Family Profiles</h3>
      <p class="text-muted-foreground">Create up to 8 profiles with personalized recommendations.</p>
    </div>
    <div class="space-y-4 text-center">
      <Crown class="mx-auto h-12 w-12 text-accent" />
      <h3 class="text-xl font-semibold">Premium Quality</h3>
      <p class="text-muted-foreground">Enjoy content in up to 4K HDR quality across all your devices.</p>
    </div>
  </section>

  <section class="grid lg:grid-cols-2 gap-12 items-center pb-24">
    <div class="relative aspect-video rounded-lg overflow-hidden border shadow-xl">
      <img
        src="https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&q=80"
        alt="Family watching content together"
        class="object-cover w-full h-full"
      />
    </div>
    <div class="space-y-6">
      <h2 class="text-3xl font-bold">Watch Anywhere, Anytime</h2>
      <p class="text-lg text-muted-foreground">
        Stream on your phone, tablet, laptop, or TV. Download shows to watch offline. 
        Switch between profiles and pick up right where you left off.
      </p>
      <Button size="lg" variant="outline" href="/plans">
        View Plans
      </Button>
    </div>
  </section>
</main>
