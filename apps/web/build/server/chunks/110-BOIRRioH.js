import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { b as getEncoderPlayback } from './encoder-orchestrator-BzB9cCAK.js';
import { e as error } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/watch/[id]/+page.server.ts
var load = async ({ params, locals }) => {
	if (!locals.session) error(401, "Please sign in to watch content");
	const content = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		videoUrl: mediaLibrary.videoUrl,
		videoId: mediaLibrary.videoId,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		mediaType: mediaLibrary.mediaType,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		duration: mediaLibrary.duration,
		year: mediaLibrary.year,
		rating: mediaLibrary.rating,
		ageRating: mediaLibrary.ageRating,
		bibleReference: mediaLibrary.bibleReference,
		language: mediaLibrary.language,
		category: mediaLibrary.category,
		trailerUrl: mediaLibrary.trailerUrl,
		createdAt: mediaLibrary.createdAt,
		isActive: mediaLibrary.isActive
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).then((r) => r[0]);
	if (!content || !content.isActive) error(404, "Content not found");
	let playbackUrl = content.videoUrl;
	if (!playbackUrl && content.encoderJobId && content.processingStatus === "ready") try {
		playbackUrl = (await getEncoderPlayback(content.encoderJobId)).playback.master;
	} catch (err) {
		console.error(`Failed to sign playback URL for ${content.id}:`, err);
	}
	return {
		content: {
			...content,
			playbackUrl
		},
		activeProfileId: locals.activeProfileId
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 110;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DT2j9I1s.js')).default;
const server_id = "src/routes/watch/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/110.BEVMdINL.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/82XWPh1s.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/QvtZIkiR.js","_app/immutable/chunks/SDVjwcu-.js","_app/immutable/chunks/CkPKcep_2.js","_app/immutable/chunks/BQYPg9Bi2.js","_app/immutable/chunks/CehpPB2E2.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/DJeEVz6c.js","_app/immutable/chunks/JP0VO0aB.js","_app/immutable/chunks/BJK24hT9.js","_app/immutable/chunks/A7Vb2tMq.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=110-BOIRRioH.js.map
