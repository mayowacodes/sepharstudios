<script lang="ts">
  import type { Profile } from '$lib/types/types';

  export let isOpen = false;
  export let profile: Pick<Profile, 'id' | 'name' | 'avatarUrl'>;
  export let onSave: (updatedProfile: Pick<Profile, 'id' | 'name' | 'avatarUrl'>) => void;
  export let onClose: () => void;

  let newName = profile.name;
  let newAvatarUrl = profile.avatarUrl ?? '';

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

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>

      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Profile Name</label>
        <input
          id="name"
          type="text"
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
          on:click={onClose}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          on:click={saveProfile}
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
