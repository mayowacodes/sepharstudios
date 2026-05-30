import { g as getRecommendations } from './recommendations-CixGgErT.js';
import { j as json } from './index-5kYmxIr9.js';
import './drizzle-BjmsPAPl.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-Baql0hxE.js';
import './ai-settings-Dm4yygKB.js';
import './ai-tagging-D0LHBZqa.js';
import './index-DBqjc0Yf.js';

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

export { GET };
//# sourceMappingURL=_server.ts-B7HMpPAO.js.map
