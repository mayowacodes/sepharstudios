<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { Button } from '$lib/components/ui/button';
  import { ExternalLink, BookOpen, Code, Rocket, Settings } from '@lucide/svelte';
</script>

<div class="flex flex-col gap-6">
  <div>
    <h1 class="text-3xl font-bold">Documentation</h1>
    <p class="text-muted-foreground">Learn how to use and customize your application</p>
  </div>

  <div class="grid gap-4 md:grid-cols-2">
    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <BookOpen class="h-5 w-5" />
          <Card.Title>Getting Started</Card.Title>
        </div>
        <Card.Description>Learn the basics of your application</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-2">
        <p class="text-sm text-muted-foreground">
          This application is built with SvelteKit, Shadcn-Svelte, and Better Auth.
          It includes authentication, database management, and file storage out of the box.
        </p>
        <Button variant="outline" size="sm" href="https://kit.svelte.dev/docs" target="_blank">
          <ExternalLink class="h-4 w-4 mr-2" />SvelteKit Docs
        </Button>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <Code class="h-5 w-5" />
          <Card.Title>UI Components</Card.Title>
        </div>
        <Card.Description>Shadcn-Svelte component library</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Beautiful, accessible, and customizable components built with Tailwind CSS.
        </p>
        <Button variant="outline" size="sm" href="https://shadcn-svelte.com" target="_blank">
          <ExternalLink class="h-4 w-4 mr-2" />Shadcn Docs
        </Button>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <Rocket class="h-5 w-5" />
          <Card.Title>Authentication</Card.Title>
        </div>
        <Card.Description>Better Auth for secure authentication</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Secure email/password and social authentication with session management.
        </p>
        <Button variant="outline" size="sm" href="https://www.better-auth.com/docs" target="_blank">
          <ExternalLink class="h-4 w-4 mr-2" />Better Auth Docs
        </Button>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <Settings class="h-5 w-5" />
          <Card.Title>Database</Card.Title>
        </div>
        <Card.Description>Drizzle ORM for database management</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Type-safe SQL with automatic migrations and PostgreSQL support.
        </p>
        <Button variant="outline" size="sm" href="https://orm.drizzle.team/docs" target="_blank">
          <ExternalLink class="h-4 w-4 mr-2" />Drizzle Docs
        </Button>
      </Card.Content>
    </Card.Root>
  </div>
</div>
