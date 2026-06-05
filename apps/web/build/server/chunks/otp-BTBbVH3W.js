import { p as private_env } from './shared-server-DUDL94jl.js';
import { g as getRedis } from './redis-B0W1dNO5.js';
import { createHash } from 'crypto';

//#region src/lib/server/otp.ts
/**
* Phone-OTP store, backed by Redis.
*
* Storage layout:
*   otp:{phoneHash}          → the OTP, with EX expiry of `ttlMs / 1000`.
*   otp:cooldown:{phoneHash} → marker key for 60s anti-spam cooldown.
*
* Public API:
*   createOtp(phone, ttlMs?)  → string  (throws OtpCooldownError if cooldown active)
*   verifyOtp(phone, otp)     → boolean (single-use; deletes on success)
*   getPhoneHash(phone)       → string
*
* If Redis is unreachable, the underlying ioredis client throws — we let
* that bubble up so the API returns 5xx (fail closed for security).
*/
function hashPhone(phone) {
	return createHash("sha256").update(phone.replace(/\s+/g, "") + (private_env.OTP_SECRET ?? "sephar-otp")).digest("hex");
}
function generateOtp() {
	return Math.floor(1e5 + Math.random() * 9e5).toString();
}
var OTP_PREFIX = "otp:";
var COOLDOWN_PREFIX = "otp:cooldown:";
var COOLDOWN_SECONDS = 60;
var OtpCooldownError = class extends Error {
	retryAfterSec;
	constructor(retryAfterSec) {
		super(`OTP cooldown active. Try again in ${retryAfterSec}s.`);
		this.name = "OtpCooldownError";
		this.retryAfterSec = retryAfterSec;
	}
};
/**
* Issue a one-time password for a phone number.
*
* Throws `OtpCooldownError` if the same phone requested an OTP in the last
* 60 seconds (anti-spam). Callers should map that to a 429 response.
*/
async function createOtp(phone, ttlMs = 600 * 1e3) {
	const phoneHash = hashPhone(phone);
	const redis = getRedis();
	const cooldownKey = `${COOLDOWN_PREFIX}${phoneHash}`;
	if (await redis.set(cooldownKey, "1", "EX", COOLDOWN_SECONDS, "NX") !== "OK") {
		const remaining = await redis.ttl(cooldownKey);
		throw new OtpCooldownError(remaining > 0 ? remaining : COOLDOWN_SECONDS);
	}
	const otp = generateOtp();
	const ttlSec = Math.max(1, Math.floor(ttlMs / 1e3));
	await redis.set(`${OTP_PREFIX}${phoneHash}`, otp, "EX", ttlSec);
	return otp;
}
/** Consume an OTP. Single-use: a successful match deletes the key. */
async function verifyOtp(phone, otp) {
	const phoneHash = hashPhone(phone);
	const redis = getRedis();
	const key = `${OTP_PREFIX}${phoneHash}`;
	const stored = await redis.get(key);
	if (!stored) return false;
	if (stored !== otp) return false;
	await redis.del(key);
	return true;
}
/** Public so callers can use the phone hash as a key against other tables (e.g. blacklist). */
function getPhoneHash(phone) {
	return hashPhone(phone);
}

export { OtpCooldownError as O, createOtp as c, getPhoneHash as g, verifyOtp as v };
//# sourceMappingURL=otp-BTBbVH3W.js.map
