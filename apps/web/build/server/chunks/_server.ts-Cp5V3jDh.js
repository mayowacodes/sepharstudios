import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { d as decide } from './decision-D3MG31ZT.js';
import { j as json } from './index.js-CxPEndTa.js';
import './drizzle-C3SH12nS.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './redis-7fSdOjSS.js';
import 'ioredis';
import './paystack-DWLDZ9qO.js';
import 'node:crypto';

//#region src/routes/api/admin/promo/preview/+server.ts
/**
* POST /api/admin/promo/preview
*
* Dry-runs the auction against a synthetic viewer and returns the winner AND
* every loser with its rejection reason.
*
* This exists because "why isn't my campaign serving?" is the number-one
* ad-ops question, and without it every answer is a database archaeology
* session across flight windows, targeting arrays, frequency caps and goal
* counters. The rejection list turns that into one request.
*
* Writes nothing. Unlike /api/promo/decision it does not record an impression
* or tick the frequency counter, so an admin can run it repeatedly without
* polluting delivery numbers or exhausting a cap they are trying to diagnose.
*
* Body: { contentId, deviceType?, country?, plan?, status? }
*/
var POST = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const body = await request.json().catch(() => null);
	const contentId = body?.contentId;
	if (!contentId) return json({ error: "contentId is required" }, { status: 400 });
	const { decision, rejections } = await decide({
		contentId,
		userId: null,
		deviceType: body?.deviceType ?? "desktop",
		country: body?.country ?? null,
		subscription: body?.plan ? {
			plan: body.plan,
			status: body.status ?? "active"
		} : null
	}, { explain: true });
	return json({
		wouldServe: decision !== null,
		winner: decision ? {
			campaignId: decision.campaignId,
			creativeId: decision.creativeId,
			behavior: decision.behavior,
			durationSeconds: decision.durationSeconds
		} : null,
		rejections
	});
};

export { POST };
//# sourceMappingURL=_server.ts-Cp5V3jDh.js.map
