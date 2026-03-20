<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Loader2, Upload } from '@lucide/svelte';
  import { BUCKETS } from '$lib/constants/minio';

  let isLoading = true;
  let isSaving = false;
  let saveStatus: 'success' | 'error' | '' = '';
  let errorMessage = '';
  let applicationsOpen = true;
  let applicationStatus: 'new' | 'pending' | 'approved' | 'rejected' = 'new';

  type DocumentItem = { id: string; url: string; name: string; size?: number };

  let formData = {
    creatorType: 'individual',
    displayName: '',
    legalName: '',
    organizationName: '',
    organizationType: '',
    organizationWebsite: '',
    organizationAddress: '',
    taxId: '',
    contactEmail: '',
    contactPhone: '',
    bio: '',
    portfolioUrl: '',
    socialLinks: {
      youtube: '',
      facebook: '',
      instagram: '',
      twitter: '',
      website: '',
      podcast: ''
    },
    documents: [] as DocumentItem[]
  };

  onMount(async () => {
    isLoading = true;
    try {
      const res = await fetch('/api/creator/application');
      if (!res.ok) throw new Error('Failed to load application');
      const data = await res.json();
      applicationsOpen = data.applicationsOpen ?? true;

      if (data.application) {
        const app = data.application;
        applicationStatus = app.status;
        const docs = Array.isArray(app.documents)
          ? app.documents.map((doc: any) => {
              if (typeof doc === 'string') {
                return { id: doc, url: doc, name: doc };
              }
              return { id: doc.id, url: doc.url, name: doc.name, size: doc.size };
            })
          : [];

        formData = {
          creatorType: app.creatorType ?? 'individual',
          displayName: app.displayName ?? '',
          legalName: app.legalName ?? '',
          organizationName: app.organizationName ?? '',
          organizationType: app.organizationType ?? '',
          organizationWebsite: app.organizationWebsite ?? '',
          organizationAddress: app.organizationAddress ?? '',
          taxId: app.taxId ?? '',
          contactEmail: app.contactEmail ?? '',
          contactPhone: app.contactPhone ?? '',
          bio: app.bio ?? '',
          portfolioUrl: app.portfolioUrl ?? '',
          socialLinks: {
            youtube: app.socialLinks?.youtube ?? '',
            facebook: app.socialLinks?.facebook ?? '',
            instagram: app.socialLinks?.instagram ?? '',
            twitter: app.socialLinks?.twitter ?? '',
            website: app.socialLinks?.website ?? '',
            podcast: app.socialLinks?.podcast ?? ''
          },
          documents: docs
        };
      }
    } catch (err: any) {
      errorMessage = err?.message || 'Failed to load application';
    } finally {
      isLoading = false;
    }
  });

  async function submitApplication() {
    isSaving = true;
    saveStatus = '';
    errorMessage = '';
    try {
      const payload = {
        creatorType: formData.creatorType,
        displayName: formData.displayName.trim() || null,
        legalName: formData.legalName.trim() || null,
        organizationName: formData.organizationName.trim() || null,
        organizationType: formData.organizationType.trim() || null,
        organizationWebsite: formData.organizationWebsite.trim() || null,
        organizationAddress: formData.organizationAddress.trim() || null,
        taxId: formData.taxId.trim() || null,
        contactEmail: formData.contactEmail.trim() || null,
        contactPhone: formData.contactPhone.trim() || null,
        bio: formData.bio.trim() || null,
        portfolioUrl: formData.portfolioUrl.trim() || null,
        socialLinks: formData.socialLinks,
        documents: formData.documents.length ? formData.documents : null
      };

      const res = await fetch('/api/creator/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const response = await res.json();
      if (!res.ok) throw new Error(response?.error || 'Failed to submit application');
      saveStatus = 'success';
      applicationStatus = response?.application?.status ?? 'pending';
    } catch (err: any) {
      saveStatus = 'error';
      errorMessage = err?.message || 'Failed to submit application';
    } finally {
      isSaving = false;
      setTimeout(() => (saveStatus = ''), 3000);
    }
  }

  async function handleDocumentUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        form.append('bucket', BUCKETS.CREATOR_DOCS);
        const res = await fetch('/api/files', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Upload failed');
        formData.documents = [
          ...formData.documents,
          { id: data.dbId ?? data.id, url: data.directUrl ?? data.url, name: data.filename, size: data.size }
        ];
      }
    } catch (err: any) {
      errorMessage = err?.message || 'Failed to upload document';
    } finally {
      input.value = '';
    }
  }

  function removeDocument(index: number) {
    formData.documents = formData.documents.filter((_, i) => i !== index);
  }
</script>

