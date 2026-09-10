import { apiSafe } from '$lib/api/client';
import type { InFlightEncodesPayload } from '../../api/creator/in-flight-encodes/+server';
import type { PageLoad } from './$types';

/**
 * Creator dashboard. The previous server load caught its own query errors and
 * rendered an empty list rather than failing the page — `apiSafe` keeps that.
 */
export const load: PageLoad = async ({ fetch }) => {
	return apiSafe<InFlightEncodesPayload>(
		'/api/creator/in-flight-encodes',
		{ inFlightEncodes: [] },
		{ fetch }
	);
};
