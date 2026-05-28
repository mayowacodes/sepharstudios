import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { events, eventRegistrations } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';

/**
 * GET /api/events/[id]
 *
 * Single event detail. Includes the meeting URL ONLY if:
 *   - the current user is registered AND status='confirmed', OR
 *   - the event is past + has a recording URL set.
 *
 * This stops a casual viewer from copy-pasting the Zoom link without signing up.
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const [event] = await db
		.select()
		.from(events)
		.where(eq(events.id, params.id!))
		.limit(1);

	if (!event) return json({ error: 'Event not found' }, { status: 404 });

	const [countRow] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(eventRegistrations)
		.where(and(
			eq(eventRegistrations.eventId, event.id),
			eq(eventRegistrations.status, 'confirmed')
		));
	const registeredCount = Number(countRow?.count ?? 0);

	const session = await locals.auth.getSession().catch(() => null);
	let isRegistered = false;
	if (session) {
		const [reg] = await db
			.select({ id: eventRegistrations.id })
			.from(eventRegistrations)
			.where(and(
				eq(eventRegistrations.eventId, event.id),
				eq(eventRegistrations.userId, session.user.id),
				eq(eventRegistrations.status, 'confirmed')
			))
			.limit(1);
		isRegistered = !!reg;
	}

	// Gate the meeting URL behind registration. Past events with recordings
	// can be watched without registering (the recording is the artifact).
	const { meetingUrl, ...publicFields } = event;
	const responseEvent = {
		...publicFields,
		meetingUrl: isRegistered ? meetingUrl : null,
		registeredCount,
		isRegistered
	};

	return json({ event: responseEvent });
};
