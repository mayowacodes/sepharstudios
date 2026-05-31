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

// Rates expressed as: 1 USD = X <currency>
const USD_RATES: Record<string, number> = {
	USD: 1,
	EUR: 0.92,
	GBP: 0.79,
	CAD: 1.36,
	AUD: 1.52,
	NZD: 1.65,
	JPY: 156.2,
	CNY: 7.24,
	HKD: 7.83,
	SGD: 1.35,
	INR: 83.5,
	KRW: 1370,
	MXN: 17.0,
	BRL: 5.05,
	ARS: 880,
	CLP: 950,
	COP: 4000,
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
	PLN: 4.0,
	CZK: 23.1,
	HUF: 360,
	RON: 4.6,
	SEK: 10.5,
	NOK: 10.7,
	DKK: 6.9,
	CHF: 0.91
};

// ISO 3166-1 alpha-2 → preferred currency. Anything not listed defaults to USD.
const COUNTRY_TO_CURRENCY: Record<string, string> = {
	US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP',
	GB: 'GBP', IE: 'EUR', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', PT: 'EUR',
	NL: 'EUR', BE: 'EUR', LU: 'EUR', AT: 'EUR', GR: 'EUR', FI: 'EUR', CY: 'EUR',
	SE: 'SEK', NO: 'NOK', DK: 'DKK', CH: 'CHF', PL: 'PLN', CZ: 'CZK', HU: 'HUF',
	RO: 'RON',
	RU: 'RUB', UA: 'UAH', TR: 'TRY',
	JP: 'JPY', CN: 'CNY', HK: 'HKD', SG: 'SGD', KR: 'KRW',
	IN: 'INR', PK: 'INR', BD: 'INR',
	PH: 'PHP', TH: 'THB', MY: 'MYR', ID: 'IDR', VN: 'VND',
	AU: 'AUD', NZ: 'NZD',
	NG: 'NGN', KE: 'KES', GH: 'GHS', UG: 'UGX', TZ: 'TZS', ZA: 'ZAR',
	EG: 'EGP', MA: 'MAD',
	AE: 'AED', SA: 'SAR', IL: 'ILS'
};

/**
 * Convert an amount between two currencies. Returns null when either
 * currency is unknown — caller should fall back to the original amount.
 */
export function convertCents(
	amountCents: number,
	fromCurrency: string,
	toCurrency: string
): number | null {
	if (!amountCents || amountCents <= 0) return 0;
	const from = fromCurrency.toUpperCase();
	const to = toCurrency.toUpperCase();
	if (from === to) return amountCents;
	const fromRate = USD_RATES[from];
	const toRate = USD_RATES[to];
	if (fromRate === undefined || toRate === undefined) return null;
	const usd = amountCents / fromRate;
	return Math.round(usd * toRate);
}

export function currencyForCountry(country: string | null): string {
	if (!country) return 'USD';
	return COUNTRY_TO_CURRENCY[country.toUpperCase()] ?? 'USD';
}

/**
 * Locale-aware money string. Uses Intl.NumberFormat for symbol + grouping.
 * Falls back to a plain `<currency> <amount>` string if Intl rejects the
 * code (very rare; the rate table is the canonical allow-list).
 */
export function formatMoney(amountCents: number, currency: string, locale = 'en-US'): string {
	try {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency.toUpperCase(),
			maximumFractionDigits: 2
		}).format(amountCents / 100);
	} catch {
		return `${currency.toUpperCase()} ${(amountCents / 100).toFixed(2)}`;
	}
}
