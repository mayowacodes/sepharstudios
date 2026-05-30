//#region src/routes/+layout.server.ts
/**
* Expose the current user to every page in the app.
* Components read `data.user` to check auth state.
* The AICopilot widget uses this to render auth-gated vs. guest UI.
*/
var load = async ({ locals }) => {
	return { user: locals.user ?? null };
};
//#endregion
export { load };
