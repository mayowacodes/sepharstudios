<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";

  const sections = [
    {
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          details: "Name, email address, payment information, and account preferences."
        },
        {
          subtitle: "Usage Data",
          details: "Viewing history, search queries, device information, and interaction with content."
        },
        {
          subtitle: "Technical Data",
          details: "IP address, browser type, device ID, and system information."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          details: "To provide and maintain our streaming service, process payments, and personalize content recommendations."
        },
        {
          subtitle: "Communication",
          details: "To send service updates, newsletters, and respond to your inquiries."
        },
        {
          subtitle: "Analytics",
          details: "To improve our services, content offerings, and user experience."
        }
      ]
    },
    {
      title: "Data Protection",
      content: [
        {
          subtitle: "Security Measures",
          details: "We implement industry-standard security measures to protect your data."
        },
        {
          subtitle: "Data Retention",
          details: "We retain your data only for as long as necessary to provide our services."
        }
      ]
    },
    {
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Control",
          details: "You have the right to access, correct, or delete your personal information."
        },
        {
          subtitle: "Cookie Preferences",
          details: "You can manage your cookie preferences through your browser settings."
        }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Privacy Policy | Sephar Studios</title>
  <meta name="description" content="Learn how Sephar Studios collects, uses, and protects your personal information." />
</svelte:head>

<main class="container pt-32 pb-16">
  <section class="space-y-6 pb-24">
    <h1 class="text-4xl font-bold tracking-tight">Privacy Policy</h1>
    <p class="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

    <p class="text-muted-foreground">
      At Sephar Studios, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
    </p>

    <div class="space-y-8">
      {#each sections as section}
        <Card class="border border-gray-800 bg-background/50">
          <CardContent class="p-6">
            <h2 class="text-2xl font-semibold mb-4">{section.title}</h2>
            <div class="space-y-6">
              {#each section.content as item}
                <div>
                  <h3 class="text-lg font-medium mb-2">{item.subtitle}</h3>
                  <p class="text-muted-foreground">{item.details}</p>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>

    <div class="pt-12">
      <h2 class="text-2xl font-semibold mb-4">Contact Us</h2>
      <p class="text-muted-foreground">
        If you have any questions about our Privacy Policy, please contact us at:
        <a href="mailto:info@sepharstudios.com" class="text-primary hover:underline">
          info@sepharstudios.com
        </a>
      </p>
    </div>
  </section>
</main>
