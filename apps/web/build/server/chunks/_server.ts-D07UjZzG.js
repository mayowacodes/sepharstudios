import { d as db, c as user, j as adminMessages } from './drizzle-DlGuU73K.js';
import { n as notify } from './notify-C-2jy7X7.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';

//#region src/routes/api/admin/users/[id]/warn/+server.ts
/**
* POST /api/admin/users/[id]/warn
*
* Issues a formal warning to the user. Implementation: write an
* `admin_messages` row with `type='warning'`. Surfaces in the creator
* inbox + as an in-app notification.
*
* Body: { subject?, message }
*/
var POST = async ({ params, locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const message = body.message?.trim();
	if (!message) return json({ error: "message is required" }, { status: 400 });
	const [target] = await db.select({
		id: user.id,
		name: user.name
	}).from(user).where(eq(user.id, params.id)).limit(1);
	if (!target) return json({ error: "User not found" }, { status: 404 });
	const subject = body.subject?.trim() || "Warning from Sephar Studios";
	await db.insert(adminMessages).values({
		creatorId: target.id,
		adminId: locals.user.id,
		subject,
		message,
		type: "warning",
		status: "sent",
		isFromAdmin: true
	});
	notify({
		userId: target.id,
		kind: "system",
		title: "You received a warning",
		message: subject,
		actionUrl: "/creator/inbox"
	}).catch(() => void 0);
	return json({ success: true });
};

export { POST };
//# sourceMappingURL=_server.ts-D07UjZzG.js.map
