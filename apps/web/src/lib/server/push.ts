import webpush from 'web-push';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { db } from '$lib/db/drizzle';
import { pushSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

/**
 * Web Push fan-out for the in-app notifications system.
 *
 * VAPID keys live in:
 *   PUBLIC_VAPID_PUBLIC_KEY   — exposed to the browser for subscription
 *   VAPID_PRIVATE_KEY         — server-only
 *   VAPID_CONTACT             — mailto:… or https URL (per RFC 8292)
 *
 * Generate a fresh pair via `bun x web-push generate-vapid-keys`. Once
 * deployed, **never** rotate without replanning subscriptions — all
 * existing browser subscriptions are bound to the public key and will
 * silently stop receiving pushes after a rotation.
 */

let configured = false;

function configure() {
	if (configured) return true;
	const pub = publicEnv.PUBLIC_VAPID_PUBLIC_KEY;
	const priv = env.VAPID_PRIVATE_KEY;
	const contact = env.VAPID_CONTACT || 'mailto:admin@sepharstudios.com';
	if (!pub || !priv) return false;
	webpush.setVapidDetails(contact, pub, priv);
	configured = true;
	return true;
}

export function isPushConfigured(): boolean {
	return configure();
}

export interface PushPayload {
	title: string;
	body: string;
	url?: string;
	tag?: string;
}

/**
 * Send a Web Push to every registered subscription for a user. Dead
 * subscriptions (410 Gone) are pruned automatically so we don't keep
 * pushing to a browser that revoked permission.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<{ sent: number; pruned: number }> {
	if (!configure()) return { sent: 0, pruned: 0 };

	const subs = await db.select()
		.from(pushSubscriptions)
		.where(eq(pushSubscriptions.userId, userId));

	let sent = 0;
	let pruned = 0;
	const body = JSON.stringify(payload);

	await Promise.all(subs.map(async (s) => {
		try {
			await webpush.sendNotification(
				{ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
				body
			);
			sent += 1;
			await db.update(pushSubscriptions)
				.set({ lastSeenAt: new Date() })
				.where(eq(pushSubscriptions.id, s.id));
		} catch (err: unknown) {
			const status = (err as { statusCode?: number }).statusCode;
			if (status === 404 || status === 410) {
				await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, s.id));
				pruned += 1;
			} else {
				console.warn('[push] send failed for sub', s.id, err);
			}
		}
	}));

	return { sent, pruned };
}
