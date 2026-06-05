import { a as user, l as adminMessages, t as db } from "../../../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/users/[id]/ban/+server.ts
/**
* POST /api/admin/users/[id]/ban
*
* Bans a user. Sets `user.banned=true`, stores `banReason`, optionally a
* `banExpires` (omit for permanent). Also sends an admin_message + an
* in-app notification so the user knows why.
*
* Body: { reason, expiresAt?, message? }
*
* Idempotent — banning an already-banned user just updates the reason.
*/
var POST = async ({ params, locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const reason = body.reason?.trim();
	if (!reason) return json({ error: "reason is required" }, { status: 400 });
	const [target] = await db.select({
		id: user.id,
		name: user.name,
		banned: user.banned
	}).from(user).where(eq(user.id, params.id)).limit(1);
	if (!target) return json({ error: "User not found" }, { status: 404 });
	if (target.id === locals.user.id) return json({ error: "You cannot ban yourself" }, { status: 400 });
	const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
	if (expiresAt && isNaN(expiresAt.getTime())) return json({ error: "Invalid expiresAt" }, { status: 400 });
	await db.update(user).set({
		banned: true,
		banReason: reason,
		banExpires: expiresAt
	}).where(eq(user.id, target.id));
	const subject = expiresAt ? `Your account has been suspended until ${expiresAt.toISOString().slice(0, 10)}` : "Your account has been banned";
	await db.insert(adminMessages).values({
		creatorId: target.id,
		adminId: locals.user.id,
		subject,
		message: body.message?.trim() || reason,
		type: "ban",
		status: "sent",
		isFromAdmin: true
	});
	notify({
		userId: target.id,
		kind: "system",
		title: subject,
		message: reason,
		actionUrl: "/creator/inbox"
	}).catch(() => void 0);
	return json({
		success: true,
		banned: true,
		expiresAt
	});
};
//#endregion
export { POST };
