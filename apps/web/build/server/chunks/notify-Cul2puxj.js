import { a as public_env, p as private_env } from './shared-server-DUDL94jl.js';
import { n as db, F as notifications, E as notificationPreferences, a0 as user, O as pushSubscriptions } from './drizzle-BjmsPAPl.js';
import { eq } from 'drizzle-orm';
import webpush from 'web-push';

//#region src/lib/server/push.ts
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
var configured = false;
function configure() {
	if (configured) return true;
	const pub = public_env.PUBLIC_VAPID_PUBLIC_KEY;
	const priv = private_env.VAPID_PRIVATE_KEY;
	const contact = private_env.VAPID_CONTACT || "mailto:admin@sepharstudios.com";
	if (!pub || !priv) return false;
	webpush.setVapidDetails(contact, pub, priv);
	configured = true;
	return true;
}
function isPushConfigured() {
	return configure();
}
/**
* Send a Web Push to every registered subscription for a user. Dead
* subscriptions (410 Gone) are pruned automatically so we don't keep
* pushing to a browser that revoked permission.
*/
async function sendPushToUser(userId, payload) {
	if (!configure()) return {
		sent: 0,
		pruned: 0
	};
	const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
	let sent = 0;
	let pruned = 0;
	const body = JSON.stringify(payload);
	await Promise.all(subs.map(async (s) => {
		try {
			await webpush.sendNotification({
				endpoint: s.endpoint,
				keys: {
					p256dh: s.p256dh,
					auth: s.auth
				}
			}, body);
			sent += 1;
			await db.update(pushSubscriptions).set({ lastSeenAt: /* @__PURE__ */ new Date() }).where(eq(pushSubscriptions.id, s.id));
		} catch (err) {
			const status = err.statusCode;
			if (status === 404 || status === 410) {
				await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, s.id));
				pruned += 1;
			} else console.warn("[push] send failed for sub", s.id, err);
		}
	}));
	return {
		sent,
		pruned
	};
}
//#endregion
//#region src/lib/server/notify.ts
async function notify(args) {
	try {
		await db.insert(notifications).values({
			userId: args.userId,
			kind: args.kind,
			title: args.title,
			message: args.message,
			actionUrl: args.actionUrl ?? null
		});
	} catch (err) {
		console.error("[notify] insert failed:", err);
	}
	if (isPushConfigured()) sendPushToUser(args.userId, {
		title: args.title,
		body: args.message,
		url: args.actionUrl,
		tag: args.kind
	}).catch((err) => console.warn("[notify] push fan-out failed:", err));
	if (!args.emailPref || !args.emailFn) return;
	const prefDefaults = {
		newReleases: true,
		trialExpiry: true,
		paymentConfirmation: true,
		weeklyDigest: false,
		creatorUpdates: false,
		eventReminders: true
	};
	try {
		const [prefs] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, args.userId)).limit(1);
		const value = prefs?.[args.emailPref];
		if (!(value === null || value === void 0 ? prefDefaults[args.emailPref] : value === true)) return;
		const [account] = await db.select({
			email: user.email,
			name: user.name
		}).from(user).where(eq(user.id, args.userId)).limit(1);
		if (!account?.email) return;
		await args.emailFn(account.email, account.name ?? "there");
	} catch (err) {
		console.error("[notify] email side-effect failed:", err);
	}
}

export { notify as n };
//# sourceMappingURL=notify-Cul2puxj.js.map
