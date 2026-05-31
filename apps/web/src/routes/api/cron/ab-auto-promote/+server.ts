import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { runAutoPromoteSweep } from '$lib/server/ab-promote';

/**
 * POST /api/cron/ab-auto-promote
 *
 * Sweeps every content row that has ≥2 active thumbnail variants without
 * a winner yet, runs the Bayesian comparison, and auto-promotes when a
 * statistically significant winner emerges. CRON_SECRET bearer.
 *
 * Recommended schedule: hourly.
 */

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, { status: 401 });

	const result = await runAutoPromoteSweep();
	return json({ ok: true, ...result });
};
