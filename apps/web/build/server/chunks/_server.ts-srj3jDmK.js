import { a as recordImpression } from './thumbnail-rotation-DM2830mu.js';
import { j as json } from './index-Cv5VcsYq.js';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-srj3jDmK.js.map
