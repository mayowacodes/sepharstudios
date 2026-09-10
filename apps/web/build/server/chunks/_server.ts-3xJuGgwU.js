import { e as eventStream } from './sse-CwBTzgEP.js';
import { R as Role } from './constants-RccSloty.js';
import './index.js-DwRgOKlO.js';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

//#region src/routes/api/creator/encoder-stream/+server.ts
/**
* GET /api/creator/encoder-stream
*
* Server-Sent Events feed scoped to the signed-in creator. Each event is
* a JSON object the webhook + cron broadcast on `encoder:creator:<id>`:
*
*   { jobId, mediaId, creatorId, status, progress, stage, error }
*
* Used by the upload wizard's "processing" screen + the creator content
* list to render a live progress bar without polling.
*/
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response("Unauthorized", { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return new Response("Forbidden", { status: 403 });
	return eventStream([`encoder:creator:${session.user.id}`]);
};

export { GET };
//# sourceMappingURL=_server.ts-3xJuGgwU.js.map
