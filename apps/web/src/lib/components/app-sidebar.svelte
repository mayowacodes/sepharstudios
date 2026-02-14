<script lang="ts">
  import NavMain from "$lib/components/nav-main.svelte";
  import NavUser from "$lib/components/nav-user.svelte";
  import TeamSwitcher from "$lib/components/team-switcher.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { type ComponentProps } from "svelte";
  import type { User } from "$lib/auth";
  import { page } from "$app/state";
  import { getNavigation } from "$lib/constants";

  let {
    ref = $bindable(null),
    collapsible = "icon",
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> = $props();

  const data = getNavigation(page.url.pathname);
  const user = page.data.user as User;
</script>

<Sidebar.Root {collapsible} {...restProps}>
  <Sidebar.Header>
    <TeamSwitcher teams={data.teams} />
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={data.navMain} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser {user}/>
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
