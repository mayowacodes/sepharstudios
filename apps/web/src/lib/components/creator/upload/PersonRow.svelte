<!--
  PersonRow — shared row for the cast/crew lists in MetadataStep.

  Renders a small avatar (or generated initial-circle), name input, role
  select, optional character-name input (for cast only), photo upload
  button, and a remove button.

  Smart photo reuse:
    - When the creator types a name, after a 500ms debounce we hit
      `/api/creator/people/lookup?name=...`. If a prior upload's
      cast/crew array contained a person with the same name AND a
      `photoUrl`, we auto-fill that URL. The creator can override by
      clicking the avatar and uploading a fresh image.
    - We DON'T auto-fill if the creator has already uploaded their own
      photo for this row (i.e. when the name was edited later) — that's
      what `userOverride` tracks.

  Photo upload reuses /api/files/sign with bucket=avatars (already on the
  allow-list), so no new presign endpoint is needed.
-->
<script lang="ts">
  import { X, Upload, User } from '@lucide/svelte';
  import type { CastMember, CrewMember, CastRole, CrewRole } from '$lib/types/creator';

  type AnyRole = CastRole | CrewRole;

  interface Props {
    kind: 'cast' | 'crew';
    value: CastMember | CrewMember;
    roleOptions: readonly AnyRole[];
    onChange: (next: CastMember | CrewMember) => void;
    onRemove: () => void;
  }

  let { kind, value, roleOptions, onChange, onRemove }: Props = $props();

  // When true, the creator has uploaded their own photo for this row;
  // we skip the auto-fill from /people/lookup so a re-typed name doesn't
  // wipe their explicit choice.
  let userOverride = $state(false);

  let lookupTimer: ReturnType<typeof setTimeout> | null = null;
  let isLookingUp = $state(false);

  // TypeScript can't narrow a spread of CastMember | CrewMember because
  // each branch has distinct property shapes (characterName lives only on
  // cast). Cast the value to a record for the spread, then back to the
  // union — the runtime shape stays correct because the parent decides
  // which kind this row is.
  function update(patch: Record<string, unknown>): void {
    onChange(({ ...(value as unknown as Record<string, unknown>), ...patch } as unknown) as CastMember | CrewMember);
  }

  function onNameInput(e: Event): void {
    const next = (e.currentTarget as HTMLInputElement).value;
    update({ name: next });
    // Debounce the lookup so we don't fire on every keystroke. 500ms is
    // long enough that the user is paused, short enough that the avatar
    // resolves before they finish typing the next field.
    if (lookupTimer) clearTimeout(lookupTimer);
    if (userOverride || !next.trim() || next.trim().length < 2) return;
    lookupTimer = setTimeout(() => void runLookup(next.trim()), 500);
  }

  async function runLookup(name: string): Promise<void> {
    isLookingUp = true;
    try {
      const res = await fetch(`/api/creator/people/lookup?name=${encodeURIComponent(name)}`);
      if (!res.ok) return;
      const body = (await res.json()) as { photoUrl?: string | null };
      // Only fill if (a) the row STILL has the same name (creator may
      // have edited in the meantime), (b) they haven't already uploaded
      // a photo, and (c) the lookup actually found something.
      if (body.photoUrl && value.name === name && !userOverride && !value.photoUrl) {
        update({ photoUrl: body.photoUrl });
      }
    } catch {
      // Lookup failures are best-effort; silently move on.
    } finally {
      isLookingUp = false;
    }
  }

  let photoUploading = $state(false);

  async function onPhotoFileSelected(e: Event): Promise<void> {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    photoUploading = true;
    try {
      // Step 1: presign against the avatars bucket using the existing
      // file-sign endpoint that already accepts that bucket name.
      const safeName = file.name.replace(/[^A-Za-z0-9._\-() ]/g, '_').slice(0, 200);
      const signRes = await fetch('/api/files/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: safeName, bucket: 'avatars', contentType: file.type })
      });
      if (!signRes.ok) throw new Error('Sign failed');
      const signed = (await signRes.json()) as { uploadUrl: string; objectName: string; bucket: string };

      // Step 2: PUT the file bytes directly to MinIO.
      const putRes = await fetch(signed.uploadUrl, { method: 'PUT', body: file });
      if (!putRes.ok) throw new Error('Upload failed');

      // Step 3: compose the public URL the watch-page avatar will fetch.
      // Mirrors the URL composition used elsewhere — base host pulled
      // from MINIO_PUBLIC_ENDPOINT via the storage helpers. For now we
      // store the same form the existing thumbnail flow uses (object
      // key path under the bucket), which the renderer resolves.
      const publicBase = (import.meta.env.VITE_MINIO_PUBLIC_ENDPOINT as string | undefined)
        || 'https://s3.sepharstudios.com';
      const photoUrl = `${publicBase}/${signed.bucket}/${signed.objectName}`;

      update({ photoUrl });
      userOverride = true;
    } catch (err) {
      console.error('[PersonRow] photo upload failed:', err);
    } finally {
      photoUploading = false;
      target.value = '';
    }
  }

  function clearPhoto(): void {
    update({ photoUrl: undefined });
    userOverride = true;  // creator chose to remove; don't re-auto-fill
  }

  // Initial letter for the fallback avatar — same pattern as the watch
  // page's cast/crew accordion (apps/web/src/routes/watch/[id]/+page.svelte
  // lines 211–213) so the visual language matches.
  const initial = $derived((value.name ?? '?').charAt(0).toUpperCase() || '?');
