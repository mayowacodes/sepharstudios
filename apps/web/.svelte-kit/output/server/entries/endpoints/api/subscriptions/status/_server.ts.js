import { R as paystackSubscriptions, t as db, x as familyAddons } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/subscriptions/status/+server.ts
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	if (!sub) return json({
		hasSubscription: false,
		plan: null,
		status: null
	});
	const [addon] = await db.select().from(familyAddons).where(eq(familyAddons.userId, session.user.id)).limit(1);
	const now = /* @__PURE__ */ new Date();
	const trialDaysLeft = sub.trialEndDate ? Math.max(0, Math.ceil((new Date(sub.trialEndDate).getTime() - now.getTime()) / 864e5)) : null;
	const effectiveMaxProfiles = Math.max(sub.maxProfiles ?? 1, addon?.status === "active" ? addon.maxProfiles ?? 8 : 0);
	return json({
		hasSubscription: true,
		plan: sub.plan,
		status: sub.status,
		isTrial: sub.status === "trial",
		trialEndDate: sub.trialEndDate,
		trialDaysLeft,
		currentPeriodEnd: sub.currentPeriodEnd,
		hasFamilyAddon: !!addon && addon.status === "active",
		maxProfiles: effectiveMaxProfiles,
		kidsAllowed: sub.kidsAllowed,
		nextChargeAt: sub.nextChargeAt,
		failedAttempts: sub.failedAttempts,
		cardLast4: sub.cardLast4,
		cardBrand: sub.cardBrand
	});
};
//#endregion
export { GET };
