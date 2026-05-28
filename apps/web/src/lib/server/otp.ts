import { createHash } from 'crypto';
import { env } from '$env/dynamic/private';
import { getRedis } from '$lib/server/redis';

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

function hashPhone(phone: string): string {
  return createHash('sha256')
    .update(phone.replace(/\s+/g, '') + (env.OTP_SECRET ?? 'sephar-otp'))
    .digest('hex');
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OTP_PREFIX = 'otp:';
const COOLDOWN_PREFIX = 'otp:cooldown:';
const COOLDOWN_SECONDS = 60;

export class OtpCooldownError extends Error {
  readonly retryAfterSec: number;
  constructor(retryAfterSec: number) {
    super(`OTP cooldown active. Try again in ${retryAfterSec}s.`);
    this.name = 'OtpCooldownError';
    this.retryAfterSec = retryAfterSec;
  }
}

/**
 * Issue a one-time password for a phone number.
 *
 * Throws `OtpCooldownError` if the same phone requested an OTP in the last
 * 60 seconds (anti-spam). Callers should map that to a 429 response.
 */
export async function createOtp(phone: string, ttlMs = 10 * 60 * 1000): Promise<string> {
  const phoneHash = hashPhone(phone);
  const redis = getRedis();

  // Cooldown check — atomic via SET NX EX.
  const cooldownKey = `${COOLDOWN_PREFIX}${phoneHash}`;
  const setOk = await redis.set(cooldownKey, '1', 'EX', COOLDOWN_SECONDS, 'NX');
  if (setOk !== 'OK') {
    const remaining = await redis.ttl(cooldownKey);
    throw new OtpCooldownError(remaining > 0 ? remaining : COOLDOWN_SECONDS);
  }

  const otp = generateOtp();
  const ttlSec = Math.max(1, Math.floor(ttlMs / 1000));
  await redis.set(`${OTP_PREFIX}${phoneHash}`, otp, 'EX', ttlSec);
  return otp;
}

/** Consume an OTP. Single-use: a successful match deletes the key. */
export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
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
export function getPhoneHash(phone: string): string {
  return hashPhone(phone);
}
