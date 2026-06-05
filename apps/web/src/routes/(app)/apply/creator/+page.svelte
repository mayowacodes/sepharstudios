<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import {
    Loader2,
    Upload,
    User,
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    X,
    ExternalLink,
    Camera,
    AtSign,
    Globe,
    Mic,
    Link
  } from '@lucide/svelte';
  import { BUCKETS } from '$lib/constants/minio';

  // ── Svelte 5 $state runes ──────────────────────────────────────────────────
  let isLoading = $state(true);
  let isSaving = $state(false);
  let saveStatus = $state<'success' | 'error' | ''>('');
  let errorMessage = $state('');
  let applicationsOpen = $state(true);
  let applicationStatus = $state<'new' | 'pending' | 'approved' | 'rejected'>('new');

  type DocumentItem = { id: string; url: string; name: string; size?: number };

  let formData = $state({
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
  });

  // ── Derived helpers ─────────────────────────────────────────────────────────
  let isOrg = $derived(formData.creatorType === 'organization');
  let statusConfig = $derived(() => {
    switch (applicationStatus) {
      case 'approved':
        return { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', label: 'Approved', message: 'Your account is approved. You can access the creator portal.' };
      case 'rejected':
        return { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Rejected', message: 'Your last application was rejected. You can update and resubmit.' };
      case 'pending':
        return { icon: Clock, color: 'hsl(var(--secondary))', bg: 'rgba(255,191,0,0.08)', border: 'rgba(255,191,0,0.3)', label: 'Under Review', message: 'Your application is under review. We\'ll notify you soon.' };
      default:
        return { icon: FileText, color: 'hsl(var(--primary))', bg: 'rgba(255,94,14,0.08)', border: 'rgba(255,94,14,0.25)', label: 'New Application', message: 'Complete the form below and submit your application.' };
    }
  });

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  onMount(async () => {
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
              if (typeof doc === 'string') return { id: doc, url: doc, name: doc };
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

  // ── Actions ─────────────────────────────────────────────────────────────────
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
      setTimeout(() => (saveStatus = ''), 5000);
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

  function formatBytes(bytes?: number) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<svelte:head>
  <title>Creator Application - Sephar Studios</title>
  <meta name="description" content="Apply to publish content on Sephar Studios as an individual creator or organisation." />
</svelte:head>

<div class="apply-page">
  <!-- ── Page Header ─────────────────────────────────────────────── -->
  <div class="page-header">
    <div class="header-eyebrow">
      <span class="eyebrow-dot"></span>
      <span>Creator Programme</span>
    </div>
    <h1 class="page-title">Creator Application</h1>
    <p class="page-subtitle">
      Apply to publish content on Sephar Studios as an individual or organisation.
    </p>
  </div>

  {#if isLoading}
    <div class="loading-state">
      <Loader2 class="spin-icon" />
      <span>Loading application…</span>
    </div>

  {:else if !applicationsOpen}
    <div class="notice-banner notice-amber">
      <Clock class="notice-icon" />
      <div>
        <p class="notice-title">Applications Temporarily Closed</p>
        <p class="notice-body">Creator applications are currently paused. Please check back later.</p>
      </div>
    </div>

  {:else}
    <!-- ── Status Banner ──────────────────────────────────────────── -->
    {#if applicationStatus !== 'new'}
      {@const cfg = statusConfig()}
      <div class="status-banner" style="--status-color:{cfg.color};--status-bg:{cfg.bg};--status-border:{cfg.border}">
        <cfg.icon class="status-icon" />
        <div>
          <p class="status-label">{cfg.label}</p>
          <p class="status-message">{cfg.message}</p>
        </div>
      </div>
    {/if}

    <!-- ── Form Grid ──────────────────────────────────────────────── -->
    <div class="form-grid">

      <!-- Creator Type -->
      <section class="glass-section">
        <h2 class="section-title">
          <span class="section-number">01</span>
          Creator Type
        </h2>
        <div class="type-tiles">
          <label class="type-tile" class:type-tile--active={formData.creatorType === 'individual'}>
            <input
              type="radio"
              name="creatorType"
              value="individual"
              class="sr-only"
              bind:group={formData.creatorType}
            />
            <span class="tile-icon">
              <User />
            </span>
            <span class="tile-label">Individual</span>
            <span class="tile-desc">Solo creator, pastor, artist, or independent filmmaker.</span>
            {#if formData.creatorType === 'individual'}
              <span class="tile-check"><CheckCircle2 /></span>
            {/if}
          </label>

          <label class="type-tile" class:type-tile--active={formData.creatorType === 'organization'}>
            <input
              type="radio"
              name="creatorType"
              value="organization"
              class="sr-only"
              bind:group={formData.creatorType}
            />
            <span class="tile-icon">
              <Building2 />
            </span>
            <span class="tile-label">Organisation</span>
            <span class="tile-desc">Ministry, studio, church, NGO, or media company.</span>
            {#if formData.creatorType === 'organization'}
              <span class="tile-check"><CheckCircle2 /></span>
            {/if}
          </label>
        </div>
      </section>

      <!-- Primary Details -->
      <section class="glass-section">
        <h2 class="section-title">
          <span class="section-number">02</span>
          Primary Details
        </h2>
        <div class="field-grid">
          <div class="field-group">
            <Label for="displayName">Display Name</Label>
            <Input id="displayName" placeholder="Public creator name" bind:value={formData.displayName} />
          </div>
          <div class="field-group">
            <Label for="legalName">Legal Name</Label>
            <Input id="legalName" placeholder="Full legal name" bind:value={formData.legalName} />
          </div>
          <div class="field-group">
            <Label for="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" placeholder="contact@studio.com" bind:value={formData.contactEmail} />
          </div>
          <div class="field-group">
            <Label for="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" placeholder="+1 555 000 0000" bind:value={formData.contactPhone} />
          </div>
        </div>
        <div class="field-group mt-4">
          <Label for="bio">Short Bio / Mission Statement</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="Tell us about your mission, content focus, and what you hope to share on Sephar Studios…"
            bind:value={formData.bio}
          />
        </div>
      </section>

      <!-- Organisation Details (conditional) -->
      {#if isOrg}
        <section class="glass-section glass-section--org">
          <h2 class="section-title">
            <span class="section-number">03</span>
            Organisation Details
          </h2>
          <div class="field-grid">
            <div class="field-group">
              <Label for="organizationName">Organisation Name</Label>
              <Input id="organizationName" placeholder="Your organisation name" bind:value={formData.organizationName} />
            </div>
            <div class="field-group">
              <Label for="organizationType">Organisation Type</Label>
              <Input id="organizationType" placeholder="Studio, Ministry, NGO, Church…" bind:value={formData.organizationType} />
            </div>
            <div class="field-group">
              <Label for="organizationWebsite">Website</Label>
              <Input id="organizationWebsite" placeholder="https://your-org.org" bind:value={formData.organizationWebsite} />
            </div>
            <div class="field-group">
              <Label for="taxId">Tax ID (Optional)</Label>
              <Input id="taxId" placeholder="EIN / Tax registration number" bind:value={formData.taxId} />
            </div>
          </div>
          <div class="field-group mt-4">
            <Label for="organizationAddress">Registered Address</Label>
            <Textarea id="organizationAddress" rows={3} placeholder="Full registered address" bind:value={formData.organizationAddress} />
          </div>
        </section>
      {/if}

      <!-- Links & Portfolio -->
      <section class="glass-section">
        <h2 class="section-title">
          <span class="section-number">{isOrg ? '04' : '03'}</span>
          Links &amp; Portfolio
        </h2>
        <div class="field-grid">
          <div class="field-group social-field">
            <Label for="portfolioUrl">
              <Link class="social-field-icon" />
              Portfolio URL
            </Label>
            <Input id="portfolioUrl" placeholder="https://vimeo.com/your-channel" bind:value={formData.portfolioUrl} />
          </div>
          <div class="field-group social-field">
            <Label for="website">
              <Globe class="social-field-icon" />
              Website
            </Label>
            <Input id="website" placeholder="https://your-website.com" bind:value={formData.socialLinks.website} />
          </div>
          <div class="field-group social-field">
            <Label for="youtube">
              <ExternalLink class="social-field-icon social-field-icon--youtube" />
              YouTube
            </Label>
            <Input id="youtube" placeholder="https://youtube.com/…" bind:value={formData.socialLinks.youtube} />
          </div>
          <div class="field-group social-field">
            <Label for="instagram">
              <Camera class="social-field-icon social-field-icon--instagram" />
              Instagram
            </Label>
            <Input id="instagram" placeholder="https://instagram.com/…" bind:value={formData.socialLinks.instagram} />
          </div>
          <div class="field-group social-field">
            <Label for="facebook">
              <ExternalLink class="social-field-icon social-field-icon--facebook" />
              Facebook
            </Label>
            <Input id="facebook" placeholder="https://facebook.com/…" bind:value={formData.socialLinks.facebook} />
          </div>
          <div class="field-group social-field">
            <Label for="twitter">
              <AtSign class="social-field-icon" />
              Twitter / X
            </Label>
            <Input id="twitter" placeholder="https://x.com/…" bind:value={formData.socialLinks.twitter} />
          </div>
          <div class="field-group social-field">
            <Label for="podcast">
              <Mic class="social-field-icon social-field-icon--podcast" />
              Podcast
            </Label>
            <Input id="podcast" placeholder="https://podcasts.com/…" bind:value={formData.socialLinks.podcast} />
          </div>
        </div>

        <!-- Document Upload -->
        <div class="doc-upload-section">
          <div class="doc-upload-header">
            <Label class="doc-label">Verification Documents</Label>
            <p class="doc-hint">Upload ID, ministry licence, incorporation certificate, or any other supporting docs. PDF, DOC, JPG, PNG accepted.</p>
          </div>

          <label class="upload-trigger" for="doc-file-input">
            <Upload class="upload-trigger-icon" />
            <span>Choose files to upload</span>
            <input
              id="doc-file-input"
              type="file"
              multiple
              class="sr-only"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onchange={handleDocumentUpload}
            />
          </label>

          {#if formData.documents.length > 0}
            <ul class="doc-list">
              {#each formData.documents as doc, index}
                <li class="doc-item">
                  <FileText class="doc-item-icon" />
                  <div class="doc-item-info">
                    <a class="doc-item-name" href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a>
                    {#if doc.size}
                      <span class="doc-item-size">{formatBytes(doc.size)}</span>
                    {/if}
                  </div>
                  <button class="doc-remove" onclick={() => removeDocument(index)} aria-label="Remove {doc.name}">
                    <X />
                  </button>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="doc-empty">No documents uploaded yet.</p>
          {/if}
        </div>
      </section>

      <!-- Feedback banners -->
      {#if errorMessage}
        <div class="feedback-banner feedback-banner--error">
          <XCircle />
          <span>{errorMessage}</span>
        </div>
      {/if}
      {#if saveStatus === 'success'}
        <div class="feedback-banner feedback-banner--success">
          <CheckCircle2 />
          <span>Application submitted successfully. We'll be in touch!</span>
        </div>
      {/if}

      <!-- Submit Row -->
      <div class="submit-row">
        <p class="submit-hint">
          By submitting you agree to the Sephar Studios Creator Terms of Service.
        </p>
        <Button
          class="submit-btn"
          onclick={submitApplication}
          disabled={isSaving || applicationStatus === 'approved'}
        >
          {#if isSaving}
            <Loader2 class="h-4 w-4 animate-spin mr-2" />
            Submitting…
          {:else if applicationStatus === 'pending'}
            Update Application
          {:else if applicationStatus === 'rejected'}
            Resubmit Application
          {:else if applicationStatus === 'approved'}
            Already Approved
          {:else}
            Submit Application
          {/if}
        </Button>
      </div>

    </div><!-- /form-grid -->
  {/if}
</div>

<style>
  /* ── Page Shell ─────────────────────────────────────────────────────────── */
  .apply-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  /* ── Header ─────────────────────────────────────────────────────────────── */
  .page-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .header-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: hsl(var(--primary));
  }
  .eyebrow-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: hsl(var(--primary));
    box-shadow: 0 0 8px hsl(var(--primary));
  }
  .page-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.15;
    margin: 0;
  }
  .page-subtitle {
    color: hsl(var(--muted-foreground));
    font-size: 0.95rem;
    margin: 0;
  }

  /* ── Loading ─────────────────────────────────────────────────────────────── */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 5rem 0;
    color: hsl(var(--muted-foreground));
    font-size: 0.9rem;
  }
  :global(.spin-icon) {
    width: 2rem;
    height: 2rem;
    color: hsl(var(--primary));
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Notice banner ───────────────────────────────────────────────────────── */
  .notice-banner {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    border: 1px solid;
  }
  .notice-amber {
    background: rgba(255,191,0,0.07);
    border-color: rgba(255,191,0,0.3);
    color: hsl(var(--secondary));
  }
  :global(.notice-icon) { width: 1.25rem; height: 1.25rem; flex-shrink: 0; margin-top: 0.1rem; }
  .notice-title { font-weight: 700; font-size: 0.9rem; margin: 0 0 0.2rem; }
  .notice-body { font-size: 0.85rem; opacity: 0.85; margin: 0; }

  /* ── Status banner ───────────────────────────────────────────────────────── */
  .status-banner {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    background: var(--status-bg);
    border: 1px solid var(--status-border);
    color: var(--status-color);
  }
  :global(.status-icon) { width: 1.25rem; height: 1.25rem; flex-shrink: 0; margin-top: 0.15rem; }
  .status-label { font-weight: 700; font-size: 0.9rem; margin: 0 0 0.15rem; }
  .status-message { font-size: 0.85rem; opacity: 0.9; margin: 0; color: hsl(var(--muted-foreground)); }

  /* ── Glass Section card ──────────────────────────────────────────────────── */
  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .glass-section {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--blur-glass));
    -webkit-backdrop-filter: blur(var(--blur-glass));
    border: 1px solid var(--glass-border);
    border-radius: 1rem;
    padding: 1.75rem;
    box-shadow: var(--shadow-glass);
    transition: box-shadow 0.2s ease;
  }
  .glass-section:hover {
    box-shadow: var(--shadow-glass), 0 0 0 1px rgba(255,94,14,0.06);
  }
  .glass-section--org {
    border-color: rgba(255,191,0,0.2);
    background: linear-gradient(135deg, var(--glass-bg) 0%, rgba(255,191,0,0.03) 100%);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 1.25rem;
  }
  .section-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
    color: #fff;
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  /* ── Creator type tiles ──────────────────────────────────────────────────── */
  .type-tiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media (max-width: 500px) { .type-tiles { grid-template-columns: 1fr; } }

  .type-tile {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.25rem;
    border-radius: 0.75rem;
    border: 1.5px solid var(--glass-border);
    background: var(--surface-tint-1);
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    min-height: 44px;
  }
  .type-tile:hover {
    border-color: rgba(255,94,14,0.35);
    transform: translateY(-1px);
  }
  .type-tile--active {
    border-color: hsl(var(--primary));
    background: rgba(255,94,14,0.07);
    box-shadow: var(--shadow-glow);
  }
  :global(.tile-icon) {
    display: flex;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
    align-items: center;
    justify-content: center;
    margin-bottom: 0.25rem;
  }
  :global(.tile-icon svg) { width: 1rem; height: 1rem; color: #fff; }
  .tile-label { font-weight: 700; font-size: 0.9rem; color: hsl(var(--foreground)); }
  .tile-desc { font-size: 0.78rem; color: hsl(var(--muted-foreground)); line-height: 1.4; }
  .tile-check {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: hsl(var(--primary));
    display: flex;
  }
  :global(.tile-check svg) { width: 1rem; height: 1rem; }

  /* ── Field Grid ──────────────────────────────────────────────────────────── */
  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media (max-width: 600px) { .field-grid { grid-template-columns: 1fr; } }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .mt-4 { margin-top: 1rem; }

  /* Social field icons */
  .social-field :global(label) {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  :global(.social-field-icon) { width: 0.875rem; height: 0.875rem; opacity: 0.6; }
  :global(.social-field-icon--youtube) { color: #ff0000; opacity: 0.9; }
  :global(.social-field-icon--instagram) { color: #e1306c; opacity: 0.9; }
  :global(.social-field-icon--facebook) { color: #1877f2; opacity: 0.9; }
  :global(.social-field-icon--podcast) { color: hsl(var(--secondary)); opacity: 0.9; }

  /* ── Document Upload ─────────────────────────────────────────────────────── */
  .doc-upload-section {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .doc-upload-header { display: flex; flex-direction: column; gap: 0.25rem; }
  :global(.doc-label) { font-weight: 600; font-size: 0.875rem; }
  .doc-hint { font-size: 0.78rem; color: hsl(var(--muted-foreground)); margin: 0; }

  .upload-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.1rem;
    border-radius: 0.5rem;
    border: 1.5px dashed rgba(255,94,14,0.4);
    background: rgba(255,94,14,0.04);
    color: hsl(var(--primary));
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    width: fit-content;
    min-height: 44px;
  }
  .upload-trigger:hover {
    border-color: hsl(var(--primary));
    background: rgba(255,94,14,0.08);
    transform: translateY(-1px);
  }
  :global(.upload-trigger-icon) { width: 1rem; height: 1rem; }

  .doc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .doc-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.9rem;
    border-radius: 0.5rem;
    border: 1px solid var(--glass-border);
    background: var(--surface-tint-1);
  }
  :global(.doc-item-icon) { width: 1rem; height: 1rem; color: hsl(var(--primary)); flex-shrink: 0; }
  .doc-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
  .doc-item-name {
    font-size: 0.83rem;
    font-weight: 600;
    color: hsl(var(--primary));
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .doc-item-name:hover { text-decoration: underline; }
  .doc-item-size { font-size: 0.72rem; color: hsl(var(--muted-foreground)); }
  .doc-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    min-height: 1.5rem;
    border: none;
    background: transparent;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    border-radius: 0.25rem;
    transition: color 0.15s, background 0.15s;
    padding: 0;
  }
  .doc-remove:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
  :global(.doc-remove svg) { width: 0.875rem; height: 0.875rem; }
  .doc-empty { font-size: 0.8rem; color: hsl(var(--muted-foreground)); margin: 0; }

  /* ── Feedback Banners ─────────────────────────────────────────────────────── */
  .feedback-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: 0.75rem;
    border: 1px solid;
    font-size: 0.875rem;
    font-weight: 500;
    animation: slide-in 0.3s ease;
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .feedback-banner--error {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.3);
    color: #ef4444;
  }
  .feedback-banner--success {
    background: rgba(34,197,94,0.08);
    border-color: rgba(34,197,94,0.3);
    color: #22c55e;
  }
  :global(.feedback-banner svg) { width: 1rem; height: 1rem; flex-shrink: 0; }

  /* ── Submit Row ───────────────────────────────────────────────────────────── */
  .submit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .submit-hint {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
    flex: 1;
  }
  :global(.submit-btn) {
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%) !important;
    color: #fff !important;
    font-weight: 700;
    border: none !important;
    padding: 0.6rem 1.75rem;
    border-radius: 0.5rem;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s !important;
    box-shadow: 0 2px 16px rgba(255,94,14,0.3) !important;
  }
  :global(.submit-btn:hover:not(:disabled)) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 4px 24px rgba(255,94,14,0.45) !important;
  }
  :global(.submit-btn:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
