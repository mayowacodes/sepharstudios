import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminSettings } from '$lib/db/schema/sepharstudios';

/**
 * GET /api/platform-settings
 *
 * Public, unauthenticated read of the subset of `admin_settings.platform`
 * that the client UI needs (e.g. the creator upload step needs to know the
 * minimum accepted video resolution). Kept narrow on purpose — the full
 * admin-settings object stays admin-only at /api/admin/settings.
 */

const PUBLIC_DEFAULTS = {
	minVideoHeight: 1080,
	maxUploadSize: 5000,
	supportedFormats: ['mp4', 'mov', 'avi', 'mkv']
};

export const GET: RequestHandler = async () => {
	const row = await db.select().from(adminSettings).then((r) => r[0]);
	const platform = (row?.platform ?? {}) as Record<string, unknown>;

	return json({
		minVideoHeight: Number(platform.minVideoHeight ?? PUBLIC_DEFAULTS.minVideoHeight),
		maxUploadSize: Number(platform.maxUploadSize ?? PUBLIC_DEFAULTS.maxUploadSize),
		supportedFormats: Array.isArray(platform.supportedFormats)
			? (platform.supportedFormats as string[])
			: PUBLIC_DEFAULTS.supportedFormats
	}, {
		headers: {
			// Settings rarely change; allow the CDN to cache for 5 minutes so
			// the upload step doesn't refetch on every page load.
			'Cache-Control': 'public, max-age=300, s-maxage=300'
		}
	});
};
