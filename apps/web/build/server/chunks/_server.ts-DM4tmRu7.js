import { e as eventStream } from './sse-CwBTzgEP.js';
import { R as Role } from './constants-BiiFHz9b.js';
import './index.js-CxPEndTa.js';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

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
//# sourceMappingURL=_server.ts-DM4tmRu7.js.map
