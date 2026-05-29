import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { events, eventRegistrations } from '$lib/db/schema/sepharstudios';
import { and, eq, lte, sql, gte, isNull, isNotNull } from 'drizzle-orm';
import { notify } from '$lib/server/notify';

/**
 * POST /api/cron/event-status-sweep
 *
 * Runs every 5 minutes. Three jobs:
 *   1. Promote `scheduled` → `live` when `starts_at <= now()`.
 *   2. Promote `live` → `completed` when the computed end time has passed.
 *   3. Send 1-hour-before reminders to confirmed registrants of upcoming events.
 *
 * Idempotency: we use `reminder_sent_at IS NULL` + a time window so re-running
 * within the same sweep doesn't re-notify. Status promotions are guarded by
 * the current status — once we move a row out of `scheduled`, the next pass
 * won't try to promote it again.
 */

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) {
		return json({ error: 'CRON_SECRET not configured on server' }, { status: 500 });
	}
	if (auth !== `Bearer ${expected}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const now = new Date();
	const result = { promotedLive: 0, promotedCompleted: 0, remindersSent: 0 };

	// 1) scheduled → live
	const toLive = await db.update(events)
		.set({ status: 'live', updatedAt: now })
		.where(and(
			eq(events.status, 'scheduled'),
			lte(events.startsAt, now)
		))
		.returning({ id: events.id });
	result.promotedLive = toLive.length;

	// 2) live → completed. Use endsAt when set, otherwise startsAt + duration.
	const toComplete = await db.update(events)
		.set({ status: 'completed', updatedAt: now })
		.where(and(
			eq(events.status, 'live'),
			sql`
				CASE
					WHEN ${events.endsAt} IS NOT NULL THEN ${events.endsAt} <= ${now}
					ELSE (${events.startsAt} + (COALESCE(${events.durationMinutes}, 60) || ' minutes')::interval) <= ${now}
				END
			`
		))
		.returning({ id: events.id });
	result.promotedCompleted = toComplete.length;

	// 3) 1-hour-before reminders. Window: events starting in [now, now+1h] that
	//    haven't been reminded yet for this user. We track per-registration
	//    reminder state via `event_registrations.reminder_sent_at`.
	const reminderWindowEnd = new Date(now.getTime() + 60 * 60 * 1000);
	const dueReminders = await db.select({
		regId: eventRegistrations.id,
		userId: eventRegistrations.userId,
		eventId: events.id,
		title: events.title,
		startsAt: events.startsAt,
		audience: events.audience,
		meetingUrl: events.meetingUrl
	})
		.from(eventRegistrations)
		.innerJoin(events, eq(events.id, eventRegistrations.eventId))
		.where(and(
			eq(eventRegistrations.status, 'confirmed'),
			eq(events.status, 'scheduled'),
			gte(events.startsAt, now),
			lte(events.startsAt, reminderWindowEnd),
			isNull(eventRegistrations.reminderSentAt)
		));

	for (const r of dueReminders) {
		await notify({
			userId: r.userId,
			kind: 'event_reminder',
			title: `Starting soon: ${r.title}`,
			message: `${r.title} starts in under an hour. Join the meeting from your event page.`,
			actionUrl: r.audience === 'creator' ? '/creator/events' : '/webinars',
			emailPref: 'eventReminders'
		}).catch(() => { /* best-effort */ });

		await db.update(eventRegistrations)
			.set({ reminderSentAt: now })
			.where(eq(eventRegistrations.id, r.regId));

		result.remindersSent += 1;
	}

	return json({ ok: true, runAt: now.toISOString(), ...result });
};
