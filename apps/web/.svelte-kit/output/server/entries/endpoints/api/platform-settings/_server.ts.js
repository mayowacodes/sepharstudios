import { d as adminSettings, t as db } from "../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/platform-settings/+server.ts
/**
* GET /api/platform-settings
*
* Public, unauthenticated read of the subset of `admin_settings.platform`
* that the client UI needs (e.g. the creator upload step needs to know the
* minimum accepted video resolution). Kept narrow on purpose — the full
* admin-settings object stays admin-only at /api/admin/settings.
*/
var PUBLIC_DEFAULTS = {
	minVideoHeight: 1080,
	maxUploadSize: 5e3,
	supportedFormats: [
		"mp4",
		"mov",
		"avi",
		"mkv"
	]
};
var GET = async () => {
	const platform = (await db.select().from(adminSettings).then((r) => r[0]))?.platform ?? {};
	return json({
		minVideoHeight: Number(platform.minVideoHeight ?? PUBLIC_DEFAULTS.minVideoHeight),
		maxUploadSize: Number(platform.maxUploadSize ?? PUBLIC_DEFAULTS.maxUploadSize),
		supportedFormats: Array.isArray(platform.supportedFormats) ? platform.supportedFormats : PUBLIC_DEFAULTS.supportedFormats
	}, { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } });
};
//#endregion
export { GET };
