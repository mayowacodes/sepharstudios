import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { contentShares } from '$lib/db/schema/sepharstudios';
import { track } from '$lib/server/analytics';

/**
 * POST /api/shares
 *   { contentId: string, channel?: 'link' | 'twitter' | 'facebook' | 'whatsapp' | 'email' | 'native' }
 *
 * Append-only event log. Anonymous users can share (we record userId=null).
 * Used by creator analytics to power `totalShares` and to identify which
 * channels drive virality.
 */

const ALLOWED_CHANNELS = new Set(['link', 'twitter', 'facebook', 'whatsapp', 'email', 'native']);

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json().catch(() => ({})) as { contentId?: string; channel?: string };
	if (!body.contentId) {
		return json({ error: 'contentId is required' }, { status: 400 });
	}
	const channel = body.channel && ALLOWED_CHANNELS.has(body.channel) ? body.channel : 'link';
	const session = await locals.auth.getSession();

	await db.insert(contentShares).values({
		contentId: body.contentId,
		userId: session?.user.id ?? null,
		channel
	});

	await track(session?.user.id ?? null, 'content_share', {
		contentId: body.contentId,
		channel
	});

	return json({ success: true });
};
