import { e as eventStream } from './sse-CwBTzgEP.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/encoder-stream/+server.ts
/**
* GET /api/admin/encoder-stream
*
* Admin-only SSE feed of every encoder job's transitions. Backs the
* system-health page's live encoder table.
*/
var GET = async ({ locals }) => {
	if (locals.user?.role !== "admin") return new Response("Forbidden", { status: 403 });
	return eventStream(["encoder:all"]);
};

export { GET };
//# sourceMappingURL=_server.ts-t8YpIgvX.js.map
