import { r as recordClick } from './thumbnail-rotation-DM2830mu.js';
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
//# sourceMappingURL=_server.ts-DZXDXRT6.js.map
