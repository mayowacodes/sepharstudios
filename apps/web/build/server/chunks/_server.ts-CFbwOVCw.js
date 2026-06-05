import { e as eventStream } from './sse-CwBTzgEP.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/content/[id]/thread/stream/+server.ts
/**
* GET /api/admin/content/[id]/thread/stream
*
* Admin-only SSE feed mirroring the creator stream. Same topic so a single
* publish hits both panels.
*/
var GET = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return new Response("Forbidden", { status: 403 });
	return eventStream([`thread:${params.id}`]);
};

export { GET };
//# sourceMappingURL=_server.ts-CFbwOVCw.js.map
