import { e as eventStream } from './sse-CwBTzgEP.js';
import { R as Role } from './constants-DSOCQRom.js';
import './index.js-BP8aAXBX.js';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

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
//# sourceMappingURL=_server.ts-urkweQc9.js.map
