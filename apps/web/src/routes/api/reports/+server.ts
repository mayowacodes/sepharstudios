import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import {
	abuseReports,
	reviews,
	forumThreads,
	forumReplies,
	mediaLibrary
} from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { take } from '$lib/server/rate-limit';

/**
 * POST /api/reports — universal abuse report.
 *
 * Body: { targetType, targetId, category, description? }
 *
 * Polymorphic: targetType picks which table to validate the targetId
 * against. Reports for unknown targets are rejected so the admin queue
 * stays meaningful. Auth optional — anonymous reports land with
 * reporterId=null. Rate-limited 10/hr per user / IP.
 */

const ALLOWED_TARGET_TYPES = new Set([
	'review', 'forum_thread', 'forum_reply', 'content', 'user'
]);
const ALLOWED_CATEGORIES = new Set([
	'spam', 'harassment', 'sexual', 'violence', 'misinformation',
	'copyright', 'self_harm', 'illegal', 'other'
]);

async function targetExists(type: string, id: string): Promise<boolean> {
	if (type === 'review') {
		const [row] = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.id, id)).limit(1);
		return !!row;
	}
	if (type === 'forum_thread') {
		const [row] = await db.select({ id: forumThreads.id }).from(forumThreads).where(eq(forumThreads.id, id)).limit(1);
		return !!row;
	}
	if (type === 'forum_reply') {
		const [row] = await db.select({ id: forumReplies.id }).from(forumReplies).where(eq(forumReplies.id, id)).limit(1);
		return !!row;
	}
	if (type === 'content') {
		const [row] = await db.select({ id: mediaLibrary.id }).from(mediaLibrary).where(eq(mediaLibrary.id, id)).limit(1);
		return !!row;
	}
	if (type === 'user') {
		const [row] = await db.select({ id: user.id }).from(user).where(eq(user.id, id)).limit(1);
		return !!row;
	}
	return false;
}

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const session = await locals.auth.getSession();
	const bucketKey = session?.user.id ?? `ip:${getClientAddress()}`;
	const limit = await take(`reports:${bucketKey}`, { capacity: 10, refillPerSec: 1 / 360 });
	if (!limit.allowed) {
		return json({ error: 'Too many reports, try again later.' }, { status: 429 });
	}

	const body = await request.json().catch(() => ({})) as {
		targetType?: string;
		targetId?: string;
		category?: string;
		description?: string;
	};

	const targetType = body.targetType ?? '';
	const targetId = body.targetId?.trim() ?? '';
	const category = body.category ?? '';

	if (!ALLOWED_TARGET_TYPES.has(targetType)) {
		return json({ error: 'Invalid target type' }, { status: 400 });
	}
	if (!targetId) {
		return json({ error: 'targetId is required' }, { status: 400 });
	}
	if (!ALLOWED_CATEGORIES.has(category)) {
		return json({ error: 'Invalid category' }, { status: 400 });
	}

	const exists = await targetExists(targetType, targetId);
	if (!exists) {
		return json({ error: 'Target not found' }, { status: 404 });
	}

	const description = (body.description ?? '').trim().slice(0, 2000);

	const [inserted] = await db.insert(abuseReports).values({
		reporterId: session?.user.id ?? null,
		targetType,
		targetId,
		category,
		description: description || null
	}).returning({ id: abuseReports.id });

	return json({ success: true, id: inserted.id });
};
