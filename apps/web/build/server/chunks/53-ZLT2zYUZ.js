import { w as db, u as creators, M as mediaLibrary, t as creatorFollowers } from './drizzle-CKUH7ukq.js';
import { m as mediaCardColumns } from './projections-B5XfbV-n.js';
import { e as error } from './index-Cv5VcsYq.js';
import { eq, and, sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

const index = 53;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BGIDZUpZ.js')).default;
const server_id = "src/routes/(app)/creators/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/53.BG43EF9z.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/BO1aleC0.js","_app/immutable/chunks/B8lZO5gc.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/CpMAVUI4.js","_app/immutable/chunks/B3AYJye92.js","_app/immutable/chunks/DdntYR2r.js","_app/immutable/chunks/DbP8MhBG2.js","_app/immutable/chunks/DZXko5A82.js","_app/immutable/chunks/DQQV4u0O2.js","_app/immutable/chunks/BC4b7XLa.js","_app/immutable/chunks/GKWuiuOh.js","_app/immutable/chunks/CdtIMIMZ2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/B96uQR2f2.js","_app/immutable/chunks/CpUIE23_2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=53-ZLT2zYUZ.js.map
