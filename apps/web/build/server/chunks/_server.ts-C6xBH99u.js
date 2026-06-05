import { w as db, L as liveStreams } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/encoder/live-state/validate/+server.ts
/**
* GET /api/encoder/live-state/validate?streamKey=<key>
*
* Called by the orchestrator's RTMP ingest on every new connection to
* decide whether to accept or reject the stream. Returns the stream id
* + creator id when valid so the orchestrator can route per-stream
* artifacts.
*/
var GET = async ({ url }) => {
	const streamKey = url.searchParams.get("streamKey");
	if (!streamKey) return json({ valid: false });
	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		status: liveStreams.status
	}).from(liveStreams).where(eq(liveStreams.streamKey, streamKey)).limit(1);
	if (!stream) return json({ valid: false });
	if (stream.status === "ended") return json({
		valid: false,
		reason: "Stream has ended"
	});
	return json({
		valid: true,
		streamId: stream.id,
		creatorId: stream.creatorId
	});
};

export { GET };
//# sourceMappingURL=_server.ts-C6xBH99u.js.map
