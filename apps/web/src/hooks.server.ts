import { auth, type User, type Session } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { db } from "$lib/db/drizzle";
import { session as sessionTable } from "$lib/db/schema";
import { eq } from "drizzle-orm";

// Vulnerability-scanner fingerprints. Bots constantly probe public hosts
// for misconfigured secrets / dev artifacts (Laravel envs, npmrc, git
// credentials, CI configs, etc). They normally just get 404s — fine — but
// the 30-line bursts bury real logs. We short-circuit known patterns
// here with a silent 404 so they never reach the SvelteKit router and
// never log a request line. Keep each regex narrow + anchored so a real
// admin/creator/api path can't accidentally match.
const SCANNER_PATTERNS = [
  // Dev artifacts and CI configs at top level.
  /^\/config\//,                                              // /config/database.yml, /config/secrets.yml
  /^\/storage\//,                                             // /storage/logs/laravel.log
  /^\/var\/log\//,                                            // /var/log/app.log
  /^\/var\/(www|task)\//,                                     // /var/www/.env, /var/task/vercel.json
  /^\/logs?\//,                                               // /logs/error.log, /log/error.log
  /^\/(database|dump|backup|db)\.sql$/,
  /^\/\.npmrc$/,
  /^\/\.yarnrc(?:\.yml)?$/,
  /^\/composer\.json$/,
  /^\/\.pypirc$/,
  /^\/\.vscode\//,
  /^\/\.idea\//,
  /^\/\.github\//,
  /^\/\.gitlab-ci\.yml$/,
  /^\/Jenkinsfile$/,
  /^\/(next|nuxt|vite)\.config\.js$/,
  /^\/(firebase|amplify|vercel)\.(json|yml)$/,                // /vercel.json fishing
  /^\/\.firebase\//,
  // Env-file fishing — top-level + one-level subdir variants. Bots probe
  // /api/.env, /dev/.env, /app/.env, /backend/.env, /core/.env, /member/.env,
  // /web/.env, /website/.env, /aws.env, /var/www/.env, /var/www/html/.env.
  // The `/var/www/` prefix is already covered above; this handles the rest.
  /^\/\.env(\.|$)/,
  /^\/aws\.env$/,
  /^\/[^/]+\/\.env(\.|$)/,
  /^\/[^/]+\/env\.js$/,                                       // /web/env.js
  /^\/[^/]+\/(?:config\/)?constants?\.js$/,                   // /web/config/constants.js, /web/constant.js, /web/constants.js
  // Git fishing — `.git/config`, `.git-credentials`, etc.
  /^\/\.git(\/|-?credentials$|$)/,
  // WordPress fishing — directory probes + bare config/login files +
  // wp-json REST surface. We're not WP; all of these are 404 anyway,
  // this just hides the noise.
  /^\/wp-(admin|login|content|includes)\//,
  /^\/wp-config\.php(\.|$)/,                                  // /wp-config.php, /wp-config.php.bak, .new, .old
  /^\/wp-login\.php$/,
  /^\/wp-json\//,
  /^\/wp_mail_smtp\.ini$/,
  // DB-admin probes.
  /^\/(phpmyadmin|pma|adminer)\//,
  // Webhook fishing at the apex. Real webhooks live under /api/webhook*
  // and are NOT matched by this regex (it anchors at the start of the path).
  /^\/webhooks?(?:-test|-waiting)?(?:\/|$)/,
  // System-admin panels we don't ship.
  /^\/webmin\//,
  // Cloud credential / SSH fishing.
  /^\/\.aws\//,
  /^\/\.ssh\//,
];

// A small set of method+path combinations that look like form-probe POSTs
// against URLs where we have no form actions defined. Returning 405 here
// stops `handle_action_request` from logging a full SvelteKit stack trace
// every time a bot POSTs to `/` or `/wp-login.php`.
const FORM_PROBE_POST_PATHS = new Set([
  '/',
  '/login',
  '/wp-login.php',
  '/admin/login',
  '/user/login',
]);

function isScannerPath(pathname: string): boolean {
  return SCANNER_PATTERNS.some((re) => re.test(pathname));
}

function isFormProbePost(method: string, pathname: string): boolean {
  return method === 'POST' && FORM_PROBE_POST_PATHS.has(pathname);
}

export async function handle({ event, resolve }) {
  // Drop known vulnerability-scanner paths before they reach the router so
  // we don't burn cycles on auth/session/load chains just to hand back a
  // 404 the bot expects anyway.
  if (isScannerPath(event.url.pathname)) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'cache-control': 'no-store' }
    });
  }

  // Suppress form-probe POSTs (e.g. `POST /`, `POST /wp-login.php`) before
  // they reach `handle_action_request`. Without this, SvelteKit logs a full
  // stack trace ("No form actions exist for this page") every time a bot
  // probes for a form action on a route that doesn't have one. 405 is the
  // correct semantic response for method-not-allowed on a no-form route.
  if (isFormProbePost(event.request.method, event.url.pathname)) {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { 'cache-control': 'no-store', 'allow': 'GET, HEAD' }
    });
  }

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

  // The device gate below is a UI-only policy ("admin/creator tools aren't
  // designed for mobile/TV"). Applying it to API endpoints breaks legitimate
  // XHR/fetch from the same page — e.g. `/api/files` (image uploads),
  // `/api/encoder/jobs`, `/api/creator/content`. Worse, the response body is
  // plain text "Access Denied…" so clients that try to parse JSON fall back
  // to a generic "Upload failed with HTTP 403" with no useful detail. Skip
  // the gate for any /api/* path so requests from a desktop session still
  // succeed even if the UA detector misfires.
  const isApiPath = path.startsWith('/api/');

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
    // Platform Check: No Admin UI on TV or Mobile. API endpoints exempt —
    // see comment above `isApiPath`.
    if (!isApiPath && (deviceType === 'tv' || deviceType === 'mobile')) {
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
    // Platform Check: No Creator UI on TV or Mobile. API endpoints exempt —
    // see comment above `isApiPath`.
    if (!isApiPath && (deviceType === 'tv' || deviceType === 'mobile')) {
      return new Response('Access Denied: Creator tools are not available on this device.', { status: 403 });
    }
  }

  // 6. Root Redirection — build the target URL from the resolved
  //    `x-forwarded-host` (the same value we used for subdomain detection
  //    above) rather than `event.url.origin`. Behind Dokploy/Traefik,
  //    `event.url.origin` can resolve to the apex `sepharstudios.com`
  //    even when the request came in on `creators.sepharstudios.com`,
  //    which then sends GET `/` users (and the service worker installer)
  //    cross-origin and trips browser CORS. Using the actual incoming
  //    host keeps the redirect same-origin.
  const proto = event.request.headers.get('x-forwarded-proto')
    ?? event.url.protocol.replace(':', '')
    ?? 'https';
  const sameOriginBase = `${proto}://${host}`;
  if (isCreatorsSubdomain && path === '/') {
    return Response.redirect(`${sameOriginBase}/creator`, 307);
  }
  if (isAdminSubdomain && path === '/') {
    return Response.redirect(`${sameOriginBase}/admin`, 307);
  }
  if (isKidsSubdomain && path === '/') {
    return Response.redirect(`${sameOriginBase}/kids`, 307);
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
