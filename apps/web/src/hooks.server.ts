import { auth, type User } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";

export async function handle({ event, resolve }) {
  const host = event.request.headers.get('host') || '';
  
  // 1. Detect Subdomain
  const isCreatorsSubdomain = host.startsWith('creators.');
  const isAdminSubdomain = host.startsWith('admin.');
  const isKidsSubdomain = host.startsWith('kids.');
  
  // Set subdomain in locals for components to use
  event.locals.subdomain = isCreatorsSubdomain ? 'creator' : 
                         isAdminSubdomain ? 'admin' : 
                         isKidsSubdomain ? 'kids' : 'app';

  // 2. Path Guarding (Security)
  // Prevent cross-access: e.g., sepharstudios.com/admin or creators.sepharstudios.com/admin
  const path = event.url.pathname;

  // Block /admin if not on admin subdomain or localhost
  if (path.startsWith('/admin') && !isAdminSubdomain && !host.includes('localhost')) {
    return new Response('Not Found', { status: 404 });
  }

  // Block /creator if not on creators subdomain or localhost
  if (path.startsWith('/creator') && !isCreatorsSubdomain && !host.includes('localhost')) {
    return new Response('Not Found', { status: 404 });
  }

  // 3. Root Redirection
  // If user visits creators.sepharstudios.com/ (root), redirect to /creator
  if (isCreatorsSubdomain && path === '/') {
    return Response.redirect(`${event.url.origin}/creator`, 307);
  }
  if (isAdminSubdomain && path === '/') {
    return Response.redirect(`${event.url.origin}/admin`, 307);
  }
  if (isKidsSubdomain && path === '/') {
    return Response.redirect(`${event.url.origin}/kids`, 307);
  }

  // 4. Session Handling
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user as User;
  } else {
    event.locals.session = undefined;
    event.locals.user = undefined;
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
