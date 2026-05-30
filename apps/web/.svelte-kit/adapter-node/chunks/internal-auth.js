import { t as private_env } from "./shared-server.js";
//#region src/lib/server/internal-auth.ts
function isValidInternalRequest(request) {
	const token = private_env.SEPHAR_BACKEND_TOKEN || private_env.ENCODER_AUTOMATION_TOKEN;
	const header = request.headers.get("authorization");
	if (!token || !header) return false;
	return header === `Bearer ${token}`;
}
//#endregion
export { isValidInternalRequest as t };
