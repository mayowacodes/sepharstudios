import { w as db, ag as user, L as liveStreams } from './drizzle-CKUH7ukq.js';
import { e as error } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/watch/live/[id]/+page.server.ts
var load = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) error(401, "Please sign in to watch the live stream");
	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		title: liveStreams.title,
		description: liveStreams.description,
		playbackUrl: liveStreams.playbackUrl,
		thumbnailUrl: liveStreams.thumbnailUrl,
		status: liveStreams.status,
		visibility: liveStreams.visibility,
		viewerCount: liveStreams.viewerCount,
		startedAt: liveStreams.startedAt,
		recordingMediaId: liveStreams.recordingMediaId,
		creatorName: user.name
	}).from(liveStreams).leftJoin(user, eq(user.id, liveStreams.creatorId)).where(eq(liveStreams.id, params.id)).limit(1);
	if (!stream) error(404, "Stream not found");
	const isOwner = stream.creatorId === session.user.id;
	if (stream.visibility === "private" && !isOwner) error(404, "Stream not found");
	const isAdmin = session.user.role === "admin";
	return {
		stream,
		isOwner,
		canModerateChat: isOwner || isAdmin
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 126;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-OMHOd86W.js')).default;
const server_id = "src/routes/watch/live/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/126.CigCOV8r.js","_app/immutable/chunks/BOpLWbne.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Du36eeij2.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/BTb25HFS.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/DzVNOill2.js","_app/immutable/chunks/BV5FqIO12.js","_app/immutable/chunks/QW-dcZ1O.js","_app/immutable/chunks/B2Hp-hkg.js","_app/immutable/chunks/CtRTYft2.js","_app/immutable/chunks/DQKwgIZf.js","_app/immutable/chunks/Dy-TKAjK.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=126-CDcEt-WK.js.map
