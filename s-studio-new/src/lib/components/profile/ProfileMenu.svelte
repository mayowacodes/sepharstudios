<script lang="ts">
  import { page } from '$app/state';
  import { currentProfile } from '$lib/stores/profileStores';
  import { Button } from '$lib/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import { LogOut, Settings, User } from 'lucide-svelte';

  async function handleSignOut() {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="ghost" class="relative h-8 w-8 rounded-full">
      <Avatar class="h-8 w-8">
        <AvatarImage src={$currentProfile?.image || ''} alt={$currentProfile?.name || ''} />
        <AvatarFallback>
          {$currentProfile?.name?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent class="w-56" align="end">
    <DropdownMenuLabel class="font-normal">
      <div class="flex flex-col space-y-1">
        <p class="text-sm font-medium leading-none">{$currentProfile?.name}</p>
        <p class="text-xs leading-none text-muted-foreground">
          {page.data.user?.email}
        </p>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    
    <DropdownMenuItem>
      <a href="/profile" class="flex items-center gap-2 w-full">
        <User class="mr-2 h-4 w-4" />
        Profile
      </a>
    </DropdownMenuItem>
    
    <DropdownMenuItem>
      <a href="/settings" class="flex items-center gap-2 w-full">
        <Settings class="mr-2 h-4 w-4" />
        Settings
      </a>
    </DropdownMenuItem>
    
    <DropdownMenuSeparator />
    
    <DropdownMenuItem onclick={handleSignOut}>
      <LogOut class="mr-2 h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>