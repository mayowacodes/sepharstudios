// @ts-nocheck
import type { PageServerLoad } from './$types';
import { loadMediaDetail } from '$lib/server/media-detail-load';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const session = await locals.auth.getSession();
	return loadMediaDetail({
		slug: params.slug,
		mediaType: 'tv',
		userId: session?.user.id
	});
};
