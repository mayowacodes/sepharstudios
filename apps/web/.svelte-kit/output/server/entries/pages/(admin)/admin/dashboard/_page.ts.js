import { n as apiOrError } from "../../../../../chunks/client2.js";
//#region src/routes/(admin)/admin/dashboard/+page.ts
/** Admin dashboard. The endpoint enforces the admin role independently. */
var load = async ({ fetch }) => {
	return apiOrError("/api/admin/dashboard", { fetch });
};
//#endregion
export { load };
