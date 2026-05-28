import { browser } from '$app/environment';
import { goto } from '$app/navigation';

const PORTAL_SUBDOMAINS = ['admin.', 'creator.', 'creators.', 'kids.'] as const;

function isPortalSubdomain(hostname: string): boolean {
  return PORTAL_SUBDOMAINS.some((sub) => hostname.startsWith(sub));
}

function apexOrigin(hostname: string, protocol: string): string {
  const parts = hostname.split('.');
  const apex = parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  return `${protocol}//${apex}`;
}

export function mainSiteHref(): string {
  if (!browser) return '/';
  const { hostname, protocol } = window.location;
  if (isPortalSubdomain(hostname)) return `${apexOrigin(hostname, protocol)}/`;
  return '/';
}

export function navigateToMainSite(): void {
  if (!browser) {
    void goto('/');
    return;
  }
  const { hostname, protocol } = window.location;
  if (isPortalSubdomain(hostname)) {
    window.location.href = `${apexOrigin(hostname, protocol)}/`;
    return;
  }
  void goto('/');
}
