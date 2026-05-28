import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { successStories } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';
import { take } from '$lib/server/rate-limit';

/**
 * GET  /api/success-stories — public list (approved only)
 * POST /api/success-stories — submit a new story (pending moderation)
 *
 * Submission is rate-limited per IP because anonymous submits are allowed
 * (signed-in users get the rate-limit bucket keyed by userId too).
 */

export const GET: RequestHandler = async () => {
	const rows = await db.select({
		id: successStories.id,
		name: successStories.name,
		channel: successStories.channel,
		story: successStories.story,
		createdAt: successStories.createdAt
	})
		.from(successStories)
		.where(eq(successStories.status, 'approved'))
		.orderBy(desc(successStories.createdAt))
		.limit(50);

	return json({ stories: rows });
};

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const session = await locals.auth.getSession();
	const bucketKey = session?.user.id ?? `ip:${getClientAddress()}`;
	// Allow ~3 submissions per hour: capacity 3, refill 1/1200s = 3/hr sustained.
	const limit = await take(`success-stories:${bucketKey}`, { capacity: 3, refillPerSec: 1 / 1200 });
	if (!limit.allowed) {
		return json({ error: 'Too many submissions, try again later.' }, { status: 429 });
	}

	const body = await request.json().catch(() => ({})) as {
		name?: string;
		channel?: string;
		story?: string;
	};

	if (!body.name?.trim() || !body.story?.trim()) {
		return json({ error: 'Name and story are required.' }, { status: 400 });
	}
	if (body.story.trim().length < 40) {
		return json({ error: 'Story is too short (40+ characters).' }, { status: 400 });
	}
	if (body.story.length > 4000) {
		return json({ error: 'Story is too long (max 4000 characters).' }, { status: 400 });
	}

	const [inserted] = await db.insert(successStories).values({
		userId: session?.user.id ?? null,
		name: body.name.trim().slice(0, 120),
		channel: body.channel?.trim().slice(0, 160) ?? null,
		story: body.story.trim()
	}).returning({ id: successStories.id });

	return json({ success: true, id: inserted.id });
};
