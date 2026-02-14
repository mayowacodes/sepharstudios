<script lang="ts">
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Bell, X } from 'lucide-svelte';
  import type { Notification } from '$lib/types';
  import { onMount } from 'svelte';

  export let open: boolean;
  export let onOpenChange: (open: boolean) => void;

  let notifications: Notification[] = [];
  let isLoading: boolean = true;
  let error: string | null = null;

  // Load notifications when the sheet is open
  onMount(async () => {
    if (open) {
      await loadNotifications();
    }
  });

  $: if (open) {
    loadNotifications();
  }

  async function loadNotifications() {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        notifications = await response.json();
      } else {
        error = 'Failed to load notifications';
      }
    } catch (e) {
      error = 'Failed to load notifications';
    } finally {
      isLoading = false;
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      notifications = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async function deleteNotification(id: string) {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      notifications = notifications.filter(n => n.id !== id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }
</script>

<Sheet {open} onOpenChange={onOpenChange}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Notifications</SheetTitle>
      <SheetDescription>
        Stay updated with the latest content and features
      </SheetDescription>
    </SheetHeader>

    <ScrollArea class="h-[calc(100vh-8rem)] pr-4">
      {#if isLoading}
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      {:else if error}
        <div class="text-center text-destructive py-8">{error}</div>
      {:else if notifications.length === 0}
        <div class="flex flex-col items-center justify-center py-8 text-center">
          <Bell class="h-12 w-12 text-muted-foreground/50" />
          <p class="mt-2 text-sm text-muted-foreground">
            No notifications yet
          </p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each notifications as notification (notification.id)}
            <div
              class="relative rounded-lg border p-4"
              class:bg-muted={!notification.read}
            >
              <Button
                variant="ghost"
                size="icon"
                class="absolute right-2 top-2"
                onclick={() => deleteNotification(notification.id)}
              >
                <X class="h-4 w-4" />
              </Button>

              <div class="space-y-1">
                <p class="font-medium pr-8">{notification.title}</p>
                <p class="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                  {#if !notification.read}
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-xs"
                      onclick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </ScrollArea>
  </SheetContent>
</Sheet>
