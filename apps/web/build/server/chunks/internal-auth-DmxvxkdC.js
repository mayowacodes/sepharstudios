import { p as private_env } from './shared-server-DUDL94jl.js';
import { timingSafeEqual } from 'node:crypto';

//#region src/lib/server/internal-auth.ts
/**
* Validates an internal-only request (cron, encoder, automation) using
* a shared bearer token. The comparison is constant-time so an attacker
* cannot probe the token character-by-character via response timing —
* which `===` allows because string comparison short-circuits on the
* first mismatched byte.
*
* Both candidate tokens are checked because two historic env-var names
* are still in use across deployments. Each comparison is timing-safe
* and the result is OR-folded so the function takes the same time
* regardless of which token (or neither) matches.
*/
function isValidInternalRequest(request) {
	const candidates = [private_env.SEPHAR_BACKEND_TOKEN, private_env.ENCODER_AUTOMATION_TOKEN].filter((t) => typeof t === "string" && t.length > 0);
	const header = request.headers.get("authorization");
	if (candidates.length === 0 || !header) return false;
	let matched = false;
	for (const token of candidates) {
		const expected = `Bearer ${token}`;
		const headerBuf = Buffer.from(header);
		const expectedBuf = Buffer.from(expected);
		if (headerBuf.length !== expectedBuf.length) {
			timingSafeEqual(expectedBuf, expectedBuf);
			matched = matched || false;
		} else matched = timingSafeEqual(headerBuf, expectedBuf) || matched;
	}
	return matched;
}

export { isValidInternalRequest as i };
//# sourceMappingURL=internal-auth-DmxvxkdC.js.map
