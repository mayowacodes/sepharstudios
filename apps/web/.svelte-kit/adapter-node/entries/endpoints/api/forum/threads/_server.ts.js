import { T as forumThreads, a as user, t as db } from "../../../../../chunks/drizzle.js";
import { a as take } from "../../../../../chunks/rate-limit.js";
import { t as moderateComment } from "../../../../../chunks/ai-moderation.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
//#region src/routes/api/forum/threads/+server.ts
/**
* GET  /api/forum/threads?category=&sort=latest|top&q=&page=
* POST /api/forum/threads   { title, category, body }
*
* AI moderation gates POST: reject → 400, flag → insert with status='hidden'
* so an admin can review before publishing.
*/
var PAGE_SIZE = 20;
var ALLOWED_CATEGORIES = new Set([
	"getting-started",
	"technical",
	"content-creation",
	"ministry",
	"community"
]);
var GET = async ({ url }) => {
	const category = url.searchParams.get("category") ?? "all";
	const sort = url.searchParams.get("sort") ?? "latest";
	const q = url.searchParams.get("q")?.trim() ?? "";
	const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
	const conds = [eq(forumThreads.status, "published")];
	if (category !== "all") conds.push(eq(forumThreads.category, category));
	if (q) conds.push(or(ilike(forumThreads.title, `%${q}%`), ilike(forumThreads.body, `%${q}%`)));
	const orderClause = sort === "top" ? [
		desc(forumThreads.isSticky),
		desc(forumThreads.likeCount),
		desc(forumThreads.lastReplyAt)
	] : [
		desc(forumThreads.isSticky),
		desc(forumThreads.lastReplyAt),
		desc(forumThreads.createdAt)
	];
	const rows = await db.select({
		id: forumThreads.id,
		title: forumThreads.title,
		category: forumThreads.category,
		body: forumThreads.body,
		isSticky: forumThreads.isSticky,
		isLocked: forumThreads.isLocked,
		likeCount: forumThreads.likeCount,
		replyCount: forumThreads.replyCount,
		lastReplyAt: forumThreads.lastReplyAt,
		createdAt: forumThreads.createdAt,
		authorId: forumThreads.authorId,
		authorName: user.name,
		authorImage: user.image
	}).from(forumThreads).leftJoin(user, eq(user.id, forumThreads.authorId)).where(and(...conds)).orderBy(...orderClause).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE);
	const [countRow] = await db.select({ total: sql`count(*)::int` }).from(forumThreads).where(and(...conds));
	const total = Number(countRow?.total ?? 0);
	return json({
		threads: rows,
		page,
		pageSize: PAGE_SIZE,
		total,
		hasMore: page * PAGE_SIZE < total
	});
};
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (!(await take(`forum-thread:${session.user.id}`, {
		capacity: 5,
		refillPerSec: 1 / 600
	})).allowed) return json({ error: "Slow down — try again in a few minutes." }, { status: 429 });
	const body = await request.json().catch(() => ({}));
	const title = body.title?.trim() ?? "";
	const category = body.category && ALLOWED_CATEGORIES.has(body.category) ? body.category : "";
	const text = body.body?.trim() ?? "";
	if (!title || title.length < 5 || title.length > 255) return json({ error: "Title must be 5–255 characters." }, { status: 400 });
	if (!category) return json({ error: "A category is required." }, { status: 400 });
	if (!text || text.length < 20) return json({ error: "Post body must be at least 20 characters." }, { status: 400 });
	if (text.length > 1e4) return json({ error: "Post body is too long (max 10000 characters)." }, { status: 400 });
	const verdict = await moderateComment(text, title).catch(() => null);
	if (verdict?.verdict === "reject") return json({ error: "Your post was rejected by automated moderation. Please rephrase." }, { status: 400 });
	const status = verdict?.verdict === "flag" ? "hidden" : "published";
	const [inserted] = await db.insert(forumThreads).values({
		authorId: session.user.id,
		title: title.slice(0, 255),
		category,
		body: text,
		status,
		moderationNote: verdict?.reason ?? null,
		lastReplyAt: /* @__PURE__ */ new Date()
	}).returning({
		id: forumThreads.id,
		status: forumThreads.status
	});
	return json({
		success: true,
		id: inserted.id,
		status: inserted.status
	});
};
//#endregion
export { GET, POST };
