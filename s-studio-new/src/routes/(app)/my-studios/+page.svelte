<script lang="ts">
  import { Sheet, SheetTrigger, SheetContent } from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button'; // Import the Button
  import Hero from '$lib/components/sections/dashboard/Hero.svelte'; // Import Hero component
  import { page } from '$app/state';

  // Import all mini dashboard components
  
  import ProfileSwitcher from '$lib/components/sections/dashboard/ProfileSwitcher.svelte';
  import Downloads from '$lib/components/sections/dashboard/Downloads.svelte';
  import MyList from '$lib/components/sections/dashboard/MyList.svelte';
  import RecentlyWatched from '$lib/components/sections/dashboard/RecentlyWatched.svelte';
  import Recommendations from '$lib/components/sections/dashboard/Recommendations.svelte';
  import Settings from '$lib/components/sections/dashboard/Settings.svelte';
  import AccountSettings from '$lib/components/sections/dashboard/AccountSettings.svelte';
  

  const user = page.data?.user;
</script>

<!-- Netflix-style My Studios Trigger + Drawer -->
<Sheet>
  <SheetTrigger class="text-xl font-bold text-orange-500 hover:text-orange-600 transition">
    <Button variant="ghost">Open My Studios</Button> <!-- Using the Button component -->
  </SheetTrigger>

  <SheetContent
    side="left"
    class="w-[90vw] max-w-2xl h-full p-6 space-y-10 overflow-y-auto bg-background border-r"
  >
    <!-- Hero Section -->
    {#if user}
       <Hero {user} />
      {:else}
        <p class="text-sm text-muted-foreground italic">Loading user info...</p>
    {/if}

    <!-- Welcome Section -->
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold text-orange-500">Welcome to My Studios</h2>
      <p class="text-muted-foreground text-sm">Manage everything in one place</p>
    </div>

    <!-- Profile Switcher -->
    <div>
      <h3 class="text-md font-medium mb-2 text-muted-foreground">Switch Profile</h3>
      <div class="rounded-lg border p-4 bg-muted/30">
        <ProfileSwitcher />
      </div>
    </div>

    <!-- Recommendations -->
    <div>
      <h3 class="text-md font-medium mb-2 text-muted-foreground">Recommended for You</h3>
      <div class="rounded-lg border p-4 bg-muted/30">
        <Recommendations />
      </div>
    </div>

    <!-- My List -->
    <div>
      <h3 class="text-md font-medium mb-2 text-muted-foreground">My List</h3>
      <div class="rounded-lg border p-4 bg-muted/30">
        <MyList />
      </div>
    </div>

    <!-- Recently Watched -->
    <div>
      <h3 class="text-md font-medium mb-2 text-muted-foreground">Recently Watched</h3>
      <div class="rounded-lg border p-4 bg-muted/30">
        <RecentlyWatched />
      </div>
    </div>

    <!-- Downloads -->
    <div>
      <h3 class="text-md font-medium mb-2 text-muted-foreground">Downloads</h3>
      <div class="rounded-lg border p-4 bg-muted/30">
        <Downloads />
      </div>
    </div>

    <!-- Settings -->
    <div>
      <h3 class="text-md font-medium mb-2 text-muted-foreground">Settings</h3>
      <div class="rounded-lg border p-4 bg-muted/30">
        <Settings />
      </div>
    </div>

    <!-- Account Settings -->
    <div>
      <h3 class="text-md font-medium mb-2 text-muted-foreground">Account</h3>
      <div class="rounded-lg border p-4 bg-muted/30">
        <AccountSettings />
      </div>
    </div>
  </SheetContent>
</Sheet>
