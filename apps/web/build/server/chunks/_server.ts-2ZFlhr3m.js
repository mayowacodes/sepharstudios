import { e as eventStream } from './sse-CwBTzgEP.js';
import { R as Role } from './constants-BiiFHz9b.js';
import './index.js-CxPEndTa.js';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

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
//# sourceMappingURL=_server.ts-2ZFlhr3m.js.map
