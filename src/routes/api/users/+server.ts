import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Fields } from '$lib/constants';
import { getSearchFilterList } from '$lib/server';

export const GET: RequestHandler = async ({ locals, url }) => {
	return await getSearchFilterList(locals, url, Fields.USER);
};
