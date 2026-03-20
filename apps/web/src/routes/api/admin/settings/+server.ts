import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminSettings } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

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
		maxContentDuration: 7200
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

async function requireAdmin(locals: App.Locals) {
	const session = await locals.auth.getSession();
	if (!session) return { error: json({ error: 'Unauthorized' }, { status: 401 }) };
	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return { error: json({ error: 'Forbidden' }, { status: 403 }) };
	return { error: null };
}

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
