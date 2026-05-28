<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { ShieldAlert, X, Mail } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Constants } from '$lib/constants';

  // Read once from the URL; the hook bounces wrong-role users here with ?denied=admin.
  const denied = $derived(page.url.searchParams.get('denied'));
  let dismissed = $state(false);

  function dismiss() {
    dismissed = true;
    // Strip the query string so a refresh doesn't reopen the banner.
    const url = new URL(page.url.href);
    url.searchParams.delete('denied');
    goto(url.pathname + (url.search || ''), { replaceState: true, keepFocus: true, noScroll: true });
  }
</script>

{#if denied === 'admin' && !dismissed}
  <div class="access-denied-banner" role="alert">
    <div class="access-denied-inner">
      <div class="access-denied-icon">
        <ShieldAlert class="w-5 h-5" />
      </div>
      <div class="access-denied-body">
        <p class="access-denied-title">Admin portal access required</p>
        <p class="access-denied-text">
          Your account doesn't have admin privileges. Reach out to the support team and we'll review your request.
        </p>
      </div>
      <div class="access-denied-actions">
        <Button size="sm" href={`mailto:${Constants.SUPPORTEMAIL}?subject=Admin%20access%20request`}>
          <Mail class="w-4 h-4 mr-1.5" /> Contact support
        </Button>
        <button type="button" onclick={dismiss} class="access-denied-close" aria-label="Dismiss notice">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .access-denied-banner {
    position: relative;
    z-index: 20;
    background: linear-gradient(90deg, rgba(255, 94, 14, 0.12), rgba(255, 191, 0, 0.08));
    border-bottom: 1px solid rgba(255, 94, 14, 0.35);
    color: white;
  }
  .access-denied-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.75rem 1rem;
  }
  .access-denied-icon {
    color: #FF8C42;
    flex-shrink: 0;
  }
  .access-denied-body { flex: 1; min-width: 0; }
  .access-denied-title {
    font-size: 0.85rem;
    font-weight: 700;
    margin: 0;
    color: white;
  }
  .access-denied-text {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0.15rem 0 0;
    line-height: 1.35;
  }
  .access-denied-actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }
  .access-denied-close {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.55);
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .access-denied-close:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
    border-color: rgba(255, 255, 255, 0.25);
  }
  @media (max-width: 640px) {
    .access-denied-inner { flex-wrap: wrap; }
    .access-denied-actions { width: 100%; justify-content: flex-end; }
  }
</style>
