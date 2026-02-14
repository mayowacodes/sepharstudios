<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Check, X, PlayCircle, Film, Crown, Users } from 'lucide-svelte';
  import { writable } from 'svelte/store';
  import { Button } from "$lib/components/ui/button";

  const searchQuery = writable('');

  const guidelines = [
    {
      title: "Faith-Based Content",
      allowed: [
        "Content aligned with Christian teachings and values",
        "Biblical stories and adaptations",
        "Faith-promoting messages",
        "Family-friendly content",
        "Educational Christian material"
      ],
      prohibited: [
        "Content contradicting Christian beliefs",
        "Anti-religious messaging",
        "Explicit or adult content",
        "Violence or gore",
        "Inappropriate language"
      ]
    },
    {
      title: "Technical Requirements",
      allowed: [
        "High-definition video (1080p minimum)",
        "Clear audio quality",
        "Professional editing",
        "Proper lighting and composition",
        "Subtitles and closed captions"
      ],
      prohibited: [
        "Poor video quality",
        "Distorted audio",
        "Unstable footage",
        "Missing subtitles",
        "Improper aspect ratios"
      ]
    },
    {
      title: "Content Categories",
      allowed: [
        "Christian films and series",
        "Biblical documentaries",
        "Worship content",
        "Educational programs",
        "Family entertainment"
      ],
      prohibited: [
        "Non-Christian religious content",
        "Secular entertainment",
        "Political content",
        "Controversial topics",
        "Divisive messaging"
      ]
    }
  ];

  $: filteredGuidelines = guidelines.map(section => ({
    ...section,
    allowed: section.allowed.filter(item => item.toLowerCase().includes($searchQuery.toLowerCase())),
    prohibited: section.prohibited.filter(item => item.toLowerCase().includes($searchQuery.toLowerCase()))
  }));
</script>

<svelte:head>
  <title>Content Guidelines | Sephar Studios</title>
  <meta name="description" content="Learn about our content guidelines and standards for faith-based content on Sephar Studios." />
</svelte:head>

<main class="container pt-32 pb-16">
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
      <Button size="lg" href="/sign-up" class="bg-primary hover:bg-primary/90">
        <PlayCircle class="mr-2 h-5 w-5" />
        Start Watching
      </Button>
      <Button size="lg" variant="outline">Learn More</Button>
    </div>
  </section>

  <section class="text-center space-y-6 pb-24">
    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight">
      Content Guidelines
    </h1>
    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
      Our content guidelines ensure alignment with our mission to provide quality, faith-based entertainment.
    </p>
    <input
      type="text"
      placeholder="Search guidelines..."
      bind:value={$searchQuery}
      class="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-primary focus:border-primary"
    />
  </section>

  <section class="text-center space-y-8">
    {#each filteredGuidelines as section}
      {#if section.allowed.length || section.prohibited.length}
        <Card class="border border-gray-200">
          <CardContent class="p-6 space-y-4">
            <h2 class="text-center text-2xl font-bold">{section.title}</h2>
            <div class="grid md:grid-cols-2 gap-6">
              {#if section.allowed.length}
                <div>
                  <h3 class="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <Check class="w-5 h-5" /> Allowed
                  </h3>
                  <ul class="list-disc list-inside text-muted-foreground">
                    {#each section.allowed as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
              {#if section.prohibited.length}
                <div>
                  <h3 class="text-lg font-semibold text-center text-red-600 flex items-center gap-2">
                    <X class="w-5 h-5" /> Prohibited
                  </h3>
                  <ul class="list-disc list-inside text-muted-foreground">
                    {#each section.prohibited as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          </CardContent>
        </Card>
      {/if}
    {/each}
  </section>
</main>
