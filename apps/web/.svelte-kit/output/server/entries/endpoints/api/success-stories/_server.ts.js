import { Q as successStories, t as db } from "../../../../chunks/drizzle.js";
import { a as take } from "../../../../chunks/rate-limit.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/success-stories/+server.ts
/**
* GET  /api/success-stories — public list (approved only)
* POST /api/success-stories — submit a new story (pending moderation)
*
* Submission is rate-limited per IP because anonymous submits are allowed
* (signed-in users get the rate-limit bucket keyed by userId too).
*/
var GET = async () => {
	return json({ stories: await db.select({
		id: successStories.id,
		name: successStories.name,
		channel: successStories.channel,
		story: successStories.story,
		createdAt: successStories.createdAt
	}).from(successStories).where(eq(successStories.status, "approved")).orderBy(desc(successStories.createdAt)).limit(50) });
};
var POST = async ({ request, locals, getClientAddress }) => {
	const session = await locals.auth.getSession();
	if (!(await take(`success-stories:${session?.user.id ?? `ip:${getClientAddress()}`}`, {
		capacity: 3,
		refillPerSec: 1 / 1200
	})).allowed) return json({ error: "Too many submissions, try again later." }, { status: 429 });
	const body = await request.json().catch(() => ({}));
	if (!body.name?.trim() || !body.story?.trim()) return json({ error: "Name and story are required." }, { status: 400 });
	if (body.story.trim().length < 40) return json({ error: "Story is too short (40+ characters)." }, { status: 400 });
	if (body.story.length > 4e3) return json({ error: "Story is too long (max 4000 characters)." }, { status: 400 });
	const [inserted] = await db.insert(successStories).values({
		userId: session?.user.id ?? null,
		name: body.name.trim().slice(0, 120),
		channel: body.channel?.trim().slice(0, 160) ?? null,
		story: body.story.trim()
	}).returning({ id: successStories.id });
	return json({
		success: true,
		id: inserted.id
	});
};
//#endregion
export { GET, POST };
