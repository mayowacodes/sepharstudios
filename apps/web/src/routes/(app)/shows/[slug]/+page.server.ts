import type { PageServerLoad } from './$types';
import { loadMediaDetail } from '$lib/server/media-detail-load';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	return loadMediaDetail({
		slug: params.slug,
		mediaType: 'tv',
		userId: session?.user.id
	});
};
