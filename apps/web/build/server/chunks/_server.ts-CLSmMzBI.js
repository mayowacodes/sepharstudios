import { w as db, Y as ppvContent } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/content/[id]/ppv/+server.ts
var POST = async ({ params, request, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const contentId = params.id;
	const { finalPriceCents, isActive } = await request.json();
	if (!finalPriceCents || finalPriceCents < 99) return json({ error: "Final price must be at least $0.99 (99 cents)" }, { status: 400 });
	const existing = await db.select({ id: ppvContent.id }).from(ppvContent).where(eq(ppvContent.contentId, contentId)).then((r) => r[0]);
	if (existing) await db.update(ppvContent).set({
		finalPriceCents,
		isActive,
		adminApprovedAt: isActive ? /* @__PURE__ */ new Date() : null
	}).where(eq(ppvContent.id, existing.id));
	else await db.insert(ppvContent).values({
		contentId,
		finalPriceCents,
		isActive,
		adminApprovedAt: isActive ? /* @__PURE__ */ new Date() : null
	});
	return json({
		success: true,
		finalPriceCents,
		isActive
	});
};
var DELETE = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	await db.delete(ppvContent).where(eq(ppvContent.contentId, params.id));
	return json({ success: true });
};

export { DELETE, POST };
//# sourceMappingURL=_server.ts-CLSmMzBI.js.map
