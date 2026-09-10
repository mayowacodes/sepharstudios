import { d as db, m as mediaLibrary } from './drizzle-DlGuU73K.js';
import { e as eventStream } from './sse-CwBTzgEP.js';
import { R as Role } from './constants-RccSloty.js';
import { eq } from 'drizzle-orm';
import './index.js-DwRgOKlO.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

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
//# sourceMappingURL=_server.ts-CSAVLVZE.js.map
