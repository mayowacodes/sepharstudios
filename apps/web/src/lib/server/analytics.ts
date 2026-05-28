import { env } from '$env/dynamic/private';
import { OpenpanelSdk } from '@openpanel/sdk';

/**
 * Server-side Openpanel client. Wrapped in a singleton with a no-op fallback
 * when env vars aren't set (dev/CI). Use `track(...)` from any server handler.
 *
 * Required env: OPENPANEL_API_KEY, PUBLIC_OPENPANEL_CLIENT_ID.
 * The client-side SDK is loaded via <script> in app.html and tracks page views
 * automatically — this file is for explicit server-side events (sign-up,
 * subscribe, watch-complete) where we have authoritative state.
 */

let client: OpenpanelSdk | null = null;
let warned = false;

function getClient(): OpenpanelSdk | null {
  if (client) return client;
  const clientId = env.PUBLIC_OPENPANEL_CLIENT_ID;
  const apiKey = env.OPENPANEL_API_KEY;
  if (!clientId || !apiKey) {
    if (!warned) {
      console.info('[analytics] OPENPANEL_API_KEY / PUBLIC_OPENPANEL_CLIENT_ID not set — events are no-ops');
      warned = true;
    }
    return null;
  }
  client = new OpenpanelSdk({ clientId, clientSecret: apiKey });
  return client;
}

/**
 * Fire-and-forget event tracker. Never throws. Pass `userId: null` for
 * anonymous events.
 */
export async function track(
  userId: string | null,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    await c.track(event, { profileId: userId ?? undefined, ...properties });
  } catch (err) {
    console.warn(`[analytics] track('${event}') failed:`, err);
  }
}
