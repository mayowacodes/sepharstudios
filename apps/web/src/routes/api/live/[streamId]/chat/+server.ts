import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { liveChatMessages, liveStreams } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, asc, desc, eq, ne, sql } from 'drizzle-orm';
import { take } from '$lib/server/rate-limit';
import { moderateComment } from '$lib/server/ai-moderation';
import { publish } from '$lib/server/sse';

/**
 * GET  /api/live/[streamId]/chat?before=&limit=  — list messages (newest first)
 * POST /api/live/[streamId]/chat                  — send a chat message
 *   body: { body }
 *
 * Rate-limited per user (10/min). Each message runs through the existing
 * AI moderation helper; reject → 400, flag → `status='pending'` (creator
 * sees it in mod queue), approve → published.
 */

const MAX_BODY_LENGTH = 280;

export const GET: RequestHandler = async ({ params, url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		visibility: liveStreams.visibility
	})
		.from(liveStreams)
		.where(eq(liveStreams.id, params.streamId!))
		.limit(1);
	if (!stream) return json({ error: 'Stream not found' }, { status: 404 });
	if (stream.visibility === 'private' && stream.creatorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10) || 100, 200);
	const isCreator = stream.creatorId === session.user.id;
	const isAdmin = session.user.role === 'admin';

	const rows = await db.select({
		id: liveChatMessages.id,
		body: liveChatMessages.body,
		status: liveChatMessages.status,
		pinned: liveChatMessages.pinned,
		createdAt: liveChatMessages.createdAt,
		authorId: liveChatMessages.authorId,
		authorName: user.name,
		authorImage: user.image
	})
		.from(liveChatMessages)
		.leftJoin(user, eq(user.id, liveChatMessages.authorId))
		.where(and(
			eq(liveChatMessages.streamId, stream.id),
			// Viewers only see published messages; creator + admin see everything.
			isCreator || isAdmin ? sql`true` : eq(liveChatMessages.status, 'published')
		))
		.orderBy(asc(liveChatMessages.createdAt))
		.limit(limit);

	return json({ messages: rows, isCreator, isAdmin });
};

export const POST: RequestHandler = async ({ params, locals, request, getClientAddress }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const bucketKey = session.user.id || `ip:${getClientAddress()}`;
	const limit = await take(`live-chat:${bucketKey}`, { capacity: 10, refillPerSec: 10 / 60 });
	if (!limit.allowed) {
		return json({ error: 'Slow down — too many messages.' }, { status: 429 });
	}

	const body = await request.json().catch(() => ({})) as { body?: string };
	const text = body.body?.trim() ?? '';
	if (!text) return json({ error: 'Body required' }, { status: 400 });
	if (text.length > MAX_BODY_LENGTH) {
		return json({ error: `Max ${MAX_BODY_LENGTH} characters` }, { status: 400 });
	}

	const [stream] = await db.select({
		id: liveStreams.id,
		title: liveStreams.title,
		creatorId: liveStreams.creatorId,
		visibility: liveStreams.visibility
	})
		.from(liveStreams)
		.where(eq(liveStreams.id, params.streamId!))
		.limit(1);
	if (!stream) return json({ error: 'Stream not found' }, { status: 404 });
	if (stream.visibility === 'private' && stream.creatorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	// AI moderation. Best-effort; falls back to 'published' on provider error.
	let status: 'published' | 'pending' = 'published';
	try {
		const verdict = await moderateComment(text, stream.title);
		if (verdict?.verdict === 'reject') {
			return json({ error: verdict.reason ?? 'Message rejected' }, { status: 400 });
		}
		if (verdict?.verdict === 'flag') status = 'pending';
	} catch { /* keep status='published' on AI failure */ }

	const [inserted] = await db.insert(liveChatMessages).values({
		streamId: stream.id,
		authorId: session.user.id,
		body: text,
		status
	}).returning();

	// Look up the author name + image for the broadcast payload so subscribers
	// don't need a second query.
	const [author] = await db.select({ name: user.name, image: user.image })
		.from(user)
		.where(eq(user.id, session.user.id))
		.limit(1);

	const event = {
		type: 'new-message' as const,
		id: inserted.id,
		body: inserted.body,
		status: inserted.status,
		pinned: inserted.pinned,
		createdAt: inserted.createdAt,
		authorId: session.user.id,
		authorName: author?.name ?? null,
		authorImage: author?.image ?? null
	};
	// Only broadcast published messages to public viewers. Flagged ones
	// still go on the creator's stream-mod channel.
	if (status === 'published') publish(`live-chat:${stream.id}`, event);
	publish(`live-chat-mod:${stream.id}`, event);

	return json({ success: true, message: event });
};
