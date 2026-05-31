import { timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

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
export function isValidInternalRequest(request: Request): boolean {
	const candidates = [env.SEPHAR_BACKEND_TOKEN, env.ENCODER_AUTOMATION_TOKEN].filter(
		(t): t is string => typeof t === 'string' && t.length > 0
	);
	const header = request.headers.get('authorization');

	if (candidates.length === 0 || !header) return false;

	let matched = false;
	for (const token of candidates) {
		const expected = `Bearer ${token}`;
		// timingSafeEqual requires equal-length buffers. If the header is a
		// different length we still compare against the expected buffer (so
		// timing stays uniform) but force the result to false.
		const headerBuf = Buffer.from(header);
		const expectedBuf = Buffer.from(expected);
		if (headerBuf.length !== expectedBuf.length) {
			// Compare against itself so the syscall still runs and we don't
			// short-circuit, then OR a literal false into the running result.
			timingSafeEqual(expectedBuf, expectedBuf);
			matched = matched || false;
		} else {
			matched = timingSafeEqual(headerBuf, expectedBuf) || matched;
		}
	}
	return matched;
}
