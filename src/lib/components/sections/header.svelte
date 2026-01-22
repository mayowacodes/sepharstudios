<script lang="ts">
  import { page } from '$app/state';
  import BrandLink from '$lib/components/widgets/BrandLink.svelte';
  import { Home, LayoutDashboard } from '@lucide/svelte';
  import ModeToggle from '$lib/components/widgets/ModeToggle.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { User } from '$lib/auth';
  import { Role, getNavigation } from '$lib/constants';
  import AuthDialog from '$lib/authentication/ui/user/auth-dialog.svelte';

  const user = page.data.user as User | undefined;
  const navData = getNavigation(page.url.pathname);
  const navigation = $derived(user ? navData.privateNav : navData.publicNav);
  const isActive = (path: string) => page.url.pathname === path;
</script>

<div class="bg-background sticky top-0 left-0 z-[11]">
  <header class="border-b shadow-sm">
    <div class="center">
      <div class="flex h-16 items-center justify-between">
        <BrandLink />
        <div class="flex items-center space-x-4">
          <nav class="hidden space-x-2 md:flex">
            {#each navigation as item}
              {#if !user || (user && item.roles.includes(user.role as Role))}
                <Button href={item.href} variant={isActive(item.href) ? 'default' : 'outline'} size="sm">
                  <item.icon class="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              {/if}
            {/each}
          </nav>
          <ModeToggle />
          <AuthDialog />
        </div>
      </div>
    </div>
  </header>
</div>
