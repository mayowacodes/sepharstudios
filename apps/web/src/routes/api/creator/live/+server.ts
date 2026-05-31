import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { liveStreams } from '$lib/db/schema/sepharstudios';
import { and, desc, eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { Role } from '$lib/constants';

/**
 * GET  /api/creator/live — list the signed-in creator's streams
 * POST /api/creator/live — create a new stream (generates a fresh stream key)
 *   body: { title, description?, visibility?, scheduledStartAt? }
 */

function generateStreamKey(): string {
	// 32 hex chars; OBS-friendly length. Prefix lets the orchestrator route
	// based on stream-key namespace if needed.
	return `seph_${randomBytes(16).toString('hex')}`;
}

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const rows = await db.select()
		.from(liveStreams)
		.where(eq(liveStreams.creatorId, session.user.id))
		.orderBy(desc(liveStreams.createdAt))
		.limit(50);

	return json({ streams: rows });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as {
		title?: string;
		description?: string;
		visibility?: string;
		scheduledStartAt?: string;
	};
	const title = body.title?.trim();
	if (!title) return json({ error: 'title is required' }, { status: 400 });

	const streamKey = generateStreamKey();
	const rtmpHost = env.LIVE_RTMP_INGEST_HOST || 'rtmp://live.sepharstudios.com/app';

	const [inserted] = await db.insert(liveStreams).values({
		creatorId: session.user.id,
		title,
		description: body.description ?? null,
		visibility: body.visibility ?? 'public',
		scheduledStartAt: body.scheduledStartAt ? new Date(body.scheduledStartAt) : null,
		streamKey,
		rtmpIngestUrl: rtmpHost
	}).returning();

	return json({ success: true, stream: inserted });
};
