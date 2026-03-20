import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminSettings, creatorApplications, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

const defaultSettings = {
	platform: {
		creatorApplicationsOpen: true
	}
};

const getCreatorApplicationsOpen = async () => {
	const settings = await db.select().from(adminSettings).then((r) => r[0]);
	return settings?.platform?.creatorApplicationsOpen ?? defaultSettings.platform.creatorApplicationsOpen;
};

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [application] = await db
		.select()
		.from(creatorApplications)
		.where(eq(creatorApplications.userId, session.user.id));

	const [profile] = await db
		.select()
		.from(creators)
		.where(eq(creators.userId, session.user.id));

	const applicationsOpen = await getCreatorApplicationsOpen();

	return json({ application: application ?? null, profile: profile ?? null, applicationsOpen });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const applicationsOpen = await getCreatorApplicationsOpen();
	if (!applicationsOpen) return json({ error: 'Creator applications are closed.' }, { status: 403 });

	const [currentUser] = await db
		.select({ role: user.role })
		.from(user)
		.where(eq(user.id, session.user.id));
	if (currentUser?.role === 'creator') return json({ error: 'You are already a creator.' }, { status: 400 });

	const payload = await request.json() as {
		creatorType?: string;
		displayName?: string;
		legalName?: string;
		organizationName?: string;
		organizationType?: string;
		organizationWebsite?: string;
		organizationAddress?: string;
		taxId?: string;
		contactEmail?: string;
		contactPhone?: string;
		bio?: string;
		portfolioUrl?: string;
		socialLinks?: Record<string, string>;
		documents?: Array<{ id: string; url: string; name: string; size?: number }> | string[];
	};

	const [existing] = await db
		.select()
		.from(creatorApplications)
		.where(eq(creatorApplications.userId, session.user.id));

	const now = new Date();
	if (existing) {
		if (existing.status === 'approved') {
			return json({ error: 'Your creator application is already approved.' }, { status: 400 });
		}

		const [updated] = await db
			.update(creatorApplications)
			.set({
				creatorType: payload.creatorType ?? existing.creatorType,
				displayName: payload.displayName ?? existing.displayName,
				legalName: payload.legalName ?? existing.legalName,
				organizationName: payload.organizationName ?? existing.organizationName,
				organizationType: payload.organizationType ?? existing.organizationType,
				organizationWebsite: payload.organizationWebsite ?? existing.organizationWebsite,
				organizationAddress: payload.organizationAddress ?? existing.organizationAddress,
				taxId: payload.taxId ?? existing.taxId,
				contactEmail: payload.contactEmail ?? existing.contactEmail,
				contactPhone: payload.contactPhone ?? existing.contactPhone,
				bio: payload.bio ?? existing.bio,
				portfolioUrl: payload.portfolioUrl ?? existing.portfolioUrl,
				socialLinks: payload.socialLinks ?? existing.socialLinks,
				documents: payload.documents ?? existing.documents,
				status: 'pending',
				reviewNotes: null,
				rejectionReason: null,
				reviewedAt: null,
				reviewedBy: null,
				updatedAt: now
			})
			.where(eq(creatorApplications.id, existing.id))
			.returning();

		return json({ success: true, application: updated });
	}

	const [created] = await db.insert(creatorApplications).values({
		id: crypto.randomUUID(),
		userId: session.user.id,
		creatorType: payload.creatorType ?? 'individual',
		displayName: payload.displayName ?? null,
		legalName: payload.legalName ?? null,
		organizationName: payload.organizationName ?? null,
		organizationType: payload.organizationType ?? null,
		organizationWebsite: payload.organizationWebsite ?? null,
		organizationAddress: payload.organizationAddress ?? null,
		taxId: payload.taxId ?? null,
		contactEmail: payload.contactEmail ?? session.user.email ?? null,
		contactPhone: payload.contactPhone ?? null,
		bio: payload.bio ?? null,
		portfolioUrl: payload.portfolioUrl ?? null,
		socialLinks: payload.socialLinks ?? null,
		documents: payload.documents ?? null
	}).returning();

	return json({ success: true, application: created }, { status: 201 });
};
