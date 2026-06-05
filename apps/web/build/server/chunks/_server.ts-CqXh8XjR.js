import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { e as eventStream } from './sse-CwBTzgEP.js';
import './utils-BAX50FA_.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';

//#region src/routes/api/creator/content/[id]/thread/stream/+server.ts
/**
* GET /api/creator/content/[id]/thread/stream
*
* SSE feed for the admin↔creator thread on this content row. Ownership
* check: only the content's creator can subscribe.
*/
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response("Unauthorized", { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return new Response("Forbidden", { status: 403 });
	const [row] = await db.select({ creatorId: mediaLibrary.creatorId }).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!row) return new Response("Not found", { status: 404 });
	if (row.creatorId !== session.user.id && session.user.role !== "admin") return new Response("Forbidden", { status: 403 });
	return eventStream([`thread:${params.id}`]);
};

export { GET };
//# sourceMappingURL=_server.ts-CqXh8XjR.js.map
