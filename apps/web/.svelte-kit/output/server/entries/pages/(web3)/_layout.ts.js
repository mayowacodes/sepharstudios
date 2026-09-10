import { redirect } from "@sveltejs/kit";
//#region src/routes/(web3)/+layout.ts
/**
* Guards every route under (web3)/* — wallet, tokens, subscription, etc.
* These pages display a user's STC balance, NFT subscription state, and
* staking position. Anonymous users have no use for them, and the underlying
* web3 calls require knowing which user-account scope to operate in.
*
* Mirrors the auth guard pattern in (admin)/+layout.ts and (creator)/+layout.ts.
*/
var load = async ({ parent, url }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	return { user };
};
//#endregion
export { load };
