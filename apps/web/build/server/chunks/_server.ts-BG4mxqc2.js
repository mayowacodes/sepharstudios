import { r as recordClick } from './thumbnail-rotation-DM7HbB8n.js';
import { j as json } from './index.js-DwRgOKlO.js';
import './drizzle-DlGuU73K.js';
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
//# sourceMappingURL=_server.ts-BG4mxqc2.js.map
