import { e as eventStream } from './sse-CwBTzgEP.js';

//#region src/routes/api/admin/analytics/stream/+server.ts
/**
* GET /api/admin/analytics/stream
*
* Admin-only SSE feed of every `watch_start` and `watch_complete` event
* happening on the platform right now. Published from
* /api/watch/progress on real watch transitions. Backs the "Live now"
* panel on /admin/analytics.
*/
var GET = async ({ locals }) => {
	if (locals.user?.role !== "admin") return new Response("Forbidden", { status: 403 });
	return eventStream(["analytics:watch-events:all"]);
};

export { GET };
//# sourceMappingURL=_server.ts-DJIgTN11.js.map
