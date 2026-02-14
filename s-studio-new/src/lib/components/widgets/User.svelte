<script lang="ts">
  import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "svelte-clerk";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Sheet, SheetTrigger } from "$lib/components/ui/sheet";
  import { Bell, UserIcon } from "lucide-svelte";
  import NotificationCenter from "$lib/components/NotificationCenter.svelte";
  import Search from "$lib/components/Search.svelte";

  let isNotificationOpen = false;
</script>

<div class="flex items-center gap-4">
  <ClerkLoading>
    <!-- Show skeleton while loading -->
    <Skeleton class="size-10 rounded-full" />
  </ClerkLoading>

  <ClerkLoaded>
    <SignedIn>
      <!-- Search for authenticated users -->
      <Search />

      <!-- Notifications -->
      <Sheet bind:open={isNotificationOpen}>
        <SheetTrigger>
          <Button variant="ghost" size="icon">
            <Bell class="h-5 w-5" />
            <span class="sr-only">Open notifications</span>
          </Button>
        </SheetTrigger>
        <NotificationCenter bind:open={isNotificationOpen} onOpenChange={val => isNotificationOpen = val} />
      </Sheet>

      <!-- User Profile Button (Clerk) -->
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'size-10'
          }
        }}
      />
    </SignedIn>

    <SignedOut>
      <!-- User Icon and Sign In Button -->
      <Button 
        variant="default" 
        class="px-4 py-2 flex items-center gap-2 font-semibold transition-all duration-200 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <a href="/sign-in" class="w-full h-full flex items-center justify-center gap-2">
          <UserIcon class="h-5 w-5" />
          <span>Sign In</span>
        </a>
      </Button>
    
      <Button>
        <a href="/plans" class="w-full h-full flex items-center justify-center">
          Get Started
        </a>
      </Button>
    </SignedOut>
  </ClerkLoaded>
</div>
