import { t as private_env } from "../../../../../chunks/shared-server.js";
import { Z as paystackSubscriptions, et as ppvContent, q as paymentIntents, t as db, tt as ppvPurchases } from "../../../../../chunks/drizzle.js";
import { o as initializeTransaction, r as chargeAuthorization } from "../../../../../chunks/paystack.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/api/ppv/purchase/+server.ts
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId } = await request.json();
	const userId = session.user.id;
	const [ppv] = await db.select().from(ppvContent).where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true))).limit(1);
	if (!ppv) return json({ error: "Content is not PPV" }, { status: 400 });
	const [existing] = await db.select().from(ppvPurchases).where(and(eq(ppvPurchases.userId, userId), eq(ppvPurchases.contentId, contentId))).limit(1);
	if (existing) return json({ error: "Already purchased" }, { status: 409 });
	const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, userId)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	const reference = `ppv_${userId.slice(0, 8)}_${contentId.slice(0, 8)}_${Date.now()}`;
	try {
		await db.insert(paymentIntents).values({
			reference,
			userId,
			kind: "ppv",
			amountCents: ppv.finalPriceCents,
			contentId
		});
		if (sub?.paystackAuthorizationCode && (sub.status === "active" || sub.status === "trial")) {
			const tx = await chargeAuthorization({
				authorizationCode: sub.paystackAuthorizationCode,
				email: session.user.email,
				amountKobo: ppv.finalPriceCents,
				reference,
				metadata: {
					userId,
					contentId,
					type: "ppv"
				}
			});
			if (tx.status !== "success") throw new Error(`Charge failed with status: ${tx.status}`);
			await db.transaction(async (txDb) => {
				await txDb.insert(ppvPurchases).values({
					userId,
					contentId,
					amountPaidCents: ppv.finalPriceCents,
					paystackReference: reference
				});
				await txDb.update(paymentIntents).set({
					status: "consumed",
					consumedAt: /* @__PURE__ */ new Date()
				}).where(eq(paymentIntents.reference, reference));
			});
			return json({
				success: true,
				purchased: true,
				reference,
				priceCents: ppv.finalPriceCents,
				method: "saved_card"
			});
		}
		return json({
			authorizationUrl: (await initializeTransaction({
				email: session.user.email,
				amountKobo: ppv.finalPriceCents,
				reference,
				callbackUrl: `${private_env.PUBLIC_SITE_URL ?? "http://localhost:5173"}/api/ppv/complete`,
				metadata: {
					userId,
					contentId,
					type: "ppv"
				}
			})).authorization_url,
			reference,
			priceCents: ppv.finalPriceCents,
			method: "checkout"
		});
	} catch (err) {
		console.error("PPV purchase error:", err);
		await db.update(paymentIntents).set({ status: "expired" }).where(eq(paymentIntents.reference, reference)).catch(() => {});
		return json({ error: "Payment failed. Please try again." }, { status: 500 });
	}
};
//#endregion
export { POST };
