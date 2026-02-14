<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { LayoutDashboard, Users, FileText, User as UserIcon } from '@lucide/svelte';
  import type { User } from '$lib/auth';
  import { page } from '$app/state';

  const user = page.data.user as User;
</script>

<div class="flex flex-col gap-6">
  <div>
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <p class="text-muted-foreground">Welcome back, {user?.name || 'User'}!</p>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Total Users</Card.Title>
        <Users class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">0</div>
        <p class="text-xs text-muted-foreground">Registered users</p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Active Sessions</Card.Title>
        <UserIcon class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">1</div>
        <p class="text-xs text-muted-foreground">Current session</p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Documents</Card.Title>
        <FileText class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">0</div>
        <p class="text-xs text-muted-foreground">Total files</p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">System Status</Card.Title>
        <LayoutDashboard class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold text-green-500">Online</div>
        <p class="text-xs text-muted-foreground">All systems operational</p>
      </Card.Content>
    </Card.Root>
  </div>
</div>
