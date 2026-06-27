// Creator earnings — the one place to tune the curve.
//
// Formula:
//   earningCents = BASE_CENTS_PER_COMPLETION
//                × completionPercent (0..1)
//                × ENGAGEMENT_MULTIPLIER[engagementQuality]
//
// Reference (at BASE=2, completion=1.0):
//   - high     2 × 1.0 × 2.0 = 4¢/view     → 750 views = $30
//   - medium   2 × 1.0 × 1.3 = 2.6¢/view  → ~1,154 views = $30
//   - low      2 × 1.0 × 1.0 = 2¢/view    → 1,500 views = $30
//   - suspicious 0¢ (not paid)

export const BASE_CENTS_PER_COMPLETION = 2;

// Keyed off `engagementQuality` returned by `scoreWatchEngagement`
// (lib/server/ai-token-scoring.ts). 'suspicious' pays nothing — we don't
// reward the creator when our anti-fraud heuristic flags the viewer.
export const ENGAGEMENT_MULTIPLIER: Record<string, number> = {
	high: 2.0,
	medium: 1.3,
	low: 1.0,
	suspicious: 0
};

export type EngagementQuality = 'high' | 'medium' | 'low' | 'suspicious';

export interface ComputeCreatorEarningInput {
	completionPercent: number; // 0..100 (matches `mediaWatchProgress.completionPercent`)
	engagementQuality: EngagementQuality | null | undefined;
}

export interface CreatorEarningResult {
	amountCents: number;
	engagementMultiplier: number;
}

// Pure function — no DB, no IO. Easy to test + reason about.
export function computeCreatorEarning(input: ComputeCreatorEarningInput): CreatorEarningResult {
	const quality = input.engagementQuality ?? 'low';
	const multiplier = ENGAGEMENT_MULTIPLIER[quality] ?? 1.0;
	const completion = Math.max(0, Math.min(1, input.completionPercent / 100));
	const rawCents = BASE_CENTS_PER_COMPLETION * completion * multiplier;
	// Round to whole cents — we don't store fractional currency.
	return {
		amountCents: Math.round(rawCents),
		engagementMultiplier: multiplier
	};
}
