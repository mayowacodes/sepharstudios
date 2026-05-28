import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { events } from '$lib/db/schema/sepharstudios';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

/**
 * GET /api/admin/events  — list all events (admin view, all statuses + audiences)
 * POST /api/admin/events — create a new event
 *
 * Body for POST:
 *   {
 *     title, description?, speaker?, speakerRole?,
 *     kind?           ('webinar' | 'workshop' | 'fellowship' | 'conference' | 'qa' | 'ama')
 *     track?          ('creator' | 'tokenomics' | 'theology' | 'tech')
 *     audience        ('public' | 'creator')
 *     startsAt        (ISO 8601 string)
 *     endsAt?         (ISO 8601 string)
 *     durationMinutes?
 *     location?
 *     capacity?
 *     meetingUrl?
 *   }
 */

const VALID_KINDS = new Set(['webinar', 'workshop', 'fellowship', 'conference', 'qa', 'ama']);
const VALID_AUDIENCES = new Set(['public', 'creator']);

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const rows = await db.select().from(events).orderBy(desc(events.startsAt));
	return json({ events: rows });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error!;

	const body = await request.json() as Record<string, unknown>;

	if (typeof body.title !== 'string' || body.title.trim().length === 0) {
		return json({ error: 'title is required' }, { status: 400 });
	}
	if (!body.startsAt || typeof body.startsAt !== 'string') {
		return json({ error: 'startsAt is required (ISO 8601)' }, { status: 400 });
	}
	const startsAt = new Date(body.startsAt);
	if (isNaN(startsAt.getTime())) {
		return json({ error: 'startsAt is not a valid date' }, { status: 400 });
	}
	const audience = (body.audience as string) ?? 'public';
	if (!VALID_AUDIENCES.has(audience)) {
		return json({ error: 'audience must be public or creator' }, { status: 400 });
	}
	const kind = (body.kind as string) ?? 'webinar';
	if (!VALID_KINDS.has(kind)) {
		return json({ error: `kind must be one of ${Array.from(VALID_KINDS).join(', ')}` }, { status: 400 });
	}

	const [created] = await db.insert(events).values({
		title: body.title.trim(),
		description: typeof body.description === 'string' ? body.description : null,
		speaker: typeof body.speaker === 'string' ? body.speaker : null,
		speakerRole: typeof body.speakerRole === 'string' ? body.speakerRole : null,
		kind,
		track: typeof body.track === 'string' ? body.track : null,
		audience,
		startsAt,
		endsAt: body.endsAt && typeof body.endsAt === 'string' ? new Date(body.endsAt) : null,
		durationMinutes: typeof body.durationMinutes === 'number' ? body.durationMinutes : null,
		location: typeof body.location === 'string' ? body.location : null,
		capacity: typeof body.capacity === 'number' ? body.capacity : null,
		meetingUrl: typeof body.meetingUrl === 'string' ? body.meetingUrl : null,
		status: 'scheduled',
		createdBy: session.user.id
	}).returning();

	return json({ success: true, event: created }, { status: 201 });
};
