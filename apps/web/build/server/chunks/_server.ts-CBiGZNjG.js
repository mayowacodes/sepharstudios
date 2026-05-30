import { n as db, i as contentShares } from './drizzle-BjmsPAPl.js';
import { t as track } from './analytics-C04NmVoh.js';
import { j as json } from './index-5kYmxIr9.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import '@openpanel/sdk';
import './index-DBqjc0Yf.js';

//#region src/routes/api/shares/+server.ts
/**
* POST /api/shares
*   { contentId: string, channel?: 'link' | 'twitter' | 'facebook' | 'whatsapp' | 'email' | 'native' }
*
* Append-only event log. Anonymous users can share (we record userId=null).
* Used by creator analytics to power `totalShares` and to identify which
* channels drive virality.
*/
var ALLOWED_CHANNELS = new Set([
	"link",
	"twitter",
	"facebook",
	"whatsapp",
	"email",
	"native"
]);
var POST = async ({ request, locals }) => {
	const body = await request.json().catch(() => ({}));
	if (!body.contentId) return json({ error: "contentId is required" }, { status: 400 });
	const channel = body.channel && ALLOWED_CHANNELS.has(body.channel) ? body.channel : "link";
	const session = await locals.auth.getSession();
	await db.insert(contentShares).values({
		contentId: body.contentId,
		userId: session?.user.id ?? null,
		channel
	});
	await track(session?.user.id ?? null, "content_share", {
		contentId: body.contentId,
		channel
	});
	return json({ success: true });
};

export { POST };
//# sourceMappingURL=_server.ts-CBiGZNjG.js.map
