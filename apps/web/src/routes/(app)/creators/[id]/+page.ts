import { apiOrError } from '$lib/api/client';
import type { CreatorPagePayload } from '../../../api/creators/[id]/page/+server';
import type { PageLoad } from './$types';

/** Public creator profile. */
export const load: PageLoad = async ({ params, fetch }) => {
	return apiOrError<CreatorPagePayload>(
		`/api/creators/${encodeURIComponent(params.id)}/page`,
		{ fetch }
	);
};