</script>

<div class="flex items-center gap-3 p-3 bg-white/4 border border-border/80 rounded-lg">
  <!-- Avatar (photo or initial-letter fallback) -->
  <div class="relative shrink-0">
    {#if value.photoUrl}
      <img
        src={value.photoUrl}
        alt=""
        class="w-10 h-10 rounded-full object-cover bg-zinc-700"
      />
    {:else}
      <div
        class="w-10 h-10 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center"
      >
        {initial}
      </div>
    {/if}
    <label
      class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:opacity-90 shadow"
      title={value.photoUrl ? 'Replace photo' : 'Upload photo'}
    >
      {#if photoUploading}
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      {:else}
        <Upload class="w-3 h-3" />
      {/if}
      <input
        type="file"
        accept="image/*"
        class="sr-only"
        onchange={onPhotoFileSelected}
        disabled={photoUploading}
      />
    </label>
  </div>

  <!-- Name + role + (cast) character name. Stacks on small screens so a
       row never overflows the wizard container. Static class names — the
       Tailwind JIT prunes anything it can't see as a complete literal. -->
  <div class="flex-1 grid grid-cols-1 {kind === 'cast' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-2 min-w-0">
    <div class="relative">
      <input
        type="text"
        placeholder="Name"
        value={value.name}
        oninput={onNameInput}
        class="w-full px-3 py-2 bg-white/4 border border-border/80 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {#if isLookingUp}
        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
          looking up…
        </span>
      {/if}
    </div>

    <select
      value={value.role}
      onchange={(e) => update({ role: (e.currentTarget as HTMLSelectElement).value as AnyRole })}
      class="px-3 py-2 bg-white/4 border border-border/80 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {#each roleOptions as option (option)}
        <option value={option} class="bg-card text-foreground">{option}</option>
      {/each}
    </select>

    {#if kind === 'cast'}
      <input
        type="text"
        placeholder="Character (optional)"
        value={(value as CastMember).characterName ?? ''}
        oninput={(e) => update({ characterName: (e.currentTarget as HTMLInputElement).value })}
        class="px-3 py-2 bg-white/4 border border-border/80 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    {/if}
  </div>

  <!-- Remove + (when a photo is set) clear-photo helpers -->
  <div class="flex items-center gap-1 shrink-0">
    {#if value.photoUrl}
      <button
        type="button"
        onclick={clearPhoto}
        class="text-[10px] text-gray-400 hover:text-white px-1"
        title="Remove photo"
      >
        <User class="w-3.5 h-3.5" />
      </button>
    {/if}
    <button
      type="button"
      onclick={onRemove}
      class="w-7 h-7 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-300 flex items-center justify-center"
      title="Remove this entry"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</div>
