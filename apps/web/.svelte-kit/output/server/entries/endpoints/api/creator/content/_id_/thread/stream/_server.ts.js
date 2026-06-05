import { H as mediaLibrary, t as db } from "../../../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../../../chunks/constants.js";
import { t as eventStream } from "../../../../../../../../chunks/sse.js";
import "@sveltejs/kit";
import { eq } from "drizzle-orm";
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
//#endregion
export { GET };
