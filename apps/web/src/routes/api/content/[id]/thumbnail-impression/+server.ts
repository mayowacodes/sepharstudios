import { json, type RequestHandler } from '@sveltejs/kit';
import { recordImpression } from '$lib/server/thumbnail-rotation';

/**
 * POST /api/content/[id]/thumbnail-impression
 *
 * Body: { variantId }
 *
 * Fire-and-forget from browse cards. Logs an impression for the A/B test
 * variant. No auth required — this is a tracking pixel.
 */

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({})) as { variantId?: string };
	if (!body.variantId) return json({ ok: true });
	try {
		await recordImpression(body.variantId);
	} catch (err) {
		console.warn('[thumbnail-impression] failed:', err);
	}
	return json({ ok: true });
};
