import { w as db, u as creators } from './drizzle-CKUH7ukq.js';
import { R as Role, S as SiteMeta } from './constants-BEpeHz1K.js';
import { i as isStripeConfigured, g as getStripe } from './stripe2-CDDbjsFl.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import 'stripe';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/payouts/stripe/onboard/+server.ts
/**
* POST /api/creator/payouts/stripe/onboard
*
* Creates a Stripe Connect Express account if the creator doesn't have one
* yet, then returns a fresh AccountLink URL the client redirects to.
*
* Body: { country?: string }  (ISO 3166-1 alpha-2, defaults to 'US')
*
* AccountLink URLs are single-use and expire in 5 minutes — the client
* calls this endpoint each time it needs to redirect.
*/
var VALID_COUNTRIES = new Set([
	"US",
	"GB",
	"CA",
	"AU",
	"NZ",
	"DE",
	"FR",
	"IT",
	"ES",
	"NL",
	"BE",
	"IE",
	"AT",
	"CH",
	"SE",
	"NO",
	"DK",
	"FI",
	"PT",
	"JP",
	"SG",
	"HK"
]);
var POST = async ({ locals, request, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	if (!isStripeConfigured()) return json({ error: "Stripe is not configured on this deployment" }, { status: 503 });
	const country = ((await request.json().catch(() => ({}))).country ?? "US").toUpperCase();
	if (!VALID_COUNTRIES.has(country)) return json({ error: "Country not supported for Stripe Connect" }, { status: 400 });
	const [creator] = await db.select().from(creators).where(eq(creators.userId, session.user.id)).limit(1);
	if (!creator) return json({ error: "Creator profile not found" }, { status: 404 });
	const stripe = getStripe();
	let accountId = creator.stripeAccountId;
	if (!accountId) {
		accountId = (await stripe.accounts.create({
			type: "express",
			country,
			email: creator.contactEmail ?? session.user.email,
			capabilities: {
				transfers: { requested: true },
				card_payments: { requested: true }
			},
			business_type: creator.creatorType === "organization" ? "company" : "individual",
			metadata: { creatorId: creator.id }
		})).id;
		await db.update(creators).set({
			stripeAccountId: accountId,
			stripeAccountStatus: "pending",
			stripeCountry: country,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(creators.id, creator.id));
	}
	const origin = url.origin || SiteMeta.link;
	return json({ url: (await stripe.accountLinks.create({
		account: accountId,
		refresh_url: `${origin}/creator/earnings?stripe=refresh`,
		return_url: `${origin}/creator/earnings?stripe=complete`,
		type: "account_onboarding"
	})).url });
};

export { POST };
//# sourceMappingURL=_server.ts-Bawv41Wi.js.map
