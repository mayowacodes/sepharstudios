import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creatorApplications, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

async function requireAdmin(locals: App.Locals) {
	const session = await locals.auth.getSession();
	if (!session) return { error: json({ error: 'Unauthorized' }, { status: 401 }) };
	const [adminUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
	if (adminUser?.role !== 'admin') return { error: json({ error: 'Forbidden' }, { status: 403 }), session };
	return { error: null, session };
}

const defaultPreferences = {
	publicProfile: true,
	emailNotifications: true,
	reviewNotifications: true,
	marketingEmails: false,
	showContactInfo: false
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error!;

	const payload = await request.json() as {
		status: 'approved' | 'rejected';
		reviewNotes?: string;
		rejectionReason?: string;
	};

	if (!payload.status) return json({ error: 'Missing status' }, { status: 400 });

	const [application] = await db
		.select()
		.from(creatorApplications)
		.where(eq(creatorApplications.id, params.id));

	if (!application) return json({ error: 'Application not found' }, { status: 404 });

	if (application.status === 'approved' && payload.status !== 'approved') {
		return json({ error: 'Approved applications cannot be reverted.' }, { status: 400 });
	}

	const now = new Date();
	const [updated] = await db
		.update(creatorApplications)
		.set({
			status: payload.status,
			reviewNotes: payload.reviewNotes ?? null,
			rejectionReason: payload.status === 'rejected' ? payload.rejectionReason ?? null : null,
			reviewedAt: now,
			reviewedBy: session.user.id,
			updatedAt: now
		})
		.where(eq(creatorApplications.id, application.id))
		.returning();

	if (payload.status === 'approved') {
		const [appUser] = await db
			.select()
			.from(user)
			.where(eq(user.id, application.userId));

		if (appUser) {
			await db.update(user).set({ role: 'creator' }).where(eq(user.id, application.userId));

			const displayName = application.displayName
				|| application.organizationName
				|| appUser.name
				|| 'Creator';

			const [existingProfile] = await db
				.select({ id: creators.id })
				.from(creators)
				.where(eq(creators.userId, application.userId));

			const profilePayload = {
				userId: application.userId,
				displayName,
				creatorType: application.creatorType,
				legalName: application.legalName ?? null,
				organizationName: application.organizationName ?? null,
				organizationType: application.organizationType ?? null,
				organizationWebsite: application.organizationWebsite ?? null,
				organizationAddress: application.organizationAddress ?? null,
				taxId: application.taxId ?? null,
				contactEmail: application.contactEmail ?? appUser.email ?? null,
				contactPhone: application.contactPhone ?? null,
				bio: application.bio ?? null,
				socialLinks: application.socialLinks ?? null,
				preferences: defaultPreferences,
				isVerified: true,
				updatedAt: now
			};

			if (existingProfile) {
				await db.update(creators).set(profilePayload).where(eq(creators.id, existingProfile.id));
			} else {
				await db.insert(creators).values({
					id: crypto.randomUUID(),
					...profilePayload,
					createdAt: now
				});
			}
		}
	}

	return json({ success: true, application: updated });
};
