import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creatorApplications } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

export const GET: RequestHandler = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const status = url.searchParams.get('status');
	const where = status && status !== 'all' ? eq(creatorApplications.status, status) : undefined;

	const applications = await db
		.select({
			id: creatorApplications.id,
			userId: creatorApplications.userId,
			creatorType: creatorApplications.creatorType,
			displayName: creatorApplications.displayName,
			legalName: creatorApplications.legalName,
			organizationName: creatorApplications.organizationName,
			organizationType: creatorApplications.organizationType,
			organizationWebsite: creatorApplications.organizationWebsite,
			organizationAddress: creatorApplications.organizationAddress,
			taxId: creatorApplications.taxId,
			contactEmail: creatorApplications.contactEmail,
			contactPhone: creatorApplications.contactPhone,
			bio: creatorApplications.bio,
			portfolioUrl: creatorApplications.portfolioUrl,
			socialLinks: creatorApplications.socialLinks,
			documents: creatorApplications.documents,
			status: creatorApplications.status,
			reviewNotes: creatorApplications.reviewNotes,
			rejectionReason: creatorApplications.rejectionReason,
			reviewedAt: creatorApplications.reviewedAt,
			reviewedBy: creatorApplications.reviewedBy,
			createdAt: creatorApplications.createdAt,
			updatedAt: creatorApplications.updatedAt,
			userName: user.name,
			userEmail: user.email,
			userImage: user.image
		})
		.from(creatorApplications)
		.leftJoin(user, eq(user.id, creatorApplications.userId))
		.where(where)
		.orderBy(desc(creatorApplications.createdAt));

	return json(applications);
};
