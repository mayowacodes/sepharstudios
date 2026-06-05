import { H as mediaLibrary, a as user, et as ppvContent, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, ilike, or } from "drizzle-orm";
//#region src/routes/api/admin/content/+server.ts
var GET = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]))?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const search = url.searchParams.get("search") ?? "";
	const status = url.searchParams.get("status");
	const onlyPending = url.searchParams.get("pending") === "true";
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 100);
	const offset = parseInt(url.searchParams.get("offset") ?? "0");
	const filters = [];
	if (search) filters.push(or(ilike(mediaLibrary.title, `%${search}%`), ilike(mediaLibrary.description, `%${search}%`), ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)));
	if (status) filters.push(eq(mediaLibrary.status, status));
	if (onlyPending) filters.push(eq(mediaLibrary.status, "submitted"));
	const whereClause = filters.length ? and(...filters) : void 0;
	const baseQuery = db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		mediaType: mediaLibrary.mediaType,
		thumbnail: mediaLibrary.thumbnail,
		isActive: mediaLibrary.isActive,
		status: mediaLibrary.status,
		isNew: mediaLibrary.isNew,
		genres: mediaLibrary.genres,
		viewCount: mediaLibrary.viewCount,
		createdAt: mediaLibrary.createdAt,
		creatorId: mediaLibrary.creatorId,
		creatorName: user.name,
		creatorEmail: user.email,
		isPpv: ppvContent.isActive,
		ppvPriceCents: ppvContent.finalPriceCents
	}).from(mediaLibrary).leftJoin(user, eq(mediaLibrary.creatorId, user.id)).leftJoin(ppvContent, eq(ppvContent.contentId, mediaLibrary.id));
	return json(await (whereClause ? baseQuery.where(whereClause) : baseQuery).orderBy(desc(mediaLibrary.createdAt)).limit(limit).offset(offset));
};
//#endregion
export { GET };
