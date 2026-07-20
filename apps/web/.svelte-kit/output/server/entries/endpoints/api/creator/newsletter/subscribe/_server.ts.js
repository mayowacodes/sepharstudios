import { J as newsletterSubscriptions, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
//#region src/routes/api/creator/newsletter/subscribe/+server.ts
/**
* POST /api/creator/newsletter/subscribe
*
* Subscribes the caller's email to the creator newsletter, or updates their
* preferences if already subscribed. Auth-optional (logged-in users get
* user_id back-linked); anonymous signups also accepted.
*
* Body: { email: string, preferences?: Record<string, boolean> }
*
* Returns the subscription row's unsubscribe_token so the client can offer a
* "manage preferences" link without requiring login.
*/
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession().catch(() => null);
	const body = await request.json();
	const email = (body.email ?? "").trim().toLowerCase();
	if (!email || !EMAIL_RE.test(email)) return json({ error: "A valid email is required" }, { status: 400 });
	return json({
		success: true,
		...(await db.insert(newsletterSubscriptions).values({
			email,
			userId: session?.user.id ?? null,
			audience: "creator",
			preferences: body.preferences ?? {},
			status: "active"
		}).onConflictDoUpdate({
			target: [newsletterSubscriptions.email, newsletterSubscriptions.audience],
			set: {
				preferences: body.preferences ?? {},
				status: "active",
				userId: session?.user.id ?? sql`${newsletterSubscriptions.userId}`,
				updatedAt: /* @__PURE__ */ new Date()
			}
		}).returning({
			id: newsletterSubscriptions.id,
			unsubscribeToken: newsletterSubscriptions.unsubscribeToken
		}))[0]
	});
};
/**
* DELETE /api/creator/newsletter/subscribe?token=…
*
* One-click unsubscribe. The link in every newsletter email points here with
* the row's `unsubscribe_token`. Required by CAN-SPAM (US) / GDPR (EU).
*/
var DELETE = async ({ url }) => {
	const token = url.searchParams.get("token");
	if (!token) return json({ error: "Missing token" }, { status: 400 });
	if ((await db.update(newsletterSubscriptions).set({
		status: "unsubscribed",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(and(eq(newsletterSubscriptions.unsubscribeToken, token), eq(newsletterSubscriptions.status, "active"))).returning({ id: newsletterSubscriptions.id })).length === 0) return json({ error: "Subscription not found or already unsubscribed" }, { status: 404 });
	return json({ success: true });
};
//#endregion
export { DELETE, POST };
