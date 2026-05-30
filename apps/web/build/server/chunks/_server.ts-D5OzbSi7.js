import { n as db, f as adminSettings } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/settings/+server.ts
var defaults = {
	platform: {
		siteName: "Sephar Studios",
		siteDescription: "Faith-based content streaming platform",
		maintenanceMode: false,
		registrationOpen: true,
		creatorApplicationsOpen: true,
		maxUploadSize: 5e3,
		supportedFormats: [
			"mp4",
			"mov",
			"avi",
			"mkv"
		],
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
var GET = async ({ locals }) => {
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
var PUT = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const payload = await request.json();
	const existing = await db.select({ id: adminSettings.id }).from(adminSettings).then((r) => r[0]);
	if (existing) await db.update(adminSettings).set({
		platform: payload.platform ?? defaults.platform,
		payment: payload.payment ?? defaults.payment,
		notifications: payload.notifications ?? defaults.notifications,
		security: payload.security ?? defaults.security,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(adminSettings.id, existing.id));
	else await db.insert(adminSettings).values({
		platform: payload.platform ?? defaults.platform,
		payment: payload.payment ?? defaults.payment,
		notifications: payload.notifications ?? defaults.notifications,
		security: payload.security ?? defaults.security
	});
	return json({ success: true });
};

export { GET, PUT };
//# sourceMappingURL=_server.ts-D5OzbSi7.js.map
