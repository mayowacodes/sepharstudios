import { n as db, l as creators, B as mediaLibrary, k as creatorFollowers } from './drizzle-BjmsPAPl.js';
import { m as mediaCardColumns } from './projections-BHErtuYo.js';
import { e as error } from './index-5kYmxIr9.js';
import { eq, and, sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/(app)/creators/[id]/+page.server.ts
var load = async ({ params, locals }) => {
	const [creator] = await db.select({
		id: creators.id,
		userId: creators.userId,
		displayName: creators.displayName,
		creatorType: creators.creatorType,
		bio: creators.bio,
		avatarUrl: creators.avatarUrl,
		bannerUrl: creators.bannerUrl,
		denomination: creators.denomination,
		organizationName: creators.organizationName,
		socialLinks: creators.socialLinks,
		isVerified: creators.isVerified
	}).from(creators).where(eq(creators.id, params.id)).limit(1);
	if (!creator) error(404, "Creator not found");
	const content = await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, creator.userId), eq(mediaLibrary.isActive, true)));
	const [followerRow] = await db.select({ count: sql`count(*)::int` }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creator.id), eq(creatorFollowers.status, "active")));
	const followerCount = Number(followerRow?.count ?? 0);
	let isFollowing = false;
	const session = await locals.auth.getSession();
	if (session) {
		const [followRow] = await db.select({ id: creatorFollowers.id }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creator.id), eq(creatorFollowers.userId, session.user.id), eq(creatorFollowers.status, "active"))).limit(1);
		isFollowing = !!followRow;
	}
	return {
		creator,
		content,
		followerCount,
		isFollowing,
		isOwnProfile: session?.user.id === creator.userId
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 43;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B9EkBSEJ.js')).default;
const server_id = "src/routes/(app)/creators/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/43.CmenC7gx.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/BNDxLlt5.js","_app/immutable/chunks/DDtEHMmn.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DRN2iH4Q.js","_app/immutable/chunks/C62WXae12.js","_app/immutable/chunks/82XWPh1s.js","_app/immutable/chunks/QvtZIkiR.js","_app/immutable/chunks/SDVjwcu-.js","_app/immutable/chunks/CkPKcep_2.js","_app/immutable/chunks/BQYPg9Bi2.js","_app/immutable/chunks/DE6Vj2l8.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/0zn_j1pt.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=43-CDelu87A.js.map
