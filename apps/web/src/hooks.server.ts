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

  // 3. Path & Subdomain Consistency (Prevent cross-access)
  if (path.startsWith('/admin') && !isAdminSubdomain && !hostname.includes('localhost')) {
    return new Response('Not Found', { status: 404 });
  }
  if (path.startsWith('/creator') && !isCreatorsSubdomain && !hostname.includes('localhost')) {
    return new Response('Not Found', { status: 404 });
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

  // 5. Active Profile — read from cookie set on profile selection
  event.locals.activeProfileId = event.cookies.get('activeProfileId') || undefined;

  const user = event.locals.user;

  // 5. RBAC & Platform Enforcement
  // ADMIN PORTAL
  if (isAdminSubdomain) {
    // Role Check
    if (!user || user.role !== 'admin') {
      return Response.redirect(`${event.url.origin}/auth/login`, 307);
    }
    // Platform Check: No Admin on TV or Mobile
    if (deviceType === 'tv' || deviceType === 'mobile') {
      return new Response('Access Denied: Admin portal is not available on this device.', { status: 403 });
    }
  }

  // CREATOR PORTAL
  if (isCreatorsSubdomain) {
    // Role Check: Creators or Admins only
    if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
      return Response.redirect(`${event.url.origin}/auth/login`, 307);
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
