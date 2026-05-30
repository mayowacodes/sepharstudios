import { t as getRecommendations } from "../../../../chunks/recommendations.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/recommendations/+server.ts
var GET = async ({ url, locals }) => {
	try {
		const user = locals.user;
		if (!user) return json({ error: "Unauthorized" }, { status: 401 });
		const profileId = url.searchParams.get("profileId");
		const limit = Number(url.searchParams.get("limit") ?? "12");
		return json(await getRecommendations(user.id, profileId, limit));
	} catch (e) {
		console.error("GET /api/recommendations failed", e);
		return json({ error: "Failed to load recommendations" }, { status: 500 });
	}
};
//#endregion
export { GET };
