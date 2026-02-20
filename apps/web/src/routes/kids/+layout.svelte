<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { ChevronDown, Baby, Users } from 'lucide-react';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  const { children } = $props();
  
  const currentPath = $derived(page.url.pathname);
  const isKiddies = $derived(currentPath.includes('/kids/kiddies'));
  const isTeens = $derived(currentPath.includes('/kids/teens'));
  
  const currentLabel = $derived(isTeens ? 'Teens' : 'Kiddies');
</script>

<div class="min-h-screen bg-background flex flex-col">
  <nav class="border-b bg-card px-4 py-2 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center space-x-4">
      <a href="/" class="font-bold text-primary">Sephar Studios</a>
      
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button variant="outline" class="flex items-center space-x-2" builders={[builder]}>
            {#if isTeens}
              <Users class="w-4 h-4" />
            {:else}
              <Baby class="w-4 h-4" />
            {/if}
            <span>{currentLabel} Section</span>
            <ChevronDown class="w-4 h-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-48">
          <DropdownMenu.Item>
            <a href="/kids/kiddies" class="flex items-center space-x-2 w-full">
              <Baby class="w-4 h-4" />
              <span>Kiddies</span>
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <a href="/kids/teens" class="flex items-center space-x-2 w-full">
              <Users class="w-4 h-4" />
              <span>Teens</span>
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
    
    <div class="flex items-center space-x-2">
      <a href="/" class="text-sm text-muted-foreground hover:text-foreground">Back to Main</a>
    </div>
  </nav>

  <main class="flex-1">
    {@render children()}
  </main>
</div>

<style>
  :global(.kids-theme) {
    --primary: 322 81% 43%; /* Pinkish for kids */
  }
</style>
