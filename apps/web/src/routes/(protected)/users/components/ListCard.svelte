<script lang="ts">
  import { TableCell, TableRow } from "$lib/components/ui/table";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Trash2 } from "@lucide/svelte";
  import { format } from "date-fns";
  import SelectComponent from "./select-component.svelte";
  import { toast } from "svelte-sonner";
  import type { User } from "$lib/auth";
  import { page } from "$app/state";
  import { admin } from "$lib/auth-client";
  import { getRoleBadgeVariant, roles } from "$lib/authentication/fxn";
  import { adminRoles, Role } from "$lib/constants";
  import Identity from "$lib/authentication/ui/user/Identity.svelte";

  interface Props {
    user: User;
    i: number;
    screen: "desktop" | "mobile";
    onDelete: (user: User) => void;
  }

  let { user, i, onDelete, screen }: Props = $props();
  let updating = $state<string | null>(null);

  const me = page.data.user as User;
  const isAdmin = $derived(adminRoles.includes(me.role as Role));
  const num = i + 1;
  const roleVariant = $derived(getRoleBadgeVariant(user?.role as string));

  const updateUserRole = async (profile: User, newRole: string) => {
    if (!adminRoles.includes(me.role as Role)) {
      toast.error("Access Denied", { description: "Only administrators can change user roles." });
      return;
    }
    updating = profile.id;
    try {
      const canChangeRole = await admin.hasPermission({ permissions: { user: ["set-role"] } });
      if (!canChangeRole.data?.success) throw new Error("Forbidden");
      await admin.setRole({ userId: profile.id, role: newRole as any });
      toast.success("Success", { description: "User role updated successfully." });
      location.reload();
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast.error("Error", { description: "Failed to update user role. Please try again." });
    } finally {
      updating = null;
    }
  };

  const onValueChange = async (profile: User, val: string) => {
    await updateUserRole(profile, val);
  };
</script>

{#if screen === "desktop"}
  <TableRow class="cursor-pointer hover:bg-muted/50">
    <TableCell class="font-medium">{num}.</TableCell>
    <TableCell class="font-medium"><Identity {user} /></TableCell>
    <TableCell><Badge variant={roleVariant} class="capitalize">{user.role}</Badge></TableCell>
    <TableCell>{format(new Date(user.createdAt), "MMM dd, yyyy")}</TableCell>
    <TableCell class="flex h-full items-center justify-end gap-2 text-right">
      {#if isAdmin && me.id !== user?.id}
        <SelectComponent disabled={updating === user.id} value={user.role as string} options={roles} class="h-full w-32 flex-1" name="role" onValueChange={(val: string) => onValueChange(user, val)} placeholder="Select role" />
        <Button disabled={updating === user.id} variant="ghost" size="sm" onclick={(e) => { e.stopPropagation(); onDelete(user); }} class="h-8 w-8 cursor-pointer p-0 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 class="h-4 w-4" /></Button>
      {:else}
        <span class="text-sm text-muted-foreground">{me.id === user?.id ? "You" : "No access"}</span>
      {/if}
    </TableCell>
  </TableRow>
{:else}
  <div class="rounded-lg border bg-white shadow-sm dark:bg-secondary/50">
    <div class="border-b p-3">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <Identity {user} class="px-0" />
          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge class="text-xs">{num}</Badge>
            <Badge variant={roleVariant} class="text-xs capitalize">{user.role}</Badge>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-2 p-3">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">Created {format(new Date(user.createdAt), "MMM dd, yyyy")}</span>
      </div>
    </div>
    <div class="flex items-center justify-between border-t bg-muted/30 px-3 py-2">
      {#if isAdmin && me.id !== user?.id}
        <SelectComponent disabled={updating === user.id} value={user.role as string} options={roles} class="h-8 flex-1 text-xs" name="role" onValueChange={(val: string) => onValueChange(user, val)} placeholder="Select role" />
        <Button disabled={updating === user.id} variant="outline" size="sm" onclick={() => onDelete(user)} class="ml-1.5 size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 class="size-3.5" /></Button>
      {:else}
        <span class="text-xs text-muted-foreground">{me.id === user?.id ? "You" : "No access"}</span>
      {/if}
    </div>
  </div>
{/if}
