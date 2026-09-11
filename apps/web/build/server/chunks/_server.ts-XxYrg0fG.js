import { a as recordImpression } from './thumbnail-rotation-CM2R1-AO.js';
import { j as json } from './index.js-BP8aAXBX.js';
import './drizzle-CsnNxG5m.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

//#region src/routes/api/content/[id]/thumbnail-impression/+server.ts
/**
* POST /api/content/[id]/thumbnail-impression
*
* Body: { variantId }
*
* Fire-and-forget from browse cards. Logs an impression for the A/B test
* variant. No auth required — this is a tracking pixel.
*/
var POST = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	if (!body.variantId) return json({ ok: true });
	try {
		await recordImpression(body.variantId);
	} catch (err) {
		console.warn("[thumbnail-impression] failed:", err);
	}
	return json({ ok: true });
};

export { POST };
//# sourceMappingURL=_server.ts-XxYrg0fG.js.map
