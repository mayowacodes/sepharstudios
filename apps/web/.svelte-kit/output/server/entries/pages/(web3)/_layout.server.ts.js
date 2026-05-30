import { redirect } from "@sveltejs/kit";
//#region src/routes/(web3)/+layout.server.ts
/**
* Guards every route under (web3)/* — wallet, tokens, subscription, etc.
* These pages display a user's STC balance, NFT subscription state, and
* staking position. Anonymous users have no use for them, and the underlying
* web3 calls require knowing which user-account scope to operate in.
*
* Mirrors the auth guard pattern in (admin)/+layout.server.ts and
* (creator)/+layout.server.ts.
*/
var load = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	return { user: locals.user };
};
//#endregion
export { load };
