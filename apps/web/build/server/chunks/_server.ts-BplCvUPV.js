import { j as json } from './index-BcOZ6EV9.js';
import { h as creatorApplications, d as db, c as user } from './drizzle-CW7hPjGG.js';
import { eq, desc } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const [adminUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }), session };
  return { error: null, session };
}
const GET = async ({ locals, url }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const status = url.searchParams.get("status");
  const where = status && status !== "all" ? eq(creatorApplications.status, status) : void 0;
  const applications = await db.select({
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
  }).from(creatorApplications).leftJoin(user, eq(user.id, creatorApplications.userId)).where(where).orderBy(desc(creatorApplications.createdAt));
  return json(applications);
};

export { GET };
//# sourceMappingURL=_server.ts-BplCvUPV.js.map
