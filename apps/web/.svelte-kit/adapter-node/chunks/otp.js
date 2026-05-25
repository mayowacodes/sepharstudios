import { createHash } from "crypto";
import { p as private_env } from "./shared-server.js";
const otpStore = /* @__PURE__ */ new Map();
function hashPhone(phone) {
  return createHash("sha256").update(phone.replace(/\s+/g, "") + (private_env.OTP_SECRET ?? "sephar-otp")).digest("hex");
}
function generateOtp() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
function createOtp(phone, ttlMs = 10 * 60 * 1e3) {
  const phoneHash = hashPhone(phone);
  const otp = generateOtp();
  otpStore.set(phoneHash, { otp, expires: Date.now() + ttlMs });
  return otp;
}
function verifyOtp(phone, otp) {
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
function getPhoneHash(phone) {
  return hashPhone(phone);
}
export {
  createOtp as c,
  getPhoneHash as g,
  verifyOtp as v
};
