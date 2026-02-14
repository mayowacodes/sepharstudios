<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { AlertCircleIcon, Loader2, Search } from "@lucide/svelte";
  import { Input } from "$lib/components/ui/input";
  import EditDialog from "./components/EditDialog.svelte";
  import DeleteDialog from "./components/DeleteDialog.svelte";
  import { page } from "$app/state";
  import { Table, TableBody, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import ListCard from "./components/ListCard.svelte";
  import { infiniteScroll } from "$lib/hooks/use-infinite-scroll.svelte";
  import { Debounced } from "runed";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import type { User } from "$lib/auth";

  let editingUser = $state<User | null>(null);
  let deletingUser = $state<User | null>(null);

  const onEdit = async (user: User) => (editingUser = user);
  const onDelete = async (user: User) => (deletingUser = user);

  let handleInput = $state("");
  const debouncedHandle = new Debounced(() => handleInput, 500);
  const usersQuery = $derived(infiniteScroll.listQuery<User>(debouncedHandle.current, page.url.origin, "users"));
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold sm:text-3xl">
      Users ({#if $usersQuery.isPending}<Loader2 class="inline h-4 w-4 animate-spin" />{:else}{$usersQuery?.data?.total ?? 0}{/if})
    </h1>
    <p class="mt-2 text-muted-foreground">Manage users</p>
  </div>

  <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
    <div class="relative grid w-full sm:max-w-md">
      <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
      <Input placeholder="Search users..." bind:value={handleInput} class="px-10" />
    </div>
  </div>

  {#if $usersQuery.isPending}
    <div class="p-6"><div class="flex h-80 items-center justify-center"><div class="size-20 animate-spin rounded-full border-b-2 border-primary"></div></div></div>
  {/if}

  {#if $usersQuery.error}
    <Alert.Root variant="destructive">
      <AlertCircleIcon />
      <Alert.Title>{$usersQuery.error.name}</Alert.Title>
      <Alert.Description>{$usersQuery.error.cause}<br />{$usersQuery.error.message}</Alert.Description>
    </Alert.Root>
  {/if}

  {#if $usersQuery.isSuccess}
    <div>
      <!-- desktop table -->
      <div class="hidden overflow-x-auto border bg-white lg:block dark:bg-background">
        <Table>
          <TableHeader class="sticky top-0 z-10 border-b bg-white dark:bg-secondary">
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {#each $usersQuery.data.results as user, i}
              <ListCard {onDelete} screen="desktop" {i} {user} />
            {/each}
          </TableBody>
        </Table>
      </div>

      <!-- mobile cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {#each $usersQuery.data.results as user, i}
          <ListCard {onDelete} screen="mobile" {i} {user} />
        {/each}
      </div>
    </div>

    <div>
      {#if $usersQuery.isFetching}
        <div class="flex items-center justify-center">
          <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
          <span class="ml-2 text-muted-foreground">Loading more...</span>
        </div>
      {:else if $usersQuery.hasNextPage}
        <div class="justify-center">
          <Button class="w-full sm:w-fit" onclick={() => $usersQuery.fetchNextPage()} disabled={!$usersQuery.hasNextPage || $usersQuery.isFetchingNextPage}>Load More</Button>
        </div>
      {:else}
        <p class="text-center text-sm text-muted-foreground">Nothing more to load</p>
      {/if}
    </div>
  {/if}

  {#if editingUser}
    <EditDialog user={editingUser} open={!!editingUser} onOpenChange={(open) => !open && (editingUser = null)} />
  {/if}

  {#if deletingUser}
    <DeleteDialog user={deletingUser} open={!!deletingUser} onOpenChange={(open) => !open && (deletingUser = null)} />
  {/if}
</div>
