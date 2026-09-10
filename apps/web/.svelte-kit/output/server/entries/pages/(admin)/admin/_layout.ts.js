import { error } from "@sveltejs/kit";
//#region src/routes/(admin)/admin/+layout.ts
/**
* Role guard for every route under /admin.
*
* This lives at `(admin)/admin/` rather than `(admin)/` for a concrete reason:
* `+layout@.svelte` in this directory resets the layout hierarchy back to the
* root, which cuts `(admin)/+layout.*` out of the route chain entirely. The
* generated client manifest confirms it — the chain for `/admin/dashboard` is
* `[0, 3]` (root, then this reset layout); the `(admin)` group node appears in
* no chain at all. A guard placed there is dead code, which is exactly what the
* previous `(admin)/+layout.server.ts` was, despite its "defence in depth"
* comment.
*
* Why it still matters that this runs: hooks.server.ts enforces the admin role
* only when the request arrives on the `admin.` subdomain. An `/admin/*` path on
* the apex domain reaches the router with no role check at all, so without this
* the admin UI renders for anyone signed in. The API endpoints all call
* `requireAdmin()` independently, so no data leaks — but the interface should
* not paint either.
*/
var load = async ({ parent }) => {
	const { user } = await parent();
	if (!user) throw error(401, "Sign in required");
	if (user.role !== "admin") throw error(403, "Forbidden: you are not an admin");
	return { user };
};
//#endregion
export { load };
