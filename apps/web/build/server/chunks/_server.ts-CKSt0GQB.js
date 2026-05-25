import { j as json } from './index-BcOZ6EV9.js';
import { g as getRecommendations } from './recommendations-BWTeiXrZ.js';
import './utils-FiC4zhrQ.js';
import './drizzle-CW7hPjGG.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-BckqNG7d.js';
import './ai-settings-DGaRpVWA.js';
import './ai-tagging-BQ3HJZC1.js';

const GET = async ({ url, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const profileId = url.searchParams.get("profileId");
  const limit = Number(url.searchParams.get("limit") ?? "12");
  const recommendations = await getRecommendations(session.user.id, profileId, limit);
  return json(recommendations);
};

export { GET };
//# sourceMappingURL=_server.ts-CKSt0GQB.js.map
