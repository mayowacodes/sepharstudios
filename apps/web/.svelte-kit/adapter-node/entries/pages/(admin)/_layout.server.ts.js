import { error } from "@sveltejs/kit";
//#region src/routes/(admin)/+layout.server.ts
var load = async ({ locals }) => {
	const user = locals.user;
	if (!user) throw error(401, "Sign in required");
	if (user.role !== "admin") throw error(403, "Forbidden: you are not an admin");
	return { user };
};
//#endregion
export { load };
