import { json, type RequestHandler } from '@sveltejs/kit';
import { resolvePrice } from '$lib/server/pricing';
import { fingerprintFromHeaders } from '$lib/server/ua-country';
import { convertCents, currencyForCountry, formatMoney } from '$lib/server/currency';

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

export const GET: RequestHandler = async ({ params, request, url }) => {
	const { country } = fingerprintFromHeaders(request.headers);
	const price = await resolvePrice(params.id!, country);
	if (!price) return json({ ppv: false });

	// Locale for Intl formatting. Caller can override with ?locale=.
	const localeOverride = url.searchParams.get('locale');
	const acceptLang = request.headers.get('accept-language')?.split(',')[0]?.trim();
	const locale = localeOverride || acceptLang || 'en-US';

	const display = formatMoney(price.priceCents, price.currency, locale);

	let localized: { currency: string; cents: number; display: string } | null = null;
	const viewerCurrency = currencyForCountry(country);
	if (viewerCurrency && viewerCurrency !== price.currency) {
		const converted = convertCents(price.priceCents, price.currency, viewerCurrency);
		if (converted !== null) {
			localized = {
				currency: viewerCurrency,
				cents: converted,
				display: formatMoney(converted, viewerCurrency, locale)
			};
		}
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
