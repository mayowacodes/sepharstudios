import { createHash } from 'crypto';
import { env } from '$env/dynamic/private';

type OtpEntry = { otp: string; expires: number };

// In-memory OTP store (single-server setup; use Redis for multi-instance deployments)
const otpStore = new Map<string, OtpEntry>();

function hashPhone(phone: string): string {
  return createHash('sha256')
    .update(phone.replace(/\s+/g, '') + (env.OTP_SECRET ?? 'sephar-otp'))
    .digest('hex');
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOtp(phone: string, ttlMs = 10 * 60 * 1000): string {
  const phoneHash = hashPhone(phone);
  const otp = generateOtp();
  otpStore.set(phoneHash, { otp, expires: Date.now() + ttlMs });
  return otp;
}

export function verifyOtp(phone: string, otp: string): boolean {
  const phoneHash = hashPhone(phone);
  const stored = otpStore.get(phoneHash);
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    otpStore.delete(phoneHash);
    return false;
  }
  if (stored.otp !== otp) return false;
  otpStore.delete(phoneHash);
  return true;
}

export function getPhoneHash(phone: string): string {
  return hashPhone(phone);
}
