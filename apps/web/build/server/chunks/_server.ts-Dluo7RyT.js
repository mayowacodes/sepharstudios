import { d as db, ar as profiles } from './drizzle-CsnNxG5m.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { and, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/profiles/[id]/+server.ts
var PUT = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { name, avatarColor, avatarEmoji, contentRating, safeModeEnabled } = await request.json();
	const [updated] = await db.update(profiles).set({
		name,
		avatarColor,
		avatarEmoji,
		contentRating,
		safeModeEnabled,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(and(eq(profiles.id, params.id), eq(profiles.userId, session.user.id))).returning();
	if (!updated) return json({ error: "Not found" }, { status: 404 });
	return json(updated);
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	await db.delete(profiles).where(and(eq(profiles.id, params.id), eq(profiles.userId, session.user.id)));
	return json({ success: true });
};

export { DELETE, PUT };
//# sourceMappingURL=_server.ts-Dluo7RyT.js.map