<svelte:head>
  <title>Creator Application - Sephar Studios</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-white">Creator Application</h1>
    <p class="text-gray-300 mt-2">Apply to publish content on Sephar Studios as an individual or organization.</p>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-16">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>
  {:else}
    {#if !applicationsOpen}
      <div class="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
        Creator applications are currently closed. Please check back later.
      </div>
    {:else}
      <div class="mb-6 rounded-lg border border-white/10 bg-black/20 p-4">
        <div class="text-sm text-gray-300">Application Status</div>
        <div class="mt-1 text-lg font-semibold capitalize text-white">{applicationStatus}</div>
        {#if applicationStatus === 'approved'}
          <p class="text-green-300 text-sm mt-2">Your account is approved. You can access the creator portal.</p>
        {:else if applicationStatus === 'rejected'}
          <p class="text-red-300 text-sm mt-2">Your last application was rejected. You can update and resubmit.</p>
        {:else if applicationStatus === 'pending'}
          <p class="text-yellow-300 text-sm mt-2">Your application is under review.</p>
        {/if}
      </div>

      <div class="grid gap-8">
        <div class="rounded-lg border border-white/10 bg-black/30 p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Creator Type</h2>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-2 text-gray-200">
              <input type="radio" name="creatorType" value="individual" bind:group={formData.creatorType} />
              Individual
            </label>
            <label class="flex items-center gap-2 text-gray-200">
              <input type="radio" name="creatorType" value="organization" bind:group={formData.creatorType} />
              Organization
            </label>
          </div>
        </div>

        <div class="rounded-lg border border-white/10 bg-black/30 p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Primary Details</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="displayName">Display Name</Label>
              <Input id="displayName" placeholder="Public creator name" bind:value={formData.displayName} />
            </div>
            <div class="space-y-2">
              <Label for="legalName">Legal Name</Label>
              <Input id="legalName" placeholder="Legal name" bind:value={formData.legalName} />
            </div>
            <div class="space-y-2">
              <Label for="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" placeholder="contact@studio.com" bind:value={formData.contactEmail} />
            </div>
            <div class="space-y-2">
              <Label for="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" placeholder="+1 555 000 0000" bind:value={formData.contactPhone} />
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <Label for="bio">Short Bio / Mission</Label>
            <Textarea id="bio" rows={4} placeholder="Tell us about your mission and content focus." bind:value={formData.bio} />
          </div>
        </div>

        {#if formData.creatorType === 'organization'}
          <div class="rounded-lg border border-white/10 bg-black/30 p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Organization Details</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="organizationName">Organization Name</Label>
                <Input id="organizationName" bind:value={formData.organizationName} />
              </div>
              <div class="space-y-2">
                <Label for="organizationType">Organization Type</Label>
                <Input id="organizationType" placeholder="Studio, Ministry, NGO, etc." bind:value={formData.organizationType} />
              </div>
              <div class="space-y-2">
                <Label for="organizationWebsite">Website</Label>
                <Input id="organizationWebsite" placeholder="https://your-org.org" bind:value={formData.organizationWebsite} />
              </div>
              <div class="space-y-2">
                <Label for="taxId">Tax ID (Optional)</Label>
                <Input id="taxId" bind:value={formData.taxId} />
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <Label for="organizationAddress">Organization Address</Label>
              <Textarea id="organizationAddress" rows={3} bind:value={formData.organizationAddress} />
            </div>
          </div>
        {/if}

        <div class="rounded-lg border border-white/10 bg-black/30 p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Links & Portfolio</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="portfolioUrl">Portfolio URL</Label>
              <Input id="portfolioUrl" placeholder="https://vimeo.com/your-channel" bind:value={formData.portfolioUrl} />
            </div>
            <div class="space-y-2">
              <Label for="website">Website</Label>
              <Input id="website" placeholder="https://your-website.com" bind:value={formData.socialLinks.website} />
            </div>
            <div class="space-y-2">
              <Label for="youtube">YouTube</Label>
              <Input id="youtube" placeholder="https://youtube.com/..." bind:value={formData.socialLinks.youtube} />
            </div>
            <div class="space-y-2">
              <Label for="instagram">Instagram</Label>
              <Input id="instagram" placeholder="https://instagram.com/..." bind:value={formData.socialLinks.instagram} />
            </div>
            <div class="space-y-2">
              <Label for="facebook">Facebook</Label>
              <Input id="facebook" placeholder="https://facebook.com/..." bind:value={formData.socialLinks.facebook} />
            </div>
            <div class="space-y-2">
              <Label for="twitter">Twitter / X</Label>
              <Input id="twitter" placeholder="https://x.com/..." bind:value={formData.socialLinks.twitter} />
            </div>
            <div class="space-y-2">
              <Label for="podcast">Podcast</Label>
              <Input id="podcast" placeholder="https://podcasts.com/..." bind:value={formData.socialLinks.podcast} />
            </div>
          </div>
          <div class="mt-6 space-y-3">
            <Label class="text-white">Verification Documents</Label>
            <div class="flex items-center gap-3">
              <label class="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer">
                <Upload class="h-4 w-4" />
                Upload Documents
                <input type="file" multiple class="hidden" accept=".pdf,.doc,.docx,.png,.jpg" onchange={handleDocumentUpload} />
              </label>
              <span class="text-xs text-gray-400">PDF, DOC, JPG, PNG</span>
            </div>
            {#if formData.documents.length === 0}
              <div class="text-xs text-gray-400">No documents uploaded yet.</div>
            {:else}
              <div class="space-y-2">
                {#each formData.documents as doc, index}
                  <div class="flex items-center justify-between rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-200">
                    <a class="text-blue-300 hover:underline" href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a>
                    <button class="text-red-300 hover:text-red-200" onclick={() => removeDocument(index)}>Remove</button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        {#if errorMessage}
          <div class="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">{errorMessage}</div>
        {/if}
        {#if saveStatus === 'success'}
          <div class="rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-green-200">Application saved.</div>
        {/if}
        {#if saveStatus === 'error'}
          <div class="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">Failed to save application.</div>
        {/if}

        <div class="flex justify-end">
          <Button onclick={submitApplication} disabled={isSaving || applicationStatus === 'approved'}>
            {#if isSaving}<Loader2 class="h-4 w-4 animate-spin mr-2" />Submitting...{:else}Submit Application{/if}
          </Button>
        </div>
      </div>
    {/if}
  {/if}
</div>
