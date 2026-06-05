import { w as db, m as contentPricing, Y as ppvContent } from './drizzle-CKUH7ukq.js';
import { f as fingerprintFromHeaders } from './ua-country-BNOH1xSS.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq, inArray } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/lib/server/pricing.ts
async function resolvePrice(contentId, viewerCountry) {
	const regionPriority = viewerCountry ? [viewerCountry.toUpperCase(), "*"] : ["*"];
	const rows = await db.select({
		regionCode: contentPricing.regionCode,
		priceCents: contentPricing.priceCents,
		currency: contentPricing.currency
	}).from(contentPricing).where(and(eq(contentPricing.contentId, contentId), inArray(contentPricing.regionCode, regionPriority)));
	const byRegion = new Map(rows.map((r) => [r.regionCode, r]));
	const exact = viewerCountry ? byRegion.get(viewerCountry.toUpperCase()) : void 0;
	if (exact) return {
		priceCents: exact.priceCents,
		currency: exact.currency,
		source: "region"
	};
	const fallbackRow = byRegion.get("*");
	if (fallbackRow) return {
		priceCents: fallbackRow.priceCents,
		currency: fallbackRow.currency,
		source: "default"
	};
	const [ppv] = await db.select({
		priceCents: ppvContent.finalPriceCents,
		currency: ppvContent.currency
	}).from(ppvContent).where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true))).limit(1);
	if (ppv?.priceCents != null && ppv.priceCents > 0) return {
		priceCents: ppv.priceCents,
		currency: (ppv.currency ?? "USD").toUpperCase(),
		source: "ppv"
	};
	return null;
}
//#endregion
//#region src/lib/server/currency.ts
/**
* Currency conversion + display helpers.
*
* Two responsibilities:
*   1. Server-side conversion using a static USD-anchored rate table. The
*      rates are refreshed manually (or by a future cron pulling from
*      ECB / Open Exchange Rates) — this isn't a foreign-exchange engine,
*      it just lets us show users a reasonable estimate in their currency
*      when the creator only set a USD price.
*   2. Country → preferred currency mapping so the watch page can show
*      `$9.99 USD ≈ ₦14,500` for a Nigerian viewer of a $9.99 PPV title.
*
* Rates last updated: 2026-05-31. Off-by-a-few-percent is fine for display;
* actual charge happens through Stripe/Paystack in the listed currency.
*/
var USD_RATES = {
	USD: 1,
	EUR: .92,
	GBP: .79,
	CAD: 1.36,
	AUD: 1.52,
	NZD: 1.65,
	JPY: 156.2,
	CNY: 7.24,
	HKD: 7.83,
	SGD: 1.35,
	INR: 83.5,
	KRW: 1370,
	MXN: 17,
	BRL: 5.05,
	ARS: 880,
	CLP: 950,
	COP: 4e3,
	ZAR: 18.9,
	NGN: 1450,
	KES: 130,
	GHS: 15.2,
	UGX: 3700,
	TZS: 2580,
	EGP: 48,
	MAD: 10.1,
	AED: 3.67,
	SAR: 3.75,
	TRY: 32.5,
	ILS: 3.69,
	PHP: 58,
	THB: 36.5,
	MYR: 4.7,
	IDR: 16100,
	VND: 25200,
	RUB: 92,
	UAH: 40,
	PLN: 4,
	CZK: 23.1,
	HUF: 360,
	RON: 4.6,
	SEK: 10.5,
	NOK: 10.7,
	DKK: 6.9,
	CHF: .91
};
var COUNTRY_TO_CURRENCY = {
	US: "USD",
	CA: "CAD",
	MX: "MXN",
	BR: "BRL",
	AR: "ARS",
	CL: "CLP",
	CO: "COP",
	GB: "GBP",
	IE: "EUR",
	DE: "EUR",
	FR: "EUR",
	ES: "EUR",
	IT: "EUR",
	PT: "EUR",
	NL: "EUR",
	BE: "EUR",
	LU: "EUR",
	AT: "EUR",
	GR: "EUR",
	FI: "EUR",
	CY: "EUR",
	SE: "SEK",
	NO: "NOK",
	DK: "DKK",
	CH: "CHF",
	PL: "PLN",
	CZ: "CZK",
	HU: "HUF",
	RO: "RON",
	RU: "RUB",
	UA: "UAH",
	TR: "TRY",
	JP: "JPY",
	CN: "CNY",
	HK: "HKD",
	SG: "SGD",
	KR: "KRW",
	IN: "INR",
	PK: "INR",
	BD: "INR",
	PH: "PHP",
	TH: "THB",
	MY: "MYR",
	ID: "IDR",
	VN: "VND",
	AU: "AUD",
	NZ: "NZD",
	NG: "NGN",
	KE: "KES",
	GH: "GHS",
	UG: "UGX",
	TZ: "TZS",
	ZA: "ZAR",
	EG: "EGP",
	MA: "MAD",
	AE: "AED",
	SA: "SAR",
	IL: "ILS"
};
/**
* Convert an amount between two currencies. Returns null when either
* currency is unknown — caller should fall back to the original amount.
*/
function convertCents(amountCents, fromCurrency, toCurrency) {
	if (!amountCents || amountCents <= 0) return 0;
	const from = fromCurrency.toUpperCase();
	const to = toCurrency.toUpperCase();
	if (from === to) return amountCents;
	const fromRate = USD_RATES[from];
	const toRate = USD_RATES[to];
	if (fromRate === void 0 || toRate === void 0) return null;
	const usd = amountCents / fromRate;
	return Math.round(usd * toRate);
}
function currencyForCountry(country) {
	if (!country) return "USD";
	return COUNTRY_TO_CURRENCY[country.toUpperCase()] ?? "USD";
}
/**
* Locale-aware money string. Uses Intl.NumberFormat for symbol + grouping.
* Falls back to a plain `<currency> <amount>` string if Intl rejects the
* code (very rare; the rate table is the canonical allow-list).
*/
function formatMoney(amountCents, currency, locale = "en-US") {
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: currency.toUpperCase(),
			maximumFractionDigits: 2
		}).format(amountCents / 100);
	} catch {
		return `${currency.toUpperCase()} ${(amountCents / 100).toFixed(2)}`;
	}
}
//#endregion
//#region src/routes/api/content/[id]/price/+server.ts
/**
* GET /api/content/[id]/price
*
* Public. Returns the price the viewer should see. Three layers:
*   1. `price`           — the canonical price + currency the creator set.
*   2. `display`         — that same price formatted with locale-aware
*                          Intl rules so the watch page can render directly.
*   3. `localized`       — when the viewer's country implies a different
*                          preferred currency, we convert the canonical
*                          price using the static rate table and ALSO
*                          return a formatted string for the viewer's
*                          currency. UI typically shows
*                          "$9.99 USD ≈ ₦14,500" or similar.
*
* Acceptable Accept-Language headers drive the locale used for formatting.
*/
var GET = async ({ params, request, url }) => {
	const { country } = fingerprintFromHeaders(request.headers);
	const price = await resolvePrice(params.id, country);
	if (!price) return json({ ppv: false });
	const localeOverride = url.searchParams.get("locale");
	const acceptLang = request.headers.get("accept-language")?.split(",")[0]?.trim();
	const locale = localeOverride || acceptLang || "en-US";
	const display = formatMoney(price.priceCents, price.currency, locale);
	let localized = null;
	const viewerCurrency = currencyForCountry(country);
	if (viewerCurrency && viewerCurrency !== price.currency) {
		const converted = convertCents(price.priceCents, price.currency, viewerCurrency);
		if (converted !== null) localized = {
			currency: viewerCurrency,
			cents: converted,
			display: formatMoney(converted, viewerCurrency, locale)
		};
	}
	return json({
		ppv: true,
		priceCents: price.priceCents,
		currency: price.currency,
		region: country,
		source: price.source,
		display,
		localized
	});
};

export { GET };
//# sourceMappingURL=_server.ts-CRzXhnGY.js.map
