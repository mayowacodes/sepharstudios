import { H as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
//#region src/routes/api/creator/content/+server.ts
var MAX_PAGE_SIZE = 100;
var DEFAULT_PAGE_SIZE = 25;
var GET = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const status = url.searchParams.get("status");
	const type = url.searchParams.get("type");
	const q = url.searchParams.get("q")?.trim();
	const hasPaginationParam = url.searchParams.has("page") || url.searchParams.has("pageSize");
	const conds = [eq(mediaLibrary.creatorId, session.user.id)];
	if (status && status !== "all") conds.push(eq(mediaLibrary.status, status));
	if (type && type !== "all") conds.push(eq(mediaLibrary.mediaType, type));
	if (q) {
		const pat = `%${q}%`;
		const searchExpr = or(ilike(mediaLibrary.title, pat), ilike(mediaLibrary.description, pat));
		if (searchExpr) conds.push(searchExpr);
	}
	const whereExpr = conds.length === 1 ? conds[0] : and(...conds);
	const columns = {
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		mediaType: mediaLibrary.mediaType,
		status: mediaLibrary.status,
		isActive: mediaLibrary.isActive,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		duration: mediaLibrary.duration,
		viewCount: mediaLibrary.viewCount,
		genres: mediaLibrary.genres,
		keywords: mediaLibrary.keywords,
		createdAt: mediaLibrary.createdAt,
		updatedAt: mediaLibrary.updatedAt,
		reviewNotes: mediaLibrary.reviewNotes,
		rejectionReason: mediaLibrary.rejectionReason
	};
	if (!hasPaginationParam) return json(await db.select(columns).from(mediaLibrary).where(whereExpr).orderBy(desc(mediaLibrary.createdAt)));
	const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
	const requested = parseInt(url.searchParams.get("pageSize") ?? `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE;
	const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requested));
	const offset = (page - 1) * pageSize;
	const [items, totals] = await Promise.all([db.select(columns).from(mediaLibrary).where(whereExpr).orderBy(desc(mediaLibrary.createdAt)).limit(pageSize).offset(offset), db.select({ count: sql`count(*)::int` }).from(mediaLibrary).where(whereExpr)]);
	const total = totals[0]?.count ?? 0;
	return json({
		items,
		pagination: {
			page,
			pageSize,
			total,
			totalPages: Math.max(1, Math.ceil(total / pageSize))
		}
	});
};
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const data = await request.json();
	const id = crypto.randomUUID();
	const title = String(data.title || "").trim();
	if (!title) return json({ error: "Title is required" }, { status: 400 });
	try {
		await db.insert(mediaLibrary).values({
			id,
			title,
			description: data.description,
			mediaType: data.contentType,
			ageRating: data.ageRating,
			thumbnail: data.assets?.thumbnail,
			posterUrl: data.assets?.posterPortrait,
			posterLandscapeUrl: data.assets?.posterLandscape,
			posterSquareUrl: data.assets?.posterSquare,
			logoTitleUrl: data.assets?.logoTitle,
			backdropUrl: data.assets?.backdropHero,
			trailerUrl: data.trailerUrl || null,
			language: data.language || "English",
			bibleReference: data.bibleReferences?.[0] || null,
			genres: data.genre || [],
			topics: data.themes || [],
			keywords: data.keywords || [],
			duration: data.duration?.toString() || null,
			isActive: false,
			isNew: true,
			status: "submitted",
			creatorId: session.user.id,
			slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id.slice(0, 5)}`,
			link: `/watch/${id}`,
			videoUrl: data.videoUrl || null,
			processingStatus: "not_started"
		});
		return json({
			success: true,
			contentId: id
		});
	} catch (error) {
		console.error("Content submission error:", error);
		return json({ error: "Failed to save content metadata" }, { status: 500 });
	}
};
//#endregion
export { GET, POST };
