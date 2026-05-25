import { j as json } from './index-BcOZ6EV9.js';
import { d as db, e as adminSettings, c as user } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const defaults = {
  platform: {
    siteName: "Sephar Studios",
    siteDescription: "Faith-based content streaming platform",
    maintenanceMode: false,
    registrationOpen: true,
    creatorApplicationsOpen: true,
    maxUploadSize: 5e3,
    supportedFormats: ["mp4", "mov", "avi", "mkv"],
    moderationMode: "hybrid",
    minContentDuration: 60,
    maxContentDuration: 7200
  },
  payment: {
    stripePublishableKey: "",
    stripeWebhookSecret: "",
    paypalClientId: "",
    minimumPayout: 25,
    payoutSchedule: "monthly",
    platformFee: 15,
    processingFee: 2.9
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    adminAlerts: true,
    creatorAlerts: true,
    userAlerts: true,
    moderationAlerts: true
  },
  security: {
    twoFactorRequired: false,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    contentEncryption: true,
    ipWhitelist: [],
    apiRateLimit: 1e3
  }
};
async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}
const GET = async ({ locals }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const existing = await db.select().from(adminSettings).then((r) => r[0]);
  if (!existing) return json(defaults);
  return json({
    platform: existing.platform ?? defaults.platform,
    payment: existing.payment ?? defaults.payment,
    notifications: existing.notifications ?? defaults.notifications,
    security: existing.security ?? defaults.security
  });
};
const PUT = async ({ locals, request }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const payload = await request.json();
  const existing = await db.select({ id: adminSettings.id }).from(adminSettings).then((r) => r[0]);
  if (existing) {
    await db.update(adminSettings).set({
      platform: payload.platform ?? defaults.platform,
      payment: payload.payment ?? defaults.payment,
      notifications: payload.notifications ?? defaults.notifications,
      security: payload.security ?? defaults.security,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(adminSettings.id, existing.id));
  } else {
    await db.insert(adminSettings).values({
      platform: payload.platform ?? defaults.platform,
      payment: payload.payment ?? defaults.payment,
      notifications: payload.notifications ?? defaults.notifications,
      security: payload.security ?? defaults.security
    });
  }
  return json({ success: true });
};

export { GET, PUT };
//# sourceMappingURL=_server.ts-CK5bXlb7.js.map
