import { json, type RequestHandler } from '@sveltejs/kit';
import { getRecommendations } from '$lib/server/recommendations';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const profileId = url.searchParams.get('profileId');
	const limit = Number(url.searchParams.get('limit') ?? '12');

	const recommendations = await getRecommendations(session.user.id, profileId, limit);
	return json(recommendations);
};
