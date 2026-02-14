<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
  } from "$lib/components/ui/accordion";
  import { writable } from "svelte/store";
  import { Search, Mail, HelpCircle, MessageCircle } from 'lucide-svelte';

  const openItem = writable<string | null>(null);

  function toggle(item: string) {
    openItem.update((current) => (current === item ? null : item));
  }

  const activeAccordion = writable<string | undefined>(undefined);

  const faqs = [
    {
      category: "Account & Billing",
      items: [
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking the 'Sign Up' button on the top right of our homepage. Follow the prompts to enter your information and choose a subscription plan."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept major credit cards, PayPal, and selected mobile payment methods."
        },
        {
          question: "How do I cancel my subscription?",
          answer: "You can cancel your subscription at any time through your account settings. Navigate to 'Subscription' and click 'Cancel Subscription'."
        }
      ]
    },
    {
      category: "Content & Playback",
      items: [
        {
          question: "What devices can I watch on?",
          answer: "You can watch on your computer, smartphone, tablet, smart TV, and other streaming devices."
        },
        {
          question: "Can I download content to watch offline?",
          answer: "Yes, premium subscribers can download content for offline viewing on mobile devices."
        },
        {
          question: "How do I report inappropriate content?",
          answer: "Use the 'Report' button on any video player to flag inappropriate content. Our team will review it promptly."
        }
      ]
    },
    {
      category: "Technical Support",
      items: [
        {
          question: "What internet speed do I need?",
          answer: "We recommend at least 5 Mbps for HD streaming and 15 Mbps for 4K content."
        },
        {
          question: "How do I fix buffering issues?",
          answer: "Try clearing your browser cache, checking your internet connection, or lowering the video quality."
        }
      ]
    }
  ];

  let searchQuery = '';
  let contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  $: filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  async function handleContactSubmit() {
    console.log('Submitting contact form:', contactForm);
  }
</script>

<svelte:head>
  <title>Help Center | Sephar Studios</title>
  <meta name="description" content="Get help and support for your Sephar Studios experience. Find answers to common questions and contact our support team." />
</svelte:head>

<main class="container pt-32 pb-16">
  <section class="text-center space-y-6 pb-24">
    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight">
      How Can We Help?
    </h1>
    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
      Find answers to common questions or contact our support team.
    </p>
    <div class="relative max-w-xl mx-auto">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input type="search" placeholder="Search for answers..." bind:value={searchQuery} class="pl-10" />
    </div>
  </section>

  <section class="grid md:grid-cols-3 gap-8 pb-24">
    <Card class="bg-background border">
      <CardContent class="p-6 text-center space-y-4">
        <Mail class="mx-auto h-12 w-12 text-primary" />
        <h3 class="text-xl font-semibold">Email Support</h3>
        <p class="text-muted-foreground">Get in touch with our support team via email.</p>
        <a href="mailto:sepherstudios@gmail.com" class="text-primary hover:underline">
          sepherstudios@gmail.com
        </a>
      </CardContent>
    </Card>

    <Card class="bg-background border">
      <CardContent class="p-6 text-center space-y-4">
        <HelpCircle class="mx-auto h-12 w-12 text-secondary" />
        <h3 class="text-xl font-semibold">FAQs</h3>
        <p class="text-muted-foreground">Find answers to commonly asked questions.</p>
        <Button variant="outline">Browse FAQs</Button>
      </CardContent>
    </Card>

    <Card class="bg-background border">
      <CardContent class="p-6 text-center space-y-4">
        <MessageCircle class="mx-auto h-12 w-12 text-accent" />
        <h3 class="text-xl font-semibold">Contact Us</h3>
        <p class="text-muted-foreground">Send us a message and we'll get back to you.</p>
        <Button variant="outline">Contact Support</Button>
      </CardContent>
    </Card>
  </section>

  <section class="text-center pb-24">
    <h2 class="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
    {#if filteredFaqs.length > 0}
      {#each filteredFaqs as category}
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">{category.category}</h3>
          <Accordion type="single" bind:value={$activeAccordion}>
            {#each category.items as item, i}
              <AccordionItem value={`${category.category}-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p class="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            {/each}
          </Accordion>
        </div>
      {/each}
    {:else}
      <p class="text-center text-muted-foreground">
        No results found for "{searchQuery}". Try a different search term.
      </p>
    {/if}
  </section>

  <section>
    <h2 class="text-center text-3xl font-bold mb-6">Contact Support</h2>
    <Card class="max-w-3xl mx-auto bg-background border">
      <CardContent class="p-6">
        <form on:submit|preventDefault={handleContactSubmit} class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Name" bind:value={contactForm.name} required />
            <Input type="email" placeholder="Email" bind:value={contactForm.email} required />
          </div>
          <Input placeholder="Subject" bind:value={contactForm.subject} required />
          <Textarea placeholder="Message" bind:value={contactForm.message} rows={6} required />
          <Button type="submit" class="w-full">Send Message</Button>
        </form>
      </CardContent>
    </Card>
  </section>
</main>
