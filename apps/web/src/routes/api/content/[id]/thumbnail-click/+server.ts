import { json, type RequestHandler } from '@sveltejs/kit';
import { recordClick } from '$lib/server/thumbnail-rotation';

/**
 * POST /api/content/[id]/thumbnail-click
 *
 * Body: { variantId }
 *
 * Fire-and-forget from browse cards when a viewer clicks through. Pairs
 * with thumbnail-impression to compute CTR for the A/B test panel.
 */

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({})) as { variantId?: string };
	if (!body.variantId) return json({ ok: true });
	try {
		await recordClick(body.variantId);
	} catch (err) {
		console.warn('[thumbnail-click] failed:', err);
	}
	return json({ ok: true });
};
