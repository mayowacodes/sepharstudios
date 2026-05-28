import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { events, eventRegistrations } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { notify } from '$lib/server/notify';

/**
 * PATCH /api/admin/events/[id]  — partial update
 * DELETE /api/admin/events/[id] — cancel event + notify all registrants
 *
 * Cancellation soft-marks the event as `status='cancelled'` (not hard delete)
 * so the audit trail + registrations remain. Registrants get an in-app
 * notification explaining the cancellation.
 */

const ALLOWED_FIELDS = [
	'title', 'description', 'speaker', 'speakerRole', 'kind', 'track', 'audience',
	'startsAt', 'endsAt', 'durationMinutes', 'location', 'capacity',
	'meetingUrl', 'recordingUrl', 'status'
] as const;

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const body = await request.json() as Record<string, unknown>;
	const updates: Record<string, unknown> = { updatedAt: new Date() };

	for (const field of ALLOWED_FIELDS) {
		if (field in body) {
			if (field === 'startsAt' || field === 'endsAt') {
				const val = body[field];
				updates[field] = val ? new Date(val as string) : null;
			} else {
				updates[field] = body[field];
			}
		}
	}

	if (Object.keys(updates).length === 1) {
		return json({ error: 'No updatable fields supplied' }, { status: 400 });
	}

	const [updated] = await db.update(events)
		.set(updates)
		.where(eq(events.id, params.id!))
		.returning();

	if (!updated) return json({ error: 'Event not found' }, { status: 404 });

	return json({ success: true, event: updated });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const [event] = await db.select()
		.from(events)
		.where(eq(events.id, params.id!))
		.limit(1);
	if (!event) return json({ error: 'Event not found' }, { status: 404 });
	if (event.status === 'cancelled') {
		return json({ error: 'Event already cancelled' }, { status: 400 });
	}

	await db.update(events)
		.set({ status: 'cancelled', updatedAt: new Date() })
		.where(eq(events.id, event.id));

	// Notify confirmed registrants — best-effort.
	const regs = await db.select({ userId: eventRegistrations.userId })
		.from(eventRegistrations)
		.where(and(
			eq(eventRegistrations.eventId, event.id),
			eq(eventRegistrations.status, 'confirmed')
		));

	for (const r of regs) {
		await notify({
			userId: r.userId,
			kind: 'system',
			title: `Event cancelled: ${event.title}`,
			message: `Unfortunately we've had to cancel this event. We'll let you know when a similar one is scheduled.`,
			actionUrl: event.audience === 'creator' ? '/creator/events' : '/webinars'
		}).catch(() => { /* swallow per-user notify failures */ });
	}

	return json({ success: true, cancelledRegistrants: regs.length });
};
