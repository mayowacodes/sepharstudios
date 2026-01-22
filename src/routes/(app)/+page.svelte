<script lang="ts">
  import { HomepageContent, getStyle, Constants } from '$lib/constants';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '$lib/components/ui/card';
  import { ArrowRight } from '@lucide/svelte';
  import { page } from '$app/state';
  import type { User } from '$lib/auth';

  const user = page.data.user as User | undefined;
</script>

<svelte:head>
  <title>{HomepageContent.hero.title} | {Constants.BRANDNAME}</title>
  <meta name="description" content={HomepageContent.hero.description} />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden py-20 lg:py-32">
  <!-- Background Image with Overlay -->
  <div class="absolute inset-0 z-0">
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
      style={getStyle(HomepageContent.hero.backgroundImage)}
    ></div>
    <div class="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
  </div>

  <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl animate-in slide-in-from-left-10 duration-700 fade-in">
      <Badge variant="outline" class="mb-6 animate-bounce border-primary/20 bg-primary/10 text-primary backdrop-blur-sm">
        {HomepageContent.hero.subtitle}
      </Badge>
      <h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white dark:text-foreground">
        {HomepageContent.hero.title}
      </h1>
      <p class="mb-8 text-lg text-white dark:text-muted-foreground sm:text-xl">
        {HomepageContent.hero.description}
      </p>
      <div class="flex flex-col gap-4 sm:flex-row">
        {#if user}
          <Button href={HomepageContent.hero.loggedInCta.href} size="lg" class="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25">
             <div class="absolute inset-0 bg-white/20 translate-y-full rotate-45 transition-transform group-hover:translate-y-0"></div>
             {HomepageContent.hero.loggedInCta.text}
             <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        {:else}
          <Button href={HomepageContent.hero.primaryCta.href} size="lg" class="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25">
            <div class="absolute inset-0 bg-white/20 translate-y-full rotate-45 transition-transform group-hover:translate-y-0"></div>
            {HomepageContent.hero.primaryCta.text}
            <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button href={HomepageContent.hero.secondaryCta.href} variant="outline" size="lg" class="backdrop-blur-sm hover:bg-background/80">
            {HomepageContent.hero.secondaryCta.text}
          </Button>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Stats Section -->
<section class="border-y bg-muted/30 py-12">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
      {#each HomepageContent.stats as stat}
        <div class="group text-center">
          <div class="mb-2 text-3xl font-bold md:text-4xl bg-gradient-to-r {stat.gradient} bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{stat.emoji}</span>
            {stat.label}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Features Section -->
<section id="features" class="py-20 lg:py-32">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-16 text-center">
      <Badge variant="secondary" class="mb-4">{HomepageContent.features.badge}</Badge>
      <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{HomepageContent.features.title}</h2>
      <p class="mx-auto max-w-2xl text-muted-foreground">{HomepageContent.features.description}</p>
    </div>
    
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {#each HomepageContent.features.items as feature}
        <Card class="group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-secondary/20">
          <div class="absolute inset-0 bg-gradient-to-br {feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5"></div>
          <CardHeader>
            <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br {feature.gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <feature.icon class="h-6 w-6" />
            </div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{feature.description}</CardDescription>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>

<!-- Mission Section -->
<section class="py-20 relative overflow-hidden bg-muted/30">
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
    <div class="absolute top-1/4 left-10 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-10 w-48 h-48 bg-secondary rounded-full blur-3xl"></div>
  </div>

  <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
      <div>
        <Badge class="mb-4 bg-primary text-primary-foreground border-0" variant="secondary">{HomepageContent.mission.badge}</Badge>
        <h2 class="mb-6 text-3xl font-bold md:text-4xl">{HomepageContent.mission.title}</h2>
        <p class="mb-6 text-muted-foreground">{HomepageContent.mission.description}</p>
        <div class="space-y-4">
          {#each HomepageContent.mission.values as value}
            <div class="flex items-start space-x-3 group">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br {value.gradient} rounded-lg blur-md opacity-50"></div>
                <div class="relative bg-gradient-to-br {value.gradient} rounded-lg p-2 shadow-lg group-hover:scale-110 transition-transform">
                  <value.icon class="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h4 class="mb-1 font-semibold">{value.title}</h4>
                <p class="text-sm text-muted-foreground">{value.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <Card class="shadow-2xl bg-gradient-to-br from-background to-muted border-2 border-primary/10">
        <CardHeader>
          <CardTitle class="text-base">Core Values</CardTitle>
          <CardDescription class="text-base">The principles that guide our approach</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-3">
            {#each HomepageContent.mission.coreValues as val}
              <div class="flex items-center space-x-3">
                <div class="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <span class="font-medium">{val}</span>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

<!-- Ready To Begin (CTA) -->
<section class="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground relative overflow-hidden">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">⭐</div>
    <div class="absolute bottom-10 right-10 text-7xl opacity-10 animate-bounce">❤️</div>
  </div>
  
  <div class="container mx-auto px-4 text-center sm:px-6 lg:px-8 relative z-10">
    <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border-2 border-white/30 mx-auto backdrop-blur-sm mb-6">
      <span class="text-sm font-semibold">{HomepageContent.cta.badge}</span>
    </div>
    <h2 class="mb-6 text-3xl font-bold md:text-4xl drop-shadow-lg">{HomepageContent.cta.title}</h2>
    <p class="mb-8 opacity-95 text-lg max-w-2xl mx-auto">{HomepageContent.cta.description}</p>
    <div class="flex flex-col justify-center gap-4 sm:flex-row">
      {#if user}
        <Button href="/dashboard" size="lg" variant="secondary">
          Go to Dashboard <ArrowRight class="ml-2 h-5 w-5" />
        </Button>
      {:else}
        <Button href="/auth/login?redirectTo=/dashboard" size="lg" variant="secondary" class="shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          {HomepageContent.cta.buttonText} <ArrowRight class="ml-2 h-5 w-5" />
        </Button>
      {/if}
    </div>
  </div>
</section>
