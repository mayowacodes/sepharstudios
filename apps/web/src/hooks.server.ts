import { auth, type User, type Session } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { db } from "$lib/db/drizzle";
import { session as sessionTable } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export async function handle({ event, resolve }) {
  const rawHost = event.request.headers.get('x-forwarded-host')
    || event.request.headers.get('host')
    || '';
  const host = rawHost.split(',')[0].trim().toLowerCase();
  const hostname = host.split(':')[0];
  const ua = event.request.headers.get('user-agent') || '';
  
  // 1. Device Detection
  const isTV = /TV|Large Screen|SmartTV|AppleTV|AndroidTV|STB/i.test(ua);
  const isTablet = /Tablet|iPad|PlayBook|Silk/i.test(ua);
  const isMobile = /Mobi/i.test(ua) && !isTablet;
  const isDesktop = !isTV && !isTablet && !isMobile;

  const deviceType = isTV ? 'tv' : isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
  event.locals.deviceType = deviceType;

  // 2. Subdomain Detection
  const isCreatorsSubdomain = hostname.startsWith('creator.') || hostname.startsWith('creators.');
  const isAdminSubdomain = hostname.startsWith('admin.');
  const isKidsSubdomain = hostname.startsWith('kids.');
  
  event.locals.subdomain = isCreatorsSubdomain ? 'creator' : 
                         isAdminSubdomain ? 'admin' : 
                         isKidsSubdomain ? 'kids' : 'app';

  const path = event.url.pathname;
  const isAuthPath = path.startsWith('/auth') || path.startsWith('/api/auth');

  // 3. Path & Subdomain Consistency — redirect to correct subdomain instead of 404
  // This handles the case where better-auth post-login redirect lands on the main domain
  if (path.startsWith('/admin') && !isAdminSubdomain && !hostname.includes('localhost')) {
    return Response.redirect(`https://admin.sepharstudios.com${path}`, 307);
  }
  if (path.startsWith('/creator') && !isCreatorsSubdomain && !hostname.includes('localhost')) {
    return Response.redirect(`https://creators.sepharstudios.com${path}`, 307);
  }

  // 4. Session Handling
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: event.request.headers,
    });
  } catch (error) {
    console.error('Failed to load auth session:', error);
  }

  if (session) {
    event.locals.session = session.session as Session;
    event.locals.user = session.user as User;

    // 4.1 Persist deviceType to DB if it's new/different
    // We only do this if it's not already set correctly in the DB
    if (event.locals.session.deviceType !== deviceType) {
      // Async update - don't block the request
      db.update(sessionTable)
        .set({ deviceType })
        .where(eq(sessionTable.id, event.locals.session.id))
        .execute()
        .catch(err => console.error('Failed to update session deviceType:', err));
    }
  } else {
    event.locals.session = undefined;
    event.locals.user = undefined;
  }

  // 4.2 Expose a session-getter to API endpoints. Many endpoints call
  // `locals.auth.getSession()` (the wrapper pattern documented in app.d.ts).
  // Without this assignment the call crashes with "undefined is not an object".
  event.locals.auth = {
    getSession: async () => session as { user: User; session: Session } | null
  };

  // 5. Active Profile — read from cookie set on profile selection
  event.locals.activeProfileId = event.cookies.get('activeProfileId') || undefined;

  const user = event.locals.user;

  // Helper: build the apex URL ("sepharstudios.com") so we can bounce logged-in
  // users who lack the required role *off* the portal subdomain instead of looping
  // them through /auth/login on the same subdomain forever.
  const apexHost = hostname.includes('localhost')
    ? hostname
    : hostname.split('.').slice(-2).join('.');
  const apexOrigin = `https://${apexHost}`;

  // 5. RBAC & Platform Enforcement — skip for auth flow so the login page itself doesn't loop
  // ADMIN PORTAL
  if (isAdminSubdomain && !isAuthPath) {
    if (!user) {
      // Not signed in → send to login. Login is on the apex so the form has access
      // to the auth API without cross-origin gymnastics, then comes back to /admin.
      return Response.redirect(`${apexOrigin}/auth/login?redirectTo=${encodeURIComponent('https://admin.sepharstudios.com/admin')}`, 307);
    }
    if (user.role !== 'admin') {
      // Signed in but wrong role → bounce to apex denial page with a clear
      // message instead of silently dumping them on the home page.
      return Response.redirect(`${apexOrigin}/access-denied?reason=admin`, 307);
    }
    // Platform Check: No Admin on TV or Mobile
    if (deviceType === 'tv' || deviceType === 'mobile') {
      return new Response('Access Denied: Admin portal is not available on this device.', { status: 403 });
    }
  }

  // CREATOR PORTAL
  if (isCreatorsSubdomain && !isAuthPath) {
    if (!user) {
      return Response.redirect(`${apexOrigin}/auth/login?redirectTo=${encodeURIComponent('https://creators.sepharstudios.com/creator')}`, 307);
    }
    if (user.role !== 'creator' && user.role !== 'admin') {
      // Signed in but not a creator → bounce to the access-denied page which
      // explains the situation and links to /apply/creator. Better UX than
      // silently dropping them on the application form with no context.
      return Response.redirect(`${apexOrigin}/access-denied?reason=creator`, 307);
    }
    // Platform Check: No Creator Tools on TV or Mobile
    if (deviceType === 'tv' || deviceType === 'mobile') {
      return new Response('Access Denied: Creator tools are not available on this device.', { status: 403 });
    }
  }

  // 6. Root Redirection
  if (isCreatorsSubdomain && path === '/') {
    return Response.redirect(`${event.url.origin}/creator`, 307);
  }
  if (isAdminSubdomain && path === '/') {
    return Response.redirect(`${event.url.origin}/admin`, 307);
  }
  if (isKidsSubdomain && path === '/') {
    return Response.redirect(`${event.url.origin}/kids`, 307);
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
