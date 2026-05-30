import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

/**
 * PUT /api/creator/payment-preferences
 *
 * Stores the creator's preferred payout split (fiat / USDC / STC). Persists
 * inside the `creators.preferences` JSONB column under the `payment` key.
 *
 * Body: { preference: 'fiat'|'usdc'|'stc'|'mixed', fiatPct, usdcPct, stcPct }
 *
 * Validation: percentages must sum to 100. The payout worker (forthcoming)
 * will read these to decide how to split each payout.
 */

const VALID_PREFERENCES = new Set(['fiat', 'usdc', 'stc', 'mixed']);

export const PUT: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json() as {
		preference?: string;
		fiatPct?: number;
		usdcPct?: number;
		stcPct?: number;
	};

	if (!body.preference || !VALID_PREFERENCES.has(body.preference)) {
		return json({ error: 'preference must be one of: fiat, usdc, stc, mixed' }, { status: 400 });
	}

	const fiatPct = Number(body.fiatPct ?? 0);
	const usdcPct = Number(body.usdcPct ?? 0);
	const stcPct = Number(body.stcPct ?? 0);
	const total = fiatPct + usdcPct + stcPct;

	if (Math.abs(total - 100) > 0.1) {
		return json({ error: 'Percentages must sum to 100' }, { status: 400 });
	}
	if (fiatPct < 0 || usdcPct < 0 || stcPct < 0) {
		return json({ error: 'Percentages cannot be negative' }, { status: 400 });
	}

	const [creator] = await db.select()
		.from(creators)
		.where(eq(creators.userId, session.user.id))
		.limit(1);

	if (!creator) return json({ error: 'Not a creator' }, { status: 403 });

	const existing = (creator.preferences ?? {}) as Record<string, unknown>;
	const updated = {
		...existing,
		payment: {
			preference: body.preference,
			fiatPct,
			usdcPct,
			stcPct,
			updatedAt: new Date().toISOString()
		}
	};

	await db.update(creators)
		.set({ preferences: updated as unknown as Record<string, boolean>, updatedAt: new Date() })
		.where(eq(creators.id, creator.id));

	return json({ success: true, paymentPreference: updated.payment });
};
