import { w as db, _ as profiles } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-CYPrquGx.js.map
