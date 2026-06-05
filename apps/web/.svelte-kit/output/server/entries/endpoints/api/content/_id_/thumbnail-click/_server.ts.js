import { t as recordClick } from "../../../../../../chunks/thumbnail-rotation.js";
import { json } from "@sveltejs/kit";
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
//#endregion
export { POST };
