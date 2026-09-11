import { r as recordClick } from './thumbnail-rotation-Ce6Vb6SL.js';
import { j as json } from './index.js-CxPEndTa.js';
import './drizzle-C3SH12nS.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

//#region src/routes/api/content/[id]/thumbnail-click/+server.ts
/**
* POST /api/content/[id]/thumbnail-click
*
* Body: { variantId }
*
* Fire-and-forget from browse cards when a viewer clicks through. Pairs
* with thumbnail-impression to compute CTR for the A/B test panel.
*/
var POST = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	if (!body.variantId) return json({ ok: true });
	try {
		await recordClick(body.variantId);
	} catch (err) {
		console.warn("[thumbnail-click] failed:", err);
	}
	return json({ ok: true });
};

export { POST };
//# sourceMappingURL=_server.ts-BWx_jCbF.js.map
