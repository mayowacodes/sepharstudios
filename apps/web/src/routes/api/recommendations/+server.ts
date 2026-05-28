import { json, type RequestHandler } from '@sveltejs/kit';
import { getRecommendations } from '$lib/server/recommendations';

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const user = locals.user;
		if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

		const profileId = url.searchParams.get('profileId');
		const limit = Number(url.searchParams.get('limit') ?? '12');

		const recommendations = await getRecommendations(user.id, profileId, limit);
		return json(recommendations);
	} catch (e) {
		console.error('GET /api/recommendations failed', e);
		return json({ error: 'Failed to load recommendations' }, { status: 500 });
	}
};
