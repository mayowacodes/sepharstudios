import { n as recordImpression } from "../../../../../../chunks/thumbnail-rotation.js";
import { json } from "@sveltejs/kit";
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
//#endregion
export { POST };
