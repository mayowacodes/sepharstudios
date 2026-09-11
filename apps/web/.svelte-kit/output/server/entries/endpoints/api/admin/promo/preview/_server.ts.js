import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { i as decide } from "../../../../../../chunks/decision.js";
import { json } from "@sveltejs/kit";
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
//#endregion
export { POST };
