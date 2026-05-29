import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import {
	newsletterSubscriptions,
	notificationPreferences,
	mediaLibrary
} from '$lib/db/schema/sepharstudios';
import { and, eq, gte, desc, isNotNull } from 'drizzle-orm';
import { sendWeeklyDigest, type DigestItem } from '$lib/server/notifications';

/**
 * POST /api/cron/newsletter-weekly-digest
 *
 * Sends the weekly content digest to active newsletter subscribers. For
 * signed-in users we also require their `notification_preferences.weeklyDigest`
 * to be true; anonymous subscribers (no userId on the row) always get it —
 * they explicitly joined the list with no other opt-in.
 *
 * Auth: CRON_SECRET bearer (same as other crons).
 * Schedule: Mondays 09:00 UTC (`0 9 * * 1`).
 * Throttles: 50-per-chunk + 1s sleep between chunks to stay under Resend's
 * per-second rate limit.
 */

const SITE = 'https://sepharstudios.com';
const CHUNK = 50;
const CHUNK_DELAY_MS = 1000;
const DIGEST_LOOKBACK_DAYS = 7;
const MAX_ITEMS = 10;

async function sleep(ms: number) {
	await new Promise((r) => setTimeout(r, ms));
}

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) {
		return json({ error: 'CRON_SECRET not configured on server' }, { status: 500 });
	}
	if (auth !== `Bearer ${expected}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const lookback = new Date(Date.now() - DIGEST_LOOKBACK_DAYS * 86_400_000);

	const recent = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		mediaType: mediaLibrary.mediaType,
		description: mediaLibrary.description
	})
		.from(mediaLibrary)
		.where(and(
			eq(mediaLibrary.isActive, true),
			eq(mediaLibrary.status, 'approved'),
			gte(mediaLibrary.createdAt, lookback)
		))
		.orderBy(desc(mediaLibrary.createdAt))
		.limit(MAX_ITEMS);

	if (recent.length === 0) {
		return json({ ok: true, runAt: new Date().toISOString(), skipped: true, reason: 'No new content this week' });
	}

	const items: DigestItem[] = recent.map((r) => ({
		id: r.id,
		title: r.title,
		mediaType: r.mediaType ?? null,
		description: r.description ?? null
	}));

	// Subscribers: active newsletter rows. For signed-in users we also check
	// notification_preferences.weeklyDigest=true.
	const subs = await db.select({
		subId: newsletterSubscriptions.id,
		email: newsletterSubscriptions.email,
		userId: newsletterSubscriptions.userId,
		unsubscribeToken: newsletterSubscriptions.unsubscribeToken,
		prefWeekly: notificationPreferences.weeklyDigest
	})
		.from(newsletterSubscriptions)
		.leftJoin(notificationPreferences, eq(notificationPreferences.userId, newsletterSubscriptions.userId))
		.where(and(
			eq(newsletterSubscriptions.status, 'active'),
			isNotNull(newsletterSubscriptions.email)
		));

	const eligible = subs.filter((s) => {
		// Anonymous subscribers: always eligible (they opted in via the list).
		if (!s.userId) return true;
		// Signed-in: require pref flag true. (Null/missing pref row counts as
		// false because weeklyDigest default is false in the schema.)
		return s.prefWeekly === true;
	});

	const result = { sent: 0, failed: 0, skipped: subs.length - eligible.length, total: subs.length };

	for (let i = 0; i < eligible.length; i += CHUNK) {
		const batch = eligible.slice(i, i + CHUNK);
		await Promise.all(batch.map(async (s) => {
			try {
				const unsubscribeUrl = `${SITE}/api/newsletter/unsubscribe?token=${s.unsubscribeToken}`;
				const name = (s.email.split('@')[0] ?? 'there').replace(/[\W_]+/g, ' ').slice(0, 40) || 'there';
				await sendWeeklyDigest(s.email, name, items, unsubscribeUrl);
				result.sent += 1;
			} catch (err) {
				console.warn('[digest] send failed for', s.email, err);
				result.failed += 1;
			}
		}));
		if (i + CHUNK < eligible.length) await sleep(CHUNK_DELAY_MS);
	}

	return json({ ok: true, runAt: new Date().toISOString(), itemsIncluded: items.length, ...result });
};
