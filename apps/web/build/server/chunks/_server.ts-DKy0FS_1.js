import { R as Role } from './constants-BEpeHz1K.js';
import { e as eventStream } from './sse-CwBTzgEP.js';
import './utils-BAX50FA_.js';
import './ui-libs-BjzLDLAh.js';
import './rolldown-runtime-pTpnEGsq.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';

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
//# sourceMappingURL=_server.ts-DKy0FS_1.js.map
