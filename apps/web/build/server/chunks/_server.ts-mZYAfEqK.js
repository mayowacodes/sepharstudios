import { w as db, s as creatorApplications, ag as user, u as creators } from './drizzle-CKUH7ukq.js';
import { r as requireAdmin } from './admin-auth-DwogZLlW.js';
import { n as notify } from './notify-DpHZNtZn.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/creator-applications/[id]/review/+server.ts
var defaultPreferences = {
	publicProfile: true,
	emailNotifications: true,
	reviewNotifications: true,
	marketingEmails: false,
	showContactInfo: false
};
var PATCH = async ({ locals, params, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error;
	if (!params.id) return json({ error: "Missing application id" }, { status: 400 });
	const payload = await request.json();
	if (!payload.status) return json({ error: "Missing status" }, { status: 400 });
	const [application] = await db.select().from(creatorApplications).where(eq(creatorApplications.id, params.id));
	if (!application) return json({ error: "Application not found" }, { status: 404 });
	if (application.status === "approved" && payload.status !== "approved") return json({ error: "Approved applications cannot be reverted." }, { status: 400 });
	const now = /* @__PURE__ */ new Date();
	const updated = await db.transaction(async (tx) => {
		const [appRow] = await tx.update(creatorApplications).set({
			status: payload.status,
			reviewNotes: payload.reviewNotes ?? null,
			rejectionReason: payload.status === "rejected" ? payload.rejectionReason ?? null : null,
			reviewedAt: now,
			reviewedBy: session.user.id,
			updatedAt: now
		}).where(eq(creatorApplications.id, application.id)).returning();
		if (payload.status === "approved") {
			const [appUser] = await tx.select().from(user).where(eq(user.id, application.userId));
			if (appUser) {
				await tx.update(user).set({ role: "creator" }).where(eq(user.id, application.userId));
				const displayName = application.displayName || application.organizationName || appUser.name || "Creator";
				const [existingProfile] = await tx.select({ id: creators.id }).from(creators).where(eq(creators.userId, application.userId));
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
				if (existingProfile) await tx.update(creators).set(profilePayload).where(eq(creators.id, existingProfile.id));
				else await tx.insert(creators).values({
					id: crypto.randomUUID(),
					...profilePayload,
					createdAt: now
				});
			}
		}
		return appRow;
	});
	if (payload.status === "approved") await notify({
		userId: application.userId,
		kind: "creator_application",
		title: "Creator application approved 🎉",
		message: `Welcome to the Sephar Studios creator program. You can now upload content from the Creator portal.`,
		actionUrl: "https://creators.sepharstudios.com/creator"
	});
	else if (payload.status === "rejected") await notify({
		userId: application.userId,
		kind: "creator_application",
		title: "Creator application update",
		message: payload.rejectionReason ? `Your creator application wasn't approved this round. Reason: ${payload.rejectionReason}. You can revise and resubmit anytime.` : `Your creator application wasn't approved this round. You can revise and resubmit anytime.`,
		actionUrl: "/apply/creator"
	});
	return json({
		success: true,
		application: updated
	});
};

export { PATCH };
//# sourceMappingURL=_server.ts-mZYAfEqK.js.map
