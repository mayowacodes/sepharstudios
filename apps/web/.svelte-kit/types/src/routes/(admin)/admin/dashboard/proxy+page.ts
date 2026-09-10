// @ts-nocheck
import { apiOrError } from '$lib/api/client';
import type { AdminDashboardPayload } from '../../../api/admin/dashboard/+server';
import type { PageLoad } from './$types';

/** Admin dashboard. The endpoint enforces the admin role independently. */
export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
	return apiOrError<AdminDashboardPayload>('/api/admin/dashboard', { fetch });
};
