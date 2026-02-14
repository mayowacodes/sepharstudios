<script lang="ts">
  import { Target, Eye, Users, Trophy } from 'lucide-svelte';
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

<main class="container pt-32 pb-16 text-white">
  <section class="text-center space-y-6 pb-24">
    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-[#FF5E0E]">
      Spreading Light Through Media
    </h1>
    <p class="text-xl text-[#FFBF00] max-w-2xl mx-auto">
      Sephar Studios is dedicated to producing excellent video content that draws people to the kingdom of God.
    </p>
  </section>

  <section class="grid md:grid-cols-2 gap-8 pb-24">
    <Card class="bg-black/50 border-[#AF6E4D] text-white">
      <CardContent class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <Target class="w-8 h-8 text-[#FF5E0E]" />
          <h2 class="text-2xl font-bold text-[#FFBF00]">Our Mission</h2>
        </div>
        <p class="text-[#090300] mb-4">
          To produce various types of attractive video contents that are excellently done with the goal of drawing men to the kingdom through quality video contents that will cut across all works of life.
        </p>
        <p class="text-[#090300] mb-4">
            We aim to shine the light of the kingdom to show people that there is a God-kind of way to do everything, and it is the only way to do everything.
          </p>
          <p class="text-[#090300]">
            Our mission includes bringing together a mountain of kingdom-friendly available resources and making them easily accessible for people who are hungry for spiritual growth.
          </p>
      </CardContent>
    </Card>

    <Card class="bg-black/50 border-[#AF6E4D] text-white">
      <CardContent class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <Eye class="w-8 h-8 text-[#FF5E0E]" />
          <h2 class="text-2xl font-bold text-[#FFBF00]">Our Vision</h2>
        </div>
        <p class="text-[#090300] mb-4">
          To spread kingdom-friendly media content, attracting and retaining souls for the kingdom of God.
        </p>
        <p class="text-[#090300] mb-4">
            To use media as a vehicle to bring souls and profit to the kingdom of God.
          </p>
          <p class="text-[#090300]">
            By the end of 2025, to be one of the top 5 Christian media houses and one of the top 10 media houses in the country.
          </p>
      </CardContent>
    </Card>
  </section>

  <section class="text-center pb-24">
    <h2 class="text-3xl font-bold text-[#FF5E0E] mb-6">Our Core Values</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card class="bg-black/50 border-[#AF6E4D] text-white">
        <CardContent class="p-6 space-y-2">
          <h3 class="text-xl font-semibold text-[#FFBF00]">Excellence</h3>
          <p class="text-[#090300]">
            Committed to producing high-quality content that glorifies God and serves our audience.
          </p>
        </CardContent>
      </Card>
      
      <Card class="bg-black/50 border-[#AF6E4D] text-white">
        <CardContent class="p-6 space-y-2">
          <h3 class="text-xl font-semibold text-[#FFBF00]">Kingdom Impact</h3>
          <p class="text-[#090300]">
            Focused on creating content that advances God's kingdom and transforms lives.
          </p>
        </CardContent>
      </Card>
      
      <Card class="bg-black/50 border-[#AF6E4D] text-white">
        <CardContent class="p-6 space-y-2">
          <h3 class="text-xl font-semibold text-[#FFBF00]">Accessibility</h3>
          <p class="text-[#0e0500]">
            Making quality Christian content easily accessible to everyone seeking spiritual growth.
          </p>
        </CardContent>
      </Card>
    </div>
  </section>

  <section class="relative">
      <h2 class="text-3xl font-bold text-[#FF5E0E] text-center mb-8">Our Journey</h2>
      <div class="absolute left-1/2 -translate-x-px h-full w-0.5 bg-[#FF5E0E]/20"></div>
      <div class="space-y-12">
        {#each milestones as milestone}
          <div class="relative flex items-center gap-8">
            <div class="w-24 text-right flex-none">
              <span class="text-[#FF5E0E] font-bold">{milestone.year}</span>
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FF5E0E]"></div>
            <div class="flex-1 bg-black/50 p-4 rounded-lg border border-gray-800">
              <p class="text-white">{milestone.text}</p>
            </div>
          </div>
        {/each}
      </div>
    </section>
</main>
