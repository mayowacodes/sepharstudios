import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { liveStreams } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { Role } from '$lib/constants';

/**
 * PATCH  /api/creator/live/[id] — edit metadata or rotate stream key
 *   body: { title?, description?, visibility?, rotateKey?: true }
 * DELETE /api/creator/live/[id] — delete stream (only when not 'live')
 */

async function ownerCheck(id: string, userId: string) {
	const [row] = await db.select({ creatorId: liveStreams.creatorId, status: liveStreams.status })
		.from(liveStreams)
		.where(eq(liveStreams.id, id))
		.limit(1);
	if (!row) return { ok: false as const, status: 404 as const, row: null };
	if (row.creatorId !== userId) return { ok: false as const, status: 403 as const, row: null };
	return { ok: true as const, status: 200 as const, row };
}

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const check = await ownerCheck(params.id!, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? 'Not found' : 'Forbidden' }, { status: check.status });

	const body = await request.json().catch(() => ({})) as {
		title?: string;
		description?: string;
		visibility?: string;
		rotateKey?: boolean;
	};
	const updates: Record<string, unknown> = { updatedAt: new Date() };
	if (typeof body.title === 'string') updates.title = body.title.trim().slice(0, 255);
	if (typeof body.description === 'string') updates.description = body.description.trim();
	if (typeof body.visibility === 'string' && ['public', 'unlisted', 'private'].includes(body.visibility)) {
		updates.visibility = body.visibility;
	}
	if (body.rotateKey === true) {
		updates.streamKey = `seph_${randomBytes(16).toString('hex')}`;
	}

	const [updated] = await db.update(liveStreams)
		.set(updates)
		.where(eq(liveStreams.id, params.id!))
		.returning();
	return json({ success: true, stream: updated });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const check = await ownerCheck(params.id!, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? 'Not found' : 'Forbidden' }, { status: check.status });
	if (check.row?.status === 'live' || check.row?.status === 'ingest') {
		return json({ error: 'Cannot delete a stream that is currently live' }, { status: 400 });
	}

	await db.delete(liveStreams).where(eq(liveStreams.id, params.id!));
	return json({ success: true });
};
