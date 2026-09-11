import { D as creatorApplications, d as db, c as user } from './drizzle-CsnNxG5m.js';
import { r as requireAdmin } from './admin-auth-5N0bBtTQ.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/creator-applications/+server.ts
var GET = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const status = url.searchParams.get("status");
	const where = status && status !== "all" ? eq(creatorApplications.status, status) : void 0;
	return json(await db.select({
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
	}).from(creatorApplications).leftJoin(user, eq(user.id, creatorApplications.userId)).where(where).orderBy(desc(creatorApplications.createdAt)));
};

export { GET };
//# sourceMappingURL=_server.ts-DSoOS66-.js.map
