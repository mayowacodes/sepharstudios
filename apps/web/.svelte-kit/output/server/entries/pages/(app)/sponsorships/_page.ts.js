//#region src/routes/(app)/sponsorships/+page.ts
/**
* Sponsorship pitch form.
*
* The old server load returned a trimmed user for the "are you signed in?"
* branch; the root layout already resolves the session, so `parent()` supplies
* it with no extra request. The submit action became POST /api/sponsorships.
*/
var load = async ({ parent }) => {
	const { user } = await parent();
	return { user: user ? {
		id: user.id,
		email: user.email,
		name: user.name
	} : null };
};
//#endregion
export { load };
