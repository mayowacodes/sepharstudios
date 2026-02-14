<script lang="ts">
  import { Sheet, SheetContent, SheetTrigger } from '$lib/components/ui/sheet';
  import { ChevronDown, Pencil, PlusCircle } from 'lucide-svelte';
  import { currentProfile } from '$lib/stores/profileStores';
  import { writable } from 'svelte/store';
  import EditProfileModal from '$lib/components/profile/EditProfileModal.svelte';
  import AddProfileModal from '$lib/components/profile/AddProfileModal.svelte';
  import type { Profile } from '$lib/types/types';

  const maxProfiles = 8;

  let open = false;
  let editProfile: Profile | null = null;
  let showAddModal = false;

  const profileSlots = writable<Profile[]>([
    { id: '1', type: 'adult', name: 'Dad', avatar: '', parental: false },
    { id: '2', type: 'adult', name: 'Mom', avatar: '', parental: false },
    { id: '3', type: 'adult', name: 'John', avatar: '', parental: false },
    { id: '4', type: 'adult', name: 'Jane', avatar: '', parental: false },
    { id: '5', type: 'teen', name: 'Alex', avatar: '', parental: true },
    { id: '6', type: 'teen', name: 'Sam', avatar: '', parental: true },
    { id: '7', type: 'kid', name: 'Lily', avatar: '', parental: true },
    { id: '8', type: 'kid', name: 'Tommy', avatar: '', parental: true }
  ]);

  function switchProfile(profile: Profile) {
    currentProfile.set(profile);
    open = false;
  }

  function updateProfile(updated: Profile) {
    profileSlots.update((slots) =>
      slots.map((p) => (p.id === updated.id ? updated : p))
    );
    editProfile = null;
  }

  function addProfile(newProfile: Omit<Profile, 'id'>) {
    profileSlots.update((slots) => [...slots, { ...newProfile, id: Date.now().toString() }]);
    showAddModal = false;
  }
</script>

<Sheet bind:open>
  <SheetTrigger class="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition cursor-pointer">
    <span>{$currentProfile?.name ?? 'Select Profile'}</span>
    <ChevronDown class="w-4 h-4" />
  </SheetTrigger>

  <SheetContent side="bottom" class="p-6 sm:max-w-md">
    <h2 class="text-lg font-semibold mb-4">Manage Profiles</h2>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
      {#each $profileSlots as profile (profile.id)}
        <div class="flex flex-col items-center gap-2 p-3 bg-muted rounded-xl hover:bg-muted/70 transition cursor-pointer relative">
          <div class="relative group">
            <button
              class="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-white text-lg font-bold"
              on:click={() => switchProfile(profile)}
            >
              {profile.name[0]}
            </button>
            <Pencil
              class="w-4 h-4 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm cursor-pointer group-hover:scale-110"
              on:click={() => (editProfile = profile)}
            />
          </div>
          <span class="text-sm">{profile.name}</span>
          <span class="text-xs text-muted-foreground capitalize">
            {profile.type} {profile.parental ? '(Parental)' : ''}
          </span>
        </div>
      {/each}
    </div>

    {#if $profileSlots.length < maxProfiles}
      <button
        class="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        on:click={() => (showAddModal = true)}
      >
        <PlusCircle class="w-4 h-4" /> Add New Profile
      </button>
    {:else}
      <p class="text-xs text-muted-foreground">Maximum of 8 profiles reached.</p>
    {/if}
  </SheetContent>
</Sheet>

{#if editProfile}
  <EditProfileModal
    profile={{ id: editProfile.id, name: editProfile.name, avatarUrl: editProfile.avatar }}
    onSave={(updated) => updateProfile({ ...(editProfile as Profile), ...updated })}
    onClose={() => (editProfile = null)}
  />
{/if}

{#if showAddModal}
<AddProfileModal
  onAdd={(newProfile) => addProfile(newProfile)}
  onClose={() => (showAddModal = false)}
/>
{/if}
