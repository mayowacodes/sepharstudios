import { p as private_env } from './shared-server-DUDL94jl.js';
import { n as db, H as paystackEvents, I as paystackSubscriptions } from './drizzle-BjmsPAPl.js';
import { n as notify } from './notify-Cul2puxj.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';

//#region src/routes/api/payment/webhook/+server.ts
function isPaystackEvent(value) {
	return !!value && typeof value === "object" && typeof value.event === "string" && typeof value.data === "object";
}
/**
* Derive a stable dedup key from a Paystack webhook payload. Paystack doesn't
* send an explicit event-id at the envelope level, but the `data.id` (numeric
* transaction/event ID) or `data.reference` is stable across retries of the
* same event. We prefer `data.id`, falling back to a composite key.
*/
function deriveEventId(event) {
	if (event.data.id !== void 0 && event.data.id !== null) return `${event.event}:${event.data.id}`;
	if (typeof event.data.reference === "string") return `${event.event}:${event.data.reference}`;
	const json = JSON.stringify(event);
	return `${event.event}:hash:${crypto.createHash("sha256").update(json).digest("hex").slice(0, 32)}`;
}
var POST = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get("x-paystack-signature");
	const secret = private_env.PAYSTACK_SECRET_KEY;
	if (!secret) return json({ error: "PAYSTACK_SECRET_KEY is not configured" }, { status: 500 });
	if (crypto.createHmac("sha512", secret).update(body).digest("hex") !== signature) return json({ error: "Invalid signature" }, { status: 401 });
	let event;
	try {
		const parsed = JSON.parse(body);
		if (!isPaystackEvent(parsed)) return json({ error: "Malformed webhook body" }, { status: 400 });
		event = parsed;
	} catch {
		return json({ error: "Webhook body is not valid JSON" }, { status: 400 });
	}
	const eventId = deriveEventId(event);
	try {
		await db.insert(paystackEvents).values({
			eventId,
			eventType: event.event,
			payload: event
		});
	} catch (err) {
		if (err?.code === "23505") return json({
			received: true,
			duplicate: true
		});
		console.error("[webhook] event dedup insert failed:", err);
		return json({ error: "Internal error" }, { status: 500 });
	}
	switch (event.event) {
		case "charge.success": {
			const userId = event.data.metadata?.userId;
			if (!userId) {
				console.warn("charge.success without metadata.userId — skipping");
				break;
			}
			await db.update(paystackSubscriptions).set({
				status: "active",
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(paystackSubscriptions.userId, userId));
			await notify({
				userId,
				kind: "subscription",
				title: "Payment successful",
				message: "Your Sephar Studios subscription is active. Enjoy unlimited faith-based content.",
				actionUrl: "/browse"
			});
			break;
		}
		default: console.info("Unhandled Paystack webhook event:", event.event);
	}
	return json({ received: true });
};

export { POST };
//# sourceMappingURL=_server.ts-C8cgA0tJ.js.map
