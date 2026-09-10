import { e as eventStream } from './sse-CwBTzgEP.js';
import { R as Role } from './constants-RccSloty.js';
import './index.js-DwRgOKlO.js';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

//#region src/routes/api/creator/analytics/stream/+server.ts
/**
* GET /api/creator/analytics/stream
*
* Per-creator SSE feed of `watch_start` / `watch_complete` events on
* the creator's own content. Published from /api/watch/progress
* scoped to the content's creatorId. Backs the "Live now" panel on
* /creator/analytics.
*/
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response("Unauthorized", { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return new Response("Forbidden", { status: 403 });
	return eventStream([`analytics:watch-events:creator:${session.user.id}`]);
};

export { GET };
//# sourceMappingURL=_server.ts-CMMYsVPZ.js.map
