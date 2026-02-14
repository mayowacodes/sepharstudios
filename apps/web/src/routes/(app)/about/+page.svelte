<script lang="ts">
  import { Target, Eye, Users, Trophy } from '@lucide/svelte';
  import { Card, CardContent } from "$lib/components/ui/card";
  
  const milestones = [
    { year: 2024, text: 'Launch of Sephar Studios platform' },
    { year: 2025, text: 'Target to be among top 5 Christian media houses' },
    { year: 2025, text: 'Target to be among top 10 media houses in the country' }
  ];
</script>

<svelte:head>
  <title>About Us | Sephar Studios</title>
  <meta name="description" content="Learn about Sephar Studios' mission to spread kingdom-friendly media content and draw souls to the kingdom of God." />
</svelte:head>

<main class="container pt-32 pb-16 mx-auto px-4">
  <section class="text-center space-y-6 pb-24">
    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-primary">
      Spreading Light Through Media
    </h1>
    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
      Sephar Studios is dedicated to producing excellent video content that draws people to the kingdom of God.
    </p>
  </section>

  <section class="grid md:grid-cols-2 gap-8 pb-24">
    <Card class="border-primary/20 bg-muted/30">
      <CardContent class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <Target class="w-8 h-8 text-primary" />
          <h2 class="text-2xl font-bold">Our Mission</h2>
        </div>
        <p class="text-muted-foreground mb-4">
          To produce various types of attractive video contents that are excellently done with the goal of drawing men to the kingdom through quality video contents that will cut across all works of life.
        </p>
        <p class="text-muted-foreground mb-4">
            We aim to shine the light of the kingdom to show people that there is a God-kind of way to do everything, and it is the only way to do everything.
          </p>
          <p class="text-muted-foreground">
            Our mission includes bringing together a mountain of kingdom-friendly available resources and making them easily accessible for people who are hungry for spiritual growth.
          </p>
      </CardContent>
    </Card>

    <Card class="border-primary/20 bg-muted/30">
      <CardContent class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <Eye class="w-8 h-8 text-primary" />
          <h2 class="text-2xl font-bold">Our Vision</h2>
        </div>
        <p class="text-muted-foreground mb-4">
          To spread kingdom-friendly media content, attracting and retaining souls for the kingdom of God.
        </p>
        <p class="text-muted-foreground mb-4">
            To use media as a vehicle to bring souls and profit to the kingdom of God.
          </p>
          <p class="text-muted-foreground">
            By the end of 2025, to be one of the top 5 Christian media houses and one of the top 10 media houses in the country.
          </p>
      </CardContent>
    </Card>
  </section>

  <section class="text-center pb-24">
    <h2 class="text-3xl font-bold text-primary mb-6">Our Core Values</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card class="border-primary/20 bg-muted/30">
        <CardContent class="p-6 space-y-2">
          <h3 class="text-xl font-semibold">Excellence</h3>
          <p class="text-muted-foreground">
            Committed to producing high-quality content that glorifies God and serves our audience.
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-primary/20 bg-muted/30">
        <CardContent class="p-6 space-y-2">
          <h3 class="text-xl font-semibold">Kingdom Impact</h3>
          <p class="text-muted-foreground">
            Focused on creating content that advances God's kingdom and transforms lives.
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-primary/20 bg-muted/30">
        <CardContent class="p-6 space-y-2">
          <h3 class="text-xl font-semibold">Accessibility</h3>
          <p class="text-muted-foreground">
            Making quality Christian content easily accessible to everyone seeking spiritual growth.
          </p>
        </CardContent>
      </Card>
    </div>
  </section>

  <section class="relative">
      <h2 class="text-3xl font-bold text-primary text-center mb-8">Our Journey</h2>
      <div class="absolute left-1/2 -translate-x-px h-full w-0.5 bg-primary/20 hidden sm:block"></div>
      <div class="space-y-12">
        {#each milestones as milestone}
          <div class="relative flex flex-col sm:flex-row items-center gap-8">
            <div class="w-full sm:w-24 text-center sm:text-right flex-none">
              <span class="text-primary font-bold">{milestone.year}</span>
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary hidden sm:block"></div>
            <div class="flex-1 bg-muted/30 p-4 rounded-lg border border-primary/20 w-full">
              <p>{milestone.text}</p>
            </div>
          </div>
        {/each}
      </div>
    </section>
</main>
