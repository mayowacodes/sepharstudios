import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creatorApplications, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { notify } from '$lib/server/notify';

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
	if (!params.id) return json({ error: 'Missing application id' }, { status: 400 });

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
	const updated = await db.transaction(async (tx) => {
		const [appRow] = await tx
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
			const [appUser] = await tx
				.select()
				.from(user)
				.where(eq(user.id, application.userId));

			if (appUser) {
				await tx.update(user).set({ role: 'creator' }).where(eq(user.id, application.userId));

				const displayName = application.displayName
					|| application.organizationName
					|| appUser.name
					|| 'Creator';

				const [existingProfile] = await tx
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
					await tx.update(creators).set(profilePayload).where(eq(creators.id, existingProfile.id));
				} else {
					await tx.insert(creators).values({
						id: crypto.randomUUID(),
						...profilePayload,
						createdAt: now
					});
				}
			}
		}

		return appRow;
	});

	// Notify the applicant of the decision. Non-blocking: failures are logged
	// inside `notify` and do not affect the admin response.
	if (payload.status === 'approved') {
		await notify({
			userId: application.userId,
			kind: 'creator_application',
			title: 'Creator application approved 🎉',
			message: `Welcome to the Sephar Studios creator program. You can now upload content from the Creator portal.`,
			actionUrl: 'https://creators.sepharstudios.com/creator'
		});
	} else if (payload.status === 'rejected') {
		await notify({
			userId: application.userId,
			kind: 'creator_application',
			title: 'Creator application update',
			message: payload.rejectionReason
				? `Your creator application wasn't approved this round. Reason: ${payload.rejectionReason}. You can revise and resubmit anytime.`
				: `Your creator application wasn't approved this round. You can revise and resubmit anytime.`,
			actionUrl: '/apply/creator'
		});
	}

	return json({ success: true, application: updated });
};
