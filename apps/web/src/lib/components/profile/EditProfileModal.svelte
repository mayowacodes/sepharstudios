<script lang="ts">
  import type { Profile } from '$lib/types/types';
  import { tick } from 'svelte';

  let { isOpen = false, profile, onSave, onClose }: { isOpen?: boolean; profile: Pick<Profile, 'id' | 'name' | 'avatarUrl'>; onSave: (updatedProfile: Pick<Profile, 'id' | 'name' | 'avatarUrl'>) => void; onClose: () => void } = $props();

  // Mirror the incoming profile into editable local state. The previous
  // `$state(profile.name)` only captured the value at component creation,
  // so re-opening the modal for a different profile would keep showing
  // the first profile's name.
  let newName = $state('');
  let newAvatarUrl = $state('');
  let dialogEl: HTMLDivElement | undefined = $state();
  let firstFocusable: HTMLInputElement | undefined = $state();

  $effect(() => {
    newName = profile.name;
    newAvatarUrl = profile.avatarUrl ?? '';
  });

  $effect(() => {
    if (isOpen && firstFocusable) {
      tick().then(() => firstFocusable?.focus());
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogEl) return;
    const focusables = dialogEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const saveProfile = () => {
    if (newName.trim() && newAvatarUrl.trim()) {
      onSave({
        id: profile.id,
        name: newName.trim(),
        avatarUrl: newAvatarUrl.trim()
      });
      onClose();
    } else {
      alert('Please provide a name and avatar URL');
    }
  };
</script>

<svelte:window onkeydown={isOpen ? handleKeydown : undefined} />

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onclick={onClose}
  >
    <div
      bind:this={dialogEl}
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 id="edit-profile-title" class="text-xl font-semibold mb-4">Edit Profile</h2>

      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Profile Name</label>
        <input
          id="name"
          type="text"
          bind:this={firstFocusable}
          class="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          bind:value={newName}
          placeholder="Enter profile name"
        />
      </div>

      <div class="mb-4">
        <label for="avatar" class="block text-sm font-medium text-gray-700">Avatar URL</label>
        <input
          id="avatar"
          type="text"
          class="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          bind:value={newAvatarUrl}
          placeholder="Enter avatar URL or base64 image"
        />
      </div>

      <div class="flex justify-end gap-4">
        <button
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
    onclick={onClose}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onclick={saveProfile}
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
