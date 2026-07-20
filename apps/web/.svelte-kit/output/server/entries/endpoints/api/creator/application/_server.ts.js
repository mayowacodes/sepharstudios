import { O as creators, T as creatorApplications, a as user, d as adminSettings, t as db } from "../../../../../chunks/drizzle.js";
import { t as track } from "../../../../../chunks/analytics.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/creator/application/+server.ts
var defaultSettings = { platform: { creatorApplicationsOpen: true } };
var getCreatorApplicationsOpen = async () => {
	return (await db.select().from(adminSettings).then((r) => r[0]))?.platform?.creatorApplicationsOpen ?? defaultSettings.platform.creatorApplicationsOpen;
};
var normalizeDocuments = (documents) => {
	if (documents === void 0) return void 0;
	if (documents === null) return null;
	return documents.map((document) => {
		if (typeof document !== "string") return document;
		return {
			id: crypto.randomUUID(),
			url: document,
			name: document.split("/").pop() || "Document"
		};
	}).filter((document) => !!document.url && !!document.name);
};
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [application] = await db.select().from(creatorApplications).where(eq(creatorApplications.userId, session.user.id));
	const [profile] = await db.select().from(creators).where(eq(creators.userId, session.user.id));
	const applicationsOpen = await getCreatorApplicationsOpen();
	return json({
		application: application ?? null,
		profile: profile ?? null,
		applicationsOpen
	});
};
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (!await getCreatorApplicationsOpen()) return json({ error: "Creator applications are closed." }, { status: 403 });
	const [currentUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
	if (currentUser?.role === "creator") return json({ error: "You are already a creator." }, { status: 400 });
	const ALLOWED_CREATOR_TYPES = ["individual", "organization"];
	const payload = await request.json();
	if (payload.creatorType !== void 0 && !ALLOWED_CREATOR_TYPES.includes(payload.creatorType)) return json({ error: `Invalid creatorType. Must be one of: ${ALLOWED_CREATOR_TYPES.join(", ")}` }, { status: 400 });
	const [existing] = await db.select().from(creatorApplications).where(eq(creatorApplications.userId, session.user.id));
	const now = /* @__PURE__ */ new Date();
	const documents = normalizeDocuments(payload.documents);
	if (existing) {
		if (existing.status === "approved") return json({ error: "Your creator application is already approved." }, { status: 400 });
		const [updated] = await db.update(creatorApplications).set({
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
			documents: documents ?? existing.documents,
			status: "pending",
			reviewNotes: null,
			rejectionReason: null,
			reviewedAt: null,
			reviewedBy: null,
			updatedAt: now
		}).where(eq(creatorApplications.id, existing.id)).returning();
		await track(session.user.id, "creator_apply", {
			creatorType: payload.creatorType,
			resubmission: true
		});
		return json({
			success: true,
			application: updated
		});
	}
	const [created] = await db.insert(creatorApplications).values({
		id: crypto.randomUUID(),
		userId: session.user.id,
		creatorType: payload.creatorType ?? "individual",
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
		documents: documents ?? null
	}).returning();
	await track(session.user.id, "creator_apply", {
		creatorType: payload.creatorType,
		resubmission: false
	});
	return json({
		success: true,
		application: created
	}, { status: 201 });
};
//#endregion
export { GET, POST };
