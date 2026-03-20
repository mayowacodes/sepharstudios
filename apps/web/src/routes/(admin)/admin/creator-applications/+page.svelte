<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Loader2 } from '@lucide/svelte';

  type Application = {
    id: string;
    userId: string;
    creatorType: string;
    displayName: string | null;
    legalName: string | null;
    organizationName: string | null;
    organizationType: string | null;
    organizationWebsite: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    bio: string | null;
    portfolioUrl: string | null;
    socialLinks?: Record<string, string> | null;
    documents?: Array<{ id: string; url: string; name: string; size?: number }> | string[] | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    userName: string | null;
    userEmail: string | null;
  };

  let applications = $state<Application[]>([]);
  let selectedApplication = $state<Application | null>(null);
  let showModal = $state(false);
  let statusFilter = $state<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  let isLoading = $state(true);
  let errorMessage = $state('');

  const loadApplications = async () => {
    isLoading = true;
    errorMessage = '';
    try {
      const res = await fetch(`/api/admin/creator-applications?status=${statusFilter}`);
      if (!res.ok) throw new Error('Failed to load applications');
      applications = await res.json();
    } catch (err: any) {
      errorMessage = err?.message || 'Failed to load applications';
    } finally {
      isLoading = false;
    }
  };

  onMount(loadApplications);

  const reviewApplication = async (id: string, status: 'approved' | 'rejected') => {
    const reason = status === 'rejected' ? prompt('Reason for rejection (optional):') ?? '' : '';
    try {
      const res = await fetch(`/api/admin/creator-applications/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason })
      });
      if (!res.ok) throw new Error('Failed to update application');
      await loadApplications();
    } catch (err: any) {
      alert(err?.message || 'Failed to update application');
    }
  };

  function openApplication(app: Application) {
    selectedApplication = app;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedApplication = null;
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-bold text-white">Creator Applications</h1>
    <p class="text-gray-300">Review and approve creators before they can publish content.</p>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <label class="text-sm text-gray-300">Status</label>
    <select
      class="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
      bind:value={statusFilter}
      onchange={loadApplications}
    >
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-16">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>
  {:else if errorMessage}
    <div class="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">{errorMessage}</div>
  {:else if applications.length === 0}
    <div class="rounded-lg border border-white/10 bg-black/20 p-6 text-gray-300">
      No applications found.
    </div>
  {:else}
    <div class="overflow-x-auto rounded-lg border border-white/10 bg-black/30">
      <table class="w-full text-left text-sm text-gray-200">
        <thead class="bg-black/40 text-xs uppercase text-gray-400">
          <tr>
            <th class="px-4 py-3">Applicant</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Organization</th>
            <th class="px-4 py-3">Submitted</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each applications as app}
            <tr class="border-t border-white/5">
              <td class="px-4 py-3">
                <div class="font-medium text-white">{app.displayName || app.userName || 'Creator'}</div>
                <div class="text-xs text-gray-400">{app.userEmail || app.contactEmail}</div>
              </td>
              <td class="px-4 py-3 capitalize">{app.creatorType}</td>
              <td class="px-4 py-3">{app.organizationName || '—'}</td>
              <td class="px-4 py-3">{new Date(app.createdAt).toLocaleDateString()}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onclick={() => openApplication(app)}>View</Button>
                  {#if app.status === 'pending'}
                    <Button size="sm" onclick={() => reviewApplication(app.id, 'approved')}>Approve</Button>
                    <Button size="sm" variant="destructive" onclick={() => reviewApplication(app.id, 'rejected')}>Reject</Button>
                  {:else}
                    <span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-gray-300">{app.status}</span>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showModal && selectedApplication}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div class="w-full max-w-3xl rounded-xl border border-white/10 bg-black/90 p-6 text-gray-200">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">
            {selectedApplication.displayName || selectedApplication.userName || 'Creator'}
          </h2>
          <div class="text-sm text-gray-400">{selectedApplication.userEmail || selectedApplication.contactEmail}</div>
        </div>
        <button class="text-gray-400 hover:text-white" onclick={closeModal}>✕</button>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <div class="text-xs uppercase text-gray-500">Creator Type</div>
          <div class="mt-1 capitalize">{selectedApplication.creatorType}</div>
        </div>
        <div>
          <div class="text-xs uppercase text-gray-500">Organization</div>
          <div class="mt-1">{selectedApplication.organizationName || '—'}</div>
        </div>
        <div>
          <div class="text-xs uppercase text-gray-500">Organization Type</div>
          <div class="mt-1">{selectedApplication.organizationType || '—'}</div>
        </div>
        <div>
          <div class="text-xs uppercase text-gray-500">Website</div>
          <div class="mt-1">{selectedApplication.organizationWebsite || '—'}</div>
        </div>
        <div class="md:col-span-2">
          <div class="text-xs uppercase text-gray-500">Bio</div>
          <div class="mt-1 text-sm">{selectedApplication.bio || '—'}</div>
        </div>
        <div class="md:col-span-2">
          <div class="text-xs uppercase text-gray-500">Portfolio</div>
          <div class="mt-1">{selectedApplication.portfolioUrl || '—'}</div>
        </div>
      </div>

      <div class="mt-6">
        <div class="text-xs uppercase text-gray-500">Documents</div>
        {#if selectedApplication.documents && selectedApplication.documents.length > 0}
          <div class="mt-2 space-y-2">
            {#each selectedApplication.documents as doc}
              {@const docUrl = typeof doc === 'string' ? doc : doc.url}
              {@const docName = typeof doc === 'string' ? doc : doc.name}
              <a class="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-blue-300 hover:underline" href={docUrl} target="_blank" rel="noreferrer">{docName}</a>
            {/each}
          </div>
        {:else}
          <div class="mt-2 text-sm text-gray-400">No documents uploaded.</div>
        {/if}
      </div>

      <div class="mt-6 flex justify-end gap-2">
        {#if selectedApplication.status === 'pending'}
          <Button onclick={() => reviewApplication(selectedApplication.id, 'approved')}>Approve</Button>
          <Button variant="destructive" onclick={() => reviewApplication(selectedApplication.id, 'rejected')}>Reject</Button>
        {:else}
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-gray-300">{selectedApplication.status}</span>
        {/if}
      </div>
    </div>
  </div>
{/if}
