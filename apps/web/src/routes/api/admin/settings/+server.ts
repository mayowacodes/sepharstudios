import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminSettings } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

const defaults = {
	platform: {
		siteName: 'Sephar Studios',
		siteDescription: 'Faith-based content streaming platform',
		maintenanceMode: false,
		registrationOpen: true,
		creatorApplicationsOpen: true,
		maxUploadSize: 5000,
		supportedFormats: ['mp4', 'mov', 'avi', 'mkv'],
		moderationMode: 'hybrid',
		minContentDuration: 60,
		maxContentDuration: 7200,
		// Minimum vertical resolution accepted by the creator upload step. 720p
		// is bare-minimum HD; 1080 is a sensible streaming-grade floor.
		minVideoHeight: 1080
	},
	payment: {
		stripePublishableKey: '',
		stripeWebhookSecret: '',
		paypalClientId: '',
		minimumPayout: 25.0,
		payoutSchedule: 'monthly',
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
		apiRateLimit: 1000
	}
};


export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const existing = await db.select().from(adminSettings).then(r => r[0]);
	if (!existing) return json(defaults);

	return json({
		platform: existing.platform ?? defaults.platform,
		payment: existing.payment ?? defaults.payment,
		notifications: existing.notifications ?? defaults.notifications,
		security: existing.security ?? defaults.security
	});
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const payload = await request.json() as typeof defaults;
	const existing = await db.select({ id: adminSettings.id }).from(adminSettings).then(r => r[0]);

	if (existing) {
		await db.update(adminSettings).set({
			platform: payload.platform ?? defaults.platform,
			payment: payload.payment ?? defaults.payment,
			notifications: payload.notifications ?? defaults.notifications,
			security: payload.security ?? defaults.security,
			updatedAt: new Date()
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
