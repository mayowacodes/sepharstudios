import { t as private_env } from "./shared-server.js";
import { OpenPanel } from "@openpanel/sdk";
//#region src/lib/server/analytics.ts
/**
* Server-side Openpanel client. Wrapped in a singleton with a no-op fallback
* when env vars aren't set (dev/CI). Use `track(...)` from any server handler.
*
* Required env: OPENPANEL_API_KEY, PUBLIC_OPENPANEL_CLIENT_ID.
* The client-side SDK is loaded via <script> in app.html and tracks page views
* automatically — this file is for explicit server-side events (sign-up,
* subscribe, watch-complete) where we have authoritative state.
*/
var client = null;
var warned = false;
function getClient() {
	if (client) return client;
	const clientId = private_env.PUBLIC_OPENPANEL_CLIENT_ID;
	const apiKey = private_env.OPENPANEL_API_KEY;
	if (!clientId || !apiKey) {
		if (!warned) {
			console.info("[analytics] OPENPANEL_API_KEY / PUBLIC_OPENPANEL_CLIENT_ID not set — events are no-ops");
			warned = true;
		}
		return null;
	}
	client = new OpenPanel({
		clientId,
		clientSecret: apiKey
	});
	return client;
}
/**
* Fire-and-forget event tracker. Never throws. Pass `userId: null` for
* anonymous events.
*/
async function track(userId, event, properties) {
	const c = getClient();
	if (!c) return;
	try {
		await c.track(event, {
			profileId: userId ?? void 0,
			...properties
		});
	} catch (err) {
		console.warn(`[analytics] track('${event}') failed:`, err);
	}
}
//#endregion
export { track as t };
