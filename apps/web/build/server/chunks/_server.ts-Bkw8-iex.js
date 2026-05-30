import { p as private_env } from './shared-server-DUDL94jl.js';
import { n as db, L as ppvContent, M as ppvPurchases, I as paystackSubscriptions, G as paymentIntents } from './drizzle-BjmsPAPl.js';
import { c as chargeAuthorization, i as initializeTransaction } from './paystack-qQiFeBwj.js';
import { j as json } from './index-5kYmxIr9.js';
import { and, eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

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

export { POST };
//# sourceMappingURL=_server.ts-Bkw8-iex.js.map
