<script lang="ts">
  import type { LayoutProps } from "./$types";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import ModeToggle from "$lib/components/widgets/ModeToggle.svelte";
  import CrumbPath from "$lib/components/ui/crumb-path/crumb-path.svelte";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { infiniteScroll } from "$lib/hooks/use-infinite-scroll.svelte";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import AuthDialog from "$lib/authentication/ui/user/auth-dialog.svelte";

  let { children }: LayoutProps = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="sticky top-0 left-0 z-[1] flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <CrumbPath />
      </div>
      <div class="flex items-center gap-2 pr-4">
        <ModeToggle />
        <AuthDialog />
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 py-0 animate-in">
      <QueryClientProvider client={infiniteScroll.queryClient}>
        {@render children()}
        <SvelteQueryDevtools />
      </QueryClientProvider>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
